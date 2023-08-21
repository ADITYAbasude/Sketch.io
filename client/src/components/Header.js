import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSettingModalAction } from "../redux/action/PlayerActivityAction";

export const Header = () => {
  const dispatch = useDispatch();

  const [word, setWord] = useState();
  const [chooseWordTimeOut, setChooseWordTimeOut] = useState(0);
  const [overlayStatus, setOverlayStatus] = useState(false);
  const [playerList, setPlayerList] = useState([]);
  const [round, setRound] = useState(1);
  const [drawing, setDrawing] = useState(false);

  const { socket } = useSelector((state) => state.socketRef);

  socket.on("overlayStatus", (data) => {
    setOverlayStatus(data);
  });

  socket.on("word", (data) => {
    setWord(data);
  });

  socket.on("user", (players) => {
    setPlayerList(players);
  });

  socket.on("clock", (time) => {
    setChooseWordTimeOut(time);
  });

  socket.on("round", (round) => {
    setRound(round);
  });

  useEffect(() => {
    let temp = playerList.find((player) => player.drawing === true);
    if (temp) {
      if (temp.socketId === socket.id) {
        setDrawing(true);
      } else {
        setDrawing(false);
      }
    }
  }, [playerList]);

  return (
    <div className="game-header">
      <div className="game-clock">{chooseWordTimeOut / 1000}</div>
      <div
        className="game-settings"
        onClick={() => {
          dispatch(setSettingModalAction(true));
        }}
      ></div>
      <div className="game-rounds">Round {round} of 3</div>
      <div className="game-word">
        <div className="description">
          {drawing ? "DRAW THIS" : "GUESS THIS"}
        </div>
        <div className="word">{word}</div>
      </div>
    </div>
  );
};
