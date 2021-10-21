// javascript でデータ型が定義されている
export interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
}
/*authSlice.ts*/
export interface PROPS_AUTHEN {
  email: string;
  password: string;
}

export interface PROPS_REFRESHTOKEN {
  refresh: string;
}

export interface PROPS_PROFILE {
  id: string;
  nickName: string;
  user:string ;
  img: File | null;
  followers: string[];
  following: string[];
}
export interface PROPS_UPDATE_PROFILE {
  nickName: string;
  img: File | null;
  user:string ;
}
export interface PROPS_NICKNAME {
  nickName: string;
}
export interface PROPS_FOLLOWED {
  id: string;
  nickName: string;
  // user:string ;
  img: File | null;
  following: string[];
  current: string[];
  new: string;
}

/*postSlice.ts*/
// export interface PROPS_NEWPOST {
//   title: string;
//   img: File | null;
// }
export interface PROPS_NEWPOST {
  post: string;
  isPublic: string;

}
export interface PROPS_LIKED {
  id: string;
  post: string;
  isPublic: string,
  current: string[];
  new: string;
}
export interface PROPS_POST {
  postId: string;
  loginId: string;
  postedBy: string;
  post: string;
  isPublic: string;
  liked: string[];
}
export interface PROPS_UPDATE_POST {
  id: string;
  // post: string;
  // postedBy: string;
  isPublic: string;
  // liked: string[];
}
export interface PROPS_COMMENT {
  comment: string;
  post: string;
}
export interface PROPS_NEW_ROADMAP {
  // challenger: string;
  title: string;
  overview: string;
  isPublic: string;
}
export interface PROPS_UPDATE_ROADMAP {
  roadmap: string;
  title: string;
  overview: string;
  isPublic: string;
}
export interface PROPS_NEW_STEP{
  roadmap: string;
  toLearn: string;
  isCompleted: string;
  // order: number;
}
export interface PROPS_UPDATE_STEP{
  step: string;
  toLearn: string;
  isCompleted: string;
}
export interface PROPS_CHANGE_STEP_ORDER {
  steps: {
    id: string;
    roadmap: string;
    toLearn: string;
    isCompleted: string;
    order: number;
    createdAt: string;
    updatedAt: string;
 }[]
}
export interface PROPS_NEW_LOOKBACK {
  step: string;
  learned: string;
  // studyTime: number;
  // studyAt: string; 
}
export interface PROPS_UPDATE_LOOKBACK {
  lookback: string;
  learned: string;
  // studyTime: number;
  // studyAt: string; 
}