// interactivity
var data = {};

var set_horizon = function () {
    data.horizon = get_horizon(height);
    set_sky();
    draw();
};

var set_composition = function () {
    data.composition = get_composition();
    draw();
};

var set_palette = function () {
    data.palette = random_palette();
    draw();
};

var set_sky = function () {
    data.sky = gradient_sky(data.horizon, data.palette);
    draw();
};


// actual drawing
var black;
var white;

function setup() {
    var container = document.getElementById('skyline');
    var canvas = createCanvas(700, 300);//1165, 600);
    canvas.parent(container);

    black = color(0);
    white = color(255);
    colorMode(HSL, 100);

    noLoop();
}

function draw() {
    console.log('drawing');
    draw_points(data.sky);
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

var draw_points = function(points) {
    for (var i = 0; i < points.length; i++) {
        var pixel = points[i];
        push();
        stroke(pixel.color);
        point(pixel.x, pixel.y);
        pop();
    }
};
