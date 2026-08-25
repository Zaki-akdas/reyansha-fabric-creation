'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowDown, ArrowRight, Bookmark, Check, ChevronLeft, ChevronRight,
  ExternalLink, Instagram, Menu, MessageCircle, MoveUpRight, Paperclip,
  Search, Send, SlidersHorizontal, Sparkles, X
} from 'lucide-react';

type Fabric = {
  name: string;
  note: string;
  use: string;
  image: string;
  tone: string;
};

type Product = {
  id: number;
  name: string;
  category: string;
  colour: string;
  tag: string;
  image: string;
  orientation?: string;
};

const fabrics: Fabric[] = [
  { name: 'Cotton', note: 'Soft · Breathable · Versatile', use: 'Everyday silhouettes and relaxed drapes', image: '/images/ai-terracotta-print.jpg', tone: '#7c2d24' },
  { name: 'Silk', note: 'Luminous · Fluid · Refined', use: 'Occasion-led looks and statement drapes', image: '/hero-textile.jpg', tone: '#132f42' },
  { name: 'Chanderi', note: 'Light · Sheer · Textured', use: 'Elegant layers and festive dressing', image: '/images/ai-indigo-weave.jpg', tone: '#87714d' },
  { name: 'Organza', note: 'Crisp · Airy · Sculptural', use: 'Contemporary overlays and soft volume', image: '/images/ai-ivory-embroidery.jpg', tone: '#a56953' },
  { name: 'Georgette', note: 'Flowing · Fine · Expressive', use: 'Fluid forms and occasion wear', image: '/images/ai-maroon-editorial.jpg', tone: '#641f28' },
  { name: 'Printed', note: 'Patterned · Playful · Graphic', use: 'Colourful separates and daily stories', image: '/images/ai-terracotta-print.jpg', tone: '#5c6a52' },
  { name: 'Embroidered', note: 'Detailed · Tactile · Ornate', use: 'Statement pieces and festive details', image: '/images/ai-ivory-embroidery.jpg', tone: '#78514c' },
];

const textureCards = [
  { n: '01', title: 'Indigo, up close', label: 'SILK COTTON · WEAVE', image: '/images/ai-indigo-weave.jpg' },
  { n: '02', title: 'Rhythm in repeat', label: 'BLOCK PRINT · COTTON', image: '/images/ai-terracotta-print.jpg' },
  { n: '03', title: 'A quiet bloom', label: 'ORGANZA · THREAD', image: '/images/ai-ivory-embroidery.jpg' },
  { n: '04', title: 'A luminous line', label: 'SILK · DRAPE', image: '/hero-textile.jpg' },
  { n: '05', title: 'Colour in motion', label: 'SAGE · EMBROIDERY', image: '/images/ai-sage-look.jpg' },
];

const products: Product[] = [
  { id: 1, name: 'Indigo Rhythm', category: 'Fabrics', colour: 'Indigo', tag: 'NEW', image: '/images/ai-indigo-weave.jpg' },
  { id: 2, name: 'The Maroon Drape', category: 'Ethnic Wear', colour: 'Maroon', tag: 'FESTIVE', image: '/images/ai-maroon-editorial.jpg', orientation: 'portrait' },
  { id: 3, name: 'Terracotta Bloom', category: 'Prints', colour: 'Terracotta', tag: 'PRINTS', image: '/images/ai-terracotta-print.jpg' },
  { id: 4, name: 'Ivory Threadwork', category: 'Fabrics', colour: 'Ivory', tag: 'EMBROIDERY', image: '/images/ai-ivory-embroidery.jpg' },
  { id: 5, name: 'Sage Garden', category: 'Ethnic Wear', colour: 'Sage', tag: 'NEW', image: '/images/ai-sage-look.jpg', orientation: 'portrait' },
  { id: 6, name: 'The Indigo Line', category: 'Ethnic Wear', colour: 'Indigo / Terracotta', tag: 'FESTIVE', image: '/hero-textile.jpg', orientation: 'portrait' },
];

