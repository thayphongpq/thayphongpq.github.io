/* ==========================================================================
   TỆP NỘI DUNG CỦA TRANG WEB - THẦY/CÔ CHỈ CẦN SỬA TỆP NÀY
   --------------------------------------------------------------------------
   Quy tắc: giữ nguyên dấu ngoặc kép " ", dấu phẩy và dấu ngoặc { } [ ].
   Để trống "" nếu chưa có link: trang sẽ tự hiện chữ "Sắp có".

   Viết mục lop như sau:
     "10", "11", "12"  -> hiện ở trang Vật lý / Tin học theo khối
     "HSG"             -> hiện ở trang Ôn thi HSG
   ========================================================================== */

const THONG_TIN = {
  tenTrang: "Góc Lý - Tin",
  khauHieu: "Vật lý và Tin học THPT, từ bài học trên lớp đến đề thi học sinh giỏi.",
  giaoVien: "Thầy Lâm Thế Phong",
  truong: "THPT An Thới",

  // Dòng thông báo trên đầu trang. Để "" nếu không có thông báo.
  thongBao: "Trang đang xây dựng: các bài bên dưới là ví dụ mẫu, sẽ được thay bằng bài thật.",

  gioiThieu: "Nơi tập hợp bài giảng, tài liệu và đề ôn luyện môn Vật lý, Tin học dành cho học sinh THPT.",

  // Điền link của thầy/cô. Mục nào để "" sẽ tự ẩn.
  youtube: "",
  facebook: "",
  zalo: "",
  email: ""
};

// Lộ trình hiển thị ở trang Ôn thi HSG.
const LO_TRINH = [
  { buoc: "Củng cố nền tảng", moTa: "Nắm chắc kiến thức trọng tâm và kỹ năng cơ bản của từng môn." },
  { buoc: "Học theo chuyên đề", moTa: "Đi sâu từng dạng, xem video rồi tự làm bài tập." },
  { buoc: "Luyện đề các năm", moTa: "Làm đề thật theo đúng thời gian, tự chấm và ghi lại lỗi sai." },
  { buoc: "Thi thử, tổng kết", moTa: "Rèn chiến thuật làm bài và ôn lại các dạng còn yếu." }
];

/* ---------- VIDEO BÀI GIẢNG ---------- */
const VIDEO = [
  // ▼▼▼ DÁN VIDEO MỚI NGAY DƯỚI DÒNG NÀY ▼▼▼

  { ten: "Mẫu: Chuyển động thẳng biến đổi đều", mon: "Vật lý", lop: "10", chuDe: "Động học", youtube: "", taiLieu: "", moTa: "Video mẫu. Dán link YouTube vào mục youtube để video hiện lên.", ngay: "2026-11-10" },
  { ten: "Mẫu: Dao động điều hòa", mon: "Vật lý", lop: "11", chuDe: "Dao động", youtube: "", taiLieu: "", moTa: "", ngay: "2026-11-09" },
  { ten: "Mẫu: Python - biến và kiểu dữ liệu", mon: "Tin học", lop: "10", chuDe: "Lập trình Python", youtube: "", taiLieu: "", moTa: "", ngay: "2026-11-08" },
  { ten: "Mẫu: HSG Vật lý - Cân bằng vật rắn", mon: "Vật lý", lop: "HSG", chuDe: "Cơ học", youtube: "", taiLieu: "", moTa: "", ngay: "2026-11-07" },
  { ten: "Mẫu: HSG Tin học - Quy hoạch động cơ bản", mon: "Tin học", lop: "HSG", chuDe: "Quy hoạch động", youtube: "", taiLieu: "", moTa: "", ngay: "2026-11-06" }
];

/* ---------- TÀI LIỆU, BÀI TẬP, ĐỀ THI ----------
   loai nên chọn một trong các chữ sau:
   Lý thuyết, Thực hành, Bài tập, Trắc nghiệm, Đề kiểm tra, Chuyên đề, Đề thi */
const TAI_LIEU = [
  // ▼▼▼ DÁN TÀI LIỆU MỚI NGAY DƯỚI DÒNG NÀY ▼▼▼

  { ten: "Mẫu: Tóm tắt lý thuyết Động học", mon: "Vật lý", lop: "10", loai: "Lý thuyết", link: "", ngay: "2026-11-10" },
  { ten: "Mẫu: Bài tập Động lực học", mon: "Vật lý", lop: "10", loai: "Bài tập", link: "", ngay: "2026-11-09" },
  { ten: "Mẫu: Bài tập Dao động và Sóng", mon: "Vật lý", lop: "11", loai: "Bài tập", link: "", ngay: "2026-11-08" },
  { ten: "Mẫu: Đề kiểm tra Vật lý nhiệt", mon: "Vật lý", lop: "12", loai: "Đề kiểm tra", link: "", ngay: "2026-11-07" },
  { ten: "Mẫu: Thực hành Python - vòng lặp", mon: "Tin học", lop: "10", loai: "Thực hành", link: "", ngay: "2026-11-06" },
  { ten: "Mẫu: Trắc nghiệm Cơ sở dữ liệu", mon: "Tin học", lop: "11", loai: "Trắc nghiệm", link: "", ngay: "2026-11-05" },
  { ten: "Mẫu: Lý thuyết HTML và CSS", mon: "Tin học", lop: "12", loai: "Lý thuyết", link: "", ngay: "2026-11-04" },
  { ten: "Mẫu: Chuyên đề Nhiệt động lực học", mon: "Vật lý", lop: "HSG", loai: "Chuyên đề", link: "", ngay: "2026-11-03" },
  { ten: "Mẫu: Đề thi HSG Vật lý cấp tỉnh", mon: "Vật lý", lop: "HSG", loai: "Đề thi", link: "", ngay: "2026-11-02" },
  { ten: "Mẫu: Chuyên đề Đồ thị - BFS, DFS", mon: "Tin học", lop: "HSG", loai: "Chuyên đề", link: "", ngay: "2026-11-01" },
  { ten: "Mẫu: Bài tập Số học - sàng nguyên tố", mon: "Tin học", lop: "HSG", loai: "Bài tập", link: "", ngay: "2026-10-31" },
  { ten: "Mẫu: Đề thi HSG Tin học cấp tỉnh", mon: "Tin học", lop: "HSG", loai: "Đề thi", link: "", ngay: "2026-10-30" }
];
