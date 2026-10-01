import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CubicAnalysis, Point2D } from '../types';
import { evalCubic, evalDerivative, formatNumVi } from '../mathEngine';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Crosshair, Eye } from 'lucide-react';

interface CubicGraphProps {
  analysis: CubicAnalysis;
}

export const CubicGraph: React.FC<CubicGraphProps> = ({ analysis }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Viewport bounds in math coordinates
  const [viewBounds, setViewBounds] = useState({
    xMin: -5,
    xMax: 5,
    yMin: -6,
    yMax: 6
  });

  // Track logical CSS canvas size
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 600, height: 450 });

  // Display toggles
  const [showGrid, setShowGrid] = useState(true);
  const [showSpecialPoints, setShowSpecialPoints] = useState(true);
  const [showProjections, setShowProjections] = useState(true);
  const [showTangentAtI, setShowTangentAtI] = useState(true);

  // Mouse interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; canvasX: number; canvasY: number } | null>(null);

  // Calculate smart default bounds based on points of interest
  const getSmartBounds = useCallback((ana: CubicAnalysis) => {
    if (!ana.isValid) return { xMin: -5, xMax: 5, yMin: -6, yMax: 6 };

    const { coefficients: { a, b, c, d }, inflectionPoint, specialPoints } = ana;
    const xList = specialPoints.map(p => p.x);
    const yList = specialPoints.map(p => p.y);

    xList.push(inflectionPoint.x);
    yList.push(inflectionPoint.y);

    let minX = Math.min(...xList, -2);
    let maxX = Math.max(...xList, 2);
    let minY = Math.min(...yList, -2);
    let maxY = Math.max(...yList, 2);

    const xSpan = Math.max(maxX - minX, 4);
    const ySpan = Math.max(maxY - minY, 6);

    const padX = xSpan * 0.35;
    const padY = ySpan * 0.35;

    let resXMin = minX - padX;
    let resXMax = maxX + padX;
    let resYMin = minY - padY;
    let resYMax = maxY + padY;

    // Keep aspect reasonable
    const rangeX = resXMax - resXMin;
    const rangeY = resYMax - resYMin;
    if (rangeY > rangeX * 3) {
      resYMin = (minY + maxY) / 2 - rangeX * 1.5;
      resYMax = (minY + maxY) / 2 + rangeX * 1.5;
    }

    return {
      xMin: Math.floor(resXMin * 2) / 2,
      xMax: Math.ceil(resXMax * 2) / 2,
      yMin: Math.floor(resYMin * 2) / 2,
      yMax: Math.ceil(resYMax * 2) / 2
    };
  }, []);

  // Update bounds when coefficients change
  useEffect(() => {
    if (analysis.isValid) {
      setViewBounds(getSmartBounds(analysis));
    }
  }, [analysis, getSmartBounds]);

  // Coordinate conversions
  const toScreenX = (x: number, width: number) => {
    return ((x - viewBounds.xMin) / (viewBounds.xMax - viewBounds.xMin)) * width;
  };

  const toScreenY = (y: number, height: number) => {
    return height - ((y - viewBounds.yMin) / (viewBounds.yMax - viewBounds.yMin)) * height;
  };

  const toMathX = (screenX: number, width: number) => {
    return viewBounds.xMin + (screenX / width) * (viewBounds.xMax - viewBounds.xMin);
  };

  const toMathY = (screenY: number, height: number) => {
    return viewBounds.yMin + ((height - screenY) / height) * (viewBounds.yMax - viewBounds.yMin);
  };

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const width = canvasDimensions.width;
    const height = canvasDimensions.height;

    // Reset transform matrix and apply device pixel ratio scaling
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const { xMin, xMax, yMin, yMax } = viewBounds;
    const xSpan = xMax - xMin;
    const ySpan = yMax - yMin;

    // Choose grid step
    const getGridStep = (span: number) => {
      if (span <= 6) return 1;
      if (span <= 15) return 2;
      if (span <= 30) return 5;
      if (span <= 60) return 10;
      return 20;
    };

    const xStep = getGridStep(xSpan);
    const yStep = getGridStep(ySpan);

    // 1. Draw Grid Lines
    if (showGrid) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#f1f5f9'; // slate-100

      // Vertical grid
      const firstX = Math.ceil(xMin / xStep) * xStep;
      for (let x = firstX; x <= xMax; x += xStep) {
        if (Math.abs(x) < 1e-4) continue; // skip axis
        const sx = toScreenX(x, width);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
        ctx.stroke();
      }

      // Horizontal grid
      const firstY = Math.ceil(yMin / yStep) * yStep;
      for (let y = firstY; y <= yMax; y += yStep) {
        if (Math.abs(y) < 1e-4) continue; // skip axis
        const sy = toScreenY(y, height);
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(width, sy);
        ctx.stroke();
      }
    }

    // 2. Draw Coordinate Axes (Oxy)
    const originX = toScreenX(0, width);
    const originY = toScreenY(0, height);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#475569'; // slate-600

    // Ox axis
    if (originY >= -20 && originY <= height + 20) {
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.stroke();

      // Arrow head Ox
      ctx.beginPath();
      ctx.moveTo(width - 10, originY - 4);
      ctx.lineTo(width, originY);
      ctx.lineTo(width - 10, originY + 4);
      ctx.fillStyle = '#475569';
      ctx.fill();

      // Label x
      ctx.font = 'italic 13px serif';
      ctx.fillText('x', width - 15, originY - 8);
    }

    // Oy axis
    if (originX >= -20 && originX <= width + 20) {
      ctx.beginPath();
      ctx.moveTo(originX, height);
      ctx.lineTo(originX, 0);
      ctx.stroke();

      // Arrow head Oy
      ctx.beginPath();
      ctx.moveTo(originX - 4, 10);
      ctx.lineTo(originX, 0);
      ctx.lineTo(originX + 4, 10);
      ctx.fillStyle = '#475569';
      ctx.fill();

      // Label y
      ctx.font = 'italic 13px serif';
      ctx.fillText('y', originX + 8, 14);
    }

    // Origin label O(0; 0)
    if (originX >= 0 && originX <= width && originY >= 0 && originY <= height) {
      ctx.font = 'italic 12px serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('O', originX - 14, originY + 14);
    }

    // 3. Ticks and Numbers
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#64748b';

    // X Ticks
    const firstX = Math.ceil(xMin / xStep) * xStep;
    for (let x = firstX; x <= xMax; x += xStep) {
      if (Math.abs(x) < 1e-4) continue;
      const sx = toScreenX(x, width);
      const sy = Math.max(12, Math.min(height - 12, originY));
      ctx.beginPath();
      ctx.moveTo(sx, sy - 3);
      ctx.lineTo(sx, sy + 3);
      ctx.strokeStyle = '#64748b';
      ctx.stroke();

      ctx.fillText(x.toString(), sx - 5, sy + 14);
    }

    // Y Ticks
    const firstY = Math.ceil(yMin / yStep) * yStep;
    for (let y = firstY; y <= yMax; y += yStep) {
      if (Math.abs(y) < 1e-4) continue;
      const sx = Math.max(16, Math.min(width - 24, originX));
      const sy = toScreenY(y, height);
      ctx.beginPath();
      ctx.moveTo(sx - 3, sy);
      ctx.lineTo(sx + 3, sy);
      ctx.strokeStyle = '#64748b';
      ctx.stroke();

      ctx.fillText(y.toString(), sx + 6, sy + 3);
    }

    if (!analysis.isValid) return;

    const { a, b, c, d } = analysis.coefficients;

    // 4. Draw Inflection Tangent line (Tiếp tuyến tại tâm đối xứng I)
    if (showTangentAtI && analysis.inflectionPoint) {
      const { x: xi, y: yi } = analysis.inflectionPoint;
      const slope = evalDerivative(a, b, c, xi);
      
      // Line equation: y - yi = slope * (x - xi)  => y = slope * x + (yi - slope * xi)
      const x1 = xMin - 2;
      const y1 = yi + slope * (x1 - xi);
      const x2 = xMax + 2;
      const y2 = yi + slope * (x2 - xi);

      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#fbbf24'; // amber-400
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(toScreenX(x1, width), toScreenY(y1, height));
      ctx.lineTo(toScreenX(x2, width), toScreenY(y2, height));
      ctx.stroke();
      ctx.restore();
    }

    // 5. Draw Cubic Curve y = ax^3 + bx^2 + cx + d
    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#2563eb'; // blue-600
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    const steps = width * 1.5;
    let started = false;

    for (let i = 0; i <= steps; i++) {
      const sx = (i / steps) * width;
      const mx = toMathX(sx, width);
      const my = evalCubic(a, b, c, d, mx);
      const sy = toScreenY(my, height);

      // Clamp huge values to avoid canvas rendering glitches
      const clampedSy = Math.max(-1000, Math.min(height + 1000, sy));

      if (!started) {
        ctx.moveTo(sx, clampedSy);
        started = true;
      } else {
        ctx.lineTo(sx, clampedSy);
      }
    }
    ctx.stroke();
    ctx.restore();

    // 6. Draw Special Points and Projections
    if (showSpecialPoints) {
      analysis.specialPoints.forEach(pt => {
        const sx = toScreenX(pt.x, width);
        const sy = toScreenY(pt.y, height);

        // Check if inside or near screen
        if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) return;

        // Projections to Ox, Oy
        if (showProjections) {
          ctx.save();
          ctx.setLineDash([3, 3]);
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#94a3b8'; // slate-400

          // Projection to Ox (x, 0)
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx, originY);
          ctx.stroke();

          // Projection to Oy (0, y)
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(originX, sy);
          ctx.stroke();
          ctx.restore();
        }

        // Dot color and style by point type
        let dotColor = '#2563eb';
        let ringColor = '#dbeafe';
        let badgeBg = '#1e293b';

        if (pt.type === 'cuc_dai') {
          dotColor = '#dc2626'; // red-600
          ringColor = '#fee2e2';
        } else if (pt.type === 'cuc_tieu') {
          dotColor = '#0284c7'; // sky-600
          ringColor = '#e0f2fe';
        } else if (pt.type === 'tam_doi_xung') {
          dotColor = '#d97706'; // amber-600
          ringColor = '#fef3c7';
        } else if (pt.type === 'giao_oy') {
          dotColor = '#059669'; // emerald-600
          ringColor = '#d1fae5';
        } else if (pt.type === 'giao_ox') {
          dotColor = '#6366f1'; // indigo-500
          ringColor = '#e0e7ff';
        }

        // Draw outer ring
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, 2 * Math.PI);
        ctx.fillStyle = ringColor;
        ctx.fill();

        // Draw inner dot
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = dotColor;
        ctx.fill();

        // Label text
        ctx.font = '600 11px sans-serif';
        const text = pt.label || '';
        const textWidth = ctx.measureText(text).width;
        const textX = sx + 8;
        const textY = sy - 8;

        // Label background pill
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(textX - 4, textY - 11, textWidth + 8, 16, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = dotColor;
        ctx.fillText(text, textX, textY + 1);
      });
    }

    // 7. Draw Crosshair Hover Point on Curve
    if (hoverCoord && !isDragging) {
      const hx = hoverCoord.x;
      const hy = evalCubic(a, b, c, d, hx);
      const hsx = toScreenX(hx, width);
      const hsy = toScreenY(hy, height);

      if (hsx >= 0 && hsx <= width && hsy >= 0 && hsy <= height) {
        ctx.save();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);

        ctx.beginPath();
        ctx.moveTo(hsx, 0);
        ctx.lineTo(hsx, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, hsy);
        ctx.lineTo(width, hsy);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(hsx, hsy, 4.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#6366f1';
        ctx.fill();
        ctx.restore();
      }
    }
  }, [viewBounds, analysis, showGrid, showSpecialPoints, showProjections, showTangentAtI, hoverCoord, isDragging, canvasDimensions]);

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      if (rect.width > 20 && rect.height > 20) {
        setCanvasDimensions({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height)
        });
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Mouse Handlers: Pan
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const mathX = toMathX(screenX, canvasDimensions.width);
    const mathY = toMathY(screenY, canvasDimensions.height);

    setHoverCoord({ x: mathX, y: mathY, canvasX: screenX, canvasY: screenY });

    if (isDragging) {
      const dxPixels = e.clientX - dragStart.x;
      const dyPixels = e.clientY - dragStart.y;

      const xSpan = viewBounds.xMax - viewBounds.xMin;
      const ySpan = viewBounds.yMax - viewBounds.yMin;

      const dxMath = (dxPixels / canvasDimensions.width) * xSpan;
      const dyMath = (dyPixels / canvasDimensions.height) * ySpan;

      setViewBounds(prev => ({
        xMin: prev.xMin - dxMath,
        xMax: prev.xMax - dxMath,
        yMin: prev.yMin + dyMath,
        yMax: prev.yMax + dyMath
      }));

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoverCoord(null);
  };

  // Touch Handlers for Mobile & Tablet
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touch = e.touches[0];
    const dxPixels = touch.clientX - dragStart.x;
    const dyPixels = touch.clientY - dragStart.y;

    const xSpan = viewBounds.xMax - viewBounds.xMin;
    const ySpan = viewBounds.yMax - viewBounds.yMin;

    const dxMath = (dxPixels / canvasDimensions.width) * xSpan;
    const dyMath = (dyPixels / canvasDimensions.height) * ySpan;

    setViewBounds(prev => ({
      xMin: prev.xMin - dxMath,
      xMax: prev.xMax - dxMath,
      yMin: prev.yMin + dyMath,
      yMax: prev.yMax + dyMath
    }));

    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom Handler
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.85 : 1.18;
    applyZoom(zoomFactor);
  };

  const applyZoom = (factor: number) => {
    const xCenter = (viewBounds.xMin + viewBounds.xMax) / 2;
    const yCenter = (viewBounds.yMin + viewBounds.yMax) / 2;

    const xHalfSpan = ((viewBounds.xMax - viewBounds.xMin) / 2) * factor;
    const yHalfSpan = ((viewBounds.yMax - viewBounds.yMin) / 2) * factor;

    setViewBounds({
      xMin: xCenter - xHalfSpan,
      xMax: xCenter + xHalfSpan,
      yMin: yCenter - yHalfSpan,
      yMax: yCenter + yHalfSpan
    });
  };

  const resetToFit = () => {
    setViewBounds(getSmartBounds(analysis));
  };

  return (
    <div id="cubic-graph-container" className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-full">
      {/* Graph Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-50/80 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
          <h3 className="text-sm font-semibold text-slate-800">Đồ thị hàm số bậc ba Oxy</h3>
          {analysis.isValid && (
            <span className="hidden sm:inline-flex text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono font-medium">
              {(() => {
                const { a, b, c, d } = analysis.coefficients;
                const terms: string[] = [];
                if (a === 1) terms.push('x³');
                else if (a === -1) terms.push('-x³');
                else terms.push(`${a}x³`);

                if (b !== 0) {
                  const s = b > 0 ? '+ ' : '- ';
                  const ab = Math.abs(b);
                  terms.push(`${s}${ab === 1 ? '' : ab}x²`);
                }
                if (c !== 0) {
                  const s = c > 0 ? '+ ' : '- ';
                  const ac = Math.abs(c);
                  terms.push(`${s}${ac === 1 ? '' : ac}x`);
                }
                if (d !== 0 || terms.length === 0) {
                  if (d > 0 && terms.length > 0) terms.push(`+ ${d}`);
                  else if (d < 0 && terms.length > 0) terms.push(`- ${Math.abs(d)}`);
                  else terms.push(`${d}`);
                }
                return `y = ${terms.join(' ')}`;
              })()}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyZoom(0.8)}
            title="Phóng to (Zoom in)"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyZoom(1.25)}
            title="Thu nhỏ (Zoom out)"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetToFit}
            title="Căn chỉnh tự động (Auto-fit)"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full min-h-[380px] bg-white cursor-crosshair select-none"
      >
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width * (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)}
          height={canvasDimensions.height * (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)}
          style={{ width: `${canvasDimensions.width}px`, height: `${canvasDimensions.height}px` }}
          className="absolute inset-0 block touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onWheel={handleWheel}
        />

        {/* Hover Coordinate Floating Readout */}
        {hoverCoord && analysis.isValid && (
          <div
            className="pointer-events-none absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-xs px-2.5 py-1.5 rounded-md shadow-md flex items-center gap-2 font-mono"
          >
            <Crosshair className="w-3.5 h-3.5 text-blue-400" />
            <span>x = {formatNumVi(hoverCoord.x, 3)}</span>
            <span className="text-slate-400">|</span>
            <span>y = {formatNumVi(evalCubic(analysis.coefficients.a, analysis.coefficients.b, analysis.coefficients.c, analysis.coefficients.d, hoverCoord.x), 3)}</span>
          </div>
        )}

        {/* Drag Hint */}
        <div className="hidden sm:block pointer-events-none absolute top-3 right-3 bg-white/80 backdrop-blur-xs text-slate-500 text-[11px] px-2 py-1 rounded border border-slate-200 shadow-xs">
          Cuộn chuột để Zoom • Kéo để di chuyển
        </div>
      </div>

      {/* Graph Legend & Toggles */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={e => setShowGrid(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Lưới tọa độ</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showSpecialPoints}
              onChange={e => setShowSpecialPoints(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Điểm đặc biệt</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showTangentAtI}
              onChange={e => setShowTangentAtI(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Tiếp tuyến tại I</span>
          </label>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span>Cực đại</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
            <span>Cực tiểu</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Tâm đối xứng I</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Giao Oy</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span>Giao Ox</span>
          </span>
        </div>
      </div>
    </div>
  );
};
