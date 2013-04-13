var Notifier = function(board, players) {
    this._isEnabled = false;
    this._board = board;
    this._players = players;
    this._init();
};

Notifier.prototype._notify = function(msg) {
    if (!this._isEnabled) {
        return;
    }
    if (!document.webkitHidden) {
        return;
    }
    if (this._players.isViewerNowMoving()) {
        return;
    }
    try {
        var notification = webkitNotifications.createNotification('', 'Chess Gadget', msg);
        notification.show();
    } catch (e) {

    }
};

Notifier.prototype._addBoardListeners = function() {
    this._board.on('move', $.proxy(function(fromRow, fromCol, toRow, toCol, piece) {
        var to = Board.getColLetter(toCol) + Board.getRowNumber(toRow);
        this._notify('Opponent has moved the ' + piece.getType() + ' to ' + to + '.');
    }, this));
};

Notifier.prototype._addPlayersListeners = function() {
    this._players.on('give-up', $.proxy(function() {
        this._notify('Opponent has given up.');
    }, this));
};

Notifier.prototype._init = function() {
    if (!this.canBeUsed()) {
        return;
    }
    this._addBoardListeners();
    this._addPlayersListeners();
};

Notifier.prototype.canBeUsed = function() {
    return window.webkitNotifications != null && document.webkitHidden != null;
};

Notifier.prototype.enable = function() {
    this._isEnabled = true;
};
