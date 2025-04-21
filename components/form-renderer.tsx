"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { submitForm } from "@/app/actions"

export function FormRenderer({
  components,
  formId,
}: {
  components: any[]
  formId: string
}) {
  const router = useRouter()
  const [language, setLanguage] = useState("en")
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCheckboxChange = (key: string, value: string, checked: boolean) => {
    const currentValues = formData[key] || []
    let newValues

    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter((v: string) => v !== value)
    }

    setFormData((prev) => ({ ...prev, [key]: newValues }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real implementation, this would save to MongoDB
      await submitForm(formId, formData)
      alert("Form submitted successfully!")
      router.push("/forms")
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end">
        <Tabs value={language} onValueChange={setLanguage}>
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="zh">Chinese</TabsTrigger>
            <TabsTrigger value="vi">Vietnamese</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-6">
        {components.map((component) => {
          const label = component.label[language]

          switch (component.type) {
            case "text":
              return (
                <div key={component.key} className="space-y-2">
                  <Label htmlFor={component.key}>{label}</Label>
                  <Input
                    id={component.key}
                    placeholder={label}
                    value={formData[component.key] || ""}
                    onChange={(e) => handleInputChange(component.key, e.target.value)}
                  />
                </div>
              )

            case "select":
              return (
                <div key={component.key} className="space-y-2">
                  <Label htmlFor={component.key}>{label}</Label>
                  <Select
                    value={formData[component.key] || ""}
                    onValueChange={(value) => handleInputChange(component.key, value)}
                  >
                    <SelectTrigger id={component.key}>
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
                <div key={component.key} className="space-y-4">
                  <Label>{label}</Label>
                  <div className="space-y-2">
                    {component.options?.map((option: any) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${component.key}-${option.value}`}
                          checked={(formData[component.key] || []).includes(option.value)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(component.key, option.value, checked as boolean)
                          }
                        />
                        <Label htmlFor={`${component.key}-${option.value}`}>{option[language]}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )

            case "radio":
              return (
                <div key={component.key} className="space-y-4">
                  <Label>{label}</Label>
                  <RadioGroup
                    value={formData[component.key] || ""}
                    onValueChange={(value) => handleInputChange(component.key, value)}
                  >
                    {component.options?.map((option: any) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${component.key}-${option.value}`} />
                        <Label htmlFor={`${component.key}-${option.value}`}>{option[language]}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )

            case "heading":
              return (
                <h2 key={component.key} className="text-xl font-bold">
                  {label}
                </h2>
              )

            case "label":
              return (
                <p key={component.key} className="text-sm text-muted-foreground">
                  {label}
                </p>
              )

            default:
              return null
          }
        })}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}
