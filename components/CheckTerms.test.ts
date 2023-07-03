import { Mathler, initialGameBoard } from './Mathler';
import { GameBoard, GuessSpotState, Row, Square } from './Mathler.types';

let board: GameBoard;
describe('check terms tests', () => {
  beforeEach(() => {
    board = initialGameBoard;
  });
  it('should correctly check the terms', () => {
    const submitExpression = '118+42';
    const updatedRow: Row = board.board[0].map((v, index) => ({
      ...v,
      value: submitExpression[index] as Square['value'],
    }));
    board.board[0] = updatedRow;
    const row = Mathler.checkTerms({
      board,
      answer: '119+41',
      submitted: submitExpression,
    });
    expect(row[0].guessState).toEqual(GuessSpotState.Correct);
    expect(row[1].guessState).toEqual(GuessSpotState.Correct);
    expect(row[2].guessState).toEqual(GuessSpotState.Wrong);
    expect(row[3].guessState).toEqual(GuessSpotState.Correct);
    expect(row[4].guessState).toEqual(GuessSpotState.Correct);
    expect(row[5].guessState).toEqual(GuessSpotState.Wrong);
  });
});
