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


  FRESH THOUGHT FINISHERS (basic)

  Dashboard
  [x] Update goal list buttons to be more visually useful: narrower, taller, ICONS: [group v solo] [ daily/weekend/week/MWF/TuTh ] [ in/complete ]
  -- Add filters for goal area (complete, incomplete, both; solo, group, all)
  [x] Pretty up the notifications a bit
  [x] Touch up the usermodal
  [x] Fix bug where creating new goal and then going to dashboard shows nothing until Ctrl+R
  -- Update Sun - Sat readout at bottom to be meaningful

  Friends Page
  [x] list friends with their username + icon (flex-wrap buttons) ... big enough to have action-buttons on 'em to request
  [x] "My Friends" button vs "Search Friends" button
  [x] just searches by username; click to "request friend"
  [x] put all pending-style friend stuff in 'My Friends'
  [x] implement adding friends, removing friends, etc.
  [x] rejigger friend card to make it clear who's a friend, who's a requestReceived, who's a requestSent, etc.
  -- add lil' color-badge for number of outstanding friend requests
  [x] make sure to REMOVE searching yourself :P

  Goal Page
  -- Add formatting to GOAL CARDS
  -- Have booping goal cards lead to something useful? (view & edit if allowed, ___)
  [x] Fix goal search (again :P)

  History Page
  -- should use User.history object to be able to go back in time and see overview of each day's activity (basically same as Dashboard for that day-of)
  -- limited editing should be possible (i.e. changing data from previous days/weeks, adding stuff from the past -- maybe in future versions only)
  -- use DatePicker, but center it on a Date() variable that is mutable with other inputs so we can do "jump to Day 1" or whatever

  Notifications
  -- Design concept for socket-based as well as fresh login notifications (lean into user.lastActivity?)
  -- Could probably go 'simple' and just flood-feed each day's stuff?
    -- The big challenge is to figure out what data to aggregate and then fetch it appropriately
  -- Add 'history' button that links to history page larger scale notifications?

  Settings Page
  -- mostly selecting an icon, I guess? ... and maybe delete account?

  Alerts
  -- make pretty
  -- maybe change that 'progress bar' that drains at the bottom to be... not there :P

  Welcome Page
  -- oof. make less ugly, more consistent with the rest of the app
  [x] wrap in a form for 'enter' --> log in

  Creaet New Account Page
  -- likewise, make a little more consistent with app aesthetic
  [x] wrap in a form for 'enter' --> create

  General
  -- make goals delete-able from somewhere (goal overview/edit page makes most sense)

  Mobile-friendliness
  -- Adjust all pages/containers/etc. to be column-ular at mobile widths (look up common mobile widths we might be dealing with :P)
  -- Squinch at all pages with this eye






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