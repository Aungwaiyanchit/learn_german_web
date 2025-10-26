import { Button } from "@/components/ui/button";
import ChapterList from "../../components/features/chapters/ChapterList";
import { api } from "../lib/helpers/api";
import { Chapter } from "../lib/models";
import Link from "next/link";

export default async function Page() {
    const { data: chapters }: { data: Chapter[] } = await api.get("/chapters");
    return (
        <div className="m-2">
            <Link href="admin/chapters/add">
                <Button >Add Chapter</Button>
            </Link>
            <ChapterList chapters={chapters} />
        </div>
    )
}
