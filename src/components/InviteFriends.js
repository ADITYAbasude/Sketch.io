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
      <p ref={url}>http://localhost:3000/?{room}</p>
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
