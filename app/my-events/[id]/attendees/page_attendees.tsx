"use client"

import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Download, Mail, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
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

interface Event {
  idEvent: string
  title: string
  description: string
  shortDescription: string
  date: string
  direction: string
  free: boolean
  price: number | null
  assistants: number
  cancelled: boolean
  completed: boolean
  imageURL: string | null
  creatorID: string
}

interface EventDetailsResponse {
  event: Event
  attendees: TicketDetail[]
}

interface FormattedAttendee {
  id: string
  name: string
  lastName: string
  dni: string
  ticketNumber: string
}

export default function AttendeesPage({ id }: {  id: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [attendees, setAttendees] = useState<FormattedAttendee[]>([])
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const eventId = id

  // 🔄 Obtener detalles del evento y asistentes
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true)
        const result = await api.get(`/getter/event/${eventId}/details`)

        const eventRes = await api.get(`/getter/event/${eventId}`)
        
        if (!result.success || !eventRes.success) {
          throw new Error(result.error || "Error al cargar los detalles del evento")
        }

        console.log("Datos del evento obtenidos:", result.data.ticketDetails)
        const eventDetails: TicketDetail[] = result.data.ticketDetails

        console.log("Datos del evento obtenidos:", eventRes.data.event)
        const event = eventRes.data.event

        if (!eventDetails) {
          throw new Error("Evento no encontrado")
        }

        setEvent(event)


        const formattedAttendees: FormattedAttendee[] = eventDetails.map((attendee, index) => {
          return {
            id: attendee.idTicketDetail,
            name: attendee.firstName,
            lastName: attendee.lastName,
            dni: attendee.document.toString(),
            ticketNumber: `TKT-${attendee.ticketID?.slice(-6) || 'XXXXXX'}-${(index + 1).toString().padStart(3, '0')}`,
          }
        })

        setAttendees(formattedAttendees)
      } catch (err) {
        console.error("Error fetching event details:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [eventId])

  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.dni.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 📄 Función para exportar lista (placeholder)
  const handleExportList = () => {
    console.log("Exportando lista de asistentes...")
    // Aquí implementarías la lógica real de exportación
    alert(`Exportando lista de ${attendees.length} asistentes`)
  }

  // ⏳ Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Link
            href="/my-events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Mis Eventos
          </Link>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#e74c3c] mx-auto" />
                <p className="mt-4 text-gray-600">Cargando asistentes...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ❌ Manejo de errores
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Link
            href="/my-events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Mis Eventos
          </Link>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-red-500 text-lg mb-4">
              {error || "No se pudieron cargar los asistentes"}
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

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Link
          href="/my-events"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Mis Eventos
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <p className="text-gray-600 mt-2">Lista de personas inscritas</p>
            </div>
            <Badge className="bg-[#e74c3c] hover:bg-[#c0392b] text-lg px-4 py-2">
              {event.assistants} inscritos
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por nombre, email o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              className="bg-[#e74c3c] hover:bg-[#c0392b] text-white"
              onClick={handleExportList}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Lista
            </Button>
          </div>

          <div className="space-y-4">
            {filteredAttendees.map((attendee) => (
              <div
                key={attendee.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {attendee.name} {attendee.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">Ticket: {attendee.ticketNumber}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-15">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span className="text-sm">DNI: {attendee.dni}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAttendees.length === 0 && attendees.length > 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron resultados para "{searchTerm}"</p>
            </div>
          )}

          {attendees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aún no hay asistentes inscritos en este evento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}