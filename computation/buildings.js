var simple_building = function(x, y, scale, color) {
    var max_height = height * 0.2;
    var scaled_height = max_height * scale;
    scaled_height += chaos(scaled_height, 0.1);
    var scaled_width = scaled_height * 0.7;
    scaled_width += chaos(scaled_width, 0.2);

    return new Rect(x, y, -1 * scaled_height, scaled_width, color);
};
