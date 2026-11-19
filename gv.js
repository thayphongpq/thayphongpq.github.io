/* KHÓA "TIẾNG ANH CHO GIÁO VIÊN LÝ – TIN" (trang #/giao-vien). Thầy/cô không cần sửa tệp này.
   Nội dung các bài nằm trong tieng-anh-gv.js.
   - Kiểm tra đầu vào -> lộ trình riêng theo trình độ và môn dạy.
   - Mỗi bài 5 hoạt động: Học câu, Nghe hiểu, Luyện nói (máy chấm phát âm), Chép chính tả, Ghép câu.
   - Ôn tập thông minh (lặp lại ngắt quãng), tiến độ, chuỗi ngày học, nhắc lịch, sao lưu tiến độ.
   Tiến độ lưu trong trình duyệt của máy đang dùng (không cần tài khoản). */
(function () {
  "use strict";
  const TN = window.TracNghiem;
  const esc = TN.esc;
  const DL = window.GV_DU_LIEU || { phan: [], bai: [], kiemTra: [] };
  const KHOA = "gv-tien-do";
  const KHOANG = [0, 1, 2, 4, 7, 15, 30]; // số ngày chờ ôn lại theo "hộp" ghi nhớ
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const LINK_TRANG = "https://thayphongpq.github.io/#/giao-vien";

  /* ----- Lưu tiến độ ----- */
  function macDinh() { return { hoSo: null, the: {}, ngay: {}, giong: { giong: "en-US", toc: 0.9 }, nhac: "19:30" }; }
  function doc() {
    try {
      const x = JSON.parse(localStorage.getItem(KHOA) || "null");
      if (x && typeof x === "object") return Object.assign(macDinh(), x);
    } catch (e) { /* bỏ qua */ }
    return macDinh();
  }
  let TD = doc();
  function ghi() { try { localStorage.setItem(KHOA, JSON.stringify(TD)); } catch (e) { /* bỏ qua */ } }

  function ngayChu(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function homNay() { return ngayChu(new Date()); }
  function congNgay(n) { const d = new Date(); d.setDate(d.getDate() + n); return ngayChu(d); }

  const CAU = {};
  DL.bai.forEach(function (b) { b.cau.forEach(function (c, i) { CAU[b.id + "-" + i] = { id: b.id + "-" + i, en: c[0], vi: c[1], bai: b.id }; }); });
  function idCau(b) { return b.cau.map(function (c, i) { return b.id + "-" + i; }); }
  function baiTheoId(id) { return DL.bai.find(function (b) { return b.id === id; }); }

  // Lặp lại ngắt quãng: câu đến hạn mà trả lời đúng thì lên hộp (ôn thưa dần: 1, 2, 4, 7, 15, 30 ngày);
  // trả lời đúng nhiều lần trong cùng một ngày không lên hộp thêm (phải nhớ qua nhiều ngày mới tính là thuộc);
  // sai thì về hộp 1 và ôn lại ngay hôm nay.
  function chamThe(id, dung) {
    const hn = homNay();
    const t = TD.the[id] || { box: 0, due: hn, dung: 0, sai: 0 };
    if (dung) {
      t.dung++;
      if (t.saiNgay === hn) { t.box = Math.max(1, t.box); t.due = congNgay(1); }
      else if (t.box === 0 || t.due <= hn) { t.box = Math.min(6, t.box + 1); t.due = congNgay(KHOANG[t.box]); }
    } else { t.box = 1; t.sai++; t.due = hn; t.saiNgay = hn; }
    TD.the[id] = t;
    ghi();
  }
  function canOn() {
    const hn = homNay();
    return Object.keys(TD.the).filter(function (id) { const t = TD.the[id]; return CAU[id] && t.box >= 1 && t.due <= hn; });
  }
  function tienDo(b) {
    let hoc = 0, thuoc = 0;
    idCau(b).forEach(function (id) { const t = TD.the[id]; if (t && t.box >= 1) hoc++; if (t && t.box >= 3) thuoc++; });
    const n = b.cau.length;
    // xong: đã luyện đúng mọi câu ít nhất một lần (chuyển sang bài mới); thuocHet: đã thuộc từ 80% số câu (nhớ qua nhiều ngày).
    return { hoc: hoc, thuoc: thuoc, n: n, pt: Math.round(100 * (hoc + thuoc) / (2 * n)), xong: hoc >= n, thuocHet: thuoc >= Math.ceil(n * 0.8) };
  }
  function loTrinh() {
    const mon = (TD.hoSo && TD.hoSo.mon) || "ca-hai";
    return DL.bai.filter(function (b) { return b.phan === "A" || b.phan === "B" || (b.phan === "C" && mon !== "tin") || (b.phan === "D" && mon !== "ly"); });
  }
  function baiTiepTheo() {
    const lt = loTrinh(), bd = TD.hoSo ? lt.findIndex(function (b) { return b.id === TD.hoSo.batDau; }) : 0;
    const sau = lt.slice(Math.max(0, bd)).concat(lt.slice(0, Math.max(0, bd)));
    return sau.find(function (b) { return !tienDo(b).xong; }) || null;
  }

  /* ----- Thời gian học và chuỗi ngày ----- */
  let hoatDong = 0;
  ["click", "keydown", "touchstart"].forEach(function (s) { document.addEventListener(s, function () { hoatDong = Date.now(); }, true); });
  setInterval(function () {
    if (location.hash.indexOf("#/giao-vien") !== 0 || document.visibilityState !== "visible" || Date.now() - hoatDong > 90000) return;
    const k = homNay();
    TD.ngay[k] = (TD.ngay[k] || 0) + 15;
    ghi();
    const o = document.getElementById("gv-phut-hn");
    if (o) o.textContent = Math.floor(TD.ngay[k] / 60);
  }, 15000);
  function chuoiNgay() {
    const d = new Date();
    if (!((TD.ngay[ngayChu(d)] || 0) >= 60)) d.setDate(d.getDate() - 1);
    let n = 0;
    while ((TD.ngay[ngayChu(d)] || 0) >= 60) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  /* ----- Giọng đọc ----- */
  function coGiong() { return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function"; }
  function chonGiong() {
    const ds = window.speechSynthesis.getVoices().filter(function (v) { return v.lang.replace("_", "-").indexOf(TD.giong.giong) === 0; });
    return ds.find(function (v) { return /natural|google|online/i.test(v.name); }) || ds[0] || null;
  }
  function doc1(chu, cham) {
    if (!coGiong()) return;
    const u = new SpeechSynthesisUtterance(chu);
    u.lang = TD.giong.giong;
    const v = chonGiong();
    if (v) u.voice = v;
    u.rate = cham ? 0.6 : TD.giong.toc;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
  if (coGiong()) window.speechSynthesis.getVoices();

  /* ----- So sánh câu (luyện nói, chép chính tả) ----- */
  const SO = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const CHUC = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  function soChu(s) {
    if (s.indexOf(".") > 0) { const p = s.split("."); return soChu(p[0]) + " point " + p[1].split("").map(function (c) { return SO[+c]; }).join(" "); }
    const n = Number(s);
    if (!(n >= 0) || n > 999) return s;
    if (n < 20) return SO[n];
    if (n < 100) return CHUC[Math.floor(n / 10)] + (n % 10 ? " " + SO[n % 10] : "");
    return SO[Math.floor(n / 100)] + " hundred" + (n % 100 ? " and " + soChu(String(n % 100)) : "");
  }
  function tachTu(s) {
    return String(s || "").toLowerCase().replace(/[’']/g, "").replace(/-/g, " ").replace(/\d+(\.\d+)?/g, function (m) { return " " + soChu(m) + " "; })
      .replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(function (w) { return w && w !== "and"; });
  }
  // Dãy con chung dài nhất: trả về độ dài và các vị trí từ trong câu mẫu được khớp.
  function lcs(a, b) {
    const m = a.length, n = b.length, d = [];
    for (let i = 0; i <= m; i++) { d.push(new Array(n + 1).fill(0)); }
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) d[i][j] = a[i] === b[j] ? d[i + 1][j + 1] + 1 : Math.max(d[i + 1][j], d[i][j + 1]);
    const khop = {};
    let i = 0, j = 0;
    while (i < m && j < n) { if (a[i] === b[j]) { khop[i] = true; i++; j++; } else if (d[i + 1][j] >= d[i][j + 1]) i++; else j++; }
    return { do: d[0][0], khop: khop };
  }
  function soSanh(mau, noi) {
    const a = tachTu(mau), b = tachTu(noi), k = lcs(a, b);
    return { diem: a.length + b.length ? 2 * k.do / (a.length + b.length) : 0, tu: a, khop: k.khop };
  }
  function toMau(kq) {
    return kq.tu.map(function (w, i) { return '<span class="' + (kq.khop[i] ? "gv-tu--dung" : "gv-tu--sai") + '">' + esc(w) + "</span>"; }).join(" ");
  }

  /* ----- Mẩu giao diện ----- */
  function tronDs(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function nutDoc(chu, cham) {
    return '<button type="button" class="gv-loa' + (cham ? " gv-loa--cham" : "") + '" data-gv="' + (cham ? "doc-cham" : "doc") + '" data-chu="' + esc(chu) + '" title="' + (cham ? "Nghe chậm" : "Nghe") + '" aria-label="' + (cham ? "Nghe chậm" : "Nghe") + '">' + (cham ? "🐢" : "🔊") + "</button>";
  }
  function thanh(pt) { return '<span class="gv-thanh"><i style="width:' + Math.max(0, Math.min(100, pt)) + '%"></i></span>'; }
  function soLieu(ds) {
    return '<div class="so-lieu">' + ds.map(function (x) { return "<div><b" + (x[2] ? ' id="' + x[2] + '"' : "") + ">" + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span></div>"; }).join("") + "</div>";
  }
  function khoi(t, nd) { return '<section class="khoi"><div class="khoi__dau"><h2>' + esc(t) + "</h2></div>" + nd + "</section>"; }
  const TEN_MON = { ly: "Vật lý", tin: "Tin học", "ca-hai": "Cả Vật lý và Tin học" };
  const NGAY_MOI_BAI = { 10: 5, 20: 3, 30: 2 };
  function baiDocNenTang() {
    const ds = (typeof BAI_HOC === "undefined" ? [] : BAI_HOC).filter(function (b) { return b.lop === "GV"; });
    if (!ds.length) return "";
    return khoi("Bài đọc nền tảng (song ngữ)", '<p class="phu" style="margin-top:-6px">Đọc ở chế độ Song ngữ để hiểu cách dùng câu; có thẻ câu mẫu và phát âm.</p><div class="lien-ket">' +
      ds.map(function (b) {
        const slug = String(b.ten).normalize("NFD").replace(/\p{M}/gu, "").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return '<a class="lien-ket__muc" href="#/bai/' + slug + '"><b>' + esc(b.ten) + ' ›</b><span class="phu" lang="en">' + esc(b.tenEn || "") + "</span></a>";
      }).join("") + "</div>");
  }

  /* ----- Trang chính: giới thiệu hoặc bảng điều khiển ----- */
  function trangChu() {
    document.title = "Tiếng Anh cho giáo viên Lý – Tin - Góc Lý - Tin";
    const tong = DL.bai.reduce(function (s, b) { return s + b.cau.length; }, 0);
    const dau = '<div class="gv-dau"><div><h1>Tiếng Anh cho giáo viên Lý – Tin</h1><p>Lộ trình tự học dành cho thầy cô dạy Vật lý, Tin học theo mô hình song ngữ: mỗi ngày 10 – 30 phút, từ câu chào lớp đến giảng bài, làm thí nghiệm, đọc mã lệnh bằng tiếng Anh.</p></div></div>';
    if (!TD.hoSo) {
      return dau +
        '<div class="gv-diem-manh">' + [
          ["Miễn phí, không cần tài khoản", "Mở trang là học ngay, không phải đăng ký hay chờ tải âm thanh."],
          [DL.bai.length + " bài, " + tong + " câu", "Riêng cho giáo viên THPT: phần chung trong lớp, số – công thức, Vật lý, Tin học."],
          ["Nghe, nói, viết đủ cả", "Giọng Anh – Mỹ, chỉnh tốc độ; máy chấm phát âm; chép chính tả; ghép câu."],
          ["Ôn tập thông minh", "Câu sắp quên tự quay lại đúng lúc, nhớ lâu mà không mất thời gian."],
          ["Lộ trình riêng", "Kiểm tra đầu vào 5 phút, chọn môn dạy và số phút mỗi ngày."],
          ["Nhắc lịch học", "Thêm giờ học vào Google Lịch hoặc lịch điện thoại chỉ với một lần bấm."]
        ].map(function (x) { return "<div><b>" + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span></div>"; }).join("") + "</div>" +
        '<div class="hang-nut gv-bat-dau"><a class="nut" href="#/giao-vien/kiem-tra">Làm bài kiểm tra đầu vào (5 phút) ›</a>' +
        '<button type="button" class="nut nut--phu" data-gv="bat-dau-nhanh">Bỏ qua, học từ bài đầu tiên</button></div>' +
        '<div style="height:32px"></div>' + baiDocNenTang();
    }
    const hs = TD.hoSo, lt = loTrinh(), on = canOn(), tiep = baiTiepTheo();
    const phutHn = Math.floor((TD.ngay[homNay()] || 0) / 60);
    let thuoc = 0, tongLt = 0;
    lt.forEach(function (b) { const t = tienDo(b); thuoc += t.thuoc; tongLt += t.n; });
    const conLai = lt.filter(function (b) { return !tienDo(b).xong; }).length;
    const tuan = Math.max(1, Math.ceil(conLai * (NGAY_MOI_BAI[hs.phut] || 3) / 7));
    return dau +
      soLieu([[phutHn, "/ " + hs.phut + " phút hôm nay", "gv-phut-hn"], [chuoiNgay(), "ngày học liên tiếp"], [thuoc + "/" + tongLt, "câu đã thuộc"], [on.length, "câu cần ôn hôm nay"]]) +
      khoi("Kế hoạch hôm nay", '<div class="gv-ke-hoach">' +
        (on.length ? '<a class="gv-viec" href="#/giao-vien/on-tap"><b>1. Ôn tập ' + Math.min(20, on.length) + " câu</b><span>Khoảng " + Math.max(3, Math.ceil(Math.min(20, on.length) / 3)) + " phút · câu sắp quên được ưu tiên</span><em>Bắt đầu ›</em></a>" : "") +
        (tiep ? '<a class="gv-viec" href="#/giao-vien/bai/' + tiep.id + '"><b>' + (on.length ? "2. " : "1. ") + "Học tiếp: Bài " + esc(tiep.id) + ". " + esc(tiep.ten) + '</b><span lang="en">' + esc(tiep.tenEn) + " · " + tienDo(tiep).pt + "% hoàn thành</span><em>Vào học ›</em></a>"
          : '<div class="gv-viec"><b>Chúc mừng Thầy/Cô đã học hết lộ trình!</b><span>Hãy ôn tập đều mỗi ngày để giữ vững vốn tiếng Anh.</span></div>') + "</div>" +
        '<p class="phu">Học ' + hs.phut + " phút mỗi ngày, Thầy/Cô sẽ hoàn thành phần còn lại trong khoảng <b>" + tuan + " tuần</b>. Trình độ khởi điểm: " + esc(hs.capDo || "tự chọn") + " · Môn: " + esc(TEN_MON[hs.mon] || "") + ".</p>") +
      DL.phan.map(function (p) {
        const ds = lt.filter(function (b) { return b.phan === p.id; });
        if (!ds.length) return "";
        return khoi(p.ten, '<p class="phu" style="margin-top:-6px">' + esc(p.moTa) + '</p><div class="gv-ds-bai">' + ds.map(theBai).join("") + "</div>");
      }).join("") +
      khoi("Công cụ", '<div class="lien-ket">' +
        '<a class="lien-ket__muc" href="#/giao-vien/cai-dat"><b>Cài đặt và nhắc lịch học ›</b><span class="phu">Giọng đọc, tốc độ, giờ nhắc, sao lưu tiến độ sang máy khác</span></a>' +
        '<a class="lien-ket__muc" href="#/giao-vien/kiem-tra"><b>Làm lại bài kiểm tra đầu vào ›</b><span class="phu">Xác định lại trình độ và lộ trình</span></a>' +
        '<a class="lien-ket__muc" href="#/song-ngu"><b>Từ điển thuật ngữ Lý – Tin ›</b><span class="phu">Thuật ngữ theo lớp, có phát âm và đố vui</span></a></div>') +
      baiDocNenTang();
  }
  function theBai(b) {
    const t = tienDo(b), dangHoc = t.hoc > 0 && !t.xong;
    return '<a class="gv-bai' + (t.xong ? " gv-bai--xong" : "") + (t.thuocHet ? " gv-bai--thuoc" : "") + '" href="#/giao-vien/bai/' + b.id + '"><span class="gv-bai__so">' + esc(b.id) + "</span>" +
      '<span class="gv-bai__chu"><b>' + esc(b.ten) + '</b><span class="phu" lang="en">' + esc(b.tenEn) + " · " + esc(b.capDo) + "</span>" + thanh(t.pt) + "</span>" +
      '<span class="gv-bai__tt">' + (t.thuocHet ? "★ Đã thuộc" : t.xong ? "✓ Đã học" : dangHoc ? t.pt + "%" : "Chưa học") + "</span></a>";
  }

  /* ----- Kiểm tra đầu vào ----- */
  let KT = null;
  function trangKiemTra() {
    document.title = "Kiểm tra đầu vào - Tiếng Anh cho giáo viên";
    KT = { i: 0, dung: 0, mon: (TD.hoSo && TD.hoSo.mon) || "ca-hai", phut: (TD.hoSo && TD.hoSo.phut) || 20 };
    return '<a class="quay-lai" href="#/giao-vien">‹ Tiếng Anh cho giáo viên</a><div class="dau-muc"><h1>Kiểm tra đầu vào</h1><p>' + DL.kiemTra.length +
      " câu, từ dễ đến khó, khoảng 5 phút. Không sao nếu chưa biết: cứ chọn đáp án Thầy/Cô thấy gần đúng nhất.</p></div>" +
      '<div class="gv-hd" id="gv-kt"></div>';
  }
  function veKiemTra() {
    const o = document.getElementById("gv-kt");
    if (!o || !KT) return;
    if (KT.i >= DL.kiemTra.length) { veKetQuaKiemTra(o); return; }
    const c = DL.kiemTra[KT.i];
    const hoi = c.loai === "nghia" ? '<div class="gv-hoi" lang="en">' + esc(c.en) + " " + nutDoc(c.en) + '</div><p class="phu">Câu trên nghĩa là gì?</p>'
      : c.loai === "nghe" ? '<div class="gv-hoi">' + nutDoc(c.en) + " " + nutDoc(c.en, true) + '</div><p class="phu">Bấm loa để nghe, rồi chọn câu Thầy/Cô nghe được.</p>'
        : '<div class="gv-hoi">' + esc(c.vi) + '</div><p class="phu">Chọn câu tiếng Anh đúng.</p>';
    o.innerHTML = '<div class="tro-choi__dau"><b>Câu ' + (KT.i + 1) + "/" + DL.kiemTra.length + "</b>" + thanh(100 * KT.i / DL.kiemTra.length) + "</div>" + hoi +
      '<div class="tc-lc">' + c.lc.map(function (x, i) {
        return '<button type="button" class="tc-nut" data-gv="kt-chon" data-i="' + i + '"' + (c.loai === "nghia" ? "" : ' lang="en"') + '><span class="lc__nhan">' + "ABCD"[i] + '</span><span class="lc__chu">' + esc(x) + "</span></button>";
      }).join("") + "</div>";
    if (c.loai === "nghe") setTimeout(function () { doc1(c.en); }, 300);
  }
  function capDoTuDiem(d) {
    if (d <= 5) return { ten: "Mới bắt đầu (A1)", batDau: "A1", loi: "Thầy/Cô nên bắt đầu từ những câu chào lớp, giao nhiệm vụ đơn giản. Đi chậm mà chắc!" };
    if (d <= 10) return { ten: "Cơ bản (A2)", batDau: "A5", loi: "Thầy/Cô đã có nền tảng. Lộ trình bắt đầu từ Bài A5 (kiểm tra hiểu bài); các bài trước vẫn mở để ôn nhanh." };
    return { ten: "Khá (B1)", batDau: "B1", loi: "Thầy/Cô khá vững. Lộ trình bắt đầu từ phần số – công thức rồi vào ngay các bài theo môn dạy." };
  }
  function veKetQuaKiemTra(o) {
    const cd = capDoTuDiem(KT.dung);
    KT.capDo = cd;
    o.innerHTML = '<div class="do-vui__kq"><b>' + KT.dung + "/" + DL.kiemTra.length + "</b><span>câu đúng</span></div>" +
      "<p>Trình độ hiện tại: <b>" + esc(cd.ten) + "</b>. " + esc(cd.loi) + "</p>" +
      '<div class="gv-chon"><span class="loc__ten">Thầy/Cô dạy môn</span>' + [["ly", "Vật lý"], ["tin", "Tin học"], ["ca-hai", "Cả hai"]].map(function (x) {
        return '<button type="button" class="chip" data-gv="kt-mon" data-v="' + x[0] + '" aria-pressed="' + (KT.mon === x[0]) + '">' + x[1] + "</button>";
      }).join("") + "</div>" +
      '<div class="gv-chon"><span class="loc__ten">Mỗi ngày học</span>' + [10, 20, 30].map(function (x) {
        return '<button type="button" class="chip" data-gv="kt-phut" data-v="' + x + '" aria-pressed="' + (KT.phut === x) + '">' + x + " phút</button>";
      }).join("") + "</div>" +
      '<button type="button" class="nut" data-gv="kt-luu">Bắt đầu lộ trình ›</button>';
  }
  function luuHoSo(capDo, batDau) {
    TD.hoSo = { mon: KT ? KT.mon : "ca-hai", phut: KT ? KT.phut : 20, capDo: capDo, batDau: batDau, ngayBatDau: homNay() };
    ghi();
  }

  /* ----- Trang một bài: 5 hoạt động ----- */
  const HOAT_DONG = [["hoc", "1. Học câu"], ["nghe", "2. Nghe hiểu"], ["noi", "3. Luyện nói"], ["chep", "4. Chép chính tả"], ["ghep", "5. Ghép câu"]];
  let BAI = null, TAB = "hoc", PHIEN = null;
  function trangBai(id) {
    const b = baiTheoId(id);
    if (!b) return '<div class="dau-muc"><h1>Không tìm thấy bài này</h1></div><a class="nut" href="#/giao-vien">Về lộ trình</a>';
    BAI = b; TAB = "hoc"; PHIEN = null;
    document.title = "Bài " + b.id + ". " + b.ten + " - Tiếng Anh cho giáo viên";
    const lt = DL.bai, vt = lt.indexOf(b), truoc = lt[vt - 1], sau = lt[vt + 1], t = tienDo(b);
    return '<a class="quay-lai" href="#/giao-vien">‹ Lộ trình của tôi</a>' +
      '<div class="dau-muc"><h1>Bài ' + esc(b.id) + ". " + esc(b.ten) + '</h1><p lang="en">' + esc(b.tenEn) + " · Trình độ " + esc(b.capDo) + "</p></div>" +
      '<div class="gv-tien-do-bai">' + thanh(t.pt) + "<span>" + t.hoc + "/" + t.n + " câu đã luyện · " + t.thuoc + " câu đã thuộc</span></div>" +
      '<div class="gv-tab" role="tablist">' + HOAT_DONG.map(function (h) {
        return '<button type="button" class="chip" role="tab" data-gv="tab" data-tab="' + h[0] + '" aria-pressed="' + (h[0] === "hoc") + '">' + h[1] + "</button>";
      }).join("") + "</div>" +
      '<div class="gv-hd" id="gv-hd"></div>' +
      '<nav class="bai-ke">' + (truoc ? '<a class="bai-ke__muc" href="#/giao-vien/bai/' + truoc.id + '"><span class="phu">‹ Bài trước</span><b>' + esc(truoc.id + ". " + truoc.ten) + "</b></a>" : "") +
      (sau ? '<a class="bai-ke__muc bai-ke__muc--sau" href="#/giao-vien/bai/' + sau.id + '"><span class="phu">Bài tiếp theo ›</span><b>' + esc(sau.id + ". " + sau.ten) + "</b></a>" : "") + "</nav>";
  }
  function veTab() {
    const o = document.getElementById("gv-hd");
    if (!o || !BAI) return;
    document.querySelectorAll('[data-gv="tab"]').forEach(function (n) { n.setAttribute("aria-pressed", String(n.dataset.tab === TAB)); });
    if (TAB === "hoc") {
      o.innerHTML = '<p class="phu">Bấm 🔊 để nghe, 🐢 để nghe chậm. Nghe rồi đọc theo to, rõ ràng 2 – 3 lần mỗi câu.</p><ol class="gv-cau-ds">' +
        BAI.cau.map(function (c, i) {
          const t = TD.the[BAI.id + "-" + i];
          return '<li><span class="gv-cau-nut">' + nutDoc(c[0]) + nutDoc(c[0], true) + '</span><span class="gv-cau-chu"><b lang="en">' + esc(c[0]) + "</b><span>" + esc(c[1]) + "</span></span>" +
            '<span class="gv-cham' + (t && t.box >= 3 ? " gv-cham--thuoc" : t && t.box >= 1 ? " gv-cham--hoc" : "") + '" title="' + (t && t.box >= 3 ? "Đã thuộc" : t && t.box >= 1 ? "Đang học" : "Chưa luyện") + '"></span></li>';
        }).join("") + "</ol>" +
        '<button type="button" class="nut" data-gv="tab" data-tab="nghe">Sang bước 2: Nghe hiểu ›</button>';
      return;
    }
    PHIEN = { ds: tronDs(idCau(BAI)), i: 0, dung: 0, loai: TAB, nguon: "bai", daCham: false };
    veCau();
  }

  /* ----- Phiên luyện (dùng chung cho bài học và ôn tập) ----- */
  function loaiHienTai() { return PHIEN.loaiTung ? PHIEN.loaiTung[PHIEN.i] : PHIEN.loai; }
  function oHD() { return document.getElementById(PHIEN && PHIEN.nguon === "on" ? "gv-on" : "gv-hd"); }
  function veCau() {
    const o = oHD();
    if (!o || !PHIEN) return;
    if (PHIEN.i >= PHIEN.ds.length) { veKetThuc(o); return; }
    PHIEN.daCham = false;
    const c = CAU[PHIEN.ds[PHIEN.i]], loai = loaiHienTai();
    const dau = '<div class="tro-choi__dau"><b>Câu ' + (PHIEN.i + 1) + "/" + PHIEN.ds.length + '</b><span class="phu">Đúng: ' + PHIEN.dung + "</span></div>";
    let than = "";
    if (loai === "nghe") {
      const lc = tronDs([c].concat(tronDs(Object.keys(CAU).map(function (k) { return CAU[k]; }).filter(function (x) { return x.bai === c.bai && x.id !== c.id; })).slice(0, 3)));
      PHIEN.lc = lc;
      than = '<div class="gv-hoi">' + nutDoc(c.en) + " " + nutDoc(c.en, true) + '</div><p class="phu">Nghe câu tiếng Anh, chọn nghĩa đúng.</p><div class="tc-lc">' +
        lc.map(function (x, i) { return '<button type="button" class="tc-nut" data-gv="chon" data-i="' + i + '"><span class="lc__nhan">' + "ABCD"[i] + '</span><span class="lc__chu">' + esc(x.vi) + "</span></button>"; }).join("") + "</div>";
      setTimeout(function () { doc1(c.en); }, 300);
    } else if (loai === "noi") {
      than = '<div class="gv-hoi gv-hoi--noi"><b lang="en">' + esc(c.en) + "</b> " + nutDoc(c.en) + nutDoc(c.en, true) + '</div><p class="phu">' + esc(c.vi) + "</p>" +
        (SR ? '<div class="hang-nut"><button type="button" class="nut gv-mic" data-gv="noi">🎤 Bấm rồi đọc câu trên</button></div><div id="gv-kq-noi"></div>'
          : '<p class="tc-goi-y">Trình duyệt này chưa hỗ trợ chấm phát âm (hãy dùng Chrome hoặc Edge). Thầy/Cô nghe mẫu, đọc theo rồi tự đánh giá:</p>' +
            '<div class="hang-nut"><button type="button" class="nut" data-gv="tu-cham" data-v="1">Tôi đọc được</button><button type="button" class="nut nut--phu" data-gv="tu-cham" data-v="0">Chưa được</button></div>');
    } else if (loai === "chep") {
      than = '<div class="gv-hoi">' + nutDoc(c.en) + " " + nutDoc(c.en, true) + '</div><p class="phu">Nghe rồi gõ lại câu tiếng Anh (không cần dấu câu, không phân biệt hoa thường). Gợi ý nghĩa: ' + esc(c.vi) + "</p>" +
        '<div class="gv-go"><input type="text" id="gv-o-chep" lang="en" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Gõ câu đã nghe"><button type="button" class="nut" data-gv="chep">Kiểm tra</button></div><div id="gv-kq-chep"></div>';
      setTimeout(function () { doc1(c.en); const i = document.getElementById("gv-o-chep"); if (i) i.focus(); }, 300);
    } else {
      const tu = c.en.split(/\s+/);
      let xao = tronDs(tu.map(function (w, i) { return i; }));
      if (tu.length > 1 && xao.every(function (x, i) { return x === i; })) xao = xao.reverse();
      PHIEN.ghep = { tu: tu, xao: xao, chon: [] };
      than = '<div class="gv-hoi">' + esc(c.vi) + '</div><p class="phu">Bấm lần lượt các từ để ghép thành câu tiếng Anh. Bấm vào từ đã ghép để bỏ ra.</p>' +
        '<div class="gv-ghep" id="gv-ghep-kq" lang="en"></div><div class="gv-ghep gv-ghep--kho" id="gv-ghep-kho" lang="en"></div>' +
        '<div class="hang-nut"><button type="button" class="nut" data-gv="ghep-kt">Kiểm tra</button></div><div id="gv-kq-ghep"></div>';
    }
    o.innerHTML = dau + than;
    if (loai === "ghep") veGhep();
  }
  function veGhep() {
    const g = PHIEN.ghep;
    document.getElementById("gv-ghep-kq").innerHTML = g.chon.length ? g.chon.map(function (vt, k) { return '<button type="button" class="gv-tu" data-gv="ghep-bo" data-k="' + k + '">' + esc(g.tu[vt]) + "</button>"; }).join("") : '<span class="phu">Câu của Thầy/Cô sẽ hiện ở đây…</span>';
    document.getElementById("gv-ghep-kho").innerHTML = g.xao.filter(function (vt) { return g.chon.indexOf(vt) < 0; }).map(function (vt) { return '<button type="button" class="gv-tu" data-gv="ghep-chon" data-vt="' + vt + '">' + esc(g.tu[vt]) + "</button>"; }).join("");
  }
  function nutTiep() { return '<button type="button" class="nut nut--nho" data-gv="tiep">' + (PHIEN.i + 1 < PHIEN.ds.length ? "Câu tiếp ›" : "Xem kết quả ›") + "</button>"; }
  function ghiKetQua(dung) {
    if (PHIEN.daCham) return;
    PHIEN.daCham = true;
    if (dung) PHIEN.dung++;
    chamThe(PHIEN.ds[PHIEN.i], dung);
    const o = document.querySelector(".gv-tien-do-bai");
    if (o && BAI) { const t = tienDo(BAI); o.innerHTML = thanh(t.pt) + "<span>" + t.hoc + "/" + t.n + " câu đã luyện · " + t.thuoc + " câu đã thuộc</span>"; }
  }
  function veKetThuc(o) {
    const pt = PHIEN.ds.length ? PHIEN.dung / PHIEN.ds.length : 0;
    const sau = PHIEN.nguon === "bai" ? HOAT_DONG[HOAT_DONG.findIndex(function (h) { return h[0] === PHIEN.loai; }) + 1] : null;
    o.innerHTML = '<div class="do-vui__kq"><b>' + PHIEN.dung + "/" + PHIEN.ds.length + "</b><span>câu đúng</span></div><p>" +
      (pt === 1 ? "Tuyệt vời! Thầy/Cô làm đúng hết." : pt >= 0.7 ? "Rất tốt! Những câu chưa đúng sẽ được nhắc lại trong phần Ôn tập." : "Không sao, các câu chưa đúng sẽ quay lại trong phần Ôn tập để Thầy/Cô luyện thêm.") + "</p>" +
      '<div class="hang-nut"><button type="button" class="nut nut--phu" data-gv="lam-lai">Luyện lại</button>' +
      (sau ? '<button type="button" class="nut" data-gv="tab" data-tab="' + sau[0] + '">Sang bước ' + sau[1] + " ›</button>" : '<a class="nut" href="#/giao-vien">Về lộ trình ›</a>') + "</div>";
  }

  /* ----- Ôn tập hôm nay ----- */
  function trangOnTap() {
    document.title = "Ôn tập hôm nay - Tiếng Anh cho giáo viên";
    const ds = canOn().sort(function (a, b) { return (TD.the[a].box - TD.the[b].box) || (TD.the[a].due < TD.the[b].due ? -1 : 1); }).slice(0, 20);
    const dau = '<a class="quay-lai" href="#/giao-vien">‹ Lộ trình của tôi</a><div class="dau-muc"><h1>Ôn tập hôm nay</h1><p>Các câu đến hạn ôn, câu dễ quên được ưu tiên. Mỗi câu một kiểu luyện khác nhau.</p></div>';
    if (!ds.length) { PHIEN = null; return dau + '<div class="trong">Hôm nay Thầy/Cô không còn câu nào cần ôn. Hãy học tiếp bài mới nhé!</div><a class="nut" href="#/giao-vien">Về lộ trình ›</a>'; }
    const kieu = SR ? ["nghe", "chep", "ghep", "noi"] : ["nghe", "chep", "ghep"];
    PHIEN = { ds: tronDs(ds), i: 0, dung: 0, nguon: "on", daCham: false };
    PHIEN.loaiTung = PHIEN.ds.map(function (x, i) { return kieu[i % kieu.length]; });
    return dau + '<div class="gv-hd" id="gv-on"></div>';
  }

  /* ----- Cài đặt, nhắc lịch, sao lưu ----- */
  function maHoa(s) { return btoa(unescape(encodeURIComponent(s))); }
  function giaiMa(s) { return decodeURIComponent(escape(atob(s))); }
  function linkIcs() {
    const gio = String(TD.nhac || "19:30").split(":"), phut = (TD.hoSo && TD.hoSo.phut) || 20;
    const d = new Date(); d.setDate(d.getDate() + 1);
    const ngay = ngayChu(d).replace(/-/g, "");
    const t = gio[0].padStart(2, "0") + gio[1].padStart(2, "0") + "00";
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Goc Ly Tin//Tieng Anh GV//VI", "BEGIN:VEVENT",
      "UID:gv-" + Date.now() + "@thayphongpq.github.io", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
      "DTSTART:" + ngay + "T" + t, "DURATION:PT" + phut + "M", "RRULE:FREQ=DAILY",
      "SUMMARY:Học tiếng Anh cho giáo viên (" + phut + " phút)", "DESCRIPTION:" + LINK_TRANG, "URL:" + LINK_TRANG,
      "BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY", "DESCRIPTION:Đến giờ học tiếng Anh rồi Thầy/Cô ơi!", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const ketThuc = new Date(d.getFullYear(), d.getMonth(), d.getDate(), +gio[0], +gio[1] + phut);
    const t2 = String(ketThuc.getHours()).padStart(2, "0") + String(ketThuc.getMinutes()).padStart(2, "0") + "00";
    const gg = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent("Học tiếng Anh cho giáo viên (" + phut + " phút)") +
      "&details=" + encodeURIComponent(LINK_TRANG) + "&dates=" + ngay + "T" + t + "/" + ngay + "T" + t2 + "&ctz=Asia/Ho_Chi_Minh&recur=" + encodeURIComponent("RRULE:FREQ=DAILY");
    return { ics: "data:text/calendar;charset=utf-8," + encodeURIComponent(ics), gg: gg };
  }
  function trangCaiDat() {
    document.title = "Cài đặt - Tiếng Anh cho giáo viên";
    const hs = TD.hoSo || { mon: "ca-hai", phut: 20 }, l = linkIcs();
    const chon = function (nhan, gv, ds, ht) {
      return '<div class="gv-chon"><span class="loc__ten">' + nhan + "</span>" + ds.map(function (x) {
        return '<button type="button" class="chip" data-gv="' + gv + '" data-v="' + x[0] + '" aria-pressed="' + (String(ht) === String(x[0])) + '">' + x[1] + "</button>";
      }).join("") + "</div>";
    };
    return '<a class="quay-lai" href="#/giao-vien">‹ Lộ trình của tôi</a><div class="dau-muc"><h1>Cài đặt</h1></div>' +
      khoi("Lộ trình", chon("Môn dạy", "cd-mon", [["ly", "Vật lý"], ["tin", "Tin học"], ["ca-hai", "Cả hai"]], hs.mon) + chon("Mỗi ngày", "cd-phut", [[10, "10 phút"], [20, "20 phút"], [30, "30 phút"]], hs.phut)) +
      khoi("Giọng đọc", chon("Giọng", "cd-giong", [["en-US", "Anh – Mỹ"], ["en-GB", "Anh – Anh"]], TD.giong.giong) + chon("Tốc độ", "cd-toc", [[0.75, "Chậm"], [0.9, "Vừa"], [1, "Bình thường"]], TD.giong.toc) +
        '<button type="button" class="nut nut--phu" data-gv="doc" data-chu="Good morning, everyone. Today we are going to learn about motion.">🔊 Nghe thử</button>' +
        (coGiong() ? "" : '<p class="tc-goi-y">Trình duyệt này không có giọng đọc tiếng Anh. Hãy dùng Chrome, Edge hoặc Safari.</p>')) +
      khoi("Nhắc lịch học mỗi ngày", '<div class="gv-chon"><span class="loc__ten">Giờ học</span><input type="time" id="gv-gio" value="' + esc(TD.nhac) + '"></div>' +
        '<div class="hang-nut"><a class="nut" id="gv-gg" target="_blank" rel="noopener" href="' + esc(l.gg) + '">Thêm vào Google Lịch ↗</a>' +
        '<a class="nut nut--phu" id="gv-ics" download="nhac-hoc-tieng-anh.ics" href="' + esc(l.ics) + '">Tải lịch nhắc cho điện thoại / Outlook</a></div>' +
        '<p class="phu">Điện thoại sẽ báo đúng giờ mỗi ngày, bấm vào thông báo là mở trang học.</p>') +
      khoi("Sao lưu tiến độ", '<p class="phu" style="margin-top:-6px">Tiến độ lưu trên máy này. Muốn học tiếp trên máy khác: bấm "Tạo mã sao lưu", sao chép mã, rồi dán vào ô "Khôi phục" trên máy kia.</p>' +
        '<div class="hang-nut"><button type="button" class="nut nut--phu" data-gv="xuat">Tạo mã sao lưu</button><button type="button" class="nut nut--phu" data-gv="chep-ma" hidden>Sao chép mã</button></div>' +
        '<textarea id="gv-ma" class="py-vao" rows="3" readonly hidden aria-label="Mã sao lưu"></textarea>' +
        '<div style="height:12px"></div><textarea id="gv-ma-vao" class="py-vao" rows="3" placeholder="Dán mã sao lưu vào đây…" aria-label="Mã khôi phục"></textarea>' +
        '<div class="hang-nut"><button type="button" class="nut" data-gv="nhap">Khôi phục</button></div><p id="gv-bao" class="gui-diem" role="status"></p>') +
      khoi("Làm lại từ đầu", '<button type="button" class="nut nut--phu" data-gv="xoa">Xóa toàn bộ tiến độ trên máy này</button>');
  }

  /* ----- Điều hướng trong khóa học ----- */
  function trang(phu) {
    PHIEN = null; KT = null; BAI = null;
    phu = String(phu || "");
    if (phu === "kiem-tra") return trangKiemTra();
    if (phu === "on-tap") return trangOnTap();
    if (phu === "cai-dat") return trangCaiDat();
    if (phu.indexOf("bai/") === 0) return trangBai(phu.slice(4));
    return trangChu();
  }
  function sauKhiVe() {
    if (KT) veKiemTra();
    if (BAI) veTab();
    if (PHIEN && PHIEN.nguon === "on") veCau();
  }
  function veLai() { const app = document.getElementById("app"); const h = location.hash.replace(/^#\/giao-vien\/?/, ""); app.innerHTML = trang(h); sauKhiVe(); }

  /* ----- Xử lý bấm nút ----- */
  let dangNghe = null;
  function chamNoi(nut) {
    const c = CAU[PHIEN.ds[PHIEN.i]], o = document.getElementById("gv-kq-noi");
    if (dangNghe) { try { dangNghe.stop(); } catch (e) { /* bỏ qua */ } return; }
    const r = new SR();
    r.lang = TD.giong.giong; r.interimResults = false; r.maxAlternatives = 5;
    dangNghe = r;
    nut.textContent = "⏺ Đang nghe… (bấm để dừng)";
    nut.classList.add("gv-mic--dang");
    o.innerHTML = "";
    r.onresult = function (e) {
      let tot = null;
      for (let k = 0; k < e.results[0].length; k++) {
        const kq = soSanh(c.en, e.results[0][k].transcript);
        if (!tot || kq.diem > tot.diem) { tot = kq; tot.noi = e.results[0][k].transcript; }
      }
      const dat = tot.diem >= 0.75;
      ghiKetQua(dat);
      o.innerHTML = '<p class="tc-goi-y">' + (dat ? "Tốt lắm! " : "Chưa rõ lắm, Thầy/Cô nghe mẫu rồi thử lại nhé. ") + "Độ khớp: <b>" + Math.round(tot.diem * 100) + "%</b><br>Máy nghe được: <i lang=\"en\">" + esc(tot.noi) + "</i><br>Câu mẫu: " + toMau(tot) + "</p>" +
        '<div class="hang-nut">' + nutTiep() + "</div>";
    };
    r.onerror = function (e) {
      o.innerHTML = '<p class="tc-goi-y">' + (e.error === "not-allowed" || e.error === "service-not-allowed" ? "Thầy/Cô cần cho phép trang dùng micro (bấm biểu tượng ổ khóa cạnh địa chỉ trang → Micro → Cho phép)." : e.error === "no-speech" ? "Máy chưa nghe thấy tiếng. Thầy/Cô bấm lại rồi đọc to, rõ hơn nhé." : "Chưa nhận được giọng nói (" + esc(e.error) + "). Thử lại nhé.") + "</p>" +
        '<div class="hang-nut"><button type="button" class="nut nut--phu" data-gv="tu-cham" data-v="0">Bỏ qua câu này</button></div>';
    };
    r.onend = function () { dangNghe = null; nut.textContent = "🎤 Bấm rồi đọc câu trên"; nut.classList.remove("gv-mic--dang"); };
    try { r.start(); } catch (e) { dangNghe = null; }
  }
  function chamChep() {
    const c = CAU[PHIEN.ds[PHIEN.i]], o = document.getElementById("gv-kq-chep"), i = document.getElementById("gv-o-chep");
    if (!i || PHIEN.daCham) return;
    const kq = soSanh(c.en, i.value), dat = kq.diem >= 0.9;
    ghiKetQua(dat);
    i.disabled = true;
    o.innerHTML = '<p class="tc-goi-y">' + (dat ? "Chính xác! " : "Chưa đúng hết. ") + "Câu đúng: <b lang=\"en\">" + esc(c.en) + "</b><br>" + toMau(kq) + "</p>" + '<div class="hang-nut">' + nutTiep() + "</div>";
  }
  document.addEventListener("click", function (e) {
    const n = e.target.closest("[data-gv]");
    if (!n || !document.getElementById("app").contains(n)) return;
    const v = n.dataset.gv;
    if (v === "doc" || v === "doc-cham") { doc1(n.dataset.chu, v === "doc-cham"); return; }
    if (v === "bat-dau-nhanh") { KT = { mon: "ca-hai", phut: 20 }; luuHoSo("Tự chọn", "A1"); KT = null; veLai(); return; }
    if (v === "kt-chon" && KT) {
      const c = DL.kiemTra[KT.i], chon = Number(n.dataset.i);
      if (chon === c.dung) KT.dung++;
      document.querySelectorAll('[data-gv="kt-chon"]').forEach(function (b) { b.disabled = true; if (Number(b.dataset.i) === c.dung) b.classList.add("tc-nut--dung"); else if (b === n) b.classList.add("tc-nut--sai"); });
      setTimeout(function () { KT.i++; veKiemTra(); }, 700);
      return;
    }
    if ((v === "kt-mon" || v === "kt-phut") && KT) {
      if (v === "kt-mon") KT.mon = n.dataset.v; else KT.phut = Number(n.dataset.v);
      document.querySelectorAll('[data-gv="' + v + '"]').forEach(function (b) { b.setAttribute("aria-pressed", String(b === n)); });
      return;
    }
    if (v === "kt-luu" && KT) { luuHoSo(KT.capDo.ten, KT.capDo.batDau); location.hash = "#/giao-vien"; return; }
    if (v === "tab" && BAI) { TAB = n.dataset.tab; veTab(); const t = document.querySelector(".gv-tab"); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (!PHIEN && ["chon", "noi", "tu-cham", "chep", "ghep-chon", "ghep-bo", "ghep-kt", "tiep", "lam-lai"].indexOf(v) >= 0) return;
    if (v === "chon") {
      if (PHIEN.daCham) return;
      const c = CAU[PHIEN.ds[PHIEN.i]], x = PHIEN.lc[Number(n.dataset.i)], dat = x === c;
      ghiKetQua(dat);
      document.querySelectorAll('[data-gv="chon"]').forEach(function (b) { const y = PHIEN.lc[Number(b.dataset.i)]; b.disabled = true; if (y === c) b.classList.add("tc-nut--dung"); else if (b === n) b.classList.add("tc-nut--sai"); });
      n.closest(".gv-hd").insertAdjacentHTML("beforeend", '<p class="tc-goi-y"><b lang="en">' + esc(c.en) + "</b> " + nutDoc(c.en) + "<br>" + esc(c.vi) + '</p><div class="hang-nut">' + nutTiep() + "</div>");
      return;
    }
    if (v === "noi") { chamNoi(n); return; }
    if (v === "tu-cham") { ghiKetQua(n.dataset.v === "1"); PHIEN.i++; veCau(); return; }
    if (v === "chep") { chamChep(); return; }
    if (v === "ghep-chon" && !PHIEN.daCham) { PHIEN.ghep.chon.push(Number(n.dataset.vt)); veGhep(); return; }
    if (v === "ghep-bo" && !PHIEN.daCham) { PHIEN.ghep.chon.splice(Number(n.dataset.k), 1); veGhep(); return; }
    if (v === "ghep-kt" && !PHIEN.daCham) {
      const g = PHIEN.ghep, c = CAU[PHIEN.ds[PHIEN.i]];
      const dat = tachTu(g.chon.map(function (vt) { return g.tu[vt]; }).join(" ")).join(" ") === tachTu(c.en).join(" ");
      ghiKetQua(dat);
      doc1(c.en);
      document.getElementById("gv-kq-ghep").innerHTML = '<p class="tc-goi-y">' + (dat ? "Chính xác! " : "Chưa đúng. Câu đúng là: ") + '<b lang="en">' + esc(c.en) + "</b></p>" + '<div class="hang-nut">' + nutTiep() + "</div>";
      return;
    }
    if (v === "tiep") { PHIEN.i++; veCau(); return; }
    if (v === "lam-lai") { if (PHIEN.nguon === "on") veLai(); else veTab(); return; }
    // Cài đặt
    if (v === "cd-mon" || v === "cd-phut") {
      TD.hoSo = TD.hoSo || { capDo: "Tự chọn", batDau: "A1", ngayBatDau: homNay(), mon: "ca-hai", phut: 20 };
      if (v === "cd-mon") TD.hoSo.mon = n.dataset.v; else TD.hoSo.phut = Number(n.dataset.v);
      ghi(); veLai(); return;
    }
    if (v === "cd-giong" || v === "cd-toc") {
      if (v === "cd-giong") TD.giong.giong = n.dataset.v; else TD.giong.toc = Number(n.dataset.v);
      ghi(); veLai(); doc1("Good morning, everyone."); return;
    }
    if (v === "xuat") {
      const o = document.getElementById("gv-ma");
      o.value = maHoa(JSON.stringify(TD)); o.hidden = false; o.select();
      document.querySelector('[data-gv="chep-ma"]').hidden = false;
      return;
    }
    if (v === "chep-ma") {
      const o = document.getElementById("gv-ma"), bao = document.getElementById("gv-bao");
      (navigator.clipboard ? navigator.clipboard.writeText(o.value) : Promise.reject()).then(function () { bao.className = "gui-diem gui-diem--xong"; bao.textContent = "Đã sao chép mã. Thầy/Cô dán vào Zalo hoặc email để mở trên máy khác."; },
        function () { o.select(); bao.className = "gui-diem"; bao.textContent = "Thầy/Cô bấm giữ vào ô mã rồi chọn Sao chép."; });
      return;
    }
    if (v === "nhap") {
      const bao = document.getElementById("gv-bao");
      try {
        const x = JSON.parse(giaiMa(document.getElementById("gv-ma-vao").value.trim()));
        if (!x || typeof x !== "object" || typeof x.the !== "object") throw new Error("sai");
        TD = Object.assign(macDinh(), x); ghi();
        bao.className = "gui-diem gui-diem--xong"; bao.textContent = "Đã khôi phục tiến độ.";
      } catch (loi) { bao.className = "gui-diem gui-diem--loi"; bao.textContent = "Mã không hợp lệ. Thầy/Cô kiểm tra lại đã dán đủ mã chưa."; }
      return;
    }
    if (v === "xoa") {
      if (n.dataset.lan === "2") { TD = macDinh(); ghi(); location.hash = "#/giao-vien"; }
      else { n.dataset.lan = "2"; n.textContent = "Bấm lần nữa để xóa hẳn (không lấy lại được)"; }
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target && e.target.id === "gv-o-chep") { e.preventDefault(); chamChep(); }
  });
  document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "gv-gio") {
      TD.nhac = e.target.value || "19:30"; ghi();
      const l = linkIcs(), a = document.getElementById("gv-ics"), g = document.getElementById("gv-gg");
      if (a) a.href = l.ics;
      if (g) g.href = l.gg;
    }
  });

  window.GiaoVien = { trang: trang, sauKhiVe: sauKhiVe, soBai: DL.bai.length, soCau: Object.keys(CAU).length };
})();
