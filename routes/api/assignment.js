const express = require("express");
const protectRoute = require("../../middleware/protectRoute");
const router = express.Router();

const Assignment = require("../../models/Assignment");
const Group = require("../../models/Group");

/*
@route  GET api/assignment/findAll
@desc   Get all assignments of a user
@access Private
*/
router.get("/findAll", protectRoute, (req, res) => {
  let myGroups = [];
  Group.find({ members: req.user._id })
    .then((groups) => {
      groups.forEach((group) => {
        myGroups.push(group._id);
      });

      Assignment.find({ groupID: { $in: myGroups } })
        .then((assignments) => res.json({ assignments: assignments }))
        .catch(() => res.status(500).json({ success: false }));
    })
    .catch((error) => res.status(500).json({ success: false }));
});


/*
@route  GET api/assignment/find
@desc   Get assignments in a group
@access Private
{
  "groupID": "groupID"
}
*/
router.get("/find", protectRoute, (req, res) => {
  const { groupID } = req.body;
  Group.findById(groupID)
    .then((group) => {
      if (!group.members.includes(req.user._id)) return res.status(403).json({ success: false, msg: "You do not belong to this group." })

      Assignment.find({ groupID: groupID })
        .then((assignments) => res.json({ assignments: assignments }))
        .catch(() => res.status(500).json({ success: false }));
    })
    .catch((error) => res.status(500).json({ success: false }));
});


/*
@route  POST api/assignment/add
@desc   Create an assignment
@access Private
{
  "title": "title",
  "description": "description" //optional
  "dueOn": "2021-05-24T23:59:59",
  "categories": ["category1"] //optional,
  "groupID": "groupID"
}
*/
router.post("/add", protectRoute, (req, res) => {
  const { title, description, dueOn, categories, groupID } = req.body;
  if (!title || !dueOn || !groupID) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter all fields." });
  }
  Group.findById(groupID).then((group) => {
    if (!group.editors.includes(req.user._id))
      return res
        .status(400)
        .json({
          success: false,
          msg: "You don't have permission to create assignment.",
        });

    const newAssignment = new Assignment({
      title: title,
      description: description || "",
      dueOn: new Date(dueOn),
      categories: categories || [],
      groupID: groupID,
    });

    newAssignment
      .save()
      .then((assignment) => res.json({ assignment: assignment }))
      .catch((error) =>
        res
          .status(500)
          .json({
            success: false,
            msg: "Error occured when saving assignment.",
          })
      );
  })
  .catch(()=>{ return res.status(500).json({ success: false, msg: "Error occured." }) });
});

/*
@route  POST api/assignment/update
@desc   update an assignment
@access Private
{
  "assignmentID": "assignmentID",
  "title": "title",
  "description": "description", //optional
  "dueOn": "2021-05-24T23:59:59",
  "categories": ["category1"] //optional
}
*/
router.post("/update", protectRoute, (req, res) => {
  const { assignmentID, title, description, dueOn, categories } = req.body;

  if (!title || !dueOn) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter all fields." });
  }

  Assignment.findById(assignmentID).then((assignment) => {
    Group.findById(assignment.groupID).then((group) => {
      if (!group.editors.includes(req.user._id))
        return res
          .status(403)
          .json({
            success: false,
            msg: "You don't have permission to update assignments.",
          });

      assignment
        .updateOne({
          title: title,
          description: description || "",
          dueOn: new Date(dueOn),
          categories: categories || []
        }, { new: true })
        .then((assignment) => {
          return res.json({ success: true });
        })
        .catch(() => {
          return res
            .status(500)
            .json({
              success: false,
              msg: "Error occured when updating an assignment.",
            });
        });
    });
  });
});



/*
@route  DELETE api/assignment/delete
@desc   Delete an assignment
@access Private
{
  "assignmentID": "assignmentID"
}
*/
router.delete("/delete", protectRoute, (req, res) => {
  const { assignmentID } = req.body;
  Assignment.findById(assignmentID).then((assignment) => {
    Group.findById(assignment.groupID).then((group) => {
      if (!group.editors.includes(req.user._id))
        return res
          .status(403)
          .json({
            success: false,
            msg: "You don't have permission to delete assignments.",
          });

      assignment
        .remove()
        .then(() => {
          return res.json({ success: true });
        })
        .catch(() => {
          return res
            .status(500)
            .json({
              success: false,
              msg: "Error occured when deleting an assignment.",
            });
        });
    });
  });
});



/*
@route  POST api/assignment/done
@desc   mark as done
@access Private
{
  "assignmentID": "assignmentID"
}
*/
router.post("/done", protectRoute, (req, res) => {
  const { assignmentID } = req.body;

  if (!assignmentID) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter all fields." });
  }

  Assignment.findById(assignmentID).then((assignment) => {
    Group.findById(assignment.groupID).then((group) => {
      if (!group.members.includes(req.user._id))
        return res
          .status(403)
          .json({
            success: false,
            msg: "You don't have permission to update assignments.",
          });

      assignment
        .updateOne({ $pull: { doneUsers: req.user._id }}, { new: true })
        .then(() => {
          assignment.updateOne({ $push: { doneUsers: req.user._id } }, { new: true }, (error, newAssignment)=>{
            return res.json({ success: true });
          })
        })
        .catch(() => {
          return res
            .status(500)
            .json({
              success: false,
              msg: "Error occured when updating an assignment.",
            });
        });
    });
  });
});


/*
@route  POST api/assignment/undone
@desc   mark as undone
@access Private
{
  "assignmentID": "assignmentID"
}
*/
router.post("/undone", protectRoute, (req, res) => {
  const { assignmentID } = req.body;

  if (!assignmentID) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter all fields." });
  }

  Assignment.findById(assignmentID).then((assignment) => {
    Group.findById(assignment.groupID).then((group) => {
      if (!group.members.includes(req.user._id))
        return res
          .status(403)
          .json({
            success: false,
            msg: "You don't have permission to update assignments.",
          });

      assignment
        .updateOne({ $pull: { doneUsers: req.user._id }}, { new: true })
        .then(() => {
          return res.json({ success: true });
        })
        .catch(() => {
          return res
            .status(500)
            .json({
              success: false,
              msg: "Error occured when updating an assignment.",
            });
        });
    });
  });
});


module.exports = router;
