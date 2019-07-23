import Subscribe from '../src/subscribe';


describe('Subscribe', () => {
  test('Should Change Class prototype', () => {
    class TestComponent {
      testMethod() {}
    }

    const observed = () => {};
    const passive = () => {};

    Subscribe({ observed, passive })(
      TestComponent.prototype,
      'testMethod',
      Object.getOwnPropertyDescriptor(TestComponent.prototype, 'testMethod')
    );

    expect(TestComponent.prototype.subscriptionQueue).toHaveLength(1);
    expect(TestComponent.prototype.subscriptionQueue[0].observed).toBe(observed);
    expect(TestComponent.prototype.subscriptionQueue[0].passive).toBe(passive);
    expect(TestComponent.prototype.subscriptionQueue[0].method)
      .toBe(TestComponent.prototype.testMethod);
  });
});
