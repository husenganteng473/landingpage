// Alpine.js Data for Voucher System
function voucherSystem() {
    // Generate a session-persistent invoice ID for a specific package
    function generateInvoiceId(packageName) {
        // Create a key specific to the package
        const storageKey = `invoiceId_${packageName}`;
        
        // Always generate a new ID (not using sessionStorage for persistence)
        const newId = `TH-${packageName.substring(0, 2).toUpperCase()}${Date.now()}`;
        return newId;
    }

    return {
        isModalOpen: false,
        selectedPackage: '',
        selectedPrice: '0',
        invoiceId: '',
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
            // Generate a new invoice ID each time modal is opened
            this.invoiceId = generateInvoiceId(name);
            this.updateWhatsAppLink();
            
            // Initialize Lucide icons after modal opens
            setTimeout(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 100);
        },

        // Function to update the WhatsApp link with current information
        updateWhatsAppLink() {
            let message = `Halo Tuyul Helper, saya ingin konfirmasi pembayaran untuk paket ${this.selectedPackage}. ID Invoice: ${this.invoiceId}`;
            
            // Add price information
            const finalPrice = this.finalPrice();
            message += `. Harga yang dibayar: Rp${this.formatPrice(finalPrice)}`;
            
            // Add voucher information if a voucher is applied
            if (this.voucherApplied && this.voucherCode) {
                message += `. Menggunakan kode voucher: ${this.voucherCode.toUpperCase()}`;
            }
            
            this.whatsappLink = `https://wa.me/6287728950115?text=${encodeURIComponent(message)}`;
        },

        // Function to simulate payment confirmation (generates new ID)
        confirmPayment() {
            // Generate a new invoice ID for this package
            this.invoiceId = generateInvoiceId(this.selectedPackage);
            
            // Update the WhatsApp link with the new ID
            this.updateWhatsAppLink();
            
            // Here you would typically handle the payment confirmation logic
            // For example, sending data to a server or showing a success message
            alert('Pembayaran berhasil dikonfirmasi! Invoice baru telah dibuat untuk transaksi selanjutnya.');
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
            
            // Update WhatsApp link to include voucher information
            this.updateWhatsAppLink();
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