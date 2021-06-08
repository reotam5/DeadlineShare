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
  Whisper,
  Popover,
  Badge,
} from "rsuite";
import { login, register } from "../actions/authActions";
import { useSelector, useDispatch } from "react-redux";
import {
  create_assignment,
  get_assignment,
  mark_as_done,
  mark_as_undone,
} from "../actions/assignmentActions";
import axios from "axios";
import get_group from "../actions/groupActions";

function CalenderPage() {
  const group = useSelector((state) => state.group);
  const auth = useSelector((state) => state.auth);
  const assignment = useSelector((state) => state.assignment);

  //create assignment modal
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] =
    useState(false);

  //currently Selected Date
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateSelect = (date) => {
    setSelectedDate(
      new Date(
        `${date.getFullYear()}-${
          (date.getMonth() + 1 + "").length === 1
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1
        }-${
          (date.getDate() + "").length === 1
            ? "0" + date.getDate()
            : date.getDate()
        }T${23}:${59}:${59}`
      )
    );
  };

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

  function getTodoList(date) {
    const todayAssignments = assignment.assignments.filter((assignment) => {
      return (
        !assignment.doneUsers.includes(auth.user._id) &&
        new Date(assignment.dueOn).getDate() === new Date(date).getDate() &&
        new Date(assignment.dueOn).getMonth() === new Date(date).getMonth() &&
        new Date(assignment.dueOn).getFullYear() ===
          new Date(date).getFullYear()
      );
    });
    if (todayAssignments.length === 0) return [];
    return todayAssignments.map((todayAssignment) => {
      return {
        time: new Date(todayAssignment.dueOn).toLocaleTimeString(),
        title: todayAssignment.title,
        _id: todayAssignment._id,
      };
    });
  }

  function getDoneList(date) {
    const todayAssignments = assignment.assignments.filter((assignment) => {
      return (
        assignment.doneUsers.includes(auth.user._id) &&
        new Date(assignment.dueOn).getDate() === new Date(date).getDate() &&
        new Date(assignment.dueOn).getMonth() === new Date(date).getMonth() &&
        new Date(assignment.dueOn).getFullYear() ===
          new Date(date).getFullYear()
      );
    });
    if (todayAssignments.length === 0) return [];
    return todayAssignments.map((todayAssignment) => {
      return {
        time: new Date(todayAssignment.dueOn).toLocaleTimeString(),
        title: todayAssignment.title,
        _id: todayAssignment._id,
      };
    });
  }

  function renderCell(date) {
    const toDoList = getTodoList(date);
    const doneList = getDoneList(date);
    return (
      <>
        {toDoList.length > 0 ? (
          <Whisper
            placement="auto"
            trigger="click"
            speaker={
              <Popover>
                <List hover>
                  {toDoList.map((item, index) => (
                    <List.Item key={index}>
                      <b>{item.title}</b> - {item.time}
                      <Button
                        color="blue"
                        size="xs"
                        style={{ marginLeft: "3px" }}
                        onClick={() => {
                          dispatch(mark_as_done({ assignmentID: item._id }));
                        }}
                      >
                        <Icon icon="check" /> Mark as done
                      </Button>
                    </List.Item>
                  ))}
                </List>
              </Popover>
            }
          >
            <Badge
              content={toDoList.length + " to-do"}
              style={{
                padding: "0",
                minWidth: "100%",
                width: "100%",
                wordWrap: "break-word",
              }}
            />
          </Whisper>
        ) : null}
        {doneList.length > 0 ? (
          <Whisper
            placement="auto"
            trigger="click"
            speaker={
              <Popover>
                <List hover>
                  {doneList.map((item, index) => (
                    <List.Item key={index}>
                      <b>{item.title}</b> - {item.time}
                      <Button
                        color="blue"
                        size="xs"
                        style={{ marginLeft: "3px" }}
                        onClick={() => {
                          dispatch(mark_as_undone({ assignmentID: item._id }));
                        }}
                      >
                        <Icon icon="check" /> Mark as undone
                      </Button>
                    </List.Item>
                  ))}
                </List>
              </Popover>
            }
          >
            <Badge
              content={doneList.length + " done"}
              style={{
                padding: "0",
                background: "#1589FF",
                minWidth: "100%",
                width: "100%",
                wordWrap: "break-word",
              }}
            />
          </Whisper>
        ) : null}
      </>
    );
  }

  return (
    <>
      <Calendar renderCell={renderCell} onChange={handleDateSelect} />
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
          <Form
            fluid
            onChange={handleChange}
            formValue={{ dueOn: selectedDate }}
          >
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
                format="DD MMM YYYY hh:mm"
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
