import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import RevealScope from "@/components/RevealScope";
import { imageSet } from "@/lib/images";
import { SITE } from "@/lib/site";

const PORTRAIT = imageSet("konstantin-portrait");

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Projekt, Kollaboration oder Frage für Berlin? Konstantin Patsalides freut sich auf den Austausch — schreib mir eine Nachricht.",
};

export default function KontaktPage() {
  return (
    <main id="main" className="page page--light">
      <RevealScope as="section" className="contact-page" aria-labelledby="contact-heading">
        <div className="contact-split">
          <div className="contact-split__intro" data-reveal="up">
            <p className="contact-split__eyebrow eyebrow">Kontakt</p>
            <h1 className="contact-split__title display" id="contact-heading">
              Lass uns was verändern!
            </h1>
            <p className="contact-split__lede serif-lede">
              Ob Kollaboration für Berlin, ein konkretes Projekt oder eine offene Frage — ich
              freue mich auf den Austausch. Schreib mir, worum es geht, dann melde ich mich
              persönlich.
            </p>

            <div className="contact-split__hi">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="contact-split__avatar"
                src={PORTRAIT.src}
                alt=""
                width={80}
                height={80}
                decoding="async"
              />
              <div>
                <p className="contact-split__hi-label">Schreib mir</p>
                <a className="contact-split__hi-mail" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>

          <div className="contact-split__form" data-reveal="up" data-reveal-delay="0.12">
            <ContactForm />
          </div>
        </div>
      </RevealScope>
    </main>
  );
}
