var Players = function(users) {
    EventEmitter.mixin(this);
    this._users = users;
    this._list = {};
    this._isLocked = false;
    this._color = null;
};

Players.prototype.getCurrentColor = function() {
    return this._color;
};

Players.prototype.isViewerPlaying = function() {
    var info = this._users.getViewer();
    for (var i in Piece.COLORS) {
        var color = Piece.COLORS[i];
        var player = this._list[color];
        if (player && player.getId() == info.id) {
            return true;
        }
    }
    return false;
};

Players.prototype.isViewerNowMoving = function() {
    if (!(this._color in this._list)) {
        return false;
    }
    var id = this._list[this._color].getId();
    var info = this._users.getViewer();
    return id == info.id;
};

Players.prototype.set = function(color, id) {
    var info = this._users.get(id);
    var player = info ? new Player(info.id, info.name, info.avatar) : new Player(id, '(Unknown)', null);
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

Players.prototype.canPlay = function(color) {
    if (this._isLocked) {
        return false;
    }
    if (color != this._color) {
        return false;
    }
    if (!(color in this._list)) {
        return true;
    }
    var player = this._list[color];
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

Players.prototype.giveUp = function(color) {
    this.emit('give-up', function() {
        return [color];
    });
};
