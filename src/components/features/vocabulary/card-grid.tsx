'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Vocabulary } from '@prisma/client'
import VocabPlayButton from './VocabPlayButton'

function VocabularyCard(props: Vocabulary) {
    return (
        <Card className="shadow-md hover:shadow-lg transition min-w-[200px]">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span className="text-xl">{props.term}</span>
                    <VocabPlayButton word={props.term} />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600">{props.translation}</p>
            </CardContent>
        </Card>
    )
}

export default VocabularyCard