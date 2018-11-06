const uuidv4 = require('uuid/v4');

const createUser = ({name = "",socketId=null}={}) => ({
	id: uuidv4(),
	name,
	socketId
});


const createMessage = ({message = "", sender = ""} = {}) => ({
	id: uuidv4(),
	time: new Date(Date.now()),
	message,
	sender
});


const createChat = ({messages = [], name = "Community", users = []} = {}) => ({
	id: uuidv4(),
	name,
	messages,
	users,
	typingUsers: []
});

/**
 *
 * @param date
 * @returns a string represented in 24hr time '11:30', '19:30'
 */

const getTIme = (date) => {
	return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`
};

module.exports = {
	createChat,
	createMessage,
	createUser
};