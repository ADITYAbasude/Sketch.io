import "./game.css";
import { Drawing } from "../../components/Drawing";
import { Toolbar } from "../../components/Toolbar";
import { Chat } from "../../components/Chat";
import { Player } from "../../components/Player";
import { Modal } from "../../components/Modal";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import { Header } from "../../components/Header";
import { InviteFriends } from "../../components/InviteFriends";

const Game = () => {
  const { socket } = useSelector((state) => state.socketRef);

  if (socket.current === null) {
    redirect("/");
  }

  return (
    <div className="game-body" style={{ height: "100%" }}>
      <div className="game-panel">
        <div className="game-container">
          <Header />
          <Player />
          <Drawing />
          <Toolbar />
          <Chat />
          <InviteFriends />
        </div>
      </div>
      <Modal />
    </div>
  );
};

export default Game;
