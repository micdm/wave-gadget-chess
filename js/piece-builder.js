var PieceBuilder = function(color, field) {
    this._color = color;
    this._field = field;
};

PieceBuilder.prototype._createPiece = function(type, row, col) {
    var cell = this._field[row][col];
    var piece = new type(this._color);
    cell.piece = piece;
    var node = piece.getNode();
    cell.node.append(node);
};

PieceBuilder.prototype._createPawns = function() {
    var row = this._color == Piece.COLORS.WHITE ? 6 : 1;
    for (var col = 0; col < 8; col += 1) {
        this._createPiece(Pawn, row, col);
    }
};

PieceBuilder.prototype._createOtherPieces = function() {
    var row = this._color == Piece.COLORS.WHITE ? 7 : 0;
    this._createPiece(Rook, row, 0);
    this._createPiece(Knight, row, 1);
    this._createPiece(Bishop, row, 2);
    this._createPiece(Queen, row, 3);
    this._createPiece(King, row, 4);
    this._createPiece(Bishop, row, 5);
    this._createPiece(Knight, row, 6);
    this._createPiece(Rook, row, 7);
};

PieceBuilder.prototype.build = function() {
    this._createPawns();
    this._createOtherPieces();
};
