type FetcherParams = {
    endpoint: string; // chỉ truyền phần endpoint, ví dụ: '/user'
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: Record<string, any>;
    headers?: HeadersInit;
    token?: string;
};

export const fetcher = async <T = any>({
    endpoint,
    method = 'GET',
    body,
    headers = {},
    token,
}: FetcherParams): Promise<T> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL_2;
    const url = `${baseUrl}${endpoint}`;

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message || `Fetch error: ${res.status} ${res.statusText}`);
    }

    return res.json();
};
