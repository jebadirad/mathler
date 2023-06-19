import { Row } from '../../components/Mathler';
import MathlerSquare from './MathlerSquare';

type MathlerRowProps = {
  row: Row;
};

export default function MathlerRow({ row }: MathlerRowProps) {
  return (
    <div className="flex gap-1 self-center">
      {row.map(({ guessState, value }, i) => (
        // justification, its a static array of 6 items, so the indicies will always be the same.
        // eslint-disable-next-line react/no-array-index-key
        <MathlerSquare key={i + 1} guessState={guessState} value={value} />
      ))}
    </div>
  );
}
