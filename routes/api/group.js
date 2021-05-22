const express = require("express");
const router = express.Router();

const Group = require("../../models/Group");

/*
@route  GET api/group/findByUser/:userID
@desc   Get find all groups that user(id) belong to
@access Public for now...
*/
router.get("/findByUser/:userID", (req, res) => {
  Group
    .find({ members: req.params.userID })
    .then(groups=>res.json(groups))
    .catch(error=>res.json({error: error}))
});

/*
@route  GET api/group/findOne/:id
@desc   Get find all groups that user(id) belong to
@access Public for now...
*/
router.get("/findOne/:id", (req, res) => {
  Group
    .findOne({ _id: req.params.id })
    .then(group=>res.json(group))
    .catch(error=>res.json({error: error}))
});

/*
@route  POST api/group/add
@desc   Add a group
@access Public for now...
{
  "ownerID": "myUserID",
  "members": [], //notice owner is not in members
  "categories": ["category1"] //this is optional
}
*/
router.post("/add", (req, res) => {
  //I should probably check if this user is actually ownerID
  const newGroup = new Group({
    name: req.body.name,
    owners: req.body.owners,
    members: [...req.body.owners, ...req.body.members],
    categories: req.body.categories || []
  })
  newGroup
    .save()
    .then(group=>res.json(group))
    .catch((error) => res.status(403).json({ error: error }));
});

/*
@route  DELETE api/group/deleteGroup/:id
@desc   Delete a group with id
@access Public for now...
*/
router.delete("/deleteGroup/:id", (req, res) => {
  //I should check if current user is owner of this group
  Group.deleteOne({ _id: req.params.id })
    .then(()=>res.json({success: true}))
    .catch(()=>res.json({success: false}))
});

/*
@route  DELETE api/group/deleteUser/:id
@desc   Delete a user from group(id)
@access Public for now...
{
  "userID": "myUserID"
}
*/
router.delete("/deleteUser/:id", (req, res) => {
  //I should check if current user is owner or himself
  Group
    .findOneAndUpdate({ _id: req.params.id }, {$pull: {members: req.body.userID, owners: req.body.userID}}, {new: true})
    .then(group=>{
      res.json(group)
    })
    .catch((error)=>res.json({error: error}))
});

/*
@route  DELETE api/group/deleteOwner/:id
@desc   Delete a user from owner in group(id)
@access Public for now...
{
  "userID": "myUserID"
}
*/
router.delete("/deleteOwner/:id", (req, res) => {
  //I should check if current user is owner or himself
  Group
    .findOneAndUpdate({ _id: req.params.id }, {$pull: {owners: req.body.userID}}, {new: true})
    .then(group=>{res.json(group)})
    .catch((error)=>res.json({error: error}))
});

/*
@route  POST api/group/addUser/:id
@desc   Add a user to group(id)
@access Public for now...
{
  "userID": "myUserID"
}
*/
router.post("/addUser/:id", (req, res) => {
  Group
    .findOneAndUpdate({ _id: req.params.id, members: {$not: {$elemMatch: {$in: [req.body.userID]}}}}, {$push: {members: req.body.userID}}, {new: true})
    .then(group=>res.json(group))
    .catch((error)=>res.json({error: error}))
});

/*
@route  POST api/group/addOwner/:id
@desc   Add a owner to group(id)
@access Public for now...
{
  "userID": "myUserID"
}
*/
router.post("/addOwner/:id", (req, res) => {
  Group
    .findOneAndUpdate({ _id: req.params.id, members: {$not: {$elemMatch: {$in: [req.body.userID]}}}}, {$push: {members: req.body.userID}}, {new: true})
    .then(()=>{
      Group.findOneAndUpdate({ _id: req.params.id, owners: {$not: {$elemMatch: {$in: [req.body.userID]}}}}, {$push: {owners: req.body.userID}}, {new: true})
      .then((group)=>res.json(group))
    })
    .catch((error)=>res.json({error: error}))
});

/*
@route  POST api/group/addCategory/:id
@desc   Add categories to group(id)
@access Public for now...
{
  "category": "category1"
}
*/
router.post("/addCategory/:id", (req, res) => {
  Group
    .findOneAndUpdate({ _id: req.params.id, categories: {$not: {$elemMatch: {$in: [req.body.category]}}}}, {$push: {categories: req.body.category}}, {new: true})
    .then(group=>{res.json(group)})
    .catch((error)=>res.json({error: error}))
});

/*
@route  DELETE api/group/deleteCategory/:id
@desc   Delete a category from group(id)
@access Public for now...
{
  "category": "categoryName"
}
*/
router.post("/deleteCategory/:id", (req, res) => {
  Group
    .findOneAndUpdate({ _id: req.params.id }, {$pull: {categories: req.body.category}}, {new: true})
    .then(group=>{res.json(group)})
    .catch((error)=>res.json({error: error}))
});


module.exports = router;
