let maklumatSyarikatPekerjaHTML = "";
    if (namaPekerja !== "" || icPekerja !== "" || noPekerja !== "" || namaMajikan !== "") {
        maklumatSyarikatPekerjaHTML = `<div class="report-box" style="grid-column: 1 / -1; margin-bottom: 3pt; border-left: 5px solid #1f4e79;">
            <div class="report-header" style="background:#e8eaed; color:#1a1a1a; text-align: left; padding-left: 10px;">MAKLUMAT PEKERJA & SYARIKAT</div>
            <table class="param-table" style="margin-bottom: 0;">
                ${namaMajikan ? `<tr><td class="param-label" style="width: 25%; font-weight: bold;">Nama Majikan/Syarikat</td><td class="param-value" style="text-align: left; font-weight: normal; color: #111;">: ${namaMajikan}</td></tr>` : ''}
                ${namaPekerja ? `<tr><td class="param-label" style="width: 25%; font-weight: bold;">Nama Pekerja</td><td class="param-value" style="text-align: left; font-weight: normal; color: #111;">: ${namaPekerja}</td></tr>` : ''}
                ${icPekerja ? `<tr><td class="param-label" style="width: 25%; font-weight: bold;">No. Kad Pengenalan / No. Passport</td><td class="param-value" style="text-align: left; font-weight: normal; color: #111;">: ${icPekerja}</td></tr>` : ''}
                ${noPekerja ? `<tr><td class="param-label" style="width: 25%; font-weight: bold;">No. Pekerja</td><td class="param-value" style="text-align: left; font-weight: normal; color: #111;">: ${noPekerja}</td></tr>` : ''}
            </table>
        </div>`;
    }

    let cssBaru = `.floating-action-bar { position: fixed; top: 25px; right: 25px; display: flex; z-index: 9999; align-items: center; } .kebab-btn { background: #0d6efd; border: none; border-radius: 50%; width: 45px; height: 45px; font-size: 24px; cursor: pointer; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: 0.2s; display: flex; justify-content: center; align-items: center; line-height: 1; padding-bottom: 5px; } .kebab-btn:hover { background: #0b5ed7; transform: scale(1.05); } .kebab-dropdown { display: none; position: absolute; right: 0; top: 115%; background-color: white; min-width: 170px; box-shadow: 0px 4px 15px rgba(0,0,0,0.2); border-radius: 8px; overflow: hidden; border: 1px solid #ddd; text-align: left; } .kebab-dropdown a { color: #333; padding: 12px 16px; text-decoration: none; display: block; font-size: 13px; font-weight: bold; transition: 0.2s; } .kebab-dropdown a:hover { background-color: #f4f6f9; } .kebab-dropdown a:first-child { border-bottom: 1px solid #eee; } @media print { .floating-action-bar, .print-btn-container { display: none !important; } }`;
    
    let cetakHTML = `<!DOCTYPE html><html lang="ms"><head><meta charset="UTF-8"><title>Laporan Pengiraan Akta Kerja 1955</title><style>* { font-family: 'Segoe UI', Arial, sans-serif; box-sizing: border-box; } body { color: #111; line-height: 1.35; padding: 20px; font-size: 11px; background: #fdfdfd; margin-bottom: 80px; } .main-title { text-align: center; margin-bottom: 2px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #222; padding-bottom: 6px; text-transform: uppercase; color: #000; letter-spacing: 1px; } .subtitle { text-align: center; color: #555; margin-top: 5px; margin-bottom: 25px; font-size: 11px; } .grid-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; align-items: start; } .report-box { border: 1px solid #aaa; padding: 12px; border-radius: 6px; page-break-inside: avoid; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); } .report-header { font-size: 13px; font-weight: 800; text-align: center; background: #e8eaed; padding: 8px; border-bottom: 1px solid #aaa; margin: -12px -12px 12px -12px; border-radius: 6px 6px 0 0; text-transform: uppercase; color: #1a1a1a; letter-spacing: 0.5px; } .report-section-title { font-size: 10px; font-weight: bold; color: #1f4e79; letter-spacing: 0.5px; border-bottom: 1px dashed #ccc; padding-bottom: 3px; margin-bottom: 6px; text-transform: uppercase; } .param-table { width: 100%; font-size: 11px; border-collapse: collapse; margin-bottom: 12px; } .param-label { padding: 3px 0; color: #444; width: 55%; } .param-value { padding: 3px 0; text-align: right; font-weight: 700; color: #000; } .formula-box { background-color: #f4f6f9; border-left: 3px solid #1f4e79; padding: 10px 12px; margin: 12px 0; font-size: 11px; color: #222; border-radius: 0 4px 4px 0; } .formula-title { font-weight: bold; font-size: 10px; color: #1f4e79; margin-bottom: 6px; letter-spacing: 0.5px; } .compact-result .result-row { display: flex; justify-content: space-between; margin-bottom: 5px; align-items: center; flex-wrap: wrap; } .compact-result .result-row span { font-size: 11px; color: #333; } .compact-result .result-row strong, #orpBakiAmount { font-size: 12px; color: #000; white-space: nowrap; } .compact-result hr { display: none !important; } .clean-table { width: 100%; border-collapse: collapse; font-size: 11px; border: none; margin-bottom: 5px; } .clean-table td { padding: 4px 2px; border: none; color: #222; } .highlight-row, .result-row[style*="background"] { background: transparent !important; border: 1.5px solid #1f4e79; padding: 8px !important; border-radius: 4px; margin-top: 10px; } .highlight-row span, .result-row[style*="background"] span { color: #1f4e79 !important; font-weight: bold; } .highlight-row strong, .result-row[style*="background"] strong { color: #1f4e79 !important; font-size: 14px !important; } @media print { body { padding: 0; background: #fff; margin-bottom: 0; } .report-box { border: 1px solid #aaa; box-shadow: none; } .report-header, .formula-box, .highlight-row, .result-row[style*="background"] { -webkit-print-color-adjust: exact; print-color-adjust: exact; } } ${cssBaru} </style></head><body><div class="floating-action-bar"><div style="position: relative;"><button class="kebab-btn" onclick="var d = document.getElementById('kebabDropdown'); d.style.display = d.style.display === 'block' ? 'none' : 'block';">&#8942;</button><div id="kebabDropdown" class="kebab-dropdown"><a href="#" onclick="if(window.opener && typeof window.opener.kembaliKeKalkulator === 'function') { window.opener.kembaliKeKalkulator('${unikId}'); } window.close(); return false;">✏️ Kemaskini</a><a href="#" onclick="window.print(); return false;">🖨️ Cetak Laporan</a><a href="#" onclick="if(window.opener && typeof window.opener.simpanStatusRekod === 'function') { window.opener.simpanStatusRekod('${unikId}'); } window.close(); return false;">💾 Simpan</a></div></div></div>${tajukHeaderHTML}<div class="grid-container">${maklumatSyarikatPekerjaHTML}${contentSeterusnya}</div><div class="print-btn-container" style="text-align: center; margin-top: 30px; grid-column: 1 / -1;"><p style="font-size: 11px; color:#666; font-style: italic;">*Untuk simpan dalam peranti, sila pilih <b>'Save as PDF'</b> pada tetingkap pencetak (Destination).</p></div></body></html>`;
    
    if (unikId) {
        window.simpananHTMLGlobal = window.simpananHTMLGlobal || {};
        window.simpananHTMLGlobal[unikId] = cetakHTML;
    }

    let tetingkapCetak = window.open('', '_blank'); 
    if (!tetingkapCetak) { alert("Pop-up disekat oleh pelayar web (browser) anda. Sila benarkan 'Pop-ups and redirects' untuk laman ini bagi melihat laporan."); return; }
    tetingkapCetak.document.write(cetakHTML); 
    tetingkapCetak.document.close(); 
    tetingkapCetak.focus(); 
}

