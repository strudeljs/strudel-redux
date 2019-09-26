function Subscribe({
  observed,
  passive = () => {},
  shouldTriggerOnInit = false,
} = {}) {
  return function addSubscriptionToQueue(target, name, descriptor) {
    if (typeof observed !== 'function') {
      // eslint-disable-next-line no-console
      console.error('Observed must be a function that maps state to variables');
    }
    const queueElement = {
      observed,
      passive,
      shouldTriggerOnInit,
      method: descriptor.value,
    };
    if (!target.subscriptionQueue) {
      // eslint-disable-next-line no-param-reassign
      target.subscriptionQueue = [];
    }
    target.subscriptionQueue.push(queueElement);

    return descriptor;
  };
}

export default Subscribe;
