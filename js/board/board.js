var Board = function() {
    EventEmitter.mixin(this);
    this._field = null;
    this._pieces = null;
    this._moved = [];
    this._lastMove = null;
    this._createField();
};

Board.SIZE = 8;

Board.getCopy = function(board) {
    var copy = new Board();
    var pieces = board.getPieces();
    for (var i in pieces) {
        var info = pieces[i];
        copy.placePiece(info.row, info.col, info.piece);
    }
    return copy;
};

Board.prototype._createField = function() {
    this._field = [];
    for (var i = 0; i < Board.SIZE; i += 1) {
        var row = [];
        for (var j = 0; j < Board.SIZE; j += 1) {
            row.push(null);
        }
        this._field.push(row);
    }
    this._pieces = {};
};

Board.prototype.placePiece = function(row, col, piece) {
    this._field[row][col] = piece;
    var id = piece.getId();
    this._pieces[id] = {row: row, col: col, piece: piece};
    this.emit('place', function() {
        return [row, col, piece];
    });
};

Board.prototype.movePiece = function(piece, row, col) {
    var id = piece.getId();
    var info = this._pieces[id];
    this._field[row][col] = piece;
    this._field[info.row][info.col] = null;
    if (!this.isMoved(piece)) {
        this._moved.push(piece);
    }
    var lastMove = {piece: piece, row: info.row, col: info.col};
    this._lastMove = lastMove;
    info.row = row;
    info.col = col;
    this.emit('move', function() {
        return [lastMove.row, lastMove.col, row, col, piece];
    });
    var color = piece.getColor();
    var inverted = Piece.getInvertedColor(color);
    this.emit('check', $.proxy(function() {
        return this.isCheck(inverted) ? [inverted] : null;
    }, this));
    this.emit('checkmate', $.proxy(function() {
        return this.isCheckmate(inverted) ? [inverted] : null;
    }, this));
    this.emit('stalemate', $.proxy(function() {
        return this.isStalemate(inverted) ? [inverted] : null;
    }, this));
};

Board.prototype.removePiece = function(piece, isAttack) {
    var id = piece.getId();
    var info = this._pieces[id];
    this._field[info.row][info.col] = null;
    delete this._pieces[id];
    this.emit('remove', function() {
        return [info.row, info.col];
    });
    if (isAttack) {
        this.emit('attack', function() {
            return [piece];
        });
    }
};

Board.prototype.areCoordsCorrect = function(row, col) {
    if (!(row in this._field)) {
        return false;
    }
    if (!(col in this._field[row])) {
        return false;
    }
    return true;
};

Board.prototype.getPieces = function() {
    return this._pieces;
};

Board.prototype.getPiecesByColor = function(color) {
    var pieces = {};
    for (var i in this._pieces) {
        var info = this._pieces[i];
        var piece = info.piece;
        if (piece.getColor() == color) {
            var id = piece.getId();
            pieces[id] = info;
        }
    }
    return pieces;
};

Board.prototype.getPieceByCoords = function(row, col) {
    return this._field[row][col];
};

Board.prototype.getPieceByColorAndType = function(color, type) {
    var pieces = this.getPiecesByColor(color);
    for (var i in pieces) {
        var piece = pieces[i].piece;
        if (piece.getType() == type) {
            return piece;
        }
    }
    return null;
};

Board.prototype.getPieceCoords = function(piece) {
    var id = piece.getId();
    var info = this._pieces[id];
    return {row: info.row, col: info.col};
};

Board.prototype.isMoved = function(piece) {
    return $.inArray(piece, this._moved) != -1;
};

Board.prototype.getLastMove = function() {
    return this._lastMove;
};

Board.prototype.isCheck = function(color) {
    var inverted = Piece.getInvertedColor(color);
    var pieces = this.getPiecesByColor(inverted);
    for (var i in pieces) {
        var piece = pieces[i].piece;
        var search = new MoveSearch(this, piece, true);
        var moves = search.get();
        for (var j in moves) {
            if (moves[j].type == 'check') {
                return true;
            }
        }
    }
    return false;
};

Board.prototype._hasMoves = function(color) {
    var pieces = this.getPiecesByColor(color);
    for (var i in pieces) {
        var piece = pieces[i].piece;
        var search = new MoveSearch(this, piece);
        var moves = search.get();
        if (moves.length) {
            return true;
        }
    }
    return false;
};

Board.prototype.isCheckmate = function(color) {
    return this.isCheck(color) && !this._hasMoves(color);
};

Board.prototype.isStalemate = function(color) {
    return !this.isCheck(color) && !this._hasMoves(color);
};
