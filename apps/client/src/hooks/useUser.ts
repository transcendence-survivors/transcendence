import { useQuery } from '@tanstack/react-query';

const fetchUser = async () => {
	const fakePromise = new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				id: 1,
				name: 'John Doe',
				email: '',
			});
		}, 1000);
	});
	return await fakePromise;
};

const useUser = () => {
	return useQuery({
		queryKey: ['user'],
		queryFn: fetchUser,
		retry: false,
	});
};

export default useUser;
