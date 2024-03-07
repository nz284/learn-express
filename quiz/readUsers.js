const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.use((req, res, next) => {
    const usersDataPath = path.resolve(__dirname, '../data/users.json');
    fs.readFile(usersDataPath, (err, data) => {
        if (err) {
            return res.json({
                error: {message: 'users not found', status: 404}
            });
        }
        req.users = JSON.parse(data);
        next();
    });
});

router.get('/usernames', (req, res) => {
    let usernames = req.users.map(user => {
        return {id: user.id, username: user.username};
    });
    res.json(usernames);
});

router.get('/username/:name', (req, res) => {
    const username = req.params.name;
    const user = req.users.find(u => u.username === username);
    
    if (user) {
        res.json({ email: user.email });
    } else {
        res.status(404).json({ error: {message: 'User not found', status: 404} });
    }
});

module.exports = router;