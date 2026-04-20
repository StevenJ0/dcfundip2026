'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/* ─── Animation Variants ─────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Testimonial Data ───────────────────────────────────────────────────────── */
const testimonials = [
  {
    name: 'Aditya',
    role: 'Juara 1 Olimpiade DCF 2025',
    avatar: '/apaKataMereka/aditya/aditya.jpg',
    quote: 'Mengikuti Olimpiade DCF tahun ini memberikan manfaat dan pengalaman yang berharga bagi saya. Soal-soal yang diberikan dari babak penyisihan sampai final sangat sulit dan menantang, membuat saya untuk terus memahami konsep secara lebih mendalam. Para peserta berasal dari seluruh Indonesia yang mengikuti lomba ini sangat kompetitif sehingga cocok untuk mengukur kemampuan dan pemahaman di bidang kimia. Selain itu, panitia dan dosen juri yang ramah membuat suasana acara ini terasa menarik dan menyenangkan bagi saya. Terima kasih untuk segenap panitia DCF tahun 2025, semoga tahun-tahun berikutnya DCF dapat berkembang menjadi lebih baik lagi.',
  },
  {
    name: 'Team Ecopaddy',
    role: 'Juara 1 LKTI DCF 2025',
    avatar: '/apaKataMereka/echopaddy/echopaddy.jpg',
    quote: 'Bagi kami, mengikuti lomba DCF yang diadakan oleh UNDIP merupakan pengalaman yang sangat berharga. Melalui kegiatan ini kami bisa menambah wawasan, mengembangkan ide dan belajar menyusun Karya Tulis Ilmiah yang lebih baik. Terima kasih kepada panitia yang telah bekerja keras menyelenggarakan kegiatan DCF ini. Panitianya juga sangat ramah dan membantu selama berlangsungnya acara. Untuk kedepannya, semoga DCF terus berkembang dan semakin menginsipirasi.',
  },
  {
    name: 'Kadep Pendidikan',
    role: 'Kadep Pendidikan HMK 2025',
    avatar: '/apaKataMereka/kadep-pendidikan-25/kadep-pendidikan-25.jpg',
    quote: 'DCF bagi aku bukan sekadar acara tahunan HMK doang, tapi tempat untuk berproses, belajar, dan banyak kenangan bersama teman-teman panitia. Di setiap tahapnya selalu ada cerita, tantangan, dan momen yang bikin kita belajar bersama. Yang ga kalah berkesan tentunya para pesertanya yang keren dan totalitas di setiap tahapannya. Antusiasme dan semangat kompetitif dari para peserta membuat DCF jadi semakin hidup dan seru dari tahun ke tahun. Banyak pengalaman seru dan cerita untuk dikenang dari DCF inii ✨',
  },
  {
    name: 'Ketua DCF 2025',
    role: 'Ketua Pelaksana DCF 2025',
    avatar: '/apaKataMereka/ketua-dcf-25/ketua-dcf-25.jpg',
    quote: 'Halo Calon Saintis Hebat! Diponegoro Chemistry Fair (DCF) 2026 kembali menjadi ruang bagi generasi muda untuk berkembang dan berani melangkah lebih jauh. Dari pengalaman sebelumnya, DCF bukan hanya sekadar kompetisi, tetapi juga perjalanan penuh makna dalam mengasah kemampuan, memperluas wawasan, serta membangun semangat untuk terus belajar. Melalui Olimpiade Kimia, LKTI, dan Seminar Nasional, DCF 2026 siap menghadirkan pengalaman yang lebih inspiratif dan menantang.',
  },
  {
    name: 'Ketua HMK',
    role: 'Ketua Himpunan Mahasiswa Kimia',
    avatar: '/apaKataMereka/ketua-hmk-26/ketua-hmk-26.jpg',
    quote: 'Diponegoro Chemistry Fair menjadi ruang yang mempertemukan semangat kompetisi, pembelajaran, dan pertukaran gagasan dalam bidang kimia. Melalui rangkaian kegiatan LKTI, kompetisi, dan seminar nasional, DCF tidak hanya menghadirkan suasana yang menantang, tetapi juga membuka ruang bagi siswa/i untuk mengasah cara berpikir kritis, menyampaikan ide, serta melihat ilmu kimia dari sudut pandang yang lebih luas. Kegiatan ini menunjukkan bahwa kimia bukan sekadar teori di ruang kelas, melainkan ilmu yang hidup, berkembang, dan dapat melahirkan berbagai gagasan yang relevan dengan tantangan di kehidupan nyata🔥👊🏻',
  },
];

