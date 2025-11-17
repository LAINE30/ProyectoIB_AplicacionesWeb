export class NPC {
    constructor(id, x, y, sprite = null) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.width = 32;
        this.height = 32;
    }


    draw(ctx, offsetX, offsetY) {
        ctx.drawImage(
        this.sprite,
        this.x - offsetX,
        this.y - offsetY,
        this.width,
        this.height
        );
    }

    render(ctx) {
        if (this.sprite) {
            ctx.drawImage(this.sprite, this.x, this.y);
        } else {
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
