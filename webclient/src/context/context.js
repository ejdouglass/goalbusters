import React, { createContext, useReducer } from 'react';

export const actions = {
    ADD_ALERT: 'add_alert',
    DISMISS_ALERT: 'dismiss_alert',
    LOAD_USER: 'load_user',
    UPDATE_USER: 'update_user',
    UPDATE_FRIENDS: 'update_friends',
    LOGOUT: 'logout',
    SEND_DATA: 'send_data',
    RECEIVE_DATA: 'receive_data',
    UPDATE_GOALS: 'update_goals',
    UPDATE_HISTORY: 'update_history'
}

export const Reducer = (state, action) => {
    switch (action.type) {
        case (actions.ADD_ALERT): {
            // payload is {type: 'alert/warning/info/...', message: `the message`, duration: 5}
            let newAlert = {...action.payload};
            if (!newAlert.duration) newAlert.duration = 5;
            let duplicateFreeArray = state.alerts.filter(alert => alert.message !== newAlert.message);
            if (duplicateFreeArray >= 3) {
                duplicateFreeArray.shift();
            }
            return {...state, alerts: [newAlert, ...duplicateFreeArray]};
        }
        case (actions.DISMISS_ALERT): {
            // first idea: pass in an indexToRemove, and filter the array so that fella is yoinked out
            return {...state, alerts: state.alerts.filter((alert, index) => index !== action.payload)};
        }
        case (actions.LOAD_USER): {
            console.log(`LOADING USER! Data: ${JSON.stringify(action.payload)}`);
            return {...state, ...action.payload};
        }
        case (actions.UPDATE_USER): {
            console.log(`Updating client-side user data: ${JSON.stringify(action.payload)}`);
            return {...action.payload};
        }
        case (actions.UPDATE_FRIENDS): {
            console.log(`Friends list has been updated in some manner.`);
            // setting it up so that action.payload is the entire friends Obj from backend
            return {...state, friends: action.payload};
        }
        case (actions.LOGOUT): {
            return initialState;
        }
        case (actions.SEND_DATA): {
            // console.log(`Preparing to send data: ${action.payload ? JSON.stringify(action.payload) : 'undefined'}`);
            return {...state, dataToSend: action.payload || undefined};
        }
        case (actions.RECEIVE_DATA): {
            console.log(`Received data from backend: ${JSON.stringify(action.payload)}`);
            return {...state, dataToReceive: action.payload || undefined};
        }
        case (actions.UPDATE_GOALS): {
            return {...state, goals: action.payload};
        }
        case (actions.UPDATE_HISTORY): {
            return {...state, history: action.payload};
        }
        default: {
            return state;
        }
    }
}

const initialState = {
    whatDo: 'loggedOut',
    alerts: [],
    goals: {},
    friends: {},
    username: undefined,
    history: {},
    dataToSend: undefined,
    dataToReceive: undefined
}

export const Context = createContext(initialState);

export const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}