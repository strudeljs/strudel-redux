import {isObservedChanged} from '../src/helpers';
import { actions, store, initialState } from './initials';

describe('isObservedChanged', () => {
  test('should return false if states are the same', () => {
    expect(isObservedChanged(initialState, store.getState()))
      .toEqual(false);
  });


  test('should return true if states differ', () => {
    store.dispatch({ type: actions.observed });
    expect(isObservedChanged(initialState, store.getState()))
      .toEqual(true);
  });
});
