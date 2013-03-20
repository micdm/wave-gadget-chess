var PieceBuilder = function(color, board) {
    this._color = color;
    this._board = board;
};

PieceBuilder.prototype._createPiece = function(type, row, col) {
    var piece = Piece.get(this._color, type);
    this._board.placePiece(row, col, piece);
};

PieceBuilder.prototype._createPawns = function() {
    var row = this._color == Piece.COLORS.WHITE ? 6 : 1;
    for (var col = 0; col < 8; col += 1) {
        this._createPiece(Piece.TYPES.PAWN, row, col);
    }
};

PieceBuilder.prototype._createOtherPieces = function() {
    var row = this._color == Piece.COLORS.WHITE ? 7 : 0;
    this._createPiece(Piece.TYPES.ROOK, row, 0);
    this._createPiece(Piece.TYPES.KNIGHT, row, 1);
    this._createPiece(Piece.TYPES.BISHOP, row, 2);
    this._createPiece(Piece.TYPES.QUEEN, row, 3);
    this._createPiece(Piece.TYPES.KING, row, 4);
    this._createPiece(Piece.TYPES.BISHOP, row, 5);
    this._createPiece(Piece.TYPES.KNIGHT, row, 6);
    this._createPiece(Piece.TYPES.ROOK, row, 7);
};

PieceBuilder.prototype.build = function() {
    this._createPawns();
    this._createOtherPieces();
};
