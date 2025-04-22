export interface FormComponent {
    id: string;
    type: string;
    key: string;
    label: {
        en: string;
        zh: string;
        vi: string;
    };
    placeholder?: {
        en: string;
        zh: string;
        vi: string;
    };
    required: boolean;
    inline?: boolean;
    columns?: number;
    rows?: number;
    options?: Array<{
        value: string;
        en: string;
        zh: string;
        vi: string;
    }>;
    children?: FormComponent[];
}
