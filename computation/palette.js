var random_palette = function () {
    // HSL 100
    var options = [mono_palette, split_complementary];
    return random(options)();
};

var mono_palette = function () {
    var colors = [];

    var shades = 3;
    var hue = random(0, 100);
    var saturation = 20;
    for (var i = 0; i < shades; i++) {
        var lightness = 30 + i * 25;
        colors.push(
            color(hue, saturation, lightness, 100)
        );
    }
    return colors;
};

var split_complementary = function () {
    var colors = [];

    // base shade
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
}
