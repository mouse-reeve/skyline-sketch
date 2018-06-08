var chaos = function(value, variance) {
    return random(-1 * (value * variance), value * variance);
};

var color_sort = function(colors, hue) {
    colors.sort(function (a, b) {
        return Math.abs(a._getHue() - hue) - Math.abs(b._getHue() - hue);
    });
    return colors;
};
