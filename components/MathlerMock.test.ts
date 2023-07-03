import { Mathler, initialGameBoard } from './Mathler';
import { GuessSpotState, Row } from './Mathler.types';

const getMockAnswers = jest
  .spyOn(Mathler, 'getTodaysAnswers')
  .mockImplementation(() => ({ expression: `132 - 59`, value: 73 }));

describe('Mathler tests', () => {
  it('should make a guess with no matches but correct values', () => {
    const gameBoard = { ...initialGameBoard };
    const answer = Mathler.getTodaysAnswers(new Date());
    gameBoard.board[1] = answer.expression
      .replaceAll(' ', '')
      .split('')
      .map(() => ({
        value: '0',
        guessState: GuessSpotState.Wrong,
      }));
    const row: Row = [
      {
        guessState: GuessSpotState.Empty,
        value: '2',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '-',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '3',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '5',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '9',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
    ];
    gameBoard.board[1] = row;

    gameBoard.currentIndex = 1;

    const validated = Mathler.validateGameBoard(gameBoard);
    expect(validated.currentIndex).toEqual(2);
    expect(validated.isGameOver).toBeFalsy();

    validated.board[1].forEach((item) => {
      expect(item.guessState).toEqual(GuessSpotState.ValueOnly);
    });
  });
  it('should make a guess with some matches but correct values', () => {
    getMockAnswers.mockImplementationOnce(() => ({
      expression: `119 - 41`,
      value: 78,
    }));
    const gameBoard = { ...initialGameBoard };
    gameBoard.board[0] = gameBoard.board[0].map((item) => ({
      ...item,
      value: '0',
      guessState: GuessSpotState.Wrong,
    }));

    const row: Row = [
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '9',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '-',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '4',
      },
    ];

    gameBoard.board[1] = row;

    gameBoard.currentIndex = 1;

    const validated = Mathler.validateGameBoard(gameBoard);
    expect(validated.currentIndex).toEqual(2);
    expect(validated.isGameOver).toBeFalsy();

    validated.board[1].forEach((item, i) => {
      if (i === 0 || i === 3) {
        expect(item.guessState).toEqual(GuessSpotState.Correct);
      } else {
        expect(item.guessState).toEqual(GuessSpotState.ValueOnly);
      }
    });
  });
  it('should make a guess with some duplicates but it matches in quantity', () => {
    getMockAnswers.mockImplementationOnce(() => ({
      expression: `119 - 41`,
      value: 78,
    }));
    const gameBoard = { ...initialGameBoard };
    gameBoard.board[0] = gameBoard.board[0].map((item) => ({
      ...item,
      value: '0',
      guessState: GuessSpotState.Wrong,
    }));

    const row: Row = [
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '7',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '-',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '3',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '4',
      },
    ];

    gameBoard.board[1] = row;

    gameBoard.currentIndex = 1;

    const validated = Mathler.validateGameBoard(gameBoard);
    expect(validated.currentIndex).toEqual(2);
    expect(validated.isGameOver).toBeFalsy();

    validated.board[1].forEach((item, i) => {
      if (i === 0 || i === 3 || i === 1) {
        expect(item.guessState).toEqual(GuessSpotState.Correct);
      } else if (i === 5) {
        expect(item.guessState).toEqual(GuessSpotState.ValueOnly);
      } else {
        expect(item.guessState).toEqual(GuessSpotState.Wrong);
      }
    });
  });
  it('should make a guess with some duplicates but has extra in quantity', () => {
    getMockAnswers.mockImplementationOnce(() => ({
      expression: `119 - 41`,
      value: 78,
    }));
    const gameBoard = { ...initialGameBoard };
    gameBoard.board[0] = gameBoard.board[0].map((item) => ({
      ...item,
      value: '0',
      guessState: GuessSpotState.Wrong,
    }));

    const row: Row = [
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '7',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '4',
      },
    ];

    gameBoard.board[1] = row;

    gameBoard.currentIndex = 1;

    const validated = Mathler.validateGameBoard(gameBoard);
    expect(validated.currentIndex).toEqual(2);
    expect(validated.isGameOver).toBeFalsy();

    validated.board[1].forEach((item, i) => {
      if (i === 0) {
        expect(item.guessState).toEqual(GuessSpotState.Correct);
      } else if (i === 5 || i === 2 || i === 3) {
        expect(item.guessState).toEqual(GuessSpotState.ValueOnly);
      } else {
        expect(item.guessState).toEqual(GuessSpotState.Wrong);
      }
    });
  });
  it('should make no changes when an expression is invalid', () => {
    const gameBoard = { ...initialGameBoard };
    gameBoard.board[0] = gameBoard.board[0].map((item) => ({
      ...item,
      value: '0',
      guessState: GuessSpotState.Wrong,
    }));

    const row: Row = [
      {
        guessState: GuessSpotState.Empty,
        value: '2',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '3',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '5',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '9',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '-',
      },
    ];

    gameBoard.board[1] = row;

    gameBoard.currentIndex = 1;

    const validated = Mathler.validateGameBoard(gameBoard);
    expect(validated.currentIndex).toEqual(1);
    expect(validated.isGameOver).toBeFalsy();

    validated.board[1].forEach((item, i) => {
      expect(item.guessState).toEqual(row[i].guessState);
      expect(item.value).toEqual(row[i].value);
    });
  });
});
