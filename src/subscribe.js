function Subscribe({
    observed = () => {},
    passive = () => {}
  } = {}) {
  return function(target, name, descriptor) {
    const queueElement = {
      observed,
      passive,
      method: descriptor.value,
    };
    if (!target.subscriptionQueue){
      target.subscriptionQueue = []
    }
    target.subscriptionQueue.push(queueElement);
  }
}

export {Subscribe};
