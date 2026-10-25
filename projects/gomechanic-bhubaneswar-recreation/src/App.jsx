import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowDown, ArrowRight, BadgeCheck, BatteryCharging, BookOpen,
  CalendarClock, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  Clock3, Droplets, Gauge, MapPin, Menu, Search, ShieldCheck, SlidersHorizontal,
  Sparkles, Star, Wrench, X, Zap, CarFront, Snowflake, Disc3, SprayCan,
  Shield, Settings, Hammer, PhoneCall, Facebook, Instagram, Youtube, ChevronUp,
  Plus, Minus, Quote, CircleCheck, Award, Truck, Wallet, ClipboardCheck,
} from 'lucide-react';

const serviceCategories = [
  { name: 'Car Services', icon: Wrench, desc: 'Periodic service & repairs' },
  { name: 'AC Service & Repair', icon: Snowflake, desc: 'Cooling that feels new' },
  { name: 'Batteries', icon: BatteryCharging, desc: 'Battery check & replacement' },
  { name: 'Tyres & Wheel Care', icon: Disc3, desc: 'Tyres, alignment & balancing' },
  { name: 'Denting & Painting', icon: SprayCan, desc: 'Restore the finish' },
  { name: 'Detailing Services', icon: Sparkles, desc: 'Inside-out cleaning' },
  { name: 'Car Spa & Cleaning', icon: Droplets, desc: 'A fresh, clean cabin' },
  { name: 'Car Inspections', icon: ClipboardCheck, desc: 'Know your car better' },
  { name: 'SOS Service', icon: Zap, desc: 'Roadside assistance' },
];

const scheduledServices = [
  {
    name: 'Basic Service', category: 'Scheduled Packages', icon: Wrench, tag: '',
    details: ['Every 5,000 Kms / 3 Months', '4 Hrs Taken', '1 Month Warranty', 'Includes 9 Services'],
    included: ['Engine oil replacement', 'Wiper fluid replacement', 'Battery water top-up', 'Car wash', 'Interior vacuuming'],
    savings: 'Price shown after selecting your car', price: 'Select car to view price',
  },
  {
    name: 'Standard Service', category: 'Scheduled Packages', icon: Settings, tag: 'RECOMMENDED',
    details: ['Every 10,000 Kms / 6 Months', '6 Hrs Taken', '1 Month Warranty', 'Includes 15 Services'],
    included: ['Car scanning', 'Engine oil replacement', 'Air filter cleaning', 'Battery water top-up', 'Interior vacuuming'],
    savings: 'Popular option for regular maintenance', price: 'Select car to view price',
  },
  {
    name: 'Comprehensive Service', category: 'Scheduled Packages', icon: Gauge, tag: 'BEST VALUE',
    details: ['Every 20,000 Kms / 1 Year', '8 Hrs Taken', '1 Month Warranty', 'Includes 20 Services'],
    included: ['Air & fuel filter check', 'Engine oil replacement', 'AC filter replacement', 'Full car inspection', 'Interior deep clean'],
    savings: 'Expanded maintenance checks', price: 'Select car to view price',
  },
];

const extraServices = [
  { name: 'AC Service & Repair', icon: Snowflake, info: 'Restore cooling performance', price: 'Select car to view price', color: 'blue' },
  { name: 'Battery Replacement', icon: BatteryCharging, info: 'Battery health test included', price: 'Select car to view price', color: 'orange' },
  { name: 'Tyre & Wheel Care', icon: Disc3, info: 'Alignment, balancing & tyres', price: 'Select car to view price', color: 'purple' },
  { name: 'Denting & Painting', icon: SprayCan, info: 'Professional body work', price: 'Get estimate', color: 'red' },
  { name: 'Car Spa & Cleaning', icon: Sparkles, info: 'Deep clean inside and out', price: 'Select car to view price', color: 'green' },
  { name: 'Inspection & Diagnostics', icon: Activity, info: '25-point vehicle check', price: 'Select car to view price', color: 'yellow' },
  { name: 'Clutch & Body Parts', icon: Hammer, info: 'Repairs with quality parts', price: 'Get estimate', color: 'pink' },
  { name: 'Windshields & Lights', icon: CarFront, info: 'Glass and light replacement', price: 'Get estimate', color: 'slate' },
];

