var PlayersView = function(players) {
    this._players = players;
    this._node = $('.players');
};

PlayersView.prototype._onNewPlayer = function(color, player) {
    var node = this._node.find('.player.' + color);
    node.attr('title', player.getName());
    node.css('background-image', 'url(' + player.getAvatar() + ')');
};

PlayersView.prototype._onTurn = function(color) {
    this._node.find('.turn').removeClass('turn');
    var node = this._node.find('.' + color);
    node.addClass('turn');
};

PlayersView.prototype.init = function() {
    this._players.on('set', $.proxy(this._onNewPlayer, this));
    this._players.on('turn', $.proxy(this._onTurn, this));
};
