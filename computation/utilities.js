var chaos = function(value, variance) {
    return random(-1 * (value * variance), value * variance);
};

var color_sort = function(colors, reference_color) {
    // 0 and 100 are next to each other, hue-wise
    var color_diff = function(a, b) {
        var diff = Math.abs(hue(a) - hue(b));
        return diff > 50 ? 100 - diff : diff;
    };

    colors.sort(function (a, b) {
        return color_diff(a, reference_color) - color_diff(b, reference_color);
    });
    return colors;
};
