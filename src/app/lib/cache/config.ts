export const CACHE_CONFIG = {
    vocabulary: {
        tag: 'vocabulary',
        revalidate: 120,
        maxAge: 120,
        staleWhileRevalidate: 300,
    },
    chapters: {
        tag: 'chapters',
        revalidate: 600,
        maxAge: 600,
        staleWhileRevalidate: 1800,
    },
    grammar: {
        tag: 'grammar',
        revalidate: 600,
        maxAge: 600,
        staleWhileRevalidate: 1800,
    },
} as const;

export type CacheResource = keyof typeof CACHE_CONFIG;

export type CacheKeyPart = string | number | boolean | null | undefined;

export type CacheControlOptions = {
    maxAge?: number;
    staleWhileRevalidate?: number;
};

