const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socketIo = require('socket.io');
const mongoose = require('mongoose');
// const Character = require('./models/Character');
const User = require('./models/User');
const Goal = require('./models/Goal');
// const bodyParser = require('body-parser');
// const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:4004',
        methods: ['GET', 'POST']
    }
});

let loggedInUsers = {};
let allUsers = [];

function rando(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomID() {
    let dateSeed = new Date();
    let randomSeed = Math.random().toString(36).replace('0.', '');
    // console.log(`Random Seed result: ${randomSeed}`);
    return dateSeed.getMonth() + '' + dateSeed.getDate() + '' + dateSeed.getHours() + '' + dateSeed.getMinutes() + '' + dateSeed.getSeconds() + '' + randomSeed;
}

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

function calcDayKey(date) {
    // Returns MM/DD/YYYY, adding a leading '0' where necessary, i.e. 03/07/2021 ; assumes 'today' if no specific date is passed as param
    let dateToKey = date ? date : new Date();
    let monthKey = dateToKey.getMonth() + 1;
    let dateKey = dateToKey.getDate();
    let yearKey = dateToKey.getFullYear();

    return `${(monthKey < 10 ? `0` + monthKey : monthKey)}/${(dateKey < 10 ? `0` + dateKey : dateKey)}/${yearKey}`;
}

function calcTimestamp(date) {
    // Returns non-military time as a string in the expected format, i.e. 4:30pm, 10:21am, etc.
    let timeToStamp = date ? date : new Date();
    let hourStamp = timeToStamp.getHours();
    let minuteStamp = timeToStamp.getMinutes();

    return `${hourStamp > 12 ? hourStamp - 12 : hourStamp}:${minuteStamp < 10 ? `0` + minuteStamp : minuteStamp}${hourStamp >= 12 ? 'pm' : 'am'}`;
}

function createSalt() {
    return crypto.randomBytes(20).toString('hex');
}

function createHash(password, salt) {
    password = password.length && typeof password === 'string' ? password : undefined;

    if (password && salt) {
        let hash = crypto
            .createHmac('sha512', salt)
            .update(password)
            .digest('hex');

        return hash;
    } else {
        return null;
    }
}

function craftAccessToken(username, id) {
    return jwt.sign({ username: username, id: id }, process.env.SECRET, { expiresIn: '7d' });
}

function saveUser(user) {
    const filter = { username: user.username };
    const update = { $set: user };
    const options = { new: true, useFindAndModify: false };
    User.findOneAndUpdate(filter, update, options)
        .then(updatedResult => {
            console.log(`${updatedResult.username} has been updated.`);
        })
        .catch(err => {
            console.log(`We encountered an error saving the user whilst adding a new goal: ${err}.`);
        });
    
    const targetArrayIndex = allUsers.findIndex(allUserEntry => allUserEntry.username === user.username);
    allUsers[targetArrayIndex] = user;
}

function saveGoal(goal) {
    // ok, we're receiving a single PARTICIPANT'S actions in this case... so what do we need to do?
    // retrieve, patch, then update?
    const filter = { _id: user.username };
    const update = { $set: user };
    const options = { new: true, useFindAndModify: false };
    User.findOneAndUpdate(filter, update, options)
        .then(updatedResult => {
            console.log(`${updatedResult.username} has been updated.`);
        })
        .catch(err => {
            console.log(`We encountered an error saving the user whilst adding a new goal: ${err}.`);
        });    
}

// HMMM. io.to(roomName).emit(...) works in all cases. socket.to(roomName).emit does NOT. Can maybe just socket.emit for individual stuff, io.to(roomName) for specifics?
io.on('connection', (socket) => {
    let thisUser = undefined;
    socket.on('login', user => {
        // NOTE: we're currently using the thisUser obj as the 'source of truth,' not the global users var like in withfriends.
        if (!loggedInUsers[user.username]) {
            // HERE: if the socket connects with the user and they're not already logged in, use a fxn or somesuch to pop their data in
            loggedInUsers[user.username] = user;
        }
        thisUser = {...user};

        let dateKey = calcDayKey();
        if (thisUser.history[dateKey] === undefined) thisUser.history[dateKey] = {goals: {}, events: []};
        console.log(`${thisUser.username} is logging back onto their socket`)
        if (Object.keys(thisUser.history[dateKey].goals).length === 0 && Object.keys(thisUser.goals).length > 0) {
            console.log(`User has no daily goals, but has goals defined, so attempting to update today's history goals for them`)
            let today = new Date().getDay();
        
            let todayHistory = {};
            let todayGoalArray = [];
            today = dayNumberToWord(today).slice(0, 3);
            today = today[0].toLowerCase() + today.slice(1);
            for (const goalID in thisUser.goals) {
                if (thisUser.goals[goalID].weekDays[today]) {
                    todayHistory[goalID] = {
                        dateKey: dateKey,
                        id: goalID,
                        name: thisUser.goals[goalID].name,
                        logo: thisUser.goals[goalID].logo || '',
                        groupRule: thisUser.goals[goalID].groupRule,
                        activityName: thisUser.goals[goalID].activityName,
                        dailyTargetUnits: thisUser.goals[goalID].dailyTargetUnits,
                        dailyTargetUnitsDone: 0,
                        dailyTargetNumber: thisUser.goals[goalID].dailyTargetNumber,
                        complete: false,
                        notes: '',
                        events: []
                    }
                }
            }

            // so todayHistory picks up all relevant goals, and looks like todayHistory = {ID: {goal}, ID2: {goal}}
            // todayHistory is essentially just thisUser.history[TODAY] = {goals: {...todayHistory}}

            thisUser.history[dateKey].goals = {...todayHistory};
            saveUser(thisUser);
            // for (const goalID in todayHistory) {
            //     todayGoalArray.push(todayHistory[goalID]);
            // }  
        }
      
        // console.log(`thisUser has been defined as ${JSON.stringify(thisUser)}`);
        // socket.join(WHATEVERNEEDSJOINING)
        socket.join(thisUser.username);
        // console.log(`User ${thisUser.username} has joined their own socket name feedback.`);
        /*
            sockets in this case are just 'subscriptions' to stuff we want to know about...
            ... which we can then 'echo' to the user with visuals/audio/etc.
        */
        // socket.to(somePlace).emit('loginNotice', {}); // likely won't contain echo data, just update data to show who's active, potentially
    });

    socket.on('update', updateData => {
        switch (updateData.type) {
            // can set up a myriad of update types to roll with
        }
    });

    socket.on('package_for_server', dataFromClient => {
        switch (dataFromClient.requestType) {
            case 'create_goal': {
                let newGoal = {...dataFromClient};
                console.log(`Received new goal: ${JSON.stringify(newGoal)}`);
                console.log(`This new goal is submitted by user: ${thisUser.username}`)
                delete newGoal.requestType;

                // HERE: check to make sure all required fields have been sent up, and ERROR the user otherwise with data_from_server
                if (!newGoal.name) return io.to(thisUser.username).emit('data_from_server', {dataType: `alert`, payload: {type: 'error', message: `Failed to create new goal. Please provide a name for this Goal Project!`, id: Math.random().toString(36).replace('0.', '')}, echo: ``});
                let anyPositiveDay = false;
                for (const day in newGoal.weekDays) {
                    if (newGoal.weekDays[day]) {
                        anyPositiveDay = true;
                        break;
                    }
                }
                if (!anyPositiveDay) return io.to(thisUser.username).emit('data_from_server', {dataType: `alert`, payload: {type: 'error', message: `Failed to create new goal. Please select at least one day to practice this goal!`, id: Math.random().toString(36).replace('0.', '')}, echo: ``});
                if (!newGoal.activityName) return io.to(thisUser.username).emit('data_from_server', {dataType: `alert`, payload: {type: 'error', message: `Failed to create new goal. Please indicate the type of activity this goal revolves around (e.g. "exercise").`, id: Math.random().toString(36).replace('0.', '')}, echo: ``});
        

                // HERE: we will assume we've passed any checks and can just make the new goal; if the user enters redundant names for their goal projects, that's on them for now :P

                // HERE: add in super important OWNERSHIP information to the goal. 
                newGoal.participants = {};
                newGoal.participants[`${thisUser.username}`] = {joinTime: new Date(), privilegeLevel: 'admin'};

                // console.log(`Huh, ok, so date supplied by the DatePicker from the client is: ${newGoal.startDate}`)
                

                newGoal.startDate = new Date(newGoal.startDate);
                // console.log(`Funkifying that into a new proper date gives us ${newGoal.startDate}`)
                let endDate;
                switch (newGoal.durationUnits) {
                    case 'weeks': {
                        endDate = new Date(newGoal.startDate.setDate(newGoal.startDate.getDate() + (7 * newGoal.durationNumber)));
                        break;
                    }
                    case 'months': {
                        endDate = new Date(newGoal.startDate.setMonth(newGoal.startDate.getMonth() + newGoal.durationNumber));
                        break;
                    }
                    case 'indefinite': {
                        break;
                    }
                    default: {
                        break;
                    }
                }
                
                // console.log(`New END DATE after ${newGoal.durationNumber} ${newGoal.durationUnits} should be ${endDate}?`);

                // OI MATE - we gotta consider updating history here, possibly? ... creating this goal didn't populate properly on client currently



                let newlyCreatedGoal = new Goal({...newGoal});
                newlyCreatedGoal.save()
                    .then(freshGoal => {
                        let todayKey = calcDayKey();
                        if (thisUser.history[todayKey] === undefined) {
                            thisUser.history[todayKey] = {goals: {}, events: []};
                        }
                        let miniToday = dayNumberToWord(newGoal.startDate.getDay()).toLowerCase().slice(0,3);
                        if (newGoal.weekDays[miniToday]) {
                            console.log(`Adding a new goal to the user's TODAY history`);
                            thisUser.history[todayKey].goals[freshGoal._id] = {
                                dateKey: todayKey,
                                id: freshGoal._id,
                                name: freshGoal.name,
                                logo: freshGoal.logo || '',
                                groupRule: freshGoal.groupRule || 'solo',
                                activityName: freshGoal.activityName,
                                dailyTargetUnits: freshGoal.dailyTargetUnits,
                                dailyTargetUnitsDone: 0,
                                dailyTargetNumber: freshGoal.dailyTargetNumber,
                                complete: false,
                                notes: '',
                                events: []
                            };                          
                        }                        
                        thisUser.history[todayKey].events.push({timestamp: new Date(), agent: thisUser.username, action: `created the new Goal Project: ${freshGoal.name}!`})
                        console.log(`Attempting to add a newly DB'd goal to the user. Its _id is: ${freshGoal._id}`);
                        thisUser.goals[freshGoal._id] = freshGoal;
                        thisUser.lastActivity = new Date();
                        // hm, should consider setting it up as a 'chain' below in case the saving fails for some reason
                        saveUser(thisUser);
                        io.to(thisUser.username).emit('data_from_server', {dataType: 'goal_update', payload: {goals: {...thisUser.goals}, history: {...thisUser.history}}});
                        // With the new saveUser, we prooobably don't need the below
                        // const filter = { username: thisUser.username };
                        // const update = { $set: thisUser };
                        // const options = { new: true, useFindAndModify: false };
                        // User.findOneAndUpdate(filter, update, options)
                        //     .then(updatedResult => {
                        //         console.log(`${thisUser.username} has been updated? Maybe? With a new goal, in this case.`);
                        //         thisUser = updatedResult;
                        //         thisUser.lastActivity
                        //         delete thisUser.salt;
                        //         delete thisUser.hash;
                        //         // akshully... we should probably pass down new user history data, as well
                        //         
                        //     })
                        //     .catch(err => {
                        //         console.log(`We encountered an error saving the user whilst adding a new goal: ${err}.`);
                        //     });

                        // HERE: send updated state-relevant info (may require new Context action) -- new GOAL for self should load onto Dashboard (if applicable) and Goals list
                        // UPDATE below to send... hm, probably the entire GOALS object down? Then have a context update state accordingly.
                        io.to(thisUser.username).emit('data_from_server', {dataType: `alert`, payload: {type: 'confirmation', message: `You have created a new Goal Project! Let's bust that goal!`, id: Math.random().toString(36).replace('0.', '')}, echo: ``});
                        // Consider 'scrubbing' the data a little so the list of participants and their level of access isn't quite as exposed
                    })
                    .catch(err => {
                        // HERE: send error info down, whoopsie-doodle
                        console.log(`Goal creation error! Which is: ${err}`);
                        return io.to(thisUser.username).emit('data_from_server', {dataType: `alert`, payload: {type: 'error', message: `Failed to create new goal.`, id: Math.random().toString(36).replace('0.', '')}, echo: ``});
                    })                 
                return;

            }
            case 'update_daily_goal': {
                // TO ADD: properly updating the actual Goal on backend, which will enable proper multi-user participation support
                // ADJUST: remove goalObj.notes here; have it reset each time in the client, as well
                const goalObj = dataFromClient.finalizedGoalObj;
                const eventObj = dataFromClient.eventObj;
                goalObj.events.push(eventObj);
                console.log(`The user has entered a new goal for ${goalObj.dateKey}: ${JSON.stringify(goalObj)}`);
                if (thisUser.history[goalObj.dateKey] === undefined) thisUser.history[goalObj.dateKey] = {goals: {}, events: []};
                thisUser.history[goalObj.dateKey].goals[goalObj.id] = {...goalObj};
                thisUser.history[goalObj.dateKey].events.push(eventObj);
                saveUser(thisUser);
                Goal.findOne({ _id: goalID })
                .then(updateGoal => {
                    if (updateGoal.history === undefined) updateGoal.history = {};
                    if (updateGoal.history[goalObj.dateKey] === undefined) updateGoal.history[goalObj.dateKey] = {events: [], participants: {}};
                    updateGoal.history[goalObj.dateKey].events.push(eventObj);
                    if (updateGoal.history[goalObj.dateKey].participants[thisUser.username] === undefined) updateGoal.history[goalObj.dateKey].participants[thisUser.username] = {username: thisUser.username};
                    updateGoal.history[goalObj.dateKey].participants[thisUser.username].goalObj = goalObj;                    
                    // HERE: saveGoal
                })
                .catch(err => {
                    console.log(err);
                    // res.json({type: `failure`, echo: JSON.stringify(err)});
                });
                
                // hm, HISTORY for a goal will look a bit different... history[DATEKEY] = {events: [], participants: {}}; participants instead of goals
                // participants obj = BOB: {username: BOB, goalObj: BOBSGOALOBJHERE}
                // that should preserve all the individual actions of each individual in a group goal


                // here: saveGoal... figure out what goalObj has in it so we can pass properly (looks like we have id, which is very helpful)

                // we have the id, we have the participant in thisUser.username, we have the goalObj.dateKey, and goalObj itself (that day's done-ness of goal)
                // GOAL has a history as well, so essentially we want to LOAD the full goal, plug in the proper history, and ride
                
                // HERE: If Group Goal, push to everyone's history appropriately via usernames array
                io.to(thisUser.username).emit('data_from_server', {dataType: `update_user`, payload: thisUser});
                return io.to(thisUser.username).emit('data_from_server', {dataType: `alert`, payload: {type: 'confirmation', message: `You have updated ${goalObj.name}!`, id: Math.random().toString(36).replace('0.', '')}, echo: ``});
            }
            case 'populate_daily_goals': {
                // should prooobably do this on the backend, not the frontend, juuuust in case
                // but not here, obviously, since this is the client-response sxn; scoot it to login-logic
                return;
            }
            case 'search_new_friend': {
                const friendSearchString = dataFromClient.searchString;
                let friendSearchResult = allUsers.filter(user => (user.username !== thisUser.username && user.username.toLowerCase().indexOf(friendSearchString) !== -1));
                // console.log(`Backend says we got ${friendSearchResult.length} hits from this. GO TO FRONT_END!`);
                return io.to(thisUser.username).emit('data_from_server', {dataType: 'friend_search_result', payload: friendSearchResult});
            }
            case 'request_friend': {
                // console.log(`Oh! ${thisUser.username} wants to be friends with ${dataFromClient.target}! How sweet!`);
                let rightNow = new Date();
                let dateKey = calcDayKey(rightNow);
                const targetArrayIndex = allUsers.findIndex(user => user.username === dataFromClient.target);
                console.log(`Haha! Found the request recipient at index ${targetArrayIndex}, who would be ${JSON.stringify(allUsers[targetArrayIndex])}`);
                thisUser.friends[dataFromClient.target] = {username: dataFromClient.target, icon: allUsers[targetArrayIndex].icon, status: 'requestSent', timestamp: rightNow};
                allUsers[targetArrayIndex].friends[thisUser.username] = {username: thisUser.username, icon: thisUser.icon, status: 'requestReceived', timestamp: rightNow};
                
                // HERE: add event notification for this
                if (thisUser.history[dateKey] === undefined) thisUser.history[dateKey] = {goals: {}, events: []};
                if (allUsers[targetArrayIndex].history[dateKey] === undefined) allUsers[targetArrayIndex].history[dateKey] = {goals: {}, events: []};
                thisUser.history[dateKey].events.push({timestamp: rightNow, agent: thisUser.username, action: ` requested ${allUsers[targetArrayIndex].username} to add you as a Goalbusting Buddy!`});
                allUsers[targetArrayIndex].history[dateKey].events.push({timestamp: rightNow, agent: thisUser.username, action: ` requested you to add them as a Goalbusting Buddy!`});
                
                saveUser(thisUser);
                saveUser(allUsers[targetArrayIndex]);

                // HERE: add relevant io.to for the receiving user, which will go ahead and fall on deaf ears if they're not online :P
                // should enable a similar 'data push' that Keyboard should listen for
                // can make it a 'precise' push that doesn't overwrite the entirety of state? add to context, etc.
                // io.to(allUsers[targetArrayIndex].username).emit('data_from_server', {dataType: 'friends_update', payload: allUsers[targetArrayIndex].friends});
                io.to(allUsers[targetArrayIndex].username).emit('data_from_server', {dataType: 'update_user', payload: allUsers[targetArrayIndex]});
                // this currently resets the FTAB settings; can we avoid that?
                io.to(thisUser.username).emit('data_from_server', {dataType: `update_user`, payload: thisUser});
                return io.to(thisUser.username).emit('data_from_server', {dataType: `alert`, payload: {type: 'confirmation', message: `Friend request sent to ${dataFromClient.target}!`, id: Math.random().toString(36).replace('0.', '')}, echo: ``});
            }
            case 'accept_friend': {
                // console.log(`Oh! ${thisUser.username} wants to accept friendship with ${dataFromClient.target}! How delightful!`);
                let rightNow = new Date();
                let dateKey = calcDayKey(rightNow);
                const targetArrayIndex = allUsers.findIndex(user => user.username === dataFromClient.target);
                console.log(`Haha! Found the request recipient at index ${targetArrayIndex}, who would be ${JSON.stringify(allUsers[targetArrayIndex])}`);
                thisUser.friends[dataFromClient.target] = {username: dataFromClient.target, icon: allUsers[targetArrayIndex].icon, status: 'friended', timestamp: rightNow};
                allUsers[targetArrayIndex].friends[thisUser.username] = {username: thisUser.username, icon: thisUser.icon, status: 'friended', timestamp: rightNow};

                // HERE: add to "event" for both parties
                if (thisUser.history[dateKey] === undefined) thisUser.history[dateKey] = {goals: {}, events: []};
                if (allUsers[targetArrayIndex].history[dateKey] === undefined) allUsers[targetArrayIndex].history[dateKey] = {goals: {}, events: []};
                thisUser.history[dateKey].events.push({timestamp: rightNow, agent: thisUser.username, action: ` accepted ${allUsers[targetArrayIndex].username} as a Goalbusting Buddy!`});
                allUsers[targetArrayIndex].history[dateKey].events.push({timestamp: rightNow, agent: thisUser.username, action: ` accepted you as a Goalbusting Buddy!`});                
                                
                saveUser(thisUser);
                saveUser(allUsers[targetArrayIndex]);

                io.to(allUsers[targetArrayIndex].username).emit('data_from_server', {dataType: 'update_user', payload: allUsers[targetArrayIndex]});
                io.to(thisUser.username).emit('data_from_server', {dataType: `update_user`, payload: thisUser});
                return io.to(thisUser.username).emit('data_from_server', {dataType: `alert`, payload: {type: 'confirmation', message: `You are now friends with ${dataFromClient.target}!`, id: Math.random().toString(36).replace('0.', '')}, echo: ``});
            }
            case 'remove_friend': {
                // console.log(`Oh! ${thisUser.username} wants to eliminate friendship with ${dataFromClient.target}! How hopefully healthy!`);
                let rightNow = new Date();
                let dateKey = calcDayKey(rightNow);
                const targetArrayIndex = allUsers.findIndex(user => user.username === dataFromClient.target);
                console.log(`Haha! Found the request recipient at index ${targetArrayIndex}, who would be ${JSON.stringify(allUsers[targetArrayIndex])}`);
                thisUser.friends[dataFromClient.target] = undefined;
                allUsers[targetArrayIndex].friends[thisUser.username] = undefined;

                if (thisUser.history[dateKey] === undefined) thisUser.history[dateKey] = {goals: {}, events: []};
                if (allUsers[targetArrayIndex].history[dateKey] === undefined) allUsers[targetArrayIndex].history[dateKey] = {goals: {}, events: []};
                thisUser.history[dateKey].events.push({timestamp: rightNow, agent: thisUser.username, action: ` removed ${allUsers[targetArrayIndex].username} as a Goalbusting Buddy.`});
                // allUsers[targetArrayIndex].history[dateKey].events.push({timestamp: rightNow, agent: thisUser.username, action: ` removed you as a Goalbusting Buddy.`}); // wait, we don't need to let the recipient know :P

                saveUser(thisUser);
                saveUser(allUsers[targetArrayIndex]);

                io.to(allUsers[targetArrayIndex].username).emit('data_from_server', {dataType: 'update_user', payload: allUsers[targetArrayIndex]});
                io.to(thisUser.username).emit('data_from_server', {dataType: `update_user`, payload: thisUser});
                return io.to(thisUser.username).emit('data_from_server', {dataType: `alert`, payload: {type: 'confirmation', message: `${dataFromClient.target} is now somebody that you USED to know.`, id: Math.random().toString(36).replace('0.', '')}, echo: ``});
            }

            default: {
                console.log(`A package for server borked somewhere, and we've hit the DEFAULT scenario. Oops.`)
                return;
            }
        }
    });

    // ADD: socket(s) for group creation, group editing
    socket.on('create_group', newGroupData => {

    });

    socket.on('disconnect', () => {
        if (loggedInUsers[thisUser.username]) {
            delete loggedInUsers[thisUser.username];
            // HERE: io.to(loggedInUsers), maybe? Hmmmm. Set up some logic to indicate someone logged off, if that's an important detail.
        }
    });    

});

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};