// =====================================================
// PENAMBAHBAIKAN EKSKLUSIF: SIMPAN & DRAF
// =====================================================
window.simpanStatusRekod = function(unikId) {
    let tbody = document.querySelector('#card-maklumatGaji tbody');
    if (tbody) {
        let row = tbody.querySelector(`tr[data-rekod-id="${unikId}"]`);
        if (row) {
            // Buang label DRAF jika ada
            let drafSpan = row.querySelector('.badge-draf');
            if(drafSpan) drafSpan.remove();
            
            // Tambah label BARU (menggantikan Draf)
            let container = row.querySelector('td:first-child div');
            if(container && !container.querySelector('.label-rekod-baru')) {
                container.insertAdjacentHTML('beforeend', `<span class="label-rekod-baru" style="background: #ffeb3b; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; box-shadow: 0 1px 2px rgba(0,0,0,0.2);">BARU</span>`);
            }
            row.setAttribute('data-status-simpan', 'true');
        }
    }
    
    // Pergi ke halaman Senarai Rekod / Maklumat Gaji setelah di simpan
    if (typeof window.tambahKalkulator === 'function') {
        window.tambahKalkulator('maklumatGaji');
    }
};

// Override fungsi sedia ada untuk pastikan penjanaan sentiasa DRAF pada mulanya (Kecuali jika dah pernah simpan)
const original_tambahRekodKeMaklumatGaji = window.tambahRekodKeMaklumatGaji;
window.tambahRekodKeMaklumatGaji = function(jenis, namaPekerja, majikan, tempoh, unikId) {
    let tbody = document.querySelector('#card-maklumatGaji tbody');
    if (!tbody) return;

    let jenisTeks = jenis === 'penyata' ? 'Penyata Gaji' : 'Laporan';
    let warnaTeks = jenis === 'penyata' ? '#198754' : '#0d6efd'; 
    let warnaBg   = jenis === 'penyata' ? '#d1e7dd' : '#cfe2ff';

    let safeNama = (namaPekerja || '-').trim();
    let safeMajikan = (majikan || '-').trim();

    let sediaAda = tbody.querySelector(`tr[data-rekod-id="${unikId}"]`);
    
    // Tentukan adakah ia masih DRAF
    let isDraf = sediaAda ? sediaAda.getAttribute('data-status-simpan') !== 'true' : true;
    
    let labelHtml = isDraf 
        ? `<span class="badge-draf" style="background: #fef3c7; color: #d97706; padding: 4px 8px; border-radius: 4px; border: 1px solid #fde68a; font-size: 10px; font-weight: bold;">⏳ DRAF PENGIRAAN</span>`
        : `<span class="label-rekod-baru" style="background: #ffeb3b; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; box-shadow: 0 1px 2px rgba(0,0,0,0.2);">BARU</span>`;

    let trHtml = `
        <td style="padding: 15px; font-size: 13px; font-weight: bold; color: ${warnaTeks}; vertical-align: middle;">
            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 6px;">
                <span style="background: ${warnaBg}; padding: 4px 8px; border-radius: 4px;">${jenisTeks}</span>
                ${labelHtml}
            </div>
        </td>
        <td style="padding: 15px; font-size: 13px; vertical-align: middle;"><strong style="color: #333;">${safeNama}</strong></td>
        <td style="padding: 15px; font-size: 13px; vertical-align: middle;"><strong style="color: #333;">${safeMajikan}</strong></td>
        <td style="padding: 15px; text-align: center; font-size: 13px; color: #444; vertical-align: middle;">${tempoh || '-'}</td>
        <td style="padding: 15px; text-align: center; vertical-align: middle;">
            <button data-id="${unikId}" onclick="bukaRekodSimpanan(event)" style="background: #0d6efd; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer; margin-right: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">📂 Buka</button>
            <button data-id="${unikId}" onclick="hapusRekodSimpanan(event)" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">🗑️ Hapus</button>
        </td>
    `;

    if (sediaAda) {
        sediaAda.setAttribute('data-jenis', jenisTeks);
        sediaAda.setAttribute('data-pekerja', safeNama);
        sediaAda.setAttribute('data-majikan', safeMajikan);
        sediaAda.innerHTML = trHtml;
    } else {
        // Buang label BARU dari rekod lain jika ini rekod baru (sebelum di Draf-kan)
        let semuaBaru = tbody.querySelectorAll('.label-rekod-baru');
        semuaBaru.forEach(lbl => lbl.remove());

        let tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid #eee";
        tr.setAttribute('data-rekod-id', unikId);
        tr.setAttribute('data-jenis', jenisTeks);
        tr.setAttribute('data-pekerja', safeNama);
        tr.setAttribute('data-majikan', safeMajikan);
        tr.setAttribute('data-status-simpan', 'false'); // Lalai: Belum simpan (Draf)
        tr.innerHTML = trHtml;
        
        let firstRow = tbody.querySelector('tr');
        if (firstRow && firstRow.innerHTML.includes('KBR/10103')) firstRow.remove();
        tbody.appendChild(tr);
    }
};

// =====================================================
// 6. SISTEM LOGIN & RESET 
// =====================================================

function paparLogMasuk() { document.getElementById("loginOverlay").style.display = "flex"; document.getElementById("loginPassword").value = ""; document.getElementById("loginError").style.display = "none"; }
function semakLogin() {
    let inputLaluan = document.getElementById("loginPassword").value; let ralatMesej = document.getElementById("loginError"); let kataLaluanSebenar = "kerja1955"; 
    if (inputLaluan === kataLaluanSebenar) {
        document.getElementById("loginOverlay").style.display = "none"; let btn = document.getElementById("butangAuth");
        if (btn) { btn.innerHTML = "⏻ Log Keluar"; btn.style.background = "#dc3545"; btn.style.borderColor = "#dc3545"; btn.setAttribute("onclick", "logKeluar()"); }
    } else { ralatMesej.style.display = "block"; }
}
document.addEventListener("DOMContentLoaded", function() { let kotakPassword = document.getElementById("loginPassword"); if (kotakPassword) { kotakPassword.addEventListener("keypress", function(event) { if (event.key === "Enter") semakLogin(); }); } });
function logKeluar() { let btn = document.getElementById("butangAuth"); if (btn) { btn.innerHTML = "⏻ Log Masuk"; btn.style.background = "#1f4e79"; btn.style.borderColor = "#1f4e79"; btn.setAttribute("onclick", "paparLogMasuk()"); } alert("Anda telah berjaya log keluar dari sistem."); }

