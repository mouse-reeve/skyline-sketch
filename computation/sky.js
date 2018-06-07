var gradient_sky = function(horizon, colors) {
    var points = [];
    var bucket_size = horizon / colors.length + (horizon / (colors.length ** 1.7));
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
    return points;
};
