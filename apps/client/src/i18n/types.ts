type Join<K, P> = K extends string | number
	? P extends string | number
		? `${K}.${P}`
		: never
	: never;

type DeepKeys<T> = {
	[K in keyof T]: T[K] extends object ? Join<K, DeepKeys<T[K]>> : K;
}[keyof T];

export type AppMessages = typeof import('@/messages/en/common.json');
export type MessageKeys = DeepKeys<AppMessages>;
