/**
 * Tên file: keyboard-listener.js
 * Mô tả: Lắng nghe sự kiện phím bấm (keydown) dựa trên data-key contract, 
 * tích hợp chống lặp phím (e.repeat) và điều khiển AudioEngine.
 */

import { AudioEngine } from './audio-engine.js';

document.addEventListener('DOMContentLoaded', () => {
    const audioEngine = new AudioEngine();

    window.addEventListener('keydown', (e) => {
        // Bắt buộc: Chặn sự kiện lặp khi người dùng đè liệt phím (tránh tràn âm thanh)
        if (e.repeat) return;

        // Tìm nút bấm trong HTML có thuộc tính data-key khớp với phím vừa nhấn (ví dụ: KeyA, KeyS, ...)
        const targetButton = document.querySelector(`[data-key="${e.code}"]`);

        if (!targetButton) return; // Nếu phím không nằm trong contract thì bỏ qua

        // Lấy tên âm thanh từ data-sound
        const soundName = targetButton.getAttribute('data-sound');

        if (soundName) {
            // Phát âm thanh đa âm
            audioEngine.play(soundName);

            // Thêm hiệu ứng trực quan (visual feedback) cho nút bấm
            targetButton.classList.add('playing');
        }
    });

    // Xóa hiệu ứng trực quan sau khi animation/transition kết thúc
    window.addEventListener('keyup', (e) => {
        const targetButton = document.querySelector(`[data-key="${e.code}"]`);
        if (targetButton) {
            targetButton.classList.remove('playing');
        }
    });
});