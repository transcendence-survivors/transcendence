import { Button, ButtonProps } from '@ui/button';

export interface ResetButtonProps {
	text: string;
	onDisabledText?: string;
	isDisabled: boolean;
}

interface Props extends ResetButtonProps, Omit<ButtonProps, 'disabled'> {}

const ResetButton = ({ onDisabledText, isDisabled, text, onClick, ...props }: Props) => {
	return (
		<Button
			type='button'
			variant='outline'
			onClick={onClick}
			disabled={isDisabled}
			{...props}>
			{isDisabled ? onDisabledText || text : text}
		</Button>
	);
};

export default ResetButton;
