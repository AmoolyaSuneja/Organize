import { useId } from 'react'

export type RoomType = 'room' | 'closet' | 'kitchen'
export type Goal = 'declutter' | 'maximize-storage' | 'showcase' | 'workflow'
export type StylePref = 'minimal' | 'modern' | 'cozy'

export type FiltersState = {
  roomType: RoomType
  goals: Goal[]
  style: StylePref
  density: number // 0..100 (how dense to pack zones)
}

type FiltersPanelProps = {
  value: FiltersState
  onChange: (next: FiltersState) => void
  disabled?: boolean
}

export function FiltersPanel({ value, onChange, disabled }: FiltersPanelProps) {
  const roomId = useId()
  const styleId = useId()
  const densityId = useId()

  const toggleGoal = (g: Goal) => {
    if (value.goals.includes(g)) {
      onChange({ ...value, goals: value.goals.filter(x => x !== g) })
    } else {
      onChange({ ...value, goals: [...value.goals, g] })
    }
  }

  return (
    <section className="rounded-2xl border border-yellow-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700">Filters</h3>
      <div className="mt-3 grid gap-4">
        <div>
          <label htmlFor={roomId} className="text-xs text-slate-600">Room type</label>
          <select
            id={roomId}
            disabled={disabled}
            value={value.roomType}
            onChange={(e) => onChange({ ...value, roomType: e.target.value as RoomType })}
            className="mt-1 w-full rounded-md border border-yellow-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50"
          >
            <option value="room">Room</option>
            <option value="closet">Closet</option>
            <option value="kitchen">Kitchen</option>
          </select>
        </div>

        <div>
          <div className="text-xs text-slate-600">Goals</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {([
              { key: 'declutter', label: 'Declutter' },
              { key: 'maximize-storage', label: 'Max Storage' },
              { key: 'showcase', label: 'Showcase' },
              { key: 'workflow', label: 'Workflow' },
            ] as const).map(g => (
              <button
                key={g.key}
                type="button"
                disabled={disabled}
                onClick={() => toggleGoal(g.key)}
                className={[
                  'text-xs px-3 py-1.5 rounded-md border transition',
                  value.goals.includes(g.key)
                    ? 'border-brand-400 bg-brand-50 text-slate-900'
                    : 'border-yellow-200 hover:border-yellow-300',
                ].join(' ')}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor={styleId} className="text-xs text-slate-600">Style</label>
          <select
            id={styleId}
            disabled={disabled}
            value={value.style}
            onChange={(e) => onChange({ ...value, style: e.target.value as StylePref })}
            className="mt-1 w-full rounded-md border border-yellow-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50"
          >
            <option value="minimal">Minimal</option>
            <option value="modern">Modern</option>
            <option value="cozy">Cozy</option>
          </select>
        </div>

        <div>
          <label htmlFor={densityId} className="text-xs text-slate-600">Density</label>
          <input
            id={densityId}
            type="range"
            min={0}
            max={100}
            step={5}
            disabled={disabled}
            value={value.density}
            onChange={(e) => onChange({ ...value, density: Number(e.target.value) })}
            className="mt-1 w-full accent-amber-500"
          />
          <div className="text-xs text-slate-500 mt-1">{value.density}%</div>
        </div>
      </div>
    </section>
  )
}


