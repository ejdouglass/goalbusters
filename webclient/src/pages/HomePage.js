import React, { useState, useContext, useEffect } from 'react';
import { actions, Context } from '../context/context';
import { useHistory } from 'react-router-dom';
import logo from '../assets/struggle.png';
import friendsSVG from '../assets/team.svg';
import dashboardSVG from '../assets/growth.svg';
import goalsSVG from '../assets/goal.svg';
import defaultUserSVG from '../assets/avatars/user.svg';
import historySVG from '../assets/history.svg';
import soloSVG from '../assets/solo.svg';
import groupSVG from '../assets/group.svg';
import completeSVG from '../assets/complete.svg';
import pendingSVG from '../assets/pending.svg';
import incompleteSVG from '../assets/incomplete.svg';
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
import { HomePageBackgroundContainer, HomePageContainer, HomePageSidebar, HomePageSidebarLogoContainer, HomePageSidebarItemContainer, HomePageContent, HomePageHeaderBar, HomePageTitle, HomePageIconContainer, MessageIcon, UserIcon, HomePageBody, DashboardDate, GoalsPageButtonContainer, GoalListPageButton, DashboardRowOne, DashboardRowTwo, DashboardRowThree, DashboardNarrowContainer, DashboardWideContainer, GoalsListContainer, GoalCard, SideBarIcon, GoalSearchInput, GoalInputContainer, GoalInputLabel, GoalButtonsContainer, GoalButton, GroupInfoInput, UserModal, UserModalButton, DailyProgressContainer, DailyProgressDayLabel, SideBarText, DashboardGoalButton, GroupInfoInputContainer, FriendCardContainer, NewFriendsBadge, DashboardTopRow, BuddyButtonContainer } from '../styled/styled';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Can scoot these 'global' functions into a global function file later
function dayNumberToWord(dayNum) {
    switch (dayNum) {
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
    }
}

function monthNumberToWord(monthNum) {
    switch (monthNum) {
        case 0: return 'January';
        case 1: return 'February';
        case 2: return 'March';
        case 3: return 'April';
        case 4: return 'May';
        case 5: return 'June';
        case 6: return 'July';
        case 7: return 'August';
        case 8: return 'September';
        case 9: return 'October';
        case 10: return 'November';
        case 11: return 'December';
    }
}

function calcDayKey(date) {
    let dateToKey = date ? date : new Date();
    let monthKey = dateToKey.getMonth() + 1;
    let dateKey = dateToKey.getDate();
    let yearKey = dateToKey.getFullYear();

    // console.log(`Made a datekey: ${`${(monthKey < 10 ? `0` + monthKey : monthKey)}/${(dateKey < 10 ? `0` + dateKey : dateKey)}/${yearKey}`}`)
    return `${(monthKey < 10 ? `0` + monthKey : monthKey)}/${(dateKey < 10 ? `0` + dateKey : dateKey)}/${yearKey}`;

    // Returns MM/DD/YYYY, adding a leading '0' where necessary, i.e. 03/07/2021  
}

function calcTimestamp(date) {
    // Returns non-military time as a string in the expected format, i.e. 4:30pm, 10:21am, etc.
    let timeToStamp = date ? date : new Date();
    let hourStamp = timeToStamp.getHours();
    let minuteStamp = timeToStamp.getMinutes();

    return `${hourStamp > 12 ? hourStamp - 12 : hourStamp}:${minuteStamp < 10 ? `0` + minuteStamp : minuteStamp}${hourStamp >= 12 ? 'pm' : 'am'}`;
}


