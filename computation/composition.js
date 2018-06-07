var get_horizon = function(page_height) {
    var percent = random(0.20, 0.80);
    return percent * page_height;
};

var get_composition = function() {
    // determines the perspective lines on which buildings/etc are drawn
    return [
        function(y, height) { return height / 2; },
    ];
};
