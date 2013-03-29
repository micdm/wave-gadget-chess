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
        changed.removePiece(piece, true);
    }
    changed.movePiece(this._piece, row, col);
    var color = this._piece.getColor();
    return changed.isCheck(color);
};

MoveSearch.prototype._checkMove = function(row, col, extra) {
    if (!this._board.areCoordsCorrect(row, col)) {
        return false;
    }
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
    if (this._willBeCheck(toRow, toCol)) {
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

MoveSearch.prototype._canPromotion = function(toRow, toCol) {
    var piece = this._board.getPieceByCoords(toRow, toCol);
    if (piece) {
        return false;
    }
    if (this._willBeCheck(toRow, toCol)) {
        return false;
    }
    return true;
};

MoveSearch.prototype._checkForPromotion = function(fromRow, fromCol) {
    var toRow = (this._piece.getColor() == Piece.COLORS.WHITE) ? 0 : 7;
    var toCol = fromCol;
    if (this._canPromotion(toRow, toCol)) {
        for (var i in this._moves) {
            var move = this._moves[i];
            if (move.row == toRow && move.col == toCol) {
                move.type = 'promotion';
                break;
            }
        }
    }
};

MoveSearch.prototype._addPawnExtraMoves = function() {
    var coords = this._board.getPieceCoords(this._piece);
    this._checkForEnPassant(coords.row, coords.col, 'left');
    this._checkForEnPassant(coords.row, coords.col, 'right');
    this._checkForPromotion(coords.row, coords.col);
};

MoveSearch.prototype._canCastling = function(row, col, length) {
    if (this._board.isMoved(this._piece)) {
        return null;
    }
    var corner = (length == 'long') ? 0 : 7;
    var piece = this._board.getPieceByCoords(row, corner);
    if (!piece) {
        return false;
    }
    var color = this._piece.getColor();
    if (piece.getColor() != color) {
        return false;
    }
    if (piece.getType() != Piece.TYPES.ROOK) {
        return false;
    }
    if (this._board.isMoved(piece)) {
        return false;
    }
    var step = (length == 'long') ? -1 : 1;
    for (var i = col + step; i != corner; i += step) {
        if (this._board.getPieceByCoords(row, i)) {
            return false;
        }
    }
    if (this._board.isCheck(color)) {
        return false;
    }
    for (var i = col + step, j = 0; j < 2; i += step, j += 1) {
        if (this._willBeCheck(row, i)) {
            return false;
        }
    }
    return true;
};

MoveSearch.prototype._checkForCastling = function(row, col, length) {
    if (this._canCastling(row, col, length)) {
        var col = (length == 'long') ? 2 : 6;
        var type = (length == 'long') ? 'long-castling' : 'short-castling';
        var move = {row: row, col: col, type: type};
        this._moves.push(move);
    }
};

MoveSearch.prototype._addKingExtraMoves = function() {
    var coords = this._board.getPieceCoords(this._piece);
    this._checkForCastling(coords.row, coords.col, 'long');
    this._checkForCastling(coords.row, coords.col, 'short');
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
    if (!this._checksOnly) {
        this._addExtraMoves();
    }
    return this._moves;
};
