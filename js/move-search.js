var MoveSearch = function(board, piece, checksOnly) {
    this._board = board;
    this._piece = piece;
    this._checksOnly = checksOnly;
    this._moves = [];
};

MoveSearch.prototype._willBeCheck = function(move) {
    var changed = Board.getCopy(this._board);
    if (move.attack) {
        var piece = changed.getPieceByCoords(move.row, move.col);
        changed.removePiece(piece);
    }
    changed.movePiece(this._piece, move.row, move.col);
    return changed.isCheck(this._piece.getColor());
};

MoveSearch.prototype._iterate = function(row, col, extra) {
    var field = this._board.getField();
    if (!(row in field)) {
        return false;
    }
    if (!(col in field[row])) {
        return false;
    }
    var piece = field[row][col];
    if (!piece) {
        if (extra && extra != 'move') {
            return false;
        }
        var move = {row: row, col: col};
        if (!this._checksOnly && !this._willBeCheck(move)) {
            this._moves.push(move);
        }
        return true;
    }
    if (piece.getColor() != this._piece.getColor()) {
        if (extra && extra != 'attack') {
            return false;
        }
        if (piece.getType() == Piece.TYPES.KING) {
            this._moves.push({row: row, col: col, check: true});
            return false;
        }
        var move = {row: row, col: col, attack: true};
        if (!this._checksOnly && !this._willBeCheck(move)) {
            this._moves.push(move);
        }
        return false;
    }
    return false;
};

MoveSearch.prototype.get = function() {
    var id = this._piece.getId();
    var info = this._board.getPiece(id);
    this._piece.iterateCells(info.row, info.col, $.proxy(this._iterate, this));
    return this._moves;
};
