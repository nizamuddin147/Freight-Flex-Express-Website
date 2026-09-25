import { useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowDownRight, ArrowRight, BadgeCheck, Boxes, Check, ChevronDown, Clock3,
  FileCheck2, Handshake, Mail, MapPin, Menu, MessageCircle, Navigation,
  Phone, Route, Search, Send, ShieldCheck, SlidersHorizontal, Truck,
  X, Snowflake,
} from 'lucide-react';
import { Route as WouterRoute, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const inbox = 'bobbyjames66897@gmail.com';
const phone = '(405) 252-1088';
const phoneHref = 'tel:+14052521088';

const services = [
  { icon: Truck, title: 'Truck Dispatching', copy: 'We search for available freight that matches your equipment, location, preferred lanes, and requirements.' },
  { icon: Search, title: 'Load Searching', copy: 'We search multiple freight sources and identify loads that fit your truck and preferred routes.' },
  { icon: Handshake, title: 'Rate Negotiation', copy: 'We communicate with brokers and work to negotiate competitive rates for available loads.' },
  { icon: MessageCircle, title: 'Broker Communication', copy: 'We handle load inquiries, confirmations, and dispatch coordination with brokers.' },
  { icon: FileCheck2, title: 'Paperwork Support', copy: 'Assistance with rate confirmations, carrier packets, and other dispatch-related paperwork.' },
  { icon: Route, title: 'Lane Planning', copy: 'We help identify suitable lanes and loads based on your truck location and preferred destinations.' },
];

const equipment = [
  { icon: Boxes, title: "26' Box Trucks" },
  { icon: Truck, title: '16\'–28\' Straight Trucks' },
  { icon: Truck, title: 'Sprinter Vans' },
  { icon: Truck, title: 'Cargo Vans' },
  { icon: Truck, title: 'Dry Vans' },
  { icon: Snowflake, title: 'Reefer Trucks' },
  { icon: Navigation, title: 'Hotshot' },
  { icon: SlidersHorizontal, title: 'Flatbed' },
  { icon: Route, title: 'Power Only' },
];

const advantages = [
  ['Personalized Dispatch Support', 'We work around your equipment, location, and preferred lanes.', Navigation],
  ['Professional Broker Communication', 'We handle load inquiries and broker communication on your behalf.', MessageCircle],
  ['Rate Negotiation', 'We negotiate rates with brokers based on the available freight.', Handshake],
  ['No Forced Dispatch', 'You maintain control over the loads and lanes you want to run.', ShieldCheck],
  ['Nationwide Freight Search', 'We search for available opportunities across the United States.', Search],
  ['Dedicated Support', 'Get direct communication with your dispatch team.', Phone],
  ['New & Experienced Carriers Welcome', 'Support is available for both new and established carriers.', BadgeCheck],
];

const faqs = [
  ['What types of trucks do you dispatch?', 'We support box trucks, straight trucks, sprinter and cargo vans, dry vans, reefers, hotshots, flatbeds, and power-only equipment.'],
  ['Do you offer box truck dispatching?', 'Yes. We work with 26-foot box trucks as well as other box and straight-truck configurations.'],
  ['Do you work with new carriers?', 'Yes. New and established carriers are welcome to share their equipment, authority, lanes, and current location.'],
  ['Do you force dispatch?', 'No. You maintain control over the loads and lanes you choose to run.'],
  ['Do you negotiate rates with brokers?', 'We communicate with brokers and work to negotiate competitive rates for available freight.'],
  ['Do you help with carrier paperwork?', 'We assist with rate confirmations, carrier packets, and other dispatch-related paperwork.'],
  ['What areas do you cover?', 'Our freight search and dispatch support are available across the United States.'],
  ['How do I get started?', 'Complete the carrier application or contact us by phone or email with your truck type and current location.'],
];

type CarrierForm = Record<string, string>;
const carrierFields = [
  ['fullName', 'Full Name', 'text', true], ['companyName', 'Company Name', 'text', true],
  ['phoneNumber', 'Phone Number', 'tel', true], ['emailAddress', 'Email Address', 'email', true],
  ['mcNumber', 'MC Number', 'text', false], ['dotNumber', 'DOT Number', 'text', false],
  ['truckType', 'Truck Type', 'text', true], ['truckLength', 'Truck Length', 'text', false],
  ['currentCity', 'Current City', 'text', true], ['currentState', 'Current State', 'text', true],
  ['zipCode', 'ZIP Code', 'text', true], ['preferredStates', 'Preferred States', 'text', false],
  ['preferredLanes', 'Preferred Lanes', 'text', false], ['availableDate', 'Available Date', 'date', false],
  ['authorityAge', 'Authority Age', 'text', false], ['liftgate', 'Liftgate', 'text', false],
  ['palletJack', 'Pallet Jack', 'text', false], ['dockHigh', 'Dock High', 'text', false],
  ['maximumPayload', 'Maximum Payload', 'text', false],
] as const;

const emptyCarrier: CarrierForm = Object.fromEntries(carrierFields.map(([key]) => [key, '']));
emptyCarrier.message = '';
const emptyContact = { name: '', company: '', phone: '', email: '', truckType: '', currentZip: '', message: '' };

function Field({ label, name, value, onChange, required = false, type = 'text', placeholder, className = '' }: {
  label: string; name: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string; placeholder?: string; className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground))]">{label}{required ? <span className="ml-1 text-[hsl(var(--accent))]">*</span> : null}</span>
      <input data-testid={`input-${name}`} required={required} type={type} name={name} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-12 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3.5 text-sm text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent)/.16)]" />
    </label>
  );
}

