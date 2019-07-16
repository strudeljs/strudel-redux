import AttachStore from '../src/attachStore';
import { actions, store } from './initials';

describe('attachStore', () => {
  test('TestComponent.testMethod should be called', () => {
    class TestComponent {
      testMethod() {}
    }

    const component = new TestComponent();

    const observed = state => ({
      price: state.price,
    });

    const passive = state => ({
      stockInfo: state.stockInfo,
    });

    const spy = jest.spyOn(TestComponent.prototype, 'testMethod');

    TestComponent.prototype.subscriptionQueue = [{
      observed,
      passive,
      method: TestComponent.prototype.testMethod,
    }];

    TestComponent.prototype.init = () => {};

    AttachStore(store)(TestComponent);
    component.init();

    store.dispatch({ type: actions.observed });

    expect(spy).toHaveBeenCalledWith({
      price: 120,
      stockInfo: 'InStock',
    });

    store.dispatch({ type: actions.observed });
    expect(spy).toHaveBeenCalledTimes(2);

    store.dispatch({ type: actions.static });
    expect(spy).toHaveBeenCalledTimes(2);

    store.dispatch({ type: actions.observed });
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({
      price: 160,
      stockInfo: 'OutOfStock',
    });
  });
});
