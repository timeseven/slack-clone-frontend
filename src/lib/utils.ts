import { Draft } from 'immer';
import Cookies from 'js-cookie';
import { twMerge } from 'tailwind-merge';
import { get, set, del } from 'idb-keyval';
import { clsx, type ClassValue } from 'clsx';
import { StateStorage } from 'zustand/middleware';
import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getStoredValue = <T>(key: string, defaultValue: T): T => {
	const storedValue = localStorage.getItem(key);
	return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
};

export const cookieStorage: StateStorage = {
	getItem: (key: string): string | null => {
		return Cookies.get(key) ?? null;
	},
	setItem: (key: string, value: string) => {
		Cookies.set(key, value, { path: '/', expires: 365 });
	},
	removeItem: (key: string) => {
		Cookies.remove(key, { path: '/' });
	},
};

// Manual persist
export const forcePersist = <T extends object>(store: {
	getState: () => T;
	setState: (nextStateOrUpdater: T | ((state: Draft<T>) => void), shouldReplace: true) => void;
}) => {
	const snapshot = store.getState();
	store.setState(snapshot, true);
};

/**
 * Creates an Indexed DB persister
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery') {
	return {
		persistClient: async (client: PersistedClient) => {
			await set(idbValidKey, client);
		},
		restoreClient: async () => {
			return await get<PersistedClient>(idbValidKey);
		},
		removeClient: async () => {
			await del(idbValidKey);
		},
	} satisfies Persister;
}

export const getCroppedImg = (
	imageSrc: string,
	pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> => {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.crossOrigin = 'anonymous';
		image.src = imageSrc;
		image.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = pixelCrop.width;
			canvas.height = pixelCrop.height;
			const ctx = canvas.getContext('2d');

			if (!ctx) {
				reject(new Error('Failed to get canvas context'));
				return;
			}

			ctx.drawImage(
				image,
				pixelCrop.x,
				pixelCrop.y,
				pixelCrop.width,
				pixelCrop.height,
				0,
				0,
				pixelCrop.width,
				pixelCrop.height
			);

			resolve(canvas.toDataURL('image/jpeg'));
		};
		image.onerror = (error) => reject(error);
	});
};

export const dataURLtoFile = (dataUrl: string, filename: string): File => {
	const arr = dataUrl.split(',');
	const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
};

export const createDelta = (text: string) => {
	return JSON.stringify({
		ops: [{ insert: text.endsWith('\n') ? text : `${text}\n` }],
	});
};
