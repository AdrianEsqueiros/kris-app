// app/api/signup/route.ts
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
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
  const { username, password, email } = await req.json();

  const secretHash = generateSecretHash(username);

  const client = new CognitoIdentityProviderClient({ region });

  const command = new SignUpCommand({
    ClientId: clientId,
    Username: username,
    Password: password,
    SecretHash: secretHash,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  });

  try {
    const response = await client.send(command);
    return NextResponse.json(
      { userConfirmed: response.UserConfirmed },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
