"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Clock, User, Mail, Download, Loader2 } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

// Interfaces basadas en tus modelos Prisma
interface TicketDetail {
  idTicketDetail: string
  eventID: string
  ticketID: string
  firstName: string
  lastName: string
  document: number
  amount: number
}


export default function ReservationDetailsPage({ id }: { id: string }) {
  const [ticketDetails, setTicketDetails] = useState<TicketDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const ticketId = id

  // 🔄 Obtener detalles del ticket
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true)
        const result = await api.get(`/getter/ticket/detail/${ticketId}`)
        
        if (!result.success) {
          throw new Error(result.error || "Error al cargar los detalles del ticket")
        }

        console.log("Datos del ticket obtenidos:", result.data.ticketDetail)
        
        // El endpoint devuelve una lista de TicketDetail
        const ticketDetails: TicketDetail[] = result.data.ticketDetail || []

        if (!ticketDetails || ticketDetails.length === 0) {
          throw new Error("No se encontraron detalles del ticket")
        }


        setTicketDetails(ticketDetails)
      } catch (err) {
        console.error("Error fetching ticket details:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchTicketDetails()
  }, [ticketId])

  // 📄 Función para descargar tickets (placeholder)
  const handleDownloadTicket = (ticketId: string) => {
    console.log(`Descargando ticket: ${ticketId}`)
    // Aquí implementarías la lógica real de descarga
    alert(`Descargando ticket ${ticketId}`)
  }

  const handleDownloadAllTickets = () => {
    if (!ticketDetails) return
    console.log(`Descargando todos los tickets para reserva: ${ticketId}`)
    // Aquí implementarías la lógica real de descarga múltiple
    alert(`Descargando ${ticketDetails.length} tickets`)
  }

  // ⏳ Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link
            href="/subscriptions"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Suscripciones
          </Link>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#e74c3c] mx-auto" />
                <p className="mt-4 text-gray-600">Cargando detalles del ticket...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ❌ Manejo de errores
  if (error || !ticketDetails || ticketDetails.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link
            href="/subscriptions"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Suscripciones
          </Link>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-red-500 text-lg mb-4">
              {error || "No se pudieron cargar los detalles del ticket"}
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#e74c3c] hover:bg-[#c0392b] text-white"
            >
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-4 pt-4 md:px-8 md:pt-8">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/subscriptions"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Suscripciones
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Detalles de la Inscripción</h1>
            <p className="text-gray-600">Información de tus entradas reservadas</p>
          </div>

          {/* Tickets */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Entradas Reservadas</h2>
              <Badge className="bg-[#e74c3c] hover:bg-[#c0392b]">
                {ticketDetails.length} {ticketDetails.length === 1 ? "entrada" : "entradas"}
              </Badge>
            </div>

            <div className="space-y-4">
              {ticketDetails.map((ticket, index) => (
                <div key={ticket.idTicketDetail} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Participante #{index + 1}
                      </h3>
                      <p className="text-sm text-gray-500">{`TKT-${ticket.ticketID?.slice(-6) || 'XXXXXX'}-${(index + 1).toString().padStart(3, '0')}`}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 bg-transparent"
                      onClick={() => handleDownloadTicket(ticket.idTicketDetail)}
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Nombre</p>
                        <p className="font-medium text-gray-900">{ticket.firstName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Apellido</p>
                        <p className="font-medium text-gray-900">{ticket.lastName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Documento</p>
                        <p className="font-medium text-gray-900">{ticket.document}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-[#e74c3c] hover:bg-[#c0392b] text-white"
              onClick={handleDownloadAllTickets}
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar Todas las Entradas
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}