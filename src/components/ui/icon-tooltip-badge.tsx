import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface IconTooltipBadgeProps {
  icon: React.ReactNode
  tooltip: string
  className?: string
}

export function IconTooltipBadge({ icon, tooltip, className }: IconTooltipBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="default" 
            className={cn(
              "bg-transparent border-0 hover:bg-transparent transition-colors",
              "px-0 h-auto w-auto p-0 flex items-center justify-center",
              className
            )}
          >
            {icon}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
