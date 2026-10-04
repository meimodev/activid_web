// Landing-page copy stays together so the Indonesian and English offers match.
import { formatRupiah, SATSET_OFFER } from "./offer";

const idPrice = formatRupiah(SATSET_OFFER.monthlyPrice, "id");
const enPrice = formatRupiah(SATSET_OFFER.monthlyPrice, "en");
const idRegularPrice = formatRupiah(SATSET_OFFER.regularMonthlyPrice, "id");
const enRegularPrice = formatRupiah(SATSET_OFFER.regularMonthlyPrice, "en");

export const COPY = {
  id: {
    nav: {
      how: "Cara kerja",
      features: "Fitur",
      pricing: "Harga",
      demo: "Demo",
      contact: "Tanya promo",
      switchLanguage: "Switch to English",
    },
    hero: {
      eyebrow: "SATSET UNTUK RESTORAN",
      title: "Pesanan lancar. Resto tetap jalan.",
      description:
        "Hubungkan pelayan, dapur, dan kasir lewat Wi-Fi lokal. Jalankan layanan harian di HP atau tablet Android milikmu, bahkan saat internet mati.",
      offerLabel: `PROMO UNTUK ${SATSET_OFFER.monthlyOutletLimit} OUTLET BARU SETIAP BULAN`,
      price: idPrice,
      period: "/ outlet / bulan",
      regular: `Harga normal ${idRegularPrice} per outlet per bulan`,
      termsLink: "Lihat ketentuan promo",
      contact: "Tanya promo via WhatsApp",
      demo: "Coba demo Android",
      imageAlt:
        "Ilustrasi pelayan dan dapur restoran yang terhubung melalui Wi-Fi lokal",
    },
    how: {
      eyebrow: "CARA KERJA",
      title: "Dari meja ke dapur, tetap jalan saat internet mati.",
      description:
        "Satu perangkat menyimpan data restoran. Perangkat lain terhubung setelah pengaturan awal, lalu bekerja bersama di jaringan lokal.",
      steps: [
        {
          title: "Siapkan server",
          description: "Pilih satu HP atau tablet Android sebagai pusat data outlet.",
        },
        {
          title: "Hubungkan tim",
          description: "Pasangkan perangkat staf dengan memindai kode QR dari server.",
        },
        {
          title: "Layani pesanan",
          description: "Pesanan sampai ke dapur dan statusnya terlihat langsung oleh tim.",
        },
      ],
      note: "Operasional di jaringan lokal tetap berjalan tanpa internet. Pemantauan jarak jauh memakai snapshot cloud opsional dan membutuhkan internet.",
    },
    features: {
      eyebrow: "SATU ALUR UNTUK SATU SHIFT",
      title: "Yang dibutuhkan tim, di tempat yang tepat.",
      items: [
        {
          title: "Layanan & meja",
          description:
            "Kelola reservasi, pindahkan tamu bersama pesanannya, urus takeaway, dan terima pesanan dari menu QR tamu.",
        },
        {
          title: "Pesanan & dapur",
          description:
            "Pesanan muncul langsung di layar dapur. Atur menu dan stok, lalu tandai item yang terlambat.",
        },
        {
          title: "Kasir & tim",
          description:
            "Pisah tagihan, simpan bukti bayar, cetak struk, dan lacak tindakan staf melalui akses berbasis peran.",
        },
        {
          title: "Laporan pemilik",
          description: "Lihat penjualan lunas dan ekspor laporan.",
        },
      ],
    },
    pricing: {
      eyebrow: "HARGA SATSET",
      title: "Harga jelas untuk satu outlet.",
      description:
        "Promo berlaku untuk paket software SatSet yang sama dengan harga normal. Hubungi kami untuk mengecek ketersediaan bulan ini.",
      regularLabel: "Harga normal",
      promoLabel: "Harga promo",
      period: "per outlet per bulan",
      benefits: [
        `Untuk ${SATSET_OFFER.monthlyOutletLimit} outlet baru pertama yang mulai berlangganan setiap bulan kalender.`,
        `Harga promo tetap ${idPrice} per outlet per bulan selama langganan outlet aktif.`,
        "Tanpa biaya setup wajib atau biaya cloud terpisah untuk operasional lokal.",
      ],
      hardware:
        "Perangkat Android dan printer disediakan oleh masing-masing outlet. Snapshot cloud untuk pemantauan jarak jauh bersifat opsional.",
      contact: "Tanya ketersediaan promo",
    },
    demo: {
      eyebrow: "COBA SEBELUM BERLANGGANAN",
      title: "Jalankan demo di Android milikmu.",
      description:
        "Unduh APK publik, masuk dengan akun demo, lalu muat data contoh restoran untuk menjelajahi meja, dapur, dan laporan. Tidak perlu pembayaran untuk mencoba.",
      download: "Unduh APK demo",
      release: "Buka halaman rilis jika unduhan bermasalah",
      requirement: "Memerlukan Android 10 atau lebih baru.",
      stepsTitle: "Mulai dalam tiga langkah",
      steps: [
        "Pasang APK dari tautan resmi, buka SatSet, lalu pilih mode Server.",
        "Masuk memakai salah satu akun demo di bawah.",
        "Muat data demo dari menu Venue. Proses awal ini memerlukan sekitar 4 menit.",
      ],
      accountsTitle: "Akun dan PIN demo",
      adminLabel: "Pilih salah satu akun admin",
      passwordLabel: "Password untuk semua akun admin",
      staffLabel: "PIN staf setelah data demo dimuat",
      sideloadTitle: "Panduan pemasangan APK",
      sideloadSteps: [
        "Buka file satset.apk dari unduhan. Pastikan file berasal dari tautan resmi di halaman ini atau halaman rilis SatSet.",
        "Jika Android meminta izin memasang dari sumber ini, periksa sumber file sebelum memberi izin pada aplikasi yang dipakai mengunduh.",
        "Jika Play Protect menampilkan peringatan keamanan, jangan abaikan. Hubungi kami untuk memverifikasi file dan cara pemasangannya.",
      ],
      secondPhone:
        "Punya HP kedua? Pasang APK yang sama, pilih Client, dan scan QR dari perangkat Server untuk mencoba alur pesanan lokal.",
    },
    footer: {
      tagline: "Operasional lokal · Koneksi perangkat terenkripsi",
      contact: "Hubungi kami",
    },
    whatsappMessage:
      `[SatSet] Halo, saya ingin bertanya tentang promo ${idPrice} per outlet per bulan dan ketersediaan kuota bulan ini.`,
  },
  en: {
    nav: {
      how: "How it works",
      features: "Features",
      pricing: "Pricing",
      demo: "Demo",
      contact: "Ask about the offer",
      switchLanguage: "Ganti ke Bahasa Indonesia",
    },
    hero: {
      eyebrow: "SATSET FOR RESTAURANTS",
      title: "Keep orders moving. Keep service running.",
      description:
        "Connect your floor, kitchen, and cashier over local Wi-Fi. Run daily service on your own Android phones or tablets, even when the internet goes down.",
      offerLabel: `OFFER FOR ${SATSET_OFFER.monthlyOutletLimit} NEW OUTLETS EACH MONTH`,
      price: enPrice,
      period: "/ outlet / month",
      regular: `Regular price ${enRegularPrice} per outlet per month`,
      termsLink: "See offer terms",
      contact: "Ask about the offer on WhatsApp",
      demo: "Try the Android demo",
      imageAlt:
        "Illustration of a restaurant server and kitchen connected over local Wi-Fi",
    },
    how: {
      eyebrow: "HOW IT WORKS",
      title: "From table to kitchen, even when the internet is down.",
      description:
        "One device stores your restaurant data. After initial setup, the other devices join it and work together on your local network.",
      steps: [
        {
          title: "Set up a server",
          description: "Choose one Android phone or tablet as your outlet's data hub.",
        },
        {
          title: "Connect your team",
          description: "Pair staff devices by scanning a QR code from the server.",
        },
        {
          title: "Serve orders",
          description: "Orders reach the kitchen and their status stays visible to the team.",
        },
      ],
      note: "Local service continues without internet. Optional cloud snapshots for remote monitoring require an internet connection.",
    },
    features: {
      eyebrow: "ONE FLOW FOR THE WHOLE SHIFT",
      title: "What your team needs, where they need it.",
      items: [
        {
          title: "Floor & tables",
          description:
            "Manage reservations, move a party with its order, handle takeaway, and review orders from guests' QR menus.",
        },
        {
          title: "Orders & kitchen",
          description:
            "Orders appear on the kitchen display right away. Manage menus and stock, and flag overdue items.",
        },
        {
          title: "Cashier & team",
          description:
            "Split bills, keep payment proof, print receipts, and trace staff actions with role-based access.",
        },
        {
          title: "Owner reports",
          description: "See settled sales and export reports.",
        },
      ],
    },
    pricing: {
      eyebrow: "SATSET PRICING",
      title: "Clear pricing for one outlet.",
      description:
        "The offer covers the same SatSet software plan as the regular price. Contact us to check this month's availability.",
      regularLabel: "Regular price",
      promoLabel: "Offer price",
      period: "per outlet per month",
      benefits: [
        `For the first ${SATSET_OFFER.monthlyOutletLimit} new outlets whose paid subscription starts each calendar month.`,
        `The ${enPrice} per outlet per month rate continues while that outlet's subscription stays active.`,
        "No mandatory setup fee or separate cloud fee for local operation.",
      ],
      hardware:
        "Each outlet provides its own Android devices and printers. Cloud snapshots for remote monitoring are optional.",
      contact: "Ask about offer availability",
    },
    demo: {
      eyebrow: "TRY BEFORE SUBSCRIBING",
      title: "Run the demo on your Android device.",
      description:
        "Download the public APK, sign in with a demo account, then load sample restaurant data to explore the floor, kitchen, and reports. No payment is needed to try it.",
      download: "Download demo APK",
      release: "Open the release page if the download stalls",
      requirement: "Requires Android 10 or newer.",
      stepsTitle: "Get started in three steps",
      steps: [
        "Install the APK from the official link, open SatSet, and choose Server mode.",
        "Sign in with one of the demo accounts below.",
        "Load the demo data from the Venue menu. This initial step takes about 4 minutes.",
      ],
      accountsTitle: "Demo accounts and PINs",
      adminLabel: "Choose an admin account",
      passwordLabel: "Password for every admin account",
      staffLabel: "Staff PINs after demo data loads",
      sideloadTitle: "APK installation guide",
      sideloadSteps: [
        "Open satset.apk from your downloads. Make sure the file came from the official link here or the SatSet release page.",
        "If Android requests permission to install from this source, check the file's origin before allowing the app you downloaded it with.",
        "If Play Protect shows a security warning, do not dismiss it. Contact us to verify the file and installation steps.",
      ],
      secondPhone:
        "Have a second phone? Install the same APK, choose Client, and scan the QR code from the Server device to try the local order flow.",
    },
    footer: {
      tagline: "Local operation · Encrypted device connections",
      contact: "Contact us",
    },
    whatsappMessage:
      `[SatSet] Hello, I'd like to ask about the ${enPrice} per outlet monthly offer and availability this month.`,
  },
} as const;

export type Lang = keyof typeof COPY;
