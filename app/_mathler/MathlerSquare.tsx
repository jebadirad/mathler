import { GuessSpotState, Square } from '../../components/Mathler.types';

type MathlerSquareProps = Square & { index: string };

export default function MathlerSquare({
  guessState,
  value,
  index,
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
      data-testid={index}
      className={`border-base-content border-2 w-14 h-10 flex justify-center items-center ${successStateClass}`}
    >
      <span>{value}</span>
    </div>
  );
}
