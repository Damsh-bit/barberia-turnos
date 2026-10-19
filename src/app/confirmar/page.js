import { Suspense } from "react";
import ConfirmarContent from "./ConfirmarContent";

export default function Confirmar() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Cargando...
      </div>
    }>
      <ConfirmarContent />
    </Suspense>
  );
}