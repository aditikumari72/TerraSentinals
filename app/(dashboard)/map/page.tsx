'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/dashboard/shell'
import { ThreeDTerrain } from '@/components/map/terrain-3d'
import { MapControls } from '@/components/map/map-controls'
import { StatisticsPanel } from '@/components/map/statistics-panel'
import { Timeline } from '@/components/map/timeline'
import type { GeoLocation } from '@/lib/terrain-utils'

export default function MapPage() {
  const [basemapMode, setBasemapMode] = useState<'satellite' | 'contour' | 'altitude'>('satellite')
  const [weatherMode, setWeatherMode] = useState<'history' | 'live' | 'forecast'>('live')
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation | null>(null)
  const [layers, setLayers] = useState({
    terrain: true,
    rivers: true,
    roads: true,
    buildings: true,
    vegetation: true,
    riskHeatmap: true,
  })

  const handleLayerChange = (layer: keyof typeof layers, enabled: boolean) => {
    setLayers((prev) => ({ ...prev, [layer]: enabled }))
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="3D Terrain Command Center"
        subtitle="Premium GIS Disaster Monitoring - Real-time Landslide Intelligence"
      />

      {/* Main 3D Command Center */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {/* 3D Terrain View */}
        <ThreeDTerrain
          onLocationSelect={setSelectedLocation}
          basemapMode={basemapMode}
          showLayers={layers}
          highlightedLocation={selectedLocation?.name}
        />

        {/* Left Sidebar - Map Controls */}
        <MapControls
          basemapMode={basemapMode}
          onBasemapChange={setBasemapMode}
          layers={layers}
          onLayerChange={handleLayerChange}
          weatherMode={weatherMode}
          onWeatherModeChange={setWeatherMode}
        />

        {/* Right Sidebar - Statistics Panel */}
        <StatisticsPanel selectedLocation={selectedLocation} />

        {/* Bottom Timeline */}
        <Timeline />
      </div>
    </div>
  )
}
