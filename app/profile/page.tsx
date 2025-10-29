"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Wallet, LogOut, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

// Interface basada en tu modelo User
interface UserData {
  idUser: string
  username: string
  firstName: string
  lastName: string
  document: number
  email: string
  balance: number
  bought: number
  confirmed: number
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creditAmount, setCreditAmount] = useState("")
  const [updatingBalance, setUpdatingBalance] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const router = useRouter()

  // 🔄 Obtener datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const result = await api.get("/user/me")
        
        if (!result.success) {
          throw new Error(result.error || "Error al cargar los datos del usuario")
        }

        if (!result.data) {
          throw new Error("Usuario no encontrado")
        }

        setUserData(result.data.user)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // 💰 Agregar créditos (simulación - en producción esto conectaría con una pasarela de pago)
  const handleAddCredits = async () => {
    const amount = Number.parseFloat(creditAmount)
    if (!userData || isNaN(amount) || amount <= 0) {
      setError("Por favor, ingresa una cantidad válida")
      return
    }

    setUpdatingBalance(true)
    setError(null)

    try {
      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 1500))
    
      const response = await api.post("/balance/increase", { amount })
      

      setUserData(prev => prev ? {
        ...prev,
        balance: prev.balance + amount
      } : null)
      
      setCreditAmount("")
      console.log(`Créditos agregados: $${amount}`)
    } catch (err) {
      console.error("Error adding credits:", err)
      setError("Error al agregar créditos")
    } finally {
      setUpdatingBalance(false)
    }
  }

  // 🚪 Cerrar sesión
  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
   
      const response = await api.post("/auth/signout")

      if (!response.success) {
        throw new Error(response.error || "Error al cerrar sesión")
      }

      router.push("/login")
    } catch (err) {
      console.error("Error during logout:", err)
      // Aún así redirigimos al login
      router.push("/login")
    } finally {
      setLogoutLoading(false)
    }
  }

  // ⏳ Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#e74c3c] mx-auto" />
                <p className="mt-4 text-gray-600">Cargando perfil...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ❌ Manejo de errores
  if (error && !userData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
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

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 pt-4 md:px-8 md:pt-8">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-red-500 text-lg mb-4">
              No se pudieron cargar los datos del usuario
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

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

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
              <Label className="text-gray-700">Documento</Label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-medium">{userData.document}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-[#e74c3c]" />
                Gestionar Créditos
              </h2>

              <div className="bg-gradient-to-r from-[#e74c3c] to-[#c0392b] rounded-xl p-6 mb-6">
                <p className="text-white/80 text-sm mb-2">Saldo actual</p>
                <p className="text-white text-4xl font-bold">${userData.balance.toFixed(2)}</p>
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
                    min="1"
                    step="0.01"
                  />
                  <Button 
                    onClick={handleAddCredits} 
                    disabled={updatingBalance}
                    className="bg-[#e74c3c] hover:bg-[#c0392b] text-white px-8"
                  >
                    {updatingBalance ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Agregar"
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Los créditos se agregarán inmediatamente a tu cuenta después del pago.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              disabled={logoutLoading}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              {logoutLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5 mr-2" />
              )}
              {logoutLoading ? "Cerrando sesión..." : "Cerrar Sesión"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}