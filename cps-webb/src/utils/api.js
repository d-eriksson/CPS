import axios from "axios";

let connection = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 1000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*',
    },
});
export function setupToken(token){
    connection.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
export async function login(email, password){
    let data = connection.post("/users/login",{
        email: email,
        password: password,
    }).then((result) => {
        setupToken(result.data.token);
        return result.data
    }).catch((e) =>{
        return e;
    })
    
    return data;
}
export async function me(){
    let data = connection.get('/users/me').then((result) =>{
        return result.data;
    }).catch((e) =>{
        return e;
    })
    return data;
}