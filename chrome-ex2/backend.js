$(function() {
    const backend = {
        init: function() {
            const app = backend;
            var $switch = $('.js-switch');
            $switch.on('click', function() {
              app.triggerSwitch($switch);
            });
      
            app.triggerSwitch($switch, 1);
        },
        triggerSwitch: function($elem, isPageLoad) {
            const app = backend;
            let current_status = $elem.html();
            let button_label = (current_status === 'OFF') ? 'ON' : 'OFF';
            if(!isPageLoad) {
                app.set('isSwichOn', button_label);
            }

            $elem.html(app.get('isSwichOn') || 'OFF');
        },
        set: function(key, value) {
            localStorage.setItem(key, value);
        },
        get: function(key) {
            return localStorage.getItem(key);
        },
    };
    backend.init();
});
