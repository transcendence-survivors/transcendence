import { Button } from '@ui/button';
import { Spinner } from '@ui/spinner';

export interface SubmitButtonProps {
	onSubmitedText: string;
	onDisabledText: string;
	text: string;
	onEmptyFieldsText?: string;
	wasSubmitted: boolean;
	isDisabled: boolean;
	isLoading?: boolean;
	isEmptyFields?: boolean;
}

export const SubmitBtn = ({
	text,
	onDisabledText,
	onSubmitedText,
	onEmptyFieldsText,
	wasSubmitted,
	isDisabled,
	isLoading = false,
	isEmptyFields = false,
}: SubmitButtonProps) => {
	const display = () => {
		if (wasSubmitted) return onSubmitedText;
		if (isLoading) return <Spinner />;
		if (isEmptyFields && onEmptyFieldsText) return onEmptyFieldsText;
		if (isDisabled) return onDisabledText;
		return text;
	};

	return (
		<Button type='submit' disabled={isDisabled || isLoading || isEmptyFields}>
			{display()}
		</Button>
	);
};

export default SubmitBtn;
