const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true},
    displayName: String,
    friends: {type: Object, default: {}}, // collection of usernames is fine here, rather than _id... let's shove PENDING friends in here, too! :P
    goals: {type: Object, default: {}}, // only guaranteed element is _id, so we'll have to factor around that (i.e. pass the _id down to the FE when applicable to work with)
    groups: Object,
    settings: Object,
    history: {type: Object, default: {}},
    icon: String,
    salt: {type: String, required: true},
    hash: {type: String, required: true},
    lastActivity: Date,
    lastAlertCheck: Date
}, { minimize: false });

module.exports = mongoose.model('User', UserSchema);

/*
    DATA MODELING TIME

    HISTORY MODELING:
    -- object with mm/dd/yyyy keys
    -- so history['03/14/21'] = {goals: {id: _id, rules: ___, complete: t/f}, events: [{agent: username, action: actionString, timestamp: X:XXampm}]}
    -- history[DATE].goals should automatically populate with ALL goals that are appropriate for that day; pass/fail/etc. amended with user interaction

    - Each user can belong to any number of (goal) groups (and have one 'preferred' to pop up on Home), but we can just assume a single group right now
    - Friends is of the format {friendUserName: {data}, friendUserName2: {data}}
        - data can include timestamp of becoming friends
    - User has an activity history that is likely at least shallowly/partially mirrored inside of group(s)
        - history is object with normalized date-strings as keys
        - can do a sequential activity array for each history item, containing objects that have timestamp, activity type, and note(s)
    - How should we handle ADMIN? Probably within the group(s) themselves
        - So the users have references to their groups, and groups have references to their members

    SETTINGS can include privacy, icon, color, etc.


*/