var data = {};

// actual drawing
var black;
var white;

function setup() {
    var param_string = window.location.search.substr(1).split('&');
    var params = {};
    for (var i = 0; i < param_string.length; i++) {
        var pair = param_string[i].split('=');
        params[pair[0]] = pair[1];
    }
    var seed = params.seed || Math.floor(Math.random() * 10000);
    randomSeed(seed);
    console.log(seed);

    var container = document.getElementById('skyline');
    var canvas = createCanvas(800, 400);
    canvas.parent(container);

    black = color(0);
    white = color(255);
    // this is important
    colorMode(HSL, 100);

    // 1px black outline around the canvas
    push();
    stroke(black);
    fill(white);
    rect(0, 0, width - 1, height -1);
    pop();

    // actual stuff
    data.palette = random_palette();
    data.horizon = get_horizon();
    data.composition = random_composition(data.horizon);
    data.foreground = ocean(data.horizon, data.palette);
    data.sky = random_sky(data.horizon, data.palette);
    data.moon = moon(data.horizon, data.palette);
    data.buildings = place_buildings(data.composition, data.palette);
    data.reflection = reflections(data.buildings, data.foreground);

    noLoop();
}

function draw() {
    draw_from_data(data.sky);
    draw_from_data(data.foreground);
    draw_from_data(data.moon);
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
            if (item.contour !== undefined) {
                beginContour();
                for (var v = 0; v < item.contour.length; v++) {
                    console.log(item.contour[v]);
                    vertex(item.contour[v][0], item.contour[v][1]);
                }
                endContour();
            }
            endShape(CLOSE);
            pop();
        }
    }
};
