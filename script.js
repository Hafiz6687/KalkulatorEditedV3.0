/* =====================================================
   KALKULATOR AKTA KERJA 1955 - STYLE.CSS 
   TEMA: 2050 NEO-SWISS ENTERPRISE (ULTRA-MINIMALIST)
   STATUS: 100% JS SAFE, ICON DIHAPUSKAN, PROFESSIONAL
===================================================== */

* { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
    font-family: 'Helvetica Neue', 'Inter', -apple-system, sans-serif; 
}

body {
    background: #f4f4f5; /* Kelabu institusi yang sangat neutral */
    height: 100vh;
    overflow: hidden; 
    color: #000000;
}

/* --- 1. LAYOUT UTAMA --- */
.app-layout {
    display: flex;
    height: 100vh;
    width: 100vw;
}

/* --- 2. SIDEBAR (STRUKTUR ARKITEKTUR) --- */
.sidebar-2026 {
    width: 320px;
    background: #ffffff;
    border-right: 1.5px solid #e4e4e7;
    display: flex;
    flex-direction: column;
    z-index: 50;
}

.sidebar-brand {
    padding: 50px 30px 40px;
    text-align: left;
}

.brand-icon { display: none !important; }

.sidebar-brand h2 {
    font-size: 24px;
    color: #000000;
    font-weight: 900;
    letter-spacing: -1.5px;
    line-height: 1.1;
    margin-bottom: 8px;
}

.sidebar-brand p { 
    font-size: 10px; 
    color: #71717a; 
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 600;
}

.sidebar-menu {
    flex: 1;
    overflow-y: auto;
    padding: 0 20px 30px;
}

.sidebar-menu::-webkit-scrollbar { display: none; } /* Scrollbar disembunyikan untuk rupa bersih */

.menu-label {
    font-size: 10px;
    font-weight: 700;
    color: #000000;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin: 30px 0 15px 15px;
    border-bottom: 1px solid #000;
    display: inline-block;
    padding-bottom: 4px;
}

.menu-btn {
    width: 100%;
    text-align: left;
    padding: 16px 20px;
    background: transparent;
    border: none;
    border-radius: 0; /* Tiada bucu bulat, gaya brutalist moden */
    font-size: 15px;
    font-weight: 500;
    color: #52525b;
    cursor: pointer;
    margin-bottom: 4px;
    transition: all 0.2s ease;
    border-left: 2px solid transparent;
}

.menu-btn .icon { display: none !important; }

.menu-btn:hover {
    color: #000000;
    padding-left: 25px;
}

.menu-btn.active {
    background: #f4f4f5; 
    color: #000000;
    font-weight: 700;
    border-left: 2px solid #000000; 
}

/* --- 3. KANDUNGAN UTAMA --- */
.main-content {
    flex: 1;
    overflow-y: auto;
    padding: 60px 80px; 
    background: #f4f4f5; 
    position: relative;
    scroll-behavior: smooth;
}

.main-header { text-align: left; margin-bottom: 60px; }
.main-header h1 { font-size: 42px; color: #000000; margin-bottom: 12px; font-weight: 900; letter-spacing: -2px; }
.main-header p { font-size: 16px; color: #52525b; font-weight: 400; max-width: 600px; }

/* --- 4. GRID & KAD KALKULATOR (MONOLITIK) --- */
.calculator-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); 
    gap: 40px; 
    align-items: start; 
    grid-auto-flow: dense; 
}

.calculator-card {
    background: #ffffff;
    border-radius: 0px; /* Bucu tajam korporat */
    padding: 50px 40px; 
    box-shadow: none; 
    border: 1px solid #d4d4d8; 
    position: relative;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    width: 100%;
}

.calculator-card:hover { 
    box-shadow: 20px 20px 0px #e4e4e7; /* Bayang-bayang blok brutalist */
    transform: translate(-5px, -5px);
}

.rumusan-card { grid-column: 1 / -1 !important; }

.calculator-card h2 { 
    text-align: left; color: #000000; font-size: 24px; font-weight: 800;
    margin-bottom: 40px; letter-spacing: -1px; text-transform: uppercase;
}

.hidden-template { display: none !important; }