function TextArea({ label, name, value, onChange, required = false, placeholder }: { label: string; name: string; value: string; onChange: (value: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground))]">{label}{required ? <span className="ml-1 text-[hsl(var(--accent))]">*</span> : null}</span>
      <textarea data-testid={`textarea-${name}`} required={required} name={name} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} className="w-full resize-y rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3.5 py-3 text-sm text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent)/.16)]" />
    </label>
  );
}

function AppLink({ href, children, className = '', onClick }: { href: string; children: ReactNode; className?: string; onClick?: () => void }) {
  return <a data-testid={`link-${href.replace('#', '')}`} href={href} onClick={onClick} className={className}>{children}</a>;
}

function Header({ onApply }: { onApply: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [['#home', 'Home'], ['#services', 'Services'], ['#equipment', 'Equipment'], ['#how-it-works', 'How It Works'], ['#about', 'About'], ['#faq', 'FAQ'], ['#contact', 'Contact']];
  const jump = () => setOpen(false);
  return (
    <header className="nav-shadow sticky top-0 z-40 border-b border-[hsl(var(--border)/.7)] bg-[hsl(var(--background)/.92)] backdrop-blur-xl">
      <div className="section-wrap flex h-[4.5rem] items-center justify-between gap-5">
        <AppLink href="#home" className="flex min-w-0 items-center gap-3" onClick={jump}>
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
            <Truck size={21} strokeWidth={1.8} />
            <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-sm border-2 border-[hsl(var(--background))] bg-[hsl(var(--accent))]" />
          </span>
          <span className="min-w-0 leading-none"><strong className="display-font block truncate text-[1.15rem] font-bold tracking-[.04em] text-[hsl(var(--primary))]">FREIGHT FLEX</strong><small className="mt-1 block text-[0.52rem] font-bold tracking-[.25em] text-[hsl(var(--muted-foreground))]">EXPRESS LLC</small></span>
        </AppLink>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
          {links.map(([href, label]) => <AppLink key={href} href={href} className="text-[0.78rem] font-semibold text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--primary))]">{label}</AppLink>)}
        </nav>
        <div className="flex items-center gap-2">
          <a data-testid="link-header-phone" href={phoneHref} className="hidden items-center gap-2 text-xs font-bold text-[hsl(var(--primary))] xl:flex"><Phone size={14} />{phone}</a>
          <button data-testid="button-header-get-started" onClick={onApply} className="hidden h-10 items-center gap-2 rounded-md bg-[hsl(var(--accent))] px-4 text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--accent-foreground))] transition hover:brightness-95 sm:flex">Get Started <ArrowRight size={15} /></button>
          <button data-testid="button-mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)} className="flex h-10 w-10 items-center justify-center rounded-md border border-[hsl(var(--border))] text-[hsl(var(--primary))] lg:hidden">{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      {open && <nav className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-4 lg:hidden" aria-label="Mobile navigation">
        <div className="section-wrap flex flex-col gap-1">{links.map(([href, label]) => <AppLink key={href} href={href} onClick={jump} className="rounded-md px-3 py-3 text-sm font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))]">{label}</AppLink>)}<button data-testid="button-mobile-get-started" onClick={() => { jump(); onApply(); }} className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[hsl(var(--accent))] px-4 py-3 text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--accent-foreground))]">Get Started <ArrowRight size={15} /></button></div>
      </nav>}
    </header>
  );
}

