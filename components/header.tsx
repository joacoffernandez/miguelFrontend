"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Calendar, Wallet } from "lucide-react"

const navItems = [
  { name: "Eventos", href: "/events", icon: null },
  { name: "Perfil", href: "/profile", icon: User },
  { name: "Suscripciones", href: "/subscriptions", icon: Calendar },
]

export function Header() {
  const pathname = usePathname()
  const [credits, setCredits] = useState(250)

  const getActiveTab = () => {
    if (pathname === "/events") return "Eventos"
    if (pathname === "/profile") return "Perfil"
    if (pathname === "/subscriptions") return "Suscripciones"
    return "Eventos"
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl">
      <div className="px-6">
        <div className="flex items-center justify-between h-18">
          <Link href="/events" className="text-2xl font-bold text-gray-900">
            Migueventos
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <Wallet className="w-5 h-5 text-[#e74c3c]" />
              <span className="font-semibold text-gray-900">${credits}</span>
            </div>

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
