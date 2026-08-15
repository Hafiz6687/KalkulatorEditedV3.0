// =====================================================
// KALKULATOR AKTA KERJA 1955
// SCRIPT.JS - MASTER KARYA AGUNG (FINAL INTEGRATION)
// =====================================================

// =====================================================
// 1. AUTO-FIX & AUTO-FORMAT RM (KEMAS KINI BAHARU)
// =====================================================
document.addEventListener("DOMContentLoaded", function() {
    let semuaInput = document.querySelectorAll('input');
    
    semuaInput.forEach(input => {
        if (input.type === "date") return;
        if (input.type === "number") input.setAttribute("type", "text");
        
        // BILA USER KLIK KELUAR (BLUR) -> FORMAT JADI RM1,700.00
        input.addEventListener("blur", function() {
            let label = this.parentElement.querySelector("label");
            let isCurrency = this.classList.contains("salary-input") || 
                             this.classList.contains("salary-total") ||
                             (label && label.innerText.includes("(RM)"));
            
            if (isCurrency && this.value.trim() !== "") {
                let cleanVal = evaluateSmartMath(this.value);
                if (cleanVal !== 0 || this.value.includes("0")) {
                    this.value = "RM" + cleanVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            }
        });

        // BILA USER KLIK MASUK KOTAK (FOCUS) -> BUANG RM SUPAYA SENANG TAIP
        input.addEventListener("focus", function() {
            let label = this.parentElement.querySelector("label");
            let isCurrency = this.classList.contains("salary-input") || 
                             this.classList.contains("salary-total") ||
                             (label && label.innerText.includes("(RM)"));
                             
            if (isCurrency && (this.value.includes("RM") || this.value.includes(","))) {
                let cleanVal = evaluateSmartMath(this.value);
                this.value = cleanVal === 0 && !this.value.includes("0") ? "" : cleanVal;
            }
        });

        // BILA ADA SIMBOL TAMBAH TOLAK -> KIRA AUTOMATIK
        input.addEventListener("change", function() {
            try {
                let nilai = this.value.trim();
                if (/^\d{1,4}-\d{1,2}-\d{1,4}$/.test(nilai) || /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(nilai)) return; 
                if (/[+\-*/()]/.test(nilai) && !nilai.includes("RM")) {
                    let hasil = evaluateSmartMath(nilai);
                    if (hasil !== undefined && !isNaN(hasil)) {
                        this.value = hasil; 
                        this.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
            } catch (e) {}
        });
    });
});

// =====================================================
// 2. CIRI BAHARU: KAWALAN STATUS NOTIS (GGN)
// =====================================================
function toggleNotisStatus() {
    let statusEl = document.getElementById("ggnStatusNotis");
    if (!statusEl) return;
    let status = statusEl.value;
    
    let elsStart = ["ggnUniWeekStart", "ggnUniDayStart"];
    let elsEnd = ["ggnUniWeekEnd", "ggnUniDayEnd"];

    elsStart.forEach(id => {
        let el = document.getElementById(id);
        if (el && el.parentElement) {
            let lbl = el.parentElement.querySelector("label");
            if (lbl) lbl.innerText = (status === "tiada") ? "Tarikh Penamatan (Serta-merta)" : "Tarikh Mula Notis";
        }
    });

    elsEnd.forEach(id => {
        let el = document.getElementById(id);
        if (el && el.parentElement) {
            el.parentElement.style.display = (status === "tiada") ? "none" : "block";
        }
    });
}

function toggleGGNMode() {
    let mode = document.getElementById("ggnUniType").value;
    document.getElementById("ggnGroupBulan").style.display = "none";
    document.getElementById("ggnGroupMinggu").style.display = "none";
    document.getElementById("ggnGroupHari").style.display = "none";
    
    let statusGroup = document.getElementById("ggnStatusGroup");
    if (statusGroup) statusGroup.style.display = (mode === "minggu" || mode === "hari") ? "block" : "none";

    if (mode === "bulan") document.getElementById("ggnGroupBulan").style.display = "block";
    else if (mode === "minggu") { document.getElementById("ggnGroupMinggu").style.display = "block"; toggleNotisStatus(); } 
    else if (mode === "hari") { document.getElementById("ggnGroupHari").style.display = "block"; toggleNotisStatus(); }

    document.getElementById("ggnResBulan").style.display = "none";
    document.getElementById("ggnRes18A").style.display = "none";
    document.getElementById("ggnResPending").style.display = "block";
}

function autoGGNEndDate(type) {
    let startId = type === 'minggu' ? 'ggnUniWeekStart' : 'ggnUniDayStart';
    let valId = type === 'minggu' ? 'ggnUniWeekVal' : 'ggnUniDayVal';
    let endId = type === 'minggu' ? 'ggnUniWeekEnd' : 'ggnUniDayEnd';

    let start = getElement(startId); let val = getElement(valId); let end = getElement(endId);
    if (!start || !val || !end) return;

    let multiplier = type === 'minggu' ? 7 : 1; let daysToAdd = Number(val.value) * multiplier;
    if (!start.value || daysToAdd <= 0) { end.value = ""; return; }

    let date = new Date(start.value);
    date.setDate(date.getDate() + daysToAdd - 1);
    end.value = formatDateInput(date);
}

function calculateGGNUnified() {
    let mode = document.getElementById("ggnUniType").value;
    if (!mode) { alert("Sila pilih Jenis Notis terlebih dahulu."); return; }
    let totalSalary = updateSalaryTotal("ggnUniBasic", "ggnUniAllowance", "ggnUniTotal");
    let statusNotisEl = document.getElementById("ggnStatusNotis");
    let isTanpaNotis = statusNotisEl && statusNotisEl.value === "tiada";
    
    if (mode === "bulan") {
        let months = Number(getElement("ggnUniMonthVal").value);
        if (months <= 0) { alert("Sila masukkan bilangan bulan notis."); return; }
        let amount = totalSalary * months;
        setText("resUniMonthCount", months + " Bulan"); setText("resUniMonthAmount", formatRM(amount));
        document.getElementById("ggnResPending").style.display = "none";
        document.getElementById("ggnRes18A").style.display = "none";
        document.getElementById("ggnResBulan").style.display = "block";
    } else {
        let valId = mode === 'minggu' ? 'ggnUniWeekVal' : 'ggnUniDayVal';
        let startId = mode === 'minggu' ? 'ggnUniWeekStart' : 'ggnUniDayStart';
        let endId = mode === 'minggu' ? 'ggnUniWeekEnd' : 'ggnUniDayEnd';
        let val = Number(getElement(valId).value); let startDate = getElement(startId).value;
        
        if (val <= 0 || !startDate) { 
            let msg = isTanpaNotis ? "Tarikh Penamatan" : "Tarikh Mula Notis";
            alert(`Sila masukkan bilangan ${mode} dan ${msg}.`); return; 
        }
        
        let multiplier = mode === 'minggu' ? 7 : 1; let totalDays = val * multiplier;
        let start = new Date(startDate); let end = new Date(start);
        end.setDate(end.getDate() + totalDays - 1);
        
        let breakdown = getMonthlyBreakdown(totalSalary, start, end);
        let totalAmount = 0; breakdown.forEach(item => { totalAmount += item.amount; });
        setValue(endId, formatDateInput(end)); setText("resUni18ATotal", formatRM(totalSalary));
        setText("resUni18AEnd", `${end.getDate()}-${end.getMonth() + 1}-${end.getFullYear()}`);
        
        let endResultEl = document.getElementById("resUni18AEnd");
        if(endResultEl && endResultEl.parentElement) {
            let lbl = endResultEl.parentElement.querySelector("span");
            if(lbl) lbl.innerText = isTanpaNotis ? "Tamat Tempoh Indemniti" : "Tarikh Akhir Notis";
        }
        
        if (breakdown.length > 0) {
            let f = breakdown[0]; let fD = new Date(f.year, f.month, 1);
            setText("resUniM1Title", fD.toLocaleString("ms-MY", {month:"long", year:"numeric"}));
            setText("resUniM1Days", f.days + " Hari"); setText("resUniM1Daily", formatRM(f.dailyRate)); setText("resUniM1Amount", formatRM(f.amount));
        }
        if (breakdown.length > 1) {
            let s = breakdown[1]; let sD = new Date(s.year, s.month, 1);
            setText("resUniM2Title", sD.toLocaleString("ms-MY", {month:"long", year:"numeric"}));
            setText("resUniM2Days", s.days + " Hari"); setText("resUniM2Daily", formatRM(s.dailyRate)); setText("resUniM2Amount", formatRM(s.amount));
        } else {
            setText("resUniM2Title", "-"); setText("resUniM2Days", "-"); setText("resUniM2Daily", "-"); setText("resUniM2Amount", "-");
        }
        setText("resUni18AAmount", formatRM(totalAmount));
        document.getElementById("ggnResPending").style.display = "none";
        document.getElementById("ggnResBulan").style.display = "none";
        document.getElementById("ggnRes18A").style.display = "block";
    }
}

function resetGGNUnified() {
    ["ggnUniBasic", "ggnUniAllowance", "ggnUniType", "ggnUniMonthVal", 
     "ggnUniWeekVal", "ggnUniWeekStart", "ggnUniWeekEnd",
     "ggnUniDayVal", "ggnUniDayStart", "ggnUniDayEnd", "ggnStatusNotis"].forEach(id => {
         if (getElement(id)) setValue(id, "");
     });
    if(getElement("ggnStatusNotis")) setValue("ggnStatusNotis", "ada");
    setValue("ggnUniTotal", "RM 0.00"); toggleGGNMode(); 
}

// =====================================================
// 3. GLOBAL HELPER FUNCTION
// =====================================================
function getElement(id) { return document.getElementById(id); }
function setText(id, value) { let element = getElement(id); if (element) element.innerHTML = value; }
function setValue(id, value) { let element = getElement(id); if (element) element.value = value; }
function formatRM(value) { value = Number(value) || 0; return "RM " + value.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function toggleResult(prefix, showData) {
    let pending = document.getElementById(prefix + "Pending");
    let data = document.getElementById(prefix + "Data");
    if (pending && data) {
        pending.style.display = showData ? "none" : "block";
        data.style.display = showData ? "block" : "none";
    }
}

// =====================================================
// 4. SHARED CALENDAR ENGINE FOUNDATION
// =====================================================
function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getMonthlyBreakdown(salary, startDate, endDate) {
    let result = []; let current = new Date(startDate);
    while (current <= endDate) {
        let year = current.getFullYear(); let month = current.getMonth();
        let daysInMonth = getDaysInMonth(year, month);
        let firstDay = current.getDate(); let lastDay = daysInMonth;
        if (year === endDate.getFullYear() && month === endDate.getMonth()) lastDay = endDate.getDate();
        let days = lastDay - firstDay + 1;
        let dailyRate = salary / daysInMonth; let amount = dailyRate * days;
        result.push({ year: year, month: month, daysInMonth: daysInMonth, days: days, dailyRate: dailyRate, amount: amount });
        current = new Date(year, month + 1, 1);
    }
    return result;
}

// =====================================================
// 5. INPUT FORMULA ENGINE & SALARY MAP (FIX AUTO-FORMAT RM)
// =====================================================
function calculateInput(value) { if (!value) return 0; try { return Function("return " + value)(); } catch (error) { return 0; } }

function getInputNumber(id) {
    let element = getElement(id);
    if (!element) return 0;
    // Guna evaluateSmartMath untuk membersihkan RM dan koma sebelum kira
    return evaluateSmartMath(element.value);
}

function updateSalaryTotal(basicID, allowanceID, totalID) {
    let basic = getInputNumber(basicID); 
    let allowance = getInputNumber(allowanceID);
    let total = basic + allowance; 
    let tEl = getElement(totalID);
    // Paksa format RM1,700.00 untuk kotak Jumlah
    if(tEl) tEl.value = "RM" + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); 
    return total;
}

const salaryMap = {
    "orpBasicSalary": ["orpAllowance", "orpTotalSalary"],
    "otBasicSalary": ["otAllowance", "otTotalSalary"],
    "otRHBasicSalary": ["otRHAllowance", "otRHTotalSalary"],
    "section18ABasicSalary": ["section18AAllowance", "section18ATotalSalary"],
    "ggnUniBasic": ["ggnUniAllowance", "ggnUniTotal"],
    "rhBasicSalary": ["rhAllowance", "rhTotalSalary"],
    "rhMoreBasicSalary": ["rhMoreAllowance", "rhMoreTotalSalary"],
    "phBasicSalary": ["phAllowance", "phTotalSalary"],
    "otPHBasicSalary": ["otPHAllowance", "otPHTotalSalary"],
    "tbbBasicSalary": ["tbbAllowance", "tbbTotalSalary"]
};

// Enjin khas untuk letak "RM" secara pantas sewaktu salin (sync)
function formatAutoSyncRM(valStr) {
    if (!valStr) return "";
    let val = evaluateSmartMath(valStr);
    if (val === 0 && !valStr.toString().includes("0")) return "";
    return "RM" + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

document.addEventListener("input", function(event) {
    let id = event.target.id; let value = event.target.value;
    
    // Jika user taip di Kad ORP, kita salin ke tempat lain DENGAN FORMAT RM!
    if (id === "orpBasicSalary" || id === "orpAllowance") {
        Object.keys(salaryMap).forEach(function(key) {
            if (key !== "orpBasicSalary") {
                let basicID = key; let allowanceID = salaryMap[key][0]; let totalID = salaryMap[key][1];
                
                if (id === "orpBasicSalary") {
                    let el = getElement(basicID);
                    if(el) el.value = formatAutoSyncRM(value); // <-- Salinan kini dalam format RM1,700.00
                }
                if (id === "orpAllowance") {
                    let el = getElement(allowanceID);
                    if(el) el.value = formatAutoSyncRM(value);
                }
                updateSalaryTotal(basicID, allowanceID, totalID);
            }
        });
    }
    
    // Kemaskini jumlah jika mana-mana kotak selain ORP berubah
    Object.keys(salaryMap).forEach(function(key) {
        let data = salaryMap[key];
        if (id === key || id === data[0]) updateSalaryTotal(key, data[0], data[1]);
    });
});
// =====================================================
// 6. OTHER CALCULATORS (ORP, OT, RH, PH, LEAVES, 18A, TBB)
// =====================================================
function getORP() { let totalSalary = updateSalaryTotal("orpBasicSalary", "orpAllowance", "orpTotalSalary"); return totalSalary / 26; }

// --- Fungsi Khas Bahagian 1 (ORP) ---
function calculateORP() {
    let totalSalary = updateSalaryTotal("orpBasicSalary", "orpAllowance", "orpTotalSalary"); 
    let ORP = totalSalary / 26;
    
    setText("orpResultTotal", formatRM(totalSalary)); 
    setText("orpResult", formatRM(ORP)); 
    
    document.getElementById("orpPending").style.display = "none";
    document.getElementById("orpData").style.display = "block";
}

function resetORP() {
    ["orpBasicSalary", "orpAllowance"].forEach(id => setValue(id, "")); 
    setValue("orpTotalSalary", "RM 0.00");
    ["orpResultTotal", "orpResult"].forEach(id => setText(id, "RM 0.00"));
    
    document.getElementById("orpData").style.display = "none";
    
    // Tunjuk balik teks 'Pending' jika bahagian bawah pun tak buka
    if (document.getElementById("bakiData").style.display === "none" || document.getElementById("bakiData").style.display === "") {
        document.getElementById("orpPending").style.display = "block";
    }
}
// --- Fungsi Khas Bahagian 2 (Baki Upah) ---
function calculateBakiUpah() {
    let patutTerima = getInputNumber("orpPatutTerima");
    let telahTerima = getInputNumber("orpTelahTerima");
    
    // FORMULA BARU: Telah Terima - Patut Terima
    let baki = telahTerima - patutTerima; 
    
    let bakiEl = document.getElementById("orpBakiAmount");
    if(bakiEl) {
        if (baki < 0) {
            // Jika negatif (Kurang bayar) -> Warna Merah
            bakiEl.innerText = "-" + formatRM(Math.abs(baki));
            bakiEl.style.color = "#d9534f"; // Warna merah
        } else if (baki > 0) {
            // Jika positif (Terlebih bayar) -> Warna Hijau / Biru
            bakiEl.innerText = "+" + formatRM(baki);
            bakiEl.style.color = "#28a745"; // Warna hijau
        } else {
            // Jika sifar
            bakiEl.innerText = formatRM(0);
            bakiEl.style.color = "#1f4e79";
        }
    }
    
    document.getElementById("orpPending").style.display = "none";
    document.getElementById("bakiData").style.display = "block";
}
function resetBakiUpah() {
    ["orpPatutTerima", "orpTelahTerima"].forEach(id => setValue(id, "")); 
    let el = getElement("orpBakiAmount");
    if(el) { el.innerText = "RM 0.00"; el.style.color = ""; }
    
    document.getElementById("bakiData").style.display = "none";
    
    // Tunjuk balik teks 'Pending' jika bahagian atas pun tak buka
    if (document.getElementById("orpData").style.display === "none" || document.getElementById("orpData").style.display === "") {
        document.getElementById("orpPending").style.display = "block";
    }
}

function calculateOTBiasa() {
    let totalSalary = updateSalaryTotal("otBasicSalary", "otAllowance", "otTotalSalary");
    let hours = Number(getElement("otHours").value); let workingHours = Number(getElement("normalWorkingHours").value);
    if (!workingHours) { alert("Sila pilih jam kerja normal sehari."); return; }
    let ORP = totalSalary / 26; let hourly = (ORP / workingHours) * 1.5; let amount = hourly * hours;
    setText("otResultTotal", formatRM(totalSalary)); setText("otORP", formatRM(ORP));
    setText("otHourly", formatRM(hourly)); setText("otAmount", formatRM(amount)); toggleResult("ot", true);
}
function resetOTBiasa() {
    ["otBasicSalary", "otAllowance", "otHours"].forEach(id => setValue(id, ""));
    setValue("otTotalSalary", "RM 0.00"); setValue("normalWorkingHours", "");
    ["otResultTotal", "otORP", "otHourly", "otAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("ot", false);
}

function calculateOTRH() {
    let totalSalary = updateSalaryTotal("otRHBasicSalary", "otRHAllowance", "otRHTotalSalary");
    let hours = Number(getElement("otRHHours").value); let workingHours = Number(getElement("otRHNormalWorkingHours").value);
    if (!workingHours) { alert("Sila pilih jam kerja normal sehari."); return; }
    let ORP = totalSalary / 26; let hourly = (ORP / workingHours) * 2.0; let amount = hourly * hours;
    setText("otRHResultTotal", formatRM(totalSalary)); setText("otRHORP", formatRM(ORP));
    setText("otRHHourly", formatRM(hourly)); setText("otRHAmount", formatRM(amount)); toggleResult("otRH", true);
}
function resetOTRH() {
    ["otRHBasicSalary", "otRHAllowance", "otRHHours"].forEach(id => setValue(id, ""));
    setValue("otRHTotalSalary", "RM 0.00"); setValue("otRHNormalWorkingHours", "");
    ["otRHResultTotal", "otRHORP", "otRHHourly", "otRHAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("otRH", false);
}

function calculateHariRehat() {
    let totalSalary = updateSalaryTotal("rhBasicSalary", "rhAllowance", "rhTotalSalary");
    let days = Number(getElement("rhDays").value); let ORP = totalSalary / 26; let daily = ORP * 0.5; let amount = daily * days;
    setText("rhResultTotal", formatRM(totalSalary)); setText("rhORP", formatRM(ORP));
    setText("rhDaily", formatRM(daily)); setText("rhAmount", formatRM(amount)); toggleResult("rh", true);
}
function resetHariRehat() {
    ["rhBasicSalary", "rhAllowance", "rhDays"].forEach(id => setValue(id, "")); setValue("rhTotalSalary", "RM 0.00");
    ["rhResultTotal", "rhORP", "rhDaily", "rhAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("rh", false);
}

function calculateHariRehatLebih() {
    let totalSalary = updateSalaryTotal("rhMoreBasicSalary", "rhMoreAllowance", "rhMoreTotalSalary");
    let days = Number(getElement("rhMoreDays").value); let ORP = totalSalary / 26; let daily = ORP; let amount = daily * days;
    setText("rhMoreResultTotal", formatRM(totalSalary)); setText("rhMoreORP", formatRM(ORP));
    setText("rhMoreDaily", formatRM(daily)); setText("rhMoreAmount", formatRM(amount)); toggleResult("rhMore", true);
}
function resetHariRehatLebih() {
    ["rhMoreBasicSalary", "rhMoreAllowance", "rhMoreDays"].forEach(id => setValue(id, "")); setValue("rhMoreTotalSalary", "RM 0.00");
    ["rhMoreResultTotal", "rhMoreORP", "rhMoreDaily", "rhMoreAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("rhMore", false);
}

function calculatePH() {
    let totalSalary = updateSalaryTotal("phBasicSalary", "phAllowance", "phTotalSalary");
    let days = Number(getElement("phDays").value); let ORP = totalSalary / 26; let daily = ORP * 2; let amount = daily * days;
    setText("phResultTotal", formatRM(totalSalary)); setText("phORP", formatRM(ORP));
    setText("phDaily", formatRM(daily)); setText("phAmount", formatRM(amount)); toggleResult("ph", true);
}
function resetPH() {
    ["phBasicSalary", "phAllowance", "phDays"].forEach(id => setValue(id, "")); setValue("phTotalSalary", "RM 0.00");
    ["phResultTotal", "phORP", "phDaily", "phAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("ph", false);
}

function calculateOTPH() {
    let totalSalary = updateSalaryTotal("otPHBasicSalary", "otPHAllowance", "otPHTotalSalary");
    let hours = Number(getElement("otPHHours").value); let workingHours = Number(getElement("otPHWorkingHours").value);
    if (!workingHours) { alert("Sila pilih jam kerja normal sehari."); return; }
    let ORP = totalSalary / 26; let hourly = (ORP / workingHours) * 3.0; let amount = hourly * hours;
    setText("otPHResultTotal", formatRM(totalSalary)); setText("otPHORP", formatRM(ORP));
    setText("otPHHourly", formatRM(hourly)); setText("otPHAmount", formatRM(amount)); toggleResult("otPH", true);
}
function resetOTPH() {
    ["otPHBasicSalary", "otPHAllowance", "otPHHours"].forEach(id => setValue(id, ""));
    setValue("otPHTotalSalary", "RM 0.00"); setValue("otPHWorkingHours", "");
    ["otPHResultTotal", "otPHORP", "otPHHourly", "otPHAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("otPH", false);
}

function calculate18ANew() {
    let totalSalary = updateSalaryTotal("section18ABasicSalary", "section18AAllowance", "section18ATotalSalary");
    let startDate = getElement("section18AStartDate").value; let endDate = getElement("section18AEndDate").value;
    if (!startDate || !endDate) { alert("Sila masukkan tarikh mula dan tarikh akhir."); return; }
    let start = new Date(startDate); let end = new Date(endDate);
    if (end < start) { alert("Tarikh akhir tidak boleh lebih awal daripada tarikh mula."); return; }
    let breakdown = getMonthlyBreakdown(totalSalary, start, end);
    let totalAmount = 0; breakdown.forEach(item => { totalAmount += item.amount; });
    setText("resultTotalSalary", formatRM(totalSalary));
    if (breakdown.length > 0) {
        let first = breakdown[0]; let firstDate = new Date(first.year, first.month, 1);
        setText("month1Title", firstDate.toLocaleString("ms-MY", {month:"long", year:"numeric"}));
        setText("month1Days", first.days + " Hari"); setText("month1Daily", formatRM(first.dailyRate)); setText("month1Amount", formatRM(first.amount));
    }
    if (breakdown.length > 1) {
        let second = breakdown[1]; let secondDate = new Date(second.year, second.month, 1);
        setText("month2Title", secondDate.toLocaleString("ms-MY", {month:"long", year:"numeric"}));
        setText("month2Days", second.days + " Hari"); setText("month2Daily", formatRM(second.dailyRate)); setText("month2Amount", formatRM(second.amount));
    } else { setText("month2Title", "-"); setText("month2Days", "-"); setText("month2Daily", "-"); setText("month2Amount", "-"); }
    setText("amount18A", formatRM(totalAmount)); toggleResult("sec18A", true);
}
function resetSeksyen18A() {
    ["section18ABasicSalary", "section18AAllowance", "section18AStartDate", "section18AEndDate"].forEach(id => setValue(id, ""));
    setValue("section18ATotalSalary", "RM 0.00");
    ["resultTotalSalary", "month1Daily", "month2Daily", "month1Amount", "month2Amount", "amount18A"].forEach(id => setText(id, "RM 0.00"));
    ["month1Title", "month2Title", "month1Days", "month2Days"].forEach(id => setText(id, "-")); toggleResult("sec18A", false);
}

function calculateCutiTahunan() {
    let ORP = getORP(); let days = Number(getElement("annualLeaveDays").value); let amount = ORP * days;
    setText("annualLeaveORP", formatRM(ORP)); setText("annualLeaveAmount", formatRM(amount)); toggleResult("annualLeave", true);
}
function resetCutiTahunan() {
    setValue("cutiLayak", ""); setValue("cutiGuna", ""); setValue("annualLeaveDays", "");
    setText("annualLeaveORP", "RM 0.00"); setText("annualLeaveAmount", "RM 0.00"); toggleResult("annualLeave", false);
}
function autoKiraBakiCuti() {
    const layakInput = document.getElementById('cutiLayak').value; const gunaInput = document.getElementById('cutiGuna').value;
    if (layakInput === "" && gunaInput === "") { document.getElementById('annualLeaveDays').value = ""; return; }
    let baki = (parseFloat(layakInput) || 0) - (parseFloat(gunaInput) || 0);
    if (baki < 0) baki = 0; document.getElementById('annualLeaveDays').value = baki;
}

function calculateCutiSakit() {
    let ORP = getORP(); let days = Number(getElement("sickLeaveDays").value); let amount = ORP * days;
    setText("sickLeaveORP", formatRM(ORP)); setText("sickLeaveAmount", formatRM(amount)); toggleResult("sickLeave", true);
}
function resetCutiSakit() {
    setValue("sickLeaveDays", ""); setText("sickLeaveORP", "RM 0.00"); setText("sickLeaveAmount", "RM 0.00"); toggleResult("sickLeave", false);
}

function calculateKelayakanCuti() {
    const startVal = getElement('kelayakanCutiMula').value; const endVal = getElement('kelayakanCutiAkhir').value;
    if (!startVal || !endVal) { alert("Sila masukkan Tarikh Mula Kerja dan Tarikh Kiraan / Akhir."); return; }
    const startDate = new Date(startVal); const endDate = new Date(endVal);
    if (endDate < startDate) { alert("Tarikh Kiraan tidak boleh lebih awal daripada Tarikh Mula Kerja."); return; }
    let totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 - startDate.getMonth() + endDate.getMonth();
    if (endDate.getDate() < startDate.getDate()) { totalMonths--; } if (totalMonths < 0) totalMonths = 0;
    const yearsCompleted = Math.floor(totalMonths / 12); const remainingMonths = totalMonths % 12;
    let currentTier = (yearsCompleted >= 5) ? 16 : (yearsCompleted >= 2) ? 12 : 8;
    let prorataDays = remainingMonths > 0 ? Math.round((remainingMonths / 12) * currentTier) : 0;
    let totalTerkumpul = 0; for (let i = 1; i <= yearsCompleted; i++) { totalTerkumpul += (i <= 2) ? 8 : (i <= 5) ? 12 : 16; }
    let tempohText = (yearsCompleted > 0 ? `${yearsCompleted} Tahun ` : "") + (remainingMonths > 0 ? `${remainingMonths} Bulan` : "");
    if (totalMonths === 0) tempohText = "Kurang 1 Bulan";
    setText('kelayakanCutiTempoh', tempohText.trim()); setText('kelayakanCutiKategori', yearsCompleted === 0 ? "Tidak Layak (< 12 Bulan)" : `${currentTier} Hari / Tahun`);
    setText('kelayakanCutiTerkumpul', `${totalTerkumpul} Hari`); setText('kelayakanCutiHari', `${prorataDays} Hari`); toggleResult("kelayakanCuti", true);
}
function resetKelayakanCuti() {
    ['kelayakanCutiMula', 'kelayakanCutiAkhir'].forEach(id => setValue(id, ""));
    ['kelayakanCutiTempoh', 'kelayakanCutiKategori', 'kelayakanCutiTerkumpul'].forEach(id => setText(id, "-"));
    setText('kelayakanCutiHari', '0 Hari'); toggleResult("kelayakanCuti", false);
}

function calculateKelayakanCutiSakit() {
    const startVal = getElement('kelayakanCutiSakitMula').value; const endVal = getElement('kelayakanCutiSakitAkhir').value;
    if (!startVal || !endVal) { alert("Sila masukkan Tarikh Mula Kerja dan Tarikh Kiraan / Akhir."); return; }
    const startDate = new Date(startVal); const endDate = new Date(endVal);
    if (endDate < startDate) { alert("Tarikh Kiraan tidak boleh lebih awal."); return; }
    let totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 - startDate.getMonth() + endDate.getMonth();
    if (endDate.getDate() < startDate.getDate()) { totalMonths--; } if (totalMonths < 0) totalMonths = 0;
    const yearsCompleted = Math.floor(totalMonths / 12); const remainingMonths = totalMonths % 12;
    let kelayakanBiasa = (yearsCompleted >= 5) ? 22 : (yearsCompleted >= 2) ? 18 : 14;
    let tempohText = (yearsCompleted > 0 ? `${yearsCompleted} Tahun ` : "") + (remainingMonths > 0 ? `${remainingMonths} Bulan` : "");
    if (totalMonths === 0) tempohText = "Kurang 1 Bulan";
    setText('kelayakanCutiSakitTempoh', tempohText.trim()); setText('kelayakanCutiSakitBiasa', `${kelayakanBiasa} Hari`); setText('kelayakanCutiSakitHospital', `60 Hari`);
    setValue('sakitLayak', kelayakanBiasa); setValue('hospLayak', 60); autoKiraBakiSakit(); toggleResult("kelayakanSakit", true);
}
function resetKelayakanCutiSakit() {
    ['kelayakanCutiSakitMula', 'kelayakanCutiSakitAkhir'].forEach(id => setValue(id, ""));
    setText('kelayakanCutiSakitTempoh', "-"); setText('kelayakanCutiSakitBiasa', '0 Hari'); setText('kelayakanCutiSakitHospital', '60 Hari');
    resetBakiCutiSakit(); toggleResult("kelayakanSakit", false);
}
function autoKiraBakiSakit() {
    let bBiasa = (parseFloat(getElement('sakitLayak').value) || 0) - (parseFloat(getElement('sakitGuna').value) || 0);
    let bHosp = (parseFloat(getElement('hospLayak').value) || 0) - (parseFloat(getElement('hospGuna').value) || 0);
    setValue('bakiSakitBiasa', bBiasa < 0 ? 0 : bBiasa); setValue('bakiHosp', bHosp < 0 ? 0 : bHosp);
}
function resetBakiCutiSakit() { ['sakitLayak', 'sakitGuna', 'bakiSakitBiasa', 'hospLayak', 'hospGuna', 'bakiHosp'].forEach(id => setValue(id, "")); }

function formatDateInput(date) {
    let year = date.getFullYear(); let month = String(date.getMonth() + 1).padStart(2, "0"); let day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
}

const monthNames = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"];
function evaluateSmartMath(inputStr) {
    if (!inputStr) return 0;
    let cleanStr = inputStr.toString().toLowerCase().replace(/rm/g, '').replace(/bulan/g, '').replace(/x/g, '*').replace(/\[/g, '(').replace(/\]/g, ')').replace(/[^\d\.\+\-\*\/\(\)]/g, ''); 
    if (cleanStr === "") return 0; try { return eval(cleanStr) || 0; } catch (e) { return 0; }
}

function toggleTBBSalaryMode() {
    let mode = document.getElementById("tbbSalaryMode").value;
    document.getElementById("tbbFixedSalaryGroup").style.display = (mode === "tetap") ? "block" : "none";
    document.getElementById("tbbVariableSalaryGroup").style.display = (mode === "berubah") ? "block" : "none";
    document.getElementById("tbbFormulaSalaryGroup").style.display = (mode === "formula") ? "block" : "none";
    if (mode === "berubah") generate12MonthsTable();
}

function generate12MonthsTable() {
    let endDateVal = document.getElementById("tbbEndDate").value;
    let container = document.getElementById("tbb12MonthsContainer");
    if (!endDateVal) { container.innerHTML = '<span style="color:#1f4e79; font-weight:bold;">Menunggu Tarikh Penamatan dipilih...</span>'; return; }
    let end = new Date(endDateVal); let currentMonth = end.getMonth(); let currentYear = end.getFullYear();
    let lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    if (end.getDate() < lastDayOfMonth) { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } }
    let html = '<label style="margin-bottom:12px; display:block; color:#1f4e79; font-weight:bold; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Upah 12 Bulan Terakhir (RM)</label>';
    for (let i = 0; i < 12; i++) {
        html += `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:14px; font-weight:bold; color:#555;">${monthNames[currentMonth]} ${currentYear}</span>
            <input type="text" class="number-input tbb-monthly-input" style="width: 55%; padding: 6px; margin-bottom: 0;" placeholder="Contoh: 1800+200" onfocus="this.select()" onchange="autoKiraKotakBulan(this)"></div>`;
        currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    }
    container.innerHTML = html;
}

function autoKira12Bulan() { setValue("tbb12MonthsTotalReadonly", formatRM(evaluateSmartMath(getElement("tbbMonthlyTotal").value) * 12)); }
function autoKiraKotakBulan(element) { if (element.value.trim() === "") return; let total = evaluateSmartMath(element.value); if (total > 0) element.value = formatRM(total); }

function calculateTBB() {
    let startVal = getElement("tbbStartDate").value; let endVal = getElement("tbbEndDate").value;
    if (!startVal || !endVal) { alert("Sila masukkan Tarikh Mula Kerja dan Tarikh Penamatan."); return; }
    let start = new Date(startVal); let end = new Date(endVal);
    if (end < start) { alert("Tarikh Penamatan tidak boleh lebih awal daripada Tarikh Mula."); return; }
    let mode = document.getElementById("tbbSalaryMode").value; let total12Months = 0;
    if (mode === "tetap") {
        let monthly = evaluateSmartMath(getElement("tbbMonthlyTotal").value);
        if (monthly <= 0) { alert("Sila masukkan Jumlah Upah Sebulan."); return; }
        total12Months = monthly * 12;
    } else if (mode === "berubah") {
        let inputs = document.querySelectorAll(".tbb-monthly-input");
        if (inputs.length === 0) { alert("Sila masukkan Tarikh Penamatan untuk menjana jadual."); return; }
        inputs.forEach(input => { total12Months += evaluateSmartMath(input.value); });
        if (total12Months <= 0) { alert("Sila isi upah bulanan pada jadual."); return; }
    } else if (mode === "formula") {
        total12Months = evaluateSmartMath(getElement("tbbFormulaInput").value);
        if (total12Months <= 0) { alert("Sila semak semula format formula anda."); return; }
    }
    let ORP = total12Months / 365;
    let totalMonths = (end.getFullYear() - start.getFullYear()) * 12 - start.getMonth() + end.getMonth();
    let dStart = start.getDate(); let dEnd = end.getDate(); let extraDays = 0;
    if (dEnd >= dStart) { extraDays = dEnd - dStart + 1; } else {
        totalMonths--; let prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        extraDays = prevMonth.getDate() - dStart + 1 + dEnd;
    }
    if (extraDays >= 15) { totalMonths++; } if (totalMonths < 0) totalMonths = 0;
    let years = Math.floor(totalMonths / 12); let remMonths = totalMonths % 12;
    let tempohText = (years > 0 ? `${years} Tahun ` : "") + (remMonths > 0 ? `${remMonths} Bulan` : "");
    if (totalMonths === 0) tempohText = "Kurang 1 Bulan";
    let rate = (totalMonths < 24) ? 10 : (totalMonths < 60) ? 15 : 20;
    let entitledDays = (totalMonths / 12) * rate; let amount = entitledDays * ORP;
    setText("tbbTempoh", tempohText.trim()); setText("tbbKadar", `${rate} Hari / Tahun`); setText("tbbHari", `${entitledDays.toFixed(2)} Hari`); 
    setText("tbbTotal12M", formatRM(total12Months)); setText("tbbORP", formatRM(ORP)); setText("tbbAmount", formatRM(amount)); toggleResult("tbb", true);
}
function resetTBB() {
    ["tbbStartDate", "tbbEndDate", "tbbMonthlyTotal", "tbb12MonthsTotalReadonly", "tbbFormulaInput"].forEach(id => setValue(id, ""));
    setValue("tbbSalaryMode", "tetap"); toggleTBBSalaryMode();
    getElement("tbb12MonthsContainer").innerHTML = '<span style="color:#1f4e79; font-weight:bold;">Menunggu Tarikh Penamatan dipilih...</span>';
    ["tbbTempoh", "tbbKadar", "tbbHari"].forEach(id => setText(id, "-"));
    ["tbbTotal12M", "tbbORP", "tbbAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("tbb", false);
}

// =====================================================
// 7. ENJIN KALKULATOR RUMUSAN AKHIR (VERSI PRO + RESET)
// =====================================================
const senaraiKalkulatorRumusan = [
    { nilai: "", teks: "- Sila Pilih Jenis Bayaran -" },
    { nilai: "resUniMonthAmount", teks: "Gaji Ganti Notis (Bulan)" },
    { nilai: "resUni18AAmount", teks: "Gaji Ganti Notis (Hari / Minggu)" },
    { nilai: "tbbAmount", teks: "Faedah Penamatan" },
    { nilai: "otAmount", teks: "OT Hari Biasa" },
    { nilai: "otRHAmount", teks: "OT Hari Rehat" },
    { nilai: "otPHAmount", teks: "OT Hari Kelepasan" },
    { nilai: "rhAmount", teks: "Kerja Hari Rehat (½ Hari @ Kurang)" },
    { nilai: "rhMoreAmount", teks: "Kerja Hari Rehat (Lebih ½ Hari)" },
    { nilai: "phAmount", teks: "Kerja Pada Hari Kelepasan" },
    { nilai: "amount18A", teks: "Seksyen 18A (Jumlah Bayaran Upah)" },
    { nilai: "annualLeaveAmount", teks: "Bayaran Cuti Tahunan" },
    { nilai: "sickLeaveAmount", teks: "Bayaran Cuti Sakit" }
];

function formatRMRumusan(amount) {
    if (isNaN(amount) || amount === "") return "RM0.00";
    return "RM" + parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function unformatRMRumusan(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/[^0-9.-]+/g, "")) || 0;
}

function tambahBarisRumusan() {
    const tbody = document.getElementById('badanJadualRumusan');
    const tr = document.createElement('tr');
    tr.style.borderBottom = "1px dashed #ddd";

    let pilihanHTML = '';
    senaraiKalkulatorRumusan.forEach(item => { pilihanHTML += `<option value="${item.nilai}">${item.teks}</option>`; });

    tr.innerHTML = `
        <td style="padding: 10px;">
            <select class="select-input" style="width: 100%; border-color: #1f4e79;" onchange="kemaskiniPatutBayar(this)">
                ${pilihanHTML}
            </select>
        </td>
        <td style="padding: 10px;">
            <input type="text" class="number-input patut-bayar" value="RM0.00" readonly style="background: #f4f4f4; font-weight: bold; width: 100%; text-align: right;">
        </td>
        <td style="padding: 10px;">
            <input type="text" class="number-input telah-bayar" placeholder="Contoh: 599.00" style="width: 100%; text-align: right;" onblur="formatTelahBayar(this)" onfocus="unformatTelahBayar(this)">
        </td>
        <td style="padding: 10px;">
            <input type="text" class="number-input baki-baris" value="RM0.00" readonly style="background: #fff; font-weight: bold; width: 100%; border: none; text-align: right;">
        </td>
        <td style="padding: 10px; text-align: center;">
            <button onclick="buangBarisRumusan(this)" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">X</button>
        </td>
    `;
    tbody.appendChild(tr);
}

function unformatTelahBayar(input) { let val = unformatRMRumusan(input.value); input.value = val === 0 ? "" : val; }
function formatTelahBayar(input) { let val = unformatRMRumusan(input.value); input.value = formatRMRumusan(val); kiraBakiBaris(input); }

function kemaskiniPatutBayar(selectElement) {
    const baris = selectElement.closest('tr');
    const idSasaran = selectElement.value;
    const inputPatutBayar = baris.querySelector('.patut-bayar');
    const inputTelahBayar = baris.querySelector('.telah-bayar'); // Kita target kotak Telah Bayar
    
    let nilaiDiambil = 0;
    
    // RESET KOTAK TELAH BAYAR KEPADA ASAL (Boleh edit)
    inputTelahBayar.removeAttribute('readonly');
    inputTelahBayar.style.background = "#fff";
    
    if (idSasaran !== "") {
        
        // KES KHAS: JIKA USER PILIH 'BAKI UPAH (ORP)'
        if (idSasaran === "orpBakiAmount") {
            let orpPatut = document.getElementById("orpPatutTerima");
            let orpTelah = document.getElementById("orpTelahTerima");
            
            // Tarik kedua-dua nilai dari Bahagian 2 ORP
            nilaiDiambil = unformatRMRumusan(orpPatut ? orpPatut.value : "0");
            let nilaiTelah = unformatRMRumusan(orpTelah ? orpTelah.value : "0");
            
            // Auto isi kotak Telah Bayar
            inputTelahBayar.value = formatRMRumusan(nilaiTelah);
            
            // KUNCI kotak Telah Bayar supaya user tak perlu edit di jadual rumusan lagi!
            inputTelahBayar.setAttribute('readonly', true);
            inputTelahBayar.style.background = "#f4f4f4";
            
        } 
        // KES NORMAL: KALKULATOR LAIN
        else {
            const elemenKeputusan = document.getElementById(idSasaran);
            if (elemenKeputusan) {
                nilaiDiambil = unformatRMRumusan(elemenKeputusan.innerText);
            }
            inputTelahBayar.value = ""; // Kosongkan untuk user isi sendiri
        }
    } else {
        inputTelahBayar.value = "";
    }
    
    inputPatutBayar.value = formatRMRumusan(nilaiDiambil);
    kiraBakiBaris(selectElement);
}

function kiraBakiBaris(elemenDalamBaris) {
    const baris = elemenDalamBaris.closest('tr');
    const patutBayar = unformatRMRumusan(baris.querySelector('.patut-bayar').value);
    const telahBayar = unformatRMRumusan(baris.querySelector('.telah-bayar').value);
    const inputBaki = baris.querySelector('.baki-baris');
    
    const baki = telahBayar - patutBayar; 
    
    // PENTING: Simpan nilai baki sebenar (berserta -/+) dalam 'data-value' 
    // supaya pengiraan Jumlah Keseluruhan matematik tetap tepat.
    inputBaki.setAttribute('data-value', baki);
    
    // PAPARAN VISUAL: Hanya tunjuk amaun tanpa simbol (-/+), bergantung sepenuhnya pada warna
    if (baki > 0) { 
        inputBaki.value = formatRMRumusan(baki); 
        inputBaki.style.color = "#28a745"; // Hijau (Terlebih Bayar - Mengurangkan tuntutan)
    } 
    else if (baki < 0) { 
        inputBaki.value = formatRMRumusan(Math.abs(baki)); // Math.abs membuang simbol tolak secara visual
        inputBaki.style.color = "#d9534f"; // Merah (Kurang Bayar - Menambah tuntutan)
    } 
    else { 
        inputBaki.value = formatRMRumusan(0); 
        inputBaki.style.color = "#333"; 
    }
    
    kiraJumlahKeseluruhanRumusan();
}

function buangBarisRumusan(butangPadam) { 
    butangPadam.closest('tr').remove(); 
    kiraJumlahKeseluruhanRumusan(); 
}

function resetRumusan() { 
    document.getElementById('badanJadualRumusan').innerHTML = ''; 
    kiraJumlahKeseluruhanRumusan(); 
}

function kiraJumlahKeseluruhanRumusan() {
    const semuaBaki = document.querySelectorAll('.baki-baris'); 
    let jumlahBesar = 0;
    
    semuaBaki.forEach(input => { 
        // BACA NILAI DARI MEMORI TERSEMBUNYI (data-value), BUKAN DARI KOTAK PAPARAN
        // Ini memastikan logik penambahan tuntutan (-) dan penolakan tuntutan (+) kekal selamat 100%
        let nilaiSebenar = input.getAttribute('data-value');
        if (nilaiSebenar !== null) {
            jumlahBesar += parseFloat(nilaiSebenar); 
        } else {
            jumlahBesar += unformatRMRumusan(input.value); 
        }
    });
    
    const teksJumlah = document.getElementById('jumlahKeseluruhanRumusan');
    
    // KEMAS KINI PAPARAN JUMLAH KESELURUHAN (Hanya tunjuk amaun & warna)
    if (jumlahBesar > 0) { 
        teksJumlah.innerText = formatRMRumusan(jumlahBesar); 
        teksJumlah.style.color = "#28a745"; 
    } 
    else if (jumlahBesar < 0) { 
        teksJumlah.innerText = formatRMRumusan(Math.abs(jumlahBesar)); 
        teksJumlah.style.color = "#d9534f"; 
    } 
    else { 
        teksJumlah.innerText = formatRMRumusan(0); 
        teksJumlah.style.color = "#1f4e79"; 
    }
}
// =====================================================
// 8. FUNGSI JANA LAPORAN PENUH (PDF + RUMUSAN)
// =====================================================
function janaLaporanPenuh() {
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
            
            // --- Formula dibetulkan supaya tiada RMRM berganda ---
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
                                if (subH3) {
                                    tajukKalkulator += " - " + subH3.innerText.split(':')[0]; 
                                }
                            }
                        }
                    }

                    // --- LOGIK BARU: Paksa tetapan Tajuk untuk ORP dan Baki ---
                    if (kalkulator.id === "orpData") tajukKalkulator = "Kadar Upah Biasa (ORP)";
                    if (kalkulator.id === "bakiData") tajukKalkulator = "Baki Upah / Gaji";
                    // ----------------------------------------------------------

                    let paramHtml = `<table class="param-table">`; 
                    let barisInput = kadAsal.querySelectorAll('.form-group');
                    
                    barisInput.forEach(fg => {
                        if (fg.offsetParent === null || window.getComputedStyle(fg).display === 'none' || fg.closest('[style*="display: none"]')) return; 
                        let labelEl = fg.querySelector('label'); let inputEl = fg.querySelector('input, select');
                        
                        if (labelEl && inputEl) {
                            let namaLabel = labelEl.innerText.split('\n')[0]; 
                            
                            // --- LOGIK BARU: Sembunyikan Label Spesifik ---
                            // 1. Buang Patut/Telah Terima dari laporan ORP
                            if (kalkulator.id === "orpData" && (namaLabel.includes("Patut Terima") || namaLabel.includes("Telah Terima"))) return;
                            
                            // 2. Buang Gaji Pokok/Elaun/Jumlah Upah dari laporan Baki
                            if (kalkulator.id === "bakiData" && (namaLabel.includes("Gaji Pokok") || namaLabel.includes("Elaun") || namaLabel.includes("Jumlah Upah"))) return;
                            // ----------------------------------------------

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

                    // --- LOGIK BARU: Tambah kotak (border biru) pada Keputusan Akhir ORP & Baki ---
                    if (kalkulator.id === "orpData" || kalkulator.id === "bakiData") {
                        let semuaBarisKeputusan = salinanKeputusan.querySelectorAll('.result-row');
                        if (semuaBarisKeputusan.length > 0) {
                            semuaBarisKeputusan[semuaBarisKeputusan.length - 1].classList.add('highlight-row');
                        }
                    }
                    // ------------------------------------------------------------------------------

                    if (kalkulator.id === "ggnRes18A") {
                        let getD = (el) => { let e = document.getElementById(el); return e ? e.innerText.trim() : ""; };
                        let m1 = getD("resUniM1Title"); let m2 = getD("resUniM2Title");
                        let h1 = getD("resUniM1Days"); let h2 = getD("resUniM2Days");
                        let r1 = getD("resUniM1Daily"); let r2 = getD("resUniM2Daily");
                        let a1 = getD("resUniM1Amount"); let a2 = getD("resUniM2Amount");
                        
                        let stEl = document.getElementById("ggnStatusNotis");
                        let lblTamat = (stEl && stEl.value === "tiada") ? "Tamat Tempoh Indemniti" : "Tarikh Akhir Notis";
                        let tDateStr = getD("resUni18AEnd"); let tDate = tDateStr ? tDateStr.replace(/\//g, "-") : ""; 
                        let tTotal = getD("resUni18AAmount");

                        salinanKeputusan.innerHTML = `
                            <div class="result-row" style="margin-bottom:8px;"><span>${lblTamat}</span><strong>${tDate}</strong></div>
                            <table class="clean-table">
                                <tr><td></td><td style="font-weight:bold;">${m1}</td><td style="font-weight:bold;">${m2}</td></tr>
                                <tr><td>Hari Bekerja</td><td>${h1}</td><td>${h2}</td></tr>
                                <tr><td>Kadar Sehari</td><td>${r1}</td><td>${r2}</td></tr>
                                <tr><td>Bayaran</td><td>${a1}</td><td>${a2}</td></tr>
                            </table>
                            <div class="result-row highlight-row" style="margin-top:10px;"><span>Bayaran Gaji Ganti Notis</span><strong>${tTotal}</strong></div>
                        `;
                    }
// --- LOGIK BARU: Susun atur Jadual Seksyen 18A ---
                    if (kalkulator.id === "sec18AData") {
                        let getD = (el) => { let e = document.getElementById(el); return e ? e.innerText.trim() : ""; };
                        let m1 = getD("month1Title"); let m2 = getD("month2Title");
                        let h1 = getD("month1Days"); let h2 = getD("month2Days");
                        let r1 = getD("month1Daily"); let r2 = getD("month2Daily");
                        let a1 = getD("month1Amount"); let a2 = getD("month2Amount");
                        let tTotal = getD("amount18A");

                        salinanKeputusan.innerHTML = `
                            <table class="clean-table" style="margin-top:5px;">
                                <tr><td></td><td style="font-weight:bold;">${m1}</td><td style="font-weight:bold;">${m2}</td></tr>
                                <tr><td>Hari Bekerja</td><td>${h1}</td><td>${h2}</td></tr>
                                <tr><td>Kadar Sehari</td><td>${r1}</td><td>${r2}</td></tr>
                                <tr><td>Bayaran</td><td>${a1}</td><td>${a2}</td></tr>
                            </table>
                            <div class="result-row highlight-row" style="margin-top:10px;"><span>Jumlah Bayaran Upah</span><strong>${tTotal}</strong></div>
                        `;
                    }
                    // --------------------------------------------------
                    htmlLaporan += `<div class="report-box"><div class="report-header">${tajukKalkulator}</div><div class="report-section-title">PARAMETER / INPUT:</div>${paramHtml}${jalanKiraHtml}<div class="report-section-title" style="margin-top:10px;">KEPUTUSAN:</div><div class="compact-result">${salinanKeputusan.innerHTML}</div></div>`;
                }
            }
        } catch (error) { console.error("Ralat pada kalkulator:", kalkulator.id, error); }
    });

    let rumusanTbody = document.getElementById('badanJadualRumusan');
    if (rumusanTbody && rumusanTbody.children.length > 0) {
        adaData = true; 
        let rumusanHTML = `<table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 12px; border: 1px solid #ccc;">
            <thead>
                <tr style="background: #1f4e79; color: white;">
                    <th style="padding: 8px; text-align: left; border: 1px solid #ccc;">Jenis Bayaran</th>
                    <th style="padding: 8px; text-align: right; border: 1px solid #ccc;">Patut Bayar</th>
                    <th style="padding: 8px; text-align: right; border: 1px solid #ccc;">Telah Bayar</th>
                    <th style="padding: 8px; text-align: right; border: 1px solid #ccc;">Baki (+/-)</th>
                </tr>
            </thead>
            <tbody>`;
            
        let barisRumusan = rumusanTbody.querySelectorAll('tr');
        barisRumusan.forEach(tr => {
            let select = tr.querySelector('select');
            let jenis = select.options[select.selectedIndex].text;
            let patut = tr.querySelector('.patut-bayar').value;
            let telah = tr.querySelector('.telah-bayar').value;
            let bakiInput = tr.querySelector('.baki-baris');
            let baki = bakiInput.value;
            let bakiWarna = bakiInput.style.color;
            
            rumusanHTML += `<tr>
                <td style="padding: 8px; border: 1px solid #ccc;">${jenis}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ccc; font-weight: bold;">${patut}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ccc;">${telah || "RM0.00"}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ccc; color: ${bakiWarna}; font-weight: bold;">${baki}</td>
            </tr>`;
        });
        
        let jumlahTeks = document.getElementById('jumlahKeseluruhanRumusan');
        
        rumusanHTML += `</tbody></table>
        <div style="text-align: right; margin-top: 10px; padding: 12px; background: #f4f6f9; border-radius: 6px; border: 1px solid #ccc;">
            <span style="font-size: 12px; font-weight: bold; color: #333;">Jumlah Keseluruhan Terlebih / Terkurang Bayar: </span>
            <strong style="font-size: 16px; color: ${jumlahTeks.style.color}; margin-left: 10px;">${jumlahTeks.innerText}</strong>
        </div>`;
        
        htmlLaporan += `<div class="report-box" style="grid-column: 1 / -1; border-left: 5px solid #1f4e79; margin-top: 10px;">
            <div class="report-header" style="background:#e8eaed; color:#1a1a1a;">RUMUSAN AKHIR BAYARAN</div>
            ${rumusanHTML}
        </div>`;
    }

    if (!adaData) { alert("Peringatan: Sila buat sekurang-kurangnya satu pengiraan atau isi Jadual Rumusan terlebih dahulu."); return; }
    
    let tarikhHariIni = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
    
    let cetakHTML = `<!DOCTYPE html><html lang="ms"><head><meta charset="UTF-8"><title>Laporan Pengiraan Akta Kerja 1955</title><style>* { font-family: 'Segoe UI', Arial, sans-serif; box-sizing: border-box; } body { color: #111; line-height: 1.35; padding: 20px; font-size: 11px; background: #fdfdfd; } .main-title { text-align: center; margin-bottom: 2px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #222; padding-bottom: 6px; text-transform: uppercase; color: #000; letter-spacing: 1px; } .subtitle { text-align: center; color: #555; margin-top: 5px; margin-bottom: 25px; font-size: 11px; } .grid-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; align-items: start; } .report-box { border: 1px solid #aaa; padding: 12px; border-radius: 6px; page-break-inside: avoid; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); } .report-header { font-size: 13px; font-weight: 800; text-align: center; background: #e8eaed; padding: 8px; border-bottom: 1px solid #aaa; margin: -12px -12px 12px -12px; border-radius: 6px 6px 0 0; text-transform: uppercase; color: #1a1a1a; letter-spacing: 0.5px; } .report-section-title { font-size: 10px; font-weight: bold; color: #1f4e79; letter-spacing: 0.5px; border-bottom: 1px dashed #ccc; padding-bottom: 3px; margin-bottom: 6px; text-transform: uppercase; } .param-table { width: 100%; font-size: 11px; border-collapse: collapse; margin-bottom: 12px; } .param-label { padding: 3px 0; color: #444; width: 55%; } .param-value { padding: 3px 0; text-align: right; font-weight: 700; color: #000; } .formula-box { background-color: #f4f6f9; border-left: 3px solid #1f4e79; padding: 10px 12px; margin: 12px 0; font-size: 11px; color: #222; border-radius: 0 4px 4px 0; } .formula-title { font-weight: bold; font-size: 10px; color: #1f4e79; margin-bottom: 6px; letter-spacing: 0.5px; } .compact-result .result-row { display: flex; justify-content: space-between; margin-bottom: 5px; align-items: center; flex-wrap: wrap; } .compact-result .result-row span { font-size: 11px; color: #333; } .compact-result .result-row strong, #orpBakiAmount { font-size: 12px; color: #000; white-space: nowrap; } .compact-result hr { display: none !important; } .clean-table { width: 100%; border-collapse: collapse; font-size: 11px; border: none; margin-bottom: 5px; } .clean-table td { padding: 4px 2px; border: none; color: #222; } .highlight-row, .result-row[style*="background"] { background: transparent !important; border: 1.5px solid #1f4e79; padding: 8px !important; border-radius: 4px; margin-top: 10px; } .highlight-row span, .result-row[style*="background"] span { color: #1f4e79 !important; font-weight: bold; } .highlight-row strong, .result-row[style*="background"] strong { color: #1f4e79 !important; font-size: 14px !important; } .print-btn-container { text-align: center; margin-top: 30px; grid-column: 1 / -1; } .print-btn { background-color: #1f4e79; color: white; border: none; padding: 12px 30px; font-size: 14px; cursor: pointer; font-weight: bold; border-radius: 5px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); } @media print { body { padding: 0; background: #fff; } .print-btn-container { display: none !important; } .report-box { border: 1px solid #aaa; box-shadow: none; } .report-header, .formula-box, .highlight-row, .result-row[style*="background"] { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }</style></head><body><h1 class="main-title">PENGIRAAN DI BAWAH AKTA KERJA 1955</h1><p class="subtitle">Tarikh Janaan: ${tarikhHariIni}</p><div class="grid-container">${htmlLaporan}</div><div class="print-btn-container"><button class="print-btn" onclick="window.print()">🖨️ Cetak / Simpan PDF</button><p style="font-size: 11px; margin-top: 8px; color:#666;">*Untuk simpan dalam peranti, sila pilih <b>'Save as PDF'</b> pada tetingkap pencetak (Destination).</p></div></body></html>`;
    
    let tetingkapCetak = window.open('', '_blank'); tetingkapCetak.document.write(cetakHTML); tetingkapCetak.document.close();
    setTimeout(() => { tetingkapCetak.focus(); tetingkapCetak.print(); }, 500);
}
// =====================================================
// 9. SISTEM LOGIN SIMPLE (DIKEMAS KINI: TOGGLE MASUK/KELUAR)
// =====================================================

// 1. Fungsi untuk tunjukkan skrin Login apabila butang "Log Masuk" ditekan
function paparLogMasuk() {
    document.getElementById("loginOverlay").style.display = "flex";
    document.getElementById("loginPassword").value = "";
    document.getElementById("loginError").style.display = "none";
}

// 2. Fungsi Semak Password
function semakLogin() {
    let inputLaluan = document.getElementById("loginPassword").value;
    let ralatMesej = document.getElementById("loginError");
    
    // TUKAR KATA LALUAN ANDA DI SINI
    let kataLaluanSebenar = "kerja1955"; 
    
    if (inputLaluan === kataLaluanSebenar) {
        // Jika betul, sembunyikan tirai login
        document.getElementById("loginOverlay").style.display = "none";
        
        // Tukar butang kepada "Log Keluar" (Warna Merah)
        let btn = document.getElementById("butangAuth");
        if (btn) {
            btn.innerHTML = "⏻ Log Keluar";
            btn.style.background = "#dc3545"; // Warna merah
            btn.style.borderColor = "#dc3545";
            btn.setAttribute("onclick", "logKeluar()");
        }
    } else {
        // Jika salah, tunjukkan amaran warna merah
        ralatMesej.style.display = "block";
    }
}

// Boleh tekan 'Enter' di keyboard untuk terus login (Tak perlu klik butang)
document.addEventListener("DOMContentLoaded", function() {
    let kotakPassword = document.getElementById("loginPassword");
    if (kotakPassword) {
        kotakPassword.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                semakLogin();
            }
        });
    }
});

// 3. Fungsi Log Keluar
function logKeluar() {
    // Tukar butang kembali kepada "Log Masuk" (Warna Biru dan Ikon Power)
    let btn = document.getElementById("butangAuth");
    if (btn) {
        btn.innerHTML = "⏻ Log Masuk";
        btn.style.background = "#1f4e79"; // Warna biru
        btn.style.borderColor = "#1f4e79";
        btn.setAttribute("onclick", "paparLogMasuk()");
    }
    
    // Pilihan: Beri amaran pop-up kecil kepada user
    alert("Anda telah berjaya log keluar dari sistem.");
}
// =====================================================
// 10. FUNGSI RESET SEMUA (KOSONGKAN KESELURUHAN)
// =====================================================
function resetSemua() {
    // Berikan amaran pengesahan supaya tidak tertekan secara tak sengaja
    let sah = confirm("Adakah anda pasti mahu memadam KESEMUA data pengiraan? Tindakan ini tidak boleh diundur.");
    
    if (sah) {
        // Panggil semua fungsi reset yang sedia ada tanpa mengganggu sistem
        resetORP();
        resetBakiUpah();
        resetOTBiasa();
        resetHariRehat();
        resetHariRehatLebih();
        resetSeksyen18A();
        resetOTRH();
        resetPH();
        resetOTPH();
        resetKelayakanCuti();
        resetCutiTahunan();
        resetKelayakanCutiSakit();
        resetCutiSakit();
        resetGGNUnified();
        resetTBB();
        resetRumusan();
        
        // Bawa paparan pengguna kembali ke paling atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
// =====================================================
// 11. SISTEM AUTO-TAMBAH RUMUSAN (SMART EXTRACT)
// =====================================================

// Tambah 'Baki Upah' ke dalam senarai dropdown secara automatik (Jika belum wujud)
let semakBaki = senaraiKalkulatorRumusan.find(item => item.nilai === "orpBakiAmount");
if (!semakBaki) {
    senaraiKalkulatorRumusan.push({ nilai: "orpBakiAmount", teks: "Baki Upah / Gaji (ORP)" });
}

// Pemerhati (Listener) untuk mengesan setiap butang yang ditekan dalam sistem
document.addEventListener('click', function(event) {
    let btn = event.target.closest('button');
    if (!btn) return;

    let fungsiKira = btn.getAttribute('onclick');
    if (!fungsiKira) return;

    let idSasaran = "";

    // Kenal pasti butang "Kira" mana yang ditekan dan padankan dengan ID Rumusan
    if (fungsiKira.includes("calculateOTBiasa()")) idSasaran = "otAmount";
    else if (fungsiKira.includes("calculateHariRehat()")) idSasaran = "rhAmount";
    else if (fungsiKira.includes("calculateHariRehatLebih()")) idSasaran = "rhMoreAmount";
    else if (fungsiKira.includes("calculate18ANew()")) idSasaran = "amount18A";
    else if (fungsiKira.includes("calculateOTRH()")) idSasaran = "otRHAmount";
    else if (fungsiKira.includes("calculatePH()")) idSasaran = "phAmount";
    else if (fungsiKira.includes("calculateOTPH()")) idSasaran = "otPHAmount";
    else if (fungsiKira.includes("calculateCutiTahunan()")) idSasaran = "annualLeaveAmount";
    else if (fungsiKira.includes("calculateCutiSakit()")) idSasaran = "sickLeaveAmount";
    else if (fungsiKira.includes("calculateTBB()")) idSasaran = "tbbAmount";
    else if (fungsiKira.includes("calculateBakiUpah()")) idSasaran = "orpBakiAmount";
    else if (fungsiKira.includes("calculateGGNUnified()")) {
        let mode = document.getElementById("ggnUniType").value;
        if (mode === "bulan") idSasaran = "resUniMonthAmount";
        else if (mode === "minggu" || mode === "hari") idSasaran = "resUni18AAmount";
    }

    if (idSasaran !== "") {
        // Tunggu 200ms untuk biarkan fungsi pengiraan asal anda selesai bertugas dahulu
        setTimeout(() => {
            let valid = false;
            let elemenSasaran = document.getElementById(idSasaran);
            
            // Semak adakah hasil pengiraan sah (melebihi RM 0 atau berisi)
            if (idSasaran === "orpBakiAmount") {
                let patut = document.getElementById("orpPatutTerima");
                if (patut && patut.value && patut.value.trim() !== "") valid = true;
            } else if (elemenSasaran) {
                let nilaiDuit = unformatRMRumusan(elemenSasaran.innerText);
                if (nilaiDuit > 0) valid = true;
            }

            // Jika sah dan ada keputusan, tolak masuk ke jadual Rumusan
            if (valid) {
                autoMasukRumusan(idSasaran);
            }
        }, 200);
    }
});

function autoMasukRumusan(idSasaran) {
    const jadual = document.getElementById('badanJadualRumusan');
    const senaraiSelect = jadual.querySelectorAll('select');
    let barisWujud = null;
    
    // 1. Semak kalau jenis bayaran ini dah ada dalam jadual (Elak duplicate row)
    senaraiSelect.forEach(select => {
        if (select.value === idSasaran) barisWujud = select;
    });

    // 2. Jika dah wujud, kita cuma update nilai dia (Refresh)
    if (barisWujud) {
        kemaskiniPatutBayar(barisWujud);
    } 
    // 3. Jika belum wujud, kita bina baris baharu!
    else {
        tambahBarisRumusan(); // Panggil fungsi manual sedia ada
        
        // Cari kotak select dropdown di baris yang paling terbaharu ditambah
        let semuaSelectBaru = jadual.querySelectorAll('select');
        let selectTerbaru = semuaSelectBaru[semuaSelectBaru.length - 1];
        
        // Pilih jenis bayaran secara automatik
        selectTerbaru.value = idSasaran;
        
        // Trigger / paksa pengiraan rumusan berlaku
        kemaskiniPatutBayar(selectTerbaru);
    }
}
// =====================================================
// ENGINE 2026: MULTI-INSTANCE & CONTEXT SWITCHER
// Amaran: Modul ini ditambah tanpa merosakkan fungsi asal
// =====================================================

// 1. Gantikan fungsi getElement() asal supaya ia faham "Kad mana yang sedang aktif?"
let activeCardContext = null;
const originalGetElement = getElement;

window.getElement = function(id) {
    // Jika sistem sedang mengira di dalam satu kad klon tertentu
    if (activeCardContext) {
        // Cari ID yang telah diubah suai atau ID asal yang diikat dalam 'data-original-id'
        let el = activeCardContext.querySelector(`[data-original-id="${id}"]`);
        if (el) return el;
    }
    // Jatuh semula ke fungsi asal
    return originalGetElement(id);
};

// 2. Override addEventListener untuk auto-update RM supaya sokong clone
document.addEventListener("input", function(event) {
    // Override 'id' value untuk event dari kad yang diklon
    let originalId = event.target.getAttribute('data-original-id');
    let idToUse = originalId ? originalId : event.target.id;
    
    // Set konteks kepada kad tempat event ini berlaku supaya fungsi kiraan RM tahu cari elemen mana
    activeCardContext = event.target.closest('.calculator-card');
    
    // Jalankan logik salaryMap yang sedia ada di atas
    if (idToUse === "orpBasicSalary" || idToUse === "orpAllowance") {
        Object.keys(salaryMap).forEach(function(key) {
            if (key !== "orpBasicSalary") {
                let basicID = key; let allowanceID = salaryMap[key][0]; let totalID = salaryMap[key][1];
                if (idToUse === "orpBasicSalary") {
                    let el = getElement(basicID);
                    if(el) el.value = formatAutoSyncRM(event.target.value); 
                }
                if (idToUse === "orpAllowance") {
                    let el = getElement(allowanceID);
                    if(el) el.value = formatAutoSyncRM(event.target.value);
                }
                updateSalaryTotal(basicID, allowanceID, totalID);
            }
        });
    }
    
    Object.keys(salaryMap).forEach(function(key) {
        let data = salaryMap[key];
        if (idToUse === key || idToUse === data[0]) updateSalaryTotal(key, data[0], data[1]);
    });
    
    // Clear context lepas selesai
    activeCardContext = null;
});

// 3. Fungsi Tambah Kalkulator (SideBar Click)
window.tambahKalkulator = function(templateId) {
    // Highlight butang sidebar
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    let templateCard = document.getElementById('card-' + templateId);
    if (!templateCard) return alert('Kalkulator tidak ditemui!');

    let grid = document.getElementById('active-calculators-grid');
    let rumusanCard = document.querySelector('.rumusan-card');
    
    // Klon kad (Deep Clone)
    let clone = templateCard.cloneNode(true);
    clone.classList.remove('hidden-template');
    
    // Hasilkan ID unik rawak untuk clone ini
    let uniqueSuffix = '_' + Math.random().toString(36).substr(2, 9);
    clone.id = clone.id + uniqueSuffix;
    clone.style.position = "relative"; // Untuk butang tutup

    // Tambah butang Pangkah (Tutup)
    let closeBtn = document.createElement('button');
    closeBtn.className = "close-card-btn";
    closeBtn.innerHTML = "X";
    closeBtn.onclick = function() { clone.remove(); };
    clone.appendChild(closeBtn);

    // Tukar ID elemen di dalam clone supaya tidak clash, tapi simpan rekod 'data-original-id'
    let allElementsWithId = clone.querySelectorAll('[id]');
    allElementsWithId.forEach(el => {
        el.setAttribute('data-original-id', el.id);
        el.id = el.id + uniqueSuffix;
        
        // Bersihkan data jika ini adalah kad kedua (Klon) supaya kosong
        if(el.tagName === 'INPUT' && el.type !== 'button') el.value = "";
        if(el.tagName === 'STRONG' || el.tagName === 'SPAN') {
            if(el.innerText.includes('RM')) el.innerText = 'RM 0.00';
            else if(el.innerText !== 'Kadar Sehari' && el.innerText !== 'Bayaran' && el.innerText !== 'Hari Bekerja') el.innerText = '-';
        }
    });

    // Menipu onClick attribute pada butang supaya ia set konteks terlebih dahulu
    let allButtons = clone.querySelectorAll('button');
    allButtons.forEach(btn => {
        let oriClick = btn.getAttribute('onclick');
        if (oriClick && !oriClick.includes('clone.remove')) {
            // Wrapper function yang set activeCardContext sebelum jalankan function asal
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function(e) {
                activeCardContext = clone;
                eval(oriClick); // Run fungsi asal (cth: calculateOTBiasa())
                activeCardContext = null;
            });
        }
    });

    // Letakkan kad baharu sebelum kad Rumusan
    if (rumusanCard) {
        grid.insertBefore(clone, rumusanCard);
    } else {
        grid.appendChild(clone);
    }

    // Scroll ke kalkulator yang baru ditambah
    clone.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
