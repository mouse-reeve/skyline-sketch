// interactivity
var data = {};

var set_palette = function () {
    data.palette = random_palette();
};

var set_horizon = function () {
    data.horizon = get_horizon(height);
    set_sky();
    set_composition();
};

var set_composition = function () {
    data.composition = random_composition(data.horizon);
    data.buildings = place_buildings(data.composition, data.palette);
    data.reflection = reflections(data.buildings);
};

var set_sky = function () {
    data.sky = random_sky(data.horizon, data.palette);
};


// actual drawing
var black;
var white;

function setup() {
    var container = document.getElementById('skyline');
    var canvas = createCanvas(700, 400);//1165, 600);
    canvas.parent(container);

    black = color(0);
    white = color(255);
    colorMode(HSL, 100);

    push();
    stroke(black);
    fill(white);
    rect(0, 0, width - 1, height -1);
    pop();

    set_palette();
    set_horizon();
    set_composition();

    noLoop();
}

function draw() {
    console.log('drawing');
    draw_from_data(data.sky);
    if ('buildings' in data) {
        draw_from_data(data.buildings);
        draw_from_data(data.reflection);
    }
    draw_palette();
}

var draw_palette = function() {
    if (!data.palette) {
        return;
    }
    // draw the color palette
    var padding = 5;
    var palette_width = 30;
    var offset = 0;
    for (var i = 0; i < data.palette.length; i++) {
        push();
        fill(data.palette[i]);
        stroke(black);
        rect(padding, ((i + 1) * padding) + offset, palette_width, palette_width);
        pop();
        offset += 30;
    }
};

var draw_from_data = function(image_data) {
    if (Array.isArray(image_data)) {
        for (var i = 0; i < image_data.length; i++) {
            draw_from_data(image_data[i]);
        }
    }

    if ('points' in image_data) {
        for (var i = 0; i < image_data.points.length; i++) {
            var item = image_data.points[i];
            push();
            stroke(item.color);
            point(item.x, item.y);
            pop();
        }
    }

    if ('rects' in image_data) {
        for (var i = 0; i < image_data.rects.length; i++) {
            var item = image_data.rects[i];
            push();
            noStroke();
            fill(item.color);
            rect(item.x, item.y, item.w, item.h);
            pop();
        }
    }

    if ('shapes' in image_data) {
        for (var i = 0; i < image_data.shapes.length; i++) {
            var item = image_data.shapes[i];
            push();
            noStroke();
            fill(item.color);
            beginShape();
            for (var v = 0; v < item.vertices.length; v++) {
                vertex(item.vertices[v][0], item.vertices[v][1]);
            }
            endShape(CLOSE);
            pop();
        }
    }
};
