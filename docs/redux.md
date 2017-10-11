
# Redux

## Key Resource
 1. [Redux Documentation](http://redux.js.org/docs/introduction/CoreConcepts.html)
 2. [Presentation vs Container components example](https://gist.github.com/chantastic/fc9e3853464dffdb1e3c)

## Glossary

 - **Store**: A read-only JS object. The single object tree that stores the stores the state of your entire app.
 - **Action**: A JS object with a `type` property. The only way to change the state tree is to emit an action aka an object describing the change.
 - **Reducer**: A JS function. Given an action and a state tree, a reducer is a pure function that returns a new, updated state. It's important to return the old state as the default for any unknown/invalid actions.
 - **Action Creator**: A JS function that returns an action. They can be asynchronous or have side-effects.
 - **dispatch()**: Part of the Redux API that applies some action to the state store. Can be accessed as a method on the `store` object like: `store.dispact(action)`.
 - **Bound Action Creator**: An action creator that automatically calls dispatch().

## Core Concepts

The central idea to Redux is that state is immutable. You can't change the state of your application, you can only create a new state. This limitation has the benefit of making it simple to determine whether or not the state has changed. This not only helps us manage complexity but enables powerful developer tools like a time traveling debugger.

Mutation and asynchronicity: Each is a powerful concept in isolation but together they create unintelligible messes. Redux tries to keep the power but organize the mess by imposing restrictions on mutation.

## React, meet Redux

React bindings for Redux embrace the separation of presentational components and container components.

Presentational components define how things look and are not wired up to data sources like redux. Instead, they get all their data from props.

Container components are responsible for managing data flow and giving presentational components the data they need. We could write container components by hand but the redux-react package offers optimized versions which are preferred.

The presentational/container separation is not a strict rule, early in an app's life or in simple cases, these two functionalities will blur together and that's fine. This is a strategy to manage complexity, not dogma.

## Asynchronous Actions


