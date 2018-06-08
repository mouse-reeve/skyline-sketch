var chaos = function(value, variance) {
    return random(-1 * (value * variance), value * variance);
};

var selecter = function(option_dict, choice) {
    var keys = Object.keys(option_dict);
    var key = keys.indexOf(choice) != -1 ? choice : random(keys);
    return option_dict[key];
};
