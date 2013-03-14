var Piece = function(id, color) {
    this._id = id;
    this._color = color;
    this._node = null;
};

Piece.COLORS = {
    WHITE: 'white',
    BLACK: 'black'
};

Piece.TYPES = {
    PAWN: 'pawn',
    KNIGHT: 'knight',
    ROOK: 'rook',
    BISHOP: 'bishop',
    QUEEN: 'queen',
    KING: 'king'
};

Piece.get = function(color, implementation) {
    if (!Piece._id) {
        Piece._id = 0;
    }
    var piece = new implementation(Piece._id, color);
    Piece._id += 1;
    return piece;
};

Piece.getInvertedColor = function(color) {
    return (color == Piece.COLORS.WHITE) ? Piece.COLORS.BLACK : Piece.COLORS.WHITE;
};

Piece.prototype.getId = function() {
    return this._id;
};

Piece.prototype.getColor = function() {
    return this._color;
};

Piece.prototype.getType = function() {
    throw new Error('not implemented');
};

Piece.prototype.getNode = function() {
    if (!this._node) {
        this._node = $('<div class="icon piece ' + this.getType() + ' ' + this._color + '"></div>');
    }
    return this._node;
};

var Pawn = function() {
    Piece.apply(this, arguments);
};
Pawn.prototype = new Piece();

Pawn.prototype.getType = function() {
    return Piece.TYPES.PAWN;
};

Pawn.prototype.iterateCells = function(row, col, callback) {
    if (this.getColor() == Piece.COLORS.WHITE) {
        callback(row - 1, col, 'move');
        if (row == 6) {
            callback(row - 2, col, 'move');
        }
        callback(row - 1, col - 1, 'attack');
        callback(row - 1, col + 1, 'attack');
    } else {
        callback(row + 1, col, 'move');
        if (row == 1) {
            callback(row + 2, col, 'move');
        }
        callback(row + 1, col - 1, 'attack');
        callback(row + 1, col + 1, 'attack');
    }
};

var Knight = function() {
    Piece.apply(this, arguments);
};
Knight.prototype = new Piece();

Knight.prototype.getType = function() {
    return Piece.TYPES.KNIGHT;
};

Knight.prototype.iterateCells = function(row, col, callback) {
    var offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    for (var i in offsets) {
        var offset = offsets[i];
        callback(row + offset[0], col + offset[1]);
    }
};

var Rook = function() {
    Piece.apply(this, arguments);
};
Rook.prototype = new Piece();

Rook.prototype.getType = function() {
    return Piece.TYPES.ROOK;
};

Rook.prototype.iterateCells = function(row, col, callback) {
    for (var i = col - 1; i >= 0; i -= 1) {
        if (!callback(row, i)) {
            break;
        }
    }
    for (var i = col + 1; i < Board.SIZE; i += 1) {
        if (!callback(row, i)) {
            break;
        }
    }
    for (var i = row - 1; i >= 0; i -= 1) {
        if (!callback(i, col)) {
            break;
        }
    }
    for (var i = row + 1; i < Board.SIZE; i += 1) {
        if (!callback(i, col)) {
            break;
        }
    }
};

var Bishop = function() {
    Piece.apply(this, arguments);
};
Bishop.prototype = new Piece();

Bishop.prototype.getType = function() {
    return Piece.TYPES.BISHOP;
};

Bishop.prototype.iterateCells = function(row, col, callback) {
    for (var i = row - 1, j = col - 1; i >= 0, j >= 0; i -= 1, j -= 1) {
        if (!callback(i, j)) {
            break;
        }
    }
    for (var i = row - 1, j = col + 1; i >= 0, j < Board.SIZE; i -= 1, j += 1) {
        if (!callback(i, j)) {
            break;
        }
    }
    for (var i = row + 1, j = col - 1; i < Board.SIZE, j >= 0; i += 1, j -= 1) {
        if (!callback(i, j)) {
            break;
        }
    }
    for (var i = row + 1, j = col + 1; i < Board.SIZE, j < Board.SIZE; i += 1, j += 1) {
        if (!callback(i, j)) {
            break;
        }
    }
};

var Queen = function() {
    Piece.apply(this, arguments);
};
Queen.prototype = new Piece();

Queen.prototype.getType = function() {
    return Piece.TYPES.QUEEN;
};

Queen.prototype.iterateCells = function(row, col, callback) {
    for (var i = col - 1; i >= 0; i -= 1) {
        if (!callback(row, i)) {
            break;
        }
    }
    for (var i = col + 1; i < Board.SIZE; i += 1) {
        if (!callback(row, i)) {
            break;
        }
    }
    for (var i = row - 1; i >= 0; i -= 1) {
        if (!callback(i, col)) {
            break;
        }
    }
    for (var i = row + 1; i < Board.SIZE; i += 1) {
        if (!callback(i, col)) {
            break;
        }
    }
    for (var i = row - 1, j = col - 1; i >= 0, j >= 0; i -= 1, j -= 1) {
        if (!callback(i, j)) {
            break;
        }
    }
    for (var i = row - 1, j = col + 1; i >= 0, j < Board.SIZE; i -= 1, j += 1) {
        if (!callback(i, j)) {
            break;
        }
    }
    for (var i = row + 1, j = col - 1; i < Board.SIZE, j >= 0; i += 1, j -= 1) {
        if (!callback(i, j)) {
            break;
        }
    }
    for (var i = row + 1, j = col + 1; i < Board.SIZE, j < Board.SIZE; i += 1, j += 1) {
        if (!callback(i, j)) {
            break;
        }
    }
};

var King = function() {
    Piece.apply(this, arguments);
};
King.prototype = new Piece();

King.prototype.getType = function() {
    return Piece.TYPES.KING;
};

King.prototype.iterateCells = function(row, col, callback) {
    var offsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (var i in offsets) {
        var offset = offsets[i];
        callback(row + offset[0], col + offset[1]);
    }
};

var MoveSearch = function(board, piece, checksOnly) {
    this._board = board;
    this._piece = piece;
    this._checksOnly = checksOnly;
    this._moves = [];
};

MoveSearch.prototype._willBeCheck = function(move) {
    var changed = Board.getCopy(this._board);
    if (move.attack) {
        var field = changed.getField();
        var piece = field[move.row][move.col];
        changed.removePiece(piece);
    }
    changed.movePiece(this._piece, move.row, move.col);
    return changed.isCheck();
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
    if (!piece && (!extra || extra == 'move')) {
        var move = {row: row, col: col};
        if (!this._checksOnly && !this._willBeCheck(move)) {
            this._moves.push(move);
        }
        return true;
    }
    if (piece.getType() == Piece.TYPES.KING && (!extra || extra == 'attack')) {
        this._moves.push({row: row, col: col, check: true});
        return false;
    }
    if (piece.getColor() != this._color && (!extra || extra == 'attack')) {
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
