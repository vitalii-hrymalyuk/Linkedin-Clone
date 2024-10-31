import { useMutation, useQueryClient } from '@tanstack/react-query';
import { connectionService } from '../services/connection.service';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { ErrorResponse } from '../types/common.types';
import { Link } from 'react-router-dom';
import { IConnection } from '../types/connection.types';

const FriendRequest = ({ request }: { request: IConnection }) => {
  const queryClient = useQueryClient();

  const { mutate: acceptConnectionRequest } = useMutation({
    mutationFn: (requestId: string) =>
      connectionService.acceptRequest(requestId),
    onSuccess: () => {
      toast.success('Connection request accepted');
      queryClient.invalidateQueries({ queryKey: ['connectionRequests'] });

    },
    onError: (err: AxiosError<ErrorResponse>) => {
      toast.error(err.response?.data.message || 'An error occurred');
    },
  });

  const { mutate: rejectConnectionRequest } = useMutation({
    mutationFn: (requestId: string) =>
      connectionService.rejectRequest(requestId),
    onSuccess: () => {
      toast.success('Connection request rejected');
      queryClient.invalidateQueries({ queryKey: ['connectionRequests'] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message || 'An error occurred');
    },
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${request.sender.username}`}>
          <img
            src={request.sender.profilePicture || '/avatar.png'}
            alt={request.sender.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link
            to={`/profile/${request.sender.username}`}
            className="font-semibold text-lg"
          >
            {request.sender.name}
          </Link>
          <p className="text-gray-600">{request.sender.headline}</p>
        </div>
      </div>
      <div className="space-x-2">
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          onClick={() => acceptConnectionRequest(request._id)}
        >
          Accept
        </button>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          onClick={() => rejectConnectionRequest(request._id)}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
