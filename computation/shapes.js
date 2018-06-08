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


var crescent = function(x, y, radius, offset_value, fill_color) {
    var vertices = [];
    var angle = TWO_PI / 20;//100;
    for (var a = 0; a < TWO_PI; a += angle) {
        var sx = x + cos(a) * radius;
        var sy = y + sin(a) * radius;
        vertices.push([sx, sy]);
    }

    var contour_vertices = [];
    for (var a = TWO_PI; a > 0; a -= angle) {
        var offset = 0;
        if (a < 3 * PI / 4 || a > 7 * PI / 4) {
            offset = -1 * offset_value;
        }
        var sx = x + offset + cos(a) * radius;
        var sy = y + offset + sin(a) * radius;
        contour_vertices.push([sx, sy]);
    }
    return {shapes: [new Shape(vertices, fill_color, contour_vertices)]};
};
