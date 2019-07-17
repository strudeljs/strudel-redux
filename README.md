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
import { Subscribe, AttachStore }  from 'strudel-redux';
import { toggleStockStatus } from '../../actions/';

@AttachStore(store)
@Component('.example')
class Example {
  init() {
    store.dispatch(toggleStockStatus());
  }
  
  @Subscribe({
    observed: state => ({ 
      price: state.productDetails.price,
    }),
    passive: state => ({
      stockStatus: state.productDetails.stockStatus,
    })
  })
  onPriceChange({ price, stockStatus }) {
    // put down your logic here
  }
})
```

### API
* `@Component(selector)` - is necessary for package to work.
* `@AttachStore(store)` - required decorator to bind store to component.
* `@Subscribe: { observed: () => {}, passive: () => {}` - decorator that makes subscription to the store. Decorated method is invoked with values returned from both `observed` and `passive` methods.
    * `observed` method that maps state to variables. Any change on one of these properties invokes decorated method.
    * `passive` method that maps state to variables. Any change to one of these properties doesn't invoke decorated method. 

## License

[MIT](https://opensource.org/licenses/MIT)
