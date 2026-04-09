import I18nLink from './I18nLink';
import { useTranslations } from 'next-intl';
import { Button } from '@ui/button';
import { cn } from '@libs/utils';
import { RouteKey } from '@i18n/routing';
import type { AppMessages } from '@i18n/types';

interface NavLink {
	key: RouteKey;
	labelKey: keyof AppMessages['nav'];
}

const navLinks: NavLink[] = [
	{ key: 'home', labelKey: 'home' },
	{ key: 'game', labelKey: 'game' },
	{ key: 'leaderboard', labelKey: 'leaderboard' },
	{ key: 'profile', labelKey: 'profile' },
	{ key: 'settings', labelKey: 'settings' },
	{ key: 'posts', labelKey: 'posts' },
];

interface NavProps extends React.HTMLAttributes<HTMLElement> {
	align?: 'left' | 'center' | 'right';
	linkWidth?: 'fit' | 'full';
}

type Align = NonNullable<NavProps['align']>;
type LinkWidth = NonNullable<NavProps['linkWidth']>;

type AlignClass = Record<Align, string>;
type LinkWidthClass = Record<LinkWidth, string>;

const alignX = {
	left: 'justify-start',
	center: 'justify-center',
	right: 'justify-end',
} satisfies AlignClass;

const alignY = {
	left: 'items-start',
	center: 'items-center',
	right: 'items-end',
} satisfies AlignClass;

const linkWidthClass = {
	fit: 'w-auto',
	full: 'w-full',
} satisfies LinkWidthClass;

const Nav = ({ className, align = 'left', linkWidth = 'full', ...props }: NavProps) => {
	const t = useTranslations('nav');

	return (
		<nav className={cn(className)} {...props}>
			<ul className={`flex space-y-4 flex-col ${alignY[align]}`}>
				{navLinks.map((link) => (
					<li key={link.key} className={`${linkWidthClass[linkWidth]}`}>
						<Button
							variant='ghost'
							className={`w-full ${alignX[align]}`}
							asChild>
							<I18nLink href={link.key}>{t(link.labelKey)}</I18nLink>
						</Button>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Nav;
