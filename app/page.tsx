import Hero from "@/components/Hero";
import MissionStatement from "@/components/MissionStatement";
import Themes from "@/components/Themes";
import Werdegang from "@/components/Werdegang";
import Projects from "@/components/Projects";
import Manifesto from "@/components/Manifesto";
import Posts from "@/components/Posts";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <MissionStatement />
      <Themes />
      <Werdegang />
      <Projects />
      <Manifesto />
      <Posts />
    </main>
  );
}
