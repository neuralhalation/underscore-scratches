const et = require('./existy-and-truthy')

const do_when = (condition, action) => {
    if (et.truthy(condition))
        return action();
    else
        return undefined;
}

exports.do_when