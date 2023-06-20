import {
  GameBoard,
  GuessSpotState,
  numberInputs,
  operatorInputs,
} from '../../components/Mathler.types';

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

function ButtonInput({
  buttonUsed,
  isGameOver,
  onInputClick,
  val,
}: {
  buttonUsed: GuessSpotState | undefined;
  isGameOver: boolean;
  onInputClick: ButtonInputsProps['onInputClick'];
  val: string;
}) {
  let buttonUsedClass = 'btn-outline btn-secondary';
  if (typeof buttonUsed !== 'undefined') {
    buttonUsedClass = buttonGuessStateToClassName(buttonUsed);
  }
  return (
    <button
      className={isGameOver ? 'btn btn-disabled' : `btn ${buttonUsedClass}`}
      type="button"
      disabled={isGameOver}
      onClick={() => onInputClick(val)}
    >
      {val}
    </button>
  );
}

export default function ButtonInputs({
  onInputClick,
  onSubmitClick,
  onDeleteClick,
  board,
  isGameOver,
}: ButtonInputsProps) {
  return (
    <div className="flex gap-2 flex-col">
      <div className="flex flex-wrap justify-between">
        {numberInputs.map((val, i) => (
          <ButtonInput
            buttonUsed={board.buttonInputs[val]}
            isGameOver={isGameOver}
            onInputClick={onInputClick}
            val={val}
            // justification the gameboard is consistent.
            // eslint-disable-next-line react/no-array-index-key
            key={i}
          />
        ))}
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
        {operatorInputs.map((val, i) => (
          <ButtonInput
            buttonUsed={board.buttonInputs[val]}
            isGameOver={isGameOver}
            onInputClick={onInputClick}
            val={val}
            // justification the gameboard is consistent.
            // eslint-disable-next-line react/no-array-index-key
            key={i}
          />
        ))}
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
