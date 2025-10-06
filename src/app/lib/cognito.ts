// lib/cognito.ts
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { generateSecretHash } from "./cognito/utils";

const poolData = {
  UserPoolId: "us-east-1_Tt8M6LaBx",
  ClientId: "1pu7tct7lqblls7efd74ku8red",
  ClientSecret: "1kme0g7vl8i189oor6k1ka0nhrtlge6fj4mi37h39nasusih9kc9", // Reemplaza por tu client secret real
};

const userPool = new CognitoUserPool(poolData);

export const signIn = async (username: string, password: string) => {
  const user = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  const authDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        const idToken = result.getIdToken().getJwtToken();
        resolve({ token: idToken });
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

// Recuperación de contraseña: enviar código
export const forgotPassword = async (username: string) => {
  const user = new CognitoUser({
    Username: username,
    Pool: userPool,
  });
  const secretHash = generateSecretHash(
    username,
    poolData.ClientId,
    poolData.ClientSecret
  );
  return new Promise((resolve, reject) => {
    user.forgotPassword({
      onSuccess: (data) => {
        resolve(data);
      },
      onFailure: (err) => {
        reject(err);
      },
    }, { SecretHash: secretHash });
  });
};

// Confirmar código y nueva contraseña
export const confirmForgotPassword = async (
  username: string,
  code: string,
  newPassword: string
) => {
  const user = new CognitoUser({
    Username: username,
    Pool: userPool,
  });
  const secretHash = generateSecretHash(
    username,
    poolData.ClientId,
    poolData.ClientSecret
  );
  return new Promise((resolve, reject) => {
    user.confirmPassword(code, newPassword, {
      onSuccess: () => {
        resolve(true);
      },
      onFailure: (err) => {
        reject(err);
      },
    }, { SecretHash: secretHash });
  });
};
