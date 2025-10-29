"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, DollarSign, FileText, Image as ImageIcon } from "lucide-react"
import { TagSelector } from "@/components/tag-selector"
import { api } from "@/lib/api"
import Image from "next/image"

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    shortDescription: "",
    location: "",
    price: "",
    tags: [] as string[],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleTagsChange = (tags: string[]) => {
    setFormData({
      ...formData,
      tags,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = new FormData()
      form.append("title", formData.title)
      form.append("description", formData.description)
      form.append("shortDescription", formData.shortDescription)
      form.append("direction", formData.location)
      form.append("date", `${formData.date}T${formData.time}`)
      form.append("price", formData.price)
      form.append("free", (parseFloat(formData.price) === 0).toString())
      form.append("category", formData.tags[0])
      if (image) form.append("image", image)

      const res = await fetch(`http://localhost:8080/event/create`, {
            method: "POST",
            credentials: "include",
            body: form,
          })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al crear el evento")
      }

      setError(null)

      router.push("/events")
    } catch (err: any) {
      console.error("Error fetching event:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-4 pt-4 md:px-8 md:pt-8">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Nuevo Evento</h1>
            <p className="text-gray-600">Completa la información del evento</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Imagen */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-gray-700">
                Imagen del Evento
              </Label>
              <div className="relative flex items-center gap-4">
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                <ImageIcon className="text-gray-400 w-5 h-5" />
              </div>
              {preview && (
                <div className="mt-3">
                  <Image
                    src={preview}
                    alt="Vista previa del evento"
                    width={400}
                    height={250}
                    className="rounded-lg border object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">
                Título del Evento
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Ej: Tech Summit 2025"
                value={formData.title}
                onChange={handleChange}
                className="h-11"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-700">
                  Fecha
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-gray-700">
                  Hora
                </Label>
                <Input id="time" type="time" value={formData.time} onChange={handleChange} className="h-11" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="text-gray-700">
                Descripción Corta
              </Label>
              <Input
                id="shortDescription"
                type="text"
                placeholder="Breve resumen del evento"
                value={formData.shortDescription}
                onChange={handleChange}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Descripción Completa
              </Label>
              <Textarea
                id="description"
                placeholder="Describe el evento en detalle..."
                value={formData.description}
                onChange={handleChange}
                className="min-h-32 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700">
                Dirección
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="location"
                  type="text"
                  placeholder="Ej: Centro de Convenciones, Madrid"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Tags</Label>
              <TagSelector selectedTags={formData.tags} onTagsChange={handleTagsChange} />
              <p className="text-sm text-gray-500">Las categorias ayudan a filtrar y encontrar tu evento</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700">
                Precio (€)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="price"
                  type="number"
                  placeholder="0 para eventos gratuitos"
                  value={formData.price}
                  onChange={handleChange}
                  className="pl-10 h-11"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => router.push("/events")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-[#e74c3c] hover:bg-[#c0392b] text-white">
                {loading ? "Creando..." : "Crear Evento"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
