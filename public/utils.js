
// Draw FPS (rounded to 2 decimal places) at the bottom left of the screen
function show_framerate() {
    if (frameCount % 10 == 1) {
        fps = frameRate();
    }
    push();
    fill(0);
    textFont(fontRegular);
    text("FPS: " + fps.toFixed(2), 10, height - 170);
    pop();
}

// show the current number of physical bodies in the world
function show_number_physical_bodies() {

    if (frameCount % 10 == 1) {
        debugging_physical_body_count = world.bodies.length - impediments.bodies.length
    }
    let string = "Particle Count: " + debugging_physical_body_count;
    push();
    fill(0);
    textFont(fontRegular);
    text(string, 10, height - 150);
    pop();
}


function getRandomFromInterval(min, max) {
    return fxrand() * (max - min) + min;
}

function getRandomFromList(items) {
    return items[Math.floor(fxrand() * items.length)];
}

function distortColor(colorObject) {
    let max_diff = 10;
    let red = (colorObject.levels[0] + getRandomFromInterval(-max_diff, max_diff));
    let green = (colorObject.levels[1] + getRandomFromInterval(-max_diff, max_diff));
    let blue = (colorObject.levels[2] + getRandomFromInterval(-max_diff, max_diff));

    red = Math.min(Math.max(parseInt(red), 0), 255);
    green = Math.min(Math.max(parseInt(green), 0), 255);
    blue = Math.min(Math.max(parseInt(blue), 0), 255);

    return color(red, green, blue);
}

// as soon as the json is loaded, load the images via callback
function loadAreas() {
    for (let currentArea of areas_data.data) {
        currentArea.image = loadImage(currentArea.file);
    }
}