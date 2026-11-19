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
  thongBao: "Mới cập nhật: đủ 5 chuyên đề video ôn HSG Vật lí THCS (20 video) và Chuyên đề 3 HSG THPT bản mới.",

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
  { ten: "CĐ5 (Phần 4): Công suất cực đại, truyền tải điện, động cơ điện (nâng cao)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 5 - Công suất điện, định luật Jun - Len-xơ", youtube: "https://www.youtube.com/watch?v=hRhFuDc4w3g", taiLieu: "", moTa: "", ngay: "2026-11-18" },
  { ten: "CĐ5 (Phần 3): Tiền điện, định luật Jun - Len-xơ, bếp điện (Dạng 3 - 4)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 5 - Công suất điện, định luật Jun - Len-xơ", youtube: "https://www.youtube.com/watch?v=2cIrxNdE-5s", taiLieu: "", moTa: "", ngay: "2026-11-18" },
  { ten: "CĐ5 (Phần 2): Công suất điện, đèn sáng bình thường - Giải đề An Giang", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 5 - Công suất điện, định luật Jun - Len-xơ", youtube: "https://www.youtube.com/watch?v=MSnQNtsgxZI", taiLieu: "", moTa: "", ngay: "2026-11-18" },
  { ten: "CĐ5 (Phần 1): Công suất điện, điện năng, định luật Jun - Len-xơ - Lí thuyết", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 5 - Công suất điện, định luật Jun - Len-xơ", youtube: "https://www.youtube.com/watch?v=tMIqKYusVPA", taiLieu: "", moTa: "", ngay: "2026-11-18" },

  { ten: "CĐ4 (Phần 4): Mạch cầu, sụt áp, sự cố mạch điện (nâng cao)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 4 - Định luật Ôm, mạch điện", youtube: "https://www.youtube.com/watch?v=Z0uv6oOFJqk", taiLieu: "", moTa: "", ngay: "2026-11-16" },
  { ten: "CĐ4 (Phần 3): Vôn kế, ampe kế, chập mạch, biến trở - Giải đề An Giang", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 4 - Định luật Ôm, mạch điện", youtube: "https://www.youtube.com/watch?v=6_yeX8g3UiE", taiLieu: "", moTa: "", ngay: "2026-11-16" },
  { ten: "CĐ4 (Phần 2): Định luật Ôm, điện trở dây dẫn, mạch hỗn hợp (Dạng 1 - 2)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 4 - Định luật Ôm, mạch điện", youtube: "https://www.youtube.com/watch?v=cRHeD9t-ICY", taiLieu: "", moTa: "", ngay: "2026-11-16" },
  { ten: "CĐ4 (Phần 1): Định luật Ôm - Mạch nối tiếp, song song, mạch cầu - Lí thuyết", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 4 - Định luật Ôm, mạch điện", youtube: "https://www.youtube.com/watch?v=sMm1JUIzmf0", taiLieu: "", moTa: "", ngay: "2026-11-16" },

  { ten: "CĐ3 (Phần 4): Con lắc, máng trượt, bóng nảy, lực cản (nâng cao)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 3 - Công, công suất, cơ năng", youtube: "https://www.youtube.com/watch?v=sUoLbOfyeTA", taiLieu: "", moTa: "", ngay: "2026-11-14" },
  { ten: "CĐ3 (Phần 3): Động năng, thế năng, bảo toàn cơ năng", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 3 - Công, công suất, cơ năng", youtube: "https://www.youtube.com/watch?v=5WApaHRgEvs", taiLieu: "", moTa: "", ngay: "2026-11-14" },
  { ten: "CĐ3 (Phần 2): Công, công suất, hiệu suất, mặt phẳng nghiêng (Dạng 1 - 2)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 3 - Công, công suất, cơ năng", youtube: "https://www.youtube.com/watch?v=a2GDSiELY20", taiLieu: "", moTa: "", ngay: "2026-11-14" },
  { ten: "CĐ3 (Phần 1): Công, công suất, bảo toàn cơ năng - Lí thuyết trọng tâm", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 3 - Công, công suất, cơ năng", youtube: "https://www.youtube.com/watch?v=8vMjPBjRNGU", taiLieu: "", moTa: "", ngay: "2026-11-14" },

  { ten: "CĐ2 (Phần 4): Vật nối dây, mực nước thay đổi, đòn bẩy và lực đẩy Ác-si-mét", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 2 - Khối lượng riêng, áp suất, lực đẩy Ác-si-mét", youtube: "https://www.youtube.com/watch?v=5L5aRG96HDo", taiLieu: "", moTa: "", ngay: "2026-11-12" },
  { ten: "CĐ2 (Phần 3): Lực đẩy Ác-si-mét - Phương pháp lực kế - Vật nổi", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 2 - Khối lượng riêng, áp suất, lực đẩy Ác-si-mét", youtube: "https://www.youtube.com/watch?v=OfSR5i9KGSw", taiLieu: "", moTa: "", ngay: "2026-11-12" },
  { ten: "CĐ2 (Phần 2): Bài tập khối lượng riêng, áp suất, bình thông nhau (Dạng 1 - 2)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 2 - Khối lượng riêng, áp suất, lực đẩy Ác-si-mét", youtube: "https://www.youtube.com/watch?v=cvsqS9Swdbk", taiLieu: "", moTa: "", ngay: "2026-11-12" },
  { ten: "CĐ2 (Phần 1): Khối lượng riêng - Áp suất - Lực đẩy Ác-si-mét - Lí thuyết", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 2 - Khối lượng riêng, áp suất, lực đẩy Ác-si-mét", youtube: "https://www.youtube.com/watch?v=AWaGjgqDtNM", taiLieu: "", moTa: "", ngay: "2026-11-12" },

  { ten: "CĐ1 (Phần 4): Xuôi ngược dòng, thang cuốn, con chó chạy đi chạy lại", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 1 - Chuyển động cơ học", youtube: "https://www.youtube.com/watch?v=Zd-T8PD31-Y", taiLieu: "", moTa: "", ngay: "2026-11-10" },
  { ten: "CĐ1 (Phần 3): Đồ thị s-t (Đề HSG An Giang 2025-2026) và bài toán gặp nhau", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 1 - Chuyển động cơ học", youtube: "https://www.youtube.com/watch?v=LU8O1lNyUQY", taiLieu: "", moTa: "", ngay: "2026-11-10" },
  { ten: "CĐ1 (Phần 2): Tốc độ và tốc độ trung bình - 2 dạng chắc chắn có trong đề", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 1 - Chuyển động cơ học", youtube: "https://www.youtube.com/watch?v=V2MR2Nauw50", taiLieu: "", moTa: "", ngay: "2026-11-10" },
  { ten: "CĐ1 (Phần 1): Chuyển động cơ học - Lí thuyết trọng tâm", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 1 - Chuyển động cơ học", youtube: "https://www.youtube.com/watch?v=A8FsdamtcUs", taiLieu: "", moTa: "", ngay: "2026-11-10" },

  // ----- HSG THPT -----
  { ten: "Chuyên đề 3 (bản mới): Chuyển động tròn đều - Gia tốc hướng tâm - Bài toán kim đồng hồ", mon: "Vật lý", lop: "HSG", cap: "THPT", chuDe: "Chuyên đề 3", youtube: "https://www.youtube.com/watch?v=zITfR2-qnNU", taiLieu: "", moTa: "", ngay: "2026-11-12" },
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
  { ten: "Đề chính thức TN THPT 2026 - Tin học (mã đề 0504) - Định hướng Khoa học máy tính", mon: "Tin học", lop: "12", loai: "Thi thử TN THPT", tep: ["de/tin2026-0504-p1.txt", "de/2026-tin-hoc-0504-cs.txt"], thoiGian: 50, ngay: "2026-06-12" },
  { ten: "Đề chính thức TN THPT 2026 - Tin học (mã đề 0504) - Định hướng Tin học ứng dụng", mon: "Tin học", lop: "12", loai: "Thi thử TN THPT", tep: ["de/tin2026-0504-p1.txt", "de/2026-tin-hoc-0504-ict.txt"], thoiGian: 50, ngay: "2026-06-12" },

  { ten: "Mẫu: Thi thử TN THPT Vật lí (đề rút gọn)", mon: "Vật lý", lop: "12", loai: "Thi thử TN THPT", tep: "de/mau-vat-ly-12-thi-thu.txt", thoiGian: 15, ngay: "2026-11-10" },
  { ten: "Mẫu: Luyện tập Python cơ bản", mon: "Tin học", lop: "10", loai: "Luyện tập", tep: "de/mau-tin-hoc-10-python.txt", thoiGian: 10, ngay: "2026-11-10" }
];

/* ---------- BÀI HỌC SONG NGỮ VIỆT - ANH (đọc trực tiếp trên trang) ----------
   Mỗi bài là một tệp .json trong thư mục bai/ (soạn bằng Công cụ thêm bài, mục "Bài học song ngữ").
   Học sinh chọn xem Tiếng Việt, English hoặc Song ngữ; có thẻ thuật ngữ kèm phát âm. */
const BAI_HOC = [
  // ▼▼▼ DÁN BÀI HỌC MỚI NGAY DƯỚI DÒNG NÀY ▼▼▼

  { ten: "Mẫu: Biến và kiểu dữ liệu trong Python", tenEn: "Variables and data types in Python", mon: "Tin học", lop: "10", tep: "bai/mau-bien-va-kieu-du-lieu.json", ngay: "2026-11-19" }
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
