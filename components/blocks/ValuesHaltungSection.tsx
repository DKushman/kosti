import ValuesHaltungScene from "@/components/blocks/ValuesHaltungScene";
import ValuesHaltungMobile from "@/components/blocks/ValuesHaltungMobile";

type ValueItem = { title: string; text: string; image: string };

type Props = {
  eyebrow: string;
  title: string;
  lede: string;
  heroImage: string;
  items: readonly ValueItem[];
};

export default function ValuesHaltungSection(props: Props) {
  return (
    <section id="haltung" className="values-sticky block block--paper">
      <div className="values-sticky__desktop">
        <ValuesHaltungScene {...props} />
      </div>
      <ValuesHaltungMobile
        eyebrow={props.eyebrow}
        title={props.title}
        lede={props.lede}
        items={props.items}
      />
    </section>
  );
}
