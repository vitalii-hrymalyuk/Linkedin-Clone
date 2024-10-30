import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useProfile } from '../hooks/useProfile';
import { notificationService } from '../services/notification.service';
import { INotification, NotificationType } from '../types/notification.types';
import { ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IPost } from '../types/post.types';
import Sidebar from '../components/Sidebar';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { authUser } = useProfile();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
  });

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted successfully!');
    },
  });

  const renderNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LIKE:
        return <ThumbsUp className="text-blue-500" />;
      case NotificationType.COMMENT:
        return <MessageSquare className="text-green-500" />;
      case NotificationType.CONNECTION_ACCEPTED:
        return <UserPlus className="text-purple-500" />;
      default:
        return null;
    }
  };

  const renderNotificationContent = (notification: INotification) => {
    switch (notification.type) {
      case NotificationType.LIKE:
        return (
          <span>
            <strong>{notification.relatedUser.name}</strong> liked your post
          </span>
        );
      case NotificationType.COMMENT:
        return (
          <span>
            <Link
              to={`/profile/${notification.relatedUser.username}`}
              className="font-bold"
            >
              {notification.relatedUser.name}
            </Link>{' '}
            commented on your post
          </span>
        );
      case NotificationType.CONNECTION_ACCEPTED:
        return (
          <span>
            <Link
              to={`/profile/${notification.relatedUser.username}`}
              className="font-bold"
            >
              {notification.relatedUser.name}
            </Link>{' '}
            accepted your connection request
          </span>
        );
      default:
        return null;
    }
  };

  const renderRelatedPost = (relatedPost: IPost) => {
    if (!relatedPost) {
      return null;
    }

    return (
      <Link
        to={`/post/${relatedPost._id}`}
        className="mt-2 p-2 bg-gray-50 rounded-mb flex items-center space-x-2 hover:bg-gray-100 transition-colors"
      >
        {relatedPost.image && (
          <img
            src={relatedPost.image}
            alt="Post preview"
            className="w-10 h-10 object-cover rounded"
          />
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-600 truncate">
            {relatedPost.content}
          </p>
        </div>
        <ExternalLink size={14} className="text-gray-400" />
      </Link>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser!} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>

          {isLoading ? (
            <p>Loading notifications...</p>
          ) : notifications && notifications.length > 0 ? (
            <ul>
              {notifications.map((notification: INotification) => (
                <li
                  key={notification._id}
                  className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
                    !notification.read ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/profile/${notification.relatedUser.username}`}
                      >
                        <img
                          src={
                            notification.relatedUser.profilePicture ||
                            '/avatar.png'
                          }
                          alt={notification.relatedUser.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </Link>

                      <div>
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-gray-100 rounded-full">
                            {renderNotificationIcon(notification.type)}
                          </div>
                          <p className="text-sm">
                            {renderNotificationContent(notification)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                        {renderRelatedPost(notification.relatedPost)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsReadMutation(notification._id!)}
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          aria-label="Mark as read"
                        >
                          <Eye size={16} />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          deleteNotificationMutation(notification._id!)
                        }
                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        aria-label="Delete notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notification at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default NotificationsPage;
