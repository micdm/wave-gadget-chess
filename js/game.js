var Game = function(users, callbacks) {
    this._node = $('.board');
    this._field = null;
    this._piece = null;
    this._players = null;
    this._users = users;
    this._callbacks = callbacks;
};

Game.prototype._createField = function() {
    this._field = [];
    for (var i = 0; i < Board.SIZE; i += 1) {
        var row = [];
        for (var j = 0; j < Board.SIZE; j += 1) {
            row.push({
                piece: null,
                node: null
            });
        }
        this._field.push(row);
    }
};

Game.prototype._createFieldTable = function() {
    for (var i = 0; i < Board.SIZE; i += 1) {
        var row = $('<div class="row"></div>');
        for (var j = 0; j < Board.SIZE; j += 1) {
            var cell = $('<div class="cell"></div>');
            row.append(cell);
            this._field[i][j].node = cell;
        }
        row.append('<div class="number">' + (Board.SIZE - i) + '</div>');
        this._node.append(row);
    }
    var row = $('<div></div>');
    for (var i = 0; i < Board.SIZE; i += 1) {
        var letter = String.fromCharCode(97 + i);
        row.append('<div class="letter">' + letter + '</div>');
    }
    this._node.append(row);
};

Game.prototype._createPieces = function() {
    for (var i in Piece.COLORS) {
        var color = Piece.COLORS[i];
        var builder = new PieceBuilder(color, this._field);
        builder.build();
    }
};

Game.prototype._choosePiece = function(row, col) {
    this._node.find('.chosen').remove();
    var node = $('<div class="icon chosen"></div>');
    this._field[row][col].node.append(node);
    this._piece = {
        row: row,
        col: col
    };
};

Game.prototype._showAvailableMoves = function(row, col) {
    this._node.find('.move, .attack').remove();
    var piece = this._field[row][col].piece;
    var moves = piece.getMoves(this._field, row, col);
    for (var i in moves) {
        var move = moves[i];
        var node = $('<div class="icon ' + (move.attack ? 'attack' : 'move') + '"></div>');
        this._field[move.row][move.col].node.append(node);
    }
};

Game.prototype._callUpdate = function(data) {
    if (data.type == 'move') {
        if (!this._players.has()) {
            var viewer = this._users.getViewer();
            this._callbacks.onUpdate({
                type: 'player',
                color: this._players.getColor(),
                id: viewer.id
            });
        }
        this._players.lock();
    }
    this._callbacks.onUpdate(data);
};

Game.prototype._addClickListener = function() {
    this._node.click($.proxy(function(event) {
        var viewer = this._users.getViewer();
        if (!this._players.canPlay(viewer.id)) {
            //return;
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

Game.prototype.init = function() {
    this._players = new Players();
    this._players.init();
    this._createField();
    this._createFieldTable();
    this._createPieces();
    this._addClickListener();
};

Game.prototype._movePiece = function(from, to) {
    var fromCell = this._field[from.row][from.col];
    var toCell = this._field[to.row][to.col];
    toCell.piece = fromCell.piece;
    fromCell.piece = null;
    this._node.find('.chosen, .move, .attack').remove();
    var node = fromCell.node.find('.piece');
    toCell.node.append(node);
    this._piece = null;
};

Game.prototype._removePiece = function(row, col) {
    var cell = this._field[row][col];
    cell.piece = null;
    cell.node.find('.piece').remove();
};

Game.prototype.update = function(update) {
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
