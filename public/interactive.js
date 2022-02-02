// each time window.innerWidth changes
function windowResized() {
  logging.debug("Window is resized -> resizing canvas.");
  resize_canvas();
  // logging.debug("rescaling width: " + rescaling_width + " new width: " + CANVAS_WIDTH * SCALING_FACTOR);
  // logging.debug("rescaling height: " + rescaling_height + " new height: " + CANVAS_HEIGHT * SCALING_FACTOR);
}

// calculate the scaling params - choose the limiting factor either height or width
function resize_canvas() {
  rescaling_width = windowWidth / CANVAS_WIDTH
  rescaling_height = windowHeight / CANVAS_HEIGHT

  if (rescaling_width < rescaling_height) {
    SCALING_FACTOR = rescaling_width
  } else {
    SCALING_FACTOR = rescaling_height
  }

  // Override for full scale
  // SCALING_FACTOR = 1;

  bubbles_physical.kill_all();

  // reboot - since scaling in physical world is only possible relative to the preceding body.
  impediment_strokes.kill_all();
  impediment_strokes.create_all();
  impediment_strokes.rescale();

  origins.kill_all();
  origins.create_all();

  resizeCanvas(CANVAS_WIDTH * SCALING_FACTOR, CANVAS_HEIGHT * SCALING_FACTOR);
}
