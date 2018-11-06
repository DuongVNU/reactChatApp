const io = require('./index').io;
const {VERIFY_USER,TYPING,PRIVATE_MESAGE, USER_CONNECTED, LOGOUT, USER_DISCONNECTED, COMMUNITY_CHAT, MESSAGE_RECEIVED, MESSAGE_SENT} = require('./../Events');
const {createUser, createMessage, createChat} = require('./../Factories');
let connectedUsers = {};
let communityChat = createChat();
module.exports = (socket) => {
	let sendMessageToChatFromUser,sendTypingFromUser;
	console.log("Socket Id ===>>>>   " + socket.user);
	//Verify Username
	socket.on(VERIFY_USER, (nickname, callback) => {
		if (isUser(connectedUsers, nickname)) {
			callback({isUser: true, user: null})
		} else {
			callback({isUser: false, user: createUser({name: nickname,socketId:socket.id})})
		}
	});
	
	// User Connects with username
	socket.on(USER_CONNECTED, (user) => {
		user.socketId = socket.id;
		connectedUsers = addUser(connectedUsers, user);
		socket.user = user.name;
		console.log("Before=============>",user.name);
		sendMessageToChatFromUser = sendMessageToChat(user.name);
		sendTypingFromUser = sendTypingToChat(user.name);
		io.emit(USER_CONNECTED, connectedUsers);
		console.log("Connected=>>>>>>>>", connectedUsers);
	});
	
	//User disconnects
	socket.on('disconnect', () => {
		if ("user" in socket) {
			connectedUsers = removeUser(connectedUsers, socket.user);
			io.emit(USER_DISCONNECTED, connectedUsers);
			// console.log("Disconnect=>>>>>", connectedUsers)
		}
	});
	
	//User logout
	socket.on(LOGOUT, () => {
		connectedUsers = removeUser(connectedUsers, socket.user);
		io.emit(USER_DISCONNECTED, connectedUsers);
		console.log("Disconnect=>>>>>", connectedUsers);
	});
	
	//Get Community Chat
	socket.on(COMMUNITY_CHAT, (callback) => {
		callback(communityChat)
	});
	
	socket.on(MESSAGE_SENT, ({chatId, message}) => {
		sendMessageToChatFromUser(chatId, message)
	});
	
	socket.on(TYPING, ({chatId, isTyping}) => {
		sendTypingFromUser(chatId, isTyping)
	});
	
	socket.on(PRIVATE_MESAGE,({receiver,sender})=>{
		if(receiver in connectedUsers){
			const newChat = createChat({name:`${receiver}&${sender}`, users:[receiver,sender]});
			const receiverSocket = connectedUsers[receiver].socketId;
			socket.to(receiverSocket).emit(PRIVATE_MESAGE,newChat);
			socket.emit(PRIVATE_MESAGE,newChat )
		}
	})
	
	
	
};


const sendMessageToChat = (sender) => {
	return (chatId, message) => {
		io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({message, sender}))
	}
};

/**
 * Returns a function that will take a chat id and a boolean isTyping
 * and then emit a boardcast to the chat id that the sender is typing
 * @returns {Function}
 * @param user
 */
const sendTypingToChat=(user)=>{
	return (chatId, isTyping)=>{
		io.emit(`${TYPING}-${chatId}`,{user, isTyping})
	}
};

const addUser = (userList, user) => {
	let newList = Object.assign({}, userList);
	newList[user.name] = user;
	return newList;
};


/**
 * Remove user from the list passed in.
 * @param userList
 * @param username
 * @returns {*}
 */


const removeUser = (userList, username) => {
	let newList = Object.assign({}, userList);
	delete newList[username];
	return newList
};


/**
 * Check if the user is in list passed in
 * @param userList
 * @param username
 */

const isUser = (userList, username) => {
	return username in userList;
};













