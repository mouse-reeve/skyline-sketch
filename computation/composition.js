var get_horizon = function(page_height) {
    var percent = random(0.20, 0.80);
    return percent * page_height;
};

var random_composition = function(horizon) {
    // determines the perspective lines on which buildings/etc are drawn
    var options = [flat];
    return random(options)(horizon);
}

var flat = function(horizon) {
    return [
        function(x, height) {
            return {
                position: {x: x, y: horizon},
                scale: 1,
            };
        },
    ];
};

var place_buildings = function (composition, colors) {
    var buildings = [];
    var building_width;

    for (var layer = 0; layer < composition.length; layer++) {
        for (var y = 0; y < width; y+=building_width - 1) {
            var computed = composition[layer](y, height);
            var position = computed.position;
            var scale = computed.scale;

            var building = simple_building(position.x, position.y, scale, colors[1]);
            buildings.push(building);
            var building_width = building.w;
        }
    }

    return {rects: buildings};
}
