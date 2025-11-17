import { NextResponse } from "next/server";
import { initiateForgotPassword, confirmForgotPassword } from "@/app/services/cognito.service";

export async function POST(request: Request) {
  const { username } = await request.json();
  if (!username) return NextResponse.json({ message: "Falta username." }, { status: 400 });
  await initiateForgotPassword(username);
  return NextResponse.json({ message: "Código enviado." });
}

export async function PUT(request: Request) {
  const { username, code, newPassword } = await request.json();
  if (!username || !code || !newPassword) return NextResponse.json({ message: "Datos incompletos." }, { status: 400 });
  await confirmForgotPassword(username, code, newPassword);
  return NextResponse.json({ message: "Contraseña restablecida." });
}