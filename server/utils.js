const { customAlphabet } = require("nanoid");
const Words = require("./data/Words.json");

exports.generateRandomWords = () => {
  let words = [];
  for (let i = 0; i < 3; i++) {
    words.push(Words.words[Math.floor(Math.random() * Words.words.length)]);
  }
  return words;
};

exports.WordGuessed = (guessWord, word) => {
  const removeExtraSpace = (str) => {
    return str.replace(/\s+/g, " ").trim();
  };
  if (
    removeExtraSpace(guessWord.toLowerCase()) ===
    removeExtraSpace(word.toLowerCase())
  ) {
    return true;
  }
};

// It will return true if all players guessed the word except those who the drawing
exports.checkAllPlayersGuessedOrNot = (players, wordGuessed) => {
  if (wordGuessed.length === players.length - 1) {
    return true;
  } else {
    return false;
  }
};

exports.hideWord = (hiddenWord, word, hint) => {
  if (hint) {
    let randomLetter = "";

    do {
      randomLetter = word.split("")[Math.floor(Math.random() * word.length)];
    } while (!randomLetter.match(/\w/g));
    hiddenWord = hiddenWord.replaceAt(word.indexOf(randomLetter), randomLetter);
  } else {
    hiddenWord = word.replace(/\w/g, "_");
  }
  return hiddenWord;
};

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

exports.checkPlayerRank = (players) => {
  let temp = [...players];
  temp.sort((a, b) => {
    return b.score - a.score;
  });
  players.forEach((player) => {
    temp.find((p, index) => {
      if (p.socketId === player.socketId) {
        player.rank = index + 1;
      }
    });
  });

  return players;
};

exports.noOfDrawIsEqualToRound = (players, noOfRound) => {
  return players.every((player) => {
    return player.noOfDraw === noOfRound;
  });
};

exports.generateRoomId = () => {
  const nanoid = customAlphabet(
    "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    6
  );
  return nanoid();
};
