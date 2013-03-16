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
    this.emit('set', color, player);
};

Players.prototype.lock = function() {
    this._isLocked = true;
};

Players.prototype.turn = function() {
    this._color = (this._color == Piece.COLORS.WHITE) ? Piece.COLORS.BLACK : Piece.COLORS.WHITE;
    this._isLocked = false;
    this.emit('turn', this._color);
};
