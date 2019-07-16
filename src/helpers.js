function isObservedChanged(currentObserved, previousObserved) {
  return !Object.keys(currentObserved).every(key => currentObserved[key] === previousObserved[key]);
}

export {isObservedChanged};
