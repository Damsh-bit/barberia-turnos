import { google } from "googleapis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"

export async function POST(request) {
  try {
    const { nombre, telefono, servicio, hora, fecha } = await request.json();

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const [horas, minutos] = hora.split(":");
    const inicio = new Date(fecha + "T" + horas.padStart(2, "0") + ":" + minutos.padStart(2, "0") + ":00-03:00");
    const fin = new Date(inicio.getTime() + 60 * 60 * 1000);

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: servicio + " - " + nombre,
        description: "Cliente: " + nombre + "\nWhatsApp: " + telefono,
        start: { dateTime: inicio.toISOString(), timeZone: "America/Argentina/Buenos_Aires" },
        end: { dateTime: fin.toISOString(), timeZone: "America/Argentina/Buenos_Aires" },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}