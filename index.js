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

    function handleStoreChangeWrapper() {
      var currentState = store.getState();
      return function handleStoreChange() {
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
      };
    }

    var _target$prototype = target.prototype,
        originalInit = _target$prototype.init,
        originalBeforeDestroy = _target$prototype.beforeDestroy; // eslint-disable-next-line no-param-reassign

    target.prototype.init = function init() {
      var _this2 = this;

      var currentState = store.getState();
      originalInit.call(this);
      subscriptionQueue.forEach(function (_ref2) {
        var observed = _ref2.observed,
            passive = _ref2.passive,
            method = _ref2.method,
            shouldTriggerOnInit = _ref2.shouldTriggerOnInit;

        if (shouldTriggerOnInit) {
          method.call(_this2, Object.assign({}, observed(currentState), passive(currentState)));
        }
      });
      this.unsubscribe = store.subscribe(handleStoreChangeWrapper().bind(this));
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
      passive = _ref$passive === void 0 ? function () {} : _ref$passive,
      _ref$shouldTriggerOnI = _ref.shouldTriggerOnInit,
      shouldTriggerOnInit = _ref$shouldTriggerOnI === void 0 ? false : _ref$shouldTriggerOnI;

  return function addSubscriptionToQueue(target, name, descriptor) {
    if (typeof observed !== 'function') {
      // eslint-disable-next-line no-console
      console.error('Observed must be a function that maps state to variables');
    }

    var queueElement = {
      observed: observed,
      passive: passive,
      shouldTriggerOnInit: shouldTriggerOnInit,
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
