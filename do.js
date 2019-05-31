const et = require('./existy-and-truthy');

const doWhen = (condition, action) => {
  if (et.truthy(condition)) {
    return action();
  } else {
    return undefined;
  }
};

exports.doWhen = doWhen;
