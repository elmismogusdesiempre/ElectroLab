
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { GRID_SIZE, COMPONENT_PINS, TRANSLATIONS } from './constants';
import { ComponentData, ComponentType, Wire, Point, ResistorBandColor, Pin } from './types';
import { generateId, snapToGrid, getPinAbsolutePosition, calculateResistance, formatResistance, formatCapacitance, formatCurrent, getWirePath, createObstacleMap, identifyWireNets, generatePathData, measureResistance, solveCircuit, detectShortCircuit } from './utils/circuitUtils';
import { ComponentRenderer } from './components/ComponentRenderer';
import { Toolbox } from './components/Toolbox';
import { Instruments } from './components/Instruments';
import { ResistorEditor } from './components/ResistorEditor';
import { LEDEditor } from './components/LEDEditor';
import { CapacitorEditor } from './components/CapacitorEditor';
import { ACSourceEditor } from './components/ACSourceEditor';
import { PotentiometerEditor } from './components/PotentiometerEditor';
import { MultimeterEditor } from './components/MultimeterEditor';
import { IC555Pinout } from './components/IC555Pinout';
import { ComponentInfoPanel } from './components/ComponentInfoPanel';
import { analyzeCircuit } from './services/geminiService';
import { RotateCw, Trash2, Bot, MessageSquare, Info, BookOpen, ChevronDown, Sun, Moon, Globe, TriangleAlert, Eye, EyeOff, X, ZoomIn, ZoomOut, Move, Hand, MousePointer2 } from 'lucide-react';
import { PRESETS, Preset } from './presets';

interface DrawingWireState {
    compId: string;
    pinId: string;
    startPt: Point;
    waypoints: Point[];
}

