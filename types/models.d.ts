import type { Vocabulary, Chapter } from "@prisma/client";

export type VocabResponse = Vocabulary & {
    chapter: Pick<Chapter, "id" | "slug">;
};
