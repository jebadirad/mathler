import { Mathler } from './Mathler';

describe('checking for correct answer tests', () => {
  it('should get the correct answer', () => {
    expect(
      Mathler.checkForCorrectAnswer({
        answer: '119+41',
        submitted: '119+41',
      })
    ).toBeTruthy();
  });
  it('should be able to transpose addition and multiplication', () => {
    expect(
      Mathler.checkForCorrectAnswer({
        answer: '119+41',
        submitted: '41+119',
      })
    ).toBeTruthy();

    expect(
      Mathler.checkForCorrectAnswer({
        answer: '1+12+9',
        submitted: '12+9+1',
      })
    ).toBeTruthy();

    expect(
      Mathler.checkForCorrectAnswer({
        answer: '10*3',
        submitted: '3*10',
      })
    ).toBeTruthy();

    expect(
      Mathler.checkForCorrectAnswer({
        answer: '3*10*5',
        submitted: '5*10*3',
      })
    ).toBeTruthy();

    expect(
      Mathler.checkForCorrectAnswer({
        answer: '10+5*3',
        submitted: '3*5+10',
      })
    ).toBeTruthy();
    expect(
      Mathler.checkForCorrectAnswer({
        answer: '10+5*3',
        submitted: '10+3*5',
      })
    ).toBeTruthy();
  });
  it('should return false for trying to switch multiplication with addition', () => {
    expect(
      Mathler.checkForCorrectAnswer({
        answer: '10+5*3',
        submitted: '10*3+5',
      })
    ).toBeFalsy();

    expect(
      Mathler.checkForCorrectAnswer({
        answer: '10+5*3',
        submitted: '10*5+3',
      })
    ).toBeFalsy();
  });
  it('should return true when switching the order of same right side operators', () => {
    expect(
      Mathler.checkForCorrectAnswer({
        answer: '10-5-3',
        submitted: '10-3-5',
      })
    ).toBeTruthy();

    expect(
      Mathler.checkForCorrectAnswer({
        answer: '100/10/5',
        submitted: '100/5/10',
      })
    ).toBeTruthy();
  });

  it('should return false when switching the left side of a right side operator', () => {
    expect(
      Mathler.checkForCorrectAnswer({
        answer: '100/10/5',
        submitted: '10/5/100',
      })
    ).toBeFalsy();
    expect(
      Mathler.checkForCorrectAnswer({
        answer: '10-5-3',
        submitted: '5-10-3',
      })
    ).toBeFalsy();

    expect(
      Mathler.checkForCorrectAnswer({
        answer: '21/7+9',
        submitted: '9/7+21',
      })
    ).toBeFalsy();
  });

  it('should return true when switching placement when operators are just add /sub', () => {
    expect(
      Mathler.checkForCorrectAnswer({
        answer: '28-3+7',
        submitted: '7+28-3',
      })
    ).toBeTruthy();
    expect(
      Mathler.checkForCorrectAnswer({
        answer: '28-3+7',
        submitted: '28+7-3',
      })
    ).toBeTruthy();
  });

  it('should return true when switching placement when operators are just multi / divide', () => {
    expect(
      Mathler.checkForCorrectAnswer({
        answer: '21/7*5',
        submitted: '5*21/7',
      })
    ).toBeTruthy();
    expect(
      Mathler.checkForCorrectAnswer({
        answer: '100/10*5',
        submitted: '5*100/10',
      })
    ).toBeTruthy();
  });
});
