"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  ChevronDown,
  X,
  Settings,
  GripVertical,
  Copy,
  TypeIcon,
  ListOrderedIcon,
  CheckSquareIcon,
  CircleCheckIcon,
  HeadingIcon,
  TextQuoteIcon,
  CalendarDaysIcon,
  UploadIcon,
  MailIcon,
  PhoneIcon,
  PenLineIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"

export function FormComponentList({
  components,
  updateComponent,
  removeComponent,
  reorderComponents,
}: {
  components: any[]
  updateComponent: (id: string, data: any) => void
  removeComponent: (id: string) => void
  reorderComponents: (newOrder: any[]) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<any | null>(null)
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, component: any) => {
    setDraggedItem(component)
    e.dataTransfer.setData('application/json', JSON.stringify(component))
    e.dataTransfer.effectAllowed = "move"
    
    // Tạo ghost image
    const ghostElement = document.createElement("div")
    ghostElement.classList.add("w-full", "p-4", "bg-purple-100", "rounded", "shadow-lg", "opacity-70")
    ghostElement.textContent = `Moving: ${component.label.en}`
    document.body.appendChild(ghostElement)
    e.dataTransfer.setDragImage(ghostElement, 20, 20)

    // Xóa ghost element sau khi đã sử dụng
    requestAnimationFrame(() => {
      document.body.removeChild(ghostElement)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (draggedItem?.id !== id) {
      setDragOverItemId(id)
    }
  }

  const handleDragLeave = () => {
    setDragOverItemId(null)
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    
    // Kiểm tra nếu đang thả component từ palette
    const componentType = e.dataTransfer.getData("componentType")
    if (componentType && componentType !== "") {
      return // Để parent component xử lý
    }

    // Xử lý việc sắp xếp lại thứ tự
    if (draggedItem && targetId !== draggedItem.id) {
      const currentItems = [...components]
      const draggedItemIndex = currentItems.findIndex(item => item.id === draggedItem.id)
      const targetIndex = currentItems.findIndex(item => item.id === targetId)

      if (draggedItemIndex !== -1 && targetIndex !== -1) {
        const [removed] = currentItems.splice(draggedItemIndex, 1)
        currentItems.splice(targetIndex, 0, removed)
        
        reorderComponents(currentItems)
        toast({
          title: "Component reordered",
          description: "The component has been moved to a new position."
        })
      }
    }

    setDraggedItem(null)
    setDragOverItemId(null)
  }

  const handleDropOnEmptyArea = (e: React.DragEvent) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData("componentType")
    if (componentType && componentType !== "") {
      // This would be handled by the parent component
      // addComponent(componentType)
    }
  }

  const duplicateComponent = (component: any) => {
    const newComponent = {
      ...JSON.parse(JSON.stringify(component)), // Deep clone
      id: uuidv4(),
      key: `${component.key}_copy`,
    }
    reorderComponents([...components, newComponent])
    toast({
      title: "Component duplicated",
      description: "A copy of the component has been added to your form.",
    })
  }

  // Handle external drops from component palette
  useEffect(() => {
    const handleExternalDrop = (e: DragEvent) => {
      const componentType = e.dataTransfer?.getData("componentType")
      if (componentType && componentType !== "") {
        // This would be handled by the parent component
        // addComponent(componentType)
      }
    }

    document.addEventListener("drop", handleExternalDrop)
    return () => {
      document.removeEventListener("drop", handleExternalDrop)
    }
  }, [])

  if (components.length === 0) {
    return (
      <div
        className="text-center py-12 border-2 border-dashed border-purple-200 rounded-lg flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-b from-purple-50 to-white transition-all duration-300 hover:border-purple-400"
        onDragOver={handleDragOver}
        onDrop={handleDropOnEmptyArea}
      >
        <div className="w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center">
          <ChevronDown className="h-8 w-8 text-purple-500 animate-bounce" />
        </div>
        <h3 className="text-lg font-medium mb-2 text-purple-700">Drop Components Here</h3>
        <p className="text-muted-foreground mb-4">Drag components from the left panel or click to add</p>
        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div
      className="space-y-4 min-h-[300px] p-4 border-2 border-dashed border-purple-200 rounded-lg bg-white"
      onDragOver={handleDragOver}
      onDrop={handleDropOnEmptyArea}
    >
      {components.map((component) => (
        <ComponentItem
          key={component.id}
          component={component}
          updateComponent={updateComponent}
          removeComponent={removeComponent}
          duplicateComponent={duplicateComponent}
          isEditing={editingId === component.id}
          setIsEditing={(isEditing) => {
            setEditingId(isEditing ? component.id : null)
          }}
          onDragStart={(e) => handleDragStart(e, component)}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, component.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, component.id)}
          isDraggedOver={dragOverItemId === component.id}
          isDragging={draggedItem?.id === component.id}
        />
      ))}
    </div>
  )
}

