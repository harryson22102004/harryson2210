import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const dataDir = path.join(__dirname, 'data');
const bookingsFile = path.join(dataDir, 'bookings.json');
const distDir = path.join(projectRoot, 'dist');
const PORT = Number(process.env.PORT || 3001);
const MAX_BODY_BYTES = 100 * 1024;

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

const services = [
  { name: 'Basic Service', category: 'Scheduled Packages', minPrice: 2499, maxPrice: 3999, durationHours: 4, warranty: 'Service-specific terms apply' },
  { name: 'Standard Service', category: 'Scheduled Packages', minPrice: 3999, maxPrice: 5999, durationHours: 6, warranty: 'Service-specific terms apply' },
  { name: 'Comprehensive Service', category: 'Scheduled Packages', minPrice: 5999, maxPrice: 8999, durationHours: 8, warranty: 'Service-specific terms apply' },
  { name: 'AC Service & Repair', category: 'Repairs', minPrice: 1499, maxPrice: 4499, durationHours: 3, warranty: 'Depends on repair and parts' },
  { name: 'Battery Replacement', category: 'Repairs', minPrice: 3499, maxPrice: 8999, durationHours: 1, warranty: 'Depends on selected battery' },
  { name: 'Tyre & Wheel Care', category: 'Repairs', minPrice: 999, maxPrice: 5999, durationHours: 2, warranty: 'Depends on selected service' },
  { name: 'Denting & Painting', category: 'Body Work', minPrice: 2499, maxPrice: 14999, durationHours: 24, warranty: 'Depends on job scope' },
  { name: 'Car Spa & Cleaning', category: 'Detailing', minPrice: 799, maxPrice: 3999, durationHours: 3, warranty: 'Not applicable to all packages' },
  { name: 'Inspection & Diagnostics', category: 'Inspection', minPrice: 499, maxPrice: 1499, durationHours: 2, warranty: 'Inspection report only' },
  { name: 'Clutch & Body Parts', category: 'Repairs', minPrice: 2999, maxPrice: 19999, durationHours: 8, warranty: 'Depends on parts and repair' },
  { name: 'Windshields & Lights', category: 'Repairs', minPrice: 1499, maxPrice: 11999, durationHours: 4, warranty: 'Depends on parts and repair' },
];

const cities = ['Bhubaneswar', 'Kolkata', 'Bengaluru', 'Delhi NCR', 'Hyderabad'];
const knownFuels = new Set(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2',
};

async function ensureStorage() {
  await mkdir(dataDir, { recursive: true });
  try { await readFile(bookingsFile, 'utf8'); }
  catch { await writeFile(bookingsFile, '[]\n', 'utf8'); }
}

async function readBookings() {
  await ensureStorage();
  const value = JSON.parse(await readFile(bookingsFile, 'utf8'));
  return Array.isArray(value) ? value : [];
}

let storageQueue = Promise.resolve();
async function appendBooking(booking) {
  const operation = storageQueue.then(async () => {
    const bookings = await readBookings();
    bookings.push(booking);
    await writeFile(bookingsFile, `${JSON.stringify(bookings, null, 2)}\n`, 'utf8');
  });
  storageQueue = operation.catch(() => {});
  await operation;
}

function normalizeCar(car) {
  if (!car || typeof car !== 'object') return null;
  const make = String(car.make || '').trim();
  const model = String(car.model || '').trim();
  const fuel = String(car.fuel || '').trim();
  if (!modelMap[make] || !modelMap[make].includes(model) || !knownFuels.has(fuel)) return null;
  return { make, model, fuel };
}

function estimateFor(car, serviceName) {
  if (!car || typeof car !== 'object') return null;
  const aliases = { 'Car Inspection / Diagnostics': 'Inspection & Diagnostics' };
  const normalizedName = aliases[serviceName] || serviceName;
  const service = services.find((item) => item.name === normalizedName);
  if (!service) return null;
  const luxuryMakes = new Set(['BMW', 'Mercedes-Benz']);
  let multiplier = luxuryMakes.has(car.make) ? 1.35 : 1;
  if (car.fuel === 'Diesel') multiplier *= 1.08;
  if (car.fuel === 'Electric' && service.category === 'Scheduled Packages') multiplier *= 1.12;
  const min = Math.round((service.minPrice * multiplier) / 50) * 50;
  const max = Math.round((service.maxPrice * multiplier) / 50) * 50;
  return {
    serviceName: service.name, currency: 'INR', estimatedMin: min, estimatedMax: max,
    durationHours: service.durationHours, warrantyNote: service.warranty, isDemoEstimate: true,
    disclaimer: 'Illustrative estimate for this practice project only. Not official GoMechanic pricing or a binding quote.',
  };
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(body);
}

async function readJsonBody(req) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) {
      const error = new Error('Request body is too large.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch {
    const error = new Error('Request body must be valid JSON.');
    error.statusCode = 400;
    throw error;
  }
}

