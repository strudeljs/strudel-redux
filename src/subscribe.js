export const subscribedStateChanged = (observedState, stateMemory) => Object
  .entries(observedState)
  .some(([key, value]) => stateMemory[key] !== value);

/* eslint-disable no-param-reassign, func-names */
export const Subscribe = (store, {observed, statics: () => {} }) => function (target) {
  let stateMemory = observed(store.getState());

  Object.defineProperty(target.prototype, 'dispatch', {
    value(action) {
      return store.dispatch(action);
    },
    enumerable: true,
  });

  const orgInit = target.prototype.init;

  target.prototype.init = function () {
    orgInit.call(this);

    store.subscribe(() => {
      const storeState = store.getState();
      const observedState = observed(storeState);
      const stateChanged = subscribedStateChanged(observedState, stateMemory);
      
      if (stateChanged) {
        const staticState = statics(storeState);
        this.onStateChange({...observedState, ...staticState});

        stateMemory = observedState;
      }
    });
  };

  return target;
};

// eslint-enable no-param-reassign, func-names