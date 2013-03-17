var EventEmitter = function() {
    
};

EventEmitter.mixin = function(target) {
    var callbacks = {};
    target.on = function(event, callback) {
        if (!(event in callbacks)) {
            callbacks[event] = [];
        }
        callbacks[event].push(callback);
    };
    target.emit = function(event, getArguments) {
        if (!(event in callbacks)) {
            return;
        }
        var args = getArguments();
        if (!args) {
            return;
        }
        var handlers = callbacks[event];
        for (var i in handlers) {
            handlers[i].apply(null, args);
        }
    };
};
