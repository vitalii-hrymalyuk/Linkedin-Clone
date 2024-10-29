import { useQuery } from '@tanstack/react-query';

import { IUser } from '../types/auth.types';
import { connectionService } from '../services/connection.service';

export function useConnections({ authUser }: { authUser: IUser }) {
	const { data: connections } = useQuery({
		queryKey: ['connectionRequests'],
		queryFn: () => connectionService.getConnections(),
		enabled: !!authUser,
	});


	return { connections };
}