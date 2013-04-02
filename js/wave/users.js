var Users = function() {

};

Users.prototype._getInfo = function(user) {
    return {
        id: user.getId(),
        name: user.getDisplayName(),
        avatar: user.getThumbnailUrl()
    };
};

Users.prototype.get = function(id) {
    var user = wave.getParticipantById(id);
    return this._getInfo(user);
};

Users.prototype.getViewer = function() {
    var viewer = wave.getViewer();
    return this._getInfo(viewer); 
};
