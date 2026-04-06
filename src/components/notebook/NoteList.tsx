import { GlassCard } from "@/components/ui/GlassCard";
import { LearningNote } from "@/lib/types";
import { BookOpen, Tag } from "lucide-react";

interface NoteListProps {
  notes: LearningNote[];
}

export function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <GlassCard hover={false}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="w-12 h-12 text-foreground/15 mb-4" />
          <p className="text-foreground/40 text-sm">メモはまだありません</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard hover={false}>
      <h3 className="text-lg font-bold neon-text mb-6">保存済みメモ</h3>
      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-5 rounded-2xl bg-white/[0.02] border border-glass-border hover:bg-white/[0.05] hover:border-neon-purple/15 transition-all"
          >
            <h4 className="text-sm font-semibold text-foreground/85 mb-2">{note.title}</h4>
            <p className="text-sm text-foreground/55 leading-relaxed">{note.content}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Tag className="w-3 h-3 text-foreground/30" />
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple/70 border border-neon-purple/15"
                >
                  {tag}
                </span>
              ))}
              <span className="text-[10px] text-foreground/25 ml-auto">
                {new Date(note.updatedAt).toLocaleDateString("ja-JP")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
