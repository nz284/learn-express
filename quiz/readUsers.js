const express = require('express')
const router = express.Router();

router.get('/read/usernames', (req, res) => {
  let usernames = req.users.map(function(user) {
    return {id: user.id, username: user.username};
  });
  res.send(usernames);
})

router.get('/read/usernames', (req, res) => {
  let response
  try {
    let user = req.users.find(user => user.id === req.params.id);
    if (user.length === 0) {
      res.send({error: 'User not found'})
    } else {
      res.send(user);
    }
  } catch (err) {
    console.log("error ", err)
    res.send({error: err})
  }
})

module.exports = router;