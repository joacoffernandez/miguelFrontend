"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Filter, MapPin, Calendar, Users, Sparkles, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { api } from "@/lib/api"
import { NORMALIZED_TAGS } from "@/lib/normalized-tags"


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
  category: string 
}

interface EventCard {
  id: string
  title: string
  shortDescription: string
  date: string
  direction: string
  free: boolean
  price: number
  assistants: number
  image: string
  category: string 
  tags?: string[]
}

const categories = NORMALIZED_TAGS 


interface EventsListProps {
  initialTagFilter?: string
}

export function EventsList({ initialTagFilter }: EventsListProps = {}) {
  const [events, setEvents] = useState<EventCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [freeOnly, setFreeOnly] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTagFilter || null)
  const filtersRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await api.get("/getter/events")

        if (!response.success) {
          throw new Error(`Error ${response.status}: ${response.data}`)
        }

        const data: Event[] = response.data.events
        console.log("Eventos obtenidos:", data)
        

        const transformedEvents: EventCard[] = data.map((event: Event) => ({
          id: event.idEvent,
          title: event.title,
          description: event.description,
          shortDescription: event.shortDescription,
          date: formatDate(event.date), 
          direction: event.direction,
          free: event.free,
          price: event.price || 0,
          assistants: event.assistants,
          image: event.imageURL || "/placeholder-event.jpg", 
          category: event.category,
          tags: [], 
        }))

        setEvents(transformedEvents)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("No se pudieron cargar los eventos. Intenta más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // 📅 Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }
  
  const capitalizeTag = (tag: string) => {
    return tag.charAt(0).toUpperCase() + tag.slice(1)
  }

  // 🔍 Filtrado de eventos
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Todas" || capitalizeTag(event.category.toLowerCase()) === selectedCategory
    const matchesFree = !freeOnly || event.free
    const matchesTag = !selectedTag || (event.tags && event.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase()))

    return matchesSearch && matchesCategory && matchesFree && matchesTag
  })

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    filtersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }


  // ⏳ Estados de carga y error
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#e74c3c]" />
          <h2 className="text-4xl font-bold text-gray-900">Descubre Eventos</h2>
        </div>
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e74c3c] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando eventos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#e74c3c]" />
          <h2 className="text-4xl font-bold text-gray-900">Descubre Eventos</h2>
        </div>
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-red-500 text-lg">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#e74c3c] hover:bg-[#c0392b] text-white"
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#e74c3c]" />
          <h2 className="text-4xl font-bold text-gray-900">Descubre Eventos</h2>

          <div className="flex flex-1 justify-end items-center">
            <Link href="/events/create">
              <Button className="bg-[#e74c3c] hover:bg-[#c0392b] text-white hover:cursor-pointer">
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
              {filteredEvents.length} de {events.length} eventos
            </p>
          </div>
        </div>
      </div>

      {/* 📋 Lista de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <Link
            key={event.id}
            href={`/event/${event.id}`}
            className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#e74c3c]/30"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={event.image 
                  ? `http://localhost:8080${event.image}`
                  : "/placeholder-event.jpg"
                }
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 right-4">
                {event.free ? (
                  <Badge className="bg-green-500 hover:bg-green-600 shadow-lg">Gratis</Badge>
                ) : (
                  <Badge className="bg-[#e74c3c] hover:bg-[#c0392b] shadow-lg">€{event.price}</Badge>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs font-medium border-[#e74c3c]/30 text-[#e74c3c]">
                  {capitalizeTag(event.category.toLowerCase())}
                </Badge>
                {event.tags?.map((tag, index) => (
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
                      {capitalizeTag(event.category)}
                    </Badge>
                  </button>
                ))}
              </div>

              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#e74c3c] transition-colors leading-tight">
                {event.title}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {event.shortDescription}
              </p>

              <div className="space-y-2 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-[#e74c3c]" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#e74c3c]" />
                  <span className="line-clamp-1">{event.direction}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-[#e74c3c]" />
                  <span>{event.assistants} asistentes</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredEvents.length === 0 && !loading && (
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