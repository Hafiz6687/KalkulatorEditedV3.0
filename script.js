function tunjukTourElaun(targetContainer) {
    // Sembunyikan/buang overlay sedia ada jika wujud
    let existingOverlay = document.getElementById('tourElaunOverlay');
    if (existingOverlay) existingOverlay.remove();
    let existingPopover = document.getElementById('tourElaunPopoverWrapper');
    if (existingPopover) existingPopover.remove();

    // 1. Overlay Latar Belakang (Skrin Penuh)
    let overlay = document.createElement('div');
    overlay.id = 'tourElaunOverlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.7); z-index: 999998; backdrop-filter: blur(3px); transition: opacity 0.3s;';

    // 2. Kotak Pop-up Berpusat (Penuh & Responsif)
    let popoverWrapper = document.createElement('div');
    popoverWrapper.id = 'tourElaunPopoverWrapper';
    popoverWrapper.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999999; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; pointer-events: none;';

    popoverWrapper.innerHTML = `
        <div class="tour-popover-box" style="pointer-events: auto; background: white; border-radius: 12px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.4); padding: 25px; border-top: 6px solid #d9534f; color: #333; font-family: sans-serif; cursor: default; animation: floatUpTour 0.3s ease-out; text-align: left; box-sizing: border-box;">
            
            <h4 style="margin: 0 0 12px 0; color: #1f4e79; font-size: 16px; font-weight: bold; display: flex; align-items: center; gap: 10px;">
                <span style="background: #1f4e79; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0;">💡</span>
                Panduan Maklumat Elaun
            </h4>
            
            <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; color: #333;">
                Elaun <span style="color:#d9534f; text-decoration: underline;">SELAIN / TIDAK TERMASUK:</span>
            </p>
            
            <ul style="margin: 0 0 15px 0; padding-left: 20px; font-size: 12px; color: #444; line-height: 1.6;">
                <li style="margin-bottom: 6px;"><strong>NILAI</strong> tempat tinggal, bekalan makanan, minyak, lampu, air, rawatan perubatan atau yang diluluskan JTK;</li>
                <li style="margin-bottom: 6px;">Bayaran <strong>CARUMAN</strong>;</li>
                <li style="margin-bottom: 6px;">Elaun Pengangkutan (Kenderaan/minyak (yang sama erti dengannya));</li>
                <li style="margin-bottom: 6px;">Bayaran Khas untuk tujuan perbelanjaan pekerjaan;</li>
                <li style="margin-bottom: 6px;">Bayaran persaraan/pemberhentian/pampasan;</li>
                <li>Bonus tahunan.</li>
            </ul>
            
            <p style="margin: 0 0 20px 0; font-size: 12px; font-weight: bold; color: #d9534f; background: #fff0f0; padding: 10px; border-radius: 6px; border-left: 4px solid #d9534f; line-height: 1.4;">
                * DAN TIDAK TERMASUK bayaran yang dibayar di luar waktu kerja normal.
            </p>
            
            <button id="btnTutupTour" style="width: 100%; background: #1f4e79; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: bold; font-size: 14px; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(31,78,121,0.2);">OK, SAYA FAHAM</button>
        </div>
        <style>
            @keyframes floatUpTour { 
                0% { opacity: 0; transform: translateY(20px) scale(0.95); } 
                100% { opacity: 1; transform: translateY(0) scale(1); } 
            }
            #btnTutupTour:hover { background: #153859 !important; }
        </style>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popoverWrapper);

    const tutupTour = () => {
        overlay.remove();
        popoverWrapper.remove();
    };

    overlay.addEventListener('click', tutupTour);
    document.getElementById('btnTutupTour').addEventListener('click', tutupTour);
}

function tunjukTourElaunPopup() {
    let existingOverlay = document.getElementById('tourElaunPopupOverlay');
    if (existingOverlay) existingOverlay.remove();
    let existingPopover = document.getElementById('tourElaunPopupWrapper');
    if (existingPopover) existingPopover.remove();

    let overlay = document.createElement('div');
    overlay.id = 'tourElaunPopupOverlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.7); z-index: 999998; backdrop-filter: blur(3px); transition: opacity 0.3s;';

    let popoverWrapper = document.createElement('div');
    popoverWrapper.id = 'tourElaunPopupWrapper';
    popoverWrapper.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999999; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; pointer-events: none;';

    popoverWrapper.innerHTML = `
        <div class="tour-popover-box" style="pointer-events: auto; background: white; border-radius: 12px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.4); padding: 25px; border-top: 6px solid #d9534f; color: #333; font-family: sans-serif; cursor: default; animation: floatUpTour 0.3s ease-out; text-align: left; box-sizing: border-box;">
            
            <h4 style="margin: 0 0 12px 0; color: #1f4e79; font-size: 16px; font-weight: bold; display: flex; align-items: center; gap: 10px;">
                <span style="background: #1f4e79; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0;">💡</span>
                Panduan Senarai Elaun
            </h4>
            
            <p style="margin: 0 0 20px 0; font-size: 12.5px; font-weight: bold; color: #1f4e79; background: #e8eaed; padding: 12px; border-radius: 6px; line-height: 1.5;">
                CATATAN: Klik + Tambah. Masukkan semua ELAUN selain yang telah dinyatakan di dalam Bahagian Kalkulator (Sama ada dibayar di dalam waktu kerja normal atau di luar waktu kerja normal).
            </p>
            
            <button id="btnTutupTourPopup" style="width: 100%; background: #1f4e79; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: bold; font-size: 14px; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(31,78,121,0.2);">OK, SAYA FAHAM</button>
        </div>
        <style>
            @keyframes floatUpTour { 
                0% { opacity: 0; transform: translateY(20px) scale(0.95); } 
                100% { opacity: 1; transform: translateY(0) scale(1); } 
            }
            #btnTutupTourPopup:hover { background: #153859 !important; }
        </style>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popoverWrapper);

    const tutupTourPopup = () => {
        overlay.remove();
        popoverWrapper.remove();
    };

    overlay.addEventListener('click', tutupTourPopup);
    document.getElementById('btnTutupTourPopup').addEventListener('click', tutupTourPopup);
}