const makes = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'Volkswagen', 'Renault', 'Skoda', 'BMW', 'Mercedes-Benz'];
const modelMap = {
  'Maruti Suzuki': ['Swift', 'Baleno', 'Dzire', 'Brezza', 'Wagon R', 'Alto K10'],
  Hyundai: ['i20', 'Creta', 'Venue', 'Grand i10 Nios', 'Verna', 'Aura'],
  Tata: ['Nexon', 'Punch', 'Tiago', 'Altroz', 'Harrier', 'Safari'],
  Mahindra: ['XUV 3XO', 'Scorpio N', 'Thar', 'XUV700', 'Bolero'],
  Honda: ['City', 'Amaze', 'Elevate', 'Jazz', 'WR-V'],
  Toyota: ['Innova Crysta', 'Fortuner', 'Glanza', 'Urban Cruiser Hyryder'],
  Kia: ['Seltos', 'Sonet', 'Carens', 'Carnival'],
  Volkswagen: ['Polo', 'Virtus', 'Taigun', 'Tiguan'],
  Renault: ['Kwid', 'Triber', 'Kiger', 'Duster'],
  Skoda: ['Slavia', 'Kushaq', 'Rapid', 'Superb'],
  BMW: ['3 Series', '5 Series', 'X1', 'X3'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'GLA'],
};

const faqs = [
  { q: 'How much does car servicing cost in Bhubaneswar?', a: 'The cost depends on your car make, model, fuel type and the service package you choose. Select your car above to view an indicative quote. Final pricing should be confirmed before work begins.' },
  { q: 'Is free pick-up and drop available?', a: 'Pick-up and drop may be available for eligible services and locations in Bhubaneswar. Confirm availability for your address while booking.' },
  { q: 'How long does a regular car service take?', a: 'A basic package typically takes around 4 hours, a standard package around 6 hours, and a comprehensive package around 8 hours. Timing can vary with vehicle condition and workshop capacity.' },
  { q: 'Do I get a warranty on the service?', a: 'Warranty coverage depends on the selected service and parts used. Review the warranty terms shown on the final quote before confirming a booking.' },
  { q: 'Can I book car repairs online?', a: 'Yes. Choose your car, select the service you need and continue through the booking flow. This demo shows the front-end experience and does not submit a real booking.' },
];

function Logo() {
  return <a className="brand" href="#top" aria-label="GoMechanic home"><span className="brand-mark"><CarFront size={27} strokeWidth={2.8} /><span className="mark-dot" /></span><span className="brand-name"><b>Go</b>Mechanic<span className="brand-period">.</span></span></a>;
}

function SelectField({ label, value, options, onChange, placeholder, disabled = false }) {
  return <label className={`field ${disabled ? 'field-disabled' : ''}`}>
    <span>{label}</span>
    <div className="select-wrap"><select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}>
      <option value="">{placeholder}</option>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select><ChevronDown size={16} /></div>
  </label>;
}

function CarPicker({ values, setValues, onSubmit, compact = false }) {
  const models = values.make ? (modelMap[values.make] || []) : [];
  return <div className={`car-picker ${compact ? 'car-picker-compact' : ''}`}>
    <div className="picker-heading"><div><span className="eyebrow">QUICK SERVICE QUOTE</span><h3>Let's find the right service for your car</h3><p>Choose your car to see tailored packages and pricing.</p></div><span className="picker-icon"><CarFront size={26} /></span></div>
    <div className="picker-fields">
      <SelectField label="CAR BRAND" value={values.make} options={makes} placeholder="Select brand" onChange={make => setValues(v => ({ ...v, make, model: '' }))} />
      <SelectField label="CAR MODEL" value={values.model} options={models} placeholder={values.make ? 'Select model' : 'Choose brand first'} disabled={!values.make} onChange={model => setValues(v => ({ ...v, model }))} />
      <SelectField label="FUEL TYPE" value={values.fuel} options={['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']} placeholder="Select fuel" onChange={fuel => setValues(v => ({ ...v, fuel }))} />
    </div>
    <button className="btn btn-red btn-full" onClick={onSubmit}>VIEW SERVICE PRICES <ArrowRight size={17} /></button>
    <div className="picker-foot"><ShieldCheck size={15} /> Transparent pricing <span /> <BadgeCheck size={15} /> Quality-checked service</div>
  </div>;
}