function Hero({ onApply }: { onApply: () => void }) {
  return (
    <section id="home" className="relative isolate min-h-[670px] overflow-hidden bg-[hsl(var(--primary))]">
      <img src="/freight-flex-hero-photo.jpg" alt="White commercial semi-truck traveling on an open American highway" className="hero-photo absolute inset-0 h-full w-full object-cover object-center opacity-70" width="1920" height="1080" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(215_47%_10%/.97)_0%,hsl(215_47%_12%/.86)_35%,hsl(215_47%_12%/.24)_75%,hsl(215_47%_12%/.12)_100%)]" />
      <div className="hero-grid absolute inset-0 opacity-20" />
      <div className="section-wrap relative flex min-h-[670px] items-center py-20">
        <div className="max-w-[690px]">
          <div className="reveal inline-flex items-center gap-2 border-l-2 border-[hsl(var(--accent))] pl-3 text-[0.68rem] font-bold uppercase tracking-[.18em] text-[hsl(var(--accent))]"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" /> Wyoming-based dispatch support</div>
          <h1 className="reveal reveal-delay-1 display-font mt-6 max-w-[730px] text-[clamp(3.5rem,8vw,7.2rem)] font-bold uppercase leading-[.88] tracking-[-.02em] text-[hsl(var(--primary-foreground))]">Keep your truck moving. <span className="text-[hsl(var(--accent))]">We handle the dispatch.</span></h1>
          <p className="reveal reveal-delay-2 mt-7 max-w-[590px] text-base leading-7 text-[hsl(40_22%_96%/.78)] sm:text-lg">Professional truck dispatching support for owner-operators and motor carriers. We help you find freight, communicate with brokers, negotiate rates, and manage the paperwork so you can focus on the road.</p>
          <div className="reveal reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <button data-testid="button-hero-get-started" onClick={onApply} className="group flex h-14 items-center justify-center gap-3 rounded-md bg-[hsl(var(--accent))] px-7 text-sm font-bold uppercase tracking-[.12em] text-[hsl(var(--accent-foreground))] transition hover:brightness-95">Get Started <ArrowRight className="transition group-hover:translate-x-1" size={18} /></button>
            <a data-testid="link-hero-call" href={phoneHref} className="flex h-14 items-center justify-center gap-3 rounded-md border border-[hsl(40_22%_96%/.38)] px-7 text-sm font-bold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))] transition hover:border-[hsl(var(--primary-foreground))]"><Phone size={17} /> Call {phone}</a>
          </div>
          <div className="reveal reveal-delay-4 mt-12 flex flex-wrap gap-x-5 gap-y-3 border-t border-[hsl(40_22%_96%/.18)] pt-5 text-[0.65rem] font-bold uppercase tracking-[.11em] text-[hsl(40_22%_96%/.66)]"><span>Nationwide load search</span><span className="text-[hsl(var(--accent))]">•</span><span>Rate negotiation</span><span className="text-[hsl(var(--accent))]">•</span><span>Broker communication</span><span className="text-[hsl(var(--accent))]">•</span><span>Dispatch support</span></div>
        </div>
      </div>
      <div className="absolute bottom-7 right-8 hidden items-center gap-3 text-[0.63rem] font-bold uppercase tracking-[.16em] text-[hsl(40_22%_96%/.54)] lg:flex"><span className="h-px w-12 bg-[hsl(var(--accent))]" /> Move with clarity</div>
    </section>
  );
}

