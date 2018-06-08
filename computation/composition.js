var get_horizon = function(page_height) {
    var percent = random(0.20, 0.80);
    return percent * page_height;
};

var random_composition = function(horizon) {
    // determines the perspective lines on which buildings/etc are drawn
    var options = [flat_composition];
    if (horizon < (height / 2)) {
        options.push(layered_composition);
    }
    return random(options)(horizon);
}

var flat_composition = function(horizon) {
    return [
        function(x, height) {
            return {
                position: {x: x, y: horizon},
                scale: 1,
            };
        },
    ];
};

var layered_composition = function(horizon) {
    var layers = [];
    var count = 2;
    var spacing = (height - horizon) / (count + 1);

    layers.push(function(x, height) {
        return {
            position: {x: x, y: horizon},
            scale: 1,
        };
    });

    layers.push(function(x, height) {
        return {
            position: {x: x, y: horizon + ((height - horizon) * 0.25)},
            scale: 1,
        };
    });

    layers.push(function(x, height) {
        return {
            position: {x: x, y: horizon + ((height - horizon) * 0.75)},
            scale: 1,
        };
    });

    layers.push(function(x, height) {
        return {
            position: {x: x, y: height},
            scale: 1,
        };
    });

    return layers;
}

var place_buildings = function (composition, colors) {
    var buildings = [];
    var building_width;

    for (var layer = 0; layer < composition.length; layer++) {
        for (var y = 0; y < width; y+=building_width - 1) {
            var computed = composition[layer](y, height);
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
