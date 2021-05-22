const express = require('express');
const router = express.Router();

const Assignment = require("../../models/Assignment");

/*
@route  GET api/assignment/findAll
@desc   Get assignments
@access Public for now...
*/
router.get('/findAll', (req, res)=>{
  Assignment.find()
    .sort({date: -1})
    .then(assignments=> res.json(assignments))
});


/*
@route  POST api/assignment/add
@desc   Create an assignments
@access Public for now...
*/
router.post('/', (req, res)=>{
  const newAssignment = new Assignment({
    title: req.body.title,
    userID: req.body.userID
  });
  newAssignment.save().then(assignment => res.json(assignment));
});


/*
@route  POST api/assignment/:id
@desc   Delete an assignments
@access Public for now...
*/
router.delete('/:id', (req, res)=>{
  Assignment.findById(req.params.id)
    .then(assignment=>{
      assignment.remove().then(()=>{
        res.json({success: true})
      })
    })
    .catch(()=>{
      res.status(404).json({success: false})
    })
});

module.exports = router;