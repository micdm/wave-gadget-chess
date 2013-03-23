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

Gadget.prototype._processNextUpdate = function(state, last) {
    var revision = this._revision + 1;
    if (revision > last) {
        return;
    }
    var update = gadgets.json.parse(state.get('update-' + revision));
    this._game.update(update);
    this._revision += 1;
    setTimeout($.proxy(function() {
        this._processNextUpdate(state, last);
    }, this));
};

Gadget.prototype._onStateUpdate = function() {
    var state = wave.getState();
    var last = state.get('revision');
    if (last) {
        this._processNextUpdate(state, last);
    }
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
