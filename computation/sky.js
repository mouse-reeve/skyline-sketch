var random_sky = function(horizon, colors) {
    var skies = [gradient_sky, block_sky];
    // select blues, yellows for the sky
    var blues = color_sort(colors, color('#00f'));

    sky_colors = blues.slice(0, 2);
    var yellows = color_sort(colors, color('#ff0'));
    sky_colors.concat(yellows.slice(0, 2));
    return random(skies)(horizon, sky_colors);
};

var gradient_sky = function(horizon, colors) {
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

var block_sky = function(horizon, colors) {
    return {rects:
        [new Rect(0, 0, horizon, width, colors[0])],
    };
};

var moon = function(horizon, palette) {
    var yellowest = color_sort(palette, color('#ff0'))[0];
    var x = width * 0.8;
    var y = horizon * 0.3;
    var radius = height / 20;
    var offset = random(1, 7);
    return crescent(x, y, radius, offset, yellowest);
};

