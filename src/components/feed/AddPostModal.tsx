'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setAddPostModalOpen } from '@/src/store/slices/uiSlice';
import { useAddPostMutation } from '@/src/store/api/contentApi';
import { addPostSchema, AddPostFormValues, categoriesEnum, contentTypesEnum } from '@/src/lib/validators';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Send, Image as ImageIcon } from 'lucide-react';

export const AddPostModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isAddPostModalOpen);
  const [addPost, { isLoading }] = useAddPostMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddPostFormValues>({
    resolver: zodResolver(addPostSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      type: 'social',
      category: 'technology',
      imageUrl: '',
      tags: '',
      authorName: 'Alex Rivera',
    },
  });

  const handleClose = () => {
    dispatch(setAddPostModalOpen(false));
    reset();
  };

  const onSubmit = async (data: AddPostFormValues) => {
    try {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      await addPost(payload).unwrap();
      handleClose();
    } catch (error) {
      console.error('Failed to add post:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Custom Post"
      description="Add a new article, movie recommendation, or social update to the community feed."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
        <Input
          label="Title"
          placeholder="e.g. Next.js 16 Server Components Architecture..."
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200 mb-1.5">
              Content Type
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full rounded-xl bg-white dark:bg-[#0b271d] border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 text-xs font-bold px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="news">News Article</option>
                  <option value="movie">Movie Recommendation</option>
                  <option value="social">Community Post</option>
                </select>
              )}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200 mb-1.5">
              Category
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full rounded-xl bg-white dark:bg-[#0b271d] border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 text-xs font-bold px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {categoriesEnum.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200 mb-1.5">
            Summary / Description
          </label>
          <textarea
            rows={3}
            placeholder="Provide a brief summary of the post..."
            className="w-full rounded-xl bg-white dark:bg-[#0b271d] border border-emerald-200/90 dark:border-emerald-800/70 text-emerald-950 dark:text-emerald-100 placeholder-emerald-800/40 dark:placeholder-emerald-300/40 text-xs p-3 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">{errors.description.message}</p>
          )}
        </div>

        <Input
          label="Cover Image URL (Optional)"
          placeholder="https://images.unsplash.com/photo-..."
          icon={<ImageIcon className="w-4 h-4" />}
          error={errors.imageUrl?.message}
          {...register('imageUrl')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Author Name"
            placeholder="Your name"
            error={errors.authorName?.message}
            {...register('authorName')}
          />
          <Input
            label="Tags (Comma separated)"
            placeholder="React, AI, Tech"
            error={errors.tags?.message}
            {...register('tags')}
          />
        </div>

        <div className="pt-3 border-t border-emerald-100 dark:border-emerald-800 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading} className="gap-1.5">
            <Send className="w-3.5 h-3.5" />
            <span>Publish Post</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
