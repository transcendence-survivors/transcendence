'use client';

import { z } from 'zod';
import Form from '@components/customs/Form/Form';
import type { FormField } from '@components/customs/Form/FormField';
import { useLogin } from '@hooks/useLogin';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { translateFields } from '@i18n/utils';
import { useTranslations } from 'next-intl';
import { FORM_ERRORS } from '@constants/errors';
import { i18nError } from '@i18n/utils';

const schema = z.object({
	name: z
		.string({ message: FORM_ERRORS.type })
		.min(5, { message: i18nError(FORM_ERRORS.minLength, { min: 5 }) })
		.max(50, {
			message: i18nError(FORM_ERRORS.maxLength, { max: 50 }),
		}),

	email: z.email({ message: FORM_ERRORS.invalidEmail }),

	role: z.enum(['admin', 'user'], { message: FORM_ERRORS.select }),

	bio: z.string({ message: FORM_ERRORS.type }).max(100, {
		message: i18nError(FORM_ERRORS.maxLength, { max: 100 }),
	}),

	acceptTerms: z.boolean({ message: FORM_ERRORS.type }).refine((val) => val === true, {
		message: FORM_ERRORS.mustAcceptTerms,
	}),
});

type FormValues = z.output<typeof schema>;

const fields = [
	{
		name: 'name',
		label: 'name',
		component: 'input',
		placeholder: 'namePlaceholder',
	},
	{
		name: 'email',
		label: 'email',
		component: 'input',
		placeholder: 'emailPlaceholder',
		type: 'email',
	},
	{
		name: 'role',
		label: 'role',
		component: 'select',
		placeholder: 'rolePlaceholder',
		optionsGroups: [
			{
				label: 'userRoles',
				options: [
					{ value: 'admin', label: 'admin' },
					{ value: 'user', label: 'user' },
				],
			},
		],
	},
	{
		name: 'bio',
		label: 'bio',
		component: 'textarea',
		placeholder: 'bioPlaceholder',
		addon: {
			type: 'length',
			align: 'block-end',
			maxLength: 100,
		},
	},
	{
		component: 'checkbox',
		name: 'acceptTerms',
		label: 'acceptTerms',
		placeholder: '',
	},
] satisfies FormField<FormValues>[];

const defaultValues = {
	name: '',
	email: '',
	role: '' as FormValues['role'],
	bio: '',
	acceptTerms: false,
} satisfies FormValues;

export default function MyForm() {
	const { mutate, isPending, isError, isSuccess } = useLogin();
	const t = useTranslations('forms.test');
	const translatedFields = useMemo(() => translateFields(fields, t), [t]);

	const onSubmit = (data: FormValues) => {
		console.log('Form submitted:', data);

		mutate(data, {
			onSuccess: () => {
				toast.success('Form submitted successfully!');
			},
		});
	};

	return (
		<Form
			schema={schema}
			fields={translatedFields}
			defaultValues={defaultValues}
			onSubmit={onSubmit}
			resetBtn={{
				show: true,
				text: t('reset'),
			}}
			submitBtn={{
				text: t('submit'),
				onDisabledText: t('disabled'),
				onSubmitedText: t('submitted'),
				onEmptyFieldsText: t('emptyFieldsBtn'),
			}}
			states={{
				isPending,
				isError,
				wasSubmitted: isSuccess,
			}}
		/>
	);
}
