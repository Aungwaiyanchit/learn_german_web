import { unstable_cache, revalidateTag } from 'next/cache';
import type { CacheKeyPart, CacheResource, CacheControlOptions } from './config';
import { CACHE_CONFIG } from './config';

type CacheOptions = {
    revalidate?: number;
    tags?: string[];
};

type CachedFetcher<T> = () => Promise<T>;

const DEFAULT_REVALIDATE = 300;

export function buildCacheKey(resource: CacheResource, keyParts: CacheKeyPart[] = []) {
    const key = [resource, ...keyParts]
        .filter((part) => part !== undefined && part !== null)
        .map((part) => (typeof part === 'string' ? part : String(part)));
    return key.length > 0 ? key : [resource];
}

export async function getCached<T>(
    resource: CacheResource,
    keyParts: CacheKeyPart[],
    fetcher: CachedFetcher<T>,
    options: CacheOptions = {},
) {
    const config = CACHE_CONFIG[resource];
    const key = buildCacheKey(resource, keyParts);
    const tags = options.tags ?? [config.tag];
    const revalidate = options.revalidate ?? config?.revalidate ?? DEFAULT_REVALIDATE;
    const cachedFetcher = unstable_cache(fetcher, key, { tags, revalidate });
    return cachedFetcher();
}

export function invalidateResource(resource: CacheResource) {
    revalidateTag(CACHE_CONFIG[resource].tag);
}

export function applyCacheHeaders(
    response: Response,
    resource: CacheResource,
    overrides: CacheControlOptions = {},
) {
    const config = CACHE_CONFIG[resource];
    const maxAge = overrides.maxAge ?? config.maxAge;
    const staleWhileRevalidate = overrides.staleWhileRevalidate ?? config.staleWhileRevalidate;
    response.headers.set(
        'Cache-Control',
        `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    );
    return response;
}

export function invalidateByTag(tag: string) {
    revalidateTag(tag);
}

