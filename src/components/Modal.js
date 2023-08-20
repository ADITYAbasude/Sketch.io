import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "./Avatar";
import {
  setSettingModalAction,
  setShowGameAction,
  setVoteModalStatusAction,
} from "../redux/action/PlayerActivityAction";

export const Modal = () => {
  const { status, player } = useSelector((state) => state.setVoteModalStatus);
  const { settingStatus } = useSelector((state) => state.setSettingModal);
  const { socket } = useSelector((state) => state.socketRef);
  const dispatch = useDispatch();
  return (
    <div
      className="modal"
      style={{
        display: `${status || settingStatus ? "block" : "none"}`,
      }}
    >
      <div
        className="vote-modal"
        style={{ display: `${status ? "block" : "none"}` }}
      >
        <div className="vote-modal-wrapper">
          <div className="vote-modal-container">
            <div
              className="vote-modal-close"
              onClick={() => {
                dispatch(
                  setVoteModalStatusAction(false, {
                    userName: "",
                    avatar: [0, 0, 0, 0, 0, 0],
                    score: 0,
                    rank: 0,
                    wordGuessed: false,
                    socketId: "",
                    kickVotes: 0,
                  })
                );
              }}
            >
              ×
            </div>
            <div className="vote-modal-title">
              <div className="player-name">{player.userName}</div>
            </div>
            <div className="vote-modal-body">
              <div className="vote-modal-avatar-container">
                <Avatar player={player.avatar} />
              </div>
              <div className="vote-modal-buttons">
                <button
                  onClick={() => {
                    socket.emit("voteToKick", player.socketId);
                    dispatch(
                      setVoteModalStatusAction(false, {
                        userName: "",
                        avatar: [0, 0, 0, 0, 0, 0],
                        score: 0,
                        rank: 0,
                        wordGuessed: false,
                        socketId: "",
                        kickVotes: 0,
                      })
                    );
                  }}
                >
                  Vote to kick
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="setting-modal"
        style={{ display: settingStatus ? "block" : "none" }}
      >
        <div className="setting-modal-wrapper">
          <div className="setting-modal-container">
            <div
              className="setting-modal-close"
              onClick={() => {
                dispatch(setSettingModalAction(false));
              }}
            >
              ×
            </div>
            <div className="setting-modal-title">Settings</div>
            <div className="setting-modal-body">
              <button
                className="leave-button"
                onClick={() => {
                  socket.emit("leaveRoom");
                  dispatch(setSettingModalAction(false));
                  dispatch(setShowGameAction(false));
                }}
              >
                Leave room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
