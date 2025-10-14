import { Chapter } from '@/app/lib/models'
import React from 'react'

const ChapterList = ({ chapters }: { chapters: Chapter[] }) => {

    if (chapters.length === 0) {
        return <div>No chapters available.</div>
    }

    return (
        <div>
            {chapters.map(chapter => (
                <div key={chapter.id}>{chapter.title}</div>
            ))}
        </div>
    )
}

export default ChapterList