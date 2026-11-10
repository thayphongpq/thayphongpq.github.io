/* ==========================================================================
   TỆP NỘI DUNG CỦA TRANG WEB - THẦY/CÔ CHỈ CẦN SỬA TỆP NÀY
   --------------------------------------------------------------------------
   Quy tắc: giữ nguyên dấu ngoặc kép " ", dấu phẩy và dấu ngoặc { } [ ].
   Để trống "" nếu chưa có link: trang sẽ tự hiện chữ "Sắp có".

   Viết mục lop như sau:
     "10", "11", "12"  -> hiện ở trang Vật lý / Tin học theo khối
     "HSG"             -> hiện ở trang Ôn thi HSG, thêm cap: "THCS" hoặc cap: "THPT"
                          để chọn thư mục HSG THCS hay HSG THPT
   ========================================================================== */

const THONG_TIN = {
  tenTrang: "Góc Lý - Tin",
  khauHieu: "Vật lý và Tin học THPT, từ bài học trên lớp đến đề thi học sinh giỏi.",
  giaoVien: "Thầy Lâm Thế Phong",
  truong: "THPT An Thới",

  // Dòng thông báo trên đầu trang. Để "" nếu không có thông báo.
  thongBao: "Mới cập nhật: loạt video ôn HSG Vật lí - Chuyên đề Chuyển động.",

  gioiThieu: "Nơi tập hợp bài giảng, tài liệu và đề ôn luyện môn Vật lý, Tin học dành cho học sinh THPT.",

  // Điền link của thầy/cô. Mục nào để "" sẽ tự ẩn.
  youtube: "https://www.youtube.com/@thephong6695",
  facebook: "https://www.facebook.com/lamthephongpq",
  zalo: "",
  email: "",

  // Link ứng dụng web Google Apps Script nhận điểm trắc nghiệm (để "" thì không gửi điểm).
  linkNhanDiem: "https://script.google.com/macros/s/AKfycbwfFsyoTt7uEXSy_38w8kCG1dvWRg61Gx-i4FretcCaKZx7m7czOsKPurP6NkVP3O2g/exec"
};

// Liên kết hữu ích (hiện ở cuối trang chủ và trang Liên hệ).
const LIEN_KET = [
  { ten: "Bộ Giáo dục và Đào tạo", moTa: "Tin tức, quy chế, đề tham khảo tốt nghiệp THPT", link: "https://moet.gov.vn/" },
  { ten: "Sở GD&ĐT An Giang", moTa: "Thông báo, kế hoạch thi học sinh giỏi cấp tỉnh", link: "https://angiang.edu.vn/" },
  { ten: "Hệ thống thi tốt nghiệp THPT", moTa: "Đăng ký dự thi, xem kết quả thi", link: "https://thisinh.thitotnghiepthpt.edu.vn/" },
  { ten: "Mô phỏng PhET (tiếng Việt)", moTa: "Thí nghiệm ảo Vật lý miễn phí", link: "https://phet.colorado.edu/vi/" }
];

// Lộ trình hiển thị ở trang Ôn thi HSG.
const LO_TRINH = [
  { buoc: "Củng cố nền tảng", moTa: "Nắm chắc kiến thức trọng tâm và kỹ năng cơ bản của từng môn." },
  { buoc: "Học theo chuyên đề", moTa: "Đi sâu từng dạng, xem video rồi tự làm bài tập." },
  { buoc: "Luyện đề các năm", moTa: "Làm đề thật theo đúng thời gian, tự chấm và ghi lại lỗi sai." },
  { buoc: "Thi thử, tổng kết", moTa: "Rèn chiến thuật làm bài và ôn lại các dạng còn yếu." }
];

// Hai thư mục ở trang Ôn thi HSG. playlist: link danh sách phát YouTube (để "" nếu không có).
const THU_MUC_HSG = {
  THCS: { ten: "HSG THCS", moTa: "Ôn thi học sinh giỏi Vật lí cấp THCS tỉnh An Giang.", playlist: "https://www.youtube.com/playlist?list=PLfxMEIPwe-Cs" },
  THPT: { ten: "HSG THPT", moTa: "Ôn thi học sinh giỏi Vật lí cấp THPT tỉnh An Giang.", playlist: "https://www.youtube.com/playlist?list=PLDwd1GJh52wo" }
};

/* ---------- VIDEO BÀI GIẢNG ----------
   Trong mỗi thư mục HSG, video tự xếp theo thứ tự học: ngày cũ trước, ngày mới sau. */
