const express = require("express");
const router = express.Router();
const Group = require("../../models/Group");
const protectRoute = require("../../middleware/protectRoute");
const { findById } = require("../../models/Group");

/*
@route  POST api/group/add
@desc   Add a group
@access Private
{
  "name": "groupName"
}
*/
router.post("/add", protectRoute, (req, res) => {
  const newGroup = new Group({
    name: req.body.name || "Untitled group",
    createdBy: req.user.name,
    owners: [req.user._id],
    editors: [req.user._id],
    members: [req.user._id],
  });
  newGroup
    .save()
    .then((group) => res.json({ group: group }))
    .catch((error) => res.status(500).json({ success: false }));
});

/*
@route  GET api/group/find
@desc   Get find all groups that I belong to
@access Private
*/
router.get("/find", protectRoute, (req, res) => {
  Group.find({ members: req.user._id })
    .then((groups) => res.json({ groups: groups }))
    .catch((error) => res.status(500).json({ success: false }));
});

/*
@route  POST api/group/invite
@desc   Invite a user to group
@access Private
{
    "groupID": "",
    "userID": ""
}
*/
router.post("/invite", protectRoute, (req, res) => {
  Group.findById(req.body.groupID)
    .then((group) => {
      if (!group.members.includes(req.user._id))
        return res.status(403).json({ success: false });

      group
        .updateOne({ $push: { invites: req.body.userID } }, { new: true })
        .then((group) => {
          res.json({ success: true });
        })
        .catch((error) => res.status(500).json({ success: false }));
    })
    .catch((error) => res.status(500).json({ success: false }));
});

/*
@route  GET api/group/findInvitation
@desc   Get find all invitation
@access Private
*/
router.get("/findInvitation", protectRoute, (req, res) => {
  Group.find({ invites: req.user.email })
    .then((groups) => res.json({ groups: groups }))
    .catch((error) => res.json({ success: false }));
});

/*
@route  POST api/group/leave
@desc   Leave the group
@access Private
{
  "groupID": "groupID"
}
*/
router.post("/leave", protectRoute, (req, res) => {
  Group.findById(req.body.groupID)
    .then((group) => {
      if (group.owners.includes(req.user._id))
        res.status(400).json({
          success: false,
          msg: "Owner cannot leave groups. Consider deleting the group instead.",
        });

      group
        .updateOne(
          {
            $pull: {
              members: req.user._id,
              owners: req.user._id,
              editors: req.user._id,
            },
          },
          { new: true }
        )
        .then(() => {
          return res.json({ success: true });
        })
        .catch((error) => {
          return res.status(403).json({ success: false });
        });
    })
    .catch((error) => {
      return res.status(403).json({ success: false });
    });
});

/*
@route  POST api/group/kick
@desc   Kick a member from the group
@access Private
{
  "groupID": "groupID",
  "userID": "userID"
}
*/
router.post("/kick", protectRoute, (req, res) => {
  if (req.body.userID === req.user._id)
    return res.status(400).json({ success: false });
  Group.findById(req.body.groupID)
    .then((group) => {
      if (!group.owners.includes(req.user._id))
        return res.status(403).json({ success: false });

      group
        .updateOne(
          {
            $pull: {
              members: req.body.userID,
              owners: req.body.userID,
              editors: req.body.userID,
            },
          },
          { new: true }
        )
        .then((group) => {
          res.json({ success: true });
        })
        .catch((error) => res.json({ success: false }));
    })
    .catch((error) => res.json({ success: false }));
});

/*
@route  POST api/group/acceptInvite/
@desc   Accept invite
@access Private
{
    "groupID": "group"
}
*/
router.post("/acceptInvite", protectRoute, (req, res) => {
  Group.findById(req.body.groupID)
    .then((group) => {
      if (!group.invites.includes(req.user.email))
        return res.status(403).json({ success: false });

      group
        .updateOne(
          {
            $pull: {
              members: req.user._id,
              editors: req.user._id,
              owners: req.user._id,
              invites: req.user.email,
            },
          },
          { new: true }
        )
        .then(() => {
          group
            .updateOne({ $push: { members: req.user._id } }, { new: true })
            .then((group) => {
              res.json({ success: true });
            })
            .catch((error) => res.status(500).json({ success: false }));
        })
        .catch((error) => res.status(500).json({ success: false }));
    })
    .catch((error) => res.status(500).json({ success: false }));
});

