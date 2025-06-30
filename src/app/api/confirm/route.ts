// app/api/confirm/route.ts
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const clientId = "1pu7tct7lqblls7efd74ku8red";
const clientSecret = "1kme0g7vl8i189oor6k1ka0nhrtlge6fj4mi37h39nasusih9kc9";
const region = "us-east-1";

function generateSecretHash(username: string): string {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export async function POST(req: NextRequest) {
  const { username, code } = await req.json();

  const secretHash = generateSecretHash(username);

  const client = new CognitoIdentityProviderClient({ region });

  const command = new ConfirmSignUpCommand({
    ClientId: clientId,
    Username: username,
    ConfirmationCode: code,
    SecretHash: secretHash,
  });

  try {
    await client.send(command);
    return NextResponse.json({ message: "Cuenta confirmada" }, { status: 200 });
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
