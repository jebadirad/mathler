import { Mathler, configureGameBoard } from './Mathler';
import { GuessSpotState, Row } from './Mathler.types';

const getMockAnswers = jest
  .spyOn(Mathler, 'getTodaysAnswers')
  .mockImplementation(() => ({ expression: `132 - 59`, value: 73 }));

describe('Mathler tests', () => {
  beforeEach(() => {
    getMockAnswers.mockImplementation(() => ({
      expression: `132 - 59`,
      value: 73,
    }));
  });
  it('should make a guess with some correct values and some value only', () => {
    getMockAnswers.mockImplementation(() => ({
      expression: `2 * 24 - 9`,
      value: 2 * 24 - 9,
    }));
    const gameBoard = configureGameBoard({ rows: 6, columns: 6 });
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
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '2',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '*',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '4',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '-',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '9',
      },
    ];
    gameBoard.board[1] = row;

    gameBoard.currentIndex = 1;

    const validated = Mathler.validateGameBoard({ board: gameBoard });
    expect(validated.currentIndex).toEqual(2);
    expect(validated.isGameOver).toBeFalsy();
    expect(validated.board[1][0].guessState).toEqual(GuessSpotState.Wrong);
    expect(validated.board[1][1].guessState).toEqual(GuessSpotState.ValueOnly);
    expect(validated.board[1][2].guessState).toEqual(GuessSpotState.ValueOnly);
    expect(validated.board[1][3].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[1][4].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[1][5].guessState).toEqual(GuessSpotState.Correct);

    expect(validated.buttonInputs['9']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['-']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['4']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['*']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['2']).toEqual(GuessSpotState.ValueOnly);
    expect(validated.buttonInputs['1']).toEqual(GuessSpotState.Wrong);
    expect(validated.buttonInputs['/']).toEqual(GuessSpotState.Empty);
  });
  it('should make a guess with some duplicates but it matches in quantity', () => {
    getMockAnswers.mockImplementation(() => ({
      expression: `119 - 41`,
      value: 78,
    }));
    const gameBoard = configureGameBoard({ rows: 6, columns: 6 });
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
        value: '9',
      },
    ];

    gameBoard.board[1] = row;

    gameBoard.currentIndex = 1;

    const validated = Mathler.validateGameBoard({ board: gameBoard });
    expect(validated.currentIndex).toEqual(2);
    expect(validated.isGameOver).toBeFalsy();
    expect(validated.board[1][0].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[1][1].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[1][2].guessState).toEqual(GuessSpotState.Wrong);
    expect(validated.board[1][3].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[1][4].guessState).toEqual(GuessSpotState.Wrong);
    expect(validated.board[1][5].guessState).toEqual(GuessSpotState.ValueOnly);

    expect(validated.buttonInputs['9']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['7']).toEqual(GuessSpotState.Wrong);
    expect(validated.buttonInputs['-']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['3']).toEqual(GuessSpotState.Wrong);
    expect(validated.buttonInputs['1']).toEqual(GuessSpotState.ValueOnly);
    expect(validated.buttonInputs['/']).toEqual(GuessSpotState.Empty);
  });
  it('should make a guess with some duplicates but has extra in quantity', () => {
    getMockAnswers.mockImplementation(() => ({
      expression: `10 + 1 + 2`,
      value: 13,
    }));
    const gameBoard = configureGameBoard({ rows: 6, columns: 6 });
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
        value: '+',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '+',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
    ];

    gameBoard.board[1] = row;

    gameBoard.currentIndex = 1;

    const validated = Mathler.validateGameBoard({ board: gameBoard });
    expect(validated.currentIndex).toEqual(2);
    expect(validated.isGameOver).toBeFalsy();
    expect(validated.board[1][0].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[1][1].guessState).toEqual(GuessSpotState.ValueOnly);
    expect(validated.board[1][2].guessState).toEqual(GuessSpotState.ValueOnly);
    expect(validated.board[1][3].guessState).toEqual(GuessSpotState.ValueOnly);
    expect(validated.board[1][4].guessState).toEqual(GuessSpotState.Wrong);
    expect(validated.board[1][5].guessState).toEqual(GuessSpotState.Wrong);

    expect(validated.buttonInputs['+']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['1']).toEqual(GuessSpotState.ValueOnly);
    expect(validated.buttonInputs['/']).toEqual(GuessSpotState.Empty);
  });
  it('should make no changes when an expression is invalid', () => {
    const gameBoard = configureGameBoard({ rows: 6, columns: 6 });
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

    const validated = Mathler.validateGameBoard({ board: gameBoard });
    expect(validated.currentIndex).toEqual(1);
    expect(validated.isGameOver).toBeFalsy();

    validated.board[1].forEach((item, i) => {
      expect(item.guessState).toEqual(row[i].guessState);
      expect(item.value).toEqual(row[i].value);
    });
    Object.values(validated.buttonInputs).forEach((v) => {
      expect(v).toEqual(GuessSpotState.Empty);
    });
  });
  it('shoud solve associate and communitive properties', () => {
    getMockAnswers.mockImplementation(() => ({
      expression: `2 * 24 + 9`,
      value: 2 * 24 + 9,
    }));
    const gameBoard = configureGameBoard({ rows: 6, columns: 6 });

    const row: Row = [
      {
        guessState: GuessSpotState.Empty,
        value: '9',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '+',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '2',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '4',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '*',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '2',
      },
    ];

    gameBoard.board[0] = row;

    gameBoard.currentIndex = 0;

    const validated = Mathler.validateGameBoard({ board: gameBoard });
    expect(validated.currentIndex).toEqual(0);
    expect(validated.isGameOver).toBeTruthy();

    validated.board[0].forEach((item) => {
      expect(item.guessState).toEqual(GuessSpotState.Correct);
    });
    // instant win, buttons are disabled and never get checked.
    expect(validated.buttonInputs['9']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['+']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['4']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['*']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['2']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['1']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['/']).toEqual(GuessSpotState.Empty);
  });
  it('shoud solve term matches', () => {
    getMockAnswers.mockImplementation(() => ({
      expression: `33 + 2 - 9`,
      value: 33 + 2 - 9,
    }));
    const gameBoard = configureGameBoard({ rows: 6, columns: 6 });

    const row: Row = [
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '+',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '3',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '3',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '-',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '8',
      },
    ];

    gameBoard.board[0] = row;

    gameBoard.currentIndex = 0;

    const validated = Mathler.validateGameBoard({ board: gameBoard });
    expect(validated.currentIndex).toEqual(1);
    expect(validated.isGameOver).toBeFalsy();

    expect(validated.board[0][0].guessState).toEqual(GuessSpotState.Wrong);
    expect(validated.board[0][1].guessState).toEqual(GuessSpotState.ValueOnly);
    expect(validated.board[0][2].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[0][3].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[0][4].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[0][5].guessState).toEqual(GuessSpotState.Wrong);

    expect(validated.buttonInputs['9']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['+']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['-']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['3']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['8']).toEqual(GuessSpotState.Wrong);
    expect(validated.buttonInputs['1']).toEqual(GuessSpotState.Wrong);
    expect(validated.buttonInputs['/']).toEqual(GuessSpotState.Empty);
  });

  it('should handle the associative edge case with duplicate numbers', () => {
    getMockAnswers.mockImplementation(() => ({
      expression: `11 + 1 + 5`,
      value: 11 + 1 + 5,
    }));
    const gameBoard = configureGameBoard({ rows: 6, columns: 6 });

    const row: Row = [
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '+',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '5',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '+',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
    ];

    gameBoard.board[0] = row;

    gameBoard.currentIndex = 0;

    const validated = Mathler.validateGameBoard({ board: gameBoard });
    expect(validated.currentIndex).toEqual(1);
    expect(validated.isGameOver).toBeFalsy();

    expect(validated.board[0][0].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[0][1].guessState).toEqual(GuessSpotState.ValueOnly);
    expect(validated.board[0][2].guessState).toEqual(GuessSpotState.ValueOnly);
    expect(validated.board[0][3].guessState).toEqual(GuessSpotState.ValueOnly);
    expect(validated.board[0][4].guessState).toEqual(GuessSpotState.ValueOnly);
    expect(validated.board[0][5].guessState).toEqual(GuessSpotState.ValueOnly);

    expect(validated.buttonInputs['9']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['+']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['-']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['3']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['5']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['1']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['/']).toEqual(GuessSpotState.Empty);
  });

  it('should handle 2 and 3 character terms with correct operator placement', () => {
    getMockAnswers.mockImplementation(() => ({
      expression: `118 + 42`,
      value: 118 + 42,
    }));
    const gameBoard = configureGameBoard({ rows: 6, columns: 6 });

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
        value: '+',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '1',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '4',
      },
      {
        guessState: GuessSpotState.Empty,
        value: '9',
      },
    ];

    gameBoard.board[0] = row;

    gameBoard.currentIndex = 0;

    const validated = Mathler.validateGameBoard({ board: gameBoard });
    expect(validated.currentIndex).toEqual(1);
    expect(validated.isGameOver).toBeFalsy();

    expect(validated.board[0][0].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[0][1].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[0][2].guessState).toEqual(GuessSpotState.ValueOnly);
    expect(validated.board[0][3].guessState).toEqual(GuessSpotState.Wrong);
    expect(validated.board[0][4].guessState).toEqual(GuessSpotState.Correct);
    expect(validated.board[0][5].guessState).toEqual(GuessSpotState.Wrong);

    expect(validated.buttonInputs['9']).toEqual(GuessSpotState.Wrong);
    expect(validated.buttonInputs['+']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['-']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['3']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['5']).toEqual(GuessSpotState.Empty);
    expect(validated.buttonInputs['1']).toEqual(GuessSpotState.ValueOnly);
    expect(validated.buttonInputs['4']).toEqual(GuessSpotState.Correct);
    expect(validated.buttonInputs['/']).toEqual(GuessSpotState.Empty);
  });
});