const HomePage = () => {
    const [state, dispatch] = useContext(Context);
    const [sidebarSelection, setSidebarSelection] = useState('dashboard');
    const [goalSearch, setGoalSearch] = useState('');
    const [friendSearch, setFriendSearch] = useState('');
    const [friendsList, setFriendsList] = useState([]);
    const [viewMyFriends, setViewMyFriends] = useState(true);
    const [dashboardDailyGoalPage, setDashboardDailyGoalPage] = useState(0);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const history = useHistory();
    const today = new Date();
    const [todaysGoals, setTodaysGoals] = useState([]);
    const [allGoalsArray, setAllGoalsArray] = useState([]);
    const [goalToBust, setGoalToBust] = useState();
    const [goalToCompare, setGoalToCompare] = useState({});
    const [newFriendRequests, setNewFriendRequests] = useState(0);
    // ... just realized the above is ALL goals, not today's goals only; whoops.
    const [newGoal, setNewGoal] = useState({
        name: '',
        description: '',
        groupRule: 'solo',
        logo: '',
        colorScheme: '',
        startDate: new Date(),
        durationNumber: 1,
        durationUnits: 'weeks',
        weekDays: {sun: false, mon: false, tue: false, wed: false, thu: false, fri: false, sat: false},
        privacyLevel: 0,
        activityName: '',
        dailyTargetUnits: 'minutes',
        dailyTargetNumber: 30,
        weeklyCompletionTarget: 1
    });      
    const [goalPage, setGoalPage] = useState(1);
    


    function bustGoal(goal) {
        setGoalToCompare(goal);
        setGoalToBust(goal);
        console.log('Time to bust! ' + JSON.stringify(goal))
        setSidebarSelection('bustGoal');
    }

    function handleGoalUpdate() {
        // ... note that this is the history[DATE].goals.GOALID = {}; the EVENTS here should be echoed 'up' and pushed into the day's overall events array, too
        // complete: true/false
        // dailyTargetUnits: reps, minutes, hours
        // dailyTargetUnitsDone: 0 (by default)
        // dailyTargetNumber: ... more than 0 :P
        // notes: STRING
        // events: [{timestamp: ??, agent: username, action: ''}]
        // groupRule: solo/group

        // Notes is a string; let's consider it a 'temporary' variable that just exists so it can scoot into the EVENTS array
        //  ... 

        // 'Notes' is currently a one-off record, but can be ultimately modified to be sequential updates over the lifespan of a goal for a given day
        setGoalToCompare({});
        if (goalToBust?.notes === goalToCompare?.notes && goalToBust?.dailyTargetUnitsDone === goalToCompare?.dailyTargetUnitsDone) return setSidebarSelection('dashboard');

        // now that we have a goalToCompare sitting up there, we can actually add details to events, pointing out incremental progress
        let finalizedGoalObj = {...goalToBust};
        let rightNow = new Date();
        let actionString = ` recorded ${finalizedGoalObj.dailyTargetUnitsDone} ${finalizedGoalObj.dailyTargetUnits} completed for ${finalizedGoalObj.name}`;
        if (goalToBust?.notes) actionString += ` with the note: [${goalToBust.notes}]`;
        finalizedGoalObj.complete = finalizedGoalObj.dailyTargetUnitsDone >= finalizedGoalObj.dailyTargetNumber ? true : false;
        actionString += finalizedGoalObj.complete ? `, finishing this project for the day!` : `.`;
        let eventObj = {timestamp: rightNow, agent: state.username, action: actionString};
        setGoalToBust({});
        
        // To 'fix': add note(s) to the eventObj's ACTION string, mostly (the rest can be handled backend)
        dispatch({type: actions.SEND_DATA, payload: {requestType: 'update_daily_goal', finalizedGoalObj: finalizedGoalObj, eventObj: eventObj}});
        setSidebarSelection('dashboard');
        // idea: can have a 'whatDo' updater on server, so when the response is sent, it also pushes us back to the dashboard, rather than just going
        

    }

    function logout() {
        localStorage.removeItem('goalinGirlsJWT');
        dispatch({type: actions.LOGOUT});
        history.push('/');
    }

    function handleFriendSearch(searchString) {
        setFriendSearch(searchString);
        if (viewMyFriends) {
            // HERE: viewing user's friends (can do a client-only search for now :P)
        }
        // HERE: viewing 'foreign' friends
    }

    function createNewGoal() {
        // Hm, dispatch a package for server and navigate away when we receive a response?

        // THIS: check for missing fields, alert the user accordingly, or if all's well wrap up a package for the server to parse and await a response at the KEYBOARD level
        if (!newGoal.name) return dispatch({type: actions.ADD_ALERT, payload: {type: 'error', message: `Please enter a name for this Goal Project.`, id: Math.random().toString(36).replace('0.', '')}});
        let anyPositiveDay = false;
        for (const day in newGoal.weekDays) {
            if (newGoal.weekDays[day]) {
                anyPositiveDay = true;
                break;
            }
        }
        if (!anyPositiveDay) return dispatch({type: actions.ADD_ALERT, payload: {type: 'error', message: `Please select at least one day a week to pursue this goal.`, id: Math.random().toString(36).replace('0.', '')}});
        if (!newGoal.activityName) return dispatch({type: actions.ADD_ALERT, payload: {type: 'error', message: `Please indicate the name of the goal activity (e.g. "exercise").`, id: Math.random().toString(36).replace('0.', '')}});

        // ADD: reset newGoal to starting values, since it lingers in the background :P
        // can also get 'fancy' and add a useEffect handler to 'listen' for feedback that a new goal was created, THEN setSidebarSelection('goals')
        dispatch({type: actions.SEND_DATA, payload: {...newGoal, requestType: 'create_goal'}});
        setNewGoal({
            name: '',
            description: '',
            groupRule: 'solo',
            logo: '',
            colorScheme: '',
            startDate: new Date(),
            durationNumber: 1,
            durationUnits: 'weeks',
            weekDays: {sun: false, mon: false, tue: false, wed: false, thu: false, fri: false, sat: false},
            privacyLevel: 0,
            activityName: '',
            dailyTargetUnits: 'minutes',
            dailyTargetNumber: 30,
            weeklyCompletionTarget: 1
        });
        return setSidebarSelection('goals');
        
    }

    function handleGoalScroll(e) {
        const goalsListEle = document.getElementById('goalsList');
        if (goalsListEle.scrollHeight - Math.abs(goalsListEle.scrollTop) === goalsListEle.clientHeight) {
            return console.log(`You've scrolled as far as scrolling can be done here!`);
            
        }
        return console.log(`More scrolling is possible!`);
    }

    useEffect(() => {
        if (state?.goals) {
            let goalArray = [];
            let allGoalArray = [];
            let today = new Date().getDay();
            today = dayNumberToWord(today).slice(0, 3);
            today = today[0].toLowerCase() + today.slice(1);
            for (const goalID in state.goals) {
                if (state.goals[goalID].weekDays[today]) goalArray.push(state.goals[goalID]);
                allGoalArray.push(state.goals[goalID]);
            }
            // setTodaysGoals(goalArray);
            setAllGoalsArray(allGoalArray);
        }
        
    }, [state?.goals]);

    useEffect(() => {
        /*
            AKSHULLY
            we want to have the todaysGoals be a snippet out of HISTORY, not out of global goals that are selected;
                -- that way the HISTORY of that goal for today will contain its completed-ness
                -- but that does mean that BOOP will lead to not an overview of that goal, but that goal for the day (with notes?)
                ... ok, so need to model out the history-form of a goal on a given day and go from there

            HISTORY MODELING:
            -- object with mm/dd/yyyy keys
            ... below, it might make sense to record timestamps 'raw' and just parse them locally into human-readability
            -- so history['03/14/21'] = {goals: {ID: {id: id, rules: {...}, complete: t/f}, events: [{agent: username, action: actionString, timestamp: X:XXampm}]}
            -- history[DATE].goals should automatically populate with ALL goals that are appropriate for that day; pass/fail/etc. amended with user interaction 
            
            {state?.history[calcDayKey()] ? (
                <>
                    {state.history[calcDayKey()].events.map((historyItem, index) => (
                        <div key={index}>{historyItem.timestamp}: {historyItem.agent === state?.username ? 'You' : historyItem.agent} {historyItem.action}</div>
                    ))}
                </>            
        */

        
        // let ticker = state?.history[calcDayKey()]?.goals.length;
 
        /*
        if (state.goals && !ticker) {
            // console.log(`NO TODAY GOALS FOUND, attempting to populate`)
            // condition: goals exist, history for "today" has nothin'... so let's repair that situation, slam 'em all into a 'proper' setup as per above
            // note: if we create a new 'history' to work with, it should also send off to the backend as well (UPDATE_HISTORY)
            let today = new Date().getDay();
            let dateKey = calcDayKey();
            let todayHistory = {};
            let todayGoalArray = [];
            today = dayNumberToWord(today).slice(0, 3);
            today = today[0].toLowerCase() + today.slice(1);
            for (const goalID in state.goals) {
                if (state.goals[goalID].weekDays[today]) {
                    // todayGoalArray.push(state.goals[goalID]);
                    // console.log(`Found a goal that belongs in TODAY'S LIST`)
                    todayHistory[goalID] = {
                        dateKey: dateKey,
                        id: goalID,
                        name: state.goals[goalID].name,
                        logo: state.goals[goalID].logo || '',
                        groupRule: state.goals[goalID].groupRule,
                        activityName: state.goals[goalID].activityName,
                        dailyTargetUnits: state.goals[goalID].dailyTargetUnits,
                        dailyTargetUnitsDone: 0,
                        dailyTargetNumber: state.goals[goalID].dailyTargetNumber,
                        complete: false,
                        notes: '',
                        events: []
                    }
                }
            }
            
            for (const goalID in todayHistory) {
                todayGoalArray.push(todayHistory[goalID]);
                // console.log(`Today's goal array is now gaining the goal named ${todayHistory[goalID].name}`)
            }
            setTodaysGoals(todayGoalArray);

            // HERE: make new dispatch to update history, passing today's calcDateKey() to use and the todayHistory {} to append to that
            // we want to update history... if there's NO history at all, versus if there's no history for 'today' (either would get us here)
        }
        */
        // if (ticker) {
        //     console.log(`Previous data on today's HISTORY found! Beep-booping.`);
        //     let dateKey = calcDayKey();
        //     let todayGoalArray = [];
        //     for (const goalID in state.history[dateKey].goals) {
        //         let dailyGoalObj = {...state.history[dateKey].goals[goalID]};
        //         if (!dailyGoalObj.dateKey) dailyGoalObj.dateKey = calcDayKey();
        //         todayGoalArray.push(dailyGoalObj);
        //     }
        //     setTodaysGoals(todayGoalArray);
        // }
        
    }, [state.history, state.goals]);

    useEffect(() => {
        let friendLength = Object.keys(state?.friends).length || undefined;
        if (friendLength) {
            let newFriendRequests = 0;
            console.log(`Friends currently looks like: ${JSON.stringify(state.friends)}`)
            Object.keys(state.friends).forEach(friendKey => {
                if (state.friends[friendKey].status === 'requestReceived') newFriendRequests += 1;
            });
            setNewFriendRequests(newFriendRequests);
        }
    }, [state?.friends]);

    useEffect(() => {
        // console.log(`HISTORY has CHANGED! wooOoO`)
        // PARSING THE DATA, I think I've incorrectly pulled from history.goals.goalID versus history.goalID?
        console.log(`HISTORY HOOK ACTIVATED. Today's new history: ${JSON.stringify(state?.history[calcDayKey()]?.goals)}`)
        if (state?.history[calcDayKey()]?.goals) {
            if (Object.keys(state?.history[calcDayKey()]?.goals).length > 0) {
                let dateKey = calcDayKey();
                let todayGoalArray = [];
                for (const goalID in state.history[dateKey].goals) {
                    console.log(`Adding to today the goal of ${state.history[dateKey].goals[goalID].name}, whose entirety looks like: ${JSON.stringify(state.history[dateKey].goals[goalID])}`)
                    let dailyGoalObj = {...state.history[dateKey].goals[goalID]};
                    if (!dailyGoalObj.dateKey) dailyGoalObj.dateKey = calcDayKey();
                    todayGoalArray.push(dailyGoalObj);
                }
                setTodaysGoals(todayGoalArray);
            }
        }
    }, [state.history]);

    useEffect(() => {
        // NOW THE GOALS SHALL BE TODAYS GOALS.
        // And we'll rejigger the 'goals' page to just use all state-ly goals, probably?

        // goal.weekDays (that's a dumb camelCase) is our target, but it's in format sun/mon/tue... bleh
        // dayNumberToWord will return the full day, so we just gotta  
        let goalArray = [];
        for (const goalID in state.goals) {
            goalArray.push(state.goals[goalID]);
        }

        // TODO: Repurpose the below for the 'actual' search, not using todaysGoals
        if (goalSearch.length > 0) {
            // console.log(`SEARCHING WITH GOALSEARCH STRING: ${goalSearch}`)
            let filteredGoals = goalArray.filter(goal => goal.name.toLowerCase().indexOf(goalSearch) !== -1);
            return setAllGoalsArray(filteredGoals);
        }
        return setAllGoalsArray(goalArray);
    }, [goalSearch]);

    useEffect(() => {
        let visibleFriendsArray = [];
        if (friendSearch) {
            if (viewMyFriends) {
                for (const username in state?.friends) {
                    visibleFriendsArray.push(state.friends[username]);
                }
                if (friendSearch) {
                    visibleFriendsArray = visibleFriendsArray.filter(friend => friend.username.toLowerCase().indexOf(friendSearch) !== -1);
                }
                return setFriendsList(visibleFriendsArray);
            }
            if (!viewMyFriends) {
                dispatch({type: actions.SEND_DATA, payload: {requestType: 'search_new_friend', searchString: friendSearch}});
            }
        }
        if (!friendSearch) {
            if (!viewMyFriends) {
                setFriendsList(visibleFriendsArray);
            }
            if (viewMyFriends) {
                for (const username in state?.friends) {
                    visibleFriendsArray.push(state.friends[username]);
                }
                setFriendsList(visibleFriendsArray);
            }
            
        }
    }, [friendSearch]);

    useEffect(() => {
        setFriendSearch('');
        if (viewMyFriends) {
            let visibleFriendsArray = [];
            for (const username in state?.friends) {
                visibleFriendsArray.push(state.friends[username]);
            }
            console.log(`Setting friends list, length of ${visibleFriendsArray.length}`)
            return setFriendsList(visibleFriendsArray);
        }
        return setFriendsList([]);
    }, [viewMyFriends]);

    useEffect(() => {
        // NOTE: token loading on page refresh caused odd effects; adding this side effect listener makes sure this doesn't cause 'empty friends loading'
        if (friendSearch) {
            let visibleFriendsArray = [];
            if (viewMyFriends) {
                for (const username in state?.friends) {
                    visibleFriendsArray.push(state.friends[username]);
                }
                if (friendSearch) {
                    visibleFriendsArray = visibleFriendsArray.filter(friend => friend.username.toLowerCase().indexOf(friendSearch) !== -1);
                }
                return setFriendsList(visibleFriendsArray);
            }
            if (!viewMyFriends) {
                dispatch({type: actions.SEND_DATA, payload: {requestType: 'search_new_friend', searchString: friendSearch}});
            }
        }
        if (!friendSearch && viewMyFriends) {
            let friendsArray = [];
            for (const username in state?.friends) {
                friendsArray.push(state.friends[username]);
            }
            setFriendsList(friendsArray);
        }
        // let friendsArray = [];
        // for (const username in state?.friends) {
        //     friendsArray.push(state.friends[username]);
        // }
        // setFriendsList(friendsArray);
    }, [state.friends]);

    useEffect(() => {
        if (state.dataToReceive) {
            switch (state.dataToReceive.dataType) {
                case 'friend_search_result': {
                    setFriendsList(state.dataToReceive.payload);
                }
            }
        }
    }, [state?.dataToReceive]);

    // useEffect(() => {
    //     if (sidebarSelection === 'dashboard') {
    //         goalsListEle = document.getElementById("goalsList");
    //         setGoalScroll(goalsListEle.scrollTop);
    //         console.log(`Set goalscroll to ${goalScroll}`)
    //         // console.log(`Scrollheight of goalslist is ${goalsListEle.scrollHeight}`)
    //         // console.log(`Client of goalslist is ${goalsListEle.clientHeight}`)

    //     }
    //     // return goalsListEle = 0;
    // }, [sidebarSelection]);

    // useEffect(() => {
    //     console.log(`GOALSCROLL BE THUS: ${goalScroll}`)
    //     if ((goalsListEle) && (goalsListEle.scrollHeight - Math.abs(goalScroll) === goalsListEle.clientHeight)) {
    //         alert(`MORE CONTENT BELOW GOOD SIR OR MADAM`);
    //         // Above essentially means "not scrolled all the way down"
    //         // HERE: can go ahead and add a 'scroll down arrow' effect, theoretically...
    //         // ... however, that arrow will currently just stay there, since we're listening for sidebarSelection, NOT current scrollheight
    //     }
    // }, [goalScroll]);

    return (
        <HomePageBackgroundContainer onClick={() => userModalVisible ? setUserModalVisible(false) : null}>
            <HomePageContainer>
                <HomePageSidebar>

                    <HomePageSidebarLogoContainer>
                        <img src={logo} alt="Logo" style={{width: 'calc(50px + 3vw)'}}/>
                    </HomePageSidebarLogoContainer>

                    <HomePageSidebarItemContainer selected={sidebarSelection === 'dashboard' || sidebarSelection === 'bustGoal'} onClick={() => setSidebarSelection('dashboard')}>
                        <SideBarIcon style={{display: 'flex'}} src={dashboardSVG} width="25" height="25" viewed={sidebarSelection === 'dashboard' || sidebarSelection === 'bustGoal'} />
                        <SideBarText>Dashboard</SideBarText>
                    </HomePageSidebarItemContainer>

                    <HomePageSidebarItemContainer selected={sidebarSelection === 'friends'} onClick={() => setSidebarSelection('friends')}>
                        <div style={{position: 'relative'}}>
                            <NewFriendsBadge friendRequests={newFriendRequests}>{newFriendRequests}</NewFriendsBadge>
                            <SideBarIcon style={{display: 'flex'}} src={friendsSVG} width="25" height="25" viewed={sidebarSelection === 'friends'} />
                        </div>
                        <SideBarText style={{position: 'relative'}}>Friends</SideBarText>

                    </HomePageSidebarItemContainer>

                    <HomePageSidebarItemContainer selected={sidebarSelection === 'goals' || sidebarSelection === 'createGoal'} onClick={() => setSidebarSelection('goals')}>
                        <SideBarIcon style={{display: 'flex'}} src={goalsSVG} width="25" height="25" viewed={sidebarSelection === 'goals' || sidebarSelection === 'createGoal'} />
                        <SideBarText>My Goals</SideBarText>                        
                    </HomePageSidebarItemContainer>

                    <HomePageSidebarItemContainer selected={sidebarSelection === 'history'} onClick={() => setSidebarSelection('history')}>
                        <SideBarIcon style={{display: 'flex'}} src={historySVG} width="25" height="25" viewed={sidebarSelection === 'history'} />
                        <SideBarText>History</SideBarText>                        
                    </HomePageSidebarItemContainer>                    

                </HomePageSidebar>

                <HomePageContent>

                    <HomePageHeaderBar>

                        {/* Reminder to tweak this for less awkward rendering of stuff like 'CreateGoal' */}
                        <HomePageTitle>{sidebarSelection[0].toUpperCase() + sidebarSelection.slice(1)}</HomePageTitle>

                        <HomePageIconContainer>
                            <UserIcon style={{width: 'calc(50px + 3vw)', height: 'auto', marginTop: '1rem', position: 'relative'}}>
                                <img src={state?.icon || defaultUserSVG} style={{width: 'calc(50px + 3vw)'}} onClick={() => setUserModalVisible(!userModalVisible)}/>
                                <UserModal active={userModalVisible}>
                                    <div style={{alignSelf: 'center'}}>{state?.username}</div>
                                    <UserModalButton onClick={logout}>Log Out</UserModalButton>
                                    <UserModalButton onClick={() => history.push('/settings')}>Settings</UserModalButton>
                                    {/* <UserModalButton>Friend Requests</UserModalButton> */}
                                </UserModal>
                            </UserIcon>
                        </HomePageIconContainer>

                    </HomePageHeaderBar>

                    <HomePageBody>

                        {/* DTAB */}
                        {sidebarSelection === 'dashboard' && (
                            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                                <DashboardTopRow>
                                    {/* List of goals
                                        ACROSS TOP: quick filter-by boops
                                        Column down: buttons that lead to detail (and delete) page, progress OR done/undone for day, group/solo icon, name
                                    */}

                                    <DashboardNarrowContainer style={{flexDirection: 'column', position: 'relative', overflow: 'hidden'}}>
                                        <DashboardDate style={{alignSelf: 'flex-start'}}>
                                            <div>Goals for {dayNumberToWord(today.getDay()).slice(0,3).toUpperCase()} {today.getMonth() + 1}/{today.getDate()}/{`${today.getFullYear()}`.slice(2)}</div>
                                            <div style={{fontSize: '0.8em'}}>{todaysGoals.filter(goal => goal.complete).length}/{todaysGoals.length} done for the day!</div>
                                        </DashboardDate>
                                        <div onScroll={handleGoalScroll} id='goalsList' style={{overflow: 'scroll', width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                        {todaysGoals.map((goal,index) => (
                                            <DashboardGoalButton key={index} onClick={() => bustGoal(goal)}>
                                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'calc(30px + 1vw)', height: 'calc(30px + 1vw)', backgroundColor: 'white', borderRadius: '1rem'}}>
                                                    <img src={goal.groupRule === 'solo' ? soloSVG : groupSVG} style={{width: 'calc(20px + 1vw)'}} />
                                                </div>
                                                
                                                {goal.name}
                                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'calc(30px + 1vw)', height: 'calc(30px + 1vw)', backgroundColor: goal.complete ? 'hsl(135,90%,50%)' : 'hsl(50,90%,70%)', borderRadius: '100%'}}>
                                                    <img src={goal.complete ? completeSVG : pendingSVG} style={{width: 'calc(20px + 1vw)'}}/>
                                                </div>
                                            </DashboardGoalButton>
                                        ))}
                                        </div>
                                        {todaysGoals.length === 0 && (
                                            <div>
                                                {state?.goals?.length ? (
                                                    <p>You have no goals for today. Take a break or define some new goals!</p>
                                                ) : (
                                                    <p>You haven't defined any goals yet! Pop over to "My Goals" on the left to get started.</p>
                                                )}
                                            </div>
                                        )}
                                    </DashboardNarrowContainer>

                                    {/* Notifications for today */}
                                    <DashboardNarrowContainer id='notificationsList' style={{flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
                                        <DashboardDate>Today's Notifications</DashboardDate>
                                        <div style={{overflow: 'scroll', width: '100%', display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
                                        {state?.history[calcDayKey()]?.events?.length ? (
                                            <>
                                            {state.history[calcDayKey()].events.slice().reverse().map((historyItem, index) => (
                                                <div key={index} style={{width: '100%', padding: '0.5rem', marginBottom: index === 0 ? '2rem' : '0.25rem', backgroundColor: index % 2 === 0 ? 'hsl(260,90%,80%)' : 'hsl(260,80%,90%)'}}>
                                                    <div style={{fontWeight: '600'}}>{calcTimestamp(new Date(historyItem.timestamp))}{index === 0 ? ` - Most Recent` : ``}</div>
                                                    <div>{historyItem.agent === state?.username ? 'You' : historyItem.agent} {historyItem.action}</div>
                                                </div>
                                            ))}
                                            </>
                                        ) : (
                                            <>
                                                <p>Nothing happened for today yet. Pretty quiet so far!</p>
                                            </>
                                            
                                        )}
                                        </div>
                                    </DashboardNarrowContainer>

                                </DashboardTopRow>

                                <DashboardRowThree style={{width: '100%'}}>
                                    {/* HERE: weeklong overview of days; go through their HISTORY (if applicable) to show day COMPLETE, INCOMPLETE, n/a (no goals), n/a-2 (not there yet)
                                        - Booping should hop us over to this week's HISTORYPAGE entry
                                    */}
                                    <DashboardWideContainer style={{justifyContent: 'center', alignItems: 'center', width: '96%'}}>
                                        <WeeklyBar state={state} dispatch={dispatch} />
                                    </DashboardWideContainer>
                                </DashboardRowThree>
                            </div>
                        )}

                        {/* 
                            DASHBOARD DESIGNS
 
                            - two big mid-page boxes, tallest on page
                                > left, 1/3: today's "details" listing all the day's goals with boopables to either 'mark complete' or view in greater detail, shows progress/completedness for that day
                                    - move 'date' into here
                                > right, 2/3: notifications for all day's goals (maybe with visual differentiator for previous-day stuff, more obvious for today's stuff with default "nothing yet today")
                            - bottom row boxes
                                > left 2/3: weeklong overview with days (cycle history vs goals to get a Su-Sa spread generated; separate visual for days that had no explicit goals)
                                > right 1/3: ???




                                ... simplified, took this out for now.
                                <DashboardRowOne>
                                    <DashboardNarrowContainer style={{width: '100%', justifyContent: 'space-between'}}>
                                        {(Object.keys(state?.goals).length === 0 && state.username) && (
                                            <h3>You need more goals in your life. BUTTON HERE TO DO SO</h3>
                                        )}
                                        {Object.keys(state?.goals).length > 0 && (
                                            <>
                                                <GoalButton style={{width: 'calc(2vw + 50px)'}}>Left</GoalButton>
                                                Hm. Ok, gotta decide how many to display, in what girthiness, with what options
                                                    -- onClick should pop you to a (not yet extant) GoalInspectionPage for ALL TEH DEETS
                                                    -- probably cap it at 4/'screen' and add a var to check
                                                    -- left/right buttons should probably just Fay Devay if not 'required'
                                                
                                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: 'calc(100%)'}}>
                                                    {todaysGoals.slice(0, 3).map((goal, index) => (
                                                        <GoalButton style={{width: 'calc(10-vw + 30px)'}} key={index}>{goal.name}</GoalButton>
                                                    ))}
                                                </div>
                                                <GoalButton style={{width: 'calc(2vw + 50px)'}}>Right</GoalButton>
                                            </>
                                        )}
                                        HERE: tab-style goals with clicky boxes left/right (if applicable)
                                        <br/>Anyway need to use today's DAY to conjure BUTTONS
                                        <br/>Should be able to view HISTORY
                                    </DashboardNarrowContainer>
                                </DashboardRowOne>                                 
                        
                        */}
                        
                        {/* BGTAB */}
                        {sidebarSelection === 'bustGoal' && (
                            <form onSubmit={handleGoalUpdate} style={{width: '100%', height: 'auto', overflow: 'scroll', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <DashboardRowOne style={{display: 'flex', justifyContent: 'space-around', height: '100px'}}>
                                    <DashboardNarrowContainer style={{justifyContent: 'space-around', alignItems: 'center'}}>
                                        <div style={{display: 'flex', fontSize: 'calc(2rem + 1vw)'}}>
                                            {goalToBust?.name}
                                        </div>
                                    </DashboardNarrowContainer>
                                </DashboardRowOne>
                                
                                <GoalsListContainer style={{flexDirection: 'column', alignItems: 'flex-start', padding: '2rem'}}>
                                    <GoalInputContainer>
                                        <GoalInputLabel>Today's Progress:</GoalInputLabel>
                                        <GroupInfoInput type='number' autoFocus={true} style={{width: '50px', marginRight: '1rem'}} value={goalToBust.dailyTargetUnitsDone} onChange={e => setGoalToBust({...goalToBust, dailyTargetUnitsDone: e.target.value})}></GroupInfoInput>
                                        / {goalToBust.dailyTargetNumber} {goalToBust.dailyTargetUnits === 'reps' ? 'times' : goalToBust.dailyTargetUnits}
                                    </GoalInputContainer>

                                    <GoalInputContainer style={{width: '100%'}}>
                                        <GoalInputLabel>Notes</GoalInputLabel>
                                        <GroupInfoInput type='text' style={{width: '70%'}} value={goalToBust?.notes} onChange={e => setGoalToBust({...goalToBust, notes: e.target.value})}></GroupInfoInput>
                                    </GoalInputContainer>

                                    

                                    <GoalButton style={{marginLeft: '1rem'}} onClick={handleGoalUpdate}>{(goalToBust?.notes === goalToCompare?.notes && goalToBust?.dailyTargetUnitsDone === goalToCompare?.dailyTargetUnitsDone) ? `Back` : `UPDATE!`}</GoalButton>
                                </GoalsListContainer>

                                {/* <div>{goalToBust.dateKey || `No date key detected`}</div> */}
                                
                            </form>
                        )}

                        {/* 
                            BUSTGOAL PAGE
                            -- TOP: name of the goal to bust, done/undone, back
                            -- BOTTOM AREA: rules, inputs to update with, UPDATE! button
                                ... UPDATE! will slide on back to Dashboard proper... after sending off an update to backend, and back to client to update

                            So how should user input? Probably pretty much the same as newGoalTab's methods.
                            -- number input that pops up buttons
                            -- 

                            ... note that this is the history[DATE].goals.GOALID = {}; the EVENTS here should be echoed 'up' and pushed into the day's overall events array, too
                            complete: true/false
                            dailyTargetUnits: reps, time (or maybe minutes/hours?), doneness
                            dailyTargetUnitsDone: 0 (by default)
                            dailyTargetNumber: ... more than 0 :P
                            notes: STRING
                            events: [timestamp: ??, agent: username, action: '']
                            groupRule: solo/group

                            HISTORY MODELING:
                                        -- object with mm/dd/yyyy keys
                                        ... below, it might make sense to record timestamps 'raw' and just parse them locally into human-readability
                                        -- so history['03/14/21'] = {goals: {ID: {id: id, rules: {...}, complete: t/f}, events: [{agent: username, action: actionString, timestamp: X:XXampm}]}
                                        -- history[DATE].goals should automatically populate with ALL goals that are appropriate for that day; pass/fail/etc. amended with user interaction                                 

                        */}


                        {/* GTAB */}
                        {sidebarSelection === 'goals' && (
                            <div style={{width: '100%', height: 'auto', overflow: 'scroll', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <DashboardRowOne style={{justifyContent: 'space-around', flexWrap: 'wrap', alignItems: 'center'}}>
                                    <DashboardNarrowContainer style={{justifyContent: 'space-around', flexWrap: 'wrap'}}>
                                        <div style={{display: 'flex'}}>
                                            <GoalListPageButton style={{width: '200px', height: '100px', fontSize: 'calc(0.7rem + 0.4vw)', fontWeight: '600'}} onClick={() => setSidebarSelection('createGoal')}>Create NEW Goal Project!</GoalListPageButton>
                                        </div>
                                        <div style={{display: 'flex'}}>
                                            <GoalSearchInput style={{borderRadius: '1rem'}} type="input" value={goalSearch} onChange={e => setGoalSearch(e.target.value)} placeholder={`search goal names`}></GoalSearchInput>
                                        </div>
                                    </DashboardNarrowContainer>
                                </DashboardRowOne>
                                
                                <GoalsListContainer>
                                    <div style={{width: '100%', paddingLeft: '1rem', fontSize: 'calc(0.8rem + 0.3vw)', fontWeight: '600', letterSpacing: '0.7px'}}>My Goal Projects (Click to View or Edit Project Details)</div>
                                    {allGoalsArray?.slice(((goalPage - 1) * 10), ((goalPage - 1) * 10 + 10)).map((goal, index) => (
                                        <GoalCardContainer key={index} goal={goal} />
                                    ))}
                                    {Object.keys(state.goals).length === 0 && (
                                        <h3>You haven't defined or joined any GoalBuster projects yet! Create a new goal with the button above.</h3>
                                    )}
                                </GoalsListContainer>
                                
                            </div>
                        )}

                        {/* 
                            GOALPAGE DESIGNS
                            - list current goals with informative icons/etc. to show helpful info such as days/week, solo/group+size, ___
                            - ADD NEW GOAL front and center (well, top and left)
                            - goals with delete and delete-confirm options (sooner than later)

                            TOP: top bar: Create New Goal!, search my goals by goalname, filter buttons
                                NOTE: we run outta room REAL quick on small screens, so account for that
                            BELOW: Little cards with all goals (left-to-right, flex-wrapping)
                        */}

                        {/* NGTAB */}
                        {sidebarSelection === 'createGoal' && (
                            <div style={{width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden'}}>

                                <DashboardRowOne style={{justifyContent: 'space-around', height: '85px'}}>
                                    <DashboardNarrowContainer style={{justifyContent: 'space-around', width: '100%'}}>
                                        <div style={{display: 'flex', width: '50%', justifyContent: 'space-around'}}>
                                            <GoalListPageButton onClick={() => setSidebarSelection('goals')}>Back</GoalListPageButton>
                                            <GoalInputContainer style={{margin: '1rem'}}>
                                                <GoalInputLabel>Goal Project Name</GoalInputLabel>
                                                <GroupInfoInput value={newGoal.name} maxLength={20} onChange={e => setNewGoal({...newGoal, name: e.target.value})} placeholder={`Name this goal project!`}></GroupInfoInput>
                                            </GoalInputContainer>
                                        </div>
                                    </DashboardNarrowContainer>
                                </DashboardRowOne>
                                
                                <GoalsListContainer style={{justifyContent: 'space-around'}}>

                                    <GoalInputContainer>
                                        <GoalInputLabel>When are you starting?</GoalInputLabel>
                                        <DatePicker selected={newGoal.startDate} onChange={date => setNewGoal({...newGoal, startDate: date})} />
                                    </GoalInputContainer>                             
                                    
                                    <GoalInputContainer>
                                        <GoalInputLabel>Goal Project Size</GoalInputLabel>
                                        <GoalButton style={{marginRight: 'calc(0.5rem + 0.3vw)', width: '75px'}} onClick={() => setNewGoal({...newGoal, groupRule: 'solo'})} selected={newGoal.groupRule === 'solo'}>Solo</GoalButton>
                                        <GoalButton style={{width: '75px'}} onClick={() => setNewGoal({...newGoal, groupRule: 'group'})} selected={newGoal.groupRule === 'group'}>Group</GoalButton> 
                                    </GoalInputContainer>

                                    <GoalInputContainer>
                                        <GoalInputLabel>{newGoal.durationUnits === 'indefinite' ? `(no end date)` : `# of ${newGoal.durationUnits}`}</GoalInputLabel>
                                        <GoalButton style={{width: '5vw'}} barButton leftSide onClick={() => setNewGoal({...newGoal, durationNumber: newGoal.durationNumber > 1 ? newGoal.durationNumber - 1 : 1})}>-</GoalButton> 
                                        <GoalButton style={{width: '5vw'}} selected barButton>{newGoal.durationUnits === 'indefinite' ? '...' : newGoal.durationNumber}</GoalButton> 
                                        <GoalButton style={{width: '5vw'}} barButton rightSide onClick={() => setNewGoal({...newGoal, durationNumber: newGoal.durationNumber + 1})}>+</GoalButton>
                                    </GoalInputContainer>

                                    <GoalInputContainer style={{flexWrap: 'wrap'}}>
                                        <GoalInputLabel>weeks/months/etc.</GoalInputLabel>
                                        <GoalButton style={{width: '8vw'}} barButton leftSide selected={newGoal.durationUnits === 'weeks'} onClick={() => setNewGoal({...newGoal, durationUnits: 'weeks'})}>{newGoal.durationNumber === 1 ? 'week' : 'weeks'}</GoalButton> 
                                        <GoalButton style={{width: '8vw'}} barButton selected={newGoal.durationUnits === 'months'} onClick={() => setNewGoal({...newGoal, durationUnits: 'months'})}>{newGoal.durationNumber === 1 ? 'month' : 'months'}</GoalButton> 
                                        <GoalButton style={{width: '8vw'}} barButton rightSide selected={newGoal.durationUnits === 'indefinite'} onClick={() => setNewGoal({...newGoal, durationUnits: 'indefinite'})}>indefinite</GoalButton> 
                                    </GoalInputContainer>

                                    <GoalInputContainer style={{position: 'relative', marginBottom: '2rem'}}>
                                        <GoalInputLabel>{Object.keys(newGoal.weekDays).filter(day => newGoal.weekDays[day]).length > 0 ? `${Object.keys(newGoal.weekDays).filter(day => newGoal.weekDays[day]).length} day(s) per week` : `Choose Which Days to Pursue this Goal!`}</GoalInputLabel>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.sun} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, sun: !newGoal.weekDays.sun}})} barButton leftSide>Su</GoalButton>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.mon} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, mon: !newGoal.weekDays.mon}})} barButton>Mon</GoalButton>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.tue} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, tue: !newGoal.weekDays.tue}})} barButton>Tue</GoalButton>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.wed} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, wed: !newGoal.weekDays.wed}})} barButton>Wed</GoalButton>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.thu} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, thu: !newGoal.weekDays.thu}})} barButton>Thu</GoalButton>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.fri} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, fri: !newGoal.weekDays.fri}})} barButton>Fri</GoalButton>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.sat} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, sat: !newGoal.weekDays.sat}})} barButton rightSide>Sat</GoalButton>
                                        <div style={{display: 'flex', width: '100%', position: 'relative', marginTop: '1.5rem'}}>
                                            <GoalInputLabel>Shortcut Day-Selection Buttons:</GoalInputLabel>
                                            <GoalButton style={{width: '6vw', marginLeft: '0.3rem'}} selected={Object.keys(newGoal.weekDays).filter(day => newGoal.weekDays[day]).length === 7} onClick={() => setNewGoal({...newGoal, weekDays: {sun: true, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true}})} barButton>ALL THE DAYS</GoalButton>
                                            <GoalButton style={{width: '6vw', marginLeft: '0.3rem'}} selected={(newGoal.weekDays.mon && newGoal.weekDays.tue && newGoal.weekDays.wed && newGoal.weekDays.thu &&  newGoal.weekDays.fri && Object.keys(newGoal.weekDays).filter(day => newGoal.weekDays[day]).length === 5)} onClick={() => setNewGoal({...newGoal, weekDays: {sun: false, mon: true, tue: true, wed: true, thu: true, fri: true, sat: false}})} barButton>Weekdays</GoalButton>
                                            <GoalButton style={{width: '6vw', marginLeft: '0.3rem'}} selected={(newGoal.weekDays.mon && newGoal.weekDays.wed && newGoal.weekDays.fri && Object.keys(newGoal.weekDays).filter(day => newGoal.weekDays[day]).length === 3)} onClick={() => setNewGoal({...newGoal, weekDays: {sun: false, mon: true, tue: false, wed: true, thu: false, fri: true, sat: false}})} barButton>M-W-F</GoalButton>
                                            <GoalButton style={{width: '6vw', marginLeft: '0.3rem'}} selected={(newGoal.weekDays.tue && newGoal.weekDays.thu && Object.keys(newGoal.weekDays).filter(day => newGoal.weekDays[day]).length === 2)} onClick={() => setNewGoal({...newGoal, weekDays: {sun: false, mon: false, tue: true, wed: false, thu: true, fri: false, sat: false}})} barButton>Tu-Th</GoalButton>
                                            <GoalButton style={{width: '6vw', marginLeft: '0.3rem'}} selected={(newGoal.weekDays.sat && newGoal.weekDays.sun && Object.keys(newGoal.weekDays).filter(day => newGoal.weekDays[day]).length === 2)} onClick={() => setNewGoal({...newGoal, weekDays: {sun: true, mon: false, tue: false, wed: false, thu: false, fri: false, sat: true}})} barButton>Weekends</GoalButton>
                                            <GoalButton style={{width: '6vw', marginLeft: '0.3rem'}} selected={Object.keys(newGoal.weekDays).filter(day => newGoal.weekDays[day]).length === 0} onClick={() => setNewGoal({...newGoal, weekDays: {sun: false, mon: false, tue: false, wed: false, thu: false, fri: false, sat: false}})} barButton>(No Days)</GoalButton>
                                        </div>
                                        
                                    </GoalInputContainer>

                                    <GoalInputContainer>
                                        <GoalInputLabel>{newGoal.groupRule === 'solo' ? `Goal Visibility (Who Can View)` : `Goal Joining (Who Can Join)`}</GoalInputLabel>
                                        <GoalButton style={{width: '9vw', height: '50px'}} onClick={() => setNewGoal({...newGoal, privacyLevel: 0})} selected={newGoal.privacyLevel === 0} barButton leftSide>Any User</GoalButton>
                                        <GoalButton style={{width: '9vw', height: '50px'}} onClick={() => setNewGoal({...newGoal, privacyLevel: 1})} selected={newGoal.privacyLevel === 1} barButton>Only Friends</GoalButton>
                                        <GoalButton style={{width: '9vw', height: '50px'}} onClick={() => setNewGoal({...newGoal, privacyLevel: 2})} selected={newGoal.privacyLevel === 2} barButton rightSide>Only Me</GoalButton>
                                    </GoalInputContainer>

                                    <GoalInputContainer>
                                        <GoalInputLabel>Daily Goal Target</GoalInputLabel>
                                        <GroupInfoInput type='number' style={{width: '50px', marginRight: '1rem'}} min={1} max={59} value={newGoal.dailyTargetNumber} onChange={e => setNewGoal({...newGoal, dailyTargetNumber: (e.target.value >= 1 && e.target.value <= 59) ? e.target.value : ''})}></GroupInfoInput>
                                        <GoalButton style={{width: '5vw', height: '50px'}} onClick={() => setNewGoal({...newGoal, dailyTargetUnits: 'reps', dailyTargetNumber: 1})} selected={newGoal.dailyTargetUnits === 'reps'} barButton leftSide>times done</GoalButton>
                                        <GoalButton style={{width: '5vw', height: '50px'}} onClick={() => setNewGoal({...newGoal, dailyTargetUnits: 'minutes', dailyTargetNumber: 30})} selected={newGoal.dailyTargetUnits === 'minutes'} barButton>minutes</GoalButton>
                                        <GoalButton style={{width: '5vw', height: '50px'}} onClick={() => setNewGoal({...newGoal, dailyTargetUnits: 'hours', dailyTargetNumber: 1})} selected={newGoal.dailyTargetUnits === 'hours'} barButton rightSide>hours</GoalButton>
                                    </GoalInputContainer>

                                    <GoalInputContainer>
                                        <GoalInputLabel>Activity is Called</GoalInputLabel>
                                        <GroupInfoInput type='text' maxLength={16} placeholder={`e.g. exercising`} value={newGoal.activityName} onChange={e => setNewGoal({...newGoal, activityName: e.target.value})}></GroupInfoInput>
                                    </GoalInputContainer>

                                    <GoalInputContainer style={{width: '100%', justifyContent: 'center'}}>
                                        <GoalButton onClick={createNewGoal} style={{width: 'calc(75px + 15vw)', height: '100px', fontSize: 'calc(1rem + 1vw)'}}>Create Goal!</GoalButton>
                                    </GoalInputContainer>

                                </GoalsListContainer>

                            </div>
                        )} 

                        {/* 
                            NEWGOAL MAKING

                            MISSING: 
                            
                            -- weeklyCompletionTarget


                            const [newGoal, setNewGoal] = useState({
                                name: '',
                                description: '',
                                groupRule: 'solo',
                                logo: '',
                                colorScheme: '',
                                tags: {fitness: false, productivity: false, newHabit: false},
                                startDate: new Date(),
                                durationNumber: 1,
                                durationUnits: 'weeks',
                                weekDays: {sun: false, mon: false, tue: false, wed: false, thu: false, fri: false, sat: false},
                                privacyLevel: 0,
                                activityName: '',
                                // dailyTargetType: 'time', // inferred
                                dailyTargetUnits: 'minutes',
                                dailyTargetNumber: 30,
                                weeklyCompletionTarget: 1
                            });    
                            
                            NEW CONCEPT: -either- set particular days OR set goal number of days per week



                        
                        */}

                        {/* FTAB */}
                        {sidebarSelection === 'friends' && (
                            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                                <DashboardRowOne style={{justifyContent: 'space-around', height: 'auto', width: '100%', marginBottom: '1rem'}}>
                                    <DashboardNarrowContainer style={{width: '96%', display: 'flex', flexWrap: 'wrap', flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}}>
                                        <BuddyButtonContainer>
                                            <GoalButton style={{width: 'calc(100px + 3vw)'}} selected={viewMyFriends} onClick={() => setViewMyFriends(true)}>View My Buddies</GoalButton>
                                            <GoalButton style={{width: 'calc(100px + 3vw)'}} selected={!viewMyFriends} onClick={() => setViewMyFriends(false)}>Search New Buddies</GoalButton>
                                        </BuddyButtonContainer>
                                        <div style={{position: 'relative'}}>
                                            <GroupInfoInput style={{height: '36px'}} value={friendSearch} onChange={e => handleFriendSearch(e.target.value)} placeholder={viewMyFriends ? `search my friends` : 'search for friends'}></GroupInfoInput>    
                                        </div>
                                    </DashboardNarrowContainer>
                                </DashboardRowOne>   

                                <GoalsListContainer style={{minHeight: '200px', maxHeight: '400px', width: '96%', justifyContent: 'center', overflow: 'scroll', marginTop: '0'}}>
                                    <h3 style={{width: '100%', margin: '0.75rem 1rem', alignSelf: 'flex-start', fontSize: 'calc(1rem + 0.3vw)', textAlign: 'center'}}>
                                        {viewMyFriends ? `My Goalbusting Buddies` : `Searching New Buddies`}
                                    </h3>
                                    {friendsList.length > 0 ? (friendsList.map((friend, index) => (
                                        <FriendCard key={friend.username} index={index} state={state} dispatch={dispatch} friend={friend}></FriendCard>
                                    ))) : (
                                        <div style={{alignSelf: 'flex-start'}}>
                                            
                                            {viewMyFriends && <div style={{fontSize: 'calc(0.9rem + 0.4vw)', marginLeft: '1rem'}}>You haven't connected with any Goalbuster friends yet. Try the Search Friends tab above!</div>}
                                            {(!viewMyFriends && friendSearch) && <div style={{fontSize: 'calc(0.9rem + 0.4vw)', marginLeft: '1rem'}}>No users found matching that criteria.</div>}
                                            {(!viewMyFriends && !friendSearch) && <div style={{fontSize: 'calc(0.9rem + 0.4vw)', marginLeft: '1rem'}}>Enter any part of a username above to search for new friends to Goalbust with!</div>}
                                            
                                        </div>
                                    )}
                                    {/* {Object.keys(state?.friends).length > 0 ? (
                                        <>
                                            {state.friends.map((friend,index) => (
                                                <button key={index}>{friend.username}</button>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <div>{friendSearch ? `` : `You haven't connected with any Goalbuster Friends. Search above!`}</div>
                                        </>
                                    )} */}
                                </GoalsListContainer>                                                             

                            </div>
                        )}

                        {/* 
                            FRIENDS PAGE DESIGNS
                            - should list all friends :P
                            - should be able to filter by online, last active, pursuing goals with (or not), etc.
                            - should be able to SEARCH for new friends, dependent on their privacy settings
                            - should display a neat little card that shows their icon, how long ago they were active, etc.
                            
                        */}


                        {/* HTAB */}
                        {sidebarSelection === 'history' && (
                            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                                <DashboardRowOne style={{justifyContent: 'space-around', height: '75px'}}>
                                    <DashboardNarrowContainer style={{justifyContent: 'space-around'}}>

                                    </DashboardNarrowContainer>
                                </DashboardRowOne>   

                                <GoalsListContainer>
                                    History go here? :P
                                </GoalsListContainer>                                                             

                            </div>
                        )}

                        {/* 
                            HISTORY PAGE STUFF
                        
                        */}                        


                    </HomePageBody>

                    

                </HomePageContent>

            </HomePageContainer>
        </HomePageBackgroundContainer>
    )
}


