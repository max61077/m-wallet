import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'

const Profile = () => {

    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [nameEdit, setNameEdit] = useState(false)
    const [addEdit, setAddEdit] = useState(false)
    const [prevName, setPrevName] = useState('')
    const [prevAdd, setPrevAdd] = useState('')

    useEffect(() => {
        if(state){
            setName(state.name)
            setAddress(state.address)
            setPrevName(state.name)
            setPrevAdd(state.address)
        }
    }, [state])

    const update = () => {

        if(state.name === name && state.address === address){
            M.toast({html: "Please Update Fields", classes: "#e53935 red darken-1"})
            return
        }

        fetch('/update', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                name,
                address
            })
        }).then(res => res.json())
        .then(result => {
            dispatch({type: "UPDATE", payload: {name: result.name, address: result.address}})
            localStorage.setItem('user', JSON.stringify({...state, name: result.name, address: result.address}))
            M.toast({html: "Successfully Updated", classes: "#43a047 green darken-1"})
        })
        .catch(err => console.log(err))
    }

    const deleteUser = () => {
        fetch('/delete', {
            method: 'delete',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(result => {
            localStorage.clear()
            dispatch({type: 'CLEAR'})
            history.push('/signin')
            M.toast({html: "User Deleted", classes: "#43a047 green darken-1"})
        })
    }

    return (
        <div className="profile">
            <h2>My Profile</h2>
            <table className="centered highlight striped">
                <tbody>
                    <tr>
                        <td><b>Phone No</b></td>
                        <td><b>{!state?<h2>loading...</h2>:state.phoneNo}</b></td>
                    </tr>
                    <tr>
                        <td><b>Email</b></td>
                        <td><b>{!state?<h2>loading...</h2>:state.email}</b></td>
                    </tr>
                    <tr>
                        <td>Name</td>
                        {   !nameEdit?
                            <td style={{cursor:"pointer"}}
                            onClick={() => setNameEdit(!nameEdit)}>
                                {!state?<h2>loading...</h2>:name}
                            </td>
                            :
                            <td className="inpUpdate">
                                <input onChange={e => setName(e.target.value)} />
                                <button className='btn waves-effect waves-light nav-btn #448aff blue accent-2'
                                onClick={() => {
                                    setNameEdit(false)
                                    setName(prevName)
                                    }}>X</button>
                                <button className='btn waves-effect waves-light nav-btn #81c784 green lighten-2'
                                onClick={() => {
                                    setNameEdit(false)
                                    if(name)
                                        setPrevName(name)
                                    else{
                                        M.toast({html: "Invalid Name", classes: "#e53935 red darken-1"})
                                        setName(prevName)
                                    }
                                    }}>OK</button>
                            </td>
                                
                        }
                        
                    </tr>
                    <tr>
                        <td>Address</td>
                        {   !addEdit?
                            <td style={{cursor:"pointer"}}
                            onClick={() => setAddEdit(!addEdit)}>
                                {!state?<h2>loading...</h2>:address}
                            </td>
                            :
                            <td className="inpUpdate">
                                <input onChange={e => setAddress(e.target.value)} />
                                <button className='btn waves-effect waves-light nav-btn #448aff blue accent-2'
                                onClick={() => {
                                    setAddEdit(false)
                                    setAddress(prevAdd)
                                    }}>X</button>
                                <button className='btn waves-effect waves-light nav-btn #81c784 green lighten-2'
                                onClick={() => {
                                    setAddEdit(false)
                                    if(address)
                                        setPrevAdd(address)
                                    else{
                                        M.toast({html: "Invalid Address", classes: "#e53935 red darken-1"})
                                        setAddress(prevAdd)
                                    }
                                    }}>OK</button>
                            </td>
                                
                        }
                    </tr>
                </tbody>
            </table>
            <div className="profileBtn">
                <button
                onClick={() => update()}
                className='btn waves-effect waves-light nav-btn #448aff blue accent-2'
                >Update</button>
                <button 
                onClick={() => deleteUser()}
                className='btn waves-effect waves-light nav-btn #e53935 red darken-1'
                >Delete Account</button>
            </div>
        </div>
    )
}

export default Profile
