import { NextRequest } from "next/server";
import { ChangePasswordCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

interface ChangePasswordBody {
  accessToken: string;
  previousPassword: string;
  proposedPassword: string;
}

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

export async function POST(req: NextRequest) {
  try {
    const body: ChangePasswordBody = await req.json();
    const cmd = new ChangePasswordCommand({
      AccessToken: body.accessToken,
      PreviousPassword: body.previousPassword,
      ProposedPassword: body.proposedPassword,
    });
    await client.send(cmd);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 400 });
  }
}