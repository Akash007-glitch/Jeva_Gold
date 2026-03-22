import './InstagramGrid.css';

const photos = [
  {
    id: 1,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOVEAp-hEKgfwc_eQf1ipDIrLS2MwX_toEEy1d80uzbaxqgI6-lBG3kjHNLVtMLRTIJoJuqyuqvxHgisfIKQJSQM9_EoZKV3MJbSxa1Yq3lm8HVWvKZiUUn_57TpNfCeR6KPZInbsCKT6FyQ9NrvAs0cWorlBaa7lFvddj_7se8l09m0p1TUY26C7PNpZPnjGh68LEf_nHopkhTP3bBfsBzwU4bxRdpyFAfokCoe6ZAKaO5lTIl2lQoSuTowUUkngZVb2MiXTNnHw",
    alt: "Tea lifestyle photo",
  },
  {
    id: 2,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOtYTkj_fm__Tbco6vX-T813_b7nw2pVAUfF280a5p2q4IF8lc7fov2i5a5SbsJ42kCTGc9K30dSWLeXdmGNgsVuCz63GN1cW2YntD6exyzN91Xz0wDIka1cTv6fAloFjv7DykdYLEQOcJDA907tTE47OME0j0ydRcKjOyqqQgfCPmXQkHUpXK7Em4g-nYVLRsycVID3N3y1gbi3QxA23NqpqcZmrPbrj1GpAmRGIUTyY3yeJnZVekwhjjNIoPnyMj-_wNFYQQsx0",
    alt: "Tea brewing session",
  },
  {
    id: 3,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPGvY3t2aS9sbkEZZEtP3BM0BRcS6YFhmuMHYEpQJlGo-rbHvwzrnHHQwswG64aPdC6RR8xDBEE7scS3ZuqetyK_1Jr03CRzq765N0K6YJAwCDXxwJu5bGlWbMdtiDMvHUP0P_2F1ExkhXbeokQYNs8rWYUuGZnDAF7GO7gRaWRpTo36nonQrk2I1iCws8uIsm3nQ4AOdLme5G0j5vaYybF7j0jh-8sBvA-iK4s9kMtSCHI7OlD3ffHWWC9j7kNojqtaMMC2fPnFY",
    alt: "Assam tea garden mountains",
  },
  {
    id: 4,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5aEHKaQoRPRdvlBsk0_ICAm0tniV2pd5oifLZlgbzs8sSc4IElcUulYz9hQVhx3nssPiRSPgbA4eaA9Dzpedn8uNqdtEqRShLZKWdtVESvRdJmHpBc4lYF7TSEIE5km_1PsiD9FO2QMlQ9x0hl55IvJDGyD7vEwd_0Go1IXC7ToSQfSzG-7uS1wqarLL7cGEZwFO45-rOj24oaqhFYNjcJQ0ov1IlSiVvDSWAR8Gr9SsIhQ-_Y6A3qZ-hE4OHL7SDm-dai1LPdmE",
    alt: "Cup of tea flatlay",
  },
];

export default function InstagramGrid() {
  return (
    <section className="instagram section-py">
      <div className="container">
        <div className="instagram__header reveal">
          <div>
            <h2 className="instagram__heading">#TheGoldExperience</h2>
            <p className="instagram__subtext">
              Follow our journey on social for brewing tips and garden updates.
            </p>
          </div>
          <a href="#" className="instagram__handle">
            @jevagold_tea{" "}
            <span className="material-symbols-outlined">launch</span>
          </a>
        </div>
      </div>

      <div className="instagram__grid">
        {photos.map((photo, i) => (
          <div key={photo.id} className={`instagram__item reveal reveal--delay-${i + 1}`}>
            <img src={photo.src} alt={photo.alt} />
            <div className="instagram__overlay">
              <span className="material-symbols-outlined">favorite</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
