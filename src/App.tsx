import React, { useEffect } from "react";
import { useRoutes } from "hookrouter";
import CodenameRouter from "./routes";
import {
  Provider as URQLProvider,
  createClient,
  defaultExchanges,
  subscriptionExchange,
} from "urql";
import "antd/dist/antd.css";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { ThemeProvider } from "./hooks/use-themes";
import "./app.scss";
import { RecoilRoot } from "recoil";

const subscriptionClient = new SubscriptionClient(
  "wss://codenames-hasura.herokuapp.com/v1/graphql",
  {}
);

const client = createClient({
  url: "https://codenames-hasura.herokuapp.com/v1/graphql",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
});

export default function App() {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <URQLProvider value={client}>
          <CodenameRouter />
        </URQLProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}
