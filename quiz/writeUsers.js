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

router.post('/adduser', (req, res) => {
    let newuser = req.body;
    req.users.push(newuser);

    fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), (err) => {
        if (err) {
            return res.status(500).json({ error: {message: 'Failed to write', status: 500} });
        }
        console.log('User Saved');
        res.json({ message: 'User added successfully' });
    });
});

module.exports = router;