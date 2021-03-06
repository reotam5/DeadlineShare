import "./App.css";
import AppNavbar from "./components/AppNavbar";
import Login from "./components/Login";
import "rsuite/dist/styles/rsuite-default.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadUser } from "./actions/authActions";
import { Notification } from "rsuite";
import Group from "./components/Group";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import CalenderPage from "./components/Calendar";

function App() {
  //try loading user
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, []);

  //display error
  const error = useSelector((state) => state.error);
  useEffect(() => {
    if (error.msg) {
      Notification.error({
        title: "Error",
        description: <div>{error.msg}</div>,
      });
      console.log(error.msg);
    }
  }, [error]);

  return (
    <Router>
      <div className="App">
        <AppNavbar />
        <Login />
      </div>
      <Switch>
        <Route path="/group">
          <Group />
        </Route>
        <Route path="/calendar">
          <CalenderPage />
        </Route>
        <Route path="/">
          <>Instruction</>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
