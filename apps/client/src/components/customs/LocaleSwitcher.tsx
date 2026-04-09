'use client';

import { Link, usePathname } from '@i18n/navigation';
import { Locale } from '@i18n/routing';
import { Button } from '@ui/button';

interface Props extends React.HTMLAttributes<HTMLUListElement> {}

type LinkMap = Record<Locale, string>;
const linkMap: LinkMap = {
	en: 'English',
	de: 'Deutsch',
	fr: 'Français',
};

const LocaleSwitcher = ({ ...props }: Props) => {
	const pathname = usePathname();

	return (
		<ul className='flex gap-x-4' {...props}>
			{Object.entries(linkMap).map(([locale, label]) => (
				<li key={locale}>
					<Button asChild>
						<Link href={pathname} locale={locale}>
							{label}
						</Link>
					</Button>
				</li>
			))}
		</ul>
	);
};

export default LocaleSwitcher;
