**Thêm hướng dẫn của bạn tại đây**
<!--

Hướng dẫn hệ thống

Dùng tệp này để cung cấp cho AI các quy tắc và hướng dẫn mà bạn muốn nó tuân theo.
Mẫu này đưa ra một vài ví dụ về những nội dung bạn có thể thêm vào. Bạn có thể tự tạo các mục riêng và định dạng lại cho phù hợp với nhu cầu của mình.

LƯU Ý: Nhiều ngữ cảnh hơn không phải lúc nào cũng tốt hơn. Nó có thể làm LLM bị rối. Hãy ưu tiên các quy tắc quan trọng nhất mà bạn thật sự cần.

# Hướng dẫn chung

Bất kỳ quy tắc tổng quát nào bạn muốn AI làm theo.
Ví dụ:

* Chỉ dùng `absolute positioning` khi thật sự cần thiết. Ưu tiên bố cục phản hồi tốt, có cấu trúc rõ ràng, mặc định dùng `flexbox` và `grid`.
* Refactor dần trong quá trình làm để giữ mã nguồn sạch sẽ.
* Giữ kích thước file gọn và tách các hàm hỗ trợ hoặc component riêng ra file phù hợp.

--------------

# Hướng dẫn hệ thống thiết kế
Các quy tắc về cách AI nên tạo giao diện theo đúng hệ thống thiết kế của công ty bạn.

Ngoài ra, nếu bạn chọn một hệ thống thiết kế trong ô prompt, bạn có thể tham chiếu đến
các component, token, biến và quy ước trong hệ thống thiết kế đó.
Ví dụ:

* Dùng cỡ chữ cơ sở là `14px`
* Định dạng ngày luôn theo kiểu `10 Thg 6`
* Thanh công cụ phía dưới chỉ nên có tối đa 4 mục
* Không dùng nút hành động nổi cùng với thanh công cụ phía dưới
* `Chip` nên xuất hiện theo nhóm từ 3 mục trở lên
* Không dùng `dropdown` nếu chỉ có 2 lựa chọn hoặc ít hơn

Bạn cũng có thể tạo các mục con và bổ sung chi tiết cụ thể hơn.
Ví dụ:

## Nút bấm
Component Button là một thành phần tương tác cốt lõi trong hệ thống thiết kế, dùng để kích hoạt hành động hoặc điều hướng
người dùng trong ứng dụng. Nó cung cấp phản hồi trực quan và tín hiệu rõ ràng để cải thiện trải nghiệm sử dụng.

### Cách sử dụng
Nút bấm nên được dùng cho các hành động quan trọng mà người dùng cần thực hiện, như gửi biểu mẫu, xác nhận lựa chọn
hoặc bắt đầu một quy trình. Nhãn nút cần rõ ràng và định hướng hành động.

### Biến thể
* Nút chính
  * Mục đích: Dùng cho hành động quan trọng nhất trong một khu vực hoặc một trang
  * Kiểu hiển thị: Nổi bật, nền đặc với màu thương hiệu chính
  * Cách dùng: Mỗi khu vực nên chỉ có một nút chính để dẫn hướng người dùng tới hành động ưu tiên nhất
* Nút phụ
  * Mục đích: Dùng cho các hành động thay thế hoặc hỗ trợ
  * Kiểu hiển thị: Viền màu chính, nền trong suốt
  * Cách dùng: Có thể đi kèm nút chính cho các hành động ít quan trọng hơn
* Nút cấp ba
  * Mục đích: Dùng cho các hành động ít quan trọng nhất
  * Kiểu hiển thị: Chỉ có chữ, không viền, dùng màu chính
  * Cách dùng: Dành cho các hành động vẫn cần hiển thị nhưng không nên được nhấn mạnh
-->
