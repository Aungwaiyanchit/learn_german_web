import { useViewMode } from '@/context/view-mode-context';
import VocabularyCard from './card-grid';
import { Vocabulary } from '@prisma/client';
import VocabularyListCard from './card-list';

export default function VocabularyList(props: { vocabs: Vocabulary[], search: string }) {
    const { vocabs, search } = props;
    const { viewMode } = useViewMode();

    const filteredVocabs = vocabs.filter(vocab =>
        vocab.term.toLowerCase().includes(search.toLowerCase()) ||
        vocab.translation.toLowerCase().includes(search.toLowerCase())
    );

    if (filteredVocabs.length === 0) {
        return <p>No vocabulary found for this chapter.</p>;
    }

    return viewMode === "grid" ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredVocabs.map((vocab: Vocabulary) => (
                <VocabularyCard key={vocab.id} {...vocab} />
            ))}
        </div>
    ) : (
        <div className='flex flex-col gap-2'>
            {filteredVocabs.map((vocab: Vocabulary) => (
                <VocabularyListCard key={vocab.id} {...vocab} />
            ))}
        </div>
    )


}

