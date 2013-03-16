var Gadget = function() {
    this._revision = 0;
    this._game = null;
};

Gadget.prototype._onGameUpdate = function(update) {
    var state = wave.getState();
    var revision = state.get('revision') || 0;
    revision += 1;
    var delta = {revision: revision};
    delta['update-' + revision] = gadgets.json.stringify(update);
    state.submitDelta(delta);
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

Gadget.prototype.init = function() {
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
