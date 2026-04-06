import { PersonaCard } from "@/components/persona/PersonaCard";
import { PersonaForm } from "@/components/persona/PersonaForm";
import { characters } from "@/lib/dummy-data";

export default function PersonaPage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 lg:gap-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold neon-text">登録済みペルソナ</h3>
        {characters.map((char) => (
          <PersonaCard key={char.id} character={char} />
        ))}
      </div>
      <PersonaForm />
    </div>
  );
}
