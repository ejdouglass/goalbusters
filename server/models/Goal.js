const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
    name: {type: String, required: true},
    description: String,
    groupRule: String,
    logo: String,
    colorScheme: String,
    goalPic: String,
    weekDays: Object,
    privacyLevel: {type: Number, default: 0},
    activityName: String,
    dailyTargetUnits: String,
    dailyTargetNumber: Number,
    weeklyCompletionTarget: Number,
    creationDate: Date,
    startDate: Date,
    endDate: Date,
    participants: Object, // Object with keys that are the username(s) of the participants, pointing to an object that likely indicates editing power over the group (reference below)
    observers: Object,
    history: {type: Object, default: {}},
    // goalRules: Object,
    
    chatLog: Array
}, { minimize: false });

module.exports = mongoose.model('Goal', GoalSchema);

/*

    const [newGoal, setNewGoal] = useState({
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

    GROUP DATA MODELING TIME

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
    
    
    

*/