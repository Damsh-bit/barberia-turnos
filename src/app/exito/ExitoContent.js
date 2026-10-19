"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function formatearFecha(fechaStr) {
  const [anio, mes, dia] = fechaStr.split("-");
  const fecha = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));
  return fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

export default function ExitoContent() {
  const searchParams = useSearchParams();

  const servicio = searchParams.get("servicio");
  const hora = searchParams.get("hora");
  const fecha = searchParams.get("fecha");
  const nombre = searchParams.get("nombre");

  if (!servicio || !hora || !fecha) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">
          Página inválida.{" "}
          <Link href="/" className="underline">Volvé al inicio</Link>
        </p>
      </main>
    );
  }

  const mensajeWsp = "Hola! Reserve un turno: " + servicio + " el " + formatearFecha(fecha) + " a las " + hora + ". Nombre: " + nombre;
  const urlWsp = "https://wa.me/?text=" + encodeURIComponent(mensajeWsp);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4">Turno confirmado</h1>

        {nombre && (
          <p className="text-zinc-400 mb-4">Gracias, {nombre}!</p>
        )}

        <p className="text-zinc-400 mb-2">Tu turno para:</p>
        <p className="text-xl font-bold mb-2">{servicio}</p>
        <p className="capitalize mb-1">Fecha: {formatearFecha(fecha)}</p>
        <p className="text-lg mb-8">Hora: {hora}</p>

        <div className="flex flex-col gap-3">
          <a
            href={urlWsp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white py-4 px-6 rounded-xl font-bold hover:scale-105 transition block"
          >
            Guardar en WhatsApp
          </a>
          <Link
            href="/"
            className="bg-white text-black py-4 px-6 rounded-xl font-bold hover:scale-105 transition block"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}