mongoose.connect(process.env.DB_HOST, connectionParams)
    .then(() => console.log(`Successfully connected to Goalin Girls database. That'll come in handy!`))
    .catch(err => console.log(`Error connecting to Goalin Girls database: ${err}`));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app.use(bodyParser.json());
app.use(express.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false}));

app.post('/user/create', (req, res, next) => {
    // Should be receiving a userName, password, and maybe displayName (optionally; otherwise we'll just set displayName to userName for ease)
    let { newUser } = req.body;
    
    console.log(`Test 1... receiving a user called ${newUser.username} to attempt to create on the backend.`);
    
    // interesting, so this references /static/media/fileRef.svg? ... let's see if we can sniggity-sneak it into DashBoard Land
    console.log(`What is their icon, you ask? I shall tell you! It is ${newUser.icon}.`);
 
    // HERE: Make sure newUser.name isn't yet taken (scan DB in characters collection)
    User.findOne({ username: newUser.username })
        .then(searchResult => {
            if (searchResult === null) {
                console.log(`Username ${newUser.username} is available`);
                const salt = createSalt();
                const hash = createHash(newUser.password, salt);
                let createdUser = new User({
                    username: newUser.username,
                    salt: salt,
                    hash: hash,
                    icon: newUser.icon
                });

                createdUser.save()
                    .then(freshUser => {
                        const token = craftAccessToken(freshUser.username, freshUser._id);
                        let userToLoad = JSON.parse(JSON.stringify(freshUser));
                        delete userToLoad.salt;
                        delete userToLoad.hash;
                        allUsers.push(freshUser);
                        userToLoad.whatDo = 'dashboard';

                        res.status(200).json({type: `success`, echo: `${userToLoad.username} is up and ready to go.`, payload: {user: userToLoad, token: token}});
                    })
                    .catch(err => {
                        res.json({type: `failure`, echo: `Something went wrong attempting to save the new character: ${JSON.stringify(err)}`});
                    })
            } else {
                // Name is unavailable! Share the sad news. :P
                res.json({type: `failure`, echo: `That username is already in use. Please choose another.`});
            }
        })
        .catch(err => {
            console.log(err);
            res.json({type: `failure`, echo: JSON.stringify(err)});
        });

});

