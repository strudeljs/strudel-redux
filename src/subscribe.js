const bindedMethods = ['init', 'beforeDestroy', 'onStateChange', '_react',];

const reactiveMixin = {
  init() {
    this._react();

    this.unsubscribe = window.__reduxStore.subscribe(() => {
      this.onStateChange();
      this._react();
    });
  },

  beforeDestroy() {
    this.unsubscribe();
  },

  onStateChange() {
    return true;
  },

  _react() {
    if (!this.render) return;

    this.render(this);
  }
};

const patch = (target, funcName) => {
  const base = target[funcName];
  const mixinFunc = reactiveMixin[funcName];

  const f = !base ? mixinFunc : function () {
    base.apply(this, arguments);
    mixinFunc.apply(this, arguments);
  }

  target[funcName] = f;
}

const mixin = (target) => {
  bindedMethods.forEach((funcName) => {
    patch(target, funcName);
  });
}

const getState = () => window.__reduxStore.getState();
const dispatch = (e) => window.__reduxStore.dispatch(e);
const replaceReducer = (e) => window.__reduxStore.replaceReducer(e);

const initStore = (store) => {
  window.__reduxStore = store;
  return window.__reduxStore;
};

const subscribe = (arg) => {
  const componentClass = arg;
  const target = componentClass.prototype;

  if (!target || !target.isStrudelClass) {
    throw new Error('Please pass a valid component to "Subscribe"');
  }

  mixin(target);
  return target;
};

export { subscribe as Subscribe, initStore, getState, dispatch, replaceReducer };