/*
@route  post api/group/delete
@desc   Delete a group with id
@access Private
{
    "groupID": "groupID"
}
*/
router.post("/delete", protectRoute, (req, res) => {
  Group.findById(req.body.groupID)
    .then((group) => {
      if (!group.owners.includes(req.user._id))
        return res.status(403).json({ success: false });

      group.remove().then(() => {
        res.json({ success: true });
      });
    })
    .catch((error) => res.status(500).json({ success: false }));
});

/*
@route  POST api/group/editor
@desc   make a user editor
@access Private
{
    "groupID" : "groupID",
    "userID": "myUserID"
}
*/
router.post("/editor", protectRoute, (req, res) => {
  if (req.body.userID == req.user._id)
    return res.status(400).json({ success: false });
  Group.findById(req.body.groupID)
    .then((group) => {
      if (!group.owners.includes(req.user._id))
        return res.status(403).json({ success: false });
      if (!group.members.includes(req.body.userID))
        return res.status(403).json({ success: false });

      group
        .updateOne(
          { $pull: { members: req.body.userID, editors: req.body.userID } },
          { new: true }
        )
        .then(() => {
          group
            .updateOne(
              { $push: { members: req.body.userID, editors: req.body.userID } },
              { new: true }
            )
            .then(() => res.json({ success: true }));
        })
        .catch((error) => res.status(403).json({ success: false }));
    })
    .catch((error) => res.status(403).json({ success: false }));
});

/*
@route  POST api/group/member/:id
@desc   make a user member
@access Private
{
    "groupID" : "groupID",
    "userID": "myUserID"
}
*/
router.post("/member", protectRoute, (req, res) => {
  if (req.body.userID == req.user._id)
    return res.status(400).json({ success: false });
  Group.findById(req.body.groupID)
    .then((group) => {
      if (!group.owners.includes(req.user._id))
        return res.status(403).json({ success: false });
      if (!group.members.includes(req.body.userID))
        return res.status(403).json({ success: false });

      group
        .updateOne(
          {
            $pull: {
              members: req.body.userID,
              editors: req.body.userID,
              owners: req.body.userID,
            },
          },
          { new: true }
        )
        .then(() => {
          group
            .updateOne({ $push: { members: req.body.userID } }, { new: true })
            .then(() => res.json({ success: true }));
        })
        .catch((error) => res.status(403).json({ success: false }));
    })
    .catch((error) => res.status(403).json({ success: false }));
});

/*
@route  POST api/group/owner/:id
@desc   make a user owner
@access Private
{
    "groupID" : "groupID",
    "userID": "myUserID"
}
*/
router.post("/owner", protectRoute, (req, res) => {
  if (req.body.userID == req.user._id)
    return res.status(400).json({ success: false });
  Group.findById(req.body.groupID)
    .then((group) => {
      if (!group.owners.includes(req.user._id))
        return res.status(403).json({ success: false });
      if (!group.members.includes(req.body.userID))
        return res.status(403).json({ success: false });

      group
        .updateOne(
          {
            $pull: {
              members: req.body.userID,
              editors: req.body.userID,
              owners: req.body.userID,
            },
          },
          { new: true }
        )
        .then(() => {
          group
            .updateOne(
              {
                $push: {
                  members: req.body.userID,
                  editors: req.body.userID,
                  owners: req.body.userID,
                },
              },
              { new: true }
            )
            .then(() => res.json({ success: true }));
        })
        .catch((error) => res.status(403).json({ success: false }));
    })
    .catch((error) => res.status(403).json({ success: false }));
});

module.exports = router;
