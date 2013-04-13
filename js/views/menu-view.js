var MenuView = function(menu) {
    this._menu = menu;
    this._node = null;
    this._init();
};

MenuView.prototype._addMenuListeners = function() {
    this._menu.on('add', $.proxy(function(name, title, position, callback) {
        var node = $('<div class="menu-item menu-item-' + name + '">' + title + '</div>');
        node.click(callback);
        var list = this._node.find('.menu-list');
        if (position == 'top') {
            list.prepend(node);
        } else {
            list.append(node);
        }
    }, this));
    this._menu.on('enable', $.proxy(function(name) {
        this._node.find('.menu-item-' + name).removeClass('hidden');
        this._node.find('.menu-button').addClass('active');
    }, this));
    this._menu.on('disable', $.proxy(function(name) {
        this._node.find('.menu-item-' + name).addClass('hidden');
        var hasItems = (this._node.find('.menu-item:not(.hidden)').length != 0);
        this._node.find('.menu-button').toggleClass('active', hasItems);
    }, this));
};

MenuView.prototype._addMouseListeners = function() {
    this._node.click($.proxy(function(event) {
        var element = $(event.target);
        if (element.hasClass('menu-button')) {
            if (this._node.find('.menu-button').hasClass('active')) {
                this._node.find('.menu-list').toggleClass('visible');
            }
        }
        if (element.hasClass('menu-item')) {
            this._node.find('.menu-list').removeClass('visible');
        }
    }, this));
};

MenuView.prototype._addKeyboardListeners = function() {
    $(document).keyup($.proxy(function(event) {
        if (event.which == 27) {
            this._node.find('.menu-list').removeClass('visible');
        }
    }, this));
};

MenuView.prototype._init = function() {
    this._node = $('.menu');
    this._addMenuListeners();
    this._addMouseListeners();
    this._addKeyboardListeners();
};
