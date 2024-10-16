import CommunityPage from "./Page/CommunityPage/CommunityPage";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./Page/MemberPage/StartPage";

import MembershipPage from "./Page/MemberPage/MembershipPage";
import PostUpPage from "./Page/CommunityPage/PostUpPage";
import IdFindPage from "./Page/MemberPage/IdFindPage";
import PwFindPage from "./Page/MemberPage/PwFindPage";
import MemberImformationPage from "./Page/MemberPage/MemberImformationPage";

import FollowerListPage from "./Page/FollowPage/FollowerListPage";
import MyLogPage from "./Page/MyPage/MyLogPage";
import MyMapPage from "./Page/MyPage/MyMapPage";
import FollowerLogPage from "./Page/FollowPage/FollowerLogPage";
import NotFollowerLogPage from "./Page/FollowPage/NotFollowerLogPage";
import MembershipModificationPage from "./Page/MemberPage/MembershipModificationPage";

import SearchPage from "./Page/CommunityPage/SearchPage"
import PostPage from "./Page/CommunityPage/PostPage"
import ChangPwPage from "./Page/MemberPage/ChangePwPage";
import PostLocationPage from "./Page/CommunityPage/PostLocationPage";
import MainPage from "./Page/MainPage/MainPage";
import MapWithMarkers from "./Page/CommunityPage/MapWithMarkers";
import MapPage from "./Page/CommunityPage/MapPage"


import FollowerLogOnePage from "./Page/FollowPage/FollowerLogOnePage";
import FollowerLogTwoPage from "./Page/FollowPage/FollowerLogTwoPage";
import FollowerLogThreePage from "./Page/FollowPage/FollowerThreePage";

import MapComponent from "./Page/CommunityPage/MapComponent";

import Ro from"./Page/MemberPage/Ro"
import FollowerMapPage from "./Page/FollowPage/FollowerMapPage";
import MapMarkPage from "./Page/CommunityPage/MapMarkPage";
import MembershipMapPage from "./Page/MemberPage/MembershipMapPage";
import MembershipModificationMapPage from "./Page/MemberPage/MembershipModificationMapPage";

const App = ()=>{
    return(
        <>  
            <Router>
              <Routes>
              <Route path="/ro" element={<Ro/>}/>
                {/* CommunityPage */}
                <Route path="/search" element={<SearchPage/>}/>
                <Route path="/community" element={<CommunityPage/>}/>
                <Route path="/postUp" element={<PostUpPage/>}/>
                <Route path="/post/:id" element={<PostPage/>}/>
                <Route path="/PostLocationPage" element={<PostLocationPage/>}/>
                <Route path="/MapPage" element={<MapPage/>}/>
               
                {/* MemberPage */}
                <Route path="/" element={<StartPage />} />
                <Route path="/MembershipPage" element={<MembershipPage />} />
                <Route path="/IdFindPage" element={<IdFindPage />} />
                <Route path="/PwFindPage" element={<PwFindPage />} />
                <Route path="/MemberImformationPage" element={<MemberImformationPage />} />
                <Route path="/MembershipModificationPage" element={<MembershipModificationPage />} />
                <Route path="/ChangPwPage" element={<ChangPwPage />} />
                <Route path="/MembershipMapPage" element={<MembershipMapPage/>} />
                <Route path="/MembershipModificationMapPage" element={<MembershipModificationMapPage/>} />
                {/* FollowPage */}
                <Route path="/FollowerListPage" element={<FollowerListPage />} />
                <Route path="/FollowerLogPage/:id" element={<FollowerLogPage/>} />
                <Route path="/FollowerLogOnePage/:id" element={<FollowerLogOnePage/>} />
                <Route path="/FollowerLogTwoPage/:id" element={<FollowerLogTwoPage/>} />
                <Route path="/FollowerLogThreePage/:id" element={<FollowerLogThreePage/>} />
                <Route path="/FollowerMapPage/:id" element={<FollowerMapPage/>} />
                <Route path="/NotFollowerLogPage" element={<NotFollowerLogPage/>} />
                {/* MyPage */}
                <Route path="/MyLogPage" element={<MyLogPage />} />
                <Route path="/MyMapPage" element={<MyMapPage />} />
                {/* MainPage */}
                <Route path="/MainPage" element={<MainPage />} />
                {/* example */}
                <Route path="/MapWithMarkers" element={<MapWithMarkers />} />
                <Route path="/MapComponent" element={<MapComponent />} />

                {/* 테스트 페이지 */}
                <Route path="/MapWithMarkers" element={<MapWithMarkers />} />
                <Route path="/MapMarkers" element={<MapMarkPage />} />
              </Routes>
            </Router>
        </>
    )

}
export default App;