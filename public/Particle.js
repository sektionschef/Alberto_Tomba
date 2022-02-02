/**
 * for the positioning:
 * a) if static - attractivePosition is used
 * b) if not static - effectivePosition is used for positioning
 - if no sprite and static - attractive shape is in layer of image, only a physical object is created
 *  physical object is - this.physical_body
 * 
 * 
 * 
 */
class Particle {
  constructor(
    position,
    options,
    vertices,
    sprite,
    offsetPhysical,
    label,
    color,
    shape,
    angle,
  ) {

    if (typeof angle !== "undefined") {
      this.angle = angle;
    } else {
      this.angle = 1;
    }

    // active or not
    this.aliveFlag = true;

    this.label = label;

    if (typeof color !== 'undefined') {
      this.color = color;
    } else {
      this.color = getRandomFromList(PALETTE);
    }

    // position of attractive shape (left top) - dynamic
    this.effectiveTopLeftPostion = {
      x: 0,
      y: 0
    }

    // if sprite is a circle
    if (shape == "circle") {
      this.sprite = sprite;
      // position of attractive_shape (left top) - static
      this.attractivePosition = position;
      // convert physical and attractive positions
      this.offsetPhysical = offsetPhysical;
      this.physical_body = Bodies.circle(position.x, position.y, (this.sprite.width / 3), options)

      // if body with sprite or a static body without sprite (if impediment is painted on canvas)
    } else if ((typeof sprite !== "undefined") || (typeof options !== "undefined" && options.isStatic == true)) {
      this.sprite = sprite;

      // position of attractive_shape (left top) - static
      this.attractivePosition = position;

      // convert physical and attractive positions
      this.offsetPhysical = offsetPhysical;

      // create physical body at
      const basics = {
        position: this.attractivePosition,
        vertices: vertices,
      };
      // combine both with spread operator
      this.physical_body = Body.create({ ...basics, ...options });

      // position to centre of mass instead of top left
      Body.translate(
        this.physical_body, {
        x: (- this.offsetPhysical.x),
        y: (- this.offsetPhysical.y)
      });
    } else {
      this.radius = getRandomFromInterval(5, 10);
      this.physical_body = getRandomFromList([
        Bodies.circle(position.x, position.y, this.radius, options),
        Bodies.rectangle(position.x, position.y, this.radius, this.radius, options),
        Bodies.polygon(position.x, position.y, 5, this.radius, options)
      ]);

    }

    this.physical_body.label = this.label;
    // calculate the centre of mass for the physical body
    this.physical_centre = Matter.Vertices.centre(this.physical_body.vertices);
    this.inertia = this.physical_body.inertia;

    World.add(world, this.physical_body)
    Body.rotate(this.physical_body, this.angle)
  }

  show() {
    // body with sprite
    if (typeof this.sprite !== 'undefined') {
      this.show_sprite();
    } else {
      this.show_nosprite();
    }
  }

  show_sprite() {
    this.physical_centre = Matter.Vertices.centre(this.physical_body.vertices);  // recalculate

    this.effectiveTopLeftPostion = {
      x: (this.physical_centre.x + this.offsetPhysical.x * SCALING_FACTOR),
      y: (this.physical_centre.y + this.offsetPhysical.y * SCALING_FACTOR)
    }

    push();
    if (this.physical_body.isStatic) {
      translate((this.attractivePosition.x + this.sprite.width / 2) * SCALING_FACTOR, (this.attractivePosition.y + this.sprite.height / 2) * SCALING_FACTOR)
      rotate(this.physical_body.angle);
      tint(this.color);

      image(
        this.sprite,
        // this.attractivePosition.x,
        // this.attractivePosition.y,
        - this.sprite.width * SCALING_FACTOR / 2,
        - this.sprite.height * SCALING_FACTOR / 2,
        this.sprite.width * SCALING_FACTOR,
        this.sprite.height * SCALING_FACTOR,
      );
    } else {
      // rotate around the physical centre but show the sprite on top left thus using the offset
      translate(this.physical_centre.x, this.physical_centre.y)
      rotate(this.physical_body.angle);
      tint(this.color);

      image(
        this.sprite,
        this.offsetPhysical.x * SCALING_FACTOR,
        this.offsetPhysical.y * SCALING_FACTOR,
        this.sprite.width * SCALING_FACTOR,
        this.sprite.height * SCALING_FACTOR,
      );
    }
    pop();

    if (logging.getLevel() <= 1) {
      this.draw_attractive_shape_debugging();
      this.draw_physical_body_debugging();
    }
  }

  show_nosprite() {
    if (this.physical_body.isStatic) {
      if (logging.getLevel() <= 1) {
        this.draw_physical_body_debugging();
      }
    } else {
      push();
      fill(this.color);
      noStroke()
      beginShape();
      for (var i = 0; i < this.physical_body.vertices.length; i++) {
        vertex(this.physical_body.vertices[i].x, this.physical_body.vertices[i].y);
      }
      endShape(CLOSE);
      pop();


    }
  }

  rescale_physical_body() {

    let centre_x_before = this.physical_centre.x;
    let centre_y_before = this.physical_centre.y;

    // scale recalculates physics of body automatically (e.g. centre, mass and so on)
    Body.scale(this.physical_body, SCALING_FACTOR, SCALING_FACTOR);

    // since also the canvas resized, there should also be a new position - for dynamic bodies, just erase them and recreate
    if (this.physical_body.isStatic) {

      // calculate the new position after applying the resize
      let new_position_x = centre_x_before * SCALING_FACTOR;
      let new_position_y = centre_y_before * SCALING_FACTOR;

      // calculate the difference for the translate function
      let correction_x = new_position_x - centre_x_before;
      let correction_y = new_position_y - centre_y_before;

      // console.log(correction_x);
      Body.translate(this.physical_body, { x: correction_x, y: correction_y });
    }
    this.physical_centre = Matter.Vertices.centre(this.physical_body.vertices);
  }

