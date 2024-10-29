import { useQuery } from '@tanstack/react-query';

import { notificationService } from '../services/notification.service';
import { IUser } from '../types/auth.types';

export function useNotifications({ authUser }: { authUser: IUser }) {
	const { data: notifications } = useQuery({
		queryKey: ['notifications'],
		queryFn: () => notificationService.getNotifications(),
		enabled: !!authUser,
	});


	return { notifications };
}