// =====================================================
// ENJIN RESET (DIKEMASKINI)
// =====================================================

window.resetSemua = function() {
    let sah = confirm("Adakah anda pasti mahu memadam KESEMUA data pengiraan? Tindakan ini tidak boleh diundur.");
    if (sah) {
        let semuaKadAktif = document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card)');
        semuaKadAktif.forEach(kad => kad.remove());
        
        resetRumusan();
        senaraiElaunGlobal = [];
        
        let kadRumusan = document.querySelector('.rumusan-card');
        if (kadRumusan) {
            kadRumusan.style.display = "none";
        }
        
        setTimeout(() => {
            if (typeof window.semakDanTukarElaun === 'function') {
                window.semakDanTukarElaun();
            }
        }, 50);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

window.resetKalkulatorIndividu = function(e) {
    if (!e) return;
    
    let targetElemen = e.target ? e.target : e;
    const kadKalkulator = targetElemen.closest('.calculator-card');
    if (!kadKalkulator) return;

    let templateId = kadKalkulator.getAttribute('data-template-id');

    const senaraiInput = kadKalkulator.querySelectorAll('input[type="text"], input[type="number"], input[type="date"]');
    senaraiInput.forEach(input => {
        if (input.readOnly) {
            if (input.classList.contains('salary-total') || input.id.includes('Total')) {
                input.value = "RM 0.00";
            } else {
                input.value = "";
            }
        } else {
            input.value = '';
        }
    });

    const senaraiSelect = kadKalkulator.querySelectorAll('select');
    senaraiSelect.forEach(select => {
        select.selectedIndex = 0;
        select.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const kontenaElaun = kadKalkulator.querySelector('.dynamic-allowance-wrapper');
    if (kontenaElaun) {
        const senaraiBarisElaun = kontenaElaun.querySelectorAll('.elaun-row-kalkulator');
        senaraiBarisElaun.forEach((baris, index) => {
            if (index === 0) {
                baris.querySelectorAll('input').forEach(inp => inp.value = '');
            } else {
                baris.remove();
            }
        });
        if (typeof updateGlobalElaunSum === 'function') {
            updateGlobalElaunSum(kontenaElaun);
        }
    } else {
        Object.keys(salaryMap).forEach(key => {
            let allowID = salaryMap[key][0];
            let allowEl = kadKalkulator.querySelector(`[id="${allowID}"], [data-original-id="${allowID}"]`);
            if (allowEl) allowEl.value = '';
        });
    }

    const prefixList = ['orp', 'baki', 'ot', 'lewat', 'otRH', 'otPH', 'rh', 'rhMore', 'ph', 'sec18A', 'annualLeave', 'sickLeave', 'kelayakanCuti', 'kelayakanSakit', 'resUni', 'tbb'];
    prefixList.forEach(prefix => {
        let pending = kadKalkulator.querySelector(`[id="${prefix}Pending"], [data-original-id="${prefix}Pending"]`);
        let data = kadKalkulator.querySelector(`[id="${prefix}Data"], [data-original-id="${prefix}Data"]`);
        if (pending && data) {
            pending.style.display = "block";
            data.style.display = "none";
        }
    });

    const outputStrong = kadKalkulator.querySelectorAll('.result-row strong, [id$="Result"], [id$="Amount"], [id$="ORP"], [id$="Hourly"], [id$="Daily"], [id$="Minutely"], [id$="Hari"], [id$="Tempoh"], [id$="Kadar"]');
    outputStrong.forEach(el => {
        if (el.innerText.includes("RM") || el.id.includes('Amount') || el.id.includes('Result') || el.id.includes('ORP') || el.id.includes('Hourly') || el.id.includes('Daily') || el.id.includes('Minutely')) {
            el.innerText = "RM 0.00";
            el.style.color = "";
        } else if (el.id.includes('Tempoh') || el.id.includes('Kadar') || el.id.includes('Hari')) {
            el.innerText = "-";
        }
    });

    let badanRumusan = document.getElementById('badanJadualRumusan');
    if (badanRumusan && templateId) {
        let mappingSasaran = {
            'orp': 'orpBakiAmount',
            'baki': 'orpBakiAmount',
            'otBiasa': 'otAmount',
            'rehatKurang': 'rhAmount',
            'rehatLebih': 'rhMoreAmount',
            'sec18A': 'amount18A',
            'otRehat': 'otRHAmount',
            'kelepasan': 'phAmount',
            'otKelepasan': 'otPHAmount',
            'cutiTahunan': 'annualLeaveAmount',
            'cutiSakit': 'sickLeaveAmount',
            'notis': ['resUniMonthAmount', 'resUni18AAmount'],
            'faedah': 'tbbAmount',
            'lewat': 'lewatAmount'
        };

        let sasaranId = mappingSasaran[templateId];
        if (sasaranId) {
            let barisRumusan = badanRumusan.querySelectorAll('tr');
            barisRumusan.forEach(tr => {
                let select = tr.querySelector('select');
                if (select) {
                    let nilaiSelect = select.value;
                    if (Array.isArray(sasaranId) ? sasaranId.includes(nilaiSelect) : nilaiSelect === sasaranId) {
                        tr.remove(); 
                    }
                }
            });
            if (typeof kiraJumlahKeseluruhanRumusan === 'function') {
                kiraJumlahKeseluruhanRumusan(); 
            }
        }
    }
};

// =====================================================
// 7. ENGINE 2026: CLONE & MULTI-INSTANCE
// =====================================================
window.tambahKalkulator = function(templateId) {
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    let activeBtn = document.querySelector(`.menu-btn[onclick*="${templateId}"]`);
    if(activeBtn) activeBtn.classList.add('active');

    let grid = document.getElementById('active-calculators-grid');
    let rumusanCard = document.querySelector('.rumusan-card');
    let warningBox = document.querySelector('.warning-box');

    if (templateId === 'maklumatGaji') {
        // 1. Padamkan kad Maklumat Gaji sedia ada (jika ada) untuk elak duplikasi
        let existingMg = document.querySelectorAll('#active-maklumatGaji');
        existingMg.forEach(mg => mg.remove());

        // 2. Sembunyikan kad aktif sementara
        let semuaKadAktif = document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card)');
        semuaKadAktif.forEach(kad => {
            kad.classList.add('sementara-sembunyi');
            kad.style.display = 'none';
        });
        if (rumusanCard) rumusanCard.style.display = "none";
        if (warningBox) warningBox.style.display = "none";
    } else {
        if (warningBox) warningBox.style.display = "block";
        let existingMg = document.getElementById('active-maklumatGaji');
        if (existingMg) {
            existingMg.remove();
            
            // PENAMBAHBAIKAN UTAMA: Jika pilih kalkulator baharu semasa di paparan Maklumat Gaji,
            // anggap sebagai MULA PROSES BARU. Padam semua kad yang disorok, reset rumusan & elaun.
            document.querySelectorAll('.sementara-sembunyi').forEach(kad => {
                kad.remove();
            });
            
            if (typeof resetRumusan === 'function') resetRumusan();
            if (typeof senaraiElaunGlobal !== 'undefined') senaraiElaunGlobal = [];
            if (rumusanCard) rumusanCard.style.display = "none";
            setTimeout(() => { if (typeof window.semakDanTukarElaun === 'function') window.semakDanTukarElaun(); }, 50);
        }
    }

    let templateCard = document.getElementById('card-' + templateId);
    if (!templateCard) return alert('Kalkulator tidak ditemui!');
    
    let clone = templateCard.cloneNode(true);
    clone.classList.remove('hidden-template');
    
    let uniqueSuffix = '_' + Math.random().toString(36).substr(2, 9);
    
    if (templateId === 'maklumatGaji') {
        clone.id = 'active-maklumatGaji';
        clone.style.position = "relative";
    } else {
        clone.id = clone.id + uniqueSuffix;
        clone.style.position = "relative";
        let closeBtn = document.createElement('button');
        closeBtn.className = "close-card-btn";
        closeBtn.innerHTML = "X";
        closeBtn.onclick = function() { 
            let templateId = clone.getAttribute('data-template-id');
            clone.remove(); 
            
            let badanRumusan = document.getElementById('badanJadualRumusan');
            if (badanRumusan && templateId) {
                let mappingSasaran = {
                    'orp': 'orpBakiAmount',
                    'baki': 'orpBakiAmount',
                    'otBiasa': 'otAmount',
                    'rehatKurang': 'rhAmount',
                    'rehatLebih': 'rhMoreAmount',
                    'sec18A': 'amount18A',
                    'otRehat': 'otRHAmount',
                    'kelepasan': 'phAmount',
                    'otKelepasan': 'otPHAmount',
                    'cutiTahunan': 'annualLeaveAmount',
                    'cutiSakit': 'sickLeaveAmount',
                    'notis': ['resUniMonthAmount', 'resUni18AAmount'],
                    'faedah': 'tbbAmount',
                    'lewat': 'lewatAmount'
                };

                let sasaranId = mappingSasaran[templateId];
                if (sasaranId) {
                    let barisRumusan = badanRumusan.querySelectorAll('tr');
                    barisRumusan.forEach(tr => {
                        let select = tr.querySelector('select');
                        if (select) {
                            let nilaiSelect = select.value;
                            if (Array.isArray(sasaranId) ? sasaranId.includes(nilaiSelect) : nilaiSelect === sasaranId) {
                                tr.remove(); 
                            }
                        }
                    });
                    if (typeof kiraJumlahKeseluruhanRumusan === 'function') {
                        kiraJumlahKeseluruhanRumusan(); 
                    }
                }
            }

            let kadTinggal = document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card)');
            if (kadTinggal.length === 0) {
                if (rumusanCard) { rumusanCard.style.display = "none"; }
            } else {
                setTimeout(() => window.semakDanTukarElaun(), 50);
            }
        };
        clone.appendChild(closeBtn);
    }

    let allElementsWithId = clone.querySelectorAll('[id]');
    allElementsWithId.forEach(el => {
        el.setAttribute('data-original-id', el.id);
        if (templateId !== 'maklumatGaji') {
            el.id = el.id + uniqueSuffix;
        }
        if(el.tagName === 'INPUT' && el.type !== 'button') el.value = "";
        if(el.tagName === 'STRONG' || el.tagName === 'SPAN') {
            if(el.innerText.includes('RM')) el.innerText = 'RM 0.00';
            else if(el.innerText !== 'Kadar Sehari' && el.innerText !== 'Bayaran' && el.innerText !== 'Hari Bekerja') el.innerText = '-';
        }
    });
    
    if (templateId !== 'maklumatGaji') {
        let allElementsWithName = clone.querySelectorAll('[name]');
        allElementsWithName.forEach(el => {
            el.setAttribute('name', el.getAttribute('name') + uniqueSuffix);
        });
    }

    if (templateId !== 'maklumatGaji') {
        let currentBasic = "";
        let currentAllowance = "";
        
        function extractSalaryFromCard(kad) {
            for (let mapKey of Object.keys(salaryMap)) {
                let sourceBasic = kad.querySelector(`[data-original-id="${mapKey}"]`);
                if (sourceBasic && sourceBasic.value) {
                    let semakNilai = evaluateSmartMath(sourceBasic.value);
                    if (semakNilai > 0) {
                        let allowVal = "";
                        let sourceAllowId = salaryMap[mapKey][0];
                        let sourceAllow = kad.querySelector(`[data-original-id="${sourceAllowId}"]`);
                        if (sourceAllow) allowVal = sourceAllow.value;
                        return { basic: sourceBasic.value, allow: allowVal };
                    }
                }
            }
            return null;
        }

        if (activeCardContext && !activeCardContext.classList.contains('hidden-template') && !activeCardContext.classList.contains('rumusan-card')) {
            let extracted = extractSalaryFromCard(activeCardContext);
            if (extracted) { currentBasic = extracted.basic; currentAllowance = extracted.allow; }
        }

        if (currentBasic === "") {
            let kadAktifLain = Array.from(document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card)'));
            for (let i = kadAktifLain.length - 1; i >= 0; i--) {
                let extracted = extractSalaryFromCard(kadAktifLain[i]);
                if (extracted) { currentBasic = extracted.basic; currentAllowance = extracted.allow; break; }
            }
        }

        if (currentBasic !== "") {
            for (let targetKey of Object.keys(salaryMap)) {
                let targetBasic = clone.querySelector(`[data-original-id="${targetKey}"]`);
                let targetAllowId = salaryMap[targetKey][0];
                let targetAllow = clone.querySelector(`[data-original-id="${targetAllowId}"]`);
                let targetTotalId = salaryMap[targetKey][1];
                let targetTotal = clone.querySelector(`[data-original-id="${targetTotalId}"]`);

                if (targetBasic) {
                    targetBasic.value = currentBasic;
                    if (targetAllow && currentAllowance !== "") { targetAllow.value = currentAllowance; }
                    if (targetTotal) {
                        let calcBasic = evaluateSmartMath(currentBasic);
                        let calcAllow = currentAllowance !== "" ? evaluateSmartMath(currentAllowance) : 0;
                        targetTotal.value = "RM " + (calcBasic + calcAllow).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    }
                }
            }
        }
    }

    let allButtons = clone.querySelectorAll('button');
    allButtons.forEach(btn => {
        let oriClick = btn.getAttribute('onclick');
        if (oriClick && !oriClick.includes('clone.remove')) {
            let funcName = oriClick.replace(/\(.*?\)/, '').trim(); 
            btn.removeAttribute('onclick');
            btn.setAttribute('data-action-func', oriClick);
            btn.addEventListener('click', function(e) {
                activeCardContext = clone; 
                try { if (typeof window[funcName] === 'function') window[funcName](e); } finally { activeCardContext = null; }
            });
        }
    });

    if (rumusanCard) grid.insertBefore(clone, rumusanCard); else grid.appendChild(clone);
    
    if (templateId !== 'maklumatGaji' && rumusanCard) { 
        let kadAktifBiasa = document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card):not(#active-maklumatGaji)');
        if (kadAktifBiasa.length > 0) rumusanCard.style.display = "block"; 
    }

    clone.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// =====================================================
// 8. ENJIN ELAUN DINAMIK GLOBAL & ONBOARDING TOUR
// =====================================================
let senaraiElaunGlobal = [];
let elaunTourDitunjuk = false; 

function transformAllowanceField(allowInput) {
    allowInput.style.display = 'none'; 
    let prev = allowInput.previousElementSibling;
    if (prev && prev.tagName === 'LABEL') prev.style.display = 'none';

    let container = document.createElement('div');
    container.className = 'dynamic-allowance-wrapper';
    container.style.cssText = 'width: 100%; margin-bottom: 15px; background: #f4f6f9; padding: 12px; border: 1px dashed #1f4e79; border-radius: 6px; position: relative;';

    let htmlRows = '';
    if (senaraiElaunGlobal && senaraiElaunGlobal.length > 0) {
        senaraiElaunGlobal.forEach((elaun, i) => {
            let btnX = i === 0 ? `` : `<button type="button" onclick="buangBarisElaunGlobalKalkulator(this)" style="background:#dc3545; color:white; border:none; padding:0 10px; border-radius:5px; font-weight:bold; cursor:pointer;">X</button>`;
            let nFormatted = elaun.nilai ? formatSafeRM(elaun.nilai) : '';
            htmlRows += `
                <div style="display:flex; gap:5px; margin-bottom:5px;" class="elaun-row-kalkulator">
                    <input type="text" class="global-elaun-jenis" placeholder="Jenis Elaun" value="${elaun.jenis || ''}" style="flex:3; padding:8px; font-size:13px; border:1px solid #ccc; border-radius:5px;" oninput="this.value = formatTitleCase(this.value); updateGlobalElaunSum(this);">
                    <div style="flex:2; display:flex; gap:5px;">
                        <input type="text" class="global-elaun-nilai number-input salary-input" placeholder="Nilai (RM)" value="${nFormatted}" style="width:100%; padding:8px; font-size:13px; border:1px solid #ccc; border-radius:5px; text-align:right;" oninput="updateGlobalElaunSum(this)" onfocus="this.select()">
                        ${btnX}
                    </div>
                </div>
            `;
        });
    } else {
        htmlRows = `
            <div style="display:flex; gap:5px; margin-bottom:5px;" class="elaun-row-kalkulator">
                <input type="text" class="global-elaun-jenis" placeholder="Jenis Elaun" style="flex:3; padding:8px; font-size:13px; border:1px solid #ccc; border-radius:5px;" oninput="this.value = formatTitleCase(this.value); updateGlobalElaunSum(this);">
                <div style="flex:2; display:flex; gap:5px;">
                    <input type="text" class="global-elaun-nilai number-input salary-input" placeholder="Nilai (RM)" style="width:100%; padding:8px; font-size:13px; border:1px solid #ccc; border-radius:5px; text-align:right;" oninput="updateGlobalElaunSum(this)" onfocus="this.select()">
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
            <label style="font-weight:bold; color:#1f4e79; margin:0; font-size:12px;">Maklumat Elaun</label>
            <button type="button" onclick="tambahBarisElaunGlobalKalkulator(this)" style="background:#198754; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">+ Tambah Elaun</button>
        </div>
        <div class="dynamic-elaun-list-kalkulator">
            ${htmlRows}
        </div>
    `;
    allowInput.parentNode.insertBefore(container, allowInput.nextSibling);
    
    if (senaraiElaunGlobal.length > 0) { updateGlobalElaunSum(container); }

    // SEMAKAN PENTING: Tahan Popup Tour jika diarahkan
    if (!elaunTourDitunjuk && !window.tangguhTourElaunSeketika) {
        elaunTourDitunjuk = true;
        setTimeout(() => tunjukTourElaun(container), 400);
    }
}

function tunjukTourElaun(targetContainer) {
    targetContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    let overlay = document.createElement('div');
    overlay.id = 'tourElaunOverlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.65); z-index: 99998; backdrop-filter: blur(2px); transition: opacity 0.3s;';
    document.body.appendChild(overlay);

    let originalPos = targetContainer.style.position;
    let originalZ = targetContainer.style.zIndex;
    let originalBg = targetContainer.style.background;
    
    targetContainer.style.position = 'relative';
    targetContainer.style.zIndex = '99999';
    targetContainer.style.background = '#fff';
    targetContainer.style.boxShadow = '0 0 0 4px #fff, 0 0 0 6px #d9534f, 0 15px 35px rgba(0,0,0,0.5)';

    let popover = document.createElement('div');
    popover.innerHTML = `
        <div class="tour-popover-box" style="position: absolute; top: calc(100% + 15px); left: 15px; background: white; border-radius: 8px; width: 330px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); padding: 20px; border-top: 6px solid #d9534f; color: #333; font-family: sans-serif; cursor: default; animation: floatUp 0.4s ease-out; z-index: 100000; text-align: left;">
            
            <div style="position: absolute; bottom: 100%; left: 30px; border-width: 10px; border-style: solid; border-color: transparent transparent #d9534f transparent;"></div>
            <div style="position: absolute; bottom: calc(100% - 6px); left: 30px; border-width: 10px; border-style: solid; border-color: transparent transparent #fff transparent;"></div>
            
            <h4 style="margin: 0 0 10px 0; color: #1f4e79; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                <span style="background: #1f4e79; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px;">💡</span>
                Panduan Maklumat Elaun
            </h4>
            <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #333;">Elaun <span style="color:#d9534f;">SELAIN / TIDAK TERMASUK:</span></p>
            
            <ul style="margin: 0 0 12px 0; padding-left: 20px; font-size: 11.5px; color: #555; line-height: 1.45;">
                <li>NILAI tempat tinggal, bekalan makanan, minyak, lampu, air, rawatan perubatan atau yang diluluskan JTK;</li>
                <li>Bayaran CARUMAN;</li>
                <li>Elaun Pengangkutan (Kenderaan/minyak (yang sama erti dengannya));</li>
                <li>Bayaran Khas untuk tujuan perbelanjaan pekerjaan;</li>
                <li>Bayaran persaraan/pemberhentian/pampasan;</li>
                <li>Bonus tahunan.</li>
            </ul>
            
            <p style="margin: 0 0 15px 0; font-size: 11px; font-weight: bold; color: #d9534f; background: #fff0f0; padding: 6px 8px; border-radius: 4px; border-left: 3px solid #d9534f;">* DAN TIDAK TERMASUK bayaran yang dibayar di luar waktu kerja normal.</p>
            
            <button id="btnTutupTour" style="width: 100%; background: #1f4e79; color: white; border: none; padding: 10px; border-radius: 5px; font-weight: bold; font-size: 13px; cursor: pointer; transition: 0.2s;">OK, SAYA FAHAM</button>
        </div>
        <style>
            @keyframes floatUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
            #btnTutupTour:hover { background: #153859 !important; }
            @media (max-width: 400px) { .tour-popover-box { width: calc(100vw - 60px) !important; left: -10px !important; } }
        </style>
    `;
    targetContainer.appendChild(popover);

    const tutupTour = () => {
        overlay.remove();
        popover.remove();
        targetContainer.style.position = originalPos;
        targetContainer.style.zIndex = originalZ;
        targetContainer.style.background = originalBg;
        targetContainer.style.boxShadow = 'none';
    };

    overlay.addEventListener('click', tutupTour);
    document.getElementById('btnTutupTour').addEventListener('click', tutupTour);
}

window.semakDanTukarElaun = function() {
    let wrapperSediaAda = document.querySelector('.dynamic-allowance-wrapper');
    if (wrapperSediaAda) return;

    let semuaKadAktif = document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card)');
    for (let i = 0; i < semuaKadAktif.length; i++) {
        let kad = semuaKadAktif[i];
        let allowInput = null;
        
        for (let k of Object.keys(salaryMap)) {
            let aid = salaryMap[k][0];
            let found = kad.querySelector(`[id="${aid}"], [data-original-id="${aid}"]`);
            if (found && window.getComputedStyle(found).display !== 'none') { 
                allowInput = found; 
                break; 
            }
        }

        if (allowInput) {
            transformAllowanceField(allowInput);
            break; 
        }
    }
};

window.tambahBarisElaunGlobalKalkulator = function(btn) {
    let list = btn.parentElement.nextElementSibling;
    let row = document.createElement('div');
    row.className = 'elaun-row-kalkulator';
    row.style.cssText = "display:flex; gap:5px; margin-bottom:5px;";
    row.innerHTML = `
        <input type="text" class="global-elaun-jenis" placeholder="Jenis Elaun" style="flex:3; padding:8px; font-size:13px; border:1px solid #ccc; border-radius:5px;" oninput="this.value = formatTitleCase(this.value); updateGlobalElaunSum(this);">
        <div style="flex:2; display:flex; gap:5px;">
            <input type="text" class="global-elaun-nilai number-input salary-input" placeholder="Nilai (RM)" style="width:100%; padding:8px; font-size:13px; border:1px solid #ccc; border-radius:5px; text-align:right;" oninput="updateGlobalElaunSum(this)" onfocus="this.select()">
            <button type="button" onclick="buangBarisElaunGlobalKalkulator(this)" style="background:#dc3545; color:white; border:none; padding:0 10px; border-radius:5px; font-weight:bold; cursor:pointer;">X</button>
        </div>
    `;
    list.appendChild(row);
};

window.buangBarisElaunGlobalKalkulator = function(btn) {
    let row = btn.parentElement.parentElement; 
    let container = row.closest('.dynamic-allowance-wrapper');
    row.remove();
    updateGlobalElaunSum(container);
};

window.updateGlobalElaunSum = function(el) {
    let wrapper = el.closest('.dynamic-allowance-wrapper');
    if (!wrapper) return;
    let rows = wrapper.querySelectorAll('.elaun-row-kalkulator');
    let total = 0;
    senaraiElaunGlobal = []; 
    
    rows.forEach(r => {
        let j = r.querySelector('.global-elaun-jenis').value.trim();
        let nStr = r.querySelector('.global-elaun-nilai').value;
        let n = evaluateSmartMath(nStr);
        if (j || nStr) {
            senaraiElaunGlobal.push({jenis: j, nilai: n > 0 ? n : nStr});
        }
        if (n > 0) total += n;
    });

    let formattedTotal = total > 0 ? formatRM(total) : "";

    Object.keys(salaryMap).forEach(key => {
        let aID = salaryMap[key][0];
        document.querySelectorAll(`[id="${aID}"], [data-original-id="${aID}"]`).forEach(aEl => {
            if(aEl.value !== formattedTotal) {
                aEl.value = formattedTotal;
                aEl.dispatchEvent(new Event('input', {bubbles:true})); 
            }
        });
    });
};

const observerKalkulator = new MutationObserver((mutations) => {
    let perluSemak = false;
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
            perluSemak = true;
        }
    });
    if (perluSemak) {
        setTimeout(() => window.semakDanTukarElaun(), 50);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    let gridNode = document.getElementById('active-calculators-grid');
    if (gridNode) observerKalkulator.observe(gridNode, { childList: true });
    
    setTimeout(() => window.semakDanTukarElaun(), 100);
});

