"use client";

import { api } from '@/app/lib/helpers/api';
import { Button } from '@/components/ui/button'
import { DialogHeader } from '@/components/ui/dialog';
import { FormField, Form, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Chapter } from '@prisma/client';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { DialogDescription } from '@radix-ui/react-dialog';

type VocabularyFormValues = {
    term: string;
    translation: string;
    chapterId: string;
}

function VocabularyForm() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await api.get('/chapters', {
                    cacheTags: ['chapters'],
                    cacheTtl: 600,
                });
                setChapters(response.data);
            } catch (error) {
                console.error('Error fetching chapters:', error);
            }
        };
        fetchChapters();
    }, []);

    const form = useForm<VocabularyFormValues>({
        defaultValues: {
            term: '',
            translation: '',
            chapterId: '',
        }
    });

    const onSubmit = async (data: VocabularyFormValues) => {
        try {
            const response = await api.post('/api/vocabulary', data);
            if (response.status === 201) {
                form.reset();
                api.invalidateTag('vocabulary');
                alert('Vocabulary created successfully!');
            } else {
                alert('Failed to create vocabulary.');
            }
        } catch (error) {
            console.error('Error creating vocabulary:', error);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Vocabulary</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Vocabulary</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-6">
                            <FormField
                                control={form.control}
                                name="term"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Term</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Term" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="translation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Translation</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Translation" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="chapterId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chapter</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Chapter" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {chapters.map((chapter) => (
                                                        <SelectItem key={chapter.id} value={chapter.id}>
                                                            {chapter.slug}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                            >
                                Save Vocab
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>

    )
}

export default VocabularyForm
