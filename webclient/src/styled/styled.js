import styled, { keyframes, css } from 'styled-components';

// HERE: set up some default dynamic sizing stuff (font sizes, etc.)

const sneakIn = keyframes`
    from {
        transform: translate(0, -1rem);
        // opacity: 0;
    }
    to {
        transform: translate(0, 0);
        // opacity: 0.8;
    }
`

const slowDissolve = keyframes`
    0% {
        opacity: 0.8;
    }
    60% {
        opacity: 0.7;
    }
    90% {
        opacity: 0.4;
    }
    100% {
        opacity: 0;
    }
`;

const size = {
    xs: '320px',
    sm: '768px',
    lg: '1200px'
}
const device = {
    xs: `(min-width: ${size.xs})`,
    sm: `(min-width: ${size.sm})`,
    lg: `(min-width: ${size.lg})`,
}

export const SinglePageContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem;
`;

export const WelcomePageContainer = styled.div`
    min-width: 100vw;
    min-height: 100vh;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem;
`;

export const WelcomePageGreeting = styled.h1`
    margin: 1.5rem 0;
    margin-top: 3rem;
    text-align: center;
    font-size: calc(0.5vw + 1.5rem);
    font-family: sans-serif;
`;

export const WelcomePageSubtext = styled(WelcomePageGreeting)`
    margin: 0;
    text-align: center;
    font-size: calc(0.5vw + 0.75rem);
    font-family: sans-serif;
`;

export const WelcomePageCard = styled.form`
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    margin-top: 2rem;
    border-radius: 1.5rem;
    width: 45vw;
    
    border: 1.2px solid hsl(270, 90%, 80%);
`;

export const WPCLogo = styled.div`
    background-color: #0AF;
    // margin-top: 2rem;
    width: 100px;
    height: 100px;
    border-radius: 150px;
    // border: 1px solid #0BE;
`;

export const WPCInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
    margin-top: 1.25rem;
`;

export const WPCLabel = styled.p`
    margin-bottom: 0.25rem;
    display: flex;
    align-self: flex-start;
    font-size: calc(0.4vw + 0.4rem);
    color: hsl(240, 100%, 20%);
    font-weight: 600;
`;

export const WPCInput = styled.input`
    width: 100%;
    height: 2rem;
    font-size: calc(0.5vw + 0.5rem);
    padding: 0.25rem 0.5rem;
    font-family: sans-serif;
`;

export const WPCSignInButton = styled.input`
    background-color: hsl(260,80%,40%);
    color: white;
    height: 3rem;
    width: calc(3rem + 20%);
    font-weight: 700;
    padding: calc(0.25rem + 0.25vw);
    font-size: calc(0.5rem + 0.5vw);
    border: 0;
    border-radius: 6px;
    margin-top: 2rem;
`;

export const WPCCreateUser = styled.a`
    font-size: calc(0.5vw + 0.5rem);
    color: green;
    font-weight: 400;
    font-family: sans-serif;
    margin-top: 1rem;
`;

export const CreateAccountPageContainer = styled(WelcomePageContainer)`
    overflow: scroll;
`;

export const CreateAccountCard = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 1rem;
    min-width: calc(200px + 40vw);
    min-height: 40vw;
    overflow: scroll;
    border: 1px solid hsl(260, 80%, 80%);
    border-radius: 1.5rem;
`;

// neat, this works fine... now to make the colors... not stupid :P
const alertDisplayDetails = {
    warning: {
        border: 'orange'
    },
    error: {
        border: 'red'
    },
    confirmation: {
        border: 'green'
    }
};

export const AlertContainer = styled.div`
    position: fixed;
    z-index: 9999;
    background-color: white;
    opacity: 0.8;
    display: flex;
    flex-direction: column;
    width: calc(200px + 10vw);
    box-sizing: border-box;
    border: 1px solid red;
    left: calc(45vw - 100px);
    height: 125px;
    bottom: 1.5rem;
    padding: 1rem;
    justify-content: center;
    align-items: center;
    animation: ${sneakIn} 0.25s linear forwards,
    ${slowDissolve} ${props => `${props.duration}s`} linear forwards;
    // animation-fill-mode: forwards, forwards;
    ${props => props.offset && css`
        bottom: calc(1.5rem + ${props.offset * 125}px);
    `}
    ${props => props.type && css`
        border: 2px solid ${alertDisplayDetails[props.type].border || 'black'};
    `}
