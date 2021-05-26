import "./App.css";
import AppNavbar from "./components/AppNavbar";
import Login from "./components/Login";
import "rsuite/dist/styles/rsuite-default.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { login } from "./actions/authActions";

function App() {
  //try loading user
  const dispatch = useDispatch();
  useEffect(() => {
    login(null, null)(dispatch);
  }, []);

  return (
    <div className="App">
      <AppNavbar />
      <Login />
    </div>
  );
}

export default App;
