import Link from 'next/link';

const links = ['Terms', 'Privacy', 'Cookies', 'Accessibility', 'Ads info'];

const FooterLinks = () => {
	return (
		<div className='flex flex-wrap gap-x-2 gap-y-1 px-1'>
			{links.map((l) => (
				<Link
					key={l}
					href='#'
					className='text-xs text-muted-foreground hover:underline'>
					{l}
				</Link>
			))}
			<span className='text-xs text-muted-foreground'>© 2026 YourApp</span>
		</div>
	);
};

export default FooterLinks;