function Services() {
  return <section id="services" className="section-wrap scroll-mt-24 py-24 sm:py-32">
    <div className="grid gap-12 lg:grid-cols-[.82fr_1.6fr] lg:gap-20">
      <div><p className="eyebrow text-[hsl(var(--accent))]">The dispatch desk</p><h2 className="display-font mt-4 text-5xl font-bold uppercase leading-[.92] text-[hsl(var(--primary))] sm:text-6xl">Dispatching services built around your truck.</h2><p className="mt-6 max-w-sm text-[0.95rem] leading-7 text-[hsl(var(--muted-foreground))]">The right support should fit the way you operate. We help take repetitive dispatch work off your plate while you keep control of the decisions.</p><AppLink href="#carrier-application" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))] underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-8">Request dispatch support <ArrowDownRight size={16} /></AppLink></div>
      <div className="grid gap-px overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--border))] sm:grid-cols-2">{services.map(({ icon: Icon, title, copy }) => <article key={title} className="card-lift group bg-[hsl(var(--card))] p-6 sm:p-7"><Icon size={25} strokeWidth={1.7} className="text-[hsl(var(--accent))]" /><h3 className="mt-8 text-lg font-bold text-[hsl(var(--primary))]">{title}</h3><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{copy}</p><span className="mt-6 block h-px w-8 bg-[hsl(var(--accent))] transition-all group-hover:w-16" /></article>)}</div>
    </div>
  </section>;
}

function Equipment({ onApply }: { onApply: () => void }) {
  return <section id="equipment" className="scroll-mt-24 bg-[hsl(var(--primary))] py-24 text-[hsl(var(--primary-foreground))] sm:py-28"><div className="section-wrap"><div className="flex flex-col justify-between gap-6 border-b border-[hsl(40_22%_96%/.18)] pb-10 md:flex-row md:items-end"><div><p className="eyebrow text-[hsl(var(--accent))]">Equipment fit</p><h2 className="display-font mt-4 text-5xl font-bold uppercase leading-[.9] sm:text-6xl">We dispatch multiple types of equipment.</h2></div><p className="max-w-xs text-sm leading-6 text-[hsl(40_22%_96%/.64)]">Tell us what you run and where you want to go. We will discuss the freight search around your setup.</p></div><div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{equipment.map(({ icon: Icon, title }, index) => <article key={title} className="group rounded-lg border border-[hsl(40_22%_96%/.14)] bg-[hsl(40_22%_96%/.04)] p-4 transition hover:-translate-y-1 hover:border-[hsl(var(--accent))] hover:bg-[hsl(40_22%_96%/.08)]"><div className="flex items-start justify-between"><Icon size={23} strokeWidth={1.5} className="text-[hsl(var(--accent))]" /><span className="text-[0.6rem] font-bold text-[hsl(40_22%_96%/.35)]">0{index + 1}</span></div><h3 className="mt-9 text-sm font-bold leading-5 text-[hsl(var(--primary-foreground))]">{title}</h3><button data-testid={`button-find-loads-${index}`} onClick={onApply} className="mt-5 flex items-center gap-1 text-[0.62rem] font-bold uppercase tracking-[.12em] text-[hsl(var(--accent))]">Find loads <ArrowRight size={13} /></button></article>)}</div></div></section>;
}

