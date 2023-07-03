import { evaluate } from 'mathjs';
import * as _ from 'lodash';
import answers from './MathlerAnswers';
import {
  GameBoard,
  GuessSpotState,
  Square,
  isOperator,
  isValidValue,
  operatorRegEx,
  Row,
} from './Mathler.types';

type GameConfiguration = {
  rows: number;
  columns: number;
};

const configureGameBoard = ({
  rows,
  columns,
}: GameConfiguration): GameBoard => ({
  isGameOver: false,
  currentIndex: 0,
  board: Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({
      value: null,
      guessState: GuessSpotState.Empty,
    }))
  ),
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
});

export const initialGameBoard: GameBoard = configureGameBoard({
  rows: 6,
  columns: 6,
});

export class Mathler {
  static checkForCorrectAnswer({
    answer,
    submitted,
  }: {
    submitted: string;
    answer: string;
  }): boolean {
    if (answer === submitted) {
      return true;
    }
    if (evaluate(submitted) === evaluate(answer)) {
      /** quickly check commutative / associative
       * example
       * 11 + 10 + 5
       * [11, 10, 5], [+,+]
       * 5,10,11,+,+
       *
       *
       * 10 + 15 + 1 will not match
       * [1, 10, 15], [+,+]
       * 1,10,15,+,+
       *
       * 24 * 2 - 9 and 2 * 24 - 9 also works
       *
       * 2 9 24 * -
       */
      const submittedOperators = submitted
        .split('')
        .filter((i) => isOperator(i))
        .sort();
      const submittedValues = submitted
        .split(operatorRegEx)
        .sort()
        .concat(submittedOperators)
        .join('');

      const answerOperators = answer
        .split('')
        .filter((i) => isOperator(i))
        .sort();
      const answerValues = answer
        .split(operatorRegEx)
        .sort()
        .concat(answerOperators)
        .join('');

      return submittedValues === answerValues;
    }

    return false;
  }

  static setSquareGuess({
    square,
    guess,
  }: {
    square: Square;
    guess: GuessSpotState;
  }): Square {
    return {
      ...square,
      guessState: guess,
    };
  }

  static validateInputButtons({
    answer,
    submitted,
    board,
  }: {
    submitted: string;
    answer: string;
    board: GameBoard;
  }): GameBoard['buttonInputs'] {
    const answerBreakdown = _.countBy(answer.split(''), (a) => a);
    const submittedBreakdown = _.countBy(submitted.split(''), (a) => a);
    const btns = board.buttonInputs;
    Object.entries(submittedBreakdown).forEach(([key, value]) => {
      if (isValidValue(key)) {
        const ans = answerBreakdown[key];
        if (ans) {
          if (ans === value) {
            btns[key] = GuessSpotState.Correct;
          } else {
            btns[key] = GuessSpotState.ValueOnly;
          }
        } else {
          btns[key] = GuessSpotState.Wrong;
        }
      }
    });

    return btns;
  }

  static checkTerms({
    answer,
    submitted,
    board,
  }: {
    submitted: string;
    answer: string;
    board: GameBoard;
  }): Row {
    const currentRow = board.board[board.currentIndex];
    const answerBreakdown = _.countBy(answer.split(''), (a) => a);

    submitted.split('').forEach((t, i, arr) => {
      if (currentRow[i].guessState === GuessSpotState.Empty) {
        if (answer[i] === t) {
          currentRow[i] = this.setSquareGuess({
            square: currentRow[i],
            guess: GuessSpotState.Correct,
          });
        } else {
          const ansCount = answerBreakdown[t];
          if (typeof ansCount === 'undefined') {
            currentRow[i] = this.setSquareGuess({
              square: currentRow[i],
              guess: GuessSpotState.Wrong,
            });
          } else {
            let currCount = 0;
            // set initial
            for (let m = 0; m <= i; m += 1) {
              if (arr[m] === t) {
                currCount += 1;
              }
            }
            const stopCount = ansCount;

            arr.forEach((duplicateTerm, di) => {
              if (
                duplicateTerm === t &&
                currentRow[di].guessState === GuessSpotState.Empty
              ) {
                if (currCount <= stopCount) {
                  currentRow[di] = this.setSquareGuess({
                    square: currentRow[di],
                    guess: GuessSpotState.ValueOnly,
                  });
                  currCount += 1;
                } else {
                  currentRow[di] = this.setSquareGuess({
                    square: currentRow[di],
                    guess: GuessSpotState.Wrong,
                  });
                }
              }
            });
          }
        }
      }
    });

    return currentRow;
  }

  static validateGameBoard(board: GameBoard): GameBoard {
    const gb = board;
    const row = gb.board[gb.currentIndex];
    if (gb.currentIndex >= 6) {
      // check if a gameover board was submitted.
      gb.isGameOver = true;
      return gb;
    }
    const submittedAnswer = row.map((item) => item.value).join('');
    const answer = Mathler.getTodaysAnswers(new Date());
    const answerExpression = answer.expression.replaceAll(' ', '');

    const evaluatedAnswer = Mathler.evaluateAnswer(submittedAnswer);
    if (evaluatedAnswer.isValid) {
      if (
        this.checkForCorrectAnswer({
          answer: answerExpression,
          submitted: submittedAnswer,
        })
      ) {
        gb.board[gb.currentIndex] = row.map((item) =>
          this.setSquareGuess({
            square: item,
            guess: GuessSpotState.Correct,
          })
        );
        gb.isGameOver = true;
        return gb;
      }

      gb.board[gb.currentIndex] = this.checkTerms({
        answer: answerExpression,
        submitted: submittedAnswer,
        board,
      });
      gb.buttonInputs = this.validateInputButtons({
        answer: answerExpression,
        submitted: submittedAnswer,
        board: gb,
      });
      gb.currentIndex += 1;
      if (gb.currentIndex >= 6) {
        gb.isGameOver = true;
      }
    }

    return gb;
  }

  static getTodaysAnswers(date: Date): {
    expression: string;
    value: number;
  } {
    const currentDate = date.getDate();
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
