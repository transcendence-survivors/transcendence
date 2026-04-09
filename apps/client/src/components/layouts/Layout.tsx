import Nav from '../customs/Nav';
import UserCard from '../customs/Users/Card';
import TrendingWidget from '../customs/Trends/Widget';
import FooterLinks from '../customs/FooterLinks';

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

const Layout = ({ children, ...props }: LayoutProps) => {
	return (
		<div className='layout' {...props}>
			<div className='bg-sidebar text-sidebar-foreground px-4 flex justify-end'>
				<Nav className='sticky-bar scrollableContainer' align='right' />
			</div>
			{children}
			<div className='px-8 flex flex-col'>
				<div className='sticky-bar space-y-4'>
					<aside className='scrollableContainer space-y-4'>
						<TrendingWidget />
						<TrendingWidget />
						<TrendingWidget />
						<WhoToFollowWidget />
					</aside>
					<FooterLinks />
				</div>
			</div>
		</div>
	);
};

export default Layout;

const suggestions = [
	{ name: 'Alice Martin', handle: '@alicemartin', avatar: 'AM' },
	{ name: 'Bob Chen', handle: '@bobchen', avatar: 'BC' },
	{ name: 'Carol White', handle: '@carolwhite', avatar: 'CW' },
];
function WhoToFollowWidget() {
	return (
		<div className='rounded-2xl bg-muted p-4'>
			<h2 className='mb-3 text-lg font-bold'>Who to follow</h2>
			<ul className='space-y-3'>
				{suggestions.map((u) => (
					<li key={u.handle}>
						<UserCard
							name={u.name}
							handle={u.handle}
							avatar={u.avatar}
							className='w-full'
						/>
					</li>
				))}
			</ul>
		</div>
	);
}
