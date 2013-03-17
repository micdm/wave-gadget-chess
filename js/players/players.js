var Players = function(users) {
    EventEmitter.mixin(this);
    this._users = users;
    this._list = {};
    this._isLocked = false;
    this._color = null;
};

Players.prototype.set = function(color, id) {
    var info = this._users.get(id);
    var player = new Player(info.id, info.name, info.avatar);
    this._list[color] = player;
    this.emit('set', function() {
        return [color, player];
    });
};

Players.prototype.lock = function() {
    this._isLocked = true;
};

Players.prototype.checkForNewPlayer = function() {
    if (this._color in this._list) {
        return;
    }
    var info = this._users.getViewer();
    this.emit('new', $.proxy(function() {
        return [this._color, new Player(info.id, info.name, info.avatar)];
    }, this));
};

Players.prototype.canPlay = function() {
    if (this._isLocked) {
        return false;
    }
    if (!(this._color in this._list)) {
        return true;
    }
    var player = this._list[this._color];
    var info = this._users.getViewer();
    if (player.getId() != info.id) {
        return false;
    }
    return true;
};

Players.prototype.turn = function() {
    this._color = (this._color == Piece.COLORS.WHITE) ? Piece.COLORS.BLACK : Piece.COLORS.WHITE;
    this._isLocked = false;
    this.emit('turn', $.proxy(function() {
        return [this._color];
    }, this));
};
