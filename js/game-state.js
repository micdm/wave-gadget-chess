var GameState = function(board, players) {
    EventEmitter.mixin(this);
    this._isEnded = false;
    this._init(board, players);
};

GameState.prototype._onEnd = function() {
    this._isEnded = true;
    this.emit('end', function() {
        return [];
    });
};

GameState.prototype._addBoardListeners = function(board) {
    board.on('checkmate', $.proxy(this._onEnd, this));
    board.on('stalemate', $.proxy(this._onEnd, this));
};

GameState.prototype._addPlayersListeners = function(players) {
    players.on('give-up', $.proxy(this._onEnd, this));
};

GameState.prototype._init = function(board, players) {
    this._addBoardListeners(board);
    this._addPlayersListeners(players);
};

GameState.prototype.isEnded = function() {
    return this._isEnded;
};
