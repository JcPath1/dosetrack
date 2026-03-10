import { useState } from 'react'
import { CATEGORIES, FREQUENCIES, DAYS, createId, formatDate } from '../store'

function ItemForm({ item, onSave, onDelete, onClose }) {
  const isNew = !item.id
  const [name, setName] = useState(item.name || '')
  const [category, setCategory] = useState(item.category || 'peptide')
  const [dose, setDose] = useState(item.dose || '')
  const [unit, setUnit] = useState(item.unit || 'mg')
  const [frequency, setFrequency] = useState(item.frequency || 'daily')
  const [days, setDays] = useState(item.days || [])
  const [time, setTime] = useState(item.time || '')
  const [notes, setNotes] = useState(item.notes || '')
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      id: item.id || createId(),
      name: name.trim(),
      category,
      dose,
      unit,
      frequency,
      days: frequency !== 'daily' ? days : [],
      time,
      notes: notes.trim(),
      startDate: item.startDate || formatDate(new Date()),
    })
  }

  function toggleDay(d) {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  return (
    <div className="app">
      <div className="app-content">
        <div className="top-bar">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>{isNew ? 'Add Item' : 'Edit Item'}</h1>
          <button className="btn btn-ghost" style={{ color: 'var(--accent)' }} onClick={handleSave}>Save</button>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. BPC-157, Vitamin D, Testosterone..."
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Dose</label>
              <input
                type="text"
                value={dose}
                onChange={e => setDose(e.target.value)}
                placeholder="250"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Unit</label>
              <select value={unit} onChange={e => setUnit(e.target.value)}>
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
                <option value="ml">ml</option>
                <option value="IU">IU</option>
                <option value="g">g</option>
                <option value="caps">caps</option>
                <option value="tabs">tabs</option>
                <option value="drops">drops</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Frequency</label>
            <select value={frequency} onChange={e => setFrequency(e.target.value)}>
              {FREQUENCIES.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {frequency !== 'daily' && (
            <div className="form-group">
              <label className="form-label">Days</label>
              <div className="day-picker">
                {DAYS.map((label, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`day-chip ${days.includes(i) ? 'selected' : ''}`}
                    onClick={() => toggleDay(i)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Time of Day (optional)</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Injection site, take with food, etc."
            />
          </div>

          {onDelete && !confirmDelete && (
            <button
              type="button"
              className="btn btn-ghost btn-block"
              style={{ color: 'var(--red)', marginBottom: 24 }}
              onClick={() => setConfirmDelete(true)}
            >
              Delete Item
            </button>
          )}

          {onDelete && confirmDelete && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={() => onDelete(item.id)}
              >
                Confirm Delete
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ItemForm
