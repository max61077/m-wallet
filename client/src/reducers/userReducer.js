export const initialState = null

export const reducer = (state, action) => {
    if(action.type === 'USER')
        return action.payload
    if(action.type === 'CLEAR')
        return null
    if(action.type === 'UPDATE')
        return {
            ...state,
            name: action.payload.name,
            address: action.payload.address
        }
    if(action.type === 'UPDATEBALANCE')
        return {
            ...state,
            balance: action.payload.balance,
            transactions: action.payload.transactions
        }
    return state
}