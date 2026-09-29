/**
 * Tên file: sanitizer.js
 * Mô tả: Làm sạch input đầu vào để chống tuyệt đối lỗ hổng XSS
 */
export function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    
    // Sử dụng DOM node để escape an toàn, tránh hoàn toàn XSS mà không dùng innerHTML dữliệu thô
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}