`;

export const RemainingAlertTimeBar = styled.div`
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    align-self: flex-start;
    height: 10px;
    background-color: red;
    ${props => props.lengthiness && css`
        width: ${props.lengthiness}%;
    `}
`;

export const GroupInfoInputContainer = styled.div`
    // border: 1px solid black;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    min-width: calc(100px + 15vw);
    ${props => props.row && css`
        flex-direction: row;
    `}
`;

export const GroupInfoLabel = styled.label`
    font-size: 0.85rem;
    margin-bottom: 0.2rem;
`;

export const GroupInfoInput = styled.input`
    margin-top: 0;
    padding: 0.5rem;
    font-size: calc(0.7rem + 0.3vw);
    // min-width: calc(200px + 10vw);
    background-color: hsl(260, 40%, 95%);
    border: 1px solid hsl(260, 40%, 90%);
`;

export const GoalSearchInput = styled(GroupInfoInput)`
    min-width: calc(100px + 10vw);
    margin-left: 2vw;
    height: 50%;
    align-self: center;
    padding: 0.5rem 1rem;
`;

export const GroupInfoCard = styled.div`
    display: flex;
    box-sizing: border-box;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: center;
    width: calc(300px + 40vw);
    // height: calc(400px + 40vh);
    border: 3px solid hsl(260, 80%, 40%);
    border-radius: 1rem;
`;

export const GoalPageButton = styled.button`
    display: flex;
    background-color: hsl(260, 80%, 80%);
    border: 1px solid hsl(260, 80%, 30%);
    box-sizing: border-box;
    min-height: 50px;
    min-width: 50px;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    font-size: calc(0.7rem + 0.3vw);
    font-weight: 400;
    opacity: 0.7;
    color: hsl(280, 90%, 15%);
    &:hover {
        transform: translateY(-0.5px);
    }
    ${props => props.static && css`
        opacity: 1;
    `}
    ${props => props.selected && css`
        // background-color: hsl(260, 90%, 20%);
        color: white;
        border-width: 2px;
        font-weight: 900;
        opacity: 1;
    `}
`;

export const HomePageBackgroundContainer = styled.div`
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`;

export const HomePageContainer = styled.div`
    display: flex;
    position: relative;
    top: 50px;
    width: 93%;
    min-height: 90%;
    // margin-top: 50px;
    border-radius: 2rem;
    background-color: white;
    background: linear-gradient(to bottom right, hsla(260, 100%, 100%, 0.5) 70%, hsla(260, 90%, 90%, 1)), 
                linear-gradient(to top right, hsla(260, 100%, 100%, 0.5) 70%, hsla(260, 90%, 90%, 1)),
                linear-gradient(to bottom, hsla(260, 100%, 100%, 0.5) 70%, hsla(260, 90%, 90%, 1));
`;

export const HomePageSidebar = styled.div`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    flex-direction: column;
    background-color: hsl(260, 90%, 60%);
    width: calc(50px + 10vw);
    border-radius: 2rem 0 0 2rem;
    padding-top: 2rem;
`;

export const HomePageSidebarLogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 200px;
    width: calc(50px + 3vw);
    height: calc(50px + 3vw);
    margin-bottom: calc(1rem + 1vw);
`;

export const HomePageSidebarItemContainer = styled.div`
    display: flex;
    // position: relative;
    // z-index: 0;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: white;
    font-weight: 300;
    font-size: calc(0.65rem + 0.65vw);
    box-sizing: border-box;
    border-radius: 2rem;
    // border: 1px solid green;
    // height: 30px;
    padding: 1rem;
    align-self: flex-start;
    // background-color: #0AF;
    margin-left: 15%;
    // white-space: nowrap;
    min-width: 90%;
    padding-right: 20vw;
    ${props => props.selected && css`
        color: hsl(260, 90%, 60%);
        background-color: white;
        
    `}
`;

export const HomePageContent = styled.div`
    display: flex;
    flex-direction: column;
    background-color: transparent;
    width: 100%;
    border-radius: 0 2rem 2rem 0;
`;

