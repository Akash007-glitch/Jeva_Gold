import './Testimonials.css';

const reviews = [
  {
    id: 1,
    quote:
      "The aroma alone is enough to wake me up. I've tried many Assam teas, but the depth of flavor in the Imperial Gold is truly unmatched.",
    name: "Sarah Jenkins",
    role: "Tea Sommelier",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDj5Ki-XuMz7s4qIjDae7vOkpruO7mbxxmklciOnJ1mq3F__8ZXYHfOng6O_CBotS6fd9yKFx_jIx9z9_m6GXNGHq4R-X-GL0mXyJL9AQzJCc4ga1Inr2rWeCvYhpQfy9oKFsyMqzyFxp5R7DTTrxWyrIb1q3y4FAs6hHDmSOX9vysSbrN-FkGuAoTLCQmPriymCEPeH5EDoM5EyfPUmcGyL_L6ImhZIPsup9L-6AmAoYhI9HiVp6mwGe6k-lRCVSWjzgXbyg-v_MQ",
  },
  {
    id: 2,
    quote:
      "Fast shipping and impeccable packaging. The classic black is my go-to morning tea. It's bold, strong, and goes perfectly with a splash of milk.",
    name: "David Miller",
    role: "Lifestyle Blogger",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwkB0x4o_j-d3H67lwu88aCfgt6VV3HnlMMtjGnghuc4qfhWagc4kFacIx3QxBT_rpKgZ4GQ5i6NDlY5_rfqfqy7aXHb4_bX6YIgP70db0zPu99u352W_Kswwrj0nFrXjN-Yl3rJXqqw8mcVXMzkEQkn0cj4ukSRdoV-rm0rDN6-bc-FIVzXuGcXJ_Ij5EhExCqf4tlo_ItbA7X6Sv9vPQ8hBM-wCkmsZr9EBqTuvrR6W_QbGMgsEoqgOJMfh99Vkv5pyUOz_jzOM",
  },
  {
    id: 3,
    quote:
      "Authenticity at its best. You can tell this isn't mass-produced stuff. The golden tips are visible and the taste is pure and clean.",
    name: "Elena Rodriguez",
    role: "Fitness Coach",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVWwccpfBtFhBsTNMfEWVJ5e2j6UlvSVzQh77OEZ4Lfjzwi9WI_x4vyJ5BRJ1AWhX9s2gTpSAmr4yknMB44zSdQpPVMa_GO_o2GzQ82Y-oiR3-UJdQb8dVLMqkMPg55sSb4HY0mlFMBOGr_G_gbG8Gt_-3pp-5pGHMJVExHGwr2AcQvZArmAHTjSNisYPTBBJkXH09taiTMOYrtX7QzwEbpNWd9el2wO9U4xuS8PuHFtVaVKwbAO8XqA6fGvqfwOvh-_k01TBuDwA",
  },
];

function StarRating() {
  return (
    <div className="testimonials__stars">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="material-symbols-outlined">star</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="testimonials section-py" id="reviews">
      <div className="container">
        <div className="testimonials__header reveal">
          <div>
            <h2 className="testimonials__heading">Community Voices</h2>
            <p className="testimonials__subtext">Real experiences from tea connoisseurs worldwide.</p>
          </div>
          <div className="testimonials__nav">
            <button className="testimonials__nav-btn">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="testimonials__nav-btn">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="testimonials__grid">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`testimonials__card reveal reveal--delay-${index + 1}${index === 2 ? " testimonials__card--hidden-md" : ""}`}
            >
              <span className="material-symbols-outlined testimonials__quote-icon">
                format_quote
              </span>
              <StarRating />
              <p className="testimonials__text">"{review.quote}"</p>
              <div className="testimonials__reviewer">
                <div className="testimonials__avatar">
                  <img src={review.image} alt={review.name} />
                </div>
                <div>
                  <p className="testimonials__reviewer-name">{review.name}</p>
                  <p className="testimonials__reviewer-role">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
