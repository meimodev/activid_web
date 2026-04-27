
import type { SiteContent } from '@/types/site-content.types';

export const siteContent: SiteContent = {
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Invitation', href: 'https://invitation.activid.id', external: true },
    { label: 'About', href: '/#about' },
    { label: 'Clients', href: '/#clients' },
    { label: 'Services', href: '/#services' },
    { label: 'Contact', href: '/contact' },
  ],
  hero: {
    title: '',
    subtitle: 'Activid ',
    description: 'Create stunning, high-performance websites with sophisticated animations that captivate your audience and elevate your brand.',
    cta: {
      primary: {
        text: 'Get Started',
        href: '/contact',
      },
      secondary: {
        text: 'View Work',
        href: '/#services',
      },
    },
    backgroundVideo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/podcast-production.mp4',
    gradientOrbs: {
      count: 3,
      colors: ['#8B5CF6', '#EC4899', '#06B6D4'],
    },
  },
  aboutUs: {
    title: 'About\nUs',
    tagline: 'Agensi Kreatif',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    heading: 'kenalan dulu yuk',
    points: [
      {
        text: 'Activid adalah agensi kreatif yang bergerak di bidang industri kreatif',
        highlight: 'sejak 2015',
        suffix: 'dengan kantor fisik pertama berlokasi di Tondano dan masih aktif hingga sekarang dengan jumlah 2 cabang kantor',
        highlight2: 'Tondano dan Manado',
      },
      {
        text: 'Misi kita adalah membantu',
        highlight: 'brand dan individu',
        suffix: 'membangun identitas visual',
        highlight2: 'yang kuat dan berkarakter',
        suffix2: 'Kami percaya bahwa setiap ide memiliki potensi besar untuk berkembang dengan cara yang tepat.',
      },
      {
        text: 'Solusi melalui',
        highlight: 'strategi kreatif dan eksekusi yang solid',
        suffix: ', mulai dari branding building, social media campaign, hingga produksi video dan website, agar pesan kamu tersampaikan dengan',
        highlight2: 'efektif dan berkesan',
      },
    ],
  },
  services: {
    title: 'Our Services',
    items: [
      {
        id: 'branding',
        title: 'Branding & Design',
        description: 'Membentuk identitas visual yang kuat dari logo, palet warna, tipografi, hingga panduan brand lengkap yang menggambarkan nilai dan karakter bisnis Anda.',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        imageAlt: 'Branding and Design',
        color: '#7a7a9d',
        buttonText: 'View Project',
        buttonLink: '/services/branding',
      },
      {
        id: 'social-media',
        title: 'Social Media Management',
        description: 'Mengelola dan mengembangkan citra brand Anda di media sosial. Mulai dari strategi konten, desain, copywriting, hingga analisis performa agar audiens Anda tumbuh secara organik dan relevan.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_cover_1.jpg',
        imageAlt: 'Social Media Management',
        color: '#5a5a8d',
        buttonText: 'View Project',
        buttonLink: '/services/social-media',
      },
      {
        id: 'event-documentation',
        title: 'Event & Documentation',
        description: 'Menangkap momen terbaik dari setiap acara Anda dari event perusahaan, pernikahan, hingga konser musik dengan kualitas visual yang hidup dan emosional.',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
        imageAlt: 'Event and Documentation',
        color: '#5a5a8d',
        buttonText: 'View Project',
        buttonLink: '/services/event-documentation',
      },
      {
        id: 'video-podcast',
        title: 'Video & Podcast Production',
        description: 'Cerita yang baik layak disampaikan dengan kualitas visual dan audio yang maksimal. Dari konsep, shooting, editing, hingga final rendering, kami siap bantu Anda bercerita lewat video promosi, company profile, hingga podcast profesional.',
        image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop',
        imageAlt: 'Video and Podcast Production',
        color: '#4a4a7d',
        buttonText: 'View Project',
        buttonLink: '/services/video-podcast',
      },
      {
        id: 'website-app',
        title: 'Website & App Development',
        description: 'Membangun platform digital yang elegan, cepat, dan user friendly. Mulai dari website company profile, landing page, hingga aplikasi mobile dengan desain antarmuka yang intuitif dan estetis.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        imageAlt: 'Website and App Development',
        color: '#5a5a8d',
        buttonText: 'View Project',
        buttonLink: '/services/website-app',
      },
      {
        id: 'product-photography',
        title: 'Product Photography',
        description: 'Menampilkan produk Anda dengan visual yang tajam, estetik, dan profesional setiap detail difoto untuk menarik perhatian dan memperkuat identitas brand.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_cover_2.jpg',
        imageAlt: 'Product Photography',
        color: '#5a5a8d',
        buttonText: 'View Project',
        buttonLink: '/services/product-photography',
      },
    ],
  },
  testimonials: {
    title: 'Client Feedback',
    items: [
      {
        quote: 'Mantap. Social media jadi lebih ramai, enggagement jadi lebih banyak ',
        author: 'Bbold',
        role: 'Bbold',
        company: 'Bbold',
      },
      {
        quote: 'Paket lengkap, dari social media management, dokumentasi event, produksi video, hingga pengembangan website & applikasi. Tidak perlu bingung mencari agensi lagi.',
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
        quote: 'Kami sudah pernah bekerja dengan banyak developer sebelumnya, tapi tim ini berbeda. Mereka berani memberikan masukan dan prespektif baru agar sistem kami menjadi lebih baik.',
        author: 'Pertamina Geothermal Energy',
        role: 'Pertamina Geothermal Energy',
        company: 'Pertamina Geothermal Energy',
      },
    ],
  },
  footer: {
    brand: {
      title: "Let's build something extraordinary.",
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
    title: 'Ready to Start Your Project?',
    description: 'Mari berkolaborasi untuk mewujudkan visi Anda. Apakah Anda membutuhkan website baru, branding, atau manajemen media sosial, kami siap membantu.',
    buttonText: 'Get in Touch',
    buttonLink: '/contact',
  },
  clients: {
    title: 'Our Clients',
    subtitlePart1: 'endeavours and still counting up',
    items: [
      { name: 'Client 1', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/1_PGE%20LAHENDONG.png' },
      { name: 'Client 2', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/2_BRI_PEDULI.png' },
      { name: 'Client 3', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/3_UNFORGETTABLE_MINAHASA.png' },
      { name: 'Client 4', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/4_BADAN_PROMOSI_PARIWISATA_DAERAH_%20MINAAHASA.png' },
      { name: 'Client 5', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/5_STRATA_KITCHEN.png' },
      { name: 'Client 6', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/6_YAMA_RESORT.png' },
      { name: 'Client 7', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/7_MEIMO%20SOFTWARE_DEVELOPER.png' },
      { name: 'Client 8', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/8_BOOST_SNACK.png' },
      { name: 'Client 9', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/9_NIKE_TOLEJO.png' },
      { name: 'Client 10', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/10_MAPALUS_E-COMMERCE.png' },
      { name: 'Client 11', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/11_KLAND.png' },
      { name: 'Client 12', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/12_FOUREVER_GIFTS.png' },
      { name: 'Client 13', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/13_BAKSO_DENNY.png' },
      { name: 'Client 14', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/14_ITAEWON%20KOREAN_GRILL.png' },
      { name: 'Client 15', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/15_ESSPECTO_COFFEE.png' },
      { name: 'Client 16', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/16_BBOLD.png' },
      { name: 'Client 17', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/17_MARS_FOOD_&_DRINK.png' },
      { name: 'Client 18', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/18_DONATO.png' },
      { name: 'Client 19', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/19_ICEMAN.png' },
    ],
  },
  servicePages: {
    branding: {
      header: {
        title: 'Branding & Design',
        description: 'Membentuk identitas visual yang kuat dari logo, palet warna, tipografi, hingga panduan brand lengkap yang menggambarkan nilai dan karakter bisnis Anda.',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      },
      projects: [
        {
          id: '01',
          client: '@baksodenny',
          service: 're-branding',
          description: 'Kami bantu klien membangun kembali branding mulai dari logo, strategi konten kreatif, visual konsisten, dan tone komunikasi yang relevan.',
          result: 'Engagement naik 60% dalam 2 bulan, dengan citra brand yang lebih profesional.',
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_branding_bakso_denny.jpg',
          color: 'text-[#D9381E]',
        },
        {
          id: '02',
          client: '@bbold.mmxx',
          service: 'Brand Kickstart & Social Media Setup',
          description: 'Kami mendampingi klien sejak awal membangun identitas digital mulai dari konsep visual, tone warna, hingga gaya komunikasi di media sosial agar tampil konsisten dan siap bersaing secara online.',
          result: 'Brand berhasil hadir dengan tampilan digital yang rapi, terarah, dan mudah dikenali audiens.',
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_branding_bbold.jpg',
          color: 'text-[#8B4513]',
        },
        {
          id: '03',
          client: '@fourevergift_',
          service: 'Social Media Setup',
          description: 'Kami bantu klien mengembangkan tampilan media sosial yang menyesuaikan keinginan dan karakter owner dari pemilihan warna, dan tema visual.',
          result: 'Tujuan tercapai untuk pembuatan Feed yang ceria dan menarik, serta berhasil membangun kedekatan dengan audiens.',
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_branding_fourever.jpg',
          color: 'text-[#E91E63]',
        },
      ],
    },
    socialMedia: {
      header: {
        title: 'Social Media Management',
        description: 'Mengelola dan mengembangkan citra brand Anda di media sosial. Mulai dari strategi konten, desain, copywriting, hingga analisis performa.',
      },
      showcases: [
        {
          category: 'Coffee Shop',
          colors: ['#2C4A3B', '#E8DCCA', '#5C4033'],
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_social_2-min.jpg',
          description: '',
        },
        {
          category: 'Beauty',
          colors: ['#FFB7B2', '#FFFFFF', '#C08552'],
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_social_3-min.jpg',
          description: '',
        },
        {
          category: 'F&B',
          colors: ['#E67E22', '#1A1A1A', '#F1C40F'],
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_social_1-min.jpg',
          description: '',
        },
        {
          category: 'Automotive',
          colors: ['#C0392B', '#000000', '#922B21'],
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_social_4-min.jpg',
          description: '',
        },
      ],
    },
    eventDocumentation: {
      header: {
        title: 'Event & Documentation',
        description: 'Menangkap momen terbaik dari setiap acara Anda dari event perusahaan, pernikahan, hingga konser musik dengan kualitas visual yang hidup dan emosional.',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      },
      projects: [
        {
          title: 'Pertamina Geothermal Energy Tbk',
          description: 'Kami memproduksi video company profile PT Pertamina Geothermal yang menampilkan operasi panas bumi, teknologi dan komitmen terhadap energi bersih dalam visual yang profesional dan terstruktur, untuk memperkuat citra perusahaan sebagai pemimpin di sektor energi terbarukan.',
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/pertamina.mp4',
        },
        {
          title: 'Universitas Klabat',
          description: 'Kami mengabadikan momen-momen berharga di Universitas Klabat, mulai dari kemegahan acara wisuda hingga dinamika kehidupan kampus, menyajikannya dalam dokumentasi visual yang profesional dan penuh inspirasi bagi seluruh civitas akademika.',
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/unklab.mp4',
        },
        {
          title: 'Wedding of Toar & Taya',
          description: 'Kami memproduksi video wedding cinematic yang menangkap setiap momen dengan sentuhan visual artistik, alur cerita yang emosional, dan pengambilan gambar yang dramatis.',
          image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/toar-taya.mp4',
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
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/reels-production.mp4',
      },
      mainProject: {
        title: 'Tou Minaesa Project',
        description: 'Kami bantu klien membangun identitas digital podcast dari nol, mulai dari proses produksi video, set up studio, pengambilan gambar, desain thumbnail, hingga pengemasan ulang konten menjadi reels yang menarik di berbagai platform.',
        result: 'Dalam 6 bulan pengelolaan oleh Activid, podcast tumbuh pesat dari 0 subscriber menjadi 600 di YouTube, 2.7K di TikTok, dan 1K followers di Instagram. Dan sekarang sudah ada 3 Segmen turunan dari Tou Minaesa Project.',
        image: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/podcast-production.mp4',
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
        badge: 'Artificial Intellegence Enabled',
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
        title: '✦ Studi Kasus — Bisnis yang Butuh Website/App',
        items: [
          {
            title: '1. ⛪ Gereja',
            description: 'Platform digital memungkinkan gereja mengelola jadwal ibadah, live streaming, persembahan online, dan komunikasi jemaat — semuanya dalam satu sistem yang rapi.',
          },
          {
            title: '2. 🏨 Hotel & Penginapan',
            description: 'Hotel dan guest house lokal bisa memiliki sistem reservasi sendiri tanpa bergantung penuh pada OTA, sekaligus menampilkan paket wisata dan promo langsung ke tamu.',
          },
          {
            title: '3. ☕ Café & Restoran',
            description: 'Industri kuliner lokal berkembang pesat. App atau website dengan fitur QR menu, reservasi meja, dan pre-order bisa meningkatkan pengalaman pelanggan dan efisiensi operasional secara nyata.',
          },
          {
            title: '4. 🚚 Distributor',
            description: 'Distributor sembako, minuman, dan produk lokal butuh platform B2B untuk kelola order reseller, pantau stok, dan kirim invoice digital — menggantikan proses manual yang rawan kesalahan.',
          },
          {
            title: '5. 👕 Laundry',
            description: 'Dengan app sederhana, pelanggan bisa pesan pickup, pantau status cucian, dan bayar secara digital — jauh lebih profesional dari sekadar WhatsApp.',
          },
          {
            title: '6. 🏥 Klinik & Layanan Kesehatan',
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
        href: 'mailto:hello@activid.com',
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
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop',
        mapLink: 'https://maps.app.goo.gl/6mu8xWkfThW6quTa9',
      },
    ],
  },
};
