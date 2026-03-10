const ITEMS_KEY = 'dosetrack_items'
const LOGS_KEY = 'dosetrack_logs'
const SEEDED_KEY = 'dosetrack_seeded'

export function loadItems() {
  try {
    return JSON.parse(localStorage.getItem(ITEMS_KEY)) || []
  } catch { return [] }
}

export function saveItems(items) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items))
}

export function loadLogs() {
  try {
    return JSON.parse(localStorage.getItem(LOGS_KEY)) || {}
  } catch { return {} }
}

export function saveLogs(logs) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs))
}

// Log key format: "itemId:YYYY-MM-DD"
export function getLogKey(itemId, date) {
  return `${itemId}:${date}`
}

export function formatDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const CATEGORIES = [
  { value: 'peptide', label: 'Peptide', color: 'var(--accent)' },
  { value: 'testosterone', label: 'Testosterone', color: 'var(--orange)' },
  { value: 'supplement', label: 'Supplement', color: 'var(--green)' },
  { value: 'vitamin', label: 'Vitamin', color: 'var(--purple)' },
  { value: 'other', label: 'Other', color: 'var(--text2)' },
]

export const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 Weeks' },
  { value: 'custom', label: 'Custom Days' },
]

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function isDueOnDate(item, dateStr) {
  if (item.paused) return false
  const d = parseDate(dateStr)
  const day = d.getDay()

  if (item.frequency === 'daily') return true
  if (item.frequency === 'weekly') return (item.days || []).includes(day)
  if (item.frequency === 'biweekly') {
    if (!(item.days || []).includes(day)) return false
    const start = parseDate(item.startDate || dateStr)
    const diffWeeks = Math.floor((d - start) / (7 * 86400000))
    return diffWeeks % 2 === 0
  }
  if (item.frequency === 'custom') return (item.days || []).includes(day)
  return false
}

export function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// Dosing calculator
export function calcSyringe(doseValue, doseUnit, vialStrengthMg, bacWaterMl) {
  if (!doseValue || !vialStrengthMg || !bacWaterMl) return null
  const dose = parseFloat(doseValue)
  const vial = parseFloat(vialStrengthMg)
  const water = parseFloat(bacWaterMl)
  if (!dose || !vial || !water) return null

  // Convert dose to mg for calculation
  let doseMg = dose
  if (doseUnit === 'mcg') doseMg = dose / 1000
  if (doseUnit === 'IU') return null // IU needs specific conversion per compound

  const concentration = vial / water // mg per ml
  const mlToDraw = doseMg / concentration
  const syringeUnits = mlToDraw * 100 // 1ml = 100 units on insulin syringe
  const dosesPerVial = vial / doseMg

  return {
    syringeUnits: Math.round(syringeUnits * 10) / 10,
    mlToDraw: Math.round(mlToDraw * 1000) / 1000,
    concentration: Math.round(concentration * 100) / 100,
    dosesPerVial: Math.floor(dosesPerVial),
  }
}

// Pre-built starter peptides
export const STARTER_ITEMS = [
  {
    name: 'BPC-157',
    category: 'peptide',
    description: 'Body Protection Compound. Promotes healing of tendons, ligaments, muscles, gut lining, and nerves. Reduces inflammation and accelerates recovery from injuries. Expect reduced pain and improved mobility within 1-2 weeks.',
    dose: '250',
    unit: 'mcg',
    frequency: 'daily',
    days: [],
    time: '08:00',
    vialStrength: '10',
    bacWater: '3',
    notes: 'SubQ injection. Inject near injury site if possible. Can increase to 500mcg or split into AM/PM doses. Cycle: 4-8 weeks on, 2-4 weeks off.',
  },
  {
    name: 'TB-500',
    category: 'peptide',
    description: 'Thymosin Beta-4. Promotes tissue repair, reduces inflammation, improves flexibility and mobility. Works synergistically with BPC-157 for healing. Expect improved recovery and reduced stiffness within 1-2 weeks.',
    dose: '500',
    unit: 'mcg',
    frequency: 'weekly',
    days: [0, 3], // Sun & Wed
    time: '08:00',
    vialStrength: '10',
    bacWater: '3',
    notes: 'SubQ injection. 2x/week (Sun & Wed) for loading phase (4-6 weeks), then 1x/week maintenance. Cycle: 8-12 weeks on, 4 weeks off.',
  },
  {
    name: 'MOTS-C',
    category: 'peptide',
    description: 'Mitochondrial peptide. Improves metabolic function, exercise performance, fat loss, and insulin sensitivity. Boosts cellular energy production. Expect increased energy and endurance within first 1-2 weeks.',
    dose: '200',
    unit: 'mcg',
    frequency: 'daily',
    days: [],
    time: '08:00',
    vialStrength: '10',
    bacWater: '3',
    paused: true,
    notes: 'SubQ injection. Start 200mcg daily, increase by 200mcg every 2 weeks. Target dose ~1mg/day (based on 220lbs). Best on training days.',
  },
  {
    name: 'NA Semax',
    category: 'peptide',
    description: 'N-Acetyl Semax. Neuroprotective, enhances cognitive function, focus, memory, and mood. Increases BDNF (brain-derived neurotrophic factor). Expect improved mental clarity and focus within days.',
    dose: '200',
    unit: 'mcg',
    frequency: 'daily',
    days: [],
    time: '08:00',
    vialStrength: '10',
    bacWater: '3',
    notes: 'SubQ injection or nasal spray. N-Acetyl version is 30-40% more potent than regular Semax. Can increase to 400-600mcg. Do not exceed 900mcg/day.',
  },
  {
    name: 'GHK-Cu',
    category: 'peptide',
    description: 'Copper peptide. Promotes skin regeneration, wound healing, collagen production, and hair growth. Anti-aging and anti-inflammatory properties. Expect visible skin improvements within 2-4 weeks.',
    dose: '200',
    unit: 'mcg',
    frequency: 'daily',
    days: [],
    time: '20:00',
    vialStrength: '50',
    bacWater: '3',
    notes: 'SubQ injection. Start at 200mcg daily, can increase to 600mcg. Evening dosing preferred. Cycle: 4-8 weeks on, 2-4 weeks off.',
  },
]

export function seedStarterItems() {
  if (localStorage.getItem(SEEDED_KEY)) return null
  const items = STARTER_ITEMS.map(item => ({
    ...item,
    id: createId(),
    startDate: formatDate(new Date()),
  }))
  localStorage.setItem(SEEDED_KEY, 'true')
  return items
}
