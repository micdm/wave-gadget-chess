var Piece = function(id, color) {
    this._id = id;
    this._color = color;
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

Piece._getImplementationForType = function(type) {
    if (type == Piece.TYPES.PAWN) {
        return Pawn;
    }
    if (type == Piece.TYPES.KNIGHT) {
        return Knight;
    }
    if (type == Piece.TYPES.ROOK) {
        return Rook;
    }
    if (type == Piece.TYPES.BISHOP) {
        return Bishop;
    }
    if (type == Piece.TYPES.QUEEN) {
        return Queen;
    }
    if (type == Piece.TYPES.KING) {
        return King;
    }
};

Piece.get = function(color, type) {
    if (!Piece._id) {
        Piece._id = 0;
    }
    var implementation = Piece._getImplementationForType(type);
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

Piece.prototype.iterateMoves = function(row, col, callback) {
    throw new Error('not implemented');
};

var Pawn = function() {
    Piece.apply(this, arguments);
};
Pawn.prototype = new Piece();

Pawn.prototype.getType = function() {
    return Piece.TYPES.PAWN;
};

Pawn.prototype.iterateMoves = function(row, col, callback) {
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

Knight.prototype.iterateMoves = function(row, col, callback) {
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

Rook.prototype.iterateMoves = function(row, col, callback) {
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

Bishop.prototype.iterateMoves = function(row, col, callback) {
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

Queen.prototype.iterateMoves = function(row, col, callback) {
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

King.prototype.iterateMoves = function(row, col, callback) {
    var offsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (var i in offsets) {
        var offset = offsets[i];
        callback(row + offset[0], col + offset[1]);
    }
};
