"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Wallet, FileText, Ticket, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

const navItems = [
  { name: "Eventos", href: "/events", icon: null },
  { name: "Mis eventos", href: "/my-events", icon: FileText },
  { name: "Perfil", href: "/profile", icon: User },
  { name: "Tickets", href: "/subscriptions", icon: Ticket },
]

export function Header() {
  const pathname = usePathname()
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔄 Obtener saldo del usuario
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true)
        const result = await api.get("/balance/get")
        
        if (result.success && result.data !== null && result.data !== undefined) {
          setCredits(result.data.balance)
        } else {
          console.warn("No se pudo obtener el saldo:", result.error)
          setCredits(0) // Valor por defecto
        }
      } catch (err) {
        console.error("Error fetching balance:", err)
        setCredits(0) // Valor por defecto en caso de error
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [])

  const getActiveTab = () => {
    if (pathname === "/events") return "Eventos"
    if (pathname === "/my-events") return "Mis eventos"
    if (pathname === "/profile") return "Perfil"
    if (pathname === "/subscriptions" || pathname.startsWith("/subscriptions/")) return "Tickets"
    return "Eventos"
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl fixed w-full max-w-5xl mx-auto left-0 right-0 top-8 border border-gray-200 z-50">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/events" className="text-2xl font-bold text-gray-900">
            Migueventos
          </Link>

          <div className="flex items-center gap-6">
            {/* Saldo del usuario */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg min-w-[100px] justify-center">
              <Wallet className="w-5 h-5 text-[#e74c3c]" />
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              ) : (
                <span className="font-semibold text-gray-900">
                  ${credits !== null ? credits.toFixed(2) : "0.00"}
                </span>
              )}
            </div>

            {/* Navegación */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    getActiveTab() === item.name ? "bg-[#e74c3c] text-white" : "text-gray-700 hover:text-[#e74c3c]"
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}