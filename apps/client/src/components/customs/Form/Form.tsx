'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormField as FormFieldComponent } from './FormField';
import type { FormField } from './FormField';
import { Field, FieldError } from '@ui/field';

import type { FieldValues, Resolver, DefaultValues } from 'react-hook-form';
import { useEffect } from 'react';
import SubmitBtn, { type SubmitButtonProps } from './SubmitBtn';
import ResetButton, { ResetButtonProps } from './ResetBtn';

type Schema<TOut extends FieldValues> = z.ZodType<TOut, FieldValues>;

interface TruethyFormResetButtonProps extends Omit<ResetButtonProps, 'isDisabled'> {
	show: true;
}
interface FalsyFormResetButtonProps {
	show: false;
}
type FormResetButtonProps = TruethyFormResetButtonProps | FalsyFormResetButtonProps;

type FormSubmitButtonProps = Omit<
	SubmitButtonProps,
	'isLoading' | 'wasSubmitted' | 'isDisabled'
>;

interface FormState {
	isPending?: boolean;
	isError?: boolean;
	wasSubmitted?: boolean;
}

export interface FormProps<TOut extends FieldValues> {
	fields: FormField<TOut>[];
	schema: Schema<TOut>;
	defaultValues: DefaultValues<TOut>;
	onSubmit: (data: TOut) => void;
	states: FormState;
	allowMultipleSubmissions?: boolean;
	resetBtn: FormResetButtonProps;
	submitBtn: FormSubmitButtonProps;
}

export default function Form<TOut extends FieldValues>({
	fields,
	schema,
	defaultValues,
	onSubmit,
	states: { isPending = false, isError = false, wasSubmitted = false },
	allowMultipleSubmissions = false,
	resetBtn = { show: false },
	submitBtn,
}: FormProps<TOut>) {
	const {
		control,
		handleSubmit,
		reset,
		formState: { isDirty },
	} = useForm<TOut>({
		resolver: zodResolver(schema) as Resolver<TOut>,
		defaultValues,
	});

	const isFieldDisabled =
		isPending || isError || (wasSubmitted && !allowMultipleSubmissions);

	useEffect(() => {
		if (wasSubmitted) reset();
	}, [wasSubmitted, reset]);

	const renderResetBtn = () => {
		if (!resetBtn.show) return null;
		const { show, ...resetBtnProps } = resetBtn;
		return show ? (
			<ResetButton
				{...resetBtnProps}
				isDisabled={isFieldDisabled || !isDirty}
				onClick={() => reset()}
			/>
		) : null;
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-4' noValidate>
			{fields.map((field, index) => (
				<FormFieldComponent
					key={index}
					field={field}
					control={control}
					disabled={isFieldDisabled}
				/>
			))}
			<Field>
				{renderResetBtn()}
				<SubmitBtn
					{...submitBtn}
					isLoading={isPending}
					wasSubmitted={wasSubmitted}
					isDisabled={isFieldDisabled}
					isEmptyFields={!isDirty}
				/>
				{isError && (
					<FieldError
						className='text-center'
						errors={[
							{
								message:
									'Unexpected error occurred, please try again later.',
							},
						]}
					/>
				)}
			</Field>
		</form>
	);
}
