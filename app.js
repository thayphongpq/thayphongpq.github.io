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
  function tenLop(lop) {
    return lop === "HSG" ? "Ôn thi HSG" : "Lớp " + lop;
  }

  const daDung = {};
  const dsVideo = VIDEO.map(function (v) {
    const goc = boDau(v.ten).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "video";
    daDung[goc] = (daDung[goc] || 0) + 1;
    return Object.assign({}, v, { id: youtubeId(v.youtube), slug: daDung[goc] > 1 ? goc + "-" + daDung[goc] : goc });
  }).sort(theoNgay);
  const dsTaiLieu = TAI_LIEU.slice().sort(theoNgay);

  /* ----- Mẩu giao diện ----- */
  function theVideo(v) {
    const mau = mauMon(v.mon, v.lop);
    const chu = '<div class="the-video__chu"><h3>' + esc(v.ten) + '</h3><div class="phu">' +
      esc(v.mon) + " · " + esc(tenLop(v.lop)) + (v.chuDe ? " · " + esc(v.chuDe) : "") + "</div></div>";
    if (!v.id) {
      return '<div class="the-video ' + mau + '"><div class="anh-video">Sắp có video</div>' + chu + "</div>";
    }
    return '<a class="the-video ' + mau + '" href="#/video/' + esc(v.slug) + '"><div class="anh-video">' +
      '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg"><span class="nut-phat"></span></div>' + chu + "</a>";
  }
  function luoiVideo(ds) {
    return ds.length ? '<div class="luoi-video">' + ds.map(theVideo).join("") + "</div>" : '<div class="trong">Chưa có video ở mục này.</div>';
  }
  function dongTaiLieu(t) {
    const link = linkAnToan(t.link);
    return '<li class="' + mauMon(t.mon, t.lop) + '"><span class="ds__loai">' + esc(t.loai || "Tài liệu") + "</span>" +
      '<span class="ds__ten"><b>' + esc(t.ten) + '</b><span class="phu">' + esc(t.mon) + " · " + esc(tenLop(t.lop)) + "</span></span>" +
      (link ? '<a class="ds__mo" target="_blank" rel="noopener" href="' + esc(link) + '">Mở tài liệu ↗</a>' : '<span class="sap-co">Sắp có</span>') + "</li>";
  }
  function dsTL(ds) {
    return ds.length ? '<ul class="ds">' + ds.map(dongTaiLieu).join("") + "</ul>" : '<div class="trong">Chưa có tài liệu ở mục này.</div>';
  }
  function khoi(tieuDe, noiDung, link, chuLink) {
    return '<section class="khoi"><div class="khoi__dau"><h2>' + esc(tieuDe) + "</h2>" +
      (link ? '<a href="' + link + '">' + chuLink + "</a>" : "") + "</div>" + noiDung + "</section>";
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
      '<p class="mo-dau__gv">' + esc(THONG_TIN.giaoVien) + " · " + esc(THONG_TIN.truong) + "</p></div>" + hinhSong() + "</section>" +
      '<section class="ba-cua" aria-label="Các môn học">' +
      cua("mau-ly", "Vật lý", "#/vat-ly", "Lý thuyết, bài tập, thí nghiệm và đề kiểm tra theo khối.", "vat-ly") +
      cua("mau-tin", "Tin học", "#/tin-hoc", "Lập trình Python, cơ sở dữ liệu, tin học ứng dụng.", "tin-hoc") +
      '<article class="cua mau-hsg"><h2><a href="#/hsg">Ôn thi HSG</a></h2><p>Lộ trình, chuyên đề nâng cao và đề thi các năm.</p>' +
      '<div class="cua__lop"><a href="#/hsg">Vật lý</a><a href="#/hsg">Tin học</a></div></article></section>' +
      khoi("Video mới đăng", luoiVideo(dsVideo.slice(0, 4)), "#/video", "Xem tất cả") +
      khoi("Tài liệu mới", dsTL(dsTaiLieu.slice(0, 6)));
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
  function trangMon(mon) {
    document.title = mon + " - " + THONG_TIN.tenTrang;
    const coLop = function (x) { return x.mon === mon && x.lop !== "HSG" && (!boLoc.lop || x.lop === boLoc.lop); };
    const tatCaTL = dsTaiLieu.filter(function (x) { return x.mon === mon && x.lop !== "HSG"; });
    const tl = dsTaiLieu.filter(coLop).filter(function (x) { return !boLoc.loai || x.loai === boLoc.loai; });
    const noiDungLoc = '<div class="loc">' + hangLoc("Khối", "lop", ["10", "11", "12"]) + hangLoc("Loại", "loai", duyNhat(tatCaTL, "loai")) + "</div>";
    return dauMuc(mon, "Chọn khối lớp hoặc loại tài liệu cần xem.") + noiDungLoc +
      khoi("Tài liệu", dsTL(tl)) + khoi("Video bài giảng", luoiVideo(dsVideo.filter(coLop)));
  }
  function trangHSG() {
    document.title = "Ôn thi HSG - " + THONG_TIN.tenTrang;
    const hopMon = function (x) { return x.lop === "HSG" && (!boLoc.mon || x.mon === boLoc.mon); };
    const tatCa = dsTaiLieu.filter(function (x) { return x.lop === "HSG"; });
    const tl = dsTaiLieu.filter(hopMon).filter(function (x) { return !boLoc.loai || x.loai === boLoc.loai; });
    return dauMuc("Ôn thi học sinh giỏi", "Vật lý và Tin học: học theo chuyên đề, luyện đề thật, xem lại bằng video.") +
      (LO.length ? '<ol class="lo-trinh">' + LO.map(function (b) { return "<li><h3>" + esc(b.buoc) + "</h3><p>" + esc(b.moTa) + "</p></li>"; }).join("") + "</ol>" : "") +
      '<div class="loc">' + hangLoc("Môn", "mon", ["Vật lý", "Tin học"]) + hangLoc("Loại", "loai", duyNhat(tatCa, "loai")) + "</div>" +
      khoi("Chuyên đề và đề thi", dsTL(tl)) + khoi("Video ôn HSG", luoiVideo(dsVideo.filter(hopMon)));
  }
  function trangVideo() {
    document.title = "Video bài giảng - " + THONG_TIN.tenTrang;
    const ds = dsVideo.filter(function (v) {
      return (!boLoc.mon || v.mon === boLoc.mon) && (!boLoc.lop || v.lop === boLoc.lop);
    });
    return dauMuc("Video bài giảng", "Tất cả video của Vật lý, Tin học và Ôn thi HSG.") +
      '<div class="loc">' + hangLoc("Môn", "mon", ["Vật lý", "Tin học"]) +
      '<div class="loc__hang"><span class="loc__ten">Khối</span>' +
      [["", "Tất cả"], ["10", "Lớp 10"], ["11", "Lớp 11"], ["12", "Lớp 12"], ["HSG", "HSG"]].map(function (n) {
        return '<button type="button" class="chip" data-loc="lop" data-giatri="' + n[0] + '" aria-pressed="' + (boLoc.lop === n[0]) + '">' + n[1] + "</button>";
      }).join("") + "</div></div>" + luoiVideo(ds);
  }
  function xemVideo(slug) {
    const v = dsVideo.find(function (x) { return x.slug === slug && x.id; });
    if (!v) return khongThay();
    document.title = v.ten + " - " + THONG_TIN.tenTrang;
    const taiLieu = linkAnToan(v.taiLieu);
    const lienQuan = dsVideo.filter(function (x) { return x !== v && x.id && x.mon === v.mon; }).slice(0, 4);
    return '<div class="xem"><a class="quay-lai" href="#/video">‹ Tất cả video</a><div class="khung-phat">' +
      '<iframe src="https://www.youtube-nocookie.com/embed/' + v.id + '?rel=0" title="' + esc(v.ten) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>' +
      "<h1>" + esc(v.ten) + '</h1><div class="phu">' + esc(v.mon) + " · " + esc(tenLop(v.lop)) + (v.chuDe ? " · " + esc(v.chuDe) : "") + "</div>" +
      (v.moTa ? '<p class="xem__mota">' + esc(v.moTa) + "</p>" : "") +
      (taiLieu ? '<a class="nut" target="_blank" rel="noopener" href="' + esc(taiLieu) + '">Tải tài liệu kèm theo ↗</a>' : "") + "</div>" +
      (lienQuan.length ? '<div style="height:32px"></div>' + khoi("Video cùng môn", luoiVideo(lienQuan)) : "");
  }
  function timKiem(q) {
    document.title = "Tìm kiếm - " + THONG_TIN.tenTrang;
    const tu = boDau(q).split(/\s+/).filter(Boolean);
    const khop = function (x) {
      const chu = boDau([x.ten, x.mon, x.lop, x.chuDe, x.loai].join(" "));
      return tu.length > 0 && tu.every(function (t) { return chu.indexOf(t) >= 0; });
    };
    const v = dsVideo.filter(khop), t = dsTaiLieu.filter(khop);
    return dauMuc('Kết quả cho "' + q + '"', (v.length + t.length) + " kết quả") +
      (v.length ? khoi("Video", luoiVideo(v)) : "") + (t.length ? khoi("Tài liệu", dsTL(t)) : "") +
      (v.length + t.length ? "" : '<div class="trong">Không tìm thấy bài phù hợp. Thử từ khóa ngắn hơn.</div>');
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
      (ds.length ? '<div class="lien-he">' + ds.map(function (x) { return '<a class="nut" style="margin:0" target="_blank" rel="noopener" href="' + esc(x[1]) + '">' + x[0] + "</a>"; }).join("") + "</div>" : "");
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
    if (ten === "hsg") return trangHSG();
    if (ten === "video") return phu ? xemVideo(phu) : trangVideo();
    if (ten === "tim") return timKiem(phu);
    if (ten === "lien-he") return lienHe();
    return khongThay();
  }
  function hienThi() {
    app.innerHTML = veTrang();
    const ten = phanDuong()[0];
    document.querySelectorAll(".menu a").forEach(function (a) {
      if (a.dataset.trang === ten) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function datLocTheoDuong() {
    const d = phanDuong();
    boLoc = { lop: "", loai: "", mon: "" };
    if ((d[0] === "vat-ly" || d[0] === "tin-hoc") && ["10", "11", "12"].indexOf(d[1]) >= 0) boLoc.lop = d[1];
  }

  window.addEventListener("hashchange", function () {
    datLocTheoDuong();
    hienThi();
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  });

  app.addEventListener("click", function (e) {
    const nut = e.target.closest(".chip");
    if (!nut) return;
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
  if (THONG_TIN.thongBao) {
    document.getElementById("thong-bao").innerHTML = '<div class="bang-tin">' + esc(THONG_TIN.thongBao) + "</div>";
  }
  datLocTheoDuong();
  hienThi();
})();
