export const saveToken = (token) => dispatch => {
    
    dispatch({
     type: 'SAVE_TOKEN',
     token: token
    })
}
export const saveUser = (user) => dispatch => {
    dispatch({
        type: 'SAVE_USER',
        user: user
    })
}