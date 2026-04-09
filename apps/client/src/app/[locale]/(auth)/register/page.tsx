'use client';

import useUser from '@hooks/useUser';
import { useSessionActions } from '@libs/stores/session';
import { User } from '@libs/zod/user.schema';

const RegisterPage = () => {
	const { data, isLoading, isError } = useUser();
	const { setSession } = useSessionActions();

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>Error loading user data.</div>;
	}

	const user = data;
	setSession({
		user: user as User,
		accessToken: '',
	});

	return (
		<div className='container mx-auto py-10'>
			<h1 className='text-2xl font-bold mb-6'>Register</h1>
			{user ? (
				<div>
					<p>Welcome back, {user.name}!</p>
					<p>Your email: {user.email}</p>
				</div>
			) : (
				<p>Please register to access more features.</p>
			)}
		</div>
	);
};

export default RegisterPage;
