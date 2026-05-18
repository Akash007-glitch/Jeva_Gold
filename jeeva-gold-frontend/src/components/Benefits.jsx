import './Benefits.css';

const benefits = [
  {
    icon: "favorite",
    title: "Heart Health",
    description:
      "Loaded with flavonoids that support cardiovascular health and improve circulation.",
  },
  {
    icon: "shield_moon",
    title: "Antioxidant Rich",
    description:
      "Naturally high in polyphenols that help fight free radicals and boost your immunity.",
  },
  {
    icon: "bolt",
    title: "Natural Energy",
    description:
      "A gentle caffeine boost combined with L-theanine for focused, sustained mental clarity.",
  },
];

export default function Benefits() {
  return (
    <section className="benefits section-py" id="benefits">
      <div className="benefits__bg">
        <span className="material-symbols-outlined benefits__bg-icon-1">eco</span>
        <span className="material-symbols-outlined benefits__bg-icon-2">spa</span>
      </div>

      <div className="container benefits__inner">
        <h2 className="benefits__title reveal">{`The Wellness Infusion`}</h2>
        <div className="benefits__grid">
          {benefits.map((benefit, i) => (
            <div key={benefit.title} className={`benefits__card reveal reveal--delay-${i + 1}`}>
              <div className="benefits__icon-wrap">
                <span className="material-symbols-outlined">{benefit.icon}</span>
              </div>
              <h3 className="benefits__card-title">{benefit.title}</h3>
              <p className="benefits__card-text">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
