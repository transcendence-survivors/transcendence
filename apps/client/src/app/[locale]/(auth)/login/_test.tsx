'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@ui/button';
import { Field, FieldError, FieldGroup } from '@ui/field';
import { Input } from '@ui/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from '@ui/input-group';
import ControlledField from '@components/customs/Form/ControlledField';
import { useLogin } from '@hooks/useLogin';
import { Spinner } from '@ui/spinner';

const formSchema = z.object({
	title: z
		.string()
		.min(5, 'Bug title must be at least 5 characters.')
		.max(32, 'Bug title must be at most 32 characters.'),
	description: z
		.string()
		.min(20, 'Description must be at least 20 characters.')
		.max(100, 'Description must be at most 100 characters.'),
});

type FormSchema = z.infer<typeof formSchema>;

export function BugReportForm() {
	const {
		handleSubmit,
		control,
		reset,
		formState: { isDirty },
	} = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
		},
	});

	const { mutate, isPending, isError } = useLogin();
	const onSubmit = (data: FormSchema) => {
		mutate(data, {
			onSuccess: () => reset(),
		});
	};

	const isFieldDisabled = isPending || isError;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-4' noValidate>
			<FieldGroup>
				<ControlledField name='title' control={control} label='Bug Title'>
					{({ field, fieldState }) => (
						<InputGroup>
							<Input
								{...field}
								disabled={isFieldDisabled}
								aria-invalid={fieldState.invalid}
								placeholder='Login button not working on mobile'
							/>
						</InputGroup>
					)}
				</ControlledField>
				<ControlledField name='description' control={control} label='Description'>
					{({ field, fieldState }) => (
						<>
							<InputGroup>
								<InputGroupTextarea
									{...field}
									disabled={isFieldDisabled}
									placeholder="I'm having an issue with the login button on mobile."
									className='max-h-24 resize-none'
									aria-invalid={fieldState.invalid}
								/>
								<InputGroupAddon align='block-end'>
									<InputGroupText>
										{field.value.length}/100 characters
									</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
						</>
					)}
				</ControlledField>
			</FieldGroup>
			<Field>
				<Button
					type='button'
					variant='outline'
					onClick={() => reset()}
					disabled={!isDirty || isFieldDisabled}>
					Reset
				</Button>
				<Button type='submit' disabled={!isDirty || isFieldDisabled}>
					{isPending ? <Spinner className='size-4' /> : 'Submit'}
				</Button>
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
