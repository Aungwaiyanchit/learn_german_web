import { prisma } from "@/app/lib/prisma";

async function main() {
    //german
    const chapter = await prisma.chapter.create({
        data: {
            slug: "a1-greetings",
            title: "A1: Begrüßungen",
            order: 1,
            contentMd: "# Begrüßungen\n\n- Hallo\n- Guten Morgen",
        },
    });
}

main().finally(() => prisma.$disconnect());