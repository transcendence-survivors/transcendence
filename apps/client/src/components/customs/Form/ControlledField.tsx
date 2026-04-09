'use client';

import * as React from 'react';
import {
	Controller,
	Control,
	FieldValues,
	Path,
	ControllerRenderProps,
	ControllerFieldState,
	UseFormStateReturn,
} from 'react-hook-form';
import { Field, FieldLabel, FieldError as FieldErrorComp } from '@ui/field';
import { useTranslations } from 'next-intl';
import { translateError } from '@i18n/utils';

interface ControlledFieldProps<T extends FieldValues> {
	name: Path<T>;
	control: Control<T>;
	label: string;
	children: (props: {
		field: ControllerRenderProps<T, Path<T>>;
		fieldState: ControllerFieldState;
		formState: UseFormStateReturn<T>;
	}) => React.ReactNode;
}

const ControlledField = <T extends FieldValues>({
	name,
	control,
	label,
	children,
}: ControlledFieldProps<T>) => {
	const t = useTranslations();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState, formState }) => (
				<Field data-invalid={fieldState.invalid} className='gap-1'>
					<FieldLabel className='grid gap-2'>
						<span>{label}</span>
						{children({ field, fieldState, formState })}
					</FieldLabel>
					{fieldState.invalid && (
						<FieldErrorComp errors={[translateError(t, fieldState.error)]} />
					)}
				</Field>
			)}
		/>
	);
};

export default ControlledField;
