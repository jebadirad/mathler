import { evaluate } from 'mathjs';
import answers from './MathlerAnswers';

export type GameBoard = {
  board: Array<Row>;
  currentIndex: number;
  isGameOver: boolean;
};
export enum GuessSpotState {
  Correct,
  Wrong,
  ValueOnly,
  Empty,
}

export const initialGameBoard: GameBoard = {
  board: [
    [
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
    ],
    [
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
    ],
    [
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
    ],
    [
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
    ],
    [
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
    ],
    [
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
      {
        guessState: GuessSpotState.Empty,
        value: null,
      },
    ],
  ],
  currentIndex: 0,
  isGameOver: false,
};

export type Row = Array<Square>;
export const numberInputs = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
] as const;
export const operatorInputs = ['+', '-', '/', '*'] as const;

export const isValidValue = (val: string): val is Operator | NumberValue => {
  if (
    numberInputs.findIndex((i) => i === val) > -1 ||
    operatorInputs.findIndex((i) => i === val) > -1
  ) {
    return true;
  }

  return false;
};
export type Operator = '+' | '-' | '/' | '*';
export type NumberValue =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';
export type Square = {
  value: Operator | NumberValue | null;
  guessState: GuessSpotState;
};

export class Mathler {
  static validateGameBoard(board: GameBoard): GameBoard {
    const gb = board;
    if (gb.currentIndex >= 6) {
      gb.isGameOver = true;
      return gb;
    }
    const row = gb.board[gb.currentIndex];
    const answer = Mathler.getTodaysAnswers();
    const answerExpression = answer.expression.replaceAll(' ', '');
    const submittedAnswer = row.map((item) => item.value).join('');
    const evaluatedAnswer = Mathler.evaluateAnswer(submittedAnswer);
    if (evaluatedAnswer.isValid) {
      if (
        evaluatedAnswer.answer === answer.value &&
        submittedAnswer === answerExpression
      ) {
        const updatedRow = row.map((item) => ({
          ...item,
          guessState: GuessSpotState.Correct,
        }));
        gb.board[gb.currentIndex] = updatedRow;
        gb.isGameOver = true;
        return gb;
      }

      for (let i = 0; i < answerExpression.length; i += 1) {
        const submittedLetter = submittedAnswer[i];
        const expectedLetter = answerExpression[i];
        if (submittedLetter === expectedLetter) {
          row[i].guessState = GuessSpotState.Correct;
        } else if (answerExpression.indexOf(submittedLetter) > -1) {
          // TODO: this isn't the proper way to handle this.
          row[i].guessState = GuessSpotState.ValueOnly;
        } else {
          row[i].guessState = GuessSpotState.Wrong;
        }
      }
      gb.board[gb.currentIndex] = row;
      gb.currentIndex += 1;
      if (gb.currentIndex >= 6) {
        gb.isGameOver = true;
      }
    }
    return gb;
  }

  static getTodaysAnswers(): {
    expression: string;
    value: number;
  } {
    const today = new Date();
    const currentDate = today.getDate();
    const expression = answers[currentDate % 10];
    return {
      expression,
      value: evaluate(expression),
    };
  }

  static evaluateAnswer(exp: string): {
    answer: number | null;
    isValid: boolean;
  } {
    const validated = evaluate(exp);
    if (typeof validated === 'number') {
      return {
        answer: validated,
        isValid: true,
      };
    }
    return {
      answer: null,
      isValid: false,
    };
  }
}
