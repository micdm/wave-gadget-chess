var Gadget = function() {
    this._revision = 0;
    this._game = null;
    this._updates = [];
    this._init();
};

Gadget.prototype._onGameUpdate = function(update) {
    this._updates.push(update);
    if (this._updates.length > 1) {
        return;
    }
    setTimeout($.proxy(function() {
        var state = wave.getState();
        var revision = state.get('revision') || 0;
        var delta = {};
        for (var i in this._updates) {
            var update = this._updates[i];
            revision += 1;
            delta['update-' + revision] = gadgets.json.stringify(update);
        }
        delta.revision = revision;
        state.submitDelta(delta);
        this._updates = [];
    }, this), 0);
};

Gadget.prototype._onStateUpdate = function() {
    var state = wave.getState();
    var revision = state.get('revision');
    if (!revision) {
        return;
    }
    for (var i = this._revision + 1; i <= revision; i += 1) {
        var update = gadgets.json.parse(state.get('update-' + i));
        this._game.update(update);
    }
    this._revision = revision;
};

Gadget.prototype._init = function() {
    gadgets.util.registerOnLoadHandler($.proxy(function() {
        if (!wave || !wave.isInWaveContainer()) {
            return;
        }
        this._game = new Game(new Users());
        this._game.on('update', $.proxy(this._onGameUpdate, this));
        gadgets.window.adjustHeight();
        wave.setStateCallback($.proxy(this._onStateUpdate, this));
    }, this));
};
