var APP = {
  debug: true,
  settings: {
    page: 'view',
    url_box: {},
    column_count: 5,
  },
  data: {
      internal: [],
      external: [],
  },
  en: {
    navigation: {
        view: {
            icon: '⇉',
            title: 'Goto view',
            nextPage: 'settings',
        },
        settings: {
            icon: '⚙️',
            title: 'Goto Settings',
            nextPage: 'view',
        }
    },
    settings: {
        export: {
            beforeAction: 'Copy',
            afterAction: 'Copied ☺'
        }
    },
  },
  frondend: {
    toolsAction: function(evt) {
      const self = APP;
      const $ = self.helpers.$;
      const $$ = self.helpers.$$;

      const $tool = self.helpers.get_this(evt);
      const $tools = $('.js-app__tools span');
      const $tool_form_wrappers = $('.js-form-wrapper');

      $$($tool_form_wrappers, 'classList', {'method': 'add', 'param': 'hidden'});

      if ($tool.classList.contains('actioning')) {
        $$($tools, 'classList', {'method': 'remove', 'param': 'actioning'});
        $('.js-form-wrapper .error').remove();
        return;
      }

      $$($tools, 'classList', {'method': 'remove', 'param': 'actioning'});
      $tool.classList.add('actioning');

      const form = '.js-form-wrapper.' + $tool.dataset.form;
      const $form = $(form);
      $form.classList.remove('hidden');
      $form.querySelector('input, textarea').focus();
    },
    toolsFormSubmit: function() {},
    formClose: function(evt) {
      evt.preventDefault();
      const self = APP;
      const $ = self.helpers.$;

      const $this = self.helpers.get_this(evt);
      $('.' + $this.dataset.parent).click();
    },
  },
  backend: {
    store: function(args) {
        const stored_data = this.data;
        const current_data =  args.data;
        let dy_index = stored_data.internal.length;
        let st_index = stored_data.external.length;
        let storage;

        current_data.forEach(function(data, i) {
            if (data.is_external) {
                storage = stored_data.external;
                data.index = st_index + i;
            } else {
                storage = stored_data.internal;
                data.index = dy_index + i;
            }

            storage.push(data);
        });

        if (APP.debug) console.table('store', stored_data);
        localStorage.setItem('internal', JSON.stringify(stored_data.internal));
        localStorage.setItem('external', JSON.stringify(stored_data.external));
        this.fetch();
    },
    fetch: function(args = {}) {
        var temp = {};
        var internal = JSON.parse(localStorage.getItem('internal')) || [];
        var external = JSON.parse(localStorage.getItem('external')) || [];

        if (args.raw_data === 'both') {
            temp = external.concat(internal);
        } else if (args.raw_data === 'external' || args.raw_data === 'internal') {
            temp = this.data[args.raw_data];
        }

        if (args.raw_data) {
            this.data[args.raw_data] = JSON.stringify(temp);
        }
    },
  },
  helpers: {
    get_this: function(evt) {
      return evt.target;
    },
    $: function(selector) {
      var $results = APP.$app.querySelectorAll(selector);
      return $results.length === 1 ? $results[0] : $results;
    },
    $$: function(selector, action, args) {
      const self = APP;
      var $elems = selector;
      if (typeof selector === 'string') {
        $elems = self.helpers.$(selector);
      }

      // bulk actions done here.
      var i, elem, elemsLen = $elems.length;
      if (action === 'addEventListener') {
        for (i = 0; i < elemsLen; i++) {
          elem = $elems[i];
          elem[action](args['evt'], args['cb']);
        }
      } else if (action === 'classList') {
        for (i = 0; i < elemsLen; i++) {
          elem = $elems[i];
          elem[action][args['method']](args['param']);
        }
      }
    },
    toggle404Page: function() {
      const self = APP;
      const $ = this.$;
      var $notFoundWrapper = $('.js-not-found-wrapper');

      if (self.data.internal.length || self.data.external.length) {
        $notFoundWrapper.classList.add('hidden');
      } else {
        // Show 404 page.
        $notFoundWrapper.classList.remove('hidden');
      }
    },
    getPage: function(pageName) {
      const $ = this.$;
      return $('.js-app__' + pageName + '__wrapper');
    },
  },
  pageNavigation: function(self, event) {
    const $ = self.helpers.$;
    var $this = self.helpers.get_this(event);
    var nextPage = $this.dataset.nextpage;
    var nextPageData = self.en.navigation[nextPage];
    $this.innerHTML = nextPageData['icon'];
    $this.title = nextPageData['title'];
    $this.dataset['nextpage'] = nextPageData['nextPage'];

    self.pageRender(nextPage);

    self.searchBox.clear();
  },
  searchBox: {
    clear: function() {
      var self = APP;
      var $searchBox = self.helpers.$('.js-search_box');
      $searchBox.value = '';
      $searchBox.focus();
    },
  },
  pageRender: function(pageName) {
    this.backend.fetch();
    var $viewPage = this.helpers.getPage('view');
    var $settingsPage = this.helpers.getPage('settings');

    if (pageName === 'settings') {
      $settingsPage.classList.remove('hidden');
      $viewPage.classList.add('hidden');
    } else {
      $settingsPage.classList.add('hidden');
      $viewPage.classList.remove('hidden');
    }

    this.htmlRender(pageName, 'internal');
    this.htmlRender(pageName, 'external');

    this.helpers.toggle404Page();
  },
  htmlRender: function(pageName, type) {
    const $ = this.helpers.$;
    var data = this.data[type];
    var $page = this.helpers.getPage(pageName);
    var $section = $page.querySelector('.' + type + '-url-wrapper');
    var $heading = $section.querySelector('.js-url_heading');

    $heading.classList.remove('hidden');
    if (!data.length) { $heading.classList.add('hidden'); }

    var is_last_url_box = false;
    var url_box = '', divs = '';
    let column_count = this.settings.column_count, elem_index = 0;

    // $section.querySelectorAll('.row').remove();

    data.forEach(function(entry, sindex) {
        if (!entry) return;
        elem_index = (sindex + 1) % column_count;
        if (!elem_index) elem_index = column_count;

        is_last_url_box = ((elem_index && elem_index % column_count === 0) || (elem_index < column_count && entry_count === (sindex + 1)));
        url_box += `
            <a href="${entry.url}" class="col-md-4 js-url_box" data-index="${entry.index}" target="_blank" title="${entry.title}">${entry.title}</a>
        `;

        if (is_last_url_box) {
            divs = `<div class="row">${url_box}</div>`;
            $section.append(divs);
            url_box = '';
        }
    });
  },
  init: function() {
    const $ = this.helpers.$;

    this.elemsInit();
    this.eventsInit();
    this.browser.init();
  },
  elemsInit: function() {
    this.$app = document.getElementById('app');
  },
  eventsInit: function() {
    const self = this;
    const $ = this.helpers.$;
    const $$ = this.helpers.$$;

    $('.js-nav-action').addEventListener('click', self.pageNavigation.bind('', self));
    // selector, action, args
    var args = {'evt' : 'click', 'cb' : self.frondend.toolsAction};
    $$('.js-app__tools span', 'addEventListener', args);

    args.cb = self.frondend.formClose;
    $$('.js-form-close', 'addEventListener', args);

  },
  browser: {
    url: '',
    url_path: '',
    full_url: '',
    tab_title: '',
    tabs: '',
    init: function() {
        browser.tabs.query({currentWindow: true, active: true}, function(tabs) {
          APP.browser.tabs = tabs;
          APP.browser.set_tab_details();
        });
    },
    set_tab_details: function() {
        const tabs = APP.browser.tabs;
        const url_obj = new URL(tabs[0].url);

        this.url = url_obj.origin;
        this.url_path = url_obj.pathname.substr(1) + url_obj.search;
        this.full_url = browser.url + '/' + browser.url_path;
        this.tab_title = tabs[0].title;
    },
  },
};

var browser = chrome || {};
APP.init();
