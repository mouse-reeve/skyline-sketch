var get_palette = function (type, h, s, l) {
    // HSL 100
    var options = {
        'mono': mono_palette,
        'triadic': triadic,
        'split': split_complementary,
    };
    var choice = selecter(options, type);
    return choice(h, s, l);
};

var mono_palette = function (h, s, l) {
    var colors = [];

    var saturation = s || 20;
    var shades = 5;
    var base_hue = h || random(0, 100);
    for (var i = 0; i < shades; i++) {
        var lightness = 30 + 50 * ((i + 1) / (shades + 1));
        colors.push(
            color(base_hue, saturation, lightness, 100)
        );
    }
    return colors;
};

var split_complementary = function (h, s, l) {
    var colors = [];

    var base_hue = h || random(0, 100);
    var saturation = s || 20;
    var lightness = l || 40;

    for (var i = -1; i <= 1; i++) {
        for (var j = 0; j < 2; j++) {
            var adjusted_lightness = lightness + (j * ((100 - lightness) * 0.4));
            colors.push(
                color((base_hue + (i * 20)) % 100, saturation, adjusted_lightness)
            );
        }
    }
    return colors;
};

var triadic = function(h, s, l) {
    var colors = [];
    var base_hue = h || random(0, 100);
    var saturation = s || 25;
    var lightness = l || random(30, 60);

    for (var i = -1; i <= 1; i++) {
        for (var j = 0; j < 1 + Math.abs(i); j++) {
            var adjusted_lightness = lightness + (j * ((100 - lightness) * 0.4));
            colors.push(
                color((base_hue + (i * (100 / 3))) % 100, saturation, adjusted_lightness)
            );
        }
    }
    return colors;
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
