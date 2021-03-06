class Areas {
    constructor(data) {
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
                currentSprite.hidden = true;
            }
        }
    }
    show() {
        for (let currentArea of this.data) {
            for (let currentSprite of currentArea.sprites) {
                if (currentSprite.hidden == true) {
                    if (frameCount % Math.floor(getRandomFromInterval(10, 100)) == 0)
                        currentSprite.hidden = false
                }
                else {
                    push();
                    tint(currentSprite.color);
                    imageMode(CENTER);
                    image(
                        currentSprite.sprite,
                        currentSprite.x * SCALING_FACTOR,
                        currentSprite.y * SCALING_FACTOR,
                        currentSprite.sprite.width * SCALING_FACTOR,
                        currentSprite.sprite.height * SCALING_FACTOR
                    )
                    pop();
                }
            }
        }
    }
}

