import { useParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../services/post.service';
import Sidebar from '../components/Sidebar';
import Post from '../components/Post';

const PostPage = () => {
  const { postId } = useParams();
  const { authUser } = useProfile();

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postService.getPostById(postId!),
  });

  if (isLoading) return <div>Loading post...</div>;

  if (!post) return <div>Post not found</div>;

  return <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
		<div className='hidden lg:block lg:col-span-1'>
			<Sidebar user={authUser!}/>
		</div>
		<div className='col-span-1 lg:col-span-3'>
			<Post post={post}/>
		</div>
	</div>
};

export default PostPage;
