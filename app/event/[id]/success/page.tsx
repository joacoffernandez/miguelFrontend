import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Mail } from "lucide-react"
import Link from "next/link"

export default function SuccessPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-4 pt-4 md:px-8 md:pt-8">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Reserva Confirmada!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Tu entrada ha sido confirmada exitosamente. Te hemos enviado un email con todos los detalles.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 space-y-4">
            <div className="flex items-center gap-3 justify-center text-gray-700">
              <Mail className="w-5 h-5 text-[#e74c3c]" />
              <span>Revisa tu email para más información</span>
            </div>
            <div className="flex items-center gap-3 justify-center text-gray-700">
              <Calendar className="w-5 h-5 text-[#e74c3c]" />
              <span>Añade el evento a tu calendario</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#e74c3c] hover:bg-[#c0392b] text-white" asChild>
              <Link href="/subscriptions">Ver Mis Eventos</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">Explorar Más Eventos</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
