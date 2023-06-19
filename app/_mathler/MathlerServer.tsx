import { GameBoard, Mathler } from '../../components/Mathler';
import MathlerContainer from './MathlerContainer';

async function validateGameBoard(board: GameBoard): Promise<GameBoard> {
  'use server';

  return Mathler.validateGameBoard(board);
}

export default function MathlerServer() {
  return (
    <div>
      <form>
        <MathlerContainer
          handleSubmit={validateGameBoard}
          todaysAnswer={Mathler.getTodaysAnswers().value}
        />
      </form>
    </div>
  );
}
