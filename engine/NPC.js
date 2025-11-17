export class NPC {
    constructor(id, x, y, sprite = null) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.width = 32; 
        this.height = 32; 
    }

    render(ctx, spriteScale = 0.5) {
        if (this.sprite) {
            const scaledWidth = this.sprite.width * spriteScale;
            const scaledHeight = this.sprite.height * spriteScale;
            // Dibuja centrado
            const drawX = this.x + (this.width / 2) - (scaledWidth / 2);
            const drawY = this.y + this.height - scaledHeight; // Alinear con los pies
            ctx.drawImage(this.sprite, drawX, drawY, scaledWidth, scaledHeight);
        } else {
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}