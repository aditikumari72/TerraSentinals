'use client'

import { useState } from 'react'
import { Layers, Satellite, Map, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MapControlsProps {
  basemapMode: 'satellite' | 'contour' | 'altitude'
  onBasemapChange: (mode: 'satellite' | 'contour' | 'altitude') => void
  layers: {
    terrain: boolean
    rivers: boolean
    roads: boolean
    buildings: boolean
    vegetation: boolean
    riskHeatmap: boolean
  }
  onLayerChange: (layer: keyof typeof defaultLayers, enabled: boolean) => void
  weatherMode: 'history' | 'live' | 'forecast'
  onWeatherModeChange: (mode: 'history' | 'live' | 'forecast') => void
}

const defaultLayers = {
  terrain: true,
  rivers: true,
  roads: true,
  buildings: true,
  vegetation: true,
  riskHeatmap: true,
}

export function MapControls({
  basemapMode,
  onBasemapChange,
  layers,
  onLayerChange,
  weatherMode,
  onWeatherModeChange,
}: MapControlsProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'absolute left-4 top-4 w-56 rounded-lg border border-border/50 bg-background/90 p-3 backdrop-blur transition-all duration-300',
        collapsed && 'w-12'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className={cn('flex items-center gap-2', collapsed && 'hidden')}>
          <Layers className="h-5 w-5 text-accent" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Map Controls</h3>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-1 hover:bg-accent/20 transition-colors"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <Layers className="h-4 w-4" />
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Basemap Selection */}
          <div className="mb-4 border-t border-border/30 pt-3">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Basemap</p>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'satellite', label: 'Satellite', icon: '🛰️' },
                { id: 'contour', label: 'Contour', icon: '🗺️' },
                { id: 'altitude', label: 'Altitude', icon: '⛰️' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onBasemapChange(item.id as any)}
                  className={cn(
                    'rounded-sm border border-border/30 py-2 px-1 text-center text-xs font-medium transition-all',
                    basemapMode === item.id
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'hover:bg-accent/10 text-muted-foreground'
                  )}
                  title={item.label}
                >
                  <div className="text-lg mb-0.5">{item.icon}</div>
                  <div className="text-[10px]">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Overlay Layers */}
          <div className="mb-4 border-t border-border/30 pt-3">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Overlays</p>
            <div className="space-y-1.5">
              {[
                { key: 'riskHeatmap', label: 'Risk Heatmap', icon: '🔥' },
                { key: 'terrain', label: 'Terrain', icon: '⛰️' },
                { key: 'rivers', label: 'Rivers', icon: '💧' },
                { key: 'roads', label: 'Roads', icon: '🛣️' },
                { key: 'vegetation', label: 'Vegetation', icon: '🌲' },
                { key: 'buildings', label: 'Buildings', icon: '🏢' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer hover:bg-accent/10 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={layers[item.key as keyof typeof defaultLayers]}
                    onChange={(e) => onLayerChange(item.key as keyof typeof defaultLayers, e.target.checked)}
                    className="h-4 w-4 accent-accent"
                  />
                  <span className="text-xs">{item.icon}</span>
                  <span className="flex-1 text-xs font-medium">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Weather Panel */}
          <div className="border-t border-border/30 pt-3">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Rainfall</p>
            <div className="space-y-2">
              <div className="flex gap-1">
                {[
                  { id: 'history', label: 'History' },
                  { id: 'live', label: 'Live' },
                  { id: 'forecast', label: 'Forecast' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => onWeatherModeChange(mode.id as any)}
                    className={cn(
                      'flex-1 rounded-sm border border-border/30 py-1.5 text-xs font-medium transition-all',
                      weatherMode === mode.id
                        ? 'border-accent bg-accent/20 text-accent'
                        : 'hover:bg-accent/10 text-muted-foreground'
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Current rainfall data */}
              <div className="rounded-sm bg-accent/10 border border-accent/20 p-2">
                <div className="text-xs text-muted-foreground mb-1">
                  {weatherMode === 'history' && '30-day Average'}
                  {weatherMode === 'live' && 'Current Rain'}
                  {weatherMode === 'forecast' && '3-day Forecast'}
                </div>
                <div className="text-lg font-bold text-accent">
                  {weatherMode === 'live' && '42mm'}
                  {weatherMode === 'forecast' && '35mm'}
                  {weatherMode === 'history' && '38mm'}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">📊 Live: 6.4 mm/h</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
