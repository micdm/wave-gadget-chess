var Players = function() {
    this._list = null;
    this._isLocked = false;
    this._color = Piece.COLORS.WHITE;
};

Players.prototype.getColor = function() {
    return this._color;
};

Players.prototype.has = function() {
    return this._color in this._list;
};

Players.prototype.set = function(color, id, name, avatar) {
    var player = this._list[color];
    player.set(id, name, avatar);
};

Players.prototype.lock = function() {
    this._isLocked = true;
};

Players.prototype.turn = function() {
    this._color = (this._color == Piece.COLORS.WHITE) ? Piece.COLORS.BLACK : Piece.COLORS.WHITE;
    for (var color in this._list) {
        this._list[color].turn(color == this._color);
    }
    this._isLocked = false;
};

Players.prototype.canPlay = function(id) {
    if (!this.has(this._color)) {
        return true;
    }
    if (!this._list[this._color].is(id)) {
        return false;
    }
    if (this._isLocked) {
        return false;
    }
    return true;
};

Players.prototype.init = function() {
    this._list = {};
    for (var i in Piece.COLORS) {
        var color = Piece.COLORS[i];
        this._list[color] = new Player(color);
    }
    this._list[Piece.COLORS.WHITE].turn(true);
    this._list[Piece.COLORS.BLACK].turn(false);
};
