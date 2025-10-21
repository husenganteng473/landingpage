// Alpine.js Data for Voucher System
function voucherSystem() {
    return {
        isModalOpen: false,
        selectedPackage: '',
        selectedPrice: '0',
        invoiceId: `TH-${Date.now()}`,
        whatsappLink: '',
        voucherCode: '',
        discount: 0,
        vouchers: {},
        voucherStatus: '',
        voucherApplied: false,
        plans: [
            { name: '1 Bulan', old: null, price: 'Rp180.000', discount: null },
            { name: '3 Bulan', old: 'Rp450.000', price: 'Rp480.000', discount: '-11%' },
            { name: '6 Bulan', old: 'Rp900.000', price: 'Rp720.000', discount: '-33%', popular: true },
            { name: '12 Bulan', old: 'Rp1.800.000', price: 'Rp1.200.000', discount: '-44%' }
        ],

        async loadVouchers() {
            try {
                // FIX: Using path relative to root
                const res = await fetch('/assets/voucher.json'); 
                if (!res.ok) throw new Error('Gagal memuat voucher');
                this.vouchers = await res.json();
                console.log('Vouchers loaded:', this.vouchers);
            } catch (e) {
                console.warn('Gagal memuat voucher.json, pakai fallback default.');
                this.vouchers = { "HEMAT20": 0.2, "PROMO50": 0.5, "DISKON10": 0.1 };
            }
        },

        openModal(name, price) {
            this.selectedPackage = name;
            this.selectedPrice = price;
            this.isModalOpen = true;
            this.discount = 0;
            this.voucherCode = '';
            this.voucherStatus = '';
            this.voucherApplied = false;
            this.invoiceId = `TH-${Date.now()}`; // Buat ID baru setiap modal dibuka
            this.whatsappLink = `https://wa.me/6287728950115?text=${encodeURIComponent(
                `Halo Tuyul Helper, saya ingin konfirmasi pembayaran untuk paket ${name}. ID Invoice: ${this.invoiceId}`
            )}`;
            
            // Initialize Lucide icons after modal opens
            setTimeout(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 100);
        },

        applyVoucher() {
            const code = this.voucherCode.trim().toUpperCase();
            if (this.vouchers[code]) {
                this.discount = this.vouchers[code];
                this.voucherApplied = true;
                this.voucherStatus = `Voucher ${code} berhasil diterapkan! Diskon ${(this.discount * 100)}%.`;
            } else {
                this.discount = 0;
                this.voucherApplied = false;
                this.voucherStatus = 'Kode voucher tidak valid.';
            }
        },

        finalPrice() {
            const raw = parseInt(this.selectedPrice.replace(/\D/g, '')) || 0;
            return raw - (raw * this.discount);
        },

        formatPrice(num) {
            return num.toLocaleString('id-ID');
        },

        copyToClipboard(text) {
            if (!navigator.clipboard) {
                alert('Clipboard tidak didukung di browser ini.');
                return;
            }
            navigator.clipboard.writeText(text)
                .then(() => alert('Nomor rekening berhasil disalin!'))
                .catch(err => console.error('Gagal salin:', err));
        }
    };
}

// Initialize Lucide icons when Alpine.js is ready
document.addEventListener('alpine:init', () => {
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 100);
});