var get_horizon = function() {
    var percent = 0.6;
    return percent * height;
};


var get_composition = function(name, horizon) {
    var options = {
        'hill': hill_composition,
        'onepoint': one_point_composition,
        'coastline': coastline_composition,
    };
    var choice = selecter(options, name);
    return choice(horizon);
};


var one_point_composition = function(horizon) {
    var focal_point = width / 2 + chaos(width / 2, 0.5);
    var function_builder = function(offset) {
        return function(x) {
            var distance = (Math.abs(focal_point - x) / focal_point);
            return {
                position: {x: x, y: horizon + (horizon * distance * 0.2) + (offset / 7)},
                scale: 0.5 + distance,
            };
        };
    };

    var comp = layered_composition(horizon, function_builder, 3);
    comp.landmark = focal_point / 2;
    return comp;
};


var coastline_composition = function(horizon) {
    var function_builder = function(offset) {
        return function(x) {
            var scaler = Math.pow((x + 5) / (width), 0.2);
            return {
                position: {x: x, y: horizon - (scaler * (width * 0.07)) + (width * 0.04) + (offset / 7)},
                scale: Math.pow((1.5 - Math.pow(scaler, 1.8)), 1.5),
            };
        };
    };

    var comp = layered_composition(horizon, function_builder, 3);
    comp.landmark = width * 0.25;
    return comp;
};


var hill_composition = function(horizon) {
    var focal_point = width * (random() > 0.5 ? 0.25 : 0.6);
    var function_builder = function(offset) {
        return function(x) {
            var distance = 1 - Math.abs(focal_point - x) / width;
            return {
                position: {x: x, y: horizon + (horizon * distance * 0.1) + (offset / 6)},
                scale: 0.3 + (distance) - (offset / (4 * height)),
            };
        };
    };

    var comp = layered_composition(horizon, function_builder, 3);
    comp.landmark = focal_point;
    return comp;
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

    var layers = horizon / (height * 0.05);
    var comp = layered_composition(horizon, function_builder, layers);
    comp.landmark = width * 0.25;
    return comp;
};


var layered_composition = function(horizon, function_builder, count) {
    var layers = [];
    var spacing = height / count;
    count = 1 + (Math.ceil(height - horizon) / spacing);

    for (var i = 0; i < count; i++) {
        var offset = i * spacing;
        layers.push(function_builder(offset));
    }

    return layers;
};


var reflections = function(buildings, water) {
    var row = buildings[buildings.length - 1].rects;
    if (!Array.isArray(row)) {
        return [];
    }
    var shapes = [];

    var water_color = water.shapes[0].color;

    var get_chaos = function(y) {
        return chaos(building.w, 1 - (0.6 * ((building.y) / y)));
    };

    for (var i = 0; i < row.length; i++) {
        var building = row[i];
        var ref_height = building.h / 2;
        var vertices = [ // base
            [building.x, building.y],
            [building.x + building.w, building.y],
        ];

        // wiggly bit
        for (var y = building.y; y < building.y - ref_height; y += 2) {
            vertices.push([building.x + building.w - get_chaos(y), y, 4, 0]);
            vertices.push([building.x + building.w, y + 1]);
        }

        vertices = vertices.concat([ // roof
            [building.x + building.w, building.y - ref_height],
            [building.x, building.y - ref_height],
        ]);

        // wiggly bit part 2
        for (y = building.y - ref_height; y > building.y; y -= 2) {
            vertices.push([building.x + get_chaos(y), y, 4, 0]);
            vertices.push([building.x, y - 1]);
        }

        var new_color = lerpColor(building.color, water_color, 0.1);
        shapes.push(new Shape(vertices, new_color));
    }

    return {shapes: shapes};
};


var place_buildings = function (composition, palette) {
    var reddest = color_sort(palette, color('#f00'));
    var base_color = random(reddest.slice(0, 2));

    var buildings = [];
    var building_width;

    for (var layer = 0; layer < composition.length; layer++) {
        var row = [];
        for (var x = 0; x < width; x += building_width - 1) {
            var computed = composition[layer](x);
            var position = computed.position;
            var scale = computed.scale;

            var new_color = lighten(base_color, -1 * random(0.03, 0.05) * layer);
            var building = simple_building(position.x, position.y, scale, new_color);
            building_width = building.w;
            row.push(building);

        }
        // add the landmark in the second row
        if (layer == composition.length - 1) {
            var landmark = composition[0](composition.landmark)
            buildings.push(get_building(landmark.position.x, landmark.position.y - (height * 0.05), landmark.scale, lighten(base_color, 0.1)));
        }
        buildings.push({rects: row});
    }

    return buildings;
};
