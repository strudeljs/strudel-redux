import {createStore} from "redux";

const actions = {
  observed: 'MockObservedAction',
  static: 'MockStaticAction',
};

const initialState = {
  price: 100,
  stockInfo: 'InStock',
};

const store = createStore((state = initialState, action) => {
  switch (action.type) {
    case actions.observed:
      return {
        ...state,
        price: state.price + 20,
      };
    case actions.static:
      return {
        ...state,
        stockInfo: 'OutOfStock',
      };
    default:
      return state;
  }
});

export {actions, initialState, store};
