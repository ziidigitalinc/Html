import React, { useState, useMemo, useEffect } from 'react';
import { SelectedElementInfo } from '../types';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Clock,
  Sparkles,
  Sliders,
  Flame,
  ArrowRight,
  Activity,
  Layers,
  Eye
} from 'lucide-react';
import {
  parseTransition,
  formatTransition,
  parseAnimation,
  formatAnimation,
  TRANSITION_PROPERTY_PRESETS,
  EASING_PRESETS,
  DURATION_PRESETS,
  DELAY_PRESETS,
  COMPLETE_TRANSITION_RECIPES,
  ANIMATION_PRESETS,
  ParsedTransition,
  ParsedAnimation
} from '../utils/styleHelpers';

interface TransitionStudioProps {
  selectedElement: SelectedElementInfo;
  onUpdateStyle: (property: string, value: string) => void;
  onUpdateHoverStyle?: (property: string, value: string) => void;
  activeStateTab?: 'normal' | 'hover';
}

export const TransitionStudio: React.FC<TransitionStudioProps> = ({
  selectedElement,
  onUpdateStyle,
  onUpdateHoverStyle,
  activeStateTab = 'normal',
}) => {
  const [activeTab, setActiveTab] = useState<'transitions' | 'animations' | 'recipes'>('transitions');
  const [copied, setCopied] = useState<boolean>(false);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [customBezierMode, setCustomBezierMode] = useState<boolean>(false);

  // Custom bezier points
  const [bezierP1, setBezierP1] = useState<number>(0.4);
  const [bezierP2, setBezierP2] = useState<number>(0.0);
  const [bezierP3, setBezierP3] = useState<number>(0.2);
  const [bezierP4, setBezierP4] = useState<number>(1.0);

  const styles = selectedElement.inlineStyles || {};

  // Current transition parsed from element style
  const currentTransition = useMemo(() => {
    return parseTransition(styles['transition']);
  }, [styles['transition']]);

  // Current animation parsed from element style
  const currentAnimation = useMemo(() => {
    return parseAnimation(styles['animation']);
  }, [styles['animation']]);

  // Sync bezier points if current timing function is a cubic bezier
  useEffect(() => {
    const fn = currentTransition.timingFunction;
    const match = fn.match(/cubic-bezier\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)/i);
    if (match) {
      setBezierP1(parseFloat(match[1]));
      setBezierP2(parseFloat(match[2]));
      setBezierP3(parseFloat(match[3]));
      setBezierP4(parseFloat(match[4]));
    }
  }, [currentTransition.timingFunction]);

  // Helper to commit transition update
  const updateTransition = (updater: (prev: ParsedTransition) => ParsedTransition) => {
    const updated = updater(currentTransition);
    const formatted = formatTransition(updated);
    onUpdateStyle('transition', formatted);
  };

  // Helper to commit animation update
  const updateAnimation = (updater: (prev: ParsedAnimation) => ParsedAnimation) => {
    const updated = updater(currentAnimation);
    const formatted = formatAnimation(updated);
    onUpdateStyle('animation', formatted);
  };

  // Copy CSS string
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Trigger test animation on canvas & preview box
  const handleTriggerTest = () => {
    setIsTestActive(true);
    // Send message to canvas iframe
    window.postMessage({
      type: 'TEST_ELEMENT_TRANSITION',
      selector: selectedElement.selector,
    }, '*');

    const totalTime = currentTransition.durationMs + currentTransition.delayMs + 700;
    setTimeout(() => {
      setIsTestActive(false);
    }, totalTime);
  };

  // Render SVG Cubic Bezier Curve visualization
  const renderBezierCurve = (p1: number, p2: number, p3: number, p4: number) => {
    // Normalizing coordinates inside a 100x60 viewBox with 10px margin
    const w = 120;
    const h = 54;
    const padding = 8;
    const startX = padding;
    const startY = h - padding;
    const endX = w - padding;
    const endY = padding;

    const spanX = endX - startX;
    const spanY = startY - endY;

    // Clamp coordinates for SVG drawing
    const cp1x = startX + Math.max(0, Math.min(1, p1)) * spanX;
    const cp1y = startY - Math.max(-0.5, Math.min(1.5, p2)) * spanY;
    const cp2x = startX + Math.max(0, Math.min(1, p3)) * spanX;
    const cp2y = startY - Math.max(-0.5, Math.min(1.5, p4)) * spanY;

    const pathD = `M ${startX},${startY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14 bg-stone-900 rounded-lg overflow-hidden select-none">
        {/* Subtle grid lines */}
        <line x1={startX} y1={startY} x2={endX} y2={startY} stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
        <line x1={startX} y1={endY} x2={endX} y2={endY} stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
        <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#475569" strokeWidth="0.8" strokeDasharray="3 3" />

        {/* Control Handle 1 */}
        <line x1={startX} y1={startY} x2={cp1x} y2={cp1y} stroke="#818cf8" strokeWidth="1" />
        <circle cx={cp1x} cy={cp1y} r="2.5" fill="#818cf8" />

        {/* Control Handle 2 */}
        <line x1={endX} y1={endY} x2={cp2x} y2={cp2y} stroke="#c084fc" strokeWidth="1" />
        <circle cx={cp2x} cy={cp2y} r="2.5" fill="#c084fc" />

        {/* The Bezier Curve */}
        <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

        {/* Origin and End points */}
        <circle cx={startX} cy={startY} r="3" fill="#38bdf8" />
        <circle cx={endX} cy={endY} r="3" fill="#38bdf8" />
      </svg>
    );
  };

  const activeEasingObj = EASING_PRESETS.find((e) => e.value === currentTransition.timingFunction);

  return (
    <div id="transition-animation-studio" className="space-y-4">
      {/* Tab Switcher */}
      <div className="grid grid-cols-3 p-1 bg-stone-100 rounded-lg border border-stone-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('transitions')}
          className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'transitions'
              ? 'bg-white text-indigo-700 shadow-2xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Transitions</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('animations')}
          className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'animations'
              ? 'bg-white text-indigo-700 shadow-2xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Keyframes</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('recipes')}
          className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'recipes'
              ? 'bg-white text-indigo-700 shadow-2xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Recipes</span>
        </button>
      </div>

      {/* ========================================================
          LIVE INTERACTIVE PLAYGROUND & TEST TRIGGER
         ======================================================== */}
      <div className="p-3 bg-gradient-to-b from-stone-50 to-stone-100/70 rounded-xl border border-stone-200/80 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-800 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Motion Test</span>
          </span>
          <span className="text-[10px] font-mono text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200">
            {activeTab === 'animations' && currentAnimation.name !== 'none'
              ? `${currentAnimation.name} (${currentAnimation.durationS}s)`
              : `${currentTransition.durationMs}ms · ${currentTransition.delayMs}ms delay`}
          </span>
        </div>

        {/* Live Motion Preview Canvas */}
        <div className="h-20 bg-white rounded-lg border border-stone-200/80 flex items-center justify-center relative overflow-hidden">
          {/* Subtle background reference grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:12px_12px] opacity-70 pointer-events-none" />

          {activeTab === 'animations' && currentAnimation.name !== 'none' ? (
            <div
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-md select-none"
              style={{
                animation: formatAnimation(currentAnimation),
              }}
            >
              <span>{currentAnimation.name}</span>
            </div>
          ) : (
            <div
              className={`px-4 py-2 rounded-lg text-xs font-bold select-none cursor-pointer border ${
                isTestActive
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xl -translate-y-2 scale-105'
                  : 'bg-white text-stone-800 border-stone-300 shadow-sm translate-y-0 scale-100 hover:bg-stone-50'
              }`}
              style={{
                transition: formatTransition(currentTransition),
              }}
              onClick={handleTriggerTest}
              title="Click to test transition"
            >
              <span className="flex items-center gap-1.5">
                <Zap className={`w-3 h-3 ${isTestActive ? 'text-amber-300' : 'text-indigo-600'}`} />
                <span>{isTestActive ? 'Transitioning...' : 'Click or Test'}</span>
              </span>
            </div>
          )}
        </div>

        {/* Trigger Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerTest}
            disabled={isTestActive}
            className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Test Transition</span>
          </button>
          <button
            type="button"
            onClick={() => {
              window.postMessage({
                type: 'TEST_ELEMENT_TRANSITION',
                selector: selectedElement.selector,
              }, '*');
            }}
            className="py-1.5 px-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
            title="Trigger transition directly on the canvas element"
          >
            <Eye className="w-3 h-3 text-indigo-600" />
            <span>On Canvas</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: CSS TRANSITIONS (EASING, DURATION, DELAY)
         ======================================================== */}
      {activeTab === 'transitions' && (
        <div className="space-y-4">
          
          {/* Target Property Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-800">Target Property</label>
              <span className="text-[10px] text-stone-400 font-mono">transition-property</span>
            </div>
            <select
              value={currentTransition.property}
              onChange={(e) => updateTransition((prev) => ({ ...prev, property: e.target.value }))}
              className="w-full bg-white border border-stone-200 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-medium shadow-2xs mb-1.5"
            >
              {TRANSITION_PROPERTY_PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label} ({p.value})
                </option>
              ))}
            </select>
            {/* Direct property override */}
            <input
              type="text"
              value={currentTransition.property}
              onChange={(e) => updateTransition((prev) => ({ ...prev, property: e.target.value }))}
              placeholder="e.g. all or transform, opacity"
              className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-[11px] font-mono text-stone-700"
            />
          </div>

          {/* Duration Control */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-600" />
                <span>Duration</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="3000"
                  step="25"
                  value={currentTransition.durationMs}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    updateTransition((prev) => ({ ...prev, durationMs: val }));
                  }}
                  className="w-16 bg-white border border-stone-200 rounded px-1.5 py-0.5 text-xs font-mono text-right font-bold text-indigo-600"
                />
                <span className="text-xs font-mono text-stone-500">ms</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="2000"
              step="25"
              value={currentTransition.durationMs}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                updateTransition((prev) => ({ ...prev, durationMs: val }));
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />

            {/* Quick Duration Chips */}
            <div className="flex items-center justify-between gap-1 pt-1">
              {DURATION_PRESETS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => updateTransition((prev) => ({ ...prev, durationMs: d.value }))}
                  className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors ${
                    currentTransition.durationMs === d.value
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {d.text}
                </button>
              ))}
            </div>
          </div>

          {/* Timing Function / Easing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-indigo-600" />
                <span>Easing / Curve</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomBezierMode(!customBezierMode)}
                className="text-[10px] text-indigo-600 font-semibold hover:underline"
              >
                {customBezierMode ? 'Preset Curves' : 'Custom Bezier'}
              </button>
            </div>

            {/* Visual Bezier Curve SVG */}
            {activeEasingObj && !customBezierMode ? (
              renderBezierCurve(activeEasingObj.p1, activeEasingObj.p2, activeEasingObj.p3, activeEasingObj.p4)
            ) : (
              renderBezierCurve(bezierP1, bezierP2, bezierP3, bezierP4)
            )}

            {!customBezierMode ? (
              /* Preset Curve Selector Grid */
              <div className="space-y-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  {EASING_PRESETS.map((preset) => {
                    const isSelected = currentTransition.timingFunction === preset.value;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => updateTransition((prev) => ({ ...prev, timingFunction: preset.value }))}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-600 ring-1 ring-indigo-600'
                            : 'bg-white border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-bold ${isSelected ? 'text-indigo-900' : 'text-stone-800'}`}>
                            {preset.name}
                          </span>
                          {isSelected && <Check className="w-3 h-3 text-indigo-600" />}
                        </div>
                        <div className="text-[9px] text-stone-400 font-mono truncate mt-0.5">
                          {preset.value}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Custom Bezier Sliders */
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                <div className="text-[11px] font-bold text-stone-700">Cubic-Bezier Control Points</div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <div className="flex justify-between text-stone-500 mb-0.5">
                      <span>P1 (X1): {bezierP1.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={bezierP1}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setBezierP1(val);
                        updateTransition((prev) => ({
                          ...prev,
                          timingFunction: `cubic-bezier(${val}, ${bezierP2}, ${bezierP3}, ${bezierP4})`,
                        }));
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-stone-500 mb-0.5">
                      <span>P2 (Y1): {bezierP2.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-0.5"
                      max="1.5"
                      step="0.02"
                      value={bezierP2}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setBezierP2(val);
                        updateTransition((prev) => ({
                          ...prev,
                          timingFunction: `cubic-bezier(${bezierP1}, ${val}, ${bezierP3}, ${bezierP4})`,
                        }));
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-stone-500 mb-0.5">
                      <span>P3 (X2): {bezierP3.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={bezierP3}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setBezierP3(val);
                        updateTransition((prev) => ({
                          ...prev,
                          timingFunction: `cubic-bezier(${bezierP1}, ${bezierP2}, ${val}, ${bezierP4})`,
                        }));
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-stone-500 mb-0.5">
                      <span>P4 (Y2): {bezierP4.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-0.5"
                      max="1.5"
                      step="0.02"
                      value={bezierP4}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setBezierP4(val);
                        updateTransition((prev) => ({
                          ...prev,
                          timingFunction: `cubic-bezier(${bezierP1}, ${bezierP2}, ${bezierP3}, ${val})`,
                        }));
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Direct text input for timing function */}
                <input
                  type="text"
                  value={currentTransition.timingFunction}
                  onChange={(e) => updateTransition((prev) => ({ ...prev, timingFunction: e.target.value }))}
                  className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs font-mono text-stone-800"
                />
              </div>
            )}
          </div>

          {/* Delay Control */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-500" />
                <span>Delay</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="2000"
                  step="25"
                  value={currentTransition.delayMs}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    updateTransition((prev) => ({ ...prev, delayMs: val }));
                  }}
                  className="w-16 bg-white border border-stone-200 rounded px-1.5 py-0.5 text-xs font-mono text-right font-bold text-stone-700"
                />
                <span className="text-xs font-mono text-stone-500">ms</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="1000"
              step="25"
              value={currentTransition.delayMs}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                updateTransition((prev) => ({ ...prev, delayMs: val }));
              }}
              className="w-full accent-stone-600 cursor-pointer"
            />

            {/* Quick Delay Chips */}
            <div className="flex items-center justify-between gap-1 pt-1">
              {DELAY_PRESETS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => updateTransition((prev) => ({ ...prev, delayMs: d.value }))}
                  className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors ${
                    currentTransition.delayMs === d.value
                      ? 'bg-stone-800 text-white border-stone-800 font-bold'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {d.text}
                </button>
              ))}
            </div>
          </div>

          {/* Compiled CSS Output Box */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-stone-700">CSS Transition Code</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleCopy(`transition: ${formatTransition(currentTransition)};`)}
                  className="text-[10px] text-stone-600 hover:text-indigo-600 flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded transition-colors"
                >
                  {copied ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStyle('transition', 'none')}
                  className="text-[10px] text-rose-600 hover:text-rose-700 hover:underline px-1"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="p-2 bg-stone-900 text-emerald-400 font-mono text-[11px] rounded-lg border border-stone-800 break-all select-all">
              transition: {formatTransition(currentTransition)};
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: KEYFRAME ANIMATIONS (PULSE, FLOAT, BOUNCE, ETC.)
         ======================================================== */}
      {activeTab === 'animations' && (
        <div className="space-y-4">
          
          {/* Preset Animations */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              Animation Presets
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {ANIMATION_PRESETS.map((anim) => {
                const isSelected = currentAnimation.name === anim.value;
                return (
                  <button
                    key={anim.value}
                    type="button"
                    onClick={() => updateAnimation((prev) => ({ ...prev, name: anim.value }))}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-500 ring-1 ring-amber-500 font-bold'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] ${isSelected ? 'text-amber-900' : 'text-stone-800'}`}>
                        {anim.name}
                      </span>
                      {isSelected && <Check className="w-3 h-3 text-amber-600" />}
                    </div>
                    <div className="text-[9px] text-stone-400 truncate mt-0.5">
                      {anim.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {currentAnimation.name !== 'none' && (
            <>
              {/* Animation Duration */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800">Duration (Cycle Speed)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={currentAnimation.durationS}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 1;
                        updateAnimation((prev) => ({ ...prev, durationS: val }));
                      }}
                      className="w-16 bg-white border border-stone-200 rounded px-1.5 py-0.5 text-xs font-mono text-right font-bold text-amber-600"
                    />
                    <span className="text-xs font-mono text-stone-500">s</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0.2"
                  max="6"
                  step="0.1"
                  value={currentAnimation.durationS}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    updateAnimation((prev) => ({ ...prev, durationS: val }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />

                <div className="flex items-center justify-between gap-1 pt-0.5">
                  {[0.5, 1, 1.5, 2, 3, 4].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateAnimation((prev) => ({ ...prev, durationS: s }))}
                      className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors ${
                        currentAnimation.durationS === s
                          ? 'bg-amber-500 text-white border-amber-500 font-bold'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Timing & Direction */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Timing</label>
                  <select
                    value={currentAnimation.timingFunction}
                    onChange={(e) => updateAnimation((prev) => ({ ...prev, timingFunction: e.target.value }))}
                    className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs"
                  >
                    <option value="ease-in-out">ease-in-out</option>
                    <option value="ease">ease</option>
                    <option value="linear">linear</option>
                    <option value="ease-out">ease-out</option>
                    <option value="ease-in">ease-in</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Direction</label>
                  <select
                    value={currentAnimation.direction}
                    onChange={(e) => updateAnimation((prev) => ({ ...prev, direction: e.target.value }))}
                    className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs"
                  >
                    <option value="normal">normal</option>
                    <option value="alternate">alternate</option>
                    <option value="reverse">reverse</option>
                    <option value="alternate-reverse">alt-reverse</option>
                  </select>
                </div>
              </div>

              {/* Iteration & Play State */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Repeat (Loops)</label>
                  <select
                    value={currentAnimation.iterationCount}
                    onChange={(e) => updateAnimation((prev) => ({ ...prev, iterationCount: e.target.value }))}
                    className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs"
                  >
                    <option value="infinite">Infinite (Loop)</option>
                    <option value="1">1 Time</option>
                    <option value="2">2 Times</option>
                    <option value="3">3 Times</option>
                    <option value="5">5 Times</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">State</label>
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = currentAnimation.playState === 'running' ? 'paused' : 'running';
                      updateAnimation((prev) => ({ ...prev, playState: nextState }));
                      onUpdateStyle('animation-play-state', nextState);
                    }}
                    className={`w-full py-1 text-xs font-semibold rounded border flex items-center justify-center gap-1 transition-colors ${
                      currentAnimation.playState === 'running'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-amber-50 text-amber-700 border-amber-300'
                    }`}
                  >
                    {currentAnimation.playState === 'running' ? (
                      <>
                        <Pause className="w-3 h-3" />
                        <span>Running</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Paused</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Compiled CSS Animation Output */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-stone-700">CSS Animation Code</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(`animation: ${formatAnimation(currentAnimation)};`)}
                      className="text-[10px] text-stone-600 hover:text-amber-600 flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded transition-colors"
                    >
                      {copied ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateStyle('animation', 'none')}
                      className="text-[10px] text-rose-600 hover:text-rose-700 hover:underline px-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="p-2 bg-stone-900 text-amber-400 font-mono text-[11px] rounded-lg border border-stone-800 break-all select-all">
                  animation: {formatAnimation(currentAnimation)};
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: COMPLETE CURATED TRANSITION RECIPES
         ======================================================== */}
      {activeTab === 'recipes' && (
        <div className="space-y-2">
          <div className="text-xs text-stone-500 leading-relaxed mb-2">
            One-click designer combinations engineered for immediate interactive polish and 60fps responsiveness.
          </div>

          <div className="space-y-1.5">
            {COMPLETE_TRANSITION_RECIPES.map((recipe) => (
              <button
                key={recipe.name}
                type="button"
                onClick={() => onUpdateStyle('transition', recipe.value)}
                className="w-full p-2.5 bg-white hover:bg-stone-50 rounded-xl border border-stone-200 text-left transition-all hover:border-indigo-300 shadow-2xs group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
                    {recipe.name}
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {recipe.tag}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mb-1.5">
                  {recipe.description}
                </p>
                <div className="text-[10px] font-mono text-stone-600 bg-stone-50 px-2 py-1 rounded border border-stone-100 truncate">
                  transition: {recipe.value};
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
