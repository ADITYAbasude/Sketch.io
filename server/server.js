//
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const { words } = require("./data/Words.json");
const Room = require("./module/room");
const utils = require("./utils");
const Player = require("./module/player");
//port
const PORT = process.env.PORT || 5000;

//app
const app = express();
app.use(express.static(`${__dirname}/client`));
app.use(cors());

const server = http.createServer(app);
const io = socketio(server);

const rooms = [];

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId, userName, avatar, public }) => {
    if (public && roomId === "") {
      if (rooms.length === 0) {
        roomId = utils.generateRoomId();
      } else {
        const room = rooms.find((room) => room.public === true);
        if (roomId === undefined) {
          roomId = utils.generateRoomId();
        } else {
          roomId = room.roomId;
        }
      }
    }
    if (!public) {
      roomId = utils.generateRoomId();
    }
    if (!rooms[roomId]) {
      // if username is empty then generate random username from words.json
      if (!userName.trim()) {
        userName = words[Math.floor(Math.random() * words.length)];
      }
      rooms[roomId] = new Room(roomId, socket);
      socket["room"] = roomId;
      socket["userName"] = userName;
      //join room
      socket.join(roomId);
      rooms[roomId].players.push(new Player(socket.id, userName, avatar));

      socket.in(roomId).emit("chat", {
        userName: userName,
        msg: "joined the room!",
        connected: true,
      });

      rooms[roomId].switchRole(io);
      //send user to client
      io.in(roomId).emit("user", rooms[roomId].players);

      io.in(roomId).emit("round", rooms[roomId].round);
      io.to(socket.id).emit("room", roomId);
      rooms[roomId].public = public;
    } else {
      // if username is empty then generate random username from words.json
      if (!userName.trim()) {
        userName = words[Math.floor(Math.random() * words.length)];
      }
      socket["room"] = roomId;
      socket["userName"] = userName;
      //join room
      socket.join(roomId, socket);
      rooms[roomId].players.push(new Player(socket.id, userName, avatar));

      socket.in(roomId).emit("chat", {
        userName: userName,
        msg: "joined the room!",
        connected: true,
      });

      if (rooms[roomId].round > 1) {
        rooms[roomId].players.find(
          (player) => player.socketId === socket.id
        ).noOfDraw = rooms[roomId].round;
      }

      if (rooms[roomId].currentPlayer === null) {
        rooms[roomId].switchRole(io);
      }

      if (
        rooms[roomId].overlayStatus.wordChosen &&
        !rooms[roomId].overlayStatus.showResult &&
        !rooms[roomId].overlayStatus.scoreDeclare
      ) {
        socket.emit("word", rooms[roomId].hiddenWord);
      }
      io.in(this.roomId).emit("overlayStatus", rooms[roomId].overlayStatus);

      io.in(roomId).emit("clock", rooms[roomId].clock);

      //send players list to client
      rooms[roomId].players = utils.checkPlayerRank(rooms[roomId].players);
      io.in(roomId).emit("user", rooms[roomId].players);

      io.in(roomId).emit("round", rooms[roomId].round);

      if (rooms[roomId].draw.length > 0) {
        for (let i = 0; i < rooms[roomId].draw.length; i++) {
          io.to(socket.id).emit("draw", rooms[roomId].draw[i]);
        }
      }
      io.to(socket.id).emit("room", roomId);
    }
  });

  socket.on("chat", (msg) => {
    if (msg.trim() === "") return;
    if (rooms[socket["room"]] === undefined) return;
    if (utils.WordGuessed(msg, rooms[socket["room"]].word)) {
      io.in(socket["room"]).emit("chat", {
        userName: socket["userName"],
        msg: "guessed the word!",
        guessed: true,
      });

      io.to(socket.id).emit("word", rooms[socket["room"]].word);

      let player = rooms[socket["room"]].players.find(
        (player) => player.socketId === socket.id
      );
      player.wordGuessed = true;

      io.in(socket["room"]).emit("user", rooms[socket["room"]].players);

      rooms[socket["room"]].wordGuessed.push({
        id: socket.id,
        userName: socket["userName"],
        score: Math.round((rooms[socket["room"]].clock / 1000) * 3.75),
      });

      rooms[socket["room"]].players.find(
        (player) => player.socketId === socket.id
      ).score += Math.round((rooms[socket["room"]].clock / 1000) * 3.75);

      // check that all players are guessed that word or not
      if (
        utils.checkAllPlayersGuessedOrNot(
          rooms[socket["room"]].players,
          rooms[socket["room"]].wordGuessed
        )
      ) {
        rooms[socket["room"]].finalScore(io);
      }
    } else {
      io.in(socket["room"]).emit("chat", {
        userName: socket["userName"],
        msg: msg,
        normal: true,
      });
    }
  });

  socket.on("wordSelected", (word) => {
    rooms[socket["room"]].word = word;
    io.in(socket["room"]).emit("chat", {
      userName: socket["userName"],
      msg: "is drawing now!",
      drawing: true,
    });
    rooms[socket["room"]].hiddenWord = utils.hideWord(
      rooms[socket["room"]].hiddenWord,
      word,
      false
    );
    io.in(socket["room"]).emit("word", rooms[socket["room"]].hiddenWord);
    io.to(rooms[socket["room"]].currentPlayer.socketId).emit(
      "word",
      rooms[socket["room"]].word
    );

    rooms[socket["room"]].returnOverlayStatus(
      false,
      true,
      false,
      false,
      false,
      io
    );
    clearInterval(rooms[socket["room"]].chooseWordClockInterval);
    // rooms[socket["room"]].clock = 60000;
    rooms[socket["room"]].startGameClock(io);

    rooms[socket["room"]].startRevealLetterInterval();
  });

  socket.on("voteToKick", (id) => {
    let player = rooms[socket["room"]].players.find(
      (player) => player.socketId === id
    );

    if (player.kickVotes.includes(socket.id)) return;

    player.kickVotes.push(socket.id);

    io.in(socket["room"]).emit("chat", {
      userName: socket["userName"],
      msg: `voted to kick ${player.userName}!`,
      voteToKick: true,
    });

    if (player.kickVotes.length >= rooms[socket["room"]].players.length / 2) {
      io.in(socket["room"]).emit("chat", {
        userName: socket["userName"],
        msg: `kicked ${player.userName} from the room!`,
        kicked: true,
      });
      this.disconnectFromRoom(socket, id);
      socket.leave(socket["room"]);
      socket.to(id).emit("kicked", true);
    }
  });

  //client send drawing data to server as an image
  socket.on("draw", (data) => {
    if (!rooms[socket["room"]]) return;
    socket.in(socket["room"]).emit("draw", data);
    rooms[socket["room"]].draw.push(data);
  });

  socket.on("clear", () => {
    if (!rooms[socket["room"]]) return;
    socket.in(socket["room"]).emit("clear");
    rooms[socket["room"]].draw = [];
  });

  socket.on("disconnect", () => {
    this.disconnectFromRoom(socket, socket.id);
    socket.leave(socket["room"]);
  });

  socket.on("leaveRoom", () => {
    this.disconnectFromRoom(socket, socket.id);
    socket.leave(socket["room"]);
  });
});

exports.disconnectFromRoom = (socket, id) => {
  if (!rooms[socket["room"]]) return;
  rooms[socket["room"]].players = rooms[socket["room"]].players.filter(
    (player) => player.socketId !== id
  );

  if (rooms[socket["room"]].players.length === 0) {
    clearInterval(rooms[socket["room"]].chooseWordClockInterval);
    clearInterval(rooms[socket["room"]].gameClockInterval);
    clearInterval(rooms[socket["room"]].revealLetterInterval);
    clearInterval(rooms[socket["room"]].roundChangeInterval);
    delete rooms[socket["room"]];
  } else {
    if (rooms[socket["room"]].currentPlayer.socketId === id) {
      clearInterval(rooms[socket["room"]].chooseWordClockInterval);
      clearInterval(rooms[socket["room"]].gameClockInterval);
      clearInterval(rooms[socket["room"]].revealLetterInterval);

      rooms[socket["room"]].currentPlayer = null;
      rooms[socket["room"]].switchRole(io);
    }
    socket.in(socket["room"]).emit("chat", {
      userName: socket["userName"],
      msg: "left the room!",
      leave: true,
    });
    socket.in(socket["room"]).emit("user", rooms[socket["room"]].players);
  }
};

//server listen
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
