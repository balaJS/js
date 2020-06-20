var APP = {
    debug: false,
    current: {
        url: null,
        url_path: null,
        tab_title: null,
        page: 'view',
        url_box: {},
        task: {
            action: '',
            data: {},
            $form: {},
            $url_box: {},
            errors: [],
            is_continue: true,
            storage: '',
        },
        // TODO: Will remove overall array.
        overall: [],
        data: {
            dynamic: [],
            static: [],
        },
    },
    column_count: 5,
    search: {
        term: '',
        result: [],
    },
    elemInit: function() {
        this.elems = {};
        const common = {};
        common.$app = $('.app');
        common.$top_wrapper = $('.app__top', common.$app);
        common.$nav_btn = $('.js-nav-action', common.$top_wrapper);
        common.nav_btn_cls = '.js-nav-action';
        common.$search_box = $('.js-search_box', '.app__search__wrapper');
        common.$app_pages = $('.js-app__pages', common.$app);
        common.close_btn_cls = '.js-form-close';
        common.$not_found_wrapper = $('.js-not-found-wrapper', common.$app);

        common.$nav_help_link = $('.js-nav-help-action', common.$top_wrapper);
        common.$help_wrapper = $('.js-help-content-wrapper', common.$app);
        common.$help_links = $('.js-help-link-title', common.$help_wrapper);

        // TODO: this is new version.
        common.static = {};
        common.static.$wrapper = $('.external-url-wrapper', common.$app);
        common.static.$url_headings = $('.js-url_heading', common.static.$wrapper);
        common.rows = '.row';
        common.url_boxes = '.js-url_box';

        common.dynamic = {};
        common.dynamic.$wrapper = $('.internal-url-wrapper', common.$app);
        common.dynamic.$url_headings = $('.js-url_heading', common.dynamic.$wrapper);

        // TODO: external and internal variation no need. Fix it later. It is deprecated now.
        common.$external_wrapper = $('.external-url-wrapper', common.$app);
        common.$external_rows = $('.js-row', common.$external_wrapper);
        common.$external_url_boxes = $('.js-url_box', common.$external_rows);

        common.$internal_wrapper = $('.internal-url-wrapper', common.$app);
        common.$internal_rows = $('.js-row', common.$internal_wrapper);
        common.$internal_url_boxes = $('.js-url_box', common.$internal_rows);
        this.elems.common = common;

        const view = {};
        view.$wrapper = $('.js-app__view__wrapper', common.$app);
        view.$url_box_wrapper = $('.js-app__main', view.$wrapper);
        this.elems.view = view;

        const settings = {};
        settings.$wrapper = $('.js-app__settings__wrapper', common.$app);
        settings.$tools_wrapper = $('.js-app__tools', common.$app);
        settings.$tools = $('span', settings.$tools_wrapper);

        settings.$insert_form = $('.js-insert-form', settings.$tools_wrapper);
        settings.$url_fill_checkbox = $('.js-fill_url_path', settings.$insert_form);
        settings.$export_form = $('.js-export-form', settings.$tools_wrapper);
        settings.$export_type = $('.js-data-type', settings.$export_form);

        settings.$bulk_insert_form = $('.js-bulkinsert-form', settings.$tools_wrapper);

        settings.$bulk_insert_wrapper = $('.js-bulk_insert-wrapper', settings.$tools_wrapper);

        settings.$tools_form_wrapper = $('.js-tools__form_wrapper', settings.$tools_wrapper);
        settings.$tool_form_wrappers = $('.js-form-wrapper', settings.$tools_wrapper);
        settings.$edit_wrapper = $('.js-edit-wrapper', common.$app);
        settings.$edit_form = $('.js-edit-form', settings.$edit_wrapper);
        settings.action_btns_cls = '.js-form-action';

        settings.$url_box_wrapper = $('.js-app__main', settings.$wrapper);
        settings.$url_boxes = $('.js-url_box', settings.$url_box_wrapper);
        this.elems.settings = settings;
    },
    page_data: {
        navigation: {
            view: {
                icon: '⇉',
                title: 'Goto view',
                page: 'settings',
            },
            settings: {
                icon: '⚙️',
                title: 'Goto Settings',
                page: 'view',
            }
        },
        settings: {
            export: {
                beforeAction: 'Copy',
                afterAction: 'Copied ☺'
            }
        },
    },
    events: {
        common: {
            get_this: function(evt) {
                return $(evt.target);
            },
            navigation: function(evt) {
                const $nav_btn = APP.events.common.get_this(evt);
                const page_name = $nav_btn.attr('data-page') || 'view';
                const navi_data = APP.page_data.navigation[page_name];

                APP.elems.common.$search_box.val('').focus();

                $nav_btn.html(navi_data.icon).attr({
                    title: navi_data.title,
                    'data-page': navi_data.page,
                });

                APP.elems.common.$app_pages.addClass('hidden');
                APP.elems[navi_data.page].$wrapper.removeClass('hidden');
                APP.current.page = navi_data.page;

                const $current_page = $('.js-app__'+APP.current.page+'__wrapper');

                APP.events.common.urlBoxRender($current_page);

                $current_page.removeClass('macro-wrapper');
                if (APP.elems.common.$app.hasClass('helper-show')) {
                    $current_page.addClass('macro-wrapper');
                }
            },
            search: function() {
                const $this = $(this);
                const $page = '.js-app__'+APP.current.page+'__wrapper';
                const $url_boxes = $('.js-url_box', $page).removeClass('hidden');
                const $external_wrapper = $('.external-url-wrapper', $page);
                const $external_heading = $('.js-url_heading', $external_wrapper);
                const $external_boxes = $('.js-url_box', $external_wrapper);
                const $internal_wrapper = $('.internal-url-wrapper', $page);
                const $internal_boxes = $('.js-url_box', $internal_wrapper);
                const $internal_heading = $('.js-url_heading', $internal_wrapper);

                let search_term = $this.val();

                $external_heading.removeClass('hidden');
                $internal_heading.removeClass('hidden');
                if (!APP.elems.common.$not_found_wrapper.hasClass('hidden')) APP.elems.common.$not_found_wrapper.addClass('hidden');

                $url_boxes.each(function(i, url_box) {
                    if (!url_box.innerHTML.match(new RegExp(search_term, 'gi'))) {
                        url_box.className += ' hidden';
                    }
                });
                if (!$external_boxes.not('.hidden').length) $external_heading.addClass('hidden');
                if (!$internal_boxes.not('.hidden').length) $internal_heading.addClass('hidden');
                if ($internal_heading.hasClass('hidden') && $external_heading.hasClass('hidden')) APP.elems.common.$not_found_wrapper.removeClass('hidden');
            },
            urlBoxRender: function($page_base_wrapper) {
                if (APP.debug) console.log($page_base_wrapper);

                APP.backend.fetch();
                this.htmlRender('dynamic');
                this.htmlRender('static');

                this.show404Page();
            },
            htmlRender: function(type) {
                var page_data = APP.current.data[type];
                const $html_group = APP.elems.common[type];
                const $wrapper = $html_group.$wrapper;

                var is_last_url_box = false, entry_count = page_data.length;
                var url_box = '', divs = '';
                let column_count = APP.column_count, elem_index = 0;

                $wrapper.find(APP.elems.common.rows).remove();

                if (entry_count) {
                    $html_group.$url_headings.removeClass('hidden');
                } else {
                    $html_group.$url_headings.addClass('hidden');
                }

                page_data.forEach(function(entry, sindex) {
                    if (!entry) return;
                    elem_index = (sindex + 1) % column_count;
                    if (!elem_index) elem_index = column_count;

                    is_last_url_box = ((elem_index && elem_index % column_count === 0) || (elem_index < column_count && entry_count === (sindex + 1)));

                    if (APP.debug) console.log('elem_index, is_last_url_box', `${elem_index}, ${is_last_url_box}`);

                    url_box += `
                        <a href="${entry.url}" class="col-md-4 js-url_box" data-index="${entry.index}" target="_blank" title="${entry.title}">${entry.title}</a>
                    `;

                    if (is_last_url_box) {
                        divs = `<div class="row">${url_box}</div>`;
                        $wrapper.append(divs);
                        url_box = '';
                    }
                });
            },
            show404Page: function() {
                if (!APP.current.data.dynamic.length && !APP.current.data.static.length) {
                    APP.elems.common.$not_found_wrapper.removeClass('hidden');
                } else {
                    APP.elems.common.$not_found_wrapper.addClass('hidden');
                }
            },
            helpWrapperToggle: function() {
                APP.elems.common.$app.toggleClass('helper-show');
                APP.elems.common.$help_wrapper.toggleClass('hidden');
                $('.js-app__'+APP.current.page+'__wrapper').toggleClass('macro-wrapper');
            },
            helpLinkToggle: function() {
                const $this = $(this);
                $this.siblings('.js-help-link-content').toggleClass('hidden');
            },
        },
        view: {
            urlBoxClick: function(evt) {
                // TODO: Should be removed in future.
                evt.preventDefault();
                const $url_box = APP.events.common.get_this(evt);
                const href = $url_box.attr('href');
                let is_external = !!href.match(/^http|https/ig);
                let new_url = is_external ? href : APP.current.url + '/' + href;
                browser.tabs.create({ url: new_url });
            },
        },
        settings: {
            toolsAction: function(evt) {
                const $tool = APP.events.common.get_this(evt);
                APP.elems.settings.$tool_form_wrappers.find('.js-can-reset').trigger('reset');

                // TODO: Refactoring is needed here.
                if ($tool.hasClass('actioning')) {
                    APP.elems.settings.$tools.removeClass('actioning');
                    APP.elems.settings.$tool_form_wrappers.addClass('hidden').find('.error').remove();
                    return;
                }

                APP.elems.settings.$tools.removeClass('actioning');
                APP.elems.settings.$tool_form_wrappers.addClass('hidden');

                const form = '.' + $tool.addClass('actioning').attr('data-form');
                const $form = $(form);
                $form.removeClass('hidden').find('input, textarea').first().focus();
            },
            urlBoxClick: function(evt) {
                evt.preventDefault();
                let class_name = evt.target.classList[1];
                const $url_box = APP.events.common.get_this(evt);
                APP.current.task.$url_box = $url_box;

                if (evt.ctrlKey) {
                    const href = $url_box.attr('href');
                    let is_external = !!href.match(/^http|https/ig);
                    let new_url = is_external ? href : APP.current.url + '/' + href;
                    browser.tabs.create({ url: new_url });
                    return;
                }

                if ($url_box.hasClass('actioning')) {
                    $('.actioning.js-url_box', APP.elems.settings.$wrapper).removeClass('actioning');
                    APP.elems.settings.$edit_wrapper.addClass('hidden').find('.error').remove();
                    return;
                }

                if (APP.elems.settings.$edit_wrapper.find('.error').length) {
                    APP.elems.settings.$edit_wrapper.addClass('hidden').find('.error').remove();
                }

                $('.actioning.js-url_box', APP.elems.settings.$wrapper).removeClass('actioning');

                $url_box.addClass('actioning');

                var data = [$url_box.attr('title'), $url_box.attr('href')];
                var $input = {};
                APP.elems.settings.$edit_form.find('input').each(function(i, input) {
                    $input = $(input);
                    $input.val(data[i]);
                });

                APP.elems.settings.$edit_wrapper.find(APP.elems.common.close_btn_cls).attr('data-parent', class_name);
                APP.elems.settings.$edit_wrapper.removeClass('hidden').detach().appendTo($url_box.parent());
                APP.elems.settings.$edit_form.find('input:first').focus();
            },
            formBtnAction: function(evt) {
                evt.preventDefault();
                const $this = APP.events.common.get_this(evt);
                const action = $this.attr('data-action') || '';
                const event = $this.attr('data-event') || '';

                if (action) APP.backend[action]();
                if (event) APP.events.settings[event]();

                if (APP.current.task.pass) {
                    APP.current.task.pass = false;
                    $this.siblings(APP.elems.common.close_btn_cls).trigger('click');
                }
            },
            formClose: function(evt) {
                evt.preventDefault();
                const $this = APP.events.common.get_this(evt);
                const parent = $this.attr('data-parent');
                if (!parent) return;

                const wrapper = $this.attr('data-wrapper') ? $this.attr('data-wrapper') : 'app';
                $this.parents('.' + wrapper).find('.actioning.' + parent).trigger('click');
            },
            updateEvent: function() {
                const $url_box = APP.current.task.$url_box;
                APP.current.task.data = [];
                APP.current.task.storage = !!$url_box.attr('href').match(/^http|https/ig) ? 'static' : 'dynamic';

                let data = {};
                APP.elems.settings.$edit_form.find('input').map(function(i, field) {
                    data[field.name] = field.value;
                });
                data['is_external'] = !!data['url'].match(/^http|https/ig);
                data['index'] = parseInt($url_box.attr('data-index'));
                APP.current.task.data.push(data);

                APP.current.task.$form = APP.elems.settings.$edit_form;
                APP.current.task.action = 'update';
                APP.validation.fieldValueCheck();
                APP.errorHandling();

                if (APP.current.task.is_continue) {
                    APP.backend.update();
                    APP.events.common.urlBoxRender($('.js-app__'+APP.current.page+'__wrapper'));
                }
            },
            removeEvent: function() {
                const $url_box = APP.current.task.$url_box;
                APP.current.task.data.index = parseInt($url_box.attr('data-index'));
                APP.current.task.data.is_external = !!$url_box.attr('href').match(/^http|https/ig);

                APP.backend.remove();
                $('.js-url_box.actioning', '.js-app__'+APP.current.page+'__wrapper').addClass('hidden');
            },
            fillUrlPathToInput: function() {
                const $this = $(this);
                const $title_input = APP.elems.settings.$insert_form.find('[name="title"]');
                const $url_input = APP.elems.settings.$insert_form.find('[name="url"]');
                if ($this.prop('checked')) {
                    $title_input.val(APP.current.tab_title).focus();
                    $url_input.val(APP.current.url_path);
                    return;
                }

                APP.events.settings.clearUrlPathFromInput($this);
            },
            clearUrlPathFromInput: function($this) {
                const $title_input = APP.elems.settings.$insert_form.find('[name="title"]');
                const $url_input = APP.elems.settings.$insert_form.find('[name="url"]');
                $url_input.val('');
                $title_input.val('');
            },
        },
    },
    eventInit: function() {
        this.elems.common.$top_wrapper.on('click', this.elems.common.nav_btn_cls, this.events.common.navigation);
        this.elems.common.$search_box.on('keyup', this.events.common.search);
        this.elems.settings.$wrapper.on('click', this.elems.common.close_btn_cls, this.events.settings.formClose);

        this.elems.settings.$wrapper.on('click', this.elems.settings.action_btns_cls, this.events.settings.formBtnAction);
        this.elems.settings.$tools.on('click', this.events.settings.toolsAction);
        this.elems.settings.$tools_wrapper.find('.js-tool-export').on('click', this.backend.export);

        this.elems.settings.$url_box_wrapper.on('click', '.js-url_box', this.events.settings.urlBoxClick);
        this.elems.view.$url_box_wrapper.on('click', '.js-url_box', this.events.view.urlBoxClick);

        this.elems.settings.$url_fill_checkbox.on('change', this.events.settings.fillUrlPathToInput);
        this.elems.settings.$export_type.on('change', this.backend.export);

        // help wrapper events here
        this.elems.common.$nav_help_link.on('click', this.events.common.helpWrapperToggle);
        this.elems.common.$help_links.on('click', this.events.common.helpLinkToggle);

        // Default triggers.
        this.elems.common.$nav_btn.trigger('click');
        if (!APP.elems.common.$not_found_wrapper.hasClass('hidden')) this.elems.common.$nav_btn.trigger('click');
    },
    backend: {
        store: function() {
            const stored_data = APP.current.data;
            const current_data =  APP.current.task.data;
            let dy_index = stored_data.dynamic.length;
            let st_index = stored_data.static.length;
            let storage;

            if (current_data.length) {
                current_data.forEach(function(data, i) {
                    if (data.is_external) {
                        storage = stored_data.static;
                        data.index = st_index + i;
                    } else {
                        storage = stored_data.dynamic;
                        data.index = dy_index + i;
                    }

                    storage.push(data);
                });
            } else if (Object.keys(current_data).length) {
                // Single insert here.
                // TODO: It is deprecated now.
                if (current_data.is_external) {
                    storage = stored_data.static;
                    if (isNaN(current_data.index))  current_data.index = st_index + i;
                } else {
                    storage = stored_data.dynamic;
                    if (isNaN(current_data.index))  current_data.index = dy_index + i;
                }
                storage.push(current_data);
            } else {
                // Invalid case
                // TODO: set proper error handler.
                return;
            }
            
            if (APP.debug) console.table('store', stored_data);
            localStorage.setItem('dynamic', JSON.stringify(stored_data.dynamic));
            localStorage.setItem('static', JSON.stringify(stored_data.static));
            this.fetch();
            APP.events.common.urlBoxRender($('.js-app__'+APP.current.page+'__wrapper'));
        },
        fetch: function(args = {}) {
            var temp = {};
            APP.current.data.dynamic = JSON.parse(localStorage.getItem('dynamic')) || [];
            APP.current.data.static = JSON.parse(localStorage.getItem('static')) || [];

            if (args.raw_data === 'both') {
                temp = APP.current.data.static.concat(APP.current.data.dynamic);
            } else if (args.raw_data === 'static' || args.raw_data === 'dynamic') {
                temp = APP.current.data[args.raw_data];
            }

            if (args.raw_data) {
                APP.current.data[args.raw_data] = JSON.stringify(temp);
            }
        },

        insert: function() {
            const fields = APP.elems.settings.$insert_form.find('input');

            APP.current.task.data = {};
            fields.map(function(i, field) {
                APP.current.task.data[field.name] = field.value;
            });
            APP.current.task.data['is_external'] = !!APP.current.task.data['url'].match(/^http|https/ig);

            APP.current.task.data = [APP.current.task.data];
            APP.current.task.$form = APP.elems.settings.$insert_form;
            APP.current.task.action = 'insert';
            APP.validation.fieldValueCheck();
            APP.errorHandling();

            if (APP.current.task.is_continue) {
                this.store();
                this.pass();
            }
        },
        bulkInsert: function() {
            const $wrapper = APP.elems.settings.$bulk_insert_wrapper;
            const $textarea = $wrapper.find('textarea');

            APP.current.task.data = {};
            APP.current.task.data = APP.validation.validJsonReturn($textarea.val());

            APP.current.task.$form = APP.elems.settings.$bulk_insert_form;

            APP.validation.fieldValueCheck();
            APP.errorHandling();

            if (APP.current.task.is_continue) {
                this.store();
                this.pass();
            }
        },
        export: function() {
            let type = APP.elems.settings.$export_type.val();

            APP.backend.fetch({raw_data: type});
            if (APP.debug) console.table('export', APP.current.data[type]);

            const $export_form = APP.elems.settings.$export_form;
            $export_form.find('textarea').val(APP.current.data[type]);
            let html_val = APP.page_data.settings.export.beforeAction;
            $export_form.parents('.js-export-wrapper').find('.js-form-action').html(html_val).attr('title', html_val);

            // TODO: Try to avoid this method call.
            // To restore the data type of APP.current.overall, Here it triggered.
            APP.backend.fetch();
        },
        copy: function() {
            const $export_form = APP.elems.settings.$export_form;
            const $textarea = $export_form.find('textarea');
            $textarea.focus().select();
            document.execCommand('copy');
            let html_val = APP.page_data.settings.export.afterAction;
            $export_form.parents('.js-export-wrapper').find('.js-form-action').html(html_val).attr('title', html_val);
        },
        reset: function() {
            localStorage.setItem('dynamic', JSON.stringify([]));
            localStorage.setItem('static', JSON.stringify([]));
            APP.current.data.dynamic = APP.current.data.static = [];
            APP.events.common.urlBoxRender($('.js-app__'+APP.current.page+'__wrapper'));
            APP.elems.common.$not_found_wrapper.removeClass('hidden');
            this.pass();
        },
        update: function() {
            const data = APP.current.task.data[0];
            let index = data.index;
            let storage_key = data.is_external ? 'static' : 'dynamic';
            let storage = APP.current.data[storage_key];
            let isInsert = false;
            let prevouis_storage_key = APP.current.task.storage;
            let prevouis_storage = APP.current.data[prevouis_storage_key];

            if (prevouis_storage_key !== storage_key) {
                isInsert = true;
                storage.push(data);
                localStorage.setItem(storage_key, JSON.stringify(storage));
                storage_key = prevouis_storage_key;
                storage = prevouis_storage;
            }

            let new_data = [];
            storage.forEach(function(entry, i) {
                if (entry.index === index) entry = data;
                if (isInsert && entry.index === index) return;
                new_data.push(entry);
            });

            storage = new_data;
            localStorage.setItem(storage_key, JSON.stringify(storage));

            this.pass();
        },
        remove: function() {
            let index = APP.current.task.data.index;
            let storage_key = APP.current.task.data.is_external ? 'static' : 'dynamic';
            let storage = APP.current.data[storage_key];
            let new_data = storage.filter(function(entry, i) {
                if (entry.index === index) return;
                return entry;
            });
            storage = new_data;

            localStorage.setItem(storage_key, JSON.stringify(storage));
            APP.events.common.urlBoxRender($('.js-app__'+APP.current.page+'__wrapper'));

            this.pass();
        },

        pass: function() {
            APP.current.task.pass = true;
            APP.current.task.action = '';
        },
        fail: function(msg = '') {
            APP.current.task.pass = false;
            APP.current.task.msg = msg;
        },
    },
    validation: {
        fieldValueCheck: function() {
            const current_task = APP.current.task;
            let exist_keys = [];

            current_task.data.forEach(function(entry, i) {
                Object.keys(entry).forEach(function(key, i) {
                    if (/^ *$/.test(entry[key]) && exist_keys.indexOf(key) === -1) {
                        exist_keys.push(key);
                        current_task.errors.push(key + ' must have a value.');
                    }
                });
            });
            current_task.is_continue = !current_task.errors.length;
        },
        validJsonReturn: function(str) {
            let json_data = [];
            try {
                json_data = JSON.parse(str);
            } catch {
                APP.current.task.errors.push('Please enter valid JSON format string.');
            }
            return json_data;
        },
    },
    errorHandling: function() {
        const $form = APP.current.task.$form;
        $form.find('.error').remove();

        APP.current.task.errors.forEach(function(error) {
            $form.append('<div class="error">' + error + '</div>');
        });
        APP.current.task.errors = [];
    },
};

var browser = chrome || {};
(function(APP, $) {
    $(function() {
        APP.elemInit();
        APP.eventInit();
        browser.tabs.query({currentWindow: true, active: true}, function(tabs) {
            const url_obj = new URL(tabs[0].url);
            APP.current.url = url_obj.origin;
            APP.current.url_path = url_obj.pathname.substr(1) + url_obj.search;
            APP.current.tab_title = tabs[0].title;
        });
    });
})(APP, jQuery);
