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
