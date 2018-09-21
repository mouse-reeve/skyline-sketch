class Point {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

class Rect {
    constructor(x, y, h, w, color) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.color = color;
    }
}

class Shape {
    constructor(vertices, fill_color, contour) {
        this.vertices = vertices;
        this.color = fill_color;
        this.contour = contour;
    }
}

var star_shape = function(x, y, radius, points, point_radius, fill_color, movement) {
    var vertices = [];

    var angle = TWO_PI / points;
    for (var a = 0; a < TWO_PI; a += angle) {
        var sx = Math.round(x + cos(a) * radius);
        var sy = Math.round(y + sin(a) * radius);
        vertices.push([sx, sy]);

        sx = Math.round(x + cos(a + (angle / 2)) * point_radius);
        sy = Math.round(y + sin(a + (angle / 2)) * point_radius);
        vertices.push([sx, sy, movement, movement]);
    }
    return new Shape(vertices, fill_color);
};

var ring = function(x, y, radius, outer_radius, fill_color) {
    var vertices = [];
    var angle = TWO_PI / 40;
    for (var a = 0; a < TWO_PI; a += angle) {
        var sx = Math.round(x + cos(a) * radius);
        var sy = Math.round(y + sin(a) * radius);
        vertices.push([sx, sy]);
    }

    var contour_vertices = [];
    for (var a = TWO_PI; a > 0; a -= angle) {
        var sx = Math.round(x + cos(a) * outer_radius);
        var sy = Math.round(y + sin(a) * outer_radius);
        contour_vertices.push([sx, sy]);
    }
    return new Shape(vertices, fill_color, contour_vertices);
};

var crescent = function(x, y, radius, offset_value, fill_color) {
    var vertices = [];
    var angle = TWO_PI / 40;
    for (var a = 0; a < TWO_PI; a += angle) {
        var sx = Math.round(x + cos(a) * radius);
        var sy = Math.round(y + sin(a) * radius);
        vertices.push([sx, sy]);
    }

    var contour_vertices = [];
    for (var a = TWO_PI; a > 0; a -= angle) {
        var offset = 0;
        if (a < 3 * PI / 4 || a > 7 * PI / 4) {
            offset = -1 * offset_value;
        }
        var sx = Math.round(x + offset + cos(a) * radius);
        var sy = Math.round(y + offset + sin(a) * radius);
        contour_vertices.push([sx, sy]);
    }
    return {shapes: [new Shape(vertices, fill_color, contour_vertices)]};
};
