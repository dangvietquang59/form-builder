'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormComponentList } from '@/components/form-component-list';
import { FormPreview } from '@/components/form-preview';
import { ComponentPalette } from '@/components/component-palette';
import { createForm } from '@/app/actions';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { Sparkles } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SelectGroup } from '@radix-ui/react-select';
import { FormTypeType } from '@/utils/types/formTypeType';
import formTypeApis from '@/apis/formTypeApis';

export default function FormBuilder() {
    const router = useRouter();
    const [formName, setFormName] = useState('');
    const [components, setComponents] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('design');
    const [formTypes, setFormTypes] = useState<FormTypeType[]>([]);
    const [selectedForm, setSelectedForm] = useState<FormTypeType>()

    useEffect(() => {
        const fetchListFormType = async () => {
            const res = await formTypeApis.getAll();
            if (res) {
                console.log(res);
                setFormTypes(res.data);
            }
        };
        fetchListFormType();
    }, []);

    // Cập nhật hàm addComponent để đảm bảo các component mới có đầy đủ thuộc tính
    const addComponent = (type: string) => {
        const newComponent = {
            id: uuidv4(),
            type,
            key: `field_${components.length + 1}`,
            label: {
                en: `Field ${components.length + 1}`,
                zh: `字段 ${components.length + 1}`,
                vi: `Trường ${components.length + 1}`,
            },
            options:
                type === 'select' || type === 'radio' || type === 'checkbox'
                    ? [
                          { value: 'option1', en: 'Option 1', zh: '选项 1', vi: 'Tùy chọn 1' },
                          { value: 'option2', en: 'Option 2', zh: '选项 2', vi: 'Tùy chọn 2' },
                      ]
                    : undefined,
            required: false,
            placeholder: {
                en: '',
                zh: '',
                vi: '',
            },
        };

        setComponents([...components, newComponent]);
        toast({
            title: 'Component added',
            description: `Added a new ${type} component to your form.`,
        });
    };

    const updateComponent = (id: string, data: any) => {
        setComponents(components.map((comp) => (comp.id === id ? { ...comp, ...data } : comp)));
    };

    const removeComponent = (id: string) => {
        setComponents(components.filter((comp) => comp.id !== id));
        toast({
            title: 'Component removed',
            description: 'The component has been removed from your form.',
        });
    };

    const reorderComponents = (newOrder: any[]) => {
        setComponents(newOrder);
    };

    const handleSaveForm = async () => {
        if (!formName.trim()) {
            toast({
                title: 'Form name required',
                description: 'Please enter a name for your form.',
                variant: 'destructive',
            });
            return;
        }

        if (components.length === 0) {
            toast({
                title: 'No components',
                description: 'Please add at least one component to your form.',
                variant: 'destructive',
            });
            return;
        }

        // Prepare form data for submission
        const formData = {
            form_name: formName,
            route: `${formName.toLowerCase().replace(/\s+/g, '-')}`,
            components: components.map(({ id, ...comp }) => comp),
            created_at: new Date().toISOString(),
            created_by: 'user_123', // In a real app, this would be the authenticated user's ID
        };
        console.log(formData);

        // try {
        //   // In a real implementation, this would save to MongoDB
        //   await createForm(formData)
        //   toast({
        //     title: "Form saved",
        //     description: "Your form has been saved and deployed successfully.",
        //   })
        //   router.push("/forms")
        // } catch (error) {
        //   console.error("Error saving form:", error)
        //   toast({
        //     title: "Error",
        //     description: "Failed to save form. Please try again.",
        //     variant: "destructive",
        //   })
        // }
    };

    const handleChangeForm = (value: string) => {
        // Lưu giá trị chọn vào state hoặc xử lý logic khác
        console.log("Selected form ID:", value);
        const data = formTypes.find(item => item.id.toString() === value)
        if(data){
            setSelectedForm(data)
        }
        // Ví dụ: setFormId(value); // Nếu bạn có state formId
    };
    

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            <div className="container mx-auto py-6">
                <div className="flex flex-col space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                                Form Builder
                            </h1>
                            <p className="text-muted-foreground">
                                Create and customize your dynamic form
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => router.push('/forms')}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveForm}
                                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                            >
                                <Sparkles className="mr-2 h-4 w-4" />
                                Save & Deploy Form
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1">
                            <div className="space-y-6 sticky top-6">
                                <Card className="border-2 border-purple-100 shadow-md overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-50">
                                        <CardTitle>Form Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="form-name">Select a form</Label>
                                                <Select value={selectedForm?.id.toString() || ""} onValueChange={handleChangeForm}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a form" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {formTypes.length > 0 &&
                                                                formTypes.map((item, index) => (
                                                                    <SelectItem
                                                                        value={item.id.toString()}
                                                                        key={index}
                                                                    >
                                                                        {item.name_en}
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="form-name">Chinese Name</Label>
                                                <Input
                                                    id="form-name"
                                                    value={selectedForm?.name_zh || ""}
                                                    onChange={(e) => setFormName(e.target.value)}
                                                    placeholder="Enter form name"
                                                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-purple-50"
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="form-name">English Name</Label>
                                                <Input
                                                    id="form-name"
                                                    value={selectedForm?.name_en || ""}
                                                    onChange={(e) => setFormName(e.target.value)}
                                                    placeholder="Enter form name"
                                                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-purple-50" 
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="form-name">Vietnamese Name</Label>
                                                <Input
                                                    id="form-name"
                                                    value={selectedForm?.name_vn || ""}
                                                    onChange={(e) => setFormName(e.target.value)}
                                                    placeholder="Enter form name"
                                                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-purple-50"
                                                    disabled
                                                />
                                            </div>
                                            <div className="text-sm p-2 bg-purple-50 rounded-md">
                                                <span className="font-medium">Tag:</span>{' '}
                                                {selectedForm
                                                    ? `${selectedForm.tag.toLowerCase().replace(/\s+/g, '-')}`
                                                    : 'your-form-name'}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <ComponentPalette addComponent={addComponent} />
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-purple-100 p-1">
                                    <TabsTrigger
                                        value="design"
                                        className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md"
                                    >
                                        Design
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="preview"
                                        className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md"
                                    >
                                        Preview
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="design" className="mt-4 min-h-[500px]">
                                    <FormComponentList
                                        components={components}
                                        updateComponent={updateComponent}
                                        removeComponent={removeComponent}
                                        reorderComponents={reorderComponents}
                                    />
                                </TabsContent>
                                <TabsContent value="preview" className="mt-4">
                                    <Card className="border-2 border-dashed border-purple-200 shadow-md">
                                        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                                            <CardTitle>{formName || 'Untitled Form'}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <FormPreview components={components} />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
