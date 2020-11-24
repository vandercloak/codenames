import React from "react";
import Game from "./pages/game/game";
import { Router, Switch, Route } from "react-router-dom";
import ReactGA from "react-ga";
import { createBrowserHistory } from "history";

const CodenameRouter = () => {
  const history = createBrowserHistory();

  // Initialize google analytics page view tracking
  history.listen((location) => {
    ReactGA.initialize("G-HWLJKK121Z");
    ReactGA.set({ page: location.pathname }); // Update the user's current page
    ReactGA.pageview(location.pathname); // Record a pageview for the given page
  });

  return (
    <Router history={history}>
      <Switch>
        <Route path="/game/:id">
          <Game />
        </Route>
        <Route exact path="/">
          <>Homepage</>
        </Route>
      </Switch>
    </Router>
  );
};

export default CodenameRouter;
