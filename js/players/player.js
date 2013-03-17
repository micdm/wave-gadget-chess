var Player = function(id, name, avatar) {
    this._id = id;
    this._name = name;
    this._avatar = avatar;
};

Player.prototype.getId = function() {
    return this._id;
};

Player.prototype.getName = function() {
    return this._name;
};

Player.prototype.getAvatar = function() {
    return this._avatar;
};
