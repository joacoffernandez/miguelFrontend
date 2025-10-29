import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uZmVyZW5jZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60')",
          transform: "scale(1.1)",
        }}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content box */}
      <div className="relative z-10 absolute mx-4 backdrop-blur-sm rounded-xl p-4 bg-[#00000033] text-center flex flex-col items-center ">
        <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 text-balance">Migu<span className="text-[#e74c3c]">eventos</span></h1>
        <p className="text-xl font-bold text-gray-300 max-w-2xl mb-8 leading-relaxed">
          Únete a líderes de la industria e innovadores para una experiencia inolvidable. Conecta, aprende y crece en el
          evento principal del año.
        </p>
      </div>
    </section>
  )
}
