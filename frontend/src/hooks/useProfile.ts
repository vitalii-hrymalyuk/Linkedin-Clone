import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service';

export function useAuthUser() {
	const { data: authUser, isLoading } = useQuery({
		queryKey: ['authUser'],
		queryFn: () => authService.getCurrentUser(),
	});

	return { authUser, isLoading };
}