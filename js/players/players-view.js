var PlayersView = function(board, players, state) {
    EventEmitter.mixin(this);
    this._players = players;
    this._node = null;
    this._init(board, state);
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
    var needShow = this._players.isViewerNowMoving();
    this._node.find('.give-up-button').toggleClass('visible', needShow);
};

PlayersView.prototype._addPlayersListeners = function() {
    this._players.on('set', $.proxy(this._onSetPlayer, this));
    this._players.on('turn', $.proxy(this._onTurn, this));
};

PlayersView.prototype._onEnd = function() {
    this._node.find('.turn').removeClass('turn');
    this._node.find('.give-up-button').removeClass('visible');
};

PlayersView.prototype._addStateListeners = function(state) {
    state.on('end', $.proxy(this._onEnd, this));
};

PlayersView.prototype._addClickListener = function() {
    this._node.click($.proxy(function(event) {
        var element = $(event.target);
        if (element.hasClass('give-up-button')) {
            var color = this._players.getCurrentColor();
            this.emit('give-up', function() {
                return [color];
            });
        }
        return false;
    }, this));
};

PlayersView.prototype._init = function(board, state) {
    this._node = $('.players');
    this._addBoardListeners(board);
    this._addPlayersListeners();
    this._addStateListeners(state);
    this._addClickListener();
};
