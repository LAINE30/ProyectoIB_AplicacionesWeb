// engine/stateManager.js
export class StateManager {
  constructor(loader, canvas) { // <-- AÑADE 'canvas'
    this.states = [];
    this.loader = loader;
    this.canvas = canvas; // <-- AÑADE ESTA LÍNEA
  }

  /**
   * Obtiene el estado activo (el último en la pila)
   */
  getActiveState() {
    return this.states.length > 0 ? this.states[this.states.length - 1] : null;
  }

  /**
   * Pasa los eventos de input al estado activo
   */
  handleInput(event) {
    const activeState = this.getActiveState();
    if (activeState && activeState.handleInput) {
      activeState.handleInput(event);
    }
  }

  /**
   * Actualiza el estado activo
   */
  update(dt) {
    const activeState = this.getActiveState();
    if (activeState && activeState.update) {
      activeState.update(dt);
    }
  }

  /**
   * Dibuja el estado activo
   */
  render(ctx) {
    const activeState = this.getActiveState();
    if (activeState && activeState.render) {
      activeState.render(ctx);
    }
  }

  /**
   * Añade un nuevo estado a la pila (ej. entrar a un menú de pausa)
   */
  push(state) {
    if (state.init) state.init(this);
    this.states.push(state);
  }

  /**
   * Quita el estado actual (ej. salir del menú de pausa)
   */
  pop() {
    if (this.states.length > 0) {
      const poppedState = this.states.pop();
      if (poppedState.exit) poppedState.exit();
      return poppedState;
    }
  }

  /**
   * Reemplaza todos los estados por uno nuevo (ej. ir del Menú al Juego)
   */
  set(state) {
    // Salir de todos los estados actuales
    while (this.states.length > 0) {
      this.pop();
    }
    // Entrar al nuevo estado
    if (state.init) state.init(this);
    this.states.push(state);
  }
}