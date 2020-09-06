let users = [];

const joinUser = (id, name) => {
    const user = { id, name };
    users.push(user);
    return user;
}

const removeUser = (id) => {
    users = users.filter(user => user.id !== id);
    return users;
} 

const getAllUsers = () => {
    return users;
}

module.exports = {
    joinUser,
    removeUser,
    getAllUsers
}