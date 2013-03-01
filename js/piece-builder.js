var PieceBuilder = function(color, field, node) {
    this._color = color;
    this._field = field;
    this._node = node;
};

PieceBuilder.prototype._createPiece = function(type, x, y) {
    var piece = new Piece(type, this._color);
    this._field[y][x] = piece;
    var node = piece.getNode();
    this._node.find('tr:eq(' + y + ') td:eq(' + x + ')').append(node);
};

PieceBuilder.prototype._createPawns = function() {
    var y = this._color == Piece.COLORS.WHITE ? 6 : 1;
    for (var x = 0; x < 8; x += 1) {
        this._createPiece(Piece.TYPES.PAWN, x, y);
    }
};

PieceBuilder.prototype._createOtherPieces = function() {
    var y = this._color == Piece.COLORS.WHITE ? 7 : 0;
    this._createPiece(Piece.TYPES.ROOK, 0, y);
    this._createPiece(Piece.TYPES.KNIGHT, 1, y);
    this._createPiece(Piece.TYPES.BISHOP, 2, y);
    this._createPiece(Piece.TYPES.QUEEN, 3, y);
    this._createPiece(Piece.TYPES.KING, 4, y);
    this._createPiece(Piece.TYPES.BISHOP, 5, y);
    this._createPiece(Piece.TYPES.KNIGHT, 6, y);
    this._createPiece(Piece.TYPES.ROOK, 7, y);
};

PieceBuilder.prototype.build = function() {
    this._createPawns();
    this._createOtherPieces();
};
