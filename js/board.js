var Board = function(users, callbacks) {
    this._node = $('.board');
    this._field = null;
    this._piece = null;
    this._players = null;
    this._users = users;
    this._callbacks = callbacks;
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
        var row = $(
            '<div class="row">' +
                '<div class="number">' + (Board.SIZE - i) + '</div>' +
            '</div>'
        );
        for (var j = 0; j < Board.SIZE; j += 1) {
            row.append('<div class="cell"></div>');
        }
        this._node.append(row);
    }
    var row = $('<div class="letters"></div>');
    for (var i = 0; i < Board.SIZE; i += 1) {
        var letter = String.fromCharCode(97 + i);
        row.append('<div class="letter">' + letter + '</div>');
    }
    this._node.append(row);
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

Board.prototype._callUpdate = function(data) {
    if (data.type == 'move') {
        if (!this._players.has(this._color)) {
            var viewer = this._users.getViewer();
            this._callbacks.onUpdate({
                type: 'player',
                color: this._color,
                id: viewer.id
            });
        }
        this._players.lock();
    }
    this._callbacks.onUpdate(data);
};

Board.prototype._addClickListener = function() {
    this._node.click($.proxy(function(event) {
        var info = this._viewer.get();
        if (!this._players.canPlay(info.id)) {
            return;
        }
        var offset = this._node.offset();
        var row = Math.floor((event.pageY - offset.top) / Board.CELL_SIZE);
        var col = Math.floor((event.pageX - offset.left) / Board.CELL_SIZE);
        var element = $(event.target);
        if (element.hasClass('piece')) {
            this._choosePiece(row, col);
            this._showAvailableMoves(row, col);
        }
        if (element.hasClass('move')) {
            this._callUpdate({
                type: 'move',
                from: this._piece,
                to: {
                    row: row,
                    col: col
                }
            });
        }
        if (element.hasClass('attack')) {
            this._callUpdate({
                type: 'remove',
                row: row,
                col: col
            });
            this._callUpdate({
                type: 'move',
                from: this._piece,
                to: {
                    row: row,
                    col: col
                }
            });
        }
    }, this));
};

Board.prototype.init = function() {
    this._players = new Players();
    this._players.init();
    this._createField();
    this._createFieldTable();
    this._createPieces();
    this._addClickListener();
};

Board.prototype._movePiece = function(from, to) {
    this._field[to.row][to.col] = this._field[from.row][from.col];
    this._field[from.row][from.col] = null;
    this._node.find('.chosen, .move, .attack').remove();
    var node = this._node.find('.row:eq(' + from.row + ') .cell:eq(' + from.col + ') .piece');
    this._node.find('.row:eq(' + to.row + ') .cell:eq(' + to.col + ')').append(node);
    this._piece = null;
};

Board.prototype._removePiece = function(row, col) {
    this._field[row][col] = null;
    this._node.find('.row:eq(' + row + ') .cell:eq(' + col + ') .piece').remove();
};

Board.prototype.update = function(update) {
    if (update.type == 'player') {
        var info = this._users.get(update.id);
        this._players.set(update.color, info.id, info.name, info.avatar);
    }
    if (update.type == 'remove') {
        this._removePiece(update.row, update.col);
    }
    if (update.type == 'move') {
        this._movePiece(update.from, update.to);
        this._players.turn();
    }
};
