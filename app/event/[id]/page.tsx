import { notFound } from "next/navigation"
import { Calendar, MapPin, Users, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/components/header"
import { api } from "@/lib/api"

// Interface basada en tu modelo Prisma
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
  user?: {
    name: string
    email: string
  }
}

interface EventDetailProps {
  id: string
  title: string
  description: string
  shortDescription: string
  date: string
  time: string
  location: string
  isFree: boolean
  price: number
  attendees: number
  cancelled: boolean
  completed: boolean
  image: string
  organizer: string
  fullDescription?: string
  speakers?: string[]
  agenda?: string[]
  maxAttendees?: number
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  try {
    const response = await api.get(`/getter/event/${id}`)

    if (!response.success) {
      if (response.status === 404) {
        notFound()
      }
      throw new Error(`Error ${response.status}: ${response.data}`)
    }

    const eventData: Event = response.data.event

    // 📅 Formatear fecha y hora
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    }

    const formatTime = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit"
      })
    }

    // 🎯 Transformar datos del backend al formato del componente
    const event: EventDetailProps = {
      id: eventData.idEvent,
      title: eventData.title,
      description: eventData.shortDescription,
      shortDescription: eventData.shortDescription,
      fullDescription: eventData.description,
      date: formatDate(eventData.date),
      time: formatTime(eventData.date),
      location: eventData.direction,
      isFree: eventData.free,
      price: eventData.price || 0,
      attendees: eventData.assistants,
      image: eventData.imageURL || "/placeholder-event.jpg",
      organizer: eventData.user?.name || "Organizador",
      speakers: [], // Puedes obtener esto de otra API si es necesario
      agenda: [], // Puedes obtener esto de otra API si es necesario
      maxAttendees: eventData.assistants + 50, // Valor por defecto, ajusta según tu lógica
      cancelled: eventData.cancelled,
      completed: eventData.completed
    }

    const spotsLeft = event.maxAttendees ? event.maxAttendees - event.attendees : 0

    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>

        {/* Event Hero Image */}
        <div className="relative h-96 w-full mt-4">
          <img 
            src={event.image 
              ? `http://localhost:8080${event.image}`
              : "/placeholder-event.jpg"
            }
            alt={event.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative -mt-32 mx-4 md:mx-8 bg-white rounded-t-3xl shadow-2xl">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {/* Removido Badge de categoría ya que no está en el modelo */}
                    {event.isFree ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Gratis</Badge>
                    ) : (
                      <Badge className="bg-[#e74c3c] hover:bg-[#c0392b]">€{event.price}</Badge>
                    )}
                    {event.cancelled && (
                      <Badge className="bg-red-500 hover:bg-red-600">Cancelado</Badge>
                    )}
                    {event.completed && (
                      <Badge className="bg-gray-500 hover:bg-gray-600">Completado</Badge>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">{event.title}</h1>
                  <p className="text-xl text-gray-600 leading-relaxed">{event.description}</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre el Evento</h2>
                  <p className="text-gray-700 leading-relaxed break-words overflow-x-auto">{event.fullDescription}</p>
                </div>

                {/* Sección de Agenda - Solo si hay datos */}
                {event.agenda && event.agenda.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Agenda</h2>
                    <ul className="space-y-3">
                      {event.agenda.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-[#e74c3c] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sección de Speakers - Solo si hay datos */}
                {event.speakers && event.speakers.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Speakers</h2>
                    <div className="flex flex-wrap gap-2">
                      {event.speakers.map((speaker, index) => (
                        <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                          {speaker}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#e74c3c] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fecha</p>
                        <p className="text-gray-900 font-medium">{event.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#e74c3c] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Horario</p>
                        <p className="text-gray-900 font-medium">{event.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#e74c3c] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Ubicación</p>
                        <p className="text-gray-900 font-medium">{event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-[#e74c3c] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Asistentes</p>
                        <p className="text-gray-900 font-medium">
                          {event.attendees} {event.maxAttendees && `/ ${event.maxAttendees}`}
                        </p>
                        {event.maxAttendees && (
                          <p className="text-sm text-gray-600 mt-1">{spotsLeft} lugares disponibles</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Tag className="w-5 h-5 text-[#e74c3c] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Organizador</p>
                        <p className="text-gray-900 font-medium">{event.organizer}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 space-y-3">
                    {event.isFree ? (
                      <>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600 mb-1">Gratis</p>
                          <p className="text-sm text-gray-600">Evento sin costo</p>
                        </div>
                        <Button
                          size="lg"
                          className="w-full bg-[#e74c3c] hover:bg-[#c0392b] text-white font-semibold"
                          asChild
                        >
                          <Link href={`/event/${event.id}/reserve`}>Reservar Entrada</Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-gray-900 mb-1">€{event.price}</p>
                          <p className="text-sm text-gray-600">Por persona</p>
                        </div>
                        <Button
                          size="lg"
                          className="w-full bg-[#e74c3c] hover:bg-[#c0392b] text-white font-semibold"
                          asChild
                        >
                          <Link href={`/event/${event.id}/checkout`}>Comprar Entrada</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  } catch (error) {
    console.error("Error fetching event:", error)
    notFound()
  }
}