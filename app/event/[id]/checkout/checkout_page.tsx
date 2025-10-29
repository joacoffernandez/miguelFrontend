"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Lock, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReservationForm } from "@/components/reservation-form"
import { api } from "@/lib/api"


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

export default function CheckoutPage({ id }: { id: string } ) {
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
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ]
    return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`
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

  const validatePayment = (): boolean => {
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!event) return


    if (!validateForms()) {
      return
    }

    if (!validatePayment()) {
      setError("Por favor, completa correctamente los datos de pago")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const participantsDetails: ParticipantDetail[] = participantsData.map(participant => ({
        firstName: participant.firstName.trim(),
        lastName: participant.lastName.trim(),
        document: parseInt(participant.document.trim())
      }))

      const requestData = {
        participants: ticketCount,
        participantsDetails: participantsDetails
      }

      console.log("Enviando datos de pago y reserva:", requestData)

      const result = await api.post(`/event/access/${eventId}`, requestData)

      if (!result.success) {
        throw new Error(result.error || "Error al procesar el pago y la reserva")
      }

      router.push(`/event/${eventId}/success`)

    } catch (err) {
      console.error("Error processing payment:", err)
      setError(err instanceof Error ? err.message : "Error al procesar el pago")
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
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link
            href={`/event/${eventId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al evento
          </Link>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#e74c3c] mx-auto" />
                <p className="mt-4 text-gray-600">Cargando evento...</p>
              </div>
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
        <div className="container mx-auto px-4 py-12 max-w-4xl">
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
        <div className="container mx-auto px-4 py-12 max-w-4xl">
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
        <div className="container mx-auto px-4 py-12 max-w-4xl">
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


  if (event?.free) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link
            href={`/event/${eventId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al evento
          </Link>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-blue-500 text-lg mb-4">
              Este evento es gratuito. Debes usar la reserva gratuita.
            </div>
            <Button
              onClick={() => router.push(`/event/${eventId}/reserve`)}
              className="bg-[#e74c3c] hover:bg-[#c0392b] text-white"
            >
              Ir a Reserva Gratuita
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = (event?.price || 0) * ticketCount
  const processingFee = 5 
  const finalTotal = totalPrice + processingFee

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-4 pt-4 md:px-8 md:pt-8">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href={`/event/${eventId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e74c3c] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al evento
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#e74c3c] rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pago del Evento</h1>
              <p className="text-gray-600">Completa tu compra de forma segura</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
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
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de los Asistentes</h2>
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

                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Información de Pago</h2>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                    <Input id="cardNumber" required placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Fecha de Expiración</Label>
                      <Input id="expiry" required placeholder="MM/AA" maxLength={5} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" required placeholder="123" maxLength={3} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>Tu pago está protegido con encriptación SSL</span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing}
                  className="w-full bg-[#e74c3c] hover:bg-[#c0392b] text-white font-semibold"
                >
                  {isProcessing ? "Procesando..." : `Pagar €${finalTotal}`}
                </Button>
              </form>
            </div>

    
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900">Resumen</h2>

                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{event?.title}</p>
                    <p className="text-sm text-gray-600">{event && formatDate(event.date)}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Entrada (x{ticketCount})</span>
                      <span className="text-gray-900">€{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gastos de gestión</span>
                      <span className="text-gray-900">€{processingFee}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-xl text-[#e74c3c]">€{finalTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}