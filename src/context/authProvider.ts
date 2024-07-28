import { z } from "zod";
import { Api } from "../services/apis";
import { signInParamsSchema, StatusCode } from "../services/apis/types";
import { userAuthResponse } from "../services/apis/user";

type SignInParams = z.infer<typeof signInParamsSchema>;

interface AuthProvider {
  isAuthenticated: boolean;
  username: null | string;
  token: null | string;
  email: null | string;
  signIn(
    signInPayload: SignInParams
  ): Promise<z.infer<typeof userAuthResponse>>;
  signOut(): Promise<void>;
  getAuthStatus(): Promise<void>;
}

export const AuthProvider: AuthProvider = {
  isAuthenticated: false,
  username: null,
  token: null,
  email: null,
  async signIn({ email, password }: SignInParams) {
    const res = await Api.signIn({
      email: email,
      password: password,
      action: "signIn",
      token: "",
    });

    if (res.statusCode === StatusCode.OK && res?.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("email", res.email);
      AuthProvider.isAuthenticated = true;
      AuthProvider.email = email;
      AuthProvider.token = res.token;
    }
    return res;
  },
  async getAuthStatus() {
    try {
      AuthProvider.token = localStorage.getItem("token");
      AuthProvider.email = localStorage.getItem("email");
      AuthProvider.isAuthenticated = !!AuthProvider.token;
      if (
        AuthProvider.isAuthenticated &&
        AuthProvider.token &&
        AuthProvider.email
      ) {
        //Todo: get user info
      } else {
        console.log("No Auth");
      }
    } catch (error) {
      console.error(error);
    }
  },
  async signOut() {
    try {
      console.log("Signing out");
      if (AuthProvider.token && AuthProvider.email) {
        const res = await Api.signOut({
          email: AuthProvider.email,
          action: "signOut",
          token: AuthProvider.token,
        });
        if (res.statusCode === StatusCode.OK) {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          AuthProvider.isAuthenticated = false;
          AuthProvider.username = null;
          AuthProvider.token = null;
          AuthProvider.email = null;
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