function fungsiBaruRumusan(e) {
    if (e) e.preventDefault();
}

// =========================================================
// 9. ENJIN KHAS SEKSYEN 18A & FLYOUT MENU
// =========================================================

// Simpan fungsi asal untuk dipanggil kemudian
const asal_tambahKalkulator = window.tambahKalkulator;

// Pemintas (Interceptor) untuk navigasi Senarai Rekod
window.tambahKalkulator = function(templateId) {
    if (templateId === 'maklumatGaji') {
        urusPertukaranMenu('REKOD', function() {
            asal_tambahKalkulator(templateId);
        });
    } else {
        asal_tambahKalkulator(templateId);
    }
};

// TAMBAHAN BARU: Fungsi Pintar untuk elak Flyout terpotong
function autoBetulkanPosisiFlyout(flyoutId) {
    let flyout = document.getElementById(flyoutId);
    if (!flyout) return;
    
    // Reset style ke asal untuk kiraan tepat
    flyout.style.top = '0px';
    flyout.style.bottom = 'auto';
    
    let rect = flyout.getBoundingClientRect();
    let windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Jika bahagian bawah flyout terkeluar / terpotong dari pandangan skrin
    if (rect.bottom > windowHeight) {
        let lebihan = rect.bottom - windowHeight;
        // Tolak flyout ke atas berserta margin lega (+20px)
        flyout.style.top = '-' + (lebihan + 20) + 'px';
    }
}

