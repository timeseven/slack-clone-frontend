// emoji-dictionary.d.ts
declare module 'emoji-dictionary' {
	export function getName(emoji: string): string | undefined;
	export function getUnicode(name: string): string | undefined;
	export const names: string[];
	export const unicode: string[];
}
