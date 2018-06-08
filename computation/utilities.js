var chaos = function(value, variance) {
    return random(-1 * (value * variance), value * variance);
};

var color_sort = function(colors, reference_color) {
    colors.sort(function (a, b) {
        return Math.abs(hue(a) - reference_color) - Math.abs(hue(b) - reference_color);
    });
    return colors;
};
