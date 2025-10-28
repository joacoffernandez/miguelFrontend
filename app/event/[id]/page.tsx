import { notFound } from "next/navigation"
import { Calendar, MapPin, Users, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/components/header"

// Mock data - in real app this would come from a database
const mockEvents = [
  {
    id: 1,
    title: "Tech Summit 2025",
    description: "La conferencia de tecnología más grande del año con speakers internacionales",
    fullDescription:
      "Tech Summit 2025 es el evento tecnológico más esperado del año. Durante dos días completos, tendrás la oportunidad de aprender de los mejores expertos en tecnología, participar en talleres prácticos y hacer networking con profesionales de todo el mundo. El evento incluye conferencias magistrales, paneles de discusión, demostraciones de productos y mucho más.",
    date: "15 de Marzo, 2025",
    time: "09:00 - 18:00",
    location: "Centro de Convenciones, Madrid",
    category: "Tecnología",
    isFree: false,
    price: 150,
    attendees: 500,
    maxAttendees: 800,
    image: "/tech-conference-stage-presentation.jpg",
    organizer: "Tech Events Spain",
    speakers: ["Dr. María García", "John Smith", "Ana Rodríguez"],
    agenda: [
      "09:00 - Registro y bienvenida",
      "10:00 - Keynote: El futuro de la IA",
      "12:00 - Talleres paralelos",
      "14:00 - Almuerzo y networking",
      "16:00 - Panel de discusión",
      "18:00 - Cierre y networking",
    ],
  },
  {
    id: 2,
    title: "Startup Networking",
    description: "Conecta con emprendedores y inversores en un ambiente relajado",
    fullDescription:
      "Un evento diseñado específicamente para emprendedores que buscan conectar con inversores, mentores y otros fundadores. En un ambiente informal y acogedor, tendrás la oportunidad de presentar tu startup, recibir feedback y establecer relaciones valiosas para el crecimiento de tu negocio.",
    date: "22 de Marzo, 2025",
    time: "18:00 - 22:00",
    location: "Hub de Innovación, Barcelona",
    category: "Negocios",
    isFree: true,
    price: 0,
    attendees: 150,
    maxAttendees: 200,
    image: "/startup-networking-event-people.jpg",
    organizer: "Barcelona Startup Hub",
    speakers: ["Carlos Martínez", "Laura Sánchez"],
    agenda: ["18:00 - Registro y bienvenida", "18:30 - Pitch sessions", "20:00 - Networking libre", "21:30 - Cierre"],
  },
]

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = mockEvents.find((e) => e.id === Number.parseInt(params.id))

  if (!event) {
    notFound()
  }

  const spotsLeft = event.maxAttendees - event.attendees

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="px-4 pt-4 md:px-8 md:pt-8">
        <Header />
      </div>

      {/* Event Hero Image */}
      <div className="relative h-96 w-full mt-4">
        <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
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
                  <Badge variant="outline">{event.category}</Badge>
                  {event.isFree ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Gratis</Badge>
                  ) : (
                    <Badge className="bg-[#e74c3c] hover:bg-[#c0392b]">€{event.price}</Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">{event.title}</h1>
                <p className="text-xl text-gray-600 leading-relaxed">{event.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre el Evento</h2>
                <p className="text-gray-700 leading-relaxed">{event.fullDescription}</p>
              </div>

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
                        {event.attendees} / {event.maxAttendees}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{spotsLeft} lugares disponibles</p>
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
}
