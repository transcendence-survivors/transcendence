import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { loginRequest } from '@libs/api/auth';
import { useSessionActions } from '@libs/stores/session';
import { isApiError } from '@libs/api';
import { authRedirectRoute } from '@i18n/routing';
import { toast } from 'sonner';

const fakeFetch = (data: { title: string; description: string }) => {
	return new Promise<{ data: { id: number; title: string; description: string } }>(
		(resolve, reject) => {
			setTimeout(() => {
				// reject({ message: 'Failed to submit bug report. Please try again.' });
				resolve({
					data: {
						id: Math.floor(Math.random() * 1000),
						title: data.title,
						description: data.description,
					},
				});
			}, 1000);
		},
	);
};

export function useLogin() {
	const router = useRouter();
	const { setSession } = useSessionActions();

	return useMutation({
		mutationFn: fakeFetch,
		onSuccess: (res) => {
			// if (isApiError(res)) {
			// 	console.error('Login error:', res.message);
			// 	return;
			// }
			// const { data: user } = res;
			// setSession({ user: user, accessToken: '' });
			// router.replace(authRedirectRoute);
			console.log('Login successful:', res.data);
			// router.replace(authRedirectRoute);
		},

		onError: (error: unknown) => {
			if (error.message) {
				toast.error(error.message);
			} else {
				toast.error('An unexpected error occurred. Please try again.');
			}
		},
	});
}
