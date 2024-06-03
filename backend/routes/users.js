var express = require('express');
var router = express.Router();
var Task = require('../taskSchema.js');

// post Data to MongoDB
router.post('/postTaskToMD', async (req, res) => {
  var task = new Task(req.body);
  await task.save();
  res.json(task);
})

// get Data from Mongo DB
router.get('/getTaskListFromDB', async (req, res) => {
  var tasks = await Task.find()
  res.json(tasks)
})

// get single event based for calendar
// router.get('/events/:id', async (req, res) => {
//   try {
//     const event = await Task.findById(req.params.id);
//     if (!event) {
//       return res.status(404).send();
//     }
//     res.send(event);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// update data on MongoDB
router.put('/updateTaskOnDB', async (req, res) => {
  var task = await Task.findByIdAndUpdate(req.body.id, req.body.data, {new : true});
  res.json(task)
})

// delete Task from MongoDB
router.delete('/deleteTaskFromDB', async (req, res) => {
  try {
    var task = await Task.findByIdAndDelete(req.query.id);
    if(!task) {
      return res.status(404).status({"message" : "requested delete task not found"})
    }
    res.json({ message: 'Task deleted' });
  } catch {
    res.status(500).send("Internal server error");
  }
})

module.exports = router;