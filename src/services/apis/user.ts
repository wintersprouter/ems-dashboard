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
    request: z.object({
      email: z.string(),
      password: z.string(),
    }),
    parameters: [
      {
        name: "email",
        type: "Body",
        schema: z.string().email(),
      },
      {
        name: "password",
        type: "Body",
        schema: z.string(),
      },
      {
        name: "action",
        type: "Body",
        schema: z.string(),
      },
      {
        name: "token",
        type: "Body",
        schema: z.string(),
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
