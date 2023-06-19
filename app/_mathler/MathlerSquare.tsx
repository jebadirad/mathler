import { GuessSpotState, Square } from '../../components/Mathler';

type MathlerSquareProps = Square & {};

export default function MathlerSquare({
  guessState,
  value,
}: MathlerSquareProps) {
  let successStateClass = '';
  switch (guessState) {
    case GuessSpotState.Correct: {
      successStateClass = 'bg-success';
      break;
    }
    case GuessSpotState.Empty: {
      successStateClass = '';
      break;
    }
    case GuessSpotState.ValueOnly: {
      successStateClass = 'bg-warning';
      break;
    }
    case GuessSpotState.Wrong: {
      successStateClass = 'bg-error';
      break;
    }
    default: {
      const exhaustive: never = guessState;
      successStateClass = exhaustive;
    }
  }
  return (
    <div
      className={`border-black border-2 w-14 h-10 flex justify-center items-center ${successStateClass}`}
    >
      <span className="">{value === null ? '' : value}</span>
    </div>
  );
}
