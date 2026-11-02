const particles = [
  { left: "12%", size: 2, delay: "0s", duration: "22s" },
  { left: "28%", size: 3, delay: "-6s", duration: "28s" },
  { left: "46%", size: 2, delay: "-12s", duration: "24s" },
  { left: "63%", size: 2, delay: "-4s", duration: "30s" },
  { left: "78%", size: 3, delay: "-16s", duration: "26s" },
  { left: "88%", size: 2, delay: "-9s", duration: "32s" },
];

export function HeroAmbient() {
  return (
    <div className="hero-ambient" aria-hidden>
      <div className="hero-ambient-wash" />
      <div className="hero-ambient-orb hero-ambient-orb-a" />
      <div className="hero-ambient-orb hero-ambient-orb-b" />
      <div className="hero-ambient-orb hero-ambient-orb-c" />
      {particles.map((particle) => (
        <span
          key={particle.left}
          className="hero-ambient-particle"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}