const GoalCardContainer = ({ goal }) => {
    /*
        OK! Let's format these bad boys and girls and genderless components!

        -- goal.name, front-and-center(ed?)
        -- solo-or-group
        -- micro days indicator would be cool

        -- icon? ... eh, not yet
        -- maybe later on, 'include old/completed goals'
        -- or even 'include goals for THE FUUUUTURE' ... in the future
    */
    return (
        <GoalCard onClick={() => alert(`You booped ${goal.name}!`)}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box'}}>
                <img style={{width: '20%'}} src={goal.groupRule === 'solo' ? soloSVG : groupSVG} />
                <div style={{display: 'flex'}}>{goal.name}</div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{color: goal.weekDays.sun ? 'hsl(260,80%,30%)' : 'hsl(260,80%,75%)', margin: '0 0.2rem'}}>Su</div>
                    <div style={{color: goal.weekDays.mon ? 'hsl(260,80%,30%)' : 'hsl(260,80%,75%)', margin: '0 0.2rem'}}>Mo</div>
                    <div style={{color: goal.weekDays.tue ? 'hsl(260,80%,30%)' : 'hsl(260,80%,75%)', margin: '0 0.2rem'}}>Tu</div>
                    <div style={{color: goal.weekDays.wed ? 'hsl(260,80%,30%)' : 'hsl(260,80%,75%)', margin: '0 0.2rem'}}>We</div>
                    <div style={{color: goal.weekDays.thu ? 'hsl(260,80%,30%)' : 'hsl(260,80%,75%)', margin: '0 0.2rem'}}>Th</div>
                    <div style={{color: goal.weekDays.fri ? 'hsl(260,80%,30%)' : 'hsl(260,80%,75%)', margin: '0 0.2rem'}}>Fr</div>
                    <div style={{color: goal.weekDays.sat ? 'hsl(260,80%,30%)' : 'hsl(260,80%,75%)', margin: '0 0.2rem'}}>Sa</div>
                </div>
            </div>
            
            
        </GoalCard>
    )
}


