import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "./cognito/utils";

const clientId = "1pu7tct7lqblls7efd74ku8red";
const clientSecret = "1kme0g7vl8i189oor6k1ka0nhrtlge6fj4mi37h39nasusih9kc9";
const userPoolId = "us-east-1_Tt8M6LaBx";

const cognitoClient = new CognitoIdentityProviderClient({ region: "us-east-1" });

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
