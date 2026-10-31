// Landing-page copy stays together so the Indonesian and English offers match.
import { formatRupiah, SATSET_OFFER } from "./offer";

const idPrice = formatRupiah(SATSET_OFFER.monthlyPrice, "id");
const enPrice = formatRupiah(SATSET_OFFER.monthlyPrice, "en");

export const COPY = {
  id: {
    nav: {
      menu: "Menu",
      language: "Bahasa",
      how: "Cara kerja",
      features: "Fitur",
      pricing: "Harga",
      demo: "Demo",
      contact: "Chat WhatsApp",
      switchLanguage: "Switch to English",
    },
    hero: {
      eyebrow: "SATSET UNTUK RESTORAN",
      title: "Pesanan lancar. Resto tetap jalan.",
      description:
        "Hubungkan pelayan, dapur, dan kasir lewat Wi-Fi lokal. Pakai Android milikmu, tetap jalan saat internet mati.",
      offerLabel: `Untuk ${SATSET_OFFER.monthlyOutletLimit} outlet baru setiap bulan`,
      price: idPrice,
      period: "/ outlet / bulan",
      termsLink: "Lihat ketentuan promo",
      contact: "Chat WhatsApp",
      demo: "Coba demo Android",
      imageAlt:
        "Ilustrasi pelayan dan dapur restoran yang terhubung melalui Wi-Fi lokal",
    },
    how: {
      title: "Satu Wi-Fi. Satu tim.",
      description:
        "Satu perangkat jadi pusat data. Perangkat staf bergabung di Wi-Fi yang sama.",
      steps: [
        {
          title: "Siapkan server",
          description: "Pilih satu HP atau tablet Android sebagai pusat data outlet.",
        },
        {
          title: "Hubungkan tim",
          description: "Pilih server yang ditemukan di Wi-Fi lokal, lalu masuk dengan PIN staf.",
        },
        {
          title: "Layani pesanan",
          description: "Pesanan sampai ke dapur dan statusnya terlihat langsung oleh tim.",
        },
      ],
      note: "Operasional di jaringan lokal tetap berjalan tanpa internet. Pemantauan jarak jauh memakai snapshot cloud opsional dan membutuhkan internet.",
    },
    features: {
      title: "Dari meja ke kasir.",
      description: "Lihat tampilan asli SatSet dari rekaman aplikasi, sebelum mengunduh demo.",
      screenshotLabel: "Tampilan demo aplikasi",
      enlarge: "Perbesar tampilan",
      reports: "Laporan pemilik menampilkan penjualan lunas dan bisa diekspor. Akses staf mengikuti peran masing-masing.",
      screens: {
        floor: { title: "Pantau meja", description: "Lihat meja kosong, pesanan aktif, dan makanan siap antar.", alt: "Tampilan asli SatSet: meja D2 dan D3 berstatus siap di antara meja kosong." },
        orders: { title: "Susun pesanan", description: "Pilih menu bergambar, atur jumlah, dan kirim ke dapur.", alt: "Tampilan asli SatSet: katalog menu bergambar dan keranjang pesanan meja D2." },
        kitchen: { title: "Ikuti antrean dapur", description: "Pantau pesanan, catatan tamu, dan waktu tunggu dalam satu layar.", alt: "Tampilan asli SatSet: antrean persiapan untuk meja D2 dan D3 dengan penghitung waktu." },
        cashier: { title: "Selesaikan tagihan", description: "Pisahkan tagihan, simpan bukti bayar, dan cetak struk.", alt: "Tampilan asli SatSet: rincian tagihan meja D2 dan pembayaran tunai." },
      },
    },
    pricing: {
      title: "Satu outlet. Satu harga.",
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
      contact: "Chat WhatsApp",
    },
    demo: {
      eyebrow: "COBA SEBELUM BERLANGGANAN",
      title: "Coba di Android milikmu.",
      description:
        "Unduh APK, masuk dengan akun demo, lalu jelajahi data contoh restoran. Tidak perlu pembayaran untuk mencoba.",
      download: "Unduh APK demo",
      downloadSize: "Sekitar 113 MB · Sebaiknya unduh lewat Wi-Fi.",
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
        "Punya HP kedua? Pasang APK yang sama, pilih Client, lalu pilih server di Wi-Fi lokal untuk mencoba bersama.",
    },
    faq: {
      title: "Sebelum mulai.",
      items: [
        { question: "Perangkat apa yang dibutuhkan?", answer: "HP atau tablet Android 10 ke atas dan jaringan Wi-Fi lokal. Satu perangkat memakai mode Server; perangkat staf memakai mode Client di jaringan yang sama." },
        { question: "Tetap jalan saat internet mati?", answer: "Pesanan, dapur, dan kasir bekerja lewat Wi-Fi lokal. Login admin awal, verifikasi akun berkala, dan pemantauan jarak jauh membutuhkan internet. Memulai ulang server secara offline dibatasi 7 hari sejak verifikasi akun terakhir." },
        { question: "Bagaimana jika perangkat Server mati?", answer: "Perangkat Server harus tetap menyala dan terhubung ke Wi-Fi selama layanan. Jika mati, nyalakan dan jalankan server kembali agar perangkat staf dapat tersambung lagi." },
        { question: "Bisa memakai printer sendiri?", answer: "SatSet mendukung printer struk ESC/POS lewat jaringan dan printer Bluetooth yang sudah dipasangkan ke Android. Konfirmasikan model printer lewat WhatsApp sebelum membeli." },
      ],
      support: "Butuh bantuan memilih perangkat? Tim Activid siap membantu.",
      supportLink: "Kontak Activid",
    },
    footer: {
      tagline: "Operasional lokal · Koneksi perangkat terenkripsi",
      contact: "Chat WhatsApp",
    },
    whatsappMessage:
      `[SatSet] Halo, saya ingin bertanya tentang promo ${idPrice} per outlet per bulan dan ketersediaan kuota bulan ini.`,
  },
  en: {
    nav: {
      menu: "Menu",
      language: "Language",
      how: "How it works",
      features: "Features",
      pricing: "Pricing",
      demo: "Demo",
      contact: "Chat WhatsApp",
      switchLanguage: "Ganti ke Bahasa Indonesia",
    },
    hero: {
      eyebrow: "SATSET FOR RESTAURANTS",
      title: "Keep service moving.",
      description:
        "Orders, kitchen, and payments on Android. Connect over local Wi-Fi, even when the internet drops.",
      offerLabel: `For ${SATSET_OFFER.monthlyOutletLimit} new outlets each month`,
      price: enPrice,
      period: "/ outlet / month",
      termsLink: "See offer terms",
      contact: "Chat WhatsApp",
      demo: "Try the Android demo",
      imageAlt:
        "Illustration of a restaurant server and kitchen connected over local Wi-Fi",
    },
    how: {
      title: "One network. One team.",
      description:
        "One device holds your restaurant data. Staff devices join it on the same Wi-Fi.",
      steps: [
        {
          title: "Set up a server",
          description: "Choose one Android phone or tablet as your outlet's data hub.",
        },
        {
          title: "Connect your team",
          description: "Select the server found on your Wi-Fi, then sign in with a staff PIN.",
        },
        {
          title: "Serve orders",
          description: "Orders reach the kitchen and their status stays visible to the team.",
        },
      ],
      note: "Local service continues without internet. Optional cloud snapshots for remote monitoring require an internet connection.",
    },
    features: {
      title: "From table to payment.",
      description: "Explore real SatSet screens from the app recording before downloading the demo.",
      screenshotLabel: "Demo app screen, shown in Indonesian",
      enlarge: "Enlarge screen",
      reports: "Owner reports show settled sales and can be exported. Staff access follows each person's role.",
      screens: {
        floor: { title: "See your tables", description: "Spot available tables, active orders, and food ready to serve.", alt: "Actual SatSet table screen: D2 and D3 are ready, alongside available tables." },
        orders: { title: "Build an order", description: "Choose from a photo menu, adjust quantities, and send to the kitchen.", alt: "Actual SatSet order screen with a photo menu and the cart for table D2." },
        kitchen: { title: "Follow the kitchen queue", description: "Keep orders, guest notes, and waiting times together.", alt: "Actual SatSet kitchen queue for tables D2 and D3, with order timers." },
        cashier: { title: "Settle the bill", description: "Split bills, save payment proof, and print receipts.", alt: "Actual SatSet cashier screen showing table D2's bill and cash payment." },
      },
    },
    pricing: {
      title: "One outlet. One price.",
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
      contact: "Chat WhatsApp",
    },
    demo: {
      eyebrow: "TRY BEFORE SUBSCRIBING",
      title: "Try it on your Android.",
      description:
        "Download the APK, sign in with a demo account, and explore sample restaurant data. No payment needed.",
      download: "Download demo APK",
      downloadSize: "About 113 MB · Wi-Fi download recommended.",
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
        "Have a second phone? Install the same APK, choose Client, and select the server on your local Wi-Fi to try it together.",
    },
    faq: {
      title: "Before you start.",
      items: [
        { question: "What devices do I need?", answer: "Android phones or tablets running Android 10 or newer, plus local Wi-Fi. One device runs Server mode; staff devices use Client mode on the same network." },
        { question: "What happens if the internet drops?", answer: "Orders, kitchen service, and payments use local Wi-Fi. Initial admin sign-in, periodic account checks, and remote monitoring need internet. Offline server restarts are limited to 7 days after the last account verification." },
        { question: "What if the Server device turns off?", answer: "Keep the Server device powered on and connected to Wi-Fi throughout service. If it turns off, restart the device and server so staff devices can reconnect." },
        { question: "Can I use my own printer?", answer: "SatSet supports network ESC/POS receipt printers and Bluetooth printers already paired with Android. Check your printer model with us on WhatsApp before buying." },
      ],
      support: "Need help choosing devices? The Activid team can help.",
      supportLink: "Contact Activid",
    },
    footer: {
      tagline: "Local operation · Encrypted device connections",
      contact: "Chat WhatsApp",
    },
    whatsappMessage:
      `[SatSet] Hello, I'd like to ask about the ${enPrice} per outlet monthly offer and availability this month.`,
  },
} as const;

export type Lang = keyof typeof COPY;
