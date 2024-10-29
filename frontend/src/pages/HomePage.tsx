import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { postService } from '../services/post.service';
import Sidebar from '../components/Sidebar';
import { useProfile } from '../hooks/useProfile';
import PostCreation from '../components/PostCreation';

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

  console.log(posts)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authUser} />
      </div>
    </div>
  );
};

export default HomePage;
