var data = {};

// actual drawing
var black;
var white;

function setup() {
    var param_string = window.location.search.substr(1).split('&');
    var params = {};
    for (var i = 0; i < param_string.length; i++) {
        var pair = param_string[i].split('=');
        if (parseInt(pair[1]) == pair[1]) {
            radius = 0;
            pair[1] = parseInt(pair[1]);
        }
        params[pair[0]] = pair[1];
        if (pair[1] !== undefined && form_params[i]) {
            form_params[i].value = pair[1];
        }
    }
    var seed = params.seed || Math.floor(Math.random() * 10000);
    randomSeed(seed);
    console.log(seed);

    var container = document.getElementById('skyline');
    var canvas = createCanvas(1000, 500);//1165, 600)
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
    data.palette = get_palette(params.palette, params.hue, params.saturation, params.lightness);
    data.horizon = get_horizon();
    data.composition = get_composition(params.composition, data.horizon);

    if (params.foreground) {
        data.foreground = get_foreground(params.foreground, data.horizon, data.palette);
    }
    data.ground = get_foreground(params.ground, data.horizon, data.palette);
    data.sky = get_sky(params.sky, data.horizon, data.palette);
    if (params.background == 'mountains') {
        data.mountains = mountains(data.horizon, data.composition, data.palette);
    } else if (params.background == 'hills') {
        data.hills = hills(data.horizon, data.composition, data.palette);
    }

    if (params.clouds == 'clouds') {
        data.clouds = clouds(data.horizon, data.composition, data.palette);
    }

    data.buildings = place_buildings(data.composition, data.palette);
    if (params.ground == 'ocean') {
        data.reflection = reflections(data.buildings, data.ground);
    }

}

function draw() {
    draw_from_data(data.sky);
    if (data.mountains) {
        draw_from_data(data.mountains);
    }
    if (data.hills) {
        draw_from_data(data.hills);
    }
    if (data.clouds) {
        draw_from_data(data.clouds);
    }
    if (data.ground) {
        draw_from_data(data.ground);
    }
    if ('buildings' in data) {
        if (data.reflection) {
            draw_from_data(data.reflection);
        }
        draw_from_data(data.buildings);
    }
    if (data.foreground) {
        draw_from_data(data.foreground);
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

    if (image_data.color && !image_data.color.as_string) {
        image_data.color.as_string = image_data.color.toString();
    }

    if ('points' in image_data) {
        for (var i = 0; i < image_data.points.length; i++) {
            var item = image_data.points[i];
            item.color.as_string = item.color.toString();
            push();
            stroke(item.color);
            point(item.x, item.y);
            pop();
        }
    }

    if ('rects' in image_data) {
        for (var i = 0; i < image_data.rects.length; i++) {
            var item = image_data.rects[i];
            item.color.as_string = item.color.toString();
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
            item.color.as_string = item.color.toString();
            push();
            noStroke();
            fill(item.color);
            beginShape();
            for (var v = 0; v < item.vertices.length; v++) {
                var vert = item.vertices[v];
                var offsets = [vert[2] || 0, vert[3] || 0];

                // animation
                for (var j = 0; j < offsets.length; j++) {
                    if (!offsets[j]) continue;

                    if (vert.current_offset === undefined) {
                        vert.current_offset = random(-1, 1);
                        vert.direction = random(-1, 1);
                    }
                    if (Math.abs(vert.current_offset + vert.direction) > offsets[j]) {
                        vert.direction *= -1;
                    }
                    vert.current_offset += vert.direction;
                    offsets[j] = vert.current_offset;
                }
                vertex(vert[0] + offsets[0], vert[1] + offsets[1]);
            }
            if (item.contour !== undefined) {
                beginContour();
                for (var v = 0; v < item.contour.length; v++) {
                    vertex(item.contour[v][0], item.contour[v][1]);
                }
                endContour();
            }
            endShape(CLOSE);
            pop();
        }
    }

    if ('beziers' in image_data) {
        for (var i = 0; i < image_data.beziers.length; i++) {
            var item = image_data.beziers[i];
            item.color.as_string = item.color.toString();
            push();
            noStroke();
            fill(item.color);

            bezier_fields = [];
            for (var v = 0; v < item.points.length; v++) {
                bezier_fields = bezier_fields.concat(item.points[v]);
            }
            bezier(...bezier_fields);
            pop();
        }
    }
};

function randomize() {
    for (var i = 0; i < form_params.length; i++) {
        var min = form_params[i].getAttribute('data-min');
        var max = form_params[i].getAttribute('data-max');
        var is_int = int(max) == float(max) && int(min) == float(min);
        if (max && min) {
            var value = random(float(min), float(max));
            if (is_int) {
                value = int(value);
            } else {
                value = float(value);
                value = Math.round(value * 100) / 100.0;
            }
            form_params[i].value = value;
        }
    }
}
