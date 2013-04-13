var PlayersView = function(board, players, state, menu) {
    EventEmitter.mixin(this);
    this._board = board;
    this._players = players;
    this._state = state;
    this._menu = menu;
    this._node = null;
    this._init();
};

PlayersView.prototype._addMenuItems = function() {
    this._menu.add('give-up', 'Give up', 'top', $.proxy(function(event) {
        var color = this._players.getCurrentColor();
        this.emit('give-up', function() {
            return [color];
        });
    }, this));
    this._menu.disable('give-up');
};

PlayersView.prototype._onAttack = function(piece) {
    var color = piece.getColor();
    var type = piece.getType();
    var inverted = Piece.getInvertedColor(color);
    var container = this._node.find('.player.' + inverted + ' .taken');
    var node = $('<div class="icon ' + color + ' ' + type + '"></div>');
    container.append(node);
};

PlayersView.prototype._addBoardListeners = function() {
    this._board.on('attack', $.proxy(this._onAttack, this));
};

PlayersView.prototype._onSetPlayer = function(color, player) {
    var node = this._node.find('.player.' + color + ' .avatar');
    var name = player.getName();
    node.attr('title', name);
    var avatar = player.getAvatar();
    if (avatar) {
        node.css('background-image', 'url(' + avatar + ')');
    }
};

PlayersView.prototype._onTurn = function(color) {
    this._node.find('.turn').removeClass('turn');
    var node = this._node.find('.player.' + color);
    node.addClass('turn');
    if (this._players.isViewerNowMoving()) {
        this._menu.enable('give-up');
    } else {
        this._menu.disable('give-up');
    }
};

PlayersView.prototype._addPlayersListeners = function() {
    this._players.on('set', $.proxy(this._onSetPlayer, this));
    this._players.on('turn', $.proxy(this._onTurn, this));
};

PlayersView.prototype._addStateListeners = function() {
    this._state.on('end', $.proxy(function() {
        this._node.find('.turn').removeClass('turn');
        this._menu.disable('give-up');
    }, this));
};

PlayersView.prototype._init = function() {
    this._node = $('.players');
    this._addMenuItems();
    this._addBoardListeners();
    this._addPlayersListeners();
    this._addStateListeners();
};
