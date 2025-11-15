// engine/Animation.js (Archivo NUEVO)

export class Animation {
  /**
   * @param {Image[]} frames - Un array de imágenes (los fotogramas)
   * @param {number} frameRate - Cuántos fotogramas mostrar por segundo
   */
  constructor(frames, frameRate = 10) {
    this.frames = frames;
    this.frameDuration = 1 / frameRate; // Cuánto dura cada fotograma
    this.currentFrameIndex = 0;
    this.timer = 0;
  }

  /**
   * Avanza la animación
   * @param {number} dt - Delta time (tiempo desde el último frame)
   */
  update(dt) {
    this.timer += dt;
    if (this.timer >= this.frameDuration) {
      this.timer = 0;
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
    }
  }

  /**
   * Devuelve la imagen del fotograma actual
   */
  getCurrentFrame() {
    return this.frames[this.currentFrameIndex];
  }

  /**
   * Resetea la animación al primer fotograma
   */
  reset() {
    this.currentFrameIndex = 0;
    this.timer = 0;
  }
}