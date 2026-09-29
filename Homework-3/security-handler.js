/**
 * Tên file: security-handler.js
 * Mô tả: Tích hợp khóa chống double-submit và áp dụng input sanitization cho form
 */
import { sanitizeInput } from './sanitizer.js';

export class FormSecurityGuard {
    constructor(formElement, submitButtonElement, messageElement) {
        this.form = formElement;
        this.submitBtn = submitButtonElement;
        this.messageEl = messageElement;
        this.isSubmitting = false; // Cờ trạng thái chống gửi trùng lặp

        this.initGuard();
    }

    initGuard() {
        this.form.addEventListener('submit', (e) => {
            // 1. CHỐNG DOUBLE-SUBMIT: Nếu đang trong tiến trình xử lý, chặn đứng sự kiện ngay lập tức
            if (this.isSubmitting) {
                e.preventDefault();
                return;
            }

            const inputField = this.form.querySelector('input[name="email"]');
            if (inputField) {
                // 2. INPUT SANITIZATION: Làm sạch dữ liệu trước khi xử lý
                const cleanValue = sanitizeInput(inputField.value);
                inputField.value = cleanValue; // Gán lại giá trị đã được làm sạch vào input
            }

            // Kích hoạt khóa chống gửi trùng lặp
            this.isSubmitting = true;
            this.submitBtn.disabled = true;
            this.submitBtn.setAttribute('aria-busy', 'true');
            this.submitBtn.textContent = 'Đang xử lý...';

            // Hiển thị thông báo an toàn tuyệt đối bằng textContent (Zero XSS)
            if (this.messageEl) {
                this.messageEl.textContent = 'Đang gửi dữ liệu lên hệ thống...';
            }
        });
    }

    /**
     * Mở khóa lại nút submit khi hoàn tất quá trình (thành công hoặc thất bại)
     */
    release() {
        this.isSubmitting = false;
        this.submitBtn.disabled = false;
        this.submitBtn.removeAttribute('aria-busy');
        this.submitBtn.textContent = 'Gửi đăng ký';
    }
}