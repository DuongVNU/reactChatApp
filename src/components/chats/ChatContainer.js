import React, {Component} from 'react';
import SideBar from "./SideBar";
import {COMMUNITY_CHAT, MESSAGE_RECEIVED, MESSAGE_SENT, PRIVATE_MESAGE, TYPING} from './../../Events'
import MessageInput from "./MessageInput";
import Messages from "./Message";
import ChatHeading from "./ChatHeading";

export default class ChatContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chats: [],
			activeChat: null
		};
	}
	
	componentDidMount() {
		const {socket} = this.props;
		this.initSocket(socket);
	};
	
	initSocket(socket) {
		const {user} = this.props;
		socket.emit(COMMUNITY_CHAT, this.resetChat);
		socket.on(PRIVATE_MESAGE, this.addChat);
		socket.on('connect', () => {
			socket.emit(COMMUNITY_CHAT, this.resetChat())
		});
	}
	
	sendOpenPrivateMessage = (receiver) => {
		const {socket, user} = this.props;
		socket.emit(PRIVATE_MESAGE, {receiver, sender: user.name})
	};
	
	resetChat = (chat) => {
		return this.addChat(chat, true)
	};
	addChat = (chat, reset = false) => {
		console.log(chat);
		const {socket} = this.props;
		const {chats} = this.state;
		
		const newChats = reset ? [chat] : [...chats, chat];
		this.setState({chats: newChats});
		const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`;
		const typingEvent = `${TYPING}-${chat.id}`;
		socket.on(typingEvent, this.updateTypingInChat(chat.id));
		socket.on(messageEvent, this.addMessageToChat(chat.id));
	};
	
	/**
	 * Return a function that will
	 * adds message to chat with the chatId passed in.
	 * @param chatId {number}
	 */
	addMessageToChat = (chatId) => {
		return message => {
			const {chats} = this.state;
			let newChats = chats.map((chat) => {
					if (chat.id === chatId) {
						chat.messages.push(message);
					}
					return chat
				}
			);
			this.setState({chats: newChats})
		}
	};
	
	/**
	 * Update the typing of chat with id passed in.
	 * @param chatId {number}
	 */
	updateTypingInChat(chatId) {
		return ({isTyping, user}) => {
			if (user !== this.props.user.name) {
				const {chats} = this.state;
				let newChats = chats.map((chat) => {
					if (chat.id === chatId) {
						if (isTyping && !chat.typingUsers.includes(user))
							chat.typingUsers.push(user);
						else if (!isTyping && chat.typingUsers.includes(user))
							chat.typingUsers = chat.typingUsers.filter(u => u !== user)
					}
					return chat;
				});
				this.setState({chats: newChats})
			}
		}
	}
	
	/**
	 * Add a message to the specified chat
	 * @param chatId The id of the chat to be added to.
	 * @param message The message to be added to the chat
	 */
	sendMessage = (chatId, message) => {
		const {socket} = this.props;
		socket.emit(MESSAGE_SENT, {chatId, message})
	};
	
	/**
	 * Sends typing status to server.
	 * @param chatId the id of the chat being typed in
	 * @param isTyping If the user is typing still or not
	 */
	sendTyping = (chatId, isTyping) => {
		const {socket} = this.props;
		socket.emit(TYPING, {chatId, isTyping})
	};
	
	
	setActiveChat = (activeChat) => {
		this.setState({activeChat})
	};
	
	render() {
		const {chats, activeChat} = this.state;
		const {user, logout} = this.props;
		return (
			<div className="container">
				<SideBar
					logout={logout}
					chats={chats}
					user={user}
					activeChat={activeChat}
					setActiveChat={this.setActiveChat}
					onsendPrivateMessage={this.sendOpenPrivateMessage}
				/>
				<div className="chat-room-container">
					{
						activeChat !== null ? (
							<div className="chat-room">
								<ChatHeading name={activeChat.name}/>
								<Messages
									messages={activeChat.messages}
									user={user}
									typingUsers={activeChat.typingUsers}
								/>
								<MessageInput
									sendMessage={
										(message) => {
											this.sendMessage(activeChat.id, message)
										}
									}
									sendTyping={
										(isTyping) => {
											this.sendTyping(activeChat.id, isTyping)
										}
									}
								/>
							</div>
						
						) : <div className="chat-room choose"><h3>Choose a chat!</h3></div>
					}
				
				</div>
			</div>
		);
	}
}