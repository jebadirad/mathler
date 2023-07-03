import { Mathler, initialGameBoard } from './Mathler';
import { GuessSpotState, isValidValue } from './Mathler.types';
import answers from './MathlerAnswers';

describe('Mathler tests', () => {
  it.each([
    {
      exp: `119 - 41`,
      answer: 78,
    },
    { exp: `21 / 7 + 9`, answer: 12 },
    { exp: `90 / 9 + 7`, answer: 17 },
    { exp: `18 + 6 - 3`, answer: 21 },
    { exp: `24 * 2 - 9`, answer: 39 },
    { exp: `112 - 47`, answer: 65 },
    { exp: `27 * 3 - 9`, answer: 72 },
    { exp: `28 - 3 + 7`, answer: 32 },
    { exp: `95 / 5 + 8`, answer: 27 },
    { exp: `132 - 59`, answer: 73 },
  ])('should evaluate expressions', ({ answer, exp }) => {
    const evaluated = Mathler.evaluateAnswer(exp);

    expect(evaluated.answer).toEqual(answer);
    expect(evaluated.isValid).toBeTruthy();
  });
  it.each(['1+', '2 *2-', '/11 +1'])(
    'should catch invalid expressions',
    (exp) => {
      const evaluated = Mathler.evaluateAnswer(exp);
      expect(evaluated.answer).toBeNull();
      expect(evaluated.isValid).toBeFalsy();
    }
  );
  it('should fetch the correct answer', () => {
    const today = new Date();
    const date = today.getDate();
    const val = date % 10;
    const evaluated = {
      expression: answers[val],
      value: Mathler.evaluateAnswer(answers[val]).answer,
    };
    expect(Mathler.getTodaysAnswers(new Date())).toEqual(evaluated);
  });

  it('should evaluate a winning gameboard', () => {
    const gameBoard = { ...initialGameBoard };
    const answer = Mathler.getTodaysAnswers(new Date());

    gameBoard.board[0] = answer.expression
      .replaceAll(' ', '')
      .split('')
      .map((item) => {
        if (isValidValue(item)) {
          return {
            value: item,
            guessState: GuessSpotState.Empty,
          };
        }
        return {
          value: '0',
          guessState: GuessSpotState.Wrong,
        };
      });

    const validated = Mathler.validateGameBoard(gameBoard);
    expect(validated.isGameOver).toBeTruthy();
    expect(validated.currentIndex).toEqual(0);
    validated.board[0].forEach((item, i) => {
      expect(item.value).toEqual(answer.expression.replaceAll(' ', '')[i]);
      expect(item.guessState).toEqual(GuessSpotState.Correct);
    });
  });
  it('should evaluate a winning gameboard on the second round', () => {
    const gameBoard = { ...initialGameBoard };
    const answer = Mathler.getTodaysAnswers(new Date());
    gameBoard.board[0] = gameBoard.board[0].map((item) => ({
      ...item,
      value: '0',
      guessState: GuessSpotState.Wrong,
    }));
    gameBoard.board[1] = answer.expression
      .replaceAll(' ', '')
      .split('')
      .map((item) => {
        if (isValidValue(item)) {
          return {
            value: item,
            guessState: GuessSpotState.Empty,
          };
        }
        return {
          value: '0',
          guessState: GuessSpotState.Wrong,
        };
      });
    gameBoard.currentIndex = 1;

    const validated = Mathler.validateGameBoard(gameBoard);
    expect(validated.currentIndex).toEqual(1);
    expect(validated.isGameOver).toBeTruthy();
    validated.board[0].forEach((item) => {
      expect(item.value).toEqual('0');
      expect(item.guessState).toEqual(GuessSpotState.Wrong);
    });
    validated.board[1].forEach((item, i) => {
      expect(item.value).toEqual(answer.expression.replaceAll(' ', '')[i]);
      expect(item.guessState).toEqual(GuessSpotState.Correct);
    });
  });
  it('should fail the game when theres too many guesses', () => {
    const gameBoard = { ...initialGameBoard };
    const answer = Mathler.getTodaysAnswers(new Date());

    gameBoard.board[0] = answer.expression
      .replaceAll(' ', '')
      .split('')
      .map((item) => {
        if (isValidValue(item)) {
          return {
            value: item,
            guessState: GuessSpotState.Empty,
          };
        }
        return {
          value: '0',
          guessState: GuessSpotState.Wrong,
        };
      });
    gameBoard.currentIndex = 6;

    const validated = Mathler.validateGameBoard(gameBoard);
    expect(validated.isGameOver).toBeTruthy();
    expect(validated.currentIndex).toEqual(6);
  });
  it('should make a guess with partial matches', () => {
    const gameBoard = { ...initialGameBoard };
    const answer = Mathler.getTodaysAnswers(new Date());
    gameBoard.board[0] = gameBoard.board[0].map((item) => ({
      ...item,
      value: '0',
      guessState: GuessSpotState.Wrong,
    }));
    gameBoard.board[1] = answer.expression
      .replaceAll(' ', '')
      .split('')
      .map((item, i) => {
        if (i < 3) {
          if (isValidValue(item)) {
            return {
              value: item,
              guessState: GuessSpotState.Empty,
            };
          }
        }
        return {
          value: '0',
          guessState: GuessSpotState.Wrong,
        };
      });
    gameBoard.currentIndex = 1;

    const validated = Mathler.validateGameBoard(gameBoard);
    expect(validated.currentIndex).toEqual(2);
    expect(validated.isGameOver).toBeFalsy();
    validated.board[0].forEach((item) => {
      expect(item.value).toEqual('0');
      expect(item.guessState).toEqual(GuessSpotState.Wrong);
    });
    validated.board[1].forEach((item, i) => {
      if (i < 3) {
        expect(item.value).toEqual(answer.expression.replaceAll(' ', '')[i]);
        expect(item.guessState).toEqual(GuessSpotState.Correct);
      } else {
        expect(item.value).toEqual('0');
        expect(item.guessState).toEqual(GuessSpotState.Wrong);
      }
    });
  });
  it('should make a guess with no matches', () => {
    const gameBoard = { ...initialGameBoard };
    const answer = Mathler.getTodaysAnswers(new Date());
    gameBoard.board[0] = gameBoard.board[0].map((item) => ({
      ...item,
      value: '0',
      guessState: GuessSpotState.Wrong,
    }));
    gameBoard.board[1] = answer.expression
      .replaceAll(' ', '')
      .split('')
      .map(() => ({
        value: '0',
        guessState: GuessSpotState.Wrong,
      }));
    gameBoard.currentIndex = 1;

    const validated = Mathler.validateGameBoard(gameBoard);
    expect(validated.currentIndex).toEqual(2);
    expect(validated.isGameOver).toBeFalsy();
    validated.board[0].forEach((item) => {
      expect(item.value).toEqual('0');
      expect(item.guessState).toEqual(GuessSpotState.Wrong);
    });
    validated.board[1].forEach((item) => {
      expect(item.value).toEqual('0');
      expect(item.guessState).toEqual(GuessSpotState.Wrong);
    });
  });
});
