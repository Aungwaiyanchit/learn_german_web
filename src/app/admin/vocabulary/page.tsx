import { columns } from '@/components/features/vocabulary/table/column'
import VocabularyForm from '@/components/features/vocabulary/VocabularyForm'
import DataTable from '@/components/shared/data-table'
import { fetchVocabulary } from '@/lib/actions'
import React from 'react'

const Page = async () => {
    return (
        <div className="m-2 w-full ">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Vocabulary</h1>
                <VocabularyForm />
            </div>
            <br />
            <DataTable columns={columns} fetchData={fetchVocabulary} pageSize={50} />
        </div>
    )
}

export default Page