import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { postService } from '../services/post.service';
import Sidebar from '../components/Sidebar';
import { useProfile } from '../hooks/useProfile';
import PostCreation from '../components/PostCreation';
import { IPost } from '../types/post.types';
import Post from '../components/Post';
import { Users } from 'lucide-react';
import { IUser } from '../types/auth.types';
import RecommendedUser from '../components/RecommendedUser';

const HomePage = () => {
  const { authUser } = useProfile();

  const { data: recommendedUsers } = useQuery({
    queryKey: ['recommendedUsers'],
    queryFn: () => userService.getRecommendedUsers(),
  });

  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postService.getPosts(),
  });

  console.log(posts);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser!} />
      </div>

      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authUser!} />
        {posts?.map((post: IPost) => (
          <Post key={post._id} post={post} />
        ))}

        {posts?.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <Users size={64} className="mx-auto text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              No Posts Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect with others to start seeing posts in your feed!
            </p>
          </div>
        )}
      </div>
      {recommendedUsers && recommendedUsers.length > 0 && (
        <div className="col-span-1 lg:col-span-1 hidden lg:block">
          <div className="bg-secondary rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">People you may know</h2>
            {recommendedUsers?.map((user: IUser) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
