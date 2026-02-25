import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden border-t border-white/10"
      style={{
        backgroundColor: '#080808',
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }}
    >
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand Column */}
          <div className="flex flex-col gap-5">
            <Image
              src="/logoDark.png"
              alt="Suho Tech"
              width={110}
              height={36}
              className="object-contain object-left"
            />
            <div className="flex flex-col gap-1.5">
              <p
                className="text-xs tracking-[0.22em] uppercase"
                style={{ color: 'rgba(255,255,255,0.22)' }}
              >
                Production Intelligence Platform
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.18)' }}>
                Precision-engineered tools for modern
                <br />
                manufacturing & logistics operations.
              </p>
            </div>
          </div>

          {/* System Features Column */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-[10px] font-semibold tracking-[0.25em] uppercase"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              System Modules
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                'Material Production Management',
                'Branch Capacity Planning',
                'Work Report & Tracking',
                'Project Statistics Overview',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span
                    className="h-px w-4 shrink-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                  />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-[10px] font-semibold tracking-[0.25em] uppercase"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Contact
            </h3>

            <div className="flex flex-col gap-5">
              {/* CEO */}
              <div className="flex flex-col gap-1">
                <span
                  className="text-[10px] tracking-[0.18em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.18)' }}
                >
                  Chief Executive
                </span>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  이재광
                </span>
                <a
                  href="mailto:jklee9297@hanmail.net"
                  className="font-mono text-xs text-white/30 transition-colors duration-200 hover:text-white/65"
                >
                  jklee9297@hanmail.net
                </a>
              </div>

              {/* Divider */}
              <div className="h-px w-8" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

              {/* Developer */}
              <div className="flex flex-col gap-1">
                <span
                  className="text-[10px] tracking-[0.18em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.18)' }}
                >
                  Developer
                </span>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  백과
                </span>
                <a
                  href="mailto:ksu9801@gmail.com"
                  className="font-mono text-xs text-white/30 transition-colors duration-200 hover:text-white/65"
                >
                  ksu9801@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
            © {year} Suho Tech Co. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ backgroundColor: 'rgba(74,222,128,0.55)' }}
            />
            <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
