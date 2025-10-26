import "axios";

declare module "axios" {
    interface AxiosRequestConfig {
        cache?: boolean;
        cacheTtl?: number;
        cacheKey?: string;
        cacheTags?: string[];
    }

    interface AxiosInstance {
        buildCacheKey(config: AxiosRequestConfig): string;
        invalidate(options?: import("@/app/lib/helpers/api-cache").CacheInvalidateOptions): void;
        invalidateTag(tag: string | string[]): void;
        clearCache(): void;
    }
}

