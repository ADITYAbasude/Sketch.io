import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "./Avatar";
import { setVoteModalStatusAction } from "../redux/action/PlayerActivityAction";
import { useState } from "react";

export const Player = () => {
  const dispatch = useDispatch();
  const [playerList, setPlayerList] = useState([]);

  const { socket } = useSelector((state) => state.socketRef);

  socket.on("user", (data) => {
    setPlayerList(data);
  });

  return (
    <>
      <div className="game-players">
        <div className="player-list">
          {playerList.map((player, i) => {
            return (
              <div
                className="player"
                key={i}
                onClick={() => {
                  if (player.socketId === socket.id) return;
                  dispatch(setVoteModalStatusAction(true, player));
                }}
                style={{
                  backgroundColor: player.wordGuessed
                    ? "var(--COLOR_USER_GUESSED_MSG)"
                    : "",
                }}
              >
                <div className="player-avatar-container">
                  <Avatar player={player.avatar} />
                </div>
                {/* playerInfo */}
                <div className="player-info">
                  <div className="player-rank">#{player.rank}</div>
                  <div
                    className="player-name"
                    style={{
                      color: player.socketId === socket.id ? "#4998ff" : "",
                    }}
                  >
                    {player.userName}
                    {player.socketId === socket.id ? " (you)" : ""}
                  </div>
                  <div className="player-score">{player.score}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
