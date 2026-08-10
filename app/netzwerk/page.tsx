import type { Metadata } from "next";
import NetworkDirectory from "@/components/NetworkDirectory";
import membersData from "@/lib/network-members.json";
import type { NetworkMember } from "@/lib/network-types";

const networkMembers = membersData as NetworkMember[];

export const metadata: Metadata = {
  title: "Netzwerk — MyBLN Mitglieder",
  description:
    "Lerne die Menschen kennen, die MyBLN prägen — das Netzwerk der My Berliner Community.",
};

export default function NetzwerkPage() {
  return (
    <main id="main" className="network-page">
      <div className="network-page__intro" data-page-enter>
        <p className="network-page__eyebrow">MyBLN · Netzwerk</p>
        <h1 className="network-page__title" id="network-heading">
          Mach Berlin sichtbar!
        </h1>
        <p className="network-page__lead">
          Lerne die Menschen kennen, die MyBLN prägen, und werde selbst Teil
          einer wachsenden Community, die Berlin aktiv gestaltet.
        </p>
      </div>

      <div data-page-enter>
        <NetworkDirectory members={networkMembers} />
      </div>
    </main>
  );
}
