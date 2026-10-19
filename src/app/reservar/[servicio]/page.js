"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export const dynamic = "force-dynamic"

const nombres = {
  "corte-clasico": "Corte clásico",
  "corte-barba": "Corte + barba",
};

const horarios = [
  "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00",
];

function getFechasDisponibles() {
  const fechas = [];
  const hoy = new Date();
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    const dia = fecha.getDay();
    if (dia !== 0) {
      fechas.push(fecha.toISOString().split("T")[0]);
    }
  }
  return fechas;
}

function formatearFecha(fechaStr) {
  const [anio, mes, dia] = fechaStr.split("-");
  const fecha = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));
  return fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

export default function Reservar({ params }) {
  const { servicio } = use(params);
  const nombre = nombres[servicio];
  const router = useRouter();

  const fechas = getFechasDisponibles();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechas[0]);
  const [ocupados, setOcupados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    fetch("/api/horarios?fecha=" + fechaSeleccionada)
      .then((r) => r.json())
      .then((data) => {
        setOcupados(data.ocupados);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [fechaSeleccionada]);

  if (!nombre) {
    router.push("/");
    return null;
  }

  function renderHorario(hora) {
    const ocupado = ocupados.includes(hora);
    const href = "/confirmar?servicio=" + encodeURIComponent(nombre) + "&hora=" + hora + "&fecha=" + fechaSeleccionada;

    if (ocupado) {
      return (
        <div key={hora} className="bg-zinc-800 text-zinc-500 py-4 rounded-xl font-semibold text-center cursor-not-allowed line-through">
          {hora} — Ocupado
        </div>
      );
    }

    return (
      <a key={hora} href={href} className="bg-white text-black py-4 rounded-xl font-semibold text-center hover:scale-105 transition">
        {hora}
      </a>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Elegí un horario</h1>
      <p className="text-zinc-400 mb-8">Servicio: {nombre}</p>

      <div className="w-full max-w-sm mb-6">
        <p className="text-zinc-400 mb-3 text-sm">Seleccioná el día:</p>
        <div className="flex flex-col gap-2">
          {fechas.map((fecha) => (
            <button
              key={fecha}
              onClick={() => setFechaSeleccionada(fecha)}
              className={
                "py-3 rounded-xl font-semibold text-center transition capitalize " +
                (fechaSeleccionada === fecha
                  ? "bg-white text-black"
                  : "bg-zinc-900 text-white border border-zinc-700 hover:border-white")
              }
            >
              {formatearFecha(fecha)}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm">
        <p className="text-zinc-400 mb-3 text-sm">Horarios disponibles:</p>
        {cargando ? (
          <p className="text-zinc-400 text-center">Cargando horarios...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {horarios.map(renderHorario)}
          </div>
        )}
      </div>
    </main>
  );
}