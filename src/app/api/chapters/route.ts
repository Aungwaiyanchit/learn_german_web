import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";
import { protectRoute } from "@/lib/api-auth";


export async function POST(req: NextRequest) {
    const authError = await protectRoute(req);
    if (authError) return authError;
    const body = await req.json();
    try {
        const { slug, title, description, order } = body;
        const numberOrder = parseInt(order, 10);
        const chapter = await prisma.chapter.create({
            data: {
                slug,
                title,
                description,
                order: numberOrder,
            }
        });
        return new Response(JSON.stringify(chapter), { status: 201 });
    } catch (error) {
        console.log(error)
        return new Response("Failed to create chapter", { status: 500 });
    }
}

export async function GET() {
    try {
        const chapters = await prisma.chapter.findMany();
        return new Response(JSON.stringify(chapters), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response("Failed to fetch chapters" + error, { status: 500 });
    }
}
