var Player = function(color) {
    this._color = color;
    this._id = null;
    this._name = null;
    this._avatar = null;
    this._node = $('.players .' + color);
};

Player.prototype.is = function(id) {
    return this._id == id;
};

Player.prototype.turn = function(isPlayingNow) {
    this._node.toggleClass('playing', isPlayingNow);
};

Player.prototype.set = function(id, name, avatar) {
    this._id = id;
    this._name = name;
    this._avatar = avatar;
    this._node.attr('title', name);
    this._node.css('background-image', 'url(' + avatar + ')');
};

var Players = function() {
    this._list = null;
    this._isLocked = false;
    this._color = null;
};

Players.prototype.has = function(color) {
    return color in this._list;
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
