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

    render(ctx, spriteScale = 0.3) {
        if (this.collected) return;

        if (this.sprite) {
            const scaledWidth = this.sprite.width * spriteScale;
            const scaledHeight = this.sprite.height * spriteScale;
            // Dibuja centrado
            const drawX = this.x + (this.width / 2) - (scaledWidth / 2);
            const drawY = this.y + (this.height / 2) - (scaledHeight / 2);
            ctx.drawImage(this.sprite, drawX, drawY, scaledWidth, scaledHeight);
        } else {
            ctx.fillStyle = "cyan";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}