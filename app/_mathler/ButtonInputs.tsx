'use client';

import { useMemo } from 'react';
import {
  GameBoard,
  GuessSpotState,
  numberInputs,
  operatorInputs,
} from '../../components/Mathler';

type ButtonInputsProps = {
  onInputClick: (val: string) => void;
  onDeleteClick: () => void;
  onSubmitClick: () => void;
  board: GameBoard;
  isGameOver: boolean;
};

const buttonGuessStateToClassName = (name: GuessSpotState): string => {
  switch (name) {
    case GuessSpotState.Correct: {
      return 'btn-success';
    }
    case GuessSpotState.Empty: {
      return 'btn-secondary btn-outline';
    }
    case GuessSpotState.ValueOnly: {
      return 'btn-warning';
    }
    case GuessSpotState.Wrong: {
      return 'btn-error';
    }
    default: {
      const exhaustive: never = name;
      return exhaustive;
    }
  }
};

export default function ButtonInputs({
  onInputClick,
  onSubmitClick,
  onDeleteClick,
  board,
  isGameOver,
}: ButtonInputsProps) {
  const reducedBoard = useMemo(
    () =>
      board.board.reduce<Record<string, GuessSpotState>>((acc, row) => {
        const prev = acc;
        const rowReduce = row.reduce<Record<string, GuessSpotState>>(
          (rowAcc, square) => {
            if (square.value) {
              return { ...rowAcc, [square.value]: square.guessState };
            }
            return rowAcc;
          },
          {}
        );
        Object.entries(rowReduce).forEach(([key, val]) => {
          if (prev[key] === GuessSpotState.Wrong) {
            prev[key] = GuessSpotState.Wrong;
          } else if (prev[key] === GuessSpotState.Correct) {
            prev[key] = GuessSpotState.Correct;
          } else if (
            prev[key] === GuessSpotState.ValueOnly ||
            prev[key] === GuessSpotState.Empty
          ) {
            prev[key] = val;
          }
        });
        return { ...prev, ...rowReduce };
      }, {}),
    [board.board]
  );

  return (
    <div className="flex gap-2 flex-col">
      <div className="flex flex-wrap justify-between">
        {numberInputs.map((val, i) => {
          const buttonUsed = reducedBoard[val];
          let buttonUsedClass = 'btn-outline btn-secondary';
          if (typeof buttonUsed !== 'undefined') {
            buttonUsedClass = buttonGuessStateToClassName(buttonUsed);
          }
          return (
            <button
              className={
                isGameOver ? 'btn btn-disabled' : `btn ${buttonUsedClass}`
              }
              type="button"
              disabled={isGameOver}
              // justification, input array is fixed and never changes.
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              onClick={() => onInputClick(val)}
            >
              {val}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          className={
            isGameOver ? 'btn btn-disabled' : 'btn btn-outline btn-primary'
          }
          onClick={onSubmitClick}
          disabled={isGameOver}
        >
          Submit
        </button>
        {operatorInputs.map((val, i) => {
          const buttonUsed = reducedBoard[val];

          let buttonUsedClass = 'btn-outline btn-secondary';
          if (typeof buttonUsed !== 'undefined') {
            buttonUsedClass = buttonGuessStateToClassName(buttonUsed);
          }
          return (
            <button
              className={
                isGameOver ? 'btn btn-disabled' : `btn ${buttonUsedClass}`
              }
              type="button"
              disabled={isGameOver}
              // justification, input array is fixed and never changes.
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              onClick={() => onInputClick(val)}
            >
              {val}
            </button>
          );
        })}
        <button
          type="button"
          className={
            isGameOver ? 'btn btn-disabled' : 'btn btn-outline btn-error'
          }
          onClick={onDeleteClick}
          disabled={isGameOver}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
