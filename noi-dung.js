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
  thongBao: "Mới: mục Học song ngữ Việt – Anh với từ điển thuật ngữ Lý – Tin có phát âm; đủ 5 chuyên đề video ôn HSG Vật lí THCS.",

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
  { ten: "Chuyên đề 3. Chuyển động tròn đều - Gia tốc hướng tâm - Bài toán kim đồng hồ", mon: "Vật lý", lop: "HSG", cap: "THPT", chuDe: "Chuyên đề 3", youtube: "https://www.youtube.com/watch?v=zITfR2-qnNU", taiLieu: "", moTa: "", ngay: "2026-11-12" },
  { ten: "Chuyên đề 2. Chuyển động thẳng biến đổi đều - Rơi tự do", mon: "Vật lý", lop: "HSG", cap: "THPT", chuDe: "Chuyên đề 2", youtube: "https://www.youtube.com/watch?v=t2CkWlaNOlc", taiLieu: "", moTa: "", ngay: "2026-11-07" },
  { ten: "Lời giải 12 bài HSG Chuyển động thẳng đều", mon: "Vật lý", lop: "HSG", cap: "THPT", chuDe: "Chuyên đề 1", youtube: "https://www.youtube.com/watch?v=sP5Ile7C6Rg", taiLieu: "", moTa: "", ngay: "2026-11-06" },
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

  // Hai đề mẫu dưới đây đang tạm ẩn (có // ở đầu dòng). Tệp đề mẫu vẫn còn trong thư mục de/ để soạn theo.
  // { ten: "Mẫu: Thi thử TN THPT Vật lí (đề rút gọn)", mon: "Vật lý", lop: "12", loai: "Thi thử TN THPT", tep: "de/mau-vat-ly-12-thi-thu.txt", thoiGian: 15, ngay: "2026-11-10" },
  // { ten: "Mẫu: Luyện tập Python cơ bản", mon: "Tin học", lop: "10", loai: "Luyện tập", tep: "de/mau-tin-hoc-10-python.txt", thoiGian: 10, ngay: "2026-11-10" },
];

/* ---------- BÀI HỌC SONG NGỮ VIỆT - ANH (đọc trực tiếp trên trang) ----------
   Mỗi bài là một tệp .json trong thư mục bai/ (soạn bằng Công cụ thêm bài, mục "Bài học song ngữ").
   Học sinh chọn xem Tiếng Việt, English hoặc Song ngữ; có thẻ thuật ngữ kèm phát âm. */
const BAI_HOC = [
  // ▼▼▼ DÁN BÀI HỌC MỚI NGAY DƯỚI DÒNG NÀY ▼▼▼

  { ten: "Biến và kiểu dữ liệu trong Python", tenEn: "Variables and data types in Python", mon: "Tin học", lop: "10", tep: "bai/mau-bien-va-kieu-du-lieu.json", ngay: "2026-11-19" }
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

  // ----- Vật lý 11 -----
  { en: "oscillation", ipa: "/ˌɒsɪˈleɪʃn/", vi: "dao động", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "amplitude", ipa: "/ˈæmplɪtjuːd/", vi: "biên độ", mon: "Vật lý", lop: "11", ghiChu: "" },
  { en: "period", ipa: "/ˈpɪəriəd/", vi: "chu kì", mon: "Vật lý", lop: "11", ghiChu: "$T = \\dfrac{2\\pi}{\\omega}$" },
  { en: "frequency", ipa: "/ˈfriːkwənsi/", vi: "tần số", mon: "Vật lý", lop: "11", ghiChu: "$f = \\dfrac{1}{T}$" },
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
