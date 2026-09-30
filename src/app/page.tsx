import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { OneLine } from "@/components/line/OneLine";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <OneLine />
      </main>
      <Footer />
    </>
  );
}
