var Game = function(users) {
    EventEmitter.mixin(this);
    this._board = null;
    this._players = null;
    this._init(users);
};

Game.prototype._onMovePiece = function(piece, row, col) {
    if (!this._players.canPlay(piece.getColor())) {
        return;
    }
    this._players.lock();
    this._players.checkForNewPlayer();
    var coords = this._board.getPieceCoords(piece);
    this.emit('update', function() {
        return [{
            type: 'move',
            from: {row: coords.row, col: coords.col},
            to: {row: row, col: col}
        }];
    });
};

Game.prototype._onAttackPiece = function(piece, row, col) {
    if (!this._players.canPlay(piece.getColor())) {
        return;
    }
    this._players.lock();
    this._players.checkForNewPlayer();
    var coords = this._board.getPieceCoords(piece);
    this.emit('update', function() {
        return [{
            type: 'attack',
            from: {row: coords.row, col: coords.col},
            to: {row: row, col: col}
        }];
    });
};

Game.prototype._onEnPassant = function(piece, row, col) {
    if (!this._players.canPlay(piece.getColor())) {
        return;
    }
    this._players.lock();
    this._players.checkForNewPlayer();
    var coords = this._board.getPieceCoords(piece);
    this.emit('update', function() {
        return [{
            type: 'en-passant',
            from: {row: coords.row, col: coords.col},
            to: {row: row, col: col}
        }];
    });
};

Game.prototype._onPromotion = function(piece, row, col, replacement) {
    if (!this._players.canPlay(piece.getColor())) {
        return;
    }
    this._players.lock();
    this._players.checkForNewPlayer();
    var coords = this._board.getPieceCoords(piece);
    this.emit('update', function() {
        return [{
            type: 'promotion',
            from: {row: coords.row, col: coords.col},
            to: {row: row, col: col},
            replacement: replacement
        }];
    });
};

Game.prototype._onCastling = function(piece, length) {
    if (!this._players.canPlay(piece.getColor())) {
        return;
    }
    this._players.lock();
    this._players.checkForNewPlayer();
    this.emit('update', function() {
        return [{
            type: 'castling',
            color: piece.getColor(),
            length: length
        }];
    });
};

Game.prototype._initBoard = function() {
    this._board = new Board();
    var view = new BoardView(this._board);
    view.on('move', $.proxy(this._onMovePiece, this));
    view.on('attack', $.proxy(this._onAttackPiece, this));
    view.on('en-passant', $.proxy(this._onEnPassant, this));
    view.on('promotion', $.proxy(this._onPromotion, this));
    view.on('castling', $.proxy(this._onCastling, this));
    
};

Game.prototype._onNewPlayer = function(color, player) {
    this.emit('update', function() {
        return [{
            type: 'player',
            color: color,
            id: player.getId()}
        ];
    });
};

Game.prototype._initPlayers = function(users) {
    this._players = new Players(users);
    this._players.on('new', $.proxy(this._onNewPlayer, this));
    var view = new PlayersView(this._players);
    this._players.turn();
};

Game.prototype._initHint = function() {
    var view = new HintView(this._board, this._players);
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
    this._initHint();
    this._createPieces();
};

Game.prototype.update = function(update) {
    if (update.type == 'player') {
        this._players.set(update.color, update.id);
    }
    if (update.type == 'move') {
        var piece = this._board.getPieceByCoords(update.from.row, update.from.col);
        this._board.movePiece(piece, update.to.row, update.to.col);
        this._players.turn();
    }
    if (update.type == 'attack') {
        var victim = this._board.getPieceByCoords(update.to.row, update.to.col);
        this._board.removePiece(victim);
        var attacker = this._board.getPieceByCoords(update.from.row, update.from.col);
        this._board.movePiece(attacker, update.to.row, update.to.col);
        this._players.turn();
    }
    if (update.type == 'en-passant') {
        var victim = this._board.getPieceByCoords(update.from.row, update.to.col);
        this._board.removePiece(victim);
        var attacker = this._board.getPieceByCoords(update.from.row, update.from.col);
        this._board.movePiece(attacker, update.to.row, update.to.col);
        this._players.turn();
    }
    if (update.type == 'promotion') {
        var piece = this._board.getPieceByCoords(update.from.row, update.from.col);
        this._board.removePiece(piece);
        var replacement = Piece.get(piece.getColor(), update.replacement);
        this._board.placePiece(update.from.row, update.from.col, replacement);
        this._board.movePiece(replacement, update.to.row, update.to.col);
        this._players.turn();
    }
    if (update.type == 'castling') {
        var king = this._board.getPieceByColorAndType(update.color, Piece.TYPES.KING);
        var coords = this._board.getPieceCoords(king);
        var rook = this._board.getPieceByCoords(coords.row, update.length == 'long' ? 0 : 7);
        if (update.length == 'long') {
            this._board.movePiece(rook, coords.row, 3);
            this._board.movePiece(king, coords.row, 2);
        } else {
            this._board.movePiece(rook, coords.row, 5);
            this._board.movePiece(king, coords.row, 6);
        }
        this._players.turn();
    }
};
