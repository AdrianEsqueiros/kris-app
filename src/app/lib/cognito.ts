// lib/cognito.ts
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_Tt8M6LaBx",
  ClientId: "1pu7tct7lqblls7efd74ku8red",
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
