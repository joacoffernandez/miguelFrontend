import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Calendar, Users, Ticket } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Logo/Brand */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-12 h-12 text-[#e74c3c]" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 tracking-tight">Migueventos</h1>
            <p className="text-2xl md:text-3xl text-gray-600 font-light">Una web para tus eventos</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <Calendar className="w-10 h-10 text-[#e74c3c] mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Descubre Eventos</h3>
              <p className="text-sm text-gray-600">Encuentra conferencias, talleres y networking</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <Ticket className="w-10 h-10 text-[#e74c3c] mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Reserva Fácil</h3>
              <p className="text-sm text-gray-600">Gestiona tus entradas en un solo lugar</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <Users className="w-10 h-10 text-[#e74c3c] mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Conecta</h3>
              <p className="text-sm text-gray-600">Conoce personas con tus mismos intereses</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-[#e74c3c] hover:bg-[#c0392b] text-white px-12 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#e74c3c] text-[#e74c3c] hover:bg-[#e74c3c] hover:text-white px-12 py-6 text-lg font-semibold transition-all bg-transparent"
              >
                Crear Cuenta
              </Button>
            </Link>
          </div>

          {/* Footer text */}
          <p className="text-sm text-gray-500 pt-8">Únete a miles de personas que ya disfrutan de nuestros eventos</p>
        </div>
      </div>
    </div>
  )
}
