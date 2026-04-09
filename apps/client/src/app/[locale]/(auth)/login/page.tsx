import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/card';
import { BugReportForm } from './_test';
import MyForm from './_test2';
import Nav from '@/components/customs/Nav';
import LocaleSwitcher from '@/components/customs/LocaleSwitcher';

export default function LoginPage() {
	return (
		<>
			<nav className='bg-background py-4 px-6 flex items-center justify-end gap-4 sticky top-0 z-1000 height-16'>
				<LocaleSwitcher />
			</nav>
			<main className='flex gap-[5vw] px-[10vw] w-full justify-center'>
				<Card className='w-full h-fit mt-10 max-w-96'>
					<CardHeader>
						<CardTitle>
							<h3>Bug Report</h3>
						</CardTitle>
						<CardDescription>
							Help us improve by reporting bugs you encounter.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<MyForm />
					</CardContent>
				</Card>
				<Card className='w-full h-fit mt-10 max-w-96'>
					<CardHeader>
						<CardTitle>
							<h3>Bug Report</h3>
						</CardTitle>
						<CardDescription>
							Help us improve by reporting bugs you encounter.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<BugReportForm />
					</CardContent>
				</Card>
			</main>
		</>
	);
}
