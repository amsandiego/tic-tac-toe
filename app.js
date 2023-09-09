'use strict';

// factory pattern
const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };

  return { getSign };
};

// module pattern (gameBoard, displayController, gameController)
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

const displayController = (() => {
  const resultModal = document.querySelector('.result-modal'),
    quitGameBtn = document.querySelector('.reset-btn'),
    nextRoundBtn = document.querySelector('.continue-btn'),
    fieldElements = document.querySelectorAll('.field'),
    fieldElementsStates = document.querySelectorAll('.state'),
    restartBtn = document.querySelector('.restart-btn'),
    scoreDisplayElements = document.querySelectorAll('.display-score');

  let playerXScore = 0,
    playerOScore = 0,
    tiedMatches = 0,
    tie = false;

  const activateBtn = (el) => {
    function removeTransition(e) {
      if (e.propertyName !== 'transform') return;
      e.target.classList.remove('clicked');
    }
    el.classList.add('clicked');
    el.addEventListener('transitionend', removeTransition);
  };

  fieldElementsStates.forEach((field) => {
    field.addEventListener('click', (e) => {
      let fieldState = e.target.dataset.fieldState;
      if (
        gameController.getIsOver() ||
        fieldState == 'set-x' ||
        fieldState == 'set-o'
      )
        return;
      gameController.playRound(parseInt(e.target.parentElement.dataset.index));
      updateGameBoard();
      activateBtn(e.target.parentElement);
    });
  });

  const updateGameBoard = () => {
    for (let i = 0; i < fieldElementsStates.length; i++) {
      fieldElementsStates[i].dataset.fieldState = `set-${gameBoard.getField(
        i
      )}`;
      setActiveStates();
    }
  };

  const setActiveStates = () => {
    document.querySelectorAll('[data-field-turn]').forEach((element) => {
      element.dataset.fieldTurn = `turn-${gameController.getCurrentPlayerSign()}`;
    });
  };

  const setBoardColor = (boardElements) => {
    let signArray = [];

    boardElements.forEach((el) => {
      signArray.push(gameBoard.getField(el));
    });

    if (signArray.includes('x') === true) {
      boardElements.forEach((el) => {
        fieldElements[el].classList.add('.won-x');
      });
      updateScoreBoard('x');
    } else {
      boardElements.forEach((el) => {
        fieldElements[el].classList.add('.won-o');
      });
      updateScoreBoard('o');
    }
  };

  const updateScoreBoard = (scoreEntity) => {
    if (scoreEntity === 'x') {
      scoreDisplayElements[0].textContent = ++playerXScore;
    } else if (scoreEntity === 'o') {
      scoreDisplayElements[2].textContent = ++playerOScore;
    } else if (scoreEntity === 'reset') {
      scoreDisplayElements.forEach((el) => (el.textContent = 0));
    } else {
      scoreDisplayElements[1].textContent = ++tiedMatches;
      tie = true;
    }

    if (scoreEntity === 'reset') return;

    setTimeout(() => {
      resultModal.classList.remove('disabled');
    }, 1000);
  };

  return { setBoardColor, updateScoreBoard };
})();

const gameController = (() => {
  const playerX = Player('x');
  const playerO = Player('o');

  let round = 1,
    isOver = false,
    result = false;

  const playRound = (fieldIndex) => {
    gameBoard.setField(fieldIndex, getCurrentPlayerSign());
    checkWinner(fieldIndex);

    if (result) {
      isOver = true;
      return;
    }

    if (round === 9) {
      displayController.updateScoreBoard('tie');
      isOver = true;
      return;
    }

    round++;
  };

  const getCurrentPlayerSign = () => {
    return round % 2 === 0 ? playerO.getSign() : playerX.getSign();
  };

  const checkWinner = (fieldIndex) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const triggerWin = (possibleCombination) => {
      if (
        possibleCombination.every((element) => {
          gameBoard.getField(element) === getCurrentPlayerSign();
        })
      ) {
        result = true;
        displayController.setBoardColor(possibleCombination);
      }
    };

    return winningCombinations
      .filter((combination) => combination.includes(fieldIndex))
      .some((possibleCombination) =>
        possibleCombination.every((index) => {
          gameBoard.getField(index) === getCurrentPlayerSign()
            ? triggerWin(possibleCombination)
            : false;
        })
      );
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
    result = false;
  };

  return { playRound, getCurrentPlayerSign, getIsOver, reset };
})();
