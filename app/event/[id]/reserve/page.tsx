"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ReservationForm } from "@/components/reservation-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock event data
const mockEvent = {
  id: 2,
  title: "Startup Networking",
  date: "22 de Marzo, 2025",
  location: "Hub de Innovación, Barcelona",
}

export default function ReservePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [ticketCount, setTicketCount] = useState<number>(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate reservation processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to success page
    router.push(`/event/${params.id}/success`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-4 pt-4 md:px-8 md:pt-8">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          href={`/event/${params.id}`}
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
              <p className="text-gray-600">Evento gratuito - Solo necesitamos tus datos</p>
            </div>
          </div>

          {/* Event Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-2">{mockEvent.title}</h2>
            <p className="text-sm text-gray-600">{mockEvent.date}</p>
            <p className="text-sm text-gray-600">{mockEvent.location}</p>
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
                <ReservationForm key={index} index={index} />
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Evento gratuito:</strong> No se requiere pago. Tu entrada será confirmada inmediatamente.
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
                : `Confirmar ${ticketCount} ${ticketCount === 1 ? "Reserva" : "Reservas"}`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