/* ─── Competition Data ───────────────────────────────────────────────────────── */
const competitions = [
  {
    seed: 'dcf1',
    icon: 'science',
    title: 'Olimpiade Kimia',
    description: 'Uji pengetahuan kimiamu dalam kompetisi seru tingkat nasional dengan sistem gugur.',
    badge: 'Registration Open',
    pricing: [
      { wave: 'Gelombang 1', price: 'Rp 90.000' },
      { wave: 'Gelombang 2', price: 'Rp 100.000' }
    ],
    prizes: [
      { rank: 'Juara 1', amount: 'Rp 5.000.000' },
      { rank: 'Juara 2', amount: 'Rp 3.500.000' },
      { rank: 'Juara 3', amount: 'Rp 2.000.000' },
      { rank: 'Harapan 1', amount: 'Rp 750.000' },
      { rank: 'Harapan 2', amount: 'Rp 500.000' }
    ]
  },
  {
    seed: 'dcf2',
    icon: 'article',
    title: 'LKTI Nasional',
    description: 'Tunjukkan karya penelitian inovatifmu di bidang kimia untuk menyelesaikan masalah nyata.',
    badge: 'Limited Slots',
    pricing: [
      { wave: 'Gelombang 1', price: 'Rp 95.000' },
      { wave: 'Gelombang 2', price: 'Rp 110.000' }
    ],
    prizes: [
      { rank: 'Juara 1', amount: 'Rp 4.000.000' },
      { rank: 'Juara 2', amount: 'Rp 2.500.000' },
      { rank: 'Juara 3', amount: 'Rp 1.800.000' },
      { rank: 'Harapan 1', amount: 'Rp 850.000' },
      { rank: 'Harapan 2', amount: 'Rp 600.000' },
      { rank: 'Poster Terbaik', amount: 'Rp 300.000' }
    ]
  },
  {
    seed: 'dcf3',
    icon: 'groups',
    title: 'Seminar Nasional',
    description: 'Bangun relasi dengan peserta dari seluruh Indonesia dan pakar di bidang teknologi energi terbarukan.',
    badge: 'Coming Soon',
    pricing: [],
    prizes: []
  },
];

/* ─── Gallery Data ───────────────────────────────────────────────────────────── */
const galleryImages = [
  { src: '/dcf2025/dcf-1.jpg', className: 'md:col-span-2 md:row-span-2' },
  { src: '/dcf2025/dcf-10.JPG', className: 'md:col-span-2' },
  { src: '/dcf2025/dcf-8.JPG', className: '' },
  { src: '/dcf2025/dcf-5.JPG', className: '' },
];


/* ─── Timeline Data ──────────────────────────────────────────────────────────── */
const timelineOlimpiade = [
  { title: 'Pendaftaran Gel 1', date: '1 Mei - 30 Juni 2026', icon: 'app_registration' },
  { title: 'Pendaftaran Gel 2', date: '6 Juli - 2 Agustus 2026', icon: 'how_to_reg' },
  { title: 'Penyisihan', date: '16 Agustus 2026', icon: 'quiz' },
  { title: 'Semifinal', date: '6 September 2026', icon: 'science' },
  { title: 'Final & Pengumuman', date: '27 September 2026', icon: 'emoji_events' },
];

const timelineLKTI = [
  { title: 'Daftar/Abstrak Gel 1', date: '1 Mei - 30 Juni 2026', icon: 'app_registration' },
  { title: 'Gelombang Diskon', date: '24-25 Mei 2026', icon: 'sell' },
  { title: 'Daftar/Abstrak Gel 2', date: '6 Juli - 2 Agustus 2026', icon: 'how_to_reg' },
  { title: 'Full Paper Gel 1', date: '6 Juli - 2 Agustus 2026', icon: 'upload_file' },
  { title: 'Full Paper Gel 2', date: '7 Agustus - 29 Agustus 2026', icon: 'publish' },
  { title: 'Final & Pengumuman', date: '27 September 2026', icon: 'emoji_events' },
];


