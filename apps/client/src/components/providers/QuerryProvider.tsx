'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

type QuerryProviderProps = {
	children: React.ReactNode;
};

const QuerryProvider = ({ children }: QuerryProviderProps) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export { QuerryProvider, queryClient };
