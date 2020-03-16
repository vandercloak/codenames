import React from "react";
import { useRoutes } from "hookrouter";
import { routes } from "./routes";
import {
  Provider as URQLProvider,
  createClient,
  defaultExchanges,
  subscriptionExchange
} from "urql";
import "antd/dist/antd.css";
import { SubscriptionClient } from "subscriptions-transport-ws";

const subscriptionClient = new SubscriptionClient(
  "wss://codenames-hasura.herokuapp.com/v1/graphql",
  {}
);

const client = createClient({
  url: "https://codenames-hasura.herokuapp.com/v1/graphql",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
});

export default function App() {
  const routeResult = useRoutes(routes);

  return (
    <URQLProvider value={client}>{routeResult || "Not Found"} </URQLProvider>
  );
}
