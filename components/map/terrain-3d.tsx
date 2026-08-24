'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  generateTerrainHeightMap,
  generateRiverPaths,
  generateRoadNetwork,
  generateGeoLocations,
  generateRiskHeatmap,
  getTerrainColor,
  type TerrainHeightData,
  type GeoLocation,
} from '@/lib/terrain-utils'

export interface ThreeDTerrainProps {
  onLocationSelect?: (location: GeoLocation) => void
  basemapMode?: 'satellite' | 'contour' | 'altitude'
  showLayers?: {
    terrain?: boolean
    rivers?: boolean
    roads?: boolean
    buildings?: boolean
    vegetation?: boolean
    riskHeatmap?: boolean
  }
  highlightedLocation?: string
}

export function ThreeDTerrain({
  onLocationSelect,
  basemapMode = 'satellite',
  showLayers = {
    terrain: true,
    rivers: true,
    roads: true,
    buildings: true,
    vegetation: true,
    riskHeatmap: true,
  },
  highlightedLocation,
}: ThreeDTerrainProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const terrainMeshRef = useRef<THREE.Mesh | null>(null)
  const markerGroupRef = useRef<THREE.Group | null>(null)
  const heatmapMeshRef = useRef<THREE.Mesh | null>(null)
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 1500, z: 1000 })
  const [rotation, setRotation] = useState({ x: -0.5, y: 0 })
  const [terrainData, setTerrainData] = useState<TerrainHeightData | null>(null)
  const [locations, setLocations] = useState<GeoLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation | null>(null)

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a2b4d)
    scene.fog = new THREE.Fog(0x1a2b4d, 5000, 8000)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    )
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(3000, 2000, 2000)
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 5000
    directionalLight.shadow.camera.left = -2500
    directionalLight.shadow.camera.right = 2500
    directionalLight.shadow.camera.top = 2500
    directionalLight.shadow.camera.bottom = -2500
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Generate terrain
    const heightMap = generateTerrainHeightMap(256, 256, {
      baseHeight: 500,
      maxHeight: 3500,
      mountainPeaks: 8,
    })
    setTerrainData(heightMap)

    // Create terrain mesh
    const geometry = new THREE.BufferGeometry()
    const { width, height, data } = heightMap

    const positions = new Float32Array((width + 1) * (height + 1) * 3)
    const colors = new Float32Array((width + 1) * (height + 1) * 3)
    const indices: number[] = []

    let posIdx = 0
    let colorIdx = 0

    const minElev = Math.min(...data)
    const maxElev = Math.max(...data)

    for (let y = 0; y <= height; y++) {
      for (let x = 0; x <= width; x++) {
        const idx = y * width + x
        const elevation = data[idx] || 0

        positions[posIdx++] = (x / width) * 2500
        positions[posIdx++] = elevation
        positions[posIdx++] = (y / height) * 2500

        const color = getTerrainColor(elevation, minElev, maxElev)
        colors[colorIdx++] = color.r
        colors[colorIdx++] = color.g
        colors[colorIdx++] = color.b
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const a = y * (width + 1) + x
        const b = a + width + 1
        const c = a + 1
        const d = b + 1

        indices.push(a, b, c)
        indices.push(c, b, d)
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1))
    geometry.computeVertexNormals()

    const material = new THREE.MeshPhongMaterial({
      vertexColors: true,
      side: THREE.FrontSide,
      wireframe: false,
      flatShading: false,
      shininess: 30,
    })

    const terrainMesh = new THREE.Mesh(geometry, material)
    terrainMesh.castShadow = true
    terrainMesh.receiveShadow = true
    scene.add(terrainMesh)
    terrainMeshRef.current = terrainMesh

    // Add rivers
    if (showLayers.rivers) {
      const riverPaths = generateRiverPaths(heightMap, 3)
      const riverGeometry = new THREE.BufferGeometry()
      const riverPositions: number[] = []

      riverPaths.forEach((segment) => {
        const x = (segment.x / 100) * 2500
        const z = (segment.z / 100) * 2500
        const elevationIndex = Math.floor((segment.z / 100) * height) * width + Math.floor((segment.x / 100) * width)
        const y = data[Math.min(elevationIndex, data.length - 1)] + 10

        riverPositions.push(x, y, z)
      })

      riverGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(riverPositions), 3))
      const riverMaterial = new THREE.PointsMaterial({
        color: 0x4da6ff,
        size: 20,
        sizeAttenuation: true,
      })
      const rivers = new THREE.Points(riverGeometry, riverMaterial)
      scene.add(rivers)
    }

    // Add roads
    if (showLayers.roads) {
      const roadNetwork = generateRoadNetwork(heightMap, 4)
      roadNetwork.forEach((road) => {
        const roadGeometry = new THREE.BufferGeometry()
        const roadPositions = [
          (road.x1 / 100) * 2500,
          data[Math.floor((road.z1 / 100) * height) * width + Math.floor((road.x1 / 100) * width)] + 5,
          (road.z1 / 100) * 2500,
          (road.x2 / 100) * 2500,
          data[Math.floor((road.z2 / 100) * height) * width + Math.floor((road.x2 / 100) * width)] + 5,
          (road.z2 / 100) * 2500,
        ]
        roadGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(roadPositions), 3))
        const roadMaterial = new THREE.LineBasicMaterial({ color: 0xffdd00, linewidth: 3 })
        const roadLine = new THREE.Line(roadGeometry, roadMaterial)
        scene.add(roadLine)
      })
    }

    // Add risk heatmap overlay
    if (showLayers.riskHeatmap) {
      const riskData = generateRiskHeatmap(64, 64)
      const heatmapGeometry = new THREE.BufferGeometry()
      const heatmapPositions: number[] = []
      const heatmapColors: number[] = []

      riskData.forEach((point) => {
        const x = (point.x / 100) * 2500
        const z = (point.z / 100) * 2500
        const elevationIndex = Math.floor((point.z / 100) * height) * width + Math.floor((point.x / 100) * width)
        const y = data[Math.min(elevationIndex, data.length - 1)] + 15

        heatmapPositions.push(x, y, z)

        // Red for high risk, green for low risk
        const riskNorm = point.riskScore / 100
        heatmapColors.push(riskNorm, 1 - riskNorm, 0)
      })

      heatmapGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(heatmapPositions), 3))
      heatmapGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(heatmapColors), 3))

      const heatmapMaterial = new THREE.PointsMaterial({
        size: 30,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6,
      })

      const heatmapMesh = new THREE.Points(heatmapGeometry, heatmapMaterial)
      scene.add(heatmapMesh)
      heatmapMeshRef.current = heatmapMesh
    }

    // Add location markers
    const geoLocations = generateGeoLocations(heightMap)
    setLocations(geoLocations)

    const markerGroup = new THREE.Group()
    markerGroupRef.current = markerGroup
    scene.add(markerGroup)

    geoLocations.forEach((loc) => {
      const x = (loc.lon - 91) / 5 * 2500
      const z = (loc.lat - 28) / 4 * 2500

      // Create marker
      const markerGeometry = new THREE.SphereGeometry(25, 16, 16)
      let markerColor = 0x00ff00 // Default green

      if (loc.type === 'incident') {
        markerColor = 0xff4444
      } else if (loc.type === 'hospital') {
        markerColor = 0x0088ff
      } else if (loc.type === 'settlement') {
        markerColor = 0xffaa00
      }

      const markerMaterial = new THREE.MeshStandardMaterial({
        color: markerColor,
        emissive: markerColor,
        emissiveIntensity: 0.5,
      })

      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.set(x, loc.altitude + 40, z)
      marker.castShadow = true
      marker.receiveShadow = true
      ;(marker as any).locationData = loc

      markerGroup.add(marker)
    })

    // Mouse interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(markerGroup.children)

      if (intersects.length > 0) {
        const marker = intersects[0].object as any
        if (marker.locationData) {
          setSelectedLocation(marker.locationData)
          onLocationSelect?.(marker.locationData)
        }
      }
    }

    containerRef.current.addEventListener('click', onMouseClick)

    // Keyboard camera controls
    const keys: { [key: string]: boolean } = {}
    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Camera controls
      const moveSpeed = 30
      const rotateSpeed = 0.01

      if (keys['ArrowUp'] || keys['w']) {
        camera.position.z -= moveSpeed
      }
      if (keys['ArrowDown'] || keys['s']) {
        camera.position.z += moveSpeed
      }
      if (keys['ArrowLeft'] || keys['a']) {
        camera.position.x -= moveSpeed
      }
      if (keys['ArrowRight'] || keys['d']) {
        camera.position.x += moveSpeed
      }
      if (keys['+'] || keys['=']) {
        camera.position.y -= moveSpeed
      }
      if (keys['-']) {
        camera.position.y += moveSpeed
      }

      // Add subtle animation to markers
      markerGroup.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh
        mesh.position.y += Math.sin(Date.now() * 0.001 + i) * 0.5
      })

      // Look at center of terrain
      const centerX = (0 + 2500) / 2
      const centerZ = (0 + 2500) / 2
      const lookAtY = 1000
      camera.lookAt(centerX, lookAtY, centerZ)

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      containerRef.current?.removeEventListener('click', onMouseClick)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-gradient-to-b from-blue-900 to-slate-900"
      style={{ minHeight: '600px' }}
    />
  )
}
