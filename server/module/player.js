//user model
class Player {
  constructor(socketId, userName, avatar) {
    this.socketId = socketId;
    this.userName = userName;
    this.avatar = avatar;
    this.drawing = false;
    this.score = 0;
    this.noOfDraw = 0;
    this.wordGuessed = false;
    this.rank = 0;
    this.kickVotes = [];
  }

  setDrawing(drawing) {
    this.drawing = drawing;
  }
}

module.exports = Player;
