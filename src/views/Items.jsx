import { CATEGORIES, FREQUENCIES } from '../store'

function Items({ items, onEdit, onAdd }) {
  const catColor = (cat) => CATEGORIES.find(c => c.value === cat)?.color || 'var(--text2)'
  const freqLabel = (f) => FREQUENCIES.find(fr => fr.value === f)?.label || f

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title" style={{ margin: 0 }}>My Items</h1>
        <button className="btn btn-primary" onClick={onAdd}>+ Add</button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 40 }}>+</div>
          <p>Add your first peptide, supplement, or medication</p>
        </div>
      ) : (
        <div style={{ paddingBottom: 16 }}>
          {items.map(item => (
            <button
              key={item.id}
              className="card item-card"
              onClick={() => onEdit(item)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div className="item-dot" style={{ background: catColor(item.category) }} />
                <span style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingLeft: 22 }}>
                <span className="badge" style={{
                  background: catColor(item.category) + '22',
                  color: catColor(item.category)
                }}>
                  {item.category}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>
                  {item.dose} {item.unit || ''}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>
                  {freqLabel(item.frequency)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <style>{`
        .item-card {
          width: 100%;
          text-align: left;
          transition: opacity 0.2s;
        }
        .item-card:active { opacity: 0.8; }
        .item-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  )
}

export default Items
