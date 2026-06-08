"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, RoundedBox } from "@react-three/drei";

import { ChartErrorBoundary } from "@/components/charts/ChartErrorBoundary";
import type { AnalysisStats } from "@/lib/analysisStats";

export interface ChartColors {
  teal: string;
  orange: string;
  dark: string;
  light: string;
  surface: string;
}

const DEFAULT_COLORS: ChartColors = {
  teal: "#76abae",
  orange: "#ff5722",
  dark: "#303841",
  light: "#f5f5f5",
  surface: "#d4ecef",
};

function ChartLabel({
  position,
  title,
  value,
}: {
  position: [number, number, number];
  title: string;
  value?: string | number;
}) {
  return (
    <Html position={position} center distanceFactor={9} style={{ pointerEvents: "none" }}>
      <div className="whitespace-nowrap text-center">
        {value !== undefined && (
          <p className="text-base font-bold tabular-nums text-[var(--c-orange)]">{value}</p>
        )}
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {title}
        </p>
      </div>
    </Html>
  );
}

function ScoreTower({
  score,
  colors,
  position,
}: {
  score: number;
  colors: ChartColors;
  position: [number, number, number];
}) {
  const height = Math.max(0.35, (score / 100) * 3.2);
  const fill = score >= 80 ? colors.teal : score >= 50 ? colors.orange : "#e64a19";

  return (
    <group position={position}>
      <RoundedBox args={[1.6, 0.12, 1.6]} radius={0.04} position={[0, 0.06, 0]}>
        <meshStandardMaterial color={colors.dark} metalness={0.35} roughness={0.55} />
      </RoundedBox>
      <mesh position={[0, height / 2 + 0.12, 0]}>
        <cylinderGeometry args={[0.55, 0.7, height, 24]} />
        <meshStandardMaterial
          color={fill}
          emissive={fill}
          emissiveIntensity={0.25}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, height + 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.75, 0.06, 12, 48, Math.PI * 2 * (score / 100)]} />
        <meshStandardMaterial
          color={colors.orange}
          emissive={colors.orange}
          emissiveIntensity={0.35}
        />
      </mesh>
      <ChartLabel position={[0, height + 1.05, 0]} title="Match score" value={score} />
    </group>
  );
}

function SkillBars({
  stats,
  colors,
  position,
}: {
  stats: AnalysisStats;
  colors: ChartColors;
  position: [number, number, number];
}) {
  const bars = useMemo(
    () => [
      { label: "Resume", value: stats.resumeSkillCount, color: colors.dark },
      { label: "Job", value: stats.jdSkillCount, color: colors.surface },
      { label: "Matched", value: stats.matchedCount, color: colors.teal },
      { label: "Missing", value: stats.missingCount, color: colors.orange },
    ],
    [stats, colors],
  );

  const max = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <group position={position}>
      <ChartLabel position={[0, 3.2, 0]} title="Skill breakdown" />
      {bars.map((bar, index) => {
        const x = (index - 1.5) * 1.05;
        const height = Math.max(0.25, (bar.value / max) * 2.6);
        return (
          <group key={bar.label} position={[x, 0, 0]}>
            <RoundedBox
              args={[0.62, height, 0.62]}
              radius={0.06}
              position={[0, height / 2 + 0.12, 0]}
            >
              <meshStandardMaterial
                color={bar.color}
                emissive={bar.color}
                emissiveIntensity={bar.label === "Missing" ? 0.3 : 0.15}
                metalness={0.3}
                roughness={0.4}
              />
            </RoundedBox>
            <ChartLabel position={[0, -0.35, 0]} title={bar.label} value={bar.value} />
          </group>
        );
      })}
    </group>
  );
}

function Scene({ stats, colors }: { stats: AnalysisStats; colors: ChartColors }) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[6, 8, 4]} intensity={1.1} />
      <directionalLight position={[-4, 3, -6]} intensity={0.45} color={colors.teal} />
      <pointLight position={[0, 4, 2]} intensity={0.6} color={colors.orange} />

      <ScoreTower score={stats.score} colors={colors} position={[-2.4, 0, 0]} />
      <SkillBars stats={stats} colors={colors} position={[2.4, 0, 0]} />

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={5}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 1.1, 0]}
      />
    </>
  );
}

function useCanRenderWebGL() {
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ok = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      setSupported(ok);
    } catch {
      setSupported(false);
    } finally {
      setReady(true);
    }
  }, []);

  return { ready, supported };
}

function ChartsFallback({ message }: { message: string }) {
  return (
    <div className="chart-canvas-wrap flex items-center justify-center p-6 text-center">
      <p className="text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}

export function AnalysisCharts3D({
  stats,
  colors = DEFAULT_COLORS,
}: {
  stats: AnalysisStats;
  colors?: ChartColors;
}) {
  const { ready, supported } = useCanRenderWebGL();

  if (!ready) {
    return <ChartsFallback message="Preparing 3D view…" />;
  }

  if (!supported) {
    return (
      <ChartsFallback message="WebGL is not available in this browser. Use the stats panel below." />
    );
  }

  return (
    <ChartErrorBoundary
      fallback={
        <ChartsFallback message="3D chart failed to render. Use the stats panel below." />
      }
    >
      <div className="chart-canvas-wrap">
        <Canvas
          className="h-full w-full"
          style={{ width: "100%", height: "100%" }}
          camera={{ position: [0, 2.2, 7.5], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Scene stats={stats} colors={colors} />
        </Canvas>
        <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
          Drag to rotate · Scroll to zoom
        </p>
      </div>
    </ChartErrorBoundary>
  );
}