async function serveFrontend(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendJson(res, 404, { error: 'Route not found.' });
    return;
  }
  let requestedPath;
  try { requestedPath = decodeURIComponent(pathname); }
  catch { sendJson(res, 400, { error: 'Invalid URL path.' }); return; }

  let candidate = path.resolve(distDir, `.${requestedPath}`);
  if (candidate !== distDir && !candidate.startsWith(`${distDir}${path.sep}`)) {
    sendJson(res, 403, { error: 'Forbidden path.' });
    return;
  }
  try {
    const info = await stat(candidate);
    if (info.isDirectory()) candidate = path.join(candidate, 'index.html');
    await stat(candidate);
  } catch {
    candidate = path.join(distDir, 'index.html');
    try { await stat(candidate); }
    catch { sendJson(res, 404, { error: 'Frontend build not found. Run npm run build first.' }); return; }
  }

  try {
    const contents = await readFile(candidate);
    res.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(candidate).toLowerCase()] || 'application/octet-stream',
      'Content-Length': contents.length,
      'X-Content-Type-Options': 'nosniff',
    });
    if (req.method === 'HEAD') res.end();
    else res.end(contents);
  } catch {
    sendJson(res, 500, { error: 'Unable to read the requested frontend asset.' });
  }
}

async function handler(req, res) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, { status: 'ok', service: 'gomechanic-demo-api', timestamp: new Date().toISOString() });
  }
  if (pathname === '/api/services' && req.method === 'GET') {
    const result = services.map(({ minPrice, maxPrice, ...service }) => ({
      ...service, indicativeRange: { min: minPrice, max: maxPrice, currency: 'INR' },
    }));
    return sendJson(res, 200, { services: result, disclaimer: 'Prices are demo estimates, not official GoMechanic pricing.' });
  }
  if (pathname === '/api/cars' && req.method === 'GET') {
    return sendJson(res, 200, { cars: Object.entries(modelMap).map(([make, models]) => ({ make, models })), fuelTypes: [...knownFuels] });
  }

  if (pathname === '/api/quote' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const car = normalizeCar(body.car);
    const serviceName = String(body.serviceName || 'Standard Service').trim();
    const city = String(body.city || 'Bhubaneswar').trim();
    if (!car) return sendJson(res, 400, { error: 'Select a valid car brand, model and fuel type.' });
    if (!cities.includes(city)) return sendJson(res, 400, { error: 'Please select a supported demo city.' });
    const quote = estimateFor(car, serviceName);
    if (!quote) return sendJson(res, 400, { error: 'Please select a service from the catalogue.' });
    return sendJson(res, 200, { quoteId: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}`, city, car, ...quote, createdAt: new Date().toISOString() });
  }

  if (pathname === '/api/bookings' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const car = normalizeCar(body.car);
    const name = String(body.name || '').trim().replace(/\s+/g, ' ');
    const phone = String(body.phone || '').trim();
    const address = String(body.address || '').trim();
    const city = String(body.city || 'Bhubaneswar').trim();
    const bookingDate = String(body.bookingDate || '').trim();
    const serviceName = String(body.serviceName || '').trim();
    const estimate = estimateFor(car, serviceName);
    const errors = {};
    if (!name || name.length < 2 || name.length > 80) errors.name = 'Enter a name between 2 and 80 characters.';
    const digits = phone.replace(/\D/g, '').length;
    if (!/^[+]?[0-9\s()-]{10,18}$/.test(phone) || digits < 10 || digits > 15) errors.phone = 'Enter a valid phone number.';
    if (!address || address.length < 8 || address.length > 240) errors.address = 'Enter an address between 8 and 240 characters.';
    if (!car) errors.car = 'Select a valid car brand, model and fuel type.';
    if (!cities.includes(city)) errors.city = 'Select a supported demo city.';
    if (!estimate) errors.serviceName = 'Select a service from the catalogue.';
    const requestedDate = Date.parse(`${bookingDate}T00:00:00`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate) || Number.isNaN(requestedDate) || bookingDate < new Date().toISOString().slice(0, 10)) {
      errors.bookingDate = 'Choose a valid date today or later.';
    }
    if (Object.keys(errors).length) return sendJson(res, 400, { error: 'Please correct the booking details.', fields: errors });

    const booking = {
      id: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}`,
      name, phone, address, city, bookingDate, car, serviceName,
      estimate: { min: estimate.estimatedMin, max: estimate.estimatedMax, currency: estimate.currency },
      status: 'DEMO_REQUEST_RECEIVED', createdAt: new Date().toISOString(),
      note: 'Demo booking only. No real appointment was created with GoMechanic.',
    };
    await appendBooking(booking);
    return sendJson(res, 201, {
      bookingId: booking.id,
      status: booking.status,
      message: 'Demo booking request saved locally. No real appointment was made.',
      booking: { id: booking.id, city: booking.city, bookingDate: booking.bookingDate, serviceName: booking.serviceName },
    });
  }

  if (pathname.startsWith('/api/')) return sendJson(res, 404, { error: 'API route not found.' });
  return serveFrontend(req, res, pathname);
}

await ensureStorage();
const server = http.createServer((req, res) => {
  handler(req, res).catch((error) => {
    console.error('[api-error]', error?.message || error);
    const status = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
    if (!res.headersSent) sendJson(res, status, { error: error?.message || 'Unexpected server error.' });
    else res.destroy();
  });
});

server.listen(PORT, () => {
  console.log(`GoMechanic demo server listening on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});