import { cn } from '@libs/utils';
import Trend from './Trend';

const trends = [
	{ tag: 'NextJS', posts: 24000 },
	{ tag: 'TailwindCSS', posts: 18400 },
	{ tag: 'TypeScript', posts: 12900 },
	{ tag: 'ReactJS', posts: 9300 },
];

interface TrendingWidgetProps extends React.HTMLAttributes<HTMLDivElement> {}

const TrendingWidget = ({ className, ...props }: TrendingWidgetProps) => {
	return (
		<div className={cn('rounded-2xl bg-muted py-4', className)} {...props}>
			<h2 className='mb-3 text-lg font-bold px-4'>Trends for you</h2>
			<ul>
				{trends.map((t) => (
					<li key={t.tag}>
						<Trend tag={t.tag} postsCount={t.posts} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default TrendingWidget;