app.post('/user/login', (req, res, next) => {
    // Receive a CHARTOKEN, check it, and if VALID, do two important things:
    // 1) 'Load' the character live into this server space
    // 2) Pass back that character to the client, which must use this package to open a socket with the server
    // +) Oh, this login may just receive a charname and password instead, so handle it either way

    if (req.body.userToken !== undefined) {
        const { userToken } = req.body;
        console.log(`Receiving request to log in with a JWT. Processing.`);

        // HERE: handle token login
        const decodedToken = jwt.verify(userToken, process.env.SECRET);
        const { username, id } = decodedToken;

        console.log(`It appears we're searching for a user by the username of ${username}?`)
        User.findOne({ username: username, _id: id })
            .then(searchResult => {
                if (searchResult === null) {
                    // HERE: handle no such character now
                    console.log(`No such user found. 406 error reported.`);
                    res.status(406).json({type: `failure`, echo: `No such username exists yet. You can create them, if you'd like!`});
                } else {
                    // Token worked! Currently we make a brand-new one here to pass down, but we can play with variations on that later
                    const token = craftAccessToken(searchResult.username, searchResult._id);
                    const userToLoad = JSON.parse(JSON.stringify(searchResult));
                    delete userToLoad.salt;
                    delete userToLoad.hash;
                    userToLoad.whatDo = 'dashboard';
                    // if (characters[userToLoad.entityID] !== undefined) characters[userToLoad.entityID].fighting = {main: undefined, others: []};
                    // const alreadyInGame = addCharacterToGame(userToLoad);

                    // if (alreadyInGame) res.status(200).json({type: `success`, echo: `Reconnecting to ${userToLoad.name}.`, payload: {character: characters[userToLoad.entityID], token: token}})
                    // else res.status(200).json({type: `success`, echo: `Good news everyone! ${userToLoad.name} is ready to play.`, payload: {character: userToLoad, token: token}});

                    // console.log(`BACKEND IS LOADING AND SENDING THIS USER DATA: ${JSON.stringify(userToLoad)}`)
                    res.status(200).json({type: `success`, echo: `Good news everyone! ${userToLoad.username} is ready to play.`, payload: {user: userToLoad, token: token}});

                }


            })
            .catch(err => {
                console.log(`Someone had some difficulty logging in with a token: ${err}`);
                res.status(406).json({type: `failure`, echo: `Something went wrong logging in with these credentials.`});
            })        
    }

    if (req.body.userCredentials !== undefined) {
        const { userCredentials } = req.body;
        console.log(`Someone is attempting to log in with these credentials: ${JSON.stringify(userCredentials)}`);

        // HERE: handle credentials login: take userCredentials.charName and userCredentials.password and go boldly:

        User.findOne({ username: userCredentials.username })
            .then(searchResult => {
                if (searchResult === null) {
                    // HERE: handle no such character now
                    res.status(406).json({type: `failure`, echo: `No such character exists yet. You can create them, if you'd like!`});
                } else {
                    let thisHash = createHash(userCredentials.password, searchResult.salt);
                    if (thisHash === searchResult.hash) {
                        // Password is good, off we go!
                        const token = craftAccessToken(searchResult.username, searchResult._id);
                        let userToLoad = JSON.parse(JSON.stringify(searchResult));
                        delete userToLoad.salt;
                        delete userToLoad.hash;
                        userToLoad.whatDo = 'dashboard';

                        // This will probably only work a small subset of times, actually; socket disconnection removes the char from the game
                        // const alreadyInGame = addCharacterToGame(charToLoad);

                        // if (alreadyInGame) res.status(200).json({type: `success`, message: `Reconnected to live character.`, payload: {character: characters[charToLoad.entityID], token: token}})
                        // else res.status(200).json({type: `success`, message: `Good news everyone! ${charToLoad.name} is ready to play.`, payload: {character: charToLoad, token: token}});
                        res.status(200).json({type: `success`, echo: `Good news everyone! ${userToLoad.name} is ready to play.`, payload: {user: userToLoad, token: token}});                        


                    } else {
                        // Password is incorrect, try again... if THOU DAREST
                        res.status(401).json({type: `failure`, echo: `The supplied password is incorrect.`});
                    }
                }


            })
            .catch(err => {
                console.log(`Someone had some difficulty logging in: ${err}`);
                res.status(406).json({type: `failure`, message: `Something went wrong logging in with these credentials.`});
            })
    }
});

