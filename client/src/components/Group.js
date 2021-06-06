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
  HelpBlock,
} from "rsuite";
import { login, register } from "../actions/authActions";
import { useSelector, useDispatch } from "react-redux";
import get_group, { add_group, delete_group } from "../actions/groupActions";

function Group() {
  const dispatch = useDispatch();
  const group = useSelector((state) => state.group);
  const auth = useSelector((state) => state.auth);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(get_group());
  }, []);

  const styleCenter = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60px",
    paddingLeft: "10px",
  };

  const slimText = {
    fontSize: "0.666em",
    color: "#97969B",
    fontWeight: "lighter",
    paddingBottom: 5,
  };

  const titleStyle = {
    paddingBottom: 5,
    whiteSpace: "nowrap",
    fontWeight: 500,
  };

  const dataStyle = {
    fontSize: "1.2em",
    fontWeight: 500,
  };

  const [targetGroupID, setTargetGroupID] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <List hover>
        {group.groups.map((item, index) => (
          <List.Item key={item._id} index={index}>
            <FlexboxGrid>
              <FlexboxGrid.Item
                colspan={12}
                style={{
                  ...styleCenter,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  overflow: "hidden",
                }}
              >
                <div style={titleStyle}>{item["name"]}</div>
                <div style={slimText}>
                  <div>{"Created by " + item["createdBy"]}</div>
                  <div>{item["createdOn"]}</div>
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={6} style={styleCenter}>
                <div style={{ textAlign: "right" }}>
                  <div style={slimText}>Members</div>
                  <div style={dataStyle}>
                    {item["members"].length.toLocaleString()}
                  </div>
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item
                colspan={6}
                style={{
                  ...styleCenter,
                }}
              >
                <Button
                  appearance="default"
                  color="blue"
                  onClick={() => {
                    setTargetGroupID(item._id);
                    setIsEditModalOpen(true);
                  }}
                >
                  View / Edit
                </Button>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>
        ))}
      </List>
      <IconButton
        style={{
          position: "absolute",
          bottom: "0",
          right: "0",
          margin: "15px",
        }}
        icon={<Icon icon="plus" />}
        color="cyan"
        circle
        onClick={() => {
          setIsCreateModalOpen(true);
        }}
      />
      <CreateGroupModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <EditGroupModal
        targetGroupID={targetGroupID}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
      />
    </>
  );
}

function EditGroupModal({
  targetGroupID,
  isEditModalOpen,
  setIsEditModalOpen,
}) {
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState({ groupName: "" });
  const group = useSelector((state) => state.group);
  let targetGroup = group.groups.filter(
    (group) => group._id === targetGroupID
  )[0];
  targetGroup = targetGroup ? targetGroup : { name: "", members: [] };

  return (
    <div className="modal-container">
      <Modal
        size="xs"
        show={isEditModalOpen}
        onHide={() => setIsEditModalOpen(false)}
      >
        <Modal.Header>
          <Modal.Title>{targetGroup.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {targetGroup.members.map((member, index) => (
            <>{member}</>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            appearance="primary"
            onClick={() => {
              dispatch(add_group(formValue.groupName));
              setIsEditModalOpen(false);
            }}
          >
            Create
          </Button>
          <Button
            onClick={() => {
              setIsEditModalOpen(false);
            }}
            appearance="subtle"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function CreateGroupModal({ isCreateModalOpen, setIsCreateModalOpen }) {
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState({ groupName: "" });

  return (
    <div className="modal-container">
      <Modal
        size="xs"
        show={isCreateModalOpen}
        onHide={() => setIsCreateModalOpen(false)}
      >
        <Modal.Header>
          <Modal.Title>Create a group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onChange={(formValue) => setFormValue(formValue)} fluid>
            <FormGroup>
              <ControlLabel>Group Name</ControlLabel>
              <FormControl name="groupName" />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            appearance="primary"
            onClick={() => {
              dispatch(add_group(formValue.groupName));
              setIsCreateModalOpen(false);
            }}
          >
            Create
          </Button>
          <Button
            onClick={() => {
              setIsCreateModalOpen(false);
            }}
            appearance="subtle"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Group;
