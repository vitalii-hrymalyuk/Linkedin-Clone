import { Response } from 'express';
import PostModel from '../models/post.model';
import IUser, { AuthenticatedRequest } from '../common/types/user.type';
import { IPost } from '../common/types/post.types';
import cloudinary from '../lib/cloudinary';
import NotificationModel from '../models/notification.model';
import { config } from '../config';
import { sendCommentNotificationEmail } from '../emails/emailHandlers';
export const getFeedPosts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const posts = await PostModel.find({
      author: { $in: [...req.user?.connections!, req.user?._id] },
    })
      .populate('author', 'name username profilePicture headline')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error(`Error in getFeedPosts: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content, image } = req.body;

    let newPost: IPost;

    if (image) {
      const imageResult = await cloudinary.uploader.upload(image);
      newPost = new PostModel({
        author: req.user?._id,
        content,
        image: imageResult.secure_url,
      });
    } else {
      newPost = new PostModel({
        author: req.user?._id,
        content,
      });
    }

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(`Error in createPost: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = req.params.id;

    const userId = req.user?._id;

    const post = await PostModel.findById(postId);

    if (!post) {
      res.status(404).send({ message: 'Post not found' });
      return;
    }

    if (post.author!.toString() !== userId!.toString()) {
      res
        .status(403)
        .send({ message: 'You are not authorized to delete this post' });
      return;
    }

    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split('/').pop()?.split('.')[0]!
      );
    }

    await PostModel.findByIdAndDelete(postId);

    res.status(200).send({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(`Error in deletePost: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};

export const getPostById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findById(postId)
      .populate('author', 'name username profilePicture headline')
      .populate('comments.user', 'name username profilePicture headline');

    res.status(200).json(post);
  } catch (error) {
    console.log(`Error in getPostById: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    const post = await PostModel.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: req.user?._id, content } },
      },
      { new: true }
    ).populate<{ author: IUser }>(
      'author',
      'name username profilePicture headline'
    );

    if (post?.author!.toString() !== req.user?._id!.toString()) {
      const newNotification = new NotificationModel({
        recipient: post?.author,
        type: 'comment',
        relatedUser: req.user?._id,
        relatedPost: post?._id,
      });
      await newNotification.save();

      try {
        const postUrl = `${config.CLIENT_URL}/post/${postId}`;
        await sendCommentNotificationEmail(
          post?.author.email!,
          post?.author.name!,
          req.user?.name!,
          postUrl,
          content
        );
      } catch (error) {
        console.log(`Error in sendCommentNotificationEmail: ${error}`);
      }
    }

    res.status(200).json(post);
  } catch (error) {
    console.log(`Error in createComment: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};

export const likePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    const userId = req.user?._id;

    if (userId && post) {
      if (post?.likes.includes(userId)) {
        post.likes = post.likes.filter(
          (id) => id.toString() !== userId!.toString()
        );
      } else {
        post?.likes.push(userId);

        if (post.author!.toString() !== userId.toString()) {
          const newNotification = new NotificationModel({
            recipient: post?.author,
            type: 'like',
            relatedUser: userId,
            relatedPost: postId,
          });

          await newNotification.save();
        }
      }
    }

    await post!.save();
    res.status(200).json(post);
  } catch (error) {
    console.log(`Error in likePost: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};
