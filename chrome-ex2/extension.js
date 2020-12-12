$(function() {
  var App = {
    output: null,
    $current_elem: '',
    $oldElem: '',
    isHtml: true,
    cssOptions: {},
    isOn: false,
    init: function() {
      var app = App;
      App.$mainElem = App.renderContainer();

      app.setPanelLan($('.js-language-selector'));
      $(document).on('change', '.js-language-selector', function() {
        app.setLanguage($(this));
      });

      var mouseDown = false;
      $(document).on('mousedown', '.js-move', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        mouseDown =  true;
      });
      $(document).on('mouseup', 'body', function(evt) {
        if (mouseDown) {
          mouseDown = false;
          app.triggerDragAndDrop(evt);
        }
      });

      App.get('isSwichOn', App.cb);

      $('body').keyup(function(e) {
        if (e.keyCode === 27) {
          $('.js-unique-div').addClass('hidden');
          $('.css-highlighted').removeClass('css-highlighted');
        }
      });

      $('body *:not(.js-unique-div, .js-unique-div *)').on('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (App.isOn !== 'ON') return;

        App.$mainElem = App.renderContainer();
        App.data = App.setPanelLan($('.js-language-selector')) === 'html' ? html_attr : css_attr;
        var $current_elem = app.getCurrentElem(evt);
        app.$current_elem = $current_elem;
        app.highLightElem(app.$current_elem);

        app.render($current_elem);
        app.cssOptions = app.calculateAxis(evt);
        app.setCss(App.$mainElem, app.cssOptions);
      });

      App.nodeSearch($('.js-node-search'));
    },
    getCurrentElem: function(evt) {
      if (!evt) return;
      var $elem = $(evt.currentTarget);
      App.$oldElem = App.$current_elem || $elem;
      return $elem;
    },
    render: function($current_elem) {
      if (!$current_elem.length) return;

      this.clearResults();
      this.$mainElem = App.renderContainer();
      this.$mainElem.find('.js-output').html(this.getLi($current_elem));
    },
    clearResults: function() {
      $('.js-unique-div .js-output').html('');
    },
    getLi: function($html_elem) {
      if (!$html_elem.length) return;

      let html_content = '';
      let value = '';
      
      App.get('panelLan', App.cb);

      App.data.forEach(function(key, i) {
        if (localStorage.getItem('panelLan') === 'html') {
          value = $html_elem[0][key];
        } else {
          value = $html_elem.css(key);
        }
        html_content += `<li>${key}: ${value}</li>`;
      });

      return html_content;
    },
    setCss: function($ele, attr) {
      if (!$ele.length || $.isEmptyObject(attr)) return;

      const keys = Object.keys(attr);
      keys.forEach(function(key, i) {
        $ele.css(key, attr[key]);
      });
    },
    triggerDragAndDrop: function(evt) {
      const totalScreen = screen.width;
      const popupWidth = (25 * totalScreen) / 100;
      const isRight = totalScreen < (popupWidth + evt.clientX);
      var option = {
          'left': evt.clientX,
          'top': evt.clientY,
      };
      if (isRight) {
        option.left = evt.clientX - popupWidth;
      }
      this.setCss($('.js-unique-div'), option);
    },
    setLanguage: function($elem) {
      if (!$elem.length) return;
      let selectedLan = $elem.val();

       if (selectedLan === 'html') {
        this.data = html_attr;
        App.isHtml = true;
       } else {
        this.data = css_attr;
        App.isHtml = false;
       }

       App.set('panelLan', selectedLan);

       $('.js-output').html(App.getLi(App.$current_elem));
       App.highLightElem(App.$current_elem);
    },
    setPanelLan: function($elem) {
      App.get('panelLan', App.cb);
      let panelLan = App.output || 'html';
      $elem.val(panelLan);
    },
    calculateAxis: function(evt) {
      const totalScreen = screen.width;
        const popupWidth = (25 * totalScreen) / 100;
        const extraSpaceX = 50;
        const extraSpaceY = 0;
        const popupX = evt.clientX + extraSpaceX;
        const isRight = totalScreen < (popupWidth + popupX);
        var option = {
          'width': '25%',
          'height': '250px',
          'position': 'absolute',
          'left': popupX,
          'top': evt.clientY + extraSpaceY,
          'overflow': 'auto',
          'background-color': 'darkgray',
          'z-index': 100
        };

        if (isRight) {
          option.left = evt.clientX - (popupWidth + extraSpaceX);
        }
        return option;
    },
    highLightElem: function($elem) {
      App.$oldElem.removeClass('css-highlighted');
      $elem.addClass('css-highlighted');
    },
    nodeSearch: function($elem) {
      $elem.on('keyup', function(evt) {
        let searchString = $(this).val();
        const $li = $('.js-unique-div .js-output li');
        if (searchString.length < 2) {
          if ($li.hasClass('hidden')) $li.removeClass('hidden');
          return;
        }
        $li.addClass('hidden');
        let $elem;
        let nodeText;
        $li.each(function(i, elem) {
          $elem = $(elem);
          nodeText = $elem.html();
          if (nodeText.match(searchString)) {
            $elem.removeClass('hidden');
          }
        });
      });
    },
    set: function(key, value) {
      const data = {
        key: key,
        value: value
      };
      localStorage.setItem(key, value);
      chrome.runtime.sendMessage({method: "setLocalStorage", data}, function(response) {
        console.log("SET", response.data);
      });
    },
    get: function(key, cb) {
      const data = localStorage.getItem(key);
      if (data) {
        App.output = data;
        return;
      }
      chrome.runtime.sendMessage({method: "getLocalStorage", 'key': key}, function(response) {
        console.log("GET", response.data);
        cb(response.data);
      });
    },
    cb: function (data) {
      App.output = data;
    },
    renderContainer: function() {
      var $container = $('.js-unique-div');
      if ($container.length) return $container;

      var container = `
      <div class="container js-unique-div hidden">
        <div class="js-header">
          <div class="js-move">
            <h3 class="text-center">Semi Dev tool</h3>
          </div>
          <input class="js-node-search" placeholder="Enter attr name"/>
          <select name="language" class="js-language-selector float-right">
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>
        <ul class="js-output"></ul>
      </div>
      `;
      $container = $(container);
      $('body').append($container);
      return $container;
    },
  };
  App.init();
});
