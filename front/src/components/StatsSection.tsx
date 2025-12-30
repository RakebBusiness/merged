import { useEffect, useRef, useState } from "react";

export default function StatsSection() {
  const stats = [
    { value: 5000, label: "Étudiants", color: "#03045E" },
    { value: 45, label: "Cours", color: "#03045E" },
    { value: 500, label: "Exercices", color: "#03045E" },
    { value: 25, label: "Enseignants", color: "#03045E" },
  ];

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    stats.forEach((stat, index) => {
      let start = 0;
      const end = stat.value;
      const duration = 2000; // 2 seconds
      const increment = Math.ceil(end / (duration / 50)); // Calcul pour un décompte fluide

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCounts((prev) => {
            const updated = [...prev];
            updated[index] = end;
            return updated;
          });
          clearInterval(timer);
        } else {
          setCounts((prev) => {
            const updated = [...prev];
            updated[index] = start;
            return updated;
          });
        }
      }, 50);
    });
  }, [visible]);

  const formatNumber = (number: number) => {
    return number.toLocaleString();
  };

  return (
  <section ref={sectionRef} className="py-20 bg-gradient-to-tr from-blue-100 via-white to-green-200">

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <h3 className="text-2xl lg:text-5xl font-bold mb-4 transition-all text-blue-900" style={{ color: s.color }}>
                {formatNumber(counts[i])}
                {s.value >= 500 ? "+" : ""}
              </h3>
              <p className="text-xl text-gray-600 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
