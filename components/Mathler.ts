import { evaluate } from 'mathjs';
import * as _ from 'lodash';
import answers from './MathlerAnswers';

export type GameBoard = {
  board: Array<Row>;
  currentIndex: number;
  isGameOver: boolean;
  buttonInputs: {
    [key in Operator | NumberValue]: GuessSpotState;
  };
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
  buttonInputs: {
    '*': GuessSpotState.Empty,
    '+': GuessSpotState.Empty,
    '-': GuessSpotState.Empty,
    '/': GuessSpotState.Empty,
    '0': GuessSpotState.Empty,
    '1': GuessSpotState.Empty,
    '2': GuessSpotState.Empty,
    '3': GuessSpotState.Empty,
    '4': GuessSpotState.Empty,
    '5': GuessSpotState.Empty,
    '6': GuessSpotState.Empty,
    '7': GuessSpotState.Empty,
    '8': GuessSpotState.Empty,
    '9': GuessSpotState.Empty,
  },
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

      const submittedObject = row.reduce<
        Partial<Record<Operator | NumberValue, Array<number>>>
      >((acc, curr, index) => {
        if (curr.value) {
          const itemInAcc = acc[curr.value];
          if (itemInAcc) {
            itemInAcc.push(index);
          } else {
            acc[curr.value] = [index];
          }
        }
        return acc;
      }, {});

      const expressionObject = answerExpression
        .split('')
        .reduce<Partial<Record<Operator | NumberValue, Array<number>>>>(
          (acc, curr, index) => {
            if (isValidValue(curr)) {
              if (curr) {
                const itemInAcc = acc[curr];
                if (itemInAcc) {
                  itemInAcc.push(index);
                } else {
                  acc[curr] = [index];
                }
              }
            }
            return acc;
          },
          {}
        );

      Object.entries(submittedObject).forEach(([key, submittedValue]) => {
        if (isValidValue(key)) {
          const val = expressionObject[key];
          if (val) {
            const intersect = _.intersection(submittedValue, val);
            if (
              intersect.length === val.length &&
              intersect.length === submittedValue.length
            ) {
              // total match
              submittedValue.forEach((v) => {
                row[v].guessState = GuessSpotState.Correct;
                const rowVal = row[v].value;
                if (rowVal) {
                  gb.buttonInputs[rowVal] = GuessSpotState.Correct;
                }
              });
            } else if (intersect.length === 0) {
              if (
                val.length === submittedValue.length ||
                val.length > submittedValue.length
              ) {
                submittedValue.forEach((v) => {
                  row[v].guessState = GuessSpotState.ValueOnly;
                  const rowVal = row[v].value;
                  if (rowVal) {
                    gb.buttonInputs[rowVal] = GuessSpotState.ValueOnly;
                  }
                });
              } else {
                submittedValue.forEach((v, i) => {
                  if (i > val.length - 1) {
                    row[v].guessState = GuessSpotState.Wrong;
                    const rowVal = row[v].value;
                    if (rowVal) {
                      gb.buttonInputs[rowVal] = GuessSpotState.Wrong;
                    }
                  } else {
                    row[v].guessState = GuessSpotState.ValueOnly;
                    const rowVal = row[v].value;
                    if (rowVal) {
                      gb.buttonInputs[rowVal] = GuessSpotState.Wrong;
                    }
                  }
                });
              }
            } else {
              intersect.forEach((v) => {
                row[v].guessState = GuessSpotState.Correct;
                const rowVal = row[v].value;
                if (rowVal) {
                  gb.buttonInputs[rowVal] = GuessSpotState.Correct;
                }
              });
              if (
                val.length === submittedValue.length ||
                val.length > submittedValue.length
              ) {
                submittedValue.forEach((v) => {
                  if (row[v].guessState !== GuessSpotState.Correct) {
                    row[v].guessState = GuessSpotState.ValueOnly;
                    const rowVal = row[v].value;
                    if (rowVal) {
                      gb.buttonInputs[rowVal] = GuessSpotState.ValueOnly;
                    }
                  } else if (
                    row[v].guessState === GuessSpotState.Correct &&
                    val.length > submittedValue.length
                  ) {
                    row[v].guessState = GuessSpotState.Correct;
                    const rowVal = row[v].value;
                    if (rowVal) {
                      gb.buttonInputs[rowVal] = GuessSpotState.ValueOnly;
                    }
                  }
                });
              } else {
                let countFound = intersect.length;
                submittedValue.forEach((v) => {
                  const expectedMatch = val.indexOf(v);
                  if (expectedMatch === -1) {
                    if (countFound < val.length) {
                      row[v].guessState = GuessSpotState.ValueOnly;
                      const rowVal = row[v].value;
                      if (rowVal) {
                        gb.buttonInputs[rowVal] = GuessSpotState.ValueOnly;
                      }
                      countFound += 1;
                    } else {
                      row[v].guessState = GuessSpotState.Wrong;
                      const rowVal = row[v].value;
                      if (rowVal) {
                        gb.buttonInputs[rowVal] = GuessSpotState.Wrong;
                      }
                    }
                  }
                });
              }
            }
          } else {
            // wrong answer at all indices.
            submittedValue.forEach((v) => {
              row[v].guessState = GuessSpotState.Wrong;
              const rowVal = row[v].value;
              if (rowVal) {
                gb.buttonInputs[rowVal] = GuessSpotState.Wrong;
              }
            });
          }
        }
      });
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
