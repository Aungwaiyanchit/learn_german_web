import { Card } from '@/components/ui/card'
import React from 'react'
import VocabPlayButton from './VocabPlayButton'
import { Vocabulary } from '@prisma/client'

function VocabularyListCard(props: Vocabulary) {
    return (
        <Card className="flex flex-row justify-between p-4 shadow-md hover:shadow-lg transition">
            {/* Left side: Term + Translation */}
            <div className="flex flex-col">
                <span className="text-lg font-semibold">{props.term}</span>
                <span className="text-gray-600 text-sm">{props.translation}</span>
            </div>

            {/* Right side: Play button */}
            <VocabPlayButton word={props.term} />
        </Card>
    )
}

export default VocabularyListCard