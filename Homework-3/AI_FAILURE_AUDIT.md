# AI Failure Mode Audit Report

Tài liệu này ghi lại 3 lỗi do AI tạo ra (AI-induced defects) đã được phát hiện, chẩn đoán và khắc phục trong quá trình kiểm tra mã nguồn cho bài tập Homework 3[cite: 2].

---

## 1. Lỗi thứ nhất: Drift-Free Countdown Engine (Lỗi trôi thời gian do setInterval)
* **Mô tả lỗi (Defect Description):** AI sử dụng hàm `setInterval` đơn thuần để thực hiện đếm ngược thời gian. Cách làm này gây ra hiện tượng trôi lệch thời gian (drift) đáng kể khi tab trình duyệt chuyển sang chế độ nền (background) hoặc do độ trễ thực thi vòng lặp của JavaScript.
* **Phương pháp chẩn đoán (Diagnostic Method):** Kiểm tra qua `Git diff`[cite: 2] giữa các phiên bản commit hoặc đặt `DevTools breakpoint`[cite: 2] kết hợp với `console.time` để theo dõi độ lệch pha giữa thời gian thực và thời gian đếm ngược.
* **Giải pháp đã refactor (Refactored Solution):** Chuyển đổi sang sử dụng mốc thời gian tuyệt đối dựa trên chuẩn `UTC ISO 8601`[cite: 2] và tính toán khoảng thời gian chênh lệch (`delta`) trực tiếp từ `Date.now()` cho mỗi chu kỳ cập nhật.

---

## 2. Lỗi thứ hai: State-Machine Form (Lỗi quản lý trạng thái và rủi ro XSS)
* **Mô tả lỗi (Defect Description):** AI xử lý trạng thái chuyển đổi của form bằng các biến cờ `boolean` rời rạc thay vì một máy trạng thái (state machine) chặt chẽ (`Idle -> Submitting -> Success/Error`)[cite: 2]. Thêm vào đó, AI sử dụng `innerHTML` để hiển thị phản hồi lỗi, tạo ra lỗ hổng bảo mật XSS tiềm ẩn[cite: 2].
* **Phương pháp chẩn đoán (Diagnostic Method):** Kiểm tra lịch sử `Git diff`[cite: 2] tại các đoạn xử lý DOM và sử dụng `DevTools`[cite: 2] để kiểm tra việc gán chuỗi trực tiếp vào phần tử giao diện.
* **Giải pháp đã refactor (Refactored Solution):** Thiết lập một mô hình State Machine rõ ràng cho luồng form và thay thế toàn bộ `innerHTML` bằng `textContent` để làm sạch input đầu vào, ngăn chặn hoàn toàn lỗ hổng XSS[cite: 2].

---

## 3. Lỗi thứ ba: Double-Submit & Memory Leak (Lỗi gửi trùng lặp và rò rỉ bộ nhớ)
* **Mô tả lỗi (Defect Description):** AI bỏ quên việc vô hiệu hóa nút bấm trong lúc request đang xử lý (dẫn đến lỗi gửi trùng lặp - double submit)[cite: 2] và đăng ký các sự kiện lắng nghe toàn cục mà không có cơ chế hủy, gây ra hiện tượng rò rỉ bộ nhớ (memory leak)[cite: 2].
* **Phương pháp chẩn đoán (Diagnostic Method):** Sử dụng `DevTools breakpoint`[cite: 2] kết hợp công cụ Memory Heap Snapshot, đồng thời đối chiếu qua lệnh kiểm tra `Git diff`[cite: 2].
* **Giải pháp đã refactor (Refactored Solution):** Bổ sung cờ chặn gửi trùng lặp ngay khi bắt đầu trạng thái `Submitting`[cite: 2] và sử dụng `AbortController` để dọn dẹp các sự kiện lắng nghe một cách sạch sẽ, triệt để.