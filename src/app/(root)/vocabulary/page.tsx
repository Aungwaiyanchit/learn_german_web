"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Chapter, Vocabulary } from "@prisma/client";
import VocabularyList from "@/components/features/vocabulary/VocabularyList";
import ViewModeToggle from "@/components/shared/viewmode-toggle";


export default function VocabApp() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [selected, setSelected] = useState<string>("");
    const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadChapters() {
            const res = await fetch("/api/chapters");
            const data = await res.json();
            setChapters(data);
            if (data.length > 0) {
                setSelected(data[0].title);
            }
            setLoading(false);
        }
        loadChapters();
    }, []);

    // Load vocab when chapter changes
    useEffect(() => {
        if (!selected) return;
        async function loadVocab() {
            const res = await fetch(`/api/vocabulary/${encodeURIComponent(selected)}`);
            const data = await res.json();
            setVocabs(data);
        }
        loadVocab();
    }, [selected]);

    if (loading) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">📖 German Vocabulary</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">📖 German Vocabulary</h1>

            <Tabs defaultValue={chapters[0]?.id} onValueChange={setSelected}>
                <TabsList className="flex flex-wrap gap-2 mb-6">
                    {chapters.map((chapter) => (
                        <TabsTrigger key={chapter.id} value={chapter.id}>
                            {chapter.slug}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {chapters.map((chapter) => (
                    <TabsContent key={chapter.id} value={chapter.id} >
                        {/* Search Bar */}
                        <div className="mb-4 flex gap-2 items-center">
                            <Input
                                placeholder="🔍 Search vocabulary..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <ViewModeToggle />
                        </div>

                        {/* Vocab Grid */}
                        <section className="w-full">
                            <VocabularyList vocabs={vocabs} search={search} />
                        </section>

                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
