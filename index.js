import Emulator from "./emulator.js";

let emulator = new Emulator();
document.getElementById('start-button').addEventListener('click', () => emulator.run());
document.getElementById('stop-button').addEventListener('click', () => emulator.handleStop());
document.getElementById('reset-button').addEventListener('click', () => emulator.init());
document.getElementById('update-delay-button').addEventListener('click', () => emulator.updateDelay());
document.getElementById('debug-video').addEventListener('change', () => emulator.updateDebugVideo());
document.getElementById('debug-registers').addEventListener('change', () => emulator.updateDebugRegisters());
document.getElementById('debug-memory').addEventListener('change', () => emulator.updateDebugMemory());
document.getElementById('search-button').addEventListener('click', () => emulator.searchMemory());
document.getElementById('clear-button').addEventListener('click', (e) => emulator.removeSearchHighlight(e));