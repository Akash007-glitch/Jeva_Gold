import "./WhyChooseSection.css";

const features = [
  { icon: "landscape", title: "Authentic Assam Origin", description: "Sourced directly from the world-renowned tea gardens of Assam for true regional character." },
  { icon: "bolt", title: "Strong & Kadak Taste", description: "A robust, full-bodied flavor profile that stands strong even when paired with milk and spices." },
  { icon: "eco", title: "Premium Tea Leaves", description: "Only the finest, youngest leaves are selected to ensure superior quality in every steep." },
  { icon: "air", title: "Fresh Aroma", description: "Vacuum-sealed freshness that releases a deep, malty fragrance the moment you open the pack." },
  { icon: "coffee", title: "Perfect for Daily Chai", description: "Balanced meticulously to be the reliable anchor of your daily morning and evening tea rituals." },
  { icon: "payments", title: "Value for Money", description: "Premium quality tea that remains accessible, offering more cups per pack without compromise." },
];

function FeatureCard({ icon, title, description, index }) {
  return (
    <div className="feature-card">
      <span className="feature-card__number">{String(index + 1).padStart(2, "0")}</span>
      <div className="feature-card__icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__desc">{description}</p>
    </div>
  );
}

export default function WhyChooseSection() {
  return (
    <section className="why-choose">
      <div className="why-choose__inner">

        <div className="why-choose__header">
          <div className="why-choose__eyebrow">
            <span className="material-symbols-outlined">verified</span>
            Why Jeeva Gold
          </div>
          <h2 className="why-choose__title">
            The Gold Standard in <em>Assam Tea</em>
          </h2>
          <p className="why-choose__subtitle">
            Rooted in the rich soil of Assam, our tea is crafted for those who demand a bold,
            authentic, and energizing 'Kadak' experience every single day.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>

        <div className="cta-block">
          <div className="cta-block__box">
            <span className="material-symbols-outlined cta-block__bg-icon">psychology_alt</span>
            <h4 className="cta-block__title">Ready to elevate your tea time?</h4>
            <p className="cta-block__subtitle">
              Join thousands of tea lovers who have made the switch to Jeeva Gold.
            </p>
            <button className="cta-block__btn">
              Try Jeeva Gold Today
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
