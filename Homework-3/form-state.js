/**
 * Tên file: form-state.js
 * Mô tả: Quản lý vòng đời trạng thái Form (Idle -> Submitting -> Success/Error)
 */

export class FormStateMachine {
    constructor(formElement) {
        this.form = formElement;
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.messageEl = this.form.querySelector('#form-message');
        
        // Trạng thái ban đầu
        this.currentState = 'idle';
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Chặn gửi nếu đang trong trạng thái Submitting (Chống double-submit)
            if (this.currentState === 'submitting') return;

            // Chuyển sang trạng thái Submitting
            this.transitionTo('submitting');
            this.executeSubmission();
        });
    }

    /**
     * Hàm điều phối chuyển đổi trạng thái (State Transition)
     */
    transitionTo(newState, payload = {}) {
        this.currentState = newState;
        this.form.setAttribute('data-state', newState);

        switch (newState) {
            case 'idle':
                this.submitBtn.disabled = false;
                this.submitBtn.textContent = 'Gửi đăng ký';
                this.messageEl.textContent = '';
                break;

            case 'submitting':
                this.submitBtn.disabled = true; // Khóa nút bấm khi đang gửi
                this.submitBtn.textContent = 'Đang gửi...';
                this.messageEl.textContent = 'Đang xử lý yêu cầu của bạn, vui lòng đợi...';
                this.messageEl.className = 'msg-info';
                break;

            case 'success':
                this.submitBtn.disabled = false;
                this.submitBtn.textContent = 'Gửi lại';
                this.messageEl.textContent = payload.message || 'Đăng ký thành công!';
                this.messageEl.className = 'msg-success';
                break;

            case 'error':
                this.submitBtn.disabled = false;
                this.submitBtn.textContent = 'Thử lại';
                this.messageEl.textContent = payload.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
                this.messageEl.className = 'msg-error';
                break;
        }
    }

    /**
     * Giả lập tiến trình gửi dữ liệu bất đồng bộ (API Call)
     */
    async executeSubmission() {
        try {
            // Giả lập network request mất 2 giây
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const isSuccess = Math.random() > 0.3; // 70% thành công, 30% lỗi giả lập
                    isSuccess ? resolve() : reject(new Error('Máy chủ bận hoặc mất kết nối mạng.'));
                }, 2000);
            });

            // Nếu thành công chuyển sang trạng thái Success
            this.transitionTo('success', { message: 'Gửi thông tin thành công! Cảm ơn bạn.' });
        } catch (error) {
            // Nếu thất bại chuyển sang trạng thái Error
            this.transitionTo('error', { message: error.message });
        }
    }
}