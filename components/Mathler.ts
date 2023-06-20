import { evaluate } from 'mathjs';
import * as _ from 'lodash';
import answers from './MathlerAnswers';
import {
  GameBoard,
  GuessSpotState,
  NumberValue,
  Operator,
  isValidValue,
} from './Mathler.types';

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

export class Mathler {
  static validateGameBoard(board: GameBoard): GameBoard {
    const gb = board;

    if (gb.currentIndex >= 6) {
      // check if a gameover board was submitted.
      gb.isGameOver = true;
      return gb;
    }

    const row = gb.board[gb.currentIndex];
    const submittedAnswer = row.map((item) => item.value).join('');

    const answer = Mathler.getTodaysAnswers();
    const answerExpression = answer.expression.replaceAll(' ', '');

    const evaluatedAnswer = Mathler.evaluateAnswer(submittedAnswer);

    if (evaluatedAnswer.isValid) {
      if (
        evaluatedAnswer.answer === answer.value &&
        submittedAnswer === answerExpression
      ) {
        // perfect match. instant win.
        const updatedRow = row.map((item) => {
          if (item.value) {
            gb.buttonInputs[item.value] = GuessSpotState.Correct;
          }
          return {
            ...item,
            guessState: GuessSpotState.Correct,
          };
        });

        gb.board[gb.currentIndex] = updatedRow;
        gb.isGameOver = true;
        return gb;
      }

      // convert the current row into an object where each key is an input value,
      // and the value is an array of indicies the key exists in the row.
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

      // create the same object for the expression.
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

      // we can compare the two expression objects to determine the state of the game.
      Object.entries(submittedObject).forEach(([key, submittedValue]) => {
        if (isValidValue(key)) {
          const val = expressionObject[key];
          if (val) {
            // get the intersection of the indices.
            // ex: if the submission is 111-30
            // and the answer is 119-41.
            // for the key `1` we have indices at 0,1,2 and 0,1,5'
            // the intersection would be 0,1.
            const intersect = _.intersection(submittedValue, val);
            if (
              intersect.length === val.length &&
              intersect.length === submittedValue.length
            ) {
              // total match for current key.
              submittedValue.forEach((v) => {
                row[v].guessState = GuessSpotState.Correct;
                const rowVal = row[v].value;
                if (rowVal) {
                  // also set the button to the correct state.
                  gb.buttonInputs[rowVal] = GuessSpotState.Correct;
                }
              });
            } else {
              // not a total match, we also handle duplicates here.
              // the intersection are correct spots, so we can set those now.
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
                // first we check if the real answer has more or equal indices than the submitted.
                submittedValue.forEach((v) => {
                  // if it does, then we know that as long as it wasn't in the intersection,
                  // we can assign it a correct value but not position mark.
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
                    // if it is in the intersection, we want to set the button color to yellow as
                    // we have more of this value to set correctly.
                    row[v].guessState = GuessSpotState.Correct;
                    const rowVal = row[v].value;
                    if (rowVal) {
                      gb.buttonInputs[rowVal] = GuessSpotState.ValueOnly;
                    }
                  }
                });
              } else {
                // if the submitted answer has more duplicate entires than the real answer.
                let countFound = intersect.length;
                // we take a count of how many duplicates of a value exist.
                // starting with the correct matches in the intersection.
                submittedValue.forEach((v) => {
                  // if the key does not exist in the expression, meaning that the index
                  // of a specific value does not match any indices of the value in the answer.

                  const expectedMatch = val.indexOf(v);
                  if (expectedMatch === -1) {
                    // as long as the countFound is less than the length of the
                    // indices in the answer, we know this particular duplicate is still valid.
                    if (countFound < val.length) {
                      row[v].guessState = GuessSpotState.ValueOnly;
                      const rowVal = row[v].value;
                      if (rowVal) {
                        gb.buttonInputs[rowVal] = GuessSpotState.ValueOnly;
                      }
                      countFound += 1;
                    } else {
                      // for every duplicate found outside of the length, we know its wrong.
                      // ex: submitting 111-14 against 119-41
                      // we get indices for `1` as such:
                      // 0,1,2,4 and 0,1,5
                      // we know 0 and 1 match so countFound starts at 2.
                      // when we read 2 we know that countFound is less than the length of 0,1,5.
                      // so we can assume the `1` and index 2 is the right value.
                      // whne we get to `4` we now know that there are no more `1`s and can say this
                      // particular 1 is now wrong.
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
            // the key in the submission doesn't match any key in the answer
            // so any indices this key existed at is wrong.
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
    try {
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
    } catch (e) {
      return {
        answer: null,
        isValid: false,
      };
    }
  }
}
