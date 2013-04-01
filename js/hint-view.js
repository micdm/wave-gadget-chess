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

HintView.prototype._onMove = function() {
    this._clear('piece');
};

HintView.prototype._onCheck = function(color) {
    this._set('piece', 'Check to the ' + color);
};

HintView.prototype._onCheckmate = function(color) {
    var inverted = Piece.getInvertedColor(color);
    this._set('piece', 'Checkmate to the ' + color + ', the ' + inverted + ' wins');
};

HintView.prototype._onStalemate = function(color) {
    this._set('piece', 'Stalemate to the ' + color);
};

HintView.prototype._addBoardListeners = function(board) {
    board.on('move', $.proxy(this._onMove, this));
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

HintView.prototype._onGiveUp = function(color) {
    var inverted = Piece.getInvertedColor(color);
    this._set('player', 'The ' + color + ' has given up, the ' + inverted + ' wins');
};

HintView.prototype._addPlayersListeners = function(players) {
    players.on('set', $.proxy(this._onPlayerSet, this));
    players.on('give-up', $.proxy(this._onGiveUp, this));
};

HintView.prototype._init = function(board, players) {
    this._node = $('.hint');
    this._set('player', 'Move any white piece to join the game');
    this._addBoardListeners(board);
    this._addPlayersListeners(players);
};
