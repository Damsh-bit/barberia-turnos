import Link from "next/link";

export const metadata = {
  title: "Barbería Premium | Reservá tu turno",
  description: "Reservá tu turno online en menos de 1 minuto.",
};

const servicios = [
  { slug: "corte-clasico", emoji: "✂️", label: "Corte clásico" },
  { slug: "corte-barba", emoji: "🧔", label: "Corte + barba" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-bold mb-4">Barbería Premium</h1>
      <p className="text-gray-400 text-center mb-8">
        Reservá tu turno en menos de 1 minuto
      </p>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {servicios.map((servicio) => (
          <Link
            key={servicio.slug}
            href={"/reservar/" + servicio.slug}
            className="bg-white text-black py-4 rounded-xl font-semibold text-lg hover:scale-105 transition text-center"
          >
            {servicio.emoji} {servicio.label}
          </Link>
        ))}
        <div className="bg-gray-700 text-white py-4 rounded-xl font-semibold text-lg text-center cursor-not-allowed opacity-60">
          🎨 Color (Próximamente)
        </div>
      </div>
    </main>
  );
}