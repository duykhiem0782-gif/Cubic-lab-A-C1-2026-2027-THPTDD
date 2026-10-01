import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Boxes,
  RotateCw,
  Sparkles,
  Info,
  Layers,
  Move3d,
  Calculator
} from 'lucide-react';

export const OxyzLab: React.FC = () => {
  // Plane equation: Ax + By + Cz + D = 0
  const [A, setA] = useState<number>(2);
  const [B, setB] = useState<number>(-1);
  const [C, setC] = useState<number>(2);
  const [D, setD] = useState<number>(-4);

  // Point M(x0, y0, z0)
  const [mx, setMx] = useState<number>(1);
  const [my, setMy] = useState<number>(2);
  const [mz, setMz] = useState<number>(3);

  // 3D rotation angles (yaw, pitch)
  const [yaw, setYaw] = useState<number>(0.75); // ~43 degrees
  const [pitch, setPitch] = useState<number>(0.45); // ~26 degrees
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate distance from M to plane
  const distance = useMemo(() => {
    const numerator = Math.abs(A * mx + B * my + C * mz + D);
    const denominator = Math.sqrt(A * A + B * B + C * C);
    return denominator === 0 ? 0 : numerator / denominator;
  }, [A, B, C, D, mx, my, mz]);

  // Projection of 3D point (x, y, z) to 2D canvas (cx, cy)
  const project3D = (
    x: number,
    y: number,
    z: number,
    cx: number,
    cy: number,
    scale: number
  ) => {
    // Rotate around Y axis (yaw)
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const x1 = x * cosY - y * sinY;
    const y1 = x * sinY + y * cosY;
    const z1 = z;

    // Rotate around X axis (pitch)
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    const x2 = x1;
    const y2 = y1 * cosP - z1 * sinP;
    const z2 = y1 * sinP + z1 * cosP;

    // Screen coords (Z axis points up)
    return {
      x: cx + x2 * scale,
      y: cy - z2 * scale,
      depth: y2
    };
  };

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 38;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Subtle background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid on Oxy plane (z = 0)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i++) {
      const p1 = project3D(i, -5, 0, centerX, centerY, scale);
      const p2 = project3D(i, 5, 0, centerX, centerY, scale);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const p3 = project3D(-5, i, 0, centerX, centerY, scale);
      const p4 = project3D(5, i, 0, centerX, centerY, scale);
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.stroke();
    }

    // Draw Axes: Ox (Red), Oy (Green), Oz (Blue)
    const origin = project3D(0, 0, 0, centerX, centerY, scale);

    const drawAxis = (x: number, y: number, z: number, color: string, label: string) => {
      const pt = project3D(x, y, z, centerX, centerY, scale);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();

      // Axis label
      ctx.fillStyle = color;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(label, pt.x + 6, pt.y + 4);
    };

    drawAxis(5.5, 0, 0, '#ef4444', 'Ox');
    drawAxis(0, 5.5, 0, '#22c55e', 'Oy');
    drawAxis(0, 0, 5.5, '#3b82f6', 'Oz');

    // Origin label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('O(0,0,0)', origin.x - 20, origin.y + 15);

    // Draw Plane (α) as a quad in 3D
    // If C != 0, z = (-A*x - B*y - D) / C
    const planePoints = [];
    const size = 3;
    if (Math.abs(C) > 0.05) {
      const corners = [
        [-size, -size],
        [size, -size],
        [size, size],
        [-size, size]
      ];
      for (const [px, py] of corners) {
        const pz = (-A * px - B * py - D) / C;
        planePoints.push(project3D(px, py, pz, centerX, centerY, scale));
      }
    } else if (Math.abs(B) > 0.05) {
      const corners = [
        [-size, -size],
        [size, -size],
        [size, size],
        [-size, size]
      ];
      for (const [px, pz] of corners) {
        const py = (-A * px - D) / B;
        planePoints.push(project3D(px, py, pz, centerX, centerY, scale));
      }
    }

    if (planePoints.length === 4) {
      ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(planePoints[0].x, planePoints[0].y);
      for (let i = 1; i < 4; i++) {
        ctx.lineTo(planePoints[i].x, planePoints[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Plane label
      ctx.fillStyle = '#c7d2fe';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('(α)', planePoints[0].x + 8, planePoints[0].y - 8);
    }

    // Draw Normal vector n⃗ = (A, B, C)
    const normLen = Math.sqrt(A * A + B * B + C * C);
    if (normLen > 0) {
      const nScale = 2.5 / normLen;
      const nEnd = project3D(A * nScale, B * nScale, C * nScale, centerX, centerY, scale);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(nEnd.x, nEnd.y);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(nEnd.x, nEnd.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`n⃗(${A}; ${B}; ${C})`, nEnd.x + 8, nEnd.y);
    }

    // Draw Point M(mx, my, mz)
    const pM = project3D(mx, my, mz, centerX, centerY, scale);

    // Line from origin to M (position vector)
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(pM.x, pM.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Point M circle
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(pM.x, pM.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fbcfe8';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`M(${mx}; ${my}; ${mz})`, pM.x + 10, pM.y - 6);
  }, [A, B, C, D, mx, my, mz, yaw, pitch]);

  // Mouse drag handlers for 3D rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;

    setYaw((prev) => prev + dx * 0.008);
    setPitch((prev) => Math.max(-1.2, Math.min(1.2, prev + dy * 0.008)));

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Boxes className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Phòng Thí Nghiệm Không Gian Oxyz 3D Tương Tác
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kéo chuột trực tiếp trên khung 3D để xoay không gian. Thay đổi phương trình mặt phẳng <span className="font-semibold text-indigo-600">(α)</span> và toạ độ điểm <span className="font-semibold text-pink-600">M</span>.
          </p>
        </div>

        <button
          onClick={() => {
            setYaw(0.75);
            setPitch(0.45);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Đặt lại góc nhìn</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Canvas */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-red-400 font-bold">Ox</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">Oy</span>
              <span className="flex items-center gap-1 text-blue-400 font-bold">Oz</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">VTPT n⃗</span>
              <span className="flex items-center gap-1 text-pink-400 font-bold">Điểm M</span>
            </div>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Move3d className="w-3.5 h-3.5" /> Kéo chuột để xoay 3D
            </span>
          </div>

          <div
            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-800"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Quick presets for plane */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400">Mẫu mặt phẳng:</span>
            <button
              onClick={() => {
                setA(1);
                setB(1);
                setC(1);
                setD(-3);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              x + y + z - 3 = 0
            </button>
            <button
              onClick={() => {
                setA(2);
                setB(-1);
                setC(2);
                setD(-4);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              2x - y + 2z - 4 = 0
            </button>
            <button
              onClick={() => {
                setA(0);
                setB(0);
                setC(1);
                setD(0);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              Mặt Oxy: z = 0
            </button>
          </div>
        </div>

        {/* Sliders & Math Calculations */}
        <div className="lg:col-span-5 space-y-4">
          {/* Controls: Plane coefficients */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Phương trình mặt phẳng (α)</span>
              <span className="font-mono text-indigo-600 lowercase font-semibold">
                {A}x {B >= 0 ? `+ ${B}` : `- ${Math.abs(B)}`}y {C >= 0 ? `+ ${C}` : `- ${Math.abs(C)}`}z {D >= 0 ? `+ ${D}` : `- ${Math.abs(D)}`} = 0
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Hệ số A: {A}</label>
                <input
                  type="range"
                  min={-4}
                  max={4}
                  step={1}
                  value={A}
                  onChange={(e) => setA(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Hệ số B: {B}</label>
                <input
                  type="range"
                  min={-4}
                  max={4}
                  step={1}
                  value={B}
                  onChange={(e) => setB(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Hệ số C: {C}</label>
                <input
                  type="range"
                  min={-4}
                  max={4}
                  step={1}
                  value={C}
                  onChange={(e) => setC(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Hệ số D: {D}</label>
                <input
                  type="range"
                  min={-8}
                  max={8}
                  step={1}
                  value={D}
                  onChange={(e) => setD(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Controls: Point M */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Toạ độ điểm M(x₀; y₀; z₀)</span>
              <span className="font-mono text-pink-600 font-semibold">
                M({mx}; {my}; {mz})
              </span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">x₀: {mx}</label>
                <input
                  type="range"
                  min={-3}
                  max={3}
                  step={1}
                  value={mx}
                  onChange={(e) => setMx(parseInt(e.target.value))}
                  className="w-full accent-pink-600"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">y₀: {my}</label>
                <input
                  type="range"
                  min={-3}
                  max={3}
                  step={1}
                  value={my}
                  onChange={(e) => setMy(parseInt(e.target.value))}
                  className="w-full accent-pink-600"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">z₀: {mz}</label>
                <input
                  type="range"
                  min={-3}
                  max={3}
                  step={1}
                  value={mz}
                  onChange={(e) => setMz(parseInt(e.target.value))}
                  className="w-full accent-pink-600"
                />
              </div>
            </div>
          </div>

          {/* Result Card: Khoảng cách từ M đến (α) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-xs font-bold tracking-tight text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Khoảng Cách Từ M Đến Mặt Phẳng (α)</span>
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs">
                <div className="text-indigo-200 text-[11px] mb-1 font-mono">
                  d(M, (α)) = |A·x₀ + B·y₀ + C·z₀ + D| / √(A² + B² + C²)
                </div>
                <div className="text-amber-300 font-mono text-base font-bold mt-1">
                  d = {distance.toFixed(3)} (đơn vị độ dài)
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  = |{A}·({mx}) + {B}·({my}) + {C}·({mz}) + ({D})| / √({A}² + {B}² + {C}²)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
