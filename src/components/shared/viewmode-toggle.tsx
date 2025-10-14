"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "../ui/button";
import { useViewMode } from "@/context/view-mode-context";

export default function ViewModeToggle() {
  const { viewMode, setViewMode } = useViewMode();
  return (
    <section className="flex gap-2">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => setViewMode('grid')}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => setViewMode('list')}
      >
        <List className="h-4 w-4" />
      </Button>
    </section>
  )
}

