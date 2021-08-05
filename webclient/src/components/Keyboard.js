import React, { useState, useEffect, useContext } from 'react';
import { Context, actions } from '../context/context';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
let socketToMe;
const ENDPOINT = 'http://localhost:5050';

const Keyboard = () => {
    const [state, dispatch] = useContext(Context);
    const [socketActive, setSocketActive] = useState(false);
    const history = useHistory();

    function loadUserFromToken(userToken) {
        // THIS: axios passes the userToken to the API in an attempt to load up the character in question
        axios.post('/user/login', { userToken: userToken })
            .then(res => {
                // console.log(res.data);
                console.log(`We have successfully received a login from a token, at least from the backend!`);
                // LOAD USER is behaving weirdly from here...
                dispatch({type: actions.LOAD_USER, payload: res.data.payload.user});
                localStorage.setItem('goalinGirlsJWT', res.data.payload.token);
                history.push('/dashboard');

                // HERE: dispatch alert if sucessfully failed :P
            })
            .catch(err => {
                console.log(err);
                // Just added these: 
                localStorage.removeItem('goalinGirlsJWT');
                dispatch({type: actions.LOGOUT});
                history.push('/');
                // HERE: dispatch alert for user feedback
            });
    }

    useEffect(() => {
        if (state.username) {
            if (!socketActive) setSocketActive(true);
        }
    }, [state.username]);

    useEffect(() => {
        // This super assumes there's ALWAYS a token present for a valid playing character. Shouuuuuld be a fairly safe assumption for now.
        const userToken = localStorage.getItem('goalinGirlsJWT');
        if (userToken) {
            console.log(`Found a token! Attempting to load from it.`);
            loadUserFromToken(userToken);
        }
    }, []);

    useEffect(() => {
        if (socketActive) {
            socketToMe = io(ENDPOINT);
            socketToMe.on('connect', () => {
                socketToMe.emit('login', state);
            });

            socketToMe.on('data_from_server', data => {
                console.log(`We have received data from the server! It is: ${JSON.stringify(data)}`)
                switch (data.dataType) {
                    case 'alert': {
                        return dispatch({type: actions.ADD_ALERT, payload: data.payload});
                    }
                    case 'goal_update': {
                        dispatch({type: actions.UPDATE_HISTORY, payload: data.payload.history});
                        return dispatch({type: actions.UPDATE_GOALS, payload: data.payload.goals});
                    }
                    case 'update_user': {
                        dispatch({type: actions.UPDATE_USER, payload: data.payload});
                        return dispatch({type: actions.RECEIVE_DATA});
                    }
                    // Catch-all for when the app needs to 'listen' to the data.dataType globally, such as 'friend_search_result'
                    default: return dispatch({type: actions.RECEIVE_DATA, payload: data});;
                }
            });
            
            return () => {
                socketToMe.disconnect();
            }
        }
    }, [socketActive]);

    useEffect(() => {
        if (socketActive && state.username === undefined) {
            setSocketActive(false);
        }
    }, [state.username]);

    useEffect(() => {
        if (state.dataToSend) {
            socketToMe.emit('package_for_server', state.dataToSend);
            return dispatch({type: actions.SEND_DATA});
        }
    }, [state.dataToSend]);

    return <div></div>;
}

export default Keyboard;

/*

INITIAL LOGIN:
LOADING USER! Data: {"_id":"60ef0c25deabd114d714a3da","username":"Dekanax","__v":0,"whatDo":"dashboard"}

FIRST JWT LOGIN:
LOADING USER! Data: {"_id":"60ef0c25deabd114d714a3da","username":"Dekanax","__v":0,"whatDo":"dashboard"}

SECOND JWT LOGIN:
<... death ...>


*/