import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
    params: { chapter: string };
}

export async function GET(req: Request, { params }: Params) {
    try {
        const { chapter: chapterParam } = await params;

        const chapter = await prisma.chapter.findFirst({
            where: {
                OR: [
                    { id: chapterParam },
                    { title: chapterParam },
                ],
            },
        });

        if (!chapter) {
            return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        }

        const vocab = await prisma.vocabulary.findMany({
            where: { chapterId: chapter.id },
        });
        return NextResponse.json(vocab);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch vocab" }, { status: 500 });
    }
}
