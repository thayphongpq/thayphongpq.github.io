/* Bộ đọc đề và chấm điểm trắc nghiệm. Thầy/cô không cần sửa tệp này.

   Cách chấm theo cấu trúc đề thi tốt nghiệp THPT từ năm 2025:
   - Câu nhiều lựa chọn (A, B, C, D): đúng được 0,25 điểm.
   - Câu đúng/sai (4 ý a, b, c, d): đúng 1 ý 0,1; 2 ý 0,25; 3 ý 0,5; cả 4 ý 1 điểm.
   - Câu trả lời ngắn: đúng được 0,25 điểm (đổi được bằng dòng "Điểm trả lời ngắn: ...").
   Điểm cuối cùng được quy về thang 10. */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Đổi chữ trong đề thành HTML: giữ xuống dòng, `mã` và khối ``` mã ```.
  function dinhDang(s) {
    return String(s || "").split(/```[^\n]*\n?/).map(function (doan, i) {
      if (i % 2) return '<pre class="ma"><code>' + esc(doan.replace(/\n$/, "")) + "</code></pre>";
      doan = doan.replace(/^\n+|\n+$/g, "");
      if (!doan) return "";
      return esc(doan)
        .replace(/`([^`\n]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>")
        .replace(/\n/g, "<br>");
    }).join("");
  }

  const R_PHAN = /^ph[aầ]n\s+([ivx\d]+)\b/i;
  const R_CAU = /^c[aâ]u\s*(\d+)\s*[.:)]\s*(.*)$/i;
  const R_LUA_CHON = /^(\*?)\s*([A-D])\s*[.)]\s*(.*)$/;
  const R_Y = /^([a-d])\s*\)\s*(.*)$/;
  const R_DAU_DS = /\(\s*([đĐdD]|[đĐ]úng|[sS]ai|[sS])\s*\)\s*$/;
  const R_DAP_AN = /^[đĐ]áp\s*án\s*:\s*(.*)$/i;
  const R_LOI_GIAI = /^l[ờo]i\s*gi[ảa]i\s*:\s*(.*)$/i;
  const R_HINH = /^h[ìi]nh\s*:\s*(\S+)/i;
  const R_THOI_GIAN = /^th[ờo]i\s*gian\s*:\s*(\d+)/i;
  const R_DIEM_TL = /^[đĐ]i[ểe]m\s*tr[ảa]\s*l[ờo]i\s*ng[ắa]n\s*:\s*([\d.,]+)/i;

  function phanTich(text) {
    const de = { thoiGian: 0, diemTL: 0.25, phan: [], loi: [], tongCau: 0 };
    let phan = null, cau = null, cheDo = "de", trongMa = false;

    function moPhan(ten) { phan = { ten: ten, cau: [] }; de.phan.push(phan); }
    function themChu(dong) {
      if (cheDo === "loigiai") cau.loiGiai += (cau.loiGiai ? "\n" : "") + dong;
      else cau.deBai.push(dong);
    }

    String(text || "").normalize("NFC").replace(/^﻿/, "").replace(/\r/g, "").split("\n").forEach(function (goc) {
      const s = goc.trim();
      if (cau && /^```/.test(s)) { trongMa = !trongMa; themChu(goc); return; }
      if (trongMa) { themChu(goc); return; }
      if (!s) { if (cau) themChu(""); return; }

      let m;
      if (!cau && (m = s.match(R_THOI_GIAN))) { de.thoiGian = Number(m[1]); return; }
      if (!cau && (m = s.match(R_DIEM_TL))) { de.diemTL = Number(m[1].replace(",", ".")) || 0.25; return; }
      if (R_PHAN.test(s)) { moPhan(s); cau = null; cheDo = "de"; return; }
      if ((m = s.match(R_CAU))) {
        if (!phan) moPhan("");
        cau = { so: m[1], deBai: m[2] ? [m[2]] : [], luaChon: [], y: [], dapAn: null, loiGiai: "", hinh: [] };
        phan.cau.push(cau);
        cheDo = "de";
        return;
      }
      if (!cau) return; // dòng tiêu đề trước câu 1: bỏ qua
      if ((m = s.match(R_LOI_GIAI))) { cheDo = "loigiai"; cau.loiGiai = m[1]; return; }
      if (cheDo === "loigiai") { themChu(goc); return; }
      if ((m = s.match(R_HINH))) { cau.hinh.push(m[1]); return; }
      if ((m = s.match(R_DAP_AN))) { cau.dapAn = m[1].trim(); return; }
      if ((m = s.match(R_LUA_CHON))) { cau.luaChon.push({ nhan: m[2], noiDung: m[3], dung: m[1] === "*" }); return; }
      if ((m = s.match(R_Y))) {
        const dau = m[2].match(R_DAU_DS);
        cau.y.push({
          nhan: m[1],
          noiDung: dau ? m[2].replace(R_DAU_DS, "").trim() : m[2],
          dung: dau ? !/^s/i.test(dau[1]) : null
        });
        return;
      }
      cau.deBai.push(goc);
    });

    de.phan.forEach(function (p) {
      const tenPhan = p.ten ? p.ten.split(/[:.\-–(]/)[0].trim() + ", " : "";
      p.cau.forEach(function (c) {
        const viTri = tenPhan + "Câu " + c.so;
        c.deBai = c.deBai.join("\n").replace(/^\n+|\n+$/g, "");
        c.loiGiai = c.loiGiai.replace(/^\n+|\n+$/g, "");
        if (c.luaChon.length && c.y.length) {
          de.loi.push(viTri + ": vừa có phương án A, B, C, D vừa có ý a), b)... Hãy tách thành hai câu.");
        } else if (c.luaChon.length) {
          c.loai = "mc";
          const soDung = c.luaChon.filter(function (o) { return o.dung; }).length;
          if (c.luaChon.length < 2) de.loi.push(viTri + ": cần ít nhất 2 phương án.");
          if (soDung !== 1) de.loi.push(viTri + ": cần đánh dấu * trước đúng 1 phương án đúng (hiện có " + soDung + ").");
        } else if (c.y.length) {
          c.loai = "ds";
          c.y.forEach(function (y) {
            if (y.dung === null) de.loi.push(viTri + ", ý " + y.nhan + "): chưa ghi (Đ) hoặc (S) ở cuối dòng.");
          });
        } else if (c.dapAn !== null && c.dapAn !== "") {
          c.loai = "tl";
        } else {
          de.loi.push(viTri + ": chưa có phương án hoặc dòng \"Đáp án: ...\".");
        }
        de.tongCau++;
      });
    });
    if (!de.tongCau) de.loi.push("Không tìm thấy câu hỏi nào. Mỗi câu phải bắt đầu bằng \"Câu 1.\", \"Câu 2.\"...");
    return de;
  }

  function chuan(s) {
    return String(s == null ? "" : s).trim().replace(/\s+/g, "").replace(/,/g, ".").toLowerCase();
  }
  function laSo(s) {
    return /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/.test(s) ? Number(s) : NaN;
  }
  // Đáp án có thể ghi nhiều cách đúng, cách nhau bằng dấu | hoặc ;
  function khop(traLoi, dapAn) {
    const a = chuan(traLoi);
    if (!a) return false;
    return String(dapAn).split(/[|;]/).some(function (x) {
      const b = chuan(x);
      if (!b) return false;
      const na = laSo(a), nb = laSo(b);
      return !isNaN(na) && !isNaN(nb) ? Math.abs(na - nb) < 1e-9 : a === b;
    });
  }

  const DIEM_DS = [0, 0.1, 0.25, 0.5, 1];

  function cham(de, traLoi) {
    let tho = 0, toiDa = 0;
    const phan = [], chiTiet = {};
    de.phan.forEach(function (p, pi) {
      let pd = 0, pt = 0, soDung = 0;
      p.cau.forEach(function (c, ci) {
        const k = pi + "-" + ci, t = traLoi[k];
        let d = 0, td = 0, tt = "bo";
        if (c.loai === "mc") {
          td = 0.25;
          const dung = c.luaChon.findIndex(function (o) { return o.dung; });
          if (t !== undefined && t !== null && t !== "") {
            if (Number(t) === dung) { d = td; tt = "dung"; } else tt = "sai";
          }
        } else if (c.loai === "ds") {
          td = 1;
          let soY = 0, coLam = false;
          c.y.forEach(function (y, yi) {
            const v = t ? t[yi] : undefined;
            if (v === true || v === false) { coLam = true; if (v === y.dung) soY++; }
          });
          d = c.y.length === 4 ? DIEM_DS[soY] : (c.y.length ? soY / c.y.length : 0);
          tt = !coLam ? "bo" : soY === c.y.length ? "dung" : soY > 0 ? "mot-phan" : "sai";
        } else {
          td = de.diemTL;
          if (t !== undefined && t !== null && String(t).trim() !== "") {
            if (khop(t, c.dapAn)) { d = td; tt = "dung"; } else tt = "sai";
          }
        }
        chiTiet[k] = { diem: d, toiDa: td, trangThai: tt };
        pd += d; pt += td;
        if (tt === "dung") soDung++;
      });
      phan.push({ ten: p.ten, diem: pd, toiDa: pt, soDung: soDung, soCau: p.cau.length });
      tho += pd; toiDa += pt;
    });
    return {
      diem10: toiDa ? Math.round(tho / toiDa * 1000) / 100 : 0,
      diemTho: Math.round(tho * 100) / 100,
      toiDa: Math.round(toiDa * 100) / 100,
      phan: phan,
      chiTiet: chiTiet
    };
  }

  // Câu đã làm xong chưa (dùng để đếm số câu đã làm).
  function daLam(c, t) {
    if (c.loai === "mc") return t !== undefined && t !== null && t !== "";
    if (c.loai === "ds") return !!t && c.y.every(function (y, yi) { return t[yi] === true || t[yi] === false; });
    return t !== undefined && t !== null && String(t).trim() !== "";
  }

  window.TracNghiem = { phanTich: phanTich, cham: cham, dinhDang: dinhDang, daLam: daLam, esc: esc };
})();
