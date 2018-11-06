import React, {Component} from 'react';
import io from 'socket.io-client';
import {LOGOUT, USER_CONNECTED} from './../Events';
import LoginForm from './LoginForm';
import ChatContainer from './chats/ChatContainer';

const socketUrl = "http://192.168.43.125:3231";

class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			socket: null,
			user: null
		};
	};
	
	componentWillMount() {
		this.initSocket()
	}
	
	
	initSocket = () => {
		const socket = io(socketUrl);
		this.setState({socket: socket})
	};
	
	
	setUser = (user) => {
		const {socket} = this.state;
		socket.emit(USER_CONNECTED, user);
		this.setState({
			user
		})
	};
	
	logout = () => {
		const {socket} = this.state;
		socket.emit(LOGOUT);
		this.setState({user: null})
		
	};
	
	
	render() {
		const {socket,user} = this.state;
		return (
			<div className="container">
				{!user?<LoginForm socket={socket} setUser={this.setUser}/>:<ChatContainer socket={socket} user={user} logout={this.logout}/>}
			</div>
		);
	}
}

export default Layout;
