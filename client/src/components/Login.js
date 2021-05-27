import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Schema,
  ButtonToolbar,
} from "rsuite";
import axios from "axios";
import { login, register } from "../actions/authActions";
import { useSelector, useDispatch } from "react-redux";
const { StringType } = Schema.Types;

function Login({ isLoginModalOpen, setIsLoginModalOpen }) {
  //register or login
  const [isLoginScreen, setIsLoginScreen] = useState(true);

  //close modal on loadUser
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    if (auth.isAuthenticated && setIsLoginModalOpen) {
      setIsLoginModalOpen(false);
    }
  }, [auth]);

  return (
    <div className="modal-container">
      <Modal
        size="xs"
        show={isLoginModalOpen}
        onHide={() => setIsLoginModalOpen(false)}
      >
        <Modal.Header>
          <Modal.Title>{isLoginScreen ? "Login" : "Register"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoginScreen ? (
            <LoginForm setIsLoginModalOpen={setIsLoginModalOpen} />
          ) : (
            <RegisterForm setIsLoginModalOpen={setIsLoginModalOpen} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <div>
            {isLoginScreen ? (
              <Button appearance="link" onClick={() => setIsLoginScreen(false)}>
                Don't have an accout?
              </Button>
            ) : (
              <Button appearance="link" onClick={() => setIsLoginScreen(true)}>
                Already have an accout?
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function LoginForm({ setIsLoginModalOpen }) {
  //Login form rules
  const model = Schema.Model({
    email: StringType()
      .isEmail("Please enter a valid email address.")
      .isRequired("This field is required."),
    password: StringType().isRequired("This field is required."),
  });

  //holding userInput fields.
  const [formValues, setFormValues] = useState({});

  //handle submit action
  const dispatch = useDispatch();
  const handleSubmit = () => {
    const { email, password } = formValues;
    dispatch(login(email, password));
  };

  return (
    <div>
      <Form
        fluid
        model={model}
        onChange={(formValues) => setFormValues(formValues)}
      >
        <FormGroup>
          <ControlLabel>Email </ControlLabel>
          <FormControl checkAsync name="email" />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Password </ControlLabel>
          <FormControl checkAsync name="password" type="password" />
        </FormGroup>

        <Button
          onClick={() => {
            handleSubmit();
          }}
          appearance="primary"
        >
          Ok
        </Button>
        <Button onClick={() => setIsLoginModalOpen(false)} appearance="subtle">
          Cancel
        </Button>
      </Form>
    </div>
  );
}

function RegisterForm({ setIsLoginModalOpen }) {
  //Registration form rules
  const model = Schema.Model({
    email: StringType()
      .isEmail("Please enter a valid email address.")
      .isRequired("This field is required.")
      .addRule((value) => {
        return verifyEmail(value);
      }, "That email is already taken"),
    name: StringType().isRequired("This field is required."),
    password: StringType()
      .addRule((value) => {
        return value && value.length > 6;
      }, "Password must be more then 6 length long.")
      .isRequired("This field is required"),
  });

  //holding userInput fields.
  const [formValues, setFormValues] = useState({});

  //handle submit action
  const dispatch = useDispatch();
  const handleSubmit = () => {
    const { email, password, name } = formValues;
    dispatch(register(name, email, password));
  };

  return (
    <div>
      <Form
        fluid
        model={model}
        onChange={(formValues) => setFormValues(formValues)}
      >
        <FormGroup>
          <ControlLabel>Email </ControlLabel>
          <FormControl checkAsync name="email" />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Name </ControlLabel>
          <FormControl name="name" />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Password </ControlLabel>
          <FormControl name="password" type="password" />
        </FormGroup>

        <Button
          onClick={() => {
            handleSubmit();
          }}
          appearance="primary"
        >
          Ok
        </Button>
        <Button onClick={() => setIsLoginModalOpen(false)} appearance="subtle">
          Cancel
        </Button>
      </Form>
    </div>
  );
}

function verifyEmail(email) {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/user/verifyEmail/" + email)
      .then((res) => {
        try {
          resolve(res.data.isValid);
        } catch {
          reject(res.data);
        }
      })
      .catch(() => reject());
  });
}

export default Login;
