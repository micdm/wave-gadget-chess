var Notifier = function(board, players) {
    this._board = board;
    this._players = players;
    this._init();
};

Notifier.prototype._canBeUsed = function() {
    return window.webkitNotifications != null;
};

Notifier.prototype._notify = function(msg) {
    if (document.hasFocus()) {
        return;
    }
    if (!this._players.isViewerPlaying()) {
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

Notifier.prototype._addClickListener = function() {
    $(document).click($.proxy(function(event) {
        if (this._players.isViewerPlaying()) {
            webkitNotifications.requestPermission();
            $(document).unbind(event);
        }
    }, this));
};

Notifier.prototype._init = function() {
    if (!this._canBeUsed()) {
        return;
    }
    this._addBoardListeners();
    this._addPlayersListeners();
    this._addClickListener();
};
