import { useState, useEffect, useCallback } from 'react'
import { loadItems, saveItems, loadLogs, saveLogs, formatDate } from './store'
import Today from './views/Today'
import Calendar from './views/Calendar'
import Items from './views/Items'
import ItemForm from './views/ItemForm'
import './App.css'

const TABS = [
  { id: 'today', label: 'Today', icon: '○' },
  { id: 'calendar', label: 'Calendar', icon: '▦' },
  { id: 'items', label: 'My Items', icon: '≡' },
]

function App() {
  const [tab, setTab] = useState('today')
  const [items, setItems] = useState(loadItems)
  const [logs, setLogs] = useState(loadLogs)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))

  useEffect(() => { saveItems(items) }, [items])
  useEffect(() => { saveLogs(logs) }, [logs])

  const toggleLog = useCallback((itemId, date) => {
    setLogs(prev => {
      const key = `${itemId}:${date}`
      const next = { ...prev }
      if (next[key]) {
        delete next[key]
      } else {
        next[key] = { time: new Date().toISOString() }
      }
      return next
    })
  }, [])

  const saveItem = useCallback((item) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === item.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = item
        return next
      }
      return [...prev, item]
    })
    setEditingItem(null)
  }, [])

  const deleteItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    setLogs(prev => {
      const next = { ...prev }
      for (const key of Object.keys(next)) {
        if (key.startsWith(id + ':')) delete next[key]
      }
      return next
    })
    setEditingItem(null)
  }, [])

  if (editingItem !== null) {
    return (
      <ItemForm
        item={editingItem}
        onSave={saveItem}
        onDelete={editingItem.id ? deleteItem : null}
        onClose={() => setEditingItem(null)}
      />
    )
  }

  return (
    <div className="app">
      <div className="app-content">
        {tab === 'today' && (
          <Today
            items={items}
            logs={logs}
            date={selectedDate}
            onToggle={toggleLog}
            onDateChange={setSelectedDate}
          />
        )}
        {tab === 'calendar' && (
          <Calendar
            items={items}
            logs={logs}
            onSelectDate={(d) => { setSelectedDate(d); setTab('today') }}
          />
        )}
        {tab === 'items' && (
          <Items
            items={items}
            onEdit={setEditingItem}
            onAdd={() => setEditingItem({})}
          />
        )}
      </div>
      <nav className="tab-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
