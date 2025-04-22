'use server';

// Mock data cho môi trường phát triển
const mockForms = [
    {
        _id: 'form1',
        form_name: 'Đơn đăng ký khách hàng',
        route: '/forms/don-dang-ky-khach-hang',
        components: [
            {
                type: 'text',
                key: 'fullname',
                label: {
                    en: 'Full Name',
                    zh: '全名',
                    vi: 'Họ và tên',
                },
                required: true,
            },
            {
                type: 'email',
                key: 'email',
                label: {
                    en: 'Email Address',
                    zh: '电子邮件地址',
                    vi: 'Địa chỉ email',
                },
                required: true,
            },
            {
                type: 'select',
                key: 'customer_type',
                label: {
                    en: 'Customer Type',
                    zh: '客户类型',
                    vi: 'Loại khách hàng',
                },
                options: [
                    { value: 'individual', en: 'Individual', zh: '个人', vi: 'Cá nhân' },
                    { value: 'business', en: 'Business', zh: '商业', vi: 'Doanh nghiệp' },
                ],
                required: false,
            },
        ],
        created_at: '2023-04-15T08:30:00.000Z',
    },
    {
        _id: 'form2',
        form_name: 'Khảo sát sản phẩm',
        route: '/forms/khao-sat-san-pham',
        components: [
            {
                type: 'heading',
                key: 'survey_heading',
                label: {
                    en: 'Product Satisfaction Survey',
                    zh: '产品满意度调查',
                    vi: 'Khảo sát mức độ hài lòng về sản phẩm',
                },
            },
            {
                type: 'radio',
                key: 'satisfaction',
                label: {
                    en: 'How satisfied are you with our product?',
                    zh: '您对我们的产品满意吗？',
                    vi: 'Bạn hài lòng với sản phẩm của chúng tôi như thế nào?',
                },
                options: [
                    {
                        value: 'very_satisfied',
                        en: 'Very Satisfied',
                        zh: '非常满意',
                        vi: 'Rất hài lòng',
                    },
                    { value: 'satisfied', en: 'Satisfied', zh: '满意', vi: 'Hài lòng' },
                    { value: 'neutral', en: 'Neutral', zh: '中立', vi: 'Bình thường' },
                    {
                        value: 'dissatisfied',
                        en: 'Dissatisfied',
                        zh: '不满意',
                        vi: 'Không hài lòng',
                    },
                ],
                required: true,
            },
            {
                type: 'text',
                key: 'feedback',
                label: {
                    en: 'Additional Feedback',
                    zh: '其他反馈',
                    vi: 'Phản hồi bổ sung',
                },
                required: false,
            },
        ],
        created_at: '2023-05-20T14:15:00.000Z',
    },
];

const mockSubmissions = [
    {
        _id: 'sub1',
        form_id: 'form1',
        data: {
            fullname: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            customer_type: 'individual',
        },
        submitted_at: '2023-04-16T10:30:00.000Z',
    },
    {
        _id: 'sub2',
        form_id: 'form1',
        data: {
            fullname: 'Công ty XYZ',
            email: 'contact@xyz.com',
            customer_type: 'business',
        },
        submitted_at: '2023-04-17T14:45:00.000Z',
    },
    {
        _id: 'sub3',
        form_id: 'form2',
        data: {
            satisfaction: 'very_satisfied',
            feedback: 'Sản phẩm rất tốt và đáp ứng nhu cầu của tôi.',
        },
        submitted_at: '2023-05-21T09:20:00.000Z',
    },
];

// Hàm tạo form mới
export async function createForm(formData: any) {
    try {
        // Trong môi trường thực tế, đây sẽ là API call
        console.log('Creating form:', formData);

        // Giả lập thành công
        return {
            _id: `form${Date.now()}`,
            ...formData,
        };
    } catch (error) {
        console.error('Error creating form:', error);
        throw error;
    }
}

// Hàm lấy danh sách form
export async function getForms() {
    try {
        // Trong môi trường thực tế, đây sẽ là API call
        // Trả về dữ liệu mẫu
        return mockForms;
    } catch (error) {
        console.error('Error fetching forms:', error);
        return [];
    }
}

// Hàm lấy form theo slug
export async function getFormBySlug(slug: string) {
    try {
        // Tìm form có route khớp với slug
        const form = mockForms.find((form) => {
            const formSlug = form.route.split('/').pop();
            return formSlug === slug;
        });

        return form || null;
    } catch (error) {
        console.error('Error fetching form by slug:', error);
        return null;
    }
}

// Hàm lấy form theo ID
export async function getFormById(id: string) {
    try {
        // Tìm form có ID khớp
        const form = mockForms.find((form) => form._id === id);
        return form || null;
    } catch (error) {
        console.error('Error fetching form by ID:', error);
        return null;
    }
}

// Hàm gửi form
export async function submitForm(formId: string, data: any) {
    try {
        // Trong môi trường thực tế, đây sẽ là API call
        console.log('Submitting form:', { formId, data });

        // Giả lập thành công
        const submission = {
            _id: `sub${Date.now()}`,
            form_id: formId,
            data,
            submitted_at: new Date().toISOString(),
        };

        return submission;
    } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
    }
}

// Hàm lấy danh sách submission theo form ID
export async function getFormSubmissions(formId: string) {
    try {
        // Lọc submissions theo form ID
        const submissions = mockSubmissions.filter((sub) => sub.form_id === formId);
        return submissions;
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return [];
    }
}
