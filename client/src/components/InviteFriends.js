import { useRef, useState } from "react";
import { useSelector } from "react-redux";

export const InviteFriends = () => {
  const [room, setRoom] = useState("");

  const url = useRef(null);

  const { socket } = useSelector((state) => state.socketRef);

  socket.on("room", (data) => {
    setRoom(data);
  });
  return (
    <div className="invite-friends-link">
      <p ref={url}>
        https://sketch-io-multiplayer-online-game.onrender.com/?{room}
      </p>
      <button
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(url.current.innerText);
        }}
      >
        Copy
      </button>
    </div>
  );
};
