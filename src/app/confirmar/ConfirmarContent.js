"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

function formatearFecha(fechaStr) {
  const [anio, mes, dia] = fechaStr.split("-");
  const fecha = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));
  return fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

export default function ConfirmarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const servicio = searchParams.get("servicio");
  const hora = searchParams.get("hora");
  const fecha = searchParams.get("fecha");

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  if (!servicio || !hora || !fecha) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">
          Turno inválido.{" "}
          <Link href="/" className="underline">Volvé al inicio</Link>
        </p>
      </main>
    );
  }

  async function handleConfirmar() {
    if (!nombre.trim() || !telefono.trim()) {
      setError("Completá tu nombre y WhatsApp para continuar.");
      return;
    }

    setCargando(true);
    setError("");

    try {
      const res = await fetch("/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, telefono, servicio, hora, fecha }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      router.push(
        "/exito?servicio=" + encodeURIComponent(servicio) +
        "&hora=" + encodeURIComponent(hora) +
        "&fecha=" + encodeURIComponent(fecha) +
        "&nombre=" + encodeURIComponent(nombre)
      );
    } catch (err) {
      setError("Algo salió mal. Intentá de nuevo.");
      console.error(err);
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold mb-4">Confirmar turno</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-6 w-full max-w-sm">
        <p className="mb-2">✂️ Servicio: <strong>{servicio}</strong></p>
        <p className="mb-2">📅 Fecha: <strong className="capitalize">{formatearFecha(fecha)}</strong></p>
        <p>🕐 Horario: <strong>{hora}</strong></p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-4 outline-none focus:border-white transition"
        />
        <input
          type="tel"
          placeholder="Tu WhatsApp"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-4 outline-none focus:border-white transition"
        />

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleConfirmar}
          disabled={cargando}
          className="bg-white text-black py-4 rounded-xl font-bold text-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {cargando ? "Confirmando..." : "Confirmar turno"}
        </button>
      </div>
    </main>
  );
}