export const HomePageHeaderBar = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    // background-color: #0AF;
    border-radius: 0 2rem 0 0;
`;

export const HomePageTitle = styled.h1`
    display: flex;
    align-self: flex-end;
    font-size: calc(1.5rem + 1vw);
    letter-spacing: 1px;
    font-weight: 400;
    margin-left: 1.5rem;
`;

export const HomePageIconContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: absolute;
    right: 10%;
    background-color: transparent;
`;

export const MessageIcon = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // background-color: hsl(160, 80%, 60%);
    width: calc(5vw);
    height: calc(5vw);
    margin-left: 2vw;
`;

export const UserIcon = styled(MessageIcon)``;

export const UserModal = styled.div`
    position: absolute;
    display: none;
    z-index: 99;
    box-sizing: border-box;
    padding: 0.5rem;
    border-radius: 1rem;
    background-color: hsla(0,0%,100%,0.9);
    top: calc(100% + 1rem);
    width: calc(100px + 5vw);
    align-self: flex-start;
    border: 1px solid hsl(260,80%,50%);
    ${props => props.active && css`
        display: flex;
        flex-direction: column;
        align-self: center;
    `}
`;

export const HomePageBody = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    // background-color: green;
    margin-top: 30px;
    flex-direction: column;
    box-sizing: border-box;
    // padding: 1rem;
`;

export const DashboardDate = styled.h3`
    // position: absolute;
    // align-self: flex-start;
    font-size: calc(0.5rem + 0.4vw);
    font-weight: 600;
    letter-spacing: 0.4px;
    // margin-top: -2.5rem;
    // margin-left: 1.5rem;

`;

export const GoalsPageButtonContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    // background-color: #0AF;
    margin-top: -1rem;
    box-sizing: border-box;
    padding: 1rem 0;
`;

export const GoalListPageButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    border-radius: 1rem;
    // width: calc(50px + 5vw);
    box-shadow: 1px 1px 2px black;
    box-sizing: border-box;
    padding: calc(0.5rem + 0.5vw);
    font-size: calc(0.6rem + 0.3vw);
    background-color: hsl(260, 90%, 90%);
    color: hsl(260, 90%, 30%);
    letter-spacing: 1px;
    font-weight: 300;
    
`;

export const DashboardRowOne = styled.div`
    display: flex;
    box-sizing: border-box;
    flex-direction: row;
    width: 90%;
    height: 150px;
    margin-bottom: calc(1rem + 1vw);
    justify-content: space-around;
    // background-color: #0AF;
    // border: 1px solid black;
`;

export const DashboardRowTwo = styled(DashboardRowOne)`
    height: 420px;
`;

export const DashboardRowThree = styled(DashboardRowOne)``;

export const DashboardNarrowContainer = styled.div`
    display: flex;
    padding: 1rem;
    font-size: calc(0.5rem + 0.5vw);
    font-weight: 300;
    letter-spacing: 1px;
    box-sizing: border-box;
    background-color: white;
    border-radius: 2rem;
    border: 1px solid hsl(260, 90%, 90%);
    flex: 1;
`;

export const DashboardWideContainer = styled(DashboardNarrowContainer)`
    flex: 2;
`;

export const GoalsListContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    // align-content: center;
    flex-wrap: wrap;
    // align-content: space-around; // this horribly breaks the flow of the entire world, so... learn more about this before using it again :P
    box-sizing: border-box;
    overflow: scroll;
    width: 90%;
    max-height: 550px;
    border-radius: 2rem;
    padding: calc(0.5rem + 0.5vw);
    background-color: white;
    border: 1px solid hsl(260, 90%, 90%);
`;

export const GoalCard = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    font-size: calc(0.5rem + 0.5vw);
    margin: calc(0.5rem + 0.5vw) calc(0.5rem + 0.5vw);
    border-radius: 1.5rem;
    width: calc(40px + 10vw);
    height: calc(20px + 5vw);
    background-color: hsl(260, 90%, 90%);
    border: 1px solid hsl(260, 80%, 90%);
    &:hover {
        border: 2px solid hsl(260, 80%, 40%);
    }
`;

