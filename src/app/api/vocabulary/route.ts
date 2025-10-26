import { prisma } from "@/app/lib/prisma";
import { PaginatedResponse } from "@/lib/utils";
import { protectRoute } from "@/lib/api-auth";
import { applyCacheHeaders, getCached, invalidateResource } from "@/app/lib/cache/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "20");
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const result = await getCached(
            "vocabulary",
            ["page", page, "size", pageSize],
            async () => {
                const [items, total] = await Promise.all([
                    prisma.vocabulary.findMany({
                        skip,
                        take,
                        include: {
                            chapter: {
                                select: {
                                    slug: true,
                                },
                            },
                        },
                    }),
                    prisma.vocabulary.count(),
                ]);

                return {
                    data: items,
                    total,
                    page,
                    pageSize,
                };
            },
        );
        const response = PaginatedResponse(result);
        return applyCacheHeaders(response, "vocabulary");
    } catch (error) {
        return new Response("Failed to fetch vocabulary" + error, { status: 500 });
    }
}

export async function POST(req: Request) {
    const authError = await protectRoute(req);
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
        invalidateResource("vocabulary");
        return new Response(JSON.stringify(vocabularyItem), { status: 201 });
    } catch {
        return new Response("Failed to create vocabulary item", { status: 500 });
    }
}
