// taking time in IST, no matter location...

var currentTime = new Date();
var currentOffset = currentTime.getTimezoneOffset();
var ISTOffset = 330;   // IST offset UTC +5:30 
var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);

var hoursIST = ISTTime.getHours()
var minutesIST = ISTTime.getMinutes()

let morning = true;
if(hoursIST>=12) morning = false;

if(hoursIST>12) {
    hoursIST-=12;
}

if(minutesIST<10) minutesIST = '0' + minutesIST;

function formatMessages(username, text) {
    return {
        username,
        text,
        time: `${hoursIST}:${minutesIST} ${morning ? 'am':'pm'}`
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