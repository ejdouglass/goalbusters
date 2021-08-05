import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/struggle.png';
import { Context, actions } from '../context/context';
import { WelcomePageContainer, WelcomePageGreeting, WelcomePageSubtext, WelcomePageCard, WPCLogo, WPCInputContainer, WPCLabel, WPCInput, WPCCreateUser, WPCSignInButton } from '../styled/styled';

const WelcomePage = () => {
    const [state, dispatch] = useContext(Context);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    function parseUsername(nameString) {
        nameString = nameString.split(' ').join('');
        setUsername(nameString);
    }

    function parsePassword(passString) {
        passString = passString.split(' ').join('');
        setPassword(passString);
    }

    function submitLoginData(e) {
        e.preventDefault();
        axios.post('/user/login', { userCredentials: {username: username, password: password} })
        .then(res => {
            // console.log(res.data);
            // HERE: Add dispatch to throw relevant user details into global state
            // dispatch({type: actions.LOAD_CHAR, payload: {character: res.data.payload.character}});
            
            if (res.data.type === 'failure') {
                return dispatch({type: actions.ADD_ALERT, payload: {type: 'error', message: res.data.echo, id: Math.random().toString(36).replace('0.', '')}});
            }

            dispatch({type: actions.LOAD_USER, payload: res.data.payload.user});
            localStorage.setItem('goalinGirlsJWT', res.data.payload.token);
            history.push('/dashboard');
        })
        .catch(err => console.log(err));
    }

    return (
        <WelcomePageContainer>
            <WelcomePageGreeting>Welcome to GOALBUSTERS.</WelcomePageGreeting>
            <WelcomePageSubtext>Got some goals that need bustin'? Then you're in the right place!</WelcomePageSubtext>
            <WelcomePageCard onSubmit={e => submitLoginData(e)}>
                <WPCLogo>
                    <img src={logo} style={{width: '100px'}} />
                </WPCLogo>

                <WPCInputContainer>
                    <WPCLabel>Username</WPCLabel>
                    <WPCInput type='text' value={username} onChange={e => parseUsername(e.target.value)}></WPCInput>
                </WPCInputContainer>


                <WPCInputContainer>
                    <WPCLabel>Password</WPCLabel>
                    <WPCInput type='password' value={password} onChange={e => parsePassword(e.target.value)}></WPCInput>
                </WPCInputContainer>

                <WPCSignInButton type='submit' value='Sign In' />


                <WPCCreateUser href="/create_account">Or if it's your first time, you can make a new account here!</WPCCreateUser>

            </WelcomePageCard>
        </WelcomePageContainer>
    )
}

export default WelcomePage;

/*

    THIS: just the default page you see at '/' if you're not logged in
    ... should welcome you, have some graphics, and CTA for logging in (or create new account)

*/