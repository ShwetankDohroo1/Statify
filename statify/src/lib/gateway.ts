export type RequestOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    cache?: RequestCache;
};

export class gateway {
    private static async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorBody}`);
        }

        try {
            return (await response.json()) as T;
        } catch (err) {
            throw new Error("Invalid JSON response");
        }
    }

    private static async handleRequest<T>(url: string, options?: RequestOptions): Promise<T> {
        const finalOptions: RequestInit = {
            method: options?.method || "GET",
            headers: {
                "Content-Type": "application/json",
                ...(options?.headers || {}),
            },
            cache: options?.cache || "default",
        };

        if (options?.body) finalOptions.body = JSON.stringify(options.body);

        try {
            const res = await fetch(url, finalOptions);
            return await this.handleResponse<T>(res);
        } catch (err: any) {
            console.error("❌ Gateway Error:", err.message);
            throw err;
        }
    }

    static get<T>(url: string, options?: RequestOptions) {
        return this.handleRequest<T>(url, { ...options, method: "GET" });
    }

    static post<T>(url: string, body?: any, options?: RequestOptions) {
        return this.handleRequest<T>(url, { ...options, method: "POST", body });
    }
}
