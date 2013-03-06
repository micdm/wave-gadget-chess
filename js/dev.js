var Participant = function(id, name, avatar) {
    this.getId = function() {
        return id;
    };
    this.getDisplayName = function() {
        return name;
    };
    this.getThumbnailUrl = function() {
        return avatar;
    };
};

var wave = {
    isInWaveContainer: function() {
        return true;
    },
    state: {
        revision: 2,
        'update-1': '{"type": "player", "color": "white", "info": {"id": 1, "name": "Player 1", "avatar": "https://lh6.googleusercontent.com/-mwE_hh9x-14/AAAAAAAAAAI/AAAAAAAAE30/Iux9ke27Hs4/photo.jpg"}}',
        'update-2': '{"type": "player", "color": "black", "info": {"id": 2, "name": "Player 2", "avatar": "https://lh6.googleusercontent.com/-a4xbIaTkq4A/AAAAAAAAAAI/AAAAAAAAAec/uVZODodZNfw/photo.jpg"}}'
    },
    participants: [
        
    ],
    getViewer: function() {
        return wave.participants[0];
    },
    getState: function() {
        return {
            get: function(key) {
                return wave.state[key];
            },
            getKeys: function() {
                return Object.keys(wave.state);
            },
            submitDelta: function(delta) {
                for (var i in delta) {
                    var value = delta[i];
                    if (value == null) {
                        if (i in wave.state) {
                            delete wave.state[i];
                        }
                    } else {
                        wave.state[i] = value;
                    }
                }
                wave.stateCallback();
            }
        };
    },
    getParticipants: function() {
        return wave.participants;
    },
    getParticipantById: function(id) {
        for (var i in wave.participants) {
            var participant = wave.participants[i];
            if (participant.getId() == id) {
                return participant;
            }
        }
        return null;
    },
    stateCallback: function() {},
    setStateCallback: function(callback) {
        wave.stateCallback = callback;
    },
    participantCallback: function() {},
    setParticipantCallback: function(callback) {
        wave.participantCallback = callback;
    }
};

var callbacks = [];
var gadgets = {
    json: JSON,
    util: {
        registerOnLoadHandler: function(callback) {
            callbacks.push(callback);
        }
    },
    window: {
        adjustHeight: function() {
            console.log('adjust window height');
        }
    }
};
