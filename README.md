# Strudel-redux

Package with Strudel component wrapper for combining Strudel with Redux.

## Getting Started

This plugin provides simpler API for Redux with Strudel.

### Installation

```
npm install strudel-redux --save
```
or
```
yarn add strudel-redux
```

### Example

```
import { Component, Evt } from 'strudel';
import { Subscribe, dispatch } from 'strudel-redux';
import { toggleStockStatus } from '../../actions/';

@Subscribe({
  observed: state => ({ 
    price: state.productDetails.price,
  }),
  statics: state => ({
   stockStatus: state.productDetails.stockStatus,
  })
})
@Component('.example')
class Example {
  init() {
    this.dispatch(toggleStockStatus());
  }

  onStateChange({ price, stockStatus }) {
    // put down your logic here
  }
}
```

### API

* `@Subscribe(store, callbackFunction)` - required decorator to bind strudel-redux to component
* `onStateChange(properties)` - added method called on change of properties declared as observed
* `callbackFunction: { observed: () => {}, statics: () => {}` - functions that will return mapped state properties
* `observed` method is called on store change, and will trigger `onStateChange` if returned value differs from previous
* `statics` method is called whenever `observed` function will detect change, and provides additional props that does not trigger onStateChange call
