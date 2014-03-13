var messenger = {
    log: function() {
        return "default log message.";
    },
};

exports.messenger = (function() {
        
    if (!messenger) {
        messenger = {
            log: function() {
                return "log message override.";
            },
        };
    }
    
    return messenger;
})();
