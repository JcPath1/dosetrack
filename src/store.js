const ITEMS_KEY = 'dosetrack_items'
const LOGS_KEY = 'dosetrack_logs'

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
