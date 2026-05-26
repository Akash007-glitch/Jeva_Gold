import './Hero.css';
import Bgimage from '../../../image/Bg.webp';
import useSEO from '../utils/useSEO';

export default function Hero() {
  useSEO({
    title: "Jeeva Gold | Premium Assam Tea & Kadak Chai",
    description: "Experience the authentic, bold, and kadak taste of premium handpicked Assam tea direct from the gardens of the Brahmaputra valley. Order Jeva Gold today.",
    keywords: "Jeeva Gold, Assam Tea, Premium Tea, Kadak Chai, Masala Chai, Elaichi Tea, Green Tea, Buy Tea Online, Indian Chai",
  });

  return (

    <section
      className="hero"
      style={{ backgroundImage: `url(${Bgimage})` }}
    >
      <div className="hero__bg-overlay" />

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

          {/* <div className="hero__actions">
            <button className="hero__btn-secondary">
              Explore Our Tea
            </button>
          </div> */}
        </div>
      </div>
    </section>
  );
}
