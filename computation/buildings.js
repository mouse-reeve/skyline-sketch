var simple_building = function(x, y, scale, color) {
    var max_height = height * 0.2;
    var scaled_height = max_height * scale;
    scaled_height += chaos(scaled_height, 0.1);
    var scaled_width = scaled_height * 0.7;
    scaled_width += chaos(scaled_width, 0.2);

    return new Rect(x, y, -1 * scaled_height, scaled_width, color);
};

var building_signature = function() {
    var max_height = height * 0.5;
    var max_width = max_height * 0.7;
    var building_width = 0;
    var signature = [];
    for (var i = 0; i < random(1, 4); i++) {
        var w = random(10, max_height/3);
        if (building_width + w > max_width) {
            break;
        }
        var h = random(10, max_height);
        signature.push({
            width: w,
            height: h,
            roof: h > max_height / 2,
        })
        building_width += w;
    }
    return signature;
}

var building_mirror = function(array) {
    var mirrored = Object.assign([], array);
    mirrored.reverse();
    return array.concat(mirrored.slice(1))
}

var building = function(x, y, scale, palette, signature) {
    signature = signature || building_signature();
    var yellowest = color_sort(palette, color('#ff0'))[0]
    var color_options = [yellowest, lerpColor(yellowest, black, 0.1), lerpColor(yellowest, white, 0.1)];

    var colors = [];
    // select colors to be mirrored
    for (var i = 0; i < signature.length; i++) {
        colors.push(random(color_options));
    }
    colors = building_mirror(colors);

    var shapes = [];
    var mirrored = building_mirror(signature);
    // iterate through the masses provided by the signature, then mirror them
    for (var i = 0; i < mirrored.length; i++) {
        var w = mirrored[i].width;
        var h = mirrored[i].height
        var mass_color = colors[i];
        var vertices = [[x, y], [x, y - h], [x + w, y - h], [x + w, y]];
        shapes.push(new Shape(vertices, mass_color));

        // add roof if specified by the signature
        if (mirrored[i].roof) {
            var roof = get_roof(x + (w / 2), y - h + 1, w / 2)
            shapes.push(new Shape(roof, mass_color));
        }
        x += w - 1;
    }

    return {shapes: shapes};
}

var get_roof = function(x, y, radius) {
    return dome(x, y, radius * 0.9, 2.5 * PI / 3 );
};

var dome = function (x, y, radius, start) {
    var start = start || PI;
    var end = TWO_PI + start;
    var y_offset = sin(start) * radius;

    var vertices = [];
    var angle = TWO_PI / 200;
    for (var a = start; a < TWO_PI + (PI - start); a += angle) {
        if (a + angle > TWO_PI + (PI - start)) {
            a = TWO_PI + (PI - start);
        }
        var sx = x + cos(a) * radius;
        var sy = y + (sin(a) * radius) - y_offset;
        vertices.push([sx, sy]);
    }
    return vertices;
};
