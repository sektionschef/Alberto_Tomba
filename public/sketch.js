// trace, debug, info, warn, error
// const SWITCH_LOGGING_LEVEL = "warn";
const SWITCH_LOGGING_LEVEL = "info";
// const SWITCH_LOGGING_LEVEL = "debug";

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

let gravity_counter = 0;

let fps = 0;
let default_debugging_text_size = 15;
let debugging_physical_body_count = 0;

// REWORK
let timeScaleTarget = 1;

// matter.js stuff
var Engine = Matter.Engine;
var World = Matter.World;
var Body = Matter.Body;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var world;

let SCALING_FACTOR = 1;
let rescaling_width;
let rescaling_height;

// for FEATURE creation
chosen_palette = getRandomFromList(PALETTE);
PALETTE = chosen_palette.values;
PALETTE_NAME = chosen_palette.name;

const NUMBER_PARTICLES = Math.floor(getRandomFromInterval(40, 130));  // 70

const EXPLOSION_INTERVAL = getRandomFromInterval(4000, 8000);  // 8000
const FREEZE_DURATION = getRandomFromInterval(3000, 9000);  // 5000
const EXPLOSION_TO_FREEZE = getRandomFromInterval(20, 50);  // 30;

const EXPLOSION_FORCE = getRandomFromInterval(0.1, 1);  // 0.5
const GRAVITY_SPEED = getRandomFromInterval(0.1, 1); // 0.5


if (NUMBER_PARTICLES < 70) {
  NUMBER_PARTICLES_LABEL = "Low"
} else if (NUMBER_PARTICLES < 100) {
  NUMBER_PARTICLES_LABEL = "Medium"
} else {
  NUMBER_PARTICLES_LABEL = "High"
}

if (EXPLOSION_INTERVAL < 5000) {
  EXPLOSION_INTERVAL_LABEL = "Low"
} else if (EXPLOSION_INTERVAL < 7000) {
  EXPLOSION_INTERVAL_LABEL = "Medium"
} else {
  EXPLOSION_INTERVAL_LABEL = "High"
}


if (EXPLOSION_FORCE < 0.4) {
  EXPLOSION_FORCE_LABEL = "Low"
} else if (EXPLOSION_FORCE < 0.7) {
  EXPLOSION_FORCE_LABEL = "Medium"
} else {
  EXPLOSION_FORCE_LABEL = "High"
}

if (FREEZE_DURATION < 5000) {
  FREEZE_DURATION_LABEL = "Low"
} else if (FREEZE_DURATION < 7000) {
  FREEZE_DURATION_LABEL = "Medium"
} else {
  FREEZE_DURATION_LABEL = "High"
}

if (EXPLOSION_TO_FREEZE < 30) {
  EXPLOSION_TO_FREEZE_LABEL = "Low"
} else if (EXPLOSION_TO_FREEZE < 40) {
  EXPLOSION_TO_FREEZE_LABEL = "Medium"
} else {
  EXPLOSION_TO_FREEZE_LABEL = "High"
}


if (GRAVITY_SPEED < 0.4) {
  GRAVITY_SPEED_LABEL = "Low"
} else if (GRAVITY_SPEED < 0.7) {
  GRAVITY_SPEED_LABEL = "Medium"
} else {
  GRAVITY_SPEED_LABEL = "High"
}

logging.info("Palette: " + PALETTE_NAME);
// logging.info("Number of particles: " + NUMBER_PARTICLES);
logging.info("Number of particles label: " + NUMBER_PARTICLES_LABEL);
// logging.info("Explosion interval: " + EXPLOSION_INTERVAL);
logging.info("Explosion interval label: " + EXPLOSION_INTERVAL_LABEL);
// logging.info("Freeze duration: " + FREEZE_DURATION);
logging.info("Freeze duration label: " + FREEZE_DURATION_LABEL);
// logging.info("Explosion to freeze: " + EXPLOSION_TO_FREEZE);
logging.info("Explosion to freeze label: " + EXPLOSION_TO_FREEZE_LABEL);
// logging.info("Explosion force: " + EXPLOSION_FORCE);
logging.info("Explosion force label: " + EXPLOSION_FORCE_LABEL);
// logging.info("Gravity: " + GRAVITY_SPEED);
logging.info("Gravity speed label: " + GRAVITY_SPEED_LABEL);


const origins_data = [
  { label: "1", x: getRandomFromInterval(0, CANVAS_WIDTH), y: 60, },
  { label: "2", x: getRandomFromInterval(0, CANVAS_WIDTH), y: 60, },
  { label: "3", x: getRandomFromInterval(0, CANVAS_WIDTH), y: 60, },
  { label: "4", x: getRandomFromInterval(0, CANVAS_WIDTH), y: 60, },
]


function preload() {
  fontRegular = loadFont('SourceSansPro-Regular.otf');

  background_a = loadImage('background_a.png');
  canvas_image = loadImage('canvas_02.png');

  particles_image = loadImage('particles.png');

  for (let currentArea of areas_data) {
    currentArea.image = loadImage(currentArea.file);
  }
}

function setup() {

  let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL).parent('canvasHolder');
  // let canvas = createCanvas(windowWidth, windowHeight).parent('canvasHolder');

  logging.setLevel(SWITCH_LOGGING_LEVEL);

  engine = Engine.create();
  world = engine.world;

  const VERTICAL_GRAVITY = 1;
  // const VERTICAL_GRAVITY = getRandomFromInterval(0.05, 0.5);

  impediment_walls = new Walls()
  impediment_walls.create_all();

  particles_physical = new Bubbles(particles_data);

  origins = new Origins(origins_data);
  // better via callback
  origins.create_all();

  Matter.Runner.run(engine)
  engine.world.gravity.y = VERTICAL_GRAVITY;

  areas = new Areas(areas_data);

  resize_canvas();

  setTimeout(explode, EXPLOSION_INTERVAL);
}

function draw() {


  translate(-width / 2, -height / 2, 0);
  background(255);

  push();
  image(background_a, 0, 0, background_a.width * SCALING_FACTOR, background_a.height * SCALING_FACTOR)
  pop();

  // LIMIT
  if (frameCount > 300) {
    logging.debug("drop the particles.")
    if (particles_physical.bodies.length < NUMBER_PARTICLES) {
      origins.drop_all();
    }
  }

  if (logging.getLevel() <= 1) {
    origins.debugging_show_origins();
  }
  areas.show();

  particles_physical.show();
  impediment_walls.show();

  particles_physical.kill_not_needed(NUMBER_PARTICLES);

  // show_framerate();
  // show_number_physical_bodies();


  // if (frameCount % 3 == 0) {
  //   logging.debug("timeScale: " + engine.timing.timeScale);
  // }

  if (frameCount > 300) {
    freezeLifestyle();
  }

  push();
  image(canvas_image, 0, 0, canvas_image.width * SCALING_FACTOR, canvas_image.height * SCALING_FACTOR)
  pop();

  Engine.update(engine);
}
