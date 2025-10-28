"use client"

import { useState, useRef } from "react"
import { Search, Filter, MapPin, Calendar, Users, Sparkles, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock data for events
const mockEvents = [
  {
    id: 1,
    title: "Tech Summit 2025",
    description: "La conferencia de tecnología más grande del año con speakers internacionales",
    date: "15 de Marzo, 2025",
    location: "Centro de Convenciones, Madrid",
    tags: ["Tecnología", "Innovación", "Networking", "Conferencia"], // Updated to include multiple tags
    isFree: false,
    price: 150,
    attendees: 500,
    image: "/tech-conference-stage-presentation.jpg",
  },
  {
    id: 2,
    title: "Startup Networking",
    description: "Conecta con emprendedores y inversores en un ambiente relajado",
    date: "22 de Marzo, 2025",
    location: "Hub de Innovación, Barcelona",
    tags: ["Negocios", "Networking", "Startups", "Emprendimiento"], // Updated to include multiple tags
    isFree: true,
    price: 0,
    attendees: 150,
    image: "/startup-networking-event-people.jpg",
  },
  {
    id: 3,
    title: "Design Workshop",
    description: "Aprende las últimas tendencias en diseño UX/UI con expertos",
    date: "5 de Abril, 2025",
    location: "Espacio Creativo, Valencia",
    tags: ["Diseño", "UX", "UI", "Workshop", "Creatividad"], // Updated to include multiple tags
    isFree: false,
    price: 75,
    attendees: 80,
    image: "/design-workshop-creative-space.jpg",
  },
  {
    id: 4,
    title: "Marketing Digital 360",
    description: "Estrategias de marketing digital para el 2025",
    date: "12 de Abril, 2025",
    location: "Hotel Ejecutivo, Sevilla",
    tags: ["Marketing", "Digital", "Estrategia", "Redes Sociales"], // Updated to include multiple tags
    isFree: false,
    price: 120,
    attendees: 200,
    image: "/marketing-conference-presentation.jpg",
  },
  {
    id: 5,
    title: "Open Source Meetup",
    description: "Comunidad de desarrolladores compartiendo proyectos open source",
    date: "18 de Abril, 2025",
    location: "Coworking Tech, Bilbao",
    tags: ["Tecnología", "Open Source", "Desarrollo", "Comunidad"], // Updated to include multiple tags
    isFree: true,
    price: 0,
    attendees: 100,
    image: "/developers-meetup-coding.jpg",
  },
  {
    id: 6,
    title: "AI & Machine Learning",
    description: "Descubre el futuro de la inteligencia artificial",
    date: "25 de Abril, 2025",
    location: "Universidad Politécnica, Madrid",
    tags: ["Tecnología", "IA", "Machine Learning", "Futuro"], // Updated to include multiple tags
    isFree: false,
    price: 200,
    attendees: 300,
    image: "/artificial-intelligence-conference.jpg",
  },
]

const categories = ["Todas", "Futuro", "Tecnología", "Comunidad", "Conferencia", "Negocios", "Diseño", "Marketing"]

interface EventsListProps {
  initialTagFilter?: string
}

export function EventsList({ initialTagFilter }: EventsListProps = {}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [freeOnly, setFreeOnly] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTagFilter || null)
  const filtersRef = useRef<HTMLDivElement>(null)

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Todas" || event.tags.includes(selectedCategory)
    const matchesFree = !freeOnly || event.isFree
    const matchesTag = !selectedTag || event.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())

    return matchesSearch && matchesCategory && matchesFree && matchesTag
  })

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    filtersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const capitalizeTag = (tag: string) => {
    return tag.charAt(0).toUpperCase() + tag.slice(1)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#e74c3c]" />
          <h2 className="text-4xl font-bold text-gray-900">Descubre Eventos</h2>

          <div className="flex flex-1 justify-end items-center">
            <Link href="/events/create">
              <Button className="bg-[#e74c3c] hover:bg-[#c0392b] text-white">
                <Plus className="w-5 h-5 mr-2" />
                Crear Evento
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          Encuentra el evento perfecto para ti. Explora conferencias, talleres y networking.
        </p>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nombre, descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-base shadow-sm border-gray-200 focus:border-[#e74c3c] focus:ring-[#e74c3c]"
          />
        </div>

        <div ref={filtersRef} className="bg-gray-50 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Filtrar por:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`transition-all ${
                  selectedCategory === category
                    ? "bg-[#e74c3c] hover:bg-[#c0392b] shadow-md"
                    : "hover:border-[#e74c3c] hover:text-[#e74c3c]"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {selectedTag && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Filtrando por tag:</span>
              <Badge className="bg-[#e74c3c] hover:bg-[#c0392b]">{capitalizeTag(selectedTag)}</Badge>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTag(null)} className="h-6 px-2 text-xs">
                Limpiar
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
            <Button
              variant={freeOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setFreeOnly(!freeOnly)}
              className={`transition-all ${
                freeOnly ? "bg-green-500 hover:bg-green-600 shadow-md" : "hover:border-green-500 hover:text-green-600"
              }`}
            >
              Solo Eventos Gratis
            </Button>
            <p className="text-sm text-gray-600">
              {filteredEvents.length} de {mockEvents.length} eventos
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <Link
            key={event.id}
            href={`/event/${event.id}`}
            className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#e74c3c]/30"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 right-4">
                {event.isFree ? (
                  <Badge className="bg-green-500 hover:bg-green-600 shadow-lg">Gratis</Badge>
                ) : (
                  <Badge className="bg-[#e74c3c] hover:bg-[#c0392b] shadow-lg">€{event.price}</Badge>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {event.tags.map((tag, index) => (
                  <button
                    key={tag}
                    onClick={(e) => {
                      e.preventDefault()
                      handleTagClick(tag)
                    }}
                    className="transition-all hover:scale-105"
                  >
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium cursor-pointer ${
                        index === 0
                          ? "bg-[#e74c3c]/10 border-[#e74c3c] text-[#e74c3c] font-semibold"
                          : "border-gray-300 text-gray-600 hover:border-[#e74c3c]/50 hover:text-[#e74c3c]"
                      }`}
                    >
                      {capitalizeTag(tag)}
                    </Badge>
                  </button>
                ))}
              </div>

              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#e74c3c] transition-colors leading-tight">
                {event.title}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{event.description}</p>

              <div className="space-y-2 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-[#e74c3c]" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#e74c3c]" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-[#e74c3c]" />
                  <span>{event.attendees} asistentes</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-gray-500 text-lg">No se encontraron eventos con los filtros seleccionados</p>
          <Button
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("Todas")
              setFreeOnly(false)
              setSelectedTag(null)
            }}
            variant="outline"
            className="mt-4"
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
