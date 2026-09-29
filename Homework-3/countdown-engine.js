/**
 * Tên file: countdown-engine.js
 * Mô tả: Đếm ngược thời gian Drift-Free dựa trên UTC ISO 8601, tự động hiệu chỉnh độ trễ của setInterval.
 */

export class CountdownEngine {
    /**
     * @param {string} targetIsoString - Mốc thời gian mục tiêu theo chuẩn UTC ISO 8601 (ví dụ: '2026-12-31T23:59:59Z')
     * @param {Function} onTick - Hàm callback nhận vào đối tượng thời gian còn lại mỗi khi đếm ngược
     * @param {Function} onComplete - Hàm callback khi đếm ngược kết thúc
     */
    constructor(targetIsoString, onTick, onComplete) {
        this.targetTime = new Date(targetIsoString).getTime();
        this.onTick = onTick;
        this.onComplete = onComplete;
        
        this.timerId = null;
        this.expectedTime = 0;
        this.interval = 1000; // Chu kỳ chạy 1 giây
    }

    /**
     * Bắt đầu bộ đếm ngược với thuật toán Drift-Free
     */
    start() {
        const now = Date.now();
        const remaining = this.targetTime - now;

        if (remaining <= 0) {
            this.handleComplete();
            return;
        }

        // Thiết lập mốc thời gian kỳ vọng ban đầu
        this.expectedTime = now + this.interval;

        // Kích hoạt nhịp đầu tiên
        this.tick();
    }

    /**
     * Hàm xử lý từng nhịp đếm ngược và tự động hiệu chỉnh độ trễ pha
     */
    tick() {
        const now = Date.now();
        const timeLeft = this.targetTime - now;

        if (timeLeft <= 0) {
            this.handleComplete();
            return;
        }

        // Gọi callback truyền dữ liệu thời gian còn lại ra ngoài giao diện
        if (typeof this.onTick === 'function') {
            this.onTick(this.formatTimeLeft(timeLeft));
        }

        // Tính toán độ lệch thời gian thực tế so với kỳ vọng (drift correction)
        const drift = now - this.expectedTime;
        
        // Điều chỉnh lại khoảng thời gian chờ của setTimeout tiếp theo để bù trừ độ trễ
        const nextInterval = Math.max(0, this.interval - drift);
        
        // Cập nhật mốc kỳ vọng tiếp theo
        this.expectedTime += this.interval;

        this.timerId = setTimeout(() => this.tick(), nextInterval);
    }

    /**
     * Chuyển đổi mili-giây thành các thành phần ngày, giờ, phút, giây
     */
    formatTimeLeft(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return { totalMs: ms, days, hours, minutes, seconds };
    }

    /**
     * Xử lý khi kết thúc đếm ngược
     */
    handleComplete() {
        this.stop();
        if (typeof this.onComplete === 'function') {
            this.onComplete();
        }
    }

    /**
     * Dừng bộ đếm ngược
     */
    stop() {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }
}