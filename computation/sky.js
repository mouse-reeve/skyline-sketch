var get_sky = function(name, horizon, palette) {
    var skies = {
        'gradient': gradient_sky,
        'night': night_sky,
        'day': day_sky,
    };
    var choice = selecter(skies, name);
    return choice(horizon, palette);
};

var gradient_sky = function(horizon, palette) {
    // select blues, yellows for the sky
    var blues = color_sort(palette, color('#00f'));
    var colors = blues.slice(0, 2);
    var yellows = color_sort(palette, color('#ff0'));
    colors.concat(yellows.slice(0, 2));

    var points = [];
    var bucket_size = horizon / colors.length + (horizon / Math.pow(colors.length, 1.7));
    for (var y = 0; y < horizon; y++) {
        for (var x = 0; x < width; x++) {
            var bucket = Math.floor((y / bucket_size) + (x * 0.0002));
            var distance = y - (bucket * bucket_size) + (x * 0.02);
            var sign = distance / Math.abs(distance) || 1;
            var new_bucket = bucket;

            if (random() < distance / bucket_size) {
                new_bucket = bucket + sign;
            }
            new_bucket = new_bucket < colors.length ? new_bucket : colors.length - 1;
            if (random() > 0.0) {
                points.push(new Point(x, y, colors[new_bucket]));
            }
        }
    }
    return {points: points};
};

var night_sky = function(horizon, palette) {
    var blues = color_sort(palette, color('#00f'));

    shapes = [
        {rects: [new Rect(0, 0, horizon, width, blues[0])]},
        moon(horizon, palette),
        stars(horizon, palette),
    ];
    return shapes;
};

var moon = function(horizon, palette) {
    var yellowest = color_sort(palette, color('#ff0'))[0];
    var x = width * 0.8;
    var y = horizon * 0.3;
    var radius = height / 20;
    var offset = round(random(1, 7));
    return crescent(x, y, radius, offset, yellowest);
};

var stars = function(horizon, palette) {
    var yellowest = color_sort(palette, color('#ff0'))[0];
    var h = 5;
    var w = 2;
    var shimmer = 5;
    var star_list = []
    for (var i = 0; i < 3; i++) {
        var x = width * random();
        var y = horizon * random();
        star_list.push(new Shape([
            [x + w, y, w / 2],
            [x + 1, y - 1],
            [x, y + h, 0, h / 2],
            [x - 1, y + 1],
            [x - w, y, w / 2],
            [x - 1, y - 1],
            [x, y - h, 0, h / 2],
            [x + 1, y + 1],
        ], yellowest));
    }
    return {shapes: star_list};
};

var day_sky = function(horizon, palette) {
    var blues = color_sort(palette, color('#00f'));

    shapes = [
        {rects: [new Rect(0, 0, horizon, width, blues[1])]},
        sun(horizon, palette),
    ];
    return shapes;
};

var sun = function(horizon, palette) {
    var yellowest = color_sort(palette, color('#ff0'))[0];
    var reds = color_sort(palette, color('#f00'));
    var radius = 60;
    var x = width * 0.8;
    var y = horizon * 0.3;

    var shapes = [
        ring(x + radius * 1.1, y + radius * 1.1, radius * 0.12, radius * 0.13, reds[1]),
        ring(x + radius * 0.8, y + radius * 0.8, radius * 0.10, radius * 0.11, reds[1]),
        ring(x + radius * 0.5, y + radius * 0.5, radius * 0.25, radius * 0.26, reds[1]),
        ring(x + radius * 0.5, y + radius * 0.5, radius * 0.25, radius * 0.26, reds[1]),
        ring(x - radius * 0.5, y - radius * 0.5, radius * 0.25, radius * 0.26, reds[1]),
        ring(x, y, radius * 0.55, radius * 0.57, reds[1]),
        star_shape(x, y, radius * 0.3, 15, radius, yellowest),
        star_shape(x, y, radius * 0.2, 45, radius * 0.9, yellowest),
    ];
    return {shapes: shapes};

}
