'use client';

import { useTransition, useState, useCallback } from 'react';
import { evaluate } from 'mathjs';
import {
  GameBoard,
  initialGameBoard,
  isValidValue,
} from '../../components/Mathler';
import MathlerRow from './MathlerRow';
import ButtonInputs from './ButtonInputs';
import ErrorBanner from './ErrorBanner';

type MathlerContainerProps = {
  handleSubmit: (board: GameBoard) => Promise<GameBoard>;
  todaysAnswer: number;
};
export default function MathlerContainer({
  handleSubmit,
  todaysAnswer,
}: MathlerContainerProps) {
  const [gameState, setGameState] = useState<GameBoard>(initialGameBoard);
  const [, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTransitionState, setErrorTransitionState] = useState<
    'out' | 'in' | null
  >(null);

  const submitAction = () => {
    try {
      const expression = gameState.board[gameState.currentIndex]
        .map((item) => item.value)
        .join('');
      const answer = evaluate(expression);
      if (expression.length < 6) {
        setErrorMessage('All 6 entires must be filled out');
        setErrorTransitionState('in');
      } else if (answer === todaysAnswer) {
        startTransition(async () => {
          const gameboard = await handleSubmit(gameState);
          setGameState(gameboard);
        });
      } else {
        // error state
        setErrorMessage(`Expression does not equal ${todaysAnswer}`);
        setErrorTransitionState('in');
      }
    } catch (e) {
      setErrorMessage(`Invalid expression`);
      setErrorTransitionState('in');
    }
  };

  const handleDeleteClick = useCallback(() => {
    const row = gameState.board[gameState.currentIndex];
    const lastItem = row.findLastIndex((item) => item.value !== null);
    if (lastItem > -1) {
      row[lastItem].value = null;
      gameState.board[gameState.currentIndex] = row;
      setGameState({ ...gameState });
    }
  }, [gameState]);

  const handleButtonClick = useCallback(
    (val: string) => {
      if (isValidValue(val)) {
        const row = gameState.board[gameState.currentIndex];
        const lastItem = row.findIndex((item) => item.value === null);
        if (lastItem > -1) {
          row[lastItem].value = val;
          gameState.board[gameState.currentIndex] = row;
          setGameState({ ...gameState });
        }
      }
    },
    [gameState]
  );

  return (
    <div>
      <div className="flex flex-wrap prose prose-sm md:prose-base prose-p:mt-0">
        <h1 className="w-full">Mathler</h1>
        <p>{`Find the hidden calculation that equals ${todaysAnswer}`}</p>
      </div>
      <div className="flex flex-col gap-1 pt-4 justify-center">
        {gameState.board.map((val, i) => (
          // justification, its a static array of 6 items, so the indicies will always be the same.
          // eslint-disable-next-line react/no-array-index-key
          <MathlerRow key={i + 1} row={val} />
        ))}
      </div>
      <div className="py-4">
        <ButtonInputs
          onInputClick={handleButtonClick}
          onDeleteClick={handleDeleteClick}
          onSubmitClick={submitAction}
          board={gameState}
          isGameOver={gameState.isGameOver}
        />
      </div>
      <ErrorBanner
        message={errorMessage}
        errorTransitionState={errorTransitionState}
        onClose={() => {
          setErrorMessage('');
          setErrorTransitionState('out');
        }}
      />
    </div>
  );
}