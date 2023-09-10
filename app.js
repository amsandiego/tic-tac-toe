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
    scoreDisplayElements = document.querySelectorAll('.display-score'),
    messageElement = document.getElementById('message');

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

  restartBtn.addEventListener('click', (e) => {
    restartGame();
    activateBtn(e.target);
  });

  nextRoundBtn.addEventListener('click', (e) => {
    activateBtn(e.target);
    setTimeout(() => {
      e.target.parentElement.parentElement.classList.add('disabled');
      tie = false;
      restartGame();
    }, 500);
  });

  quitGameBtn.addEventListener('click', (e) => {
    activateBtn(e.target);
    playerOScore = 0;
    playerXScore = 0;
    tiedMatches = 0;
    tie = false;

    updateScoreBoard('reset');
    setTimeout(() => {
      restartGame();
      e.target.parentElement.parentElement.classList.add('disabled');
    }, 500);
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

    if (tie === true) {
      document.querySelectorAll('[data-field-turn]')[9].dataset.fieldTurn = '';
      document.querySelectorAll(
        '[data-field-turn]'
      )[9].children[1].textContent = "It's a Tie!";
    } else {
      document.querySelectorAll(
        '[data-field-turn]'
      )[9].children[1].textContent = 'Wins this round!';
    }
  };

  const setBoardColor = (boardElements) => {
    let signArray = [];

    boardElements.forEach((el) => {
      signArray.push(gameBoard.getField(el));
    });

    if (signArray.includes('x') === true) {
      boardElements.forEach((el) => {
        fieldElements[el].classList.add('won-x');
      });
      updateScoreBoard('x');
    } else {
      boardElements.forEach((el) => {
        fieldElements[el].classList.add('won-o');
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

  const restartGame = () => {
    gameBoard.reset();
    gameController.reset();
    removeBoardColor(fieldElements);
    updateGameBoard();
    setMessageElement("Player X's turn");
  };

  const removeBoardColor = (boardElements) => {
    boardElements.forEach((element) => (element.className = 'field'));
  };

  const setMessageElement = (message) => {
    messageElement.textContent = message;
  };

  return { setBoardColor, updateScoreBoard, setMessageElement };
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
      displayController.setMessageElement('');
      return;
    }

    if (round === 9) {
      displayController.updateScoreBoard('tie');
      isOver = true;
      displayController.setMessageElement('');
      return;
    }

    round++;
    displayController.setMessageElement(
      `Player ${getCurrentPlayerSign().toUpperCase()}'s turn`
    );
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

    const triggerWin = (combination) => {
      if (
        combination.every(
          (element = index) =>
            gameBoard.getField(element) === getCurrentPlayerSign()
        )
      ) {
        result = true;
        displayController.setBoardColor(combination);
      }
    };

    return winningCombinations
      .filter((combination) => combination.includes(fieldIndex))
      .some((possibleCombination = possibilities) =>
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
