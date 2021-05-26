import React, { useEffect, useState } from "react";
import { Sidenav, Nav, Icon, Navbar } from "rsuite";
import "rsuite/lib/styles/index.less";
import "../css/AppNavbar.css";
import { useSelector, useDispatch } from "react-redux";
import Login from "./Login";

function AppNavbar() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(auth);
  }, []);

  //handle login modal open/close
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  //handle sidebar
  const [isSideOpen, setIsSideOpen] = useState(false);
  const [sideBarPosition, setSideBarPosition] = useState({
    transform: "translateX(0px)",
  });
  const [presentationPosition, setpresentationPosition] = useState({
    left: "-100vw",
  });
  const handleSideBarClose = () => {
    setSideBarPosition({ transform: "translateX(0px)" });
    setpresentationPosition({ left: "-100vw" });
  };
  const handleSideBarOpen = () => {
    setSideBarPosition({ transform: "translateX(200px)" });
    setpresentationPosition({ left: 0 });
  };
  const toggeleSideBar = () => {
    if (isSideOpen) {
      setIsSideOpen(false);
      handleSideBarClose();
    } else {
      setIsSideOpen(true);
      handleSideBarOpen();
    }
  };
  return (
    <>
      <div className="topBar">
        <Navbar>
          <Navbar.Body>
            <Nav onSelect={toggeleSideBar}>
              <Nav.Item icon={<Icon icon="bars" />} />
            </Nav>
            <Nav>
              <Nav.Item href="/" icon={<Icon icon="slideshare" />}>
                Deadline Share
              </Nav.Item>
            </Nav>
            <Nav pullRight>
              <Nav.Item
                icon={<Icon icon="sign-in" />}
                onClick={() => setIsLoginModalOpen(true)}
              >
                Login
              </Nav.Item>
            </Nav>
          </Navbar.Body>
        </Navbar>
      </div>

      <div className="sideBar" style={sideBarPosition}>
        <div
          className="presentation"
          style={presentationPosition}
          onClick={toggeleSideBar}
        />
        <Sidenav style={{ height: "100vh" }}>
          <Sidenav.Body>
            <Nav>
              <Nav.Item
                onSelect={toggeleSideBar}
                icon={<Icon icon="dashboard" />}
              >
                Dashboard
              </Nav.Item>
              <Nav.Item
                onSelect={toggeleSideBar}
                icon={<Icon icon="calendar" />}
              >
                Calender
              </Nav.Item>
              <Nav.Item onSelect={toggeleSideBar} icon={<Icon icon="group" />}>
                Group
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </div>
      <Login
        isLoginModalOpen={isLoginModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
      />
    </>
  );
}

export default AppNavbar;