function toggleFlyout18A(e) {
    e.preventDefault();
    e.stopPropagation();
    urusPertukaranMenu('18A', function() {
        let flyoutAkta = document.getElementById('flyoutMenuAktaKerja');
        if (flyoutAkta) flyoutAkta.style.display = 'none';
        
        let flyout = document.getElementById('flyoutMenu18ACustom');
        if (flyout) {
            flyout.style.display = flyout.style.display === 'none' ? 'block' : 'none';
            // Jalankan pelarasan auto selepas flyout dibuka
            if (flyout.style.display === 'block') {
                setTimeout(() => autoBetulkanPosisiFlyout('flyoutMenu18ACustom'), 10);
            }
        }
    });
}

function toggleFlyoutAktaKerja(e) {
    e.preventDefault();
    e.stopPropagation();
    urusPertukaranMenu('AKTA', function() {
        let flyout18A = document.getElementById('flyoutMenu18ACustom');
        if (flyout18A) flyout18A.style.display = 'none';
        
        let flyout = document.getElementById('flyoutMenuAktaKerja');
        if (flyout) {
            flyout.style.display = flyout.style.display === 'none' ? 'block' : 'none';
            // Jalankan pelarasan auto selepas flyout dibuka
            if (flyout.style.display === 'block') {
                setTimeout(() => autoBetulkanPosisiFlyout('flyoutMenuAktaKerja'), 10);
            }
        }
    });
}

