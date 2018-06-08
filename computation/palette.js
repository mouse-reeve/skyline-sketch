var random_palette = function () {
    // HSL 100
    var options = [triadic, mono_palette, split_complementary];
    return random(options)();
};

var mono_palette = function () {
    var colors = [];

    var saturation = 20;
    var shades = 3;
    var hue = random(0, 100);
    for (var i = 0; i < shades; i++) {
        var lightness = 10 + 100 * ((i + 1) / (shades + 1));
        colors.push(
            color(hue, saturation, lightness, 100)
        );
    }
    return colors;
};

var split_complementary = function () {
    var colors = [];

    var base_hue = random(0, 100);
    var saturation = 20;
    var lightness = 40;

    for (var i = -1; i <= 1; i++) {
        for (var j = 0; j < 2; j++) {
            colors.push(
                color((base_hue + (i * 20)) % 100, saturation, lightness + (j * 20))
            );
        }
    }
    return colors;
};

var triadic = function() {
    var colors = [];
    var base_hue = random(0, 100);
    var saturation = 25;
    var lightness = random(30, 60);

    for (var i = -1; i <= 1; i++) {
        for (var j = 0; j < 1 + Math.abs(i); j++) {
            colors.push(
                color((base_hue + (i * (100 / 3))) % 100, saturation, lightness + (j * 20))
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
