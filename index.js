(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.strudelRedux = {})));
}(this, (function (exports) { 'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var subscribedStateChanged = function subscribedStateChanged(observedState, stateMemory) {
  return Object.entries(observedState).some(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return stateMemory[key] !== value;
  });
};
/* eslint-disable no-param-reassign, func-names */

var Subscribe = function Subscribe(store, _ref3) {
  var observed = _ref3.observed,
      _ref3$statics = _ref3.statics,
      statics = _ref3$statics === void 0 ? function () {} : _ref3$statics;
  return function (target) {
    var stateMemory = observed(store.getState());
    Object.defineProperty(target.prototype, 'dispatch', {
      value: function value(action) {
        return store.dispatch(action);
      },
      enumerable: true
    });
    var orgInit = target.prototype.init;
    var orgTeardown = target.prototype.$teardown;
    var unsubscribe;

    target.prototype.init = function () {
      var _this = this;

      orgInit.call(this);
      var unsubscribe = store.subscribe(function () {
        var storeState = store.getState();
        var observedState = observed(storeState);
        var stateChanged = subscribedStateChanged(observedState, stateMemory);

        if (stateChanged) {
          var staticState = statics(storeState);

          _this.onStateChange(_objectSpread({}, observedState, staticState));

          stateMemory = observedState;
        }
      });
    };

    target.prototype.$teardown = function () {
      unsubscribe();
      orgTeardown.call(this);
    };

    return target;
  };
}; // eslint-enable no-param-reassign, func-names

exports.subscribedStateChanged = subscribedStateChanged;
exports.Subscribe = Subscribe;

Object.defineProperty(exports, '__esModule', { value: true });

})));
