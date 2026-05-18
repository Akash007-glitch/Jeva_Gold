const images = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnRMBW2W_NogRQ7DCMx7at3p93kjjigmIwQ1yVikOuQnwoI7l1ac9--2qQKcDlRJcMbxPo_Ls-RJUQjTw0e_2HJPZFH8Y2OCqBA_a72QaVMEkt2ZPCfY3XDfIVodbnCCfHsHVMDMxDaLQb6UqmmF7Zd2JpxAeOHonIaEoPGQ9Bfxx6qnhg-Ysfuh_ZpcBUnHWzAbYC1H7zYuRz8karyFr6vsrJLh0SX_kS8hC5_QB9BbyjxfQH0TYrZ-38miO1TcdxEOCu1MzL9UQ3",
    alt: "Dried Leaves",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuVonCg8ynF8QD9GwrfAMSqRRcJ_UTSN3CrZvgl7OBCcVVEpldX3f-tJviODJ3a7ZY9eQ1mpZSNTOcQ3S2xnk5j4KhVec5lz0_r0zapQM1oRBiM9GHsO1qiTbLwQZXsnQIRcni4hh-Kz_dczq_weU_Vtp8uJT1MFH9ztSdKH6oupXITRC08BF5U3uxpiTEysJxXGLPYxYNshv1gpSizHhmKRJ1h2cOQqcR7ycC9mj4MObX0t9_OTNyDfHrSp4VVnzVluo-R4C6hQh2",
    alt: "Assam Plantation",
  },
];

export default function VisualTeaserSection() {
  return (
    <section className="py-16">
      <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map(({ src, alt }) => (
          <div key={alt} className="h-64 rounded-xl overflow-hidden">
            <img alt={alt} className="w-full h-full object-cover" src={src} />
          </div>
        ))}
      </div>
    </section>
  );
}
