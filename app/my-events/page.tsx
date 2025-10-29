"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Users, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
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
}

interface FormattedEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  category: string
  price: number
  attendees: number
  maxAttendees: number
  image: string
  free: boolean
}

export default function MyEventsPage() {
  const [myEvents, setMyEvents] = useState<FormattedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        setLoading(true)
        const result = await api.get("/getter/myEvents")
        
        if (!result.success) {
          throw new Error(result.error || "Error al cargar tus eventos")
        }

        console.log("Eventos obtenidos:", result.data.events)
        const eventsData: Event[] = result.data.events || []

        const formattedEvents: FormattedEvent[] = eventsData.map(event => {
          const eventDate = new Date(event.date)
          
         
          const formatDate = (date: Date) => {
            const months = [
              "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
              "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
            ]
            return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`
          }

       
          const formatTime = (date: Date) => {
            const startTime = date.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit"
            })
          
            const endTime = new Date(date.getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit"
            })
            return `${startTime} - ${endTime}`
          }

          return {
            id: event.idEvent,
            title: event.title,
            date: formatDate(eventDate),
            time: formatTime(eventDate),
            location: event.direction,
            category: "General", 
            price: event.price || 0,
            attendees: event.assistants,
            maxAttendees: event.assistants + 50, 
            image: event.imageURL || "/placeholder-event.jpg",
            free: event.free
          }
        })

        setMyEvents(formattedEvents)
      } catch (err) {
        console.error("Error fetching my events:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchMyEvents()
  }, [])

  const handleDeleteEvent = async (eventId: string) => {
      try {
     
        const response = await api.delete(`/event/delete/${eventId}`)

        if (!response.success) {
          throw new Error(response.error || "Error al cancelar el evento")
        }

        setMyEvents(prev => prev.filter((event) => event.id !== eventId))
        
        console.log(`Evento ${eventId} cancelado`)
      } catch (err) {
        console.error("Error deleting event:", err)
      }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#e74c3c] mx-auto" />
                <p className="mt-4 text-gray-600">Cargando tus eventos...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ❌ Manejo de errores
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-red-500 text-lg mb-4">
              {error}
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
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Eventos</h1>
              <p className="text-gray-600 mt-2">Eventos que has creado</p>
            </div>
            <Badge className="bg-[#e74c3c] hover:bg-[#c0392b] text-lg px-4 py-2">
              {myEvents.length} eventos
            </Badge>
          </div>

          {myEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No has creado ningún evento</p>
              <Button className="bg-[#e74c3c] hover:bg-[#c0392b] text-white" asChild>
                <Link href="/events/create">Crear Evento</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {myEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Event Image */}
                    <div className="md:w-64 h-48 md:h-auto">
                      <img
                        src={event.image 
                        ? `http://localhost:8080${event.image}`
                        : "/placeholder-event.jpg"
                      }
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{event.category}</Badge>
                            {event.free ? (
                              <Badge className="bg-green-500 hover:bg-green-600">Gratis</Badge>
                            ) : (
                              <Badge className="bg-[#e74c3c] hover:bg-[#c0392b]">€{event.price}</Badge>
                            )}
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>
                            {event.attendees} / {event.maxAttendees} inscritos
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/my-events/${event.id}/attendees`}>
                            <Users className="w-4 h-4 mr-2" />
                            Ver Inscritos
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/event/${event.id}`}>Ver Detalles</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 hover:cursor-pointer bg-transparent"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Cancelar Evento
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}