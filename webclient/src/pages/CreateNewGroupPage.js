import React, { useState } from 'react';
import { SinglePageContainer, GroupInfoCard, GroupInfoInputContainer, GroupInfoLabel, GroupInfoInput } from '../styled/styled';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Can add nuance, like 'joining' or 'observing' restrictions
const privacyLevelDescriptions = [
    `The group appears in public searches.`,
    `The group doesn't appear in public searches and is only visible to members. Invite-only.`,
]


const CreateNewGroupPage = () => {
    const [groupDetails, setGroupDetails] = useState({
        groupName: '',
        groupDescription: '',
        groupAesthetic: {logo: '', colorScheme: ''},
        groupTags: {fitness: false, productivity: false, newHabit: false},
        startDate: new Date(),
        duration: {number: 1, units: 'weeks'},
        privacyLevel: 0,
        goalRules: {
            assessmentTimeline: 'weekly',
            dailyGoalType: 'time',
            dailyGoalUnit: 'minutes',
            dailyGoalActivity: 'exercise',
            dailyGoalTarget: 30,
            weeklyGoalTarget: 5,
            
        }
    });

    return (
        <SinglePageContainer>
            (Creating a New Goalbusters Gang!)
            <GroupInfoCard>

                <GroupInfoInputContainer>
                    <GroupInfoLabel>Your Gang's Name</GroupInfoLabel>
                    <GroupInfoInput type='text' autoFocus={true}></GroupInfoInput>
                </GroupInfoInputContainer>

                <GroupInfoInputContainer>
                    <GroupInfoLabel>Description of {groupDetails.groupName ? groupDetails.groupName : `Your Gang`}'s Goal</GroupInfoLabel>
                    <GroupInfoInput type='text'></GroupInfoInput>
                </GroupInfoInputContainer>

                <GroupInfoInputContainer row>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <GroupInfoLabel>Start Date</GroupInfoLabel>
                        <DatePicker selected={groupDetails.startDate} onChange={date => setGroupDetails({...groupDetails, startDate: date})} />
                    </div>


                    <div style={{display: 'flex', flexDirection: 'column', width: '80%', backgroundColor: '#0AF'}}>
                        <GroupInfoLabel>Duration</GroupInfoLabel>
                        <div style={{display: 'flex', }}>
                            <button onClick={() => setGroupDetails({...groupDetails, duration: {...groupDetails.duration, number: groupDetails.duration.number > 1 ? groupDetails.duration.number - 1 : groupDetails.duration.number}})}> - </button>
                            <div style={{margin: '0 1rem'}}>{groupDetails.duration.number}</div>
                            <button onClick={() => setGroupDetails({...groupDetails, duration: {...groupDetails.duration, number: groupDetails.duration.number + 1}})}> + </button>
                            
                            <div style={{margin: '0 1rem', display: 'flex', flexDirection: 'row'}}>
                                <button>weeks</button>
                                <button style={{marginLeft: '1rem'}}>months</button>
                            </div>
                        </div>
                    </div>

                </GroupInfoInputContainer>
                
                <GroupInfoInputContainer>
                    <GroupInfoLabel>Group Privacy</GroupInfoLabel>
                    <div style={{display: 'flex', height: '50px'}}>
                        <button style={{width: '100px'}} onClick={() => setGroupDetails({...groupDetails, privacyLevel: 0})}>Public</button>
                        <button style={{width: '100px'}} onClick={() => setGroupDetails({...groupDetails, privacyLevel: 1})}>Private</button>
                    </div>
                    <div>{privacyLevelDescriptions[groupDetails.privacyLevel]}</div>
                </GroupInfoInputContainer>

                <GroupInfoInputContainer>
                    <GroupInfoLabel>The Daily Goal For the Gang Is</GroupInfoLabel>
                    <div>GOOOOAL</div>
                    
                    <GroupInfoLabel>Days At Play Include</GroupInfoLabel>
                    <div>(here: every day of the week, with quick-click buttons for "work week", "full week", etc.)</div>

                    <p>We wanna meet this goal [X] times weekly!</p>

                    <GroupInfoLabel>The Goal Activity Name</GroupInfoLabel>
                    <div>exercise, or whatever else</div>

                    <GroupInfoLabel>The Goal Measured In</GroupInfoLabel>
                    <div>minutes/times done/(in)completeness</div>

                    <p>(Conditional to Above): daily goal of how much time (hh:mm), how many times (in/complete is automatically sorted :P)</p>

                </GroupInfoInputContainer>

            </GroupInfoCard>

        </SinglePageContainer>
    );
}

export default CreateNewGroupPage;

/*

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