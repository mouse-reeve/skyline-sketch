var mountains = function(horizon, composition, palette) {
    var mountain_color = color_sort(palette, color('#00f'))[1];
    var shapes = [];
    var mountain_gap;
    for (var x = 0; x < width * 1.1; x += mountain_gap) {
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

var hills = function(horizon, composition, palette) {
    var hill_color = color_sort(palette, color('#0f0'));
    var shapes = [];
    var hill_gap;
    for (var x = 0; x < width * 1.1; x += hill_gap) {
        var base = horizon * 1.1;
        base += chaos(base, 0.2);
        var hill_height = (horizon * 0.7);
        hill_height += chaos(hill_height, 0.2);
        var vertices = [
            [x - base, horizon], // anchor
            [x + (base * 0.4), horizon - hill_height], // control
            [x - (base * 0.4), horizon - hill_height], // control
            [x + base, horizon], // anchor
        ];
        hill_gap = base * 0.8;
        fill_color = x === 0 || x + hill_gap >= width * 1.1 ? hill_color[0] : hill_color[1];
        shapes.push(new Bezier(vertices, fill_color));
    }
    // move the first item to the end so it will be layered on top
    shapes.splice(0, 0, shapes.pop());
    shapes.reverse();
    return {beziers: shapes};
};

var clouds = function(horizon, composition, palette) {
    var lightbluest = color_sort(palette, color('#00f'))[1];
    lightbluest.setAlpha(80);

    var shapes = [];
    for (var i = 0; i < 3; i++) {
        var x = round(width * (0.3 ** (2.1 - i))) + random(5, 10);
        var y = (horizon / 2) - abs(i - 1) * 60 - random(-5, 5);
        var w = round(random(50, width / 2));
        var radius = round(random(10, 20));
        var vertices = [[x, y - radius]];

        vertices.push([x + (w * 0.25), y - radius - 10]);
        vertices.push([x + (w * 0.75), y - radius]);

        vertices.push([x + w, y - radius]);
        for (var a = -1 * HALF_PI; a < HALF_PI; a += TWO_PI / 40) {
            var sx = Math.round((x + w) + cos(a) * radius);
            var sy = Math.round(y + sin(a) * radius);
            vertices.push([sx, sy]);
        }
        vertices.push([x + w, y + radius]);

        lump_spot = random(0.2, 0.8);
        vertices.push([x + (w * lump_spot), y + radius + 5]);
        vertices.push([x + (w * (lump_spot - 0.2)), y + radius]);

        vertices.push([x, y + radius]);
        for (var a = HALF_PI; a < 3 * HALF_PI; a += TWO_PI / 40) {
            var sx = Math.round(x + cos(a) * radius);
            var sy = Math.round(y + sin(a) * radius);
            vertices.push([sx, sy]);
        }

        shapes.push(new Shape(vertices, lightbluest));
    }

    return {shapes: shapes};
}
