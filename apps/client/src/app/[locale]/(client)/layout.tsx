import Layout from '@components/layouts/Layout';
import LocaleSwitcher from '@components/customs/LocaleSwitcher';
import { type Locale } from '@i18n/routing';

type Params = Promise<{
	locale: Locale;
}>;

interface RootLayoutProps {
	children: React.ReactNode;
	params: Params;
}

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<>
			<nav className='bg-background py-4 px-6 flex items-center justify-end gap-4 sticky top-0 z-1000 height-16'>
				<LocaleSwitcher />
			</nav>
			<Layout>{children}</Layout>
		</>
	);
}
