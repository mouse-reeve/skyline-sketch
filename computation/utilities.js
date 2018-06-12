var chaos = function(value, variance) {
    return random(-1 * (value * variance), value * variance);
};

var selecter = function(option_dict, choice) {
    var keys = Object.keys(option_dict);
    var key = keys.indexOf(choice) != -1 ? choice : random(keys);
    return option_dict[key];
};

var lighten = function(input_color, amount) {
    return color(
        hue(input_color),
        saturation(input_color),
        lightness(input_color) * (1 - amount)
    );
};
