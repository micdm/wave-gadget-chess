var Piece = function(type, color) {
    this._type = type;
    this._color = color;
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

Piece.prototype.getNode = function() {
    if (!this._node) {
        this._node = $('<div class="piece ' + this._type + ' ' + this._color + '"></div>');
    }
    return this._node;
};
