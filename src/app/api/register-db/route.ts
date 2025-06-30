// app/api/register-db/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import axios from "axios";

const clientId = "1pu7tct7lqblls7efd74ku8red";
const clientSecret = "1kme0g7vl8i189oor6k1ka0nhrtlge6fj4mi37h39nasusih9kc9";
const region = "us-east-1";

function generateSecretHash(username: string) {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export async function POST(req: NextRequest) {
  const { email, password, nombre, apellido } = await req.json();

  try {
    // 1. Autenticarse para obtener el token
    const cognito = new CognitoIdentityProviderClient({ region });
    const secretHash = generateSecretHash(email);

    const authRes = await cognito.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: secretHash,
        },
      })
    );

    const jwt = authRes.AuthenticationResult?.IdToken;
    const payload = JSON.parse(
      Buffer.from(jwt?.split(".")[1] ?? "", "base64").toString("utf-8")
    );

    const cognitoId = payload.sub;

    // 2. Enviar datos a Lambda para guardarlo en tu BD
    const response = await axios.post(
      "https://3gh2iixoag.execute-api.us-east-1.amazonaws.com/test/usuario/registrar",
      {
        cognito_id: cognitoId,
        nombre,
        apellido,
        correo: email,
        rol: "usuario", // por defecto
      }
    );

    return NextResponse.json({
      message: "Usuario registrado",
      data: response.data,
    });
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
