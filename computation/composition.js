var get_horizon = function(page_height) {
    var percent = random(0.40, 0.80);
    return percent * page_height;
};

var random_composition = function(horizon) {
    // determines the perspective lines on which buildings/etc are drawn
    var options = [hill_composition];
    if (horizon < (height / 2)) {
        options.push(flat_composition);
    } else {
        options.push(one_point_composition);
    }
    return random(options)(horizon);
}


var one_point_composition = function(horizon) {
    var focal_point = width / 2 + chaos(width / 2, 0.5);
    return [
        function(x) {
            var distance = (Math.abs(focal_point - x) / focal_point);
            return {
                position: {x: x, y: horizon + (horizon * distance * 0.1)},
                scale: 0.3 + distance,
            }
        }
    ];
};


var hill_composition = function(horizon) {
    var focal_point = width / 4;
    var function_builder = function(offset) {
        return function(x) {
            var distance = 1 - Math.abs(focal_point - x) / (width - focal_point);
            return {
                position: {x: x, y: horizon + (horizon * distance * 0.1) + (offset / 6)},
                scale: 0.3 + (distance) - (offset / (4 * height)),
            };
        };
    };

    return layered_composition(horizon, function_builder, 3);
};


var flat_composition = function(horizon) {
    var function_builder = function (offset) {
        return function(x) {
            return {
                position: {x: x, y: horizon + offset},
                scale: 1,
            };
        };
    };

    return layered_composition(horizon, function_builder, 4);
}


var layered_composition = function(horizon, function_builder, count) {
    var layers = [];
    var spacing = height / count;
    var count = 1 + (Math.ceil(height - horizon) / spacing);

    for (var i = 0; i < count; i++) {
        var offset = i * spacing;
        layers.push(function_builder(offset));
    }

    return layers;
}


var reflections = function(buildings, water) {
    var row = buildings[buildings.length - 1].rects;
    var shapes = [];

    var water_color = water.shapes[0].color;

    var get_chaos = function(y) {
        return chaos(building.w, 1 - (0.6 * ((building.y) / y)));
    }

    for (var i = 0; i < row.length; i++) {
        var building = row[i];
        var ref_height = building.h / 2;
        var vertices = [ // base
            [building.x, building.y],
            [building.x + building.w, building.y],
        ];

        // wiggly bit
        for (var y = building.y; y < building.y - ref_height; y += 2) {
            vertices.push([building.x + building.w - get_chaos(y), y]);
            vertices.push([building.x + building.w, y + 1]);
        }

        vertices = vertices.concat([ // roof
            [building.x + building.w, building.y - ref_height],
            [building.x, building.y - ref_height],
        ]);

        // wiggly bit part 2
        for (var y = building.y - ref_height; y > building.y; y -= 2) {
            vertices.push([building.x + get_chaos(y), y]);
            vertices.push([building.x, y - 1]);
        }

        var new_color = lerpColor(building.color, water_color, 0.1);
        shapes.push(new Shape(vertices, new_color));
    }

    return {shapes: shapes};
}


var place_buildings = function (composition, palette) {
    var reddest = color_sort(palette, color('#f00'));
    var base_color = random(reddest.slice(0, 2));

    var buildings = [];
    var building_width;

    for (var layer = 0; layer < composition.length; layer++) {
        var row = [];
        for (var y = 0; y < width; y+=building_width - 1) {
            var computed = composition[layer](y);
            var position = computed.position;
            var scale = computed.scale;

            var new_color = lerpColor(base_color, black, 0.2 * layer);
            var building = simple_building(position.x, position.y, scale, new_color);
            var building_width = building.w;
            row.push(building);
        }
        buildings.push({rects: row});
    }

    return buildings;
}
