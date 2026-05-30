import { useState } from 'react';
import './OriginStory.css';

export default function OriginStory() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="origin section-py" id="about">
      <div className="container origin__grid">
        {/* Image Grid */}
        <div className="origin__images reveal reveal--left">
          <div className="origin__image-grid">
            <div className="origin__image-col-offset">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdfMCMUyk-4rZuadjzXQ4qrWmeEkPH_eQwfFKreKxrIHBJrZ6XLSP9QMoZn6IIglTu9NKZGCp98jKeSUjwOp38oMs2EzZpMEljOeGWHc_8VGv17MEqY-K29Spf2ueYfm1EE02Mc2pGZla5D-enhbWOrraOMSZdLcLuWHR0DxbOCFNhk1ID8I8l1C_TiyDDjzmKu4g9Nx7sAJvDRUloJ4SB3mVbXfW49o2mxSTglTaPqJOsmgYMvhK5EBPeb5KQhs1T7gtW77hXIVE"
                alt="Tea Garden"
                className="origin__photo"
              />
            </div>
            <div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzgHhgZByfmKs3KHotiZZ-4nBm2kNM3FqU4ZQljYuKsa-xDvzXB04ro4_Qk-7KVUGLqvj6tZa4uMZ2C2XjlN3TJqs26Q9fPnE11a9FhThfS3-B0v55Mfjc6-i8D7Cub9E7OCq-NFODWiCSksIAQ38-kLHU7pFe4ZdjprV6qTxodv-pkYUGeqEHuRB40SzoF1MhYgbnxVZstioRkIJCAwq6l5mnxj7JJIbEOe78cyu4rnOFLsUoYpN9fsSDhP9sbJFopUCExakP2x4"
                alt="Tea Plucking"
                className="origin__photo"
              />
            </div>
          </div>
          <div className="origin__stat-bubble glass">
            <p className="origin__stat-num">25+</p>
            <p className="origin__stat-label">Years of Experience</p>
          </div>
        </div>

        {/* Text Content */}
        <div className="origin__content reveal reveal--right">
          <h2 className="origin__title">
            The Heritage of <span className="origin__title-accent">Assam</span>
          </h2>
          <p className="origin__text origin__text--lg">
            Nestled in the foothills of the Himalayas, Assam’s tea gardens breathe in the moisture of the mighty Brahmaputra river. This unique land gives birth to the world-renowned “Assam Character” — a bold strength and rich taste that cannot be replicated anywhere else.
          </p>
          <p className="origin__text">
            The story of Assam Tea began in the lush tea belt of Upper Assam, where fertile soil, abundant rainfall, and humid river valley air create teas known for their deep color, rich body, and unmistakable aroma.
          </p>

          {expanded && (
            <div className="origin__text-expanded">
              <p className="origin__text">
                For over 25 years, tea has been more than a business for us — it has been a way of life. From carefully selecting teas at the gardens to crafting balanced blends using years of experience and a deep understanding of Assam Teas, every step is guided by experience, patience, and pride in Assam’s heritage.
              </p>
              <p className="origin__text">
                At Jeeva Gold, we continue to work closely with local growers and tea communities who have cared for these gardens for generations. Their dedication, along with our commitment to quality, helps us bring you a rich coppery cup with smooth malty notes — a tea made to refresh conversations, families, and everyday moments.
              </p>
            </div>
          )}

          <div className="origin__cta-wrap">
            <button className="origin__cta-btn" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Show Less" : "Read Our Full Story"}
              <span className="material-symbols-outlined">
                {expanded ? "expand_less" : "trending_flat"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

