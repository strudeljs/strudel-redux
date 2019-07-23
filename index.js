(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.strudelRedux = {})));
}(this, (function (exports) { 'use strict';

function isObservedChanged(currentObserved, previousObserved) {
  return !Object.keys(currentObserved).every(function (key) {
    return currentObserved[key] === previousObserved[key];
  });
}

function AttachStore(store) {
  return function AttachStoreToComponent(target) {
    var _target$prototype$sub = target.prototype.subscriptionQueue,
        subscriptionQueue = _target$prototype$sub === void 0 ? [] : _target$prototype$sub;
    var currentState = store.getState();

    function handleStoreChange() {
      var _this = this;

      var previousState = currentState;
      currentState = store.getState();
      subscriptionQueue.forEach(function (_ref) {
        var observed = _ref.observed,
            passive = _ref.passive,
            method = _ref.method;

        if (isObservedChanged(observed(previousState), observed(currentState))) {
          method.call(_this, Object.assign({}, observed(currentState), passive(currentState)));
        }
      });
    }

    var _target$prototype = target.prototype,
        originalInit = _target$prototype.init,
        originalBeforeDestroy = _target$prototype.beforeDestroy; // eslint-disable-next-line no-param-reassign

    target.prototype.init = function init() {
      originalInit.call(this);
      this.unsubscribe = store.subscribe(handleStoreChange.bind(this));
    }; // eslint-disable-next-line no-param-reassign


    target.prototype.beforeDestroy = function beforeDestroy() {
      this.unsubscribe();
      originalBeforeDestroy.call(this);
    };
  };
}

function Subscribe() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      observed = _ref.observed,
      _ref$passive = _ref.passive,
      passive = _ref$passive === void 0 ? function () {} : _ref$passive;

  return function addSubscriptionToQueue(target, name, descriptor) {
    if (typeof observed !== 'function') {
      // eslint-disable-next-line no-console
      console.error('Observed must be a function that maps state to variables');
    }

    var queueElement = {
      observed: observed,
      passive: passive,
      method: descriptor.value
    };

    if (!target.subscriptionQueue) {
      // eslint-disable-next-line no-param-reassign
      target.subscriptionQueue = [];
    }

    target.subscriptionQueue.push(queueElement);
    return descriptor;
  };
}

exports.AttachStore = AttachStore;
exports.Subscribe = Subscribe;

Object.defineProperty(exports, '__esModule', { value: true });

})));
