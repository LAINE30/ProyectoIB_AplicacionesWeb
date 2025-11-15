// engine/loader.js
export class AssetLoader {
  constructor() {
    this.assets = new Map();
    this.promises = [];
    this.totalAssets = 0;
    this.loadedAssets = 0;
  }

  /**
   * Carga una imagen
   * @param {string} key - Nombre clave para recuperar el asset (ej. 'background')
   * @param {string} path - Ruta al archivo (ej. 'assets/magecity.png')
   */
  loadImage(key, path) {
    this.totalAssets++;
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedAssets++;
        this.assets.set(key, img);
        resolve(img);
      };
      img.onerror = () => reject(`Failed to load image: ${path}`);
      img.src = path;
    });
    this.promises.push(promise);
  }

  /**
   * Carga un archivo de audio
   * @param {string} key - Nombre clave (ej. 'music')
   * @param {string} path - Ruta al archivo (ej. 'assets/music.mp3')
   */
  loadAudio(key, path) {
    this.totalAssets++;
    const promise = new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.loadedAssets++;
        this.assets.set(key, audio);
        resolve(audio);
      };
      audio.onerror = () => reject(`Failed to load audio: ${path}`);
      audio.src = path;
    });
    this.promises.push(promise);
  }

  /**
   * Devuelve el progreso de carga como un valor de 0 a 1
   */
  getProgress() {
    if (this.totalAssets === 0) return 1;
    return this.loadedAssets / this.totalAssets;
  }

  /**
   * Devuelve una promesa que se resuelve cuando todos los assets están cargados
   */
  loadAll() {
    return Promise.all(this.promises);
  }

  /**
   * Obtiene un asset cargado por su clave
   */
  get(key) {
    return this.assets.get(key);
  }
}