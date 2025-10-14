import { Home, BookOpen, FileText, Book, CaseLower, LucideIcon } from 'lucide-react'

export type RouteItem = {
    title: string
    url: string
    icon: LucideIcon
}

export const publicRoutes: RouteItem[] = [
    {
        title: "Alphabets",
        url: "/alphabet",
        icon: Home,
    },
    {
        title: "Chapters",
        url: "#",
        icon: BookOpen,
    },
    {
        title: "Vocabulary",
        url: "/vocabulary",
        icon: CaseLower,
    },
    {
        title: "Grammar",
        url: "#",
        icon: FileText,
    },
    {
        title: "Dictionary",
        url: "#",
        icon: Book,
    },
];

export const adminRoutes: RouteItem[] = [
    {
        title: "Chapters",
        url: "/admin",
        icon: BookOpen,
    },
    {
        title: "Vocabulary",
        url: "/admin/vocabulary",
        icon: CaseLower,
    },
]
