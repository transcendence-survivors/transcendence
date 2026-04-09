import { cn } from '@libs/utils';

interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string;
	handle: string;
	avatar: string;
}

const UserCard = ({ name, handle, avatar, className, ...props }: UserCardProps) => {
	return (
		<div
			className={cn(
				'rounded-2xl bg-muted p-4 flex items-center justify-between',
				className,
			)}
			{...props}>
			<div className='flex items-center gap-2'>
				<div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
					{avatar}
				</div>
				<div>
					<p className='text-sm font-semibold leading-tight'>{name}</p>
					<p className='text-xs text-muted-foreground'>{handle}</p>
				</div>
			</div>
			<button className='rounded-full border border-foreground px-3 py-1 text-xs font-semibold hover:bg-foreground hover:text-background transition-colors'>
				Follow
			</button>
		</div>
	);
};

export default UserCard;