function WhyAndProcess({ onApply }: { onApply: () => void }) {
  return <><section className="section-wrap py-24 sm:py-32"><div className="grid gap-14 lg:grid-cols-[.72fr_1.4fr] lg:gap-24"><div><p className="eyebrow text-[hsl(var(--accent))]">The working relationship</p><h2 className="display-font mt-4 text-5xl font-bold uppercase leading-[.9] text-[hsl(var(--primary))] sm:text-6xl">Why carriers work with us.</h2><p className="mt-6 text-[0.95rem] leading-7 text-[hsl(var(--muted-foreground))]">Good dispatch support is direct, practical, and built around your authority and equipment — not a one-size-fits-all script.</p></div><div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">{advantages.map(([title, copy, Icon]) => { const BenefitIcon = Icon as typeof Navigation; return <article key={title as string} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--muted))] text-[hsl(var(--accent))]"><BenefitIcon size={19} /></span><div><h3 className="text-sm font-bold text-[hsl(var(--primary))]">{title as string}</h3><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{copy as string}</p></div></article>; })}</div></div></section><section id="how-it-works" className="scroll-mt-24 border-y border-[hsl(var(--border))] bg-[hsl(var(--muted)/.45)] py-24 sm:py-28"><div className="section-wrap"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow text-[hsl(var(--accent))]">From truck to load</p><h2 className="display-font mt-4 text-5xl font-bold uppercase leading-[.9] text-[hsl(var(--primary))] sm:text-6xl">How it works.</h2></div><span className="hidden text-[0.68rem] font-bold uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))] md:block">A clear start, every time</span></div><div className="mt-14 grid gap-0 md:grid-cols-4">{[['01', 'Tell us about your truck', 'Provide your equipment type, location, MC/DOT information, and preferred lanes.'], ['02', 'We search for loads', 'Our dispatch team searches for freight matching your truck and preferences.'], ['03', 'We negotiate & book', 'We communicate with brokers, negotiate rates, and coordinate the load.'], ['04', 'Keep moving', 'You focus on driving while we handle dispatch-related communication and paperwork.']].map(([number, title, copy], index) => <article key={number} className="relative border-l border-[hsl(var(--border))] py-1 pl-6 pr-7 md:min-h-[230px] md:border-l-0 md:border-t md:pl-0 md:pt-7 md:pr-8">{index < 3 && <span className="absolute left-0 top-[-1px] hidden h-px w-full bg-[hsl(var(--accent))] md:block" />}<span className="display-font text-5xl font-bold text-[hsl(var(--accent))]">{number}</span><h3 className="mt-8 text-lg font-bold capitalize text-[hsl(var(--primary))]">{title}</h3><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{copy}</p></article>)}</div><div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-lg bg-[hsl(var(--primary))] px-6 py-6 text-[hsl(var(--primary-foreground))] sm:flex-row sm:items-center sm:px-8"><div><p className="display-font text-3xl font-bold uppercase">Ready to get started?</p><p className="mt-1 text-sm text-[hsl(40_22%_96%/.64)]">Share the basics. We will take it from there.</p></div><button data-testid="button-process-application" onClick={onApply} className="flex items-center gap-2 rounded-md bg-[hsl(var(--accent))] px-5 py-3 text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--accent-foreground))]">Start your application <ArrowRight size={15} /></button></div></div></section></>;
}

function About() {
  return <section id="about" className="section-wrap scroll-mt-24 py-24 sm:py-32"><div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-24"><div><p className="eyebrow text-[hsl(var(--accent))]">A dispatch partner in your corner</p><h2 className="display-font mt-4 max-w-xl text-5xl font-bold uppercase leading-[.9] text-[hsl(var(--primary))] sm:text-7xl">About Freight Flex Express.</h2><p className="mt-8 max-w-xl text-lg leading-8 text-[hsl(var(--foreground))]">Freight Flex Express LLC provides truck dispatching support to owner-operators and motor carriers throughout the United States.</p><p className="mt-5 max-w-xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">Our dispatch support focuses on finding suitable freight, broker communication, rate negotiation, load coordination, paperwork assistance, and lane planning. The goal is simple: give you more time for the road while keeping you in control of the work you take.</p></div><div className="relative overflow-hidden rounded-xl bg-[hsl(var(--primary))] p-8 text-[hsl(var(--primary-foreground))] sm:p-10"><div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[18px] border-[hsl(var(--accent)/.22)]" /><Clock3 size={28} className="text-[hsl(var(--accent))]" /><p className="display-font mt-16 max-w-xs text-4xl font-bold uppercase leading-[.95]">More road time. Less dispatch friction.</p><div className="mt-10 flex items-center gap-3 border-t border-[hsl(40_22%_96%/.16)] pt-5 text-xs text-[hsl(40_22%_96%/.6)]"><MapPin size={14} className="text-[hsl(var(--accent))]" /> Wyoming, USA · Supporting carriers nationwide</div></div></div></section>;
}

