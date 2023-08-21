import { useState } from "react";
import { Avatar } from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
const { words } = require("../data/Words.json");
export const Overlay = (props) => {
  const { words } = props;
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socketRef);
  const [playerList, setPlayerList] = useState([]);
  const [overlayStatus, setOverlayStatus] = useState(false);
  const [scoreList, setScoreList] = useState([]);
  const [round, setRound] = useState(1);
  const [word, setWord] = useState("");

  const selectWord = (i) => (e) => {
    // dispatch(selectedWordAction(e.target.innerText))
    socket.emit("wordSelected", words[i]);
  };

  socket.on("overlayStatus", (data) => {
    setOverlayStatus(data);
  });

  socket.on("user", (players) => {
    setPlayerList(players);
  });

  socket.on("declareScore", (data) => {
    setScoreList(data);
  });

  socket.on("word", (data) => {
    setWord(data);
  });

  socket.on("round", (round) => {
    setRound(round);
  });

  return (
    <div
      className="overlay"
      style={{ display: overlayStatus.showOverlay ? "" : "none" }}
    >
      <div className="overlay-container">
        <div
          className="word-container"
          style={{
            display:
              overlayStatus.wordChosen || overlayStatus.roundChange
                ? "none"
                : "block",
          }}
        >
          <div className="text show">
            {playerList.map((player, i) => {
              if (player.drawing && player.socketId === socket.id) {
                return (
                  <>
                    <span key={i}>Choose a word</span>
                    <div className="choose-word">
                      {words.map((word, i) => {
                        return (
                          <div className="word" key={i} onClick={selectWord(i)}>
                            {word}
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              }
              if (!player.drawing && player.socketId === socket.id) {
                let temp = playerList.find((player) => player.drawing === true);
                return (
                  <span key={i} className="word">
                    {temp.userName} is choosing a word!
                  </span>
                );
              }
            })}
          </div>
        </div>
        <div
          className="score-declared-container"
          style={{ display: overlayStatus.scoreDeclare ? "block" : "none" }}
        >
          <div className="reveal-word">
            <p className="word">
              The word was <span>{word}</span>
            </p>
          </div>
          <div className="region">
            <p>Time up!</p>
          </div>
          <div className="score">
            {scoreList.map((player, i) => {
              return (
                <div key={i}>
                  <p>{player.userName}</p>
                  <p
                    style={{
                      color: player.score > 0 ? "#4bc42b" : "rgb(255 0 0)",
                    }}
                  >{`${player.score > 0 ? "+" : "-"}${player.score}`}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="round-container"
          style={{
            display: overlayStatus.roundChange ? "block" : "none",
          }}
        >
          <div className="round">
            <p>Round {round}</p>
          </div>
        </div>

        <div
          className="result-container"
          style={{ display: overlayStatus.showResult ? "block" : "none" }}
        >
          {playerList.length > 0 && (
            <p
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: "3em",
                fontSize: "2em",
              }}
            >
              {playerList[0].userName} is winner
            </p>
          )}
          <div className="podium">
            {playerList.length > 1 && (
              <div className="second">
                <div className="container">
                  <div
                    className="player"
                    style={{ width: "82px", height: "82px" }}
                  >
                    <Avatar player={playerList[1]?.avatar} />
                  </div>
                  <div className="silver">
                    <p>#{playerList[1].rank}</p>
                    <p>{playerList[1].userName}</p>
                    <p>{playerList[1].score} points</p>
                  </div>
                </div>
              </div>
            )}

            {playerList.length > 0 && (
              <div className="first">
                <div className="container">
                  <div
                    className="player"
                    style={{ width: "102px", height: "102px" }}
                  >
                    <Avatar player={playerList[0]?.avatar} />
                  </div>
                  <div className="gold">
                    <p>#{playerList[0].rank}</p>
                    <p>{playerList[0].userName}</p>
                    <p>{playerList[0].score} points</p>
                  </div>
                  <div className="crown"></div>
                </div>
              </div>
            )}

            {playerList.length > 2 && (
              <div className="third">
                <div className="container">
                  <div
                    className="player"
                    style={{ width: "62px", height: "62px" }}
                  >
                    <Avatar player={playerList[2]?.avatar} />
                  </div>
                  <div className="bronze">
                    <p>#{playerList[2].rank}</p>
                    <p>{playerList[2].userName}</p>
                    <p>{playerList[2].score} points</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
