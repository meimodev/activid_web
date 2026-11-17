// Landing-page copy stays together so the Indonesian and English offers match.
// Indonesian is the source: it follows the campaign copy document section by section.
import { formatRupiah, SATSET_OFFER } from "./offer";
import { SATSET_PRODUCT_NAME } from "./brand";

const idPrice = formatRupiah(SATSET_OFFER.monthlyPrice, "id");
const enPrice = formatRupiah(SATSET_OFFER.monthlyPrice, "en");

export const COPY = {
  id: {
    nav: {
      menu: "Menu",
      language: "Bahasa",
      features: "Fitur",
      how: "Cara kerja",
      pricing: "Harga",
      faq: "FAQ",
      contact: "Chat WhatsApp",
      switchLanguage: "Switch to English",
    },
    hero: {
      // Two authored lines: they animate in one after the other.
      title: ["Restoran Ramai Seharusnya Jadi Kabar Baik,", "Bukan Awal Kekacauan."],
      description:
        "SatSet RDS menghubungkan pelayan, dapur, dan kasir dalam satu sistem. Pantau meja, pesanan, antrean dapur, hingga pembayaran melalui perangkat Android.",
      contact: "Konsultasi via WhatsApp",
      demo: "Lihat Demo Aplikasi",
      note: "Gunakan perangkat Android milik Anda. Tidak perlu bergantung pada koneksi internet untuk operasional lokal.",
      imageAlt:
        "SatSet RDS di tablet dan ponsel Android: menu pesanan untuk meja D1 dan denah meja restoran",
    },
    problem: {
      title: "Operasional Restoran Masih Ribet?",
      description:
        "Pesanan tidak terkoordinasi dengan baik bisa membuat pekerjaan tim semakin rumit.",
      items: [
        { role: "Pelayan", text: "harus menyampaikan pesanan secara manual." },
        { role: "Dapur", text: "kesulitan memantau antrean pesanan." },
        { role: "Kasir", text: "harus memastikan kembali pesanan yang masuk." },
        { role: "Pemilik", text: "sulit memantau aktivitas operasional." },
      ],
      turn: "Saatnya kelola semuanya dalam satu sistem.",
    },
    solution: {
      title: "Kenalkan SatSet RDS",
      lead: "Satu sistem untuk menghubungkan seluruh proses pemesanan restoran.",
      body: [
        "Dengan SatSet RDS, pelayan, dapur, dan kasir dapat bekerja dalam satu alur yang terintegrasi.",
        "Tidak perlu lagi mengandalkan pencatatan yang terpisah.",
      ],
      cta: "Lihat Cara Kerja SatSet",
      flow: ["Pelayan", "Dapur", "Kasir"],
    },
    features: {
      title: "Lihat Langsung Cara Kerja SatSet RDS",
      description: "Semua Kebutuhan Operasional dalam Satu Aplikasi",
      items: {
        tables: { title: "Manajemen Meja", description: "Pantau meja dan kelola pesanan pelanggan dengan lebih teratur.", alt: "Rekaman SatSet RDS: denah meja per area dengan status tiap meja." },
        ordering: { title: "Pemesanan Menu", description: "Catat pesanan pelanggan langsung melalui perangkat Android.", alt: "Rekaman SatSet RDS: memilih menu bergambar dan mengirim pesanan ke dapur." },
        kitchen: { title: "Kitchen Display", description: "Pantau antrean pesanan dan status pengerjaan di dapur.", alt: "Rekaman SatSet RDS: antrean persiapan dapur dengan penghitung waktu." },
        cashier: { title: "Sistem Kasir", description: "Kelola tagihan dan proses pembayaran pelanggan.", alt: "Rekaman SatSet RDS: daftar tagihan meja dan proses pembayaran." },
        reports: { title: "Laporan Penjualan", description: "Pantau laporan penjualan yang sudah lunas melalui sistem.", alt: "Rekaman SatSet RDS: laporan penjualan per shift." },
      },
      pause: "Jeda video",
      play: "Putar video",
      contact: "Konsultasi via WhatsApp",
      demo: "Coba Demo Aplikasi",
    },
    offline: {
      title: "Internet Mati? Operasional Tetap Jalan!",
      description: [
        "Tidak perlu khawatir ketika koneksi internet terputus.",
        "SatSet RDS menggunakan jaringan Wi-Fi lokal untuk menghubungkan perangkat dalam satu outlet.",
      ],
      listTitle: "Keunggulannya:",
      items: [
        "Operasional lokal tetap berjalan tanpa internet.",
        "Perangkat terhubung melalui jaringan Wi-Fi lokal.",
        "Tidak harus menggunakan perangkat khusus yang mahal.",
        "Bisa memanfaatkan perangkat Android milik outlet.",
      ],
      note: "Catatan: Login admin awal, verifikasi berkala, dan pemantauan jarak jauh tetap memerlukan koneksi internet.",
      demo: {
        internet: "Internet",
        on: "Tersambung",
        off: "Terputus",
        router: "Wi-Fi lokal outlet",
        devices: ["Pelayan", "Dapur", "Kasir"],
        captionOn: "Internet tersambung. Coba matikan.",
        captionOff: "Internet terputus. Pesanan tetap sampai ke dapur dan kasir.",
      },
    },
    how: {
      title: "Mudah Digunakan, Mudah Dikoordinasikan",
      steps: [
        { title: "Hubungkan Perangkat", description: "Siapkan perangkat Android dan hubungkan ke jaringan Wi-Fi lokal yang sama." },
        { title: "Pesanan Masuk ke Sistem", description: "Pelayan mencatat pesanan melalui aplikasi." },
        { title: "Dapur dan Kasir Memproses", description: "Pesanan dapat dipantau oleh dapur dan kasir dalam satu sistem." },
      ],
      closing: "Sederhana untuk digunakan, lebih terorganisir untuk operasional restoran.",
    },
    pricing: {
      title: `Kelola Operasional Restoran Mulai dari ${idPrice}/Bulan`,
      description:
        "Nikmati sistem pengelolaan restoran yang menghubungkan pelayan, dapur, dan kasir dalam satu aplikasi.",
      regularLabel: "Harga Normal",
      promoLabel: "Harga Promo",
      period: "/ outlet / bulan",
      includesTitle: "Yang Anda dapatkan:",
      includes: ["Manajemen meja.", "Sistem pemesanan.", "Kitchen Display.", "Sistem kasir.", "Laporan penjualan."],
      hardware:
        "Gunakan perangkat Android milik outlet dan mulai kelola operasional restoran melalui satu sistem.",
      contact: "Konsultasi Sekarang via WhatsApp",
    },
    trial: {
      title: "Masih Ragu Sebelum Berlangganan? Coba Dulu, Baru Bayar!",
      offer: "Gratis 7 Hari Tanpa Bayar di Awal",
      description:
        "Kami ingin Anda yakin sebelum berlangganan. Karena itu, nikmati SatSet RDS secara gratis selama 7 hari dan rasakan langsung bagaimana sistem ini membantu operasional restoran Anda.",
      points: [
        "Coba langsung fitur SatSet RDS.",
        "Lihat bagaimana pesanan terhubung ke dapur dan kasir.",
        "Pastikan sistem cocok dengan kebutuhan restoran Anda.",
      ],
      contact: "Konsultasi via WhatsApp",
      demo: "Coba Demo Gratis",
    },
    demo: {
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
      title: "Masih Ada yang Ingin Ditanyakan?",
      items: [
        { question: "Apakah SatSet RDS membutuhkan internet?", answer: "Tidak selalu. Operasional lokal dapat berjalan melalui jaringan Wi-Fi lokal meskipun internet mati. Namun, beberapa fungsi seperti login admin awal dan verifikasi berkala tetap membutuhkan internet." },
        { question: "Apakah harus membeli perangkat baru?", answer: "Tidak harus. SatSet RDS dapat menggunakan perangkat Android milik outlet selama memenuhi spesifikasi aplikasi." },
        { question: "Apakah bisa digunakan oleh pelayan, dapur, dan kasir sekaligus?", answer: "Ya. Perangkat yang terhubung dalam jaringan Wi-Fi lokal dapat digunakan sesuai peran dan pengaturan sistem." },
        { question: "Apakah bisa mencoba sebelum berlangganan?", answer: "Ya. Anda dapat mencoba demo aplikasi untuk melihat cara kerja SatSet RDS." },
        { question: "Berapa biaya berlangganannya?", answer: `Harga promo ${idPrice} per outlet per bulan. Silakan hubungi tim kami untuk informasi paket dan ketentuan berlangganan.` },
        { question: "Bagaimana jika mengalami kendala saat instalasi?", answer: "Hubungi tim Activid untuk mendapatkan informasi bantuan instalasi dan penggunaan." },
      ],
    },
    final: {
      title: "Siap Mengelola Restoran dengan Lebih Teratur?",
      description: [
        "SatSet RDS membantu menghubungkan pelayan, dapur, dan kasir dalam satu sistem.",
        "Lihat demonya, konsultasikan kebutuhan restoran Anda, dan temukan solusi yang tepat untuk operasional bisnis Anda.",
      ],
      contact: "Konsultasi Gratis via WhatsApp",
      note: "Tim kami siap membantu menjelaskan cara kerja dan kebutuhan perangkat SatSet RDS.",
    },
    footer: {
      tagline: "Sistem restoran untuk pelayan, dapur, dan kasir.",
      maker: "Dibuat oleh Activid",
    },
    whatsappMessage:
      `[${SATSET_PRODUCT_NAME}] Halo, saya ingin konsultasi tentang SatSet RDS untuk restoran saya.`,
  },
  en: {
    nav: {
      menu: "Menu",
      language: "Language",
      features: "Features",
      how: "How it works",
      pricing: "Pricing",
      faq: "FAQ",
      contact: "Chat WhatsApp",
      switchLanguage: "Ganti ke Bahasa Indonesia",
    },
    hero: {
      title: ["A Busy Restaurant Should Be Good News,", "Not the Start of Chaos."],
      description:
        "SatSet RDS connects servers, kitchen, and cashier in one system. Track tables, orders, the kitchen queue, and payments from Android devices.",
      contact: "Consult on WhatsApp",
      demo: "See the App Demo",
      note: "Use the Android devices you already own. Local service does not depend on an internet connection.",
      imageAlt:
        "SatSet RDS on an Android tablet and phone: the order menu for table D1 and the restaurant floor plan",
    },
    problem: {
      title: "Is Running the Restaurant Still a Hassle?",
      description:
        "Orders that are not well coordinated make the whole team's work harder.",
      items: [
        { role: "Servers", text: "have to pass orders along by hand." },
        { role: "The kitchen", text: "struggles to keep track of the order queue." },
        { role: "The cashier", text: "has to double-check every incoming order." },
        { role: "The owner", text: "finds it hard to follow daily operations." },
      ],
      turn: "It is time to run it all in one system.",
    },
    solution: {
      title: "Meet SatSet RDS",
      lead: "One system that connects the whole ordering process of your restaurant.",
      body: [
        "With SatSet RDS, servers, kitchen, and cashier work in one integrated flow.",
        "No more relying on separate notes.",
      ],
      cta: "See How SatSet Works",
      flow: ["Server", "Kitchen", "Cashier"],
    },
    features: {
      title: "See SatSet RDS at Work",
      description: "Everything Your Operation Needs in One App",
      items: {
        tables: { title: "Table Management", description: "Watch your tables and manage customer orders in an orderly way.", alt: "SatSet RDS recording: the floor plan by area with each table's status. The app is shown in Indonesian." },
        ordering: { title: "Menu Ordering", description: "Take customer orders directly on an Android device.", alt: "SatSet RDS recording: choosing from a photo menu and sending the order to the kitchen. The app is shown in Indonesian." },
        kitchen: { title: "Kitchen Display", description: "Follow the order queue and preparation status in the kitchen.", alt: "SatSet RDS recording: the kitchen preparation queue with order timers. The app is shown in Indonesian." },
        cashier: { title: "Cashier System", description: "Manage bills and process customer payments.", alt: "SatSet RDS recording: the list of table bills and the payment flow. The app is shown in Indonesian." },
        reports: { title: "Sales Reports", description: "Review reports of settled sales in the system.", alt: "SatSet RDS recording: the per-shift sales report. The app is shown in Indonesian." },
      },
      pause: "Pause video",
      play: "Play video",
      contact: "Consult on WhatsApp",
      demo: "Try the App Demo",
    },
    offline: {
      title: "Internet Down? Service Keeps Running!",
      description: [
        "No need to worry when the internet connection drops.",
        "SatSet RDS uses your local Wi-Fi network to connect the devices in one outlet.",
      ],
      listTitle: "The advantages:",
      items: [
        "Local service keeps running without internet.",
        "Devices connect over the local Wi-Fi network.",
        "No expensive dedicated hardware required.",
        "Works with the Android devices your outlet already has.",
      ],
      note: "Note: the first admin sign-in, periodic verification, and remote monitoring still require an internet connection.",
      demo: {
        internet: "Internet",
        on: "Connected",
        off: "Disconnected",
        router: "Outlet local Wi-Fi",
        devices: ["Server", "Kitchen", "Cashier"],
        captionOn: "Internet is connected. Try switching it off.",
        captionOff: "Internet is down. Orders still reach the kitchen and cashier.",
      },
    },
    how: {
      title: "Easy to Use, Easy to Coordinate",
      steps: [
        { title: "Connect the Devices", description: "Prepare your Android devices and join them to the same local Wi-Fi network." },
        { title: "Orders Enter the System", description: "Servers record orders in the app." },
        { title: "Kitchen and Cashier Process", description: "The kitchen and cashier follow each order in one system." },
      ],
      closing: "Simple to use, better organized for restaurant operations.",
    },
    pricing: {
      title: `Run Your Restaurant from ${enPrice}/Month`,
      description:
        "A restaurant management system that connects servers, kitchen, and cashier in one app.",
      regularLabel: "Regular Price",
      promoLabel: "Offer Price",
      period: "/ outlet / month",
      includesTitle: "What you get:",
      includes: ["Table management.", "Ordering system.", "Kitchen Display.", "Cashier system.", "Sales reports."],
      hardware:
        "Use your outlet's own Android devices and start running the restaurant in one system.",
      contact: "Consult Now on WhatsApp",
    },
    trial: {
      title: "Not Sure About Subscribing Yet? Try First, Pay Later!",
      offer: "Free for 7 Days, Nothing to Pay Upfront",
      description:
        "We want you to be sure before you subscribe. So use SatSet RDS free for 7 days and see for yourself how it helps your restaurant run.",
      points: [
        "Try the SatSet RDS features hands-on.",
        "See how orders reach the kitchen and cashier.",
        "Make sure the system fits your restaurant's needs.",
      ],
      contact: "Consult on WhatsApp",
      demo: "Try the Free Demo",
    },
    demo: {
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
      title: "Still Have Questions?",
      items: [
        { question: "Does SatSet RDS need the internet?", answer: "Not always. Local service runs over your local Wi-Fi network even when the internet is down. Some functions, such as the first admin sign-in and periodic verification, still need internet." },
        { question: "Do I have to buy new devices?", answer: "No. SatSet RDS can run on the Android devices your outlet already has, as long as they meet the app's requirements." },
        { question: "Can servers, kitchen, and cashier use it at the same time?", answer: "Yes. Devices connected to the local Wi-Fi network are used according to each role and your system settings." },
        { question: "Can I try it before subscribing?", answer: "Yes. You can try the app demo to see how SatSet RDS works." },
        { question: "How much is the subscription?", answer: `The offer price is ${enPrice} per outlet per month. Please contact our team for plan details and subscription terms.` },
        { question: "What if I run into trouble during installation?", answer: "Contact the Activid team for help with installation and use." },
      ],
    },
    final: {
      title: "Ready to Run a Better-Organized Restaurant?",
      description: [
        "SatSet RDS helps connect servers, kitchen, and cashier in one system.",
        "See the demo, talk through your restaurant's needs, and find the right fit for your operation.",
      ],
      contact: "Free Consultation on WhatsApp",
      note: "Our team is ready to explain how SatSet RDS works and which devices you need.",
    },
    footer: {
      tagline: "The restaurant system for servers, kitchen, and cashier.",
      maker: "Made by Activid",
    },
    whatsappMessage:
      `[${SATSET_PRODUCT_NAME}] Hello, I'd like a consultation about SatSet RDS for my restaurant.`,
  },
} as const;

export type Lang = keyof typeof COPY;
