import React, {useState} from 'react'
import { Link, useHistory } from 'react-router-dom'

import M from 'materialize-css'

const SignUp = () => {
    const history = useHistory()
    const [fname, setfName] = useState('')
    const [lname, setlName] = useState('')
    const [num, setNum] = useState('')
    const [password, setPassword] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')

    const uploadFields = () => {
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html: "Invalid Email", classes: "#e53935 red darken-1"})
            return
        }
        fetch('/signup', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: fname + ' ' + lname,
                password,
                email,
                address,
                phoneNo: Number(num)
            })
        }).then(res => res.json())
        .then(data => {
            if(data.error)
                M.toast({html: data.error, classes:"#e53935 red darken-1"})
            else{
                M.toast({html: data.message, classes:"#43a047 green darken-1"})
                history.push('/signin')
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <div className='loginCard'>
            <div className='auth-card'>
                <h2>M-Wallet</h2>
                <div className="row">
                    <div className="input-field col s6">
                        <input 
                        id="first_name" 
                        type="text" 
                        className="validate"
                        value={fname}
                        onChange={e => setfName(e.target.value)}
                        />
                        <label htmlFor="first_name">First Name</label>
                    </div>
                    <div className="input-field col s6">
                        <input 
                        id="last_name" 
                        type="text" 
                        className="validate"
                        value={lname}
                        onChange={e => setlName(e.target.value)}
                        />
                        <label htmlFor="last_name">Last Name</label>
                    </div>
                </div>
                <input
                type='text'
                placeholder='Phone number'
                value={num}
                onChange={e => setNum(e.target.value)}
                />
                <input
                type='text'
                placeholder='Address'
                value={address}
                onChange={e => setAddress(e.target.value)}
                />
                <input
                type='text'
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                />
                <input
                type='password'
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />
                <button onClick={() => uploadFields()} className='btn waves-effect waves-light #2196f3 blue'>SignUp</button>
                <h6>Already have an account ? <Link to='/signin'>SignIn</Link></h6>
            </div>
        </div>   
    )
}

export default SignUp