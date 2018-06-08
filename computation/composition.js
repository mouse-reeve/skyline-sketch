var get_horizon = function(page_height) {
    var percent = random(0.40, 0.80);
    return percent * page_height;
};

var random_composition = function(horizon) {
    // determines the perspective lines on which buildings/etc are drawn
    var options = [flat_composition];
    if (horizon < (height / 2)) {
        options.push(layered_composition);
    } else {
        options.push(one_point_composition);
    }
    return random(options)(horizon);
}

var one_point_composition = function(horizon) {
    return [
        function(x) {
            var distance = (Math.abs((width / 2) - x) / (width / 2));
            return {
                position: {x: x, y: horizon + (horizon * distance * 0.5)},
                scale: 0.3 + distance,
            }
        }
    ];
};

var flat_composition = function(horizon) {
    return [
        function(x) {
            return {
                position: {x: x, y: horizon},
                scale: 1,
            };
        },
    ];
};

var layered_composition = function(horizon) {
    var layers = [];
    var spacing = height / 4;
    var count = 1 + (Math.ceil(height - horizon) / spacing);

    var function_builder = function (offset) {
        return function(x) {
            return {
                position: {x: x, y: horizon + offset},
                scale: 1,
            };
        };
    };

    for (var i = 0; i < count; i++) {
        var offset = i * spacing;
        layers.push(function_builder(offset));
    }

    return layers;
}

var place_buildings = function (composition, colors) {
    var buildings = [];
    var building_width;

    for (var layer = 0; layer < composition.length; layer++) {
        for (var y = 0; y < width; y+=building_width - 1) {
            var computed = composition[layer](y);
            var position = computed.position;
            var scale = computed.scale;

            var color = lerpColor(colors[2], black, 0.2 * layer);
            var building = simple_building(position.x, position.y, scale, color);
            buildings.push(building);
            var building_width = building.w;
        }
    }

    return {rects: buildings};
}
