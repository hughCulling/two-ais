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
            variant="outline" 
            className={cn(
              "text-xs font-normal gap-1.5 text-muted-foreground hover:text-foreground transition-colors",
              className
            )}
          >
            {/* <span>{t.pricing.free}</span> */}
            <Info className="h-3 w-3" />
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
