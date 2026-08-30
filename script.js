// =====================================================
// KALKULATOR AKTA KERJA 1955
// SCRIPT.JS - VERSI STABIL (V3.0 / V2.0 ORIGIN)
// =====================================================

let activeCardContext = null;
const originalGetElement = document.getElementById.bind(document);

// Global Context Manager
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
// ENJIN INPUT & MATEMATIK
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
// KALKULATOR TERAS
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

function calculateOTBiasa(e, customDivisor = null) {
    setContext(e); let totalSalary = updateSalaryTotal("otBasicSalary", "otAllowance", "otTotalSalary");
    let hours = Number(getElement("otHours").value); let workingHours = Number(getElement("normalWorkingHours").value);
    if (!workingHours) { alert("Sila pilih jam kerja normal sehari."); return; }
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor; 
    let hourly = (ORP / workingHours) * 1.5; let amount = hourly * hours;
    setText("otResultTotal", formatRM(totalSalary)); setText("otORP", formatRM(ORP));
    setText("otHourly", formatRM(hourly)); setText("otAmount", formatRM(amount)); toggleResult("ot", true); autoMasukRumusan('otAmount', activeCardContext);
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

function calculateOTRH(e, customDivisor = null) {
    setContext(e); let totalSalary = updateSalaryTotal("otRHBasicSalary", "otRHAllowance", "otRHTotalSalary");
    let hours = Number(getElement("otRHHours").value); let workingHours = Number(getElement("otRHNormalWorkingHours").value);
    if (!workingHours) { alert("Sila pilih jam kerja normal sehari."); return; }
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor; 
    let hourly = (ORP / workingHours) * 2.0; let amount = hourly * hours;
    setText("otRHResultTotal", formatRM(totalSalary)); setText("otRHORP", formatRM(ORP));
    setText("otRHHourly", formatRM(hourly)); setText("otRHAmount", formatRM(amount)); toggleResult("otRH", true); autoMasukRumusan('otRHAmount', activeCardContext);
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

function calculateHariRehat(e, customDivisor = null) {
    setContext(e); let totalSalary = updateSalaryTotal("rhBasicSalary", "rhAllowance", "rhTotalSalary");
    let days = Number(getElement("rhDays").value); 
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor; 
    let daily = ORP * 0.5; let amount = daily * days;
    setText("rhResultTotal", formatRM(totalSalary)); setText("rhORP", formatRM(ORP));
    setText("rhDaily", formatRM(daily)); setText("rhAmount", formatRM(amount)); toggleResult("rh", true); autoMasukRumusan('rhAmount', activeCardContext);
}

function calculateHariRehatLebih(e, customDivisor = null) {
    setContext(e); let totalSalary = updateSalaryTotal("rhMoreBasicSalary", "rhMoreAllowance", "rhMoreTotalSalary");
    let days = Number(getElement("rhMoreDays").value); 
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor; 
    let daily = ORP; let amount = daily * days;
    setText("rhMoreResultTotal", formatRM(totalSalary)); setText("rhMoreORP", formatRM(ORP));
    setText("rhMoreDaily", formatRM(daily)); setText("rhMoreAmount", formatRM(amount)); toggleResult("rhMore", true); autoMasukRumusan('rhMoreAmount', activeCardContext);
}

function calculatePH(e, customDivisor = null) {
    setContext(e); let totalSalary = updateSalaryTotal("phBasicSalary", "phAllowance", "phTotalSalary");
    let days = Number(getElement("phDays").value); 
    let divisor = customDivisor || 26; let ORP = totalSalary / divisor; 
    let daily = ORP * 2; let amount = daily * days;
    setText("phResultTotal", formatRM(totalSalary)); setText("phORP", formatRM(ORP));
    setText("phDaily", formatRM(daily)); setText("phAmount", formatRM(amount)); toggleResult("ph", true); autoMasukRumusan('phAmount', activeCardContext);
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

function calculateCutiTahunan(e, customDivisor = null) {
    setContext(e); let ORP = getORP(customDivisor); let days = Number(getElement("annualLeaveDays").value); let amount = ORP * days;
    setText("annualLeaveORP", formatRM(ORP)); setText("annualLeaveAmount", formatRM(amount)); toggleResult("annualLeave", true); autoMasukRumusan('annualLeaveAmount', activeCardContext);
}

function calculateCutiSakit(e, customDivisor = null) {
    setContext(e); let ORP = getORP(customDivisor); let days = Number(getElement("sickLeaveDays").value); let amount = ORP * days;
    setText("sickLeaveORP", formatRM(ORP)); setText("sickLeaveAmount", formatRM(amount)); toggleResult("sickLeave", true); autoMasukRumusan('sickLeaveAmount', activeCardContext);
}

// =====================================================
// ENJIN REKOD & PENGAPUNGAN MODUL
// =====================================================
window.tambahKalkulator = function(templateId) {
    let grid = document.getElementById('active-calculators-grid');
    let rumusanCard = document.querySelector('.rumusan-card');
    let templateCard = document.getElementById('card-' + templateId);
    if (!templateCard) return alert('Kalkulator tidak ditemui!');
    
    let clone = templateCard.cloneNode(true);
    clone.classList.remove('hidden-template');
    
    let uniqueSuffix = '_' + Math.random().toString(36).substr(2, 9);
    clone.id = clone.id + uniqueSuffix;
    
    let closeBtn = document.createElement('button');
    closeBtn.className = "close-card-btn";
    closeBtn.innerHTML = "X";
    closeBtn.onclick = function() { clone.remove(); };
    clone.appendChild(closeBtn);

    let allElementsWithId = clone.querySelectorAll('[id]');
    allElementsWithId.forEach(el => {
        el.setAttribute('data-original-id', el.id);
        el.id = el.id + uniqueSuffix;
    });

    if (rumusanCard) grid.insertBefore(clone, rumusanCard); else grid.appendChild(clone);
    clone.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
