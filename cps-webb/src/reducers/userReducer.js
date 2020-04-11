const initialState = {
    user:{},
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SAVE_TOKEN':
            return Object.assign({}, state, {
                user: {
                    token: action.token,
                }
            })
        case 'SAVE_USER': 
            return Object.assign({}, state, {
                user: action.user,
            })
        default:
            return state
    }
}