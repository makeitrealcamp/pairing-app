import React from 'react';
import io from 'socket.io-client';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      messages: [] 
    }
  }

  componentDidMount() {
    this.configureWebSocket();
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <div className="chat">
        <div className="header">
          Usa este chat para coordinar tu sesión de pair programming. Recomendamos hacer la sesión a través de Zoom o Meet.
        </div>
        <div className="messages">
          {this.state.messages.map((message, i) => (
            <div className="message" key={i}>
              <div className="participant">{message.participant.name || message.participant.github}</div>
              <div className="text">{message.text}</div>
            </div>
          ))}
          <div ref={(el) => { this.messagesEnd = el; }} />
        </div>
        <textarea onKeyUp={this.sendMessage.bind(this)} onChange={this.onChangeInput.bind(this)} rows="1" value={this.state.input} placeholder="Escribe un mensaje"></textarea>
      </div>
    );
  }

  onChangeInput(e) {
    this.setState({
      input: e.target.value
    });
  }

  sendMessage(e) {
    if (e.key === 'Enter') {
      this.setState({
        messages: this.state.messages.concat({ participant: this.props.assistance.participant, text: e.target.value }),
        input: ""
      });
      this.socket.emit("message", {
        chatId: this.props.assistance.chat,
        participant: this.props.assistance.participant,
        text: e.target.value
      });
    }
  }

  configureWebSocket() {
    this.socket = io();
    this.socket.on('message', message => {
      this.setState({ messages: this.state.messages.concat(message) });
    });

    this.socket.emit("chat", { chatId: this.props.assistance.chat });
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
}
