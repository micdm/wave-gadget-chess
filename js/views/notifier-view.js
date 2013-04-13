var NotifierView = function(notifier, menu) {
    this._notifier = notifier;
    this._menu = menu;
    this._init();
};

NotifierView.prototype._addMenuItems = function() {
    if (webkitNotifications.checkPermission() == 0) {
        this._menu.add('enable-notifications', 'Enable notifications', 'bottom', function() {
            webkitNotifications.requestPermission();
        });
    }
};

NotifierView.prototype._init = function() {
    if (!this._notifier.canBeUsed()) {
        return;
    }
    this._addMenuItems();
};
