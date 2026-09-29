# AI Failure Mode Audit Report (Homework 3)

Tài liệu này ghi lại 3 lỗi do AI tạo ra (AI-induced defects) trong quá trình xây dựng Resilient Landing Page, cùng với phương pháp chẩn đoán và giải pháp mã nguồn đã được kiểm chứng[cite: 2].

---

## 1. Lỗi thứ nhất: Lỗi trôi thời gian đếm ngược (Drift-Free Countdown do setInterval thuần túy)

* **Mô tả lỗi (Defect Description):** 
  Khi được yêu cầu viết đồng hồ đếm ngược cho Slice 1, AI đã tự động sử dụng hàm `setInterval(..., 1000)` đơn thuần. Cách tiếp cận này gây ra hiện tượng trôi lệch thời gian (drift) tích lũy đáng kể do độ trễ thực thi của Event Loop trong JavaScript hoặc khi người dùng thu nhỏ/chuyển tab trình duyệt (background throttle).
* **Phương pháp chẩn đoán (Diagnostic Method):** 
  Sử dụng `Git diff inspection` để so sánh giữa phiên bản dùng `setInterval` thô và phiên bản thực tế, kết hợp đặt `DevTools breakpoint` để theo dõi sai lệch thời gian giữa mốc thực tế (`Date.now()`) và bộ đếm[cite: 2].
* **Giải pháp đã refactor (Refactored Solution):** 
  Xây dựng module `CountdownEngine` dựa trên mốc thời gian tuyệt đối chuẩn `UTC ISO 8601`[cite: 2], áp dụng thuật toán tự động tính toán độ trễ (`drift correction`) và điều chỉnh linh hoạt thời gian của `setTimeout` cho chu kỳ tiếp theo.

---

## 2. Lỗi thứ hai: Lỗi bảo mật XSS do sử dụng `innerHTML` để hiển thị dữ liệu form

* **Mô tả lỗi (Defect Description):** 
  Ở Slice 2 và Slice 3, AI xử lý việc phản hồi thông báo trạng thái của form bằng cách gán trực tiếp chuỗi thông báo (có chứa dữ liệu đầu vào của người dùng) thông qua thuộc tính `innerHTML`. Điều này mở ra lỗ hổng bảo mật XSS (Cross-Site Scripting) nghiêm trọng[cite: 2].
* **Phương pháp chẩn đoán (Diagnostic Method):** 
  Kiểm tra qua `Git diff inspection`[cite: 2] tại các dòng cập nhật DOM trong file xử lý form, hoặc kiểm tra bằng công cụ Security Tab của DevTools.
* **Giải pháp đã refactor (Refactored Solution):** 
  Loại bỏ hoàn toàn việc sử dụng `innerHTML` với dữ liệu thô. Chuyển sang sử dụng `textContent` kết hợp với hàm `sanitizeInput` qua DOM node để escape toàn bộ ký tự đặc biệt, đảm bảo an toàn tuyệt đối chống XSS[cite: 2].

---

## 3. Lỗi thứ ba: Lỗi gửi trùng lặp (Double-Submit) do thiếu mô hình quản lý trạng thái form

* **Mô tả lỗi (Defect Description):** 
  AI tạo form xử lý bất đồng bộ nhưng không khóa nút bấm (submit button) trong lúc request đang được gửi đi. Điều này dẫn đến lỗi người dùng click liên tục gây ra tình trạng gửi trùng lặp (double-submit) dữ liệu lên hệ thống và gây xung đột trạng thái[cite: 2].
* **Phương pháp chẩn đoán (Diagnostic Method):** 
  Sử dụng `DevTools breakpoint`[cite: 2] tại hàm xử lý sự kiện `submit` để quan sát hành vi người dùng click nhiều lần, kết hợp đối chiếu lịch sử `Git diff inspection`[cite: 2].
* **Giải pháp đã refactor (Refactored Solution):** 
  Triển khai mô hình máy trạng thái (State-Machine Form) rõ ràng qua các bước `Idle -> Submitting -> Success/Error`[cite: 2], trong đó tự động chuyển trạng thái `disabled = true` và đổi nhãn nút bấm ngay khi bước vào giai đoạn `Submitting`.