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
    target.emit = function(event) {
        console.log(target, 'emitts', event);
        if (!(event in callbacks)) {
            return;
        }
        var handlers = callbacks[event];
        for (var i in handlers) {
            handlers[i].apply(null, Array.apply(null, arguments).slice(1));
        }
    };
};
