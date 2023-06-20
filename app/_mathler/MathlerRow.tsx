import { Row } from '../../components/Mathler.types';
import MathlerSquare from './MathlerSquare';

type MathlerRowProps = {
  row: Row;
  index: number;
};

export default function MathlerRow({ row, index }: MathlerRowProps) {
  return (
    <div className="flex gap-1 self-center">
      {row.map(({ guessState, value }, i) => (
        <MathlerSquare
          index={`${index}-${i}`}
          // justification, its a static array of 6 items, so the indicies will always be the same.
          // eslint-disable-next-line react/no-array-index-key
          key={i + 1}
          guessState={guessState}
          value={value}
        />
      ))}
    </div>
  );
}
