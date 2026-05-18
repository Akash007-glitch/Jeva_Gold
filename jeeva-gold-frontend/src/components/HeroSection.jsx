export default function HeroSection() {
  return (
    <section className="px-8 max-w-screen-2xl mx-auto mt-12 mb-16">
      <div className="relative h-[500px] w-full overflow-hidden rounded-xl">
        <img
          alt="Premium Assam Tea"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkJFmTcrP7Fi3y9ibPBg5iwiKzdAKYMy_x2CixNK7wkZ1bafo0vmQoTCo3RUWkYITGW08dnfIjTvAgP91uGF8DlAyJL0I6xQi3DKlwMxttNuzGOoukfGiYzJCuu5xxkjyEKDWH0hWRKFROJK-raQ2IqWhQycSZrJlHlBcP2bEtfqmMi4h5GUzaNC96ozmgrhoagkxOOycNieKqgBPWntQOmv0DGZ9xRRzyKmGCXdWA_oze_NepcJ3ATGMDbIk6zrePMM0hiIcv4WRj"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent flex items-center p-12">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-widest uppercase mb-4 rounded-full">
              The Gold Standard
            </span>
            <h1 className="text-white font-headline text-5xl font-extrabold tracking-tight mb-6">
              Experience the Strength of Authentic Assam.
            </h1>
            <p className="text-primary-fixed text-lg leading-relaxed">
              Jeeva Gold brings the bold spirit of Assam's finest gardens directly to your morning
              ritual. Unmatched strength, unparalleled aroma.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
