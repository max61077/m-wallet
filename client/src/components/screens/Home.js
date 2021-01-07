import React, {useEffect, useState, useContext, useRef} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'



const Home = () => {

    const {state, dispatch} = useContext(UserContext)
    const [amount, setAmount] = useState('')
    const [sendAmount, setSendAmount] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const modal = useRef(null)
    const sendModal = useRef(null)

    useEffect(() => {
        M.Modal.init(modal.current)
        M.Modal.init(sendModal.current)
    }, [])

    const addBalance = () => {

        if(isNaN(amount) || amount === '0' || !amount || Number(amount) < 0){
            M.toast({html: 'Invalid Amount', classes:"#e53935 red darken-1"})
            return
        }

        fetch('/addbalance', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                balance: Number(amount) + state.balance,
                addedAmt: Number(amount),
                time: new Date().toDateString().slice(0, 10) + ' ' + new Date().toLocaleString().slice(10)
            })
        }).then(res => res.json())
        .then(result => {
            M.Modal.getInstance(modal.current).close()
            dispatch({type: "UPDATEBALANCE", payload: {balance: result.balance, transactions: result.transactions}})
            localStorage.setItem('user', JSON.stringify({...state, balance: result.balance, transactions: result.transactions}))
            M.toast({html: "Amount Added Successfully", classes: "#43a047 green darken-1"})
        }).catch(err => console.log(err))
    }

    const sendMoney = () => {


        if(isNaN(sendAmount) || sendAmount === '0' || !sendAmount || Number(sendAmount) < 0){
            M.toast({html: 'Invalid Amount', classes:"#e53935 red darken-1"})
            return
        } else if(Number(sendAmount) > state.balance){
            M.toast({html: 'Insufficient Balance', classes:"#e53935 red darken-1"})
            return
        } else if (!phoneNo || isNaN(phoneNo)){
            M.toast({html: 'Invalid PhoneNo', classes:"#e53935 red darken-1"})
            return
        } else if(Number(phoneNo) === state.phoneNo){
            M.toast({html: "You can add money to your Number instead", classes:"#e53935 red darken-1"})
            return 
        }

        fetch('/sendmoney', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                balance: state.balance - Number(sendAmount),
                sendAmount: Number(sendAmount),
                time: new Date().toDateString().slice(0, 10) + ' ' + new Date().toLocaleString().slice(10),
                phoneNo
            })
        }).then(res => res.json())
        .then(result => {
            if(result.error)
                M.toast({html: result.error, classes:"#e53935 red darken-1"})
            else{
                M.Modal.getInstance(sendModal.current).close()
                dispatch({type: "UPDATEBALANCE", payload: {balance: result.balance, transactions: result.transactions}})
                localStorage.setItem('user', JSON.stringify({...state, balance: result.balance, transactions: result.transactions}))
                M.toast({html: `Sent Success`, classes: "#43a047 green darken-1"})
            }
        }).catch(err => console.log(err))
    }

    return (
        <div className="home">
            <h2>M-Wallet</h2>
            <h2>Balance: <span style={{color:'#43a047'}}>Rs. {state?state.balance:'loading...'}</span></h2>
            <div className='homeBtn'>
                <button
                href="#modal1"
                className="btn-large modal-trigger waves-effect waves-light #448aff blue accent-2"
                >Add Money
                    <i className="material-icons left">account_balance_wallet
                    </i>
                </button>
                <button 
                href="#modal2"
                className="btn-large modal-trigger waves-effect waves-light #448aff blue accent-2">Send Money
                    <i className="material-icons left">send</i>
                </button>
            </div>
            <div id="modal1" className="modal" ref={modal}>
                <div className="modal-content">
                    <h2>Add Balance</h2>
                    <input
                    type='text'
                    placeholder="Enter Amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    />
                    <button style={{marginTop: '40px'}} onClick={() => addBalance()}
                    className="btn-large waves-effect waves-light #448aff blue accent-2">Add
                        <i className="material-icons left">add_box</i>
                    </button>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
            </div>
            <div id="modal2" className="modal" ref={sendModal}>
                <div className="modal-content">
                    <h2>Send Money</h2>
                    <input
                    type='text'
                    placeholder="Enter PhoneNo"
                    value={phoneNo}
                    onChange={e => setPhoneNo(e.target.value)}
                    />
                    <input
                    type='text'
                    placeholder="Enter Amount"
                    value={sendAmount}
                    onChange={e => setSendAmount(e.target.value)}
                    />
                    <button style={{marginTop: '40px'}} onClick={() => sendMoney()}
                    className="btn-large waves-effect waves-light #448aff blue accent-2">Send
                        <i className="material-icons left">send</i>
                    </button>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
            </div>
            
        </div>
    )
}

export default Home
