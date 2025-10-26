import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { applyCacheHeaders, getCached } from "@/app/lib/cache/server";

interface Params {
    params: Promise<{ chapter: string }>;
}

export async function GET(req: Request, { params }: Params) {
    try {
        const resolvedParams = await params;
        const { chapter: chapterParam } = resolvedParams;

        const chapter = await getCached(
            "chapters",
            [chapterParam],
            async () => prisma.chapter.findFirst({
                where: {
                    OR: [
                        { id: chapterParam },
                        { title: chapterParam },
                    ],
                },
            }),
        );


        if (!chapter) {
            return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        }

        const vocab = await getCached(
            "vocabulary",
            ["chapter", chapter.id],
            async () => prisma.vocabulary.findMany({ where: { chapterId: chapter.id } }),
        );
        const response = NextResponse.json(vocab);
        return applyCacheHeaders(response, "vocabulary");
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch vocab" }, { status: 500 });
    }
}
