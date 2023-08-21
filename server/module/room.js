const utils = require("../utils");

class Room {
  constructor(roomId, socket) {
    this.roomId = roomId;
    this.socket = socket;
    this.players = [];
    this.words = [];
    this.word = "";
    this.hiddenWord = "";
    this.round = 1;
    this.totalRound = 3;
    this.wordGuessed = [];
    this.clock = 60000;
    this.previousPlayer = null;
    this.currentPlayer = null;
    this.chooseWordClockInterval = null;
    this.gameClockInterval = null;
    this.revealLetterInterval = null;
    this.scoreDeclareClockInterval = null;
    this.roundChangeInterval = null;
    this.showResultInterval = null;
    this.overlayStatus = {
      showOverlay: false,
      wordChosen: false,
      scoreDeclare: false,
      roundChange: false,
      showResult: false,
    };
    this.draw = [];
    this.public = false;
  }

  getWord() {
    this.socket.in(this.roomId).emit("word", this.word);
  }

  returnOverlayStatus(
    showOverlay,
    wordChosen,
    scoreDeclare,
    roundChange,
    showResult,
    io
  ) {
    this.overlayStatus = {
      showOverlay: showOverlay,
      wordChosen: wordChosen,
      scoreDeclare: scoreDeclare,
      roundChange: roundChange,
      showResult: showResult,
    };
    io.in(this.roomId).emit("overlayStatus", this.overlayStatus);
  }

  startGameClock(io) {
    this.clock = 60000;
    this.gameClockInterval = setInterval(() => {
      this.clock -= 1000;
      if (this.clock === 0) {
        clearInterval(this.gameClockInterval);
        clearInterval(this.revealLetterInterval);
        this.gameClockInterval = null;
        this.revealLetterInterval = null;

        if (
          !utils.checkAllPlayersGuessedOrNot(this.players, this.wordGuessed)
        ) {
          this.finalScore(io);
        } else {
          this.startScoreDeclareClock(io);
        }
      }
      io.to(this.roomId).emit("clock", this.clock);
    }, 1000);
  }

  startScoreDeclareClock(io) {
    this.returnOverlayStatus(true, true, true, false, false, io);
    this.clock = 5000;

    this.players = utils.checkPlayerRank(this.players);
    io.in(this.roomId).emit("user", this.players);
    io.in(this.roomId).emit("word", this.word);

    this.scoreDeclareClockInterval = setInterval(() => {
      this.clock -= 1000;
      if (this.clock === 0) {
        clearInterval(this.scoreDeclareClockInterval);
        this.scoreDeclareClockInterval = null;

        io.in(this.roomId).emit("clear", true);
        this.draw = [];

        if (utils.noOfDrawIsEqualToRound(this.players, this.round)) {
          if (this.round === this.totalRound) {
            this.endGame(io);
          } else {
            this.returnOverlayStatus(true, true, false, true, false, io);

            this.round++;
            io.in(this.roomId).emit("round", this.round);
            this.startRoundChangeInterval(io);
          }
        } else {
          this.switchRole(io);
        }
      }
      io.to(this.roomId).emit("clock", this.clock);
    }, 1000);
  }

  endGame(io) {
    this.returnOverlayStatus(true, true, false, false, true, io);
    this.clock = 5000;

    this.players.sort((a, b) => {
      return b.score - a.score;
    });
    io.in(this.roomId).emit("user", this.players);

    this.showResultInterval = setInterval(() => {
      this.clock -= 1000;
      if (this.clock === 0) {
        clearInterval(this.showResultInterval);
        this.showResultInterval = null;
        this.returnOverlayStatus(false, true, false, false, false, io);
        this.round = 1;
        io.in(this.roomId).emit("round", this.round);
        this.players.forEach((player) => {
          player.noOfDraw = 0;
          player.score = 0;
          player.rank = 1;
        });

        this.switchRole(io);
      }
      io.to(this.roomId).emit("clock", this.clock);
    }, 1000);
  }

