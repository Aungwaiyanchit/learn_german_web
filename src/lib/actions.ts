'use server';

import { signIn } from '@/auth';
import { signInSchema } from './definitions';
import z from 'zod';
import { AuthError } from 'next-auth';
import { api } from '@/app/lib/helpers/api';
import { VocabResponse } from '../../types/models';

export type FormData = z.infer<typeof signInSchema>;

export async function fetchVocabulary(page: number, pageSize: number) {
    const res = await api.get(`/vocabulary?page=${page}&pageSize=${pageSize}`,)
    return res.data as Promise<{ data: VocabResponse[]; total: number }>
}

export async function authenticate(
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            redirect: false,
            callbackUrl: '/',
            email: formData.email,
            password: formData.password,
        });
        return { success: 'Login successfully' }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        error: 'Invalid credentials.',
                    };
                default:
                    return {
                        error: 'Something went wrong.',
                    };
            }
        }
        return {
            error: 'Something went wrong.',
        };
    }
}