// Tutup flyout jika klik di tempat lain
document.addEventListener('click', function(e) {
    let flyout18A = document.getElementById('flyoutMenu18ACustom');
    if (flyout18A && flyout18A.style.display === 'block' && !e.target.closest('#flyoutMenu18ACustom') && !e.target.closest('button[onclick*="toggleFlyout18A"]')) {
        flyout18A.style.display = 'none';
    }
    let flyoutAkta = document.getElementById('flyoutMenuAktaKerja');
    if (flyoutAkta && flyoutAkta.style.display === 'block' && !e.target.closest('#flyoutMenuAktaKerja') && !e.target.closest('button[onclick*="toggleFlyoutAktaKerja"]')) {
        flyoutAkta.style.display = 'none';
    }
});

// Enjin Mengklon kalkulator dan tukar Mod Formula
window.tambahKalkulator18ACustom = function(templateId) {
    document.getElementById('flyoutMenu18ACustom').style.display = 'none';
    asal_tambahKalkulator(templateId);
    setTimeout(() => {
        let semuaKad = document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card)');
        let newCard = semuaKad[semuaKad.length - 1]; 
        if (!newCard) return;

        newCard.style.borderTop = "5px solid #d9534f";
        let h2 = newCard.querySelector('h2');
        if(h2) {
            h2.innerHTML = h2.innerHTML + ` <br><span style="font-size:12px; color:#d9534f; background:#ffe8e8; padding:3px 8px; border-radius:4px; display:inline-block; margin-top:5px;">Mod Seksyen 18A (Bahagi Hari Dalam Bulan)</span>`;
        }

        let formGroups = newCard.querySelectorAll('.form-group');
        if (formGroups.length > 0) {
            let divHari = document.createElement('div');
            divHari.className = "form-group";
            divHari.style.width = "100%";
            divHari.style.marginBottom = "15px";
            divHari.innerHTML = `<label style="color:#d9534f; font-weight:bold; display:block; margin-bottom:5px;">Bilangan Hari Dalam Bulan</label><input type="number" class="hari-bulan-18a" placeholder="Contoh: 28, 30, 31" value="30" style="border: 2px solid #d9534f; border-radius: 4px; padding: 10px; width: 100%; box-sizing: border-box; background: #fffaf9; font-size:14px; font-weight:bold;">`;
            formGroups[0].parentNode.insertBefore(divHari, formGroups[0]);
        }

        let btnKira = newCard.querySelector('button[data-action-func*="calculate"], button[onclick*="calculate"]');
        if (btnKira) {
            let newBtnKira = btnKira.cloneNode(true);
            newBtnKira.removeAttribute('data-action-func');
            newBtnKira.removeAttribute('onclick');
            newBtnKira.style.background = "#d9534f"; 
            newBtnKira.style.borderColor = "#c9302c";
            newBtnKira.innerHTML = "Kira (Mod 18A)";
            btnKira.parentNode.replaceChild(newBtnKira, btnKira);

            newBtnKira.addEventListener('click', function(e) {
                let tempContext = activeCardContext;
                activeCardContext = newCard;
                try {
                    let hariBulanInput = newCard.querySelector('.hari-bulan-18a');
                    let hariBulan = hariBulanInput ? (Number(hariBulanInput.value) || 26) : 26; 
                    
                    if (templateId === 'orp') calculateORP(e, hariBulan);
                    else if (templateId === 'baki') calculateBakiUpah(e);
                    else if (templateId === 'otBiasa') calculateOTBiasa(e, hariBulan);
                    else if (templateId === 'lewat') calculateLewat(e, hariBulan);
                    else if (templateId === 'otRehat') calculateOTRH(e, hariBulan);
                    else if (templateId === 'otKelepasan') calculateOTPH(e, hariBulan);
                    else if (templateId === 'rehatKurang') calculateHariRehat(e, hariBulan);
                    else if (templateId === 'rehatLebih') calculateHariRehatLebih(e, hariBulan);
                    else if (templateId === 'kelepasan') calculatePH(e, hariBulan);
                    else if (templateId === 'cutiTahunan') calculateCutiTahunan(e, hariBulan);
                    else if (templateId === 'cutiSakit') calculateCutiSakit(e, hariBulan);
                    else if (templateId === 'sec18A') calculate18ANew(e);
                } finally {
                    activeCardContext = tempContext;
                }
            });
        }
    }, 50);
};

