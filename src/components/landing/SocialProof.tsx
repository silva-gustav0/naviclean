export function SocialProof() {
  const logos = [
    { alt: "Clínica Sorriso SP", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFS5xg1XZn9RB2pPM-Gp3XYVBwQv7rbuy6Gxvai3zaiOwMUgJ01-tQGkocSfhwxtoKmoY_Iki1QUdYCtz4bNILKA-Ltqkr109UK0SOG5Idi6Q6TMc3wFrhqFiDgx_z3LV66ZJouLk6Rhe9V7FpZgUsgqnUhTlQ6hVpOC48HTOIweqSDQ0fE0BDaip8dYgVq6IOre5EuC_8ZxJJNSEqV_JjNSa-5agkUkzRsCSplE6eEum84LPfyAIHWkQT2PeMYG4BzCSKKJYpzM0", height: "h-8" },
    { alt: "OdontoGroup", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDchDns7PAHTFozyemLnd6qoC1XyS_YcgiLRb61UinU3rLzMh03ZFu05STDgTA53pwGxZQjj2T6OeALnz2Zzg_QOj4sysOOIPa_m_5tJFJ8u4QVAaGNDd_iUCemVMYtomQaeykw6I-dfEgiUoTtaPxOHZjgFwZpwr1rwzQcv0e4rAYzXTTSR9K0dmSYYy_ar8WmsEp8UpzBfIOa4MozyM8gq5J4GaH2Mighv6kj-FaZLKijg4rcdAk02Wveh_9FB4fYvO1p8o7Diqw", height: "h-10" },
    { alt: "DentalCare Curitiba", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAytH5QVl_rXUh8Dru4zps_Z8qF6LxBNWVDyxK_6r2ydxtFT6jN_UnsoZKsveAWcpf5QZ7mV0mTM9ic1VWspVFbkuCDvRh_w4WZzQqKBk5dmCmQSmsHPdursT4fGQQfudyolZlZ4zUGyO10mjDDwVnOYuN_RcAv1lj-cnmjB_nw5EDLVYRIyD0Dg4jkNbGGxj2uqnxMw8tzGS0o36l_V62PQJMTaDwnGVYWEiFoDcFugdM0MI4kYE9hi1w-4ZpXhc8HylKvYi031TA", height: "h-9" },
    { alt: "Clínica Implantec", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEvSMj5hafyu_xTqLamgdATyMk_HoBBZ0Qgll-RAT3O7zARqYPCB6I2IXimqinoYS8iLaJyTliVR0UbR3o1lpb-2dAAd0VCrd7DiYjiwzA8gx-V4aGoXb6PmfrYhNrhLe9expODI5-rrE1l9GatnYOtSp_sOwVMyQAD302_FIZIAZ_sf7A4mucDaay7a3-9-Ykb64qK572Ewa-xh1xze2WzOANTHnyfOVUcWWJJu798Typ-8xCfUQ8Txqx6-8p7xkSZrn7IkSKX0s", height: "h-8" },
    { alt: "SmileCare", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCj-uLeyeFkwg0cxq7hdhJgzQonCJY_3EHEy548ufvBM3UiihnDzdHb1WmyKhIQiS8NBmMDp3a-ZDT_OSbS3RhVPZyIKsoBUnj8X71hcFcB99ctjowM5lH4fUgVIjz48w_4wE4XWsnc93bEi8OLh9TEhYVjECf_Kb_buopsqxxNrb8cDnGayJKU6S9OQNYLn480X2Urc0n6VvP6LRIOQmpsNyzbZuJmaZtNzemrcIQ4Pz0_QDxxm6coAOFtBmTnFWT9L1Pf8GEOAdc", height: "h-11" },
  ]

  return (
    <section className="bg-slate-50 py-12 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-slate-400 mb-10 uppercase">
          +500 clínicas confiam no NaviClean
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-16 opacity-40 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-500">
          {logos.map((logo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={logo.alt} src={logo.src} alt={logo.alt} className={logo.height} />
          ))}
        </div>
      </div>
    </section>
  )
}
