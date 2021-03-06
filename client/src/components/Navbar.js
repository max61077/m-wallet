import React, {useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App'

const Navbar = () => {

    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)
    

    const renderList = () => {
        if(state){
            return [
                <li key={1}><Link className="nav-li" to="/trans">Transactions</Link></li>,
                <li key={2}><Link className="nav-li" to="/profile">Profile</Link></li>,
                <li key={5}>
                    <button className="nav-btn" onClick={() => {
                        localStorage.clear()
                        dispatch({type: 'CLEAR'})
                        history.push('/signin')
                    }} 
                    className='btn waves-effect waves-light nav-btn #e53935 red darken-1'
                    >Logout</button>
                </li>
            ]
        }
        else{
            return [
                <li key={3}><Link to="/signin">SignIn</Link></li>,
                <li key={4}><Link to="/signup">SignUp</Link></li>
            ] 
        }
    }


    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state?'/':'/signin'} className="brand-logo left">M-Wallet</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar