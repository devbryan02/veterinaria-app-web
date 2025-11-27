"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDuenoContext } from "../context/DuenoContext"

export default function DuenoFilters() {
  const { searchDuenos, getDuenos } = useDuenoContext()
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = async (value: string) => {
    setSearchTerm(value)
    const trimmed = value.trim()

    if (trimmed.length === 0) {
      await getDuenos()
      return
    }

    // Solo hacer fetch cuando haya al menos 3 caracteres
    if (trimmed.length >= 4) {
      await searchDuenos(trimmed)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre y DNI..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </>
  )
}