var random_palette = function() {
    // HSL 100
    var options = [mono_palette];
    return random(options)();
};

var mono_palette = function() {
    var colors = [];

    // mono
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

