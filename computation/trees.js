var oak_tree = function (x, y, plant_size, palette) {
    var shapes = []

    var greens = color_sort(palette, color('#0f0')).slice(0, 2);
    var red = color_sort(palette, color('#f00'))[0];
    var yellow = color_sort(palette, color('#ff0'))[0];

    shapes.push(
        polygon(x + (plant_size / 8), y - plant_size, plant_size * 0.7, random(5, 7), greens[0])
    );

    var trunk_width = random(0.1, 0.2) * plant_size;
    var vertices = []
    vertices.push([x, y]);
    vertices.push([x, y - (plant_size / 4)]);

    vertices.push([x - (trunk_width * random(1, 2)), y - plant_size]);
    vertices.push([x + (trunk_width / 2), y - (plant_size * 0.5)]);
    vertices.push([x + trunk_width + (trunk_width * random(1, 2)), y - plant_size]);

    vertices.push([x + trunk_width, y - (plant_size / 4)]);
    vertices.push([x + trunk_width, y]);

    shapes.push(new Shape(vertices, red));

    return shapes;
}

var pine_tree = function (x, y, plant_size, palette) {
    var green = color_sort(palette, color('#0f0'))[0]
    var red = color_sort(palette, color('#f00'))[0];

    var shapes = [];

    var plant_height = plant_size * 2;

    var trunk_width = random(0.05, 0.1) * plant_size;
    var vertices = [];
    vertices.push([x, y]);
    vertices.push([x + (trunk_width / 2), y - plant_height]);
    vertices.push([x + trunk_width, y]);
    shapes.push(new Shape(vertices, red));

    var xo = x + (trunk_width / 2);
    var branch = plant_height ** 0.4;
    for (var p = plant_height * 0.95; p > 0; p -= branch * 0.8) {
        var wo = (p ** 0.8) + random(-1 * (p ** 0.7) / 10, (p ** 0.7) / 10);
        var yo = y - plant_height + p;

        vertices = [];
        vertices.push([xo - wo, yo]);
        vertices.push([xo, yo - (branch)]);
        vertices.push([xo + wo, yo]);
        vertices.push([xo, yo + (branch / 5)]);
        shapes.push(new Shape(vertices, green));
    }
    return shapes;
}

