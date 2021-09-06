const moment = require('moment');

function formatMessages(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

const users = [];

// Pushing in users
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// popping out user
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}
// Get room users
function getRoomUsers(room) {
    let leftUsers = [];
    for (let i = 0; i < users.length; i++) {
        if (users[i].room === room) leftUsers.push(users[i]);
    }
    return leftUsers;
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    formatMessages
};