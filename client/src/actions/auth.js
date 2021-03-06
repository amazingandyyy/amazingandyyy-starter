import request from './request';
import { 
    AUTH_ERROR,
    AUTH_USER,
    UNAUTH_USER,AUTH_ADMIN,
    EMAIL_NOT_FOUND,
    EMAIL_SENT,
    SIGNUP_WITH_DATA,
    RESET,
    FAIL_TO_VERIFY_TOKEN,
    SUCCESS_TO_VERIFY_TOKEN,
    SUCCEED_TO_RESET_PASSWORD
} from './types';
import { browserHistory, hashHistory } from 'react-router';

function signUserIn({email, password}) {
    return function (dispatch) {
        // Submit email/password to server
        request
            .post(`/api/user/signin/email`, {email, password})
            .then(res => {
                if(res.data.isAdmin){
                    dispatch({type: AUTH_ADMIN})
                }else{
                    dispatch({type: AUTH_USER})
                }
                localStorage.setItem('isAdmin', res.data.isAdmin);
                localStorage.setItem('token', res.data.token);
                request.defaults.headers.common['Authorization'] = localStorage.getItem('token');
                hashHistory.push('/dashboard');
            })
            .catch(error => {
                console.log(error);
                dispatch({type: AUTH_ERROR, payload: 'Bad Login Info'})
            });
    }
}

function signUserInWithFacebook(FbTreasure){
    return function (dispatch) {
        // Submit FbTreasure to server
        request
            .post(`/api/user/signin/fb`, FbTreasure)
            .then(res => {
                if(res.data.passwordNeed){
                    dispatch({type: SIGNUP_WITH_DATA, payload: res.data.userData})
                    return hashHistory.push('/auth/signup');
                }
                if(!res.data.passwordNeed){
                    if(res.data.isAdmin){
                        dispatch({type: AUTH_ADMIN})
                    }else{
                        dispatch({type: AUTH_USER})
                    }
                    localStorage.setItem('isAdmin', res.data.isAdmin);
                    localStorage.setItem('token', res.data.token);
                    request.defaults.headers.common['Authorization'] = localStorage.getItem('token');
                    hashHistory.push('/dashboard');
                }
            })
            .catch(error => {
                console.log(error);
                dispatch({type: AUTH_ERROR, payload: 'Bad Login Info'})
            });
    }
}

function sendEmailToResetPassword(email){
    return function(dispatch) {
        request
            .post(`/api/user/helper/sendEmailToResetPassword/${email}`)
            .then(res => {
                console.log(res.data);
                dispatch({type: EMAIL_SENT})
            })
            .catch(error => {
                dispatch({type: EMAIL_NOT_FOUND, payload: 'No user is using this email.'})
            });
    }
}

function signUserUp(userObj) {
    return function (dispatch) {
        // Submit name/email/password to server
        request
            .post(`/api/user/signup`, userObj)
            .then(res => {
                dispatch({type: AUTH_USER})
                localStorage.setItem('isAdmin', res.data.isAdmin);
                localStorage.setItem('token', res.data.token);
                request.defaults.headers.common['Authorization'] = localStorage.getItem('token');
                hashHistory.push('/dashboard');
            })
            .catch(error => {
                console.log(error);
                dispatch({type: AUTH_ERROR, payload: 'Failed to Sign up, please try again.'})
            });
    }
}

function signUserOut() {
    return function (dispatch) {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        dispatch({type: UNAUTH_USER})
    }
}

function authReset(){
    return function(dispatch) {
        dispatch({type: RESET})
    }
}

function verifyToken(token) {
    return function(dispatch){
        request.post(`/api/user/helper/verifyToken/${token}`)
        .then(res => {
            dispatch({type: SUCCESS_TO_VERIFY_TOKEN})
        })
        .catch(error => {
                console.log(error);
                hashHistory.push('/auth/iforget2')
            });
    }
}

function resetPassword(data) {
    return function(dispatch){
        request.post(`/api/user/helper/resetPassword/`, data)
        .then(res => {
            dispatch({ type: SUCCEED_TO_RESET_PASSWORD })
        })
        .catch(error => {
                console.log(error);
                hashHistory.push('/auth/iforget2')
            });
    }
}

export {
    signUserIn,
    signUserUp,
    signUserOut,
    signUserInWithFacebook,
    sendEmailToResetPassword,
    authReset,
    verifyToken,
    resetPassword
};