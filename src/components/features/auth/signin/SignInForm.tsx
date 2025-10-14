"use client";

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signInSchema } from '@/lib/definitions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormItem, FormLabel, Form, FormMessage } from '@/components/ui/form';
import { authenticate, FormData } from '@/lib/actions';
import { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';



const SignInForm = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const form = useForm<FormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = async (data: FormData) => {
        startTransition(async () => {
            try {
                const result = await authenticate(data);
                if (result.error) {
                    setError(result.error);
                    return;
                }
                setError(null);
                router.refresh();
            } catch {
                setError("Login failed. Please check your credentials and try again.");
            }

        })
    }


    return (
        <Card className="w-md">
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl >
                                        <Input
                                            {...field}
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >

                        </FormField>
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="password"
                                            type="password"
                                            autoComplete="current-password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >

                        </FormField>
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </Form>

            </CardContent>
        </Card>
    )
}

export default SignInForm

