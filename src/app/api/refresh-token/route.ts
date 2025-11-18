import { NextRequest, NextResponse } from "next/server";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const clientId = "1pu7tct7lqblls7efd74ku8red";

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    const command = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const response = await client.send(command);

    // When storing tokens after login, make sure to store both:
    // localStorage.setItem("accessToken", response.AuthenticationResult.AccessToken); // For API calls
    // localStorage.setItem("idToken", response.AuthenticationResult.IdToken); // For user info
    // localStorage.setItem("refreshToken", response.AuthenticationResult.RefreshToken);

    return NextResponse.json({
      ok: true,
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to refresh token" },
      { status: 401 }
    );
  }
}