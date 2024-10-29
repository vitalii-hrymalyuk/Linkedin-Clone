import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Image, Loader } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { readFileAsDataUrl } from '../lib/utilts';
import { postService } from '../services/post.service';
import { IUser } from '../types/auth.types';
import { ErrorResponse } from '../types/common.types';
import { ICreatePost } from '../types/post.types';

const PostCreation = ({ user }: { user: IUser }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(null);

  const queryClient = useQueryClient();

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: (postData: ICreatePost) => postService.createPost(postData),
    onSuccess: () => {
      resetForm();
      toast.success('Post created successfully!');
			queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError(err: AxiosError<ErrorResponse>) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    },
  });

  const handlePostCreation = async () => {
    try {
      let postData: ICreatePost = { content };
      if (image) postData.image = await readFileAsDataUrl(image);

      createPostMutation(postData);
    } catch (error) {
      console.error('Error in handlePostCreation:', error);
    }
  };

  const resetForm = () => {
    setContent('');
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImage(file);
      if (file) {
        readFileAsDataUrl(file).then(setImagePreview as unknown as () => void);
      } else {
        setImagePreview(null);
      }
    }
  };

  return (
    <div className="bg-secondary rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          src={user.profilePicture || '/avatar.png'}
          alt={user.name}
          className="size-12 rounded-full"
        />
        <textarea
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Selected"
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          <label className="flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer">
            <Image size={20} className="mr-2" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <button
          className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200"
          onClick={handlePostCreation}
          disabled={isPending}
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : 'Share'}
        </button>
      </div>
    </div>
  );
};

export default PostCreation;
