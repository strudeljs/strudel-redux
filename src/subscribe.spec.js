import { createStore } from 'redux';
import { subscribedStateChanged, Subscribe } from './subscribe';

const actions = {
  observed: 'MockObservedAction',
  static: 'MockStaticAction',
};

const initialState = {
  price: 100,
  stockInfo: 'InStock',
};

const store = createStore((state = initialState, action) => {
  switch (action.type) {
    case actions.observed:
      return {
        ...state,
        price: state.price + 20,
      };
    case actions.static:
      return {
        ...state,
        stockInfo: 'OutOfStock',
      };
    default:
      return state;
  }
});

describe('subscribedStateChanged', () => {
  const initialStoreState = store.getState();
  store.dispatch({ type: actions.observed });
  const secondaryStoreState = store.getState();

  test('should return false if states are the same', () => {
    expect(subscribedStateChanged(initialState, initialStoreState));
  });

  test('should return true if states differ', () => {
    expect(
      subscribedStateChanged(initialStoreState, secondaryStoreState),
    ).toEqual(true);
  });

  test('should return observed and static state', () => {
    class TestComponent {
      onStateChange() {}
      init() {}
    }
    const component = new TestComponent();

    const observed = state => ({
      price: state.price,
    });

    const statics = state => ({
      stockInfo: state.stockInfo,
    });

    const spy = jest.spyOn(TestComponent.prototype, 'onStateChange');
    const subscribe = Subscribe(store, { observed, statics })(TestComponent);

    component.init();

    store.dispatch({ type: actions.observed });

    expect(spy).toHaveBeenCalledWith({
      price: 140,
      stockInfo: 'InStock',
    });

    store.dispatch({ type: actions.observed });
    expect(spy).toHaveBeenCalledTimes(2);

    store.dispatch({ type: actions.static });
    expect(spy).toHaveBeenCalledTimes(2);

    store.dispatch({ type: actions.observed });
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({
      price: 180,
      stockInfo: 'OutOfStock',
    });
  });
});
