import isObservedChanged from './helpers';

function AttachStore(store) {
  return function AttachStoreToComponent(target) {
    const { subscriptionQueue = [] } = target.prototype;

    let currentState = store.getState();

    function handleStoreChange() {
      const previousState = currentState;
      currentState = store.getState();

      subscriptionQueue.forEach(({ observed, passive, method }) => {
        if (isObservedChanged(observed(previousState), observed(currentState))) {
          method.call(this, Object.assign({}, observed(currentState), passive(currentState)));
        }
      });
    }

    const {
      init: originalInit,
      beforeDestroy: originalBeforeDestroy,
    } = target.prototype;

    // eslint-disable-next-line no-param-reassign
    target.prototype.init = function init() {
      originalInit.call(this);
      this.unsubscribe = store.subscribe(handleStoreChange.bind(this));
    };

    // eslint-disable-next-line no-param-reassign
    target.prototype.beforeDestroy = function beforeDestroy() {
      this.unsubscribe();
      originalBeforeDestroy.call(this);
    };
  };
}

export default AttachStore;
