/* Hiển thị bài học song ngữ Việt - Anh. Dùng chung cho trang web và công cụ soạn bài.
   Thầy/cô không cần sửa tệp này.

   Cấu trúc tệp bài học (JSON):
   {
     "ten":      { "vi": "Tên bài tiếng Việt", "en": "English title" },
     "mon": "Tin học", "lop": "10",
     "noiDung":  { "vi": "Nội dung tiếng Việt", "en": "English content" },
     "thuatNgu": [ { "en": "variable", "ipa": "/ˈveəriəbl/", "vi": "biến", "ghiChu": "..." } ]
   }
   Nội dung viết như văn bản thường, các đoạn cách nhau một dòng trống:
     # Tiêu đề lớn, ## Tiêu đề nhỏ, - gạch đầu dòng, **chữ đậm**, `mã`,
     công thức $...$ hoặc $$...$$, khối mã ```python ... ```, ảnh: dòng "Hình: link".
   Ở chế độ song ngữ, đoạn thứ n tiếng Việt đứng cạnh đoạn thứ n tiếng Anh,
   vì vậy hai bên nên có cùng số đoạn. */
(function () {
  "use strict";
  const TN = window.TracNghiem;
  const esc = TN.esc;

  // Tách nội dung thành các khối (đoạn văn, tiêu đề, danh sách, khối mã, ảnh, công thức $$).
  function tachKhoi(text) {
    const dong = String(text || "").replace(/\r/g, "").split("\n");
    const khoi = [];
    let dem = [], trongMa = false, ma = [], lang = "";
    function day() { if (dem.length) { khoi.push({ loai: "doan", dong: dem }); dem = []; } }
    dong.forEach(function (d) {
      const s = d.trim();
      if (trongMa) {
        if (/^```/.test(s)) { khoi.push({ loai: "ma", lang: lang, ma: ma.join("\n") }); trongMa = false; ma = []; }
        else ma.push(d);
        return;
      }
      if (/^```/.test(s)) { day(); trongMa = true; lang = s.slice(3).trim(); return; }
      if (!s) { day(); return; }
      dem.push(d);
    });
    if (trongMa) khoi.push({ loai: "ma", lang: lang, ma: ma.join("\n") });
    day();
    return khoi;
  }
  function linkAnh(s) {
    s = String(s || "").trim();
    return /^https?:\/\//i.test(s) || /^[\w./-]+$/.test(s) ? s : "";
  }
  function veKhoi(k) {
    if (k.loai === "ma") return TN.khoiMa(k.lang, k.ma);
    const dau = k.dong[0].trim();
    let m;
    if ((m = dau.match(/^(#{1,3})\s+(.*)$/)) && k.dong.length === 1) {
      const cap = m[1].length + 1;
      return "<h" + cap + ' class="bh-tieu-de">' + TN.dongChu(m[2]) + "</h" + cap + ">";
    }
    if ((m = dau.match(/^h[ìi]nh\s*:\s*(\S+)/i)) && k.dong.length === 1) {
      const src = linkAnh(m[1]);
      return src ? '<img class="bh-hinh" alt="Hình minh họa" src="' + esc(src) + '">' : "";
    }
    if (k.dong.every(function (d) { return /^\s*([-*]|\d+[.)])\s+/.test(d); })) {
      const so = /^\s*\d+[.)]/.test(dau);
      return (so ? "<ol" : "<ul") + ' class="bh-ds">' + k.dong.map(function (d) {
        return "<li>" + TN.dongChu(d.replace(/^\s*([-*]|\d+[.)])\s+/, "")) + "</li>";
      }).join("") + (so ? "</ol>" : "</ul>");
    }
    return "<p>" + TN.dongChu(k.dong.join("\n")) + "</p>";
  }
  function khoiHTML(text) { return tachKhoi(text).map(veKhoi); }

  function nutNghe(chu) {
    return '<button type="button" class="bh-nghe" data-doc="' + esc(chu) + '" aria-label="Nghe phát âm ' + esc(chu) + '" title="Nghe phát âm">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 4V5L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg></button>';
  }
  // Một thẻ thuật ngữ. lop, them: lớp CSS và phần HTML thêm vào cuối thẻ (dùng ở trang Học song ngữ).
  function theThuatNgu(t, lop, them) {
    return '<article class="bh-the' + (lop ? " " + lop : "") + '" lang="en"><div class="bh-the__dau"><b>' + esc(t.en) + "</b>" + nutNghe(t.en) + "</div>" +
      (t.ipa ? '<div class="bh-ipa">' + esc(t.ipa) + "</div>" : "") +
      (t.vi ? '<div class="bh-nghia" lang="vi">' + esc(t.vi) + "</div>" : "") +
      (t.ghiChu ? '<div class="bh-ghi-chu" lang="vi">' + TN.dongChu(t.ghiChu) + "</div>" : "") + (them || "") + "</article>";
  }
  function thuatNguHTML(ds) {
    ds = (ds || []).filter(function (t) { return t && t.en; });
    if (!ds.length) return "";
    return '<section class="bh-thuat-ngu"><h2>Thuật ngữ / Glossary</h2><div class="bh-the-ds">' + ds.map(function (t) { return theThuatNgu(t); }).join("") + "</div></section>";
  }

  // Vẽ bài học theo chế độ: "vi" (Tiếng Việt), "en" (English), "song" (song ngữ song song).
  function ve(bai, cheDo) {
    bai = bai || {};
    const ten = bai.ten || {}, nd = bai.noiDung || {};
    const vi = khoiHTML(nd.vi), en = khoiHTML(nd.en);
    let than;
    if (cheDo === "en") than = '<div class="bh-than" lang="en">' + (en.join("") || '<p class="phu">(No English version yet.)</p>') + "</div>";
    else if (cheDo === "song") {
      const n = Math.max(vi.length, en.length);
      let hang = "";
      for (let i = 0; i < n; i++) {
        hang += '<div class="bh-hang"><div class="bh-cot" lang="vi">' + (vi[i] || "") + '</div><div class="bh-cot" lang="en">' + (en[i] || "") + "</div></div>";
      }
      than = '<div class="bh-than bh-than--song"><div class="bh-hang bh-hang--dau"><div>Tiếng Việt</div><div>English</div></div>' + hang + "</div>";
    } else than = '<div class="bh-than" lang="vi">' + (vi.join("") || '<p class="phu">(Chưa có bản tiếng Việt.)</p>') + "</div>";
    const tieuDe = cheDo === "en" ? (ten.en || ten.vi) : cheDo === "song" && ten.en && ten.vi ? ten.vi + " / " + ten.en : (ten.vi || ten.en);
    return '<h1 class="bh-ten">' + esc(tieuDe || "") + "</h1>" + than + thuatNguHTML(bai.thuatNgu);
  }

  function nutCheDo(cheDo) {
    return '<div class="bh-che-do" role="group" aria-label="Ngôn ngữ hiển thị">' +
      [["vi", "Tiếng Việt"], ["en", "English"], ["song", "Song ngữ"]].map(function (x) {
        return '<button type="button" class="chip" data-ngon-ngu="' + x[0] + '" aria-pressed="' + (cheDo === x[0]) + '">' + x[1] + "</button>";
      }).join("") + "</div>";
  }

  // Ghi nhớ chế độ đã chọn trên máy học sinh.
  const KHOA = "bai-hoc-che-do";
  function docCheDo() {
    try { const v = localStorage.getItem(KHOA); return v === "en" || v === "song" ? v : "vi"; } catch (e) { return "vi"; }
  }
  function ghiCheDo(v) { try { localStorage.setItem(KHOA, v); } catch (e) { /* bỏ qua */ } }

  // Phát âm tiếng Anh bằng giọng đọc có sẵn của trình duyệt.
  function coPhatAm() { return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function"; }
  function phatAm(chu) {
    if (!coPhatAm()) return false;
    const u = new SpeechSynthesisUtterance(chu);
    u.lang = "en-US";
    u.rate = 0.85;
    const giong = window.speechSynthesis.getVoices().filter(function (v) { return /^en(-|_)/i.test(v.lang); });
    if (giong.length) u.voice = giong.find(function (v) { return /en-US/i.test(v.lang); }) || giong[0];
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return true;
  }

  // Kiểm tra cấu trúc bài học trước khi đăng.
  function kiemTra(bai) {
    const loi = [];
    if (!bai || typeof bai !== "object") return ["Tệp không phải bài học hợp lệ."];
    if (!bai.ten || !(bai.ten.vi || bai.ten.en)) loi.push("Thiếu tên bài.");
    if (!bai.noiDung || !(String(bai.noiDung.vi || "").trim() || String(bai.noiDung.en || "").trim())) loi.push("Thiếu nội dung bài học.");
    const nvi = tachKhoi(bai.noiDung && bai.noiDung.vi).length, nen = tachKhoi(bai.noiDung && bai.noiDung.en).length;
    if (nvi && nen && nvi !== nen) loi.push("Bản Việt có " + nvi + " đoạn, bản Anh có " + nen + " đoạn: chế độ song ngữ sẽ bị lệch hàng. (Chỉ là cảnh báo.)");
    (bai.thuatNgu || []).forEach(function (t, i) { if (t && !t.en) loi.push("Thuật ngữ thứ " + (i + 1) + " thiếu từ tiếng Anh."); });
    return loi;
  }

  window.BaiHoc = { ve: ve, theThuatNgu: theThuatNgu, nutCheDo: nutCheDo, docCheDo: docCheDo, ghiCheDo: ghiCheDo, phatAm: phatAm, coPhatAm: coPhatAm, kiemTra: kiemTra, tachKhoi: tachKhoi };
})();
