import { React, useEffect, useRef, useState } from "react";
import "./dashboard.css";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowGameAction,
  socketRefAction,
} from "../../redux/action/PlayerActivityAction";
import Game from "../game/Game";
import logo from "../../assets/logo/logo.png";
const Dashboard = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  //[ avatarEyeX, avatarEyeY, avatarMouthX, avatarMouthY, avatarBgX, avatarBgY]
  const [Avatar, setAvatar] = useState([0, 0, 0, 0, 0, 0]);
  const [userName, setUserName] = useState("");
  const [kickedStatus, setKickedStatus] = useState(false);

  const { showGame } = useSelector((state) => state.setShowGame);

  //endpoint
  let ENDPOINT = "https://sketch-io-multiplayer-online-game.onrender.com/";
  useEffect(() => {
    socketRef.current = io(ENDPOINT, {
      transports: ["websocket"],
    });
    socketRef.current.on("connect", () => {
      console.log("connected");
    });
    socketRef.current.on("disconnect", () => {
      console.log("disconnected");
    });

    //socket reference
    dispatch(socketRefAction(socketRef));
  }, [ENDPOINT]);

  useEffect(() => {
    if (localStorage.getItem("avatar") !== null) {
      setAvatar(JSON.parse(localStorage.getItem("avatar")));
    }

    if (localStorage.getItem("userName") !== null) {
      setUserName(localStorage.getItem("userName"));
    }
  }, []);

  useEffect(() => {
    socketRef.current.on("kicked", (status) => {
      setKickedStatus(status);
    });
  }, []);
  const joinRoom = (e) => {
    setKickedStatus(false);
    // get room code from url
    e.preventDefault();
    let roomCode = window.location.href.substring(
      window.location.href.lastIndexOf("?") + 1
    );

    if (/^[0-9a-zA-Z]+$/.test(roomCode) && roomCode.length === 6) {
      socketRef.current.emit("joinRoom", {
        roomId: roomCode,
        userName: userName,
        avatar: Avatar,
        public: true,
      });
      dispatch(setShowGameAction(true));
    } else {
      socketRef.current.emit("joinRoom", {
        roomId: "",
        userName: userName,
        avatar: Avatar,
        public: true,
      });
      dispatch(setShowGameAction(true));
    }
  };

  const handleLeftArrow = (part) => (e) => {
    e.preventDefault();
    const copyArray = [...Avatar];
    if (part === "eye") {
      if (copyArray[1] === 0 && copyArray[0] === 0) return;
      if (copyArray[1] === -500 && copyArray[0] === -600) {
        copyArray[1] = 0;
        copyArray[0] = 0;
      } else if (copyArray[0] === -0) {
        copyArray[0] = -900;
        copyArray[1] = -(Math.abs(copyArray[1]) - 100);
      } else {
        copyArray[0] = -(Math.abs(copyArray[0]) - 100);
      }
    } else if (part === "mouth") {
      if (copyArray[2] === 0 && copyArray[3] === 0) return;
      if (copyArray[3] === -500 && copyArray[2] === -0) {
        copyArray[3] = 0;
        copyArray[2] = 0;
      } else if (copyArray[2] === -0) {
        copyArray[2] = -900;
        copyArray[3] = -(Math.abs(copyArray[3]) - 100);
      } else {
        copyArray[2] = -(Math.abs(copyArray[2]) - 100);
      }
    } else if (part === "bg") {
      if (copyArray[4] === 0 && copyArray[5] === 0) return;
      if (copyArray[5] === -200 && copyArray[4] === -500) {
        copyArray[5] = 0;
        copyArray[4] = 0;
      } else if (copyArray[4] === -0) {
        copyArray[4] = -900;
        copyArray[5] = -(Math.abs(copyArray[5]) - 100);
      } else {
        copyArray[4] = -(Math.abs(copyArray[4]) - 100);
      }
    }
    setAvatar(copyArray);
    localStorage.setItem("avatar", JSON.stringify(copyArray));
  };
  const handleRightArrow = (part) => (e) => {
    e.preventDefault();
    const copyArray = [...Avatar];
    if (part === "eye") {
      if (copyArray[1] === -500 && copyArray[0] === -600) {
        copyArray[1] = 0;
        copyArray[0] = 0;
      } else if (copyArray[0] === -900) {
        copyArray[0] = 0;
        copyArray[1] = copyArray[1] - 100;
      } else {
        copyArray[0] = copyArray[0] - 100;
      }
    } else if (part === "mouth") {
      if (copyArray[3] === -500 && copyArray[2] === -0) {
        copyArray[3] = 0;
        copyArray[2] = 0;
      } else if (copyArray[2] === -800) {
        copyArray[2] = 0;
        copyArray[3] = copyArray[3] - 100;
      } else {
        copyArray[2] = copyArray[2] - 100;
      }
    } else if (part === "bg") {
      if (copyArray[5] === -200 && copyArray[4] === -500) {
        copyArray[5] = 0;
        copyArray[4] = 0;
      } else if (copyArray[4] === -800) {
        copyArray[4] = 0;
        copyArray[5] = copyArray[5] - 100;
      } else {
        copyArray[4] = copyArray[4] - 100;
      }
    }
    setAvatar(copyArray);
    localStorage.setItem("avatar", JSON.stringify(copyArray));
  };

  return (
    <>
      {showGame && !kickedStatus ? (
        <Game />
      ) : (
        <div className="dashboard-body" style={{ height: "100vh" }}>
          <div className="logo">
            <img src={logo} alt="logo" className="logo" />
          </div>
          <div className="user-panel">
            <div className="user-name">
              <input
                type="text"
                maxLength={21}
                autoCorrect="off"
                spellCheck="off"
                value={userName}
                placeholder="Enter your name"
                onChange={(e) => {
                  e.preventDefault();
                  setUserName(e.target.value);
                  localStorage.setItem("userName", e.target.value);
                }}
              />
            </div>

            <div className="avatar-panel">
              {/* left arrows */}
              <div className="arrows left">
                <div
                  className="arrow left eye"
                  onClick={handleLeftArrow("eye")}
                ></div>
                <div
                  className="arrow left mouth"
                  onClick={handleLeftArrow("mouth")}
                ></div>
                <div
                  className="arrow left bg"
                  onClick={handleLeftArrow("bg")}
                ></div>
              </div>
              {/* avatar */}
              <div className="custom-avatar">
                <div
                  className="avatar bg "
                  style={{
                    backgroundPosition: `${Avatar[4]}% ${Avatar[5]}%`,
                  }}
                ></div>
                {console.log(Avatar)}
                <div
                  className="avatar eye "
                  style={{
                    backgroundPosition: `${Avatar[0]}% ${Avatar[1]}%`,
                  }}
                ></div>
                <div
                  className="avatar mouth"
                  style={{
                    backgroundPosition: `${Avatar[2]}% ${Avatar[3]}%`,
                  }}
                ></div>
              </div>
              {/* right arrows */}
              <div className="arrows right">
                <div
                  className="arrow right eye"
                  onClick={handleRightArrow("eye")}
                ></div>
                <div
                  className="arrow right mouth"
                  onClick={handleRightArrow("mouth")}
                ></div>
                <div
                  className="arrow right bg"
                  onClick={handleRightArrow("bg")}
                ></div>
              </div>
            </div>

            <div className="play btn">
              <button onClick={joinRoom}>
                <span>Play!</span>
              </button>
            </div>

            <div className="create-private btn">
              <button
                onClick={() => {
                  setKickedStatus(false);
                  socketRef.current.emit("joinRoom", {
                    roomId: "",
                    userName: userName,
                    avatar: Avatar,
                    public: false,
                  });
                  dispatch(setShowGameAction(true));
                }}
              >
                <span>Create Private Room</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