export default function App() {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  
  // Settings State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [showLabels, setShowLabels] = useState(true); 
  
  // Viewport State (Zoom & Pan)
  const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
  const [interactionMode, setInteractionMode] = useState<'select' | 'pan'>('select'); // New mode state
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point>({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);

  // Touch Zoom State
  const [pinchDist, setPinchDist] = useState<number | null>(null);

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [supplyVoltage, setSupplyVoltage] = useState(5.0);
  
  // History for Undo
  const [history, setHistory] = useState<{ components: ComponentData[], wires: Wire[] }[]>([]);
  
  // Interaction State
  const [isDraggingComponents, setIsDraggingComponents] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 }); 
  const [dragStartMouse, setDragStartMouse] = useState<Point>({ x: 0, y: 0 }); 
  
  const [drawingWire, setDrawingWire] = useState<DrawingWireState | null>(null);
  const [selectionBox, setSelectionBox] = useState<{ start: Point, end: Point } | null>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });

  // Safety Alert State
  const [safetyAlert, setSafetyAlert] = useState<{ title: string; message: string } | null>(null);
  
  // Preset Info State
  const [presetInfo, setPresetInfo] = useState<{ title: string; description: string } | null>(null);

  // Refs
  const dragStartSnapshot = useRef<{ components: ComponentData[], wires: Wire[] } | null>(null);
  const canvasRef = useRef<SVGSVGElement>(null);
  // Pointer cache for multi-touch
  const pointers = useRef<Map<number, { x: number, y: number }>>(new Map());

  // AI State
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // UI State
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [presetsMenuOpen, setPresetsMenuOpen] = useState(false);

  // Editors State
  const [editingResistorId, setEditingResistorId] = useState<string | null>(null);
  const [editingLEDId, setEditingLEDId] = useState<string | null>(null);
  const [editingCapacitorId, setEditingCapacitorId] = useState<string | null>(null);
  const [editingACSourceId, setEditingACSourceId] = useState<string | null>(null);
  const [editingPotentiometerId, setEditingPotentiometerId] = useState<string | null>(null);
  const [editingMultimeterId, setEditingMultimeterId] = useState<string | null>(null);
  const [viewingIC555Id, setViewingIC555Id] = useState<string | null>(null); 

  const t = TRANSLATIONS[lang];
  const isDark = theme === 'dark';

  // --- Z-Index / Rendering Order Logic ---
  const sortedComponents = useMemo(() => {
    return [...components].sort((a, b) => {
        const aSelected = selectedIds.has(a.id) ? 1 : 0;
        const bSelected = selectedIds.has(b.id) ? 1 : 0;
        if (aSelected !== bSelected) return aSelected - bSelected; 
        const aIsMulti = a.type === ComponentType.Multimeter ? 1 : 0;
        const bIsMulti = b.type === ComponentType.Multimeter ? 1 : 0;
        return aIsMulti - bIsMulti;
    });
  }, [components, selectedIds]);

  // --- Sound Utility ---
  const playSafetyAlertSound = useCallback(() => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sawtooth';
        // Alarm sweep
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(800, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
        console.error("Audio playback failed", e);
    }
  }, []);

  // --- Undo Logic ---
  const saveToHistory = () => {
    setHistory(prev => {
        const newHistory = [...prev, { components, wires }];
        if (newHistory.length > 20) return newHistory.slice(newHistory.length - 20);
        return newHistory;
    });
  };

  const undo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    if (lastState) {
        setComponents(lastState.components);
        setWires(lastState.wires);
    }
    setHistory(prev => prev.slice(0, -1));
    setSelectedIds(new Set());
  };

  // --- Handlers ---
  const loadPreset = (preset: Preset) => {
      saveToHistory();
      const idMap: Record<string, string> = {};
      
      const newComponents = preset.components.map(c => {
          const newId = generateId();
          idMap[c.id] = newId;
          return { ...c, id: newId };
      });
      const newWires = preset.wires.map(w => ({
          ...w,
          id: generateId(),
          fromCompId: idMap[w.fromCompId],
          toCompId: idMap[w.toCompId]
      }));
      setComponents(newComponents);
      setWires(newWires);
      setPresetsMenuOpen(false);
      setSelectedIds(new Set());
      setIsSimulating(false);
      
      // Reset view to center roughly
      setView({ x: 0, y: 0, zoom: 1 });

      setPresetInfo({
          title: preset.name,
          description: preset.description
      });
  };

  const addComponent = (type: ComponentType) => {
    saveToHistory();
    setInteractionMode('select'); // Auto switch to select mode when adding
    
    // Add relative to current view center
    const viewportCenter = {
        x: (window.innerWidth / 2 - 240 - view.x) / view.zoom, // -240 for toolbox offset approx
        y: (window.innerHeight / 2 - view.y) / view.zoom
    };

    const newComp: ComponentData = {
      id: generateId(),
      type,
      x: snapToGrid(viewportCenter.x),
      y: snapToGrid(viewportCenter.y),
      rotation: 0,
      properties: {}
    };

    if (type === ComponentType.Resistor) newComp.properties.bands = ['brown', 'black', 'red', 'gold'];
    if (type === ComponentType.Switch) newComp.properties.isOpen = true;
    if (type === ComponentType.LED) {
        newComp.properties.isOn = false;
        newComp.properties.color = 'red';
    }
    if (type === ComponentType.Capacitor) {
        newComp.properties.capacitance = 10; // 10 uF default
        newComp.properties.isElectrolytic = false;
    }
    if (type === ComponentType.ZenerDiode) {
        newComp.properties.breakdownVoltage = 4.7; // Default Zener voltage
    }
    if (type === ComponentType.ACSource) {
        newComp.properties.peakVoltage = 220;
        newComp.properties.frequency = 60;
    }
    if (type === ComponentType.Potentiometer) {
        newComp.properties.totalResistance = 10000;
        newComp.properties.wiperPosition = 50; // 50%
    }
    if (type === ComponentType.Multimeter) {
        newComp.properties.mode = 'OFF';
        newComp.properties.displayValue = '';
        newComp.properties.size = 'standard';
    }
    if (type === ComponentType.IC555) {
        newComp.properties.outputHigh = false; // Internal flip-flop state
    }

    setComponents([...components, newComp]);
    setSelectedIds(new Set([newComp.id]));
  };
  
  const handleRotate = (id: string) => {
    saveToHistory();
    setComponents(prev => prev.map(c => {
        if (c.id === id) {
             return { ...c, rotation: (c.rotation + 90) % 360 };
        }
        return c;
    }));
  };

  // Convert Screen Pixel Coordinates to World Coordinates (taking zoom/pan into account)
  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Apply inverse transform
    const x = (clientX - rect.left - view.x) / view.zoom;
    const y = (clientY - rect.top - view.y) / view.zoom;

    return { x, y };
  };

  const isPointInsideComponent = (point: Point, comp: ComponentData) => {
    const dx = Math.abs(point.x - comp.x);
    const dy = Math.abs(point.y - comp.y);
    if (comp.type === ComponentType.Multimeter) {
        const scale = comp.properties.size === 'large' ? 2 : 1;
        return dx < 70 * scale && dy < 50 * scale;
    }
    if (comp.type === ComponentType.IC555) return dx < 40 && dy < 45;
    if (comp.type === ComponentType.Microcontroller) return dx < 30 && dy < 50;
    return dx < 40 && dy < 40;
  };

  // --- Zoom & Pan Handlers ---
  const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      
      const scaleBy = 1.1;
      const oldScale = view.zoom;
      const newScale = e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      
      // Limit zoom
      if (newScale < 0.2 || newScale > 5) return;

      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate world point under mouse before zoom
      const wx = (x - view.x) / oldScale;
      const wy = (y - view.y) / oldScale;

      // Calculate new offset to keep the world point under the mouse
      const newX = x - wx * newScale;
      const newY = y - wy * newScale;

      setView({ x: newX, y: newY, zoom: newScale });
  };

  // --- POINTER EVENTS (TOUCH & MOUSE) ---

  const handlePointerDown = (e: React.PointerEvent) => {
    // Register pointer
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const target = e.target as Element;
    target.setPointerCapture(e.pointerId);

    // Multi-touch Zoom Check
    if (pointers.current.size === 2) {
        const values = Array.from(pointers.current.values());
        const p1 = values[0] as { x: number; y: number };
        const p2 = values[1] as { x: number; y: number };
        const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        setPinchDist(dist);
        setIsPanning(false); // Cancel panning if zooming
        setDrawingWire(null);
        setIsDraggingComponents(false);
        return;
    }

    // Panning Mode Check (Middle Click, Spacebar, or explicit Pan Mode)
    if (e.button === 1 || (spacePressed && e.button === 0) || interactionMode === 'pan') {
        setIsPanning(true);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
        e.preventDefault();
        return;
    }

    // Normal Selection / Interaction Logic
    const pt = getCanvasCoordinates(e.clientX, e.clientY);
    const hitTestOrder = [...sortedComponents].reverse();

    // 1. Check Pins (Wiring)
    for (const comp of hitTestOrder) {
      const pins = COMPONENT_PINS[comp.type] || [];
      for (const pin of pins) {
        const absPos = getPinAbsolutePosition(comp, pin.id);
        const dist = Math.sqrt(Math.pow(pt.x - absPos.x, 2) + Math.pow(pt.y - absPos.y, 2));
        if (dist < 15) { // Increased hit area for touch
          e.stopPropagation();
          if (drawingWire) {
              if (comp.id !== drawingWire.compId || pin.id !== drawingWire.pinId) {
                  saveToHistory();
                  const newWire: Wire = {
                      id: generateId(),
                      fromCompId: drawingWire.compId,
                      fromPinId: drawingWire.pinId,
                      toCompId: comp.id,
                      toPinId: pin.id,
                      waypoints: drawingWire.waypoints
                  };
                  setWires(prev => [...prev, newWire]);
              }
              setDrawingWire(null);
          } else {
              setDrawingWire({ compId: comp.id, pinId: pin.id, startPt: absPos, waypoints: [] });
          }
          return;
        }
      }
    }

    // 2. Add Waypoint
    if (drawingWire) {
        const snappedPt = { x: snapToGrid(pt.x), y: snapToGrid(pt.y) };
        setDrawingWire(prev => prev ? { ...prev, waypoints: [...prev.waypoints, snappedPt] } : null);
        return;
    }

    // 3. Components
    const clickedComp = hitTestOrder.find(c => isPointInsideComponent(pt, c));
    if (clickedComp) {
      e.stopPropagation();
      if (e.ctrlKey || e.metaKey) {
          handleRotate(clickedComp.id);
          return;
      }
      dragStartSnapshot.current = { components, wires };
      const newSelection = new Set(selectedIds);
      if (!newSelection.has(clickedComp.id)) setSelectedIds(new Set([clickedComp.id]));
      setIsDraggingComponents(true);
      setDragStartMouse(pt);
    } else {
      // 4. Selection Box
      setSelectedIds(new Set());
      setSelectionBox({ start: pt, end: pt });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Update pointer position record
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Handle Pinch Zoom
    if (pointers.current.size === 2 && pinchDist !== null) {
        const values = Array.from(pointers.current.values());
        const p1 = values[0] as { x: number; y: number };
        const p2 = values[1] as { x: number; y: number };
        const newDist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        
        const scaleBy = newDist / pinchDist;
        const newZoom = Math.max(0.2, Math.min(5, view.zoom * scaleBy));
        
        // Simple zoom to center of screen for stability during pinch
        // (Improving this to zoom to centroid of pinch is better but complex for this snippet)
        setView(prev => ({ ...prev, zoom: newZoom }));
        setPinchDist(newDist);
        return;
    }

    // Handle Panning
    if (isPanning) {
        const dx = e.clientX - lastPanPoint.x;
        const dy = e.clientY - lastPanPoint.y;
        setView(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        setLastPanPoint({ x: e.clientX, y: e.clientY });
        return;
    }

    const pt = getCanvasCoordinates(e.clientX, e.clientY);
    setMousePos({ x: snapToGrid(pt.x), y: snapToGrid(pt.y) }); 

    if (isDraggingComponents) {
        const dx = pt.x - dragStartMouse.x;
        const dy = pt.y - dragStartMouse.y;
        const snapshot = dragStartSnapshot.current;
        if (snapshot) {
            setComponents(prev => prev.map(c => {
                if (selectedIds.has(c.id)) {
                    const original = snapshot.components.find(oc => oc.id === c.id);
                    if (original) {
                        return { ...c, x: snapToGrid(original.x + dx), y: snapToGrid(original.y + dy) };
                    }
                }
                return c;
            }));
        }
    } else if (selectionBox) {
        setSelectionBox(prev => prev ? { ...prev, end: pt } : null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    
    if (pointers.current.size < 2) setPinchDist(null);

    if (isPanning) {
        // If no pointers left, stop panning
        if (pointers.current.size === 0) setIsPanning(false);
        return;
    }

    if (isDraggingComponents && dragStartSnapshot.current) {
        const snapshot = dragStartSnapshot.current;
        const hasMoved = components.some(c => {
            const original = snapshot.components.find(oc => oc.id === c.id);
            return original && (original.x !== c.x || original.y !== c.y);
        });
        if (hasMoved) setHistory(prev => [...prev, snapshot]);
    }
    if (selectionBox) {
        const x1 = Math.min(selectionBox.start.x, selectionBox.end.x);
        const y1 = Math.min(selectionBox.start.y, selectionBox.end.y);
        const x2 = Math.max(selectionBox.start.x, selectionBox.end.x);
        const y2 = Math.max(selectionBox.start.y, selectionBox.end.y);
        const newSelection = new Set<string>();
        components.forEach(c => {
            if (c.x >= x1 && c.x <= x2 && c.y >= y1 && c.y <= y2) newSelection.add(c.id);
        });
        setSelectedIds(newSelection);
        setSelectionBox(null);
    }
    setIsDraggingComponents(false);
    dragStartSnapshot.current = null;
  };

  const deleteSelection = () => {
    if (selectedIds.size === 0) return;
    saveToHistory();
    const remainingComponents = components.filter(c => !selectedIds.has(c.id));
    const remainingWires = wires.filter(w => !selectedIds.has(w.fromCompId) && !selectedIds.has(w.toCompId) && !selectedIds.has(w.id));
    setComponents(remainingComponents);
    setWires(remainingWires);
    setSelectedIds(new Set());
  };

  const rotateSelection = () => {
    if (selectedIds.size === 0) return;
    saveToHistory();
    setComponents(prev => prev.map(c => {
        if (selectedIds.has(c.id)) return { ...c, rotation: (c.rotation + 90) % 360 };
        return c;
    }));
  };

  const zoomIn = () => setView(v => ({ ...v, zoom: Math.min(5, v.zoom * 1.2) }));
  const zoomOut = () => setView(v => ({ ...v, zoom: Math.max(0.2, v.zoom / 1.2) }));
  const resetView = () => setView({ x: 0, y: 0, zoom: 1 });

  // Called via gear icon
  const handleComponentEdit = (comp: ComponentData) => {
    setEditingResistorId(null);
    setEditingLEDId(null);
    setEditingCapacitorId(null);
    setEditingACSourceId(null);
    setEditingPotentiometerId(null);
    setEditingMultimeterId(null);
    setViewingIC555Id(null);

    if (comp.type === ComponentType.Resistor) {
        setEditingResistorId(comp.id);
    }
    else if (comp.type === ComponentType.LED) {
        setEditingLEDId(comp.id);
    }
    else if (comp.type === ComponentType.Capacitor) {
        setEditingCapacitorId(comp.id);
    }
    else if (comp.type === ComponentType.ACSource) {
        setEditingACSourceId(comp.id);
    }
    else if (comp.type === ComponentType.Potentiometer) {
        setEditingPotentiometerId(comp.id);
    }
    else if (comp.type === ComponentType.Multimeter) {
        setEditingMultimeterId(comp.id);
    }
    else if (comp.type === ComponentType.IC555) {
        setViewingIC555Id(comp.id);
    }
  };

  // Called via double click
  const handleComponentToggle = (comp: ComponentData) => {
    if (comp.type === ComponentType.Switch) {
        saveToHistory();
        setComponents(prev => prev.map(c => c.id === comp.id ? { ...c, properties: { ...c.properties, isOpen: !c.properties.isOpen }} : c));
    } else if (comp.type === ComponentType.LED) {
        if (!isSimulating) {
            saveToHistory();
            setComponents(prev => prev.map(c => c.id === comp.id ? { ...c, properties: { ...c.properties, isOn: !c.properties.isOn }} : c));
        }
    } 
    // Quick toggle for Multimeter mode via double click
    else if (comp.type === ComponentType.Multimeter) {
        saveToHistory();
        setComponents(prev => prev.map(c => {
            if (c.id === comp.id) {
                const modes = ['OFF', 'V', 'OHM', 'A'];
                const nextMode = modes[(modes.indexOf(c.properties.mode || 'OFF') + 1) % modes.length];
                return { ...c, properties: { ...c.properties, mode: nextMode }};
            }
            return c;
        }));
    }
  };
  
  const handleMultimeterModeChange = (id: string, mode: string) => {
      saveToHistory();
      setComponents(prev => prev.map(c => {
          if (c.id === id) {
              const currentMode = c.properties.mode;
              const nextMode = currentMode === mode ? 'OFF' : mode;
              return { ...c, properties: { ...c.properties, mode: nextMode } };
          }
          return c;
      }));
  };

  const handleMultimeterSizeChange = (size: 'standard' | 'large') => {
      if (!editingMultimeterId) return;
      saveToHistory();
      setComponents(prev => prev.map(c => c.id === editingMultimeterId ? { ...c, properties: { ...c.properties, size } } : c));
  };

  const handleResistorEdit = (newBands: ResistorBandColor[]) => {
    if (!editingResistorId) return;
    saveToHistory();
    setComponents(prev => prev.map(c => c.id === editingResistorId ? { ...c, properties: { ...c.properties, bands: newBands } } : c));
  };

  const handleLEDEdit = (newColor: string) => {
    if (!editingLEDId) return;
    saveToHistory();
    setComponents(prev => prev.map(c => c.id === editingLEDId ? { ...c, properties: { ...c.properties, color: newColor } } : c));
  };

  const handleCapacitorEdit = (newCap: number, isElectrolytic: boolean) => {
    if (!editingCapacitorId) return;
    saveToHistory();
    setComponents(prev => prev.map(c => c.id === editingCapacitorId ? { ...c, properties: { ...c.properties, capacitance: newCap, isElectrolytic } } : c));
  };
  
  const handleACSourceEdit = (voltage: number, frequency: number) => {
    if (!editingACSourceId) return;
    saveToHistory();
    setComponents(prev => prev.map(c => c.id === editingACSourceId ? { ...c, properties: { ...c.properties, peakVoltage: voltage, frequency } } : c));
  };

  const handlePotentiometerEdit = (totalResistance: number, wiperPosition: number) => {
    if (!editingPotentiometerId) return;
    setComponents(prev => prev.map(c => c.id === editingPotentiometerId ? { ...c, properties: { ...c.properties, totalResistance, wiperPosition } } : c));
  };

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawingWire(null);
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); undo(); }
      if (e.key === 'Delete' || e.key === 'Backspace') deleteSelection();
      if (e.key === 'r' || e.key === 'R') rotateSelection();
      if (e.code === 'Space') setSpacePressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            setSpacePressed(false);
            if (!isDraggingComponents) setIsPanning(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedIds, history, components, wires, isDraggingComponents]);

  // AI
  const askAI = async () => {
      if (!aiQuery.trim()) return;
      setIsAiLoading(true);
      try {
        const result = await analyzeCircuit(components, wires, aiQuery);
        setAiResponse(result.text);
        if (result.circuit) {
            saveToHistory();
            const idMap: Record<string, string> = {};
            const newComponents: ComponentData[] = result.circuit.components.map((c: any) => {
                const realId = generateId();
                idMap[c.id] = realId;
                return { id: realId, type: c.type, x: snapToGrid(c.x), y: snapToGrid(c.y), rotation: c.rotation || 0, properties: c.properties || {} };
            });
            const newWires: Wire[] = result.circuit.wires.map((w: any) => ({
                id: generateId(), fromCompId: idMap[w.fromCompId] || w.fromCompId, fromPinId: w.fromPinId, toCompId: idMap[w.toCompId] || w.toCompId, toPinId: w.toPinId
            }));
            setComponents(prev => [...prev, ...newComponents]);
            setWires(prev => [...prev, ...newWires]);
        }
      } catch (e) { setAiResponse("Error with AI Service"); }
      setIsAiLoading(false);
  };

  // Simulation
  const obstacleMap = useMemo(() => createObstacleMap(components), [components]);
  // We identify nets even if sim is stopped, but wire coloring depends on isSimulating flag logic in render
  const wireNetStatus = useMemo(() => isSimulating ? identifyWireNets(components, wires, supplyVoltage) : {}, [components, wires, isSimulating, supplyVoltage]);
  
  // Calculate currents if simulating (separate hook to avoid deep dependencies in render)
  const currentMap = useMemo(() => {
     if (isSimulating) {
         const { currents } = solveCircuit(components, wires, supplyVoltage);
         return currents;
     }
     return new Map<string, number>();
  }, [isSimulating, components, wires, supplyVoltage]);

  // --- SAFETY CHECK EFFECT ---
  useEffect(() => {
      if (!isSimulating) return;

      // 1. Check for Short Circuit
      const shortType = detectShortCircuit(components, wires);
      if (shortType) {
          setIsSimulating(false);
          playSafetyAlertSound();
          setSafetyAlert({
              title: t.safetyAlert.shortCircuit,
              message: t.safetyAlert.shortCircuitMsg
          });
          return;
      }

      // 2. Check for Ohmmeter on Live Circuit
      const hasDangerousOhmMeter = components.some(c => c.type === ComponentType.Multimeter && c.properties.mode === 'OHM');
      if (hasDangerousOhmMeter) {
          setIsSimulating(false);
          playSafetyAlertSound();
          setSafetyAlert({
              title: t.safetyAlert.ohmError,
              message: t.safetyAlert.ohmErrorMsg
          });
          return;
      }

  }, [isSimulating, components, wires, playSafetyAlertSound, t]);

  useEffect(() => {
    const getPinNetInfo = (compId: string, pinId: string) => {
        const wire = wires.find(w => (w.fromCompId === compId && w.fromPinId === pinId) || (w.toCompId === compId && w.toPinId === pinId));
        return wire ? wireNetStatus[wire.id] : null;
    };

    let changes = false;
    const nextComps = components.map(c => {
        // LED Physics Simulation (Only when simulating)
        if (isSimulating && c.type === ComponentType.LED) {
            const anode = getPinNetInfo(c.id, 'anode');
            const cathode = getPinNetInfo(c.id, 'cathode');
            
            let isOn = false;
            let brightness = 0;

            if (anode && cathode) {
                 const vDiff = anode.voltage - cathode.voltage;
                 const color = c.properties.color || 'red';
                 
                 // Approximate forward voltages, allowed to light up slightly before full breakdown for visual feedback
                 const vDrop = ['blue', 'green', 'white'].includes(color) ? 2.5 : 1.5; 
                 
                 if (vDiff > vDrop) {
                     isOn = true;
                     // In the solver, we modeled LED as 100 Ohm resistor for simplicity.
                     // Current = V / R. Max brightness at ~20mA.
                     const current = vDiff / 100;
                     brightness = Math.min(1, current / 0.02);
                     
                     // Minimal brightness if ON
                     if (brightness < 0.2) brightness = 0.2;
                 }
            }

            if (!!c.properties.isOn !== isOn || Math.abs((c.properties.brightness || 0) - brightness) > 0.05) {
                changes = true; 
                return {...c, properties: {...c.properties, isOn, brightness}}; 
            }
        }
        else if (!isSimulating && c.type === ComponentType.LED) {
            // Reset LED state when sim stops
            if (c.properties.isOn || c.properties.brightness > 0) {
                changes = true;
                return {...c, properties: {...c.properties, isOn: false, brightness: 0}};
            }
        }
        
        // IC555 Simulation Logic
        if (isSimulating && c.type === ComponentType.IC555) {
            const vcc = getPinNetInfo(c.id, 'vcc')?.voltage || 0;
            const gnd = getPinNetInfo(c.id, 'gnd')?.voltage || 0;
            const trig = getPinNetInfo(c.id, 'trig')?.voltage || 0;
            const thr = getPinNetInfo(c.id, 'thr')?.voltage || 0;
            const rst = getPinNetInfo(c.id, 'rst')?.voltage || vcc; // Float high usually, but for sim we default to safe if unconnected

            const vSupply = vcc - gnd;
            // Need supply to operate
            if (vSupply > 1) {
                const vTrig = trig - gnd;
                const vThr = thr - gnd;
                const vRst = rst - gnd;
                
                let nextOutputHigh = c.properties.outputHigh;

                // Reset logic (Active Low)
                if (vRst < 0.5) {
                    nextOutputHigh = false;
                } else {
                    // Comparator Logic
                    // Trigger < 1/3 VCC -> SET (Output High)
                    if (vTrig < vSupply / 3) {
                        nextOutputHigh = true;
                    }
                    // Threshold > 2/3 VCC -> RESET (Output Low)
                    else if (vThr > (vSupply * 2) / 3) {
                        nextOutputHigh = false;
                    }
                }
                
                if (c.properties.outputHigh !== nextOutputHigh) {
                    changes = true;
                    return { ...c, properties: { ...c.properties, outputHigh: nextOutputHigh } };
                }
            }
        }

        // Multimeter Simulation
        if (c.type === ComponentType.Multimeter) {
             let val = '---';

             if (c.properties.mode === 'V') {
                 // Voltage measurement requires simulation to be active to see source voltages
                 if (isSimulating) {
                     const red = getPinNetInfo(c.id, 'red');
                     const black = getPinNetInfo(c.id, 'black');
                     let vVal = '0.00V';
                     
                     // Use the MNA solver voltages if available (better accuracy)
                     if (red?.voltage !== undefined && black?.voltage !== undefined) {
                         vVal = (red.voltage - black.voltage).toFixed(2) + 'V';
                     }
                     val = vVal;
                 } else {
                     val = '---';
                 }
             } else if (c.properties.mode === 'OHM') {
                 // Ohmmeter works independently of simulation state
                 const r = measureResistance(components, wires, { compId: c.id, pinId: 'red' }, { compId: c.id, pinId: 'black' });
                 val = formatResistance(r);
             } else if (c.properties.mode === 'A') {
                 // Ammeter
                 if (isSimulating) {
                    const current = currentMap.get(c.id) || 0;
                    // Current comes out of positive node in our solver convention usually, or we take abs
                    val = formatCurrent(current);
                 } else {
                     val = '---';
                 }
             }

             if (c.properties.displayValue !== val) { changes = true; return {...c, properties: {...c.properties, displayValue: val}}; }
        }
        return c;
    });
    
    if (changes) setComponents(nextComps);
  }, [isSimulating, wireNetStatus, wires, supplyVoltage, components, currentMap]); 

  // Render Definitions
  const renderDefs = () => (
    <>
        <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <circle cx={1} cy={1} r={1} fill={isDark ? "#334155" : "#cbd5e1"} />
        </pattern>
        <filter id="led-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="led-glow-strong" x="-150%" y="-150%" width="400%" height="400%">
             <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
             <feComposite in="blur" in2="SourceGraphic" operator="over" />
        </filter>
    </>
  );

  const renderedWires = useMemo(() => {
    const animSpeed = Math.max(0.2, 10 / Math.max(0.1, supplyVoltage)); 
    return wires.map(wire => {
        const fromComp = components.find(c => c.id === wire.fromCompId);
        const toComp = components.find(c => c.id === wire.toCompId);
        if (!fromComp || !toComp) return null;
        
        const p1 = getPinAbsolutePosition(fromComp, wire.fromPinId);
        const p2 = getPinAbsolutePosition(toComp, wire.toPinId);
        
        let pathData = "";
        const attachedComponentDragged = selectedIds.has(fromComp.id) || selectedIds.has(toComp.id);
        
        if (isDraggingComponents && attachedComponentDragged) {
             const midX = (p1.x + p2.x) / 2;
             pathData = `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`;
        } else {
             // Pass waypoints to getWirePath
             pathData = getWirePath(p1, p2, obstacleMap, wire.waypoints);
        }

        const isSelected = selectedIds.has(wire.id); 
        const status = wireNetStatus[wire.id]?.status;
        let flowColor = '#fbbf24'; 
        if (status === 'positive') flowColor = '#ef4444'; 
        if (status === 'ground') flowColor = '#8B4513'; 

        const wireBaseColor = isDark ? (isSimulating ? '#4ade80' : '#94a3b8') : (isSimulating ? '#16a34a' : '#475569');

        return (
            <g key={wire.id} onPointerDown={(e) => { e.stopPropagation(); setSelectedIds(new Set(e.shiftKey ? [...selectedIds, wire.id] : [wire.id])); }} className="cursor-pointer group">
                <path d={pathData} stroke="transparent" strokeWidth="15" fill="none" />
                <path d={pathData} stroke={isSelected ? '#3b82f6' : wireBaseColor} strokeWidth={isSelected ? "4" : "3"} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {isSimulating && <path d={pathData} stroke={flowColor} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10, 10" className="animate-flow opacity-80 pointer-events-none" style={{ animationDuration: `${animSpeed}s` }} />}
            </g>
        );
    });
  }, [wires, components, obstacleMap, isSimulating, isDraggingComponents, selectedIds, wireNetStatus, supplyVoltage, isDark]);

  return (
    <div className={`flex h-screen flex-col font-sans transition-colors duration-300 ${isDark ? 'bg-lab-dark text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header */}
      <div className={`h-14 border-b flex items-center justify-between px-6 z-20 select-none ${isDark ? 'bg-lab-panel border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold ${isDark ? 'bg-lab-accent text-black' : 'bg-blue-600 text-white'}`}>EL</div>
            <h1 className="text-xl font-bold tracking-tight">{t.title}</h1>
        </div>
        
        <div className="flex space-x-2 items-center">
             {/* Interaction Mode Toggles (Mobile/Tablet Support) */}
             <div className="flex bg-slate-800 rounded p-1 mr-2 border border-slate-700">
                <button 
                    onClick={() => setInteractionMode('select')}
                    className={`p-1.5 rounded transition-colors ${interactionMode === 'select' ? 'bg-lab-accent text-black' : 'text-slate-400 hover:text-white'}`}
                    title="Selection Mode"
                >
                    <MousePointer2 size={18} />
                </button>
                <button 
                    onClick={() => setInteractionMode('pan')}
                    className={`p-1.5 rounded transition-colors ${interactionMode === 'pan' ? 'bg-lab-accent text-black' : 'text-slate-400 hover:text-white'}`}
                    title="Pan Mode (Drag to move)"
                >
                    <Hand size={18} />
                </button>
            </div>

            {/* Lang Toggle */}
            <button onClick={() => setLang(l => l === 'en' ? 'es' : 'en')} className={`p-2 rounded hover:bg-black/10 flex items-center gap-1 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <Globe size={16}/> {lang.toUpperCase()}
            </button>
            {/* Theme Toggle */}
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className={`p-2 rounded hover:bg-black/10 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {isDark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>

            <div className={`w-px h-6 mx-2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>

            <div className="relative">
                <button 
                    onClick={() => setPresetsMenuOpen(!presetsMenuOpen)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
                >
                    <BookOpen size={16} /> <span className="text-sm font-medium">{t.presets}</span> <ChevronDown size={14} />
                </button>
                {presetsMenuOpen && (
                    <>
                    <div className="fixed inset-0 z-40" onClick={() => setPresetsMenuOpen(false)} />
                    <div className={`absolute top-full left-0 mt-2 w-64 border rounded-lg shadow-xl z-50 overflow-hidden ${isDark ? 'bg-lab-panel border-slate-600' : 'bg-white border-slate-200'}`}>
                        <div className={`p-2 border-b text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>{t.loadCircuit}</div>
                        <div className="max-h-[70vh] overflow-y-auto">
                            {PRESETS.map((preset) => (
                                <button key={preset.id} onClick={() => loadPreset(preset)} className={`w-full text-left px-4 py-3 border-b last:border-0 transition-colors ${isDark ? 'hover:bg-slate-700 border-slate-700/50 text-slate-200' : 'hover:bg-slate-50 border-slate-100 text-slate-700'}`}>
                                    <div className="text-sm font-medium">{preset.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                    </>
                )}
            </div>

            <div className={`w-px h-6 mx-2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            
            <button onClick={() => setShowLabels(!showLabels)} className={`p-2 ${showLabels ? (isDark ? 'text-lab-accent' : 'text-blue-600') : 'text-slate-400'}`} title="Toggle Labels">
                {showLabels ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>

            {/* Zoom Controls */}
            <button onClick={zoomOut} className="p-2 text-slate-400 hover:text-white"><ZoomOut size={18} /></button>
            <button onClick={zoomIn} className="p-2 text-slate-400 hover:text-white"><ZoomIn size={18} /></button>
            <button onClick={resetView} className="p-2 text-slate-400 hover:text-white" title="Reset View"><Move size={18} /></button>

            <div className={`w-px h-6 mx-2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>

            <button onClick={() => setShowInfoPanel(!showInfoPanel)} className={`p-2 ${showInfoPanel ? (isDark ? 'text-lab-accent' : 'text-blue-600') : 'text-slate-400'}`}><Info size={18} /></button>
            <button onClick={undo} disabled={history.length === 0} className="p-2 disabled:opacity-30"><span className="font-bold text-lg">↶</span></button>
            <button onClick={rotateSelection} disabled={selectedIds.size === 0} className="p-2 disabled:opacity-30"><RotateCw size={18} /></button>
            <button onClick={deleteSelection} disabled={selectedIds.size === 0} className="p-2 text-red-400 hover:text-red-500 disabled:opacity-30"><Trash2 size={18} /></button>
            
            <div className={`w-px h-6 mx-2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            
            <button 
                onClick={() => setAiPanelOpen(!aiPanelOpen)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-all ${aiPanelOpen ? (isDark ? 'bg-lab-accent text-black border-transparent' : 'bg-blue-600 text-white border-transparent') : (isDark ? 'border-slate-600 text-slate-300' : 'border-slate-300 text-slate-600')}`}
            >
                <Bot size={18} /> <span className="text-sm font-medium">{t.aiTutor}</span>
            </button>
        </div>
      </div>

      {selectedIds.size === 1 && showInfoPanel && <ComponentInfoPanel type={components.find(c => c.id === Array.from(selectedIds)[0])?.type as ComponentType} onClose={() => setShowInfoPanel(false)} />}

      <div className="flex-1 flex overflow-hidden relative">
        <Toolbox onAdd={addComponent} theme={theme} lang={lang} />

        <div className={`flex-1 relative cursor-crosshair overflow-hidden touch-none ${isDark ? 'bg-lab-dark' : 'bg-slate-50'}`}>
          <svg 
            ref={canvasRef} 
            className={`w-full h-full block ${isDark ? 'text-white' : 'text-slate-900'} ${isPanning || interactionMode === 'pan' ? 'cursor-grab active:cursor-grabbing' : ''}`} 
            onPointerDown={handlePointerDown} 
            onPointerMove={handlePointerMove} 
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onWheel={handleWheel}
          >
            <defs>{renderDefs()}</defs>
            
            {/* Viewport Transform Group */}
            <g transform={`translate(${view.x},${view.y}) scale(${view.zoom})`}>
                {/* Infinite Grid Background inside the transform */}
                <rect x={-50000} y={-50000} width={100000} height={100000} fill="url(#grid)" />
                
                {renderedWires}
                {drawingWire && (
                    // Draw manual path + current cursor line
                    <path 
                        d={generatePathData(drawingWire.startPt, mousePos, drawingWire.waypoints)} 
                        stroke="#38bdf8" 
                        strokeWidth="2" 
                        fill="none" 
                        strokeDasharray="5 5" 
                    />
                )}
                {sortedComponents.map(comp => (
                    <g 
                        key={comp.id} 
                        onDoubleClick={(e) => { 
                            e.stopPropagation(); 
                            if (!isSimulating && (comp.type === ComponentType.Switch || comp.type === ComponentType.LED)) {
                                handleComponentToggle(comp); 
                            } else if (comp.type === ComponentType.Multimeter) {
                                handleComponentToggle(comp);
                            }
                        }}
                    >
                        <ComponentRenderer 
                            component={comp} 
                            isSelected={selectedIds.has(comp.id)} 
                            onEdit={() => handleComponentEdit(comp)} 
                            onModeChange={(mode) => handleMultimeterModeChange(comp.id, mode)}
                            showLabels={showLabels}
                        />
                        {comp.type === ComponentType.Multimeter && <g></g>} {/* Handled inside renderer */}
                    </g>
                ))}
                {selectionBox && <rect x={Math.min(selectionBox.start.x, selectionBox.end.x)} y={Math.min(selectionBox.start.y, selectionBox.end.y)} width={Math.abs(selectionBox.end.x - selectionBox.start.x)} height={Math.abs(selectionBox.end.y - selectionBox.start.y)} fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" />}
            </g>
          </svg>
          
          {/* Zoom/Pan Hint Overlay (Transient) */}
          <div className="absolute bottom-4 left-4 pointer-events-none text-xs text-slate-500 bg-black/20 p-2 rounded backdrop-blur-sm">
              Zoom: {(view.zoom * 100).toFixed(0)}% <br/>
              Pan: Space + Drag or Hand Tool
          </div>

          {editingResistorId && <ResistorEditor bands={components.find(c => c.id === editingResistorId)?.properties.bands || []} onChange={handleResistorEdit} onClose={() => setEditingResistorId(null)} value={formatResistance(calculateResistance(components.find(c => c.id === editingResistorId)?.properties.bands || []))} />}

          {editingLEDId && <LEDEditor color={components.find(c => c.id === editingLEDId)?.properties.color || 'red'} onChange={handleLEDEdit} onClose={() => setEditingLEDId(null)} lang={lang} />}
          
          {editingCapacitorId && <CapacitorEditor capacitance={components.find(c => c.id === editingCapacitorId)?.properties.capacitance || 10} isElectrolytic={!!components.find(c => c.id === editingCapacitorId)?.properties.isElectrolytic} onChange={handleCapacitorEdit} onClose={() => setEditingCapacitorId(null)} lang={lang} />}

          {editingACSourceId && <ACSourceEditor voltage={components.find(c => c.id === editingACSourceId)?.properties.peakVoltage || 220} frequency={components.find(c => c.id === editingACSourceId)?.properties.frequency || 60} onChange={handleACSourceEdit} onClose={() => setEditingACSourceId(null)} lang={lang} />}

          {editingPotentiometerId && <PotentiometerEditor totalResistance={components.find(c => c.id === editingPotentiometerId)?.properties.totalResistance || 10000} wiperPosition={components.find(c => c.id === editingPotentiometerId)?.properties.wiperPosition ?? 50} onChange={handlePotentiometerEdit} onClose={() => setEditingPotentiometerId(null)} lang={lang} />}

          {editingMultimeterId && <MultimeterEditor size={components.find(c => c.id === editingMultimeterId)?.properties.size || 'standard'} onChange={handleMultimeterSizeChange} onClose={() => setEditingMultimeterId(null)} lang={lang} />}
          
          {viewingIC555Id && <IC555Pinout onClose={() => setViewingIC555Id(null)} lang={lang} />}

          {/* Preset Explanation Modal */}
          {presetInfo && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
                  <div className={`w-[500px] p-0 rounded-lg shadow-2xl overflow-hidden border ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'}`}>
                      <div className={`px-6 py-4 flex justify-between items-start border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                          <div>
                              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{presetInfo.title}</h2>
                              <span className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-lab-accent' : 'text-blue-600'}`}>Circuit Guide</span>
                          </div>
                          <button onClick={() => setPresetInfo(null)} className="text-slate-500 hover:text-red-500 transition-colors">
                              <X size={24} />
                          </button>
                      </div>
                      <div className="p-6">
                          <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {presetInfo.description}
                          </p>
                          <div className={`mt-6 p-4 rounded-md text-sm border-l-4 ${isDark ? 'bg-blue-900/20 border-blue-500 text-blue-200' : 'bg-blue-50 border-blue-500 text-blue-800'}`}>
                              <strong>Tip:</strong> Double click switches to toggle them. Hover over components to see values.
                          </div>
                          <button 
                              onClick={() => setPresetInfo(null)}
                              className={`mt-6 w-full py-2 rounded-md font-bold transition-colors ${isDark ? 'bg-lab-accent text-black hover:bg-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                          >
                              Start Experimenting
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {aiPanelOpen && (
              <div className={`absolute top-0 right-0 h-full w-80 border-l shadow-2xl z-40 flex flex-col p-4 animate-slide-in ${isDark ? 'bg-lab-panel border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                      <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}><Bot size={20} className={isDark ? "text-lab-accent" : "text-blue-600"}/> {t.aiTutor}</h3>
                      <button onClick={() => setAiPanelOpen(false)} className="text-slate-500 hover:opacity-75">&times;</button>
                  </div>
                  <div className={`flex-1 rounded-lg p-3 overflow-y-auto mb-4 text-sm whitespace-pre-wrap ${isDark ? 'bg-slate-800/50 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                      {aiResponse || "Hello! Build your circuit..."}
                  </div>
                  <div className="flex gap-2">
                      <input className={`flex-1 border rounded px-3 py-2 text-sm focus:outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'}`} placeholder="Ask AI..." value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && askAI()} />
                      <button onClick={askAI} disabled={isAiLoading} className={`p-2 rounded disabled:opacity-50 ${isDark ? 'bg-lab-accent text-black' : 'bg-blue-600 text-white'}`}>
                          {isAiLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <MessageSquare size={18} />}
                      </button>
                  </div>
              </div>
          )}
        </div>
        
        {/* Safety Alert Modal */}
        {safetyAlert && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className={`w-96 p-6 rounded-lg shadow-2xl border-2 transform scale-100 ${isDark ? 'bg-slate-800 border-red-500 text-white' : 'bg-white border-red-600 text-slate-900'}`}>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 bg-red-500/10 rounded-full text-red-500 animate-pulse">
                            <TriangleAlert size={48} />
                        </div>
                        <h2 className="text-xl font-bold text-red-500 uppercase tracking-widest">{safetyAlert.title}</h2>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {safetyAlert.message}
                        </p>
                        <button 
                            onClick={() => setSafetyAlert(null)}
                            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors w-full"
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>

      <Instruments voltage={supplyVoltage} setVoltage={setSupplyVoltage} isSimulating={isSimulating} toggleSimulation={() => setIsSimulating(!isSimulating)} onAddMultimeter={() => addComponent(ComponentType.Multimeter)} theme={theme} lang={lang} />
    </div>
  );
}
