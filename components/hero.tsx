import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url(/Evento-corporativo-1280x720.jpg)",
          filter: "blur(0px)",
          transform: "scale(1.1)",
        }}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content box */}
      <div className="relative z-10 mx-4 rounded-3xl px-10 py-5 text-center">
        <h1 className="text-5xl text-white md:text-8xl font-bold mb-6 text-balance">Migueventos</h1>
        <p className="text-xl text-white font-bold mb-8 leading-relaxed">
          ¡Tu próxima gran oportunidad te espera!
        </p>

      </div>
    </section>
  )
}
