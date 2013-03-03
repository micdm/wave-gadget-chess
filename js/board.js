var Board = function() {
    this._node = $('.board');
    this._field = null;
    this._piece = null;
};

Board.SIZE = 8;
Board.CELL_SIZE = 50;

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
    for (var i = 0; i < Board.SIZE; i += 1) {
        var row = $('<div class="row"></div>');
        for (var j = 0; j < Board.SIZE; j += 1) {
            row.append('<div class="cell"></div>');
        }
        this._node.append(row);
    }
};

Board.prototype._createPieces = function() {
    for (var i in Piece.COLORS) {
        var color = Piece.COLORS[i];
        var builder = new PieceBuilder(color, this._field, this._node);
        builder.build();
    }
};

Board.prototype._choosePiece = function(row, col) {
    this._node.find('.chosen').remove();
    var node = $('<div class="icon chosen"></div>');
    this._node.find('.row:eq(' + row + ') .cell:eq(' + col + ')').append(node);
    this._piece = {
        row: row,
        col: col
    };
};

Board.prototype._showAvailableMoves = function(row, col) {
    this._node.find('.move, .attack').remove();
    var piece = this._field[row][col];
    var moves = piece.getMoves(this._field, row, col);
    for (var i in moves) {
        var move = moves[i];
        var node = $('<div class="icon ' + (move.attack ? 'attack' : 'move') + '"></div>');
        this._node.find('.row:eq(' + move.row + ') .cell:eq(' + move.col + ')').append(node);
    }
};

Board.prototype._moveChosenPiece = function(row, col) {
    this._field[row][col] = this._field[this._piece.row][this._piece.col];
    this._field[this._piece.row][this._piece.col] = null;
    this._node.find('.chosen, .move, .attack').remove();
    var node = this._node.find('.row:eq(' + this._piece.row + ') .cell:eq(' + this._piece.col + ') .piece');
    this._node.find('.row:eq(' + row + ') .cell:eq(' + col + ')').append(node);
    this._piece = null;
};

Board.prototype._attackPiece = function(row, col) {
    this._field[row][col] = null;
    this._node.find('.row:eq(' + row + ') .cell:eq(' + col + ') .piece').remove();
};

Board.prototype._addClickListener = function() {
    this._node.click($.proxy(function(event) {
        var offset = this._node.offset();
        var row = Math.floor((event.pageY - offset.top) / Board.CELL_SIZE);
        var col = Math.floor((event.pageX - offset.left) / Board.CELL_SIZE);
        var element = $(event.target);
        if (element.hasClass('piece')) {
            this._choosePiece(row, col);
            this._showAvailableMoves(row, col);
        }
        if (element.hasClass('move')) {
            this._moveChosenPiece(row, col);
        }
        if (element.hasClass('attack')) {
            this._attackPiece(row, col);
            this._moveChosenPiece(row, col);
        }
    }, this));
};

Board.prototype.init = function() {
    this._createField();
    this._createFieldTable();
    this._createPieces();
    this._addClickListener();
};
