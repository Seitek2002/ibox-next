"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "@/store";
// Init i18n on the client to preserve original behavior (language detector uses localStorage)
import "@/i18n";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
