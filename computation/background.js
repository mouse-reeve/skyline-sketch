var mountains = function(horizon, composition, palette) {
    var mountain_color = color_sort(palette, color('#00f'))[1];
    var shapes = [];
    var mountain_gap;
    for (var x = 0; x < width; x += mountain_gap) {
        // mountains scale inversely to the line of the buildings, for e f f e c t
        var scale = 1 / Math.pow(3 * composition[0](x).scale, 0.4);
        var base = horizon * 0.8 * scale;
        base += chaos(base, 0.2);
        var mountain_height = (horizon * 0.8) * scale;
        mountain_height += chaos(mountain_height, 0.3);
        var vertices = [
            [x - base, horizon],
            [x + base, horizon],
            [x, horizon - mountain_height],
        ];
        shapes.push(new Shape(vertices, mountain_color));
        mountain_gap = base * 0.7;
    }
    return {shapes: shapes};
};
