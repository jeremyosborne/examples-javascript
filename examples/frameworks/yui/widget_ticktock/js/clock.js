YUI.add("clock", function(Y) {

    var Clock = Y.Base.create('clock', Y.Widget, [], {
        initializer: function(cfg) {            
            Y.log("The following config object was passed into the Clock initializer.");
            Y.log(cfg);
            
            this.after("_timeChange", function() {
                this.refresh();
            });
        },
        
        _TEMPLATE: '<span class="time">{{time}}</span>',

        _intervalId: null,

        _tick: function() {
            var ms = this.get("_time").getTime();
            this.set("_time", new Date(ms + 1000));
            this.fire("tick");
        },
            
        start: function() {
            var self = this;
            this._intervalId = setInterval(function() {
                self._tick();
            }, 1000);
        },
        
        stop: function() {
            clearInterval(this._intervalId);
        },
        
        getHours: function() {
            return this.get("_time").getHours() & 12 || 12;
        },
        
        getMinutes: function() {
            return this.get("_time").getMinutes();
        },
        
        getSeconds: function() {
            return this.get("_time").getSeconds();
        },
        
        getAmPm: function() {
            return this.getHours() > 12 ? 'pm' : 'am';
        },
        
        _zfill: function(number) {
            return ('0' + number).slice(-2);
        },
    
        renderUI: function() {
            this.refresh();
        },
    
        refresh: function() {
            var time;
            var zfill = this._zfill;
            
            if (this.get("contentBox")) {
                time = zfill(this.getHours()) +
                   ':' + 
                   zfill(this.getMinutes()) +
                   ':' + 
                   zfill(this.getSeconds()) +
                   this.getAmPm();
                   
                this.get("contentBox").setHTML(  
                    this._TEMPLATE.replace(/\{{time\}}/, time)
                );
            }
        }
    },
    {
        ATTRS: {
            _time: {
                valueFn: function () {
                    return new Date();
                },
                validator: Y.Lang.isDate
            },
    
        }
    });
    
    Y.Clock = Clock;

}, "0.0.1", {
    requires: ["node", "base", "widget"]
});

