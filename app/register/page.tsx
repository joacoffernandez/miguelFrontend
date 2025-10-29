"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Sparkles, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    document: "", // Cambiado de 'dni' a 'document' para coincidir con el backend
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validar que todos los campos estén completos
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.username ||
        !formData.email ||
        !formData.document ||
        !formData.password
      ) {
        throw new Error("Por favor, completa todos los campos")
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Por favor, ingresa un email válido")
      }

      // Validar que el documento sea numérico
      const documentNumber = parseInt(formData.document)
      if (isNaN(documentNumber)) {
        throw new Error("El documento debe ser un número válido")
      }

      // Preparar datos para el backend
      const requestData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        document: documentNumber,
        password: formData.password
      }

      console.log("Enviando datos de registro:", requestData)

      // 🔄 Hacer POST al endpoint de registro
      const result = await api.post("/auth/signup", requestData)

      if (!result.success) {
        throw new Error(result.error || "Error al crear la cuenta")
      }

      console.log("✅ Registro exitoso:", result.data)

      // Redirigir a la página de eventos
      router.push("/events")

    } catch (err) {
      console.error("❌ Error en registro:", err)
      setError(err instanceof Error ? err.message : "Error al crear la cuenta")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-[#e74c3c]" />
              <h1 className="text-3xl font-bold text-gray-900">Migueventos</h1>
            </div>
            <p className="text-gray-600">Crea tu cuenta</p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700">
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="h-11"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700">
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Pérez"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="h-11"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="tu_username"
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 h-11"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 h-11"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document" className="text-gray-700">
                Documento
              </Label>
              <Input
                id="document"
                type="text"
                placeholder="12345678"
                value={formData.document}
                onChange={handleChange}
                className="h-11"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">Solo números, sin puntos ni espacios</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="h-11"
                required
                disabled={loading}
                minLength={6}
              />
              <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e74c3c] hover:bg-[#c0392b] text-white h-12 text-base font-semibold mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link 
                href="/login" 
                className="text-[#e74c3c] hover:underline font-semibold"
                onClick={(e) => loading && e.preventDefault()}
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-sm text-gray-600 hover:text-[#e74c3c]"
            onClick={(e) => loading && e.preventDefault()}
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}