// Copy for the SatSet landing page, in both locales. Split out of
// SatsetLanding.tsx so copy edits and markup edits stop colliding.

export type Lang = "id" | "en";

export type Copy = {
  nav: { features: string; day: string; floor: string; reports: string; demo: string; contact: string; download: string };
  hero: {
    badge: string;
    h1a: string;
    h1b: string;
    h1c: string;
    para: string;
    ctaPrimary: string;
    meta1: string;
    meta2: string;
    meta3: string;
    scroll: string;
    table: string;
    chip: string;
    liveStatus: string;
    seated: string;
    ready: string;
    open: string;
    resvName: string;
    resvSub: string;
  };
  features: {
    eyebrow: string;
    h2: string;
    para: string;
    cards: { t: string; d: string }[];
  };
  day: {
    eyebrow: string;
    h2a: string;
    h2b: string;
    para: string;
    rows: { t: string; d: string }[];
  };
  floor: {
    eyebrow: string;
    h2: string;
    para: string;
    items: { t: string; d: string }[];
  };
  reports: {
    eyebrow: string;
    h2: string;
    para: string;
    tag1: string;
    tag2: string;
    tag3: string;
    dashLabel: string;
    vs: string;
    ordersLabel: string;
    avgLabel: string;
    coversLabel: string;
  };
  demo: {
    eyebrow: string;
    h2a: string;
    h2b: string;
    para: string;
    ctaApk: string;
    apkAlt: string;
    sideloadLabel: string;
    sideloadSteps: string[];
    req: string;
    accountsLabel: string;
    passLabel: string;
    stepsLabel: string;
    steps: { t: string; d: string }[];
    bonusLabel: string;
    bonusTitle: string;
    bonusDesc: string;
  };
  cta: { h3a: string; h3b: string; para: string; btn: string };
  footer: { tagline: string };
};