  remove_physical_body() {
    World.remove(world, this.physical_body);
    this.aliveFlag = false;
  }

  draw_attractive_shape_debugging() {
    // attractive shape - topf left
    push();
    strokeWeight(5);
    stroke(0, 150, 0);  // green
    point(
      this.effectiveTopLeftPostion.x,  // used to be this.attractivePosition.x
      this.effectiveTopLeftPostion.y
    )
    pop();

    // frame for sprite
    push();
    fill(0, 0);
    stroke(0, 150, 0);  // green
    rect(
      this.effectiveTopLeftPostion.x,
      this.effectiveTopLeftPostion.y,
      this.sprite.width * SCALING_FACTOR,  // smaller
      this.sprite.height * SCALING_FACTOR // smaller
    );
    pop();
  }

  // draw physical body and geometric centre for debugging
  draw_physical_body_debugging() {
    push();
    strokeWeight(1);
    fill(255, 0, 0, 50);
    beginShape();
    for (var i = 0; i < this.physical_body.vertices.length; i++) {
      vertex(this.physical_body.vertices[i].x, this.physical_body.vertices[i].y);
    }
    endShape(CLOSE);
    pop();

    // draw geometric centre
    push();
    strokeWeight(5);
    stroke(255, 0, 0, 150); // red
    point(this.physical_centre.x, this.physical_centre.y);
    // stroke(0, 150);  // grey
    // point(this.geometric_centre.x, this.geometric_centre.y);
    pop();

    push();
    fill(255, 0, 0);
    textFont(fontRegular);
    textSize(default_debugging_text_size * SCALING_FACTOR);
    // textAlign(CENTER, CENTER);
    text(this.physical_body.label, (this.physical_centre.x + 10), (this.physical_centre.y - 10));
    pop();
  }
}

//  hold all the particles and manage the new and dead ones
class Particles {
  constructor(buildingPlans = {}) {
    // element to hold the particles
    this.bodies = [];
    this.buildingPlans = buildingPlans;
  }
  // create all instances at once
  create_all() {
    // console.log(this.buildingPlans);
    for (let buildingPlan of this.buildingPlans) {
      this.bodies.push(new Particle(
        buildingPlan.position,
        buildingPlan.options,
        buildingPlan.vertices,
        buildingPlan.image,
        buildingPlan.offsetPhysical,
        buildingPlan.label,
        buildingPlan.color,
        buildingPlan.shape,
        buildingPlan.angle,
      ));
    }
  }
  // old one 
  add_single_sprite(position) {  // all same particles

    let random_particle_index = Math.floor(getRandomFromInterval(0, this.buildingPlans.length));
    let chosen_building_plan = this.buildingPlans[random_particle_index];

    // correct for difference between top left and centre
    let position_corrected = {
      x: position.x + chosen_building_plan.offsetPhysical.x * SCALING_FACTOR,
      y: position.y + chosen_building_plan.offsetPhysical.y * SCALING_FACTOR,
    }

    this.bodies.push(new Particle(
      // position,
      position_corrected,
      chosen_building_plan.options,
      chosen_building_plan.vertices,
      chosen_building_plan.image,
      chosen_building_plan.offsetPhysical,
      chosen_building_plan.label,
      chosen_building_plan.color,
      chosen_building_plan.shape,
    ));

    // rescale the newly created body
    this.bodies[(this.bodies.length - 1)].rescale_physical_body();
  }

  // add_single(position, options, label) {  // all same particles
  //   this.bodies.push(new Particle(
  //     position = position,
  //     options = options,
  //     label = label,
  //   ));
  // }

  kill_not_needed(max_number) {
    this.kill_all_outside_canvas();
    this.kill_too_many(max_number);
  }

  kill_all_outside_canvas() {
    for (let i = this.bodies.length - 1; i >= 0; i--) {
      if (
        (this.bodies[i].physical_body.position.x < 0) ||
        (this.bodies[i].physical_body.position.x > width) ||
        // (this.bodies[i].physical_body.position.y < 0) ||
        (this.bodies[i].physical_body.position.y < -100) ||
        (this.bodies[i].physical_body.position.y > height)
      ) {
        // console.log("outside!")
        this.bodies[i].remove_physical_body();
      }
    }

  }
  kill_too_many(max_number) {
    // loop backwards to preserve the index after removal
    if (this.bodies.length > max_number) {
      var first_bodies_indexes = this.bodies.length - max_number
      for (let i = 0; i <= first_bodies_indexes - 1; i++) {
        this.bodies[i].remove_physical_body();
      }
      // NECESSARY FOR ATTRACITVE SHAPES???
      // this.bodies.splice(0, first_bodies_indexes);  // remove instantly
    }
  }
  show() {
    // remove the dead
    this.bodies = this.bodies.filter(function (value, index, arr) {
      return value.aliveFlag == true;
    });

    // logging.debug("Number of bodies: " + this.bodies.length);

    for (let particle of this.bodies) {
      particle.show();
      // console.log(particle);
    }
  }
  rescale() {
    for (let particle of this.bodies) {
      particle.rescale_physical_body();
    }
  }
  kill_all() {
    for (let particle of this.bodies) {
      particle.remove_physical_body();
    }
    this.bodies = [];
  }
}