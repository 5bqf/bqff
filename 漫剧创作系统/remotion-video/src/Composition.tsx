import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export const MainComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = Math.min(1, frame / (fps * 0.5)); // fade in over 0.5s

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 80,
          fontWeight: "bold",
          opacity,
        }}
      >
        漫剧创作系统
      </div>
    </AbsoluteFill>
  );
};
