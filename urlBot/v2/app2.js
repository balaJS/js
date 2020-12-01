var APP = {
  debug: false,
  settings: {
    page: 'view',
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
    search: function(evt) {
      const self = APP, $ = self.helpers.$, $$ = self.helpers.$$;
      const $searchBox = self.helpers.get_this(evt);
      var searchTerm = $searchBox.value;

      const $not_found_wrapper = $('.js-not-found-wrapper');
      const $currentPage = $('.js-app__pages:not(.hidden)');
      const $internalWrapper = $currentPage.querySelector('.internal-url-wrapper');
      const $externalWrapper = $currentPage.querySelector('.external-url-wrapper');
      const $internalHeadings = $('.js-url_heading', $internalWrapper);
      const $externalHeadings = $('.js-url_heading', $externalWrapper);
      const $urlBoxes = $('.js-url_box', $currentPage);
      $$($urlBoxes, 'classList', {'method': 'remove', 'param': 'hidden'});

      $internalHeadings.classList.remove('hidden');
      $externalHeadings.classList.remove('hidden');
      // TODO: we should allow context in $$ method.
      $$('.js-app__pages:not(.hidden) .url-box-row', 'classList',
      {'method': 'remove', 'param': 'hidden'});

      if ($not_found_wrapper.classList.contains('hidden')) {
        $not_found_wrapper.classList.add('hidden');
      }
      const columnLen = self.settings.column_count;
      $urlBoxes.forEach(function($urlBox, i) {
          if (!$urlBox.innerHTML.match(new RegExp(searchTerm, 'gi'))) {
            $urlBox.classList.add('hidden');
          }
          if (!(columnLen % (i + 1)) && $urlBox.parentElement.querySelectorAll('.hidden').length === columnLen) {
            $urlBox.parentElement.classList.add('hidden');
          }
      });

      var internalSearchResult = $internalWrapper.querySelectorAll('.js-url_box:not(.hidden)');
      var externalSearchResult = $externalWrapper.querySelectorAll('.js-url_box:not(.hidden)');

      if (!internalSearchResult.length) { $internalHeadings.classList.add('hidden'); }
      if (!externalSearchResult.length) { $externalHeadings.classList.add('hidden'); }
      if (!internalSearchResult.length && !externalSearchResult.length) {
        $not_found_wrapper.classList.remove('hidden');
      }
    },
    searchBoxClear: function() {
      var self = APP;
      var $searchBox = self.helpers.$('.js-search_box');
      $searchBox.value = '';
      $searchBox.focus();
    },
    toolsAction: function(evt) {
      const self = APP, $ = self.helpers.$, $$ = self.helpers.$$;

      const $tool = self.helpers.get_this(evt);
      const $tools = $('.js-app__tools span');
      const $tool_form_wrappers = $('.js-form-wrapper');

      $$($tool_form_wrappers, 'classList', {'method': 'add', 'param': 'hidden'});
      const formWrapper = '.js-form-wrapper.' + $tool.dataset.form;
      const $form = $(formWrapper + ' form');
      self.frondend.resetForm($form);

      if ($tool.classList.contains('actioning')) {
        $$($tools, 'classList', {'method': 'remove', 'param': 'actioning'});
        return;
      }

      $$($tools, 'classList', {'method': 'remove', 'param': 'actioning'});
      $tool.classList.add('actioning');

      const $formWrapper = $(formWrapper);
      $formWrapper.classList.remove('hidden');
      if ($formWrapper.querySelector('input, textarea')) { $formWrapper.querySelector('input, textarea').focus(); }
    },
    formClose: function(evt) {
      evt.preventDefault();
      const self = APP, $ = self.helpers.$;

      const $this = self.helpers.get_this(evt);
      $('.' + $this.dataset.parent).click();
    },
    insertSubmit: function(evt) {
      const self = APP, $ = self.helpers.$;
      const $this = self.helpers.get_this(evt);
      const $insert_form = $('.js-insert-form');

      const $fields = $insert_form.querySelectorAll('input[type="text"]');

      var data = {};
      $fields.forEach(function($field) {
          data[$field.name] = $field.value;
      });
      data['is_external'] = !!data['url'].match(/^http|https/ig);

      self.backend.store([data]);

      var type = data['is_external'] ? 'external' : 'internal';
      self.htmlRender('settings', type);
      $('.' + $this.dataset.parent).click();
    },
    insertFillUrlPathToInput: function(evt) {
      const self = APP, $ = self.helpers.$;
      const $this = self.helpers.get_this(evt);
      var $form, $title, $url, url, checked = $this.checked;

      $form = $('.js-insert-form');
      self.frondend.resetForm($form);

      if (checked) {
        $this.checked = 1;
        $title = $form.querySelector('input[name="title"]');
        $url = $form.querySelector('input[name="url"]');
        url = $this.dataset.type === 'external' ? self.browser.full_url : self.browser.url_path;
        $title.value = self.browser.tab_title;
        $url.value = url;
        $title.focus();
      }
    },
    resetForm: function($form) {
      const self = APP, $ = self.helpers.$;
      $form.querySelectorAll('input').forEach(function($input) {
        $input.type === 'text' ? $input.value = '' : $input.checked = 0;
      });
      if ($form.querySelector('textarea')) {
        $form.querySelector('textarea').value = '';
      }
    },
    bulkInsertSubmit: function(evt) {
      const self = APP, $ = self.helpers.$;
      const $this = self.helpers.get_this(evt);
      var $form = $('.js-bulkinsert-form');
      const $textarea = $form.querySelector('textarea');

      var data = self.validation.validJsonReturn($textarea.value);
      self.backend.store(data);

      self.pageRender('settings');
      $('.' + $this.dataset.parent).click();
    },
    exportData: function() {
      const self = APP, $ = self.helpers.$;

      const $form = $('.js-export-form');
      const $selectBox = $form.querySelector('.js-export-trigger');
      var type = $selectBox.value;

      var jsonData = self.backend.fetch({type: type, format: 'json'});
      if (APP.debug) console.table('export', jsonData);

      const $textarea = $form.querySelector('textarea');
      $textarea.value = jsonData;
      $textarea.selectionEnd = 0

      var html_val = self.en.settings.export.beforeAction;
      var $copy = $('.js-export-wrapper .js-action-copy');
      $copy.innerHTML = html_val;
      $copy.setAttribute('title', html_val);
    },
    copy: function(evt) {
      const self = APP, $ = self.helpers.$;
      const $this = self.helpers.get_this(evt);

      const $form = $('.js-export-form');
      const $textarea = $form.querySelector('textarea');
        $textarea.focus();
        $textarea.select();
        document.execCommand('copy');

        var html_val = self.en.settings.export.afterAction;
        $this.innerHTML = html_val;
        $this.setAttribute('title', html_val);
    },
    reset: function(evt) {
      const self = APP, $ = self.helpers.$;
      const $this = self.helpers.get_this(evt);
      const $selectBox = $('.js-reset-form .js-reset-type');

      if ($selectBox.value) {
        localStorage.setItem($selectBox.value, JSON.stringify([]));
      } else {
        localStorage.setItem('external', JSON.stringify([]));
        localStorage.setItem('internal', JSON.stringify([]));
      }

      self.data.internal = APP.data.external = [];
      self.helpers.toggle404Page();
      self.pageRender('settings');
      $('.' + $this.dataset.parent).click();
    },
    createNewTab: function(evt) {
      evt.preventDefault();
      const self = APP;
      const $ = self.helpers.$;
      const $this = self.helpers.get_this(evt);

      var new_url = $this.getAttribute('href');
      if (!new_url.match(/^http|https/ig)) { new_url = self.browser.url + '/' + new_url; }
      self.browser.self.tabs.create({ url: new_url });
    },
    urlBoxClick: function(evt) {
        evt.preventDefault();
        const self = APP, $ = self.helpers.$, $$ = self.helpers.$$;
        const $this = self.helpers.get_this(evt);

        if (evt.ctrlKey || !$this.classList.contains('js-no-redirect')) {
          self.frondend.createNewTab(evt);
          return;
        }

        var hasActioning = $this.classList.contains('actioning');

        $$('.actioning.js-url_box', 'classList', {'method': 'remove', 'param': 'actioning'});

        if (hasActioning) {
          $this.classList.remove('actioning');
          $('.js-clone-edit-wrapper').classList.add('hidden');
          return;
        }

        $this.classList.add('actioning');
        self.frondend.placeEditWrapper($this.parentNode);
        const $editWrapper = $('.js-clone-edit-wrapper');

        const $title = $editWrapper.querySelector('input[name="title"]');
        const $url = $editWrapper.querySelector('input[name="url"]');
        $title.value = $this.title;
        $url.value = $this.getAttribute('href');
        $title.focus();
    },
    placeEditWrapper: function($target) {
      const self = APP, $ = self.helpers.$, $$ = self.helpers.$$;

      $$('.js-clone-edit-wrapper', 'nodeChange', {'method': 'remove'});
      const $original = $('.js-original-edit-wrapper');
      const $clone = $original.cloneNode(true);
      $clone.classList.replace('js-original-edit-wrapper', 'js-clone-edit-wrapper')
      $clone.classList.remove('hidden');

      const $closebtn = $clone.querySelector('.js-editform-close');
      $closebtn.dataset.parent = 'actioning.js-url_box';
      $closebtn.addEventListener('click', self.frondend.formClose);

      const $updateBtn = $clone.querySelector('.js-editform-update');
      $updateBtn.addEventListener('click', self.frondend.update);

      const $deleteBtn = $clone.querySelector('.js-editform-delete');
      $deleteBtn.addEventListener('click', self.frondend.remove);
      $target.append($clone);
    },
    update: function(evt) {
      const self = APP, $ = self.helpers.$, $$ = self.helpers.$$;
      const $this = self.helpers.get_this(evt);
      const $urlBox = $('.actioning.js-url_box');
      const $edit_form = $('.js-clone-edit-wrapper .js-edit-form');

      const $fields = $edit_form.querySelectorAll('input[type="text"]');

      var data = {};
      $fields.forEach(function($field) {
          data[$field.name] = $field.value;
      });
      data['index'] = parseInt($urlBox.dataset.index);
      data['is_external'] = !!data['url'].match(/^http|https/ig);

      self.backend.update(data);

      var type = data['is_external'] ? 'external' : 'internal';
      self.htmlRender('settings', type);
    },
    remove: function(evt) {
      const self = APP, $ = self.helpers.$, $$ = self.helpers.$$;
      const $this = self.helpers.get_this(evt);
      const $urlBox = $('.actioning.js-url_box');

      var data = {
        index : parseInt($urlBox.dataset.index),
        is_external: !!$urlBox.href.match(/^http|https/ig)
      };
      self.backend.remove(data);

      var type = data['is_external'] ? 'external' : 'internal';
      self.htmlRender('settings', type);
    },
  },
  validation: {
      validJsonReturn: function(str) {
          let json_data = [];
          try {
              json_data = JSON.parse(str);
          } catch {
              console.log('Please enter valid JSON format string.');
          }
          return json_data;
      },
  },
  backend: {
    self: function() { return APP; },
    store: function(current_data) {
      this.fetch();
      const self = this.self(), stored_data = self.data;
      var type, inIndex = stored_data.internal.length;
      var exIndex = stored_data.external.length;

      // insert && bulk insert actions done here.
      current_data.forEach(function(data, i) {
        if (data.is_external) {
            data.index = exIndex++;
            stored_data.external.push(data);
        } else {
            data.index = inIndex++;
            stored_data.internal.push(data);
        }
      });

      if (APP.debug) { console.table('store', stored_data); }
      localStorage.setItem('internal', JSON.stringify(stored_data.internal));
      localStorage.setItem('external', JSON.stringify(stored_data.external));
      this.fetch();
    },
    fetch: function(args = {}) {
      const self = this.self();
      var temp = {}, internal = JSON.parse(localStorage.getItem('internal')) || [];
      var external = JSON.parse(localStorage.getItem('external')) || [];

      if (args.format === 'json') {
        temp = args.type ? self.data[args.type] : external.concat(internal);
        return JSON.stringify(temp);
      } else {
        self.data['internal'] = internal;
        self.data['external'] = external;
      }
    },
    update: function(data) {
      const self = this.self();
      var index = data.index;
      var storage_key = data.is_external ? 'external' : 'internal';
      var storage = self.data[storage_key];

      storage[index] = data;
      localStorage.setItem(storage_key, JSON.stringify(storage));
      this.fetch();
    },
    remove: function(data) {
      const self = this.self();
      var index = data.index;
      var storage_key = data.is_external ? 'external' : 'internal';
      var storage = self.data[storage_key];
      var newStorage = storage.filter(function(entry, i) {
          if (entry.index === index) return;
          entry.index = i;
          if (index <= i) { entry.index = i - 1; }
          return entry;
      });

      localStorage.setItem(storage_key, JSON.stringify(newStorage));
      this.fetch();
    },
  },
  helpers: {
    get_this: function(evt) {
      return evt.target;
    },
    $: function(selector, $context = '') {
      $context = $context ? $context : APP.$app;
      var $results = $context.querySelectorAll(selector);
      return $results.length === 1 ? $results[0] : $results;
    },
    $$: function(selector, action, args) {
      const self = APP;
      var $allElems = selector;
      if (typeof selector === 'string') {
        $allElems = self.helpers.$(selector);
      }

      var $elems = !$allElems.length && $allElems.nodeType ? [$allElems] : $allElems;
      if (!$allElems.length && !$allElems.nodeType) { return; }

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
      } else if (action === 'nodeChange') {
        var param = args['param'];
        for (i = 0; i < elemsLen; i++) {
          elem = $elems[i];
          if (param) {
            elem[args['method']](param);
          } else {
            elem[args['method']]();
          }
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

    self.frondend.searchBoxClear();
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
    const self = this, $ = this.helpers.$, $$ = this.helpers.$$;
    var data = this.data[type];
    var entry_count = data.length;
    var $page = this.helpers.getPage(pageName);
    var $section = $page.querySelector('.' + type + '-url-wrapper');
    var $heading = $section.querySelector('.js-url_heading');

    $heading.classList.remove('hidden');
    if (!entry_count) { $heading.classList.add('hidden'); }

    var is_last_url_box = false;
    var url_box = '', row = '';
    let column_count = this.settings.column_count, elem_index = 0;
    var htmlClass = 'col-md-4 js-url_box';
    if (pageName === 'settings') { htmlClass += ' js-no-redirect'; }

    $$($('.url-box-row', $section), 'nodeChange', {'method': 'remove'});
    row = document.createElement('div');
    row.setAttribute('class', 'row url-box-row');

    data.forEach(function(entry, sindex) {
        if (!entry) return;
        elem_index = (sindex + 1) % column_count;
        if (!elem_index) elem_index = column_count;

        is_last_url_box = ((elem_index && elem_index % column_count === 0) || (elem_index < column_count && entry_count === (sindex + 1)));

        url_box = document.createElement('a');
        url_box.setAttribute('href', entry.url);
        url_box.setAttribute('class', htmlClass);
        url_box.setAttribute('data-index', entry.index);
        url_box.setAttribute('target', '_blank');
        url_box.setAttribute('title', entry.title);
        url_box.innerHTML = entry.title;
        url_box.addEventListener('click', self.frondend.urlBoxClick);
        row.append(url_box);

        if (is_last_url_box) {
          $section.append(row);
          row = document.createElement('div');
          row.setAttribute('class', 'row url-box-row');
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
    const self = this, $ = this.helpers.$, $$ = this.helpers.$$;

    $('.js-nav-action').addEventListener('click', self.pageNavigation.bind('', self));
    $('.js-nav-action').click();
    $('.js-search_box').addEventListener('keyup', self.frondend.search);
    // args:selector, action, args
    var args = {'evt' : 'click', 'cb' : self.frondend.toolsAction};
    $$('.js-app__tools span', 'addEventListener', args);

    args.cb = self.frondend.formClose;
    $$('.js-form-close', 'addEventListener', args);

    args.cb = self.frondend.insertSubmit;
    $$('.js-insert-submit', 'addEventListener', args);

    args.cb = self.frondend.insertFillUrlPathToInput;
    $$('.js-fill_url_path', 'addEventListener', args);

    args.cb = self.frondend.bulkInsertSubmit;
    $$('.js-bulkinsert-submit', 'addEventListener', args);

    $('.js-tool-export').addEventListener('click', self.frondend.exportData);
    $('.js-export-trigger').addEventListener('change', self.frondend.exportData);
    $('.js-action-copy').addEventListener('click', self.frondend.copy);

    $('.js-action-reset').addEventListener('click', self.frondend.reset);
  },
  browser: {
    self: chrome || {},
    url: '',
    url_path: '',
    full_url: '',
    tab_title: '',
    tabs: '',
    init: function() {
        this.self.tabs.query({currentWindow: true, active: true}, function(tabs) {
          APP.browser.tabs = tabs;
          APP.browser.set_tab_details();
        });
    },
    set_tab_details: function() {
        const tabs = APP.browser.tabs;
        const url_obj = new URL(tabs[0].url);

        this.url = url_obj.origin;
        this.url_path = url_obj.pathname.substr(1) + url_obj.search;
        this.full_url = this.url + '/' + this.url_path;
        this.tab_title = tabs[0].title;
    },
  },
};

APP.init();