// Sửa lỗi trong ComponentItem để đảm bảo việc chỉnh sửa hoạt động đúng
// Thay đổi phần khai báo và khởi tạo state isEditing
function ComponentItem({
  component,
  updateComponent,
  removeComponent,
  duplicateComponent,
  isEditing: propIsEditing,
  setIsEditing: propSetIsEditing,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  isDraggedOver,
  isDragging,
}: {
  component: any
  updateComponent: (id: string, data: any) => void
  removeComponent: (id: string) => void
  duplicateComponent: (component: any) => void
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnter: (e: React.DragEvent, id: string) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent, id: string) => void
  isDraggedOver: boolean
  isDragging: boolean
}) {
  const [isEditingLocal, setIsEditingLocal] = useState(propIsEditing)
  const [activeTab, setActiveTab] = useState("en")

  useEffect(() => {
    setIsEditingLocal(propIsEditing)
  }, [propIsEditing])

  const handleKeyChange = (newKey: string) => {
    updateComponent(component.id, { ...component, key: newKey })
  }

  const handleLabelChange = (lang: string, newLabel: string) => {
    updateComponent(component.id, {
      ...component,
      label: { ...component.label, [lang]: newLabel },
    })
  }

  const handlePlaceholderChange = (lang: string, newPlaceholder: string) => {
    if (!component.placeholder) {
      component.placeholder = {}
    }
    updateComponent(component.id, {
      ...component,
      placeholder: { ...component.placeholder, [lang]: newPlaceholder },
    })
  }

  const handleRequiredChange = (checked: boolean) => {
    updateComponent(component.id, { ...component, required: checked })
  }

  const addOption = () => {
    const newOption = { value: "", en: "", zh: "", vi: "" }
    updateComponent(component.id, {
      ...component,
      options: [...(component.options || []), newOption],
    })
  }

  const removeOption = (index: number) => {
    const newOptions = [...component.options]
    newOptions.splice(index, 1)
    updateComponent(component.id, { ...component, options: newOptions })
  }

  const handleOptionChange = (index: number, lang: string, value: string) => {
    const newOptions = [...component.options]
    newOptions[index][lang] = value
    updateComponent(component.id, { ...component, options: newOptions })
  }

  const handleOptionValueChange = (index: number, value: string) => {
    const newOptions = [...component.options]
    newOptions[index].value = value
    updateComponent(component.id, { ...component, options: newOptions })
  }

  const getComponentIcon = () => {
    switch (component.type) {
      case "text":
        return <TypeIcon className="h-6 w-6" />
      case "number":
        return <ListOrderedIcon className="h-6 w-6" />
      case "select":
        return <ListOrderedIcon className="h-6 w-6" />
      case "label":
        return <PenLineIcon className="h-6 w-6" />
      case "checkbox":
        return <CheckSquareIcon className="h-6 w-6" />
      case "radio":
        return <CircleCheckIcon className="h-6 w-6" />
      case "heading":
        return <HeadingIcon className="h-6 w-6" />
      case "textarea":
        return <TextQuoteIcon className="h-6 w-6" />
      case "date":
        return <CalendarDaysIcon className="h-6 w-6" />
      case "file":
        return <UploadIcon className="h-6 w-6" />
      case "email":
        return <MailIcon className="h-6 w-6" />
      case "phone":
        return <PhoneIcon className="h-6 w-6" />
      default:
        return <TypeIcon className="h-6 w-6" />
    }
  }

  const getComponentTitle = () => {
    switch (component.type) {
      case "text":
        return "Text Field"
      case "number":
        return "Number Field"
      case "select":
        return "Dropdown"
      case "label":
        return "Label"
      case "checkbox":
        return "Checkbox"
      case "radio":
        return "Radio Button"
      case "heading":
        return "Heading"
      case "textarea":
        return "Text Area"
      case "date":
        return "Date Field"
      case "file":
        return "File Upload"
      case "email":
        return "Email Field"
      case "phone":
        return "Phone Field"
      default:
        return "Unknown Component"
    }
  }

  const getComponentColor = () => {
    switch (component.type) {
      case "text":
        return "bg-blue-500"
      case "number":
        return "bg-green-500"
      case "checkbox":
        return "bg-orange-500"
      case "select":
        return "bg-purple-500"
      case "label":
        return "bg-gray-500"
      case "radio":
        return "bg-purple-500"
      case "heading":
        return "bg-red-500"
      case "textarea":
        return "bg-teal-500"
      case "date":
        return "bg-yellow-500"
      case "file":
        return "bg-pink-500"
      case "email":
        return "bg-indigo-500"
      case "phone":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const toggleEditing = () => {
    setIsEditingLocal(!isEditingLocal)
    propSetIsEditing(!isEditingLocal)
  }

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e)}
      onDragOver={(e) => onDragOver(e)}
      onDragEnter={(e) => onDragEnter(e, component.id)}
      onDragLeave={(e) => onDragLeave()}
      onDrop={(e) => onDrop(e, component.id)}
      className={cn(
        "relative group transition-all duration-200",
        isDraggedOver && "ring-2 ring-purple-500 transform scale-[1.02]",
        isDragging && "opacity-50",
        "hover:shadow-md"
      )}
    >
      <CardContent className="relative flex items-center space-x-4 p-4">
        <GripVertical className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover:block hidden" />
        <div className="flex-1">{/* Component Content */}</div>
        <div className="absolute right-2 top-2 flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleEditing}
            className="hover:bg-purple-100 hover:text-purple-700"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => duplicateComponent(component)}
            className="hover:bg-blue-100 hover:text-blue-700"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeComponent(component.id)}
            className="hover:bg-red-100 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardContent className="pt-8 pb-4 pl-10">
        {isEditingLocal ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`key-${component.id}`}>Field Key</Label>
                <Input
                  id={`key-${component.id}`}
                  value={component.key}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id={`required-${component.id}`}
                  checked={component.required}
                  onCheckedChange={handleRequiredChange}
                  className="data-[state=checked]:bg-purple-500"
                />
                <Label htmlFor={`required-${component.id}`}>Required Field</Label>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-purple-100">
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

              <TabsContent value="en" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor={`label-en-${component.id}`}>Label (English)</Label>
                  <Input
                    id={`label-en-${component.id}`}
                    value={component.label.en}
                    onChange={(e) => handleLabelChange("en", e.target.value)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>

                {(component.type === "text" || component.type === "email" || component.type === "phone") && (
                  <div className="space-y-2">
                    <Label htmlFor={`placeholder-en-${component.id}`}>Placeholder (English)</Label>
                    <Input
                      id={`placeholder-en-${component.id}`}
                      value={component.placeholder?.en || ""}
                      onChange={(e) => handlePlaceholderChange("en", e.target.value)}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                )}

                {component.options && (
                  <div className="space-y-2">
                    <Label>Options (English)</Label>
                    {component.options.map((option: any, optIndex: number) => (
                      <div key={optIndex} className="flex space-x-2 items-center">
                        <Input
                          value={option.value}
                          onChange={(e) => handleOptionValueChange(optIndex, e.target.value)}
                          placeholder="Value"
                          className="w-1/3 border-purple-200 focus:border-purple-400"
                        />
                        <Input
                          value={option.en}
                          onChange={(e) => handleOptionChange(optIndex, "en", e.target.value)}
                          placeholder="Label"
                          className="w-2/3 border-purple-200 focus:border-purple-400"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(optIndex)}
                          disabled={component.options.length <= 1}
                          className="hover:bg-red-100 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      className="mt-2 border-purple-200 hover:bg-purple-100 hover:text-purple-700"
                    >
                      Add Option
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="zh" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor={`label-zh-${component.id}`}>Label (Chinese)</Label>
                  <Input
                    id={`label-zh-${component.id}`}
                    value={component.label.zh}
                    onChange={(e) => handleLabelChange("zh", e.target.value)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>

                {(component.type === "text" || component.type === "email" || component.type === "phone") && (
                  <div className="space-y-2">
                    <Label htmlFor={`placeholder-zh-${component.id}`}>Placeholder (Chinese)</Label>
                    <Input
                      id={`placeholder-zh-${component.id}`}
                      value={component.placeholder?.zh || ""}
                      onChange={(e) => handlePlaceholderChange("zh", e.target.value)}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                )}

                {component.options && (
                  <div className="space-y-2">
                    <Label>Options (Chinese)</Label>
                    {component.options.map((option: any, optIndex: number) => (
                      <div key={optIndex} className="flex space-x-2">
                        <Input value={option.value} disabled placeholder="Value" className="w-1/3 bg-gray-50" />
                        <Input
                          value={option.zh}
                          onChange={(e) => handleOptionChange(optIndex, "zh", e.target.value)}
                          placeholder="Label"
                          className="w-2/3 border-purple-200 focus:border-purple-400"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="vi" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor={`label-vi-${component.id}`}>Label (Vietnamese)</Label>
                  <Input
                    id={`label-vi-${component.id}`}
                    value={component.label.vi}
                    onChange={(e) => handleLabelChange("vi", e.target.value)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>

                {(component.type === "text" || component.type === "email" || component.type === "phone") && (
                  <div className="space-y-2">
                    <Label htmlFor={`placeholder-vi-${component.id}`}>Placeholder (Vietnamese)</Label>
                    <Input
                      id={`placeholder-vi-${component.id}`}
                      value={component.placeholder?.vi || ""}
                      onChange={(e) => handlePlaceholderChange("vi", e.target.value)}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                )}

                {component.options && (
                  <div className="space-y-2">
                    <Label>Options (Vietnamese)</Label>
                    {component.options.map((option: any, optIndex: number) => (
                      <div key={optIndex} className="flex space-x-2">
                        <Input value={option.value} disabled placeholder="Value" className="w-1/3 bg-gray-50" />
                        <Input
                          value={option.vi}
                          onChange={(e) => handleOptionChange(optIndex, "vi", e.target.value)}
                          placeholder="Label"
                          className="w-2/3 border-purple-200 focus:border-purple-400"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex items-center">
            <div
              className={`flex-shrink-0 h-10 w-10 rounded-md ${getComponentColor()} text-white flex items-center justify-center shadow-sm mr-3`}
            >
              {getComponentIcon()}
            </div>
            <div>
              <h3 className="font-medium">{getComponentTitle()}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Key: {component.key} {component.required && <span className="text-red-500 ml-2">Required</span>}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
