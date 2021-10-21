import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { PROPS_AUTHEN, PROPS_UPDATE_PROFILE } from "../types";

const authUrl = process.env.REACT_APP_DEV_API_URL;

export const fetchAsyncLogin = createAsyncThunk(
  // actionの名前
  "auth/post",
  async (authen: PROPS_AUTHEN) => {
    const res = await axios.post(`${authUrl}api/v1/login/`, authen, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const fetchAsyncRefreshToken = createAsyncThunk(
  "auth/refreshToken",
  async () => {
    const refreshJWT =  await `{"refresh": "${localStorage.refreshJWT}"}`
    const res = await axios.post(`${authUrl}api/v1/token/refresh/`, refreshJWT, {

      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: PROPS_AUTHEN) => {
    const res = await axios.post(`${authUrl}api/v1/register/`, auth, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);
export const fetchAsyncDeleteUser = createAsyncThunk(
  "user/delete", 
  async (id: string) => {
  const  res  = await axios.delete(`${authUrl}api/v1/delete-account/${id}/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});
export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/patch",
  async (profile: PROPS_UPDATE_PROFILE) => {
    const uploadData = new FormData();
    uploadData.append("nickName", profile.nickName);
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.patch(
      `${authUrl}api/v1/profile/${profile.user}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);
export const fetchAsyncPostFollow = createAsyncThunk(
  "follow/post",
  async (followerId: string) => {
    const res = await axios.post(`${authUrl}api/v1/follow/${followerId}/`,{}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncGetMyProf = createAsyncThunk("myprofile/get", async () => {
  const res = await axios.get(`${authUrl}api/v1/myprofile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data[0];
});
export const fetchAsyncGetProf = createAsyncThunk("profile/get", async (id: string) => {
  const res = await axios.get(`${authUrl}api/v1/profile/${id}/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});
export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
  const res = await axios.get(`${authUrl}api/v1/profile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});
export const fetchAsyncGetFollowingProfs = createAsyncThunk(
  "following/get",
  async (profileId: string) => {
    const res = await axios.get(`${authUrl}api/v1/${profileId}/following/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncGetFollowersProfs = createAsyncThunk(
  "followers/post",
  async (followersProfileId: string[]) => {
    const res = await axios.post(`${authUrl}api/v1/followers/`,{followers:followersProfileId}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const authSlice = createSlice({
  // action typesで使われる名前 
  name: "auth",
  // Stateの初期状態
  initialState: {
    openLogIn: true,
    openRegister: false,
    openProfile: false,
    openProfiles: false,
    isLoadingAuth: false,
    myprofile: {
      id: "",
      nickName: "",
      user: "",
      createdAt: "",
      img: "",
      followers: [""],
      following: [""],
    },
    profile: {
      id: "",
      nickName: "",
      user: "",
      createdAt: "",
      img: "",
      followers: [""],
      following:  [""],
    },
    profiles: [
      {
        id: "",
        nickName: "",
        user: "",
        createdAt: "",
        img: "",
        followers: [""],
        following: [""],
      },
    ],
    followingProfile: [
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
    followersProfile: [
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
  },
  reducers: {
    fetchCredStart(state) {
      state.isLoadingAuth = true;
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false;
    },
    setOpenLogIn(state) {
      state.openLogIn = true;
    },
    resetOpenLogIn(state) {
      state.openLogIn = false;
    },
    setOpenRegister(state) {
      state.openRegister = true;
    },
    resetOpenRegister(state) {
      state.openRegister = false;
    },
    setOpenProfile(state) {
      state.openProfile = true;
    },
    resetOpenProfile(state) {
      state.openProfile = false;
    },
    setOpenProfiles(state) {
      state.openProfiles = true;
    },
    resetOpenProfiles(state) {
      state.openProfiles = false;
    },
    editNickName(state, action){
      state.myprofile.nickName = action.payload;
    },
    logOut(state) {
      state.myprofile.id= ""
      state.myprofile.nickName = ""
      state.myprofile.user = ""
      state.myprofile.createdAt= ""
      state.myprofile.img = ""
      state.myprofile.followers = [""]
      state.myprofile.following = [""]
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem("localJWT", action.payload.tokens.access);
      localStorage.setItem("refreshJWT", action.payload.tokens.refresh);
    });
    builder.addCase(fetchAsyncRefreshToken.fulfilled, (state, action) => {
      localStorage.removeItem("localJWT");
      localStorage.removeItem("refreshJWT");
      localStorage.setItem("localJWT", action.payload.access);
      localStorage.setItem("refreshJWT", action.payload.refresh);
    });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetProf.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
    builder.addCase(fetchAsyncPostFollow.fulfilled, (state, action) => {
      if(action.payload.result==='follow'){
        state.profile.followers = [...state.profile.followers, action.payload.follower];
        state.myprofile.following = [...state.myprofile.following, action.payload.following];
      }
      else if(action.payload.result==='unfollow'){
        const followers_before = state.profile.followers;
        const unfollower = action.payload.unfollower;
        const followers_after = followers_before.filter(follower => follower !== unfollower);
        state.profile.followers = followers_after;

        const following_before = state.myprofile.following;
        const unfollowing = action.payload.unfollowing;
        const following_after = following_before.filter(following => following !== unfollowing );
        state.myprofile.following = following_after;
      }
    });
    builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetFollowingProfs.fulfilled, (state, action) => {
      state.followingProfile = action.payload;
    });
    builder.addCase(fetchAsyncGetFollowersProfs.fulfilled, (state, action) => {
      state.followersProfile = action.payload;
    });
  },
});

export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenLogIn,
  resetOpenLogIn,
  setOpenRegister,
  resetOpenRegister,
  setOpenProfile,
  resetOpenProfile,
  setOpenProfiles,
  resetOpenProfiles,
  editNickName,
  logOut,
} = authSlice.actions;

export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoadingAuth;
export const selectOpenLogIn = (state: RootState) => state.auth.openLogIn;
export const selectOpenRegister = (state: RootState) => state.auth.openRegister;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectMyProfile = (state: RootState) => state.auth.myprofile;
export const selectfollowProfile = (state: RootState) => state.auth.profile;
export const selectProfiles = (state: RootState) => state.auth.profiles;
export const selectOpenProfiles= (state: RootState) => state.auth.openProfiles;
export const selectFollowingProfiles = (state: RootState) => state.auth.followingProfile;
export const selectFollowerProfiles = (state: RootState) => state.auth.followersProfile;

export default authSlice.reducer;