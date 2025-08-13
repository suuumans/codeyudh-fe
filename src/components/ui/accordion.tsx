import * as React from "react"

interface AccordionProps {
  children: React.ReactNode
  type?: 'single' | 'multiple'
  collapsible?: boolean
  className?: string
}

export function Accordion({ children, className }: AccordionProps) {
  return <div className={`accordion ${className ?? ''}`}>{children}</div>
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
}

export function AccordionItem({ value, children }: AccordionItemProps) {
  return <div className="accordion-item">{children}</div>
}

interface AccordionTriggerProps {
  children: React.ReactNode
}

export function AccordionTrigger({ children }: AccordionTriggerProps) {
  return <div className="accordion-trigger font-semibold cursor-pointer mb-2">{children}</div>
}

interface AccordionContentProps {
  children: React.ReactNode
}

export function AccordionContent({ children }: AccordionContentProps) {
  return <div className="accordion-content pl-4">{children}</div>
}