// =========================================================
// 10. ENJIN DRAF & KAWALAN PERTUKARAN MENU (NEW)
// =========================================================

// Semak mode aplikasi semasa
function dapatkanModSemasa() {
    let kadAktif = document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card):not(#active-maklumatGaji)');
    if (kadAktif.length === 0) {
        let kadSembunyi = document.querySelectorAll('.sementara-sembunyi');
        if(kadSembunyi.length > 0) {
            let is18A = false;
            kadSembunyi.forEach(k => { if(k.querySelector('.hari-bulan-18a')) is18A = true; });
            return is18A ? '18A' : 'AKTA';
        }
        return 'NONE';
    }
    let is18A = false;
    kadAktif.forEach(k => { if(k.querySelector('.hari-bulan-18a')) is18A = true; });
    return is18A ? '18A' : 'AKTA';
}

// Pintasan sekiranya user tukar mode sebelum memadam/menyimpan
function urusPertukaranMenu(modDestinasi, fungsiCallback) {
    let modSemasa = dapatkanModSemasa();
    
    // Jika tiada aktiviti atau destinasi adalah sama dengan aktiviti semasa
    if (modSemasa === 'NONE' || modSemasa === modDestinasi) {
        return fungsiCallback(); 
    }

    // Jika user dah ada dalam menu Rekod, biarkan
    if (modDestinasi === 'REKOD' && document.getElementById('active-maklumatGaji')) {
        return fungsiCallback();
    }

    let paparanMod = modSemasa === '18A' ? 'KALKULATOR SEKSYEN 18A' : 'KALKULATOR AKTA KERJA';
    
    let boxHtml = `
    <div id="modalAmaranPertukaran" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);">
        <div style="background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); text-align: center; border-top: 6px solid #f39c12;">
            <div style="font-size: 45px; margin-bottom: 10px; line-height: 1;">⚠️</div>
            <h3 style="margin-top: 0; color: #1f4e79; font-size: 20px; font-weight: 800;">Simpan Draf Aktiviti?</h3>
            <p style="font-size: 14px; color: #444; line-height: 1.6; margin-bottom: 25px;">
                Anda mempunyai aktiviti pengiraan di<br><b>${paparanMod}</b> yang belum disimpan.<br><br>Adakah anda ingin <b>Menyimpan</b> maklumat ini ke Senarai Rekod sebelum beralih ke menu lain?
            </p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="btnSimpanDraf" style="background: #198754; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; transition: 0.2s; box-shadow: 0 4px 6px rgba(25,135,84,0.2);">💾 Ya, Simpan ke Senarai Rekod</button>
                <button id="btnHapusDraf" style="background: #dc3545; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; transition: 0.2s; box-shadow: 0 4px 6px rgba(220,53,69,0.2);">🗑️ Tidak, Hapus Maklumat</button>
                <button id="btnBatalTukar" style="background: #6c757d; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px; margin-top: 5px;">Batal (Kekal di sini)</button>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', boxHtml);

    document.getElementById('btnSimpanDraf').onclick = function() {
        document.getElementById('modalAmaranPertukaran').remove();
        simpanKeDrafDOM(modSemasa);
        fungsiCallback();
    };

    document.getElementById('btnHapusDraf').onclick = function() {
        document.getElementById('modalAmaranPertukaran').remove();
        document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card):not(#active-maklumatGaji)').forEach(k => k.remove());
        if(typeof resetRumusan === 'function') resetRumusan();
        senaraiElaunGlobal = [];
        let rc = document.querySelector('.rumusan-card'); if(rc) rc.style.display = 'none';
        fungsiCallback();
    };

    document.getElementById('btnBatalTukar').onclick = function() {
        document.getElementById('modalAmaranPertukaran').remove();
    };
}

// Logik Ekstrak dan Simpan Draf DOM ke "Senarai Rekod"
window.simpanKeDrafDOM = function(modSemasa) {
    let drafContainer = document.getElementById('drafStorageContainer');
    if(!drafContainer) {
        drafContainer = document.createElement('div');
        drafContainer.id = 'drafStorageContainer';
        drafContainer.style.display = 'none';
        document.body.appendChild(drafContainer);
    }

    let drafId = 'draf_' + Date.now();
    let wrapper = document.createElement('div');
    wrapper.id = 'wrapper_' + drafId;

    let kadContainer = document.createElement('div');
    kadContainer.className = 'draf-kad-container';
    document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card):not(#active-maklumatGaji)').forEach(kad => {
        kad.classList.remove('sementara-sembunyi');
        kad.style.display = ''; 
        kadContainer.appendChild(kad); 
    });
    wrapper.appendChild(kadContainer);

    let rumusanContainer = document.createElement('tbody');
    rumusanContainer.className = 'draf-rumusan-container';
    document.querySelectorAll('#badanJadualRumusan tr').forEach(tr => {
        rumusanContainer.appendChild(tr); 
    });
    wrapper.appendChild(rumusanContainer);

    wrapper.setAttribute('data-elaun', JSON.stringify(typeof senaraiElaunGlobal !== 'undefined' ? senaraiElaunGlobal : []));
    drafContainer.appendChild(wrapper);

    if(typeof kiraJumlahKeseluruhanRumusan === 'function') kiraJumlahKeseluruhanRumusan();

    let labelMode = modSemasa === '18A' ? 'Seksyen 18A' : 'Akta Kerja 1955';
    let tarikh = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    let trHtml = `
        <td style="padding: 15px; font-size: 13px; font-weight: bold; color: #d97706; vertical-align: middle;">
            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 6px;">
                <span style="background: #fef3c7; padding: 4px 8px; border-radius: 4px; border: 1px solid #fde68a;">⏳ DRAF PENGIRAAN</span>
            </div>
        </td>
        <td style="padding: 15px; font-size: 13px; vertical-align: middle;"><strong style="color: #333;">${labelMode}</strong></td>
        <td style="padding: 15px; font-size: 13px; vertical-align: middle;"><strong style="color: #666;">-</strong></td>
        <td style="padding: 15px; text-align: center; font-size: 13px; color: #444; vertical-align: middle;">${tarikh}</td>
        <td style="padding: 15px; text-align: center; vertical-align: middle;">
            <button data-draf-id="${drafId}" onclick="bukaDraf(event)" style="background: #ffc107; color: #000; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer; margin-right: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">📂 Sambung</button>
            <button data-draf-id="${drafId}" onclick="hapusDraf(event)" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">🗑️ Hapus</button>
        </td>
    `;

    let tbodyTemplate = document.querySelector('#card-maklumatGaji tbody');
    if (tbodyTemplate) {
        let trTemplate = document.createElement('tr');
        trTemplate.style.borderBottom = "1px solid #eee";
        trTemplate.setAttribute('data-draf', drafId);
        trTemplate.innerHTML = trHtml;
        let firstRow = tbodyTemplate.querySelector('tr');
        if (firstRow && firstRow.innerHTML.includes('KBR/10103')) firstRow.remove();
        tbodyTemplate.appendChild(trTemplate);
    }

    let activeMg = document.getElementById('active-maklumatGaji');
    if(activeMg) {
        let activeTbody = activeMg.querySelector('tbody');
        if(activeTbody) {
            let trActive = document.createElement('tr');
            trActive.style.borderBottom = "1px solid #eee";
            trActive.setAttribute('data-draf', drafId);
            trActive.innerHTML = trHtml;
            let firstRowAct = activeTbody.querySelector('tr');
            if (firstRowAct && firstRowAct.innerHTML.includes('KBR/10103')) firstRowAct.remove();
            activeTbody.appendChild(trActive);
        }
    }
};

window.bukaDraf = function(e) {
    let btn = e.currentTarget;
    let drafId = btn.getAttribute('data-draf-id');
    let wrapper = document.getElementById('wrapper_' + drafId);
    
    if(!wrapper) {
        alert("Maaf, draf tidak dijumpai.");
        return;
    }

    document.querySelectorAll('.calculator-card:not(.hidden-template):not(#active-maklumatGaji):not(.rumusan-card)').forEach(k => k.remove());
    document.getElementById('badanJadualRumusan').innerHTML = ''; 

    let activeMg = document.getElementById('active-maklumatGaji');
    if (activeMg) activeMg.remove();

    let grid = document.getElementById('active-calculators-grid');
    let rumusanCard = document.querySelector('.rumusan-card');
    
    let kadContainer = wrapper.querySelector('.draf-kad-container');
    while(kadContainer.firstChild) {
        if(rumusanCard) grid.insertBefore(kadContainer.firstChild, rumusanCard);
        else grid.appendChild(kadContainer.firstChild);
    }

    let rumusanTbodyTarget = document.getElementById('badanJadualRumusan');
    let rumusanContainer = wrapper.querySelector('.draf-rumusan-container');
    while(rumusanContainer.firstChild) {
        rumusanTbodyTarget.appendChild(rumusanContainer.firstChild);
    }

    try { senaraiElaunGlobal = JSON.parse(wrapper.getAttribute('data-elaun')); } catch(err) { senaraiElaunGlobal = []; }

    wrapper.remove();
    document.querySelectorAll(`tr[data-draf="${drafId}"]`).forEach(tr => tr.remove());

    if(rumusanCard) rumusanCard.style.display = 'block';
    let warningBox = document.querySelector('.warning-box');
    if(warningBox) warningBox.style.display = 'block';
    
    if(typeof kiraJumlahKeseluruhanRumusan === 'function') kiraJumlahKeseluruhanRumusan();
    setTimeout(() => { if (typeof window.semakDanTukarElaun === 'function') window.semakDanTukarElaun(); }, 50);
    
    alert("Draf telah berjaya disambung semula.");
};

window.hapusDraf = function(e) {
    let btn = e.currentTarget;
    let drafId = btn.getAttribute('data-draf-id');
    let sah = confirm("Adakah anda pasti mahu memadam draf ini?");
    if(sah) {
        let wrapper = document.getElementById('wrapper_' + drafId);
        if(wrapper) wrapper.remove();
        document.querySelectorAll(`tr[data-draf="${drafId}"]`).forEach(tr => tr.remove());
    }
};
    ```
