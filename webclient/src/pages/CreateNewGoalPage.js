import React, { useState, useContext } from 'react';
import { actions, Context } from '../context/context';
import { useHistory } from 'react-router-dom';
import { SinglePageContainer, GroupInfoCard, GroupInfoInputContainer, GroupInfoLabel, GroupInfoInput, GoalPageButton } from '../styled/styled';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Can add nuance, like 'joining' or 'observing' restrictions
// Ah! This is now a personal goal thing; 'do it with me' can be figured out shortly, but that does change the 'privacy' concept a little
/*

    PUBLIC: Your goal appears in public searches.
    PRIVATE: For your eyes only!

*/
const privacyLevelDescriptions = [
    `Your goal appears publicly on your personal page, so anyone who can search you can also come take a peek at this goal and how you're doing.`,
    `This goal doesn't appear in public searches and is only visible to yourself (and any other participants). Only those invited to participate can see it.`,
]

/*

    Hm. Add 'goalGroupRule' variable or something to potentially open it up?
    -- in this case, redefining the Model for Group into Goal makes sense to me... and each Goal can be amended to be group-y or not
    -- hm, that makes the case to add 'friends' that can make a 'cutoff' for participation
    -- if 'solo' or undefined, no group

    GROUPRULE - solo, open, open-friends, invite-only

*/


