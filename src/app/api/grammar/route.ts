import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";
import { protectRoute } from "@/lib/api-auth";
import { applyCacheHeaders, getCached, invalidateResource } from "@/app/lib/cache/server";


export async function POST(req: NextRequest) {
    const authError = await protectRoute(req);
    if (authError) return authError;
    const body = await req.json();
    try {
        const { title, markdownContent } = body;
        const grammar = await prisma.grammar.create({
            data: {
                title,
                markdownContent
            }
        });
        invalidateResource("grammar");
        return new Response(JSON.stringify(grammar), { status: 201 });
    } catch (error) {
        console.log(error)
        return new Response("Failed to create grammar", { status: 500 });
    }
}

export async function GET() {
    try {
        const grammars = await getCached("grammar", ["list"], async () => prisma.grammar.findMany());
        const response = new Response(JSON.stringify(grammars), { status: 200 });
        return applyCacheHeaders(response, "grammar");
    } catch (error) {
        return new Response("Failed to fetch grammar" + error, { status: 500 });
    }
}
