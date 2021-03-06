import React, {Component} from 'react';

class Message extends Component {
	constructor(props) {
		super(props);
		this.scrollDown = this.scrollDown.bind(this);
	}
	
	componentDidMount() {
		this.scrollDown()
	}
	
	componentDidUpdate(prevProps, prevState) {
		this.scrollDown();
	}
	
	
	scrollDown =()=>{
		const {container} = this.refs;
		container.scrollTop = container.scrollHeight;
	};
	
	render() {
		const {messages, user, typingUsers} = this.props;
		return (
			<div ref={'container'}
			     className="thread-container">
				<div className="thread">
					{
						messages.map((mes, i) => {
							
							return (
								<div key={mes.id} className={`message-container ${mes.sender === user.name && 'right'}`}>
									{console.log("sender=>>>>>>>>>"+ mes.sender)}
									{console.log("username=>>>>>>>>>"+ user.name)}
									<div className="time">{mes.time}</div>
									<div className="data">
										<div className="message">{mes.message}</div>
										<div className="name">{mes.sender}</div>
									</div>
								</div>)
						})
						
					}
					{
						typingUsers.map((name) => {
							return (
								<div key={name} className="typing-user">
									{`${name} is typing . . .`}
								</div>
							)
						})
					}
				
				</div>
			</div>
		);
	}
}

export default Message;