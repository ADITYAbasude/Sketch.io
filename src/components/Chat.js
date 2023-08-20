import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export const Chat = () => {
  const [numbersOfCharacters, setNumbersOfCharacters] = useState(0);
  const chatContain = useRef(null);
  const list = [];

  const [messages, setMessages] = useState(list);
  const [playerList, setPlayerList] = useState([]);

  const { socket } = useSelector((state) => state.socketRef);
  const { playerDrawing } = useSelector((state) => state.setPlayerDrawing);

  const onGuessValueChange = (e) => {
    e.preventDefault();
    setNumbersOfCharacters(e.target.value.length);
  };

  // socket.join("game");
  const onGuessSubmit = (e) => {
    e.preventDefault();
    socket.emit("chat", e.target[0].value);
    e.target[0].value = "";
    setNumbersOfCharacters(0);
  };

  socket.on("chat", (message) => {
    setMessages([...messages, message]);
  });

  socket.on("user", (data) => {
    setPlayerList(data);
  });

  let temp;
  temp = playerList.find((player) => player.socketId === socket.id);
  useEffect(() => {
    chatContain.current.scrollTop = chatContain.current.scrollHeight;
  }, [messages]);

  return (
    <div
      className="game-chat"
      style={{ marginBottom: playerDrawing ? "" : "6px" }}
    >
      <div className="game-chat-container">
        <div className="game-chat-contain" ref={chatContain}>
          {messages.map((message, i) => {
            if (message.connected) {
              return (
                <p key={i} className="connected">
                  <b>{message.userName}</b> {message.msg}
                </p>
              );
            } else if (message.drawing) {
              return (
                <p key={i} className="drawing">
                  <b>{message.userName}</b> {message.msg}
                </p>
              );
            } else if (message.guessed) {
              return (
                <p
                  key={i}
                  className="guessed"
                  style={{ backgroundColor: "var(--COLOR_USER_GUESSED_BG)" }}
                >
                  <b>{message.userName}</b> {message.msg}
                </p>
              );
            } else if (message.revealWord) {
              return (
                <p key={i} className="reveal-word">
                  {message.msg}
                </p>
              );
            } else if (message.normal) {
              return (
                <p key={i}>
                  <b>{message.userName}</b>: {message.msg}
                </p>
              );
            } else if (message.leave) {
              return (
                <p key={i} className="leave">
                  <b>{message.userName}</b> {message.msg}
                </p>
              );
            } else if (message.voteToKick) {
              return (
                <p key={i} className="voteToKick">
                  <b>{message.userName}</b> {message.msg}
                </p>
              );
            }
          })}
        </div>
        <form onSubmit={onGuessSubmit}>
          <input
            type="text"
            placeholder="Type your guess here..."
            readOnly={playerDrawing || temp?.wordGuessed}
            onChange={onGuessValueChange}
          />
          <div
            className={`numbers-characters ${
              numbersOfCharacters > 0 ? "visible" : ""
            }`}
          >
            {numbersOfCharacters}
          </div>
        </form>
      </div>
    </div>
  );
};
