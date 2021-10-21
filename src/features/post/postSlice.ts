import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../../app/store";
import { PROPS_NEWPOST, PROPS_UPDATE_POST, PROPS_COMMENT } from "../types";

const apiUrlPost = `${process.env.REACT_APP_DEV_API_URL}api/v1/post/`;
const apiUrlFollowPost = `${process.env.REACT_APP_DEV_API_URL}api/v1/followuser/post/`;
const apiUrlCreateUpdatePost = `${process.env.REACT_APP_DEV_API_URL}api/v1/create_update_delete_post/`;
const apiUrlComment = `${process.env.REACT_APP_DEV_API_URL}api/v1/comment/`;

export const fetchAsyncGetPosts = createAsyncThunk("post/get", async () => {
  if (localStorage.localJWT){
    const res = await axios.get(apiUrlPost, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }else{
    const res = await axios.get(apiUrlPost);
    return res.data;
  }
});
export const fetchAsyncGetUserPosts = createAsyncThunk("userpost/get", async (id: string) => {
  if (localStorage.localJWT){
    const res = await axios.get(`${apiUrlPost}user/${id}/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }else{
    const res = await axios.get(apiUrlPost);
    return res.data;
  }
});
export const fetchAsyncGetPostsMore = createAsyncThunk("postMore/get", async (link: string) => {
  const res = await axios.get(link, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});
export const fetchAsyncGetPost = createAsyncThunk("postDetail/get", async (id: string) => {
    const  res  = await axios.get(`${apiUrlPost}${id}/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
});
export const fetchAsyncGetFollowUserPost = createAsyncThunk(
  "followuserpost/get",
  async () => {
    const res = await axios.get(`${apiUrlFollowPost}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncGetPostsHashtag = createAsyncThunk("postHashtag/get", async(id: string) => {
  const res = await axios.get(`${apiUrlPost}hashtag/${id}/`,{
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data
});
export const fetchAsyncDeletePost = createAsyncThunk("postDelete/delete", async (id: string) => {
  const  res  = await axios.delete(`${apiUrlCreateUpdatePost}${id}/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});
export const fetchAsyncNewPost = createAsyncThunk(
    "post/post",
    async (newPost: PROPS_NEWPOST) => {
      const uploadData = new FormData();
      uploadData.append("post", newPost.post);
      uploadData.append("isPublic", newPost.isPublic);
      const res = await axios.post(apiUrlCreateUpdatePost, uploadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return res.data;
    }
  );
export const fetchAsyncUpdatePost = createAsyncThunk(
    "post/put",
  async (updatePost: PROPS_UPDATE_POST, ) => {
    const uploadData = new FormData();
    uploadData.append("isPublic", updatePost.isPublic);
    const res = await axios.patch(`${apiUrlCreateUpdatePost}${updatePost.id}/`, uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncGetFavoritePosts = createAsyncThunk(
  "favoritePost/get",
async (userId: string ) => {
    const res = await axios.get(`${apiUrlPost}favorite/${userId}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncPostLiked = createAsyncThunk(
  "like/post",
  async (postId: string) => {
    const res = await axios.post(`${apiUrlPost}like/${postId}/`,{}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncGetProfslikePost = createAsyncThunk(
  "profileLikePost/post",
  async (ProfileId: string[]) => {
    const res = await axios.post(`${apiUrlPost}like/profile/`,{liked_by:ProfileId}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncGetSearchedPost = createAsyncThunk(
  "searchPost/get",
  async (word: string) => {
    const res = await axios.get(`${apiUrlPost}search/${word}/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncGetComments = createAsyncThunk(
  "comment/get",
  async (postId: string) => {
    const res = await axios.get(`${apiUrlPost}${postId}/comment/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const fetchAsyncPostComment = createAsyncThunk(
  "comment/post",
  async (comment: PROPS_COMMENT) => {
    const res = await axios.post(apiUrlComment, comment, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncDeleteComment = createAsyncThunk("commentDelete/delete", async (id: string) => {
  const  res  = await axios.delete(`${apiUrlComment}${id}/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

export const postSlice = createSlice({
  name: "post",
  initialState: {
    isLoadingPost: false,
    openPost: false,
    openProfilesLikePost: false,
    pagenation:{
      count:0,
      next: "",
      previous: "",
    },
    posts: [
      {
        id: "",
        post: "",
        postedBy: "",
        nickName: "",
        img: "",
        createdAt: "",
        updatedAt: "",
        isPublic: "",
        liked: [""],
        tags: [
          {
            id: "", 
            name: ""
          }
        ],
      },
    ],
    post: 
      {
        id: "",
        post: "",
        postedBy: "",
        nickName: "",
        img: "",
        createdAt: "",
        updatedAt: "",
        isPublic: "",
        liked: [""],
        tags: [
          {
            id: "", 
            name: ""
          }
        ],
      },
      profilesLikePost: [
        {
          id: "",
          nickName: "",
          user: "",
          createdAt: "",
          img: "",
          followers: [""],
          following: [""],
        }
      ],
      comments: [
        {
          id: "",
          comment: "",
          commentedBy: "",
          commentedAt: "",
          post: "",
          nickName: "",
          img: "",
        },
      ],
  },
  reducers: {
    setOpenPost(state) {
      state.openPost = true;
    },
    resetOpenPost(state) {
      state.openPost = false;
    },
    setOpenProfilesLikePost(state) {
      state.openProfilesLikePost = true;
    },
    resetOpenProfilesLikePost(state) {
      state.openProfilesLikePost = false;
    },
    fetchPostStart(state) {
      state.isLoadingPost = true;
    },
    fetchPostEnd(state) {
      state.isLoadingPost = false;
    },
    fetchCommentDelete(state, action){
      state.comments = state.comments.filter((comment)=> comment.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetPosts.fulfilled, (state, action) => {
      return {
        ...state,
        pagenation:{
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        },
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncGetUserPosts.fulfilled, (state, action) => {
      return {
        ...state,
        pagenation:{
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        },
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncGetFollowUserPost.fulfilled, (state, action) => {
      return {
        ...state,
        pagenation:{
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        },
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncGetPostsHashtag.fulfilled, (state, action) => {
      return {
        ...state,
        pagenation:{
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        },
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncGetPostsMore.fulfilled, (state, action) => {
      return {
        ...state,
        pagenation:{
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        },
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncGetPost.fulfilled, (state, action) => {
      return {
        ...state,
        post: action.payload,
      };
    });
    builder.addCase(fetchAsyncGetFavoritePosts.fulfilled, (state, action) => {
      return {
        ...state,
        pagenation:{
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        },
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncNewPost.fulfilled, (state, action) => {
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    });
    builder.addCase(fetchAsyncUpdatePost.fulfilled, (state, action) => {
      state.post = action.payload;
      state.posts = state.posts.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
    });
    builder.addCase(fetchAsyncPostLiked.fulfilled, (state, action) => {
      if(action.payload.result==='like'){
        // postのstateの変更
        state.post.liked = [...state.post.liked, action.payload.likedBy];
        // postsのstateの変更
        const add_like = (post:any) => {
          post["liked"] = [...post["liked"], action.payload.likedBy];
          return post;
        }
        state.posts = state.posts.map((post) =>
          post.id === action.payload.post ? add_like(post) : post,
        );
      }
      else if(action.payload.result==='unlike'){
        // 個別のpostのstateの変更
        const likes_before = state.post.liked;
        const unlikedBy = action.payload.unlikedBy;
        const likes_after = likes_before.filter(like => like !== unlikedBy);
        state.post.liked = likes_after;
        // postsのstateの変更
        const delete_like = (post:any) => {
          const previous_likes:string[] = post["liked"]
          const following_likes = previous_likes.filter(like => like !== unlikedBy);
          post["liked"]=following_likes;
          return post;
        }
        state.posts = state.posts.map((post) =>
        post.id === action.payload.post ? delete_like(post) : post,
      );
      }
    });
    builder.addCase(fetchAsyncGetProfslikePost.fulfilled, (state, action) => {
      state.profilesLikePost = action.payload;
    });
    builder.addCase(fetchAsyncGetSearchedPost.fulfilled, (state, action) => {
      return {
        ...state,
        pagenation:{
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        },
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncGetComments.fulfilled, (state, action) => {
      return {
        ...state,
        comments: action.payload,
      };
    });
    builder.addCase(fetchAsyncPostComment.fulfilled, (state, action) => {
      return {
        ...state,
        comments: [action.payload, ...state.comments],
      };
    });
  },
});

export const {
  fetchPostStart,
  fetchPostEnd,
  fetchCommentDelete,
  setOpenPost,
  resetOpenPost,
  setOpenProfilesLikePost,
  resetOpenProfilesLikePost,
} = postSlice.actions;

export const selectIsLoadingPost = (state: RootState) =>  state.post.isLoadingPost;
export const selectOpenPost = (state: RootState) => state.post.openPost;
export const selectOpenProfilesLikePost= (state: RootState) => state.post.openProfilesLikePost;
export const selectPagenation = (state: RootState) => state.post.pagenation;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectPost = (state: RootState) => state.post.post;
export const selectProfilesLikePost =(state: RootState) => state.post.profilesLikePost;

export const selectComments = (state: RootState) => state.post.comments;

export default postSlice.reducer;