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
  thongBao: "Mới: mục Dạy bằng tiếng Anh cho giáo viên Lý – Tin (miễn phí): lộ trình 4 chặng từ tự học đến tự dạy, luyện nghe – nói, kịch bản tiết dạy mẫu.",

  gioiThieu: "Nơi tập hợp bài giảng, tài liệu và đề ôn luyện môn Vật lý, Tin học dành cho học sinh THPT.",

  // Điền link của thầy/cô. Mục nào để "" sẽ tự ẩn.
  youtube: "https://www.youtube.com/@thephong6695",
  facebook: "https://www.facebook.com/lamthephongpq",
  zalo: "",
  email: "phongamx@gmail.com",

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
  { ten: "CĐ5 (Phần 4): Công suất cực đại, truyền tải điện, động cơ điện (nâng cao)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 5 - Công suất điện, định luật Jun - Len-xơ", tenEn: "Topic 5 (Part 4): Maximum power, power transmission, electric motors (advanced)", youtube: "https://www.youtube.com/watch?v=hRhFuDc4w3g", taiLieu: "", moTa: "", ngay: "2026-11-18" },
  { ten: "CĐ5 (Phần 3): Tiền điện, định luật Jun - Len-xơ, bếp điện (Dạng 3 - 4)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 5 - Công suất điện, định luật Jun - Len-xơ", tenEn: "Topic 5 (Part 3): Electricity bills, Joule's law, electric stoves", youtube: "https://www.youtube.com/watch?v=2cIrxNdE-5s", taiLieu: "", moTa: "", ngay: "2026-11-18" },
  { ten: "CĐ5 (Phần 2): Công suất điện, đèn sáng bình thường - Giải đề An Giang", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 5 - Công suất điện, định luật Jun - Len-xơ", tenEn: "Topic 5 (Part 2): Electric power, lamps at rated operation - An Giang exam solutions", youtube: "https://www.youtube.com/watch?v=MSnQNtsgxZI", taiLieu: "", moTa: "", ngay: "2026-11-18" },
  { ten: "CĐ5 (Phần 1): Công suất điện, điện năng, định luật Jun - Len-xơ - Lí thuyết", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 5 - Công suất điện, định luật Jun - Len-xơ", tenEn: "Topic 5 (Part 1): Electric power, electrical energy, Joule's law - Theory", youtube: "https://www.youtube.com/watch?v=tMIqKYusVPA", taiLieu: "", moTa: "", ngay: "2026-11-18" },

  { ten: "CĐ4 (Phần 4): Mạch cầu, sụt áp, sự cố mạch điện (nâng cao)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 4 - Định luật Ôm, mạch điện", tenEn: "Topic 4 (Part 4): Bridge circuits, voltage drop, circuit faults (advanced)", youtube: "https://www.youtube.com/watch?v=Z0uv6oOFJqk", taiLieu: "", moTa: "", ngay: "2026-11-16" },
  { ten: "CĐ4 (Phần 3): Vôn kế, ampe kế, chập mạch, biến trở - Giải đề An Giang", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 4 - Định luật Ôm, mạch điện", tenEn: "Topic 4 (Part 3): Voltmeters, ammeters, short circuits, rheostats - An Giang exam solutions", youtube: "https://www.youtube.com/watch?v=6_yeX8g3UiE", taiLieu: "", moTa: "", ngay: "2026-11-16" },
  { ten: "CĐ4 (Phần 2): Định luật Ôm, điện trở dây dẫn, mạch hỗn hợp (Dạng 1 - 2)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 4 - Định luật Ôm, mạch điện", tenEn: "Topic 4 (Part 2): Ohm's law, wire resistance, mixed circuits", youtube: "https://www.youtube.com/watch?v=cRHeD9t-ICY", taiLieu: "", moTa: "", ngay: "2026-11-16" },
  { ten: "CĐ4 (Phần 1): Định luật Ôm - Mạch nối tiếp, song song, mạch cầu - Lí thuyết", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 4 - Định luật Ôm, mạch điện", tenEn: "Topic 4 (Part 1): Ohm's law - Series, parallel and bridge circuits - Theory", youtube: "https://www.youtube.com/watch?v=sMm1JUIzmf0", taiLieu: "", moTa: "", ngay: "2026-11-16" },

  { ten: "CĐ3 (Phần 4): Con lắc, máng trượt, bóng nảy, lực cản (nâng cao)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 3 - Công, công suất, cơ năng", tenEn: "Topic 3 (Part 4): Pendulums, ramps, bouncing balls, drag forces (advanced)", youtube: "https://www.youtube.com/watch?v=sUoLbOfyeTA", taiLieu: "", moTa: "", ngay: "2026-11-14" },
  { ten: "CĐ3 (Phần 3): Động năng, thế năng, bảo toàn cơ năng", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 3 - Công, công suất, cơ năng", tenEn: "Topic 3 (Part 3): Kinetic energy, potential energy, conservation of mechanical energy", youtube: "https://www.youtube.com/watch?v=5WApaHRgEvs", taiLieu: "", moTa: "", ngay: "2026-11-14" },
  { ten: "CĐ3 (Phần 2): Công, công suất, hiệu suất, mặt phẳng nghiêng (Dạng 1 - 2)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 3 - Công, công suất, cơ năng", tenEn: "Topic 3 (Part 2): Work, power, efficiency, inclined planes", youtube: "https://www.youtube.com/watch?v=a2GDSiELY20", taiLieu: "", moTa: "", ngay: "2026-11-14" },
  { ten: "CĐ3 (Phần 1): Công, công suất, bảo toàn cơ năng - Lí thuyết trọng tâm", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 3 - Công, công suất, cơ năng", tenEn: "Topic 3 (Part 1): Work, power, conservation of mechanical energy - Key theory", youtube: "https://www.youtube.com/watch?v=8vMjPBjRNGU", taiLieu: "", moTa: "", ngay: "2026-11-14" },

  { ten: "CĐ2 (Phần 4): Vật nối dây, mực nước thay đổi, đòn bẩy và lực đẩy Ác-si-mét", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 2 - Khối lượng riêng, áp suất, lực đẩy Ác-si-mét", tenEn: "Topic 2 (Part 4): Objects on strings, changing water levels, levers and buoyancy", youtube: "https://www.youtube.com/watch?v=5L5aRG96HDo", taiLieu: "", moTa: "", ngay: "2026-11-12" },
  { ten: "CĐ2 (Phần 3): Lực đẩy Ác-si-mét - Phương pháp lực kế - Vật nổi", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 2 - Khối lượng riêng, áp suất, lực đẩy Ác-si-mét", tenEn: "Topic 2 (Part 3): Buoyant force - The spring scale method - Floating objects", youtube: "https://www.youtube.com/watch?v=OfSR5i9KGSw", taiLieu: "", moTa: "", ngay: "2026-11-12" },
  { ten: "CĐ2 (Phần 2): Bài tập khối lượng riêng, áp suất, bình thông nhau (Dạng 1 - 2)", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 2 - Khối lượng riêng, áp suất, lực đẩy Ác-si-mét", tenEn: "Topic 2 (Part 2): Density, pressure and communicating vessels - Exercises", youtube: "https://www.youtube.com/watch?v=cvsqS9Swdbk", taiLieu: "", moTa: "", ngay: "2026-11-12" },
  { ten: "CĐ2 (Phần 1): Khối lượng riêng - Áp suất - Lực đẩy Ác-si-mét - Lí thuyết", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 2 - Khối lượng riêng, áp suất, lực đẩy Ác-si-mét", tenEn: "Topic 2 (Part 1): Density - Pressure - Archimedes' principle - Theory", youtube: "https://www.youtube.com/watch?v=AWaGjgqDtNM", taiLieu: "", moTa: "", ngay: "2026-11-12" },

  { ten: "CĐ1 (Phần 4): Xuôi ngược dòng, thang cuốn, con chó chạy đi chạy lại", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 1 - Chuyển động cơ học", tenEn: "Topic 1 (Part 4): Upstream and downstream, escalators, the running dog problem", youtube: "https://www.youtube.com/watch?v=Zd-T8PD31-Y", taiLieu: "", moTa: "", ngay: "2026-11-10" },
  { ten: "CĐ1 (Phần 3): Đồ thị s-t (Đề HSG An Giang 2025-2026) và bài toán gặp nhau", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 1 - Chuyển động cơ học", tenEn: "Topic 1 (Part 3): Position-time graphs (An Giang 2025-2026 exam) and meeting problems", youtube: "https://www.youtube.com/watch?v=LU8O1lNyUQY", taiLieu: "", moTa: "", ngay: "2026-11-10" },
  { ten: "CĐ1 (Phần 2): Tốc độ và tốc độ trung bình - 2 dạng chắc chắn có trong đề", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 1 - Chuyển động cơ học", tenEn: "Topic 1 (Part 2): Speed and average speed - Two must-know problem types", youtube: "https://www.youtube.com/watch?v=V2MR2Nauw50", taiLieu: "", moTa: "", ngay: "2026-11-10" },
  { ten: "CĐ1 (Phần 1): Chuyển động cơ học - Lí thuyết trọng tâm", mon: "Vật lý", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 1 - Chuyển động cơ học", tenEn: "Topic 1 (Part 1): Mechanical motion - Key theory", youtube: "https://www.youtube.com/watch?v=A8FsdamtcUs", taiLieu: "", moTa: "", ngay: "2026-11-10" },

  // ----- HSG THPT -----
  { ten: "Chuyên đề 3. Chuyển động tròn đều - Gia tốc hướng tâm - Bài toán kim đồng hồ", mon: "Vật lý", lop: "HSG", cap: "THPT", chuDe: "Chuyên đề 3", tenEn: "Topic 3. Uniform circular motion - Centripetal acceleration - Clock hand problems", youtube: "https://www.youtube.com/watch?v=zITfR2-qnNU", taiLieu: "", moTa: "", ngay: "2026-11-12" },
  { ten: "Chuyên đề 2. Chuyển động thẳng biến đổi đều - Rơi tự do", mon: "Vật lý", lop: "HSG", cap: "THPT", chuDe: "Chuyên đề 2", tenEn: "Topic 2. Uniformly accelerated motion - Free fall", youtube: "https://www.youtube.com/watch?v=t2CkWlaNOlc", taiLieu: "", moTa: "", ngay: "2026-11-07" },
  { ten: "Lời giải 12 bài HSG Chuyển động thẳng đều", mon: "Vật lý", lop: "HSG", cap: "THPT", chuDe: "Chuyên đề 1", tenEn: "Solutions to 12 olympiad problems on uniform linear motion", youtube: "https://www.youtube.com/watch?v=sP5Ile7C6Rg", taiLieu: "", moTa: "", ngay: "2026-11-06" },
  { ten: "Chuyên đề 1. Chuyển động thẳng đều", mon: "Vật lý", lop: "HSG", cap: "THPT", chuDe: "Chuyên đề 1", tenEn: "Topic 1. Uniform linear motion", youtube: "https://www.youtube.com/watch?v=q9AwrSVA2_8", taiLieu: "", moTa: "", ngay: "2026-11-05" }
];

/* ---------- ĐỀ TRẮC NGHIỆM ONLINE (học sinh làm bài, chấm điểm ngay) ----------
   Mỗi đề là một tệp chữ trong thư mục de/ trên GitHub (xem cách soạn trong Công cụ thêm bài).
   loai: "Luyện tập" hoặc "Thi thử TN THPT" (đề thi thử hiện ở lớp 12).
   thoiGian: số phút làm bài (0 = không giới hạn). */
const DE_THI = [
  // ▼▼▼ DÁN ĐỀ MỚI NGAY DƯỚI DÒNG NÀY ▼▼▼

  // ----- Vật lý 10 - Chương I. Mở đầu (mỗi bài 3 đề, 28 câu theo cấu trúc TN THPT) -----
  { ten: "Bài 1 – Đề 1. Làm quen với Vật lí", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai01-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 1 – Đề 2. Làm quen với Vật lí", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai01-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 1 – Đề 3. Làm quen với Vật lí", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai01-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 2 – Đề 1. Các quy tắc an toàn trong phòng thực hành Vật lí", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai02-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 2 – Đề 2. Các quy tắc an toàn trong phòng thực hành Vật lí", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai02-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 2 – Đề 3. Các quy tắc an toàn trong phòng thực hành Vật lí", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai02-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 3 – Đề 1. Thực hành tính sai số trong phép đo. Ghi kết quả đo", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai03-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 3 – Đề 2. Thực hành tính sai số trong phép đo. Ghi kết quả đo", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai03-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 3 – Đề 3. Thực hành tính sai số trong phép đo. Ghi kết quả đo", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai03-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 4 – Đề 1. Độ dịch chuyển và quãng đường đi được", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai04-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 4 – Đề 2. Độ dịch chuyển và quãng đường đi được", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai04-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 4 – Đề 3. Độ dịch chuyển và quãng đường đi được", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai04-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 5 – Đề 1. Tốc độ và vận tốc", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai05-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 5 – Đề 2. Tốc độ và vận tốc", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai05-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 5 – Đề 3. Tốc độ và vận tốc", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai05-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 6 – Đề 1. Thực hành: Đo tốc độ của vật chuyển động", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai06-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 6 – Đề 2. Thực hành: Đo tốc độ của vật chuyển động", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai06-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 6 – Đề 3. Thực hành: Đo tốc độ của vật chuyển động", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai06-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 7 – Đề 1. Đồ thị độ dịch chuyển – thời gian", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai07-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 7 – Đề 2. Đồ thị độ dịch chuyển – thời gian", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai07-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 7 – Đề 3. Đồ thị độ dịch chuyển – thời gian", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai07-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 8 – Đề 1. Chuyển động biến đổi. Gia tốc", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai08-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 8 – Đề 2. Chuyển động biến đổi. Gia tốc", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai08-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 8 – Đề 3. Chuyển động biến đổi. Gia tốc", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai08-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 9 – Đề 1. Chuyển động thẳng biến đổi đều", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai09-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 9 – Đề 2. Chuyển động thẳng biến đổi đều", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai09-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 9 – Đề 3. Chuyển động thẳng biến đổi đều", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai09-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 10 – Đề 1. Sự rơi tự do", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai10-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 10 – Đề 2. Sự rơi tự do", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai10-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 10 – Đề 3. Sự rơi tự do", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai10-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 11 – Đề 1. Thực hành: Đo gia tốc rơi tự do", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai11-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 11 – Đề 2. Thực hành: Đo gia tốc rơi tự do", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai11-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 11 – Đề 3. Thực hành: Đo gia tốc rơi tự do", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai11-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 12 – Đề 1. Chuyển động ném", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai12-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 12 – Đề 2. Chuyển động ném", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai12-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 12 – Đề 3. Chuyển động ném", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai12-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 13 – Đề 1. Tổng hợp và phân tích lực. Cân bằng lực", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai13-de1.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 13 – Đề 2. Tổng hợp và phân tích lực. Cân bằng lực", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai13-de2.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 13 – Đề 3. Tổng hợp và phân tích lực. Cân bằng lực", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai13-de3.txt", thoiGian: 50, ngay: "2026-11-19" },
  { ten: "Bài 14 – Đề 1. Định luật 1 Newton", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai14-de1.txt", thoiGian: 50, ngay: "2026-11-20" },
  { ten: "Bài 14 – Đề 2. Định luật 1 Newton", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai14-de2.txt", thoiGian: 50, ngay: "2026-11-20" },
  { ten: "Bài 14 – Đề 3. Định luật 1 Newton", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai14-de3.txt", thoiGian: 50, ngay: "2026-11-20" },
  { ten: "Bài 15 – Đề 1. Định luật 2 Newton", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai15-de1.txt", thoiGian: 50, ngay: "2026-11-20" },
  { ten: "Bài 15 – Đề 2. Định luật 2 Newton", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai15-de2.txt", thoiGian: 50, ngay: "2026-11-20" },
  { ten: "Bài 15 – Đề 3. Định luật 2 Newton", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai15-de3.txt", thoiGian: 50, ngay: "2026-11-20" },
  { ten: "Bài 16 – Đề 1. Định luật 3 Newton", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai16-de1.txt", thoiGian: 50, ngay: "2026-11-20" },
  { ten: "Bài 16 – Đề 2. Định luật 3 Newton", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai16-de2.txt", thoiGian: 50, ngay: "2026-11-20" },
  { ten: "Bài 16 – Đề 3. Định luật 3 Newton", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai16-de3.txt", thoiGian: 50, ngay: "2026-11-20" },
  { ten: "Bài 17 – Đề 1. Trọng lực và lực căng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai17-de1.txt", thoiGian: 50, ngay: "2026-11-20" },
  { ten: "Bài 17 – Đề 2. Trọng lực và lực căng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai17-de2.txt", thoiGian: 50, ngay: "2026-11-20" },
  { ten: "Bài 17 – Đề 3. Trọng lực và lực căng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai17-de3.txt", thoiGian: 50, ngay: "2026-11-20" },
  { ten: "Bài 18 – Đề 1. Lực ma sát", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai18-de1.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 18 – Đề 2. Lực ma sát", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai18-de2.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 18 – Đề 3. Lực ma sát", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai18-de3.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 19 – Đề 1. Lực cản và lực nâng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai19-de1.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 19 – Đề 2. Lực cản và lực nâng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai19-de2.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 19 – Đề 3. Lực cản và lực nâng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai19-de3.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 20 – Đề 1. Một số ví dụ về cách giải bài toán động lực học", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai20-de1.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 20 – Đề 2. Một số ví dụ về cách giải bài toán động lực học", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai20-de2.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 20 – Đề 3. Một số ví dụ về cách giải bài toán động lực học", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai20-de3.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 21 – Đề 1. Moment lực. Cân bằng của vật rắn", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai21-de1.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 21 – Đề 2. Moment lực. Cân bằng của vật rắn", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai21-de2.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 21 – Đề 3. Moment lực. Cân bằng của vật rắn", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai21-de3.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 22 – Đề 1. Thực hành: Tổng hợp lực", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai22-de1.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 22 – Đề 2. Thực hành: Tổng hợp lực", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai22-de2.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 22 – Đề 3. Thực hành: Tổng hợp lực", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai22-de3.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 23 – Đề 1. Năng lượng. Công cơ học", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai23-de1.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 23 – Đề 2. Năng lượng. Công cơ học", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai23-de2.txt", thoiGian: 50, ngay: "2026-11-22" },
  { ten: "Bài 23 – Đề 3. Năng lượng. Công cơ học", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai23-de3.txt", thoiGian: 50, ngay: "2026-11-22" },

  // ----- Vật lý 10 (sách thống nhất) - Chương II. Động học -----
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 4. Độ dịch chuyển và quãng đường đi được", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai04-do-dich-chuyen.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 5. Tốc độ và vận tốc", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai05-toc-do-van-toc.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 6. Thực hành: Đo tốc độ của vật chuyển động", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai06-thuc-hanh-do-toc-do.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 7. Đồ thị độ dịch chuyển – thời gian", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai07-do-thi-dich-chuyen.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 8. Chuyển động biến đổi. Gia tốc", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai08-gia-toc.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 9. Chuyển động thẳng biến đổi đều", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai09-bien-doi-deu.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 10. Sự rơi tự do", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai10-roi-tu-do.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 11. Thực hành: Đo gia tốc rơi tự do", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai11-thuc-hanh-roi-tu-do.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 12. Chuyển động ném", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai12-chuyen-dong-nem.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 13. Tổng hợp và phân tích lực. Cân bằng lực", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai13-tong-hop-luc.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 14. Định luật 1 Newton", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai14-dinh-luat-1-newton.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 15. Định luật 2 Newton", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai15-dinh-luat-2-newton.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 16. Định luật 3 Newton", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai16-dinh-luat-3-newton.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 17. Trọng lực và lực căng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai17-trong-luc-luc-cang.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 18. Lực ma sát", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai18-luc-ma-sat.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 19. Lực cản và lực nâng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai19-luc-can-luc-nang.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 20. Một số ví dụ về cách giải các bài toán thuộc phần động lực học", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai20-bai-toan-dong-luc-hoc.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 21. Moment lực. Cân bằng của vật rắn", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai21-moment-luc.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 22. Thực hành: Tổng hợp lực", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai22-thuc-hanh-tong-hop-luc.txt", thoiGian: 20, ngay: "2026-11-19" },
  // (đề cũ 13 câu, đã thay bằng 3 đề 28 câu) { ten: "Bài 23. Năng lượng. Công cơ học", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai23-nang-luong-cong.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 24. Công suất", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai24-cong-suat.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 25. Động năng, thế năng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai25-dong-nang-the-nang.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 26. Cơ năng và định luật bảo toàn cơ năng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai26-co-nang.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 27. Hiệu suất", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai27-hieu-suat.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 28. Động lượng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai28-dong-luong.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 29. Định luật bảo toàn động lượng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai29-bao-toan-dong-luong.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 30. Thực hành: Xác định động lượng của vật trước và sau va chạm", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai30-thuc-hanh-dong-luong.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 31. Động học của chuyển động tròn đều", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai31-chuyen-dong-tron-deu.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 32. Lực hướng tâm và gia tốc hướng tâm", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai32-luc-huong-tam.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 33. Biến dạng của vật rắn", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai33-bien-dang-vat-ran.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 34. Khối lượng riêng. Áp suất chất lỏng", mon: "Vật lý", lop: "10", loai: "Luyện tập", tep: "de/vl10-bai34-ap-suat-chat-long.txt", thoiGian: 20, ngay: "2026-11-19" },
  // ----- Vật lý 11 (sách thống nhất) -----
  { ten: "Bài 1. Dao động điều hoà", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai01-dao-dong-dieu-hoa.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 2. Mô tả dao động điều hoà", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai02-mo-ta-dao-dong.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 3. Vận tốc, gia tốc trong dao động điều hoà", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai03-van-toc-gia-toc.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 4. Bài tập về dao động điều hoà", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai04-bai-tap-dao-dong.txt", thoiGian: 25, ngay: "2026-11-19" },
  { ten: "Bài 5. Động năng. Thế năng. Sự chuyển hoá năng lượng trong dao động điều hoà", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai05-nang-luong-dao-dong.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 6. Dao động tắt dần. Dao động cưỡng bức. Hiện tượng cộng hưởng", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai06-tat-dan-cuong-buc.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 7. Bài tập về sự chuyển hoá năng lượng trong dao động điều hoà", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai07-bai-tap-nang-luong.txt", thoiGian: 25, ngay: "2026-11-19" },
  { ten: "Bài 8. Mô tả sóng", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai08-mo-ta-song.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 9. Sóng ngang. Sóng dọc. Sự truyền năng lượng của sóng cơ", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai09-song-ngang-song-doc.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 10. Thực hành: Đo tần số của sóng âm", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai10-thuc-hanh-tan-so-am.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 11. Sóng điện từ", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai11-song-dien-tu.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 12. Giao thoa sóng", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai12-giao-thoa-song.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 13. Sóng dừng", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai13-song-dung.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 14. Bài tập về sóng", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai14-bai-tap-song.txt", thoiGian: 25, ngay: "2026-11-19" },
  { ten: "Bài 15. Thực hành: Đo tốc độ truyền âm", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai15-thuc-hanh-toc-do-am.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 16. Lực tương tác giữa các điện tích", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai16-luc-tuong-tac-dien-tich.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 17. Khái niệm điện trường", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai17-khai-niem-dien-truong.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 18. Điện trường đều", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai18-dien-truong-deu.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 19. Thế năng điện", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai19-the-nang-dien.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 20. Điện thế", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai20-dien-the.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 21. Tụ điện", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai21-tu-dien.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 22. Cường độ dòng điện", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai22-cuong-do-dong-dien.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 23. Điện trở. Định luật Ohm", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai23-dien-tro-dinh-luat-ohm.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 24. Nguồn điện", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai24-nguon-dien.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 25. Năng lượng và công suất điện", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai25-nang-luong-cong-suat-dien.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 26. Thực hành: Đo suất điện động và điện trở trong của pin điện hoá", mon: "Vật lý", lop: "11", loai: "Luyện tập", tep: "de/vl11-bai26-thuc-hanh-suat-dien-dong.txt", thoiGian: 20, ngay: "2026-11-19" },
  // ----- Vật lý 12 (sách thống nhất) -----
  { ten: "Bài 1. Cấu trúc của chất. Sự chuyển thể", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai01-cau-truc-chat.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 2. Nội năng. Định luật I của nhiệt động lực học", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai02-noi-nang.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 3. Nhiệt độ. Thang nhiệt độ – nhiệt kế", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai03-nhiet-do.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 4. Nhiệt dung riêng", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai04-nhiet-dung-rieng.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 5. Nhiệt nóng chảy riêng", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai05-nhiet-nong-chay-rieng.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 6. Nhiệt hoá hơi riêng", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai06-nhiet-hoa-hoi-rieng.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 7. Bài tập về vật lí nhiệt", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai07-bai-tap-vat-li-nhiet.txt", thoiGian: 25, ngay: "2026-11-19" },
  { ten: "Bài 8. Mô hình động học phân tử chất khí", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai08-mo-hinh-dong-hoc-phan-tu.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 9. Định luật Boyle", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai09-dinh-luat-boyle.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 10. Định luật Charles", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai10-dinh-luat-charles.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 11. Phương trình trạng thái của khí lí tưởng", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai11-phuong-trinh-trang-thai.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 12. Áp suất khí theo mô hình động học phân tử. Quan hệ giữa động năng phân tử và nhiệt độ", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai12-ap-suat-khi-dong-nang.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 13. Bài tập về khí lí tưởng", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai13-bai-tap-khi-li-tuong.txt", thoiGian: 25, ngay: "2026-11-19" },
  { ten: "Bài 14. Từ trường", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai14-tu-truong.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 15. Lực từ tác dụng lên dây dẫn mang dòng điện. Cảm ứng từ", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai15-luc-tu-cam-ung-tu.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 16. Từ thông. Hiện tượng cảm ứng điện từ", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai16-tu-thong-cam-ung-dien-tu.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 17. Máy phát điện xoay chiều", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai17-may-phat-dien-xoay-chieu.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 18. Ứng dụng hiện tượng cảm ứng điện từ", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai18-ung-dung-cam-ung-dien-tu.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 19. Điện từ trường. Mô hình sóng điện từ", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai19-dien-tu-truong.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 20. Bài tập về từ trường", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai20-bai-tap-tu-truong.txt", thoiGian: 25, ngay: "2026-11-19" },
  { ten: "Bài 21. Cấu trúc hạt nhân", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai21-cau-truc-hat-nhan.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 22. Phản ứng hạt nhân và năng lượng liên kết", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai22-phan-ung-hat-nhan.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 23. Hiện tượng phóng xạ", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai23-hien-tuong-phong-xa.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 24. Công nghiệp hạt nhân", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai24-cong-nghiep-hat-nhan.txt", thoiGian: 20, ngay: "2026-11-19" },
  { ten: "Bài 25. Bài tập về vật lí hạt nhân", mon: "Vật lý", lop: "12", loai: "Luyện tập", tep: "de/vl12-bai25-bai-tap-hat-nhan.txt", thoiGian: 25, ngay: "2026-11-19" },

  // ----- Đề thi tốt nghiệp THPT chính thức của Bộ GD&ĐT -----
  { ten: "Đề chính thức TN THPT 2026 - Vật lí (mã đề 0214)", mon: "Vật lý", lop: "12", loai: "Thi thử TN THPT", tep: "de/2026-vat-li-chinh-thuc-0214.txt", thoiGian: 50, ngay: "2026-06-12" },
  { ten: "Đề chính thức TN THPT 2026 - Tin học (mã đề 0504) - Định hướng Khoa học máy tính", mon: "Tin học", lop: "12", loai: "Thi thử TN THPT", tep: ["de/tin2026-0504-p1.txt", "de/2026-tin-hoc-0504-cs.txt"], thoiGian: 50, ngay: "2026-06-12" },
  { ten: "Đề chính thức TN THPT 2026 - Tin học (mã đề 0504) - Định hướng Tin học ứng dụng", mon: "Tin học", lop: "12", loai: "Thi thử TN THPT", tep: ["de/tin2026-0504-p1.txt", "de/2026-tin-hoc-0504-ict.txt"], thoiGian: 50, ngay: "2026-06-12" },

  // Hai đề mẫu dưới đây đang tạm ẩn (có // ở đầu dòng). Tệp đề mẫu vẫn còn trong thư mục de/ để soạn theo.
  // { ten: "Mẫu: Thi thử TN THPT Vật lí (đề rút gọn)", mon: "Vật lý", lop: "12", loai: "Thi thử TN THPT", tep: "de/mau-vat-ly-12-thi-thu.txt", thoiGian: 15, ngay: "2026-11-10" },
  // { ten: "Mẫu: Luyện tập Python cơ bản", mon: "Tin học", lop: "10", loai: "Luyện tập", tep: "de/mau-tin-hoc-10-python.txt", thoiGian: 10, ngay: "2026-11-10" },
];

/* ---------- BÀI HỌC SONG NGỮ VIỆT - ANH (đọc trực tiếp trên trang) ----------
   Mỗi bài là một tệp .json trong thư mục bai/ (soạn bằng Công cụ thêm bài, mục "Bài học song ngữ").
   Học sinh chọn xem Tiếng Việt, English hoặc Song ngữ; có thẻ thuật ngữ kèm phát âm.
   Trang "Song ngữ" chia theo lớp: Vật lý 10-12, Tin học 10-12 và khóa giáo viên (lop: "GV").
   chuong: tên chương để xếp nhóm (có thể bỏ trống); soBai: số thứ tự bài trong sách để xếp thứ tự. */
const BAI_HOC = [
  // ▼▼▼ DÁN BÀI HỌC MỚI NGAY DƯỚI DÒNG NÀY ▼▼▼

  // ----- Mục "Dạy bằng tiếng Anh" (dành cho giáo viên) -----
  { ten: "Kịch bản tiết dạy mẫu Vật lý: Gia tốc", tenEn: "Sample physics lesson script: Acceleration", mon: "Tiếng Anh", lop: "GV", chuong: "Phần 4. Lên lớp thật", soBai: 7, tep: "bai/gv7-kich-ban-vat-ly.json", ngay: "2026-11-19" },
  { ten: "Kịch bản tiết dạy mẫu Tin học: Câu lệnh if", tenEn: "Sample IT lesson script: The if statement", mon: "Tiếng Anh", lop: "GV", chuong: "Phần 4. Lên lớp thật", soBai: 8, tep: "bai/gv8-kich-ban-tin-hoc.json", ngay: "2026-11-19" },
  { ten: "Kịch bản tiết dạy mẫu Vật lý 10 – Bài 5: Tốc độ và vận tốc", tenEn: "Sample Grade 10 physics lesson script – Lesson 5: Speed and velocity", mon: "Tiếng Anh", lop: "GV", chuong: "Phần 4. Lên lớp thật", soBai: 9, tep: "bai/gv9-kich-ban-vl10-toc-do.json", ngay: "2026-11-19" },
  { ten: "Kịch bản tiết dạy mẫu Vật lý 10 – Bài 15: Định luật 2 Newton", tenEn: "Sample Grade 10 physics lesson script – Lesson 15: Newton's second law", mon: "Tiếng Anh", lop: "GV", chuong: "Phần 4. Lên lớp thật", soBai: 10, tep: "bai/gv10-kich-ban-vl10-newton-2.json", ngay: "2026-11-19" },
  { ten: "Bài 1. Đọc số, số thập phân và đơn vị đo", tenEn: "Reading numbers, decimals and units", mon: "Tiếng Anh", lop: "GV", chuong: "Phần 1. Nền tảng: đọc số và công thức", soBai: 1, tep: "bai/gv1-doc-so-va-don-vi.json", ngay: "2026-11-19" },
  { ten: "Bài 2. Đọc công thức bằng tiếng Anh", tenEn: "Reading formulas aloud", mon: "Tiếng Anh", lop: "GV", chuong: "Phần 1. Nền tảng: đọc số và công thức", soBai: 2, tep: "bai/gv2-doc-cong-thuc.json", ngay: "2026-11-19" },
  { ten: "Bài 3. Câu nói thường dùng trong lớp học", tenEn: "Everyday classroom language", mon: "Tiếng Anh", lop: "GV", chuong: "Phần 2. Ngôn ngữ trong lớp học", soBai: 3, tep: "bai/gv3-cau-noi-trong-lop.json", ngay: "2026-11-19" },
  { ten: "Bài 4. Đặt câu hỏi và nhận xét học sinh", tenEn: "Asking questions and giving feedback", mon: "Tiếng Anh", lop: "GV", chuong: "Phần 2. Ngôn ngữ trong lớp học", soBai: 4, tep: "bai/gv4-dat-cau-hoi-nhan-xet.json", ngay: "2026-11-19" },
  { ten: "Bài 5. Dạy một bài Vật lý bằng tiếng Anh", tenEn: "Teaching a physics lesson in English", mon: "Tiếng Anh", lop: "GV", chuong: "Phần 3. Dạy theo môn học", soBai: 5, tep: "bai/gv5-day-bai-vat-ly.json", ngay: "2026-11-19" },
  { ten: "Bài 6. Dạy Tin học và lập trình bằng tiếng Anh", tenEn: "Teaching IT and programming in English", mon: "Tiếng Anh", lop: "GV", chuong: "Phần 3. Dạy theo môn học", soBai: 6, tep: "bai/gv6-day-bai-tin-hoc.json", ngay: "2026-11-19" },

  // ----- Bài học song ngữ theo lớp -----

  // Vật lý 10 – theo SGK Vật lí 10 (Kết nối tri thức, bộ thống nhất)
  { ten: "Bài 1. Làm quen với Vật lí", tenEn: "Lesson 1. Getting to know Physics", mon: "Vật lý", lop: "10", chuong: "Chương I. Mở đầu", soBai: 1, tep: "bai/vl10-b01-lam-quen-vat-li.json", ngay: "2026-11-19" },
  { ten: "Bài 2. Các quy tắc an toàn trong phòng thực hành Vật lí", tenEn: "Lesson 2. Safety rules in the physics laboratory", mon: "Vật lý", lop: "10", chuong: "Chương I. Mở đầu", soBai: 2, tep: "bai/vl10-b02-an-toan-thuc-hanh.json", ngay: "2026-11-19" },
  { ten: "Bài 3. Thực hành tính sai số trong phép đo. Ghi kết quả đo", tenEn: "Lesson 3. Practical: calculating measurement errors and recording results", mon: "Vật lý", lop: "10", chuong: "Chương I. Mở đầu", soBai: 3, tep: "bai/vl10-b03-sai-so-phep-do.json", ngay: "2026-11-19" },
  { ten: "Bài 4. Độ dịch chuyển và quãng đường đi được", tenEn: "Lesson 4. Displacement and distance travelled", mon: "Vật lý", lop: "10", chuong: "Chương II. Động học", soBai: 4, tep: "bai/vl10-b04-do-dich-chuyen.json", ngay: "2026-11-19" },
  { ten: "Bài 5. Tốc độ và vận tốc", tenEn: "Lesson 5. Speed and velocity", mon: "Vật lý", lop: "10", chuong: "Chương II. Động học", soBai: 5, tep: "bai/vl10-b05-toc-do-van-toc.json", ngay: "2026-11-19" },
  { ten: "Bài 6. Thực hành: Đo tốc độ của vật chuyển động", tenEn: "Lesson 6. Practical: measuring the speed of a moving object", mon: "Vật lý", lop: "10", chuong: "Chương II. Động học", soBai: 6, tep: "bai/vl10-b06-thuc-hanh-do-toc-do.json", ngay: "2026-11-19" },
  { ten: "Bài 7. Đồ thị độ dịch chuyển – thời gian", tenEn: "Lesson 7. Displacement–time graphs", mon: "Vật lý", lop: "10", chuong: "Chương II. Động học", soBai: 7, tep: "bai/vl10-b07-do-thi-dich-chuyen.json", ngay: "2026-11-19" },
  { ten: "Bài 8. Chuyển động biến đổi. Gia tốc", tenEn: "Lesson 8. Non-uniform motion. Acceleration", mon: "Vật lý", lop: "10", chuong: "Chương II. Động học", soBai: 8, tep: "bai/vl10-b08-gia-toc.json", ngay: "2026-11-19" },
  { ten: "Bài 9. Chuyển động thẳng biến đổi đều", tenEn: "Lesson 9. Uniformly accelerated linear motion", mon: "Vật lý", lop: "10", chuong: "Chương II. Động học", soBai: 9, tep: "bai/vl10-chuyen-dong-bien-doi-deu.json", ngay: "2026-11-19" },
  { ten: "Bài 10. Sự rơi tự do", tenEn: "Lesson 10. Free fall", mon: "Vật lý", lop: "10", chuong: "Chương II. Động học", soBai: 10, tep: "bai/vl10-b10-roi-tu-do.json", ngay: "2026-11-19" },
  { ten: "Bài 11. Thực hành: Đo gia tốc rơi tự do", tenEn: "Lesson 11. Practical: measuring the acceleration of free fall", mon: "Vật lý", lop: "10", chuong: "Chương II. Động học", soBai: 11, tep: "bai/vl10-b11-thuc-hanh-roi-tu-do.json", ngay: "2026-11-19" },
  { ten: "Bài 12. Chuyển động ném", tenEn: "Lesson 12. Projectile motion", mon: "Vật lý", lop: "10", chuong: "Chương II. Động học", soBai: 12, tep: "bai/vl10-b12-chuyen-dong-nem.json", ngay: "2026-11-19" },
  { ten: "Bài 13. Tổng hợp và phân tích lực. Cân bằng lực", tenEn: "Lesson 13. Composition and resolution of forces. Equilibrium of forces", mon: "Vật lý", lop: "10", chuong: "Chương III. Động lực học", soBai: 13, tep: "bai/vl10-b13-tong-hop-phan-tich-luc.json", ngay: "2026-11-19" },
  { ten: "Bài 14. Định luật 1 Newton", tenEn: "Lesson 14. Newton's first law", mon: "Vật lý", lop: "10", chuong: "Chương III. Động lực học", soBai: 14, tep: "bai/vl10-b14-dinh-luat-1-newton.json", ngay: "2026-11-19" },
  { ten: "Bài 15. Định luật 2 Newton", tenEn: "Lesson 15. Newton's second law", mon: "Vật lý", lop: "10", chuong: "Chương III. Động lực học", soBai: 15, tep: "bai/vl10-b15-dinh-luat-2-newton.json", ngay: "2026-11-19" },
  { ten: "Bài 16. Định luật 3 Newton", tenEn: "Lesson 16. Newton's third law", mon: "Vật lý", lop: "10", chuong: "Chương III. Động lực học", soBai: 16, tep: "bai/vl10-b16-dinh-luat-3-newton.json", ngay: "2026-11-19" },
  { ten: "Bài 17. Trọng lực và lực căng", tenEn: "Lesson 17. Weight and tension", mon: "Vật lý", lop: "10", chuong: "Chương III. Động lực học", soBai: 17, tep: "bai/vl10-b17-trong-luc-luc-cang.json", ngay: "2026-11-19" },
  { ten: "Bài 18. Lực ma sát", tenEn: "Lesson 18. Friction", mon: "Vật lý", lop: "10", chuong: "Chương III. Động lực học", soBai: 18, tep: "bai/vl10-b18-luc-ma-sat.json", ngay: "2026-11-19" },
  { ten: "Bài 19. Lực cản và lực nâng", tenEn: "Lesson 19. Drag and lift forces", mon: "Vật lý", lop: "10", chuong: "Chương III. Động lực học", soBai: 19, tep: "bai/vl10-b19-luc-can-luc-nang.json", ngay: "2026-11-19" },
  { ten: "Bài 20. Một số ví dụ về cách giải các bài toán thuộc phần động lực học", tenEn: "Lesson 20. Worked examples of dynamics problems", mon: "Vật lý", lop: "10", chuong: "Chương III. Động lực học", soBai: 20, tep: "bai/vl10-b20-giai-bai-toan-dong-luc-hoc.json", ngay: "2026-11-19" },
  { ten: "Bài 21. Moment lực. Cân bằng của vật rắn", tenEn: "Lesson 21. Moment of a force. Equilibrium of a rigid body", mon: "Vật lý", lop: "10", chuong: "Chương III. Động lực học", soBai: 21, tep: "bai/vl10-b21-moment-luc.json", ngay: "2026-11-19" },
  { ten: "Bài 22. Thực hành: Tổng hợp lực", tenEn: "Lesson 22. Practical: adding forces", mon: "Vật lý", lop: "10", chuong: "Chương III. Động lực học", soBai: 22, tep: "bai/vl10-b22-thuc-hanh-tong-hop-luc.json", ngay: "2026-11-19" },
  { ten: "Bài 23. Năng lượng. Công cơ học", tenEn: "Lesson 23. Energy. Mechanical work", mon: "Vật lý", lop: "10", chuong: "Chương IV. Năng lượng, công, công suất", soBai: 23, tep: "bai/vl10-b23-nang-luong-cong-co-hoc.json", ngay: "2026-11-19" },
  { ten: "Bài 24. Công suất", tenEn: "Lesson 24. Power", mon: "Vật lý", lop: "10", chuong: "Chương IV. Năng lượng, công, công suất", soBai: 24, tep: "bai/vl10-b24-cong-suat.json", ngay: "2026-11-19" },
  { ten: "Bài 25. Động năng, thế năng", tenEn: "Lesson 25. Kinetic energy, potential energy", mon: "Vật lý", lop: "10", chuong: "Chương IV. Năng lượng, công, công suất", soBai: 25, tep: "bai/vl10-b25-dong-nang-the-nang.json", ngay: "2026-11-19" },
  { ten: "Bài 26. Cơ năng và định luật bảo toàn cơ năng", tenEn: "Lesson 26. Mechanical energy and its conservation", mon: "Vật lý", lop: "10", chuong: "Chương IV. Năng lượng, công, công suất", soBai: 26, tep: "bai/vl10-b26-co-nang-bao-toan.json", ngay: "2026-11-19" },
  { ten: "Bài 27. Hiệu suất", tenEn: "Lesson 27. Efficiency", mon: "Vật lý", lop: "10", chuong: "Chương IV. Năng lượng, công, công suất", soBai: 27, tep: "bai/vl10-b27-hieu-suat.json", ngay: "2026-11-19" },
  { ten: "Bài 28. Động lượng", tenEn: "Lesson 28. Momentum", mon: "Vật lý", lop: "10", chuong: "Chương V. Động lượng", soBai: 28, tep: "bai/vl10-b28-dong-luong.json", ngay: "2026-11-19" },
  { ten: "Bài 29. Định luật bảo toàn động lượng", tenEn: "Lesson 29. Conservation of momentum", mon: "Vật lý", lop: "10", chuong: "Chương V. Động lượng", soBai: 29, tep: "bai/vl10-b29-bao-toan-dong-luong.json", ngay: "2026-11-19" },
  { ten: "Bài 30. Thực hành: Xác định động lượng của vật trước và sau va chạm", tenEn: "Lesson 30. Practical: momentum before and after a collision", mon: "Vật lý", lop: "10", chuong: "Chương V. Động lượng", soBai: 30, tep: "bai/vl10-b30-thuc-hanh-dong-luong.json", ngay: "2026-11-19" },
  { ten: "Bài 31. Động học của chuyển động tròn đều", tenEn: "Lesson 31. Kinematics of uniform circular motion", mon: "Vật lý", lop: "10", chuong: "Chương VI. Chuyển động tròn đều", soBai: 31, tep: "bai/vl10-b31-chuyen-dong-tron-deu.json", ngay: "2026-11-19" },
  { ten: "Bài 32. Lực hướng tâm và gia tốc hướng tâm", tenEn: "Lesson 32. Centripetal force and centripetal acceleration", mon: "Vật lý", lop: "10", chuong: "Chương VI. Chuyển động tròn đều", soBai: 32, tep: "bai/vl10-b32-luc-huong-tam.json", ngay: "2026-11-19" },
  { ten: "Bài 33. Biến dạng của vật rắn", tenEn: "Lesson 33. Deformation of solids", mon: "Vật lý", lop: "10", chuong: "Chương VII. Biến dạng của vật rắn. Áp suất chất lỏng", soBai: 33, tep: "bai/vl10-b33-bien-dang-vat-ran.json", ngay: "2026-11-19" },
  { ten: "Bài 34. Khối lượng riêng. Áp suất chất lỏng", tenEn: "Lesson 34. Density. Liquid pressure", mon: "Vật lý", lop: "10", chuong: "Chương VII. Biến dạng của vật rắn. Áp suất chất lỏng", soBai: 34, tep: "bai/vl10-b34-ap-suat-chat-long.json", ngay: "2026-11-19" },
  // Vật lý 11 – theo SGK Vật lí 11 (Kết nối tri thức)
  { ten: "Bài 1. Dao động điều hoà", tenEn: "Lesson 1. Simple harmonic motion", mon: "Vật lý", lop: "11", chuong: "Chương I. Dao động", soBai: 1, tep: "bai/vl11-dao-dong-dieu-hoa.json", ngay: "2026-11-19" },
  { ten: "Bài 2. Mô tả dao động điều hoà", tenEn: "Lesson 2. Describing simple harmonic motion", mon: "Vật lý", lop: "11", chuong: "Chương I. Dao động", soBai: 2, tep: "bai/vl11-b02-mo-ta-dao-dong.json", ngay: "2026-11-19" },
  { ten: "Bài 3. Vận tốc, gia tốc trong dao động điều hoà", tenEn: "Lesson 3. Velocity and acceleration in simple harmonic motion", mon: "Vật lý", lop: "11", chuong: "Chương I. Dao động", soBai: 3, tep: "bai/vl11-b03-van-toc-gia-toc.json", ngay: "2026-11-19" },
  { ten: "Bài 5. Động năng. Thế năng. Sự chuyển hoá năng lượng trong dao động điều hoà", tenEn: "Lesson 5. Kinetic and potential energy in simple harmonic motion", mon: "Vật lý", lop: "11", chuong: "Chương I. Dao động", soBai: 5, tep: "bai/vl11-b05-nang-luong.json", ngay: "2026-11-19" },
  { ten: "Bài 6. Dao động tắt dần. Dao động cưỡng bức. Hiện tượng cộng hưởng", tenEn: "Lesson 6. Damped oscillation. Forced oscillation. Resonance", mon: "Vật lý", lop: "11", chuong: "Chương I. Dao động", soBai: 6, tep: "bai/vl11-b06-tat-dan-cong-huong.json", ngay: "2026-11-19" },
  { ten: "Bài 8. Mô tả sóng", tenEn: "Lesson 8. Describing waves", mon: "Vật lý", lop: "11", chuong: "Chương II. Sóng", soBai: 8, tep: "bai/vl11-b08-mo-ta-song.json", ngay: "2026-11-19" },
  { ten: "Bài 9. Sóng ngang. Sóng dọc. Sự truyền năng lượng của sóng cơ", tenEn: "Lesson 9. Transverse and longitudinal waves", mon: "Vật lý", lop: "11", chuong: "Chương II. Sóng", soBai: 9, tep: "bai/vl11-b09-song-ngang-song-doc.json", ngay: "2026-11-19" },
  { ten: "Bài 11. Sóng điện từ", tenEn: "Lesson 11. Electromagnetic waves", mon: "Vật lý", lop: "11", chuong: "Chương II. Sóng", soBai: 11, tep: "bai/vl11-b11-song-dien-tu.json", ngay: "2026-11-19" },
  { ten: "Bài 12. Giao thoa sóng", tenEn: "Lesson 12. Wave interference", mon: "Vật lý", lop: "11", chuong: "Chương II. Sóng", soBai: 12, tep: "bai/vl11-b12-giao-thoa-song.json", ngay: "2026-11-19" },
  { ten: "Bài 13. Sóng dừng", tenEn: "Lesson 13. Standing waves", mon: "Vật lý", lop: "11", chuong: "Chương II. Sóng", soBai: 13, tep: "bai/vl11-b13-song-dung.json", ngay: "2026-11-19" },
  { ten: "Bài 16. Lực tương tác giữa các điện tích", tenEn: "Lesson 16. Forces between electric charges", mon: "Vật lý", lop: "11", chuong: "Chương III. Điện trường", soBai: 16, tep: "bai/vl11-b16-luc-tuong-tac-dien-tich.json", ngay: "2026-11-19" },
  { ten: "Bài 17. Khái niệm điện trường", tenEn: "Lesson 17. The electric field", mon: "Vật lý", lop: "11", chuong: "Chương III. Điện trường", soBai: 17, tep: "bai/vl11-b17-dien-truong.json", ngay: "2026-11-19" },
  { ten: "Bài 18. Điện trường đều", tenEn: "Lesson 18. Uniform electric fields", mon: "Vật lý", lop: "11", chuong: "Chương III. Điện trường", soBai: 18, tep: "bai/vl11-b18-dien-truong-deu.json", ngay: "2026-11-19" },
  { ten: "Bài 19. Thế năng điện", tenEn: "Lesson 19. Electric potential energy", mon: "Vật lý", lop: "11", chuong: "Chương III. Điện trường", soBai: 19, tep: "bai/vl11-b19-the-nang-dien.json", ngay: "2026-11-19" },
  { ten: "Bài 20. Điện thế", tenEn: "Lesson 20. Electric potential", mon: "Vật lý", lop: "11", chuong: "Chương III. Điện trường", soBai: 20, tep: "bai/vl11-b20-dien-the.json", ngay: "2026-11-19" },
  { ten: "Bài 21. Tụ điện", tenEn: "Lesson 21. Capacitors", mon: "Vật lý", lop: "11", chuong: "Chương III. Điện trường", soBai: 21, tep: "bai/vl11-b21-tu-dien.json", ngay: "2026-11-19" },
  { ten: "Bài 22. Cường độ dòng điện", tenEn: "Lesson 22. Electric current", mon: "Vật lý", lop: "11", chuong: "Chương IV. Dòng điện. Mạch điện", soBai: 22, tep: "bai/vl11-b22-cuong-do-dong-dien.json", ngay: "2026-11-19" },
  { ten: "Bài 23. Điện trở. Định luật Ohm", tenEn: "Lesson 23. Resistance. Ohm's law", mon: "Vật lý", lop: "11", chuong: "Chương IV. Dòng điện. Mạch điện", soBai: 23, tep: "bai/vl11-b23-dien-tro-dinh-luat-ohm.json", ngay: "2026-11-19" },
  { ten: "Bài 24. Nguồn điện", tenEn: "Lesson 24. Sources of electromotive force", mon: "Vật lý", lop: "11", chuong: "Chương IV. Dòng điện. Mạch điện", soBai: 24, tep: "bai/vl11-b24-nguon-dien.json", ngay: "2026-11-19" },
  { ten: "Bài 25. Năng lượng và công suất điện", tenEn: "Lesson 25. Electrical energy and power", mon: "Vật lý", lop: "11", chuong: "Chương IV. Dòng điện. Mạch điện", soBai: 25, tep: "bai/vl11-b25-nang-luong-cong-suat-dien.json", ngay: "2026-11-19" },
  // Vật lý 12 – theo SGK Vật lí 12 (Kết nối tri thức)
  { ten: "Bài 1. Cấu trúc của chất. Sự chuyển thể", tenEn: "Lesson 1. The structure of matter. Changes of state", mon: "Vật lý", lop: "12", chuong: "Chương I. Vật lí nhiệt", soBai: 1, tep: "bai/vl12-b01-cau-truc-chat.json", ngay: "2026-11-19" },
  { ten: "Bài 2. Nội năng. Định luật I của nhiệt động lực học", tenEn: "Lesson 2. Internal energy. The first law of thermodynamics", mon: "Vật lý", lop: "12", chuong: "Chương I. Vật lí nhiệt", soBai: 2, tep: "bai/vl12-b02-noi-nang.json", ngay: "2026-11-19" },
  { ten: "Bài 3. Nhiệt độ. Thang nhiệt độ – nhiệt kế", tenEn: "Lesson 3. Temperature. Temperature scales – thermometers", mon: "Vật lý", lop: "12", chuong: "Chương I. Vật lí nhiệt", soBai: 3, tep: "bai/vl12-b03-nhiet-do.json", ngay: "2026-11-19" },
  { ten: "Bài 4. Nhiệt dung riêng", tenEn: "Lesson 4. Specific heat capacity", mon: "Vật lý", lop: "12", chuong: "Chương I. Vật lí nhiệt", soBai: 4, tep: "bai/vl12-b04-nhiet-dung-rieng.json", ngay: "2026-11-19" },
  { ten: "Bài 5. Nhiệt nóng chảy riêng", tenEn: "Lesson 5. Specific latent heat of fusion", mon: "Vật lý", lop: "12", chuong: "Chương I. Vật lí nhiệt", soBai: 5, tep: "bai/vl12-b05-nhiet-nong-chay-rieng.json", ngay: "2026-11-19" },
  { ten: "Bài 6. Nhiệt hoá hơi riêng", tenEn: "Lesson 6. Specific latent heat of vaporization", mon: "Vật lý", lop: "12", chuong: "Chương I. Vật lí nhiệt", soBai: 6, tep: "bai/vl12-b06-nhiet-hoa-hoi-rieng.json", ngay: "2026-11-19" },
  { ten: "Bài 8. Mô hình động học phân tử chất khí", tenEn: "Lesson 8. The kinetic molecular model of gases", mon: "Vật lý", lop: "12", chuong: "Chương II. Khí lí tưởng", soBai: 8, tep: "bai/vl12-b08-mo-hinh-khi.json", ngay: "2026-11-19" },
  { ten: "Bài 9. Định luật Boyle", tenEn: "Lesson 9. Boyle's law", mon: "Vật lý", lop: "12", chuong: "Chương II. Khí lí tưởng", soBai: 9, tep: "bai/vl12-b09-dinh-luat-boyle.json", ngay: "2026-11-19" },
  { ten: "Bài 10. Định luật Charles", tenEn: "Lesson 10. Charles's law", mon: "Vật lý", lop: "12", chuong: "Chương II. Khí lí tưởng", soBai: 10, tep: "bai/vl12-b10-dinh-luat-charles.json", ngay: "2026-11-19" },
  { ten: "Bài 11. Phương trình trạng thái của khí lí tưởng", tenEn: "Lesson 11. The equation of state of an ideal gas", mon: "Vật lý", lop: "12", chuong: "Chương II. Khí lí tưởng", soBai: 11, tep: "bai/vl12-khi-li-tuong.json", ngay: "2026-11-19" },
  { ten: "Bài 12. Áp suất khí theo mô hình động học phân tử. Quan hệ giữa động năng phân tử và nhiệt độ", tenEn: "Lesson 12. Gas pressure and molecular kinetic energy", mon: "Vật lý", lop: "12", chuong: "Chương II. Khí lí tưởng", soBai: 12, tep: "bai/vl12-b12-ap-suat-dong-nang.json", ngay: "2026-11-19" },
  { ten: "Bài 14. Từ trường", tenEn: "Lesson 14. Magnetic fields", mon: "Vật lý", lop: "12", chuong: "Chương III. Từ trường", soBai: 14, tep: "bai/vl12-b14-tu-truong.json", ngay: "2026-11-19" },
  { ten: "Bài 15. Lực từ tác dụng lên dây dẫn mang dòng điện. Cảm ứng từ", tenEn: "Lesson 15. Magnetic force on a current-carrying wire. Magnetic flux density", mon: "Vật lý", lop: "12", chuong: "Chương III. Từ trường", soBai: 15, tep: "bai/vl12-b15-luc-tu-cam-ung-tu.json", ngay: "2026-11-19" },
  { ten: "Bài 16. Từ thông. Hiện tượng cảm ứng điện từ", tenEn: "Lesson 16. Magnetic flux. Electromagnetic induction", mon: "Vật lý", lop: "12", chuong: "Chương III. Từ trường", soBai: 16, tep: "bai/vl12-b16-cam-ung-dien-tu.json", ngay: "2026-11-19" },
  { ten: "Bài 17. Máy phát điện xoay chiều", tenEn: "Lesson 17. Alternating current generators", mon: "Vật lý", lop: "12", chuong: "Chương III. Từ trường", soBai: 17, tep: "bai/vl12-b17-may-phat-dien-xoay-chieu.json", ngay: "2026-11-19" },
  { ten: "Bài 18. Ứng dụng hiện tượng cảm ứng điện từ", tenEn: "Lesson 18. Applications of electromagnetic induction", mon: "Vật lý", lop: "12", chuong: "Chương III. Từ trường", soBai: 18, tep: "bai/vl12-b18-ung-dung-cam-ung-dien-tu.json", ngay: "2026-11-19" },
  { ten: "Bài 19. Điện từ trường. Mô hình sóng điện từ", tenEn: "Lesson 19. The electromagnetic field. The electromagnetic wave model", mon: "Vật lý", lop: "12", chuong: "Chương III. Từ trường", soBai: 19, tep: "bai/vl12-b19-dien-tu-truong.json", ngay: "2026-11-19" },
  { ten: "Bài 21. Cấu trúc hạt nhân", tenEn: "Lesson 21. The structure of the nucleus", mon: "Vật lý", lop: "12", chuong: "Chương IV. Vật lí hạt nhân", soBai: 21, tep: "bai/vl12-b21-cau-truc-hat-nhan.json", ngay: "2026-11-19" },
  { ten: "Bài 22. Phản ứng hạt nhân và năng lượng liên kết", tenEn: "Lesson 22. Nuclear reactions and binding energy", mon: "Vật lý", lop: "12", chuong: "Chương IV. Vật lí hạt nhân", soBai: 22, tep: "bai/vl12-b22-phan-ung-hat-nhan.json", ngay: "2026-11-19" },
  { ten: "Bài 23. Hiện tượng phóng xạ", tenEn: "Lesson 23. Radioactivity", mon: "Vật lý", lop: "12", chuong: "Chương IV. Vật lí hạt nhân", soBai: 23, tep: "bai/vl12-b23-phong-xa.json", ngay: "2026-11-19" },
  { ten: "Bài 24. Công nghiệp hạt nhân", tenEn: "Lesson 24. The nuclear industry", mon: "Vật lý", lop: "12", chuong: "Chương IV. Vật lí hạt nhân", soBai: 24, tep: "bai/vl12-b24-cong-nghiep-hat-nhan.json", ngay: "2026-11-19" },
  { ten: "Câu lệnh rẽ nhánh if trong Python", tenEn: "The if statement in Python", mon: "Tin học", lop: "10", soBai: 2, tep: "bai/tin10-cau-lenh-if.json", ngay: "2026-11-19" },
  { ten: "Thuật toán tìm kiếm nhị phân", tenEn: "The binary search algorithm", mon: "Tin học", lop: "11", tep: "bai/tin11-tim-kiem-nhi-phan.json", ngay: "2026-11-19" },
  { ten: "Biến và kiểu dữ liệu trong Python", tenEn: "Variables and data types in Python", mon: "Tin học", lop: "10", soBai: 1, tep: "bai/mau-bien-va-kieu-du-lieu.json", ngay: "2026-11-19" }
];

/* ---------- THÍ NGHIỆM ẢO (mô phỏng PhET tiếng Việt, chạy ngay trên trang) ----------
   phet: tên mô phỏng trong đường link PhET, ví dụ link
   https://phet.colorado.edu/vi/simulations/pendulum-lab  ->  phet: "pendulum-lab"
   lop: "10", "11", "12" hoặc "HSG" (kèm cap: "THCS" / "THPT"). */
const THI_NGHIEM_AO = [
  // ▼▼▼ DÁN THÍ NGHIỆM MỚI NGAY DƯỚI DÒNG NÀY ▼▼▼

  // ----- Vật lý 10 -----
  { ten: "Cộng vectơ: độ dịch chuyển, tổng hợp lực", phet: "vector-addition", lop: "10", chuDe: "Chương II. Động học · Bài 4. Độ dịch chuyển và quãng đường đi được", moTa: "Cộng hai vectơ độ dịch chuyển (hoặc hai lực); xem độ lớn, hướng và các thành phần của vectơ tổng." },
  { ten: "Chuyển động ném", phet: "projectile-motion", lop: "10", chuDe: "Chương II. Động học · Bài 12. Chuyển động ném", moTa: "Thay đổi góc ném, vận tốc đầu, độ cao; quan sát quỹ đạo, tầm xa và tầm cao." },
  { ten: "Lực và chuyển động", phet: "forces-and-motion-basics", lop: "10", chuDe: "Chương III. Động lực học · Bài 15. Định luật 2 Newton", moTa: "Hợp lực, lực ma sát và định luật 2 Newton." },
  { ten: "Moment lực và cân bằng", phet: "balancing-act", lop: "10", chuDe: "Chương III. Động lực học · Bài 21. Moment lực. Cân bằng của vật rắn", moTa: "Đặt vật lên đòn cân để tìm điều kiện cân bằng của vật rắn." },
  { ten: "Bảo toàn cơ năng (trượt ván)", phet: "energy-skate-park-basics", lop: "10", chuDe: "Chương IV. Năng lượng, công, công suất · Bài 26. Cơ năng và định luật bảo toàn cơ năng", moTa: "Quan sát động năng, thế năng và cơ năng khi người trượt ván chuyển động." },
  { ten: "Va chạm và động lượng", phet: "collision-lab", lop: "10", chuDe: "Chương V. Động lượng · Bài 29. Định luật bảo toàn động lượng", moTa: "Va chạm đàn hồi, va chạm mềm; kiểm chứng bảo toàn động lượng." },
  { ten: "Lực hấp dẫn và quỹ đạo", phet: "gravity-and-orbits", lop: "10", chuDe: "Chương VI. Chuyển động tròn đều · Bài 32. Lực hướng tâm và gia tốc hướng tâm", moTa: "Chuyển động của Trái Đất, Mặt Trăng; lực hướng tâm." },
  { ten: "Lực đàn hồi của lò xo", phet: "masses-and-springs", lop: "10", chuDe: "Chương VII. Biến dạng của vật rắn. Áp suất chất lỏng · Bài 33. Biến dạng của vật rắn", moTa: "Treo vật vào lò xo, đo độ giãn để kiểm chứng định luật Hooke." },
  { ten: "Áp suất chất lỏng", phet: "under-pressure", lop: "10", chuDe: "Chương VII. Biến dạng của vật rắn. Áp suất chất lỏng · Bài 34. Khối lượng riêng. Áp suất chất lỏng", moTa: "Áp suất phụ thuộc độ sâu và khối lượng riêng chất lỏng." },

  // ----- Vật lý 11 -----
  { ten: "Con lắc đơn", phet: "pendulum-lab", lop: "11", chuDe: "Chương I. Dao động · Bài 1. Dao động điều hoà", moTa: "Chu kì con lắc phụ thuộc chiều dài, gia tốc trọng trường." },
  { ten: "Con lắc lò xo", phet: "masses-and-springs", lop: "11", chuDe: "Chương I. Dao động · Bài 5. Động năng. Thế năng. Sự chuyển hoá năng lượng trong dao động điều hoà", moTa: "Dao động của vật nặng gắn lò xo; động năng, thế năng." },
  { ten: "Sóng cơ", phet: "waves-intro", lop: "11", chuDe: "Chương II. Sóng · Bài 8. Mô tả sóng", moTa: "Sóng nước, sóng âm, sóng ánh sáng: biên độ, tần số, bước sóng." },
  { ten: "Sóng trên sợi dây, sóng dừng", phet: "wave-on-a-string", lop: "11", chuDe: "Chương II. Sóng · Bài 13. Sóng dừng", moTa: "Tạo sóng trên dây, đầu cố định để quan sát sóng dừng." },
  { ten: "Giao thoa sóng", phet: "wave-interference", lop: "11", chuDe: "Chương II. Sóng · Bài 12. Giao thoa sóng", moTa: "Giao thoa sóng nước và giao thoa ánh sáng qua hai khe." },
  { ten: "Điện tích và điện trường", phet: "charges-and-fields", lop: "11", chuDe: "Chương III. Điện trường · Bài 17. Khái niệm điện trường", moTa: "Đặt điện tích, quan sát đường sức và cường độ điện trường." },
  { ten: "Tụ điện", phet: "capacitor-lab-basics", lop: "11", chuDe: "Chương III. Điện trường · Bài 21. Tụ điện", moTa: "Điện dung phụ thuộc diện tích bản, khoảng cách giữa hai bản." },
  { ten: "Lắp mạch điện một chiều", phet: "circuit-construction-kit-dc", lop: "11", chuDe: "Chương IV. Dòng điện. Mạch điện · Bài 22. Cường độ dòng điện", moTa: "Lắp mạch nối tiếp, song song; đo cường độ dòng điện, hiệu điện thế." },
  { ten: "Định luật Ohm", phet: "ohms-law", lop: "11", chuDe: "Chương IV. Dòng điện. Mạch điện · Bài 23. Điện trở. Định luật Ohm", moTa: "Quan hệ giữa U, I và R." },
  { ten: "Điện trở của dây dẫn", phet: "resistance-in-a-wire", lop: "11", chuDe: "Chương IV. Dòng điện. Mạch điện · Bài 23. Điện trở. Định luật Ohm", moTa: "Điện trở phụ thuộc chiều dài, tiết diện và điện trở suất." },

  // ----- Vật lý 12 -----
  { ten: "Các thể của chất", phet: "states-of-matter-basics", lop: "12", chuDe: "Chương I. Vật lí nhiệt · Bài 1. Cấu trúc của chất. Sự chuyển thể", moTa: "Chuyển động phân tử ở thể rắn, lỏng, khí; sự chuyển thể." },
  { ten: "Năng lượng và sự truyền nhiệt", phet: "energy-forms-and-changes", lop: "12", chuDe: "Chương I. Vật lí nhiệt · Bài 4. Nhiệt dung riêng", moTa: "Nhiệt lượng, cân bằng nhiệt và các dạng năng lượng." },
  { ten: "Khí lí tưởng", phet: "gas-properties", lop: "12", chuDe: "Chương II. Khí lí tưởng · Bài 11. Phương trình trạng thái của khí lí tưởng", moTa: "Quan hệ giữa áp suất, thể tích và nhiệt độ của khối khí." },
  { ten: "Định luật chất khí", phet: "gases-intro", lop: "12", chuDe: "Chương II. Khí lí tưởng · Bài 9. Định luật Boyle", moTa: "Kiểm chứng các định luật Boyle, Charles." },
  { ten: "Nam châm và nam châm điện", phet: "magnets-and-electromagnets", lop: "12", chuDe: "Chương III. Từ trường · Bài 14. Từ trường", moTa: "Từ trường của nam châm, của dòng điện trong ống dây." },
  { ten: "Cảm ứng điện từ", phet: "faradays-law", lop: "12", chuDe: "Chương III. Từ trường · Bài 16. Từ thông. Hiện tượng cảm ứng điện từ", moTa: "Di chuyển nam châm qua cuộn dây để tạo dòng điện cảm ứng." },
  { ten: "Mạch điện xoay chiều", phet: "circuit-construction-kit-ac", lop: "12", chuDe: "Chương III. Từ trường · Bài 17. Máy phát điện xoay chiều", moTa: "Lắp mạch có nguồn xoay chiều, cuộn cảm, tụ điện." },
  { ten: "Cấu tạo nguyên tử", phet: "build-an-atom", lop: "12", chuDe: "Chương IV. Vật lí hạt nhân · Bài 21. Cấu trúc hạt nhân", moTa: "Ghép proton, neutron, electron; số khối và điện tích." },
  { ten: "Đồng vị và khối lượng nguyên tử", phet: "isotopes-and-atomic-mass", lop: "12", chuDe: "Chương IV. Vật lí hạt nhân · Bài 21. Cấu trúc hạt nhân", moTa: "Hạt nhân đồng vị, độ bền của hạt nhân." },

  // ----- HSG THCS -----
  { ten: "Khối lượng riêng", phet: "density", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 2", moTa: "Đo khối lượng, thể tích để tìm khối lượng riêng của vật." },
  { ten: "Lực đẩy Ác-si-mét", phet: "buoyancy", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 2", moTa: "Vật nổi, vật chìm; độ lớn lực đẩy Ác-si-mét." },
  { ten: "Áp suất chất lỏng, bình thông nhau", phet: "under-pressure", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 2", moTa: "Áp suất phụ thuộc độ sâu; bình có hình dạng khác nhau." },
  { ten: "Cơ năng và bảo toàn cơ năng", phet: "energy-skate-park-basics", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 3", moTa: "Động năng, thế năng, cơ năng; ảnh hưởng của ma sát." },
  { ten: "Mạch điện nối tiếp, song song", phet: "circuit-construction-kit-dc", lop: "HSG", cap: "THCS", chuDe: "Chuyên đề 4", moTa: "Lắp mạch, mắc vôn kế, ampe kế; chập mạch." }
];

/* ---------- HỌC THÊM BẰNG TIẾNG ANH (hiện ở cuối trang "Học song ngữ") ---------- */
const HOC_TIENG_ANH = [
  { ten: "Khan Academy - Physics", mon: "Vật lý", moTa: "Video và bài luyện tập Vật lý bằng tiếng Anh, có phụ đề.", link: "https://www.khanacademy.org/science/physics" },
  { ten: "The Physics Classroom", mon: "Vật lý", moTa: "Bài giảng dễ hiểu, hình động và bài tập tương tác.", link: "https://www.physicsclassroom.com/" },
  { ten: "OpenStax - College Physics", mon: "Vật lý", moTa: "Sách giáo khoa Vật lý tiếng Anh miễn phí, đọc trực tuyến.", link: "https://openstax.org/details/books/college-physics-2e" },
  { ten: "PhET Simulations (English)", mon: "Vật lý", moTa: "Thí nghiệm ảo bản tiếng Anh, để luyện thuật ngữ.", link: "https://phet.colorado.edu/en/simulations/browse" },
  { ten: "Harvard CS50", mon: "Tin học", moTa: "Khóa nhập môn Khoa học máy tính nổi tiếng của Đại học Harvard.", link: "https://cs50.harvard.edu/x/" },
  { ten: "W3Schools - Python", mon: "Tin học", moTa: "Học Python từng bước, có ví dụ chạy thử ngay.", link: "https://www.w3schools.com/python/" },
  { ten: "Khan Academy - Computing", mon: "Tin học", moTa: "Lập trình, thuật toán, Internet và khoa học dữ liệu.", link: "https://www.khanacademy.org/computing" },
  { ten: "The Python Tutorial", mon: "Tin học", moTa: "Tài liệu hướng dẫn chính thức của Python.", link: "https://docs.python.org/3/tutorial/" }
];

/* ---------- TỪ ĐIỂN THUẬT NGỮ VIỆT - ANH (trang "Học song ngữ") ----------
   Mỗi dòng một thuật ngữ: en (tiếng Anh), ipa (phiên âm), vi (nghĩa tiếng Việt),
   mon ("Vật lý" hoặc "Tin học"), lop ("10", "11", "12"), ghiChu (có thể để "", được viết công thức $...$).
   Học sinh bấm nút loa để nghe phát âm. */
const TU_VUNG = [
  // ▼▼▼ DÁN THUẬT NGỮ MỚI NGAY DƯỚI DÒNG NÀY ▼▼▼

  // ----- Vật lý 10 -----
  { en: "displacement", ipa: "/dɪsˈpleɪsmənt/", vi: "độ dịch chuyển", mon: "Vật lý", lop: "10", ghiChu: "Đại lượng vectơ, cho biết hướng và khoảng cách thay đổi vị trí." },
  { en: "speed", ipa: "/spiːd/", vi: "tốc độ", mon: "Vật lý", lop: "10", ghiChu: "$v = \\dfrac{s}{t}$" },
  { en: "velocity", ipa: "/vəˈlɒsəti/", vi: "vận tốc", mon: "Vật lý", lop: "10", ghiChu: "$\\vec{v} = \\dfrac{\\vec{d}}{t}$" },
  { en: "acceleration", ipa: "/əkˌseləˈreɪʃn/", vi: "gia tốc", mon: "Vật lý", lop: "10", ghiChu: "$a = \\dfrac{\\Delta v}{\\Delta t}$" },
  { en: "free fall", ipa: "/ˌfriː ˈfɔːl/", vi: "sự rơi tự do", mon: "Vật lý", lop: "10", ghiChu: "Chỉ chịu tác dụng của trọng lực, $a = g$." },
  { en: "projectile motion", ipa: "/prəˈdʒektaɪl ˈməʊʃn/", vi: "chuyển động ném", mon: "Vật lý", lop: "10", ghiChu: "" },
  { en: "force", ipa: "/fɔːs/", vi: "lực", mon: "Vật lý", lop: "10", ghiChu: "Đơn vị: newton (N)." },
  { en: "mass", ipa: "/mæs/", vi: "khối lượng", mon: "Vật lý", lop: "10", ghiChu: "Đơn vị: kilôgam (kg)." },
  { en: "weight", ipa: "/weɪt/", vi: "trọng lượng", mon: "Vật lý", lop: "10", ghiChu: "$P = mg$" },
  { en: "friction", ipa: "/ˈfrɪkʃn/", vi: "lực ma sát", mon: "Vật lý", lop: "10", ghiChu: "$F_{ms} = \\mu N$" },
  { en: "torque", ipa: "/tɔːk/", vi: "mômen lực", mon: "Vật lý", lop: "10", ghiChu: "$M = F \\cdot d$" },
  { en: "work", ipa: "/wɜːk/", vi: "công", mon: "Vật lý", lop: "10", ghiChu: "$A = F s \\cos\\alpha$" },
  { en: "power", ipa: "/ˈpaʊə(r)/", vi: "công suất", mon: "Vật lý", lop: "10", ghiChu: "$P = \\dfrac{A}{t}$" },
  { en: "efficiency", ipa: "/ɪˈfɪʃnsi/", vi: "hiệu suất", mon: "Vật lý", lop: "10", ghiChu: "" },
  { en: "kinetic energy", ipa: "/kɪˈnetɪk ˈenədʒi/", vi: "động năng", mon: "Vật lý", lop: "10", ghiChu: "$W_{\\text{đ}} =\\dfrac{1}{2}mv^2$" },
  { en: "potential energy", ipa: "/pəˈtenʃl ˈenədʒi/", vi: "thế năng", mon: "Vật lý", lop: "10", ghiChu: "$W_t = mgh$" },
  { en: "momentum", ipa: "/məˈmentəm/", vi: "động lượng", mon: "Vật lý", lop: "10", ghiChu: "$\\vec{p} = m\\vec{v}$" },
  { en: "centripetal acceleration", ipa: "/ˌsentrɪˈpiːtl əkˌseləˈreɪʃn/", vi: "gia tốc hướng tâm", mon: "Vật lý", lop: "10", ghiChu: "$a_{ht} = \\dfrac{v^2}{r} = \\omega^2 r$" },
  { en: "pressure", ipa: "/ˈpreʃə(r)/", vi: "áp suất", mon: "Vật lý", lop: "10", ghiChu: "$p = \\dfrac{F}{S}$" },
  // Vật lý 10 – Chương II. Động học (SGK mới)
  { en: "distance travelled", ipa: "/ˈdɪstəns ˈtrævld/", vi: "quãng đường đi được", mon: "Vật lý", lop: "10", ghiChu: "Luôn dương, không có hướng." },
  { en: "frame of reference", ipa: "/freɪm əv ˈrefrəns/", vi: "hệ quy chiếu", mon: "Vật lý", lop: "10", ghiChu: "" },
  { en: "coordinate system", ipa: "/kəʊˈɔːdɪnət ˈsɪstəm/", vi: "hệ tọa độ", mon: "Vật lý", lop: "10", ghiChu: "" },
  { en: "average speed", ipa: "/ˈævərɪdʒ spiːd/", vi: "tốc độ trung bình", mon: "Vật lý", lop: "10", ghiChu: "$v_{tb} = \\dfrac{s}{t}$" },
  { en: "instantaneous speed", ipa: "/ˌɪnstənˈteɪniəs spiːd/", vi: "tốc độ tức thời", mon: "Vật lý", lop: "10", ghiChu: "Số chỉ của tốc kế." },
  { en: "relative velocity", ipa: "/ˈrelətɪv vəˈlɒsəti/", vi: "vận tốc tương đối", mon: "Vật lý", lop: "10", ghiChu: "$\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}$" },
  { en: "uniform motion", ipa: "/ˈjuːnɪfɔːm ˈməʊʃn/", vi: "chuyển động đều", mon: "Vật lý", lop: "10", ghiChu: "Vận tốc không đổi: $d = vt$." },
  { en: "gradient", ipa: "/ˈɡreɪdiənt/", vi: "độ dốc (của đồ thị)", mon: "Vật lý", lop: "10", ghiChu: "Độ dốc đồ thị $d$–$t$ là vận tốc." },
  { en: "displacement–time graph", ipa: "/dɪsˈpleɪsmənt taɪm ɡrɑːf/", vi: "đồ thị độ dịch chuyển – thời gian", mon: "Vật lý", lop: "10", ghiChu: "" },
  { en: "velocity–time graph", ipa: "/vəˈlɒsəti taɪm ɡrɑːf/", vi: "đồ thị vận tốc – thời gian", mon: "Vật lý", lop: "10", ghiChu: "Độ dốc = gia tốc; diện tích = độ dịch chuyển." },
  { en: "uniformly accelerated motion", ipa: "/ˈjuːnɪfɔːmli əkˈseləreɪtɪd ˈməʊʃn/", vi: "chuyển động biến đổi đều", mon: "Vật lý", lop: "10", ghiChu: "$v = v_0 + at$" },
  { en: "deceleration", ipa: "/ˌdiːseləˈreɪʃn/", vi: "sự giảm tốc (chậm dần)", mon: "Vật lý", lop: "10", ghiChu: "" },

  // ----- Vật lý 11 -----
  { en: "oscillation", ipa: "/ˌɒsɪˈleɪʃn/", vi: "dao động", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "amplitude", ipa: "/ˈæmplɪtjuːd/", vi: "biên độ", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "period", ipa: "/ˈpɪəriəd/", vi: "chu kì", mon: "Vật lý", lop: "11", ghiChu: "$T = \\dfrac{2\\pi}{\\omega}$" },
  { en: "frequency", ipa: "/ˈfriːkwənsi/", vi: "tần số", mon: "Vật lý", lop: "11", ghiChu: "$f = \\dfrac{1}{T}$" },
  // Vật lý 11 – Chương I. Dao động (SGK mới)
  { en: "simple harmonic motion", ipa: "/ˈsɪmpl hɑːˈmɒnɪk ˈməʊʃn/", vi: "dao động điều hoà", mon: "Vật lý", lop: "11", ghiChu: "$x = A\\cos(\\omega t + \\varphi)$" },
  { en: "periodic oscillation", ipa: "/ˌpɪəriˈɒdɪk ˌɒsɪˈleɪʃn/", vi: "dao động tuần hoàn", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "equilibrium position", ipa: "/ˌiːkwɪˈlɪbriəm pəˈzɪʃn/", vi: "vị trí cân bằng", mon: "Vật lý", lop: "11", ghiChu: "$x = 0$" },
  { en: "extreme position", ipa: "/ɪkˈstriːm pəˈzɪʃn/", vi: "vị trí biên", mon: "Vật lý", lop: "11", ghiChu: "$x = \\pm A$" },
  { en: "angular frequency", ipa: "/ˈæŋɡjələ ˈfriːkwənsi/", vi: "tần số góc", mon: "Vật lý", lop: "11", ghiChu: "$\\omega = 2\\pi f$" },
  { en: "initial phase", ipa: "/ɪˈnɪʃl feɪz/", vi: "pha ban đầu", mon: "Vật lý", lop: "11", ghiChu: "$\\varphi$" },
  { en: "phase difference", ipa: "/feɪz ˈdɪfrəns/", vi: "độ lệch pha", mon: "Vật lý", lop: "11", ghiChu: "$\\Delta\\varphi = \\varphi_2 - \\varphi_1$" },
  { en: "mechanical energy", ipa: "/məˈkænɪkl ˈenədʒi/", vi: "cơ năng", mon: "Vật lý", lop: "11", ghiChu: "$W = \\dfrac{1}{2}m\\omega^2A^2$" },
  { en: "damped oscillation", ipa: "/dæmpt ˌɒsɪˈleɪʃn/", vi: "dao động tắt dần", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "forced oscillation", ipa: "/fɔːst ˌɒsɪˈleɪʃn/", vi: "dao động cưỡng bức", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "resonance", ipa: "/ˈrezənəns/", vi: "cộng hưởng", mon: "Vật lý", lop: "11", ghiChu: "$f = f_0$" },
  { en: "natural frequency", ipa: "/ˈnætʃrəl ˈfriːkwənsi/", vi: "tần số riêng", mon: "Vật lý", lop: "11", ghiChu: "$f_0$" },
  // Vật lý 11 – Chương II, III, IV (SGK mới)
  { en: "mechanical wave", ipa: "/məˈkænɪkl weɪv/", vi: "sóng cơ", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "wave speed", ipa: "/weɪv spiːd/", vi: "tốc độ truyền sóng", mon: "Vật lý", lop: "11", ghiChu: "$v = \\lambda f$" },
  { en: "transverse wave", ipa: "/ˈtrænzvɜːs weɪv/", vi: "sóng ngang", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "longitudinal wave", ipa: "/ˌlɒŋɡɪˈtjuːdɪnl weɪv/", vi: "sóng dọc", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "electromagnetic wave", ipa: "/ɪˌlektrəʊmæɡˈnetɪk weɪv/", vi: "sóng điện từ", mon: "Vật lý", lop: "11", ghiChu: "$c = 3 \\cdot 10^8$ m/s" },
  { en: "coherent sources", ipa: "/kəʊˈhɪərənt ˈsɔːsɪz/", vi: "nguồn kết hợp", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "fringe spacing", ipa: "/frɪndʒ ˈspeɪsɪŋ/", vi: "khoảng vân", mon: "Vật lý", lop: "11", ghiChu: "$i = \\dfrac{\\lambda D}{a}$" },
  { en: "node", ipa: "/nəʊd/", vi: "nút (sóng dừng)", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "antinode", ipa: "/ˈæntinəʊd/", vi: "bụng (sóng dừng)", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "electric charge", ipa: "/ɪˈlektrɪk tʃɑːdʒ/", vi: "điện tích", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "Coulomb's law", ipa: "/ˈkuːlɒmz lɔː/", vi: "định luật Coulomb", mon: "Vật lý", lop: "11", ghiChu: "$F = k\\dfrac{|q_1 q_2|}{\\varepsilon r^2}$" },
  { en: "dielectric constant", ipa: "/ˌdaɪɪˈlektrɪk ˈkɒnstənt/", vi: "hằng số điện môi", mon: "Vật lý", lop: "11", ghiChu: "$\\varepsilon$" },
  { en: "field line", ipa: "/fiːld laɪn/", vi: "đường sức điện", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "electric potential", ipa: "/ɪˈlektrɪk pəˈtenʃl/", vi: "điện thế", mon: "Vật lý", lop: "11", ghiChu: "$V = \\dfrac{W}{q}$" },
  { en: "capacitance", ipa: "/kəˈpæsɪtəns/", vi: "điện dung", mon: "Vật lý", lop: "11", ghiChu: "$C = \\dfrac{Q}{U}$" },
  { en: "resistivity", ipa: "/ˌriːzɪˈstɪvəti/", vi: "điện trở suất", mon: "Vật lý", lop: "11", ghiChu: "$R = \\rho\\dfrac{l}{S}$" },
  { en: "electromotive force", ipa: "/ɪˌlektrəʊˈməʊtɪv fɔːs/", vi: "suất điện động", mon: "Vật lý", lop: "11", ghiChu: "$E = \\dfrac{A}{q}$" },
  { en: "internal resistance", ipa: "/ɪnˈtɜːnl rɪˈzɪstəns/", vi: "điện trở trong", mon: "Vật lý", lop: "11", ghiChu: "$I = \\dfrac{E}{R + r}$" },
  { en: "short circuit", ipa: "/ʃɔːt ˈsɜːkɪt/", vi: "đoản mạch", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "kilowatt-hour", ipa: "/ˈkɪləwɒt ˈaʊə(r)/", vi: "kilôoát giờ (kWh)", mon: "Vật lý", lop: "11", ghiChu: "$1 \\text{ kWh} = 3{,}6 \\cdot 10^6$ J" },
  { en: "wavelength", ipa: "/ˈweɪvleŋθ/", vi: "bước sóng", mon: "Vật lý", lop: "11", ghiChu: "$\\lambda = vT$" },
  { en: "interference", ipa: "/ˌɪntəˈfɪərəns/", vi: "giao thoa", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "standing wave", ipa: "/ˈstændɪŋ weɪv/", vi: "sóng dừng", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "electric field", ipa: "/ɪˈlektrɪk fiːld/", vi: "điện trường", mon: "Vật lý", lop: "11", ghiChu: "$E = \\dfrac{F}{q}$" },
  { en: "capacitor", ipa: "/kəˈpæsɪtə(r)/", vi: "tụ điện", mon: "Vật lý", lop: "11", ghiChu: "$C = \\dfrac{Q}{U}$" },
  { en: "electric current", ipa: "/ɪˈlektrɪk ˈkʌrənt/", vi: "dòng điện, cường độ dòng điện", mon: "Vật lý", lop: "11", ghiChu: "$I = \\dfrac{\\Delta q}{\\Delta t}$" },
  { en: "voltage", ipa: "/ˈvəʊltɪdʒ/", vi: "hiệu điện thế (điện áp)", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "resistance", ipa: "/rɪˈzɪstəns/", vi: "điện trở", mon: "Vật lý", lop: "11", ghiChu: "$R = \\dfrac{U}{I}$" },

  // ----- Vật lý 12 -----
  { en: "internal energy", ipa: "/ɪnˈtɜːnl ˈenədʒi/", vi: "nội năng", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "specific heat capacity", ipa: "/spəˈsɪfɪk hiːt kəˈpæsəti/", vi: "nhiệt dung riêng", mon: "Vật lý", lop: "12", ghiChu: "$Q = mc\\Delta t$" },
  { en: "latent heat", ipa: "/ˈleɪtnt hiːt/", vi: "nhiệt nóng chảy, nhiệt hóa hơi", mon: "Vật lý", lop: "12", ghiChu: "$Q = \\lambda m$, $Q = Lm$" },
  { en: "absolute temperature", ipa: "/ˈæbsəluːt ˈtemprətʃə(r)/", vi: "nhiệt độ tuyệt đối", mon: "Vật lý", lop: "12", ghiChu: "$T = t + 273$ (K)" },
  { en: "ideal gas", ipa: "/aɪˈdiːəl ɡæs/", vi: "khí lí tưởng", mon: "Vật lý", lop: "12", ghiChu: "$pV = nRT$" },
  { en: "magnetic field", ipa: "/mæɡˈnetɪk fiːld/", vi: "từ trường", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "magnetic flux", ipa: "/mæɡˈnetɪk flʌks/", vi: "từ thông", mon: "Vật lý", lop: "12", ghiChu: "$\\Phi = BS\\cos\\alpha$" },
  { en: "electromagnetic induction", ipa: "/ɪˌlektrəʊmæɡˈnetɪk ɪnˈdʌkʃn/", vi: "cảm ứng điện từ", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "alternating current", ipa: "/ˈɔːltəneɪtɪŋ ˈkʌrənt/", vi: "dòng điện xoay chiều", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "nucleus", ipa: "/ˈnjuːkliəs/", vi: "hạt nhân", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "isotope", ipa: "/ˈaɪsətəʊp/", vi: "đồng vị", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "radioactivity", ipa: "/ˌreɪdiəʊækˈtɪvəti/", vi: "sự phóng xạ", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "half-life", ipa: "/ˈhɑːf laɪf/", vi: "chu kì bán rã", mon: "Vật lý", lop: "12", ghiChu: "$N = N_0 \\cdot 2^{-t/T}$" },
  { en: "binding energy", ipa: "/ˈbaɪndɪŋ ˈenədʒi/", vi: "năng lượng liên kết", mon: "Vật lý", lop: "12", ghiChu: "$W_{lk} = \\Delta m \\cdot c^2$" },
  { en: "Brownian motion", ipa: "/ˈbraʊniən ˈməʊʃn/", vi: "chuyển động Brown", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "evaporation", ipa: "/ɪˌvæpəˈreɪʃn/", vi: "sự bay hơi", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "boiling", ipa: "/ˈbɔɪlɪŋ/", vi: "sự sôi", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "sublimation", ipa: "/ˌsʌblɪˈmeɪʃn/", vi: "sự thăng hoa", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "first law of thermodynamics", ipa: "/fɜːst lɔː əv ˌθɜːməʊdaɪˈnæmɪks/", vi: "định luật I của nhiệt động lực học", mon: "Vật lý", lop: "12", ghiChu: "$\\Delta U = A + Q$" },
  { en: "heat engine", ipa: "/hiːt ˈendʒɪn/", vi: "động cơ nhiệt", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "thermal equilibrium", ipa: "/ˈθɜːml ˌiːkwɪˈlɪbriəm/", vi: "cân bằng nhiệt", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "absolute zero", ipa: "/ˈæbsəluːt ˈzɪərəʊ/", vi: "độ không tuyệt đối", mon: "Vật lý", lop: "12", ghiChu: "$0$ K $\\approx -273\\ ^\\circ\\text{C}$" },
  { en: "thermometer", ipa: "/θəˈmɒmɪtə(r)/", vi: "nhiệt kế", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "specific latent heat of fusion", ipa: "/spəˈsɪfɪk ˈleɪtnt hiːt əv ˈfjuːʒn/", vi: "nhiệt nóng chảy riêng", mon: "Vật lý", lop: "12", ghiChu: "$Q = \\lambda m$" },
  { en: "specific latent heat of vaporization", ipa: "/spəˈsɪfɪk ˈleɪtnt hiːt əv ˌveɪpəraɪˈzeɪʃn/", vi: "nhiệt hoá hơi riêng", mon: "Vật lý", lop: "12", ghiChu: "$Q = Lm$" },
  { en: "Boyle's law", ipa: "/ˈbɔɪlz lɔː/", vi: "định luật Boyle", mon: "Vật lý", lop: "12", ghiChu: "$p_1V_1 = p_2V_2$" },
  { en: "Charles's law", ipa: "/ˈʃɑːlzɪz lɔː/", vi: "định luật Charles", mon: "Vật lý", lop: "12", ghiChu: "$\\dfrac{V_1}{T_1} = \\dfrac{V_2}{T_2}$" },
  { en: "equation of state", ipa: "/ɪˈkweɪʒn əv steɪt/", vi: "phương trình trạng thái", mon: "Vật lý", lop: "12", ghiChu: "$\\dfrac{pV}{T}$ = hằng số" },
  { en: "Boltzmann constant", ipa: "/ˈbɒltsmən ˈkɒnstənt/", vi: "hằng số Boltzmann", mon: "Vật lý", lop: "12", ghiChu: "$k = 1{,}38 \\cdot 10^{-23}$ J/K" },
  { en: "magnetic flux density", ipa: "/mæɡˈnetɪk flʌks ˈdensəti/", vi: "cảm ứng từ", mon: "Vật lý", lop: "12", ghiChu: "$B = \\dfrac{F}{IL\\sin\\alpha}$, đơn vị T" },
  { en: "magnetic field line", ipa: "/mæɡˈnetɪk fiːld laɪn/", vi: "đường sức từ", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "left-hand rule", ipa: "/ˌleft hænd ˈruːl/", vi: "quy tắc bàn tay trái", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "induced emf", ipa: "/ɪnˈdjuːst ˌiː em ˈef/", vi: "suất điện động cảm ứng", mon: "Vật lý", lop: "12", ghiChu: "$e_c = -N\\dfrac{\\Delta\\Phi}{\\Delta t}$" },
  { en: "Lenz's law", ipa: "/ˈlentsɪz lɔː/", vi: "định luật Lenz", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "AC generator", ipa: "/ˌeɪ ˈsiː ˈdʒenəreɪtə(r)/", vi: "máy phát điện xoay chiều", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "rms value", ipa: "/ˌɑːr em ˈes ˈvæljuː/", vi: "giá trị hiệu dụng", mon: "Vật lý", lop: "12", ghiChu: "$I = \\dfrac{I_0}{\\sqrt{2}}$" },
  { en: "transformer", ipa: "/trænsˈfɔːmə(r)/", vi: "máy biến áp", mon: "Vật lý", lop: "12", ghiChu: "$\\dfrac{U_1}{U_2} = \\dfrac{N_1}{N_2}$" },
  { en: "eddy current", ipa: "/ˈedi ˈkʌrənt/", vi: "dòng điện Foucault", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "nucleon", ipa: "/ˈnjuːkliɒn/", vi: "nucleon (proton, neutron)", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "mass number", ipa: "/mæs ˈnʌmbə(r)/", vi: "số khối", mon: "Vật lý", lop: "12", ghiChu: "$A$" },
  { en: "mass defect", ipa: "/mæs ˈdiːfekt/", vi: "độ hụt khối", mon: "Vật lý", lop: "12", ghiChu: "$E_{lk} = \\Delta m c^2$" },
  { en: "nuclear fission", ipa: "/ˈnjuːkliə ˈfɪʃn/", vi: "phản ứng phân hạch", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "nuclear fusion", ipa: "/ˈnjuːkliə ˈfjuːʒn/", vi: "phản ứng tổng hợp hạt nhân", mon: "Vật lý", lop: "12", ghiChu: "" },
  { en: "decay constant", ipa: "/dɪˈkeɪ ˈkɒnstənt/", vi: "hằng số phóng xạ", mon: "Vật lý", lop: "12", ghiChu: "$\\lambda = \\dfrac{\\ln 2}{T}$" },
  { en: "activity", ipa: "/ækˈtɪvəti/", vi: "độ phóng xạ", mon: "Vật lý", lop: "12", ghiChu: "$H = \\lambda N$ (Bq)" },
  { en: "nuclear reactor", ipa: "/ˈnjuːkliə riˈæktə(r)/", vi: "lò phản ứng hạt nhân", mon: "Vật lý", lop: "12", ghiChu: "" },

  // ----- Tin học 10 -----
  { en: "hardware", ipa: "/ˈhɑːdweə(r)/", vi: "phần cứng", mon: "Tin học", lop: "10", ghiChu: "" },
  { en: "software", ipa: "/ˈsɒftweə(r)/", vi: "phần mềm", mon: "Tin học", lop: "10", ghiChu: "" },
  { en: "operating system", ipa: "/ˈɒpəreɪtɪŋ ˈsɪstəm/", vi: "hệ điều hành", mon: "Tin học", lop: "10", ghiChu: "" },
  { en: "algorithm", ipa: "/ˈælɡərɪðəm/", vi: "thuật toán", mon: "Tin học", lop: "10", ghiChu: "" },
  { en: "input", ipa: "/ˈɪnpʊt/", vi: "dữ liệu vào", mon: "Tin học", lop: "10", ghiChu: "Hàm `input()`." },
  { en: "output", ipa: "/ˈaʊtpʊt/", vi: "dữ liệu ra", mon: "Tin học", lop: "10", ghiChu: "Hàm `print()`." },
  { en: "variable", ipa: "/ˈveəriəbl/", vi: "biến", mon: "Tin học", lop: "10", ghiChu: "" },
  { en: "data type", ipa: "/ˈdeɪtə taɪp/", vi: "kiểu dữ liệu", mon: "Tin học", lop: "10", ghiChu: "`int`, `float`, `str`, `bool`" },
  { en: "condition", ipa: "/kənˈdɪʃn/", vi: "điều kiện", mon: "Tin học", lop: "10", ghiChu: "Câu lệnh `if`." },
  { en: "loop", ipa: "/luːp/", vi: "vòng lặp", mon: "Tin học", lop: "10", ghiChu: "`for`, `while`" },
  { en: "function", ipa: "/ˈfʌŋkʃn/", vi: "hàm", mon: "Tin học", lop: "10", ghiChu: "Khai báo bằng `def`." },
  { en: "list", ipa: "/lɪst/", vi: "danh sách", mon: "Tin học", lop: "10", ghiChu: "" },
  { en: "syntax error", ipa: "/ˈsɪntæks ˈerə(r)/", vi: "lỗi cú pháp", mon: "Tin học", lop: "10", ghiChu: "" },
  { en: "debug", ipa: "/ˌdiːˈbʌɡ/", vi: "gỡ lỗi", mon: "Tin học", lop: "10", ghiChu: "" },

  // ----- Tin học 11 -----
  { en: "database", ipa: "/ˈdeɪtəbeɪs/", vi: "cơ sở dữ liệu", mon: "Tin học", lop: "11", ghiChu: "" },
  { en: "table", ipa: "/ˈteɪbl/", vi: "bảng", mon: "Tin học", lop: "11", ghiChu: "" },
  { en: "record", ipa: "/ˈrekɔːd/", vi: "bản ghi", mon: "Tin học", lop: "11", ghiChu: "Một hàng của bảng." },
  { en: "field", ipa: "/fiːld/", vi: "trường", mon: "Tin học", lop: "11", ghiChu: "Một cột của bảng." },
  { en: "primary key", ipa: "/ˈpraɪməri kiː/", vi: "khóa chính", mon: "Tin học", lop: "11", ghiChu: "" },
  { en: "foreign key", ipa: "/ˈfɒrən kiː/", vi: "khóa ngoài", mon: "Tin học", lop: "11", ghiChu: "" },
  { en: "query", ipa: "/ˈkwɪəri/", vi: "truy vấn", mon: "Tin học", lop: "11", ghiChu: "Ví dụ: `SELECT * FROM HocSinh`" },
  { en: "sorting", ipa: "/ˈsɔːtɪŋ/", vi: "sắp xếp", mon: "Tin học", lop: "11", ghiChu: "" },
  { en: "binary search", ipa: "/ˈbaɪnəri sɜːtʃ/", vi: "tìm kiếm nhị phân", mon: "Tin học", lop: "11", ghiChu: "" },
  { en: "time complexity", ipa: "/taɪm kəmˈpleksəti/", vi: "độ phức tạp thời gian", mon: "Tin học", lop: "11", ghiChu: "Ví dụ: $O(n)$, $O(n^2)$, $O(\\log n)$" },

  // ----- Tin học 12 -----
  { en: "artificial intelligence", ipa: "/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/", vi: "trí tuệ nhân tạo (AI)", mon: "Tin học", lop: "12", ghiChu: "" },
  { en: "machine learning", ipa: "/məˈʃiːn ˈlɜːnɪŋ/", vi: "học máy", mon: "Tin học", lop: "12", ghiChu: "" },
  { en: "data science", ipa: "/ˈdeɪtə ˈsaɪəns/", vi: "khoa học dữ liệu", mon: "Tin học", lop: "12", ghiChu: "" },
  { en: "network", ipa: "/ˈnetwɜːk/", vi: "mạng máy tính", mon: "Tin học", lop: "12", ghiChu: "" },
  { en: "router", ipa: "/ˈruːtə(r)/", vi: "bộ định tuyến", mon: "Tin học", lop: "12", ghiChu: "" },
  { en: "protocol", ipa: "/ˈprəʊtəkɒl/", vi: "giao thức", mon: "Tin học", lop: "12", ghiChu: "Ví dụ: TCP/IP, HTTP." },
  { en: "IP address", ipa: "/ˌaɪ ˈpiː əˈdres/", vi: "địa chỉ IP", mon: "Tin học", lop: "12", ghiChu: "" },
  { en: "web page", ipa: "/ˈweb peɪdʒ/", vi: "trang web", mon: "Tin học", lop: "12", ghiChu: "" },
  { en: "tag", ipa: "/tæɡ/", vi: "thẻ (HTML)", mon: "Tin học", lop: "12", ghiChu: "Ví dụ: `<p>`, `<a>`, `<img>`" },
  { en: "hyperlink", ipa: "/ˈhaɪpəlɪŋk/", vi: "siêu liên kết", mon: "Tin học", lop: "12", ghiChu: "" },
  { en: "cybersecurity", ipa: "/ˌsaɪbəsɪˈkjʊərəti/", vi: "an ninh mạng", mon: "Tin học", lop: "12", ghiChu: "" }
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
