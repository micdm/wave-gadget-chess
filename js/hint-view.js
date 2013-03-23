var HintView = function(board, players) {
    this._node = null;
    this._init(board, players);
};

HintView.prototype._set = function(section, text) {
    this._node.find('.' + section + '-hint').text(text);
};

HintView.prototype._clear = function(section) {
    this._set(section, '');
};

HintView.prototype._onPlace = function(color) {
    this._clear('piece');
};

HintView.prototype._onRemove = function(color) {
    this._clear('piece');
};

HintView.prototype._onCheck = function(color) {
    this._set('piece', 'Check to ' + color);
};

HintView.prototype._onCheckmate = function(color) {
    var inverted = Piece.getInvertedColor(color);
    this._set('piece', 'Checkmate to ' + color + ', ' + inverted + ' wins');
};

HintView.prototype._onStalemate = function(color) {
    this._set('piece', 'Stalemate to ' + color);
};

HintView.prototype._addBoardListeners = function(board) {
    board.on('place', $.proxy(this._onPlace, this));
    board.on('remove', $.proxy(this._onRemove, this));
    board.on('check', $.proxy(this._onCheck, this));
    board.on('checkmate', $.proxy(this._onCheckmate, this));
    board.on('stalemate', $.proxy(this._onStalemate, this));
};

HintView.prototype._onPlayerSet = function(color) {
    if (color == Piece.COLORS.WHITE) {
        this._set('player', 'Move any black piece to join the game');
    }
    if (color == Piece.COLORS.BLACK) {
        this._clear('player');
    }
};

HintView.prototype._addPlayersListeners = function(players) {
    players.on('set', $.proxy(this._onPlayerSet, this));
};

HintView.prototype._init = function(board, players) {
    this._node = $('.hint');
    this._set('player', 'Move any white piece to join the game');
    this._addBoardListeners(board);
    this._addPlayersListeners(players);
};
