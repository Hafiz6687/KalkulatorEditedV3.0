// =====================================================
// KALKULATOR AKTA KERJA 1955
// SCRIPT.JS - MASTER KARYA AGUNG (FINAL BULLETPROOF - UPGRADED)
// =====================================================

// =====================================================
// 1. HELPER & GET-ELEMENT ADAPTER (SELAMAT & ISOLATED)
// =====================================================
let activeCardContext = null;
const originalGetElement = document.getElementById.bind(document);

// UPGRADE: Global Context Manager (Capture Phase)
['click', 'input', 'change', 'focusin'].forEach(eventType => {
    document.addEventListener(eventType, function(e) {
        if (e && e.target && typeof e.target.closest === 'function') {
            let card = e.target.closest('.calculator-card');
            if (card) { activeCardContext = card; }
        }
    }, true);
});

function setContext(e) {
    if (e && e.target && typeof e.target.closest === 'function') {
        let card = e.target.closest('.calculator-card');
        if (card) activeCardContext = card;
    }
}

window.getElement = function(id) {
    if (activeCardContext) {
        let el = activeCardContext.querySelector(`[data-original-id="${id}"], [id="${id}"]`);
        if (el) return el;
    }
    return originalGetElement(id);
};

function setText(id, value) { let el = getElement(id); if (el) el.innerHTML = value; }
function setValue(id, value) { let el = getElement(id); if (el) el.value = value; }
function formatRM(value) { value = Number(value) || 0; return "RM " + value.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function toggleResult(prefix, showData) {
    let pending = getElement(prefix + "Pending");
    let data = getElement(prefix + "Data");
    if (pending && data) {
        pending.style.display = showData ? "none" : "block";
        data.style.display = showData ? "block" : "none";
    }
}

function getLocalStartOfDay(dateStr) {
    if (!dateStr) return new Date();
    let parts = dateStr.split('-');
    if (parts.length === 3) { return new Date(parts[0], parts[1] - 1, parts[2]); }
    return new Date(dateStr); 
}

// =====================================================
// 2. ENJIN INPUT, FORMAT RM & MATEMATIK
// =====================================================
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
    "tbbBasicSalary": ["tbbAllowance", "tbbTotalSalary"],
    "lewatBasicSalary": ["lewatAllowance", "lewatTotalSalary"]
};

function evaluateSmartMath(inputStr) {
    if (!inputStr) return 0;
    let cleanStr = inputStr.toString().toLowerCase().replace(/rm/g, '').replace(/bulan/g, '').replace(/x/g, '*').replace(/\[/g, '(').replace(/\]/g, ')').replace(/[^\d\.\+\-\*\/\(\)]/g, ''); 
    if (cleanStr === "") return 0; 
    try { return new Function('return ' + cleanStr)() || 0; } catch (e) { return 0; }
}

function getInputNumber(id) {
    let el = getElement(id); return el ? evaluateSmartMath(el.value) : 0;
}

function formatSafeRM(val) {
    let num = evaluateSmartMath(val);
    if (num === 0 && !val.toString().includes("0")) return "";
    return "RM " + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateSalaryTotal(basicID, allowanceID, totalID) {
    let basic = getInputNumber(basicID); let allowance = getInputNumber(allowanceID);
    let total = basic + allowance; let tEl = getElement(totalID);
    if(tEl) tEl.value = "RM " + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); 
    return total;
}

document.addEventListener("DOMContentLoaded", function() {
    let semuaInput = document.querySelectorAll('input');
    semuaInput.forEach(input => { if (input.type === "number") input.setAttribute("type", "text"); });
});

