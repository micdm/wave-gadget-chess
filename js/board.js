var Board = function() {
    this._node = $('.board');
    this._field = null;
};

Board.SIZE = 8;

Board.prototype._createField = function() {
    this._field = [];
    for (var i = 0; i < Board.SIZE; i += 1) {
        var row = [];
        for (var j = 0; j < Board.SIZE; j += 1) {
            row.push(null);
        }
        this._field.push(row);
    }
};

Board.prototype._createFieldTable = function() {
    var table = $('<table></table>');
    for (var i = 0; i < Board.SIZE; i += 1) {
        var row = $('<tr></tr>');
        for (var j = 0; j < Board.SIZE; j += 1) {
            row.append('<td></td>');
        }
        table.append(row);
    }
    this._node.append(table);
};

Board.prototype._createPieces = function() {
    for (var i in Piece.COLORS) {
        var color = Piece.COLORS[i];
        var builder = new PieceBuilder(color, this._field, this._node);
        builder.build();
    }
};

Board.prototype.init = function() {
    this._createField();
    this._createFieldTable();
    this._createPieces();
};
