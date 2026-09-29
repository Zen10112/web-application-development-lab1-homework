/**
 * Quản lý Focus Trap cho menu điều hướng hoặc modal
 * Đảm bảo vòng lặp tiêu điểm bên trong container và xử lý phím Escape để thoát
 */
function initFocusTrap(menuElement, closeCallback) {
    if (!menuElement) return;

    // Lọc ra tất cả các phần tử có thể tương tác/nhận focus bên trong menu
    const focusableSelectors = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
    const focusableElements = menuElement.querySelectorAll(focusableSelectors);
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Đưa focus vào phần tử đầu tiên khi menu mở
    firstElement.focus();

    function handleKeyDown(e) {
        const isTab = e.key === 'Tab' || e.keyCode === 9;
        const isEscape = e.key === 'Escape' || e.keyCode === 27;

        if (isEscape && typeof closeCallback === 'function') {
            closeCallback();
            return;
        }

        if (!isTab) return;

        // Xử lý vòng lặp focus để tránh bị kẹt hoặc trượt ra ngoài
        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    menuElement.addEventListener('keydown', handleKeyDown);

    // Trả về hàm hủy lắng nghe sự kiện khi đóng menu
    return function destroy() {
        menuElement.removeEventListener('keydown', handleKeyDown);
    };
}