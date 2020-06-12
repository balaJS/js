var APP = {
    debug: false,
    current: {
        url: '',
        page: 'view',
        url_box: {},
        task: {
            action: '',
            data: {},
            $form: {},
            errors: [],
            is_continue: true,
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
        view.$url_box_wrapper = $('.js-app__main', view.$wrapper);
        this.elems.view = view;

        const settings = {};
        settings.$wrapper = $('.js-app__settings__wrapper', common.$app);
        settings.$tools_wrapper = $('.js-app__tools', common.$app);
        settings.$tools = $('span', settings.$tools_wrapper);

        settings.$insert_form = $('.js-insert-form', settings.$tools_wrapper);
        settings.$export_form = $('.js-export-form', settings.$tools_wrapper);
        settings.$bulk_insert_form = $('.js-bulkinsert-form', settings.$tools_wrapper);

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
                            <a href="${entry.url}" class="col-md-4 js-col-${row_index}-${elem_index} js-url_box" data-index="${entry.index}" target="_blank" title="${entry.title}">${entry.title}</a>
                        `;

                        if (is_last_url_box) {
                            divs = `<div class="row js-row row-${row_index}">${url_box}</div>`;
                            $wrapper.append(divs);
                            url_box = '';
                        }
                    });
                });
                this.show404Page();
            },
            show404Page: function() {
                if (!APP.current.overall.length) {
                    APP.elems.common.$not_found_wrapper.removeClass('hidden');
                } else {
                    APP.elems.common.$not_found_wrapper.addClass('hidden');
                }
            }
        },
        view: {
            urlBoxClick: function(evt) {
                // TODO: Should be removed in future.
                evt.preventDefault();
                const $url_box = APP.events.common.get_this(evt);
                const href = $url_box.attr('href');
                let is_external = !!href.match(/^http|https/ig);
                let new_url = is_external ? href : APP.current.url + '/' + href;
                chrome.tabs.create({ url: new_url });
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

                APP.elems.settings.$edit_wrapper.find('.js-form-close').attr('data-parent', class_name);
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
                    $this.siblings('.js-form-close').trigger('click');
                }
            },
            formClose: function(evt) {
                evt.preventDefault();
                const $this = APP.events.common.get_this(evt);
                const parent = $this.attr('data-parent');
                if (!parent) return;

                const wrapper = $this.attr('data-wrapper') ? $this.attr('data-wrapper') : 'app';
                $this.parents('.' + wrapper).find('.' + parent).trigger('click');
            },
            updateEvent: function() {
                const $url_box = $('.actioning.js-url_box', APP.elems.settings.$wrapper);
                let row_column = $url_box[0].classList[1].match(/\d/g);
                APP.current.task.data = {};
                APP.elems.settings.$edit_form.find('input').map(function(i, field) {
                    APP.current.task.data[field.name] = field.value;
                });
                APP.current.task.data['is_external'] = !!APP.current.task.data['url'].match(/^http|https/ig);
                APP.current.task.data['index'] = parseInt($url_box.attr('data-index'));
                APP.current.task.index = $url_box.attr('title');

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
        this.elems.view.$url_box_wrapper.on('click', '.js-url_box', this.events.view.urlBoxClick);

        // Default triggers.
        this.elems.common.$nav_btn.trigger('click');
        if (!APP.current.overall.length) this.elems.common.$nav_btn.trigger('click');
    },
    backend: {
        store: function() {
            const stored_data = APP.current.overall;
            const current_data =  APP.current.task.data;
            let index = stored_data.length;

            if (current_data.length) {
                current_data.forEach(function(data, i) {
                    if (isNaN(data.index) || data.index !== i) {
                        data.index = index + i;
                    }
                    stored_data.push(data);
                });
            } else if (Object.keys(current_data).length) {
                // Single insert here.
                if (isNaN(current_data.index)) {
                    current_data.index = index;
                }
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
            APP.validation.uniqueValueofBulkInsert();
            APP.validation.fieldValueCheck();
            APP.errorHandling();

            if (APP.current.task.is_continue) {
                this.store();
                this.pass();
            }
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
            APP.elems.common.$not_found_wrapper.removeClass('hidden');
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
                key = entry.is_external ? 'static' : 'dynamic';
                APP.current.data[key].push(entry);
            });
            APP.events.common.show404Page();
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
                entry.index = i;
                return entry;
            });
            APP.current.overall = new_data;

            localStorage.setItem('urls', JSON.stringify(APP.current.overall));
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

            if (current_task.data.length) {
                // Bulk insert. TODO: merge these to loop into one.
                current_task.data.forEach(function(entry, i) {
                    Object.keys(entry).forEach(function(key, i) {
                        if (/^ *$/.test(entry[key]) && exist_keys.indexOf(key) === -1) {
                            exist_keys.push(key);
                            current_task.errors.push(key + ' must have a value.');
                        }
                        APP.validation.fieldValueUniqueCheck({'key': key, 'value': entry[key]});
                    });
                });
            } else {
                // Single insert.
                Object.keys(current_task.data).forEach(function(key, i) {
                    if (/^ *$/.test(current_task.data[key])) {
                        current_task.errors.push(key + ' must have a value.');
                    }
                    APP.validation.fieldValueUniqueCheck({'key': key, 'value': current_task.data[key]});
                });
            }
            current_task.is_continue = !current_task.errors.length;
        },
        fieldValueUniqueCheck: function(args) {
            let is_duplicate;
            APP.current.overall.forEach(function(entry, i) {
                is_duplicate = (entry[args.key] === args.value);
                if (APP.current.task.data.index === i) {
                    is_duplicate = false;
                }

                if (args.key.match(/title|url/) && is_duplicate) {
                    APP.current.task.errors.push(args.key + ' already used. Try with another ' + args.key);
                    return false;
                }
            });
        },
        uniqueValueofBulkInsert: function() {
            let unique_values = {
                titles: [],
                urls: [],
            };
            APP.current.task.data.forEach(function(entry, i) {
                if (unique_values.titles.indexOf(entry.title) === -1) {
                    unique_values.titles.push(entry.title);
                } else {
                    APP.current.task.errors.push(entry.title + ' was already used. Title must be unique.');
                }

                if(unique_values.urls.indexOf(entry.url) === -1) {
                    unique_values.urls.push(entry.url);
                } else {
                    APP.current.task.errors.push(entry.url + ' was already used. Url must be unique.');
                }
            });
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

(function(APP, $) {
    $(function() {
        APP.elemInit();
        APP.eventInit();
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            const url_obj = new URL(tabs[0].url);
            APP.current.url = url_obj.origin;
        });
    });
})(APP, jQuery);
