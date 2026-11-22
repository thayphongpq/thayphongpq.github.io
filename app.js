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
  const BH = typeof BAI_HOC === "undefined" ? [] : BAI_HOC;
  const TV = (typeof TU_VUNG === "undefined" ? [] : TU_VUNG).filter(function (t) { return t && t.en; });
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
    if (lop === "HSG" || lop === "GV") return "mau-hsg";
    return mon === "Tin học" ? "mau-tin" : "mau-ly";
  }
  // Bài HSG chia hai cấp: THCS và THPT (không ghi cap thì tính là THPT).
  function capCua(x) {
    return String(x.cap || "").trim().toUpperCase() === "THCS" ? "THCS" : "THPT";
  }
  function tenLop(x) {
    return x.lop === "HSG" ? "HSG " + capCua(x) : x.lop === "GV" ? "Dành cho giáo viên" : "Lớp " + x.lop;
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
  const slugBai = {};
  const dsBai = BH.map(function (b, i) {
    return Object.assign({}, b, { thuTu: i, slug: taoSlug(b.ten, slugBai) });
  }).sort(theoNgay);
  const slugTN = {};
  const dsThiNghiem = (typeof THI_NGHIEM_AO === "undefined" ? [] : THI_NGHIEM_AO).filter(function (t) {
    return t && /^[a-z0-9-]+$/.test(String(t.phet || ""));
  }).map(function (t, i) {
    return Object.assign({}, t, { mon: "Vật lý", thuTu: i, slug: taoSlug(t.ten, slugTN) });
  });

  /* ----- Thí nghiệm ảo (mô phỏng PhET tiếng Việt) ----- */
  const PHET = "https://phet.colorado.edu/sims/html/";
  function theThiNghiem(t) {
    return '<a class="the-tn ' + mauMon("Vật lý", t.lop) + '" href="#/thi-nghiem/' + esc(t.slug) + '"><span class="the-tn__anh">' +
      '<img loading="lazy" alt="" src="' + PHET + t.phet + "/latest/" + t.phet + '-600.png"></span>' +
      '<span class="the-tn__chu"><b>' + esc(t.ten) + '</b><span class="phu">' + esc(tenLop(t)) + (t.chuDe ? " · " + esc(t.chuDe) : "") + "</span></span></a>";
  }
  function luoiThiNghiem(ds, rong) {
    return ds.length ? '<div class="luoi-tn">' + ds.map(theThiNghiem).join("") + "</div>" : '<div class="trong">' + esc(rong || "Chưa có thí nghiệm ảo ở mục này.") + "</div>";
  }
  function hopLopTN(lop) {
    return function (t) { return lop.indexOf("HSG-") === 0 ? laHSG(lop.slice(4))(t) : t.lop === lop; };
  }
  function trangThiNghiem(phu) {
    if (phu) {
      const t = dsThiNghiem.find(function (x) { return x.slug === phu; });
      if (!t) return khongThay();
      document.title = t.ten + " - Thí nghiệm ảo - " + THONG_TIN.tenTrang;
      const link = PHET + t.phet + "/latest/" + t.phet + "_vi.html";
      const khac = dsThiNghiem.filter(function (x) { return x !== t && x.lop === t.lop && capCua(x) === capCua(t); });
      return '<a class="quay-lai" href="#/thi-nghiem">‹ Thí nghiệm ảo</a>' + dauMuc(t.ten, "Vật lý · " + tenLop(t) + (t.chuDe ? " · " + t.chuDe : "")) +
        (t.moTa ? '<p class="xem__mota">' + esc(t.moTa) + "</p>" : "") +
        '<div class="khung-tn"><iframe src="' + link + '" title="' + esc(t.ten) + '" allowfullscreen></iframe></div>' +
        '<p class="phu">Mô phỏng của PhET, Đại học Colorado Boulder (miễn phí, giấy phép CC-BY). Trên điện thoại nên xoay ngang màn hình hoặc mở toàn màn hình.</p>' +
        '<a class="nut" target="_blank" rel="noopener" href="' + link + '">Mở toàn màn hình ↗</a>' +
        (khac.length ? '<div style="height:32px"></div>' + khoi("Thí nghiệm khác của " + tenLop(t), luoiThiNghiem(khac)) : "");
    }
    document.title = "Thí nghiệm ảo - " + THONG_TIN.tenTrang;
    const nhom = [["10", "Vật lý 10"], ["11", "Vật lý 11"], ["12", "Vật lý 12"], ["HSG-THCS", "Ôn thi HSG THCS"], ["HSG-THPT", "Ôn thi HSG THPT"]];
    return dauMuc("Thí nghiệm ảo Vật lý", "Mô phỏng PhET bằng tiếng Việt: em tự thay đổi thông số, quan sát hiện tượng và rút ra quy luật. Chạy ngay trên máy tính và điện thoại, không cần cài đặt.") +
      '<div class="loc"><div class="loc__hang"><span class="loc__ten">Khối</span>' +
      [["", "Tất cả"]].concat(nhom.filter(function (n) { return dsThiNghiem.some(hopLopTN(n[0])); })).map(function (n) {
        return '<button type="button" class="chip" data-loc="lop" data-giatri="' + n[0] + '" aria-pressed="' + (boLoc.lop === n[0]) + '">' + esc(n[1].replace("Vật lý ", "Lớp ").replace("Ôn thi ", "")) + "</button>";
      }).join("") + "</div></div>" +
      nhom.filter(function (n) { return (!boLoc.lop || boLoc.lop === n[0]) && dsThiNghiem.some(hopLopTN(n[0])); }).map(function (n) {
        return khoi(n[1], luoiThiNghiem(dsThiNghiem.filter(hopLopTN(n[0]))));
      }).join("");
  }

  /* ----- Kết quả của em (lưu trên trình duyệt của máy đang dùng) ----- */
  const KHOA_LS = "lich-su-lam-bai";
  function docLichSu() { const d = docLuu(KHOA_LS); return Array.isArray(d) ? d : []; }
  function ghiLichSu(muc) { const ds = docLichSu(); ds.unshift(muc); ghiLuu(KHOA_LS, ds.slice(0, 300)); }
  function diemCaoNhat(slug) {
    let m = null;
    docLichSu().forEach(function (x) { if (x.slug === slug && (m === null || x.diem > m)) m = x.diem; });
    return m;
  }
  function trangKetQua() {
    document.title = "Kết quả của em - " + THONG_TIN.tenTrang;
    const ds = docLichSu();
    const dau = dauMuc("Kết quả của em", "Các bài em đã làm trên máy này, mới nhất ở trên. Kết quả chỉ lưu trong trình duyệt của máy đang dùng, người khác không xem được.");
    if (!ds.length) return dau + '<div class="trong">Em chưa làm bài trắc nghiệm nào trên máy này. Làm thử một đề rồi quay lại đây xem tiến bộ của mình nhé!</div>' +
      '<a class="nut" href="#/vat-ly/12">Thi thử tốt nghiệp THPT ›</a>';
    const deDaLam = duyNhat(ds, "slug");
    const tb = ds.reduce(function (s, x) { return s + (Number(x.diem) || 0); }, 0) / ds.length;
    const cao = ds.reduce(function (m, x) { return Math.max(m, Number(x.diem) || 0); }, 0);
    return dau +
      '<div class="so-lieu">' + [[ds.length, "lần làm bài"], [deDaLam.length, "đề đã làm"], [soDiem(tb), "điểm trung bình"], [soDiem(cao), "điểm cao nhất"]].map(function (x) {
        return "<div><b>" + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span></div>";
      }).join("") + "</div>" +
      khoi("Lịch sử làm bài", '<div class="bang-cuon"><table class="bang-kq"><thead><tr><th>Ngày</th><th>Đề</th><th>Điểm</th><th>Thời gian làm</th></tr></thead><tbody>' +
        ds.map(function (x) {
          const d = dsDe.find(function (y) { return y.slug === x.slug; });
          const ngay = new Date(x.luc);
          return "<tr><td>" + esc(ngay.toLocaleDateString("vi-VN")) + '<span class="phu"> ' + esc(ngay.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })) + "</span></td>" +
            "<td>" + (d ? '<a href="#/lam-bai/' + esc(d.slug) + '">' + esc(x.ten) + "</a>" : esc(x.ten)) + '<span class="phu"> · ' + esc(x.mon + " · " + x.lop) + "</span></td>" +
            '<td class="bang-kq__diem">' + soDiem(Number(x.diem) || 0) + "</td><td>" + esc(Math.floor((x.giay || 0) / 60) + " phút " + ((x.giay || 0) % 60) + " giây") + "</td></tr>";
        }).join("") + "</tbody></table></div>") +
      '<button type="button" class="nut nut--phu" data-xoa-ls="1">Xóa lịch sử trên máy này</button>';
  }

  /* ----- Chạy Python ngay trên trang (Pyodide) ----- */
  const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
  let pyHua = null;
  function napPython() {
    if (!pyHua) {
      pyHua = new Promise(function (ok, loi) {
        const s = document.createElement("script");
        s.src = PYODIDE + "pyodide.js";
        s.integrity = "sha384-i3R37b3tF+HWudsUf1VSEOY2YxwSNMqY8DQa9Z0O3xh+NkJ9o+yjcGyIi5huj+nB";
        s.crossOrigin = "anonymous";
        s.onload = function () { window.loadPyodide({ indexURL: PYODIDE }).then(ok, loi); };
        s.onerror = function () { loi(new Error("Không tải được Python")); };
        document.head.appendChild(s);
      });
      pyHua.catch(function () { pyHua = null; });
    }
    return pyHua;
  }
  function khungPython(ma) {
    return '<div class="py-khung"><textarea class="py-ma" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Mã Python" rows="' +
      Math.min(18, Math.max(6, String(ma).split("\n").length + 1)) + '">' + esc(ma) + "</textarea>" +
      '<details class="py-vao-k"><summary>Dữ liệu vào cho lệnh input() (mỗi dòng một giá trị)</summary><textarea class="py-vao" rows="3" spellcheck="false" aria-label="Dữ liệu vào"></textarea></details>' +
      '<div class="hang-nut"><button type="button" class="nut nut--nho" data-py="chay">▶ Chạy</button><button type="button" class="nut nut--nho nut--phu" data-py="xoa">Xóa kết quả</button></div>' +
      '<pre class="py-kq" aria-live="polite" hidden></pre></div>';
  }
  function chayPython(khung) {
    const oKq = khung.querySelector(".py-kq"), nut = khung.querySelector('[data-py="chay"]');
    const ma = khung.querySelector(".py-ma").value;
    const vao = khung.querySelector(".py-vao").value.replace(/\r/g, "").replace(/\n+$/, "");
    const dong = vao ? vao.split("\n") : [];
    let iDong = 0;
    oKq.hidden = false;
    oKq.className = "py-kq";
    oKq.textContent = pyHua ? "Đang chạy…" : "Đang tải Python về máy (chỉ lần đầu, khoảng 10–30 giây)…";
    nut.disabled = true;
    napPython().then(function (py) {
      let ra = "";
      py.setStdout({ batched: function (s) { ra += s + "\n"; } });
      py.setStderr({ batched: function (s) { ra += s + "\n"; } });
      py.setStdin({ stdin: function () { return iDong < dong.length ? dong[iDong++] : undefined; } });
      return py.runPythonAsync(ma, { globals: py.toPy({}) }).then(function () {
        oKq.textContent = ra || "(Chương trình chạy xong, không in ra gì.)";
      }, function (e) {
        // Chỉ giữ phần lỗi thuộc chương trình của em (bỏ các dòng nội bộ của Pyodide).
        const dongLoi = String(e && e.message || e).trim().split("\n");
        const tu = dongLoi.findIndex(function (x) { return /File "<exec>"/.test(x); });
        const thongBao = tu >= 0 ? (/SyntaxError|IndentationError/.test(dongLoi[dongLoi.length - 1]) ? "" : "Traceback (most recent call last):\n") + dongLoi.slice(tu).join("\n") : dongLoi.join("\n");
        oKq.className = "py-kq py-kq--loi";
        oKq.textContent = ra + thongBao + (/EOFError/.test(thongBao) ? "\n\n→ Chương trình cần dữ liệu vào: em gõ vào ô \"Dữ liệu vào\" phía trên, mỗi dòng một giá trị." : "");
      });
    }).catch(function () {
      oKq.className = "py-kq py-kq--loi";
      oKq.textContent = "Chưa tải được Python. Em kiểm tra kết nối mạng rồi bấm Chạy lại.";
    }).then(function () { nut.disabled = false; });
  }
  // Chương trình mẫu: [tên, mã, dữ liệu vào].
  const MAU_PY = [
    ["Chào bạn", 'ten = input("Tên em là: ")\nprint("Xin chào", ten)\nprint("Chúc em học tốt Python!")', "An"],
    ["Tổng 1 đến n", "n = int(input())\ns = 0\nfor i in range(1, n + 1):\n    s = s + i\nprint(\"Tổng =\", s)", "100"],
    ["Số nguyên tố", "n = int(input())\nla_nt = n >= 2\nfor i in range(2, int(n ** 0.5) + 1):\n    if n % i == 0:\n        la_nt = False\n        break\nprint(n, \"là số nguyên tố\" if la_nt else \"không là số nguyên tố\")", "97"],
    ["Phương trình bậc hai", "import math\na, b, c = map(float, input().split())\ndelta = b * b - 4 * a * c\nif delta < 0:\n    print(\"Vô nghiệm\")\nelse:\n    x1 = (-b + math.sqrt(delta)) / (2 * a)\n    x2 = (-b - math.sqrt(delta)) / (2 * a)\n    print(\"x1 =\", x1, \"; x2 =\", x2)", "1 -3 2"],
    ["Vật lý: rơi tự do", "g = 9.8\nfor t in range(0, 6):\n    s = g * t * t / 2\n    v = g * t\n    print(f\"t = {t} s: quãng đường {s:.1f} m, vận tốc {v:.1f} m/s\")", ""]
  ];
  function trangPython() {
    document.title = "Chạy Python trực tuyến - " + THONG_TIN.tenTrang;
    return dauMuc("Chạy Python trực tuyến", "Viết và chạy chương trình Python ngay trên trang, không cần cài đặt. Chương trình có lệnh input() thì gõ dữ liệu vào ô \"Dữ liệu vào\", mỗi dòng một giá trị.") +
      '<div class="loc"><div class="loc__hang"><span class="loc__ten">Mẫu</span>' + MAU_PY.map(function (m, i) {
        return '<button type="button" class="chip" data-py-mau="' + i + '">' + esc(m[0]) + "</button>";
      }).join("") + "</div></div>" + khungPython(MAU_PY[4][1]) +
      '<p class="phu">Python chạy trong trình duyệt của em (Pyodide). Lần đầu cần tải khoảng 10 MB. Nếu chương trình lặp vô hạn, trang sẽ bị treo: em tải lại trang là được.</p>';
  }
  // Thêm nút "Chạy thử" dưới các đoạn mã Python trong bài học song ngữ.
  function ganNutChayPython(el) {
    el.querySelectorAll("pre.ma code.language-python").forEach(function (c) {
      const pre = c.closest("pre");
      if (!pre || (pre.nextElementSibling && pre.nextElementSibling.classList.contains("py-mo"))) return;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "nut nut--nho nut--phu py-mo";
      b.dataset.py = "mo";
      b.textContent = "▶ Chạy thử đoạn mã này";
      pre.after(b);
    });
  }

  /* ----- Bài học song ngữ ----- */
  function dongBai(b) {
    return '<li class="' + mauMon(b.mon, b.lop) + '"><span class="ds__loai">Bài học</span>' +
      '<span class="ds__ten"><b>' + esc(b.ten) + '</b><span class="phu">' + esc(b.mon) + " · " + esc(tenLop(b)) + (b.tenEn ? " · " + esc(b.tenEn) : "") + "</span></span>" +
      (b.tep ? '<a class="ds__mo" href="#/bai/' + esc(b.slug) + '">Đọc bài ›</a>' : '<span class="sap-co">Sắp có</span>') + "</li>";
  }
  // Các nhóm của trang Học song ngữ: 6 lớp + khóa tiếng Anh cho giáo viên (lop: "GV").
  const NHOM_SN = [
    { khoa: "vat-ly-10", mon: "Vật lý", lop: "10", ten: "Vật lý 10" },
    { khoa: "vat-ly-11", mon: "Vật lý", lop: "11", ten: "Vật lý 11" },
    { khoa: "vat-ly-12", mon: "Vật lý", lop: "12", ten: "Vật lý 12" },
    { khoa: "tin-hoc-10", mon: "Tin học", lop: "10", ten: "Tin học 10" },
    { khoa: "tin-hoc-11", mon: "Tin học", lop: "11", ten: "Tin học 11" },
    { khoa: "tin-hoc-12", mon: "Tin học", lop: "12", ten: "Tin học 12" },
    { khoa: "giao-vien", mon: "Tiếng Anh", lop: "GV", ten: "Dạy bằng tiếng Anh" }
  ];
  function khoaSN(b) { return b.lop === "GV" ? "giao-vien" : duongMon(b.mon) + "-" + b.lop; }
  function nhomSN(khoa) { return NHOM_SN.find(function (n) { return n.khoa === khoa; }); }
  function veLaiBai(b) { return b && b.lop === "GV" ? "#/giao-vien" : b && nhomSN(khoaSN(b)) ? "#/song-ngu/" + khoaSN(b) : "#/song-ngu"; }
  function tenVeLaiBai(b) { const n = b && nhomSN(khoaSN(b)); return n ? n.ten : "Học song ngữ"; }

  /* ----- Trang Học song ngữ: bài học song ngữ + từ điển thuật ngữ ----- */
  function theTu(t) {
    return window.BaiHoc.theThuatNgu(t, "tv-the " + mauMon(t.mon, t.lop), '<div class="tv-nhan" lang="vi">' + esc(t.mon + " " + t.lop) + "</div>");
  }
  function luoiTu(ds) {
    return '<div class="bh-the-ds" id="tv-ds">' + ds.map(function (t) {
      return theTu(t).replace("<article ", '<article data-tim="' + esc(boDau(t.en + " " + t.vi)) + '" ');
    }).join("") + "</div>";
  }
  function trangSongNgu(phu) {
    if (phu) return trangNhomSN(phu);
    document.title = "Học song ngữ - " + THONG_TIN.tenTrang;
    const tu = TV.filter(hopSongNgu);
    const gv = window.GiaoVien;
    return dauMuc("Học song ngữ Việt – Anh", "Học Vật lý và Tin học bằng hai ngôn ngữ: đọc bài ở chế độ Tiếng Việt, English hoặc Song ngữ; tra thuật ngữ và bấm loa để nghe phát âm. Chọn lớp để vào học.") +
      khoi("Vật lý", '<div class="thu-muc thu-muc--ba">' + NHOM_SN.filter(function (n) { return n.mon === "Vật lý"; }).map(theNhomSN).join("") + "</div>") +
      khoi("Tin học", '<div class="thu-muc thu-muc--ba">' + NHOM_SN.filter(function (n) { return n.mon === "Tin học"; }).map(theNhomSN).join("") + "</div>") +
      khoi("Dạy bằng tiếng Anh (dành cho giáo viên)", '<a class="gv-the-lon" href="#/giao-vien"><span class="thu-muc__cap">Giáo viên</span>' +
        "<h2>Dạy bằng tiếng Anh</h2><p>Lộ trình tự học để thầy cô Vật lý, Tin học tự tin dạy song ngữ: từ câu nói trong lớp học, đọc số – công thức, đến giảng bài theo môn và lên lớp thật với kịch bản tiết dạy mẫu.</p>" +
        '<ol class="gv-chang-ngan"><li><b>Làm quen</b><span>chào lớp, giao nhiệm vụ</span></li><li><b>Trong lớp học</b><span>hỏi đáp, khen, sửa lỗi</span></li><li><b>Theo môn</b><span>Vật lý hoặc Tin học</span></li><li><b>Lên lớp thật</b><span>kịch bản tiết dạy, tự đánh giá</span></li></ol>' +
        '<span class="phu">' + (gv ? gv.soBai + " bài luyện · " + gv.soCau + " câu · kiểm tra đầu vào · luyện nghe – nói – viết · nhắc lịch học" : "") + '</span><span class="thu-muc__vao">Bắt đầu học ›</span></a>') +
      khoi("Từ điển thuật ngữ Lý – Tin", '<div class="loc">' + hangLoc("Môn", "mon", ["Vật lý", "Tin học"]) + hangLoc("Lớp", "lop", ["10", "11", "12"]) + "</div>" + tuDienHTML(tu), "", "", "tu-dien") +
      (tu.length >= 4 ? khoi("Đố vui từ vựng", doVuiBatDauHTML(tu.length)) : "") +
      taiNguyenEnHTML();
  }
  function theNhomSN(n) {
    const bai = dsBai.filter(function (b) { return khoaSN(b) === n.khoa; }).length;
    const tu = TV.filter(function (t) { return t.mon === n.mon && t.lop === n.lop; }).length;
    const gv = n.lop === "GV";
    return '<a class="thu-muc__the ' + mauMon(n.mon, n.lop) + (gv ? " thu-muc__the--gv" : "") + '" href="' + (gv ? "#/giao-vien" : "#/song-ngu/" + n.khoa) + '"><span class="thu-muc__cap">' + esc(gv ? "Giáo viên" : "Lớp " + n.lop) + "</span>" +
      "<h2>" + esc(n.ten) + "</h2><p>" + esc(gv ? "Lộ trình tự học cho thầy cô chưa quen tiếng Anh: kiểm tra đầu vào, luyện nghe – nói – viết, ôn tập thông minh, nhắc lịch." : "Bài học song ngữ theo sách giáo khoa, thuật ngữ và đố vui từ vựng.") + "</p>" +
      '<span class="phu">' + (gv && window.GiaoVien ? window.GiaoVien.soBai + " bài luyện · " + window.GiaoVien.soCau + " câu · " + bai + " bài đọc" : bai + " bài · " + tu + " thuật ngữ") + '</span><span class="thu-muc__vao">Vào học ›</span></a>';
  }
  // Trang của một lớp (hoặc khóa giáo viên): bài học xếp theo chương, thuật ngữ, đố vui.
  function trangNhomSN(khoa) {
    const n = nhomSN(khoa);
    if (!n) return khongThay();
    const gv = n.lop === "GV";
    document.title = n.ten + " - Song ngữ - " + THONG_TIN.tenTrang;
    boLoc.mon = gv ? "" : n.mon;
    boLoc.lop = n.lop;
    const bai = dsBai.filter(function (b) { return khoaSN(b) === khoa; }).sort(function (a, b) {
      return (Number(a.soBai) || 999) - (Number(b.soBai) || 999) || b.thuTu - a.thuTu;
    });
    const chuong = duyNhat(bai.map(function (b) { return { c: b.chuong || "Bài học" }; }), "c");
    const tu = TV.filter(hopSongNgu);
    return '<a class="quay-lai" href="#/song-ngu">‹ Học song ngữ</a>' +
      dauMuc(n.ten + (gv ? "" : " – Song ngữ Việt – Anh"), gv
        ? "Khóa học dành cho thầy cô Vật lý, Tin học chưa quen tiếng Anh: bắt đầu từ cách đọc số, đọc công thức, câu nói trong lớp học… Mỗi bài có chế độ Song ngữ (tiếng Việt đặt cạnh tiếng Anh) và nút loa để nghe phát âm từng câu."
        : "Mỗi bài có 3 chế độ: Tiếng Việt, English và Song ngữ (hai thứ tiếng đặt cạnh nhau), kèm thẻ thuật ngữ có phát âm.") +
      (gv ? '<div class="song-ngu-gt"><p><b>Cách học gợi ý:</b> đọc bài ở chế độ <b>Song ngữ</b>; bấm loa ở các thẻ cuối bài, nghe và nói theo 3 lần; mỗi tuần học 1 bài và dùng thử vài câu trong giờ dạy.</p></div><div style="height:24px"></div>' : "") +
      (bai.length ? chuong.map(function (c) {
        return khoi(c, '<ul class="ds">' + bai.filter(function (b) { return (b.chuong || "Bài học") === c; }).map(dongBai).join("") + "</ul>");
      }).join("") : khoi("Bài học", '<div class="trong">Bài học song ngữ của ' + esc(n.ten) + " đang được biên soạn theo sách giáo khoa mới, sắp có.</div>")) +
      (gv ? "" : khoi("Thuật ngữ " + n.ten, tuDienHTML(tu), "", "", "tu-dien")) +
      (tu.length >= 4 ? khoi("Đố vui từ vựng", doVuiBatDauHTML(tu.length)) : "") +
      taiNguyenEnHTML();
  }
  function tuDienHTML(tu) {
    return tu.length
        ? '<div class="tv-cong-cu"><input type="search" id="tim-tu" placeholder="Tìm thuật ngữ (tiếng Việt hoặc tiếng Anh)…" aria-label="Tìm thuật ngữ">' +
          '<button type="button" class="chip" id="nut-an-nghia" aria-pressed="false">Tự kiểm tra: che nghĩa</button>' +
          '<span class="tv-dem" id="tv-dem">' + tu.length + " thuật ngữ</span></div>" + luoiTu(tu)
        : '<div class="trong">Chưa có thuật ngữ ở mục này.</div>';
  }
  // Tài nguyên học bằng tiếng Anh (danh sách trong noi-dung.js, mục HOC_TIENG_ANH).
  function taiNguyenEnHTML() {
    const ds = (typeof HOC_TIENG_ANH === "undefined" ? [] : HOC_TIENG_ANH).filter(function (x) {
      return linkAnToan(x.link) && (!boLoc.mon || x.mon === boLoc.mon);
    });
    if (!ds.length) return "";
    return khoi("Học thêm bằng tiếng Anh", '<p class="phu" style="margin-top:-6px">Các trang học miễn phí, uy tín của nước ngoài, dùng để luyện đọc và nghe Vật lý, Tin học bằng tiếng Anh.</p><div class="lien-ket">' +
      ds.map(function (x) {
        return '<a class="lien-ket__muc ' + mauMon(x.mon, "") + '" target="_blank" rel="noopener" href="' + esc(linkAnToan(x.link)) + '"><b>' + esc(x.ten) + ' ↗</b><span class="phu">' + esc(x.mon + " · " + x.moTa) + "</span></a>";
      }).join("") + "</div>");
  }

  /* ----- Đố vui từ vựng (trang Học song ngữ) ----- */
  let doVui = null;
  function hopSongNgu(x) { return (!boLoc.mon || x.mon === boLoc.mon) && (!boLoc.lop || x.lop === boLoc.lop); }
  function doVuiBatDauHTML() {
    return '<div class="do-vui" id="do-vui"><p>Mỗi lượt 10 câu: chọn nghĩa đúng của thuật ngữ (theo môn, lớp em đang chọn ở trên). Trả lời xong, bấm loa để nghe phát âm.</p>' +
      '<div class="hang-nut"><button type="button" class="nut" data-dv="en-vi">Anh → Việt</button><button type="button" class="nut nut--phu" data-dv="vi-en">Việt → Anh</button></div></div>';
  }
  function xuLyDoVui(lenh) {
    const o = document.getElementById("do-vui");
    if (!o) return;
    if (lenh === "en-vi" || lenh === "vi-en") {
      const kho = TV.filter(hopSongNgu);
      if (kho.length < 4) return;
      doVui = { chieu: lenh, kho: kho, ds: tronDs(kho).slice(0, Math.min(10, kho.length)), i: 0, dung: 0, daChon: false };
      veDoVui();
    } else if (lenh === "tiep" && doVui) {
      doVui.i++; doVui.daChon = false; veDoVui();
    } else if (lenh === "lai" && doVui) {
      xuLyDoVui(doVui.chieu);
    } else if (lenh === "ve") {
      doVui = null; o.outerHTML = doVuiBatDauHTML();
    } else if (lenh.indexOf("chon-") === 0 && doVui && !doVui.daChon) {
      const g = doVui, q = g.ds[g.i], chon = g.lc[Number(lenh.slice(5))];
      g.daChon = true;
      if (chon === q) g.dung++;
      o.querySelectorAll("[data-dv^='chon-']").forEach(function (b) {
        const t = g.lc[Number(b.dataset.dv.slice(5))];
        b.disabled = true;
        if (t === q) b.classList.add("tc-nut--dung");
        else if (t === chon) b.classList.add("tc-nut--sai");
      });
      o.querySelector(".do-vui__sau").innerHTML = '<p class="tc-goi-y">' + (chon === q ? "Đúng rồi! " : "Chưa đúng. ") +
        "<b lang=\"en\">" + esc(q.en) + "</b> " + (q.ipa ? esc(q.ipa) + " " : "") + "= <b>" + esc(q.vi) + "</b> " + window.BaiHoc.nutNghe(q.en) + "</p>" +
        (q.ghiChu ? '<p class="phu">' + TN.dongChu(q.ghiChu) + "</p>" : "") +
        '<button type="button" class="nut nut--nho" data-dv="tiep">' + (g.i + 1 < g.ds.length ? "Câu tiếp ›" : "Xem kết quả ›") + "</button>";
      toan(o);
      window.BaiHoc.phatAm(q.en);
    }
  }
  function veDoVui() {
    const g = doVui, o = document.getElementById("do-vui");
    if (!g || !o) return;
    if (g.i >= g.ds.length) {
      o.innerHTML = '<div class="do-vui__kq"><b>' + g.dung + "/" + g.ds.length + "</b><span>câu đúng</span></div><p>" +
        (g.dung === g.ds.length ? "Tuyệt vời! Em nhớ hết các thuật ngữ." : g.dung >= g.ds.length * 0.7 ? "Tốt lắm! Ôn thêm vài từ nữa là thuộc hết." : "Em xem lại Từ điển thuật ngữ ở trên rồi chơi lại nhé.") + "</p>" +
        '<div class="hang-nut"><button type="button" class="nut" data-dv="lai">Chơi lại</button><button type="button" class="nut nut--phu" data-dv="ve">Đổi chiều</button></div>';
      return;
    }
    const q = g.ds[g.i];
    const khac = tronDs(g.kho.filter(function (t) { return t !== q && t.en !== q.en && t.vi !== q.vi; }));
    const cungMon = khac.filter(function (t) { return t.mon === q.mon; });
    g.lc = tronDs([q].concat((cungMon.length >= 3 ? cungMon : khac).slice(0, 3)));
    const hoiEn = g.chieu === "en-vi";
    o.innerHTML = '<div class="tro-choi__dau"><b>Câu ' + (g.i + 1) + "/" + g.ds.length + '</b><span class="phu">Đúng: ' + g.dung + "</span></div>" +
      '<div class="do-vui__hoi"' + (hoiEn ? ' lang="en"' : "") + "><b>" + esc(hoiEn ? q.en : q.vi) + "</b>" +
      (hoiEn ? (q.ipa ? ' <span class="bh-ipa">' + esc(q.ipa) + "</span> " : " ") + window.BaiHoc.nutNghe(q.en) : "") + "</div>" +
      '<p class="phu">' + (hoiEn ? "Nghĩa tiếng Việt là gì?" : "Tiếng Anh là gì?") + "</p>" +
      '<div class="tc-lc">' + g.lc.map(function (t, i) {
        return '<button type="button" class="tc-nut" data-dv="chon-' + i + '"' + (hoiEn ? "" : ' lang="en"') + '><span class="lc__nhan">' + "ABCD"[i] + '</span><span class="lc__chu">' + esc(hoiEn ? t.vi : t.en) + "</span></button>";
      }).join("") + '</div><div class="do-vui__sau"></div>';
  }
  let baiDangDoc = null;
  function trangBai(slug) {
    const b = dsBai.find(function (x) { return x.slug === slug && x.tep; });
    if (!b) return khongThay();
    document.title = b.ten + " - " + THONG_TIN.tenTrang;
    return '<a class="quay-lai" href="' + veLaiBai(b) + '">‹ ' + esc(tenVeLaiBai(b)) + '</a><div id="bai-hoc" data-slug="' + esc(slug) + '"><p class="phu">Đang tải bài học…</p></div>';
  }
  function moBai(slug) {
    const b = dsBai.find(function (x) { return x.slug === slug && x.tep; });
    if (!b || !window.BaiHoc) return;
    fetch(b.tep + (b.tep.indexOf("?") < 0 ? "?" : "&") + "t=" + Date.now())
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (bai) {
        const h = document.getElementById("bai-hoc");
        if (!h || h.dataset.slug !== slug) return;
        baiDangDoc = bai;
        veBaiDangDoc();
      })
      .catch(function () {
        const h = document.getElementById("bai-hoc");
        if (h) h.innerHTML = '<div class="loi"><h2>Chưa tải được bài học</h2><p>Kiểm tra kết nối mạng, hoặc kiểm tra tệp ' + esc(b.tep) + " có đúng định dạng JSON không.</p></div>";
      });
  }
  function veBaiDangDoc() {
    const h = document.getElementById("bai-hoc");
    if (!h || !baiDangDoc) return;
    const cheDo = window.BaiHoc.docCheDo();
    h.innerHTML = window.BaiHoc.nutCheDo(cheDo) + '<article class="bai-hoc">' + window.BaiHoc.ve(baiDangDoc, cheDo) + "</article>";
    if (!window.BaiHoc.coPhatAm()) h.querySelectorAll(".bh-nghe").forEach(function (n) { n.hidden = true; });
    toan(h);
    ganNutChayPython(h);
  }

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
    const thiThu = laThiThu(d), cao = diemCaoNhat(d.slug);
    return '<li class="' + (thiThu ? "mau-hsg" : mauMon(d.mon, d.lop)) + '"><span class="ds__loai">' + esc(thiThu ? "Thi thử" : (d.loai || "Luyện tập")) + "</span>" +
      '<span class="ds__ten"><b>' + esc(d.ten) + '</b><span class="phu">' + esc(d.mon) + " · " + esc(tenLop(d)) +
      (d.thoiGian ? " · " + esc(d.thoiGian) + " phút" : "") + "</span>" +
      (cao !== null ? '<span class="diem-cao">Điểm cao nhất của em: ' + soDiem(Number(cao) || 0) + "</span>" : "") + "</span>" +
      (d.tep ? '<a class="ds__mo" href="#/lam-bai/' + esc(d.slug) + '">Làm bài ›</a>' : '<span class="sap-co">Sắp có</span>') + "</li>";
  }
  function dsDeHTML(ds, rong) {
    return ds.length ? '<ul class="ds">' + ds.map(dongDe).join("") + "</ul>" : '<div class="trong">' + esc(rong || "Chưa có đề ở mục này.") + "</div>";
  }
  // Trang lớp: xếp đề theo số bài (Bài 1, 2, 3...). Bài có nhiều đề ("Bài N – Đề K. Tên") gom vào một dòng,
  // mỗi đề là một nút, để danh sách không dài quá.
  const R_DE_BAI = /^Bài\s+(\d+)\s*(?:[–-]\s*Đề\s+(\d+))?\s*[.:]\s*(.*)$/;
  function dongNhomDe(n) {
    const d0 = n.de[0].d;
    const cungTG = n.de.every(function (x) { return x.d.thoiGian === d0.thoiGian; });
    return '<li class="' + mauMon(d0.mon, d0.lop) + '"><span class="ds__loai">' + esc(d0.loai || "Luyện tập") + "</span>" +
      '<span class="ds__ten"><b>Bài ' + n.so + ". " + esc(n.ten) + '</b><span class="phu">' + esc(d0.mon) + " · " + esc(tenLop(d0)) +
      " · " + n.de.length + " đề" + (cungTG && d0.thoiGian ? " · " + esc(d0.thoiGian) + " phút mỗi đề" : "") + "</span></span>" +
      '<span class="ds__de">' + n.de.map(function (x, i) {
        const ten = "Đề " + (x.soDe || i + 1), cao = diemCaoNhat(x.d.slug);
        const diem = cao !== null ? soDiem(Number(cao) || 0) : "";
        return '<a class="nut-de" href="#/lam-bai/' + esc(x.d.slug) + '" aria-label="Bài ' + n.so + ", " + ten +
          (diem ? ", điểm cao nhất của em " + diem : "") + '">' + ten + (diem ? "<small>" + diem + " đ</small>" : "") + "</a>";
      }).join("") + "</span></li>";
  }
  function dsDeTheoBai(ds, rong) {
    const nhom = {}, so = [], khac = [];
    ds.forEach(function (d) {
      const m = String(d.ten).match(R_DE_BAI);
      if (!m) { khac.push(d); return; }
      const k = Number(m[1]);
      if (!nhom[k]) { nhom[k] = { so: k, ten: m[3], de: [] }; so.push(k); }
      nhom[k].de.push({ d: d, soDe: m[2] ? Number(m[2]) : 0 });
    });
    if (!so.length) return dsDeHTML(ds, rong);
    so.sort(function (a, b) { return a - b; });
    return '<ul class="ds">' + so.map(function (k) {
      const n = nhom[k];
      n.de.sort(function (a, b) { return a.soDe - b.soDe || a.d.thuTu - b.d.thuTu; });
      return n.de.length > 1 ? dongNhomDe(n) : dongDe(n.de[0].d);
    }).join("") + khac.map(dongDe).join("") + "</ul>";
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
      khoi("Học song ngữ Việt – Anh", '<div class="song-ngu-gt"><p>Đọc bài Vật lý, Tin học bằng tiếng Việt, tiếng Anh hoặc song ngữ. Tra ' + TV.length +
        " thuật ngữ Lý – Tin, bấm loa nghe phát âm và tự kiểm tra từ vựng.</p>" +
        '<a class="nut" href="#/song-ngu">Vào học song ngữ ›</a></div>') +
      khoi("Công cụ học tập", '<div class="lien-ket">' + [
        ["#/giao-vien", "Dạy bằng tiếng Anh (giáo viên)", "Lộ trình tự học miễn phí để dạy Lý – Tin song ngữ: nghe, nói, chép chính tả, kịch bản tiết dạy"],
        ["#/thi-nghiem", "Thí nghiệm ảo Vật lý", dsThiNghiem.length + " mô phỏng PhET tiếng Việt, tự làm thí nghiệm ngay trên trang"],
        ["#/python", "Chạy Python trực tuyến", "Viết và chạy chương trình Python không cần cài đặt"],
        ["#/ket-qua", "Kết quả của em", "Xem lại điểm các bài đã làm và theo dõi tiến bộ"],
        ["#/tro-choi", "Leo tháp kiến thức", "Trò chơi trả lời nhanh 15 câu hỏi"]
      ].map(function (x) {
        return '<a class="lien-ket__muc" href="' + x[0] + '"><b>' + esc(x[1]) + ' ›</b><span class="phu">' + esc(x[2]) + "</span></a>";
      }).join("") + "</div>") +
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
    muc.push(["trac-nghiem", "Trắc nghiệm luyện tập", dsDeTheoBai(de.filter(function (d) { return !laThiThu(d); }), "Đề luyện tập đang được biên soạn, sắp có.")]);
    const baiLop = dsBai.filter(hop), tlLop = dsTaiLieu.filter(hop);
    muc.push(["tai-lieu", "Tài liệu bài giảng", baiLop.length || tlLop.length
      ? (baiLop.length ? '<ul class="ds">' + baiLop.map(dongBai).join("") + "</ul>" : "") + (tlLop.length ? (baiLop.length ? '<div style="height:12px"></div>' : "") + dsTL(tlLop) : "")
      : '<div class="trong">Tài liệu bài giảng đang được cập nhật.</div>']);
    muc.push(["video", "Video bài giảng", luoiVideo(dsVideo.filter(hop), "Video bài giảng sắp có.")]);
    const tnLop = mon === "Vật lý" ? dsThiNghiem.filter(function (t) { return t.lop === lop; }) : [];
    if (tnLop.length) muc.push(["thi-nghiem", "Thí nghiệm ảo", luoiThiNghiem(tnLop)]);
    if (mon === "Tin học") muc.push(["python", "Chạy Python trực tuyến", '<div class="song-ngu-gt"><p>Viết và chạy thử chương trình Python ngay trên trang, không cần cài đặt; có sẵn chương trình mẫu.</p><a class="nut" href="#/python">Mở trình chạy Python ›</a></div>']);
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
  // Vẽ công thức (KaTeX) và tô màu mã (Prism). KaTeX bỏ qua <pre>, <code> nên dấu $ trong mã giữ nguyên.
  function toan(el) {
    if (window.renderMathInElement) {
      window.renderMathInElement(el, {
        delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
        throwOnError: false
      });
    } else {
      window.addEventListener("load", function () { if (window.renderMathInElement) toan(el); }, { once: true });
    }
    if (window.Prism && window.Prism.highlightAllUnder) window.Prism.highlightAllUnder(el);
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
        '<label class="bay" aria-hidden="true">Để trống ô này<input id="hoi-web" tabindex="-1" autocomplete="off"></label>' +
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
    const goi = { loai: "hoi", ten: gt("hoi-ten"), lop: gt("hoi-lop"), mon: gt("hoi-mon"), cauHoi: gt("hoi-noi-dung"), web: gt("hoi-web") };
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
    const giay = Math.max(0, Math.round((luc.getTime() - b.batDauLuc) / 1000));
    ghiLichSu({ slug: b.d.slug, ten: b.d.ten, mon: b.d.mon, lop: tenLop(b.d), diem: kq.diem10, luc: luc.getTime(), giay: giay });
    manHinhKetQua(kq, luc);
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
      '<div class="hang-nut"><button type="button" class="nut" data-bai="lamlai">Làm lại đề này</button><a class="nut nut--phu" href="' + veLaiDe(d) + '">Chọn đề khác</a>' +
      '<a class="nut nut--phu" href="#/ket-qua">Kết quả của em ›</a></div></div></section>' +
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
    // Chỉ hiện bộ lọc Môn khi thư mục có cả bài Vật lý và Tin học.
    const coHaiMon = duyNhat(dsVideo.concat(dsTaiLieu).filter(laHSG(cap)), "mon").length > 1;
    return '<a class="quay-lai" href="#/hsg">‹ Ôn thi HSG</a>' + dauMuc(tm.ten, tm.moTa) +
      (coHaiMon ? '<div class="loc">' + hangLoc("Môn", "mon", ["Vật lý", "Tin học"]) + "</div>" : "") +
      khoi("Video bài giảng", luoiVideo(video), playlist, "Xem trên YouTube ↗") +
      khoi("Chuyên đề và đề thi", (tatCa.length ? '<div class="loc">' + hangLoc("Loại", "loai", duyNhat(tatCa, "loai")) + "</div>" : "") + dsTL(tl)) +
      (dsThiNghiem.some(laHSG(cap)) ? khoi("Thí nghiệm ảo", luoiThiNghiem(dsThiNghiem.filter(laHSG(cap)))) : "") +
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
  // Phụ đề video: "tat", "vi" hoặc "en" (nhớ lựa chọn trên máy học sinh).
  function docPhuDe() { try { const x = localStorage.getItem("phu-de"); return x === "vi" || x === "en" ? x : "tat"; } catch (e) { return "tat"; } }
  function linkNhung(id, phuDe) {
    return "https://www.youtube-nocookie.com/embed/" + id + "?rel=0" +
      (phuDe === "tat" ? "" : "&cc_load_policy=1&cc_lang_pref=" + phuDe + "&hl=" + phuDe);
  }
  function xemVideo(slug) {
    const v = dsVideo.find(function (x) { return x.slug === slug && x.id; });
    if (!v) return khongThay();
    document.title = v.ten + " - " + THONG_TIN.tenTrang;
    const taiLieu = linkAnToan(v.taiLieu);
    const cungNhom = v.lop === "HSG"
      ? function (x) { return laHSG(capCua(v))(x); }
      : function (x) { return x.mon === v.mon && x.lop === v.lop; };
    // Bài trước / bài tiếp theo theo thứ tự học trong cùng thư mục (hoặc cùng khối lớp).
    const nhom = dsVideo.filter(function (x) { return x.id && (x === v || cungNhom(x)); }).sort(theoThuTuHoc);
    const vt = nhom.indexOf(v), truoc = nhom[vt - 1], sau = nhom[vt + 1];
    const keTiep = truoc || sau ? '<nav class="bai-ke" aria-label="Chuyển bài">' +
      (truoc ? '<a class="bai-ke__muc" href="#/video/' + esc(truoc.slug) + '"><span class="phu">‹ Bài trước</span><b>' + esc(truoc.ten) + "</b></a>" : "") +
      (sau ? '<a class="bai-ke__muc bai-ke__muc--sau" href="#/video/' + esc(sau.slug) + '"><span class="phu">Bài tiếp theo ›</span><b>' + esc(sau.ten) + "</b></a>" : "") + "</nav>" : "";
    const cungCD = v.chuDe ? nhom.filter(function (x) { return x !== v && x.chuDe === v.chuDe; }) : [];
    const lienQuan = cungCD.length ? cungCD : dsVideo.filter(function (x) { return x !== v && x.id && cungNhom(x); }).sort(v.lop === "HSG" ? theoThuTuHoc : theoNgay).slice(0, 8);
    const tenLienQuan = cungCD.length ? "Cùng " + v.chuDe.split(" - ")[0].split(".")[0] : v.lop === "HSG" ? "Cùng thư mục " + THU_MUC[capCua(v)].ten : "Video cùng khối";
    const veLai = v.lop === "HSG" ? ["#/hsg/" + capCua(v).toLowerCase(), "Thư mục " + THU_MUC[capCua(v)].ten] : ["#/video", "Tất cả video"];
    const phuDe = docPhuDe();
    return '<div class="xem"><a class="quay-lai" href="' + veLai[0] + '">‹ ' + esc(veLai[1]) + '</a><div class="khung-phat">' +
      '<iframe id="khung-video" data-id="' + v.id + '" src="' + linkNhung(v.id, phuDe) + '" title="' + esc(v.ten) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>' +
      '<div class="phu-de" role="group" aria-label="Phụ đề"><span class="loc__ten">Phụ đề / Subtitles</span>' +
      [["tat", "Tắt"], ["vi", "Tiếng Việt"], ["en", "English"]].map(function (x) {
        return '<button type="button" class="chip" data-phu-de="' + x[0] + '" aria-pressed="' + (phuDe === x[0]) + '">' + x[1] + "</button>";
      }).join("") + "</div>" +
      '<p class="phu phu-de__ghi" id="ghi-phu-de"' + (phuDe === "en" ? "" : " hidden") + '>Phụ đề tiếng Anh do YouTube dịch tự động từ tiếng Việt nên có chỗ chưa chuẩn, nhất là công thức. Nếu chưa thấy phụ đề tiếng Anh: bấm ⚙ (Cài đặt) trên video → Phụ đề → Tự động dịch → English.</p>' +
      "<h1>" + esc(v.ten) + "</h1>" + (v.tenEn ? '<p class="xem__en" lang="en">' + esc(v.tenEn) + "</p>" : "") +
      '<div class="phu">' + esc(v.mon) + " · " + esc(tenLop(v)) + (v.chuDe ? " · " + esc(v.chuDe) : "") + "</div>" +
      (v.moTa ? '<p class="xem__mota">' + esc(v.moTa) + "</p>" : "") +
      (taiLieu ? '<a class="nut" target="_blank" rel="noopener" href="' + esc(taiLieu) + '">Tải tài liệu kèm theo ↗</a>' : "") + keTiep + "</div>" +
      (lienQuan.length ? '<div style="height:32px"></div>' + khoi(tenLienQuan, luoiVideo(lienQuan), veLai[0], esc(veLai[1]) + " ›") : "");
  }
  function timKiem(q) {
    document.title = "Tìm kiếm - " + THONG_TIN.tenTrang;
    const tu = boDau(q).split(/\s+/).filter(Boolean);
    const khop = function (x) {
      const chu = boDau([x.ten, x.tenEn, x.mon, x.lop, x.lop === "HSG" ? capCua(x) : "", x.chuDe, x.loai].join(" "));
      return tu.length > 0 && tu.every(function (t) { return chu.indexOf(t) >= 0; });
    };
    const v = dsVideo.filter(khop), t = dsTaiLieu.filter(khop), d = dsDe.filter(khop);
    const bh = dsBai.filter(function (x) { return khop(Object.assign({}, x, { chuDe: x.tenEn })); });
    const tv = TV.filter(function (x) {
      return tu.length > 0 && boDau(x.en + " " + x.vi).indexOf(cumTu(q)) >= 0;
    });
    const tn = dsThiNghiem.filter(function (x) { return khop(Object.assign({}, x, { loai: x.moTa })); });
    const tong = v.length + t.length + d.length + bh.length + tv.length + tn.length;
    return dauMuc('Kết quả cho "' + q + '"', tong + " kết quả") +
      (tn.length ? khoi("Thí nghiệm ảo", luoiThiNghiem(tn)) : "") +
      (tv.length ? khoi("Thuật ngữ Việt – Anh", '<div class="bh-the-ds">' + tv.slice(0, 12).map(theTu).join("") + "</div>", "#/song-ngu", "Từ điển thuật ngữ ›") : "") +
      (bh.length ? khoi("Bài học", '<ul class="ds">' + bh.map(dongBai).join("") + "</ul>") : "") +
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
      (mail ? '<p class="lien-he__mail">Em có thắc mắc hoặc muốn gửi bài cho thầy, hãy viết email về địa chỉ <a href="mailto:' + esc(mail) + '"><b>' + esc(mail) + "</b></a>. " +
        'Câu hỏi về bài học, em cũng có thể gửi ở mục <a href="#/hoi-dap">Hỏi – Đáp</a>.</p>' : "") +
      (ds.length ? '<div class="lien-he">' + ds.map(function (x) {
        const thu = x[1].indexOf("mailto:") === 0;
        return '<a class="nut" style="margin:0"' + (thu ? "" : ' target="_blank" rel="noopener"') + ' href="' + esc(x[1]) + '">' + x[0] + "</a>";
      }).join("") + "</div>" : "") +
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
    if (ten === "bai") return trangBai(phu);
    if (ten === "tro-choi") return trangTroChoi(phu);
    if (ten === "doc") return docTaiLieu(phu);
    if (ten === "song-ngu") return trangSongNgu(phu);
    if (ten === "thi-nghiem") return trangThiNghiem(phu);
    if (ten === "ket-qua") return trangKetQua();
    if (ten === "python") return trangPython();
    if (ten === "giao-vien") return window.GiaoVien ? window.GiaoVien.trang(phu) : khongThay();
    return khongThay();
  }
  function hienThi() {
    dungDongHo();
    baiThi = null;
    baiDangDoc = null;
    dungDongHoTroChoi();
    troChoi = null;
    doVui = null;
    app.innerHTML = veTrang();
    const d = phanDuong();
    let ten = d[0];
    if (ten === "lam-bai" || ten === "doc" || ten === "bai") {
      const x = (ten === "lam-bai" ? dsDe : ten === "bai" ? dsBai : dsTaiLieu).find(function (y) { return y.slug === d[1]; });
      ten = !x ? "" : d[0] === "bai" ? "song-ngu" : x.lop === "HSG" ? "hsg" : duongMon(x.mon);
    }
    document.querySelectorAll(".menu a").forEach(function (a) {
      if (a.dataset.trang === ten) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    if (d[0] === "lam-bai" && hop()) moDe(d[1]);
    if (d[0] === "bai" && document.getElementById("bai-hoc")) moBai(d[1]);
    if (d[0] === "tro-choi" && d[1] && document.getElementById("tro-choi")) moTroChoi(d[1]);
    if (d[0] === "giao-vien" && window.GiaoVien) window.GiaoVien.sauKhiVe();
    if (d[0] === "song-ngu" || d[0] === "tim") {
      toan(app);
      if (!window.BaiHoc.coPhatAm()) app.querySelectorAll(".bh-nghe").forEach(function (n) { n.hidden = true; });
    }
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
  // Phím Tab trong ô viết mã Python: chèn 4 dấu cách thay vì chuyển sang ô khác.
  app.addEventListener("keydown", function (e) {
    const o = e.target;
    if (e.key !== "Tab" || e.shiftKey || !o.classList || !o.classList.contains("py-ma")) return;
    e.preventDefault();
    const dau = o.selectionStart, cuoi = o.selectionEnd;
    o.value = o.value.slice(0, dau) + "    " + o.value.slice(cuoi);
    o.selectionStart = o.selectionEnd = dau + 4;
  });
  app.addEventListener("input", function (e) {
    if (e.target.id === "tim-tu") { locTuVung(e.target.value); return; }
    if (e.target.type === "text") ghiTraLoi(e);
  });
  // Tìm thuật ngữ theo cả cụm từ (không dấu), ví dụ "gia toc" khớp "gia tốc" nhưng không khớp "giao thức".
  function cumTu(q) { return boDau(q).trim().replace(/\s+/g, " "); }
  function locTuVung(q) {
    const cum = cumTu(q);
    let dem = 0;
    document.querySelectorAll("#tv-ds [data-tim]").forEach(function (o) {
      const hien = o.dataset.tim.indexOf(cum) >= 0;
      o.hidden = !hien;
      if (hien) dem++;
    });
    const o = document.getElementById("tv-dem");
    if (o) o.textContent = dem ? dem + " thuật ngữ" : "Không tìm thấy thuật ngữ phù hợp";
  }

  app.addEventListener("click", function (e) {
    const ngonNgu = e.target.closest("[data-ngon-ngu]");
    if (ngonNgu && baiDangDoc) {
      window.BaiHoc.ghiCheDo(ngonNgu.dataset.ngonNgu);
      veBaiDangDoc();
      const lai = app.querySelector('[data-ngon-ngu="' + ngonNgu.dataset.ngonNgu + '"]');
      if (lai) lai.focus();
      return;
    }
    const nghe = e.target.closest("[data-doc]");
    if (nghe) { window.BaiHoc.phatAm(nghe.dataset.doc); return; }
    // Từ điển thuật ngữ: che nghĩa để tự kiểm tra, bấm vào thẻ để xem nghĩa.
    if (e.target.closest("#nut-an-nghia")) {
      const ds = document.getElementById("tv-ds"), nutAn = document.getElementById("nut-an-nghia");
      const an = !ds.classList.contains("tv-ds--an");
      ds.classList.toggle("tv-ds--an", an);
      ds.querySelectorAll(".bh-the--lo").forEach(function (x) { x.classList.remove("bh-the--lo"); });
      nutAn.setAttribute("aria-pressed", String(an));
      nutAn.textContent = an ? "Đang che nghĩa: bấm vào thẻ để xem" : "Tự kiểm tra: che nghĩa";
      return;
    }
    const theTuVung = e.target.closest(".tv-ds--an .bh-the");
    if (theTuVung) { theTuVung.classList.toggle("bh-the--lo"); return; }
    // Chọn phụ đề video
    const nutPhuDe = e.target.closest("[data-phu-de]");
    if (nutPhuDe) {
      const pd = nutPhuDe.dataset.phuDe, f = document.getElementById("khung-video");
      try { localStorage.setItem("phu-de", pd); } catch (loi) { /* bỏ qua */ }
      if (f) f.src = linkNhung(f.dataset.id, pd);
      app.querySelectorAll("[data-phu-de]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === nutPhuDe)); });
      const ghi = document.getElementById("ghi-phu-de");
      if (ghi) ghi.hidden = pd !== "en";
      return;
    }
    // Đố vui từ vựng
    const dv = e.target.closest("[data-dv]");
    if (dv) { xuLyDoVui(dv.dataset.dv); return; }
    // Chạy Python
    const py = e.target.closest("[data-py]");
    if (py) {
      const v = py.dataset.py;
      if (v === "mo") {
        const pre = py.previousElementSibling, ma = pre ? pre.textContent : "";
        const o = document.createElement("div");
        o.innerHTML = khungPython(ma.replace(/\n$/, ""));
        py.replaceWith(o.firstChild);
      } else {
        const khung = py.closest(".py-khung");
        if (khung && v === "chay") chayPython(khung);
        if (khung && v === "xoa") { const k = khung.querySelector(".py-kq"); k.textContent = ""; k.hidden = true; }
      }
      return;
    }
    const mauPy = e.target.closest("[data-py-mau]");
    if (mauPy) {
      const m = MAU_PY[Number(mauPy.dataset.pyMau)], khung = app.querySelector(".py-khung");
      if (m && khung) {
        khung.querySelector(".py-ma").value = m[1];
        khung.querySelector(".py-vao").value = m[2];
        khung.querySelector(".py-vao-k").open = !!m[2];
        const k = khung.querySelector(".py-kq"); k.textContent = ""; k.hidden = true;
      }
      return;
    }
    // Xóa lịch sử làm bài: bấm hai lần để chắc chắn.
    const xoaLS = e.target.closest("[data-xoa-ls]");
    if (xoaLS) {
      if (xoaLS.dataset.xoaLs === "2") { ghiLuu(KHOA_LS, null); hienThi(); }
      else { xoaLS.dataset.xoaLs = "2"; xoaLS.textContent = "Bấm lần nữa để xóa hẳn lịch sử"; }
      return;
    }
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

  // Phím tắt dành cho thầy/cô: Ctrl + Shift + E mở Công cụ thêm bài.
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && !e.altKey && (e.key === "E" || e.key === "e" || e.code === "KeyE")) {
      e.preventDefault();
      location.href = "them-bai.html";
    }
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
  const thuGV = String(THONG_TIN.email || "").trim();
  const mxh = [["YouTube", linkAnToan(THONG_TIN.youtube)], ["Facebook", linkAnToan(THONG_TIN.facebook)], ["Email", thuGV ? "mailto:" + thuGV : ""]].filter(function (x) { return x[1]; });
  if (mxh.length) {
    const o = document.createElement("span");
    o.className = "chan-trang__mxh";
    o.innerHTML = mxh.map(function (x) {
      return x[0] === "Email" ? '<a href="' + esc(x[1]) + '">' + esc(thuGV) + "</a>" : '<a target="_blank" rel="noopener" href="' + esc(x[1]) + '">' + x[0] + " ↗</a>";
    }).join(" · ");
    document.getElementById("chan-ten").after(o);
  }
  if (THONG_TIN.thongBao) {
    document.getElementById("thong-bao").innerHTML = '<div class="bang-tin">' + esc(THONG_TIN.thongBao) + "</div>";
  }
  datLocTheoDuong();
  hienThi();
  demLuotTruyCap();
})();
