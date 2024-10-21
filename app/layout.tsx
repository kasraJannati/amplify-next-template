"use client";

import React from "react";
import { Amplify } from "aws-amplify";
import { Authenticator, Theme, ThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import Header from "./components/header";
import Navbar from "./components/navbar";
import { UserProvider } from "./context/UserContext";
import "./styles/globals.scss";

Amplify.configure(outputs);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme: Theme = {
    name: "primary-theme",
    tokens: {
      components: {
        menu: {
          borderRadius: { value: "4px" },
          item: {},
        },
        button: {
          primary: {
            backgroundColor: { value: "#46687c" },
            borderStyle: { value: "none" },
            _focus: {
              boxShadow: { value: "none" },
            },
          },
        },
      },
    },
  };

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme} colorMode="light">
          <UserProvider>
            <Authenticator signUpAttributes={["preferred_username"]}>
              <Header />
              <Navbar />
              <main className="main">{children}</main>
            </Authenticator>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
