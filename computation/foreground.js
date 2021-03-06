var get_foreground = function(name, horizon, palette) {
    var foregrounds = {
        'dirt': dirt,
        'ocean': ocean,
        'forest': forest,
    };
    var choice = selecter(foregrounds, name);
    return choice(horizon, palette);
};

var ocean = function(horizon, palette) {
    var greenest = color_sort(palette, color('#0f0'))[0];
    var bluest = color_sort(palette, color('#00f'))[0];
    var base_color = lerpColor(bluest, greenest, 0.1);

    var shapes = [
        new Shape([
            [0, height],
            [0, horizon],
            [width, horizon],
            [width, height],
        ], base_color)
    ];

    var v_scale = (height / 20);
    for (var x = -2 * v_scale; x < width; x += v_scale) {
        for (var y = horizon; y < height; y += 5) {
            if (random() > 0.1) {
                var scale = 9 / Math.pow((height - y), 0.5);

                var poly_color = lerpColor(base_color, white, random(0.1, 0.5));
                var length = scale * random(30, 150);
                var wave_height = (scale) * random(3, 6);

                shapes.push(new Shape([
                    [x + random(4), y + random(2)],
                    [x + random(3), y + 1],
                    [x + (length / 2), y + wave_height, 0, length / 8],
                    [x + length, y + 1],
                    [x + length, y],
                ], poly_color));
            }
        }
    }

    return {shapes: shapes};
};

var forest = function(horizon, palette) {
    var shapes = [];
    var tree_size = 80;

    for (var y = horizon + (horizon / 3); y < height + (tree_size / 5.5); y += tree_size / 10 + 30) {
        for (var x = 0 - (tree_size / 2); x < width + tree_size; x+=random(tree_size * 0.5, tree_size * 1)) {
            shapes = shapes.concat(
                pine_tree(
                    x,
                    y + random(height / -30, height / 30),
                    tree_size * (y / height)**5,
                    palette
                )
            );
        }
    }
    return {shapes: shapes};
}

var dirt = function(horizon, palette) {
    var red = color_sort(palette, color('#f00'))[1];
    return {rects: [new Rect(0, horizon, height, width, red)]};
};

