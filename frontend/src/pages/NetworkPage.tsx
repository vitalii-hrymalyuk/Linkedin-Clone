import { useQuery } from '@tanstack/react-query';
import { useAuthUser } from '../hooks/useProfile';
import { connectionService } from '../services/connection.service';
import Sidebar from '../components/Sidebar';
import { UserPlus } from 'lucide-react';
import { IConnection } from '../types/connection.types';
import FriendRequest from '../components/FriendRequest';
import UserCard from '../components/UserCard';

const NetworkPage = () => {
  const { authUser } = useAuthUser();

  const { data: connectionRequests } = useQuery({
    queryKey: ['connectionRequests'],
    queryFn: () => connectionService.getConnectionsRequests(),
  });

  const { data: connections } = useQuery({
    queryKey: ['connections'],
    queryFn: () => connectionService.getUserConnections(),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser!} />
      </div>

      <div className="col-span-1 lg:col-span-3">
        <div className="bg-secondary rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">My Network</h1>
          {connectionRequests && connectionRequests.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Connection Request</h2>
              <div className="space-y-4 ">
                {connectionRequests.map((connectionRequest: IConnection) => (
                  <FriendRequest
                    key={connectionRequest._id}
                    request={connectionRequest}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
              <UserPlus size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No Connection Requests
              </h3>
              <p className="text-gray-600">
                You don&apos;t have any pending connection requests at the
                moment.
              </p>
              <p className="text-gray-600 mt-2">
                Explore suggested connections below to expand your network!
              </p>
            </div>
          )}
          {connections && connections.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">My Connections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.map((connection: IConnection) => (
                  <UserCard
                    key={connection._id}
                    user={connection}
                    isConnection={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;
