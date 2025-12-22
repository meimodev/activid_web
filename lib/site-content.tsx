
import type { SiteContent } from '@/types/site-content.types';

export const siteContent: SiteContent = {
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Contact', href: '/contact' },
  ],
  hero: {
    title: 'ACTIVID\nPORTFOLIO',
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
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop',
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
      { name: 'Client 1', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/1_PGE%20LAHENDONG.png?updatedAt=1763786723964' },
      { name: 'Client 2', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/2_BRI_PEDULI.png?updatedAt=1763786723909' },
      { name: 'Client 3', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/3_UNFORGETTABLE_MINAHASA.png?updatedAt=1763786722690' },
      { name: 'Client 4', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/4_BADAN_PROMOSI_PARIWISATA_DAERAH_%20MINAAHASA.png?updatedAt=1763786722582' },
      { name: 'Client 5', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/5_STRATA_KITCHEN.png?updatedAt=1763786723954' },
      { name: 'Client 6', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/6_YAMA_RESORT.png?updatedAt=1763786723863' },
      { name: 'Client 7', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/7_MEIMO%20SOFTWARE_DEVELOPER.png?updatedAt=1763786722638' },
      { name: 'Client 8', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/8_BOOST_SNACK.png?updatedAt=1763786722825' },
      { name: 'Client 9', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/9_NIKE_TOLEJO.png?updatedAt=1763786724023' },
      { name: 'Client 10', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/10_MAPALUS_E-COMMERCE.png?updatedAt=1763786724070' },
      { name: 'Client 11', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/11_KLAND.png?updatedAt=1763786724129' },
      { name: 'Client 12', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/12_FOUREVER_GIFTS.png?updatedAt=1763786723929' },
      { name: 'Client 13', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/13_BAKSO_DENNY.png?updatedAt=1763786725645' },
      { name: 'Client 14', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/14_ITAEWON%20KOREAN_GRILL.png?updatedAt=1763786722576' },
      { name: 'Client 15', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/15_ESSPECTO_COFFEE.png?updatedAt=1763786722809' },
      { name: 'Client 16', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/16_BBOLD.png?updatedAt=1763786722953' },
      { name: 'Client 17', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/17_MARS_FOOD_&_DRINK.png?updatedAt=1763786724077' },
      { name: 'Client 18', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/18_DONATO.png?updatedAt=1763786724059' },
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
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
          color: 'text-[#D9381E]',
        },
        {
          id: '02',
          client: '@bbold.mmxx',
          service: 'Brand Kickstart & Social Media Setup',
          description: 'Kami mendampingi klien sejak awal membangun identitas digital mulai dari konsep visual, tone warna, hingga gaya komunikasi di media sosial agar tampil konsisten dan siap bersaing secara online.',
          result: 'Brand berhasil hadir dengan tampilan digital yang rapi, terarah, dan mudah dikenali audiens.',
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&h=600&fit=crop',
          color: 'text-[#8B4513]',
        },
        {
          id: '03',
          client: '@fourevergift_',
          service: 'Social Media Setup',
          description: 'Kami bantu klien mengembangkan tampilan media sosial yang menyesuaikan keinginan dan karakter owner dari pemilihan warna, dan tema visual.',
          result: 'Tujuan tercapai untuk pembuatan Feed yang ceria dan menarik, serta berhasil membangun kedekatan dengan audiens.',
          image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=600&fit=crop',
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
          image: '/images/social-media/coffee-grid.jpg',
          description: 'Kami merancang visual yang hangat, estetis, dan mengundang yang menangkap suasana unik kedai kopi Anda, membuat merek Anda terasa nyaman, modern, dan sulit ditolak.',
        },
        {
          category: 'Beauty',
          colors: ['#FFB7B2', '#FFFFFF', '#C08552'],
          image: '/images/social-media/beauty-grid.png',
          description: 'Kami menciptakan desain media sosial yang bersih, elegan, dan terlihat premium yang meningkatkan nilai produk kecantikan Anda, membuatnya tampak lebih terpercaya, menarik, dan berkelas.',
        },
        {
          category: 'F&B',
          colors: ['#E67E22', '#1A1A1A', '#F1C40F'],
          image: '/images/social-media/fnb-grid.png',
          description: 'Kami membuat desain media sosial yang mengubah setiap hidangan menjadi pengalaman visual yang menggugah selera, membantu restoran Anda menonjol, menarik perhatian, dan membangkitkan selera makan bahkan sebelum pelanggan masuk.',
        },
        {
          category: 'Automotive',
          colors: ['#C0392B', '#000000', '#922B21'],
          image: '/images/social-media/automotive-grid.png',
          description: 'Kami menciptakan visual yang berani, tajam, dan berdampak tinggi yang mencerminkan kekuatan dan keandalan, sempurna untuk merek otomotif dan bengkel yang menginginkan tampilan modern, profesional, dan berorientasi performa.',
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
          image: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&q=80&w=800',
        },
        {
          title: 'PT. Bank Rakyat Indonesia (Persero) Tbk',
          description: 'Kami mendokumentasikan dan memproduksi video event BRI Peduli - Srikandi BRI dengan fokus pada penyampaian momen penting, nilai sosial, serta semangat pemberdayaan perempuan yang menjadi inti acara.',
          image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
        },
        {
          title: 'Wedding of Toar & Taya',
          description: 'Kami memproduksi video wedding cinematic yang menangkap setiap momen dengan sentuhan visual artistik, alur cerita yang emosional, dan pengambilan gambar yang dramatis.',
          image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
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
        image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop',
      },
      mainProject: {
        title: 'Tou Minaesa Project',
        description: 'Kami bantu klien membangun identitas digital podcast dari nol, mulai dari proses produksi video, set up studio, pengambilan gambar, desain thumbnail, hingga pengemasan ulang konten menjadi reels yang menarik di berbagai platform.',
        result: 'Dalam 6 bulan pengelolaan oleh Activid, podcast tumbuh pesat dari 0 subscriber menjadi 600 di YouTube, 2.7K di TikTok, dan 1K followers di Instagram. Dan sekarang sudah ada 3 Segmen turunan dari Tou Minaesa Project.',
        image: 'https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?w=1200&h=800&fit=crop',
      },
      thumbnails: [
        { src: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=600&fit=crop', alt: 'Short Video 1' },
        { src: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop', alt: 'Short Video 2' },
        { src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop', alt: 'Short Video 3' },
      ],
    },
    websiteApp: {
      header: {
        title: 'Website & App Development',
        projectTitle: 'Project\nWebsite & App\nDevelopment',
        description: [
          'Activid akan merancang dan mengembangkan desain aplikasi yang fokus pada pengalaman pengguna, tampilan yang modern, serta alur yang efisien, menciptakan solusi digital yang fungsional, menarik, dan mudah digunakan di berbagai industri.',
          'Kami memastikan setiap detail visual dan interaksi dalam aplikasi dirancang dengan tepat, agar terlihat profesional tetapi juga memberikan pengalaman yang nyaman dan intuitif bagi pengguna.',
        ],
      },
      mockups: [
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop',
      ],
      techStack: {
        title: 'Our Tech Stack',
        description: 'We use the latest and most reliable technologies to build scalable and high-performance applications.',
      },
    },
    productPhotography: {
      header: {
        title: 'Product Photography',
        description: 'Menampilkan produk Anda dengan visual yang tajam, estetik, dan profesional setiap detail difoto untuk menarik perhatian dan memperkuat identitas brand.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      },
      projects: [
        {
          title: 'Food and Beverage Photography',
          client: 'DNA Cafe & Resto',
          description: 'Kami membantu client untuk menghasilkan foto makanan dan minuman dengan visual yang rapi dan menggugah selera, menonjolkan detail dan kualitas agar terlihat lebih menarik dan siap digunakan untuk kebutuhan branding maupun promosi',
          images: [
            'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop',
          ],
        },
        {
          title: 'Property Photography',
          client: 'Yama Resort',
          description: 'Kami membantu client menghasilkan foto resort dengan visual yang estetik dan profesional, menonjolkan suasana, fasilitas, dan keindahan lingkungan agar terlihat lebih menarik dan mampu menggambarkan pengalaman menginap secara optimal.',
          images: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop',
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
        value: '+62 895-0316-2551',
        href: 'https://wa.me/+6289503162551',
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
