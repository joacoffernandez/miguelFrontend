"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock event data
const mockEvent = {
  id: 1,
  title: "Tech Summit 2025",
  date: "15 de Marzo, 2025",
  price: 150,
}

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to success page
    router.push(`/event/${params.id}/success`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-4 pt-4 md:px-8 md:pt-8">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href={`/event/${params.id}`}
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" required placeholder="Juan" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos</Label>
                      <Input id="lastName" required placeholder="Pérez" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required placeholder="juan@ejemplo.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" type="tel" required placeholder="+34 600 000 000" />
                  </div>
                </div>

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
                  {isProcessing ? "Procesando..." : `Pagar €${mockEvent.price}`}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900">Resumen</h2>

                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{mockEvent.title}</p>
                    <p className="text-sm text-gray-600">{mockEvent.date}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Entrada (x1)</span>
                      <span className="text-gray-900">€{mockEvent.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gastos de gestión</span>
                      <span className="text-gray-900">€5</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-xl text-[#e74c3c]">€{mockEvent.price + 5}</span>
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
