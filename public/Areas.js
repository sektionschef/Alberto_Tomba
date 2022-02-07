class Areas {
    constructor(data) {
        this.max_counter = 108;
        this.counter = 0;

        this.data = data;
        this.move_a_little = 20;

        for (let currentArea of this.data) {
            for (let currentSprite of currentArea.sprites) {
                currentSprite.color = color(getRandomFromList(PALETTE));
                currentSprite.color = distortColor(currentSprite.color);
                currentSprite.sprite = currentArea.image.get(currentSprite.x, currentSprite.y, currentSprite.w, currentSprite.h);
                currentSprite.x = getRandomFromInterval(0 - this.move_a_little, width - this.move_a_little);
                currentSprite.y = getRandomFromInterval(0 - this.move_a_little, height - this.move_a_little);
                currentSprite.angle = getRandomFromInterval(-Math.PI / 3, Math.PI / 3);
            }
        }
    }
    show() {
        console.log(this.counter + " - " + this.max_counter)

        for (let currentArea of this.data) {
            for (let currentSprite of currentArea.sprites) {
                if (this.counter < this.max_counter) {
                    setTimeout(function (that) {
                        that.draw_single(currentSprite)
                    }, getRandomFromInterval(500, 5000), this)
                }
                else if (this.counter >= this.max_counter) {
                    // this.draw_single(currentSprite);
                    // this.counter += 1;
                }
                else { }
            }
        }
    }

    draw_single(sprite) {
        if (this.hidden = false) {

            push();
            tint(sprite.color);
            imageMode(CENTER);
            image(
                sprite.sprite,
                sprite.x * SCALING_FACTOR,
                sprite.y * SCALING_FACTOR,
                sprite.sprite.width * SCALING_FACTOR,
                sprite.sprite.height * SCALING_FACTOR
            )
            pop();
            this.counter += 1;
        }
    }
}

