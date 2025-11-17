import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  InitiateAuthCommand,
  ChangePasswordCommand,
  RespondToAuthChallengeCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "./cognito/utils";

const clientId = "1pu7tct7lqblls7efd74ku8red";
const clientSecret = "1kme0g7vl8i189oor6k1ka0nhrtlge6fj4mi37h39nasusih9kc9";

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || "us-east-1" });

// LOGIN (USER_PASSWORD_AUTH)
export const loginAws = async (username: string, password: string) => {
  const secretHash = generateSecretHash(username, clientId, clientSecret);
  const cmd = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
  });
  return cognitoClient.send(cmd);
};

// REFRESH TOKEN
export const refreshSessionAws = async (username: string, refreshToken: string) => {
  const secretHash = generateSecretHash(username, clientId, clientSecret);
  const cmd = new InitiateAuthCommand({
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: clientId,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
      SECRET_HASH: secretHash,
    },
  });
  return cognitoClient.send(cmd);
};

// CHANGE PASSWORD (requiere AccessToken válido)
export const changePasswordAws = async (
  accessToken: string,
  previousPassword: string,
  newPassword: string
) => {
  const cmd = new ChangePasswordCommand({
    AccessToken: accessToken,
    PreviousPassword: previousPassword,
    ProposedPassword: newPassword,
  });
  return cognitoClient.send(cmd);
};

// Flujo NEW_PASSWORD_REQUIRED (cuando el primer login exige nueva clave)
export const respondNewPasswordChallengeAws = async (
  username: string,
  newPassword: string,
  session: string
) => {
  const secretHash = generateSecretHash(username, clientId, clientSecret);
  const cmd = new RespondToAuthChallengeCommand({
    ClientId: clientId,
    ChallengeName: "NEW_PASSWORD_REQUIRED",
    Session: session,
    ChallengeResponses: {
      USERNAME: username,
      NEW_PASSWORD: newPassword,
      SECRET_HASH: secretHash,
    },
  });
  return cognitoClient.send(cmd);
};

// Logout global (revoca tokens)
export const globalSignOutAws = async (accessToken: string) => {
  const cmd = new GlobalSignOutCommand({ AccessToken: accessToken });
  return cognitoClient.send(cmd);
};

export const forgotPasswordAws = async (username: string) => {
  const secretHash = generateSecretHash(username, clientId, clientSecret);
  const command = new ForgotPasswordCommand({
    ClientId: clientId,
    Username: username,
    SecretHash: secretHash,
  });
  return cognitoClient.send(command);
};

export const confirmForgotPasswordAws = async (
  username: string,
  code: string,
  newPassword: string
) => {
  const secretHash = generateSecretHash(username, clientId, clientSecret);
  const command = new ConfirmForgotPasswordCommand({
    ClientId: clientId,
    Username: username,
    ConfirmationCode: code,
    Password: newPassword,
    SecretHash: secretHash,
  });
  return cognitoClient.send(command);
};

// Utilidad para verificar tipo de token
export function isAccessToken(jwt: string) {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    return payload.token_use === "access";
  } catch {
    return false;
  }
}
