var PlayersView = function(board, players) {
    this._node = null;
    this._init(board, players);
};

PlayersView.prototype._onAttack = function(piece) {
    var color = piece.getColor();
    var type = piece.getType();
    var inverted = Piece.getInvertedColor(color);
    var container = this._node.find('.player.' + inverted + ' .taken');
    var node = $('<div class="icon ' + color + ' ' + type + '"></div>');
    container.append(node);
};

PlayersView.prototype._addBoardListeners = function(board) {
    board.on('attack', $.proxy(this._onAttack, this));
};

PlayersView.prototype._onSetPlayer = function(color, player) {
    var node = this._node.find('.player.' + color + ' .avatar');
    node.attr('title', player.getName());
    node.css('background-image', 'url(' + player.getAvatar() + ')');
};

PlayersView.prototype._onTurn = function(color) {
    this._node.find('.turn').removeClass('turn');
    var node = this._node.find('.player.' + color);
    node.addClass('turn');
};

PlayersView.prototype._addPlayersListeners = function(players) {
    players.on('set', $.proxy(this._onSetPlayer, this));
    players.on('turn', $.proxy(this._onTurn, this));
};

PlayersView.prototype._init = function(board, players) {
    this._node = $('.players');
    this._addBoardListeners(board);
    this._addPlayersListeners(players);
};
