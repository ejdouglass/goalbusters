import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Store } from './context/context';
import WelcomePage from './pages/WelcomePage';
import CreateNewAccountPage from './pages/CreateNewAccountPage';
import CreateNewGroupPage from './pages/CreateNewGroupPage';
import CreateNewGoalPage from './pages/CreateNewGoalPage';
import FindAGroupPage from './pages/FindAGroupPage';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import Keyboard from './components/Keyboard';
import Alert from './components/Alert';

const App = () => {
  return (
    <Store>
      <Router>
        <Keyboard />
        <Alert />
        <Route exact path='/' component={WelcomePage} />
        <Route exact path='/create_account' component={CreateNewAccountPage} />
        <Route exact path='/dashboard' component={HomePage} />
        <Route exact path='/find_group' component={FindAGroupPage} />
        <Route exact path='/create_group' component={CreateNewGroupPage} />
        <Route exact path='/create_goal' component={CreateNewGoalPage} />
        <Route exact path='/settings' component={SettingsPage} />
      </Router>
    </Store>
  )
}

export default App;

/*


  FRESH THOUGHT FINISHERS
  ... the adjustments are good and all, but let's de-emphasize aesthetic twiddling and up-emphasize core functionality
  [x] GOALS ON BACKEND HAVING THEIR OWN HISTORY - this will allow detailed viewing of goals for GeneralHistory

  ::: VIEW (not edit) GOALS (evolving goals is a separate, maybe-later concern)... HOWEVER! Removing participants/banning participants as admin of a goal might be fine.

  ::: GOAL SEARCH - 'detaching' goals from a given user, GROUP GOALS can become super universal, but need to be searchable in this case
    > maybe a GROUP GOAL creation can be a bit more editable and making one pops you on the edit-details page instead vs a solo project (searchable tags, etc.)
    > so SOLO goals are personal and viewable by friends on your profile maybe, and GROUP goals can be independently searched
  ::: HISTORY PAGE - be able to populate any given day when heading to the page to see details for that day as well as for the week (and maybe lifespan for specific goals)
    > need to separate GeneralHistory and (Specific)GoalHistory?
    > can springboard off of the "weekly bar" on the bottom of Dashboard
  ::: VIEW OTHER PERSON'S PROFILE - decide briefly on what should be 'visible' (based on privacy)
    > 'back' button in this case should
  ::: SETTINGS/PREFERENCES - privacy default, icon selection, delete account
    > privacy global for this (split for friends vs non-friends vs whatever is too nuanced for a simple project)
  -- do these six, and your core content is complete! (after that, just wiggle the mobile and aesthetic stuff to satisfaction, and fix any bugs/issues)



  DASHBOARD
  -- Add filters for goal area (complete, incomplete, both; solo, group, all)
  -- Update Sun - Sat readout at bottom to be meaningful
    > X / Y goals achieved for previous/current day (and appropriate decoration)
    > Y goals for upcoming days
    > OOH, so x/y for SOLO goals, and x/y for GROUP goals, and then some other indicator for x/y OTHER users accomplishing that goal that day
    > booping any given day should probably go to History for that day
  
  -- Goals List: indicate when it's time to scroll down

  -- Goals & Notifications: 'pin' the top line/header by making it separate, and put the rest in a scrollable div

  -- Additional styling for goals when they're done vs undone (checkmark is kinda ugly, and can add color/etc. to the button itself to de-emphasize it a bit)
    > consider sorting completed goals to the bottom?
  
  -- Today's Notifications should auto-scroll to the bottom, and maybe have a staggering background color to easily scan/read
    > consider a two-part box with timestamp on left side and visually separated from text on the right

  -- BGTAB: multiple users, multiple notes? ... it'd be cool to see the notes of friends as they go, as per the original intent of the project :P

  -- BGTAB+: add the Notes to the notifications (well, the latest note)

  -- BGTAB: backend - ensure that the GOALS THEMSELVES are updated as well, and that all participants are pinged for GROUP goals
  
  -- Group Goals: see how EVERYONE is doing? how/where/when
    > probably will require viewing the Goal itself?
    > shorthand visible somewhere for how many folks completed the goal that day would be ideal   
  ..
  [x] Goals List: add x / y goals done for today  
  [x] Update goal list buttons to be more visually useful: narrower, taller, ICONS: [group v solo] [ daily/weekend/week/MWF/TuTh ] [ in/complete ]
  [x] Pretty up the notifications a bit
  [x] Touch up the usermodal
  [x] Fix bug where creating new goal and then going to dashboard shows nothing until Ctrl+R
  [x] BGTAB: update GOAL.NOTES to be more than tiny
  [x] BGTAB & more: change goal-updating so that NOTIFICATIONS include GOAL.NAME (decided against goal notes, for now)
  [x] BGTAB: add a "Back" button in case no changes need to be made
  [x] BGTAB: maybe wrap that all in a form so 'Enter' @ notes or generally will submit it
  [x] "you have no goals for today" should probably read "you don't have ANY goals yet" in that particular case :P


  FRIENDS PAGE
  -- 'Visit Profile' should... probably DO something (see THEIR history?)
  ~~ add "CANCEL FRIEND REQUEST"
  ..
  [x] when 'search new buddies' is active, NO RESULTS should show when backspacing back to empty bar
  [x] when 'search my buddies' is active, ALL RESULTS should show when backspacing back to empty bar  
  [x] list friends with their username + icon (flex-wrap buttons) ... big enough to have action-buttons on 'em to request
  [x] "My Friends" button vs "Search Friends" button
  [x] just searches by username; click to "request friend"
  [x] put all pending-style friend stuff in 'My Friends'
  [x] implement adding friends, removing friends, etc.
  [x] rejigger friend card to make it clear who's a friend, who's a requestReceived, who's a requestSent, etc.
  [x] add lil' color-badge for number of outstanding friend requests
  [x] fix so that 'request friend' button doesn't reset to... empty/'my friends' but not?
  [x] style descriptive text, add minimum box height
  [x] better distinguish which button is 'selected' on the top, maybe separate the two buttons altogether
  [x] add FRIEND REQUEST to events/notifications, in addition to badging above
  [x] make sure to REMOVE searching yourself :P

  GOAL PAGE
  -- Have booping goal cards lead to VIEW/EDIT
    > goal.participants[usernameX] = {joinTime: ..., privilegeLevel: 'admin'}
  -- Add a "goal summary" on the top for at-a-glance goodness; scoot project name down into the 'set stuff up' sxn
  -- Change "CreateGoal" on the top to be... spacious :P ... same with ViewGoal
  ~~ Consider visually highlighting the 'stuff you need to select' and have them be 'happy color' when done
  ..
  [x] New idea: slap separate buttons on the bottom for "All" "Reset to 0" "MWF" "TuTh" "Weekends" shortcut buttons  
  [x] Add formatting to GOAL CARDS themselves
  [x] Make goal listing less... jumpy-aroundy (centered is probably not the way to go)
  [x] Fix goal search (again :P)
  ~~ figure out how to format DatePicker (it doesn't fit the aesthetic :P)

  HISTORY PAGE
  OVERVIEW: basically a combo of the Dashboard bar (x/y goals per day, but harsher on missed days maybe), with that day's notifications listed
  ..
  -- should use User.history object to be able to go back in time and see overview of each day's activity (basically same as Dashboard for that day-of)
  -- limited editing should be possible (i.e. changing data from previous days/weeks, adding stuff from the past -- maybe in future versions only)
  -- use DatePicker, but center it on a Date() variable that is mutable with other inputs so we can do "jump to Day 1" or whatever
  ..

  NOTIFICATIONS
  [x] Eh, each day has its own notifications -- not gonna fuss around with "these ones are NEW"
  -- Quick fix: notifications start with MOST RECENT on the top! (can add filter later to flip it)

  SETTINGS PAGE
  -- rename to 'preferences'?
  -- format, probably just scoot it into the main body of the SPA (remove separate settings page concept)
  -- add icon choosing
  -- add delete account

  ALERTS
  -- make pretty/more consistent with app aesthetic
  ..
  [x] hitting "X" takes a sec to dismiss... fix to immediate
  [x] maybe change that 'progress bar' that drains at the bottom to be... not there :P

  WELCOME PAGE
  -- oof. make less ugly, more consistent with the rest of the app
  [x] wrap in a form for 'enter' --> log in

  NEW ACCOUNT PAGE
  -- likewise, make a little more consistent with app aesthetic
  [x] wrap in a form for 'enter' --> create

  General improvements, bugs to squash
  [x] Add allUsers update to saveUser fxn (and make sure saveUser fxn is being used whenever anything relevant happens to user's data)
  -- oddly, if the app is open 'overnight,' a refresh shows empty data, and a SECOND refresh will show all the proper goals/etc.
    > it will show the correct day at the top, but the previous goals stuff; one refresh clears it all out; two refreshes populates the proper info
  -- little 'flicker' in some cases
    > switching from 'search buddies' to 'view buddies'
  -- the USER is updated when a goal is udpated; now make sure the GOAL is updated, as well!
  -- Friend --> BUDDY :P
  -- Mobile-friendliness: @media everything necessary to column-ize @ sub... 520px, at a guess?
  -- make goals delete-able from somewhere (goal overview/edit page makes most sense)
  -- handle the ending of a goal somehow
  -- refreshing after a day has passed has some weird effects (multiple refreshes to 'fix' it, still have notifications being wonky)








  PATH TO FULL basic FUNCTIONALITY:
  - 1H: Add User Search and related fxn'ty (view basics, request friend)
    > top bar: "My Friends" and search friends, "Find Friends" and search friends; bottom area: scroll through page(s) of friend(s)
    > "Find Friends" search should enable search by username, interests

  - User creation update: add interests, add privacy

  - Add Goal Search and related fxn'ty (Follow/Watch, Request to Participate (if security is set up that way) OR Participate, "Cheer" perhaps)

  - ManageGoalPage: create, use to 'invite' and edit settings post-creation (use User Search and/or Friend Search to send out invites, etc.)

  - Update User model and data (and related socket(s)) to support receiving requests (friend, goal participation)

  - Implement Settings (privacy, user-centric stuff like Icon details mostly)

  - Dashboard logic: figure out what 'today' is, check list of active goals for those that are applicable for that day
    -- additionally, even if it's not "this day," the week's progress
    -- also-also, an at-a-glance overview of all goals that you've been pursuing

  - Grab some icons and integrate with just about everything
    > https://www.flaticon.com/packs/mentoring-and-training-2
    > (other sources go here)


  CONSIDER:
  - How to best "alert" users when something new has happened/what new stuff has happened since they last logged off? How necessary is this kind of detailing?


  DONE: 
  [x] Finish creation base
  [x] Set up Mongo for this app
  [x] Connect to backend, check that it creates accounts properly  
  [x] Make sure login fxn'ty works
  [x] Slap down basic UI for HomePage/Dashboard
  [x] Goal creation form @ client, ensure it creates a group on backend properly
  [x] Update HomePage (Dashboard) to look... less like ass, and list all the main functionalities the app supports (friends, goals, groups, followed stuff, etc.)
  [x] Finish Dashboard functionality, make it look kind of decent.
  [x] Add icon selection (modal style, kind of, maybe?) ... requires adding more icons, of course :P

*/