const WeeklyBar = ({ state, dispatch }) => {
    const [thisWeek, setThisWeek] = useState([
        {name: 'SUN'},
        {name: 'MON'},
        {name: 'TUE'},
        {name: 'WED'},
        {name: 'THU'},
        {name: 'FRI'},
        {name: 'SAT'},
    ]);

    /*
        Let's see, let's add some context and usefulness to this bar.
        -- CURRENT AND PRIOR DAYS: at-a-glance x/y goals done, visual indicator of day done or not done
        -- UPCOMING DAYS: # of goals for that day projected
        ... all this should be initially loaded, and then can be changed when state.goals or state.history changes
        -- dependent on state.history[todaysKey].goals[goalID].complete = t/f

        ... this does sort of mean creating a pseudo-history for upcoming days of the current week

        This logic can be repackaged for the history page, creating bars upon bars!
    */

    useEffect(() => {
        let today = new Date();
        let dayIndex = today.getDay();
        let thisWeekCopyArr = [...thisWeek];

        // Neat! This works great. AND has the proper keyDate built in now, so we can easily reference the user's history obj.
        for (let i = 0; i <= 6; i++) {
            // populate thisWeek with DATE metadata
            let thisDay = new Date(today);
            // ppf = past/present/future ... ppf > 0 is a past day, ppf === 0 is today, ppf < 0 is an upcoming day
            let ppf = (dayIndex - i);
            
            thisDay.setDate(thisDay.getDate() - ppf);
            thisWeekCopyArr[i] = {...thisWeek[i], keyDate: calcDayKey(thisDay), ppf: ppf};
            setThisWeek(thisWeekCopyArr);
        }
    }, []);

    return (
        <>
        {thisWeek.map((day, index) => (
            <DailyProgressContainer key={day.name} past={day?.ppf > 0} present={day?.ppf === 0} future={day?.ppf < 0}>
                <DailyProgressDayLabel>{day.name}</DailyProgressDayLabel>
                <div></div>
            </DailyProgressContainer>
        ))}
        </>
    )
}


