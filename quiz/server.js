const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

let users;
fs.readFile(path.resolve(__dirname, '../data/users.json'), (err, data) => {
    console.log('reading file ... ');
    if (err) throw err;
    users = JSON.parse(data);
});

const addMsgToRequest = function (req, res, next) {
    if (users) {
        req.users = users;
        next();
    } else {
        return res.json({
            error: {message: 'users not found', status: 404}
        });
    }
};

app.use(cors({origin: 'http://localhost:3000'}));

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/read/usernames', addMsgToRequest);

app.get('/read/usernames', (req, res) => {
    let usernames = req.users.map((user) => {
        return { id: user.id, username: user.username };
    });
    res.send(usernames);
});

// New route to search for a user by username and see their email
app.get('/read/username/:name', addMsgToRequest, (req, res) => {
    const username = req.params.name;
    const user = req.users.find(u => u.username === username);
    
    if (user) {
        res.json({ email: user.email });
    } else {
        res.status(404).json({ error: {message: 'User not found', status: 404} });
    }
});

app.use('/write/adduser', addMsgToRequest);

app.post('/write/adduser', (req, res) => {
    let newuser = req.body;
    req.users.push(newuser);
    fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), (err) => {
        if (err) console.log('Failed to write');
        else console.log('User Saved');
    });
    res.send('done');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});