function CarrierApplication() {
  const [form, setForm] = useState<CarrierForm>(emptyCarrier);
  const [status, setStatus] = useState('');
  const update = (key: string) => (value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const lines = carrierFields.map(([key, label]) => `${label}: ${form[key] || 'Not provided'}`);
    lines.push(`Message: ${form.message || 'Not provided'}`);
    window.location.href = `mailto:${inbox}?subject=${encodeURIComponent('Carrier application — Freight Flex Express')}&body=${encodeURIComponent(lines.join('\n'))}`;
    setStatus('Your email draft is open and prefilled. Please review it and press Send to contact Freight Flex Express. We have not received your information until you send the email.');
  };
  return <section id="carrier-application" className="scroll-mt-24 bg-[hsl(var(--primary))] py-24 text-[hsl(var(--primary-foreground))] sm:py-32"><div className="section-wrap"><div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr] lg:gap-20"><div className="lg:sticky lg:top-28 lg:self-start"><p className="eyebrow text-[hsl(var(--accent))]">Carrier onboarding</p><h2 className="display-font mt-4 text-5xl font-bold uppercase leading-[.9] sm:text-7xl">Tell us about your truck.</h2><p className="mt-7 max-w-sm text-sm leading-7 text-[hsl(40_22%_96%/.68)]">Share the details that help us understand your equipment, location, authority, and preferred lanes. Required fields are marked.</p><div className="mt-10 space-y-4 border-t border-[hsl(40_22%_96%/.17)] pt-6 text-sm text-[hsl(40_22%_96%/.72)]"><p className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" /> No forced dispatch</p><p className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" /> New and experienced carriers welcome</p><p className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" /> You keep control of your lanes</p></div></div><form onSubmit={submit} className="rounded-xl bg-[hsl(var(--card))] p-5 text-[hsl(var(--foreground))] shadow-[var(--shadow-lg)] sm:p-8"><div className="mb-7 flex items-center justify-between border-b border-[hsl(var(--border))] pb-5"><div><p className="text-sm font-bold text-[hsl(var(--primary))]">Carrier information</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">We will prepare an email draft from your answers.</p></div><span className="hidden text-[0.62rem] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))] sm:block">20 fields</span></div><div className="grid gap-5 sm:grid-cols-2">{carrierFields.map(([key, label, type, required]) => <Field key={key} label={label} name={key} type={type} required={required} value={form[key]} onChange={update(key)} />)}</div><div className="mt-5"><TextArea label="Message" name="message" value={form.message} onChange={update('message')} placeholder="Anything else we should know about your truck or dispatch needs?" /></div><button data-testid="button-submit-carrier" type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[hsl(var(--accent))] px-5 py-4 text-sm font-bold uppercase tracking-[.1em] text-[hsl(var(--accent-foreground))] transition hover:brightness-95">Submit carrier information <Send size={16} /></button>{status && <div data-testid="status-carrier-draft" role="status" className="mt-5 rounded-lg border border-[hsl(var(--accent)/.35)] bg-[hsl(var(--accent)/.09)] p-4 text-sm leading-6 text-[hsl(var(--primary))]">{status}<a href={`mailto:${inbox}`} className="mt-2 block font-bold underline underline-offset-4">Open a new email to {inbox}</a></div>}</form></div></div></section>;
}

function FAQ() {
  const [active, setActive] = useState<number | null>(null);
  return <section id="faq" className="section-wrap scroll-mt-24 py-24 sm:py-32"><div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24"><div><p className="eyebrow text-[hsl(var(--accent))]">Straight answers</p><h2 className="display-font mt-4 text-5xl font-bold uppercase leading-[.9] text-[hsl(var(--primary))] sm:text-6xl">Questions, answered.</h2><p className="mt-6 max-w-sm text-sm leading-7 text-[hsl(var(--muted-foreground))]">If you do not see your question here, call or email and we will talk through your setup.</p><AppLink href="#contact" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))] underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-8">Ask a question <ArrowRight size={15} /></AppLink></div><div className="divide-y divide-[hsl(var(--border))] border-y border-[hsl(var(--border))]">{faqs.map(([question, answer], index) => <div key={question}><button data-testid={`button-faq-${index}`} aria-expanded={active === index} onClick={() => setActive(active === index ? null : index)} className="flex w-full items-center justify-between gap-5 py-5 text-left text-sm font-bold text-[hsl(var(--primary))]"><span>{question}</span><ChevronDown size={18} className={`shrink-0 text-[hsl(var(--accent))] transition-transform ${active === index ? 'rotate-180' : ''}`} /></button>{active === index && <p data-testid={`text-faq-answer-${index}`} className="max-w-2xl pb-5 pr-10 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{answer}</p>}</div>)}</div></div></section>;
}

