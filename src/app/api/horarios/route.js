import { google } from "googleapis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get("fecha");

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const inicio = new Date(fecha + "T00:00:00-03:00");
    const fin = new Date(fecha + "T23:59:59-03:00");

    const res = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: inicio.toISOString(),
      timeMax: fin.toISOString(),
      singleEvents: true,
    });

    // getHours() usa la zona del servidor (UTC en Vercel); formateamos en hora argentina
    const formatoHora = new Intl.DateTimeFormat("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });

    const ocupados = (res.data.items || [])
      .filter((evento) => evento.start.dateTime)
      .map((evento) => formatoHora.format(new Date(evento.start.dateTime)));

    return NextResponse.json({ ocupados });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ocupados: [] }, { status: 500 });
  }
}