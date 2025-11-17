import {
  CognitoIdentityProviderClient,
  ChangePasswordCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || "us-east-1" });


export async function changePassword(accessToken: string, currentPassword: string, newPassword: string) {
  const cmd = new ChangePasswordCommand({
    PreviousPassword: currentPassword,
    ProposedPassword: newPassword,
    AccessToken: accessToken, // AccessToken obtenido en login (NO el idToken)
  });
  return client.send(cmd);
}

export async function initiateForgotPassword(username: string) {
  const cmd = new ForgotPasswordCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: username,
  });
  return client.send(cmd);
}

export async function confirmForgotPassword(username: string, code: string, newPassword: string) {
  const cmd = new ConfirmForgotPasswordCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: username,
    ConfirmationCode: code,
    Password: newPassword,
  });
  return client.send(cmd);
}