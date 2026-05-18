import './OriginStory.css';

export default function OriginStory() {
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
            <p className="origin__stat-num">150+</p>
            <p className="origin__stat-label">Years of Heritage</p>
          </div>
        </div>

        {/* Text Content */}
        <div className="origin__content reveal reveal--right">
          <h2 className="origin__title">
            The Heritage of <span className="origin__title-accent">Assam</span>
          </h2>
          <p className="origin__text origin__text--lg">
            Nestled in the foothills of the Himalayas, our tea estates breathe in the moisture of
            the Brahmaputra river. This unique climate creates the world-renowned 'Assam Character'
            – a strength and richness that cannot be replicated anywhere else.
          </p>
          <p className="origin__text">
            For three generations, we have worked with local artisans to perfect the art of tea
            oxidation, ensuring every tin of Jeva Gold carries the soul of our land.
          </p>
          <div className="origin__cta-wrap">
            <button className="origin__cta-btn">
              Read Our Full Story
              <span className="material-symbols-outlined">trending_flat</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
