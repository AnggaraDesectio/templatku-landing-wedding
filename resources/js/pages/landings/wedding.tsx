// Landing page BAHAGIA WEDDING ORGANIZER.
// Halaman ini TIDAK memakai AuthenticatedLayout, header/nav + footer inline, self-contained.
// Tidak menerima props.
import { useMemo, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StickyMobileCta } from '@/components/sticky-mobile-cta';
import { StatCounter } from '@/components/stat-counter';
import {
    Cake,
    CalendarCheck,
    Camera,
    CheckCircle2,
    ChevronRight,
    Flower2,
    Gem,
    Handshake,
    Heart,
    Menu,
    Music,
    Phone,
    Quote,
    Sparkles,
    UtensilsCrossed,
    X,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Format rupiah gaya Indonesia: 45000000 -> "Rp45.000.000"
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

// ---------- Data ----------

interface Paket {
    nama: string;
    harga: number;
    tamu: string;
    fitur: string[];
    icon: LucideIcon;
    unggulan?: boolean;
}

const PAKET: Paket[] = [
    {
        nama: 'Silver',
        harga: 45_000_000,
        tamu: 's.d. 300 tamu',
        fitur: ['Dekorasi pelaminan standar', 'Katering 300 pax + 50 box', 'Dokumentasi foto (1 fotografer)', 'MC & rundown acara', 'Rias pengantin + 2 orang'],
        icon: Flower2,
    },
    {
        nama: 'Gold',
        harga: 85_000_000,
        tamu: 's.d. 600 tamu',
        fitur: ['Dekorasi pelaminan premium', 'Katering 600 pax + 100 box', 'Foto + video sinematik (2 tim)', 'MC profesional + entertainment', 'Rias pengantin + keluarga inti', 'Buku tamu digital & souvenir'],
        icon: Gem,
        unggulan: true,
    },
    {
        nama: 'Platinum',
        harga: 150_000_000,
        tamu: 's.d. 1.000 tamu',
        fitur: ['Dekorasi custom tematik', 'Katering 1.000 pax + 200 box', 'Foto + video + drone (3 tim)', 'MC artis + live music', 'Rias full + prewedding session', 'Koordinator khusus 2 orang'],
        icon: Sparkles,
    },
];

const GALERI = [
    { judul: 'Akad outdoor bernuansa sage', foto: '/images/landing-wedding/galeri-akad.jpg' },
    { judul: 'Pelaminan adat Jawa modern', foto: '/images/landing-wedding/galeri-pelaminan.jpg' },
    { judul: 'Resepsi garden party', foto: '/images/landing-wedding/galeri-garden.jpg' },
    { judul: 'Dekorasi rustic intimate', foto: '/images/landing-wedding/galeri-rustic.jpg' },
    { judul: 'Glamour ballroom', foto: '/images/landing-wedding/galeri-ballroom.jpg' },
    { judul: 'Prewedding pantai', foto: '/images/landing-wedding/galeri-prewedding.jpg' },
];

const LAYANAN = [
    { nama: 'Dekorasi', deskripsi: 'Pelaminan, entrance, dan table setting sesuai tema impianmu, dari adat hingga modern minimalis.', icon: Flower2 },
    { nama: 'Katering', deskripsi: 'Menu prasmanan, stall, dan dessert dengan 40+ pilihan menu nusantara & internasional. Termasuk food tasting.', icon: UtensilsCrossed },
    { nama: 'Dokumentasi', deskripsi: 'Foto, video sinematik, dan drone. Album premium + file digital resolusi penuh.', icon: Camera },
    { nama: 'Rias & Busana', deskripsi: 'MUA profesional, busana pengantin, dan fitting 2x sebelum hari-H.', icon: Sparkles },
    { nama: 'Hiburan', deskripsi: 'MC, live music, hingga pertunjukan tradisional untuk memeriahkan acaramu.', icon: Music },
    { nama: 'Koordinator Hari-H', deskripsi: 'Tim lapangan memastikan rundown berjalan mulus, kamu tinggal menikmati momen.', icon: Handshake },
];

// Persona: paket mana cocok untuk siapa, pola section pembeda.
const PERSONA = [
    {
        untuk: 'Pasangan intimate',
        ciri: '100–300 tamu, akad + resepsi keluarga',
        rekomendasi: 'Paket Silver',
        alasan: 'Semua esensial ter-cover: dekorasi, katering, dokumentasi, rias. Budget tetap terkendali.',
        foto: '/images/landing-wedding/galeri-rustic.jpg',
    },
    {
        untuk: 'Resepsi grand',
        ciri: '300–600 tamu, gedung atau garden party',
        rekomendasi: 'Paket Gold',
        alasan: 'Pilihan 6 dari 10 pasangan: dekorasi premium + 2 tim dokumentasi + entertainment lengkap.',
        foto: '/images/landing-wedding/galeri-ballroom.jpg',
    },
    {
        untuk: 'Pernikahan impian custom',
        ciri: 'Tema khusus, adat, atau 600+ tamu',
        rekomendasi: 'Paket Platinum / Custom',
        alasan: 'Dekorasi tematik dari nol, drone, MC artis, dan koordinator khusus 2 orang.',
        foto: '/images/landing-wedding/galeri-pelaminan.jpg',
    },
];

const ALUR = [
    { judul: 'Konsultasi & survei venue', deskripsi: 'Ceritakan konsep impianmu. Kami survei venue dan susun proposal.' },
    { judul: 'Pilih paket & DP 30%', deskripsi: 'Tanggalmu resmi terkunci setelah DP. Slot weekend cepat penuh!' },
    { judul: 'Technical meeting', deskripsi: 'Finalisasi dekor, menu tasting, rundown, dan gladi bersih H-1.' },
    { judul: 'Hari-H bahagia', deskripsi: 'Tim kami handle semuanya. Kamu fokus jadi raja & ratu sehari.' },
];

// Testimoni teratribusi: nama pasangan + hasil terukur.
const TESTIMONI = [
    { kutip: 'Dari awal sampai akhir kami nggak stres sama sekali. Dekorasinya persis kayak moodboard yang kami kirim, 9 dari 10 tamu memuji pelaminannya!', pasangan: 'Andini & Bagas', kota: 'Jakarta', detail: 'Paket Gold, 620 tamu, 12 Mei 2026' },
    { kutip: 'Kateringnya sampai dipuji tamu-tamu. Koordinatornya sigap banget, rundown molor 10 menit langsung dikejar tanpa kami sadari.', pasangan: 'Putri & Dimas', kota: 'Bandung', detail: 'Paket Silver, 280 tamu, 21 Maret 2026' },
    { kutip: 'Budget kami terbatas tapi hasilnya terlihat mewah. Foto prewedding-nya juga jadi favorit keluarga besar.', pasangan: 'Salsa & Rian', kota: 'Surabaya', detail: 'Paket Gold custom, 450 tamu, 8 Februari 2026' },
];

const FAQ = [
    {
        q: 'Berapa DP untuk mengunci tanggal?',
        a: 'DP 30% dari nilai paket. Pelunasan dibagi 2 tahap: 40% H-30 dan 30% H-7 sebelum acara. Semua pembayaran resmi dengan kuitansi dan kontrak kerja.',
    },
    {
        q: 'Apakah bisa custom paket di luar Silver/Gold/Platinum?',
        a: 'Bisa. Sekitar 60% klien kami memakai paket custom, misalnya dekorasi Gold dengan katering Silver. Konsultasikan saja kebutuhanmu, kami susun penawarannya.',
    },
    {
        q: 'Apakah melayani di luar kota?',
        a: 'Ya, kami berbasis di Jakarta dan melayani Jabodetabek, Bandung, dan Surabaya. Untuk kota lain, ada biaya akomodasi tim yang dihitung transparan di proposal.',
    },
    {
        q: 'Bagaimana jika acara harus dijadwal ulang?',
        a: 'Penjadwalan ulang gratis 1x maksimal H-30 (tergantung ketersediaan tanggal baru). Pembatalan mengikuti skema refund bertahap yang tertulis di kontrak.',
    },
    {
        q: 'Apakah ada food tasting sebelum memilih menu?',
        a: 'Ada, gratis untuk 4 orang pada paket Gold dan Platinum (2 orang untuk Silver). Dilakukan H-60 sampai H-30 sebelum acara.',
    },
];

// ---------- Halaman ----------

export default function WeddingLanding() {
    const [menuBuka, setMenuBuka] = useState(false);

    // Form cek tanggal, tanpa backend, hanya state konfirmasi.
    const [nama, setNama] = useState('');
    const [noWa, setNoWa] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [paket, setPaket] = useState('Gold');
    const [cekOk, setCekOk] = useState<'tersedia' | 'penuh' | null>(null);

    // Tanggal minimal = besok.
    const besok = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        const bln = String(d.getMonth() + 1).padStart(2, '0');
        const tgl = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${bln}-${tgl}`;
    }, []);

    function cekTanggal(e: FormEvent) {
        e.preventDefault();
        if (!nama.trim() || !tanggal) return;
        // Simulasi ketersediaan: tanggal genap = tersedia (ilustrasi, bukan data nyata).
        const tgl = Number(tanggal.split('-')[2]);
        setCekOk(tgl % 2 === 0 ? 'tersedia' : 'penuh');
    }

    const scrollKe = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    const navLinks = [
        { href: '#beranda', label: 'Beranda' },
        { href: '#paket', label: 'Paket' },
        { href: '#galeri', label: 'Galeri' },
        { href: '#layanan', label: 'Layanan' },
        { href: '#faq', label: 'FAQ' },
    ];

    return (
        <div className="min-h-screen bg-[#fdf7f5] pb-24 text-stone-900 md:pb-0">
            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b border-rose-900/10 bg-[#fdf7f5]/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <a href="#beranda" className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600">
                            <Heart className="h-5 w-5 text-white" />
                        </span>
                        <span className="text-xl font-extrabold tracking-tight">
                            BAHAGIA <span className="font-light text-rose-600">wedding organizer</span>
                        </span>
                    </a>
                    <nav className="ml-8 hidden items-center gap-1 md:flex">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-rose-600/5 hover:text-stone-900">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <Button className="ml-auto hidden bg-rose-600 hover:bg-rose-700 sm:inline-flex" onClick={() => scrollKe('cek-tanggal')}>
                        Cek Tanggal
                    </Button>
                    <Button variant="ghost" size="icon" className="ml-auto sm:hidden" onClick={() => setMenuBuka((v) => !v)} aria-label="Menu">
                        {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
                {menuBuka && (
                    <nav className="border-t border-rose-900/10 px-4 py-2 md:hidden">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} onClick={() => setMenuBuka(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-rose-600/5">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* Hero, 1 proposisi konkret */}
            <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(244,114,182,.18) 0, transparent 40%), radial-gradient(circle at 85% 75%, rgba(251,191,36,.15) 0, transparent 40%)' }} aria-hidden />
                <div className="relative mx-auto max-w-6xl px-4 py-14 text-center sm:py-20">
                    <p className="font-display text-lg italic text-rose-700">Assalamu'alaikum, calon pengantin...</p>
                    <h1 className="font-display mx-auto mt-2 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        850+ pernikahan tanpa drama. <span className="text-rose-600">Hari bahagiamu, kami yang urus.</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-stone-600">
                        12 tahun mewujudkan pernikahan, dari akad intimate 100 tamu sampai resepsi
                        megah 1.000 tamu. Kamu tinggal datang dan bahagia.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                        <Button size="lg" className="bg-rose-600 hover:bg-rose-700" onClick={() => scrollKe('cek-tanggal')}>
                            Cek Ketersediaan Tanggal
                        </Button>
                        <button onClick={() => scrollKe('paket')} className="text-sm font-semibold text-stone-600 underline decoration-rose-400 decoration-2 underline-offset-4 hover:text-stone-900">
                            Lihat paket & harga
                        </button>
                    </div>
                    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4">
                        {[
                            { nilai: 850, suffix: '+', label: 'Pernikahan ditangani' },
                            { nilai: 12, suffix: ' thn', label: 'Pengalaman' },
                            { nilai: 49, suffix: '', label: 'Vendor partner' },
                        ].map((s) => (
                            <div key={s.label} className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                                <p className="tnum text-2xl font-extrabold text-rose-600 sm:text-3xl">
                                    <StatCounter value={s.nilai} suffix={s.suffix} />
                                </p>
                                <p className="mt-1 text-xs text-stone-500">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cocok untuk siapa, persona berfoto */}
            <section className="mx-auto max-w-6xl px-4 py-14">
                <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-700">Cocok Untuk Siapa</p>
                    <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Tiga tipe pasangan, tiga jawaban</h2>
                    <p className="mt-2 text-stone-600">Tidak yakin mulai dari mana? Temukan tipe pernikahanmu dulu.</p>
                </div>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {PERSONA.map((p) => (
                        <Card key={p.untuk} className="group overflow-hidden transition-shadow hover:shadow-xl">
                            <div className="relative h-44 overflow-hidden">
                                <img src={p.foto} alt={p.untuk} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="font-display text-xl font-bold text-white">{p.untuk}</p>
                                    <p className="text-xs text-white/75">{p.ciri}</p>
                                </div>
                            </div>
                            <CardContent className="p-5">
                                <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">{p.rekomendasi}</Badge>
                                <p className="mt-3 text-sm text-stone-600">{p.alasan}</p>
                                <button onClick={() => scrollKe('paket')} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-rose-700 hover:gap-2 hover:text-rose-800">
                                    Lihat detail paket <ChevronRight className="h-4 w-4" />
                                </button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Paket */}
            <section id="paket" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-14">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-700">Paket Pernikahan</p>
                    <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Pilih paket sesuai mimpimu</h2>
                    <p className="mx-auto mt-2 max-w-lg text-stone-600">Semua paket all-in: dekorasi, katering, dokumentasi, rias, dan koordinator hari-H.</p>
                </div>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {PAKET.map((p) => (
                        <Card key={p.nama} className={cn('relative flex flex-col overflow-hidden transition-shadow hover:shadow-xl', p.unggulan && 'border-rose-600 shadow-lg ring-2 ring-rose-600/20')}>
                            {p.unggulan && <Badge className="absolute top-3 right-3 z-10 bg-rose-600 hover:bg-rose-600">Paling Dipilih, 6 dari 10 pasangan</Badge>}
                            <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 p-6 text-center text-white">
                                <p.icon className="mx-auto h-10 w-10" strokeWidth={1.25} />
                                <p className="mt-2 text-2xl font-extrabold tracking-wide">{p.nama}</p>
                                <p className="text-sm text-rose-100">{p.tamu}</p>
                            </div>
                            <CardContent className="flex flex-1 flex-col p-6">
                                <p className="text-center">
                                    <span className="text-xs text-stone-500">Mulai dari</span><br />
                                    <span className="tnum text-3xl font-extrabold text-rose-700">{rupiah(p.harga)}</span>
                                </p>
                                <ul className="mt-4 flex-1 space-y-2 text-sm text-stone-700">
                                    {p.fitur.map((f) => (
                                        <li key={f} className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button className={cn('mt-5 w-full', p.unggulan ? 'bg-rose-600 hover:bg-rose-700' : '')} variant={p.unggulan ? 'default' : 'outline'} onClick={() => { setPaket(p.nama); scrollKe('cek-tanggal'); }}>
                                    Pilih Paket {p.nama}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <p className="mt-4 text-center text-xs text-stone-500">Harga dapat berubah mengikuti venue & jumlah tamu final, proposal rinci gratis setelah konsultasi.</p>
            </section>

            {/* Galeri */}
            <section id="galeri" className="scroll-mt-16 bg-white py-14">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-700">Galeri</p>
                        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Momen yang kami abadikan</h2>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
                        {GALERI.map((g) => (
                            <div key={g.judul} className="group overflow-hidden rounded-2xl">
                                <div className="relative h-48 sm:h-56">
                                    <img src={g.foto} alt={g.judul} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" aria-hidden />
                                    <p className="absolute bottom-4 left-4 text-sm font-semibold text-white">{g.judul}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Layanan */}
            <section id="layanan" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-14">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-700">Layanan</p>
                    <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Satu tim untuk semua kebutuhan</h2>
                </div>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {LAYANAN.map((l) => (
                        <Card key={l.nama} className="transition-shadow hover:shadow-md">
                            <CardContent className="p-5">
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100">
                                    <l.icon className="h-5 w-5 text-rose-700" />
                                </span>
                                <p className="mt-3 font-bold">{l.nama}</p>
                                <p className="mt-1 text-sm text-stone-600">{l.deskripsi}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Alur booking */}
            <section className="bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 py-14 text-white">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-100">Alur Booking</p>
                        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Dari kenalan sampai hari-H</h2>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {ALUR.map((a, i) => (
                            <div key={a.judul} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                                <p className="flex items-center gap-2 text-sm font-bold text-rose-100">
                                    <span className="tnum flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-extrabold text-rose-600">{i + 1}</span>
                                    {a.judul}
                                </p>
                                <p className="mt-2 text-sm text-rose-50/90">{a.deskripsi}</p>
                                {i < ALUR.length - 1 && <ChevronRight className="mt-3 hidden h-5 w-5 text-white/50 lg:block" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimoni teratribusi */}
            <section className="mx-auto max-w-6xl px-4 py-14">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-700">Testimoni</p>
                    <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Cerita pasangan bahagia</h2>
                </div>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {TESTIMONI.map((t) => (
                        <Card key={t.pasangan} className="border-rose-900/10">
                            <CardContent className="p-6">
                                <Quote className="h-8 w-8 text-rose-300" />
                                <p className="mt-3 text-sm leading-relaxed text-stone-700 italic">"{t.kutip}"</p>
                                <div className="mt-4 flex items-center gap-3 border-t border-rose-900/10 pt-4">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-600 text-sm font-bold text-white">
                                        {t.pasangan.charAt(0)}
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold">{t.pasangan}, {t.kota}</p>
                                        <p className="text-xs text-stone-500">{t.detail}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Cek tanggal */}
            <section id="cek-tanggal" className="scroll-mt-16 bg-stone-950 py-14 text-white">
                <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 lg:grid-cols-2">
                    <div>
                        <h2 className="font-display text-3xl font-extrabold tracking-tight">Amankan tanggal bahagiamu</h2>
                        <p className="mt-2 max-w-md text-sm text-stone-400">
                            Tanggal cantik dan weekend cepat penuh, idealnya booking 6–12 bulan sebelumnya.
                            Cek dulu tanggal incaranmu, gratis tanpa komitmen.
                        </p>
                        <div className="mt-5 flex items-center gap-2 text-sm text-stone-300">
                            <CalendarCheck className="h-5 w-5 text-rose-400" />
                            <span>Rata-rata klien kami booking <span className="tnum font-bold text-white">8 bulan</span> sebelum hari-H</span>
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Cek Tanggal Acara</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={cekTanggal} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="bw-nama">Nama calon pengantin</Label>
                                        <Input id="bw-nama" placeholder="cth: Andini & Bagas" value={nama} onChange={(e) => { setNama(e.target.value); setCekOk(null); }} required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="bw-wa">Nomor WhatsApp</Label>
                                        <Input id="bw-wa" placeholder="cth: 081234567890" inputMode="tel" value={noWa} onChange={(e) => setNoWa(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="bw-tanggal">Tanggal rencana acara</Label>
                                        <Input id="bw-tanggal" type="date" min={besok} value={tanggal} onChange={(e) => { setTanggal(e.target.value); setCekOk(null); }} required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="bw-paket">Paket incaran</Label>
                                        <Select value={paket} onValueChange={setPaket}>
                                            <SelectTrigger id="bw-paket">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['Silver', 'Gold', 'Platinum', 'Custom'].map((p) => (
                                                    <SelectItem key={p} value={p}>{p}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">Cek Ketersediaan</Button>
                            </form>
                            {cekOk === 'tersedia' && (
                                <div className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-800">
                                    <p className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-5 w-5 text-green-600" /> Kabar baik, {nama}!</p>
                                    <p className="mt-1">Tanggal {tanggal} masih tersedia untuk paket {paket}. Tim kami akan menghubungimu di {noWa} untuk konsultasi lanjutan.</p>
                                </div>
                            )}
                            {cekOk === 'penuh' && (
                                <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                                    <p className="font-bold">Tanggal {tanggal} sudah terisi penuh.</p>
                                    <p className="mt-1">Jangan khawatir, tim kami akan menghubungimu di {noWa} untuk menawarkan tanggal alternatif terdekat atau paket custom.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mx-auto max-w-3xl scroll-mt-16 px-4 py-14">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-700">FAQ</p>
                    <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Pertanyaan umum</h2>
                </div>
                <Accordion type="single" collapsible className="mt-8">
                    {FAQ.map((f, i) => (
                        <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                            <AccordionContent className="text-stone-600">{f.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* Footer */}
            <footer className="bg-stone-950 text-stone-400">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600">
                                <Heart className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-lg font-extrabold text-white">BAHAGIA <span className="font-light text-rose-400">wedding organizer</span></span>
                        </div>
                        <p className="mt-3 text-sm">Mewujudkan hari bahagia sejak 2014. Jakarta • Bandung • Surabaya.</p>
                    </div>
                    <div>
                        <p className="flex items-center gap-2 font-semibold text-white"><Cake className="h-4 w-4" /> Paket</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Silver, {rupiah(45_000_000)}</li>
                            <li>Gold, {rupiah(85_000_000)}</li>
                            <li>Platinum, {rupiah(150_000_000)}</li>
                        </ul>
                    </div>
                    <div>
                        <p className="flex items-center gap-2 font-semibold text-white"><Phone className="h-4 w-4" /> Kontak</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>0812-3456-7890</li>
                            <li>halo@bahagiawo.id</li>
                            <li>Jl. Kemang Timur No. 88, Jakarta</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-stone-800 py-4 text-center text-xs">© 2026 Bahagia Wedding Organizer. Untuk setiap kisah cinta.</div>
            </footer>

            {/* CTA sticky mobile */}
            <StickyMobileCta
                variant="whatsapp"
                title="Bahagia WO"
                subtitle="Konsultasi gratis"
                actionLabel="Chat WhatsApp"
                onAction={() => window.open('https://wa.me/6281234567890?text=Halo%20Bahagia%20WO!%20Saya%20mau%20konsultasi%20paket%20pernikahan.', '_blank', 'noopener')}
            />
        </div>
    );
}
