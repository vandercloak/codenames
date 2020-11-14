import React from "react";
import Game from "./pages/game/game";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const CodenameRouter = () => {
  return (
    <Router>
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
