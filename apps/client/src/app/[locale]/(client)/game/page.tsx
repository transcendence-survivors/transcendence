import Nav from '@components/customs/Nav';
import LocaleSwitcher from '@components/customs/LocaleSwitcher';

export default async function Page() {
	return (
		<main>
			<h1>Game</h1>
			<br />
			<br />
			<Nav />

			<LocaleSwitcher path='game' />
		</main>
	);
}