export const COPY: Record<Lang, Copy> = {
  id: {
    nav: { features: "Fitur", day: "Sehari Penuh", floor: "Area Resto", reports: "Laporan", demo: "Coba Sendiri", contact: "Hubungi Kami", download: "Unduh APK" },
    hero: {
      badge: "Pakai Wi-Fi sendiri · Tetap jalan offline",
      h1a: "Sistem restoran",
      h1b: "yang jalan di",
      h1c: "Wi-Fi kamu sendiri.",
      para: "Ubah HP dan tablet Android biasa jadi sistem pemesanan yang lengkap. Pairing lewat QR dalam hitungan detik. Tanpa internet, tanpa tagihan cloud bulanan, tanpa langganan untuk mencatat pesanan.",
      ctaPrimary: "Hubungi Kami",
      meta1: "⎯ Siap pakai dalam hitungan menit",
      meta2: "⎯ Terenkripsi antar perangkat",
      meta3: "⎯ Datamu tetap di jaringanmu",
      scroll: "GULIR",
      table: "Meja 7",
      chip: "Pesanan · Meja 4 → 6",
      liveStatus: "Status langsung",
      seated: "Terisi",
      ready: "Siap",
      open: "Kosong",
      resvName: "Sari · 4 orang",
      resvSub: "Reservasi · segera datang",
    },
    features: {
      eyebrow: "Semua jadi gampang",
      h2: "Dibuat supaya momen tersibuk terasa ringan.",
      para: "Satu aplikasi, dua mode. Tiap perangkat terhubung dalam detik dan langsung sinkron lewat jaringan lokalmu.",
      cards: [
        { t: "Scan untuk terhubung", d: "Perangkat menemukan server otomatis — cukup scan kode untuk terhubung. Tanpa IP, tanpa ketik, tanpa setup." },
        { t: "Jalan tanpa internet", d: "Pesanan melesat dari tangan ke dapur lewat Wi-Fi-mu. Internet mati? Layanan tetap jalan." },
        { t: "Tanpa langganan", d: "Tanpa tagihan cloud bulanan untuk mencatat pesanan. Jalan di perangkat Android yang mungkin sudah kamu punya." },
        { t: "Layar dapur real-time", d: "Pesanan muncul seketika saat dikirim, lengkap dengan waktu penyajian dan item telat yang ditandai otomatis." },
        { t: "Tamu scan untuk pesan", d: "Tamu lihat menu dari HP mereka sendiri — tanpa install aplikasi. Pesanan masuk sebagai pending untuk dicek staf." },
        { t: "Aman sejak awal", d: "Lalu lintas antar perangkat terenkripsi dan login PIN pribadi. Setiap aksi tercatat ke pelakunya." },
      ],
    },
    day: {
      eyebrow: "Sehari penuh bareng SatSet",
      h2a: "Dari tamu datang",
      h2b: "sampai tutup buku.",
      para: "Tiap bagian shift-mu punya tempatnya. Nggak ada yang harus dicatat manual.",
      rows: [
        { t: "Reservasi & atur meja", d: "Catat reservasi, dudukkan tamu, pindahkan ke meja lain — pesanannya ikut pindah." },
        { t: "Bawa pulang", d: "Pesanan takeaway punya nomor antrian sendiri yang mulai lagi dari satu tiap hari." },
        { t: "Menu & stok", d: "Ubah harga dan varian kapan saja. Tandai habis, item langsung hilang dari menu tamu." },
        { t: "Kasir & pisah tagihan", d: "Bayar penuh, pisah per item, atau bagi rata. Non-tunai wajib foto bukti." },
        { t: "Cetak struk & tagihan", d: "Printer LAN atau Bluetooth. Logo dan alamat restomu ikut tercetak di struk." },
        { t: "Staf, role & jejak audit", d: "Atur sendiri siapa boleh apa. Tiap pembatalan tercatat dengan alasan dan nama pelakunya." },
        { t: "Laporan & ekspor", d: "Penjualan, menu terlaris, performa staf. Ekspor CSV atau PDF buat pembukuan." },
        { t: "Pantau dari jauh", d: "Pemilik bisa cek ringkasan penjualan dari mana saja, tanpa bikin resto bergantung internet." },
        { t: "Server & perangkat sehat", d: "Lihat perangkat mana yang terhubung dan printer mana yang online — cabut akses kapan saja." },
      ],
    },
    floor: {
      eyebrow: "Dibuat untuk situasi resto nyata",
      h2: "Kami sudah pikirkan bagian ribetnya.",
      para: "Denah ruangan langsung menampilkan kondisi sekilas — kosong, terisi, menunggu, siap. Saat layanan mulai kacau, SatSet tetap mengimbangi.",
      items: [
        { t: "Pindahkan tamu, pesanan ikut.", d: "Satu ketuk memindahkan seluruh sesi ke meja lain." },
        { t: "Reservasi & penguncian pintar.", d: "Atur reservasi langsung dari area; dua pelayan tak akan bentrok di satu meja." },
        { t: "Pisah tagihan & pembatalan tercatat.", d: "Bayar bertahap atau pisah per tamu; tiap pembatalan tercatat ke pelakunya." },
      ],
    },
    reports: {
      eyebrow: "Pahami angkamu",
      h2: "Lihat persis bagaimana hari ini berjalan.",
      para: "Tarik data penjualan riil yang sudah lunas untuk rentang tanggal apa pun. Tagihan, bukti pembayaran, dan riwayat pesanan dalam satu tempat — bisa diekspor kapan saja. Snapshot cloud opsional memungkinkan pemilik memantau dari jauh, tanpa membuat operasional harian bergantung pada cloud.",
      tag1: "Ekspor akuntansi",
      tag2: "Bukti pembayaran",
      tag3: "Brand-mu di struk",
      dashLabel: "Penjualan lunas · hari ini",
      vs: "vs. kemarin",
      ordersLabel: "Pesanan",
      avgLabel: "Rata-rata transaksi",
      coversLabel: "Tamu",
    },
    demo: {
      eyebrow: "Nggak perlu percaya kata kami",
      h2a: "Pasang sekarang,",
      h2b: "jalankan restonya sendiri.",
      para: "Bukan video, bukan tur berpemandu. APK-nya bisa kamu unduh sekarang, lengkap dengan satu resto yang lagi ramai buat kamu bongkar sepuasnya.",
      ctaApk: "Unduh APK",
      apkAlt: "Unduhan mandek? Buka halaman rilis",
      sideloadLabel: "Belum pernah pasang aplikasi di luar Play Store?",
      sideloadSteps: [
        "Setelah unduhan selesai, buka notifikasinya — atau cari satset.apk di folder Download — lalu ketuk filenya.",
        "Android bakal bilang sumbernya nggak dikenal. Itu normal untuk aplikasi di luar Play Store. Ketuk Setelan di kotak yang muncul.",
        "Nyalakan Izinkan dari sumber ini, lalu tekan tombol Kembali.",
        "Ketuk Pasang. Kalau Play Protect nanya, pilih Pasang tanpa dipindai.",
        "Selesai. SatSet muncul di layar utama seperti aplikasi lain.",
      ],
      req: "Butuh Android 10 ke atas. Ukuran file 113 MB — pakai Wi-Fi kalau bisa.",
      accountsLabel: "Akun demo — pakai salah satu",
      passLabel: "Password semuanya",
      stepsLabel: "Langkahnya",
      steps: [
        { t: "Unduh & pasang", d: "Ambil APK-nya, lalu izinkan pemasangan saat HP-mu bertanya." },
        { t: "Buka, pilih Server", d: "HP ini yang jadi pusatnya — tempat semua data tersimpan." },
        { t: "Masuk pakai akun demo", d: "Pilih salah satu akun di samping. Semuanya sudah siap pakai." },
        { t: "Muat data demo", d: "Dari menu Venue. Tunggu sekitar 4 menit — cuma sekali di awal." },
        { t: "Keliling restonya", d: "Meja lagi terisi, dapur lagi jalan, kasir dan laporan sudah ada isinya." },
      ],
      bonusLabel: "Opsional",
      bonusTitle: "Punya HP kedua? Ini bagian serunya.",
      bonusDesc: "Pasang APK yang sama, pilih Client, lalu scan QR dari HP pertama. Ambil pesanan di HP kedua dan lihat pesanannya muncul di layar dapur HP pertama — tanpa internet sama sekali.",
    },
    cta: {
      h3a: "Jalan di Wi-Fi-mu. Tetap jalan offline.",
      h3b: "Tanpa langganan untuk beroperasi.",
      para: "SatSet hanya lewat undangan. Hubungi kami dan kami bantu siapkan — datamu tetap di jaringanmu.",
      btn: "Hubungi Kami",
    },
    footer: { tagline: "Terenkripsi antar perangkat · Login dengan PIN · Datamu tetap di jaringanmu" },
  },
  en: {
    nav: { features: "Features", day: "A full day", floor: "The floor", reports: "Reports", demo: "Try it", contact: "Contact us", download: "Download APK" },
    hero: {
      badge: "Runs on your Wi-Fi · Works offline",
      h1a: "The restaurant",
      h1b: "system that runs on",
      h1c: "your own Wi-Fi.",
      para: "Turn ordinary Android phones and tablets into a complete point-of-order system. Pair by QR in seconds. No internet, no monthly cloud bill, no subscription to take an order.",
      ctaPrimary: "Contact us",
      meta1: "⎯ Set up in minutes",
      meta2: "⎯ Encrypted device-to-device",
      meta3: "⎯ Your data stays local",
      scroll: "SCROLL",
      table: "Table 7",
      chip: "Order · Table 4 → 6",
      liveStatus: "Live status",
      seated: "Seated",
      ready: "Ready",
      open: "Open",
      resvName: "Sari · party of 4",
      resvSub: "Reserved · arriving soon",
    },
    features: {
      eyebrow: "Everything's easy",
      h2: "Built to make the busy parts effortless.",
      para: "One app, two modes. Every device pairs in seconds and syncs instantly over your local network.",
      cards: [
        { t: "Scan to pair", d: "Devices find the server automatically — connect by scanning a code. No IPs, no typing, no setup." },
        { t: "Works offline", d: "Orders fly from hand to kitchen over your Wi-Fi. Internet outage? Service simply continues." },
        { t: "No subscription", d: "No monthly cloud bill to take an order. Runs on the Android devices you may already own." },
        { t: "Live kitchen display", d: "Orders appear the instant they're sent, with course timing and overdue items flagged automatically." },
        { t: "Guests scan to order", d: "Diners browse your menu on their own phone — no app install. Orders land as pending for staff review." },
        { t: "Secure by default", d: "Encrypted device-to-device traffic and personal PIN sign-in. Every action tied to the person who did it." },
      ],
    },
    day: {
      eyebrow: "A full day with SatSet",
      h2a: "From the first guest",
      h2b: "to closing the books.",
      para: "Every part of your shift has a place. Nothing has to be written down twice.",
      rows: [
        { t: "Reservations & seating", d: "Book, seat and move a party to another table — their order moves with them." },
        { t: "Takeaway", d: "Takeaway orders get their own queue number that restarts each day." },
        { t: "Menu & stock", d: "Change prices and variants anytime. Mark sold out and it vanishes from the guest menu." },
        { t: "Cashier & split bills", d: "Pay in full, split per item, or divide evenly. Non-cash needs photo proof." },
        { t: "Print bills & receipts", d: "LAN or Bluetooth printers. Your logo and address print on every receipt." },
        { t: "Staff, roles & audit trail", d: "Decide who can do what. Every cancel is logged with a reason and a name." },
        { t: "Reports & exports", d: "Sales, top dishes, staff performance. Export CSV or PDF straight to bookkeeping." },
        { t: "Check in remotely", d: "Owners can see the sales summary from anywhere, without tying service to the internet." },
        { t: "Healthy server & devices", d: "See which devices are connected and which printers are online — revoke access anytime." },
      ],
    },
    floor: {
      eyebrow: "Built for the real floor",
      h2: "We thought about the messy parts.",
      para: "A live floor plan shows the room at a glance — open, seated, waiting, ready. When service gets chaotic, SatSet keeps up.",
      items: [
        { t: "Move a party, keep the order.", d: "One tap transfers the whole session to another table." },
        { t: "Reservations & smart locking.", d: "Seat bookings from the floor; two waiters never collide on one table." },
        { t: "Split bills & accountable voids.", d: "Settle in stages or split per guest; every cancel is logged to who did it." },
      ],
    },
    reports: {
      eyebrow: "Know your numbers",
      h2: "See exactly how the day went.",
      para: "Pull real, settled sales for any date range. Bills, payment proof and order history in one place — exportable on demand. Optional cloud snapshots let owners check in remotely, without making the day-to-day depend on the cloud.",
      tag1: "Accounting export",
      tag2: "Payment proof",
      tag3: "Your branding on receipts",
      dashLabel: "Settled sales · today",
      vs: "vs. yesterday",
      ordersLabel: "Orders",
      avgLabel: "Avg ticket",
      coversLabel: "Covers",
    },
    demo: {
      eyebrow: "Don't take our word for it",
      h2a: "Install it now,",
      h2b: "run the restaurant yourself.",
      para: "Not a video, not a guided tour. Download the APK right now — it comes with a restaurant mid-service for you to pull apart however you like.",
      ctaApk: "Download APK",
      apkAlt: "Download stalling? Open the release page",
      sideloadLabel: "Never installed an app from outside the Play Store?",
      sideloadSteps: [
        "When the download finishes, open the notification — or find satset.apk in your Download folder — and tap the file.",
        "Android will say the source is unknown. That is normal for anything outside the Play Store. Tap Settings in the dialog.",
        "Turn on Allow from this source, then press Back.",
        "Tap Install. If Play Protect asks, choose Install without scanning.",
        "Done. SatSet shows up on your home screen like any other app.",
      ],
      req: "Needs Android 10 or newer. It's a 113 MB file — use Wi-Fi if you can.",
      accountsLabel: "Demo accounts — use any one",
      passLabel: "Password for all",
      stepsLabel: "How it goes",
      steps: [
        { t: "Download & install", d: "Grab the APK, then allow the install when your phone asks." },
        { t: "Open it, pick Server", d: "This phone becomes the hub — where all the data lives." },
        { t: "Sign in with a demo account", d: "Pick any account beside this. They're all ready to go." },
        { t: "Load the demo data", d: "From the Venue menu. Takes about 4 minutes — once, at the start." },
        { t: "Walk the restaurant", d: "Tables seated, kitchen running, cashier and reports already full." },
      ],
      bonusLabel: "Optional",
      bonusTitle: "Got a second phone? That's the good part.",
      bonusDesc: "Install the same APK, pick Client, then scan the QR from the first phone. Take an order on the second and watch it appear on the first phone's kitchen screen — with no internet at all.",
    },
    cta: {
      h3a: "Runs on your Wi-Fi. Works offline.",
      h3b: "No subscription to operate.",
      para: "SatSet is invite-only. Get in touch and we'll get you set up — your data stays on your network.",
      btn: "Contact us",
    },
    footer: { tagline: "Encrypted device-to-device · PIN-secured sign-in · Your data stays local" },
  },
};
