var HintView = function(board, players) {
    this._node = null;
    this._init(board, players);
};

HintView.prototype._setText = function(text) {
    this._node.text(text);
};

HintView.prototype._onCheck = function(color) {
    this._setText('Check to ' + color + '!');
};

HintView.prototype._onCheckmate = function(color) {
    this._setText('Checkmate to ' + color + '!');
};

HintView.prototype._onStalemate = function(color) {
    this._setText('Stalemate to ' + color + '!');
};

HintView.prototype._addBoardListeners = function(board) {
    board.on('check', $.proxy(this._onCheck, this));
    board.on('checkmate', $.proxy(this._onCheckmate, this));
    board.on('stalemate', $.proxy(this._onStalemate, this));
};

HintView.prototype._onPlayerSet = function(color) {
    if (color == Piece.COLORS.WHITE) {
        this._setText('Move any black piece to join the game');
    }
    if (color == Piece.COLORS.BLACK) {
        this._setText('');
    }
};

HintView.prototype._addPlayersListeners = function(players) {
    players.on('set', $.proxy(this._onPlayerSet, this));
};

HintView.prototype._init = function(board, players) {
    this._node = $('.hint');
    this._setText('Move any white piece to join the game');
    this._addBoardListeners(board);
    this._addPlayersListeners(players);
};
