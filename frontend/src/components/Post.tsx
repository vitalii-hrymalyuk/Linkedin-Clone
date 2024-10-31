import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Loader, MessageCircle, Send, ThumbsUp, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { postService } from '../services/post.service';
import { ErrorResponse } from '../types/common.types';
import { IComment, IPost } from '../types/post.types';
import PostAction from './PostAction';

const Post = ({ post }: { post: IPost }) => {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const { authUser } = useProfile();

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const isOwner = authUser?._id === post.author._id;
  const isLiked = post.likes.includes(authUser?._id!);

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => postService.deletePost(post._id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully!');
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      toast.error(err.response?.data.message || 'Something went wrong!');
    },
  });

  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment: string) =>
      postService.createComment(post._id!, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Comment added successfully!');
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      toast.error(err.response?.data.message || 'Failed to add comment!');
    },
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => postService.likePost(post._id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  const handleDeletePost = () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    deletePost();
  };

  const handleLikePost = () => {
    if (isLikingPost) return;
    likePost();
  };

  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment(newComment);
      setNewComment('');
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser?._id,
            name: authUser?.name!,
            profilePicture: authUser?.profilePicture,
          },
          createdAt: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="bg-secondary rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to={`/profile/${post.author.username}`}>
              <img
                src={post.author.profilePicture || '/avatar.png'}
                alt={post.author.name}
                className="w-10 h-10 rounded-full"
              />
            </Link>

            <div>
              <Link to={`/profile/${post.author.username}`}>
                <h3 className="font-semibold">{post.author.name}</h3>
              </Link>
              <p className="text-xs text-info">{post.author.headline}</p>
              <p className="text-xs text-info">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700"
            >
              {isDeletingPost ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg w-full mb-4"
          />
        )}

        <div className="flex justify-between text-info">
          <PostAction
            icon={
              <ThumbsUp size={18} className={isLiked ? 'text-blue-500' : ''} />
            }
            text={`Like (${post.likes.length})`}
            onClick={handleLikePost}
          />

          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment(s) (${comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />

          {/* <PostAction icon={<Share size={18} />} text="Share" /> */}
        </div>
      </div>
      {showComments && (
        <div className="p-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment: IComment) => (
              <div
                key={comment._id}
                className="mb-2 bg-base-100 p-2 rounded flex items-start"
              >
                <img
                  src={comment.user.profilePicture || '/avatar.png'}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold mr-2">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-info">
                      {formatDistanceToNow(new Date(comment.createdAt))}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              className="flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300"
              disabled={isAddingComment}
            >
              {isAddingComment ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
