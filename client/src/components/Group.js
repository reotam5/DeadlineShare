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
} from "rsuite";
import { login, register } from "../actions/authActions";
import { useSelector, useDispatch } from "react-redux";
import get_group, {
  accept_group,
  add_group,
  BeEditor_group,
  BeMember_group,
  BeOwner_group,
  delete_group,
  invite_group,
  kick_group,
  leave_group,
} from "../actions/groupActions";

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

function Group() {
  const dispatch = useDispatch();
  const group = useSelector((state) => state.group);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(get_group());
  }, []);

  const [targetGroupID, setTargetGroupID] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      {group.invites.length > 0 ? (
        <>
          <Divider>Invited groups</Divider>
          <List hover>
            {group.invites.map((item, index) => (
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
                        dispatch(accept_group(item._id));
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      style={{ marginLeft: "5px" }}
                      appearance="default"
                      color="red"
                      onClick={() => {
                        dispatch(leave_group(item._id));
                      }}
                    >
                      Reject
                    </Button>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </List.Item>
            ))}
          </List>
        </>
      ) : (
        <></>
      )}
      <Divider>Your groups</Divider>
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
          position: "fixed",
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
  const group = useSelector((state) => state.group);
  const auth = useSelector((state) => state.auth);
  const [targetGroup, setTargetGroup] = useState();
  useEffect(() => {
    setTargetGroup(
      group.groups.filter((element) => element._id === targetGroupID)[0]
    );
  }, [group, targetGroupID]);
  const [inviteEmail, setInviteEmail] = useState();
  const handleChange = (value) => {
    setInviteEmail(value);
  };

  return (
    <div className="modal-container">
      <Modal
        size="xs"
        show={isEditModalOpen}
        onHide={() => setIsEditModalOpen(false)}
      >
        <Modal.Header>
          <Modal.Title>{targetGroup ? targetGroup.name : ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {targetGroup ? (
            <div>
              {targetGroup.memberInfo.map((genre, index) => {
                return genre.users.length > 0 ? (
                  <div key={genre.title + "_" + index}>
                    <Divider>{genre.title}</Divider>
                    <List hover>
                      {genre.users.map((user, index2) => {
                        return (
                          <List.Item
                            key={genre.title + "_" + index + "_" + index2}
                          >
                            <FlexboxGrid justify="center" align="middle">
                              <FlexboxGrid.Item colspan={12}>
                                {user.name}
                              </FlexboxGrid.Item>
                              <FlexboxGrid.Item colspan={12}>
                                {auth.user &&
                                targetGroup.owners.includes(auth.user._id) ? (
                                  <>
                                    <Button
                                      appearance="primary"
                                      style={{ margin: "2px" }}
                                      onClick={() => {
                                        dispatch(
                                          BeOwner_group(
                                            targetGroupID,
                                            user.userID
                                          )
                                        );
                                      }}
                                    >
                                      Owner
                                    </Button>
                                    <Button
                                      appearance="primary"
                                      style={{ margin: "2px" }}
                                      onClick={() => {
                                        dispatch(
                                          BeEditor_group(
                                            targetGroupID,
                                            user.userID
                                          )
                                        );
                                      }}
                                    >
                                      Editor
                                    </Button>
                                    <Button
                                      appearance="primary"
                                      style={{ margin: "2px" }}
                                      onClick={() => {
                                        dispatch(
                                          BeMember_group(
                                            targetGroupID,
                                            user.userID
                                          )
                                        );
                                      }}
                                    >
                                      Member
                                    </Button>
                                    <Button
                                      appearance="primary"
                                      color="red"
                                      style={{ margin: "2px" }}
                                      onClick={() => {
                                        dispatch(
                                          kick_group(targetGroupID, user.userID)
                                        );
                                      }}
                                    >
                                      Kick
                                    </Button>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </FlexboxGrid.Item>
                            </FlexboxGrid>
                          </List.Item>
                        );
                      })}
                    </List>
                  </div>
                ) : (
                  <></>
                );
              })}
              <Divider>Invite by email</Divider>
              <InputGroup>
                <InputGroup.Addon>email</InputGroup.Addon>
                <Input onChange={handleChange} />
              </InputGroup>
              <Button
                appearance="primary"
                onClick={() => {
                  dispatch(invite_group(targetGroupID, inviteEmail));
                }}
                block
              >
                Invite
              </Button>
            </div>
          ) : (
            <></>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setIsEditModalOpen(false);
            }}
            appearance="subtle"
          >
            Close
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
