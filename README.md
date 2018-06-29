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

store.js
```
import { initStore } from 'strudel-redux';
import { createStore } from 'redux';
import reducer from '../reducers/index';

const redux = createStore(reducer);

initStore(redux);
```

```
import { Component, Evt } from 'strudel';
import { Subscribe, getState, dispatch } from 'strudel-redux';
import { addTodo } from '../../actions/';

@Subscribe
@Component('.example')
class Example {
	init() {
        dispatch(addTodo('New task'));
	}

	onStateChange() {
        // put down your logic here
    }
}
```

### Example 2 (Redux + React)

You have a possibility to add `React` with `Virtual DOM` easily as well.
`render()` is called immediately after update the state

```
import React from 'react';
import reactDom from 'react-dom';

import { Component, Evt } from 'strudel';
import { Subscribe, getState } from 'strudel-redux';
import { addTodo } from '../../actions/';
import { Status } from './status';

@Subscribe
@Component('.example-2')
class Example2 {
	render() {
		reactDom.render(
			(<div>
				<input type="text"/>
				<div className="container">
					<Status/>
					{getState().todos.map((item) => <p key={item.id}>{item.id}. {item.title}</p>)}
				</div>
			</div>), this.$element.first());
	}
}
```

### API

* @Subscribe - required decorator to bind strudel-redux to the component
* initStore(store) - initializing redux store
* onStateChange() - this method is called after update the state
* getState() - returns the current state tree of your application
* dispatch(action) - dispatches action
* replaceReducer(nextReducer) - replaces the reducer currently used by the store to calculate the state
* render() - this method is called after update the state