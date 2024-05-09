import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NoMatch from './site-wide/NoMatch';
import HomeNav from './site-wide/HomeNav';
import BadgerAuthLanding from './badgerauth/BadgerAuthLanding';
import BadgerAuthHome from './badgerauth/BadgerAuthHome';
import BadgerAuthConfirmation from './badgerauth/BadgerAuthConfirmation';
import BadgerAuthManage from './badgerauth/BadgerAuthManage';
import BadgerAuthLoginBadgerId from './badgerauth/BadgerAuthLoginBadgerId';
import BadgerAuthLogoutBadgerId from './badgerauth/BadgerAuthLogoutBadgerId';
import Home from './site-wide/Home';


function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomeNav/>}>
        <Route index element={<Home />} />
        <Route path="auth" element={<BadgerAuthLanding />}>
          <Route index element={<BadgerAuthHome />}/>
          <Route path="otp" element={<BadgerAuthConfirmation/>}/>
          <Route path="manage" element={<BadgerAuthManage/>}/>
          <Route path="login" element={<BadgerAuthLoginBadgerId/>}/>
          <Route path="logout" element={<BadgerAuthLogoutBadgerId/>}/>
          <Route path="*" element={<NoMatch />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App
