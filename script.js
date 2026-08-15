// =====================================================
// 8. FUNGSI JANA LAPORAN PENUH (PDF + RUMUSAN)
// =====================================================

// --- 8.1 FUNGSI FORMAT AUTO UNTUK POP-UP ---
function formatTitleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

function formatIC(str) {
    let val = str.replace(/\D/g, ''); 
    if (val.length <= 6) { return val; } 
    else if (val.length <= 8) { return val.slice(0,6) + '-' + val.slice(6); } 
    else { return val.slice(0,6) + '-' + val.slice(6,8) + '-' + val.slice(8,12); }
}

// --- 8.2 FUNGSI POP-UP MAKLUMAT (MENGGANTIKAN TRIGGER ASAL) ---
function janaLaporanPenuh() {
    // Buang pop-up lama jika ada (elak duplicate)
    let existingModal = document.getElementById('modalLaporanPenuh');
    if(existingModal) existingModal.remove();

    let modalHtml = `
    <div id="modalLaporanPenuh" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 999999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(2px);">
        <div style="background: white; padding: 25px 30px; border-radius: 10px; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); text-align: left; border-top: 5px solid #1f4e79;">
            <h3 style="margin-top: 0; color: #1f4e79; border-bottom: 1px dashed #ccc; padding-bottom: 10px; font-size: 18px;">Maklumat Pekerja</h3>
            
            <div style="margin-bottom: 15px; margin-top: 15px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px; font-size: 13px; color: #333;">Nama:</label>
                <input type="text" id="inputNamaLaporan" placeholder="Contoh: Ahmad Bin Abu" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 14px;" oninput="this.value = formatTitleCase(this.value)">
            </div>
            
            <div style="margin-bottom: 25px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px; font-size: 13px; color: #333;">No. Kad Pengenalan:</label>
                <input type="text" id="inputICLaporan" placeholder="Contoh: 900101-01-1234" maxlength="14" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 14px;" oninput="this.value = formatIC(this.value)">
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button onclick="document.getElementById('modalLaporanPenuh').remove()" style="background: #6c757d; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 13px;">Kemaskini</button>
                <button onclick="teruskanJanaLaporan()" style="background: #1f4e79; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 13px;">Jana</button>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function teruskanJanaLaporan() {
    let namaPekerja = document.getElementById('inputNamaLaporan').value.trim();
    let icPekerja = document.getElementById('inputICLaporan').value.trim();
    document.getElementById('modalLaporanPenuh').remove();
    
    // Hantar data Nama dan IC ke enjin laporan asal
    prosesJanaLaporanPenuh(namaPekerja, icPekerja);
}

// --- 8.3 ENJIN ASAL JANA LAPORAN DENGAN PREVIEW & BUTANG TERAPUNG ---
function prosesJanaLaporanPenuh(namaPekerja, icPekerja) {
    const senaraiKalkulator = [
        { id: "orpData", tajuk: "Kadar Upah Biasa (ORP)" }, 
        { id: "bakiData", tajuk: "Baki Upah / Gaji" }, 
        { id: "otData", tajuk: "OT Hari Biasa" },
        { id: "rhData", tajuk: "Kerja Hari Rehat (½ Hari @ Kurang)" }, 
        { id: "rhMoreData", tajuk: "Kerja Hari Rehat (Lebih ½ Hari)" },
        { id: "sec18AData", tajuk: "Pengiraan Seksyen 18A" }, 
        { id: "otRHData", tajuk: "OT Hari Rehat" },
        { id: "phData", tajuk: "Kerja Pada Hari Kelepasan" }, 
        { id: "otPHData", tajuk: "OT Hari Kelepasan" },
        { id: "sickLeaveData", tajuk: "Bayaran Cuti Sakit" }, 
        { id: "kelayakanCutiData", tajuk: "Kelayakan Cuti Tahunan" },
        { id: "annualLeaveData", tajuk: "Bayaran Cuti Tahunan" }, 
        { id: "ggnResBulan", tajuk: "Gaji Ganti Notis (Kiraan Bulan)" },
        { id: "ggnRes18A", tajuk: "Gaji Ganti Notis (Kiraan Hari/Minggu)" }, 
        { id: "kelayakanSakitData", tajuk: "Kelayakan Cuti Sakit & Hospitalisasi" },
        { id: "tbbData", tajuk: "Faedah Penamatan" }
    ];

    function getJalanKira(id) {
        let d = (el) => { let e = document.getElementById(el); return e ? e.innerText.trim() : ""; };
        let v = (el) => { let e = document.getElementById(el); return e ? e.value.trim() : ""; };
        let s = (el) => { let e = document.getElementById(el); return e && e.options[e.selectedIndex] ? e.options[e.selectedIndex].text : ""; };
        function getDaysInMonthStr(monthYearStr) {
            if (!monthYearStr || monthYearStr === "-") return 30; let parts = monthYearStr.trim().split(/\s+/); if (parts.length < 2) return 30;
            let mNames = ["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"];
            let m = mNames.findIndex(n => n.toLowerCase() === parts[0].toLowerCase());
            let y = parseInt(parts[1]); if (m > -1 && y) return new Date(y, m + 1, 0).getDate(); return 30; 
        }
        let html = ""; let globalUpah = v("orpTotalSalary") || formatRM((parseFloat(d("annualLeaveORP").replace(/[^0-9.]/g, '')) || 0) * 26) || "RM 0.00";

        switch(id) {
            case "orpData": html = `Formula:<br>Jumlah Upah ÷ 26<br>${d("orpResultTotal")} ÷ 26<br>= <b>${d("orpResult")}</b>`; break;
            case "bakiData": html = `Formula:<br>Telah Terima - Patut Terima<br>${v("orpTelahTerima")} - ${v("orpPatutTerima")}<br>= <b>${d("orpBakiAmount")}</b>`; break;
            case "otData": html = `Formula:<br>[(Jumlah Upah / 26) ÷ Jam Kerja] x 1.5 x Jam OT<br>[(${d("otResultTotal")} / 26) ÷ ${s("normalWorkingHours")}] x 1.5 x ${v("otHours")} jam<br>= <b>${d("otAmount")}</b>`; break;
            case "rhData": html = `Formula:<br>[(Jumlah Upah / 26) x 0.5] x Bilangan Hari<br>[(${d("rhResultTotal")} / 26) x 0.5] x ${v("rhDays")} hari<br>= <b>${d("rhAmount")}</b>`; break;
            case "rhMoreData": html = `Formula:<br>(Jumlah Upah / 26) x Bilangan Hari<br>(${d("rhMoreResultTotal")} / 26) x ${v("rhMoreDays")} hari<br>= <b>${d("rhMoreAmount")}</b>`; break;
            case "otRHData": html = `Formula:<br>[(Jumlah Upah / 26) ÷ Jam Kerja] x 2.0 x Jam OT<br>[(${d("otRHResultTotal")} / 26) ÷ ${s("otRHNormalWorkingHours")}] x 2.0 x ${v("otRHHours")} jam<br>= <b>${d("otRHAmount")}</b>`; break;
            case "phData": html = `Formula:<br>[(Jumlah Upah / 26) x 2.0] x Bilangan Hari<br>[(${d("phResultTotal")} / 26) x 2.0] x ${v("phDays")} hari<br>= <b>${d("phAmount")}</b>`; break;
            case "otPHData": html = `Formula:<br>[(Jumlah Upah / 26) ÷ Jam Kerja] x 3.0 x Jam OT<br>[(${d("otPHResultTotal")} / 26) ÷ ${s("otPHWorkingHours")}] x 3.0 x ${v("otPHHours")} jam<br>= <b>${d("otPHAmount")}</b>`; break;
            case "sickLeaveData": html = `Formula:<br>(Jumlah Upah / 26) x Hari Cuti Sakit<br>(${globalUpah} / 26) x ${v("sickLeaveDays")} hari<br>= <b>${d("sickLeaveAmount")}</b>`; break;
            case "annualLeaveData": html = `Formula:<br>(Jumlah Upah / 26) x Hari Cuti Tahunan<br>(${globalUpah} / 26) x ${v("annualLeaveDays")} hari<br>= <b>${d("annualLeaveAmount")}</b>`; break;
            case "sec18AData":
                let upah18 = d("resultTotalSalary"); let mm1 = d("month1Title"); let mm2 = d("month2Title");
                let amt1 = d("month1Amount"); let amt2 = d("month2Amount"); let d1 = getDaysInMonthStr(mm1); let d2 = getDaysInMonthStr(mm2);
                html = `Formula:<br>(Jumlah Upah / Bil. Hari Dalam Bulan) x Hari Bekerja<br><table class="clean-table">`;
                if (mm1 && mm1 !== "-") html += `<tr><td style="width:70%;">${mm1}: (${upah18} / ${d1}) x Hari Bekerja</td><td style="width:5%; text-align:center;">=</td><td style="font-weight:bold;">${amt1}</td></tr>`;
                if (mm2 && mm2 !== "-") html += `<tr><td style="width:70%;">${mm2}: (${upah18} / ${d2}) x Hari Bekerja</td><td style="width:5%; text-align:center;">=</td><td style="font-weight:bold;">${amt2}</td></tr>`;
                html += `</table>`; break;
            case "ggnRes18A":
                let gUpah = d("resUni18ATotal"); let gM1 = d("resUniM1Title"); let gM2 = d("resUniM2Title");
                let gD1 = getDaysInMonthStr(gM1); let gD2 = getDaysInMonthStr(gM2); let gRate1 = d("resUniM1Daily"); let gRate2 = d("resUniM2Daily");
                let gDays1 = d("resUniM1Days"); let gDays2 = d("resUniM2Days"); let gAmt1 = d("resUniM1Amount"); let gAmt2 = d("resUniM2Amount");
                let gTotal = d("resUni18AAmount"); html = `Formula:<br>(Jumlah Upah / Bil. Hari Dalam Bulan) x Hari Bekerja<br><br>`;
                if (gM1 && gM1 !== "-") html += `(A) ${gM1}:<br>(${gUpah} / ${gD1}) x Hari Bekerja<br>= ${gRate1} x ${gDays1}<br>= <b>${gAmt1}</b><br><br>`;
                if (gM2 && gM2 !== "-") { html += `(B) ${gM2}:<br>(${gUpah} / ${gD2}) x Hari Bekerja<br>= ${gRate2} x ${gDays2}<br>= <b>${gAmt2}</b><br><br><b>(A) + (B) = ${gTotal}</b>`; } 
                else { html += `<b>Jumlah = ${gTotal}</b>`; } break;
            case "ggnResBulan": html = `Formula:<br>Jumlah Upah x Bil. Bulan Notis<br>${v("ggnUniTotal")} x ${v("ggnUniMonthVal")} bulan<br>= <b>${d("resUniMonthAmount")}</b>`; break;
            case "tbbData":
                let tempoh = d("tbbTempoh"); let yMatch = tempoh.match(/(\d+)\s*Tahun/i); let mMatch = tempoh.match(/(\d+)\s*Bulan/i);
                let years = yMatch ? parseInt(yMatch[1]) : 0; let months = mMatch ? parseInt(mMatch[1]) : 0;
                let kadarStr = d("tbbKadar"); let kadar = parseInt(kadarStr.replace(/[^0-9.]/g, '')) || 0; 
                let yDays = years * kadar; let mDays = parseFloat(((months / 12) * kadar).toFixed(2)); let totalHariLengkap = d("tbbHari");
                html = `(A) Formula Kadar Sehari (ORP):<br>Jumlah Upah 12 Bulan ÷ 365 hari<br>= ${d("tbbTotal12M")} ÷ 365<br>= <b>${d("tbbORP")}</b><br><br>
                (B) Formula Kelayakan Hari:<br>Tempoh perkhidmatan x Bil. hari layak setahun<br>[(${years} tahun x ${kadar} hari setahun)] + [(${months} bulan / 12 bulan setahun) x ${kadar}]<br>= ${yDays} hari + ${mDays} hari<br>= <b>${totalHariLengkap}</b><br><br>
                Formula Faedah:<br>ORP (A) x Kelayakan Hari (B)<br>= ${d("tbbORP")} x ${totalHariLengkap}<br>= <b>${d("tbbAmount")}</b>`; break;
        }
        if (html) return `<div class="formula-box"><div class="formula-title">JALAN KIRA & FORMULA:</div>${html}</div>`; return "";
    }

    let adaData = false; let htmlLaporan = "";

    senaraiKalkulator.forEach(kalkulator => {
        try {
            let elemenKeputusan = document.getElementById(kalkulator.id);
            if (elemenKeputusan && elemenKeputusan.style.display !== "none") {
                adaData = true; 
                let kadAsal = elemenKeputusan.closest('.pdf-module, .calculator-card');
                let kadUtama = elemenKeputusan.closest('.calculator-card');
                if (kadAsal) {
                    let tajukKalkulator = kalkulator.tajuk; 
                    if (kadUtama) {
                        let mainH2 = kadUtama.querySelector('h2');
                        if (mainH2) {
                            let cleanMain = mainH2.innerText.replace(/\n/g, ' ').replace(/Kalkulator\s*/i, '').replace(/Bersepadu:\s*/i, '');
                            tajukKalkulator = cleanMain;
                            if (kadAsal.classList.contains('pdf-module')) {
                                let subH3 = kadAsal.querySelector('h3');
                                if (subH3) { tajukKalkulator += " - " + subH3.innerText.split(':')[0]; }
                            }
                        }
                    }

                    if (kalkulator.id === "orpData") tajukKalkulator = "Kadar Upah Biasa (ORP)";
                    if (kalkulator.id === "bakiData") tajukKalkulator = "Baki Upah / Gaji";

                    let paramHtml = `<table class="param-table">`; 
                    let barisInput = kadAsal.querySelectorAll('.form-group');
                    barisInput.forEach(fg => {
                        if (fg.offsetParent === null || window.getComputedStyle(fg).display === 'none' || fg.closest('[style*="display: none"]')) return; 
                        let labelEl = fg.querySelector('label'); let inputEl = fg.querySelector('input, select');
                        if (labelEl && inputEl) {
                            let namaLabel = labelEl.innerText.split('\n')[0]; 
                            if (kalkulator.id === "orpData" && (namaLabel.includes("Patut Terima") || namaLabel.includes("Telah Terima"))) return;
                            if (kalkulator.id === "bakiData" && (namaLabel.includes("Gaji Pokok") || namaLabel.includes("Elaun") || namaLabel.includes("Jumlah Upah"))) return;

                            let nilai = (inputEl.tagName.toLowerCase() === 'select' && inputEl.selectedIndex >= 0) ? inputEl.options[inputEl.selectedIndex].text : inputEl.value || "";
                            if (nilai && nilai.trim() !== "" && !nilai.includes("- Sila Pilih -")) {
                                if (kalkulator.id === "tbbData" && (namaLabel.includes("Jenis Upah (12 Bulan Terakhir)") || namaLabel.includes("Jumlah Upah Sebulan"))) return;
                                if (inputEl.type === 'date' || /^\d{4}-\d{2}-\d{2}$/.test(nilai)) { let p = nilai.split('-'); if (p.length === 3) nilai = `${p[2]}-${p[1]}-${p[0]}`; }
                                if (namaLabel.includes("(RM)") && !nilai.includes("RM")) {
                                    try { let calcVal = eval(nilai.replace(/[^\d\.\+\-\*\/\(\)]/g, '')); if (calcVal > 0) nilai = /[+\-*/]/.test(nilai) ? `${nilai} = ${formatRM(calcVal)}` : formatRM(calcVal); } catch (err) {}
                                }
                                paramHtml += `<tr><td class="param-label">${namaLabel}</td><td class="param-value">${nilai}</td></tr>`;
                            }
                        }
                    });
                    paramHtml += `</table>`;

                    let jalanKiraHtml = getJalanKira(kalkulator.id); let salinanKeputusan = elemenKeputusan.cloneNode(true);
                    salinanKeputusan.querySelectorAll('button, h4, hr').forEach(b => b.remove()); 
                    salinanKeputusan.querySelectorAll('.result-row, .section18a-header, .section18a-row').forEach(row => {
                        let text = row.innerText || "";
                        if (row.innerHTML.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) row.innerHTML = row.innerHTML.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g, "$1-$2-$3");
                        if (text.includes("Tempoh (Bulan Terhampir)")) row.innerHTML = row.innerHTML.replace("Tempoh (Bulan Terhampir)", "Tempoh perkhidmatan (Bulan Terhampir)");
                        if (text.includes("Kelayakan Biasa")) row.innerHTML = row.innerHTML.replace("Kelayakan Biasa", "Kelayakan Cuti Sakit");
                        if (text.includes("Kategori Kelayakan Setahun")) row.innerHTML = row.innerHTML.replace("Kategori Kelayakan Setahun", "Kelayakan Setahun");
                        if (text.includes("Jumlah Kelayakan (Prorata)")) row.innerHTML = row.innerHTML.replace("Jumlah Kelayakan (Prorata)", "Jumlah Kelayakan Hari (Prorata)");
                        if (text.includes("Kadar Upah Biasa") && !text.includes("(ORP)")) row.innerHTML = row.innerHTML.replace("Kadar Upah Biasa", "Kadar Upah Biasa (ORP)");
                        if (text.includes("Jumlah Upah") && !text.includes("Jumlah Upah 12 Bulan") && !text.includes("Jumlah Bayaran Upah")) row.remove();
                        if (kalkulator.id === "tbbData" && (text.includes("Keseluruhan Upah (12 Bulan)") || text.includes("Kadar Upah Biasa (ORP)"))) row.remove();
                    });

                    if (kalkulator.id === "orpData" || kalkulator.id === "bakiData") {
                        let semuaBarisKeputusan = salinanKeputusan.querySelectorAll('.result-row');
                        if (semuaBarisKeputusan.length > 0) { semuaBarisKeputusan[semuaBarisKeputusan.length - 1].classList.add('highlight-row'); }
                    }

                    if (kalkulator.id === "ggnRes18A") {
                        let getD = (el) => { let e = document.getElementById(el); return e ? e.innerText.trim() : ""; };
                        let m1 = getD("resUniM1Title"); let m2 = getD("resUniM2Title"); let h1 = getD("resUniM1Days"); let h2 = getD("resUniM2Days");
                        let r1 = getD("resUniM1Daily"); let r2 = getD("resUniM2Daily"); let a1 = getD("resUniM1Amount"); let a2 = getD("resUniM2Amount");
                        let stEl = document.getElementById("ggnStatusNotis"); let lblTamat = (stEl && stEl.value === "tiada") ? "Tamat Tempoh Indemniti" : "Tarikh Akhir Notis";
                        let tDateStr = getD("resUni18AEnd"); let tDate = tDateStr ? tDateStr.replace(/\//g, "-") : "";  let tTotal = getD("resUni18AAmount");
                        salinanKeputusan.innerHTML = `<div class="result-row" style="margin-bottom:8px;"><span>${lblTamat}</span><strong>${tDate}</strong></div><table class="clean-table"><tr><td></td><td style="font-weight:bold;">${m1}</td><td style="font-weight:bold;">${m2}</td></tr><tr><td>Hari Bekerja</td><td>${h1}</td><td>${h2}</td></tr><tr><td>Kadar Sehari</td><td>${r1}</td><td>${r2}</td></tr><tr><td>Bayaran</td><td>${a1}</td><td>${a2}</td></tr></table><div class="result-row highlight-row" style="margin-top:10px;"><span>Bayaran Gaji Ganti Notis</span><strong>${tTotal}</strong></div>`;
                    }
                    if (kalkulator.id === "sec18AData") {
                        let getD = (el) => { let e = document.getElementById(el); return e ? e.innerText.trim() : ""; };
                        let m1 = getD("month1Title"); let m2 = getD("month2Title"); let h1 = getD("month1Days"); let h2 = getD("month2Days");
                        let r1 = getD("month1Daily"); let r2 = getD("month2Daily"); let a1 = getD("month1Amount"); let a2 = getD("month2Amount"); let tTotal = getD("amount18A");
                        salinanKeputusan.innerHTML = `<table class="clean-table" style="margin-top:5px;"><tr><td></td><td style="font-weight:bold;">${m1}</td><td style="font-weight:bold;">${m2}</td></tr><tr><td>Hari Bekerja</td><td>${h1}</td><td>${h2}</td></tr><tr><td>Kadar Sehari</td><td>${r1}</td><td>${r2}</td></tr><tr><td>Bayaran</td><td>${a1}</td><td>${a2}</td></tr></table><div class="result-row highlight-row" style="margin-top:10px;"><span>Jumlah Bayaran Upah</span><strong>${tTotal}</strong></div>`;
                    }
                    htmlLaporan += `<div class="report-box"><div class="report-header">${tajukKalkulator}</div><div class="report-section-title">PARAMETER / INPUT:</div>${paramHtml}${jalanKiraHtml}<div class="report-section-title" style="margin-top:10px;">KEPUTUSAN:</div><div class="compact-result">${salinanKeputusan.innerHTML}</div></div>`;
                }
            }
        } catch (error) { console.error("Ralat pada kalkulator:", kalkulator.id, error); }
    });

    let rumusanTbody = document.getElementById('badanJadualRumusan');
    if (rumusanTbody && rumusanTbody.children.length > 0) {
        adaData = true; 
        let rumusanHTML = `<table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 12px; border: 1px solid #ccc;"><thead><tr style="background: #1f4e79; color: white;"><th style="padding: 8px; text-align: left; border: 1px solid #ccc;">Jenis Bayaran</th><th style="padding: 8px; text-align: right; border: 1px solid #ccc;">Patut Bayar</th><th style="padding: 8px; text-align: right; border: 1px solid #ccc;">Telah Bayar</th><th style="padding: 8px; text-align: right; border: 1px solid #ccc;">Baki (+/-)</th></tr></thead><tbody>`;
        let barisRumusan = rumusanTbody.querySelectorAll('tr');
        barisRumusan.forEach(tr => {
            let select = tr.querySelector('select'); let jenis = select.options[select.selectedIndex].text;
            let patut = tr.querySelector('.patut-bayar').value; let telah = tr.querySelector('.telah-bayar').value;
            let bakiInput = tr.querySelector('.baki-baris'); let baki = bakiInput.value; let bakiWarna = bakiInput.style.color;
            rumusanHTML += `<tr><td style="padding: 8px; border: 1px solid #ccc;">${jenis}</td><td style="padding: 8px; text-align: right; border: 1px solid #ccc; font-weight: bold;">${patut}</td><td style="padding: 8px; text-align: right; border: 1px solid #ccc;">${telah || "RM0.00"}</td><td style="padding: 8px; text-align: right; border: 1px solid #ccc; color: ${bakiWarna}; font-weight: bold;">${baki}</td></tr>`;
        });
        let jumlahTeks = document.getElementById('jumlahKeseluruhanRumusan');
        rumusanHTML += `</tbody></table><div style="text-align: right; margin-top: 10px; padding: 12px; background: #f4f6f9; border-radius: 6px; border: 1px solid #ccc;"><span style="font-size: 12px; font-weight: bold; color: #333;">Jumlah Keseluruhan Terlebih / Terkurang Bayar: </span><strong style="font-size: 16px; color: ${jumlahTeks.style.color}; margin-left: 10px;">${jumlahTeks.innerText}</strong></div>`;
        htmlLaporan += `<div class="report-box" style="grid-column: 1 / -1; border-left: 5px solid #1f4e79; margin-top: 10px;"><div class="report-header" style="background:#e8eaed; color:#1a1a1a;">RUMUSAN AKHIR BAYARAN</div>${rumusanHTML}</div>`;
    }

    if (!adaData) { alert("Peringatan: Sila buat sekurang-kurangnya satu pengiraan atau isi Jadual Rumusan terlebih dahulu."); return; }
    
    let tarikhHariIni = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
    
    let maklumatPekerjaHTML = "";
    if (namaPekerja !== "" || icPekerja !== "") {
        maklumatPekerjaHTML = `
        <div class="report-box" style="grid-column: 1 / -1; margin-bottom: 15px; border-left: 5px solid #1f4e79;">
            <div class="report-header" style="background:#e8eaed; color:#1a1a1a; text-align: left; padding-left: 10px;">MAKLUMAT PEKERJA</div>
            <table class="param-table" style="margin-bottom: 0;">
                <tr>
                    <td class="param-label" style="width: 20%; font-weight: bold;">Nama</td>
                    <td class="param-value" style="text-align: left; font-weight: normal; color: #111;">: ${namaPekerja || '-'}</td>
                </tr>
                <tr>
                    <td class="param-label" style="width: 20%; font-weight: bold;">No. Kad Pengenalan</td>
                    <td class="param-value" style="text-align: left; font-weight: normal; color: #111;">: ${icPekerja || '-'}</td>
                </tr>
            </table>
        </div>`;
    }
    
    // PENAMBAHBAIKAN CSS UNTUK FLOATING BUTTONS
    let cssBaru = `
    .floating-action-bar {
        position: fixed;
        bottom: 25px;
        right: 25px;
        display: flex;
        gap: 15px;
        z-index: 9999;
        background: rgba(255, 255, 255, 0.95);
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        border: 1px solid #ddd;
        align-items: center;
    }
    .btn-kemaskini {
        background-color: #6c757d;
        color: white;
        border: none;
        padding: 10px 18px;
        font-size: 13px;
        cursor: pointer;
        font-weight: bold;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .btn-cetak {
        background-color: #1f4e79;
        color: white;
        border: none;
        padding: 10px 18px;
        font-size: 13px;
        cursor: pointer;
        font-weight: bold;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .btn-kemaskini:hover { background-color: #5a6268; }
    .btn-cetak:hover { background-color: #153a5b; }
    @media print {
        .floating-action-bar, .print-btn-container { display: none !important; }
    }
    `;

    let cetakHTML = `<!DOCTYPE html><html lang="ms"><head><meta charset="UTF-8"><title>Laporan Pengiraan Akta Kerja 1955</title><style>* { font-family: 'Segoe UI', Arial, sans-serif; box-sizing: border-box; } body { color: #111; line-height: 1.35; padding: 20px; font-size: 11px; background: #fdfdfd; margin-bottom: 80px; } .main-title { text-align: center; margin-bottom: 2px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #222; padding-bottom: 6px; text-transform: uppercase; color: #000; letter-spacing: 1px; } .subtitle { text-align: center; color: #555; margin-top: 5px; margin-bottom: 25px; font-size: 11px; } .grid-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; align-items: start; } .report-box { border: 1px solid #aaa; padding: 12px; border-radius: 6px; page-break-inside: avoid; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); } .report-header { font-size: 13px; font-weight: 800; text-align: center; background: #e8eaed; padding: 8px; border-bottom: 1px solid #aaa; margin: -12px -12px 12px -12px; border-radius: 6px 6px 0 0; text-transform: uppercase; color: #1a1a1a; letter-spacing: 0.5px; } .report-section-title { font-size: 10px; font-weight: bold; color: #1f4e79; letter-spacing: 0.5px; border-bottom: 1px dashed #ccc; padding-bottom: 3px; margin-bottom: 6px; text-transform: uppercase; } .param-table { width: 100%; font-size: 11px; border-collapse: collapse; margin-bottom: 12px; } .param-label { padding: 3px 0; color: #444; width: 55%; } .param-value { padding: 3px 0; text-align: right; font-weight: 700; color: #000; } .formula-box { background-color: #f4f6f9; border-left: 3px solid #1f4e79; padding: 10px 12px; margin: 12px 0; font-size: 11px; color: #222; border-radius: 0 4px 4px 0; } .formula-title { font-weight: bold; font-size: 10px; color: #1f4e79; margin-bottom: 6px; letter-spacing: 0.5px; } .compact-result .result-row { display: flex; justify-content: space-between; margin-bottom: 5px; align-items: center; flex-wrap: wrap; } .compact-result .result-row span { font-size: 11px; color: #333; } .compact-result .result-row strong, #orpBakiAmount { font-size: 12px; color: #000; white-space: nowrap; } .compact-result hr { display: none !important; } .clean-table { width: 100%; border-collapse: collapse; font-size: 11px; border: none; margin-bottom: 5px; } .clean-table td { padding: 4px 2px; border: none; color: #222; } .highlight-row, .result-row[style*="background"] { background: transparent !important; border: 1.5px solid #1f4e79; padding: 8px !important; border-radius: 4px; margin-top: 10px; } .highlight-row span, .result-row[style*="background"] span { color: #1f4e79 !important; font-weight: bold; } .highlight-row strong, .result-row[style*="background"] strong { color: #1f4e79 !important; font-size: 14px !important; } @media print { body { padding: 0; background: #fff; margin-bottom: 0; } .report-box { border: 1px solid #aaa; box-shadow: none; } .report-header, .formula-box, .highlight-row, .result-row[style*="background"] { -webkit-print-color-adjust: exact; print-color-adjust: exact; } } ${cssBaru} </style></head><body>
    
    <div class="floating-action-bar">
        <span style="font-size: 11px; color: #555; margin-right: 5px; font-style: italic;">*Sila simpan sebagai PDF</span>
        <button class="btn-kemaskini" onclick="window.close()">Kemaskini</button>
        <button class="btn-cetak" onclick="window.print()">🖨️ Cetak Laporan</button>
    </div>

    <h1 class="main-title">PENGIRAAN DI BAWAH AKTA KERJA 1955</h1>
    <p class="subtitle">Tarikh Janaan: ${tarikhHariIni}</p>
    <div class="grid-container">${maklumatPekerjaHTML}${htmlLaporan}</div>
    
    <div class="print-btn-container" style="text-align: center; margin-top: 30px; grid-column: 1 / -1;">
        <p style="font-size: 11px; color:#666; font-style: italic;">*Untuk simpan dalam peranti, sila pilih <b>'Save as PDF'</b> pada tetingkap pencetak (Destination).</p>
    </div>
    
    </body></html>`;
    
    let tetingkapCetak = window.open('', '_blank'); 
    tetingkapCetak.document.write(cetakHTML); 
    tetingkapCetak.document.close();
    tetingkapCetak.focus(); 
    // Baris setTimeout print automatik telah dibuang.
}