function Contact() {
  const [form, setForm] = useState(emptyContact);
  const [status, setStatus] = useState('');
  const update = (key: keyof typeof emptyContact) => (value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = `Name: ${form.name}\nCompany: ${form.company || 'Not provided'}\nPhone: ${form.phone}\nEmail: ${form.email}\nTruck Type: ${form.truckType}\nCurrent ZIP: ${form.currentZip}\nMessage: ${form.message}`;
    window.location.href = `mailto:${inbox}?subject=${encodeURIComponent('Dispatch inquiry — Freight Flex Express')}&body=${encodeURIComponent(body)}`;
    setStatus('Your email draft is open and prefilled. Please press Send to contact Freight Flex Express. We have not received your message until you send the email.');
  };
  return <section id="contact" className="scroll-mt-24 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/.42)] py-24 sm:py-32"><div className="section-wrap"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24"><div><p className="eyebrow text-[hsl(var(--accent))]">Contact dispatch</p><h2 className="display-font mt-4 text-5xl font-bold uppercase leading-[.9] text-[hsl(var(--primary))] sm:text-7xl">Let's get your truck moving.</h2><p className="mt-7 max-w-sm text-sm leading-7 text-[hsl(var(--muted-foreground))]">Tell us your truck type and current location. We will use the details to start a practical conversation about dispatch support.</p><div className="mt-10 space-y-5 border-t border-[hsl(var(--border))] pt-7"><div className="flex gap-4"><MapPin size={19} className="mt-0.5 text-[hsl(var(--accent))]" /><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Location</p><p className="mt-1 text-sm font-semibold text-[hsl(var(--primary))]">FREIGHT FLEX EXPRESS LLC<br />Wyoming, USA</p></div></div><div className="flex gap-4"><Phone size={19} className="mt-0.5 text-[hsl(var(--accent))]" /><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Phone</p><a data-testid="link-contact-phone" href={phoneHref} className="mt-1 block text-sm font-semibold text-[hsl(var(--primary))]">{phone}</a></div></div><div className="flex gap-4"><Mail size={19} className="mt-0.5 text-[hsl(var(--accent))]" /><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Email</p><a data-testid="link-contact-email" href={`mailto:${inbox}`} className="mt-1 block break-all text-sm font-semibold text-[hsl(var(--primary))]">{inbox}</a></div></div></div><div className="mt-8 flex gap-3"><a data-testid="link-contact-call-button" href={phoneHref} className="flex items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-5 py-3 text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--primary-foreground))]">Call now <Phone size={14} /></a><a data-testid="link-contact-email-button" href={`mailto:${inbox}`} className="flex items-center gap-2 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-3 text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">Email us <Mail size={14} /></a></div></div><form onSubmit={submit} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-sm)] sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><Field label="Name" name="contact-name" value={form.name} onChange={update('name')} required /><Field label="Company" name="contact-company" value={form.company} onChange={update('company')} /><Field label="Phone" name="contact-phone" type="tel" value={form.phone} onChange={update('phone')} required /><Field label="Email" name="contact-email" type="email" value={form.email} onChange={update('email')} required /><Field label="Truck Type" name="contact-truck-type" value={form.truckType} onChange={update('truckType')} required /><Field label="Current ZIP" name="contact-zip" value={form.currentZip} onChange={update('currentZip')} required /></div><div className="mt-5"><TextArea label="Message" name="contact-message" value={form.message} onChange={update('message')} required placeholder="What would you like help with?" /></div><button data-testid="button-contact-dispatch" type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[hsl(var(--accent))] px-5 py-4 text-sm font-bold uppercase tracking-[.1em] text-[hsl(var(--accent-foreground))]">Contact dispatch <Send size={16} /></button>{status && <div data-testid="status-contact-draft" role="status" className="mt-5 rounded-lg border border-[hsl(var(--accent)/.35)] bg-[hsl(var(--accent)/.09)] p-4 text-sm leading-6 text-[hsl(var(--primary))]">{status}<a href={`mailto:${inbox}`} className="mt-2 block font-bold underline underline-offset-4">Use the fallback email link</a></div>}</form></div></div></section>;
}

