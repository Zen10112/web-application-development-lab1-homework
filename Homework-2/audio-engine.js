/**
 * Tên file: audio-engine.js
 * Mô tả: Module quản lý phát lại âm thanh đa âm (Polyphonic Audio Engine) cho Drum Kit
 */

export class AudioEngine {
    constructor() {
        // Ánh xạ tên data-sound với đường dẫn file âm thanh tương ứng
        this.soundMap = {
            'kick': 'sounds/kick.wav',
            'snare': 'sounds/snare.wav',
            'hihat-closed': 'sounds/hihat-closed.wav',
            'hihat-open': 'sounds/hihat-open.wav',
            'tom': 'sounds/tom.wav',
            'clap': 'sounds/clap.wav'
        };
        
        this.audioCache = {};
        this.preloadAudio();
    }

    /**
     * Tải trước (preload) các tài nguyên âm thanh để giảm độ trễ khi kích hoạt
     */
    preloadAudio() {
        for (const [soundName, src] of Object.entries(this.soundMap)) {
            const audio = new Audio(src);
            audio.preload = 'auto';
            this.audioCache[soundName] = audio;
        }
    }

    /**
     * Phát âm thanh đa âm (Polyphonic playback)
     * Bằng cách clone đối tượng audio, engine cho phép phát nhiều lần
     * cùng một âm thanh hoặc các âm thanh khác nhau chồng lên nhau một cách mượt mà.
     * @param {string} soundName - Tên âm thanh khớp với thuộc tính data-sound
     */
    play(soundName) {
        const baseAudio = this.audioCache[soundName];
        
        if (!baseAudio) {
            console.warn(`[AudioEngine] Không tìm thấy tệp âm thanh cho key: "${soundName}"`);
            return;
        }

        // Tạo bản sao (clone) để đảm bảo tính đa âm (polyphony)
        const polyphonicAudio = baseAudio.cloneNode();
        polyphonicAudio.currentTime = 0;
        
        polyphonicAudio.play().catch(error => {
            console.error(`[AudioEngine] Lỗi khi phát âm thanh "${soundName}":`, error);
        });
    }
}