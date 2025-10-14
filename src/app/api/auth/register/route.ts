import { prisma } from '@/app/lib/prisma';
import { hash } from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

interface RegisterRequestBody {
    email: string;
    password: string;
    username?: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: RegisterRequestBody = await req.json();

        if (!body.email || !body.password) {
            return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
        }

        const hashedPassword = await hash(body.password, 10);

        await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                username: body.username || body.email.split('@')[0],
            },
        });

        return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
    } catch  {
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}