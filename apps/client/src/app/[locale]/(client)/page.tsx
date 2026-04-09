import { getTranslations } from 'next-intl/server';
import RegisterPage from '../(auth)/register/page';
export default async function Home() {
	const t = await getTranslations('home');

	return (
		<main className='bg-background p-8'>
			<h1>{t('welcome')}</h1>
			<RegisterPage />
		</main>
	);
}
