/**
 * Tên file: beat-recorder.js
 * Mô tả: Quản lý ghi âm chuỗi thao tác đánh trống dựa trên hàng đợi FIFO có gắn timestamp 
 * và hỗ trợ phát lại chính xác chuỗi nhịp điệu đó.
 */

export class BeatRecorder {
    constructor() {
        this.eventQueue = []; // Hàng đợi FIFO lưu trữ sự kiện âm thanh
        this.isRecording = false;
        this.recordingStartTime = 0;
        this.playbackTimeouts = [];
    }

    /**
     * Bắt đầu phiên ghi âm mới
     */
    startRecording() {
        this.eventQueue = [];
        this.isRecording = true;
        this.recordingStartTime = performance.now(); // Sử dụng performance.now() để đo thời gian chính xác cao
        console.log("[BeatRecorder] Đã bắt đầu ghi âm...");
    }

    /**
     * Dừng ghi âm
     */
    stopRecording() {
        this.isRecording = false;
        console.log(`[BeatRecorder] Đã dừng ghi âm. Tổng số sự kiện ghi nhận: ${this.eventQueue.length}`);
        return this.eventQueue;
    }

    /**
     * Thêm một sự kiện âm thanh vào hàng đợi FIFO với dấu thời gian tương đối
     * @param {string} soundName - Tên âm thanh (ví dụ: 'kick', 'snare')
     */
    recordEvent(soundName) {
        if (!this.isRecording) return;

        const timestamp = performance.now() - this.recordingStartTime;
        
        // Đưa sự kiện vào cuối hàng đợi FIFO
        this.eventQueue.push({
            soundName: soundName,
            timestamp: timestamp
        });
    }

    /**
     * Phát lại chuỗi nhịp điệu đã ghi âm một cách chính xác dựa trên timestamp
     * @param {AudioEngine} audioEngine - Instance của engine phát lại âm thanh
     * @param {Function} onPlaybackFinish - Callback khi phát lại hoàn tất
     */
    playRecording(audioEngine, onPlaybackFinish) {
        if (this.eventQueue.length === 0) {
            console.warn("[BeatRecorder] Không có bản ghi âm nào để phát lại.");
            if (typeof onPlaybackFinish === 'function') onPlaybackFinish();
            return;
        }

        // Hủy bỏ các lịch trình phát lại cũ (nếu có)
        this.stopPlayback();

        console.log("[BeatRecorder] Đang phát lại beat...");

        // Duyệt qua hàng đợi FIFO để lên lịch phát lại bằng setTimeout dựa theo khoảng chênh lệch thời gian
        this.eventQueue.forEach(event => {
            const timeoutId = setTimeout(() => {
                audioEngine.play(event.soundName);
                
                // Hiệu ứng trực quan có thể được kích hoạt ở đây nếu cần
                const targetButton = document.querySelector(`[data-sound="${event.soundName}"]`);
                if (targetButton) {
                    targetButton.classList.add('playing');
                    setTimeout(() => targetButton.classList.remove('playing'), 100);
                }
            }, event.timestamp);

            this.playbackTimeouts.push(timeoutId);
        });

        // Xác định thời điểm kết thúc chuỗi beat để gọi callback
        const lastEvent = this.eventQueue[this.eventQueue.length - 1];
        const totalDuration = lastEvent.timestamp + 500; // Thêm độ trễ nhỏ cuối chuỗi

        const finishTimeoutId = setTimeout(() => {
            console.log("[BeatRecorder] Phát lại hoàn tất.");
            if (typeof onPlaybackFinish === 'function') onPlaybackFinish();
        }, totalDuration);

        this.playbackTimeouts.push(finishTimeoutId);
    }

    /**
     * Dừng quá trình phát lại hiện tại
     */
    stopPlayback() {
        this.playbackTimeouts.forEach(id => clearTimeout(id));
        this.playbackTimeouts = [];
    }
}