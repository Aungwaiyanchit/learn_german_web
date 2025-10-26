import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const DEFAULT_CACHE_TTL_SECONDS = 120;

type CacheEntry = {
    expiresAt: number;
    payload: {
        data: unknown;
        status: number;
        statusText: string;
        headers: Record<string, unknown>;
    };
    tags: Set<string>;
};

type CacheAwareConfig = AxiosRequestConfig & {
    __cacheKey?: string;
    __cacheHit?: boolean;
};

export type CacheInvalidateOptions = {
    key?: string;
    keys?: string[];
    tags?: string[];
    predicate?: (key: string) => boolean;
};

export interface CacheableAxiosInstance extends AxiosInstance {
    buildCacheKey(config: AxiosRequestConfig): string;
    invalidate(options?: CacheInvalidateOptions): void;
    invalidateTag(tag: string | string[]): void;
    clearCache(): void;
}

class ApiCache {
    private store = new Map<string, CacheEntry>();
    private tagIndex = new Map<string, Set<string>>();

    buildKey(config: AxiosRequestConfig) {
        if (config.cacheKey) return config.cacheKey;
        const method = (config.method ?? "get").toLowerCase();
        const baseURL = config.baseURL ?? "";
        const url = config.url ?? "";
        const paramsKey = serialize(config.params);
        return `${method}:${baseURL}${url}?${paramsKey}`;
    }

    resolveTtlMs(config: AxiosRequestConfig) {
        const ttlSeconds = config.cacheTtl ?? DEFAULT_CACHE_TTL_SECONDS;
        return Math.max(ttlSeconds, 0) * 1000;
    }

    get(key: string) {
        const entry = this.store.get(key);
        if (!entry) return undefined;
        if (entry.expiresAt <= Date.now()) {
            this.evictKey(key);
            return undefined;
        }
        return entry;
    }

    storeResponse(key: string, response: AxiosResponse, config: AxiosRequestConfig) {
        const clone = this.clonePayload(response);
        const tags = new Set((config.cacheTags ?? []).filter(Boolean));
        const expiresAt = Date.now() + this.resolveTtlMs(config);

        this.store.set(key, {
            expiresAt,
            payload: clone,
            tags,
        });

        if (tags.size > 0) {
            tags.forEach((tag) => {
                const bucket = this.tagIndex.get(tag) ?? new Set<string>();
                bucket.add(key);
                this.tagIndex.set(tag, bucket);
            });
        }
    }

    invalidate(options: CacheInvalidateOptions = {}) {
        const { key, keys, tags, predicate } = options;
        if (!key && !keys && !tags && !predicate) {
            this.clear();
            return;
        }

        if (key) {
            this.evictKey(key);
        }

        if (keys) {
            keys.forEach((k) => this.evictKey(k));
        }

        if (tags) {
            tags.forEach((tag) => this.invalidateTag(tag));
        }

        if (predicate) {
            Array.from(this.store.keys()).forEach((k) => {
                if (predicate(k)) {
                    this.evictKey(k);
                }
            });
        }
    }

    invalidateTag(tag: string) {
        const keys = this.tagIndex.get(tag);
        if (!keys) return;
        keys.forEach((key) => this.evictKey(key, false));
        this.tagIndex.delete(tag);
    }

    clear() {
        this.store.clear();
        this.tagIndex.clear();
    }

    createCachedResponse(key: string, config: AxiosRequestConfig) {
        const entry = this.get(key);
        if (!entry) return undefined;
        const { payload } = entry;
        return {
            data: cloneData(payload.data),
            status: payload.status,
            statusText: payload.statusText,
            headers: { ...payload.headers },
            config,
            request: undefined,
        } as AxiosResponse;
    }

    private clonePayload(response: AxiosResponse): CacheEntry["payload"] {
        return {
            data: cloneData(response.data),
            status: response.status,
            statusText: response.statusText,
            headers: cloneHeaders(response.headers),
        };
    }

    private evictKey(key: string, removeTagIndex = true) {
        const entry = this.store.get(key);
        if (!entry) return;
        if (removeTagIndex && entry.tags.size > 0) {
            entry.tags.forEach((tag) => {
                const bucket = this.tagIndex.get(tag);
                if (!bucket) return;
                bucket.delete(key);
                if (bucket.size === 0) {
                    this.tagIndex.delete(tag);
                } else {
                    this.tagIndex.set(tag, bucket);
                }
            });
        }
        this.store.delete(key);
    }
}

export function attachApiCache(instance: AxiosInstance) {
    const cache = new ApiCache();

    instance.interceptors.request.use((requestConfig) => {
        const config = requestConfig as CacheAwareConfig;
        const method = (config.method ?? "get").toLowerCase();
        if (method !== "get") return config;

        const shouldUseCache = config.cache ?? true;
        if (!shouldUseCache) return config;

        const key = cache.buildKey(config);
        const cachedResponse = cache.createCachedResponse(key, config);
        if (cachedResponse) {
            config.__cacheHit = true;
            config.adapter = async () => {
                cachedResponse.config = config;
                return cachedResponse;
            };
        } else {
            config.__cacheKey = key;
        }
        return config;
    });

    instance.interceptors.response.use((response) => {
        const config = response.config as CacheAwareConfig;
        const method = (config.method ?? "get").toLowerCase();
        const shouldUseCache = method === "get" && (config.cache ?? true);
        if (shouldUseCache && !config.__cacheHit && response.status >= 200 && response.status < 300) {
            const key = config.__cacheKey ?? cache.buildKey(config);
            cache.storeResponse(key, response, config);
        }
        return response;
    });

    const extended = instance as CacheableAxiosInstance;

    extended.buildCacheKey = (config: AxiosRequestConfig) => cache.buildKey(config);
    extended.invalidate = (options?: CacheInvalidateOptions) => cache.invalidate(options);
    extended.invalidateTag = (tag: string | string[]) => {
        const tags = Array.isArray(tag) ? tag : [tag];
        cache.invalidate({ tags });
    };
    extended.clearCache = () => cache.clear();

    return extended;
}

function serialize(value: unknown): string {
    if (value === null || value === undefined) return "";

    if (typeof value === "string") return value;

    if (value instanceof URLSearchParams) {
        return value.toString();
    }

    if (Array.isArray(value)) {
        return `[${value.map((item) => serialize(item)).join(",")}]`;
    }

    if (typeof value === "object") {
        const entries = Object.entries(value as Record<string, unknown>)
            .filter(([, v]) => v !== undefined)
            .sort(([a], [b]) => (a > b ? 1 : -1))
            .map(([k, v]) => `${k}:${serialize(v)}`);
        return `{${entries.join(",")}}`;
    }

    return String(value);
}

function cloneData<T>(data: T): T {
    if (data === null || typeof data !== "object") {
        return data;
    }
    if (typeof structuredClone === "function") {
        return structuredClone(data);
    }
    try {
        return JSON.parse(JSON.stringify(data));
    } catch {
        return data;
    }
}

function cloneHeaders(headers: AxiosResponse["headers"]) {
    if (!headers) return {};
    const maybeHeaders = headers as unknown as { toJSON?: () => Record<string, unknown> };
    if (maybeHeaders && typeof maybeHeaders.toJSON === "function") {
        return { ...maybeHeaders.toJSON() };
    }
    return { ...(headers as Record<string, unknown>) };
}