/* ─── Alur Pendaftaran Data ──────────────────────────────────────────────────── */
const registrationSteps = [
  { num: 1, title: 'Akses Website',       desc: 'Peserta membuka website dan melihat informasi lomba.' },
  { num: 2, title: 'Membuat Akun',        desc: 'Peserta wajib membuat akun dengan menggunakan email.' },
  { num: 3, title: 'Login',               desc: 'Setelah akun dibuat, peserta dapat login ke dashboard mereka.' },
  { num: 4, title: 'Dashboard Pengguna',  desc: 'Setelah login, peserta akan diarahkan ke tampilan dashboard.' },
  { num: 5, title: 'Pendaftaran Lomba',   desc: 'Peserta memilih jenis lomba, mengisi data, dan mengunggah dokumen persyaratan.' },
  { num: 6, title: 'Verifikasi Profil',   desc: 'Data yang diunggah akan diverifikasi oleh panitia.' },
];

/* ─── Shared Tab Toggle UI ───────────────────────────────────────────────────── */
type TabKey = 'olimpiade' | 'lkti';

function TabToggle({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (key: TabKey) => void;
}) {
  return (
    <div className="bg-surface-container-high p-1.5 rounded-full inline-flex gap-1">
      {(['olimpiade', 'lkti'] as TabKey[]).map((key) => (
        <motion.button
          key={key}
          layout
          onClick={() => onChange(key)}
          className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
            active === key
              ? 'bg-primary-container text-on-primary-container font-bold'
              : 'text-on-surface-variant hover:text-white'
          }`}
        >
          {key === 'olimpiade' ? 'Olimpiade Kimia' : 'LKTI Nasional'}
        </motion.button>
      ))}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────────── */
export default function HomeView() {
  const [activeTimeline, setActiveTimeline] = useState<TabKey>('olimpiade');

  const currentTimeline = activeTimeline === 'olimpiade' ? timelineOlimpiade : timelineLKTI;

  return (
    <div className="bg-surface text-on-surface">
      <Navbar />

      <main>

        {/* ─── Hero Section ──────────────────────────────────────────────────── */}
        <section id="beranda" className="relative min-h-screen flex items-center pt-32 md:pt-40 overflow-hidden bg-surface">
          <div className="absolute inset-0 z-0">
            <Image
              alt="DCF 2026 Core Event"
              className="w-full h-full object-cover"
              src="/dcf2025/dcf-1.jpg"
              fill
              priority
              sizes="100vw"
            />
            {/* Hard Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/60 to-surface" />
          </div>

          <div className="container mx-auto px-8 relative z-10">
            <motion.div className="max-w-4xl" variants={stagger} initial="hidden" animate="visible">
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container rounded-full text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6"
              >
                <span className="material-symbols-outlined text-sm">energy_savings_leaf</span>
                Sustainable Energy Future
              </motion.div>

              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="text-6xl md:text-8xl font-bold leading-none tracking-tighter text-white mb-8"
              >
                The <span className="text-primary italic">Molecular</span> Alchemist
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="text-xl md:text-2xl text-[#c8c8ad] max-w-2xl mb-12 leading-relaxed font-medium drop-shadow-xl"
              >
                Diponegoro Chemistry Fair 2026 invites you to explore the intersection of chemical precision and
                renewable energy innovation. Shaping a sustainable tomorrow, one molecule at a time.
              </motion.p>

              <motion.div variants={fadeUp} transition={{ duration: 0.8 }} className="flex flex-col sm:flex-row gap-6">
                <Link href="/register">
                  <button className="bg-primary-container text-on-primary-container px-10 py-5 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(213,230,41,0.3)] transition-all">
                    Daftar Sekarang
                  </button>
                </Link>
                <Link href="#tentang">
                  <button className="border border-outline-variant text-white bg-black/30 backdrop-blur-sm px-10 py-5 rounded-xl font-bold text-lg hover:bg-surface-variant transition-all">
                    Learn More
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="hidden lg:block absolute right-[-5%] top-1/2 -translate-y-1/2 w-1/3 aspect-square border-[40px] border-primary-container/10 rounded-full blur-3xl"
          />
        </section>

        {/* ─── "Apa Itu DCF 2026?" Section ───────────────────────────────────── */}
        <section id="tentang" className="py-32 bg-surface-container-low">
          <div className="container mx-auto px-8">
            <div className="grid md:grid-cols-2 gap-20 items-center">

              <motion.div
                className="relative"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative border border-outline-variant/30">
                  <Image
                    alt="DCF Official Representation"
                    className="w-full h-full object-cover"
                    src="/dcf2025/dcf-3.JPG"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-primary-container/10 mix-blend-overlay"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-48 h-48 md:w-64 md:h-64 bg-primary-container p-6 md:p-8 rounded-3xl hidden lg:block shadow-[0_0_50px_rgba(213,230,41,0.2)]">
                  <h3 className="text-on-primary-container font-headline text-2xl md:text-3xl font-bold leading-tight">
                    Catalyzing Change Since 2012
                  </h3>
                </div>
              </motion.div>

              <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.h2
                  variants={fadeUp}
                  transition={{ duration: 0.7 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-8"
                >
                  Apa Itu DCF 2026?
                </motion.h2>
                <div className="space-y-6">
                  <motion.p
                    variants={fadeUp}
                    transition={{ duration: 0.7 }}
                    className="text-on-surface-variant text-lg leading-relaxed"
                  >
                    Diponegoro Chemistry Fair adalah ajang kompetisi ilmiah kimia terbesar tingkat nasional yang diadakan oleh Himpunan Mahasiswa Kimia UNDIP. Kami memadukan
                    sains, kreativitas, dan inovasi untuk menciptakan ruang bagi generasi muda dalam memecahkan masalah di masa depan berkelanjutan.
                  </motion.p>
                  <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="grid grid-cols-2 gap-8 pt-8">
                    <div>
                      <div className="text-primary text-4xl font-bold mb-2">500+</div>
                      <div className="text-on-surface text-sm font-medium">Peserta Nasional</div>
                    </div>
                    <div>
                      <div className="text-primary text-4xl font-bold mb-2">20k+</div>
                      <div className="text-on-surface text-sm font-medium">Total Hadiah (Rp)</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ─── Competitions Section ──────────────────────────────────────────── */}
        <section id="hadiah" className="py-32 bg-surface">
          <div className="container mx-auto px-8">
            <motion.div
              className="flex flex-col mb-16 gap-4 text-center md:text-left"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-bold text-white">Kompetisi</h2>
              <p className="text-on-surface-variant text-lg md:max-w-xl italic">
                Showcase your innovation across disciplines designed to push the boundaries of chemical science.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-8"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {competitions.slice(0, 2).map((comp) => (
                <motion.div
                  key={comp.seed}
                  variants={fadeUp}
                  transition={{ duration: 0.6 }}
                  className="group bg-surface-container rounded-3xl overflow-hidden border border-secondary-container hover:border-primary-container/50 transition-all duration-300 flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(213,230,41,0.1)]"
                >
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6 text-primary border border-outline-variant/30">
                      <span className="material-symbols-outlined text-4xl">{comp.icon}</span>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-white mb-4">{comp.title}</h3>
                    <p className="text-on-surface-variant text-sm mb-8 leading-relaxed flex-grow">{comp.description}</p>
                    
                    {comp.pricing.length > 0 && (
                      <div className="space-y-3 mb-6 border-t border-b border-outline-variant/20 py-5">
                        <p className="text-xs font-bold text-primary-container uppercase tracking-widest bg-primary-container/10 inline-block px-3 py-1 rounded-full text-center w-full mb-2">Biaya Pendaftaran</p>
                        {comp.pricing.map(p => (
                          <div key={p.wave} className="flex justify-between items-center">
                             <span className="text-sm text-on-surface-variant font-medium">{p.wave}</span>
                             <span className="text-sm font-bold text-white">{p.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {comp.prizes.length > 0 && (
                      <div className="space-y-3 mb-8">
                        <p className="text-xs font-bold text-primary-container uppercase tracking-widest bg-primary-container/10 inline-block px-3 py-1 rounded-full text-center w-full mb-2">Hadiah Utama</p>
                        {comp.prizes.map(p => (
                          <div key={p.rank} className="flex justify-between items-center">
                             <span className="text-sm text-on-surface-variant font-medium">{p.rank}</span>
                             <span className="text-sm font-bold text-[#d5e629]">{p.amount}</span>
                          </div>
                        ))}
                        {comp.prizes.length > 3 && (
                           <div className="pt-2 flex justify-end">
                             <p className="text-[10px] text-on-surface-variant italic">+ Harapan &amp; Kategori Spesial</p>
                           </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-auto mt-auto border-t border-outline-variant/30 pt-6">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{comp.badge}</span>
                      <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Seminar Nasional Wide Banner */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 bg-surface-container-highest rounded-3xl border border-secondary-container hover:border-primary-container/50 transition-all duration-300 flex flex-col md:flex-row shadow-[0_10px_40px_rgba(213,230,41,0.05)] overflow-hidden items-center group relative p-8 md:p-12"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6 md:mb-0 md:mr-8 text-primary border border-outline-variant/30 flex-shrink-0">
                 <span className="material-symbols-outlined text-4xl md:text-5xl">{competitions[2].icon}</span>
              </div>
              <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left">
                 <h3 className="text-3xl font-bold text-white mb-2">{competitions[2].title}</h3>
                 <p className="text-on-surface-variant text-sm mb-6 max-w-xl">{competitions[2].description}</p>
                 <div className="flex gap-4 md:gap-8 justify-center md:justify-start w-full">
                    <div>
                       <p className="text-xs text-on-surface-variant font-bold uppercase">Harga</p>
                       <p className="text-white font-bold">TBA (Akan Datang)</p>
                    </div>
                    <div>
                       <p className="text-xs text-on-surface-variant font-bold uppercase">Benefit</p>
                       <p className="text-white font-bold">E-Sertifikat, Ilmu, Relasi Nasional</p>
                    </div>
                 </div>
              </div>
              <div className="mt-8 md:mt-0 md:ml-8 flex-shrink-0">
                 <span className="bg-primary-container/10 text-primary-container px-6 py-4 rounded-full text-sm font-bold uppercase tracking-widest block text-center border border-primary-container/20 group-hover:bg-primary-container group-hover:text-[#001809] hover:-translate-y-1 transition-all cursor-pointer">
                    {competitions[2].badge}
                 </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Testimonials Section ─────────────────────────────────────────── */}
        <section className="py-32 bg-surface-container-low relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

          <div className="container mx-auto px-8 relative z-10">
            <motion.div
              className="mb-16"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-5xl font-bold text-white mb-4">Apa Kata Mereka?</h2>
              <p className="text-on-surface-variant text-lg italic">Pendapat peserta dan panitia DCF tahun lalu.</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="bg-surface-container border border-outline-variant/30 hover:border-primary-container/40 transition-colors rounded-3xl p-8 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="text-7xl leading-none font-serif text-primary-container opacity-40 mb-2 select-none">&ldquo;</div>
                    <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-6">{t.quote}</p>
                  </div>
                  <div className="border-t border-outline-variant/20 my-6" />
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary-container/30">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{t.name}</div>
                      <div className="text-primary-container text-[11px] font-medium tracking-wide uppercase mt-0.5 max-w-[200px] leading-tight">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── Timeline DCF 2026 ─────────────────────────────────────────────── */}
        <section id="jadwal" className="py-32 bg-surface">
          <div className="container mx-auto px-8">

            <motion.div
              className="text-center mb-12"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Timeline DCF 2026</h2>
              <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
                Jangan lewatkan setiap tahapan penting dalam perjalanan Diponegoro Chemistry Fair 2026
              </p>
            </motion.div>

            <motion.div
              className="flex justify-center mb-16"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <TabToggle active={activeTimeline} onChange={setActiveTimeline} />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTimeline}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="relative flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 max-w-5xl mx-auto"
              >
                {/* Horizontal connector line — desktop only */}
                <div className="absolute top-6 left-12 right-12 h-0.5 bg-outline-variant/30 hidden md:block" />

                {currentTimeline.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex flex-col items-center relative z-10 w-full md:w-[150px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-surface-container border-2 border-primary-container text-primary-container flex items-center justify-center shadow-[0_0_15px_rgba(213,230,41,0.2)] bg-surface-container-highest">
                      <span className="material-symbols-outlined text-xl">{step.icon}</span>
                    </div>
                    <div className="rounded-2xl mt-4 text-center">
                      <p className="text-white font-bold text-sm mb-1">{step.title}</p>
                      <p className="text-on-surface-variant text-xs leading-relaxed">{step.date}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

          </div>
        </section>

        {/* ─── Kenangan DCF Photo Gallery ────────────────────────────────────── */}
        <section className="py-32 bg-surface-container-low border-t border-outline-variant/10">
          <div className="container mx-auto px-8">
            <motion.div
              className="text-center mb-16"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">Galeri Memori DCF</h2>
              <p className="text-on-surface-variant text-lg">Momen keseruan dan semangat kompetisi dari tahun-tahun sebelumnya.</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[700px]"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {galleryImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  transition={{ duration: 0.7 }}
                  className={`${img.className} relative rounded-[40px] overflow-hidden min-h-[240px] group border border-outline-variant/20`}
                >
                  <Image alt={`Kenangan DCF ${idx+1}`} src={img.src} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" sizes="(max-width: 768px) 100vw, 25vw" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── Alur Pendaftaran ──────────────────────────────────────────────── */}
        <section id="cara-daftar" className="py-32 bg-surface">
          <div className="container mx-auto px-8">

            <motion.div
              className="text-center mb-20"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Alur Pendaftaran</h2>
              <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
                Ikuti panduan langkah-langkah berikut untuk mendaftar DCF 2026
              </p>
            </motion.div>

            {/* Vertical Timeline */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-outline-variant/30" />

              <div className="space-y-10">
                {registrationSteps.map((step, i) => {
                  const isEven = i % 2 === 0;
                  return (
                    <motion.div
                      key={step.num}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={`relative flex items-start gap-6 md:gap-0 ${
                        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      <div className="hidden md:block md:w-1/2" />
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-highest border border-primary-container text-primary-container font-headline font-bold text-lg flex items-center justify-center z-10 md:absolute md:left-1/2 md:-translate-x-1/2 shadow-lg">
                        {step.num}
                      </div>

                      <div className={`flex-1 md:w-1/2 ${
                        isEven ? 'md:pl-10' : 'md:pr-10 md:text-right'
                      }`}>
                        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 shadow-lg hover:border-primary-container/30 transition-colors">
                          <p className="text-white font-bold mb-1 tracking-wide">{step.title}</p>
                          <p className="text-on-surface-variant text-sm leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ─── CTA Section ───────────────────────────────────────────────────── */}
        <section id="contact" className="py-24 bg-surface px-8">
          <div className="container mx-auto">
            <motion.div
              className="bg-gradient-to-r from-secondary-container to-surface-container-highest rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden border border-outline-variant/20"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,0 L100,100 M100,0 L0,100" fill="none" stroke="#d5e629" strokeWidth="0.1" />
                </svg>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
                Ready to <span className="text-primary italic border-b-4 border-primary">Catalyze</span> your future?
              </h2>
              <p className="text-on-surface-variant text-xl max-w-2xl mx-auto mb-12 drop-shadow-md">
                Registration for the Diponegoro Chemistry Fair 2026 is officially open for high school and university students nationwide.
              </p>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-primary-container text-on-primary-container px-12 py-6 rounded-full font-headline font-bold text-xl transition-shadow hover:shadow-[0_0_40px_rgba(213,230,41,0.4)] relative z-10"
                >
                  Yuk, Daftar Sekarang!
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}