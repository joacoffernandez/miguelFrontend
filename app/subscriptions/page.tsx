"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { Calendar, MapPin, Clock, Download, X } from "lucide-react"
import Link from "next/link"

// Mock data for user's subscribed events
const initialEvents = [
  {
    id: 2,
    title: "Startup Networking",
    date: "22 de Marzo, 2025",
    time: "18:00 - 22:00",
    location: "Hub de Innovación, Barcelona",
    category: "Negocios",
    isFree: true,
    status: "confirmed",
    image: "/startup-networking-event.png",
  },
  {
    id: 5,
    title: "Open Source Meetup",
    date: "18 de Abril, 2025",
    time: "19:00 - 22:00",
    location: "Coworking Tech, Bilbao",
    category: "Tecnología",
    isFree: true,
    status: "confirmed",
    image: "/developers-meetup.jpg",
  },
]

export default function SubscriptionsPage() {
  const [subscribedEvents, setSubscribedEvents] = useState(initialEvents)

  const handleCancelEvent = (eventId: number) => {
    if (confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
      setSubscribedEvents(subscribedEvents.filter((event) => event.id !== eventId))
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Mis Suscripciones</h1>
              <p className="text-gray-600 mt-2">Eventos a los que vas a asistir</p>
            </div>
            <Badge className="bg-[#e74c3c] hover:bg-[#c0392b] text-lg px-4 py-2">
              {subscribedEvents.length} eventos
            </Badge>
          </div>

          <WeeklyCalendar events={subscribedEvents} />

          {subscribedEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No tienes eventos reservados</p>
              <Button className="bg-[#e74c3c] hover:bg-[#c0392b] text-white" asChild>
                <Link href="/events">Explorar Eventos</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {subscribedEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Event Image */}
                    <div className="md:w-64 h-48 md:h-auto">
                      <img
                        src={event.image || "/placeholder.svg"}
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
                            <Badge className="bg-green-500 hover:bg-green-600">
                              {event.status === "confirmed" ? "Confirmado" : "Pendiente"}
                            </Badge>
                            {event.isFree && <Badge className="bg-blue-500 hover:bg-blue-600">Gratuito</Badge>}
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
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                          <Download className="w-4 h-4" />
                          Descargar Entrada
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/event/${event.id}`}>Ver Detalles</Link>
                        </Button>
                        {event.isFree && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                            onClick={() => handleCancelEvent(event.id)}
                          >
                            <X className="w-4 h-4" />
                            Cancelar Reserva
                          </Button>
                        )}
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
