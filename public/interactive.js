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

  particles_physical.kill_all();

  // reboot - since scaling in physical world is only possible relative to the preceding body.
  // impediment_strokes.kill_all();
  // impediment_strokes.create_all();
  // impediment_strokes.rescale();

  impediment_walls.kill_all();
  impediment_walls.create_all();
  impediment_walls.rescale();

  origins.kill_all();
  origins.create_all();

  resizeCanvas(CANVAS_WIDTH * SCALING_FACTOR, CANVAS_HEIGHT * SCALING_FACTOR);
}


function explode() {
  logging.info("BOOM!")
  var bodies = Composite.allBodies(engine.world);

  for (var i = 0; i < bodies.length; i++) {
    var body = bodies[i];

    if (!body.isStatic) {
      var forceMagnitude = EPLOSION_FORCE * body.mass;

      Body.applyForce(body, body.position, {
        // x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
        // y: -forceMagnitude + Common.random() * -forceMagnitude
        x: forceMagnitude * getRandomFromInterval(-1, 1),
        y: forceMagnitude * getRandomFromInterval(-1, 1)
      });
    }
  }

  setTimeout(triggerFreeze, EXPLOSION_TO_FREEZE)
}

function triggerFreeze() {
  logging.info("Freeze triggered.");
  if (timeScaleTarget == 1) {
    timeScaleTarget = 0;
  }

  setTimeout(releaseFreeze, FREEZE_DURATION)
}

function releaseFreeze() {
  logging.info("Freeze released.");
  timeScaleTarget = 1;

  setTimeout(explode, EXPLOSION_INTERVAL);
}


function freezeLifestyle() {

  // if gap between value and target is bigger than
  if (Math.abs(engine.timing.timeScale - timeScaleTarget) > 0.00001) {
    engine.timing.timeScale += (timeScaleTarget - engine.timing.timeScale) * 0.05;
  } else {
    changeGravity();
  }

}

function changeGravity() {
  engine.world.gravity.x = sin(radians(gravity_counter))
  engine.world.gravity.y = cos(radians(gravity_counter))

  gravity_counter += GRAVITY_SPEED;
}
