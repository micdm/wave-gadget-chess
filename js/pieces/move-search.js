var MoveSearch = function(board, piece, checksOnly) {
    this._board = board;
    this._piece = piece;
    this._checksOnly = checksOnly;
    this._moves = [];
};

MoveSearch.prototype._willBeCheck = function(row, col) {
    var changed = Board.getCopy(this._board);
    var piece = changed.getPieceByCoords(row, col);
    if (piece) {
        changed.removePiece(piece);
    }
    changed.movePiece(this._piece, row, col);
    var color = this._piece.getColor();
    return changed.isCheck(color);
};

MoveSearch.prototype._checkMove = function(row, col, extra) {
    var piece = this._board.getPieceByCoords(row, col);
    if (!piece) {
        if (extra && extra != 'move') {
            return false;
        }
        if (!this._checksOnly && !this._willBeCheck(row, col)) {
            var move = {row: row, col: col, type: 'move'};
            this._moves.push(move);
        }
        return true;
    }
    if (piece.getColor() != this._piece.getColor()) {
        if (extra && extra != 'attack') {
            return false;
        }
        if (piece.getType() == Piece.TYPES.KING) {
            this._moves.push({row: row, col: col, type: 'check'});
            return false;
        }
        if (!this._checksOnly && !this._willBeCheck(row, col)) {
            var move = {row: row, col: col, type: 'attack'};
            this._moves.push(move);
        }
        return false;
    }
    return false;
};

MoveSearch.prototype._canEnPassant = function(fromRow, fromCol, toRow, toCol) {
    if (!this._board.areCoordsCorrect(toRow, toCol)) {
        return false;
    }
    var piece = this._board.getPieceByCoords(fromRow, toCol);
    if (!piece) {
        return false;
    }
    if (piece.getColor() == this._piece.getColor()) {
        return false;
    }
    if (piece.getType() != Piece.TYPES.PAWN) {
        return false;
    }
    var lastMove = this._board.getLastMove();
    if (!lastMove) {
        return false;
    }
    if (piece != lastMove.piece) {
        return false;
    }
    if (Math.abs(lastMove.row - fromRow) != 2) {
        return false;
    }
    return true;
};

MoveSearch.prototype._checkForEnPassant = function(fromRow, fromCol, type) {
    var toRow = (this._piece.getColor() == Piece.COLORS.WHITE) ? fromRow - 1 : fromRow + 1;
    var toCol = (type == 'left') ? fromCol - 1 : fromCol + 1;
    if (this._canEnPassant(fromRow, fromCol, toRow, toCol)) {
        var move = {row: toRow, col: toCol, type: 'en-passant'}; 
        this._moves.push(move);
    }
};

MoveSearch.prototype._addPawnExtraMoves = function() {
    var coords = this._board.getPieceCoords(this._piece);
    this._checkForEnPassant(coords.row, coords.col, 'left');
    this._checkForEnPassant(coords.row, coords.col, 'right');
};

MoveSearch.prototype._canCastling = function(row, col, type) {
    if (this._board.isMoved(this._piece)) {
        return null;
    }
    var corner = (type == 'long') ? 0 : 7;
    var piece = this._board.getPieceByCoords(row, corner);
    if (!piece) {
        return false;
    }
    if (piece.getColor() != this._piece.getColor()) {
        return false;
    }
    if (piece.getType() != Piece.TYPES.ROOK) {
        return false;
    }
    if (this._board.isMoved(piece)) {
        return false;
    }
    var step = (type == 'long') ? -1 : 1;
    for (var i = col + step; i != corner; i += step) {
        if (this._board.getPieceByCoords(row, i)) {
            return false;
        }
    }
    for (var i = col + step, j = 0; j < 2; i += step, j += 1) {
        if (this._willBeCheck(row, i)) {
            return false;
        }
    }
    return true;
};

MoveSearch.prototype._addKingExtraMoves = function() {
    var coords = this._board.getPieceCoords(this._piece);
    if (this._canCastling(coords.row, coords.col, 'long')) {
        var move = {row: coords.row, col: 2, type: 'long-castling'};
        this._moves.push(move);
    }
    if (this._canCastling(coords.row, coords.col, 'short')) {
        var move = {row: coords.row, col: 6, type: 'short-castling'};
        this._moves.push(move);
    }
};

MoveSearch.prototype._addExtraMoves = function() {
    var type = this._piece.getType();
    if (type == Piece.TYPES.PAWN) {
        this._addPawnExtraMoves();
    }
    if (type == Piece.TYPES.KING) {
        this._addKingExtraMoves();
    }
};

MoveSearch.prototype.get = function() {
    var coords = this._board.getPieceCoords(this._piece);
    this._piece.iterateMoves(coords.row, coords.col, $.proxy(this._checkMove, this));
    this._addExtraMoves();
    return this._moves;
};
