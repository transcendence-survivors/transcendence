import type { FieldValues } from 'react-hook-form';
import type { useTranslations } from 'next-intl';
import type { FieldError } from 'react-hook-form';
import type { FormField } from '@components/customs/Form/FormField';
import type { MessageKeys } from './types';

export type TFunction = ReturnType<typeof useTranslations<never>>;

type TranslationValues = Parameters<TFunction>[1];

export type I18nErrorPayload = {
	key: MessageKeys;
	values?: Record<string, string | number>;
};

export const i18nError = (
	...args: [I18nErrorPayload['key'], I18nErrorPayload['values']?]
): string => {
	const [key, values] = args;
	return JSON.stringify({ key, values } satisfies I18nErrorPayload);
};

export const translateError = (
	t: TFunction,
	error?: FieldError,
): FieldError | undefined => {
	if (!error?.message) return undefined;

	try {
		const parsed = JSON.parse(error.message) as Partial<I18nErrorPayload>;

		if (parsed?.key) {
			return {
				...error,
				message: t(parsed.key, parsed.values as TranslationValues),
			};
		}
	} catch {}

	return {
		...error,
		message: t(error.message as MessageKeys),
	};
};

export function translateFields<T extends FieldValues>(
	fields: FormField<T>[],
	t: TFunction,
): FormField<T>[] {
	return fields.map((field) => {
		const base = {
			...field,
			label: t(field.label as MessageKeys),
			placeholder: field.placeholder
				? t(field.placeholder as MessageKeys)
				: undefined,
		};

		switch (field.component) {
			case 'select':
				return {
					...base,
					component: 'select',
					optionsGroups: field.optionsGroups.map((group) => ({
						...group,
						label: group.label ? t(group.label as MessageKeys) : undefined,
						options: group.options.map((opt) => ({
							...opt,
							label: t(opt.label as MessageKeys),
						})),
					})),
				};

			case 'textarea':
				return { ...base, component: 'textarea', addon: field.addon };
			case 'input':
				return { ...base, component: 'input', type: field.type };
			case 'checkbox':
				return { ...base, component: 'checkbox' };
		}
	});
}
