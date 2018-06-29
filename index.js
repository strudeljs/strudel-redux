(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.strudelRedux = {})));
}(this, (function (exports) { 'use strict';

var bindedMethods = ['init', 'beforeDestroy', 'onStateChange', '_react'];

var reactiveMixin = {
  init: function init() {
    var _this = this;

    this._react();

    this._unsubscribe = window.__reduxStore.subscribe(function () {
      _this.onStateChange();
      _this._react();
    });
  },
  beforeDestroy: function beforeDestroy() {
    this._unsubscribe();
  },
  onStateChange: function onStateChange() {
    return true;
  },
  _react: function _react() {
    if (!this.render) return;

    this.render(this);
  }
};

var patch = function patch(target, funcName) {
  var base = target[funcName];
  var mixinFunc = reactiveMixin[funcName];

  var f = !base ? mixinFunc : function () {
    base.apply(this, arguments);
    mixinFunc.apply(this, arguments);
  };

  target[funcName] = f;
};

var mixin = function mixin(target) {
  bindedMethods.forEach(function (funcName) {
    patch(target, funcName);
  });
};

var getState = function getState() {
  return window.__reduxStore.getState();
};
var dispatch = function dispatch(e) {
  return window.__reduxStore.dispatch(e);
};
var replaceReducer = function replaceReducer(e) {
  return window.__reduxStore.replaceReducer(e);
};

var initStore = function initStore(store) {
  window.__reduxStore = store;
  return window.__reduxStore;
};

var subscribe = function subscribe(arg) {
  var componentClass = arg;
  var target = componentClass.prototype;

  if (!target || !target.isStrudelClass) {
    throw new Error('Please pass a valid component to "Subscribe"');
  }

  mixin(target);
  return target;
};

exports.Subscribe = subscribe;
exports.initStore = initStore;
exports.getState = getState;
exports.dispatch = dispatch;
exports.replaceReducer = replaceReducer;

Object.defineProperty(exports, '__esModule', { value: true });

})));
