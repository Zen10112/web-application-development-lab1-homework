document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('primary-navigation');

    if (!menuToggle || !navMenu) return;

    let destroyFocusTrap = null;

    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        menuToggle.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('is-open');
        document.body.classList.add('menu-open');

        // Kích hoạt Focus Trap khi mở menu
        destroyFocusTrap = initFocusTrap(navMenu, closeMenu);
    }

    function closeMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        document.body.classList.remove('menu-open');

        // Hủy Focus Trap và trả focus về nút toggle
        if (typeof destroyFocusTrap === 'function') {
            destroyFocusTrap();
            destroyFocusTrap = null;
        }
        menuToggle.focus();
    }

    // Gắn sự kiện thông qua addEventListener (Cấm tuyệt đối inline onclick)
    menuToggle.addEventListener('click', toggleMenu);
});

/**
 * Hàm quản lý Focus Trap chuẩn WCAG
 */
function initFocusTrap(containerElement, closeCallback) {
    if (!containerElement) return;

    const focusableSelectors = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
    const focusableElements = containerElement.querySelectorAll(focusableSelectors);
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    function handleKeyDown(e) {
        const isTab = e.key === 'Tab' || e.keyCode === 9;
        const isEscape = e.key === 'Escape' || e.keyCode === 27;

        if (isEscape && typeof closeCallback === 'function') {
            closeCallback();
            return;
        }

        if (!isTab) return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    containerElement.addEventListener('keydown', handleKeyDown);

    return function destroy() {
        containerElement.removeEventListener('keydown', handleKeyDown);
    };
}