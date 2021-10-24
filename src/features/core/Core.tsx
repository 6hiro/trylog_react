import React from "react";
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { useSelector } from "react-redux";

import {
  selectMyProfile,
} from "../auth/authSlice";
import Auth from "../auth/Auth";
import Home from "./Home";
import Sidebar from "../sidebar/Sidebar";
import Fab from "../fab/Fab";
import Profile from "../profile/Profile"
import AddPost from "../post/AddPost";
import PostDetail from "../post/PostDetail";
import Hashtag from "../hashtag/Hashtag";
import Roadmap from "../roadmap/Roadmap";
import Step from "../roadmap/Step";
import Lookback from "../roadmap/Lookback";
import AddRoadmap from "../roadmap/AddRoadmap";
import PostList from "../post/PostList";


const Core: React.FC = () => {
  
  const profile = useSelector(selectMyProfile);

  return (
    <div>
      <Router>
        <Auth />

        <Sidebar />
        {profile?.user &&  <Fab />}

        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/prof/:id" component={Profile} />
          <Route exact path="/post/add" component={AddPost} />
          <Route exact path="/post/list/" component={PostList} />
          <Route exact path="/post/hashtag/:id" component={Hashtag} />
          <Route exact path="/post/:id" component={PostDetail} />
          <Route exact path="/roadmap/add" component={AddRoadmap} />
          <Route exact path="/roadmap/user/:id" component={Roadmap} />
          <Route exact path="/step/roadmap/:id" component={Step} />
          <Route exact path="/lookback/step/:id" component={Lookback} />
        </Switch>
      </Router>
    </div>
  );
};

export default Core;