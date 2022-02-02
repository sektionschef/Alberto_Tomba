class Origin {
    constructor(position_x, position_y, label) {
        // this.position_x = Math.abs(position_x);
        // this.position_y = Math.abs(position_y);
        this.position_x = position_x;
        this.position_y = position_y;
        this.label = label;

        this.position_x = this.position_x * SCALING_FACTOR;
        this.position_y = this.position_y * SCALING_FACTOR;

        this.position = { x: this.position_x, y: this.position_y }
    }

    drop(frequency) {
        if (frameCount % frequency == 1) {
            bubbles_physical.add_single_sprite(this.position);
        }
    }

    draw_origin_positions_debug() {
        // print(this.position.x);
        push();
        strokeWeight(10);
        stroke(0, 0, 255);  // blue
        point(
            this.position.x,
            this.position.y
        )
        pop();

        push();
        fill(0, 0, 255);
        textFont(fontRegular);
        textSize(default_debugging_text_size * SCALING_FACTOR);
        // textAlign(CENTER, CENTER);
        text(this.label, (this.position.x + 10), (this.position.y - 10));
        pop();
    }
}

// controlling the origins and the frequency of particles.
class Origins {
    constructor(buildingPlans = {}) {
        this.bodies = [];
        this.buildingPlans = buildingPlans;

    }

    create_all() {
        for (let buildingPlan of this.buildingPlans) {
            this.bodies.push(new Origin(
                buildingPlan["x"],
                buildingPlan["y"],
                buildingPlan["label"]

            ));
        }
    }

    drop_all() {
        for (let origin of this.bodies) {
            let frequency = Math.floor(fxrand() * 100);
            origin.drop(frequency);
        }
    }

    debugging_show_origins() {
        for (let origin of this.bodies) {
            origin.draw_origin_positions_debug();

        }
    }

    kill_all() {
        this.bodies = [];
    }
}
