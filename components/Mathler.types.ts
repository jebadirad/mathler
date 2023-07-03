export type GameBoard = {
  board: Array<Row>;
  currentIndex: number;
  isGameOver: boolean;
  buttonInputs: {
    [key in Operator | NumberValue]: GuessSpotState;
  };
};
export enum GuessSpotState {
  Correct,
  Wrong,
  ValueOnly,
  Empty,
}

export type Row = Array<Square>;
export const numberInputs = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
] as const;
export const operatorInputs = ['+', '-', '/', '*'] as const;

export const isOperator = (val: string): val is Operator => {
  if (operatorInputs.findIndex((i) => i === val) > -1) {
    return true;
  }
  return false;
};

export const operatorRegEx = new RegExp(
  operatorInputs.map((o) => `[${o}]`).join('|'),
  'g'
);

export const isValidValue = (val: string): val is Operator | NumberValue => {
  if (numberInputs.findIndex((i) => i === val) > -1 || isOperator(val)) {
    return true;
  }

  return false;
};

export type Operator = '+' | '-' | '/' | '*';
export type NumberValue =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';
export type Square = {
  value: Operator | NumberValue | null;
  guessState: GuessSpotState;
};
