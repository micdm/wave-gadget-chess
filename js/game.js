var Game = function(users) {
    EventEmitter.mixin(this);
    this._board = null;
    this._players = null;
    this._init(users);
};

Game.prototype._onMovePiece = function(piece, row, col) {
    var id = piece.getId();
    var info = this._board.getPiece(id);
    this.emit('update', {
        type: 'move',
        from: {row: info.row, col: info.col},
        to: {row: row, col: col}
    });
    this._players.lock();
};

Game.prototype._onAttackPiece = function(row, col) {
    this.emit('update', {type: 'remove', row: row, col: col});
};

Game.prototype._initBoard = function() {
    this._board = new Board();
    var view = new BoardView(this._board, {
        onMove: $.proxy(this._onMovePiece, this),
        onAttack: $.proxy(this._onAttackPiece, this)
    });
    view.init();
};

Game.prototype._onNewPlayer = function(color, player) {
    this.emit('update', {type: 'player', color: color, id: player.getId()});
};

Game.prototype._initPlayers = function(users) {
    this._players = new Players(users);
    this._players.on('new', $.proxy(this._onNewPlayer, this));
    var view = new PlayersView(this._players);
    view.init();
    this._players.turn();
};

Game.prototype._createPieces = function() {
    for (var i in Piece.COLORS) {
        var color = Piece.COLORS[i];
        var builder = new PieceBuilder(color, this._board);
        builder.build();
    }
};

Game.prototype._init = function(users) {
    this._initBoard();
    this._initPlayers(users);
    this._createPieces();
};

Game.prototype.update = function(update) {
    if (update.type == 'player') {
        this._players.set(update.color, update.id);
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
