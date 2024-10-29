import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service';

export function useProfile() {
	const { data: authUser, isLoading } = useQuery({
		queryKey: ['authUser'],
		queryFn: () => authService.getCurrentUser(),
	});

	return { authUser, isLoading };
}