document.addEventListener("focusin", function(e) {
    if (e.target.tagName !== "INPUT" || e.target.type === "date") return;
    let label = e.target.parentElement.querySelector("label");
    let isCurrency = e.target.classList.contains("salary-input") || e.target.classList.contains("salary-total") || (label && label.innerText.includes("(RM)"));
    if (isCurrency && (e.target.value.includes("RM") || e.target.value.includes(","))) {
        let oldVal = e.target.value; let cleanVal = evaluateSmartMath(oldVal);
        let newVal = cleanVal === 0 && !oldVal.includes("0") ? "" : cleanVal;
        if (newVal.toString() !== oldVal.toString()) {
            e.target.value = newVal; e.target.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
});

document.addEventListener("focusout", function(e) {
    if (e.target.tagName !== "INPUT" || e.target.type === "date") return;
    let label = e.target.parentElement.querySelector("label");
    let isCurrency = e.target.classList.contains("salary-input") || e.target.classList.contains("salary-total") || (label && label.innerText.includes("(RM)"));
    if (isCurrency && e.target.value.trim() !== "") {
        let oldVal = e.target.value; let newVal = formatSafeRM(oldVal);
        if (newVal !== oldVal) { e.target.value = newVal; e.target.dispatchEvent(new Event('input', { bubbles: true })); }
    }
});

document.addEventListener("change", function(e) {
    if (e.target.tagName !== "INPUT") return;
    let isMathInput = e.target.classList.contains("salary-input") || e.target.classList.contains("number-input") || e.target.classList.contains("tbb-monthly-input");
    if (!isMathInput) return;
    try {
        let nilai = e.target.value.trim();
        if (/^\d{1,4}-\d{1,2}-\d{1,4}$/.test(nilai) || /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(nilai)) return;
        if (/[+\-*/()]/.test(nilai) && !nilai.includes("RM")) {
            let hasil = evaluateSmartMath(nilai);
            if (hasil !== undefined && !isNaN(hasil)) { e.target.value = hasil; e.target.dispatchEvent(new Event('input', { bubbles: true })); }
        }
    } catch (err) {}
});

document.addEventListener("input", function(e) {
    if (e.target.tagName !== "INPUT") return;
    let originalId = e.target.getAttribute('data-original-id') || e.target.id;
    activeCardContext = e.target.closest('.calculator-card');
    try {
        if (originalId === "orpBasicSalary" || originalId === "orpAllowance") {
            let rawValue = e.target.value; 
            let tempContext = activeCardContext;
            activeCardContext = null; 
            Object.keys(salaryMap).forEach(key => {
                let bID = key, aID = salaryMap[key][0], tID = salaryMap[key][1];
                let sasaranB = document.querySelectorAll(`[id="${bID}"], [data-original-id="${bID}"]`);
                let sasaranA = document.querySelectorAll(`[id="${aID}"], [data-original-id="${aID}"]`);
                if (originalId === "orpBasicSalary") sasaranB.forEach(el => { if (el !== e.target) el.value = rawValue; });
                if (originalId === "orpAllowance") sasaranA.forEach(el => { if (el !== e.target) el.value = rawValue; });
                sasaranB.forEach(bEl => {
                    let kad = bEl.closest('.calculator-card');
                    if (kad) {
                        let aEl = kad.querySelector(`[id="${aID}"], [data-original-id="${aID}"]`);
                        let tEl = kad.querySelector(`[id="${tID}"], [data-original-id="${tID}"]`);
                        let basicVal = evaluateSmartMath(bEl.value); let allowVal = aEl ? evaluateSmartMath(aEl.value) : 0;
                        if (tEl) tEl.value = "RM " + (basicVal + allowVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    }
                });
            });
            activeCardContext = tempContext; 
        }
        Object.keys(salaryMap).forEach(key => {
            let data = salaryMap[key]; if (originalId === key || originalId === data[0]) updateSalaryTotal(key, data[0], data[1]);
        });
    } finally { activeCardContext = null; }
});
// =====================================================
// 3. KALKULATOR TERAS (FORMULA ASAL DIKEKALKAN)
// =====================================================
function getORP(customDivisor = null) { 
    let divisor = customDivisor || 26;
    let totalSalary = updateSalaryTotal("orpBasicSalary", "orpAllowance", "orpTotalSalary");
    if(totalSalary === 0) {
        let orpTotalEl = document.querySelector('[data-original-id="orpTotalSalary"]');
        if(orpTotalEl) totalSalary = evaluateSmartMath(orpTotalEl.value);
    }
    return totalSalary / divisor; 
}

function calculateORP(e, customDivisor = null) {
    setContext(e); let totalSalary = updateSalaryTotal("orpBasicSalary", "orpAllowance", "orpTotalSalary"); 
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor;
    setText("orpResultTotal", formatRM(totalSalary)); setText("orpResult", formatRM(ORP)); toggleResult("orp", true);
}
function resetORP() {
    ["orpBasicSalary", "orpAllowance"].forEach(id => setValue(id, "")); setValue("orpTotalSalary", "RM 0.00");
    ["orpResultTotal", "orpResult"].forEach(id => setText(id, "RM 0.00")); toggleResult("orp", false);
}

function calculateBakiUpah(e) {
    setContext(e); let patutTerima = getInputNumber("orpPatutTerima"); let telahTerima = getInputNumber("orpTelahTerima");
    if (patutTerima === 0) return; 
    let baki = telahTerima - patutTerima; let bakiEl = getElement("orpBakiAmount");
    if(bakiEl) {
        if (baki < 0) { bakiEl.innerText = "-" + formatRM(Math.abs(baki)); bakiEl.style.color = "#d9534f"; } 
        else if (baki > 0) { bakiEl.innerText = "+" + formatRM(baki); bakiEl.style.color = "#28a745"; } 
        else { bakiEl.innerText = formatRM(0); bakiEl.style.color = "#1f4e79"; }
    }
    toggleResult("baki", true); autoMasukRumusan('orpBakiAmount', activeCardContext);
}
function resetBakiUpah() {
    ["orpPatutTerima", "orpTelahTerima"].forEach(id => setValue(id, "")); 
    let el = getElement("orpBakiAmount"); if(el) { el.innerText = "RM 0.00"; el.style.color = ""; } toggleResult("baki", false);
}

function calculateOTBiasa(e, customDivisor = null) {
    setContext(e); let totalSalary = updateSalaryTotal("otBasicSalary", "otAllowance", "otTotalSalary");
    let hours = Number(getElement("otHours").value); let workingHours = Number(getElement("normalWorkingHours").value);
    if (!workingHours) { alert("Sila pilih jam kerja normal sehari."); return; }
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor; 
    let hourly = (ORP / workingHours) * 1.5; let amount = hourly * hours;
    setText("otResultTotal", formatRM(totalSalary)); setText("otORP", formatRM(ORP));
    setText("otHourly", formatRM(hourly)); setText("otAmount", formatRM(amount)); toggleResult("ot", true); autoMasukRumusan('otAmount', activeCardContext);
}
function resetOTBiasa() {
    ["otBasicSalary", "otAllowance", "otHours"].forEach(id => setValue(id, "")); setValue("otTotalSalary", "RM 0.00"); setValue("normalWorkingHours", "");
    ["otResultTotal", "otORP", "otHourly", "otAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("ot", false);
}

function calculateLewat(e, customDivisor = null) {
    if(e && e.target) setContext(e); else if(e && e.closest) activeCardContext = e.closest('.calculator-card');
    let totalSalary = updateSalaryTotal("lewatBasicSalary", "lewatAllowance", "lewatTotalSalary");
    let minutes = Number(getElement("lewatMinit").value); let workingHours = Number(getElement("lewatNormalWorkingHours").value);
    if (!workingHours) { alert("Sila pilih jam kerja normal sehari."); return; }
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor; 
    let hourly = ORP / workingHours; let minutely = hourly / 60; let amount = minutely * minutes;
    setText("lewatResultTotal", formatRM(totalSalary)); setText("lewatORP", formatRM(ORP));
    setText("lewatMinutely", formatRM(minutely)); setText("lewatAmount", formatRM(amount)); toggleResult("lewat", true); autoMasukRumusan('lewatAmount', activeCardContext);
}
function resetLewat(e) {
    if(e && e.target) setContext(e); else if(e && e.closest) activeCardContext = e.closest('.calculator-card');
    ["lewatBasicSalary", "lewatAllowance", "lewatMinit"].forEach(id => setValue(id, "")); setValue("lewatTotalSalary", "RM 0.00"); setValue("lewatNormalWorkingHours", "");
    ["lewatResultTotal", "lewatORP", "lewatMinutely", "lewatAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("lewat", false);
}

function calculateOTRH(e, customDivisor = null) {
    setContext(e); let totalSalary = updateSalaryTotal("otRHBasicSalary", "otRHAllowance", "otRHTotalSalary");
    let hours = Number(getElement("otRHHours").value); let workingHours = Number(getElement("otRHNormalWorkingHours").value);
    if (!workingHours) { alert("Sila pilih jam kerja normal sehari."); return; }
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor; 
    let hourly = (ORP / workingHours) * 2.0; let amount = hourly * hours;
    setText("otRHResultTotal", formatRM(totalSalary)); setText("otRHORP", formatRM(ORP));
    setText("otRHHourly", formatRM(hourly)); setText("otRHAmount", formatRM(amount)); toggleResult("otRH", true); autoMasukRumusan('otRHAmount', activeCardContext);
}
function resetOTRH() {
    ["otRHBasicSalary", "otRHAllowance", "otRHHours"].forEach(id => setValue(id, "")); setValue("otRHTotalSalary", "RM 0.00"); setValue("otRHNormalWorkingHours", "");
    ["otRHResultTotal", "otRHORP", "otRHHourly", "otRHAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("otRH", false);
}

function calculateOTPH(e, customDivisor = null) {
    setContext(e); let totalSalary = updateSalaryTotal("otPHBasicSalary", "otPHAllowance", "otPHTotalSalary");
    let hours = Number(getElement("otPHHours").value); let workingHours = Number(getElement("otPHWorkingHours").value);
    if (!workingHours) { alert("Sila pilih jam kerja normal sehari."); return; }
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor; 
    let hourly = (ORP / workingHours) * 3.0; let amount = hourly * hours;
    setText("otPHResultTotal", formatRM(totalSalary)); setText("otPHORP", formatRM(ORP));
    setText("otPHHourly", formatRM(hourly)); setText("otPHAmount", formatRM(amount)); toggleResult("otPH", true); autoMasukRumusan('otPHAmount', activeCardContext);
}
function resetOTPH() {
    ["otPHBasicSalary", "otPHAllowance", "otPHHours"].forEach(id => setValue(id, "")); setValue("otPHTotalSalary", "RM 0.00"); setValue("otPHWorkingHours", "");
    ["otPHResultTotal", "otPHORP", "otPHHourly", "otPHAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("otPH", false);
}

function calculateHariRehat(e, customDivisor = null) {
    setContext(e); let totalSalary = updateSalaryTotal("rhBasicSalary", "rhAllowance", "rhTotalSalary");
    let days = Number(getElement("rhDays").value); 
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor; 
    let daily = ORP * 0.5; let amount = daily * days;
    setText("rhResultTotal", formatRM(totalSalary)); setText("rhORP", formatRM(ORP));
    setText("rhDaily", formatRM(daily)); setText("rhAmount", formatRM(amount)); toggleResult("rh", true); autoMasukRumusan('rhAmount', activeCardContext);
}
function resetHariRehat() {
    ["rhBasicSalary", "rhAllowance", "rhDays"].forEach(id => setValue(id, "")); setValue("rhTotalSalary", "RM 0.00");
    ["rhResultTotal", "rhORP", "rhDaily", "rhAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("rh", false);
}

function calculateHariRehatLebih(e, customDivisor = null) {
    setContext(e); let totalSalary = updateSalaryTotal("rhMoreBasicSalary", "rhMoreAllowance", "rhMoreTotalSalary");
    let days = Number(getElement("rhMoreDays").value); 
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor; 
    let daily = ORP; let amount = daily * days;
    setText("rhMoreResultTotal", formatRM(totalSalary)); setText("rhMoreORP", formatRM(ORP));
    setText("rhMoreDaily", formatRM(daily)); setText("rhMoreAmount", formatRM(amount)); toggleResult("rhMore", true); autoMasukRumusan('rhMoreAmount', activeCardContext);
}
function resetHariRehatLebih() {
    ["rhMoreBasicSalary", "rhMoreAllowance", "rhMoreDays"].forEach(id => setValue(id, "")); setValue("rhMoreTotalSalary", "RM 0.00");
    ["rhMoreResultTotal", "rhMoreORP", "rhMoreDaily", "rhMoreAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("rhMore", false);
}

function calculatePH(e, customDivisor = null) {
    setContext(e); let totalSalary = updateSalaryTotal("phBasicSalary", "phAllowance", "phTotalSalary");
    let days = Number(getElement("phDays").value); 
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor; 
    let daily = ORP * 2; let amount = daily * days;
    setText("phResultTotal", formatRM(totalSalary)); setText("phORP", formatRM(ORP));
    setText("phDaily", formatRM(daily)); setText("phAmount", formatRM(amount)); toggleResult("ph", true); autoMasukRumusan('phAmount', activeCardContext);
}
function resetPH() {
    ["phBasicSalary", "phAllowance", "phDays"].forEach(id => setValue(id, "")); setValue("phTotalSalary", "RM 0.00");
    ["phResultTotal", "phORP", "phDaily", "phAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("ph", false);
}

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getMonthlyBreakdown(salary, startDate, endDate) {
    let result = []; let current = new Date(startDate);
    while (current <= endDate) {
        let year = current.getFullYear(); let month = current.getMonth();
        let daysInMonth = getDaysInMonth(year, month); let firstDay = current.getDate(); let lastDay = daysInMonth;
        if (year === endDate.getFullYear() && month === endDate.getMonth()) lastDay = endDate.getDate();
        let days = lastDay - firstDay + 1; let dailyRate = salary / daysInMonth; let amount = dailyRate * days;
        result.push({ year: year, month: month, daysInMonth: daysInMonth, days: days, dailyRate: dailyRate, amount: amount });
        current = new Date(year, month + 1, 1);
    }
    return result;
}

function calculate18ANew(e) {
    setContext(e); let totalSalary = updateSalaryTotal("section18ABasicSalary", "section18AAllowance", "section18ATotalSalary");
    let startDate = getElement("section18AStartDate").value; let endDate = getElement("section18AEndDate").value;
    if (!startDate || !endDate) { alert("Sila masukkan tarikh mula dan tarikh akhir."); return; }
    let start = getLocalStartOfDay(startDate); let end = getLocalStartOfDay(endDate);
    if (end < start) { alert("Tarikh akhir tidak boleh lebih awal daripada tarikh mula."); return; }
    let breakdown = getMonthlyBreakdown(totalSalary, start, end); let totalAmount = 0; breakdown.forEach(item => { totalAmount += item.amount; });
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
    setText("amount18A", formatRM(totalAmount)); toggleResult("sec18A", true); autoMasukRumusan('amount18A', activeCardContext);
}
function resetSeksyen18A() {
    ["section18ABasicSalary", "section18AAllowance", "section18AStartDate", "section18AEndDate"].forEach(id => setValue(id, ""));
    setValue("section18ATotalSalary", "RM 0.00"); ["resultTotalSalary", "month1Daily", "month2Daily", "month1Amount", "month2Amount", "amount18A"].forEach(id => setText(id, "RM 0.00"));
    ["month1Title", "month2Title", "month1Days", "month2Days"].forEach(id => setText(id, "-")); toggleResult("sec18A", false);
}

function calculateCutiTahunan(e, customDivisor = null) {
    setContext(e); let ORP = getORP(customDivisor); let days = Number(getElement("annualLeaveDays").value); let amount = ORP * days;
    setText("annualLeaveORP", formatRM(ORP)); setText("annualLeaveAmount", formatRM(amount)); toggleResult("annualLeave", true); autoMasukRumusan('annualLeaveAmount', activeCardContext);
}
function resetCutiTahunan() {
    setValue("cutiLayak", ""); setValue("cutiGuna", ""); setValue("annualLeaveDays", "");
    setText("annualLeaveORP", "RM 0.00"); setText("annualLeaveAmount", "RM 0.00"); toggleResult("annualLeave", false);
}
function autoKiraBakiCuti() {
    const layakInput = getElement('cutiLayak').value; const gunaInput = getElement('cutiGuna').value;
    if (layakInput === "" && gunaInput === "") { getElement('annualLeaveDays').value = ""; return; }
    let baki = (parseFloat(layakInput) || 0) - (parseFloat(gunaInput) || 0);
    getElement('annualLeaveDays').value = baki < 0 ? 0 : baki;
}

function calculateCutiSakit(e, customDivisor = null) {
    setContext(e); let ORP = getORP(customDivisor); let days = Number(getElement("sickLeaveDays").value); let amount = ORP * days;
    setText("sickLeaveORP", formatRM(ORP)); setText("sickLeaveAmount", formatRM(amount)); toggleResult("sickLeave", true); autoMasukRumusan('sickLeaveAmount', activeCardContext);
}
function resetCutiSakit() {
    setValue("sickLeaveDays", ""); setText("sickLeaveORP", "RM 0.00"); setText("sickLeaveAmount", "RM 0.00"); toggleResult("sickLeave", false);
}

function calculateKelayakanCuti(e) {
    setContext(e); const startVal = getElement('kelayakanCutiMula').value; const endVal = getElement('kelayakanCutiAkhir').value;
    if (!startVal || !endVal) { alert("Sila masukkan Tarikh Mula Kerja dan Tarikh Kiraan / Akhir."); return; }
    const startDate = getLocalStartOfDay(startVal); const endDate = getLocalStartOfDay(endVal);
    if (endDate < startDate) { alert("Tarikh Kiraan tidak boleh lebih awal daripada Tarikh Mula Kerja."); return; }
    let totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 - startDate.getMonth() + endDate.getMonth();
    if (endDate.getDate() < startDate.getDate()) totalMonths--; if (totalMonths < 0) totalMonths = 0;
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

function calculateKelayakanCutiSakit(e) {
    setContext(e); const startVal = getElement('kelayakanCutiSakitMula').value; const endVal = getElement('kelayakanCutiSakitAkhir').value;
    if (!startVal || !endVal) { alert("Sila masukkan Tarikh Mula Kerja dan Tarikh Kiraan / Akhir."); return; }
    const startDate = getLocalStartOfDay(startVal); const endDate = getLocalStartOfDay(endVal);
    if (endDate < startDate) { alert("Tarikh Kiraan tidak boleh lebih awal."); return; }
    let totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 - startDate.getMonth() + endDate.getMonth();
    if (endDate.getDate() < startDate.getDate()) totalMonths--; if (totalMonths < 0) totalMonths = 0;
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

function toggleNotisStatus() {
    let statusEl = getElement("ggnStatusNotis"); if (!statusEl) return; let status = statusEl.value;
    let elsStart = ["ggnUniWeekStart", "ggnUniDayStart"], elsEnd = ["ggnUniWeekEnd", "ggnUniDayEnd"];
    elsStart.forEach(id => {
        let el = getElement(id);
        if (el && el.parentElement) { let lbl = el.parentElement.querySelector("label"); if (lbl) lbl.innerText = (status === "tiada") ? "Tarikh Penamatan (Serta-merta)" : "Tarikh Mula Notis"; }
    });
    elsEnd.forEach(id => { let el = getElement(id); if (el && el.parentElement) el.parentElement.style.display = (status === "tiada") ? "none" : "block"; });
}
function toggleGGNMode() {
    let mode = getElement("ggnUniType").value;
    getElement("ggnGroupBulan").style.display = "none"; getElement("ggnGroupMinggu").style.display = "none"; getElement("ggnGroupHari").style.display = "none";
    let statusGroup = getElement("ggnStatusGroup"); if (statusGroup) statusGroup.style.display = (mode === "minggu" || mode === "hari") ? "block" : "none";
    if (mode === "bulan") getElement("ggnGroupBulan").style.display = "block";
    else if (mode === "minggu") { getElement("ggnGroupMinggu").style.display = "block"; toggleNotisStatus(); } 
    else if (mode === "hari") { getElement("ggnGroupHari").style.display = "block"; toggleNotisStatus(); }
    getElement("ggnResBulan").style.display = "none"; getElement("ggnRes18A").style.display = "none"; getElement("ggnResPending").style.display = "block";
}

function formatDateInput(date) {
    let year = date.getFullYear(); let month = String(date.getMonth() + 1).padStart(2, "0"); let day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
}

function autoGGNEndDate(type) {
    let startId = type === 'minggu' ? 'ggnUniWeekStart' : 'ggnUniDayStart';
    let valId = type === 'minggu' ? 'ggnUniWeekVal' : 'ggnUniDayVal';
    let endId = type === 'minggu' ? 'ggnUniWeekEnd' : 'ggnUniDayEnd';
    let start = getElement(startId); let val = getElement(valId); let end = getElement(endId);
    if (!start || !val || !end) return;
    let multiplier = type === 'minggu' ? 7 : 1; let daysToAdd = Number(val.value) * multiplier;
    if (!start.value || daysToAdd <= 0) { end.value = ""; return; }
    let date = getLocalStartOfDay(start.value); date.setDate(date.getDate() + daysToAdd - 1); end.value = formatDateInput(date);
}

function calculateGGNUnified(e) {
    setContext(e); let mode = getElement("ggnUniType").value; if (!mode) { alert("Sila pilih Jenis Notis terlebih dahulu."); return; }
    let totalSalary = updateSalaryTotal("ggnUniBasic", "ggnUniAllowance", "ggnUniTotal"); let statusNotisEl = getElement("ggnStatusNotis"); let isTanpaNotis = statusNotisEl && statusNotisEl.value === "tiada";
    
    let bakiGaji = getInputNumber("ggnBakiGaji") || 0;

    if (mode === "bulan") {
        let months = Number(getElement("ggnUniMonthVal").value);
        if (months <= 0) { alert("Sila masukkan bilangan bulan notis."); return; }
        let amount = (totalSalary * months) - bakiGaji;
        
        setText("resUniMonthCount", months + " Bulan"); setText("resUniMonthAmount", formatRM(amount));
        getElement("ggnResPending").style.display = "none"; getElement("ggnRes18A").style.display = "none"; getElement("ggnResBulan").style.display = "block";
        autoMasukRumusan('resUniMonthAmount', activeCardContext);
    } else {
        let valId = mode === 'minggu' ? 'ggnUniWeekVal' : 'ggnUniDayVal'; let startId = mode === 'minggu' ? 'ggnUniWeekStart' : 'ggnUniDayStart'; let endId = mode === 'minggu' ? 'ggnUniWeekEnd' : 'ggnUniDayEnd';
        let val = Number(getElement(valId).value); let startDate = getElement(startId).value;
        if (val <= 0 || !startDate) { let msg = isTanpaNotis ? "Tarikh Penamatan" : "Tarikh Mula Notis"; alert(`Sila masukkan bilangan ${mode} dan ${msg}.`); return; }
        let multiplier = mode === 'minggu' ? 7 : 1; let totalDays = val * multiplier;
        let start = getLocalStartOfDay(startDate); let end = new Date(start); end.setDate(end.getDate() + totalDays - 1);
        let breakdown = getMonthlyBreakdown(totalSalary, start, end); let totalAmount = 0; breakdown.forEach(item => { totalAmount += item.amount; });
        
        totalAmount = totalAmount - bakiGaji;

        setValue(endId, formatDateInput(end)); setText("resUni18ATotal", formatRM(totalSalary)); setText("resUni18AEnd", `${end.getDate()}-${end.getMonth() + 1}-${end.getFullYear()}`);
        let endResultEl = getElement("resUni18AEnd"); if(endResultEl && endResultEl.parentElement) { let lbl = endResultEl.parentElement.querySelector("span"); if(lbl) lbl.innerText = isTanpaNotis ? "Tamat Tempoh Indemniti" : "Tarikh Akhir Notis"; }
        if (breakdown.length > 0) { let f = breakdown[0]; let fD = new Date(f.year, f.month, 1); setText("resUniM1Title", fD.toLocaleString("ms-MY", {month:"long", year:"numeric"})); setText("resUniM1Days", f.days + " Hari"); setText("resUniM1Daily", formatRM(f.dailyRate)); setText("resUniM1Amount", formatRM(f.amount)); }
        if (breakdown.length > 1) { let s = breakdown[1]; let sD = new Date(s.year, s.month, 1); setText("resUniM2Title", sD.toLocaleString("ms-MY", {month:"long", year:"numeric"})); setText("resUniM2Days", s.days + " Hari"); setText("resUniM2Daily", formatRM(s.dailyRate)); setText("resUniM2Amount", formatRM(s.amount)); } 
        else { setText("resUniM2Title", "-"); setText("resUniM2Days", "-"); setText("resUniM2Daily", "-"); setText("resUniM2Amount", "-"); }
        setText("resUni18AAmount", formatRM(totalAmount)); getElement("ggnResPending").style.display = "none"; getElement("ggnResBulan").style.display = "none"; getElement("ggnRes18A").style.display = "block";
        autoMasukRumusan('resUni18AAmount', activeCardContext);
    }
}

function resetGGNUnified() {
    ["ggnUniBasic", "ggnUniAllowance", "ggnBakiGaji", "ggnUniType", "ggnUniMonthVal", "ggnUniWeekVal", "ggnUniWeekStart", "ggnUniWeekEnd", "ggnUniDayVal", "ggnUniDayStart", "ggnUniDayEnd", "ggnStatusNotis"].forEach(id => { if (getElement(id)) setValue(id, ""); });
    if(getElement("ggnStatusNotis")) setValue("ggnStatusNotis", "ada"); setValue("ggnUniTotal", "RM 0.00"); toggleGGNMode(); 
}

const monthNames = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"];

function toggleTBBSalaryMode() {
    let mode = getElement("tbbSalaryMode").value;
    getElement("tbbFixedSalaryGroup").style.display = (mode === "tetap") ? "block" : "none";
    getElement("tbbVariableSalaryGroup").style.display = (mode === "berubah") ? "block" : "none";
    getElement("tbbFormulaSalaryGroup").style.display = (mode === "formula") ? "block" : "none";
    if (mode === "berubah") generate12MonthsTable();
}

function generate12MonthsTable() {
    let endDateVal = getElement("tbbEndDate").value; let container = getElement("tbb12MonthsContainer");
    if (!endDateVal) { container.innerHTML = '<span style="color:#1f4e79; font-weight:bold;">Menunggu Tarikh Penamatan dipilih...</span>'; return; }
    let end = getLocalStartOfDay(endDateVal); let currentMonth = end.getMonth(); let currentYear = end.getFullYear();
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

function calculateTBB(e) {
    setContext(e); let startVal = getElement("tbbStartDate").value; let endVal = getElement("tbbEndDate").value;
    if (!startVal || !endVal) { alert("Sila masukkan Tarikh Mula Kerja dan Tarikh Penamatan."); return; }
    let start = getLocalStartOfDay(startVal); let end = getLocalStartOfDay(endVal);
    if (end < start) { alert("Tarikh Penamatan tidak boleh lebih awal daripada Tarikh Mula."); return; }
    let mode = getElement("tbbSalaryMode").value; let total12Months = 0;
    
    if (mode === "tetap") {
        let monthly = evaluateSmartMath(getElement("tbbMonthlyTotal").value);
        if (monthly <= 0) { alert("Sila masukkan Jumlah Upah Sebulan."); return; }
        total12Months = monthly * 12;
    } else if (mode === "berubah") {
        let parentCard = getElement("tbbEndDate").closest('.calculator-card');
        let inputs = parentCard ? parentCard.querySelectorAll(".tbb-monthly-input") : document.querySelectorAll(".tbb-monthly-input");
        if (inputs.length === 0) { alert("Sila masukkan Tarikh Penamatan untuk menjana jadual."); return; }
        inputs.forEach(input => { total12Months += evaluateSmartMath(input.value); });
        if (total12Months <= 0) { alert("Sila isi upah bulanan pada jadual."); return; }
    } else if (mode === "formula") {
        total12Months = evaluateSmartMath(getElement("tbbFormulaInput").value);
        if (total12Months <= 0) { alert("Sila semak semula format formula anda."); return; }
    }
    
    let ORP = total12Months / 365; let totalMonths = (end.getFullYear() - start.getFullYear()) * 12 - start.getMonth() + end.getMonth();
    let dStart = start.getDate(); let dEnd = end.getDate(); let extraDays = 0;
    if (dEnd >= dStart) { extraDays = dEnd - dStart + 1; } else {
        totalMonths--; let prevMonth = new Date(end.getFullYear(), end.getMonth(), 0); extraDays = prevMonth.getDate() - dStart + 1 + dEnd;
    }
    if (extraDays >= 15) { totalMonths++; } if (totalMonths < 0) totalMonths = 0;
    let years = Math.floor(totalMonths / 12); let remMonths = totalMonths % 12;
    let tempohText = (years > 0 ? `${years} Tahun ` : "") + (remMonths > 0 ? `${remMonths} Bulan` : "");
    if (totalMonths === 0) tempohText = "Kurang 1 Bulan";
    let rate = (totalMonths < 24) ? 10 : (totalMonths < 60) ? 15 : 20; let entitledDays = (totalMonths / 12) * rate; let amount = entitledDays * ORP;
    
    setText("tbbTempoh", tempohText.trim()); setText("tbbKadar", `${rate} Hari / Tahun`); setText("tbbHari", `${entitledDays.toFixed(2)} Hari`); 
    setText("tbbTotal12M", formatRM(total12Months)); setText("tbbORP", formatRM(ORP)); setText("tbbAmount", formatRM(amount)); toggleResult("tbb", true);
    autoMasukRumusan('tbbAmount', activeCardContext);
}

function resetTBB() {
    ["tbbStartDate", "tbbEndDate", "tbbMonthlyTotal", "tbb12MonthsTotalReadonly", "tbbFormulaInput"].forEach(id => setValue(id, ""));
    setValue("tbbSalaryMode", "tetap"); toggleTBBSalaryMode(); getElement("tbb12MonthsContainer").innerHTML = '<span style="color:#1f4e79; font-weight:bold;">Menunggu Tarikh Penamatan dipilih...</span>';
    ["tbbTempoh", "tbbKadar", "tbbHari"].forEach(id => setText(id, "-")); ["tbbTotal12M", "tbbORP", "tbbAmount"].forEach(id => setText(id, "RM 0.00")); toggleResult("tbb", false);
}

// =====================================================
// 4. ENJIN KALKULATOR RUMUSAN AKHIR
// =====================================================
const senaraiKalkulatorRumusan = [
    { nilai: "", teks: "- Sila Pilih Jenis Bayaran -" }, 
    { nilai: "orpBakiAmount", teks: "Baki Upah / Gaji (ORP)" }, 
    { nilai: "resUniMonthAmount", teks: "Gaji Ganti Notis (Bulan)" }, 
    { nilai: "resUni18AAmount", teks: "Gaji Ganti Notis (Hari / Minggu)" }, 
    { nilai: "tbbAmount", teks: "Faedah Penamatan" }, 
    { nilai: "otAmount", teks: "OT Hari Biasa" }, 
    { nilai: "otRHAmount", teks: "OT Hari Rehat" }, 
    { nilai: "otPHAmount", teks: "OT Hari Kelepasan" }, 
    { nilai: "rhAmount", teks: "Kerja Hari Rehat (½ Hari @ Kurang)" }, 
    { nilai: "rhMoreAmount", teks: "Kerja Hari Rehat (Lebih ½ Hari)" }, 
    { nilai: "phAmount", teks: "Kerja Pada Hari Kelepasan" }, 
    { nilai: "amount18A", teks: "Seksyen 18A (Bulan Tidak Lengkap)" }, 
    { nilai: "annualLeaveAmount", teks: "Bayaran Cuti Tahunan" }, 
    { nilai: "sickLeaveAmount", teks: "Bayaran Cuti Sakit" }, 
    { nilai: "lewatAmount", teks: "Potongan Lewat Seminit" },
    { nilai: "lainLain", teks: "Lain-lain" }
];

function formatRMRumusan(amount) { if (isNaN(amount) || amount === "") return "RM0.00"; return "RM " + parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function unformatRMRumusan(str) { if (!str) return 0; return parseFloat(str.toString().replace(/[^0-9.-]+/g, "")) || 0; }

function tambahBarisRumusan() {
    const tbody = document.getElementById('badanJadualRumusan'); const tr = document.createElement('tr'); tr.style.borderBottom = "1px dashed #ddd";
    let pilihanHTML = ''; senaraiKalkulatorRumusan.forEach(item => { pilihanHTML += `<option value="${item.nilai}">${item.teks}</option>`; });
    tr.innerHTML = `
        <td style="padding: 10px;"><select class="select-input" style="width: 100%; border-color: #1f4e79;" onchange="kemaskiniPatutBayar(this)">${pilihanHTML}</select></td>
        <td style="padding: 10px;"><input type="text" class="number-input keterangan-baris" placeholder="-" style="background: #fff; text-align: center; width: 100%;"></td>
        <td style="padding: 10px;"><input type="text" class="number-input patut-bayar" value="RM 0.00" style="background: #fff; font-weight: bold; width: 100%; text-align: center;" onblur="formatPatutBayar(this)" onfocus="unformatPatutBayar(this)"></td>
        <td style="padding: 10px;"><input type="text" class="number-input telah-bayar" placeholder="Contoh: 599.00" style="width: 100%; text-align: center;" onblur="formatTelahBayar(this)" onfocus="unformatTelahBayar(this)"></td>
        <td style="padding: 10px;"><input type="text" class="number-input baki-baris" value="RM 0.00" readonly style="background: #fff; font-weight: bold; width: 100%; border: none; text-align: center;"></td>
        <td style="padding: 10px; text-align: center;"><button onclick="buangBarisRumusan(this)" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">X</button></td>
    `;
    tbody.appendChild(tr);
}

function unformatTelahBayar(input) { let val = unformatRMRumusan(input.value); input.value = val === 0 ? "" : val; }
function formatTelahBayar(input) { let val = unformatRMRumusan(input.value); input.value = formatRMRumusan(val); kiraBakiBaris(input); }

function unformatPatutBayar(input) { let val = unformatRMRumusan(input.value); input.value = val === 0 ? "" : val; }
function formatPatutBayar(input) { let val = unformatRMRumusan(input.value); input.value = formatRMRumusan(val); kiraBakiBaris(input); }

function kemaskiniPatutBayar(selectElement) {
    const baris = selectElement.closest('tr');
    const idSasaran = selectElement.value;
    const inputKeterangan = baris.querySelector('.keterangan-baris');
    const inputPatutBayar = baris.querySelector('.patut-bayar');
    const inputTelahBayar = baris.querySelector('.telah-bayar');
    
    let nilaiDiambil = 0;
    let senaraiKeterangan = []; 

    inputTelahBayar.removeAttribute('readonly');
    inputTelahBayar.style.background = "#fff";
    
    if (idSasaran !== "") {
        let semuaKadAktif = document.querySelectorAll('.calculator-card:not(.hidden-template)');
        
        if (idSasaran === "orpBakiAmount") {
            let jumlahPatut = 0, jumlahTelah = 0;
            for(let kad of semuaKadAktif) {
                let patutEl = kad.querySelector('[id="orpPatutTerima"], [data-original-id="orpPatutTerima"]');
                let telahEl = kad.querySelector('[id="orpTelahTerima"], [data-original-id="orpTelahTerima"]');
                if (patutEl || telahEl) { 
                    jumlahPatut += unformatRMRumusan(patutEl ? patutEl.value : "0");
                    jumlahTelah += unformatRMRumusan(telahEl ? telahEl.value : "0");
                }
            }
            nilaiDiambil = jumlahPatut;
            inputTelahBayar.value = formatRMRumusan(jumlahTelah);
            inputTelahBayar.setAttribute('readonly', true);
            inputTelahBayar.style.background = "#f4f4f4";
            
            if (jumlahPatut > jumlahTelah) {
                senaraiKeterangan.push("Terkurang Bayar");
            } else if (jumlahTelah > jumlahPatut) {
                senaraiKeterangan.push("Terlebih Bayar");
            } else {
                senaraiKeterangan.push("Terkurang Bayar"); 
            }
            
        } else {
            for(let kad of semuaKadAktif) {
                let elemenKeputusan = kad.querySelector(`[id="${idSasaran}"], [data-original-id="${idSasaran}"]`);
                if (elemenKeputusan && elemenKeputusan.innerText && unformatRMRumusan(elemenKeputusan.innerText) !== 0) {
                    nilaiDiambil += unformatRMRumusan(elemenKeputusan.innerText);
                    
                    let detail = "";
                    let getVal = (id) => { let e = kad.querySelector(`[id="${id}"], [data-original-id="${id}"]`); return e ? e.value : ""; };
                    let getTxt = (id) => { let e = kad.querySelector(`[id="${id}"], [data-original-id="${id}"]`); return e ? e.innerText : ""; };

                    if (idSasaran.includes("otAmount")) { let jam = getVal("otHours"); if(jam) detail = `${jam} jam`; }
                    else if (idSasaran.includes("otRHAmount")) { let jam = getVal("otRHHours"); if(jam) detail = `${jam} jam`; }
                    else if (idSasaran.includes("otPHAmount")) { let jam = getVal("otPHHours"); if(jam) detail = `${jam} jam`; }
                    else if (idSasaran.includes("rhAmount") && !idSasaran.includes("rhMoreAmount")) { let hari = getVal("rhDays"); if(hari) detail = `${hari} hari`; }
                    else if (idSasaran.includes("rhMoreAmount")) { let hari = getVal("rhMoreDays"); if(hari) detail = `${hari} hari`; }
                    else if (idSasaran.includes("phAmount")) { let hari = getVal("phDays"); if(hari) detail = `${hari} hari`; }
                    else if (idSasaran.includes("annualLeaveAmount")) { let hari = getVal("annualLeaveDays"); if(hari) detail = `${hari} hari`; }
                    else if (idSasaran.includes("sickLeaveAmount")) { let hari = getVal("sickLeaveDays"); if(hari) detail = `${hari} hari`; }
                    else if (idSasaran.includes("resUniMonthAmount")) { let bulan = getVal("ggnUniMonthVal"); if(bulan) detail = `${bulan} bulan`; }
                    else if (idSasaran.includes("lewatAmount")) { let min = getVal("lewatMinit"); if(min) detail = `${min} minit`; }
                    else if (idSasaran.includes("resUni18AAmount")) { 
                        let m = getVal("ggnUniWeekVal"), h = getVal("ggnUniDayVal"); 
                        if(m) detail = `${m} minggu`; else if(h) detail = `${h} hari`;
                    }
                    else if (idSasaran.includes("tbbAmount")) { let hari = getTxt("tbbHari"); if(hari && hari !== "-") detail = hari; }
                    else if (idSasaran.includes("amount18A")) { 
                        let mula = getVal("section18AStartDate"); 
                        let akhir = getVal("section18AEndDate"); 
                        if (mula && akhir) {
                            let fmt = (d) => d.split('-').reverse().join('/');
                            detail = `Dari ${fmt(mula)} hingga ${fmt(akhir)}`;
                        } else {
                            detail = "Bulan Tidak Lengkap";
                        }
                    }

                    if (detail) senaraiKeterangan.push(detail);
                }
            }
            inputTelahBayar.value = ""; 
        }
    } else { 
        inputTelahBayar.value = ""; 
    }
    
    if (inputKeterangan) {
        inputKeterangan.value = senaraiKeterangan.length > 0 ? senaraiKeterangan.join(" + ") : "-";
    }
    inputPatutBayar.value = formatRMRumusan(nilaiDiambil);
    kiraBakiBaris(selectElement);
}

function kiraBakiBaris(elemenDalamBaris) {
    const baris = elemenDalamBaris.closest('tr'); const patutBayar = unformatRMRumusan(baris.querySelector('.patut-bayar').value); const telahBayar = unformatRMRumusan(baris.querySelector('.telah-bayar').value);
    const inputBaki = baris.querySelector('.baki-baris'); const baki = telahBayar - patutBayar; inputBaki.setAttribute('data-value', baki);
    if (baki > 0) { inputBaki.value = formatRMRumusan(baki); inputBaki.style.color = "#28a745"; } 
    else if (baki < 0) { inputBaki.value = formatRMRumusan(Math.abs(baki)); inputBaki.style.color = "#d9534f"; } 
    else { inputBaki.value = formatRMRumusan(0); inputBaki.style.color = "#333"; }
    kiraJumlahKeseluruhanRumusan();
}

function buangBarisRumusan(butangPadam) { butangPadam.closest('tr').remove(); kiraJumlahKeseluruhanRumusan(); }
function resetRumusan() { document.getElementById('badanJadualRumusan').innerHTML = ''; kiraJumlahKeseluruhanRumusan(); }

function kiraJumlahKeseluruhanRumusan() {
    const semuaBaki = document.querySelectorAll('.baki-baris'); let jumlahBesar = 0;
    semuaBaki.forEach(input => { let nilaiSebenar = input.getAttribute('data-value'); if (nilaiSebenar !== null) jumlahBesar += parseFloat(nilaiSebenar); else jumlahBesar += unformatRMRumusan(input.value); });
    const teksJumlah = document.getElementById('jumlahKeseluruhanRumusan');
    if (jumlahBesar > 0) { teksJumlah.innerText = formatRMRumusan(jumlahBesar); teksJumlah.style.color = "#28a745"; } 
    else if (jumlahBesar < 0) { teksJumlah.innerText = formatRMRumusan(Math.abs(jumlahBesar)); teksJumlah.style.color = "#d9534f"; } 
    else { teksJumlah.innerText = formatRMRumusan(0); teksJumlah.style.color = "#1f4e79"; }
}

function autoMasukRumusan(idSasaran, contextCard) {
    const jadual = document.getElementById('badanJadualRumusan'); const senaraiSelect = jadual.querySelectorAll('select'); let barisWujud = null;
    senaraiSelect.forEach(select => { if (select.value === idSasaran) barisWujud = select; });
    let tempContext = activeCardContext; if (contextCard) activeCardContext = contextCard;
    if (barisWujud) { kemaskiniPatutBayar(barisWujud); } else {
        tambahBarisRumusan(); let semuaSelectBaru = jadual.querySelectorAll('select'); let selectTerbaru = semuaSelectBaru[semuaSelectBaru.length - 1];
        selectTerbaru.value = idSasaran; kemaskiniPatutBayar(selectTerbaru);
    }
    activeCardContext = tempContext;
}

// =====================================================
// 5. LAPORAN PENUH & PENYATA GAJI (PDF)
// =====================================================
let tourElaunPopupDitunjuk = false; 

function formatTitleCase(str) { return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); }

function formatIC(str) {
    if (/[a-zA-Z]/.test(str)) return str.toUpperCase();
    let val = str.replace(/\D/g, ''); if (val.length <= 6) return val; if (val.length <= 8) return val.slice(0,6) + '-' + val.slice(6); 
    return val.slice(0,6) + '-' + val.slice(6,8) + '-' + val.slice(8,12);
}

window.autoKiraPotonganBerkanun = function() {
    let baseBasic = 0;
    let baseElaunAsal = 0;

    document.querySelectorAll('.calculator-card:not(.hidden-template)').forEach(kad => {
        ["orpBasicSalary", "otBasicSalary", "rhBasicSalary", "rhMoreBasicSalary", "section18ABasicSalary", "otRHBasicSalary", "phBasicSalary", "otPHBasicSalary", "ggnUniBasic", "lewatBasicSalary"].forEach(id => {
            let el = kad.querySelector(`[id="${id}"], [data-original-id="${id}"]`);
            if (el && evaluateSmartMath(el.value) > 0 && baseBasic === 0) baseBasic = evaluateSmartMath(el.value);
        });
        ["orpAllowance", "otAllowance", "rhAllowance", "rhMoreAllowance", "section18AAllowance", "otRHAllowance", "phAllowance", "otPHAllowance", "ggnUniAllowance", "lewatAllowance"].forEach(id => {
            let el = kad.querySelector(`[id="${id}"], [data-original-id="${id}"]`);
            if (el && evaluateSmartMath(el.value) > 0 && baseElaunAsal === 0) baseElaunAsal = evaluateSmartMath(el.value);
        });
    });

    let totalElaunPopup = 0;
    let adaElaunPopup = false;
    let containerElaunModal = document.getElementById('containerElaunModal');
    if(containerElaunModal) {
        containerElaunModal.querySelectorAll('.elaun-nilai').forEach(input => {
            let val = evaluateSmartMath(input.value);
            if (val > 0) totalElaunPopup += val;
            if (input.value.trim() !== "") adaElaunPopup = true;
        });
    }

    let finalElaun = adaElaunPopup ? totalElaunPopup : baseElaunAsal;
    let totalGajiElaun = baseBasic + finalElaun;

    let kwspInput = document.getElementById('inputKWSPPeratus');
    let perkesoInput = document.getElementById('inputPERKESOPeratus');
    let sipInput = document.getElementById('inputSIPPeratus');

    if(kwspInput && perkesoInput && sipInput) {
        let pctKWSP = parseFloat(kwspInput.value) || 0;
        let pctPERKESO = parseFloat(perkesoInput.value) || 0;
        let pctSIP = parseFloat(sipInput.value) || 0;

        let kwspNilai = document.getElementById('inputKWSPNilai');
        let perkesoNilai = document.getElementById('inputPERKESONilai');
        let sipNilai = document.getElementById('inputSIPNilai');

        if(kwspNilai && document.activeElement !== kwspNilai) kwspNilai.value = (pctKWSP > 0 && totalGajiElaun > 0) ? formatSafeRM(totalGajiElaun * (pctKWSP / 100)) : "";
        if(perkesoNilai && document.activeElement !== perkesoNilai) perkesoNilai.value = (pctPERKESO > 0 && totalGajiElaun > 0) ? formatSafeRM(totalGajiElaun * (pctPERKESO / 100)) : "";
        if(sipNilai && document.activeElement !== sipNilai) sipNilai.value = (pctSIP > 0 && totalGajiElaun > 0) ? formatSafeRM(totalGajiElaun * (pctSIP / 100)) : "";
    }

    let absentHariInput = document.getElementById('inputAbsentHari');
    let absentNilaiInput = document.getElementById('inputAbsentNilai');
    if(absentHariInput && absentNilaiInput) {
        let hari = parseFloat(absentHariInput.value) || 0;
        let ORP = totalGajiElaun / 26;
        
        if(document.activeElement !== absentNilaiInput) {
            if (hari > 0 && ORP > 0) {
                absentNilaiInput.value = formatSafeRM(ORP * hari);
            } else if (absentHariInput.value.trim() === "") {
                absentNilaiInput.value = "";
            }
        }
    }
};
function semakKalkulatorTakLengkap() {
    let semuaKadAktif = document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card)');
    for (let kad of semuaKadAktif) {
        if(kad.id === 'active-maklumatGaji') continue;

        let isLengkap = false;
        let dataDivs = kad.querySelectorAll('[id$="Data"], [data-original-id$="Data"]');
        let pendingGGN = kad.querySelector('[id="ggnResPending"], [data-original-id="ggnResPending"]');
        
        if (pendingGGN) {
            if (window.getComputedStyle(pendingGGN).display === 'none') isLengkap = true;
        } else if (dataDivs.length > 0) {
            dataDivs.forEach(div => {
                if (window.getComputedStyle(div).display !== 'none') isLengkap = true;
            });
        } else {
            isLengkap = true; 
        }

        if (!isLengkap) {
            let tajuk = "Kalkulator";
            let h2 = kad.querySelector('h2');
            if (h2) tajuk = h2.innerText.replace(/\n/g, ' ').trim();
            return tajuk;
        }
    }
    return null;
}

function janaLaporanPenuh() { 
    let semuaKadAktif = document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card):not(#active-maklumatGaji)');
    let adaDataKira = false;

    semuaKadAktif.forEach(kad => {
        let dataDivs = kad.querySelectorAll('[id$="Data"], [data-original-id$="Data"], [id^="ggnRes"]:not(#ggnResPending)');
        dataDivs.forEach(div => {
            if (window.getComputedStyle(div).display !== 'none') {
                adaDataKira = true;
            }
        });
    });

    let rumusanTbody = document.getElementById('badanJadualRumusan');
    if (rumusanTbody && rumusanTbody.children.length > 0) {
        adaDataKira = true;
    }

    if (!adaDataKira) {
        let existingAmaran = document.getElementById('modalTiadaData');
        if (existingAmaran) existingAmaran.remove();

        let amaranTiadaDataHtml = `
        <div id="modalTiadaData" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);">
            <div style="background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); text-align: center; border-top: 6px solid #f39c12; animation: floatUp 0.3s ease-out;">
                <div style="font-size: 45px; margin-bottom: 10px; line-height: 1;">⚠️</div>
                <h3 style="margin-top: 0; color: #1f4e79; font-size: 20px; font-weight: 800;">Tiada Rekod Pengiraan</h3>
                <p style="font-size: 14px; color: #444; line-height: 1.6; margin-bottom: 25px;">
                    Sila pilih mana-mana kalkulator dan buat sekurang-kurangnya <b>satu pengiraan (Klik Kira)</b> sebelum menjana laporan.
                </p>
                <button onclick="document.getElementById('modalTiadaData').remove()" style="background: #1f4e79; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; width: 100%; transition: 0.2s; box-shadow: 0 4px 6px rgba(31,78,121,0.2);">OK, SAYA FAHAM</button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', amaranTiadaDataHtml);
        return;
    }

    let takLengkap = semakKalkulatorTakLengkap();
    if (takLengkap) {
        let existingTakLengkap = document.getElementById('modalTakLengkap');
        if (existingTakLengkap) existingTakLengkap.remove();

        let amaranTakLengkapHtml = `
        <div id="modalTakLengkap" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);">
            <div style="background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); text-align: center; border-top: 6px solid #dc3545; animation: floatUp 0.3s ease-out;">
                <div style="font-size: 45px; margin-bottom: 10px; line-height: 1;">⚠️</div>
                <h3 style="margin-top: 0; color: #dc3545; font-size: 20px; font-weight: 800;">Tidak Lengkap</h3>
                <p style="font-size: 14px; color: #444; line-height: 1.6; margin-bottom: 25px;">
                    Kalkulator <b>(${takLengkap})</b> tidak lengkap.<br>Sila lengkapkan pengiraan atau padam kalkulator tersebut terlebih dahulu.
                </p>
                <button onclick="document.getElementById('modalTakLengkap').remove()" style="background: #dc3545; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; width: 100%; transition: 0.2s; box-shadow: 0 4px 6px rgba(220,53,69,0.2);">OK, SAYA FAHAM</button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', amaranTakLengkapHtml);
        return;
    }
    
    paparModalLaporan('penuh'); 
}

function janaPenyataGaji() { 
    let takLengkap = semakKalkulatorTakLengkap();
    if (takLengkap) {
        let existingTakLengkap = document.getElementById('modalTakLengkap');
        if (existingTakLengkap) existingTakLengkap.remove();

        let amaranTakLengkapHtml = `
        <div id="modalTakLengkap" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);">
            <div style="background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); text-align: center; border-top: 6px solid #dc3545;">
                <div style="font-size: 45px; margin-bottom: 10px; line-height: 1;">⚠️</div>
                <h3 style="margin-top: 0; color: #dc3545; font-size: 20px; font-weight: 800;">Tidak Lengkap</h3>
                <p style="font-size: 14px; color: #444; line-height: 1.6; margin-bottom: 25px;">
                    Kalkulator <b>(${takLengkap})</b> tidak lengkap.<br>Sila lengkapkan pengiraan atau padam kalkulator tersebut terlebih dahulu.
                </p>
                <button onclick="document.getElementById('modalTakLengkap').remove()" style="background: #dc3545; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; width: 100%; transition: 0.2s; box-shadow: 0 4px 6px rgba(220,53,69,0.2);">OK, SAYA FAHAM</button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', amaranTakLengkapHtml);
        return;
    }

    let orpCardLengkap = false;
    let orpCardWujud = null;
    let semuaKadAktif = document.querySelectorAll('.calculator-card:not(.hidden-template)');
    
    semuaKadAktif.forEach(kad => {
        let orpData = kad.querySelector('[id="orpData"], [data-original-id="orpData"]');
        if (orpData) {
            orpCardWujud = kad;
            if (window.getComputedStyle(orpData).display !== "none") {
                orpCardLengkap = true;
            }
        }
    });

    if (!orpCardLengkap) {
        let existingModalORP = document.getElementById('modalAmaranORP');
        if (existingModalORP) existingModalORP.remove();

        let amaranORPHtml = `
        <div id="modalAmaranORP" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);">
            <div style="background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); text-align: center; border-top: 6px solid #f39c12;">
                <div style="font-size: 45px; margin-bottom: 10px; line-height: 1;">⚠️</div>
                <h3 style="margin-top: 0; color: #1f4e79; font-size: 20px; font-weight: 800;">Peringatan</h3>
                <p style="font-size: 14px; color: #444; line-height: 1.6; margin-bottom: 25px;">
                    Sila lengkapkan Kalkulator <b>Kadar Upah Biasa (ORP)</b> terlebih dahulu untuk menjana Penyata Gaji.
                </p>
                <button id="btnOKModalORP" style="background: #1f4e79; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; width: 100%; transition: 0.2s; box-shadow: 0 4px 6px rgba(31,78,121,0.2);">OK, SAYA FAHAM</button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', amaranORPHtml);

        if (!orpCardWujud) {
            window.tangguhTourElaunSeketika = true; 
            if (typeof window.tambahKalkulator === 'function') {
                window.tambahKalkulator('orp');
                let cards = document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card)');
                orpCardWujud = cards[cards.length - 1];
            }
        } 
        
        document.getElementById('btnOKModalORP').onclick = function() {
            document.getElementById('modalAmaranORP').remove();
            if (orpCardWujud) {
                orpCardWujud.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                if (window.tangguhTourElaunSeketika) {
                    window.tangguhTourElaunSeketika = false;
                    if (!elaunTourDitunjuk) {
                        elaunTourDitunjuk = true;
                        let containerElaun = orpCardWujud.querySelector('.dynamic-allowance-wrapper');
                        if (containerElaun) {
                            setTimeout(() => tunjukTourElaun(containerElaun), 50);
                        }
                    }
                }
            }
        };

        return;
    }
    
    paparModalLaporan('penyata'); 
}

function teruskanJanaLaporan(jenis) {
    let getV = (id) => document.getElementById(id) ? document.getElementById(id).value.trim() : "";
    
    window.globalNamaMajikan = getV('inputNamaMajikan');
    window.globalNoDaftarMajikan = getV('inputNoDaftarMajikan');
    window.globalTempohUpah = getV('inputTempohUpah');
    window.globalNamaPekerja = getV('inputNamaLaporan');
    window.globalIcPekerja = getV('inputICLaporan');
    window.globalNoPekerja = getV('inputNoPekerjaLaporan');

    let noDaftarMajikan = ""; let tempohUpah = "";
    let kwspP="", kwspN="", perkesoP="", perkesoN="", sipP="", sipN="", pendahuluanN="", absentH="", absentN=""; 
    let senaraiElaun = []; let senaraiPotongan = [];
    let svcData = {};

    let namaMajikan = window.globalNamaMajikan;

    if (jenis === 'penyata') {
        let inputUPL = document.getElementById('inputUPLSemasa');
        let nilaiUPL = inputUPL ? (parseFloat(inputUPL.value) || 0) : 0; 

        if (nilaiUPL > 0 && !window.statusUPLDisahkan) {
            document.getElementById('modalAmaranUPL').style.display = 'flex';
            return; 
        }
        window.statusUPLDisahkan = false; 

        let msLayak = ['modPHLayak', 'modALLayak', 'modMCLayak', 'modWDLayak'];
        let msGuna = ['modPHGuna', 'modALGuna', 'modMCGuna', 'modWDGuna'];
        let isIncomplete = false;
        
        msLayak.concat(msGuna).forEach(id => {
            let el = document.getElementById(id);
            if (el && el.value.trim() === "") isIncomplete = true;
        });

        if (isIncomplete) {
            if(typeof tunjukTourMaklumatPerkhidmatan === 'function') tunjukTourMaklumatPerkhidmatan();
            return; 
        }

        noDaftarMajikan = window.globalNoDaftarMajikan;
        tempohUpah = window.globalTempohUpah;
        kwspP = getV('inputKWSPPeratus'); kwspN = getV('inputKWSPNilai');
        perkesoP = getV('inputPERKESOPeratus'); perkesoN = getV('inputPERKESONilai');
        sipP = getV('inputSIPPeratus'); sipN = getV('inputSIPNilai');
        pendahuluanN = getV('inputPendahuluanNilai');
        absentH = getV('inputAbsentHari'); absentN = getV('inputAbsentNilai');

        svcData = {
            phL: getV('modPHLayak'), phG: getV('modPHGuna'), phB: getV('modPHBaki'), phS: getV('inputPHSemasa'),
            alL: getV('modALLayak'), alG: getV('modALGuna'), alB: getV('modALBaki'), alS: getV('inputALSemasa'),
            mcL: getV('modMCLayak'), mcG: getV('modMCGuna'), mcB: getV('modMCBaki'), mcS: getV('inputMCSemasa'),
            wdL: getV('modWDLayak'), wdG: getV('modWDGuna'), wdB: getV('modWDBaki'), wdS: getV('inputWDSemasa'),
            mlS: getV('inputMLSemasa'), ptS: getV('inputPTSemasa'), uplS: getV('inputUPLSemasa')
        };
    }

    let namaPekerja = window.globalNamaPekerja;
    let icPekerja = window.globalIcPekerja;
    let noPekerja = window.globalNoPekerja;

    let unikId = window.rekodSedangDikemaskini || ('rekod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
    
    if (window.rekodSedangDikemaskini) {
        let tbody = document.querySelector('#card-maklumatGaji tbody');
        if (tbody) {
            let oldBtn = tbody.querySelector(`button[data-id="${window.rekodSedangDikemaskini}"]`);
            if (oldBtn) {
                let oldRow = oldBtn.closest('tr');
                if (oldRow) oldRow.remove();
            }
        }
        if (window.simpananHTMLGlobal && window.simpananHTMLGlobal[window.rekodSedangDikemaskini]) {
            delete window.simpananHTMLGlobal[window.rekodSedangDikemaskini];
        }
    }

    tambahRekodKeMaklumatGaji(jenis, namaPekerja, namaMajikan, tempohUpah, unikId);
    document.getElementById('modalLaporanPenuh').style.display = 'none'; 
    
    prosesJanaLaporanPenuh(namaMajikan, noDaftarMajikan, tempohUpah, namaPekerja, icPekerja, noPekerja, jenis, { 
        senaraiElaun, senaraiPotongan, kwspP, kwspN, perkesoP, perkesoN, sipP, sipN, pendahuluanN, absentH, absentN, svcData 
    }, unikId);
    
    window.rekodSedangDikemaskini = null;
    
    if (typeof window.simpanDataKekal === "function") {
        window.simpanDataKekal();
    }
}
// =========================================================
// 10. ENJIN DRAF & KAWALAN PERTUKARAN MENU
// =========================================================

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

function urusPertukaranMenu(modDestinasi, fungsiCallback) {
    let modSemasa = dapatkanModSemasa();
    
    if (modSemasa === 'NONE' || modSemasa === modDestinasi) {
        return fungsiCallback(); 
    }

    if (modDestinasi === 'REKOD' && document.getElementById('active-maklumatGaji')) {
        return fungsiCallback();
    }

    let paparanMod = modSemasa === '18A' ? 'KALKULATOR SEKSYEN 18A' : 'KALKULATOR AKTA KERJA';
    
    let existingModal = document.getElementById('modalAmaranPertukaran');
    if (existingModal) existingModal.remove();

    let boxHtml = `
    <div id="modalAmaranPertukaran" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 9999999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);">
        <div style="background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 420px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); text-align: center; border-top: 6px solid #f39c12; box-sizing: border-box;">
            <div style="font-size: 45px; margin-bottom: 10px; line-height: 1;">⚠️</div>
            <h3 style="margin-top: 0; color: #1f4e79; font-size: 20px; font-weight: 800;">Aktiviti Pengiraan Dikesan</h3>
            <p style="font-size: 14px; color: #444; line-height: 1.6; margin-bottom: 25px;">
                Anda mempunyai aktiviti pengiraan di<br><b>${paparanMod}</b>.<br><br>Sila pilih tindakan anda sebelum beralih:
            </p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="btnBatalTukar" style="background: #6c757d; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; transition: 0.2s;">Batal (Kekal Di Paparan Sekarang)</button>
                <button id="btnHapusDraf" style="background: #dc3545; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; transition: 0.2s; box-shadow: 0 4px 6px rgba(220,53,69,0.2);">Hapus (Padam Aktiviti)</button>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', boxHtml);

    document.getElementById('btnBatalTukar').onclick = function() {
        document.getElementById('modalAmaranPertukaran').remove();
    };

    document.getElementById('btnHapusDraf').onclick = function() {
        document.getElementById('modalAmaranPertukaran').remove();
        document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card):not(#active-maklumatGaji)').forEach(k => k.remove());
        if(typeof resetRumusan === 'function') resetRumusan();
        senaraiElaunGlobal = [];
        let rc = document.querySelector('.rumusan-card'); if(rc) rc.style.display = 'none';

        window.globalNamaMajikan = ""; window.globalNoDaftarMajikan = ""; window.globalTempohUpah = "";
        window.globalNamaPekerja = ""; window.globalIcPekerja = ""; window.globalNoPekerja = "";
        window.rekodSedangDikemaskini = null;
        let sediaAdaModal = document.getElementById('modalLaporanPenuh');
        if (sediaAdaModal) sediaAdaModal.remove();

        fungsiCallback();
    };
}

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
        kad.classList.add('hidden-template'); 
        kad.style.display = 'none'; 
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

    document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card)').forEach(k => k.remove());
    let activeMg = document.getElementById('active-maklumatGaji');
    if (activeMg) activeMg.remove();

    let rumusanTbodyTarget = document.getElementById('badanJadualRumusan');
    if (rumusanTbodyTarget) rumusanTbodyTarget.innerHTML = ''; 

    let grid = document.getElementById('active-calculators-grid');
    let rumusanCard = document.querySelector('.rumusan-card');
    
    let kadContainer = wrapper.querySelector('.draf-kad-container');
    if (kadContainer) {
        while(kadContainer.firstChild) {
            let kad = kadContainer.firstChild;
            kad.style.display = '';
            kad.classList.remove('sementara-sembunyi');
            kad.classList.remove('hidden-template'); 
            
            if(rumusanCard) grid.insertBefore(kad, rumusanCard);
            else grid.appendChild(kad);
        }
    }

    let rumusanContainer = wrapper.querySelector('.draf-rumusan-container');
    if (rumusanContainer && rumusanTbodyTarget) {
        while(rumusanContainer.firstChild) {
            rumusanTbodyTarget.appendChild(rumusanContainer.firstChild);
        }
    }

    try { 
        senaraiElaunGlobal = JSON.parse(wrapper.getAttribute('data-elaun')) || []; 
    } catch(err) { 
        senaraiElaunGlobal = []; 
    }

    wrapper.remove();
    document.querySelectorAll(`tr[data-draf="${drafId}"]`).forEach(tr => tr.remove());

    if(rumusanCard) rumusanCard.style.display = 'block';
    let warningBox = document.querySelector('.warning-box');
    if(warningBox) warningBox.style.display = 'block';
    
    if(typeof kiraJumlahKeseluruhanRumusan === 'function') kiraJumlahKeseluruhanRumusan();
    setTimeout(() => { 
        if (typeof window.semakDanTukarElaun === 'function') window.semakDanTukarElaun(); 
    }, 50);

    let kadTelahDipulih = document.querySelectorAll('.calculator-card:not(.hidden-template):not(.rumusan-card)');
    if (kadTelahDipulih.length > 0) {
        kadTelahDipulih[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

window.hapusDraf = function(e) {
    let btn = e.currentTarget;
    let drafId = btn.getAttribute('data-draf-id');
    let sah = confirm("Adakah anda pasti mahu memadam draf ini?");
    if(sah) {
        let wrapper = document.getElementById('wrapper_' + drafId);
        if(wrapper) wrapper.remove();
        document.querySelectorAll(`tr[data-draf="${drafId}"]`).forEach(tr => tr.remove());
        
        // PENAMBAHBAIKAN: Kekal di Senarai Rekod
        window.tambahKalkulator('maklumatGaji', true);
    }
};

// =========================================================
// 12. ENJIN PENYIMPANAN KEKAL (LOCALSTORAGE) - MACAM APP (SaaS)
// =========================================================

window.simpananHTMLGlobal = window.simpananHTMLGlobal || {};

window.muatDataKekal = function() {
    let simpananLama = localStorage.getItem('appData_HTMLGlobal');
    if (simpananLama) { 
        window.simpananHTMLGlobal = JSON.parse(simpananLama); 
    }

    let jadualLama = localStorage.getItem('appData_JadualGaji');
    let tbodyMaklumatGaji = document.querySelector('#card-maklumatGaji tbody');
    if (jadualLama && tbodyMaklumatGaji) { 
        tbodyMaklumatGaji.innerHTML = jadualLama; 
    }

    let drafLama = localStorage.getItem('appData_Draf');
    if (drafLama) {
        let drafContainer = document.getElementById('drafStorageContainer');
        if (!drafContainer) {
            drafContainer = document.createElement('div');
            drafContainer.id = 'drafStorageContainer';
            drafContainer.style.display = 'none';
            document.body.appendChild(drafContainer);
        }
        drafContainer.innerHTML = drafLama;
    }
};

window.simpanDataKekal = function() {
    localStorage.setItem('appData_HTMLGlobal', JSON.stringify(window.simpananHTMLGlobal || {}));
    
    let tbodyMaklumatGaji = document.querySelector('#card-maklumatGaji tbody');
    if (tbodyMaklumatGaji) {
        localStorage.setItem('appData_JadualGaji', tbodyMaklumatGaji.innerHTML);
    }
    
    let drafContainer = document.getElementById('drafStorageContainer');
    if (drafContainer) {
        localStorage.setItem('appData_Draf', drafContainer.innerHTML);
    }
};

function pasangEnjinKekal() {
    muatDataKekal();
    
    const pemerhatiAutoSave = new MutationObserver(() => {
        simpanDataKekal();
    });

    let tbodyMaklumatGaji = document.querySelector('#card-maklumatGaji tbody');
    if (tbodyMaklumatGaji) {
        pemerhatiAutoSave.observe(tbodyMaklumatGaji, { childList: true, subtree: true });
    }
    
    let drafContainer = document.getElementById('drafStorageContainer');
    if (!drafContainer) {
        drafContainer = document.createElement('div');
        drafContainer.id = 'drafStorageContainer';
        drafContainer.style.display = 'none';
        document.body.appendChild(drafContainer);
    }
    pemerhatiAutoSave.observe(drafContainer, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pasangEnjinKekal);
} else {
    pasangEnjinKekal();
}

// =========================================================
// UPGRADE KOSMETIK: POP-UP CUSTOM UNTUK HAPUS REKOD
// (Selamat: Overwrite fungsi asal tanpa menjejaskan auto-save)
// =========================================================
window.hapusRekodSimpanan = function(e) {
    let btn = e.currentTarget || (e.target && e.target.closest ? e.target.closest('button') : null);
    if (!btn) return;
    
    let id = btn.getAttribute('data-id');
    
    let existingModal = document.getElementById('modalConfirmHapus');
    if (existingModal) existingModal.remove();

    let modalHtml = `
    <div id="modalConfirmHapus" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 9999999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);">
        <div style="background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); text-align: center; border-top: 6px solid #dc3545; animation: floatUp 0.3s ease-out; box-sizing: border-box;">
            <div style="font-size: 45px; margin-bottom: 10px; line-height: 1;">🗑️</div>
            <h3 style="margin-top: 0; color: #dc3545; font-size: 20px; font-weight: 800;">Pengesahan Padam</h3>
            <p style="font-size: 14px; color: #444; line-height: 1.6; margin-bottom: 25px;">
                Adakah anda pasti mahu memadam rekod ini?<br>Tindakan ini <b>tidak boleh diundur</b>.
            </p>
            <div style="display: flex; gap: 10px;">
                <button id="btnBatalHapus" style="flex: 1; background: #6c757d; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; transition: 0.2s;">Batal</button>
                <button id="btnSahkanHapus" style="flex: 1; background: #dc3545; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; transition: 0.2s; box-shadow: 0 4px 6px rgba(220,53,69,0.2);">Ya, Padam</button>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('btnBatalHapus').onclick = function() {
        document.getElementById('modalConfirmHapus').remove();
    };

    document.getElementById('btnSahkanHapus').onclick = function() {
        document.getElementById('modalConfirmHapus').remove(); 

        if (id && window.simpananHTMLGlobal && window.simpananHTMLGlobal[id]) {
            delete window.simpananHTMLGlobal[id];
        }

        let barisTerkini = btn.closest('tr');
        if (barisTerkini) barisTerkini.remove();

        if (id) {
            let barisMaster = document.querySelector(`#card-maklumatGaji tbody button[data-id="${id}"]`);
            if (barisMaster && barisMaster.closest('tr')) {
                barisMaster.closest('tr').remove();
            }
        }

        if (typeof window.simpanDataKekal === "function") {
            window.simpanDataKekal();
        }

        // PENAMBAHBAIKAN: Kekal di Senarai Rekod selepas Padam Laporan / Penyata
        window.tambahKalkulator('maklumatGaji', true);
    };
};
