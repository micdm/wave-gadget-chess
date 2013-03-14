var Game = function(users, callbacks) {
    this._board = null;
    this._boardView = null;
    this._players = null;
    this._users = users;
    this._callbacks = callbacks;
};

Game.prototype._callUpdate = function(data) {
    if (data.type == 'move') {
        if (!this._players.has()) {
            var viewer = this._users.getViewer();
            this._callbacks.onUpdate({
                type: 'player',
                color: this._players.getColor(),
                id: viewer.id
            });
        }
        this._players.lock();
    }
    this._callbacks.onUpdate(data);
};

Game.prototype._initBoard = function() {
    this._board = new Board();
    this._boardView = new BoardView(this._board);
    this._boardView.init();
};

Game.prototype._initPlayers = function() {
    this._players = new Players();
    this._players.init();
};

Game.prototype._createPieces = function() {
    for (var i in Piece.COLORS) {
        var color = Piece.COLORS[i];
        var builder = new PieceBuilder(color, this._board);
        builder.build();
    }
};

Game.prototype.init = function() {
    this._initBoard();
    this._initPlayers();
    this._createPieces();
};

Game.prototype.update = function(update) {
    if (update.type == 'player') {
        var info = this._users.get(update.id);
        this._players.set(update.color, info.id, info.name, info.avatar);
    }
    if (update.type == 'remove') {
        var piece = this._board.getPieceByCoords(update.row, update.col);
        this._board.removePiece(piece);
    }
    if (update.type == 'move') {
        var piece = this._board.getPieceByCoords(update.from.row, update.from.col);
        this._board.movePiece(piece, update.to.row, update.to.col);
        this._players.turn();
    }
};
