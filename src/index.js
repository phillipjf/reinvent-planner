import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "@redux-devtools/extension";

import "./index.css";
import App from "./App";
import reducers from "./reducers";
import LocalStorageSyncer from "./middlewares/LocalStorageSyncer";
import * as serviceWorker from "./serviceWorker";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  gql,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://api.us-east-1.prod.events.aws.a2z.com/attendee/graphql/",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider
      store={createStore(
        reducers,
        composeWithDevTools(applyMiddleware(LocalStorageSyncer))
      )}
    >
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
