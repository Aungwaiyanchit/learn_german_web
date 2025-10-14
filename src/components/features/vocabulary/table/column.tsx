"use client";

import { ColumnDef } from "@tanstack/react-table"
import { VocabResponse } from "../../../../../types/models";

export const columns: ColumnDef<VocabResponse>[] = [
    {
        accessorKey: "term",
        header: "Term",
    },
    {
        accessorKey: "translation",
        header: "Translation",
    },
    {
        accessorKey: "chapter",
        header: "Chapter",
        accessorFn: (row) => row.chapter?.slug ?? "—",
    }
];