var Menu = function() {
    EventEmitter.mixin(this);
};

Menu.prototype.add = function(name, title, position, callback) {
    this.emit('add', function() {
        return [name, title, position, callback];
    });
};

Menu.prototype.enable = function(name) {
    this.emit('enable', function() {
        return [name];
    });
};

Menu.prototype.disable = function(name) {
    this.emit('disable', function() {
        return [name];
    });
};
