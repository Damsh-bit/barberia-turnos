import { Suspense } from "react";
import ExitoContent from "./ExitoContent";

export default function Exito() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Cargando...
      </div>
    }>
      <ExitoContent />
    </Suspense>
  );
}