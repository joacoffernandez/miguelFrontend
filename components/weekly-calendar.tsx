"use client"

import { Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Event {
  id: number
  title: string
  date: string
}

interface WeeklyCalendarProps {
  events: Event[]
}

export function WeeklyCalendar({ events }: WeeklyCalendarProps) {
  // Get next 7 days starting from today
  const getNext7Days = () => {
    const days = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date)
    }

    return days
  }

  const next7Days = getNext7Days()

  // Parse event date string to Date object (format: "DD de Mes, YYYY")
  const parseEventDate = (dateString: string): Date | null => {
    const months: { [key: string]: number } = {
      Enero: 0,
      Febrero: 1,
      Marzo: 2,
      Abril: 3,
      Mayo: 4,
      Junio: 5,
      Julio: 6,
      Agosto: 7,
      Septiembre: 8,
      Octubre: 9,
      Noviembre: 10,
      Diciembre: 11,
    }

    const match = dateString.match(/(\d+) de (\w+), (\d+)/)
    if (!match) return null

    const day = Number.parseInt(match[1])
    const month = months[match[2]]
    const year = Number.parseInt(match[3])

    return new Date(year, month, day)
  }

  // Check if a day has events
  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventDate = parseEventDate(event.date)
      if (!eventDate) return false

      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase()
  }

  const formatDayNumber = (date: Date) => {
    return date.getDate()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="bg-gradient-to-r from-[#e74c3c]/5 to-[#e74c3c]/10 rounded-xl p-4 mb-8 border border-[#e74c3c]/20">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-[#e74c3c]" />
        <h2 className="text-lg font-semibold text-gray-900">Próximos 7 días</h2>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {next7Days.map((date, index) => {
          const dayEvents = getEventsForDay(date)
          const hasEvents = dayEvents.length > 0

          return (
            <div
              key={index}
              className={`relative flex flex-col items-center p-3 rounded-lg transition-all ${
                isToday(date)
                  ? "bg-[#e74c3c] text-white shadow-md"
                  : hasEvents
                    ? "bg-white border-2 border-[#e74c3c] shadow-sm"
                    : "bg-white border border-gray-200"
              }`}
            >
              <span className={`text-xs font-medium mb-1 ${isToday(date) ? "text-white" : "text-gray-500"}`}>
                {formatDayName(date)}
              </span>
              <span className={`text-xl font-bold ${isToday(date) ? "text-white" : "text-gray-900"}`}>
                {formatDayNumber(date)}
              </span>

              {hasEvents && (
                <div className="absolute -top-1 -right-1">
                  <Badge className="bg-green-500 hover:bg-green-600 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {dayEvents.length}
                  </Badge>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
