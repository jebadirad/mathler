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

export const configureGameBoard = ({
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
       * 10 + 15 + 1 will not match
       * [1, 10, 15], [+,+]
       * 1,10,15,+,+
       * 1 5 11 + +
       * 1 1 15 + +
       * 24 * 2 - 9 and 2 * 24 - 9 also works
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
        .join(' ');

      const answerOperators = answer
        .split('')
        .filter((i) => isOperator(i))
        .sort();
      const answerValues = answer
        .split(operatorRegEx)
        .sort()
        .concat(answerOperators)
        .join(' ');

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

  static getCountOfCharactersAlreadyViewed({
    stop,
    needle,
    haystack,
  }: {
    stop: number;
    needle: string;
    haystack: string[];
  }): number {
    let currCount = 0;
    for (let m = 0; m < stop; m += 1) {
      if (haystack[m] === needle) {
        currCount += 1;
      }
    }
    return currCount;
  }

  static checkTermsCompletelyCorrect({
    answer,
    submitted,
    board,
  }: {
    submitted: string;
    answer: string;
    board: GameBoard;
  }): Row {
    const currentRow = board.board[board.currentIndex];
    const answerTerms = answer.split(/(?=[+*-/])|(?<=[+*-/])/g);
    const submittedTerms = submitted.split(/(?=[+*-/])|(?<=[+*-/])/g);
    submittedTerms.forEach((term, i, arr) => {
      if (answerTerms.includes(term)) {
        const termsParsed = arr.slice(0, i);
        const lengthOfTerms = termsParsed.join('').length;
        for (let j = lengthOfTerms; j < lengthOfTerms + term.length; j += 1) {
          currentRow[j] = this.setSquareGuess({
            square: currentRow[j],
            guess: GuessSpotState.Correct,
          });
        }
        const foundAnswer = answerTerms.findIndex((v) => v === term);
        answerTerms.splice(foundAnswer, 1);
      }
    });

    return currentRow;
  }

  static checkTermsByIndexWithDuplicates({
    answer,
    submitted,
    row,
  }: {
    submitted: string;
    answer: string;
    row: Row;
  }): Row {
    const currentRow = row;
    const answerBreakdown = _.countBy(answer.split(''), (a) => a);
    // identifies numbers/symbol in the correct index position
    submitted.split('').forEach((submittedCharacter, i, submittedArr) => {
      const currentValue = currentRow[i].value;
      const answerCharacter = answer[i];
      if (
        currentValue &&
        !isOperator(currentValue) &&
        currentRow[i].guessState === GuessSpotState.Empty
      ) {
        if (answerCharacter === submittedCharacter) {
          currentRow[i] = this.setSquareGuess({
            square: currentRow[i],
            guess: GuessSpotState.Correct,
          });
        } else {
          const ansCount = answerBreakdown[submittedCharacter];
          if (typeof ansCount === 'undefined') {
            currentRow[i] = this.setSquareGuess({
              square: currentRow[i],
              guess: GuessSpotState.Wrong,
            });
          } else {
            let currCount = this.getCountOfCharactersAlreadyViewed({
              haystack: submittedArr,
              needle: submittedCharacter,
              stop: i,
            });

            const stopCount = ansCount;
            submittedArr.forEach((duplicateTerm, duplicateIndex) => {
              if (
                duplicateTerm === submittedCharacter &&
                currentRow[duplicateIndex].guessState === GuessSpotState.Empty
              ) {
                if (currCount < stopCount) {
                  currentRow[duplicateIndex] = this.setSquareGuess({
                    square: currentRow[duplicateIndex],
                    guess: GuessSpotState.ValueOnly,
                  });
                  currCount += 1;
                } else {
                  currentRow[duplicateIndex] = this.setSquareGuess({
                    square: currentRow[duplicateIndex],
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

  static checkTerms({
    answer,
    submitted,
    board,
  }: {
    submitted: string;
    answer: string;
    board: GameBoard;
  }): Row {
    let currentRow = board.board[board.currentIndex];

    currentRow = this.checkTermsCompletelyCorrect({ answer, submitted, board });
    currentRow = this.checkTermsByIndexWithDuplicates({
      answer,
      submitted,
      row: currentRow,
    });

    return currentRow;
  }

  static validateGameBoard({
    board,
    date = new Date(),
  }: {
    board: GameBoard;
    date?: Date;
  }): GameBoard {
    const gb = board;
    const row = gb.board[gb.currentIndex];
    const currentRow = gb.currentIndex;
    if (gb.currentIndex >= 6) {
      // check if a gameover board was submitted.
      gb.isGameOver = true;
      return gb;
    }

    const submittedAnswer = row.map((item) => item.value).join('');
    const answer = this.getTodaysAnswers(date);
    const answerExpression = answer.expression.replaceAll(' ', '');

    const evaluatedAnswer = this.evaluateAnswer(submittedAnswer);
    if (evaluatedAnswer.isValid && evaluatedAnswer.answer === answer.value) {
      if (
        this.checkForCorrectAnswer({
          answer: answerExpression,
          submitted: submittedAnswer,
        })
      ) {
        gb.board[currentRow] = row.map((item) =>
          this.setSquareGuess({
            square: item,
            guess: GuessSpotState.Correct,
          })
        );
        gb.isGameOver = true;
        return gb;
      }

      gb.board[currentRow] = this.checkTerms({
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
