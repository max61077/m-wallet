import React, {useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'

const Transactions = () => {

    const {state} = useContext(UserContext)

    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        if(state)
            setTransactions(state.transactions)
    }, [state])

    return (
        <div className="trans">
            <h2>Transactions</h2>
            <div className='trans-list'>
                <ul className="collection">
                    {   
                        transactions.length?
                        transactions.slice(0).reverse().map(trans => {
                            if(trans.type === 'sent')
                            return (
                                <li 
                                key={Math.random()} 
                                className="collection-item sent">
                                    <div className='timeStamp'>
                                        <span><b>Sent To {trans.name}</b></span>
                                        <span className="time"><b>{trans.time}</b></span>
                                    </div>
                                    <div>
                                        <span style={{color:'#f44336'}}><b>-Rs.{trans.amt}</b></span>
                                    </div>
                                    </li>
                                )
                            else {
                                return (
                                    <li 
                                    key={Math.random()} 
                                    className="collection-item received">
                                        <div className='timeStamp'>
                                            <span><b>Received From {trans.name === state.name?'Me':trans.name}</b></span>
                                            <span className="time"><b>{trans.time}</b></span>
                                        </div>
                                        <div>
                                            <span style={{color:'#00c853'}}><b>+Rs.{trans.amt}</b></span>
                                        </div>
                                        
                                        </li>
                                    ) 
                            }
                        })
                        :
                        <p style={{fontSize:'25px'}}>No Transactions Yet</p>
                    }
                </ul>
            </div>
        </div>
    )
}

export default Transactions