const colourStories = [
  { name: 'Maroon', hex: '#6d1f2d', image: '/images/ai-maroon-editorial.jpg' },
  { name: 'Indigo', hex: '#17384c', image: '/images/ai-indigo-weave.jpg' },
  { name: 'Ivory', hex: '#e9e1d1', image: '/images/ai-ivory-embroidery.jpg' },
  { name: 'Sage', hex: '#6f7961', image: '/images/ai-sage-look.jpg' },
  { name: 'Terracotta', hex: '#a8583c', image: '/images/ai-terracotta-print.jpg' },
  { name: 'Gold', hex: '#a78b55', image: '/images/ai-ivory-embroidery.jpg' },
];

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const } },
};

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span />{children}</div>;
}

function MagneticArrow() {
  return <span className="round-arrow"><ArrowRight size={17} /></span>;
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a className={`logo ${light ? 'logo-light' : ''}`} href="#top" aria-label="Reyansha home">
      <span className="logo-r">R</span>
      <span className="logo-type">REYANSHA<small>FABRIC CREATION</small></span>
    </a>
  );
}

export default function Home() {
  const [activeFabric, setActiveFabric] = useState(0);
  const [activeColour, setActiveColour] = useState(1);
  const [filter, setFilter] = useState('ALL');
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [lightbox, setLightbox] = useState<(typeof textureCards)[0] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [contactNotice, setContactNotice] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cursorView, setCursorView] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const heroX = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
  const heroY = useTransform(mouseY, [-0.5, 0.5], [-8, 8]);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, 0.45]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);  useEffect(() => {
    const isOverlay = quickView || lightbox || menuOpen;
    document.body.style.overflow = isOverlay ? 'hidden' : '';
    return () => { document.body.style.overflow = '';
  };
  }, [quickView, lightbox, menuOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (quickView) setQuickView(null);
        else if (lightbox) setLightbox(null);
        else if (menuOpen) setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [quickView, lightbox, menuOpen]);

  const filtered = filter === 'ALL' ? products : products.filter(p =>
    p.category.toUpperCase() === filter || p.tag === filter
  );

  const [productPrefill, setProductPrefill] = useState('');

  const whatsapp = (product?: Product) => {
    setQuickView(null);
    setContactNotice(true);
    if (product) setProductPrefill(product.name);
    setTimeout(() => document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth' }), 150);
    setTimeout(() => setContactNotice(false), 5200);
  };

  const scrollRail = (direction: number) => {
    railRef.current?.scrollBy({ left: direction * Math.min(480, window.innerWidth * .72), behavior: 'smooth' });
  };

  return (
    <main id="top" onMouseMove={(e) => { cursorX.set(e.clientX - 31); cursorY.set(e.clientY - 31); }} onMouseLeave={() => setCursorView(false)}>
      <AnimatePresence>
        {contactNotice && (
          <motion.div className="contact-notice" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }}>
            <span><Sparkles size={16} /> WhatsApp is awaiting verification.</span>
            <small>Your enquiry can still be prepared below — no unverified number is used.</small>
            <button onClick={() => setContactNotice(false)} aria-label="Close notice"><X size={17} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <header className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
        <Logo light={!scrolled} />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#fabrics">Fabrics</a>
          <a href="#collection">Collections</a>
          <a href="#catalogue">Catalogue</a>
          <a href="#journal">Journal</a>
        </nav>
        <div className="nav-actions">
          <button className="nav-search" aria-label="Search catalogue" onClick={() => document.querySelector('#catalogue')?.scrollIntoView({ behavior: 'smooth' })}><Search size={18} /></button>
          <button className="nav-enquire" onClick={() => document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth' })}>Enquire <ArrowRight size={15} /></button>
          <button className="menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu /></button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="menu-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: .55, ease: [0.76, 0, 0.24, 1] }}>
            <div className="menu-head"><Logo light /><button onClick={() => setMenuOpen(false)}><X /></button></div>
            <nav>
              {['Fabrics', 'Collection', 'Catalogue', 'Journal', 'Enquiry'].map((item, i) => (
                <motion.a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .14 + i * .06 }}>
                  <span>0{i + 1}</span>{item}<ArrowRight />
                </motion.a>
              ))}
            </nav>
            <p>FABRIC · COLOUR · CULTURE</p>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        ref={heroRef}
        className="hero"
        onMouseMove={(e) => {
          if (reduceMotion) return;
          const r = e.currentTarget.getBoundingClientRect();
          mouseX.set((e.clientX - r.left) / r.width - .5);
          mouseY.set((e.clientY - r.top) / r.height - .5);
        }}
      >
        <motion.div className="hero-image-wrap" style={{ x: heroX, y: heroY, scale: heroScale }}>
          <img src="/hero-textile.jpg" alt="Indigo and terracotta fabric journal composition" className="hero-image" fetchPriority="high" />
          <div className="hero-wash" />
          <div className="grain" />
        </motion.div>
        <motion.div className="hero-copy" style={{ opacity: heroFade }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .7 }}>
            <Eyebrow light>Reyansha Fabric Creation</Eyebrow>
          </motion.div>
          <h1 aria-label="Where fabric becomes style">
            <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: .12, duration: .9, ease: [0.16, 1, 0.3, 1] }}>Where fabric</motion.span>
            <motion.span className="hero-line-2" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: .24, duration: .9, ease: [0.16, 1, 0.3, 1] }}>becomes <em>style.</em></motion.span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8, duration: .8 }}>
            Expressive fabrics and ethnic forms,<br />curated in Bhopal.
          </motion.p>
          <motion.div className="hero-ctas" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .95, duration: .7 }}>
            <a href="#fabrics" className="button button-ivory">Explore fabrics <ArrowDown size={16} /></a>
            <button className="text-link light-link" onClick={() => whatsapp()}>Enquire on WhatsApp <ArrowRight size={16} /></button>
          </motion.div>
        </motion.div>
        <div className="hero-side-label">BHOPAL · INDIA <span>—</span> TEXTILE JOURNAL</div>
        <a className="scroll-cue" href="#intro"><span>SCROLL TO UNFOLD</span><ArrowDown size={17} /></a>
      </section>

      <div className="textile-marquee" aria-hidden="true">
        <div>
          <span>FABRIC</span><i>✦</i><span>TEXTURE</span><i>✦</i><span>COLOUR</span><i>✦</i><span>FORM</span><i>✦</i><span>ENQUIRY</span><i>✦</i>
          <span>FABRIC</span><i>✦</i><span>TEXTURE</span><i>✦</i><span>COLOUR</span><i>✦</i><span>FORM</span><i>✦</i><span>ENQUIRY</span><i>✦</i>
        </div>
      </div>

      <section id="intro" className="intro section-shell">
        <motion.div className="intro-index" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>AN INTERACTIVE TEXTILE JOURNAL<br />— 001</motion.div>
        <motion.div className="intro-statement" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .35 }} variants={reveal}>
          <span>FABRIC IS NEVER JUST MATERIAL.</span>
          <h2>It is colour remembered,<br />culture carried, and a form<br /><em>waiting to happen.</em></h2>
        </motion.div>
        <motion.div className="intro-note" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
          <span className="dropcap">R</span>
          <p>Reyansha is imagined here as a visual studio—a place to discover texture first, follow colour, and enquire directly about what draws you in.</p>
        </motion.div>
      </section>

      <section id="fabrics" className="fabric-library">
        <div className="fabric-media">
          <AnimatePresence mode="wait">
            <motion.img
              key={fabrics[activeFabric].image}
              src={fabrics[activeFabric].image}
              alt={`${fabrics[activeFabric].name} fabric texture`}
              initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .6 }}
            />
          </AnimatePresence>
          <motion.div className="fabric-tone" animate={{ backgroundColor: fabrics[activeFabric].tone }} />
          <div className="fabric-caption"><span>SELECTED TEXTURE</span><strong>{String(activeFabric + 1).padStart(2, '0')} / {String(fabrics.length).padStart(2, '0')}</strong></div>
        </div>
        <div className="fabric-list-wrap">
          <Eyebrow>01 / Fabric library</Eyebrow>
          <div className="section-heading-row">
            <h2>Touch the<br /><em>texture.</em></h2>
            <p>Move through a tactile index of textile possibilities. Categories shown here are a demo library, ready to be verified and edited.</p>
          </div>
          <div className="mobile-swipe-hint">Swipe to explore <ArrowRight size={14} /></div>
          <div className="fabric-list" onMouseLeave={() => setActiveFabric(0)}>
            {fabrics.map((fabric, i) => (
              <button key={fabric.name} onMouseEnter={() => setActiveFabric(i)} onFocus={() => setActiveFabric(i)} onClick={() => setActiveFabric(i)} className={activeFabric === i ? 'active' : ''}>
                <span className="fabric-no">0{i + 1}</span>
                <span className="fabric-name">{fabric.name}</span>
                <span className="fabric-note">{activeFabric === i ? fabric.note : fabric.use}</span>
                <MagneticArrow />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="texture-section">
        <div className="section-shell texture-head">
          <div><Eyebrow>02 / Material studies</Eyebrow><h2>See the <em>detail.</em></h2></div>
          <div className="rail-controls">
            <button onClick={() => scrollRail(-1)} aria-label="Previous textures"><ChevronLeft /></button>
            <button onClick={() => scrollRail(1)} aria-label="Next textures"><ChevronRight /></button>
          </div>
        </div>
        <div className="texture-rail" ref={railRef}>
          {textureCards.map((card, i) => (
            <motion.button
              key={card.n} className={`texture-card card-${i + 1}`} onClick={() => setLightbox(card)}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: i * .08, duration: .7 }}
              onMouseEnter={() => setCursorView(true)} onMouseLeave={() => setCursorView(false)}
            >
              <div className="texture-image"><img loading="lazy" src={card.image} alt={card.label} /><span>VIEW</span></div>
              <div className="texture-meta"><span>TEXTURE {card.n}</span><strong>{card.title}</strong><small>{card.label}</small></div>
            </motion.button>
          ))}
        </div>
      </section>

      <section id="collection" className="form-section section-shell">
        <div className="form-title">
          <Eyebrow>03 / From fabric to form</Eyebrow>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>A textile finds<br />its <em>silhouette.</em></motion.h2>
        </div>
        <div className="editorial-story story-one">
          <motion.div className="story-image tall" initial={{ clipPath: 'inset(0 0 100% 0)' }} whileInView={{ clipPath: 'inset(0 0 0% 0)' }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}><img loading="lazy" src="/images/ai-maroon-editorial.jpg" alt="Maroon ethnic wear editorial" /></motion.div>
          <motion.div className="story-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .5 }} variants={reveal}>
            <span>EDIT 01 · OCCASION</span><h3>The festive<br /><em>edit</em></h3><p>A warm study in deep maroon, quiet ivory and detailed drape—an invitation to explore occasion-led forms.</p><button onClick={() => { setFilter('FESTIVE'); document.querySelector('#catalogue')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore the edit <MagneticArrow /></button>
          </motion.div>
          <div className="story-stamp">CURATED<br />IN BHOPAL</div>
        </div>
        <div className="editorial-story story-two">
          <motion.div className="story-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .5 }} variants={reveal}>
            <span>EDIT 02 · EVERYDAY</span><h3>Print in<br /><em>motion</em></h3><p>Graphic blooms, considered colour and easy forms for a wardrobe that speaks without raising its voice.</p><button onClick={() => { setFilter('PRINTS'); document.querySelector('#catalogue')?.scrollIntoView({ behavior: 'smooth' }); }}>See printed stories <MagneticArrow /></button>
          </motion.div>
          <motion.div className="story-image wide" initial={{ clipPath: 'inset(0 100% 0 0)' }} whileInView={{ clipPath: 'inset(0 0% 0 0)' }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}><img loading="lazy" src="/images/ai-terracotta-print.jpg" alt="Printed terracotta textile" /></motion.div>
        </div>
      </section>

      <section className="colour-section">
        <div className="colour-image">
          <AnimatePresence mode="wait">
            <motion.img key={colourStories[activeColour].image} src={colourStories[activeColour].image} alt={`${colourStories[activeColour].name} colour story`} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .7 }} />
          </AnimatePresence>
          <motion.div className="colour-overlay" animate={{ backgroundColor: colourStories[activeColour].hex }} />
          <span className="colour-vertical">THE PALETTE / REYANSHA</span>
        </div>
        <div className="colour-copy">
          <Eyebrow light>04 / Colour stories</Eyebrow>
          <h2>Choose your<br /><em>colour.</em></h2>
          <p>Begin with a feeling. Hover—or tap—to let a colour lead you toward a fabric story.</p>
          <div className="colour-list">
            {colourStories.map((colour, i) => (
              <button key={colour.name} onMouseEnter={() => setActiveColour(i)} onFocus={() => setActiveColour(i)} onClick={() => setActiveColour(i)} className={activeColour === i ? 'active' : ''}>
                <span className="swatch" style={{ background: colour.hex }} />{colour.name}<ArrowRight />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="catalogue" className="catalogue section-shell">
        <div className="catalogue-head">
          <div><Eyebrow>05 / The digital shelf</Eyebrow><h2>The Reyansha<br /><em>catalogue.</em></h2></div>
          <p>A visual demo catalogue built for discovery. Product names are placeholders; material, availability and pricing appear only when verified.</p>
        </div>
        <div className="filter-bar" role="group" aria-label="Catalogue filters">
          {['ALL', 'FABRICS', 'ETHNIC WEAR', 'NEW', 'FESTIVE', 'PRINTS', 'EMBROIDERY'].map(item => (
            <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'active' : ''}>{item}</button>
          ))}
          <SlidersHorizontal size={18} />
        </div>
        <motion.div layout className="product-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.article
                layout key={product.id} className={`product-card ${i % 3 === 1 ? 'product-offset' : ''}`}
                initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .4 }}
              >
                <button className="product-image" onClick={() => setQuickView(product)} onMouseEnter={() => setCursorView(true)} onMouseLeave={() => setCursorView(false)}>
                  <img loading="lazy" src={product.image} alt={product.name} />
                  <span className="product-tag">{product.tag}</span>
                  <span className="quick-label">Quick view <MoveUpRight size={16} /></span>
                </button>
                <div className="product-info">
                  <div><h3>{product.name}</h3><p>{product.category} · {product.colour}</p></div>
                  <button aria-label={`Save ${product.name}`} onClick={() => setSaved(v => v.includes(product.id) ? v.filter(id => id !== product.id) : [...v, product.id])} className={saved.includes(product.id) ? 'saved' : ''}><Bookmark size={18} fill={saved.includes(product.id) ? 'currentColor' : 'none'} /></button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
        {filtered.length === 0 && <div className="empty-state">This edit is ready for verified items.</div>}
      </section>

      <section className="create-section section-shell">
        <div className="create-copy"><Eyebrow>06 / Find your direction</Eyebrow><h2>What are you<br /><em>creating?</em></h2><p>Start with the moment, and we’ll narrow the visual catalogue.</p></div>
        <div className="create-options">
          {['Wedding', 'Festive', 'Party', 'Everyday', 'Gift', 'Something else'].map((item, i) => (
            <button key={item} onClick={() => { setFilter(item === 'Festive' ? 'FESTIVE' : 'ALL'); document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth' }); }}><span>0{i + 1}</span>{item}<ArrowRight /></button>
          ))}
        </div>
      </section>

      <section id="journal" className="journal-section">
        <div className="journal-head section-shell">
          <div><Eyebrow light>07 / Social journal</Eyebrow><h2>From our<br /><em>Instagram.</em></h2></div>
          <div className="journal-handle"><small>DEMO GRID · CONNECT APPROVED POSTS</small><a href="https://www.instagram.com/reyanshafabriccreation/" target="_blank" rel="noreferrer">@reyanshafabriccreation <ExternalLink size={16} /></a></div>
        </div>
        <div className="journal-grid">
          {[
            ['/images/ai-maroon-editorial.jpg', '01'], ['/images/ai-indigo-weave.jpg', '02'], ['/images/ai-sage-look.jpg', '03'],
            ['/images/ai-ivory-embroidery.jpg', '04'], ['/hero-textile.jpg', '05'], ['/images/ai-terracotta-print.jpg', '06']
          ].map(([src, n], i) => (
            <motion.a href="https://www.instagram.com/reyanshafabriccreation/" target="_blank" rel="noreferrer" key={n} className={`journal-tile journal-${i + 1}`} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .06 }}>
              <img loading="lazy" src={src} alt="Reyansha social journal inspiration" /><span><Instagram size={18} /> VIEW ON INSTAGRAM</span><small>{n}</small>
            </motion.a>
          ))}
        </div>
        <div className="journal-statement section-shell"><span>FOLLOW THE JOURNAL</span><h2>Fabric.<br />Colour.<br /><em>Culture.</em></h2><a href="https://www.instagram.com/reyanshafabriccreation/" target="_blank" rel="noreferrer">Follow on Instagram <MagneticArrow /></a></div>
      </section>

      <section className="approach section-shell">
        <div className="approach-title"><Eyebrow>08 / Our approach</Eyebrow><h2>Designed for<br /><em>discovery.</em></h2></div>
        <div className="approach-grid">
          {[
            ['01', 'Fabric discovery', 'Explore visually distinctive textile possibilities through image, texture and colour.'],
            ['02', 'Ethnic aesthetic', 'A visual language inspired by the forms and details of Indian clothing traditions.'],
            ['03', 'Visual selection', 'Browse a considered, editorial catalogue instead of a conventional online shelf.'],
            ['04', 'Direct enquiry', 'Move naturally from something you love to a focused product or fabric enquiry.'],
          ].map(([n, title, text]) => <motion.div key={n} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}><span>{n}</span><h3>{title}</h3><p>{text}</p></motion.div>)}
        </div>
      </section>

      <section id="enquiry" className="enquiry-section">
        <div className="enquiry-visual"><img loading="lazy" src="/images/ai-textile-studio.jpg" alt="Contemporary Indian textile studio" /><div className="enquiry-visual-text"><span>CAN’T FIND IT?</span><strong>Tell us the<br />colour you<br /><em>have in mind.</em></strong></div></div>
        <div className="enquiry-form-wrap">
          <Eyebrow>09 / Personal enquiry</Eyebrow>
          <h2>Looking for a<br />particular <em>fabric?</em></h2>
          <p>Share what you’re imagining. This demo prepares the enquiry without sending it to an unverified contact.</p>
          {submitted ? (
            <motion.div className="success-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><span><Check /></span><h3>Your enquiry is ready.</h3><p>Once Reyansha’s verified phone or WhatsApp is added, this form can send the details directly.</p><button onClick={() => setSubmitted(false)}>Create another enquiry</button></motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div className="field-row"><label><span>Your name *</span><input required placeholder="Enter your name" /></label><label><span>WhatsApp number *</span><input required type="tel" placeholder="+91 00000 00000" /></label></div>
              <div className="field-row"><label><span>Fabric / product</span><input id="product" placeholder="What caught your eye?" value={productPrefill} onChange={e => setProductPrefill(e.target.value)} /></label><label><span>Preferred colour</span><input placeholder="e.g. deep indigo" /></label></div>
              <div className="field-row"><label><span>Occasion</span><select defaultValue=""><option value="" disabled>Select an occasion</option><option>Wedding</option><option>Festive</option><option>Party</option><option>Everyday</option><option>Gift</option></select></label><label><span>Quantity</span><input placeholder="Optional" /></label></div>
              <label><span>Tell us more</span><textarea rows={3} placeholder="Fabric, style, timeline or any detail that can help…" /></label>
              <div className="form-bottom"><label className="upload"><Paperclip size={17} /> Add reference image<input type="file" accept="image/*" /></label><button type="submit" className="button button-dark">Prepare enquiry <Send size={16} /></button></div>
            </form>
          )}
        </div>
      </section>

      <section className="visit section-shell">
        <div className="visit-title"><Eyebrow>10 / The studio</Eyebrow><h2>Visit <em>Reyansha.</em></h2></div>
        <div className="visit-content">
          <div><span>LOCATION</span><h3>Bhopal,<br />Madhya Pradesh</h3></div>
          <div className="verify-list"><p><span>Address</span><strong>VERIFY BEFORE PUBLISHING</strong></p><p><span>Phone</span><strong>VERIFY BEFORE PUBLISHING</strong></p><p><span>WhatsApp</span><strong>VERIFY BEFORE PUBLISHING</strong></p><p><span>Opening hours</span><strong>VERIFY BEFORE PUBLISHING</strong></p></div>
          <div className="map-placeholder"><span>23.2599° N<br />77.4126° E</span><div className="map-mark">R</div><p>BHOPAL · INDIA</p></div>
        </div>
      </section>

      <section className="final-cta">
        <img loading="lazy" src="/hero-textile.jpg" alt="Reyansha indigo textile story" />
        <div className="final-overlay" />
        <div className="final-copy"><Eyebrow light>Begin a conversation</Eyebrow><h2>Found something<br />you <em>love?</em></h2><p>Send a fabric or product enquiry and let’s start with the detail that drew you in.</p><div><a href="#enquiry" className="button button-ivory">Enquire now <ArrowRight size={16} /></a><button onClick={() => whatsapp()} className="text-link light-link"><MessageCircle size={16} /> WhatsApp — verify</button></div></div>
      </section>

      <footer>
        <div className="footer-top section-shell"><Logo light /><p>ETHNIC WEAR · FABRIC · BHOPAL</p><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BACK TO TOP <ArrowDown className="up-arrow" size={15} /></button></div>
        <div className="footer-main section-shell">
          <div className="footer-manifesto"><span>THE FABRIC JOURNAL</span><h3>See the fabric.<br />Follow the texture.<br /><em>Find your form.</em></h3></div>
          <div className="footer-links"><div><span>EXPLORE</span><a href="#fabrics">Fabrics</a><a href="#collection">Ethnic wear</a><a href="#catalogue">Catalogue</a><a href="#journal">Instagram</a><a href="#enquiry">Enquiry</a></div><div><span>CONNECT</span><a href="https://www.instagram.com/reyanshafabriccreation/" target="_blank" rel="noreferrer">Instagram ↗</a><button onClick={() => whatsapp()}>WhatsApp — verify</button><a href="#enquiry">Product enquiry</a><a href="#enquiry">Fabric enquiry</a></div></div>
        </div>
        <div className="footer-bottom section-shell"><span>© 2026 REYANSHA FABRIC CREATION</span><span>AI-DIRECTED DEMO IMAGERY · CONTACT DETAILS UNVERIFIED</span><span>BHOPAL, MP</span></div>
      </footer>

      <div className="mobile-sticky"><a href="#enquiry">Enquire</a><button onClick={() => whatsapp()}><MessageCircle size={17} /> WhatsApp</button></div>

      <AnimatePresence>
        {quickView && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuickView(null)}>
            <motion.div className="quick-modal" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: .55, ease: [0.16, 1, 0.3, 1] }} onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setQuickView(null)}><X /></button>
              <div className="quick-image"><img loading="lazy" src={quickView.image} alt={quickView.name} /><span>{quickView.tag}</span></div>
              <div className="quick-copy"><Eyebrow>Catalogue / {String(quickView.id).padStart(2, '0')}</Eyebrow><h2>{quickView.name}</h2><p className="quick-type">{quickView.category}</p><div className="detail-list"><p><span>Colour</span><strong>{quickView.colour}</strong></p><p><span>Material</span><strong>AVAILABLE ON ENQUIRY</strong></p><p><span>Pattern / detail</span><strong>AVAILABLE ON ENQUIRY</strong></p><p><span>Price</span><strong>AVAILABLE ON ENQUIRY</strong></p></div><p className="quick-disclaimer">This is a demo catalogue item. Final inventory and specifications must be supplied by Reyansha.</p><div className="quick-actions"><button className="button button-dark" onClick={() => whatsapp(quickView)}>Enquire <ArrowRight size={16} /></button><button className={saved.includes(quickView.id) ? 'save-button saved' : 'save-button'} onClick={() => setSaved(v => v.includes(quickView.id) ? v.filter(id => id !== quickView.id) : [...v, quickView.id])}><Bookmark fill={saved.includes(quickView.id) ? 'currentColor' : 'none'} /> {saved.includes(quickView.id) ? 'Saved' : 'Save'}</button></div></div>
            </motion.div>
          </motion.div>
        )}
        {lightbox && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)}><X /></button><motion.img src={lightbox.image} alt={lightbox.label} initial={{ scale: .92 }} animate={{ scale: 1 }} /><div><span>TEXTURE {lightbox.n}</span><h3>{lightbox.title}</h3><p>{lightbox.label}</p></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{cursorView && <motion.div className="cursor-view" style={{ x: cursorX, y: cursorY }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>VIEW</motion.div>}</AnimatePresence>
    </main>
  );
}
