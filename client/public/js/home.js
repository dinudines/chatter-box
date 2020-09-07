$(function () {

    const socket = io();

    let currentUserId = "";
    let currentUserName = "";

    $(".name-form").submit(function (event) {
        event.preventDefault();
        const name = $("#name").val();

        // show the chat box
        $("#chat").show();
        // hide the form
        $(".name-form").hide();

        currentUserId = socket.id;
        currentUserName = name;

        // set logged user name
        $("#logged-user").append(`<strong> ${name} </strong>`);

        socket.emit('newUser', name);
    });

    $("#chat-form").submit(function (event) {
        event.preventDefault();

        const message = $("#message").val();
        // find the selected user
        const to = getSelectedUser();
        addNewMessage({ id: to, message, type: "my-message" });
        socket.emit('message', { currentUserId, to, message });
        
        // emptying the message after sending to server
        $("#message").val("");
    });

    $("body").on("click", "#friends-list > div span", function(event) {
        const _this = $(this);
        _this.parent().siblings().removeClass('active').end().addClass('active');
        event.preventDefault();

        const id = _this.parent().attr('id');
        toggleChatBoxVisibility(id);
    });

    socket.on("activeUsers", function (users) {
        addUsers(users);
    });

    socket.on("message", function ({ id, name, to, message }) {
        addNewMessage({ id, name, to, message});
    });

    socket.on("removeChatBox", function (id) {
        const chatBoxes = $("#chat-boxes").children();

        $.each(chatBoxes, function (index, box) {
            if (box["id"].includes(id)) {
                box.remove();
                return;
            }
        });
    });

    const addUsers = (users) => {
        let active = true;
        $("#friends-list").empty();
        users.forEach(user => {
            if (user.id !== currentUserId) {
                if (active) {
                    $("#friends-list").append(`<div class="friend active" id="${user.id}"> <span> ${user.name} </span> </div>`);   
                } else {
                    $("#friends-list").append(`<div class="friend" id="${user.id}"> <span> ${user.name} </span> </div>`); 
                }
                 
                // append chat box only for new user
                if (!findChatBox(user.id)) {
                    $("#chat-boxes").append(`<div id="chat-box ${user.id}"></div>`);
                    document.getElementById(`chat-box ${user.id}`).style.display = "none";
                }
                active = false;
            }
        });
        const currentUser = getSelectedUser();
        if (currentUser) {
            document.getElementById(`chat-box ${currentUser}`).style.display = "block";   
        }
    }

    const addNewMessage = ({ id, message, type }) => {
        const chatBoxes = $("#chat-boxes").children();

        const myMessage = document.createElement("div");
        myMessage.className = "my-message";
        myMessage.innerHTML = message;

        const receivedMessage = document.createElement("div");
        receivedMessage.className = "received-message";
        receivedMessage.innerHTML = message;


        $.each(chatBoxes, function (index, box) {
            if (box["id"].includes(id)) {
                box.append(type === "my-message" ? myMessage : receivedMessage);
                return;
            }
        });
    };

    const getSelectedUser = () => {
        const users = $("#friends-list").children();
        let id = null;
        $.each(users, function (index, user) {
            if (user["className"].includes("active")) {
                id = user["id"];
            }
        });
        return id;
    };

    const findChatBox = (id) => {
        const chatBoxes = $("#chat-boxes").children();
        let found = false;
        $.each(chatBoxes, function(index, box) {
            if (box["id"].includes(id)) {
                found = true;
            }
        });
        return found;
    }

    const toggleChatBoxVisibility = (id) => {
        const chatBoxes = $("#chat-boxes").children();
        $.each(chatBoxes, function (index, box) {
            if (box["id"].includes(id)) {
                document.getElementById(`${box["id"]}`).style.display = "block";
            } else {
                document.getElementById(`${box["id"]}`).style.display = "none";   
            }
        });
    }
});

