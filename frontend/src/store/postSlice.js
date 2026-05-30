import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchPosts = createAsyncThunk(
  'posts/fetchAll',
  async (fandomSlug, { rejectWithValue }) => {
    try {
      const response = await api.get(`posts/?fandom=${fandomSlug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/create',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await api.post('posts/', postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchComments = createAsyncThunk(
  'posts/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(`posts/${postId}/comments/`);
      return { postId, comments: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createComment = createAsyncThunk(
  'posts/createComment',
  async ({ postId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`posts/${postId}/comments/`, formData);
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const toggleLike = createAsyncThunk(
  'posts/toggleLike',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.post(`posts/${postId}/like/`);
      return { postId, status: response.data.status };
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const post = state.list.find(p => p.id === action.payload.postId);
        if (post) {
          post.is_liked = action.payload.status === 'liked';
          post.likes_count += post.is_liked ? 1 : -1;
        }
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const post = state.list.find(p => p.id === action.payload.postId);
        if (post) {
          post.comments_list = action.payload.comments;
        }
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const post = state.list.find(p => p.id === action.payload.postId);
        if (post) {
          if (!post.comments_list) post.comments_list = [];
          post.comments_list.unshift(action.payload.comment);
          post.comments_count += 1;
        }
      });
  },
});

export default postSlice.reducer;