const VIDEO = [
  // ▼▼▼ DÁN VIDEO MỚI NGAY DƯỚI DÒNG NÀY ▼▼▼

  // ----- HSG THCS -----
  { ten: "CĐ1 (Phần 4): Xuôi ngược dòng, thang cuốn, con chó chạy đi chạy lại", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 1 - Chuyển động cơ học", youtube: "https://www.youtube.com/watch?v=Zd-T8PD31-Y", taiLieu: "", moTa: "", ngay: "2026-11-10" },
  { ten: "CĐ1 (Phần 3): Đồ thị s-t (Đề HSG An Giang 2025-2026) và bài toán gặp nhau", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 1 - Chuyển động cơ học", youtube: "https://www.youtube.com/watch?v=LU8O1lNyUQY", taiLieu: "", moTa: "", ngay: "2026-11-10" },
  { ten: "CĐ1 (Phần 2): Tốc độ và tốc độ trung bình - 2 dạng chắc chắn có trong đề", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 1 - Chuyển động cơ học", youtube: "https://www.youtube.com/watch?v=V2MR2Nauw50", taiLieu: "", moTa: "", ngay: "2026-11-10" },
  { ten: "CĐ1 (Phần 1): Chuyển động cơ học - Lí thuyết trọng tâm", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 1 - Chuyển động cơ học", youtube: "https://www.youtube.com/watch?v=A8FsdamtcUs", taiLieu: "", moTa: "", ngay: "2026-11-10" },

  // ----- HSG THPT -----
  { ten: "Lời giải 12 bài HSG Chuyển động thẳng đều", mon: "Vật lý", lop: "HSG", cap: "THPT", chuDe: "Chuyên đề 1", youtube: "https://www.youtube.com/watch?v=sP5Ile7C6Rg", taiLieu: "", moTa: "", ngay: "2026-11-09" },
  { ten: "Chuyên đề 3. Chuyển động tròn đều", mon: "Vật lý", lop: "HSG", cap: "THPT", chuDe: "Chuyên đề 3", youtube: "https://www.youtube.com/watch?v=patE6JT7RPA", taiLieu: "", moTa: "", ngay: "2026-11-09" },
  { ten: "Chuyên đề 2. Chuyển động thẳng biến đổi đều - Rơi tự do", mon: "Vật lý", lop: "HSG", cap: "THPT", chuDe: "Chuyên đề 2", youtube: "https://www.youtube.com/watch?v=t2CkWlaNOlc", taiLieu: "", moTa: "", ngay: "2026-11-05" },
  { ten: "Chuyên đề 1. Chuyển động thẳng đều", mon: "Vật lý", lop: "HSG", cap: "THPT", chuDe: "Chuyên đề 1", youtube: "https://www.youtube.com/watch?v=q9AwrSVA2_8", taiLieu: "", moTa: "", ngay: "2026-11-05" }
];

/* ---------- ĐỀ TRẮC NGHIỆM ONLINE (học sinh làm bài, chấm điểm ngay) ----------
   Mỗi đề là một tệp chữ trong thư mục de/ trên GitHub (xem cách soạn trong Công cụ thêm bài).
   loai: "Luyện tập" hoặc "Thi thử TN THPT" (đề thi thử hiện ở lớp 12).
   thoiGian: số phút làm bài (0 = không giới hạn). */
const DE_THI = [
  // ▼▼▼ DÁN ĐỀ MỚI NGAY DƯỚI DÒNG NÀY ▼▼▼

  // ----- Đề thi tốt nghiệp THPT chính thức của Bộ GD&ĐT -----
  { ten: "Đề chính thức TN THPT 2026 - Vật lí (mã đề 0214)", mon: "Vật lý", lop: "12", loai: "Thi thử TN THPT", tep: "de/2026-vat-li-chinh-thuc-0214.txt", thoiGian: 50, ngay: "2026-06-12" },

  { ten: "Mẫu: Thi thử TN THPT Vật lí (đề rút gọn)", mon: "Vật lý", lop: "12", loai: "Thi thử TN THPT", tep: "de/mau-vat-ly-12-thi-thu.txt", thoiGian: 15, ngay: "2026-11-10" },
  { ten: "Mẫu: Luyện tập Python cơ bản", mon: "Tin học", lop: "10", loai: "Luyện tập", tep: "de/mau-tin-hoc-10-python.txt", thoiGian: 10, ngay: "2026-11-10" }
];

/* ---------- TÀI LIỆU BÀI GIẢNG (đọc trực tuyến) ----------
   Link Google Drive sẽ mở ngay trên trang để học sinh đọc.
   Nhớ chia sẻ tệp ở chế độ "Bất kỳ ai có đường liên kết".
   loai nên chọn một trong các chữ sau:
   Lý thuyết, Thực hành, Bài tập, Trắc nghiệm, Đề kiểm tra, Chuyên đề, Đề thi
   Ví dụ một dòng:
   { ten: "Chuyên đề 1. Chuyển động thẳng đều", mon: "Vật lý", lop: "HSG", cap: "THPT", loai: "Chuyên đề", link: "https://drive.google.com/...", ngay: "2026-11-10" },
*/
const TAI_LIEU = [
  // ▼▼▼ DÁN TÀI LIỆU MỚI NGAY DƯỚI DÒNG NÀY ▼▼▼

];
