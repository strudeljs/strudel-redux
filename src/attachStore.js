import {isObservedChanged} from "./helpers";

function AttachStore(store) {
  return function (target) {
    const {subscriptionQueue} =  target.prototype;

    let currentState = store.getState();

    function handleStoreChange() {
      let previousState = currentState;
      currentState = store.getState();

      subscriptionQueue.forEach(({observed, passive, method}) => {
        if (isObservedChanged(observed(previousState), observed(currentState))){
          method.call(this, Object.assign({}, observed(currentState),passive(currentState)));
        }
      });
    }

    const oldInit = target.prototype.init || (() => {});
    target.prototype.init = function (){
      oldInit();
      store.subscribe(handleStoreChange.bind(this));
    };
  };
}

export {AttachStore};
