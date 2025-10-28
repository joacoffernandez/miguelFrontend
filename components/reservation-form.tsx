"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ReservationFormProps {
  index: number
}

export function ReservationForm({ index }: ReservationFormProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-gray-900 mb-4">Entrada #{index + 1}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`firstName-${index}`}>Nombre</Label>
          <Input id={`firstName-${index}`} name={`firstName-${index}`} required placeholder="Juan" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`lastName-${index}`}>Apellidos</Label>
          <Input id={`lastName-${index}`} name={`lastName-${index}`} required placeholder="Pérez" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`email-${index}`}>Email</Label>
        <Input id={`email-${index}`} name={`email-${index}`} type="email" required placeholder="juan@ejemplo.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`dni-${index}`}>DNI</Label>
        <Input id={`dni-${index}`} name={`dni-${index}`} required placeholder="12345678A" />
      </div>
    </div>
  )
}
