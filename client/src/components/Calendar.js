import React, { useState, useEffect } from "react";
import {
  List,
  FlexboxGrid,
  Icon,
  Button,
  IconButton,
  Modal,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Divider,
  InputGroup,
  Input,
  Calendar,
  DatePicker,
  SelectPicker,
} from "rsuite";
import { login, register } from "../actions/authActions";
import { useSelector, useDispatch } from "react-redux";
import {
  create_assignment,
  get_assignment,
} from "../actions/assignmentActions";
import axios from "axios";
import get_group from "../actions/groupActions";

function CalenderPage() {
  const group = useSelector((state) => state.group);
  const auth = useSelector((state) => state.auth);

  //create assignment modal
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] =
    useState(false);

  //new assignment form
  const [assignmentCreationForm, setAssignmentCreationForm] = useState({});
  const handleChange = (value) => {
    setAssignmentCreationForm(value);
  };
  const ranges = [
    {
      label: "Now",
      value: new Date(),
    },
  ];
  const handleUpdate = () => {
    dispatch(get_group());
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_assignment());
  }, []);
  return (
    <>
      <Calendar />
      <IconButton
        icon={<Icon icon="plus" />}
        color="cyan"
        circle
        style={{ position: "fixed", bottom: 0, right: 0, margin: "10px" }}
        onClick={() => {
          setIsCreateAssignmentModalOpen(true);
        }}
      />

      <Modal
        show={isCreateAssignmentModalOpen}
        onHide={() => {
          setIsCreateAssignmentModalOpen(false);
        }}
        size="xs"
      >
        <Modal.Header>
          <Modal.Title>New Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={handleChange}>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <FormControl name="title" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl name="description" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Due</ControlLabel>
              <FormControl
                accepter={DatePicker}
                style={{ width: "100%" }}
                format="DD MMM YYYY hh:mm:ss"
                ranges={ranges}
                name="dueOn"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Group</ControlLabel>
              <FormControl
                data={group.groups
                  .filter((group) => {
                    return group.editors.includes(auth.user._id);
                  })
                  .map((group) => {
                    return {
                      label: group.name,
                      value: group._id,
                    };
                  })}
                accepter={SelectPicker}
                style={{ width: "100%" }}
                name="groupID"
                onOpen={handleUpdate}
                onSearch={handleUpdate}
                renderMenu={(menu) => {
                  if (group.isLoading === true) {
                    return (
                      <p
                        style={{
                          padding: 4,
                          color: "#999",
                          textAlign: "center",
                        }}
                      >
                        <Icon icon="spinner" spin /> Loading groups...
                      </p>
                    );
                  }
                  return menu;
                }}
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setIsCreateAssignmentModalOpen(false);
              dispatch(create_assignment(assignmentCreationForm));
            }}
            appearance="primary"
          >
            Confirm
          </Button>
          <Button
            onClick={() => {
              setIsCreateAssignmentModalOpen(false);
            }}
            appearance="subtle"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CalenderPage;
