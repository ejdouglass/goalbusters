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
import { HomePageBackgroundContainer, HomePageContainer, HomePageSidebar, HomePageSidebarLogoContainer, HomePageSidebarItemContainer, HomePageContent, HomePageHeaderBar, HomePageTitle, HomePageIconContainer, MessageIcon, UserIcon, HomePageBody, DashboardDate, GoalsPageButtonContainer, GoalListPageButton, DashboardRowOne, DashboardRowTwo, DashboardRowThree, DashboardNarrowContainer, DashboardWideContainer, GoalsListContainer, GoalCard, SideBarIcon, GoalSearchInput, GoalInputContainer, GoalInputLabel, GoalButtonsContainer, GoalButton, GroupInfoInput, UserModal, UserModalButton, DailyProgressContainer, DailyProgressDayLabel, SideBarText, DashboardGoalButton, GroupInfoInputContainer, FriendCardContainer } from '../styled/styled';
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
        setGoalToBust(goal);
        console.log(JSON.stringify(goal))
        setSidebarSelection('bustGoal');
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
            weekDays: {sun: true, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true},
            privacyLevel: 0,
            activityName: '',
            dailyTargetUnits: 'minutes',
            dailyTargetNumber: 30,
            weeklyCompletionTarget: 1
        });
        return setSidebarSelection('goals');
        
    }

    useEffect(() => {
        if (state?.goals) {
            // This works well, but I think having a 'max' of a certain number and a 'page 2 page 3 page x' bar would make more sense at this point...
            // Then add a search bar and filters; search bar for goalName matches, filter for starred/solo/group/etc.

            
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
        let ticker = state?.history[calcDayKey()]?.goals.length;
        // for (const goalID in state.history[calcDayKey()]?.goals) {
        //     ticker++;
        //     if (ticker > 0) break;
        // }
        if (state.goals && !ticker) {
            console.log(`NO TODAY GOALS FOUND, attempting to populate`)
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
                    console.log(`Found a goal that belongs in TODAY'S LIST`)
                    todayHistory[goalID] = {
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
            // we're getting an empty object, so the below will never fire
            for (const goalID in todayHistory) {
                // if I'm not too muddled on this, it should be pushing each of "today"s goal objects into the array
                todayGoalArray.push(todayHistory[goalID]);
                console.log(`Today's goal array is now gaining the goal named ${todayHistory[goalID].name}`)
            }
            setTodaysGoals(todayGoalArray);

            // HERE: make new dispatch to update history, passing today's calcDateKey() to use and the todayHistory {} to append to that
            // we want to update history... if there's NO history at all, versus if there's no history for 'today' (either would get us here)
        }
        if (ticker) {
            let dateKey = calcDayKey();
            let todayGoalArray = [];
            for (const goalID in state.history[dateKey].goals) {
                todayGoalArray.push(state.history[dateKey].goals[goalID]);
            }
            setTodaysGoals(todayGoalArray);
        }
    }, [state.history, state.goals]);

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
        if (!friendSearch && !viewMyFriends) {
            let friendsArray = [];
            for (const username in state?.friends) {
                friendsArray.push(state.friends[username]);
            }
            setFriendsList(friendsArray);
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
        // Goals (list on their own page) seems to do alright, at any rate
        
        let friendsArray = [];
        for (const username in state?.friends) {
            friendsArray.push(state.friends[username]);
        }
        setFriendsList(friendsArray);
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
                        <SideBarIcon style={{display: 'flex'}} src={friendsSVG} width="25" height="25" viewed={sidebarSelection === 'friends'} />
                        <SideBarText>Friends</SideBarText>
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

                                <DashboardRowTwo>
                                    {/* List of goals
                                        ACROSS TOP: quick filter-by boops
                                        Column down: buttons that lead to detail (and delete) page, progress OR done/undone for day, group/solo icon, name
                                    */}
                                    <DashboardNarrowContainer style={{marginRight: 'calc(1rem + 1vw)', flexDirection: 'column', flex: 2, alignItems: 'center', overflow: 'scroll'}}>
                                        <DashboardDate style={{alignSelf: 'flex-start'}}>Goals for {dayNumberToWord(today.getDay()).slice(0,3).toUpperCase()} {today.getMonth() + 1}/{today.getDate()}/{`${today.getFullYear()}`.slice(2)}</DashboardDate>
                                        {todaysGoals.map((goal,index) => (
                                            <DashboardGoalButton key={index} onClick={() => bustGoal(goal)}>
                                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'calc(30px + 1vw)', height: 'calc(30px + 1vw)', backgroundColor: 'white', borderRadius: '1rem'}}>
                                                    <img src={goal.groupRule === 'solo' ? soloSVG : groupSVG} style={{width: 'calc(25px + 1vw)'}} />
                                                </div>
                                                
                                                {goal.name}
                                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'calc(30px + 1vw)', height: 'calc(30px + 1vw)', backgroundColor: goal.complete ? 'green' : 'yellow', borderRadius: '1rem'}}>
                                                    <img src={goal.complete ? completeSVG : pendingSVG} style={{width: 'calc(25px + 1vw)'}}/>
                                                </div>
                                            </DashboardGoalButton>
                                        ))}
                                        {todaysGoals.length === 0 && (
                                            <div>
                                                <p>You have no goals for today. Take a break!</p>
                                            </div>
                                        )}
                                    </DashboardNarrowContainer>

                                    {/* Notifications for today */}
                                    <DashboardWideContainer style={{flexDirection: 'column'}}>
                                        <DashboardDate>Today's Notifications</DashboardDate>
                                        {state?.history[calcDayKey()] ? (
                                            <>
                                            {/* Awesome! Now to create a separate 'timestamp' vs 'text' below to keep time-length from creating jagged formatting */}
                                            {state.history[calcDayKey()].events.map((historyItem, index) => (
                                                <div key={index} style={{marginBottom: '0.5rem'}}>{historyItem.timestamp}: {historyItem.agent === state?.username ? 'You' : historyItem.agent} {historyItem.action}</div>
                                            ))}
                                            </>
                                        ) : (
                                            <>
                                                <p>Nothing happened for today yet</p>
                                            </>
                                            
                                        )}
                                    </DashboardWideContainer>

                                </DashboardRowTwo>

                                <DashboardRowThree>
                                    {/* HERE: weeklong overview of days; go through their HISTORY (if applicable) to show day COMPLETE, INCOMPLETE, n/a (no goals), n/a-2 (not there yet)
                                        - Booping should hop us over to this week's HISTORYPAGE entry
                                    */}
                                    <DashboardWideContainer style={{justifyContent: 'center', alignItems: 'center'}}>
                                        {/* Looks good so far. How to make it responsive to THIS WEEK, though? */}
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
                            <div style={{width: '100%', height: 'auto', overflow: 'scroll', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <DashboardRowOne style={{justifyContent: 'space-around', height: '75px'}}>
                                    <DashboardNarrowContainer style={{justifyContent: 'space-around'}}>
                                        <div style={{display: 'flex'}}>

                                            {goalToBust?.name}
                                        </div>
                                    </DashboardNarrowContainer>
                                </DashboardRowOne>
                                
                                <GoalsListContainer>
                                    <div>You've done {goalToBust.dailyTargetUnitsDone} of the thing.</div>
                                    <div>Your target is to do {goalToBust.dailyTargetNumber} {goalToBust.dailyTargetUnits}!</div>
                                    <div>{goalToBust.dailyTargetUnitsDone > goalToBust.dailyTargetNumber ? 'All Done!' : 'Keep Going!'}</div>
                                    <GoalButton>UPDATE!</GoalButton>
                                </GoalsListContainer>
                                
                            </div>
                        )}

                        {/* 
                            BUSTGOAL PAGE
                            -- TOP: name of the goal to bust, done/undone, back
                            -- BOTTOM AREA: rules, inputs to update with, UPDATE! button
                                ... UPDATE! will slide on back to Dashboard proper... after sending off an update to backend, and back to client to update

                            

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
                                <DashboardRowOne style={{justifyContent: 'space-around', height: '75px'}}>
                                    <DashboardNarrowContainer style={{justifyContent: 'space-around'}}>
                                        <div style={{display: 'flex'}}>
                                            <GoalListPageButton onClick={() => setSidebarSelection('createGoal')}>Create New Goal!</GoalListPageButton>
                                            <GoalSearchInput style={{borderRadius: '1rem'}} type="input" value={goalSearch} onChange={e => setGoalSearch(e.target.value)} placeholder={`search goal names`}></GoalSearchInput>
                                        </div>
                                    </DashboardNarrowContainer>
                                </DashboardRowOne>
                                
                                <GoalsListContainer>
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

                                        {/* 
                                        Currently nixed due to just mashing all the whole screen around. Add back later.
                                        <GoalInputContainer>
                                            <GoalInputLabel>Goal Tags</GoalInputLabel>
                                            <GoalButton barButton leftSide>Physical</GoalButton>
                                            <GoalButton barButton>Mental</GoalButton>
                                            <GoalButton barButton>Personal</GoalButton>
                                            <GoalButton barButton>Interpersonal</GoalButton>
                                            <GoalButton barButton rightSide>Professional</GoalButton>
                                        </GoalInputContainer> 
                                        */}

                                    <GoalInputContainer>
                                        <GoalInputLabel>{newGoal.durationUnits === 'indefinite' ? `(no end date)` : `# of ${newGoal.durationUnits}`}</GoalInputLabel>
                                        <GoalButton style={{width: '5vw'}} barButton leftSide onClick={() => setNewGoal({...newGoal, durationNumber: newGoal.durationNumber > 1 ? newGoal.durationNumber - 1 : 1})}>-</GoalButton> 
                                        <GoalButton style={{width: '5vw'}} selected barButton>{newGoal.durationUnits === 'indefinite' ? '...' : newGoal.durationNumber}</GoalButton> 
                                        <GoalButton style={{width: '5vw'}} barButton rightSide onClick={() => setNewGoal({...newGoal, durationNumber: newGoal.durationNumber + 1})}>+</GoalButton>
                                    </GoalInputContainer>

                                    <GoalInputContainer style={{flexWrap: 'wrap'}}>
                                        <GoalInputLabel>weeks/month/etc.</GoalInputLabel>
                                        <GoalButton style={{width: '8vw'}} barButton leftSide selected={newGoal.durationUnits === 'weeks'} onClick={() => setNewGoal({...newGoal, durationUnits: 'weeks'})}>{newGoal.durationNumber === 1 ? 'week' : 'weeks'}</GoalButton> 
                                        <GoalButton style={{width: '8vw'}} barButton selected={newGoal.durationUnits === 'months'} onClick={() => setNewGoal({...newGoal, durationUnits: 'months'})}>{newGoal.durationNumber === 1 ? 'month' : 'months'}</GoalButton> 
                                        <GoalButton style={{width: '8vw'}} barButton rightSide selected={newGoal.durationUnits === 'indefinite'} onClick={() => setNewGoal({...newGoal, durationUnits: 'indefinite'})}>indefinite</GoalButton> 
                                    </GoalInputContainer>

                                    <GoalInputContainer>
                                        <GoalInputLabel>{Object.keys(newGoal.weekDays).filter(day => newGoal.weekDays[day]).length > 0 ? `${Object.keys(newGoal.weekDays).filter(day => newGoal.weekDays[day]).length} day(s) per week` : `Choose Which Days to Pursue this Goal!`}</GoalInputLabel>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.sun} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, sun: !newGoal.weekDays.sun}})} barButton leftSide>Su</GoalButton>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.mon} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, mon: !newGoal.weekDays.mon}})} barButton>Mon</GoalButton>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.tue} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, tue: !newGoal.weekDays.tue}})} barButton>Tue</GoalButton>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.wed} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, wed: !newGoal.weekDays.wed}})} barButton>Wed</GoalButton>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.thu} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, thu: !newGoal.weekDays.thu}})} barButton>Thu</GoalButton>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.fri} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, fri: !newGoal.weekDays.fri}})} barButton>Fri</GoalButton>
                                        <GoalButton style={{width: '6vw'}} selected={newGoal.weekDays.sat} onClick={() => setNewGoal({...newGoal, weekDays: {...newGoal.weekDays, sat: !newGoal.weekDays.sat}})} barButton rightSide>Sat</GoalButton>
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

                                <DashboardRowOne style={{justifyContent: 'space-around', height: 'auto'}}>
                                    <DashboardNarrowContainer style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignContent: 'center'}}>
                                        <div style={{display: 'flex', marginBottom: '1rem', marginRight: '3rem'}}>
                                            <GoalButton style={{width: 'calc(150px + 2vw)'}} barButton leftSide selected={viewMyFriends} onClick={() => setViewMyFriends(true)}>My Friends</GoalButton>
                                            <GoalButton style={{width: 'calc(150px + 2vw)'}} barButton rightSide selected={!viewMyFriends} onClick={() => setViewMyFriends(false)}>Search Friends</GoalButton>
                                        </div>
                                        <div style={{position: 'relative'}}>
                                            <GroupInfoInput style={{width: '300px', height: '36px'}} value={friendSearch} onChange={e => handleFriendSearch(e.target.value)} placeholder={viewMyFriends ? `search my friends` : 'search for friends'}></GroupInfoInput>    
                                        </div>
                                    </DashboardNarrowContainer>
                                </DashboardRowOne>   

                                <GoalsListContainer>
                                    {friendsList.length > 0 ? (friendsList.map((friend, index) => (
                                        <FriendCard key={friend.username} index={index} state={state} dispatch={dispatch} friend={friend}></FriendCard>
                                    ))) : (
                                        <><div>Bloop</div></>
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
    // edit GoalsListContainer to support dynamic size restructuring!
    return (
        <GoalCard onClick={() => alert(`You booped ${goal.name}!`)}>
            {goal.name}
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
        OK! Time to have "this week" show up.

        Can refactor the below to be a MAP of the weekly array generated above.

        STEP 1 - figure out what day of the week 'today' is
    
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
        {/* <DailyProgressContainer><DailyProgressDayLabel>SUN</DailyProgressDayLabel></DailyProgressContainer>
        <DailyProgressContainer><DailyProgressDayLabel>MON</DailyProgressDayLabel></DailyProgressContainer>
        <DailyProgressContainer><DailyProgressDayLabel>TUE</DailyProgressDayLabel></DailyProgressContainer>
        <DailyProgressContainer><DailyProgressDayLabel>WED</DailyProgressDayLabel></DailyProgressContainer>
        <DailyProgressContainer><DailyProgressDayLabel>THU</DailyProgressDayLabel></DailyProgressContainer>
        <DailyProgressContainer><DailyProgressDayLabel>FRI</DailyProgressDayLabel></DailyProgressContainer>
        <DailyProgressContainer><DailyProgressDayLabel>SAT</DailyProgressDayLabel></DailyProgressContainer> */}
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
            // friend isn't found at all; assuming no request received or sent, so we're sending a request
            dispatch({type: actions.SEND_DATA, payload: {requestType: 'request_friend', target: friend.username}});
        }
        if (state?.friends[friend.username]?.status === 'requestReceived') {
            // alert(`Oh, you want to add this friend! Adorable!`)
            dispatch({type: actions.SEND_DATA, payload: {requestType: 'accept_friend', target: friend.username}});
        }
        if (state?.friends[friend.username]?.status === 'friended') {
            // alert(`Oh, you want to add this friend! Adorable!`)
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

    // ADD: icon for friends, icon for friend requested, icon for friend request received, etc.
    return (
        <FriendCardContainer>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%'}}>
                <img src={friend.icon} style={{width: '50px'}} />
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div>{friend.username}</div>
                    <div>{friendSubtext[state?.friends[friend.username]?.status] || 'Stranger Danger'}</div>
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