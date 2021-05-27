import "./App.css";
import AppNavbar from "./components/AppNavbar";
import Login from "./components/Login";
import "rsuite/dist/styles/rsuite-default.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./actions/authActions";
import { Notification } from "rsuite";

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
    <div className="App">
      <AppNavbar />
      <Login />
    </div>
  );
}

export default App;
