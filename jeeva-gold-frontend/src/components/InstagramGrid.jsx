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
          <a href="https://www.instagram.com/jeeva_gold_tea?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="instagram__handle" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" className="instagram__icon">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
            <span>@jeeva_gold_tea</span>
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
