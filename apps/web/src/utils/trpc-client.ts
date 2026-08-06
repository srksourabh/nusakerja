"use client";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../trpc/router";

/** Browser tRPC client — credentials include session cookie. */
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      fetch(url, opts) {
        return fetch(url, { ...opts, credentials: "include" });
      },
    }),
  ],
});
