import React, { useContext, useState, useEffect } from 'react';
import { Context, actions } from '../context/context';
import { AlertContainer, RemainingAlertTimeBar } from '../styled/styled';

const Alert = () => {
    const [state, dispatch] = useContext(Context);

    return (
        <>
            {state?.alerts?.map((alert, index) => (
                <AlertContainer type={alert.type} duration={alert.duration} offset={`${index}`} key={alert.id}>
                    <AlertContent message={alert.message} duration={alert.duration} index={index} dispatch={dispatch} />
                </AlertContainer>
            ))}
        </>
    );
}

const AlertContent = ({ message, duration, index, dispatch }) => {
    const [remainingDuration, setRemainingDuration] = useState(duration);
    const initialDuration = duration;

    function dismissAlert() {
        setRemainingDuration(-1);
        // dispatch({type: actions.DISMISS_ALERT, payload: index});
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setRemainingDuration(remainingDuration - 1);
            if (remainingDuration <= 0) {
                dispatch({type: actions.DISMISS_ALERT, payload: index});
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [remainingDuration]);

    return (
        <div>
            <button onClick={dismissAlert}>X</button>
            <div>{message}</div>
            {/* <RemainingAlertTimeBar lengthiness={Math.floor(remainingDuration / initialDuration * 100)} /> */}
        </div>
    )
}

export default Alert;

/*

    BEHAVIOR: we want to be able to display dismissable alerts that 'stack' if there are more than one and self-dismiss after a length of time
    -- if the alert is the SAME alert as an already-displayed one, ideally it just 'refreshes' it... pops it to 'top' of the stack and erases the 'old' one

    state.alerts is currently an array (of objects) that can be set up to push 'new' alerts to the 0 index, shoving older ones 'later' in that stack

    ALERT TYPES:
    -- ERROR (red): oopsie
    -- CONFIRMATION
    -- WARNING (yellow): maybe oopsie?
    -- INFO (purple?): just letting you know a thing happened
    -- HUZZAH (???): someone did a good thing, hoorah!

*/