function Footer({ onApply }: { onApply: () => void }) {
  return <><section className="bg-[hsl(var(--accent))] py-16 text-[hsl(var(--accent-foreground))] sm:py-20"><div className="section-wrap flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="eyebrow opacity-70">A better dispatch day starts here</p><h2 className="display-font mt-4 max-w-3xl text-5xl font-bold uppercase leading-[.9] sm:text-6xl">Your truck should be moving. Let us help with the load search.</h2><p className="mt-5 text-sm opacity-75">Tell us your truck type and current location to get started with our dispatch team.</p></div><div className="flex shrink-0 flex-col gap-3 sm:flex-row"><button data-testid="button-final-get-started" onClick={onApply} className="flex items-center justify-center gap-2 rounded-md bg-[hsl(var(--primary))] px-5 py-3.5 text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--primary-foreground))]">Get started <ArrowRight size={15} /></button><a data-testid="link-final-call" href={phoneHref} className="flex items-center justify-center gap-2 rounded-md border border-[hsl(var(--accent-foreground)/.38)] px-5 py-3.5 text-xs font-bold uppercase tracking-[.1em]">Call now <Phone size={15} /></a></div></div></section><footer className="bg-[hsl(var(--primary))] py-12 text-[hsl(var(--primary-foreground))]"><div className="section-wrap grid gap-10 md:grid-cols-[1.2fr_.8fr_.8fr]"><div><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-[hsl(var(--accent))]"><Truck size={18} /></span><strong className="display-font text-xl tracking-[.05em]">FREIGHT FLEX EXPRESS LLC</strong></div><p className="mt-5 text-sm leading-6 text-[hsl(40_22%_96%/.58)]">Truck Dispatching &amp; Carrier Support<br />Wyoming, USA</p><div className="mt-5 space-y-2 text-sm text-[hsl(40_22%_96%/.72)]"><a data-testid="link-footer-phone" href={phoneHref} className="block hover:text-[hsl(var(--accent))]">Phone: {phone}</a><a data-testid="link-footer-email" href={`mailto:${inbox}`} className="block break-all hover:text-[hsl(var(--accent))]">Email: {inbox}</a></div></div><div><p className="eyebrow text-[hsl(var(--accent))]">Navigate</p><div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-[hsl(40_22%_96%/.66)]"><AppLink href="#home">Home</AppLink><AppLink href="#services">Services</AppLink><AppLink href="#equipment">Equipment</AppLink><AppLink href="#about">About</AppLink><AppLink href="#faq">FAQ</AppLink><AppLink href="#contact">Contact</AppLink></div></div><div><p className="eyebrow text-[hsl(var(--accent))]">Start a conversation</p><p className="mt-5 text-sm leading-6 text-[hsl(40_22%_96%/.66)]">Ready to discuss your equipment and lanes?</p><button data-testid="button-footer-application" onClick={onApply} className="mt-4 flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary-foreground))] underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-8">Carrier sign-up <ArrowRight size={15} /></button></div></div><div className="section-wrap mt-12 flex flex-col gap-3 border-t border-[hsl(40_22%_96%/.14)] pt-5 text-[0.68rem] text-[hsl(40_22%_96%/.46)] sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Freight Flex Express LLC. All Rights Reserved.</span><span className="flex gap-5"><a data-testid="link-privacy" href="#privacy">Privacy Policy</a><a data-testid="link-terms" href="#terms">Terms of Service</a></span></div></footer></>;
}

function Home() {
  const [, setLocation] = useLocation();
  const apply = () => { setLocation('/#carrier-application'); window.setTimeout(() => document.getElementById('carrier-application')?.scrollIntoView({ behavior: 'smooth' }), 20); };
  return <div className="noise min-h-[100dvh] overflow-x-hidden"><Header onApply={apply} /><main><Hero onApply={apply} /><Services /><Equipment onApply={apply} /><WhyAndProcess onApply={apply} /><About /><CarrierApplication /><FAQ /><Contact /></main><Footer onApply={apply} /></div>;
}

function Router() {
  const [path] = useLocation();
  return <ErrorBoundary resetKey={path}><Switch><WouterRoute path="/" component={Home} /><WouterRoute component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;