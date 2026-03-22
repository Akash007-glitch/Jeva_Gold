import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg-pattern leaf-pattern" />
      <div className="hero__bg-gradient" />

      <div className="container hero__grid">
        {/* Left Content */}
        <div className="hero__content">
          <div className="hero__badge">
            <span className="material-symbols-outlined">verified</span>
            Direct from Gardens
          </div>

          <h1 className="hero__title">
            Experience the <span className="hero__title-accent">Authentic</span> Taste of Assam
          </h1>

          <p className="hero__subtitle">
            Premium handpicked tea leaves from the lush Brahmaputra valley,
            crafted for a rich malty aroma and perfect golden infusion.
          </p>

          <div className="hero__actions">

            <button className="hero__btn-secondary">
              Explore Our Tea
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="hero__image-wrap">
          <div className="hero__image-blur-1" />
          <div className="hero__image-blur-2" />
          <div className="hero__image-frame">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaOM2X3OTFw3IVztG2MEIaGvqOIc0OwDPvZk1aSWt-3ttJ9VZrz3yGmUmBFoZw5tmG9f0YyOnQwf-rfw1-XYqpTz0m7nNRGvI9OQwuJtjp8gs9Y_JkVoIbzt38U4bA2t9Ys299lFyTMb0CekKJe68JUNVwJ9AN2S1arfjiXrgoo-CP6DcxKNSkpL5_7FpkaB0Iy8_jCjkX6meyw6QCK1SiMUYEf1xvYN6PC9JWsYNkGhluxiP3WJt7nnk0RX8K2lbSTkw3Hrgg0zA"
              alt="Jeva Gold Tea"
            />
            <div className="hero__image-overlay" />
          </div>
        </div>
      </div>
    </section>
  );
}
