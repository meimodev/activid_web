
import type { SiteContent } from '@/types/site-content.types';

export const siteContent: SiteContent = {
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Invitation', href: 'https://invitation.activid.id', external: true },
    { label: 'KenanganKita', href: 'https://kenangan.activid.id', external: true },
    { label: 'Verify documents', href: '/verify' },
    { label: 'Contact', href: '/contact' },
  ],
  hero: {
    title: 'Keep your brand active.',
    description: 'Agensi kreatif di Manado & Tondano. Media sosial, video, foto, dan website untuk brand Anda, dikerjakan satu tim.',
    cta: { text: 'Start a project', href: '/contact' },
    // `#t=` is the second the clip opens on, and the frame its poster shows.
    video: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/podcast-production.mp4#t=9',
    fact: { value: '2017', label: 'Berdiri' },
  },
  aboutUs: {
    title: 'About us',
    lead: 'Agensi kreatif yang mengubah brand jadi cerita yang diingat. Dari identitas visual, konten media sosial, produksi video, sampai website — kami rancang setiap detail agar brand Anda tampil beda dan tumbuh nyata.',
    facts: [
      { label: 'Berdiri', value: '2017' },
      { label: 'Kantor', value: 'Tondano & Manado' },
      { label: 'Layanan', value: 'Branding, sosial media, video, website' },
    ],
  },
  services: {
    title: 'Our Services',
    subtitle: 'Lima layanan yang saling melengkapi, dikerjakan oleh satu tim.',
    items: [
      {
        id: 'social-media',
        short: 'Social Media',
        detail: 'Identitas brand, konten, copywriting',
        title: 'Social Media Management',
        description: 'Membangun identitas visual brand Anda — logo, palet warna, tipografi — lalu mengelola dan mengembangkannya di media sosial: strategi konten, desain, copywriting, hingga analisis performa agar audiens tumbuh secara organik dan relevan.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_cover_1.jpg',
        imageAlt: 'Social Media Management',
        buttonLink: '/services/social-media',
      },
      {
        id: 'event-documentation',
        short: 'Events',
        detail: 'Perusahaan, pernikahan, konser',
        title: 'Event & Documentation',
        description: 'Menangkap momen terbaik dari setiap acara Anda dari event perusahaan, pernikahan, hingga konser musik dengan kualitas visual yang hidup dan emosional.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/pertamina.mp4#t=14',
        imageAlt: 'Event and Documentation',
        buttonLink: '/services/event-documentation',
      },
      {
        id: 'video-podcast',
        short: 'Video & Podcast',
        detail: 'Video promosi, company profile, podcast',
        title: 'Video & Podcast Production',
        description: 'Cerita yang baik layak disampaikan dengan kualitas visual dan audio yang maksimal. Dari konsep, shooting, editing, hingga final rendering, kami siap bantu Anda bercerita lewat video promosi, company profile, hingga podcast profesional.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/reels-production.mp4#t=5',
        imageAlt: 'Video and Podcast Production',
        buttonLink: '/services/video-podcast',
      },
      {
        id: 'website-app',
        short: 'Web & Apps',
        detail: 'Company profile, landing page, aplikasi',
        title: 'Website & App Development',
        description: 'Membangun platform digital yang elegan, cepat, dan user friendly. Mulai dari website company profile, landing page, hingga aplikasi mobile dengan desain antarmuka yang intuitif dan estetis.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_web_app_3-min.jpg',
        imageAlt: 'Website and App Development',
        buttonLink: '/services/website-app',
      },
      {
        id: 'product-photography',
        short: 'Photography',
        detail: 'Makanan, minuman, properti',
        title: 'Product Photography',
        description: 'Menampilkan produk Anda dengan visual yang tajam, estetik, dan profesional setiap detail difoto untuk menarik perhatian dan memperkuat identitas brand.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_cover_2.jpg',
        imageAlt: 'Product Photography',
        buttonLink: '/services/product-photography',
      },
    ],
  },
  testimonials: {
    title: 'Client Feedback',
    items: [
      {
        quote: 'Mantap. Social media jadi lebih ramai, engagement jadi lebih banyak',
        author: 'Bbold',
        role: 'Bbold',
        company: 'Bbold',
      },
      {
        quote: 'Paket lengkap, dari social media management, dokumentasi event, produksi video, hingga pengembangan website & aplikasi. Tidak perlu bingung mencari agensi lagi.',
        author: 'Yama Resort',
        role: 'Yama Resort',
        company: 'Yama Resort',
      },
      {
        quote: 'Sangat jarang menemukan agensi yang bisa menyeimbangkan kreativitas visual dengan data. Setiap konten memiliki tujuan yang jelas untuk mendatangkan pelanggan baru.',
        author: 'BRI Peduli',
        role: 'BRI Peduli',
        company: 'BRI Peduli',
      },
      {
        quote: 'Kami sudah pernah bekerja dengan banyak developer sebelumnya, tapi tim ini berbeda. Mereka berani memberikan masukan dan perspektif baru agar sistem kami menjadi lebih baik.',
        author: 'Pertamina Geothermal Energy',
        role: 'Pertamina Geothermal Energy',
        company: 'Pertamina Geothermal Energy',
      },
    ],
  },
  footer: {
    brand: {
      title: 'Creative agency in Tondano & Manado.',
      highlight: 'extraordinary.',
    },
    locations: [
      {
        name: 'Tondano',
        address: 'Kompleks Pasar Bawah, Kel. Wawalintouan\nKab. Minahasa, Sulawesi Utara',
        mapLink: 'https://maps.app.goo.gl/1Hc3a9AwZ3Rgq11z7',
      },
      {
        name: 'Manado',
        address: 'Jl. Toar No.19, Kel. Mahakeret\nKota Manado, Sulawesi Utara',
        mapLink: 'https://maps.app.goo.gl/6mu8xWkfThW6quTa9',
      },
    ],
    socials: {
      // Add social links here if any
    },
    legal: {
      privacy: { label: 'Privacy', href: '/privacy' },
      accountDeletion: { label: 'Account Deletion', href: '/account-deletion' },
      terms: { label: 'Terms', href: '/terms' },
      copyright: 'All rights reserved.',
    },
  },
  ctaSection: {
    title: 'Start your project',
    lead: 'Pilih layanan yang Anda butuhkan, lalu kirim lewat WhatsApp.',
    action: 'Chat on WhatsApp',
  },
  clients: {
    title: 'Our Clients',
    // Follows the number of clients below: "19 brand, lembaga, …".
    lead: 'brand, lembaga, dan usaha lokal sudah bekerja bersama kami.',
    items: [
      { name: 'Pertamina Geothermal Energy Lahendong', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/1_PGE%20LAHENDONG.png' },
      { name: 'BRI Peduli', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/2_BRI_PEDULI.png' },
      { name: 'Unforgettable Minahasa', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/3_UNFORGETTABLE_MINAHASA.png' },
      { name: 'Badan Promosi Pariwisata Daerah Minahasa', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/4_BADAN_PROMOSI_PARIWISATA_DAERAH_%20MINAAHASA.png' },
      { name: 'Strata Kitchen', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/5_STRATA_KITCHEN.png' },
      { name: 'Yama Resort', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/6_YAMA_RESORT.png' },
      { name: 'Meimo Software Developers', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/7_MEIMO%20SOFTWARE_DEVELOPER.png' },
      { name: 'Boost Snack', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/8_BOOST_SNACK.png' },
      { name: 'Nike Tolejo', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/9_NIKE_TOLEJO.png' },
      { name: 'Mapalus E-Commerce', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/10_MAPALUS_E-COMMERCE.png' },
      { name: 'Kland Coffee', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/11_KLAND.png' },
      { name: 'Fourever Gift', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/12_FOUREVER_GIFTS.png' },
      { name: 'Bakso Denny', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/13_BAKSO_DENNY.png' },
      { name: 'Itaewon Korean Grill', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/14_ITAEWON%20KOREAN_GRILL.png' },
      { name: 'Esspecto Coffee', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/15_ESSPECTO_COFFEE.png' },
      { name: 'Bbold', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/16_BBOLD.png' },
      { name: 'Mars Food & Drink', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/17_MARS_FOOD_&_DRINK.png' },
      { name: 'Doonato', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/18_DONATO.png' },
      { name: 'Iceman', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/19_ICEMAN.png' },
    ],
  },
  servicePages: {
    socialMedia: {
      header: {
        title: 'Social Media Management',
        description: 'Membangun identitas visual brand Anda — logo, palet warna, tipografi — lalu mengelola dan mengembangkannya di media sosial: strategi konten, desain, copywriting, hingga analisis performa agar audiens tumbuh secara organik dan relevan.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_cover_1.jpg',
      },
      showcasesTitle: 'Showcase',
      showcasesSubtitle: 'Ragam industri yang kami tangani',
      showcases: [
        {
          category: 'Coffee Shop',
          colors: ['#2C4A3B', '#E8DCCA', '#5C4033'],
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_social_2-min.jpg',
        },
        {
          category: 'Beauty',
          colors: ['#FFB7B2', '#FFFFFF', '#C08552'],
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_social_3-min.jpg',
        },
        {
          category: 'F&B',
          colors: ['#E67E22', '#1A1A1A', '#F1C40F'],
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_social_1-min.jpg',
        },
        {
          category: 'Automotive',
          colors: ['#C0392B', '#000000', '#922B21'],
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_social_4-min.jpg',
        },
      ],
      projectsTitle: 'Case Study',
      projectsSubtitle: 'Hasil nyata dari brand yang kami bangun',
      projects: [
        {
          client: 'iceman es kristal',
          service: 're-branding',
          description: 'Kami bantu klien membangun kembali branding mulai dari logo, strategi konten kreatif, visual konsisten, dan tone komunikasi yang relevan.',
          result: 'Engagement naik 60% dalam 2 bulan, dengan citra brand yang lebih profesional.',
          link: 'https://www.instagram.com/icemaneskristal/',
          handle: '@icemaneskristal',
        },
        {
          client: 'bbold MMXX',
          service: 'Brand Kickstart & Social Media Setup',
          description: 'Kami mendampingi klien sejak awal membangun identitas digital mulai dari konsep visual, tone warna, hingga gaya komunikasi di media sosial agar tampil konsisten dan siap bersaing secara online.',
          result: 'Brand berhasil hadir dengan tampilan digital yang rapi, terarah, dan mudah dikenali audiens.',
          link: 'https://www.instagram.com/bbold.mmxx/',
          handle: '@bbold.mmxx',
        },
        {
          client: 'especto coffee',
          service: 'Social Media Setup',
          description: 'Kami bantu klien mengembangkan tampilan media sosial yang menyesuaikan keinginan dan karakter owner dari pemilihan warna, dan tema visual.',
          result: 'Tujuan tercapai untuk pembuatan Feed yang ceria dan menarik, serta berhasil membangun kedekatan dengan audiens.',
          link: 'https://www.instagram.com/esspecto_coffee/?hl=en',
          handle: '@esspecto_coffee',
        },
      ],
    },
    eventDocumentation: {
      header: {
        title: 'Event & Documentation',
        description: 'Menangkap momen terbaik dari setiap acara Anda dari event perusahaan, pernikahan, hingga konser musik dengan kualitas visual yang hidup dan emosional.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/unklab.mp4#t=20',
      },
      projects: [
        {
          title: 'Pertamina Geothermal Energy Tbk',
          description: 'Kami memproduksi video company profile PT Pertamina Geothermal yang menampilkan operasi panas bumi, teknologi dan komitmen terhadap energi bersih dalam visual yang profesional dan terstruktur, untuk memperkuat citra perusahaan sebagai pemimpin di sektor energi terbarukan.',
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/pertamina.mp4#t=14',
        },
        {
          title: 'Universitas Klabat',
          description: 'Kami mengabadikan momen-momen berharga di Universitas Klabat, mulai dari kemegahan acara wisuda hingga dinamika kehidupan kampus, menyajikannya dalam dokumentasi visual yang profesional dan penuh inspirasi bagi seluruh civitas akademika.',
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/unklab.mp4#t=14',
        },
        {
          title: 'Wedding of Toar & Taya',
          description: 'Kami memproduksi video wedding cinematic yang menangkap setiap momen dengan sentuhan visual artistik, alur cerita yang emosional, dan pengambilan gambar yang dramatis.',
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/toar-taya.mp4#t=9',
        },
      ],
      overview: {
        title: 'Overview',
        content: 'Setiap momen berharga layak untuk diabadikan dengan sempurna. Tim fotografer dan videografer kami berpengalaman dalam menangkap emosi dan atmosfer acara, memastikan setiap detik penting terekam dengan kualitas sinematik yang tinggi.',
      },
    },
    videoPodcast: {
      header: {
        title: 'Video & Podcast Production',
        description: 'Cerita yang baik layak disampaikan dengan kualitas visual dan audio yang maksimal. Dari konsep, shooting, editing, hingga final rendering, kami siap bantu Anda bercerita lewat video promosi, company profile, hingga podcast profesional.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/reels-production.mp4#t=5',
      },
      mainProject: {
        title: 'Tou Minaesa Project',
        description: 'Kami bantu klien membangun identitas digital podcast dari nol, mulai dari proses produksi video, set up studio, pengambilan gambar, desain thumbnail, hingga pengemasan ulang konten menjadi reels yang menarik di berbagai platform.',
        result: 'Dalam 6 bulan pengelolaan oleh Activid, podcast tumbuh pesat dari 0 subscriber menjadi 600 di YouTube, 2.7K di TikTok, dan 1K followers di Instagram. Dan sekarang sudah ada 3 Segmen turunan dari Tou Minaesa Project.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/podcast-production.mp4#t=5',
      },
      thumbnails: [],
    },
    websiteApp: {
      header: {
        title: 'Website & App Development',
        projectTitle: 'Project\nWebsite & App\nDevelopment',
        description: [
          'Bisnis yang kuat butuh fondasi digital yang lebih kuat.',
          'Activid merancang dan membangun website serta aplikasi yang bukan sekadar terlihat bagus — tapi benar-benar bekerja untuk bisnis Anda. Setiap piksel, setiap alur, setiap interaksi kami rancang dengan presisi: tampilan modern, pengalaman pengguna yang intuitif, dan performa yang tak mengecewakan.',
          'Dari industri apapun, kami hadir dengan satu misi — mengubah ide Anda menjadi solusi digital yang fungsional, profesional, dan siap bersaing.',
        ],
      },
      aiHighlight: {
        badge: 'AI enabled',
        title: 'Mengintegrasikan Claude Code bersama developer yang handal',
        description: 'Untuk mempercepat pengembangan dan memberikan hasil terbaik, kami memanfaatkan teknologi AI secara eksklusif menggunakan Anthropic Claude Code dengan model terbaru untuk memastikan kualitas dan konsistensi di setiap website dan aplikasi yang kami bangun.',
      },
      mockups: [
        'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_web_app_3-min.jpg',
        'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_web_app_2-min.jpg',
        'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_web_app_1-min.jpg',
      ],
      techStack: {
        title: 'Our Tech Stack',
        description: 'Kami menggunakan teknologi termutakhir dan terpercaya untuk membangun website dan aplikasi yang handal dan berkinerja tinggi.',
      },
      caseStudies: {
        title: 'Bisnis yang butuh website & app',
        items: [
          {
            title: 'Gereja',
            description: 'Platform digital memungkinkan gereja mengelola jadwal ibadah, live streaming, persembahan online, dan komunikasi jemaat — semuanya dalam satu sistem yang rapi.',
          },
          {
            title: 'Hotel & penginapan',
            description: 'Hotel dan guest house lokal bisa memiliki sistem reservasi sendiri tanpa bergantung penuh pada OTA, sekaligus menampilkan paket wisata dan promo langsung ke tamu.',
          },
          {
            title: 'Café & restoran',
            description: 'Industri kuliner lokal berkembang pesat. App atau website dengan fitur QR menu, reservasi meja, dan pre-order bisa meningkatkan pengalaman pelanggan dan efisiensi operasional secara nyata.',
          },
          {
            title: 'Distributor',
            description: 'Distributor sembako, minuman, dan produk lokal butuh platform B2B untuk kelola order reseller, pantau stok, dan kirim invoice digital — menggantikan proses manual yang rawan kesalahan.',
          },
          {
            title: 'Laundry',
            description: 'Dengan app sederhana, pelanggan bisa pesan pickup, pantau status cucian, dan bayar secara digital — jauh lebih profesional dari sekadar WhatsApp.',
          },
          {
            title: 'Klinik & layanan kesehatan',
            description: 'Klinik kecantikan dan dokter gigi bisa meningkatkan kepercayaan pasien lewat sistem booking online, notifikasi jadwal otomatis, dan rekam medis digital yang terorganisir.',
          },
        ],
      },
    },
    productPhotography: {
      header: {
        title: 'Product Photography',
        description: 'Menampilkan produk Anda dengan visual yang tajam, estetik, dan profesional setiap detail difoto untuk menarik perhatian dan memperkuat identitas brand.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_photo_property_1-min.jpg',
      },
      projects: [
        {
          title: 'Food and Beverage Photography',
          client: 'DNA Cafe & Resto',
          description: 'Kami membantu client untuk menghasilkan foto makanan dan minuman dengan visual yang rapi dan menggugah selera, menonjolkan detail dan kualitas agar terlihat lebih menarik dan siap digunakan untuk kebutuhan branding maupun promosi',
          images: [
            'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_photo_6.jpg',
            'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_photo_5.jpg',
            'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_photo_4.jpg',
            'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_photo_3-min.jpg',
            'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_photo_2.jpg',
            'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_photo_1-min.jpg',
          ],
        },
        {
          title: 'Property Photography',
          client: 'Yama Resort',
          description: 'Kami membantu client menghasilkan foto resort dengan visual yang estetik dan profesional, menonjolkan suasana, fasilitas, dan keindahan lingkungan agar terlihat lebih menarik dan mampu menggambarkan pengalaman menginap secara optimal.',
          images: [
            'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_photo_property_2-min.jpg',
            'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_photo_property_3-min.jpg',
            'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_photo_property_4-min.jpg',
            'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_photo_property_5-min.jpg',
            'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_photo_property_6-min.jpg',
          ],
        },
      ],
      overview: {
        title: 'Overview',
        content: 'Foto produk yang baik dapat meningkatkan nilai jual secara signifikan. Kami menggunakan teknik pencahayaan dan styling profesional untuk menonjolkan fitur terbaik produk Anda, membuatnya terlihat menggoda dan premium di mata calon pelanggan.',
      },
    },
  },
  contactPage: {
    header: {
      title: 'Contact Us',
      subtitle: 'Creative Agency',
    },
    methods: {
      whatsapp: {
        label: 'WhatsApp',
        value: '+62 881‑0800‑88816',
        href: 'https://wa.me/+62881080088816',
      },
      email: {
        label: 'Email',
        value: 'hello@activid.id',
        href: 'mailto:hello@activid.id',
      },
      instagram: {
        label: 'Instagram',
        value: '@actividofficial',
        href: 'https://instagram.com/actividofficial',
      },
    },
    officesTitle: 'Office Locations',
    offices: [
      {
        city: 'Tondano',
        type: 'Office',
        address: [
          'Kompleks Pasar Bawah',
          'Kel.Wawalintouan, Kec. Tondano Barat',
          'Kabupaten Minahasa',
          'Sulawesi Utara, Indonesia'
        ],
        mapLink: 'https://maps.app.goo.gl/1Hc3a9AwZ3Rgq11z7',
      },
      {
        city: 'Manado',
        type: 'Office',
        address: [
          'Jl. Toar No.19',
          'Kel. Mahakeret, Kec. Wenang',
          'Kota Manado',
          'Sulawesi Utara, Indonesia'
        ],
        mapLink: 'https://maps.app.goo.gl/6mu8xWkfThW6quTa9',
      },
    ],
  },
};
