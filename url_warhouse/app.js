var APP = {
    debug: false,
    current: {
        url: '',
        page: 'view',
        url_box: {},
        task: {
            data: {},
        },
        overall: [],
        data: {
            dynamic: [],
            static: [],
        },
    },
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
        common.$search_box = $('.js-search_box', '.app__search__wrapper');
        common.$app_pages = $('.js-app__pages', common.$app);
        common.$close_btn = $('.js-form-close', common.$app);

        // TODO: external and internal variation no need. Fix it later.
        common.$external_wrapper = $('.external-url-wrapper', common.$app);
        common.$external_rows = $('.js-row', common.$external_wrapper);
        common.$external_url_boxes = $('.js-url_box', common.$external_rows);

        common.static = {};
        common.static.$url_headings = $('.js-url_heading', common.$external_wrapper);

        common.$internal_wrapper = $('.internal-url-wrapper', common.$app);
        common.$internal_rows = $('.js-row', common.$internal_wrapper);
        common.$internal_url_boxes = $('.js-url_box', common.$internal_rows);

        common.dynamic = {};
        common.dynamic.$url_headings = $('.js-url_heading', common.$internal_wrapper);
        common.$not_found_wrapper = $('.js-not-found-wrapper', common.$app);
        this.elems.common = common;

        const view = {};
        view.$wrapper = $('.js-app__view__wrapper', common.$app);
        this.elems.view = view;

        const settings = {};
        settings.$wrapper = $('.js-app__settings__wrapper', common.$app);
        settings.$tools_wrapper = $('.js-app__tools', common.$app);
        settings.$tools = $('span', settings.$tools_wrapper);

        settings.$insert_form = $('.js-insert-form', settings.$tools_wrapper);
        settings.$export_form = $('.js-export-form', settings.$tools_wrapper);

        settings.$bulk_insert_wrapper = $('.js-bulk_insert-wrapper', settings.$tools_wrapper);

        settings.$tools_form_wrapper = $('.js-tools__form_wrapper', settings.$tools_wrapper);
        settings.$tool_form_wrappers = $('.js-form-wrapper', settings.$tools_wrapper);
        settings.$edit_wrapper = $('.js-edit-wrapper', common.$app);
        settings.$edit_form = $('.js-edit-form', settings.$edit_wrapper);
        settings.$action_btns = $('.js-form-action', '.js-action__btn_wrapper');

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

                APP.elems.common.$search_box.val('');

                $nav_btn.html(navi_data.icon).attr({
                    title: navi_data.title,
                    'data-page': navi_data.page,
                });

                APP.elems.common.$app_pages.addClass('hidden');
                APP.elems[navi_data.page].$wrapper.removeClass('hidden');
                APP.current.page = navi_data.page;

                APP.events.common.urlBoxRender($('.js-app__'+APP.current.page+'__wrapper'));

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
                    if (!url_box.innerHTML.match(search_term)) {
                        url_box.className += ' hidden';
                    }
                });
                if (!$external_boxes.not('.hidden').length) $external_heading.addClass('hidden');
                if (!$internal_boxes.not('.hidden').length) $internal_heading.addClass('hidden');
                if ($internal_heading.hasClass('hidden') && $external_heading.hasClass('hidden')) APP.elems.common.$not_found_wrapper.removeClass('hidden');
            },
            urlBoxRender: function($page_base_wrapper) {
                if (APP.debug) console.log($page_base_wrapper);

                APP.backend.generateViewData();
                const data_keys = Object.keys(APP.current.data);

                var $wrapper = {}, url_box = '', divs = '';
                var is_last_url_box = false, entry_count = 0;

                $page_base_wrapper.find('.js-app__main').each(function(index, wrapper) {
                    let row_index = 1, elem_index = 0;
                    $wrapper = $(wrapper);
                    $wrapper.find('.js-row').remove();

                    entry_count = APP.current.data[data_keys[index]].length;
                    if (entry_count) {
                        APP.elems.common[data_keys[index]].$url_headings.removeClass('hidden');
                    } else {
                        APP.elems.common[data_keys[index]].$url_headings.addClass('hidden');
                    }

                    APP.current.data[data_keys[index]].forEach(function(entry, sindex) {
                        elem_index = (sindex + 1) % 4;
                        if (!elem_index) elem_index = 4;

                        is_last_url_box = ((elem_index && elem_index % 4 === 0) || (elem_index < 4 && entry_count === (sindex + 1)));

                        if ((sindex && sindex % 4 === 0)) row_index++;

                        if (APP.debug) console.log('elem_index, is_last_url_box, row_index', `${elem_index}, ${is_last_url_box}, ${row_index}`);

                        url_box += `
                            <a href="${entry.url}" class="col-md-4 js-col-${row_index}-${elem_index} js-url_box" target="_blank" title="${entry.title}">${entry.title}</a>
                        `;

                        if (is_last_url_box) {
                            divs = `<div class="row js-row row-${row_index}">${url_box}</div>`;
                            $wrapper.append(divs);
                            url_box = '';
                        }
                    });
                });
            },
        },
        view: {
            urlBoxClick: function() {
                // TODO: Should be removed in future.
            },
        },
        settings: {
            toolsAction: function(evt) {
                const $tool = APP.events.common.get_this(evt);
                APP.elems.settings.$tool_form_wrappers.find('.js-can-reset').trigger('reset');

                // TODO: Refactoring is needed here.
                if ($tool.hasClass('actioning')) {
                    APP.elems.settings.$tools.removeClass('actioning');
                    APP.elems.settings.$tool_form_wrappers.addClass('hidden');
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

                if ($url_box.hasClass('actioning')) {
                    $('.actioning.js-url_box', APP.elems.settings.$wrapper).removeClass('actioning');
                    APP.elems.settings.$edit_wrapper.addClass('hidden');
                    return;
                }

                $('.actioning.js-url_box', APP.elems.settings.$wrapper).removeClass('actioning');

                $url_box.addClass('actioning');

                var data = [$url_box.attr('title'), $url_box.attr('href')];
                var $input = {};
                APP.elems.settings.$edit_form.find('input').each(function(i, input) {
                    $input = $(input);
                    $input.val(data[i]);
                });

                APP.elems.settings.$edit_wrapper.find('.js-form-close').attr('data-parent', class_name);
                APP.elems.settings.$edit_wrapper.removeClass('hidden').detach().appendTo($url_box.parent());
                APP.elems.settings.$edit_form.find('input:first').focus();
            },
            formBtnAction: function(evt) {
                const $this = APP.events.common.get_this(evt);
                const action = $this.attr('data-action') || '';
                const event = $this.attr('data-event') || '';

                if (action) APP.backend[action]();
                if (event) APP.events.settings[event]();

                if (APP.current.task.pass) {
                    APP.current.task.pass = false;
                    $this.siblings('.js-form-close').trigger('click');
                }
            },
            formClose: function(evt) {
                const $this = APP.events.common.get_this(evt);
                const parent = '.' + $this.attr('data-parent');
                const wrapper = $this.attr('data-wrapper') ? $this.attr('data-wrapper') : 'app';
                $this.parents('.' + wrapper).find(parent).trigger('click');
            },
            updateEvent: function() {
                APP.current.task.data = {};
                APP.elems.settings.$edit_form.find('input').map(function(i, field) {
                    APP.current.task.data[field.name] = field.value;
                });
                APP.current.task.data['is_external'] = !!APP.current.task.data['url'].match(/^http|https/ig);
                APP.current.task.index = $('.actioning.js-url_box', APP.elems.settings.$wrapper).attr('title');

                APP.backend.update();
                APP.events.common.urlBoxRender($('.js-app__'+APP.current.page+'__wrapper'));
            },
            removeEvent: function() {
                let value = APP.elems.settings.$edit_form.find('input:first').val() || '';
                APP.current.task.data = {title: value};

                APP.backend.remove();
                $('.js-url_box.actioning', '.js-app__'+APP.current.page+'__wrapper').addClass('hidden');
            },
        },
    },
    eventInit: function() {
        this.elems.common.$top_wrapper.on('click', this.elems.common.$nav_btn, this.events.common.navigation);
        this.elems.common.$search_box.on('keyup', this.events.common.search);
        this.elems.settings.$wrapper.on('click', this.elems.common.$close_btn, this.events.settings.formClose);

        this.elems.settings.$wrapper.on('click', this.elems.settings.$action_btns, this.events.settings.formBtnAction);
        this.elems.settings.$tools.on('click', this.events.settings.toolsAction);
        this.elems.settings.$tools_wrapper.find('.js-tool-export').on('click', this.backend.export);

        this.elems.settings.$url_box_wrapper.on('click', '.js-url_box', this.events.settings.urlBoxClick);

        // Default triggers.
        this.elems.common.$nav_btn.trigger('click');
        if (!APP.current.overall.length) this.elems.common.$nav_btn.trigger('click');
    },
    backend: {
        store: function() {
            const stored_data = APP.current.overall;
            const current_data =  APP.current.task.data;

            if (current_data.length) {
                current_data.forEach(function(data) {
                    stored_data.push(data);
                });
            } else if (Object.keys(current_data).length) {
                // Single insert here.
                stored_data.push(current_data);
            } else {
                // Invalid case
                // TODO: set proper error handler.
                return;
            }
            
            if (APP.debug) console.table('store', stored_data);
            localStorage.setItem('urls', JSON.stringify(stored_data));
            this.fetch();
            APP.events.common.urlBoxRender($('.js-app__'+APP.current.page+'__wrapper'));
        },
        fetch: function(args = {}) {
            APP.current.overall = JSON.parse(localStorage.getItem('urls')) || [];
            if (args.raw_data) {
                APP.current.overall = !!localStorage.getItem('urls') ? localStorage.getItem('urls') : JSON.stringify([]);
            }
        },

        insert: function() {
            const fields = APP.elems.settings.$insert_form.find('input');

            APP.current.task.data = {};
            fields.map(function(i, field) {
                APP.current.task.data[field.name] = field.value;
            });
            APP.current.task.data['is_external'] = !!APP.current.task.data['url'].match(/^http|https/ig);

            this.store();
            this.pass();
        },
        bulkInsert: function() {
            const $wrapper = APP.elems.settings.$bulk_insert_wrapper;
            const $textarea = $wrapper.find('textarea');

            APP.current.task.data = {};
            APP.current.task.data = JSON.parse($textarea.val());
            this.store();
            this.pass();
        },
        export: function() {
            APP.backend.fetch({raw_data: 1});
            if (APP.debug) console.table('export', APP.current.overall);

            const $export_form = APP.elems.settings.$export_form;
            $export_form.find('textarea').val(APP.current.overall);
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
            localStorage.setItem('urls', JSON.stringify([]));
            APP.current.overall = APP.current.data.dynamic = APP.current.data.static = [];
            APP.events.common.urlBoxRender($('.js-app__'+APP.current.page+'__wrapper'));
            this.pass();
        },

        generateViewData: function() {
            // TODO: We should split the data based on dynamic urls.
            this.fetch();
            APP.current.data.dynamic = [];
            APP.current.data.static = [];
            if (APP.debug) console.log('overall data in generateViewData', APP.current.overall);

            let key;
            APP.current.overall.forEach(function(entry) {
                key = entry.is_external ? 'dynamic' : 'static';
                APP.current.data[key].push(entry);
            });
        },
        update: function() {
            let title = APP.current.task.index;
            let new_data = APP.current.overall.map(function(entry, i) {
                if (entry.title === title) entry = APP.current.task.data;
                return entry;
            });
            APP.current.overall = new_data;

            localStorage.setItem('urls', JSON.stringify(APP.current.overall));
            this.generateViewData();

            this.pass();
        },
        remove: function() {
            let title = APP.current.task.data.title;
            let new_data = APP.current.overall.filter(function(entry, i) {
                if (entry.title === title) return;
                return entry;
            });
            APP.current.overall = new_data;

            localStorage.setItem('urls', JSON.stringify(APP.current.overall));
            this.generateViewData();

            this.pass();
        },

        pass: function() {
            APP.current.task.pass = true;
        },
        fail: function(msg = '') {
            APP.current.task.pass = false;
            APP.current.task.msg = msg;
        },
    },
};

(function(APP, $) {
    $(function() {
        APP.elemInit();
        APP.eventInit();
    });
})(APP, jQuery);
