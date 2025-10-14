import { clsx, type ClassValue } from "clsx"
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge"

type TPaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
} 


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function PaginatedResponse<T>({ data, total, page, pageSize }: TPaginatedResponse<T>) {
    return NextResponse.json({
        data,
        total,
        page,
        pageSize,
    })
}


