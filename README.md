# Bộ Nhận Diện Thương Hiệu Và Phong Cách Thị Giác

Đây là gói mã nguồn của dự án `Brand Identity and Visual Style`. Bản thiết kế gốc có tại:
https://www.figma.com/design/EUSviOc72i84nV89quNKli/Brand-Identity-and-Visual-Style

## Chạy dự án

Chạy `npm i` để cài đặt các phụ thuộc.

Chạy `npm run dev` để khởi động máy chủ phát triển.

## Tải banner MP4 lên Cloudinary

Thêm các biến môi trường sau:

- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

Dự án hiện đã có sẵn `uploadMediaToCloudinary()` và `toMediaAsset()` trong `src/app/api/cloudinary.ts`.

Ví dụ luồng xử lý cho biểu mẫu quản trị:

```ts
import { toMediaAsset, uploadMediaToCloudinary } from "./src/app/api";

const upload = await uploadMediaToCloudinary(file, {
  folder: "Oriven/banners",
  tags: ["banner", "hero"],
});

const media = toMediaAsset(upload);

// Lưu `media` vào payload banner / cơ sở dữ liệu
// {
//   mediaType: "MP4",
//   url: "...cloudinary secure url...",
//   thumbnailUrl: "...cloudinary generated poster..."
// }
```
