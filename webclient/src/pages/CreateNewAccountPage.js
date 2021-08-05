import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import axios from 'axios';
import defaultUserSVG from '../assets/avatars/user.svg';
import dwarfSVG from '../assets/avatars/dwarf.svg';
import pigSVG from '../assets/avatars/pig.svg';
import robinHoodSVG from '../assets/avatars/robin-hood.svg';
import pirateSVG from '../assets/avatars/pirate.svg';
import witchSVG from '../assets/avatars/witch.svg';
import goblinSVG from '../assets/avatars/goblin.svg';
import gnomeSVG from '../assets/avatars/gnome.svg';
import elfSVG from '../assets/avatars/elf.svg';
import princessSVG from '../assets/avatars/princess.svg';
import fairySVG from '../assets/avatars/fairy.svg';
import { CreateAccountPageContainer, CreateAccountCard, WPCInputContainer, WPCLabel, WPCInput, WPCSignInButton, GoalButton, SelectIconModal, SelectIconModalContainer } from '../styled/styled';

const iconsList = [defaultUserSVG, dwarfSVG, pigSVG, robinHoodSVG, pirateSVG, witchSVG, goblinSVG, gnomeSVG, elfSVG, princessSVG, fairySVG];

const CreateNewAccountPage = () => {
    const [state, dispatch] = useContext(Context);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        icon: defaultUserSVG
    });
    const [iconModalVisible, setIconModalVisible] = useState(false);
    const history = useHistory();

    function selectIcon(icon) {
        setNewUser({...newUser, icon: icon});
    }

    function parseUsername(nameString) {
        let noSpacesNameString = nameString.split(' ').join('');
        if (nameString !== noSpacesNameString) {
            dispatch({type: actions.ADD_ALERT, payload: {type: 'warning', message: `No spaces in your username, please!`, id: Math.random().toString(36).replace('0.', '')}});
        }
        return setNewUser({...newUser, username: noSpacesNameString});
    }

    function parsePassword(passString) {
        let noSpacesPassString = passString.split(' ').join('');
        if (passString !== noSpacesPassString) {
            dispatch({type: actions.ADD_ALERT, payload: {type: 'warning', message: `No spaces in your password, please!`, id: Math.random().toString(36).replace('0.', '')}});
        }
        return setNewUser({...newUser, password: noSpacesPassString});
    }

    function submitCreationData(e) {
        e.preventDefault();
        if (newUser.username.length < 6) {
            return dispatch({type: actions.ADD_ALERT, payload: {type: 'warning', message: `Please choose a username that's at least 6 characters long.`, id: Math.random().toString(36).replace('0.', '')}});
        }
        if (newUser.password.length < 6) {
            return dispatch({type: actions.ADD_ALERT, payload: {type: 'warning', message: `Eh, we're laid back around here, but please enter at least 6 characters for your password.`, id: Math.random().toString(36).replace('0.', '')}})
        }
        if (newUser.password !== newUser.confirmPassword) {
            return dispatch({type: actions.ADD_ALERT, payload: {type: 'warning', message: `Your passwords don't match. That'd make it hard to log in!`, id: Math.random().toString(36).replace('0.', '')}})
        }
        axios.post('/user/create', { newUser: newUser })
        .then(res => {
            console.log(res.data);
            // HERE: Add dispatch to throw relevant user details into global state
            // dispatch({type: actions.LOAD_CHAR, payload: {character: res.data.payload.character}});
            
            if (res.data.type === 'failure') {
                return dispatch({type: actions.ADD_ALERT, payload: {type: 'error', message: res.data.echo, id: Math.random().toString(36).replace('0.', '')}});
            }

            // HERE: receive data from first creation so client knows user's username

            dispatch({type: actions.LOAD_USER, payload: res.data.payload.user});
            localStorage.setItem('goalinGirlsJWT', res.data.payload.token);
            history.push('/dashboard');
        })
        .catch(err => console.log(err));
    }

    useEffect(() => {
        if (state.username) {
            history.push('/dashboard');
        }
    }, []);

    // NOTE: will have to handle the keyboard input for creation, either by refactoring into a form -OR- using whatDo + Keyboard
    // Or just slap a form around it, call it a day
    // In the meantime, get the size scaling right for this page, too

    return (
        <CreateAccountPageContainer>
            <CreateAccountCard onSubmit={e => submitCreationData(e)}>

                <h3 style={{fontSize: 'calc(1.5rem + 1vw)', margin: '1rem 0'}}>Create New Account</h3>

                <div style={{position: 'relative', width: 'calc(50px + 3vw)', height: 'auto', marginBottom: '2rem', marginTop: '1rem'}} onClick={() => setIconModalVisible(!iconModalVisible)}>
                    <label style={{position: 'absolute', top: '100%', textAlign: 'center', width: '200%', left: '-50%'}}>Click to Select your Avatar!</label>
                    <img src={newUser.icon} style={{marginTop: '1rem', maxWidth: 'calc(50px + 3vw)'}}/>

                    <SelectIconModalContainer active={iconModalVisible}>
                        <SelectIconModal active={iconModalVisible}>
                            {iconsList.map((icon, index) => (
                                <div key={index} style={{display: 'flex'}} onClick={() => selectIcon(icon)}>
                                    <img src={icon} style={{minWidth: 'calc(50px + 3vw)', maxWidth: 'calc(50px + 3vw)'}} />
                                </div>
                            ))}
                        </SelectIconModal>
                    </SelectIconModalContainer>
                </div>


                <WPCInputContainer>
                    <WPCLabel>Username</WPCLabel>
                    <WPCInput type='text' autoFocus={true} value={newUser.username} onChange={e => parseUsername(e.target.value)}></WPCInput>
                </WPCInputContainer>

                <WPCInputContainer>
                    <WPCLabel>Password</WPCLabel>
                    <WPCInput type='password' value={newUser.password} onChange={e => parsePassword(e.target.value)}></WPCInput>
                </WPCInputContainer>

                <WPCInputContainer>
                    <WPCLabel>Re-Enter Password</WPCLabel>
                    <WPCInput type='password' value={newUser.confirmPassword} onChange={e => setNewUser({...newUser, confirmPassword: e.target.value})}></WPCInput>
                </WPCInputContainer>

                <WPCSignInButton type='submit' value={'Create Account'} />

            </CreateAccountCard>
        </CreateAccountPageContainer>
    )
}

export default CreateNewAccountPage;