function ServiceCard({ service, onSelect }) {
  const Icon = service.icon;
  return <article className={`package-card ${service.tag === 'RECOMMENDED' ? 'recommended' : ''}`}>
    {service.tag && <span className={`card-tag ${service.tag === 'RECOMMENDED' ? 'tag-red' : ''}`}>{service.tag}</span>}
    <div className="package-illustration"><div className="illustration-glow"/><Icon size={48} strokeWidth={1.35} /></div>
    <div className="package-main"><h3>{service.name}</h3><div className="package-details">{service.details.map(item => <span key={item}><Check size={14} />{item}</span>)}</div></div>
    <div className="package-included"><b>Popular inclusions</b><ul>{service.included.slice(0, 4).map(item => <li key={item}>{item}</li>)}</ul><button className="text-btn" onClick={() => onSelect(service)}>View all inclusions <ArrowRight size={14} /></button></div>
    <div className="package-bottom"><p className="saving"><BadgeCheck size={14} />{service.savings}</p><div className="package-cta"><strong>{service.price}</strong><button className="btn btn-red" onClick={() => onSelect(service)}>Select car</button></div></div>
  </article>;
}

function App() {
  const [car, setCar] = useState({ make: '', model: '', fuel: '' });
  const [activeCategory, setActiveCategory] = useState('Car Services');
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [showCarModal, setShowCarModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState('Bhubaneswar');
  const [queryMessage, setQueryMessage] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', bookingDate: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  useEffect(() => {
    let active = true;
    fetch('/api/health')
      .then(response => {
        if (!response.ok) throw new Error('API unavailable');
        return response.json();
      })
      .then(() => { if (active) setApiStatus('online'); })
      .catch(() => { if (active) setApiStatus('offline'); });
    return () => { active = false; };
  }, []);

  const filteredExtra = useMemo(() => extraServices.filter(s => `${s.name} ${s.info}`.toLowerCase().includes(search.toLowerCase())), [search]);

  const requestQuote = async () => {
    if (!car.make || !car.model || !car.fuel) {
      setQuote(null);
      setQueryMessage('Please choose your car brand, model and fuel type first.');
      return;
    }
    setQuoteLoading(true);
    setBookingConfirmation(null);
    setQueryMessage('');
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ car, serviceName: selectedService?.name || 'Standard Service', city: location }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create an estimate.');
      setQuote(data);
      setQueryMessage(`Demo estimate generated for ${data.car.make} ${data.car.model}. Review the range below before requesting a demo booking.`);
    } catch (error) {
      setQueryMessage(error.message || 'Could not contact the local API. Start the app with npm run dev.');
    } finally {
      setQuoteLoading(false);
    }
  };

  const goToBooking = () => {
    setShowCarModal(true);
    setQuote(null);
    setBookingConfirmation(null);
    if (!car.make || !car.model || !car.fuel) {
      setQueryMessage('Please choose your car brand, model and fuel type first.');
      return;
    }
    void requestQuote();
  };

  const openService = service => {
    setSelectedService(service);
    setQuote(null);
    setBookingConfirmation(null);
    setCustomer({ name: '', phone: '', address: '', bookingDate: '' });
    setQueryMessage('');
    setShowCarModal(true);
  };

  const modalSubmit = requestQuote;

  const submitBooking = async event => {
    event.preventDefault();
    if (!quote) {
      setQueryMessage('Generate a quote before submitting a demo booking request.');
      return;
    }
    setBookingLoading(true);
    setQueryMessage('');
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customer,
          car,
          city: location,
          serviceName: quote.serviceName,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const fieldErrors = data.fields ? Object.values(data.fields).join(' ') : '';
        throw new Error(fieldErrors || data.error || 'Could not save the demo booking.');
      }
      setBookingConfirmation(data);
      setQueryMessage('');
    } catch (error) {
      setQueryMessage(error.message || 'Could not contact the local API. Start the app with npm run dev.');
    } finally {
      setBookingLoading(false);
    }
  };

  return <div id="top" className="site-shell">
    <div className="top-ribbon"><span><Sparkles size={13} /> FESTIVE CAR CARE OFFER</span><span>Save more on scheduled service <b>·</b> Doorstep pickup on eligible bookings</span><a href="#packages">Explore offers <ArrowRight size={13} /></a></div>
    <header className="site-header">
      <div className="header-main wrap">
        <Logo />
        <div className="location-container">
          <button className="location-button" onClick={() => setLocationOpen(v => !v)}><MapPin size={17} /><span><small>YOUR LOCATION</small><b>{location}</b></span><ChevronDown size={15} /></button>
          {locationOpen && <div className="location-popover"><b>Choose your city</b><p>Service listings are tailored to your city. API: <b className={`api-indicator api-${apiStatus}`}>{apiStatus === 'online' ? 'connected' : apiStatus === 'checking' ? 'checking…' : 'offline'}</b></p>{['Bhubaneswar', 'Kolkata', 'Bengaluru', 'Delhi NCR', 'Hyderabad'].map(city => <button key={city} className={location === city ? 'city-active' : ''} onClick={() => {setLocation(city); setLocationOpen(false);}}><MapPin size={14} />{city}{location === city && <Check size={14} />}</button>)}</div>}
        </div>
        <div className="header-search"><Search size={18} /><input aria-label="Search services" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for services, e.g. AC repair" /><kbd>⌘ K</kbd></div>
        <nav className={`header-links ${showMenu ? 'header-links-open' : ''}`}><a href="#how-it-works">How it works</a><a href="#reviews">Reviews</a><a href="#faqs">FAQs</a><button className="login-btn" onClick={() => {setQueryMessage('Login is a demo interaction. Connect an authentication provider to enable real sign-in.'); setShowCarModal(true);}}>Login <ArrowRight size={14} /></button></nav>
        <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setShowMenu(v => !v)}>{showMenu ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      <div className="category-bar"><div className="wrap category-scroll">{serviceCategories.map(item => {const Icon = item.icon; return <button key={item.name} className={`category-link ${activeCategory === item.name ? 'category-active' : ''}`} onClick={() => {setActiveCategory(item.name); if (item.name !== 'Car Services') setSearch(item.name); else setSearch('');}}><Icon size={17} /><span>{item.name}</span></button>})}<button className="category-more" onClick={() => setShowMenu(v => !v)}>More <ChevronDown size={14} /></button></div></div>
    </header>

    <main>
      <section className="hero-section">
        <div className="hero-grid wrap">
          <div className="hero-copy">
            <div className="hero-pill"><span className="live-dot"/> CAR CARE, MADE SIMPLE <span>•</span> BHUBANESWAR</div>
            <h1>Expert car service.<br/><span>Zero extra stress.</span></h1>
            <p className="hero-lede">Reliable car servicing and repairs in Bhubaneswar, with clear estimates, skilled technicians and convenient pick-up options.</p>
            <div className="hero-trust-row"><div className="avatar-stack"><span>G</span><span>✓</span><span>★</span><span>+</span></div><div><div className="stars"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/> <b>4.0/5</b></div><small>Trusted car care · Verified customer feedback</small></div></div>
            <div className="hero-benefits"><div><span><ShieldCheck size={18}/></span><b>Quality checked</b><small>Reliable parts & service</small></div><div><span><Wallet size={18}/></span><b>Clear estimates</b><small>No surprise add-ons</small></div><div><span><Truck size={18}/></span><b>Convenience first</b><small>Pick-up options</small></div></div>
          </div>
          <div className="hero-visual">
            <div className="garage-grid" aria-hidden="true"><span/><span/><span/><span/><span/><span/></div>
            <div className="visual-label"><span className="visual-label-icon"><Wrench size={17}/></span><span><b>Care that keeps you moving</b><small>Designed around your drive</small></span><BadgeCheck size={19} className="visual-badge"/></div>
            <div className="car-stage"><div className="stage-ring ring-1"/><div className="stage-ring ring-2"/><div className="stage-spark spark-1"/><div className="stage-spark spark-2"/><div className="car-shadow"/><svg className="hero-car" viewBox="0 0 470 250" role="img" aria-label="Illustration of a red car"><defs><linearGradient id="carPaint" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ff5a50"/><stop offset=".48" stopColor="#e7352f"/><stop offset="1" stopColor="#9e1119"/></linearGradient><linearGradient id="glass" x1="0" x2="0.8" y1="0" y2="1"><stop offset="0" stopColor="#dce8f0"/><stop offset="1" stopColor="#6c7e90"/></linearGradient></defs><ellipse cx="237" cy="201" rx="195" ry="22" fill="#202c40" opacity=".13"/><path d="M53 148 L72 120 Q88 106 125 101 L167 61 Q181 48 208 48 L293 48 Q321 49 340 74 L378 115 L414 126 Q429 133 432 153 L426 178 L43 178 L39 164 Q38 151 53 148Z" fill="url(#carPaint)" stroke="#a91e28" strokeWidth="3"/><path d="M133 99 L176 62 Q184 56 204 56 L226 56 L226 99Z" fill="url(#glass)" stroke="#b9cad7" strokeWidth="3"/><path d="M237 56 L291 56 Q310 57 323 77 L340 100 L237 100Z" fill="url(#glass)" stroke="#b9cad7" strokeWidth="3"/><path d="M45 151 Q98 137 133 139 L336 139 Q385 139 431 153" fill="none" stroke="#ff9187" strokeWidth="3"/><path d="M70 132 L106 125 L118 135 L76 142Z" fill="#fff2c6"/><path d="M374 133 L404 139 L408 149 L375 145Z" fill="#ffcbc6"/><rect x="174" y="120" width="42" height="5" rx="2.5" fill="#82151c"/><rect x="250" y="120" width="42" height="5" rx="2.5" fill="#82151c"/><path d="M46 161 L418 161" stroke="#85121a" strokeWidth="2" opacity=".6"/><path d="M88 173 L91 179 L118 179 L122 173 M349 173 L353 179 L381 179 L384 173" fill="#a6aebb"/><circle cx="126" cy="176" r="34" fill="#1d2432"/><circle cx="126" cy="176" r="22" fill="#6e7782"/><circle cx="126" cy="176" r="12" fill="#d7dce1"/><circle cx="126" cy="176" r="5" fill="#6b7380"/><circle cx="348" cy="176" r="34" fill="#1d2432"/><circle cx="348" cy="176" r="22" fill="#6e7782"/><circle cx="348" cy="176" r="12" fill="#d7dce1"/><circle cx="348" cy="176" r="5" fill="#6b7380"/><path d="M64 172 Q76 161 94 162 L95 178 L64 178Z" fill="#f14a43"/><path d="M397 165 L422 164 L420 176 L393 176Z" fill="#ee352e"/></svg></div>
            <div className="floating-card floating-card-top"><span className="float-icon green"><Check size={16}/></span><span><b>Upfront estimates</b><small>Know before you book</small></span></div>
            <div className="floating-card floating-card-bottom"><span className="float-icon blue"><Clock3 size={17}/></span><span><b>Service made easy</b><small>Simple from start to finish</small></span></div>
            <div className="hero-visual-dots" aria-hidden="true">•••</div>
          </div>
        </div>
      </section>

      <section className="booking-strip wrap" id="booking"><CarPicker values={car} setValues={setCar} onSubmit={goToBooking} compact /></section>

      <section className="trust-strip"><div className="wrap trust-grid"><div><span className="trust-icon"><CarFront size={22}/></span><span><b>3 million+</b><small>Cars serviced</small></span></div><div><span className="trust-icon"><Star size={22}/></span><span><b>4.0 average rating</b><small>Service page metric</small></span></div><div><span className="trust-icon"><Settings size={22}/></span><span><b>1000+ touchpoints</b><small>Across India</small></span></div><div><span className="trust-icon"><ShieldCheck size={22}/></span><span><b>Quality-led care</b><small>Service you can trust</small></span></div></div></section>

      <section className="section wrap" id="packages">
        <div className="section-heading"><div><span className="eyebrow">MAINTENANCE MADE EASY</span><h2>Scheduled service packages</h2><p>Keep your car running smoothly with a package that fits your driving habits.</p></div><a className="section-link" href="#booking">Check prices <ArrowRight size={16}/></a></div>
        <div className="package-grid">{scheduledServices.map(service => <ServiceCard key={service.name} service={service} onSelect={openService}/>)}</div>
        <div className="package-note"><ShieldCheck size={17}/><span>Select your car to reveal a quote. Displayed pricing in this practice recreation is not connected to GoMechanic's live pricing system.</span></div>
      </section>

      <section className="service-directory" id="services">
        <div className="wrap section">
          <div className="section-heading"><div><span className="eyebrow">CARE FOR EVERY NEED</span><h2>What are you looking for?</h2><p>From routine maintenance to unexpected repairs, explore car care services.</p></div><div className="directory-search"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a service" aria-label="Find a service"/><SlidersHorizontal size={17}/></div></div>
          <div className="service-grid">{filteredExtra.length ? filteredExtra.map(service => {const Icon = service.icon; return <button className="service-tile" key={service.name} onClick={() => openService({ ...service, details: [service.info, 'Available for selected vehicles', 'Estimate shown before confirmation'], included: ['Vehicle inspection', 'Service recommendations', 'Upfront estimate'], savings: 'Ask for an itemised estimate' })}><span className={`service-tile-icon ${service.color}`}><Icon size={25}/></span><span className="tile-copy"><b>{service.name}</b><small>{service.info}</small><strong>{service.price}</strong></span><span className="tile-arrow"><ArrowRight size={16}/></span></button>}) : <div className="no-results">No services match “{search}”. Try “AC”, “battery” or “tyre”.</div>}</div>
          <div className="services-cta"><div className="cta-emblem"><Wrench size={25}/></div><div><b>Not sure what your car needs?</b><p>Start with a diagnostic inspection and get a clearer picture of your car's health.</p></div><button className="btn btn-white" onClick={() => openService({ name: 'Car Inspection / Diagnostics', price: 'Select car to view price', details: ['Takes around 4 hours', '25-point checklist', 'Upfront estimate'], included: ['Underbody inspection', 'Full visual checks', 'Inspection report'], savings: 'Recommended starting point' })}>Explore inspections <ArrowRight size={16}/></button></div>
        </div>
      </section>

      <section className="promo-section wrap">
        <div className="promo-copy"><span className="eyebrow">THE GOMeCHANIC DIFFERENCE</span><h2>Better car care.<br/><span>Better peace of mind.</span></h2><p>Make informed choices with transparent estimates, convenient scheduling and service options built around your vehicle.</p><a href="#how-it-works" className="btn btn-red">How it works <ArrowRight size={16}/></a></div>
        <div className="promo-features"><div className="promo-feature"><span className="promo-icon"><ShieldCheck size={23}/></span><div><b>Quality you can count on</b><p>Service plans with clearly stated inclusions and warranty terms.</p></div></div><div className="promo-feature"><span className="promo-icon"><Wallet size={23}/></span><div><b>Pricing you can understand</b><p>Review the estimate and scope before confirming any work.</p></div></div><div className="promo-feature"><span className="promo-icon"><Truck size={23}/></span><div><b>Convenience at every step</b><p>Check pick-up and drop availability for your location and service.</p></div></div><div className="promo-feature"><span className="promo-icon"><BadgeCheck size={23}/></span><div><b>Support through the process</b><p>Know what is included and what needs approval upfront.</p></div></div></div>
      </section>

      <section className="how-section" id="how-it-works"><div className="wrap section"><div className="section-heading centered"><div><span className="eyebrow">THREE SIMPLE STEPS</span><h2>Car servicing without the runaround</h2><p>Getting started is easy. Choose your car and find the right service.</p></div></div><div className="steps-grid"><div className="step-card"><div className="step-number">01</div><div className="step-icon"><CarFront size={28}/></div><h3>Tell us your car</h3><p>Select the brand, model and fuel type to get services relevant to your vehicle.</p></div><div className="step-connector"><ArrowRight size={22}/></div><div className="step-card"><div className="step-number">02</div><div className="step-icon"><ClipboardCheck size={28}/></div><h3>Choose your service</h3><p>Compare what is included, the estimated timing and the displayed quote.</p></div><div className="step-connector"><ArrowRight size={22}/></div><div className="step-card"><div className="step-number">03</div><div className="step-icon"><CalendarClock size={28}/></div><h3>Confirm the details</h3><p>Choose a convenient slot and verify the final scope before work begins.</p></div></div></div></section>

      <section className="reviews-section wrap" id="reviews"><div className="section-heading"><div><span className="eyebrow">DRIVERS COME FIRST</span><h2>Made for the miles ahead</h2><p>Explore the sort of details that help you choose a car service with confidence.</p></div><div className="review-score"><div className="stars"><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/></div><b>4.0 <small>/ 5</small></b><span>Rating listed on an indexed service page</span></div></div><div className="review-grid"><article className="review-card"><Quote size={24}/><p>“Clear estimates and service details make it easier to understand what my car needs before I make a decision.”</p><div className="review-person"><span className="person-avatar">AK</span><span><b>Customer feedback example</b><small>Bhubaneswar · Demo content</small></span><span className="review-stars">★★★★★</span></div></article><article className="review-card"><Quote size={24}/><p>“I like being able to compare packages and check the service inclusions in one place.”</p><div className="review-person"><span className="person-avatar avatar-orange">SP</span><span><b>Customer feedback example</b><small>Bhubaneswar · Demo content</small></span><span className="review-stars">★★★★★</span></div></article><article className="review-card"><Quote size={24}/><p>“The booking flow feels straightforward, and I can see what details I need before going ahead.”</p><div className="review-person"><span className="person-avatar avatar-blue">RM</span><span><b>Customer feedback example</b><small>Bhubaneswar · Demo content</small></span><span className="review-stars">★★★★★</span></div></article></div><p className="review-disclaimer">These review cards are illustrative placeholder copy for the local demo and are not real customer testimonials.</p></section>

      <section className="faq-section" id="faqs"><div className="wrap section faq-layout"><div className="faq-intro"><span className="eyebrow">GOT QUESTIONS?</span><h2>Frequently asked questions</h2><p>Quick answers to help you choose the right service for your car in Bhubaneswar.</p><div className="faq-contact"><span><CircleHelp size={21}/></span><div><b>Need more help?</b><small>Use the booking flow to find the right service for your vehicle.</small></div><button aria-label="Go to booking" onClick={() => document.getElementById('booking')?.scrollIntoView({behavior: 'smooth'})}><ArrowRight size={16}/></button></div></div><div className="faq-list">{faqs.map((faq, i) => <div key={faq.q} className={`faq-item ${openFaq === i ? 'faq-open' : ''}`}><button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}><span>{faq.q}</span>{openFaq === i ? <Minus size={18}/> : <Plus size={18}/>}</button>{openFaq === i && <p>{faq.a}</p>}</div>)}</div></div></section>

      <section className="final-cta wrap"><div className="final-car-icon"><CarFront size={34}/></div><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Give your car the care it deserves.</h2><p>Choose your vehicle to explore the service options available in {location}.</p></div><button className="btn btn-red" onClick={() => document.getElementById('booking')?.scrollIntoView({behavior: 'smooth'})}>Find my service <ArrowRight size={17}/></button></section>
    </main>

    <footer className="site-footer"><div className="wrap footer-main"><div className="footer-brand"><Logo/><p>Car care that fits your life. Compare services, understand inclusions and find options for your vehicle.</p><div className="social-links"><a href="https://www.facebook.com/" aria-label="Facebook"><Facebook size={17}/></a><a href="https://www.instagram.com/" aria-label="Instagram"><Instagram size={17}/></a><a href="https://www.youtube.com/" aria-label="YouTube"><Youtube size={17}/></a></div></div><div className="footer-column"><b>Explore services</b><a href="#packages">Scheduled packages</a><a href="#services" onClick={() => setSearch('AC')}>AC service & repair</a><a href="#packages">Car inspections</a><a href="#packages">Denting & painting</a><a href="#packages">Tyres & wheel care</a></div><div className="footer-column"><b>GoMechanic</b><a href="#how-it-works">How it works</a><a href="#reviews">Customer reviews</a><a href="#faqs">FAQs</a><a href="#top">Offers</a><a href="#top">About us</a></div><div className="footer-column footer-contact"><b>Car service in {location}</b><span><MapPin size={16}/> {location}, Odisha, India</span><span><Clock3 size={16}/> Service slots vary by location</span><span><PhoneCall size={16}/> Booking support via official channels</span><button className="btn btn-outline" onClick={() => {setQueryMessage('This is a front-end demo. Connect a backend or the official booking service to enable real requests.'); setShowCarModal(true);}}>Contact / support <ArrowRight size={15}/></button></div></div><div className="footer-bottom wrap"><span>© 2026 GoMechanic-style frontend recreation. Demo project.</span><div><a href="#top">Privacy</a><a href="#top">Terms</a><a href="#top">Accessibility</a></div></div><p className="independent-note wrap">Independent practice recreation for learning. Not affiliated with or endorsed by GoMechanic; use official brand assets and integrations only when authorised.</p></footer>

    {showCarModal && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) { setShowCarModal(false); setQueryMessage(''); setSelectedService(null); } }}>
      <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" aria-label="Close" onClick={() => { setShowCarModal(false); setQueryMessage(''); setSelectedService(null); }}><X size={20}/></button>
        <div className="modal-top-icon"><CarFront size={27}/></div>
        <span className="eyebrow">PERSONALISED CAR CARE</span>
        <h2 id="modal-title">{bookingConfirmation ? 'Request saved' : (selectedService ? selectedService.name : 'Choose your car')}</h2>
        <p className="modal-intro">{bookingConfirmation ? 'Your demo booking has been stored in the local backend.' : (selectedService ? 'Choose your car to get an estimate for this service.' : 'Choose your car to get an illustrative service estimate.')}</p>

        {!bookingConfirmation && <CarPicker values={car} setValues={value => { setCar(value); setQuote(null); }} compact onSubmit={modalSubmit} />}

        {quoteLoading && <div className="modal-message"><Activity size={17}/><span>Calculating your illustrative estimate…</span></div>}
        {quote && !bookingConfirmation && <div className="quote-result">
          <div className="quote-result-top"><div><span className="eyebrow">DEMO ESTIMATE</span><h3>{quote.serviceName}</h3><p>{quote.car.make} {quote.car.model} · {quote.car.fuel} · {quote.city}</p></div><div className="quote-price">₹{quote.estimatedMin.toLocaleString('en-IN')}<small>to ₹{quote.estimatedMax.toLocaleString('en-IN')}</small></div></div>
          <div className="quote-meta"><span><Clock3 size={14}/> Approx. {quote.durationHours} hr{quote.durationHours === 1 ? '' : 's'}</span><span><ShieldCheck size={14}/>{quote.warrantyNote}</span></div>
          <p className="quote-disclaimer">{quote.disclaimer}</p>
        </div>}

        {queryMessage && <div className={`modal-message ${queryMessage.startsWith('Please') || queryMessage.startsWith('Could') || queryMessage.startsWith('Enter') || queryMessage.startsWith('Select') || queryMessage.startsWith('Generate') ? 'message-warn' : ''}`}><CircleCheck size={17}/><span>{queryMessage}</span></div>}

        {quote && !bookingConfirmation && <form className="booking-customer-form" onSubmit={submitBooking}>
          <div className="booking-form-heading"><b>Request a demo booking</b><span>All fields required</span></div>
          <label><span>YOUR NAME</span><input required minLength={2} maxLength={80} autoComplete="name" value={customer.name} onChange={e => setCustomer(v => ({...v, name: e.target.value}))} placeholder="Enter your full name" /></label>
          <label><span>PHONE NUMBER</span><input required type="tel" inputMode="tel" autoComplete="tel" pattern="[+0-9 ()-]{10,18}" value={customer.phone} onChange={e => setCustomer(v => ({...v, phone: e.target.value}))} placeholder="10-digit mobile number" /></label>
          <label><span>PICK-UP ADDRESS</span><textarea required minLength={8} maxLength={240} autoComplete="street-address" value={customer.address} onChange={e => setCustomer(v => ({...v, address: e.target.value}))} placeholder="House, street, area and landmark" rows={2}/></label>
          <label><span>PREFERRED DATE</span><input required type="date" min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,10)} value={customer.bookingDate} onChange={e => setCustomer(v => ({...v, bookingDate: e.target.value}))}/></label>
          <button className="btn btn-red btn-full" type="submit" disabled={bookingLoading}>{bookingLoading ? 'SAVING REQUEST…' : 'SAVE DEMO BOOKING'} <ArrowRight size={17}/></button>
        </form>}

        {bookingConfirmation && <div className="booking-confirmation"><span className="confirmation-icon"><Check size={24}/></span><b>Demo request ID: {bookingConfirmation.bookingId}</b><p>{bookingConfirmation.message}</p><button className="btn btn-red btn-full" onClick={() => { setShowCarModal(false); setSelectedService(null); setQuote(null); setBookingConfirmation(null); setQueryMessage(''); }}>Done</button></div>}
        <p className="modal-disclaimer">Demo project only: no real GoMechanic appointment is created and no notification is sent.</p>
      </section>
    </div>}
  </div>;
}

export default App;