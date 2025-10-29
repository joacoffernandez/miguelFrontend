"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ReservationForm } from "@/components/reservation-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
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

interface ParticipantDetail {
  firstName: string
  lastName: string
  document: number
}

interface ReservationFormData {
  firstName: string
  lastName: string
  document: string
}

export default function ReservePage({ id }: {  id: string  }) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [ticketCount, setTicketCount] = useState<number>(1)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [participantsData, setParticipantsData] = useState<ReservationFormData[]>([])

  const eventId = id


  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const result = await api.get(`/getter/event/${eventId}`)
        
        if (!result.success) {
          throw new Error(result.error || "Error al cargar el evento")
        }

        if (!result.data) {
          throw new Error("Evento no encontrado")
        }

        setEvent(result.data.event)
      } catch (err) {
        console.error("Error fetching event:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])


  useEffect(() => {
    const initialData = Array.from({ length: ticketCount }, () => ({
      firstName: "",
      lastName: "",
      document: ""
    }))
    setParticipantsData(initialData)
  }, [ticketCount])


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }


  const updateParticipantData = (index: number, field: keyof ReservationFormData, value: string) => {
    setParticipantsData(prev => {
      const newData = [...prev]
      newData[index] = {
        ...newData[index],
        [field]: value
      }
      return newData
    })
  }


  const validateForms = (): boolean => {

    for (let i = 0; i < participantsData.length; i++) {
      const participant = participantsData[i]
      if (!participant.firstName.trim() || !participant.lastName.trim() || !participant.document.trim()) {
        setError(`Por favor, completa todos los campos del participante ${i + 1}`)
        return false
      }
      if (participant.document.trim().length > 8) {
        setError(`El DNI debe tener como maximo 8 numeros`)
      }
    }
    return true
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!event) return


    if (!validateForms()) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {

      const participantsDetails: ParticipantDetail[] = participantsData.map(participant => ({
        firstName: participant.firstName.trim(),
        lastName: participant.lastName.trim(),
        document: parseInt(participant.document.trim())
      }))

      const requestData = {
        participants: ticketCount,
        participantsDetails: participantsDetails
      }

      console.log("Enviando datos de reserva:", requestData)


      const result = await api.post(`/event/access/${eventId}`, requestData)

      if (!result.success) {
        throw new Error(result.error || "Error al procesar la reserva")
      }

      router.push(`/event/${eventId}/success`)

    } catch (err) {
      console.error("Error processing reservation:", err)
      setError(err instanceof Error ? err.message : "Error al procesar la reserva")
    } finally {
      setIsProcessing(false)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#e74c3c] mx-auto" />
              <p className="mt-4 text-gray-600">Cargando evento...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }


  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a eventos
          </Link>
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


  if (event?.cancelled) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Link
            href={`/event/${eventId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al evento
          </Link>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-red-500 text-lg mb-4">
              Este evento ha sido cancelado
            </div>
            <Button
              onClick={() => router.push("/events")}
              className="bg-[#e74c3c] hover:bg-[#c0392b] text-white"
            >
              Ver otros eventos
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (event?.completed) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Link
            href={`/event/${eventId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al evento
          </Link>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-gray-500 text-lg mb-4">
              Este evento ya ha finalizado
            </div>
            <Button
              onClick={() => router.push("/events")}
              className="bg-[#e74c3c] hover:bg-[#c0392b] text-white"
            >
              Ver eventos activos
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

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          href={`/event/${eventId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al evento
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reservar Entrada</h1>
              <p className="text-gray-600">
                {event?.free 
                  ? "Evento gratuito - Solo necesitamos tus datos" 
                  : `Evento - €${event?.price} por entrada`
                }
              </p>
            </div>
          </div>

  
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-2">{event?.title}</h2>
            <p className="text-sm text-gray-600">{event && formatDate(event.date)}</p>
            <p className="text-sm text-gray-600">{event?.direction}</p>
            <p className="text-sm text-gray-600 mt-2">
              {event?.assistants} personas ya confirmadas
            </p>
          </div>

          <div className="mb-8">
            <Label htmlFor="ticketCount" className="text-base font-semibold mb-3 block">
              Cantidad de Entradas
            </Label>
            <Select value={ticketCount.toString()} onValueChange={(value) => setTicketCount(Number(value))}>
              <SelectTrigger id="ticketCount" className="w-full md:w-64">
                <SelectValue placeholder="Selecciona cantidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 entrada</SelectItem>
                <SelectItem value="2">2 entradas</SelectItem>
                <SelectItem value="3">3 entradas</SelectItem>
                <SelectItem value="4">4 entradas</SelectItem>
                <SelectItem value="5">5 entradas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {Array.from({ length: ticketCount }, (_, index) => (
                <ReservationForm 
                  key={index} 
                  index={index}
                  onDataChange={(field, value) => updateParticipantData(index, field, value)}
                />
              ))}
            </div>

          
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className={`border rounded-lg p-4 ${
              event?.free 
                ? "bg-green-50 border-green-200" 
                : "bg-blue-50 border-blue-200"
            }`}>
              <p className={`text-sm ${
                event?.free ? "text-green-800" : "text-blue-800"
              }`}>
                <strong>
                  {event?.free ? "Evento gratuito" : `Precio: €${event?.price} por entrada`}
                </strong>
                {event?.free 
                  ? ": No se requiere pago. Tu entrada será confirmada inmediatamente." 
                  : ": El pago se procesará en el siguiente paso."
                }
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isProcessing}
              className="w-full bg-[#e74c3c] hover:bg-[#c0392b] text-white font-semibold"
            >
              {isProcessing
                ? "Procesando..."
                : event?.free
                  ? `Confirmar ${ticketCount} ${ticketCount === 1 ? "Reserva" : "Reservas"}`
                  : `Continuar al Pago - €${(event?.price || 0) * ticketCount}`
              }
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}