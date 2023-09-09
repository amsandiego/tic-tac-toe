'use strict';

// factory pattern
const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };

  return { getSign };
};

// module pattern
const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  const setField = (idx, sign) => {
    board[idx] = sign;
  };

  const getField = (idx) => {
    return board[idx];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  };

  return { setField, getField, reset };
})();

const gameController = () => {
  const playerX = Player('X');
  const playerO = Player('O');

  let round = 1,
    isOver = false;

  const playRound = (fieldIdx) => {
    gameBoard.setField(fieldIdx, getCurrentPlayerSign());
    checkWinner(fieldIdx);
  };

  const getCurrentPlayerSign = () => {
    return round % 2 === 0 ? playerO.getSign() : playerX.getSign();
  };
};