const CreateNewGoalPage = () => {
    const [state, dispatch] = useContext(Context);
    const [groupDetails, setGroupDetails] = useState({
        goalName: '',
        goalDescription: '',
        goalGroupRule: 'solo',
        goalAesthetic: {logo: '', colorScheme: ''},
        goalTags: {fitness: false, productivity: false, newHabit: false},
        startDate: new Date(),
        duration: {number: 1, units: 'weeks'},
        weekDays: {sun: false, mon: false, tue: false, wed: false, thu: false, fri: false, sat: false},
        privacyLevel: 0,
        goalActivityName: '',
        dailyGoalType: 'time',
        dailyGoalUnit: 'minutes',
        dailyGoalTarget: 30,
        weeklyGoalTarget: 1
    });
    const history = useHistory();

    function createNewGoal() {
        // Hm, dispatch a package for server and navigate away when we receive a response?

        // THIS: check for missing fields, alert the user accordingly, or if all's well wrap up a package for the server to parse and await a response at the KEYBOARD level
        if (!groupDetails.goalName) return dispatch({type: actions.ADD_ALERT, payload: {type: 'error', message: `Please enter a name for this Goal Project.`, id: Math.random().toString(36).replace('0.', '')}});
        let anyPositiveDay = false;
        for (const day in groupDetails.weekDays) {
            if (groupDetails.weekDays[day]) {
                anyPositiveDay = true;
                break;
            }
        }
        if (!anyPositiveDay) return dispatch({type: actions.ADD_ALERT, payload: {type: 'error', message: `Please select at least one day a week to pursue this goal.`, id: Math.random().toString(36).replace('0.', '')}});
        if (!groupDetails.goalActivityName) return dispatch({type: actions.ADD_ALERT, payload: {type: 'error', message: `Please indicate the name of the goal activity (e.g. "exercise").`, id: Math.random().toString(36).replace('0.', '')}});

        return dispatch({type: actions.SEND_DATA, payload: {...groupDetails, requestType: 'create_goal'}});
    }

    return (
        <SinglePageContainer>
            (Creating a New Goal to BUST!)
            <GroupInfoCard>

                <GroupInfoInputContainer>
                    <GroupInfoLabel>Name this Goal Project!</GroupInfoLabel>
                    <GroupInfoInput type='text' autoFocus={true} placeholder={`(Fit for Summer, Study E'erday, etc.)`} value={groupDetails.goalName} onChange={e => setGroupDetails({...groupDetails, goalName: e.target.value})}></GroupInfoInput>
                </GroupInfoInputContainer>

                <GroupInfoInputContainer>
                    <GroupInfoLabel>What's the goal activity called?</GroupInfoLabel>
                    <GroupInfoInput type='text' value={groupDetails.goalActivityName} placeholder={'exercise, study, dance'} onChange={e => setGroupDetails({...groupDetails, goalActivityName: e.target.value})}></GroupInfoInput>
                </GroupInfoInputContainer> 

                <GroupInfoInputContainer>
                    <GroupInfoLabel>When are you starting?</GroupInfoLabel>
                    <DatePicker selected={groupDetails.startDate} onChange={date => setGroupDetails({...groupDetails, startDate: date})} />
                </GroupInfoInputContainer>

                <GroupInfoInputContainer>
                    <GroupInfoLabel>Describe your goal (optional)</GroupInfoLabel>
                    <GroupInfoInput type='text' ></GroupInfoInput>
                </GroupInfoInputContainer>   

                <GroupInfoInputContainer style={{width: '80%'}}>
                    <GroupInfoLabel>Who's pursuing this goal with you?</GroupInfoLabel>
                    <div style={{display: 'flex', flexDirection: 'row', minHeight: '60px', width: '100%', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', flexWrap: 'wrap'}}>
                        <GoalPageButton style={{width: '20%'}} selected={groupDetails.goalGroupRule === 'solo'} onClick={() => setGroupDetails({...groupDetails, goalGroupRule: 'solo'})}>Nobody - I'm Flying Solo!</GoalPageButton>
                        <GoalPageButton style={{width: '20%'}} selected={groupDetails.goalGroupRule === 'open'} onClick={() => setGroupDetails({...groupDetails, goalGroupRule: 'open'})}>Anyone Who Wants To!</GoalPageButton>
                        <GoalPageButton style={{width: '20%'}} selected={groupDetails.goalGroupRule === 'friends'} onClick={() => setGroupDetails({...groupDetails, goalGroupRule: 'friends'})}>Any Friend Who Wants To!</GoalPageButton>                        
                        <GoalPageButton style={{width: '20%'}} selected={groupDetails.goalGroupRule === 'invite_only'} onClick={() => setGroupDetails({...groupDetails, goalGroupRule: 'invite_only'})}>Anyone I Invite!</GoalPageButton>                        
                    </div>
                </GroupInfoInputContainer>    

                <GroupInfoInputContainer>
                    <GroupInfoLabel>Who else can see this goal?</GroupInfoLabel>
                    <div style={{display: 'flex', height: '50px'}}>
                        <GoalPageButton style={{width: '100px'}} selected={groupDetails.privacyLevel === 0} onClick={() => setGroupDetails({...groupDetails, privacyLevel: 0})}>Anyone</GoalPageButton>
                        <GoalPageButton style={{width: '100px'}} selected={groupDetails.privacyLevel === 1} onClick={() => setGroupDetails({...groupDetails, privacyLevel: 1})}>Participant(s) Only</GoalPageButton>
                    </div>
                    <div>{privacyLevelDescriptions[groupDetails.privacyLevel]}</div>
                </GroupInfoInputContainer>                

                <GroupInfoInputContainer row style={{width: '100%'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>

                    </div>


                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <GroupInfoLabel>How long will you pursue this goal?</GroupInfoLabel>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <GoalPageButton static onClick={() => setGroupDetails({...groupDetails, duration: {...groupDetails.duration, number: groupDetails.duration.number > 1 ? groupDetails.duration.number - 1 : groupDetails.duration.number}})}> - </GoalPageButton>
                            <div style={{margin: '0 1rem'}}>{groupDetails.duration.units === 'infinite' ? '...' : groupDetails.duration.number}</div>
                            <GoalPageButton static onClick={() => setGroupDetails({...groupDetails, duration: {...groupDetails.duration, number: groupDetails.duration.number + 1}})}> + </GoalPageButton>
                            
                            <div style={{margin: '0 1rem', display: 'flex', flexDirection: 'row'}}>
                                <GoalPageButton onClick={() => setGroupDetails({...groupDetails, duration: {...groupDetails.duration, units: 'weeks'}})} selected={groupDetails.duration.units === 'weeks'}>weeks</GoalPageButton>
                                <GoalPageButton onClick={() => setGroupDetails({...groupDetails, duration: {...groupDetails.duration, units: 'months'}})} selected={groupDetails.duration.units === 'months'} style={{marginLeft: '1rem'}}>months</GoalPageButton>
                                <GoalPageButton onClick={() => setGroupDetails({...groupDetails, duration: {...groupDetails.duration, units: 'infinite'}})} selected={groupDetails.duration.units === 'infinite'} style={{marginLeft: '1rem'}}>indefinitely</GoalPageButton>
                            </div>
                        </div>
                    </div>

                </GroupInfoInputContainer>

                <GroupInfoInputContainer>
                    <GroupInfoLabel>Every week, I aim to achieve this goal on:</GroupInfoLabel>
                    <div style={{display: 'flex'}}>
                        <GoalPageButton selected={groupDetails.weekDays.sun === true} onClick={() => setGroupDetails({...groupDetails, weekDays: {...groupDetails.weekDays, sun: !groupDetails.weekDays.sun}})}>Sun</GoalPageButton>
                        <GoalPageButton selected={groupDetails.weekDays.mon === true} onClick={() => setGroupDetails({...groupDetails, weekDays: {...groupDetails.weekDays, mon: !groupDetails.weekDays.mon}})}>Mon</GoalPageButton>
                        <GoalPageButton selected={groupDetails.weekDays.tue === true} onClick={() => setGroupDetails({...groupDetails, weekDays: {...groupDetails.weekDays, tue: !groupDetails.weekDays.tue}})}>Tue</GoalPageButton>
                        <GoalPageButton selected={groupDetails.weekDays.wed === true} onClick={() => setGroupDetails({...groupDetails, weekDays: {...groupDetails.weekDays, wed: !groupDetails.weekDays.wed}})}>Wed</GoalPageButton>
                        <GoalPageButton selected={groupDetails.weekDays.thu === true} onClick={() => setGroupDetails({...groupDetails, weekDays: {...groupDetails.weekDays, thu: !groupDetails.weekDays.thu}})}>Thu</GoalPageButton>
                        <GoalPageButton selected={groupDetails.weekDays.fri === true} onClick={() => setGroupDetails({...groupDetails, weekDays: {...groupDetails.weekDays, fri: !groupDetails.weekDays.fri}})}>Fri</GoalPageButton>
                        <GoalPageButton selected={groupDetails.weekDays.sat === true} onClick={() => setGroupDetails({...groupDetails, weekDays: {...groupDetails.weekDays, sat: !groupDetails.weekDays.sat}})}>Sat</GoalPageButton>
                    </div>
                </GroupInfoInputContainer>                
                



                {/* <GroupInfoInputContainer>
                    <GroupInfoLabel>I consider a week successful when meeting the goal </GroupInfoLabel>
                    <div style={{display: 'flex', flexDirection: 'row', width: '35%', justifyContent: 'space-around', alignItems: 'center'}}>
                        <GoalPageButton onClick={() => setGroupDetails({...groupDetails, weeklyGoalTarget: groupDetails.weeklyGoalTarget >= 2 ? groupDetails.weeklyGoalTarget - 1 : groupDetails.weeklyGoalTarget})}>-</GoalPageButton>
                        <div>{groupDetails.weeklyGoalTarget}</div>
                        <GoalPageButton onClick={() => setGroupDetails({...groupDetails, weeklyGoalTarget: groupDetails.weeklyGoalTarget + 1})}>+</GoalPageButton>
                        <div>day(s) per week </div>
                    </div>
                </GroupInfoInputContainer>  */}

 


                <GroupInfoInputContainer>
                    <GroupInfoLabel>Goal is measured in</GroupInfoLabel>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <GoalPageButton selected={groupDetails.dailyGoalType === 'time'} onClick={() => setGroupDetails({...groupDetails, dailyGoalType: 'time'})}>total daily time</GoalPageButton>
                        <GoalPageButton selected={groupDetails.dailyGoalType === 'reps'} onClick={() => setGroupDetails({...groupDetails, dailyGoalType: 'reps'})}>total times done daily</GoalPageButton>
                        <GoalPageButton selected={groupDetails.dailyGoalType === 'doneness'} onClick={() => setGroupDetails({...groupDetails, dailyGoalType: 'doneness'})}>complete/incomplete for day</GoalPageButton>
                    </div>
                </GroupInfoInputContainer>

                
                <GroupInfoInputContainer>
                    <GroupInfoLabel>And you're done for the day {groupDetails.dailyGoalType === 'doneness' ? '' : ` at `}</GroupInfoLabel>
                    {groupDetails.dailyGoalType === 'time' &&
                    <>
                        <GroupInfoInput type='number' placeholder={0}></GroupInfoInput> hours 
                        <GroupInfoInput type='number'></GroupInfoInput> minutes
                    </>
                    }
                    {groupDetails.dailyGoalType === 'reps' &&
                    <>
                        <GroupInfoInput type='number'></GroupInfoInput> times completed
                    </>
                    }       
                    {groupDetails.dailyGoalType === 'doneness' &&
                    <>
                        <p>when marked complete!</p>
                    </>
                    }                  
                </GroupInfoInputContainer>

                <GroupInfoInputContainer>
                    <GoalPageButton static onClick={createNewGoal}>Boop, All Done</GoalPageButton>
                </GroupInfoInputContainer>

                



            </GroupInfoCard>

        </SinglePageContainer>
    );
}

export default CreateNewGoalPage;

/*

    NEW CONCEPT: -either- set particular days OR set goal number of days per week

    NEWEST CONCEPT: fit the 'createnewgoal' within the dashboard/home framework (less jarring)


    CONDITIONAL RENDERING 'SUB-PAGES'
    : The first page should be everything 'required' to launch a new goal
    : Other pages for settings/etc.
        > goalTag: physical development, mental development, personal development, interpersonal development, professional development, ???
    -- PAGE 1 - Start Date, Length of Goal, Target Days, Weekly Days Target, Solo-ness, Privacy

    Hm, there's a lot going on with this page. Consider breaking down into smaller bits: "Step 1" "Step 2" etc. with checkmarks when done
    -- Name of Goal/Project Always on Top (with description?)
    -- Step 1 - Start Date, Length of Goal, Weekly Days (with shortcut boopables like MWF, workweek, etc.), Days Per Week Minimum
    -- Step __ - Solo-ness, Privacy of Goal, 
    -- Step __ - goal activity name, how measure, daily target




    Also new concept: doing the fancy dashboard (https://dribbble.com/shots/9327883-Time-Tracking-Productivity-Monitoring-Tool)
        -- that's not 'new' for today, but maybe having a list of all/your most recent/your 'expected' goals for the given day going down with info horizontal would be A+
        -- have a 'favorited' one that pops up top with 'just enough' info to quick-input would be great

    NEW CONCEPT - just making a goal, and if it's solo only, cool. And if it's meant to be a group project, neato! But it's all the same process.

    GROUP DATA MODEL (from the acutual model)

    OK! Let's model out the "reason" for this app (the 4-week 5/7 days workout group Su - Sa concept) and backsolve for other scenarios.
    ... I'm envisioning each GROUP being a specific goal-centric group only, not just a general hangout, and it 'disbands' in some fashion after its runtime?

    In Goalin' Girls' specific case, I'd like to have a gridlike display of the current Su - Sa week in play:
    - Days that haven't occurred yet are grayed out
    - Current day is brightly highlighted
    - Previous days kind of mid-saturation-luminance chilling there
    - Participants going down the left side, days across the top
    - Little red X circle for missed days, green check circle for checked off days, neutral ellipses circle for current day in progress if not checked off yet


    Variables/rules:
    - CREATION DATE
    - START DATE
    - END DATE (if applicable)
    - PARTICIPANTS
        - {userNameX: {permissionsLevel: 0, ___}}
        - permissionsLevels: 0 = exist, 1 = edit own data, 2 = edit all groupInfo data, 3 = startDate, endDate, goal rules, creator/destroyer
    - OBSERVERS : 'audience' and supporters
    - GROUP PIC : just a pic to set the tone for the group, can just be a url if we don't want to bother with accepting image uploads :P
        - if url, look into ways to modify the IMG to be a 'proper' size for our format
    - GROUP NAME
    - GROUP DESCRIPTION
    - GOALHISTORY : Object with normalized Date string keys, containing group contributions toward goal(s)
        - goalHistory should ONLY populate beginning on startDate
        - goalHistory for each { DATESTRING: {activityLog: [], } }
    - CHATLOG : Array of objects, live feed with socket
        - chatLog: [ {userName: ABC, message: XYZ, timestamp: X/X/XXXX} ]
    - PRIVACYLEVEL: How 'visible' the group is to unaffiliated users
    - GOAL RULES : The 'scoring' metrics
        - how do we determine if checkmark goes to a person on a given day? ... 
        - daily goals, weekly goals, monthly goals? (if weekly, should probably define the 'start day' of each week, which will automatically define the 'end day')
        - what the 'activity' is, what its 'parts' are, and if it's numeric instead of boolean, what the minimum 'clear' req is
    
    ... another way is to set up a goal as "on THESE days the goal is doable" with "every full week I want to do it 3 times" or "5 times" or whatever?
    

*/