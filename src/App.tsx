import MainSection from "./feature/home/components/MainSection";
import ScrollAnimation from "./feature/home/components/ScrollAnimation";

function App() {
  return (
    <>
      <header></header>
      <main>
        <div className="min-h-screen relative overflow-hidden">
          <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
            <div
              className="relative z-20 text-center"
              style={{
                transform: `translateY(${Math.min(scrollY * 0.1, 20)}px)`,
              }}
            >
              <MainSection />
            </div>
            <ScrollAnimation />
          </section>
        </div>
        <section></section>
      </main>
    </>
  );
}

export default App;
