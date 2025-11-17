export class Item {
    constructor(id, x, y, sprite = null) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.collected = false;
        this.width = 24;
        this.height = 24;
    }

    render(ctx) {
        if (this.collected) return;

        if (this.sprite) {
            ctx.drawImage(this.sprite, this.x, this.y);
        } else {
            ctx.fillStyle = "cyan";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
