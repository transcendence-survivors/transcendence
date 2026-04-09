import ControlledField from './ControlledField';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from '@ui/input-group';
import { Input } from '@ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectLabel,
} from '@ui/select';
import type {
	Control,
	ControllerFieldState,
	ControllerRenderProps,
	FieldValues,
	Path,
} from 'react-hook-form';
import { Checkbox } from '@ui/checkbox';

interface FormFieldLengthAddon {
	type: 'length';
	align?: 'block-end' | 'block-start';
	maxLength: number;
}

type FormFieldAddon = FormFieldLengthAddon;

interface FormInput {
	component: 'input';
	type?: string;
}

interface FormTextarea {
	component: 'textarea';
	addon?: FormFieldAddon;
}

interface FormOption {
	value: string;
	label: string;
}

interface FormGroup {
	label?: string;
	options: FormOption[];
}

interface FormSelect {
	component: 'select';
	optionsGroups: FormGroup[];
}

interface FormCheckBox {
	component: 'checkbox';
}

export interface FormFieldBase<T extends FieldValues> {
	name: Path<T>;
	label: string;
	placeholder?: string;
}
export type FormField<T extends FieldValues> = FormFieldBase<T> &
	(FormInput | FormTextarea | FormSelect | FormCheckBox);

interface FormFieldProps<T extends FieldValues> {
	field: FormField<T>;
	control: Control<T>;
	disabled?: boolean;
}

export const FormField = <T extends FieldValues>({
	field,
	control,
	disabled = false,
}: FormFieldProps<T>) => {
	const componentType = field.component;

	const renderControl = (
		rhfField: ControllerRenderProps<T, Path<T>>,
		fieldState: ControllerFieldState,
	) => {
		switch (componentType) {
			case 'input':
				return (
					<Input
						{...rhfField}
						value={rhfField.value ?? ''}
						placeholder={field.placeholder}
						aria-invalid={fieldState.invalid}
						disabled={disabled}
						type={field.type ?? 'text'}
					/>
				);

			case 'textarea':
				return (
					<InputGroupTextarea
						{...rhfField}
						value={rhfField.value ?? ''}
						placeholder={field.placeholder}
						aria-invalid={fieldState.invalid}
						disabled={disabled}
					/>
				);

			case 'select':
				return (
					<Select
						{...rhfField}
						onValueChange={rhfField.onChange}
						aria-invalid={fieldState.invalid}
						disabled={disabled}>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder={field.placeholder} />
						</SelectTrigger>
						<SelectContent>
							{field.optionsGroups.map((group, groupIndex) => (
								<SelectGroup key={groupIndex}>
									{group.label && (
										<SelectLabel>{group.label}</SelectLabel>
									)}
									{group.options.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectGroup>
							))}
						</SelectContent>
					</Select>
				);
			case 'checkbox':
				return (
					<Checkbox
						{...rhfField}
						checked={!!rhfField.value}
						onCheckedChange={(checked) => rhfField.onChange(checked)}
						aria-invalid={fieldState.invalid}
						disabled={disabled}
					/>
				);
		}
	};

	const renderAddon = (rhfField: ControllerRenderProps<T, Path<T>>) => {
		if ('addon' in field && field.addon) {
			return (
				<InputGroupAddon align={field.addon.align}>
					<InputGroupText>
						{field.addon.type === 'length' &&
							`${rhfField.value?.toString().length || 0} / ${field.addon.maxLength} characters max`}
					</InputGroupText>
				</InputGroupAddon>
			);
		}
	};

	return (
		<ControlledField name={field.name} control={control} label={field.label}>
			{({ field: rhfField, fieldState }) => (
				<>
					{componentType === 'checkbox' ? (
						renderControl(rhfField, fieldState)
					) : (
						<InputGroup>
							{renderControl(rhfField, fieldState)}
							{renderAddon(rhfField)}
						</InputGroup>
					)}
				</>
			)}
		</ControlledField>
	);
};
