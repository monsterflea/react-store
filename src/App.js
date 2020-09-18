import React, { useEffect } from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';


// hoc
import WithAuth from './hoc/withAuth';

// firebase utils
import { auth, handleUserProfile } from './firebase/utils';

// Actions
import { setCurrentUser } from './redux/User/user.actions';

// Layouts
import MainLayout from './layouts/mainLayout.js'
import HomeLayout from './layouts/homeLayout.js'

// Page Imports
import Home from './pages/Home/home';
import Recovery from './pages/Recovery/passwordRecovery';
import Registration from './pages/Registration/registration';
import Login from './pages/Login/login';
import Dashboard from './pages/Dashboard/dashboard';
import Profile from './pages/Profile/profile';


const App = (props) => {
  const { setCurrentUser } = props;

  useEffect(() => {
    const authListener = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await handleUserProfile(userAuth);
        userRef.onSnapshot(snapshot => {
          setCurrentUser({
              id: snapshot.id,
              ...snapshot.data()
          })
        })
      }
      setCurrentUser(userAuth);
    });

    return () => {
      authListener();
    };
  }, [setCurrentUser]);


  return (
    <div className="App">

      {/* APP ROUTES */}
      <Switch>
          <Route exact={true} path='/' render={() => (
            <HomeLayout>
              <Home />
            </HomeLayout>
          )} />

          <Route path='/register' render={() => (
            <MainLayout>
              <Registration />
            </MainLayout>
          )} />

          <Route path='/login' render={() => (
            <MainLayout>
              <Login />
            </MainLayout>
          )} />

          <Route path='/recovery' render={() => (
            <MainLayout>
              <Recovery />
            </MainLayout>
          )} />

          <Route path='/dashboard' render={() => (
            <WithAuth>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </WithAuth>
          )} />

          <Route path='/profile' render={() => (
            <WithAuth>
              <MainLayout>
                <Profile />
              </MainLayout>
            </WithAuth>
          )} />

      </Switch>
    </div>
  );
}

// SET USER STATE GLOBALLY ON APP
const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})


export default connect(mapStateToProps, mapDispatchToProps)(App);
