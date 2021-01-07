import React, {useEffect, createContext, useReducer, useContext} from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import SignUp from './components/screens/SignUp';
import SignIn from './components/screens/SignIn';
import Transactions from './components/screens/Transactions'

import {BrowserRouter, Route, useHistory} from 'react-router-dom';
import {reducer, initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {dispatch} = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if(user){
      dispatch({type: "USER", payload: user})
    }
    else
      history.push('/signin')
  }, [])
  return(
    <>
      <Route exact path='/'>
        <Home/>
      </Route>
      <Route path='/signin'>
        <SignIn/>
      </Route>
      <Route exact path='/profile'>
        <Profile/>
      </Route>
      <Route path='/signup'>
        <SignUp/>
      </Route>
      <Route path='/trans'>
        <Transactions/>
      </Route>
    </>
  )
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{state, dispatch}}>
        <BrowserRouter>
          <Navbar/>
          <Routing/>
        </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
