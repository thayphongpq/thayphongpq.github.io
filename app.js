/* Phần xử lý của trang web. Thầy/cô không cần sửa tệp này. */
(function () {
  "use strict";

  const app = document.getElementById("app");

  if (typeof THONG_TIN === "undefined" || typeof VIDEO === "undefined" || typeof TAI_LIEU === "undefined") {
    app.innerHTML = '<div class="loi"><h2>Tệp noi-dung.js đang có lỗi</h2>' +
      "<p>Hãy xem lại lần sửa gần nhất: có thể thiếu dấu ngoặc kép, dấu phẩy hoặc dấu ngoặc. " +
      "Sửa lại đúng dạng như các dòng khác là trang sẽ chạy bình thường.</p></div>";
    return;
  }

  const LO = typeof LO_TRINH === "undefined" ? [] : LO_TRINH;
  const DE = typeof DE_THI === "undefined" ? [] : DE_THI;
  const LK = typeof LIEN_KET === "undefined" ? [] : LIEN_KET;
  const TN = window.TracNghiem;

  /* ----- Tiện ích ----- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function boDau(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  }
  function youtubeId(s) {
    s = String(s || "").trim();
    if (/^[\w-]{11}$/.test(s)) return s;
    const m = s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : "";
  }
  function linkAnToan(s) {
    s = String(s || "").trim();
    return /^https?:\/\//i.test(s) ? s : "";
  }
  function theoNgay(a, b) {
    return String(b.ngay || "").localeCompare(String(a.ngay || ""));
  }
  function mauMon(mon, lop) {
    if (lop === "HSG") return "mau-hsg";
    return mon === "Tin học" ? "mau-tin" : "mau-ly";
  }
  // Bài HSG chia hai cấp: THCS và THPT (không ghi cap thì tính là THPT).
  function capCua(x) {
    return String(x.cap || "").trim().toUpperCase() === "THCS" ? "THCS" : "THPT";
  }
  function tenLop(x) {
    return x.lop === "HSG" ? "HSG " + capCua(x) : "Lớp " + x.lop;
  }
  // Thứ tự học trong thư mục HSG: bài cũ trước, bài mới sau.
  function theoThuTuHoc(a, b) {
    return String(a.ngay || "").localeCompare(String(b.ngay || "")) || b.thuTu - a.thuTu;
  }

  const THU_MUC = Object.assign({
    THCS: { ten: "HSG THCS", moTa: "Ôn thi học sinh giỏi cấp THCS.", playlist: "" },
    THPT: { ten: "HSG THPT", moTa: "Ôn thi học sinh giỏi cấp THPT.", playlist: "" }
  }, typeof THU_MUC_HSG === "undefined" ? {} : THU_MUC_HSG);

  function taoSlug(ten, bang) {
    const goc = boDau(ten).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "bai";
    bang[goc] = (bang[goc] || 0) + 1;
    return bang[goc] > 1 ? goc + "-" + bang[goc] : goc;
  }
  function driveId(link) {
    const m = String(link || "").match(/drive\.google\.com\/.*(?:\/d\/|[?&]id=)([\w-]{20,})/);
    return m ? m[1] : "";
  }
  function duongMon(mon) { return mon === "Tin học" ? "tin-hoc" : "vat-ly"; }
  function laThiThu(d) { return boDau(d.loai).indexOf("thi thu") >= 0; }

  const slugVideo = {}, slugTL = {}, slugDe = {};
  const dsVideo = VIDEO.map(function (v, i) {
    return Object.assign({}, v, { thuTu: i, id: youtubeId(v.youtube), slug: taoSlug(v.ten, slugVideo) });
  }).sort(theoNgay);
  const dsTaiLieu = TAI_LIEU.map(function (t, i) {
    return Object.assign({}, t, { thuTu: i, slug: taoSlug(t.ten, slugTL) });
  }).sort(theoNgay);
  const dsDe = DE.map(function (d, i) {
    return Object.assign({}, d, { thuTu: i, slug: taoSlug(d.ten, slugDe) });
  }).sort(theoNgay);

  /* ----- Mẩu giao diện ----- */
  function theVideo(v) {
    const mau = mauMon(v.mon, v.lop);
    const chu = '<div class="the-video__chu"><h3>' + esc(v.ten) + '</h3><div class="phu">' +
      esc(v.mon) + " · " + esc(tenLop(v)) + (v.chuDe ? " · " + esc(v.chuDe) : "") + "</div></div>";
    if (!v.id) {
      return '<div class="the-video ' + mau + '"><div class="anh-video">Sắp có video</div>' + chu + "</div>";
    }
    return '<a class="the-video ' + mau + '" href="#/video/' + esc(v.slug) + '"><div class="anh-video">' +
      '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg"><span class="nut-phat"></span></div>' + chu + "</a>";
  }
  function luoiVideo(ds, rong) {
    return ds.length ? '<div class="luoi-video">' + ds.map(theVideo).join("") + "</div>" : '<div class="trong">' + esc(rong || "Chưa có video ở mục này.") + "</div>";
  }
  function dongTaiLieu(t) {
    const link = linkAnToan(t.link);
    const nut = driveId(link) ? '<a class="ds__mo" href="#/doc/' + esc(t.slug) + '">Đọc trực tuyến ›</a>'
      : link ? '<a class="ds__mo" target="_blank" rel="noopener" href="' + esc(link) + '">Mở tài liệu ↗</a>'
      : '<span class="sap-co">Sắp có</span>';
    return '<li class="' + mauMon(t.mon, t.lop) + '"><span class="ds__loai">' + esc(t.loai || "Tài liệu") + "</span>" +
      '<span class="ds__ten"><b>' + esc(t.ten) + '</b><span class="phu">' + esc(t.mon) + " · " + esc(tenLop(t)) + "</span></span>" + nut + "</li>";
  }
  function dsTL(ds, rong) {
    return ds.length ? '<ul class="ds">' + ds.map(dongTaiLieu).join("") + "</ul>" : '<div class="trong">' + esc(rong || "Chưa có tài liệu ở mục này.") + "</div>";
  }
  function dongDe(d) {
    const thiThu = laThiThu(d);
    return '<li class="' + (thiThu ? "mau-hsg" : mauMon(d.mon, d.lop)) + '"><span class="ds__loai">' + esc(thiThu ? "Thi thử" : (d.loai || "Luyện tập")) + "</span>" +
      '<span class="ds__ten"><b>' + esc(d.ten) + '</b><span class="phu">' + esc(d.mon) + " · " + esc(tenLop(d)) +
      (d.thoiGian ? " · " + esc(d.thoiGian) + " phút" : "") + "</span></span>" +
      (d.tep ? '<a class="ds__mo" href="#/lam-bai/' + esc(d.slug) + '">Làm bài ›</a>' : '<span class="sap-co">Sắp có</span>') + "</li>";
  }
  function dsDeHTML(ds, rong) {
    return ds.length ? '<ul class="ds">' + ds.map(dongDe).join("") + "</ul>" : '<div class="trong">' + esc(rong || "Chưa có đề ở mục này.") + "</div>";
  }
  function khoi(tieuDe, noiDung, link, chuLink, id) {
    return '<section class="khoi"' + (id ? ' id="' + id + '"' : "") + '><div class="khoi__dau"><h2>' + esc(tieuDe) + "</h2>" +
      (link ? '<a href="' + esc(link) + '"' + (/^https?:/.test(link) ? ' target="_blank" rel="noopener"' : "") + ">" + chuLink + "</a>" : "") +
      "</div>" + noiDung + "</section>";
  }
  function dauMuc(tieuDe, moTa) {
    return '<div class="dau-muc"><h1>' + esc(tieuDe) + "</h1>" + (moTa ? "<p>" + esc(moTa) + "</p>" : "") + "</div>";
  }
  function hangLoc(ten, khoa, luaChon) {
    const nut = [["", "Tất cả"]].concat(luaChon.map(function (x) { return [x, khoa === "lop" ? "Lớp " + x : x]; }));
    return '<div class="loc__hang"><span class="loc__ten">' + ten + "</span>" + nut.map(function (n) {
      return '<button type="button" class="chip" data-loc="' + khoa + '" data-giatri="' + esc(n[0]) + '" aria-pressed="' + (boLoc[khoa] === n[0]) + '">' + esc(n[1]) + "</button>";
    }).join("") + "</div>";
  }
  function duyNhat(ds, khoa) {
    return ds.map(function (x) { return x[khoa]; }).filter(function (x, i, a) { return x && a.indexOf(x) === i; });
  }

  /* ----- Các trang ----- */
  let boLoc = { lop: "", loai: "", mon: "" };

  function trangChu() {
    document.title = THONG_TIN.tenTrang;
    return '<section class="mo-dau"><div><h1>Học <em>Vật lý</em>, <b>Tin học</b> và chinh phục đề HSG</h1>' +
      "<p>" + esc(THONG_TIN.khauHieu) + "</p>" +
      '<p class="mo-dau__gv">' + esc(THONG_TIN.giaoVien) + " · " + esc(THONG_TIN.truong) + "</p>" +
      '<div class="hang-nut mo-dau__nut"><a class="nut" href="#/vat-ly/12">Thi thử tốt nghiệp THPT ›</a><a class="nut nut--phu" href="#/hsg">Ôn thi học sinh giỏi ›</a></div>' +
      "</div>" + hinhSong() + "</section>" +
      '<section class="ba-cua" aria-label="Các môn học">' +
      cua("mau-ly", "Vật lý", "#/vat-ly", "Trắc nghiệm online có chấm điểm, tài liệu bài giảng, video và thi thử tốt nghiệp THPT.") +
      cua("mau-tin", "Tin học", "#/tin-hoc", "Lập trình Python, cơ sở dữ liệu, tin học ứng dụng; trắc nghiệm online và thi thử.") +
      '<article class="cua mau-hsg"><h2><a href="#/hsg">Ôn thi HSG</a></h2><p>Video chuyên đề, tài liệu và đề thi học sinh giỏi cấp THCS và THPT.</p>' +
      '<div class="cua__lop"><a href="#/hsg/thcs">HSG THCS</a><a href="#/hsg/thpt">HSG THPT</a></div></article></section>' +
      khoi("Thi thử tốt nghiệp THPT", '<div class="thi-thu-mon"><a class="nut nut--phu" href="#/vat-ly/12">Vật lý 12 ›</a><a class="nut nut--phu" href="#/tin-hoc/12">Tin học 12 ›</a></div>' +
        dsDeHTML(dsDe.filter(laThiThu).slice(0, 5), "Đề thi thử đang được biên soạn, sắp có."), "", "", "thi-thu") +
      khoi("Video mới đăng", luoiVideo(dsVideo.slice(0, 4)), "#/video", "Xem tất cả") +
      (dsDe.some(function (d) { return !laThiThu(d); }) ? khoi("Trắc nghiệm luyện tập mới", dsDeHTML(dsDe.filter(function (d) { return !laThiThu(d); }).slice(0, 5))) : "") +
      (dsTaiLieu.length ? khoi("Tài liệu mới", dsTL(dsTaiLieu.slice(0, 6))) : "") +
      lienKetHTML();
  }
  function lienKetHTML() {
    const ds = LK.filter(function (x) { return linkAnToan(x.link); });
    if (!ds.length) return "";
    return khoi("Liên kết hữu ích", '<div class="lien-ket">' + ds.map(function (x) {
      return '<a class="lien-ket__muc" target="_blank" rel="noopener" href="' + esc(linkAnToan(x.link)) + '"><b>' + esc(x.ten) + " ↗</b>" +
        (x.moTa ? '<span class="phu">' + esc(x.moTa) + "</span>" : "") + "</a>";
    }).join("") + "</div>");
  }
  function cua(mau, ten, link, moTa) {
    return '<article class="cua ' + mau + '"><h2><a href="' + link + '">' + ten + "</a></h2><p>" + moTa + '</p><div class="cua__lop">' +
      ["10", "11", "12"].map(function (l) { return '<a href="' + link + "/" + l + '">Lớp ' + l + "</a>"; }).join("") + "</div></article>";
  }
  function hinhSong() {
    return '<svg viewBox="0 0 440 200" role="img" aria-label="Sóng hình sin chuyển dần thành các bit 0 và 1">' +
      '<defs><pattern id="o" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#e3dccd"/></pattern></defs>' +
      '<rect width="440" height="200" rx="10" fill="#fff"/><rect width="440" height="200" rx="10" fill="url(#o)"/>' +
      '<path d="M0 100 Q30 20 60 100 T120 100 T180 100 T240 100" fill="none" stroke="#c8441b" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M240 100H262V50H302V150H342V50H382V150H440" fill="none" stroke="#0b7a75" stroke-width="4" stroke-linejoin="round"/>' +
      '<g font-family="Consolas,monospace" font-size="20" font-weight="700" fill="#0b7a75" text-anchor="middle"><text x="282" y="40">1</text><text x="322" y="175">0</text><text x="362" y="40">1</text><text x="410" y="175">0</text></g>' +
      "</svg>";
  }
  function trangMon(mon, phu) {
    if (phu) return ["10", "11", "12"].indexOf(phu) >= 0 ? trangLop(mon, phu) : khongThay();
    document.title = mon + " - " + THONG_TIN.tenTrang;
    return dauMuc(mon, "Chọn khối lớp để vào học.") + '<div class="thu-muc thu-muc--ba">' + ["10", "11", "12"].map(function (l) {
      const hop = function (x) { return x.mon === mon && x.lop === l; };
      return '<a class="thu-muc__the ' + mauMon(mon, l) + '" href="#/' + duongMon(mon) + "/" + l + '"><span class="thu-muc__cap">Lớp ' + l + "</span>" +
        "<h2>" + esc(mon + " " + l) + "</h2><p>" + (l === "12" ? "Trắc nghiệm online, tài liệu, video và thi thử tốt nghiệp THPT." : "Trắc nghiệm online, tài liệu bài giảng và video.") + "</p>" +
        '<span class="phu">' + dsDe.filter(hop).length + " đề · " + dsTaiLieu.filter(hop).length + " tài liệu · " + dsVideo.filter(hop).length + " video</span>" +
        '<span class="thu-muc__vao">Vào lớp ' + l + " ›</span></a>";
    }).join("") + "</div>";
  }
  function trangLop(mon, lop) {
    document.title = mon + " " + lop + " - " + THONG_TIN.tenTrang;
    const hop = function (x) { return x.mon === mon && x.lop === lop; };
    const de = dsDe.filter(hop);
    const muc = [];
    if (lop === "12") muc.push(["thi-thu", "Thi thử tốt nghiệp THPT", dsDeHTML(de.filter(laThiThu), "Đề thi thử đang được biên soạn, sắp có.")]);
    muc.push(["trac-nghiem", "Trắc nghiệm luyện tập", dsDeHTML(de.filter(function (d) { return !laThiThu(d); }), "Đề luyện tập đang được biên soạn, sắp có.")]);
    muc.push(["tai-lieu", "Tài liệu bài giảng", dsTL(dsTaiLieu.filter(hop), "Tài liệu bài giảng đang được cập nhật.")]);
    muc.push(["video", "Video bài giảng", luoiVideo(dsVideo.filter(hop), "Video bài giảng sắp có.")]);
    return '<a class="quay-lai" href="#/' + duongMon(mon) + '">‹ ' + esc(mon) + "</a>" +
      dauMuc(mon + " " + lop, lop === "12" ? "Luyện trắc nghiệm, đọc bài giảng, xem video và thi thử tốt nghiệp THPT ngay trên trang." : "Luyện trắc nghiệm, đọc bài giảng và xem video ngay trên trang.") +
      '<nav class="muc-luc" aria-label="Các phần của lớp">' + muc.map(function (m) {
        return '<button type="button" class="chip" data-cuon="' + m[0] + '">' + esc(m[1]) + "</button>";
      }).join("") +
      ["10", "11", "12"].filter(function (l) { return l !== lop; }).map(function (l) {
        return '<a class="muc-luc__lop" href="#/' + duongMon(mon) + "/" + l + '">' + esc(mon) + " " + l + " ›</a>";
      }).join("") + "</nav>" +
      muc.map(function (m) { return khoi(m[1], m[2], "", "", m[0]); }).join("");
  }
  function docTaiLieu(slug) {
    const t = dsTaiLieu.find(function (x) { return x.slug === slug; });
    const id = t && driveId(t.link);
    if (!id) return khongThay();
    document.title = t.ten + " - " + THONG_TIN.tenTrang;
    const veLai = t.lop === "HSG" ? "#/hsg/" + capCua(t).toLowerCase() : "#/" + duongMon(t.mon) + "/" + t.lop;
    return '<a class="quay-lai" href="' + veLai + '">‹ Quay lại</a>' + dauMuc(t.ten, t.mon + " · " + tenLop(t)) +
      '<div class="khung-doc"><iframe src="https://drive.google.com/file/d/' + id + '/preview" title="' + esc(t.ten) + '" allow="autoplay"></iframe></div>' +
      '<a class="nut" target="_blank" rel="noopener" href="' + esc(linkAnToan(t.link)) + '">Mở trong Google Drive ↗</a>';
  }

  /* ----- Làm bài trắc nghiệm online ----- */
  let baiThi = null;
  function docLuu(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function ghiLuu(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* bỏ qua */ } }
  function khoaLuu(slug) { return "bai-thi:" + slug; }
  function dungDongHo() { if (baiThi && baiThi.dongHo) { clearInterval(baiThi.dongHo); baiThi.dongHo = 0; } }
  function hop() { return document.getElementById("bai-thi"); }
  function soPhut(d, de) { return Number(d.thoiGian) || de.thoiGian || 0; }
  function veLaiDe(d) { return d.lop === "HSG" ? "#/hsg/" + capCua(d).toLowerCase() : "#/" + duongMon(d.mon) + "/" + d.lop; }
  function toan(el) {
    if (window.renderMathInElement) {
      window.renderMathInElement(el, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false });
    } else {
      window.addEventListener("load", function () { if (window.renderMathInElement) toan(el); }, { once: true });
    }
  }
  function soDiem(x) { return String(Math.round(x * 100) / 100).replace(".", ","); }
  function dongHoChu(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }
  function ghiBai() {
    const b = baiThi;
    ghiLuu(khoaLuu(b.d.slug), { traLoi: b.traLoi, hetLuc: b.hetLuc, batDauLuc: b.batDauLuc, ten: b.ten, lop: b.lop, thuTu: b.thuTu || null });
  }
  // Trộn đề: mặc định bật; tắt bằng tron: false trong noi-dung.js hoặc dòng "Trộn: không" trong tệp đề.
  function coTron(b) { return b.d.tron !== false && b.de.tron !== false && !!TN.taoThuTu; }
  function hoanVi(ds, n) {
    if (Array.isArray(ds) && ds.length === n) return ds;
    const a = [];
    for (let i = 0; i < n; i++) a.push(i);
    return a;
  }
  function cauTheoThuTu(p, pi) {
    const tt = baiThi.thuTu;
    return hoanVi(tt && tt.cau ? tt.cau[pi] : null, p.cau.length);
  }
  function lcTheoThuTu(c, k) {
    const tt = baiThi.thuTu;
    return hoanVi(tt && tt.lc ? tt.lc[k] : null, c.luaChon.length);
  }

  // tep có thể là một tệp hoặc danh sách tệp (ví dụ phần chung + phần riêng), được ghép thành một đề.
  function taiDe(d) {
    const dsTep = Array.isArray(d.tep) ? d.tep : [d.tep];
    return Promise.all(dsTep.map(function (t) {
      return fetch(t + (t.indexOf("?") < 0 ? "?" : "&") + "t=" + Date.now())
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); });
    })).then(function (cac) { return cac.join("\n\n"); });
  }

  /* ----- Hỏi – Đáp ----- */
  function trangHoiDap() {
    document.title = "Hỏi – Đáp - " + THONG_TIN.tenTrang;
    const coLink = !!linkNhanDiem();
    return dauMuc("Hỏi – Đáp", "Em có thắc mắc về bài học, bài tập hay đề thi? Gửi câu hỏi cho thầy, câu trả lời sẽ được đăng ở đây.") +
      (coLink ? '<form class="the-bat-dau hoi-form" id="form-hoi" autocomplete="off">' +
        '<div class="hai-o"><label>Họ và tên<input id="hoi-ten" maxlength="80" required></label><label>Lớp<input id="hoi-lop" maxlength="20" required></label></div>' +
        '<label class="hoi-mon">Môn<select id="hoi-mon"><option>Vật lý</option><option>Tin học</option><option>Ôn thi HSG</option><option>Khác</option></select></label>' +
        '<label class="hoi-cau">Câu hỏi của em<textarea id="hoi-noi-dung" rows="4" maxlength="1500" required placeholder="Ghi rõ bài nào, câu nào và em vướng ở đâu…"></textarea></label>' +
        '<p class="phu">Trên trang chỉ hiện lớp của người hỏi, không hiện họ tên.</p>' +
        '<p id="hoi-bao" class="gui-diem" role="status"></p><button type="submit" class="nut">Gửi câu hỏi</button></form>' : "") +
      khoi("Câu hỏi đã được trả lời", '<div id="ds-hoi-dap"><p class="phu">' + (coLink ? "Đang tải…" : "Chưa có câu hỏi nào.") + "</p></div>");
  }
  function napHoiDap() {
    const o = document.getElementById("ds-hoi-dap"), url = linkNhanDiem();
    if (!o || !url) return;
    fetch(url + "?loai=hoidap&t=" + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (kq) {
        const ds = (kq && kq.ds) || [];
        if (!document.body.contains(o)) return;
        o.innerHTML = ds.length ? ds.map(function (x) {
          return '<article class="hoi-dap"><div class="phu">' + esc(x.ngay) + (x.lop ? " · Học sinh lớp " + esc(x.lop) : "") + (x.mon ? " · " + esc(x.mon) : "") + "</div>" +
            '<p class="hoi-dap__hoi"><b>Hỏi:</b> ' + TN.dinhDang(x.cauHoi) + '</p><div class="hoi-dap__tra"><b>Thầy trả lời:</b> ' + TN.dinhDang(x.traLoi) + "</div></article>";
        }).join("") : '<div class="trong">Chưa có câu hỏi nào được trả lời. Em hãy là người đầu tiên đặt câu hỏi!</div>';
        toan(o);
      })
      .catch(function () { if (document.body.contains(o)) o.innerHTML = '<div class="trong">Chưa tải được danh sách câu hỏi. Em thử tải lại trang sau.</div>'; });
  }
  function guiCauHoi(e) {
    e.preventDefault();
    const url = linkNhanDiem(), bao = document.getElementById("hoi-bao");
    const gt = function (id) { return document.getElementById(id).value.trim(); };
    const goi = { loai: "hoi", ten: gt("hoi-ten"), lop: gt("hoi-lop"), mon: gt("hoi-mon"), cauHoi: gt("hoi-noi-dung") };
    if (!goi.ten || !goi.lop || goi.cauHoi.length < 10) { bao.className = "gui-diem gui-diem--loi"; bao.textContent = "Em hãy ghi họ tên, lớp và câu hỏi (ít nhất 10 kí tự)."; return; }
    const nut = e.target.querySelector("button[type=submit]");
    nut.disabled = true;
    bao.className = "gui-diem"; bao.textContent = "Đang gửi…";
    fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(goi) })
      .then(function () {
        bao.className = "gui-diem gui-diem--xong";
        bao.textContent = "Đã gửi câu hỏi. Thầy sẽ trả lời sớm, em quay lại trang này để xem nhé!";
        document.getElementById("hoi-noi-dung").value = "";
      })
      .catch(function () { bao.className = "gui-diem gui-diem--loi"; bao.textContent = "Chưa gửi được (mạng có vấn đề). Em thử lại nhé."; })
      .then(function () { nut.disabled = false; });
  }

  /* ----- Bộ đếm lượt truy cập ----- */
  function demLuotTruyCap() {
    const url = linkNhanDiem();
    if (!url) return;
    let daDem = false;
    try { daDem = sessionStorage.getItem("da-dem-luot") === "1"; } catch (e) { /* bỏ qua */ }
    fetch(url + "?loai=luot&tang=" + (daDem ? "0" : "1") + "&t=" + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (kq) {
        if (!kq || typeof kq.tong !== "number") return;
        try { sessionStorage.setItem("da-dem-luot", "1"); } catch (e) { /* bỏ qua */ }
        const o = document.createElement("span");
        o.className = "chan-trang__luot";
        o.textContent = "Lượt truy cập: " + kq.tong.toLocaleString("vi-VN");
        document.querySelector(".chan-trang__hang").appendChild(o);
      })
      .catch(function () { /* không hiện bộ đếm nếu lỗi */ });
  }

  /* ----- Trò chơi Leo tháp kiến thức ----- */
  const BAC = 15, MOC = [5, 10];
  let troChoi = null;
  function deChoiDuoc() { return dsDe.filter(function (d) { return d.tep; }); }
  function trangTroChoi(phu) {
    if (phu) {
      const d = deChoiDuoc().find(function (x) { return x.slug === phu; });
      if (!d) return khongThay();
      document.title = "Leo tháp kiến thức - " + d.ten;
      return '<div id="tro-choi" data-slug="' + esc(phu) + '"><p class="phu">Đang chuẩn bị câu hỏi…</p></div>';
    }
    document.title = "Leo tháp kiến thức - " + THONG_TIN.tenTrang;
    const ds = deChoiDuoc();
    return dauMuc("Leo tháp kiến thức", "Trả lời đúng liên tiếp để leo lên đỉnh tháp " + BAC + " bậc. Bậc " + MOC.join(" và ") + " là mốc an toàn. Mỗi lượt có 3 quyền trợ giúp: 50:50, Hỏi cả lớp và Hỏi bạn thân.") +
      khoi("Chọn bộ câu hỏi", ds.length ? '<ul class="ds">' + ds.map(function (d) {
        return '<li class="' + mauMon(d.mon, d.lop) + '"><span class="ds__loai">' + esc(d.mon) + '</span><span class="ds__ten"><b>' + esc(d.ten) + '</b><span class="phu">' + esc(tenLop(d)) + "</span></span>" +
          '<a class="ds__mo" href="#/tro-choi/' + esc(d.slug) + '">Chơi ›</a></li>';
      }).join("") + "</ul>" : '<div class="trong">Chưa có bộ câu hỏi nào.</div>');
  }
  function tronDs(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function moTroChoi(slug) {
    const d = deChoiDuoc().find(function (x) { return x.slug === slug; });
    if (!d || !TN) return;
    taiDe(d).then(function (text) {
      const h = document.getElementById("tro-choi");
      if (!h || h.dataset.slug !== slug) return;
      const de = TN.phanTich(text);
      const cau = [];
      de.phan.forEach(function (p) { p.cau.forEach(function (c) { if (c.loai === "mc" && c.luaChon.length >= 2 && c.luaChon.some(function (o) { return o.dung; })) cau.push(c); }); });
      if (cau.length < 3) { h.innerHTML = '<div class="trong">Bộ câu hỏi này có quá ít câu nhiều lựa chọn để chơi. Em chọn bộ khác nhé.</div><a class="nut" href="#/tro-choi">Chọn bộ khác</a>'; return; }
      troChoi = { d: d, ds: tronDs(cau).slice(0, BAC), bac: 0, troGiup: { "5050": true, lop: true, ban: true }, an: [], ketThuc: false, dongHo: 0 };
      veCauTroChoi();
    }).catch(function () {
      const h = document.getElementById("tro-choi");
      if (h) h.innerHTML = '<div class="loi"><h2>Chưa tải được câu hỏi</h2><p>Kiểm tra kết nối mạng rồi tải lại trang.</p></div>';
    });
  }
  function moc(bac) { let m = 0; MOC.forEach(function (x) { if (bac >= x) m = x; }); return m; }
  function thapHTML() {
    const g = troChoi, tong = g.ds.length;
    let s = '<ol class="thap" reversed>';
    for (let i = tong; i >= 1; i--) {
      s += '<li class="' + (i === g.bac + 1 && !g.ketThuc ? "thap--dang " : "") + (i <= g.bac ? "thap--qua " : "") + (MOC.indexOf(i) >= 0 ? "thap--moc" : "") + '"><span>Bậc ' + i + "</span>" + (MOC.indexOf(i) >= 0 ? "<em>mốc an toàn</em>" : "") + (i === tong ? "<em>đỉnh tháp</em>" : "") + "</li>";
    }
    return s + "</ol>";
  }
  function dungDongHoTroChoi() { if (troChoi && troChoi.dongHo) { clearInterval(troChoi.dongHo); troChoi.dongHo = 0; } }
  function veCauTroChoi() {
    const g = troChoi, h = document.getElementById("tro-choi");
    if (!g || !h) return;
    dungDongHoTroChoi();
    const c = g.ds[g.bac];
    g.thuTu = tronDs(c.luaChon.map(function (o, i) { return i; }));
    g.an = [];
    h.innerHTML = '<a class="quay-lai" href="#/tro-choi">‹ Chọn bộ khác</a>' +
      '<div class="tro-choi"><div class="tro-choi__chinh">' +
      '<div class="tro-choi__dau"><b>Câu ' + (g.bac + 1) + "/" + g.ds.length + '</b><span class="dong-ho" id="tc-gio">30</span></div>' +
      '<div class="cau"><div class="cau__de">' + TN.dinhDang(c.deBai) + "</div>" +
      c.hinh.map(function (x) { return linkAnToan(x) || /^[\w./-]+$/.test(x) ? '<img class="cau__hinh" alt="Hình minh họa" src="' + esc(x) + '">' : ""; }).join("") +
      '<div class="tc-lc">' + g.thuTu.map(function (li, vt) {
        return '<button type="button" class="tc-nut" data-tc="chon" data-li="' + li + '"><span class="lc__nhan">' + "ABCDEFGH"[vt] + '</span><span class="lc__chu">' + TN.dinhDang(c.luaChon[li].noiDung) + "</span></button>";
      }).join("") + '</div></div><div id="tc-tro-giup-kq"></div>' +
      '<div class="tc-tro-giup">' +
      '<button type="button" class="nut nut--phu" data-tc="5050"' + (g.troGiup["5050"] ? "" : " disabled") + ">50:50</button>" +
      '<button type="button" class="nut nut--phu" data-tc="lop"' + (g.troGiup.lop ? "" : " disabled") + ">Hỏi cả lớp</button>" +
      '<button type="button" class="nut nut--phu" data-tc="ban"' + (g.troGiup.ban ? "" : " disabled") + ">Hỏi bạn thân</button>" +
      '<button type="button" class="nut nut--phu" data-tc="dung">Dừng cuộc chơi</button></div></div>' +
      '<aside class="tro-choi__thap">' + thapHTML() + "</aside></div>";
    toan(h);
    let con = 30;
    g.dongHo = setInterval(function () {
      const o = document.getElementById("tc-gio");
      if (!o) { dungDongHoTroChoi(); return; }
      con--;
      o.textContent = con;
      o.classList.toggle("dong-ho--gap", con <= 10);
      if (con <= 0) { dungDongHoTroChoi(); ketThucTroChoi("het-gio"); }
    }, 1000);
  }
  function chonTroChoi(li) {
    const g = troChoi;
    if (!g || g.khoa) return;
    g.khoa = true;
    dungDongHoTroChoi();
    const c = g.ds[g.bac], dung = c.luaChon.findIndex(function (o) { return o.dung; });
    document.querySelectorAll(".tc-nut").forEach(function (b) {
      b.disabled = true;
      const x = Number(b.dataset.li);
      if (x === dung) b.classList.add("tc-nut--dung");
      else if (x === li) b.classList.add("tc-nut--sai");
    });
    setTimeout(function () {
      g.khoa = false;
      if (li === dung) {
        g.bac++;
        if (g.bac >= g.ds.length) ketThucTroChoi("thang");
        else veCauTroChoi();
      } else ketThucTroChoi("sai");
    }, 1400);
  }
  function troGiup(loai) {
    const g = troChoi;
    if (!g || !g.troGiup[loai]) return;
    g.troGiup[loai] = false;
    const c = g.ds[g.bac], dung = c.luaChon.findIndex(function (o) { return o.dung; });
    const kq = document.getElementById("tc-tro-giup-kq");
    const nhan = function (li) { return "ABCDEFGH"[g.thuTu.indexOf(li)]; };
    if (loai === "5050") {
      const sai = tronDs(g.thuTu.filter(function (li) { return li !== dung && g.an.indexOf(li) < 0; })).slice(0, Math.max(0, g.thuTu.length - 2));
      sai.forEach(function (li) { g.an.push(li); const b = document.querySelector('.tc-nut[data-li="' + li + '"]'); if (b) { b.disabled = true; b.classList.add("tc-nut--an"); } });
      kq.innerHTML = '<p class="tc-goi-y">Đã bỏ bớt ' + sai.length + " phương án sai.</p>";
    } else if (loai === "lop") {
      const con = g.thuTu.filter(function (li) { return g.an.indexOf(li) < 0; });
      const diem = {};
      let tong = 0;
      con.forEach(function (li) { diem[li] = (li === dung ? 45 : 0) + Math.random() * 30; tong += diem[li]; });
      kq.innerHTML = '<div class="tc-bieu-do">' + g.thuTu.map(function (li) {
        const pt = con.indexOf(li) < 0 ? 0 : Math.round(diem[li] / tong * 100);
        return '<div class="tc-cot"><span>' + pt + '%</span><i style="height:' + Math.max(2, pt) + 'px"></i><b>' + nhan(li) + "</b></div>";
      }).join("") + '</div><p class="tc-goi-y">Cả lớp đã bình chọn. Ý kiến số đông chưa chắc đã đúng!</p>';
    } else if (loai === "ban") {
      const con = g.thuTu.filter(function (li) { return g.an.indexOf(li) < 0; });
      const chacChan = Math.random() < 0.8;
      const goiY = chacChan ? dung : tronDs(con.filter(function (li) { return li !== dung; }))[0];
      kq.innerHTML = '<p class="tc-goi-y">Bạn thân: "Mình nghĩ là <b>' + nhan(goiY === undefined ? dung : goiY) + "</b>, " + (chacChan ? "khá chắc đấy!" : "nhưng không chắc lắm…") + '"</p>';
    }
    const nut = document.querySelector('[data-tc="' + loai + '"]');
    if (nut) nut.disabled = true;
  }
  function ketThucTroChoi(lyDo) {
    const g = troChoi, h = document.getElementById("tro-choi");
    if (!g || !h || g.ketThuc) return;
    g.ketThuc = true;
    dungDongHoTroChoi();
    const datDuoc = lyDo === "thang" || lyDo === "dung" ? g.bac : moc(g.bac);
    const loi = { thang: "Xuất sắc! Em đã lên tới đỉnh tháp!", dung: "Em đã dừng cuộc chơi an toàn.", sai: "Tiếc quá, câu trả lời chưa đúng.", "het-gio": "Hết 30 giây rồi!" }[lyDo];
    const c = g.ds[Math.min(g.bac, g.ds.length - 1)];
    h.innerHTML = '<a class="quay-lai" href="#/tro-choi">‹ Chọn bộ khác</a><div class="tro-choi"><div class="tro-choi__chinh">' +
      '<section class="ket-qua"><div class="ket-qua__diem"><b>' + datDuoc + "</b><span>/ " + g.ds.length + " bậc</span></div><div><h1>" + esc(loi) + "</h1>" +
      "<p>Em giữ được <b>bậc " + datDuoc + "</b> trên tháp kiến thức của bộ câu hỏi <b>" + esc(g.d.ten) + "</b>.</p>" +
      ((lyDo === "sai" || lyDo === "het-gio") && c.loiGiai ? '<details class="loi-giai"><summary>Xem lời giải câu vừa rồi</summary><div>' + TN.dinhDang(c.loiGiai) + "</div></details>" : "") +
      '<div class="hang-nut"><button type="button" class="nut" data-tc="choi-lai">Chơi lại</button><a class="nut nut--phu" href="#/tro-choi">Chọn bộ khác</a></div></div></section></div>' +
      '<aside class="tro-choi__thap">' + thapHTML() + "</aside></div>";
    toan(h);
    window.scrollTo(0, 0);
  }

  function trangLamBai(slug) {
    const d = dsDe.find(function (x) { return x.slug === slug && x.tep; });
    if (!d) return khongThay();
    document.title = d.ten + " - " + THONG_TIN.tenTrang;
    return '<div id="bai-thi" data-slug="' + esc(slug) + '"><p class="phu">Đang tải đề…</p></div>';
  }
  function moDe(slug) {
    const d = dsDe.find(function (x) { return x.slug === slug && x.tep; });
    if (!d || !TN) return;
    const dsTep = Array.isArray(d.tep) ? d.tep : [d.tep];
    taiDe(d)
      .then(function (text) {
        const h = hop();
        if (!h || h.dataset.slug !== slug) return;
        const de = TN.phanTich(text);
        if (de.loi.length) {
          h.innerHTML = '<a class="quay-lai" href="' + veLaiDe(d) + '">‹ Quay lại</a><div class="loi"><h2>Đề này đang có lỗi định dạng</h2><p>Thầy/cô sửa tệp ' + esc(d.tep) + " theo các ghi chú sau:</p><ul>" +
            de.loi.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul></div>";
          return;
        }
        baiThi = { d: d, de: de, traLoi: {}, hetLuc: 0, batDauLuc: 0, ten: "", lop: "", dongHo: 0 };
        manHinhBatDau();
      })
      .catch(function () {
        const h = hop();
        if (h) h.innerHTML = '<div class="loi"><h2>Chưa tải được đề</h2><p>Kiểm tra kết nối mạng rồi tải lại trang. Nếu vẫn lỗi, kiểm tra tệp đề: ' + esc(dsTep.join(", ")) + "</p></div>";
      });
  }
  function manHinhBatDau() {
    const b = baiThi, d = b.d, de = b.de, phut = soPhut(d, de);
    const luu = docLuu(khoaLuu(d.slug));
    hop().innerHTML = '<a class="quay-lai" href="' + veLaiDe(d) + '">‹ Quay lại</a>' +
      dauMuc(d.ten, d.mon + " · " + tenLop(d) + " · " + (d.loai || "Luyện tập")) +
      '<div class="the-bat-dau"><ul class="tom-tat">' +
      de.phan.map(function (p) { return "<li><b>" + esc(p.ten || "Câu hỏi") + "</b>: " + p.cau.length + " câu</li>"; }).join("") +
      "<li><b>Thời gian</b>: " + (phut ? phut + " phút, hết giờ bài tự nộp" : "không giới hạn") + "</li>" +
      (coTron(b) ? "<li>Thứ tự câu hỏi và phương án được trộn riêng cho mỗi em.</li>" : "") + "</ul>" +
      '<div class="hai-o"><label>Họ và tên<input id="ten-hs" autocomplete="name" value="' + esc(luu ? luu.ten : "") + '"></label>' +
      '<label>Lớp<input id="lop-hs" value="' + esc(luu ? luu.lop : "") + '"></label></div>' +
      (linkNhanDiem() ? '<p class="ghi-chu-diem">Điểm của em sẽ tự gửi cho thầy/cô sau khi nộp bài, nên hãy ghi đúng họ tên và lớp.</p>' : "") +
      '<p class="canh-bao-bd" id="loi-bd" role="alert"></p>' +
      '<p class="phu">Cách tính điểm theo đề tốt nghiệp THPT: câu nhiều lựa chọn đúng 0,25 điểm; câu đúng/sai đúng 1, 2, 3, 4 ý được 0,1 / 0,25 / 0,5 / 1 điểm; câu trả lời ngắn đúng ' +
      soDiem(de.diemTL) + " điểm. Điểm cuối quy về thang 10.</p>" +
      '<div class="hang-nut">' + (luu ? '<button type="button" class="nut" data-bai="tiep">Làm tiếp bài đang dở</button>' : "") +
      '<button type="button" class="nut' + (luu ? " nut--phu" : "") + '" data-bai="batdau">' + (luu ? "Làm lại từ đầu" : "Bắt đầu làm bài") + "</button></div></div>";
  }
  function batDau(tiep) {
    const b = baiThi, phut = soPhut(b.d, b.de);
    const luu = tiep ? docLuu(khoaLuu(b.d.slug)) : null;
    const giaTri = function (id) { const o = document.getElementById(id); return o ? o.value.trim() : ""; };
    b.ten = giaTri("ten-hs") || (luu && luu.ten) || "";
    b.lop = giaTri("lop-hs") || (luu && luu.lop) || "";
    if (linkNhanDiem() && (!b.ten || !b.lop)) {
      const o = document.getElementById("loi-bd");
      if (o) o.textContent = "Em hãy nhập họ tên và lớp để thầy/cô nhận được điểm.";
      const o2 = document.getElementById(b.ten ? "lop-hs" : "ten-hs");
      if (o2) o2.focus();
      return;
    }
    if (luu) {
      b.traLoi = luu.traLoi || {};
      b.hetLuc = luu.hetLuc || 0;
      b.batDauLuc = luu.batDauLuc || Date.now();
      b.thuTu = luu.thuTu || null;
    } else {
      b.traLoi = {};
      b.batDauLuc = Date.now();
      b.hetLuc = phut ? b.batDauLuc + phut * 60000 : 0;
      b.thuTu = coTron(b) ? TN.taoThuTu(b.de) : null;
    }
    ghiBai();
    if (b.hetLuc && Date.now() >= b.hetLuc) { nopBai(); return; }
    manHinhLamBai();
  }
  function cauLamBai(c, k, so) {
    const t = baiThi.traLoi[k];
    let o = "";
    if (c.loai === "mc") {
      o = '<div class="lua-chon">' + lcTheoThuTu(c, k).map(function (li, vt) {
        const l = c.luaChon[li];
        return '<label class="lc"><input type="radio" name="q' + k + '" data-k="' + k + '" value="' + li + '"' + (Number(t) === li && t !== null && t !== undefined && t !== "" ? " checked" : "") + ">" +
          '<span class="lc__nhan">' + "ABCDEFGH"[vt] + '</span><span class="lc__chu">' + TN.dinhDang(l.noiDung) + "</span></label>";
      }).join("") + "</div>";
    } else if (c.loai === "ds") {
      o = '<table class="bang-ds"><thead><tr><th>Ý</th><th>Nội dung</th><th>Đúng</th><th>Sai</th></tr></thead><tbody>' +
        c.y.map(function (y, yi) {
          const v = t ? t[yi] : undefined;
          return "<tr><td>" + y.nhan + ")</td><td>" + TN.dinhDang(y.noiDung) + "</td>" +
            '<td><input type="radio" name="q' + k + "-" + yi + '" data-k="' + k + '" data-y="' + yi + '" value="1"' + (v === true ? " checked" : "") + ' aria-label="Ý ' + y.nhan + ' đúng"></td>' +
            '<td><input type="radio" name="q' + k + "-" + yi + '" data-k="' + k + '" data-y="' + yi + '" value="0"' + (v === false ? " checked" : "") + ' aria-label="Ý ' + y.nhan + ' sai"></td></tr>';
        }).join("") + "</tbody></table>";
    } else {
      o = '<label class="tra-loi-ngan">Đáp án của em <input type="text" autocomplete="off" spellcheck="false" data-k="' + k + '" value="' + esc(t || "") + '"></label>';
    }
    return '<article class="cau" id="cau-' + k + '"><h3>Câu ' + esc(so) + '</h3><div class="cau__de">' + TN.dinhDang(c.deBai) + "</div>" +
      c.hinh.map(function (h) { return linkAnToan(h) || /^[\w./-]+$/.test(h) ? '<img class="cau__hinh" alt="Hình minh họa" src="' + esc(h) + '">' : ""; }).join("") + o + "</article>";
  }
  function manHinhLamBai() {
    const b = baiThi;
    hop().innerHTML = '<h1 class="ten-de">' + esc(b.d.ten) + '</h1><p class="phu">' + esc(b.ten || "Học sinh") + (b.lop ? " · Lớp " + esc(b.lop) : "") + "</p>" +
      b.de.phan.map(function (p, pi) {
        return '<section class="phan-thi">' + (p.ten ? "<h2>" + esc(p.ten) + "</h2>" : "") +
          cauTheoThuTu(p, pi).map(function (ci, vt) { return cauLamBai(p.cau[ci], pi + "-" + ci, vt + 1); }).join("") + "</section>";
      }).join("") +
      '<div class="thanh-thi"><span class="dong-ho" id="dong-ho"></span><span id="da-lam" class="phu"></span>' +
      '<span id="xac-nhan" class="xac-nhan"></span><button type="button" class="nut" data-bai="nop">Nộp bài</button></div>';
    toan(hop());
    demDaLam();
    dungDongHo();
    const chay = function () {
      const o = document.getElementById("dong-ho");
      if (!o) { dungDongHo(); return; }
      if (b.hetLuc) {
        const con = b.hetLuc - Date.now();
        o.textContent = "Còn " + dongHoChu(con);
        o.classList.toggle("dong-ho--gap", con < 5 * 60000);
        if (con <= 0) nopBai();
      } else {
        o.textContent = "Đã làm " + dongHoChu(Date.now() - b.batDauLuc);
      }
    };
    chay();
    b.dongHo = setInterval(chay, 1000);
    window.scrollTo(0, 0);
  }
  function demDaLam() {
    const b = baiThi;
    let xong = 0, tong = 0;
    b.de.phan.forEach(function (p, pi) {
      p.cau.forEach(function (c, ci) { tong++; if (TN.daLam(c, b.traLoi[pi + "-" + ci])) xong++; });
    });
    const o = document.getElementById("da-lam");
    if (o) o.textContent = "Đã làm " + xong + "/" + tong + " câu";
    return [xong, tong];
  }
  function hoiNop() {
    const dem = demDaLam(), o = document.getElementById("xac-nhan");
    if (!o) return;
    o.innerHTML = (dem[0] < dem[1] ? "Còn " + (dem[1] - dem[0]) + " câu chưa làm. " : "") + "Nộp bài ngay? " +
      '<button type="button" class="nut nut--nho" data-bai="xacnhan">Nộp</button> <button type="button" class="nut nut--nho nut--phu" data-bai="huy">Làm tiếp</button>';
  }
  function nopBai() {
    const b = baiThi;
    if (!b || b.daNop) return;
    b.daNop = true;
    dungDongHo();
    const kq = TN.cham(b.de, b.traLoi);
    const luc = new Date();
    ghiLuu(khoaLuu(b.d.slug), null);
    manHinhKetQua(kq, luc);
    const giay = Math.max(0, Math.round((luc.getTime() - b.batDauLuc) / 1000));
    b.goiDiem = {
      ten: b.ten, lop: b.lop, mon: b.d.mon, khoi: tenLop(b.d), de: b.d.ten, loai: b.d.loai || "Luyện tập",
      diem: kq.diem10,
      chiTiet: kq.phan.map(function (p) { return (p.ten ? p.ten.split(/[.:]/)[0].trim() : "Kết quả") + ": đúng " + p.soDung + "/" + p.soCau; }).join("; "),
      thoiGianLam: Math.floor(giay / 60) + " phút " + (giay % 60) + " giây"
    };
    guiDiem();
  }

  /* ----- Gửi điểm về Google Sheets của thầy/cô ----- */
  function linkNhanDiem() {
    const s = linkAnToan(THONG_TIN.linkNhanDiem);
    return /^https:\/\/script\.google(usercontent)?\.com\//.test(s) ? s : "";
  }
  function guiDiem() {
    const b = baiThi, o = document.getElementById("gui-diem"), url = linkNhanDiem();
    if (!b || !b.goiDiem || !o || !url) return;
    o.className = "gui-diem";
    o.textContent = "Đang gửi điểm cho thầy/cô…";
    fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(b.goiDiem) })
      .then(function () {
        if (baiThi !== b) return;
        o.className = "gui-diem gui-diem--xong";
        o.textContent = "Đã gửi điểm cho thầy/cô.";
      })
      .catch(function () {
        if (baiThi !== b) return;
        o.className = "gui-diem gui-diem--loi";
        o.innerHTML = 'Chưa gửi được điểm (mạng có vấn đề). <button type="button" class="nut nut--nho" data-bai="guilai">Gửi lại</button> Nếu vẫn không được, em chụp màn hình kết quả gửi thầy/cô.';
      });
  }
  function cauKetQua(c, k, ct, so) {
    const t = baiThi.traLoi[k];
    let o = "";
    if (c.loai === "mc") {
      o = '<div class="lua-chon">' + lcTheoThuTu(c, k).map(function (li, vt) {
        const l = c.luaChon[li];
        const chon = t !== undefined && t !== null && t !== "" && Number(t) === li;
        return '<div class="lc' + (l.dung ? " lc--dung" : chon ? " lc--sai" : "") + '"><span class="lc__nhan">' + "ABCDEFGH"[vt] + '</span><span class="lc__chu">' + TN.dinhDang(l.noiDung) + "</span>" +
          (chon ? '<span class="lc__ghi">Em chọn</span>' : l.dung ? '<span class="lc__ghi">Đáp án</span>' : "") + "</div>";
      }).join("") + "</div>";
    } else if (c.loai === "ds") {
      o = '<table class="bang-ds"><thead><tr><th>Ý</th><th>Nội dung</th><th>Em chọn</th><th>Đáp án</th></tr></thead><tbody>' +
        c.y.map(function (y, yi) {
          const v = t ? t[yi] : undefined, coChon = v === true || v === false;
          return '<tr class="' + (!coChon ? "" : v === y.dung ? "dong--dung" : "dong--sai") + '"><td>' + y.nhan + ")</td><td>" + TN.dinhDang(y.noiDung) + "</td>" +
            "<td>" + (coChon ? (v ? "Đúng" : "Sai") : "—") + "</td><td><b>" + (y.dung ? "Đúng" : "Sai") + "</b></td></tr>";
        }).join("") + "</tbody></table>";
    } else {
      o = '<p class="tl-ket-qua">Em trả lời: <b>' + esc(t && String(t).trim() ? t : "—") + "</b> · Đáp án: <b>" + esc(String(c.dapAn).split(/[|;]/)[0]) + "</b></p>";
    }
    const nhan = { dung: "Đúng", "mot-phan": "Đúng một phần", sai: "Sai", bo: "Chưa làm" }[ct.trangThai];
    return '<article class="cau cau--' + ct.trangThai + '"><h3>Câu ' + esc(so) + ' <span class="nhan-kq">' + nhan + " · " + soDiem(ct.diem) + "/" + soDiem(ct.toiDa) + " điểm</span></h3>" +
      '<div class="cau__de">' + TN.dinhDang(c.deBai) + "</div>" +
      c.hinh.map(function (h) { return linkAnToan(h) || /^[\w./-]+$/.test(h) ? '<img class="cau__hinh" alt="Hình minh họa" src="' + esc(h) + '">' : ""; }).join("") + o +
      (c.loiGiai ? '<details class="loi-giai"><summary>Xem lời giải</summary><div>' + TN.dinhDang(c.loiGiai) + "</div></details>" : "") + "</article>";
  }
  function manHinhKetQua(kq, luc) {
    const b = baiThi, d = b.d;
    const lam = luc.getTime() - b.batDauLuc;
    hop().innerHTML = '<a class="quay-lai" href="' + veLaiDe(d) + '">‹ Quay lại</a>' +
      '<section class="ket-qua"><div class="ket-qua__diem"><b>' + soDiem(kq.diem10) + "</b><span>/ 10 điểm</span></div><div>" +
      "<h1>" + esc(d.ten) + "</h1><p><b>" + esc(b.ten || "Học sinh") + "</b>" + (b.lop ? " · Lớp " + esc(b.lop) : "") + "</p>" +
      '<p class="phu">Nộp lúc ' + luc.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " ngày " + luc.toLocaleDateString("vi-VN") +
      " · Thời gian làm " + dongHoChu(lam).replace(":", " phút ") + " giây</p>" +
      (linkNhanDiem() ? '<p id="gui-diem" class="gui-diem" role="status"></p>' : "") +
      '<ul class="tom-tat">' + kq.phan.map(function (p) {
        return "<li><b>" + esc(p.ten || "Kết quả") + "</b>: đúng " + p.soDung + "/" + p.soCau + " câu · " + soDiem(p.diem) + "/" + soDiem(p.toiDa) + " điểm</li>";
      }).join("") + "</ul>" +
      '<div class="hang-nut"><button type="button" class="nut" data-bai="lamlai">Làm lại đề này</button><a class="nut nut--phu" href="' + veLaiDe(d) + '">Chọn đề khác</a></div></div></section>' +
      '<h2 class="xem-lai">Xem lại bài làm</h2>' +
      b.de.phan.map(function (p, pi) {
        return '<section class="phan-thi">' + (p.ten ? "<h2>" + esc(p.ten) + "</h2>" : "") +
          cauTheoThuTu(p, pi).map(function (ci, vt) { const k = pi + "-" + ci; return cauKetQua(p.cau[ci], k, kq.chiTiet[k], vt + 1); }).join("") + "</section>";
      }).join("");
    toan(hop());
    window.scrollTo(0, 0);
  }
  function laHSG(cap) {
    return function (x) { return x.lop === "HSG" && (!cap || capCua(x) === cap); };
  }
  function demBai(cap) {
    const v = dsVideo.filter(laHSG(cap)).length, t = dsTaiLieu.filter(laHSG(cap)).length;
    return v + " video · " + t + " tài liệu";
  }
  function trangHSG(phu) {
    const cap = String(phu || "").toUpperCase();
    if (cap === "THCS" || cap === "THPT") return thuMucHSG(cap);
    if (phu) return khongThay();
    document.title = "Ôn thi HSG - " + THONG_TIN.tenTrang;
    return dauMuc("Ôn thi học sinh giỏi", "Chọn cấp học để xem video, chuyên đề và đề thi.") +
      '<div class="thu-muc">' + ["THCS", "THPT"].map(function (c) {
        return '<a class="thu-muc__the" href="#/hsg/' + c.toLowerCase() + '"><span class="thu-muc__cap">' + c + "</span>" +
          "<h2>" + esc(THU_MUC[c].ten) + "</h2><p>" + esc(THU_MUC[c].moTa) + '</p><span class="phu">' + demBai(c) + "</span>" +
          '<span class="thu-muc__vao">Vào thư mục ›</span></a>';
      }).join("") + "</div>" +
      (LO.length ? khoi("Lộ trình ôn luyện", '<ol class="lo-trinh">' + LO.map(function (b) { return "<li><h3>" + esc(b.buoc) + "</h3><p>" + esc(b.moTa) + "</p></li>"; }).join("") + "</ol>") : "");
  }
  function thuMucHSG(cap) {
    const tm = THU_MUC[cap];
    document.title = tm.ten + " - " + THONG_TIN.tenTrang;
    const hop = function (x) { return laHSG(cap)(x) && (!boLoc.mon || x.mon === boLoc.mon); };
    const tatCa = dsTaiLieu.filter(laHSG(cap));
    const tl = dsTaiLieu.filter(hop).filter(function (x) { return !boLoc.loai || x.loai === boLoc.loai; });
    const video = dsVideo.filter(hop).sort(theoThuTuHoc);
    const playlist = linkAnToan(tm.playlist);
    const khac = cap === "THCS" ? "THPT" : "THCS";
    return '<a class="quay-lai" href="#/hsg">‹ Ôn thi HSG</a>' + dauMuc(tm.ten, tm.moTa) +
      '<div class="loc">' + hangLoc("Môn", "mon", ["Vật lý", "Tin học"]) + "</div>" +
      khoi("Video bài giảng", luoiVideo(video), playlist, "Xem trên YouTube ↗") +
      khoi("Chuyên đề và đề thi", (tatCa.length ? '<div class="loc">' + hangLoc("Loại", "loai", duyNhat(tatCa, "loai")) + "</div>" : "") + dsTL(tl)) +
      '<a class="nut" href="#/hsg/' + khac.toLowerCase() + '">Sang thư mục ' + esc(THU_MUC[khac].ten) + " ›</a>";
  }
  function trangVideo() {
    document.title = "Video bài giảng - " + THONG_TIN.tenTrang;
    const ds = dsVideo.filter(function (v) {
      const lop = boLoc.lop;
      const hopLop = !lop || (lop.indexOf("HSG-") === 0 ? laHSG(lop.slice(4))(v) : v.lop === lop);
      return (!boLoc.mon || v.mon === boLoc.mon) && hopLop;
    });
    return dauMuc("Video bài giảng", "Tất cả video của Vật lý, Tin học và Ôn thi HSG.") +
      '<div class="loc">' + hangLoc("Môn", "mon", ["Vật lý", "Tin học"]) +
      '<div class="loc__hang"><span class="loc__ten">Khối</span>' +
      [["", "Tất cả"], ["10", "Lớp 10"], ["11", "Lớp 11"], ["12", "Lớp 12"], ["HSG-THCS", "HSG THCS"], ["HSG-THPT", "HSG THPT"]].map(function (n) {
        return '<button type="button" class="chip" data-loc="lop" data-giatri="' + n[0] + '" aria-pressed="' + (boLoc.lop === n[0]) + '">' + n[1] + "</button>";
      }).join("") + "</div></div>" + luoiVideo(ds);
  }
  function xemVideo(slug) {
    const v = dsVideo.find(function (x) { return x.slug === slug && x.id; });
    if (!v) return khongThay();
    document.title = v.ten + " - " + THONG_TIN.tenTrang;
    const taiLieu = linkAnToan(v.taiLieu);
    const cungNhom = v.lop === "HSG"
      ? function (x) { return laHSG(capCua(v))(x); }
      : function (x) { return x.mon === v.mon && x.lop === v.lop; };
    const lienQuan = dsVideo.filter(function (x) { return x !== v && x.id && cungNhom(x); }).sort(v.lop === "HSG" ? theoThuTuHoc : theoNgay).slice(0, 8);
    const veLai = v.lop === "HSG" ? ["#/hsg/" + capCua(v).toLowerCase(), "Thư mục " + THU_MUC[capCua(v)].ten] : ["#/video", "Tất cả video"];
    return '<div class="xem"><a class="quay-lai" href="' + veLai[0] + '">‹ ' + esc(veLai[1]) + '</a><div class="khung-phat">' +
      '<iframe src="https://www.youtube-nocookie.com/embed/' + v.id + '?rel=0" title="' + esc(v.ten) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>' +
      "<h1>" + esc(v.ten) + '</h1><div class="phu">' + esc(v.mon) + " · " + esc(tenLop(v)) + (v.chuDe ? " · " + esc(v.chuDe) : "") + "</div>" +
      (v.moTa ? '<p class="xem__mota">' + esc(v.moTa) + "</p>" : "") +
      (taiLieu ? '<a class="nut" target="_blank" rel="noopener" href="' + esc(taiLieu) + '">Tải tài liệu kèm theo ↗</a>' : "") + "</div>" +
      (lienQuan.length ? '<div style="height:32px"></div>' + khoi(v.lop === "HSG" ? "Cùng thư mục " + THU_MUC[capCua(v)].ten : "Video cùng khối", luoiVideo(lienQuan)) : "");
  }
  function timKiem(q) {
    document.title = "Tìm kiếm - " + THONG_TIN.tenTrang;
    const tu = boDau(q).split(/\s+/).filter(Boolean);
    const khop = function (x) {
      const chu = boDau([x.ten, x.mon, x.lop, x.lop === "HSG" ? capCua(x) : "", x.chuDe, x.loai].join(" "));
      return tu.length > 0 && tu.every(function (t) { return chu.indexOf(t) >= 0; });
    };
    const v = dsVideo.filter(khop), t = dsTaiLieu.filter(khop), d = dsDe.filter(khop);
    const tong = v.length + t.length + d.length;
    return dauMuc('Kết quả cho "' + q + '"', tong + " kết quả") +
      (d.length ? khoi("Trắc nghiệm online", dsDeHTML(d)) : "") +
      (v.length ? khoi("Video", luoiVideo(v)) : "") + (t.length ? khoi("Tài liệu", dsTL(t)) : "") +
      (tong ? "" : '<div class="trong">Không tìm thấy bài phù hợp. Thử từ khóa ngắn hơn.</div>');
  }
  function lienHe() {
    document.title = "Liên hệ - " + THONG_TIN.tenTrang;
    const zalo = String(THONG_TIN.zalo || "").trim();
    const mail = String(THONG_TIN.email || "").trim();
    const ds = [
      ["YouTube", linkAnToan(THONG_TIN.youtube)],
      ["Facebook", linkAnToan(THONG_TIN.facebook)],
      ["Zalo", linkAnToan(zalo) || (zalo ? "https://zalo.me/" + zalo.replace(/\D/g, "") : "")],
      ["Email", mail ? "mailto:" + mail : ""]
    ].filter(function (x) { return x[1]; });
    return dauMuc("Liên hệ", THONG_TIN.giaoVien + " · " + THONG_TIN.truong) + "<p>" + esc(THONG_TIN.gioiThieu) + "</p>" +
      (ds.length ? '<div class="lien-he">' + ds.map(function (x) { return '<a class="nut" style="margin:0" target="_blank" rel="noopener" href="' + esc(x[1]) + '">' + x[0] + "</a>"; }).join("") + "</div>" : "") +
      '<div style="height:32px"></div>' + lienKetHTML();
  }
  function khongThay() {
    document.title = "Không tìm thấy - " + THONG_TIN.tenTrang;
    return dauMuc("Không tìm thấy trang này") + '<a class="nut" href="#/">Về trang chủ</a>';
  }

  /* ----- Điều hướng ----- */
  function phanDuong() {
    let chuoi = location.hash.replace(/^#\/?/, "");
    try { chuoi = decodeURIComponent(chuoi); } catch (e) { /* giữ nguyên */ }
    const i = chuoi.indexOf("/");
    return i < 0 ? [chuoi, ""] : [chuoi.slice(0, i), chuoi.slice(i + 1)];
  }
  function veTrang() {
    const d = phanDuong(), ten = d[0], phu = d[1];
    if (ten === "") return trangChu();
    if (ten === "vat-ly") return trangMon("Vật lý", phu);
    if (ten === "tin-hoc") return trangMon("Tin học", phu);
    if (ten === "hsg") return trangHSG(phu);
    if (ten === "video") return phu ? xemVideo(phu) : trangVideo();
    if (ten === "tim") return timKiem(phu);
    if (ten === "lien-he") return lienHe();
    if (ten === "lam-bai") return trangLamBai(phu);
    if (ten === "hoi-dap") return trangHoiDap();
    if (ten === "tro-choi") return trangTroChoi(phu);
    if (ten === "doc") return docTaiLieu(phu);
    return khongThay();
  }
  function hienThi() {
    dungDongHo();
    baiThi = null;
    dungDongHoTroChoi();
    troChoi = null;
    app.innerHTML = veTrang();
    const d = phanDuong();
    let ten = d[0];
    if (ten === "lam-bai" || ten === "doc") {
      const x = (ten === "lam-bai" ? dsDe : dsTaiLieu).find(function (y) { return y.slug === d[1]; });
      ten = !x ? "" : x.lop === "HSG" ? "hsg" : duongMon(x.mon);
    }
    document.querySelectorAll(".menu a").forEach(function (a) {
      if (a.dataset.trang === ten) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    if (d[0] === "lam-bai" && hop()) moDe(d[1]);
    if (d[0] === "tro-choi" && d[1] && document.getElementById("tro-choi")) moTroChoi(d[1]);
    if (d[0] === "hoi-dap") {
      const f = document.getElementById("form-hoi");
      if (f) f.addEventListener("submit", guiCauHoi);
      napHoiDap();
    }
  }

  function datLocTheoDuong() {
    boLoc = { lop: "", loai: "", mon: "" };
  }

  window.addEventListener("hashchange", function () {
    datLocTheoDuong();
    hienThi();
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  });

  // Ghi lại câu trả lời khi học sinh chọn hoặc gõ đáp án.
  function ghiTraLoi(e) {
    const o = e.target;
    if (!baiThi || !o.dataset || o.dataset.k === undefined) return;
    const k = o.dataset.k, tl = baiThi.traLoi;
    if (o.type === "radio" && o.dataset.y !== undefined) {
      const ds = Array.isArray(tl[k]) ? tl[k] : [];
      ds[Number(o.dataset.y)] = o.value === "1";
      tl[k] = ds;
    } else if (o.type === "radio") {
      tl[k] = Number(o.value);
    } else {
      tl[k] = o.value;
    }
    ghiBai();
    demDaLam();
  }
  app.addEventListener("change", ghiTraLoi);
  app.addEventListener("input", function (e) { if (e.target.type === "text") ghiTraLoi(e); });

  app.addEventListener("click", function (e) {
    const tc = e.target.closest("[data-tc]");
    if (tc && troChoi) {
      const v = tc.dataset.tc;
      if (v === "chon") chonTroChoi(Number(tc.dataset.li));
      else if (v === "dung") ketThucTroChoi("dung");
      else if (v === "choi-lai") moTroChoi(troChoi.d.slug);
      else troGiup(v);
      return;
    }
    const viec = e.target.closest("[data-bai]");
    if (viec && baiThi) {
      const v = viec.dataset.bai;
      if (v === "batdau") batDau(false);
      else if (v === "tiep") batDau(true);
      else if (v === "nop") hoiNop();
      else if (v === "huy") document.getElementById("xac-nhan").innerHTML = "";
      else if (v === "xacnhan") nopBai();
      else if (v === "guilai") guiDiem();
      else if (v === "lamlai") { baiThi.daNop = false; baiThi.traLoi = {}; baiThi.goiDiem = null; baiThi.thuTu = null; manHinhBatDau(); window.scrollTo(0, 0); }
      return;
    }
    const cuon = e.target.closest("[data-cuon]");
    if (cuon) {
      const dich = document.getElementById(cuon.dataset.cuon);
      if (dich) dich.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const nut = e.target.closest(".chip");
    if (!nut || !nut.dataset.loc) return;
    const khoa = nut.dataset.loc, gt = nut.dataset.giatri;
    boLoc[khoa] = gt;
    hienThi();
    const lai = app.querySelector('.chip[data-loc="' + khoa + '"][data-giatri="' + gt + '"]');
    if (lai) lai.focus();
  });

  document.getElementById("form-tim").addEventListener("submit", function (e) {
    e.preventDefault();
    const o = document.getElementById("o-tim");
    const q = o.value.trim();
    if (q) location.hash = "#/tim/" + encodeURIComponent(q);
  });

  /* ----- Phần chung ----- */
  const ten = String(THONG_TIN.tenTrang || "");
  const cat = ten.indexOf(" - ");
  document.getElementById("logo").innerHTML = cat > 0 ? esc(ten.slice(0, cat)) + " <span>" + esc(ten.slice(cat + 3)) + "</span>" : esc(ten);
  document.getElementById("chan-ten").textContent = ten + " · " + THONG_TIN.giaoVien + " · " + THONG_TIN.truong;
  const mxh = [["YouTube", linkAnToan(THONG_TIN.youtube)], ["Facebook", linkAnToan(THONG_TIN.facebook)]].filter(function (x) { return x[1]; });
  if (mxh.length) {
    const o = document.createElement("span");
    o.className = "chan-trang__mxh";
    o.innerHTML = mxh.map(function (x) { return '<a target="_blank" rel="noopener" href="' + esc(x[1]) + '">' + x[0] + " ↗</a>"; }).join(" · ");
    document.getElementById("chan-ten").after(o);
  }
  if (THONG_TIN.thongBao) {
    document.getElementById("thong-bao").innerHTML = '<div class="bang-tin">' + esc(THONG_TIN.thongBao) + "</div>";
  }
  datLocTheoDuong();
  hienThi();
  demLuotTruyCap();
})();
