"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Type,
  ListOrdered,
  CheckSquare,
  CircleCheck,
  Heading,
  TextQuote,
  CalendarDays,
  Upload,
  Mail,
  Phone,
  GripVertical,
} from "lucide-react"

interface ComponentType {
  type: string
  label: string
  icon: React.ReactNode
  description: string
  color: string
}

const componentTypes: ComponentType[] = [
  {
    type: "text",
    label: "Text Field",
    icon: <Type className="h-5 w-5" />,
    description: "Single line text input",
    color: "bg-blue-500",
  },
  {
    type: "textarea",
    label: "Text Area",
    icon: <Type className="h-5 w-5" />,
    description: "Single line text textarea",
    color: "bg-orange-500",
  },
  {
    type: "select",
    label: "Dropdown",
    icon: <ListOrdered className="h-5 w-5" />,
    description: "Select from a list of options",
    color: "bg-green-500",
  },
  {
    type: "checkbox",
    label: "Checkbox Group",
    icon: <CheckSquare className="h-5 w-5" />,
    description: "Multiple selection checkboxes",
    color: "bg-amber-500",
  },
  {
    type: "radio",
    label: "Radio Group",
    icon: <CircleCheck className="h-5 w-5" />,
    description: "Single selection radio buttons",
    color: "bg-red-500",
  },
  {
    type: "heading",
    label: "Heading",
    icon: <Heading className="h-5 w-5" />,
    description: "Section title or heading",
    color: "bg-purple-500",
  },
  {
    type: "label",
    label: "Label",
    icon: <TextQuote className="h-5 w-5" />,
    description: "Descriptive text or instructions",
    color: "bg-indigo-500",
  },
  {
    type: "date",
    label: "Date Picker",
    icon: <CalendarDays className="h-5 w-5" />,
    description: "Date selection field",
    color: "bg-cyan-500",
  },
  {
    type: "file",
    label: "File Upload",
    icon: <Upload className="h-5 w-5" />,
    description: "File upload field",
    color: "bg-emerald-500",
  },
  {
    type: "email",
    label: "Email Field",
    icon: <Mail className="h-5 w-5" />,
    description: "Email input with validation",
    color: "bg-pink-500",
  },
  {
    type: "phone",
    label: "Phone Field",
    icon: <Phone className="h-5 w-5" />,
    description: "Phone number input",
    color: "bg-orange-500",
  },
]

export function ComponentPalette({ addComponent }: { addComponent: (type: string) => void }) {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("componentType", type)
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <Card className="border-2 border-purple-100 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-50">
        <CardTitle>Components</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-1 gap-3">
          {componentTypes.map((component) => (
            <div
              key={component.type}
              className="border-2 border-gray-100 rounded-lg p-3 cursor-move bg-white hover:border-purple-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0"
              draggable
              onDragStart={(e) => handleDragStart(e, component.type)}
              onClick={() => addComponent(component.type)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`flex-shrink-0 h-10 w-10 rounded-md ${component.color} text-white flex items-center justify-center shadow-sm`}
                >
                  {component.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{component.label}</h3>
                  <p className="text-xs text-muted-foreground">{component.description}</p>
                </div>
                <div className="text-gray-400">
                  <GripVertical className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
