import React, {Component} from 'react';

class ChatHeading extends Component {
	render() {
		const {name,numberOfUsers} = this.props;
		return (
			<div className="chat-header">
				<div className="user-info">
					<div className="user-name">{name}</div>
					<div className="status">
						<div className="indicator"/>
						<span>{numberOfUsers ? numberOfUsers : null}</span>
					</div>
				</div>
				<div className="options">
					<i className="fas fa-video"/>
					<i className="fas fa-user-plus"/>
					<i className="fas fa-ellipsis-v"/>
				</div>
			</div>
		);
	}
}

export default ChatHeading;