// AKSHULLY... I think this makes WAY more sense to parse through the socket, since only a logged-in user can do this
// app.post('/goal/create', (req, res, next) => {
//     // Definitely getting at LEAST a groupName; may set it up so that other basic variables can be set up upon creation rather than being forced in editing only
//     let { newGoal } = req.body;
 
//     // HERE: Make sure newUser.name isn't yet taken (scan DB in characters collection)
//     Goal.findOne({ goalName: newGoal.goalName })
//         .then(searchResult => {
//             if (searchResult === null) {
//                 console.log(`Group ${newGoal.goalName} is available! Endeavoring to create it now.`);
//                 let createdGoal = new Goal({
//                     ...newGoal
//                 });

//                 createdGoal.save()
//                     .then(freshGoal => {
//                         const token = craftAccessToken(freshGoal.goalName, freshGoal._id);
//                         const goalToLoad = JSON.parse(JSON.stringify(freshGoal));

//                         res.status(200);
            
//                         // res.status(200).json({type: `success`, echo: `${userToLoad.userName} is up and ready to go.`, payload: {character: userToLoad, token: token}});
//                     })
//                     .catch(err => {
//                         res.json({type: `failure`, echo: `Something went wrong attempting to save the new character: ${err}`});
//                     })
//             } else {
//                 // Name is unavailable! Share the sad news. :P
//                 res.json({type: `failure`, echo: `That group name is already in use. Please choose another.`});
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.json({type: `failure`, echo: err});
//         });

// });

const PORT = process.env.PORT || 5050;

User.find()
    .then(allAppUsers => {
        for (const user in allAppUsers) {
            delete allAppUsers[user].salt;
            delete allAppUsers[user].hash;
            allUsers.push(allAppUsers[user]);
        }
        
        // Trying out for now... 'requiring' this initial load of the allUsers array before connecting itself and accepting requests
        server.listen(PORT, () => console.log(`Goalin' Gals server active on Port ${PORT}.`));
    })
    .catch(err => {
        console.log(`Had an error finding all app users. Whoops-e-doodle?`);
    });