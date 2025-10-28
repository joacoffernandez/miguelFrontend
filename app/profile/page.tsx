"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Wallet, LogOut } from "lucide-react"

export default function ProfilePage() {
  const [credits, setCredits] = useState(250)
  const [creditAmount, setCreditAmount] = useState("")
  const router = useRouter()

  const userData = {
    firstName: "Juan",
    lastName: "Pérez García",
    username: "juanperez",
    email: "juan@ejemplo.com",
    dni: "12345678A", // Added DNI field
  }

  const handleAddCredits = () => {
    const amount = Number.parseFloat(creditAmount)
    if (!isNaN(amount) && amount > 0) {
      setCredits(credits + amount)
      setCreditAmount("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-4 pt-4 md:px-8 md:pt-8">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#e74c3c] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-gray-600">Información personal</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-700">Nombre</Label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-medium">{userData.firstName}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Apellidos</Label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-medium">{userData.lastName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Username</Label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-medium">@{userData.username}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Email</Label>
              <div className="relative px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <p className="text-gray-900 font-medium pl-7">{userData.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">DNI</Label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-medium">{userData.dni}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-[#e74c3c]" />
                Gestionar Créditos
              </h2>

              <div className="bg-gradient-to-r from-[#e74c3c] to-[#c0392b] rounded-xl p-6 mb-6">
                <p className="text-white/80 text-sm mb-2">Saldo actual</p>
                <p className="text-white text-4xl font-bold">${credits}</p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="creditAmount" className="text-gray-700">
                  Agregar créditos
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="creditAmount"
                    type="number"
                    placeholder="Cantidad"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddCredits} className="bg-[#e74c3c] hover:bg-[#c0392b] text-white px-8">
                    Agregar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
