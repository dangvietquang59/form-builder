"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

export function FormPreview({ components }: { components: any[] }) {
  const [language, setLanguage] = useState("en")
  const [date, setDate] = useState<Date>()
  const [formValues, setFormValues] = useState<Record<string, any>>({})

  const handleInputChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleCheckboxChange = (key: string, value: string, checked: boolean) => {
    const currentValues = formValues[key] || []
    let newValues

    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter((v: string) => v !== value)
    }

    setFormValues((prev) => ({ ...prev, [key]: newValues }))
  }

  if (components.length === 0) {
    return (
      <div className="text-center py-12 bg-purple-50 rounded-lg">
        <p className="text-muted-foreground">Add components to see a preview</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Tabs value={language} onValueChange={setLanguage} className="w-fit">
          <TabsList className="bg-purple-100">
            <TabsTrigger value="en" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              English
            </TabsTrigger>
            <TabsTrigger value="zh" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              Chinese
            </TabsTrigger>
            <TabsTrigger value="vi" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              Vietnamese
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-6">
        {components.map((component) => {
          const label = component.label[language]
          const placeholder = component.placeholder?.[language] || ""
          const isRequired = component.required || false

          switch (component.type) {
            case "text":
              return (
                <div key={component.id} className="space-y-2">
                  <Label htmlFor={component.key} className="flex items-center">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    id={component.key}
                    placeholder={placeholder || label}
                    required={isRequired}
                    value={formValues[component.key] || ""}
                    onChange={(e) => handleInputChange(component.key, e.target.value)}
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              )

            case "email":
              return (
                <div key={component.id} className="space-y-2">
                  <Label htmlFor={component.key} className="flex items-center">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    id={component.key}
                    placeholder={placeholder || label}
                    type="email"
                    required={isRequired}
                    value={formValues[component.key] || ""}
                    onChange={(e) => handleInputChange(component.key, e.target.value)}
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              )

            case "phone":
              return (
                <div key={component.id} className="space-y-2">
                  <Label htmlFor={component.key} className="flex items-center">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    id={component.key}
                    placeholder={placeholder || label}
                    type="tel"
                    required={isRequired}
                    value={formValues[component.key] || ""}
                    onChange={(e) => handleInputChange(component.key, e.target.value)}
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              )

            case "select":
              return (
                <div key={component.id} className="space-y-2">
                  <Label htmlFor={component.key} className="flex items-center">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Select
                    value={formValues[component.key] || ""}
                    onValueChange={(value) => handleInputChange(component.key, value)}
                  >
                    <SelectTrigger
                      id={component.key}
                      className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    >
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {component.options?.map((option: any) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )

            case "checkbox":
              return (
                <div key={component.id} className="space-y-4">
                  <Label className="flex items-center">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <div className="space-y-2 bg-white p-3 rounded-md border border-purple-100">
                    {component.options?.map((option: any) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${component.key}-${option.value}`}
                          checked={(formValues[component.key] || []).includes(option.value)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(component.key, option.value, checked as boolean)
                          }
                          className="border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <Label htmlFor={`${component.key}-${option.value}`}>{option[language]}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )

            case "radio":
              return (
                <div key={component.id} className="space-y-4">
                  <Label className="flex items-center">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <RadioGroup
                    value={formValues[component.key] || ""}
                    onValueChange={(value) => handleInputChange(component.key, value)}
                    className="bg-white p-3 rounded-md border border-purple-100"
                  >
                    {component.options?.map((option: any) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option.value}
                          id={`${component.key}-${option.value}`}
                          className="border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <Label htmlFor={`${component.key}-${option.value}`}>{option[language]}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )

            case "date":
              return (
                <div key={component.id} className="space-y-2">
                  <Label htmlFor={component.key} className="flex items-center">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id={component.key}
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-purple-200 hover:bg-purple-50 hover:text-purple-700",
                          !formValues[component.key] && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formValues[component.key]
                          ? format(new Date(formValues[component.key]), "PPP")
                          : `Select ${label}`}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formValues[component.key] ? new Date(formValues[component.key]) : undefined}
                        onSelect={(date) => handleInputChange(component.key, date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )

            case "file":
              return (
                <div key={component.id} className="space-y-2">
                  <Label htmlFor={component.key} className="flex items-center">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor={component.key}
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-200 border-dashed rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-purple-500" />
                        <p className="mb-2 text-sm text-purple-700">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-purple-500">SVG, PNG, JPG or GIF</p>
                      </div>
                      <Input
                        id={component.key}
                        type="file"
                        className="hidden"
                        required={isRequired}
                        onChange={(e) => handleInputChange(component.key, e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>
              )

            case "heading":
              return (
                <h2 key={component.id} className="text-xl font-bold text-purple-800 border-b border-purple-200 pb-2">
                  {label}
                </h2>
              )

            case "label":
              return (
                <p
                  key={component.id}
                  className="text-sm text-purple-600 bg-purple-50 p-3 rounded-md border border-purple-100"
                >
                  {label}
                </p>
              )

            default:
              return null
          }
        })}
      </div>

      <div className="pt-4 border-t border-purple-100">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
        >
          Submit Form
        </Button>
      </div>
    </div>
  )
}

function Upload(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
