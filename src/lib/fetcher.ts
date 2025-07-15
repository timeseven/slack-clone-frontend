import { refreshAccessToken } from '@/features/auth/services/authApi';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

let isRefreshing = false;
let pendingQueue: Array<{
	resolve: (value: Response) => void;
	reject: (error: Error) => void;
	request: () => Promise<Response>;
}> = [];

const processQueue = (error?: Error, response?: Response) => {
	pendingQueue.forEach(({ resolve, reject, request }) => {
		if (error) {
			reject(error);
		} else if (response) {
			resolve(response);
		} else {
			// Retry the original request
			request().then(resolve).catch(reject);
		}
	});
	pendingQueue = [];
};

const redirectToLogin = (): void => {
	// Avoid executing on server-side
	if (typeof window !== 'undefined') {
		const currentPath = window.location.pathname + window.location.search;
		window.location.href = `/signin?redirect=${encodeURIComponent(currentPath)}`;
	}
};

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
	const fullUrl = `${BASE_URL}${url}`;

	const doFetch = async (): Promise<Response> => {
		const isFormData = options?.body instanceof FormData;
		return fetch(fullUrl, {
			credentials: 'include',
			headers: {
				// Don't set Content-Type if it's FormData; browser sets it automatically
				...(isFormData ? {} : { 'Content-Type': 'application/json' }),
				...options?.headers,
			},
			cache: 'no-store',
			...options,
		});
	};

	const attemptFetch = async (): Promise<Response> => {
		const res = await doFetch();

		// If not 401, return response directly
		if (res.status !== 401) {
			return res;
		}

		// Handle 401 - token refresh needed
		if (isRefreshing) {
			// If already refreshing, add to queue and wait
			return new Promise<Response>((resolve, reject) => {
				pendingQueue.push({
					resolve,
					reject,
					request: doFetch,
				});
			});
		}

		// Start refresh process
		isRefreshing = true;

		try {
			await refreshAccessToken();

			// Refresh successful, retry the original request
			const retryRes = await doFetch();

			// Process queue with successful retry
			processQueue();

			return retryRes;
		} catch (refreshError) {
			// Refresh failed, redirect to login
			const loginError = new Error('Authentication failed, redirecting to login', { cause: refreshError });
			processQueue(loginError);
			redirectToLogin();
			throw loginError;
		} finally {
			isRefreshing = false;
		}
	};

	const finalRes = await attemptFetch();

	if (!finalRes.ok) {
		const errorBody = await finalRes.clone().json();
		const errorMsg = errorBody.message || 'Unknown error';
		throw new Error(typeof errorMsg !== 'string' ? JSON.stringify(errorMsg) : errorMsg);
	}

	try {
		return await finalRes.json();
	} catch (parseError) {
		throw new Error('Failed to parse response as JSON', { cause: parseError });
	}
}
