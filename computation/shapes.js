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
    constructor(vertices, color) {
        this.vertices = vertices;
        this.color = color;
    }
}

