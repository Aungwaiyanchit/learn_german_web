import { prisma } from "@/app/lib/prisma";
import { PaginatedResponse } from "@/lib/utils";
import { protectRoute } from "@/lib/api-auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "20");
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const vocabulary = await prisma.vocabulary.findMany({
            skip,
            take,
            include: {
                chapter: {
                    select: {
                        slug: true
                    }
                }
            }
        });
        return PaginatedResponse({
            data: vocabulary,
            total: await prisma.vocabulary.count(),
            page,
            pageSize,
        });
    } catch (error) {
        return new Response("Failed to fetch vocabulary" + error, { status: 500 });
    }
}

export async function POST(req: Request) {
    const authError = await protectRoute(req as any);
    if (authError) return authError;
    try {
        const body = await req.json();
        const { term, translation, chapterId } = body;
        const vocabularyItem = await prisma.vocabulary.create({
            data: {
                term,
                translation,
                chapterId,
            }
        });
        return new Response(JSON.stringify(vocabularyItem), { status: 201 });
    } catch {
        return new Response("Failed to create vocabulary item", { status: 500 });
    }

}