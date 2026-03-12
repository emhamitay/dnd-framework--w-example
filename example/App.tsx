import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Hero } from "./sections/Hero";
import { Features } from "./sections/Features";
import { HowItWorks } from "./sections/HowItWorks";
import { QuickStart } from "./sections/QuickStart";
import { Examples } from "./sections/Examples";
import { ApiDocs } from "./sections/ApiDocs";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <QuickStart />
        <Examples />
        <ApiDocs />
      </main>
      <Footer />
    </div>
  );
}
