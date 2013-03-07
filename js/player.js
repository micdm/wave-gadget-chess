var Player = function(color, id, name, avatar) {
    this._color = color;
    this._name = name;
    this._avatar = avatar;
    this._node = $('.players .' + color);
};

Player.prototype.is = function(id) {
    return this._id == id;
};

Player.prototype.turn = function(isPlayingNow) {
    this._node.toggleClass('playing', isPlayingNow);
};

Player.prototype.init = function() {
    this._node.attr('title', this._name);
    this._node.css('background-image', 'url(' + this._avatar + ')');
};

var Players = function() {
    this._list = {};
    this._isLocked = false;
    this._color = Piece.COLORS.WHITE;
};

Players.prototype.has = function(color) {
    return color in this._list;
};

Players.prototype.set = function(color, id, name, avatar) {
    var player = new Player(color, id, name, avatar);
    player.init();
    this._list[color] = player;
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
