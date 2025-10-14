"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormField, Form, FormLabel, FormControl, FormItem } from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { api } from '@/app/lib/helpers/api';

type ChapterFormValues = {
    slug: string;
    title: string;
    description?: string;
    order: number;
    contentMd: string;
};

function ChapterForm() {
    const form = useForm<ChapterFormValues>({
        defaultValues: {
            slug: '',
            title: '',
            description: '',
            order: 0,
            contentMd: '',
        },
    });

    const onSubmit = async (data: ChapterFormValues) => {
        try {
            await api.post('/chapters', data);
            form.reset();
        } catch (error) {
            console.log(error);
            throw new Error('Failed to save chapter');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New Chapter</h2>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-6">
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="chapter-slug" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Chapter Title" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Description (optional)" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="order"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Order</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={0} {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contentMd"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content (Markdown)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Markdown content" rows={6} {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                        >
                            Save Chapter
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default ChapterForm;