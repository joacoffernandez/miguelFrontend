"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ReservationFormProps {
  index: number
  onDataChange: (field: 'firstName' | 'lastName' | 'document', value: string) => void
}

export function ReservationForm({ index, onDataChange }: ReservationFormProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-gray-900 mb-4">Entrada #{index + 1}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`firstName-${index}`}>Nombre</Label>
          <Input id={`firstName-${index}`} name={`firstName-${index}`} required placeholder="Juan" onChange={(e) => onDataChange('firstName', e.target.value)}/>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`lastName-${index}`}>Apellidos</Label>
          <Input id={`lastName-${index}`} name={`lastName-${index}`} required placeholder="Pérez" onChange={(e) => onDataChange('lastName', e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`document-${index}`}>DNI</Label>
        <Input id={`document-${index}`} name={`document-${index}`} required placeholder="12345678A" onChange={(e) => onDataChange('document', e.target.value)} />
      </div>
    </div>
  )
}