const FriendCard = ({ index, state, dispatch, friend }) => {
    const [friendLine, setFriendLine] = useState('');
    let friendSubtext = {
        'requestSent': `Awaiting Response`,
        'requestReceived': `Add Friend?`,
        'friended': `Friend`,
    };

    function handleFriendBoop() {
        // This card exists for all states of friends (searched potential friend, requestSent, requestReceived, friended)
        if (state?.friends[friend.username] === undefined) {
            dispatch({type: actions.SEND_DATA, payload: {requestType: 'request_friend', target: friend.username}});
        }
        if (state?.friends[friend.username]?.status === 'requestReceived') {
            dispatch({type: actions.SEND_DATA, payload: {requestType: 'accept_friend', target: friend.username}});
        }
        if (state?.friends[friend.username]?.status === 'friended') {
            dispatch({type: actions.SEND_DATA, payload: {requestType: 'remove_friend', target: friend.username}});
        }
    }

    useEffect(() => {
        if (!state?.friends[friend.username]) {
            return setFriendLine('Request Friend');
        }
        switch (state?.friends[friend.username]?.status) {
            case 'requestSent': {
                return setFriendLine('Friend Request Sent!');
            }
            case 'requestReceived': {
                return setFriendLine('Accept Friend');
            }
            case 'friended': {
                return setFriendLine('Remove Friend');
            }
            default: return;
        }
    }, [state.friends]);

    return (
        <FriendCardContainer>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%'}}>
                <img src={friend.icon} style={{width: '50px'}} />
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{fontSize: 'calc(0.7rem + 0.2vw)'}}>{friend.username}</div>
                    <div style={{fontSize: '0.7rem', color: 'hsl(260,0%,50%)'}}>{friendSubtext[state?.friends[friend.username]?.status] || 'Stranger Danger'}</div>
                </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '60%', justifyContent: 'flex-start', alignItems: 'center', marginTop: '20px'}}>
                <button style={{display: 'flex', width: '100%', height: '30px', justifyContent: 'center', alignItems: 'center', marginBottom: '10px'}}>Visit Profile</button>
                <button style={{display: 'flex', width: '100%', height: '30px', justifyContent: 'center', alignItems: 'center'}} onClick={handleFriendBoop}>{friendLine}</button>
            </div>
        </FriendCardContainer>
    )
}


export default HomePage;

/*

    https://dribbble.com/shots/9327883-Time-Tracking-Productivity-Monitoring-Tool ... nice looking, and makes me consider a sidebar (may not be enough going on to warrant)

    GOALBUSTERS

    Based on above image model,
    - rounded 'main screen' container that just has a bit of margin on the outsides
    - within that, left-side purple menu
        - DASHBOARD: today's stuff, overall goal progress for the week, little 'feed' on the right side, etc.
        - FRIENDS
        - MANAGE GOALS


    HOMEPAGE === DASHBOARD, essentially
    ... all the good bits should be here!

    This page should be redirected to by token login, as well, so this can be a first-landing or a resumed-landing
    ... this page should display the data for "TODAY" 


    ... your info clearly on display with quick link to settings/prefs page
    ... if no groups, FIND GROUPS! (or MAKE GROUP)
    ... if group(s), 'main' group data displayed prominently

    MY INFO (top of page) - name, nickname, icon, color
    TODAY (day/date)

*/