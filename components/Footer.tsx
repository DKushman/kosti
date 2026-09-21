import TransitionLink from "@/components/TransitionLink";
import { InstagramIcon, LinkedInIcon } from "@/components/SocialIcons";
import { PARTNER_LOGOS } from "@/lib/partner-logos";
import { FOOTER_COLUMNS, SITE } from "@/lib/site";

function isExternal(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:");
}

/**
 * Site footer — column nav, partner logos, socials, giant KOSTI wordmark.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__columns">
          {FOOTER_COLUMNS.map((column) => (
            <div className="footer__col" key={column.title}>
              <p className="footer__col-title">{column.title}</p>
              <ul className="footer__col-list" role="list">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    {isExternal(link.href) ? (
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <TransitionLink href={link.href}>{link.label}</TransitionLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bar">
          <ul className="footer__partners" role="list" aria-label="Partner und Projekte">
            {PARTNER_LOGOS.map((logo) => (
              <li key={logo.alt}>
                <TransitionLink href={logo.href} className="footer__partner-link">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`footer__partner-logo footer__partner-logo--${logo.variant}`}
                    draggable={false}
                  />
                </TransitionLink>
              </li>
            ))}
          </ul>

          <div className="footer__socials" aria-label="Social Media">
            <a
              className="footer__social-btn"
              href={SITE.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon size={24} />
            </a>
            <a
              className="footer__social-btn"
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon size={24} />
            </a>
          </div>
        </div>

        <div className="footer__utility">
          <p className="footer__location">{SITE.location}</p>
        </div>

        <p className="footer__wordmark display" aria-hidden="true">
          KOSTI
        </p>

        <div className="footer__fine">
          <p className="footer__copy">© 2026 {SITE.name}</p>
          <a
            className="footer__credit"
            href={SITE.credits.href}
            target="_blank"
            rel="noreferrer"
          >
            {SITE.credits.label}
          </a>
        </div>
      </div>
    </footer>
  );
}
