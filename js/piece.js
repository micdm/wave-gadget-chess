var Piece = function(type) {
    this._type = type;
    this._node = null;
};

Piece.TYPES = {
    PAWN: 'pawn',
    KNIGHT: 'knight',
    ROOK: 'rook',
    BISHOP: 'bishop',
    QUEEN: 'queen',
    KING: 'king'
};

Piece.COLORS = {
    WHITE: 'white',
    BLACK: 'black'
};

Piece.prototype.hasType = function(type) {
    return this._type == type;
};

Piece.prototype.hasColor = function(color) {
    return this._color == color;
};

Piece.prototype.getNode = function() {
    if (!this._node) {
        this._node = $('<div class="icon piece ' + this._type + ' ' + this._color + '"></div>');
    }
    return this._node;
};

Piece.prototype._addMove = function(field, row, col, moves) {
    var cells = field[row];
    if (!cells) {
        return false;
    }
    var cell = cells[col];
    if (!cell) {
        moves.push({
            row: row,
            col: col
        });
        return true;
    }
    if (cell.hasType(Piece.TYPES.KING)) {
        return false;
    }
    if (!cell.hasColor(this._color)) {
        moves.push({
            row: row,
            col: col,
            attack: true
        });
    }
    return false;
};

var Pawn = function(color) {
    this._color = color;
};
Pawn.prototype = new Piece(Piece.TYPES.PAWN);

Pawn.prototype._addMove = function(field, row, col, isAttack, moves) {
    var cell = field[row][col];
    if (isAttack) {
        if (!cell) {
            return false;
        }
        if (!cell.hasColor(this._color) && !cell.hasType(Piece.TYPES.KING)) {
            moves.push({
                row: row,
                col: col,
                attack: true
            });
            return true;            
        }
        return false;
    }
    if (cell) {
        return false;
    }
    moves.push({
        row: row,
        col: col
    });
    return true;
};

Pawn.prototype.getMoves = function(field, row, col) {
    var moves = [];
    if (this.hasColor(Piece.COLORS.WHITE)) {
        this._addMove(field, row - 1, col, false, moves);
        if (row == 6) {
            this._addMove(field, row - 2, col, false, moves);
        }
        this._addMove(field, row - 1, col - 1, true, moves);
        this._addMove(field, row - 1, col + 1, true, moves);
    } else {
        this._addMove(field, row + 1, col, false, moves);
        if (row == 1) {
            this._addMove(field, row + 2, col, false, moves);
        }
        this._addMove(field, row + 1, col - 1, true, moves);
        this._addMove(field, row + 1, col + 1, true, moves);
    }
    return moves;
};

var Knight = function(color) {
    this._color = color;
};
Knight.prototype = new Piece(Piece.TYPES.KNIGHT);

Knight.prototype.getMoves = function(field, row, col) {
    var moves = [];
    this._addMove(field, row - 2, col - 1, moves);
    this._addMove(field, row - 2, col + 1, moves);
    this._addMove(field, row - 1, col - 2, moves);
    this._addMove(field, row - 1, col + 2, moves);
    this._addMove(field, row + 1, col - 2, moves);
    this._addMove(field, row + 1, col + 2, moves);
    this._addMove(field, row + 2, col - 1, moves);
    this._addMove(field, row + 2, col + 1, moves);
    return moves;
};

var Rook = function(color) {
    this._color = color;
};
Rook.prototype = new Piece(Piece.TYPES.ROOK);

Rook.prototype.getMoves = function(field, row, col) {
    var moves = [];
    for (var i = col - 1; i >= 0; i -= 1) {
        if (!this._addMove(field, row, i, moves)) {
            break;
        }
    }
    for (var i = col + 1; i < Board.SIZE; i += 1) {
        if (!this._addMove(field, row, i, moves)) {
            break;
        }
    }
    for (var i = row - 1; i >= 0; i -= 1) {
        if (!this._addMove(field, i, col, moves)) {
            break;
        }
    }
    for (var i = row + 1; i < Board.SIZE; i += 1) {
        if (!this._addMove(field, i, col, moves)) {
            break;
        }
    }
    return moves;
};

var Bishop = function(color) {
    this._color = color;
};
Bishop.prototype = new Piece(Piece.TYPES.BISHOP);

Bishop.prototype.getMoves = function(field, row, col) {
    var moves = [];
    for (var i = row - 1, j = col - 1; i >= 0, j >= 0; i -= 1, j -= 1) {
        if (!this._addMove(field, i, j, moves)) {
            break;
        }
    }
    for (var i = row - 1, j = col + 1; i >= 0, j < Board.SIZE; i -= 1, j += 1) {
        if (!this._addMove(field, i, j, moves)) {
            break;
        }
    }
    for (var i = row + 1, j = col - 1; i < Board.SIZE, j >= 0; i += 1, j -= 1) {
        if (!this._addMove(field, i, j, moves)) {
            break;
        }
    }
    for (var i = row + 1, j = col + 1; i < Board.SIZE, j < Board.SIZE; i += 1, j += 1) {
        if (!this._addMove(field, i, j, moves)) {
            break;
        }
    }
    return moves;
};

var Queen = function(color) {
    this._color = color;
};
Queen.prototype = new Piece(Piece.TYPES.QUEEN);

Queen.prototype.getMoves = function(field, row, col) {
    var moves = [];
    for (var i = col - 1; i >= 0; i -= 1) {
        if (!this._addMove(field, row, i, moves)) {
            break;
        }
    }
    for (var i = col + 1; i < Board.SIZE; i += 1) {
        if (!this._addMove(field, row, i, moves)) {
            break;
        }
    }
    for (var i = row - 1; i >= 0; i -= 1) {
        if (!this._addMove(field, i, col, moves)) {
            break;
        }
    }
    for (var i = row + 1; i < Board.SIZE; i += 1) {
        if (!this._addMove(field, i, col, moves)) {
            break;
        }
    }
    for (var i = row - 1, j = col - 1; i >= 0, j >= 0; i -= 1, j -= 1) {
        if (!this._addMove(field, i, j, moves)) {
            break;
        }
    }
    for (var i = row - 1, j = col + 1; i >= 0, j < Board.SIZE; i -= 1, j += 1) {
        if (!this._addMove(field, i, j, moves)) {
            break;
        }
    }
    for (var i = row + 1, j = col - 1; i < Board.SIZE, j >= 0; i += 1, j -= 1) {
        if (!this._addMove(field, i, j, moves)) {
            break;
        }
    }
    for (var i = row + 1, j = col + 1; i < Board.SIZE, j < Board.SIZE; i += 1, j += 1) {
        if (!this._addMove(field, i, j, moves)) {
            break;
        }
    }
    return moves;
};

var King = function(color) {
    this._color = color;
};
King.prototype = new Piece(Piece.TYPES.KING);

King.prototype.getMoves = function(field, row, col) {
    var moves = [];
    this._addMove(field, row - 1, col - 1, moves);
    this._addMove(field, row - 1, col, moves);
    this._addMove(field, row - 1, col + 1, moves);
    this._addMove(field, row, col - 1, moves);
    this._addMove(field, row, col + 1, moves);
    this._addMove(field, row + 1, col - 1, moves);
    this._addMove(field, row + 1, col, moves);
    this._addMove(field, row + 1, col + 1, moves);
    return moves;
};
