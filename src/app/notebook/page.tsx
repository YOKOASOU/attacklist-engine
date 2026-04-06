import { NoteEditor } from "@/components/notebook/NoteEditor";
import { NoteList } from "@/components/notebook/NoteList";
import { learningNotes } from "@/lib/dummy-data";

export default function NotebookPage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
      <NoteEditor />
      <NoteList notes={learningNotes} />
    </div>
  );
}
