# Reactivity lectures

A draft for lectures on reactivity.

## v0

http://jlongster.com/Removing-User-Interface-Complexity,-or-Why-React-is-Awesome

Key flaws: object-oriented, hooks, not fractal, state, update mechanics, V and C layers are coupled, lacks reactivity

## v1

1. Stateless components
2. Fractal architecture
3. Still familiar React-like look

Key flaws: object-oriented, lacks diff mechanics, state, update mechanics, V and C is coupled, lacks reactivity

## v2

Add VirtualDOM

Key flaws: update mechanics, V and C layers are coupled, lacks reactivity

## v3

Add Baobab

Key flaws: V and C layers are coupled, lacks reactivity

## v4

http://cycle.js.org/

---

Pitfalls:
  Promises are eager. Observables are lazy.
  Promise encapsulates result of evaluation.
  It does not keep the formula for evaluation.
  It's impossible to unsubscribe from Promise in a result.

  Observable

API mismatch
  Promise(function (resolve, reject) {
    ...
  })

  Observable(function (observer) {
    ...
  })

  or

  Observable(function ({onNext, onError, onEnd}}) {
    ...
  }) -- does not work because `this` is lost

  could be

  Observable(function(onNext, onError, onEnd) {
    ...
  }) -- same problem

  or even

  Observable(function(resolve, reject, finish) {
    ...
  }) -- same problem

