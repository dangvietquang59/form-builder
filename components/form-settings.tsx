'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function FormSettings({
    formName,
    setFormName,
}: {
    formName: string;
    setFormName: (name: string) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="form-name">Form Name</Label>
                <Input
                    id="form-name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter form name"
                />
            </div>
            <div className="text-sm text-muted-foreground">
                Route:{' '}
                {formName
                    ? `/forms/${formName.toLowerCase().replace(/\s+/g, '-')}`
                    : '/forms/your-form-name'}
            </div>
        </div>
    );
}