.close-card-btn {
    position: absolute; top: 20px; right: 20px; background: transparent; color: #000; 
    border: 1px solid #000; width: 30px; height: 30px; font-size: 12px; 
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;
}
.close-card-btn:hover { background: #000; color: #fff; }

/* --- 5. BENTUK FORM & INPUT (GAYA DOKUMEN RASMI) --- */
.form-group { margin-bottom: 25px; }
.form-group label { display: block; font-weight: 700; color: #000000; margin-bottom: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }

.salary-input, .salary-total, .number-input, .date-input, .select-input {
    width: 100%; padding: 18px 0; border: none; border-bottom: 2px solid #e4e4e7; border-radius: 0; 
    font-size: 18px; outline: none; background: transparent; color: #000000; font-weight: 500; 
    transition: all 0.3s ease;
}

.salary-input:focus, .number-input:focus, .date-input:focus, .select-input:focus { 
    border-bottom: 2px solid #000000; 
}
.salary-total { font-weight: 800; color: #000000; border-bottom: 2px dashed #000000; }

/* --- 6. BUTANG KIRA & RESET (HIGH CONTRAST) --- */
.button-group { display: flex; gap: 20px; margin: 40px 0 20px; }
.btn { 
    flex: 1; padding: 18px; border: none; border-radius: 0; font-weight: 700; 
    font-size: 13px; cursor: pointer; transition: all 0.2s ease; text-transform: uppercase; letter-spacing: 2px;
}
.btn-primary { 
    background: #000000; 
    color: #ffffff;
}
.btn-primary:hover { background: #3f3f46; }

.btn-reset { background: transparent; color: #000000; border: 1.5px solid #000000; }
.btn-reset:hover { background: #000000; color: #ffffff; }

/* --- 7. KOTAK KEPUTUSAN (LAPORAN KORPORAT) --- */
.result-box { 
    background: #fafafa; border: 1px solid #e4e4e7; 
    border-radius: 0; padding: 30px; margin-top: 30px; 
}
.result-box h3 { text-align: left; font-size: 11px; font-weight: 800; color: #000000; margin-bottom: 20px; margin-top: 0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #d4d4d8; padding-bottom: 10px; }

.result-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #e4e4e7; }
.result-row:last-child { border-bottom: none; }
.result-row span { font-size: 14px; font-weight: 500; color: #52525b; }
.result-row strong { font-size: 16px; color: #000000; text-align: right; font-weight: 800; }

.highlight-row { background: #000000; color: #ffffff; padding: 25px !important; margin-top: 20px; border-bottom: none !important; }
.highlight-row span { color: #a1a1aa !important; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.highlight-row strong { font-size: 28px !important; color: #ffffff !important; font-weight: 900; letter-spacing: -1px; }

/* --- 8. BUTANG TERAPUNG (FLOATING ACTION) --- */
.btn-floating {
    position: fixed; z-index: 1000; border: none; font-weight: 700; cursor: pointer; transition: 0.2s;
    text-transform: uppercase; letter-spacing: 1px; font-size: 12px; border-radius: 0;
}
.log-keluar { 
    top: 40px; right: 40px; color: #000000; background: #ffffff;
    padding: 15px 25px; border: 2px solid #000000;
}
.log-keluar:hover { background: #000000; color: #ffffff; }

.reset-semua-baru { 
    bottom: 40px; right: 40px; 
    background: #ffffff; color: #ef4444; border: 2px solid #ef4444;
    padding: 15px 25px; 
}
.reset-semua-baru:hover { background: #ef4444; color: #ffffff; }

/* --- 9. TABLE SEKSYEN 18A & RUMUSAN --- */
.section18a-header { display: flex; background: #000000; color: #ffffff; font-weight: 700; padding: 20px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;}
.section18a-row { display: flex; background: #ffffff; border-bottom: 1px solid #e4e4e7; padding: 20px; }
.section18a-header span, .section18a-row span { flex: 1; text-align: center; font-size: 15px; }
.section18a-header span:first-child, .section18a-row span:first-child { text-align: left; }

#jadualRumusan { width: 100%; border-collapse: collapse; margin-top: 20px; }
#jadualRumusan th { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #000; border-bottom: 2px solid #000; padding: 20px 15px; text-align: left; }
#jadualRumusan td { font-size: 15px; border-bottom: 1px solid #e4e4e7; padding: 20px 15px; font-weight: 500; background: #ffffff; }

/* --- 10. WARNING BOX --- */
.warning-box { background: transparent; border: 2px solid #000000; padding: 35px; margin-top: 40px; position: relative; }
.warning-box::before { content: 'PERINGATAN'; position: absolute; top: -10px; left: 20px; background: #f4f4f5; padding: 0 10px; font-weight: 800; font-size: 12px; letter-spacing: 1px; }

/* --- 11. RESPONSIVE --- */
@media screen and (max-width: 900px) {
    .app-layout { flex-direction: column; overflow-y: auto; }
    .sidebar-2026 { width: 100%; height: auto; border-right: none; border-bottom: 1px solid #d4d4d8; padding-bottom: 10px; }
    .sidebar-menu { display: flex; overflow-x: auto; padding: 10px 20px; white-space: nowrap; gap: 10px; }
    .menu-label { display: none; }
    .menu-btn { width: auto; padding: 10px 20px; border: 1px solid #e4e4e7; margin: 0; }
    .menu-btn.active { border: 1px solid #000; border-left: 1px solid #000; }
    .main-content { overflow-y: visible; padding: 30px 20px; }
    body { overflow: auto; }
    .calculator-card { flex: 1 1 100%; max-width: 100%; padding: 30px 20px; }
    .calculator-card:hover { transform: none; box-shadow: none; }
    .btn-floating.log-keluar, .btn-floating.reset-semua-baru { position: static; width: 100%; margin-top: 20px; display: block; text-align: center; }
}

/* Memastikan cetakan PDF kekal kemas */
@media print {
    body { background: white !important; }
    .sidebar-2026, .btn-floating, .button-group, .close-card-btn { display: none !important; }
    .main-content { padding: 0; overflow: visible; }
    .calculator-card { box-shadow: none !important; border: 1px solid #000 !important; break-inside: avoid; background: white !important; padding: 20px; margin-bottom: 20px; }
    .salary-input, .result-box { border: 1px solid #000 !important; }
    #previewActionBar, #modalPengaduOverlay { display: none !important; }
}