  startRoundChangeInterval(io) {
    this.clock = 3000;
    this.roundChangeInterval = setInterval(() => {
      this.clock -= 1000;
      if (this.clock === 0) {
        clearInterval(this.roundChangeInterval);
        this.roundChangeInterval = null;
        this.overlayStatus = {
          showOverlay: false,
          wordChosen: false,
          scoreDeclare: false,
          roundChange: false,
          showResult: false,
        };
        this.switchRole(io);
      }
      io.to(this.roomId).emit("clock", this.clock);
    }, 1000);
  }

  startRevealLetterInterval() {
    this.revealLetterInterval = setInterval(() => {
      if (this.clock === 30000) {
        this.hiddenWord = utils.hideWord(this.hiddenWord, this.word, true);
        console.log(this.hiddenWord);
        this.players.forEach((player) => {
          if (player.wordGuessed || player.drawing) {
            this.socket.to(player.socketId).emit("word", this.word);
          } else {
            this.socket.to(player.socketId).emit("word", this.hiddenWord);
          }
        });
      }
      if (this.clock === 0) {
        clearInterval(this.revealLetterInterval);
      }
    }, 1000);
  }

  finalScore(io) {
    this.players.find(
      (player) => player.socketId === this.currentPlayer.socketId
    ).score += Math.floor(39.058888884 * this.wordGuessed.length);

    this.wordGuessed.push({
      id: this.currentPlayer.socketId,
      userName: this.currentPlayer.userName,
      score: Math.floor(39.058888884 * this.wordGuessed.length),
    });

    this.players.forEach((player) => {
      if (
        !player.wordGuessed &&
        player.socketId !== this.currentPlayer.socketId
      ) {
        this.wordGuessed.push({
          id: player.socketId,
          userName: player.userName,
          score: 0,
        });
      }
    });

    // reveal the word
    io.in(this.roomId).emit("chat", {
      msg: 'The word was "' + this.word + '"',
      revealWord: true,
    });

    this.wordGuessed.sort((a, b) => b.score - a.score);
    io.in(this.roomId).emit("declareScore", this.wordGuessed);

    clearInterval(this.gameClockInterval);
    this.startScoreDeclareClock(io);
  }

  switchRole(io) {
    if (this.previousPlayer) {
      this.previousPlayer.setDrawing(false);
      this.currentPlayer = null;
      this.wordGuessed = [];
      this.players.forEach((player) => {
        player.wordGuessed = false;
        player.kickVotes = [];
      });
    }
    if (this.currentPlayer === null) {
      let randomPlayer;
      do {
        randomPlayer =
          this.players[Math.floor(Math.random() * this.players.length)];
      } while (randomPlayer.noOfDraw === this.round);
      randomPlayer.setDrawing(true);
      this.currentPlayer = randomPlayer;

      // generate random words
      this.words = utils.generateRandomWords();

      this.currentPlayer.noOfDraw++;

      io.in(this.roomId).emit("user", this.players);
      console.log(this.players);

      this.clock = 10000;
      this.chooseWordClockInterval = setInterval(() => {
        this.clock -= 1000;
        if (this.clock === 0) {
          clearInterval(this.chooseWordClockInterval);

          // if player not choose word then random word from words array will be chosen
          let pickWordFromWords =
            this.words[Math.floor(Math.random() * this.words.length)];
          this.word = pickWordFromWords;
          this.hiddenWord = utils.hideWord(this.hiddenWord, this.word, false);
          io.in(this.roomId).emit("word", this.hiddenWord);

          // send word to current player
          io.to(this.currentPlayer.socketId).emit("word", this.word);
          this.returnOverlayStatus(false, true, false, false, false, io);
          io.in(this.socket["room"]).emit("chat", {
            userName: this.currentPlayer.userName,
            msg: "is drawing now!",
            drawing: true,
          });

          this.clock = 60000;
          this.startGameClock(io);
          this.startRevealLetterInterval();
        }
        io.to(this.roomId).emit("clock", this.clock);
      }, 1000);

      // words array to random player client
      io.in(this.roomId)
        .to(randomPlayer.socketId)
        .emit("chooseWord", this.words);

      io.in(this.roomId).emit("user", this.players);

      this.returnOverlayStatus(true, false, false, false, false, io);
      this.previousPlayer = randomPlayer;
    }
  }
}

module.exports = Room;
