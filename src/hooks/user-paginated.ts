import { useState, useEffect } from "react"

export function usePaginatedData<T>(
    fetchData: (page: number, pageSize: number) => Promise<{
        data: T[]
        total: number
    }>,
    pageSize = 10
) {
    const [data, setData] = useState<T[]>([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const res = await fetchData(page, pageSize)
                setData(res.data)
                setTotal(res.total)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [page, pageSize, fetchData])

    const pageCount = Math.ceil(total / pageSize)

    return {
        data,
        page,
        setPage,
        total,
        pageSize,
        pageCount,
        loading,
    }
}