export const SideBarIcon = styled.img`
    filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(50deg) brightness(112%) contrast(112%);
    display: none;
    ${props => props.viewed && css`
        filter: invert(27%) sepia(49%) saturate(5994%) hue-rotate(252deg) brightness(97%) contrast(99%);
    `}
    // @media only screen and (min-width: 400px) {
    //     width: 0;
    //     // border: 2px solid white;
    }
`;

export const SideBarText = styled.button`
    display: flex;
    margin: 0;
    border: 0;
    background: none;
    color: inherit;
    margin-left: 0.5rem;
    font-size: calc(0.6rem + 0.4vw);
    width: 150px;
    @media only screen and (max-width: 400px) {
        width: 0;
        overflow: hidden;
    }
`

export const GoalInputContainer = styled.div`
    display: flex;
    position: relative;
    // width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin: 1.3rem 1rem;
    justify-content: flex-start;
    // border: 1px solid red;
`;

export const GoalInputLabel = styled.label`
    display: flex;
    position: absolute;
    bottom: calc(100% + 0.25rem);
    left: 0.25rem;
    font-size: calc(0.4rem + 0.5vw);
`;

export const GoalButtonsContainer = styled.div`
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
`;

export const GoalButton = styled(GoalListPageButton)`
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    border-radius: 1rem;
    font-size: calc(0.5rem + 0.5vw);
    ${props => props.barButton && css`
        margin: 0;
        border-radius: 0;
    `}
    ${props => props.leftSide && css`
        border-radius: 1rem 0 0 1rem;
    `}
    ${props => props.rightSide && css`
        border-radius: 0 1rem 1rem 0;
    `}
    ${props => props.selected && css`
        font-weight: 600;
        color: white;
        background-color: hsl(260, 90%, 60%);
    `}
`;

export const UserModalButton = styled(GoalButton)`
    margin: 1rem;
`;

export const DailyProgressContainer = styled.div`
    display: flex;
    position: relative;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    width: 7vw;
    height: 80%;
    border: 1px solid black;
    ${props => props.past && css`
        background-color: green;
        font-weight: 400;
        opacity: 0.7;
    `}
    ${props => props.present && css`
        font-weight: 600;
        border-width: 2px;
    `}
    ${props => props.future && css`
        font-weight: 200;
        opacity: 0.3;
    `}
`;

export const DailyProgressDayLabel = styled.div`
    position: absolute;
    top: -25%;
`;

export const SelectIconModalContainer = styled.div`
    position: fixed;
    display: none;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    ${props => props.active && css`
        display: flex;
        background-color: hsla(0,0%,0%,0.5);
    `}
`;

export const SelectIconModal = styled.div`
    position: fixed;
    display: none;
    box-sizing: border-box;
    padding: 2rem;
    border: 1px solid hsl(260, 80%, 40%);
    border-radius: 1.5rem;
    ${props => props.active && css`
        display: flex;
        opacity: 1;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        align-content: flex-start;
        width: 60vw;
        // min-height: 50vh;
        height: auto;
        left: 20vw;
        top: 10px;
        z-index: 90;
        background-color: white;
        overflow: scroll;
    `}
`;

export const DashboardGoalButton = styled(GoalButton)`
    justify-content: space-between;
    margin-bottom: 1rem;
    width: 70%;
    // font-size: calc(0.7rem + 0.3vw);
`;

export const FriendCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    border: 1px solid hsl(260,80%,40%);
    border-radius: 1rem;
    padding: 1rem;
    margin: 1rem;
    width: 200px;
    height: 200px;
`;

export const NewFriendsBadge = styled.div`
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-color: red;
    color: white;
    left: -15px;
    bottom: 15px;
    z-index: 2;
    width: 0;
    overflow: hidden;
    border-radius: 50px;
    ${props => props.friendRequests && css`
        width: 25px;
        height: 25px;
    `}
`;







/*
export const GoalsListContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    // align-content: center;
    flex-wrap: wrap;
    // align-content: space-around; // this horribly breaks the flow of the entire world, so... learn more about this before using it again :P
    box-sizing: border-box;
    overflow: scroll;
    width: 90%;
    max-height: 550px;
    border-radius: 2rem;
    padding: calc(0.5rem + 0.5vw);
    background-color: white;
    border: 1px solid hsl(260, 90%, 90%);
`;
*/