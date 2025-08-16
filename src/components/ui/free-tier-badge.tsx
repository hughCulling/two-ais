import * as React from "react"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { TranslationKeys } from "@/lib/translations"

interface FreeTierBadgeProps {
  freeTier: {
    available: boolean
    note?: string | ((t: TranslationKeys) => string)
  } | undefined
  t: TranslationKeys
  className?: string
}

export function FreeTierBadge({ freeTier, t, className }: FreeTierBadgeProps) {
  if (!freeTier?.available) return null

  const note = typeof freeTier.note === 'function' 
    ? freeTier.note(t) 
    : freeTier.note || t.pricing.free

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="default" 
            className={cn(
              "bg-transparent border-0 text-muted-foreground hover:text-foreground transition-colors",
              "px-1 h-5 w-5 p-0 flex items-center justify-center",
              className
            )}
          >
            <Info className="h-3.5 w-3.5" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{note}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
