import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { EventsList } from "@/components/events-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative">
        <Hero />

        <div className="absolute top-0 left-0 right-0 z-50 px-4 pt-4 md:px-20 md:pt-8">
          <Header />
        </div>
      </div>

      <div className="relative -mt-32 mx-4 md:mx-20 bg-white rounded-t-3xl shadow-2xl">
        <div  className="container mx-auto px-9 py-12">
          <EventsList />
        </div>
      </div>
    </div>
  )
}
