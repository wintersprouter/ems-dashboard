import { makeApi } from "@zodios/core";

import { z } from "zod";

export enum StatusCode {
  OK = 200,
  EMailOrPasswordError = 1002,
}

const userAuthResponse = z.object({
  email: z.string(),
  username: z.string(),
  action: z.string(),
  token: z.string(),
  dtTokenExpire: z.string().datetime(),
  statusCode: z.nativeEnum(StatusCode),
});

export const userApi = makeApi([
  {
    method: "post",
    path: "/User/SignIn",
    alias: "signIn",
    description: "Sign in",

    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({
          email: z.string().trim().email().min(5),
          password: z.string().min(8),
          action: z.string(),
          token: z.string(),
        }),
      },
    ],
    response: userAuthResponse,
    errors: [
      {
        status: "default",
        description: "Default error",
        schema: z.object({
          error: z.object({
            code: z.string(),
            message: z.string(),
          }),
        }),
      },
    ],
  },
  {
    method: "post",
    path: "/User/SignOut",
    alias: "signOut",
    description: "Sign out",
    response: userAuthResponse,
  },
]);
