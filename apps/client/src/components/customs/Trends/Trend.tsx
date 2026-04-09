import { cn } from '@libs/utils';
import Link from 'next/link';

interface Trend extends React.HTMLAttributes<HTMLAnchorElement> {
	tag: string;
	postsCount: number;
}

const getPostsText = (count: number) => {
	if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}K posts`;
	}
	return `${count} posts`;
};

const Trend = ({ tag, postsCount, className, ...props }: Trend) => {
	const postsText = getPostsText(postsCount);

	return (
		<Link
			href={`/trends/${tag}`}
			className={cn(
				'w-full justify-start flex flex-col items-start bg-muted px-4 py-2 hover:bg-border focus-within:bg-border transition-colors',
				className,
			)}
			{...props}>
			<p className='text-xs text-muted-foreground'>Trending</p>
			<p className='font-semibold'>#{tag}</p>
			<p className='text-xs text-muted-foreground'>{postsText}</p>
		</Link>
	);
};

export default Trend;
