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

var Gadget = function() {
    this._revision = 0;
    this._board = null;
};

Gadget.prototype._onBoardUpdate = function(update) {
    var state = wave.getState();
    var revision = state.get('revision') || 0;
    revision += 1;
    var delta = {revision: revision};
    delta['update-' + revision] = gadgets.json.stringify(update);
    state.submitDelta(delta);
};

Gadget.prototype._onStateUpdate = function() {
    var state = wave.getState();
    var revision = state.get('revision');
    if (!revision) {
        return;
    }
    for (var i = this._revision + 1; i <= revision; i += 1) {
        var update = gadgets.json.parse(state.get('update-' + i));
        this._board.update(update);
    }
    this._revision = revision;
};

Gadget.prototype.init = function() {
    gadgets.util.registerOnLoadHandler($.proxy(function() {
        if (!wave || !wave.isInWaveContainer()) {
            return;
        }
        this._board = new Board(new Users(), {
            onUpdate: $.proxy(this._onBoardUpdate, this)
        });
        this._board.init();
        gadgets.window.adjustHeight();
        wave.setStateCallback($.proxy(this._onStateUpdate, this));
    }, this));
};
