const url_warehouse =  {
    _get_url: function (callback) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            callback(tabs[0].url);
        });
    },

    _get_domain: function (url) {
        var current_url_segments, currentDomain;
        current_url_segments = url.split('/');
        currentDomain = current_url_segments[0]+'//'+current_url_segments[1]+current_url_segments[2];
        localStorage.setItem('current_url', currentDomain);
    },

    get_domain: function () {
        return localStorage.getItem('current_url');
    },

    _get_source: function(alpha_index = '') {
        var data_source = JSON.parse(localStorage.getItem('data_source'));
        return data_source && data_source[alpha_index] ? data_source[alpha_index] : data_source || {};
    },

    _set_source: function(record) {
        var source, alpha_index;
        source = this._get_source();
        alpha_index = record.alpha_index ? record.alpha_index : this._get_index_name();

        source[alpha_index] = record;
        localStorage.setItem('data_source', JSON.stringify(source));
    },

    _get_index_name:  function() {
        return 'key|'+ new Date().getTime();
    },

    render_result: function() {
        var source, keys_of_obj, tr_template, url, record, that;
        that = this;
        source = that._get_source();
        keys_of_obj = Object.keys(source);

        if (!keys_of_obj.length) {
            tr_template = `
                <tr><td colSpan="4" class="text-center">No record found</td></tr>
            `;
            that.$tbody.append(tr_template);
            return;
        }

        keys_of_obj.forEach(function(alpha_index, index) {
            record = source[alpha_index];
            url = that.get_domain() + '/' + record.url;
            tr_template = `
            <tr>
                <td>${index+1}</td>
                <td><a href="${url}" target="_blank">${record.display_name}</a></td>
                <td><a href="${url}" target="_blank">${url}</a></td>
                <td>
                <button type="button" class="btn btn-warning js-edit-btn" title="Edit button" data-index="${alpha_index}"><i class='fas fa-edit'></i></button>
                <button type="button" class="btn btn-danger js-del-btn" title="Delete button" data-index="${alpha_index}"><i class='fas fa-trash-alt'></i></button>
                </td>
            </tr>
            `;
            that.$tbody.append(tr_template);
        });
    },

    refresh_records: function() {
        this.$tbody.children().remove();
        this.render_result();
    },

    _delete_record:  function(index) {
        var source;

        source = this._get_source();
        delete source[index];
        localStorage.setItem('data_source', JSON.stringify(source));
    },

    _render_edit_form: function($active_edit_btn) {
        var $td_siblings, $name_td, $url_td, $name_input, $url_input, record;

        $td_siblings = $active_edit_btn.parent().siblings();
        $name_td = $td_siblings.eq(1);
        $url_td = $td_siblings.eq(2);
        record = this._get_source($active_edit_btn.data('index'));

        $name_input = $('<input type="text" class="form-check-input td__input_name" name="edit_display_name" value="' + record.display_name + '" required>');
        $url_input = $('<input type="text" class="form-check-input td__input_url" name="edit_url" value="' + record.url + '" required>');

        $name_td.append($name_input);
        $url_td.append($url_input);
        $active_edit_btn.addClass('js-update-btn').removeClass('js-edit-btn').attr('title', 'Update button').html('<i class="fa fa-save"></i>');
    },

    _render_updated_record: function($active_update_btn, alpha_index) {
        var $td_siblings,$name_td, $url_td, source, url;

        $td_siblings = $active_update_btn.parent().siblings();
        $name_td = $td_siblings.eq(1);
        $url_td = $td_siblings.eq(2);
        source = this._get_source(alpha_index);
        url = this.get_domain() + '/' + source.url;

        $name_td.find('input').remove();
        $url_td.find('input').remove();
        $name_td.find('a').html(source.display_name).attr('href', url);
        $url_td.find('a').html(url).attr('href', url);

        $active_update_btn.addClass('js-edit-btn').removeClass('js-update-btn').attr('title', 'Edit button').html('<i class="fas fa-edit"></i>');
    },
};
url_warehouse._get_url(url_warehouse._get_domain);

$(document).ready(function() {
    url_warehouse.$table = $('.js-result-table', '.js-list-section');
    url_warehouse.$tbody = url_warehouse.$table.find('tbody');
    url_warehouse.render_result();

    $('.js-add-btn', '.js-add-form-section').on('click', function() {
        var $add_form, $display_name, $url, this_data;

        $add_form = $('.js-add-form-section', '.container');
        $display_name = $add_form.find('input[name="display_name"]');
        $url = $add_form.find('input[name="url"]');

        this_data = {
            'display_name': $display_name.val(),
            'url': $url.val(),
        };

        url_warehouse._set_source(this_data);
        url_warehouse.refresh_records();
    });

    url_warehouse.$table.on('click', '.js-del-btn', function() {
        var index, $dlt_btn;
        $dlt_btn = $(this);
        index = $dlt_btn.data('index');

        url_warehouse._delete_record(index);
        $parent_tr = $dlt_btn.parent().parent();
        $parent_tr.remove();

        if (!url_warehouse.$tbody.find('tr').length) {
            url_warehouse.render_result();
            return;
        }

        url_warehouse.$tbody.find('tr').each(function(index, tr) {
            $(tr).find('td').eq(0).html(index + 1);
        });
    });

    url_warehouse.$table.on('click', '.js-edit-btn', function() {
        var $active_edit_btn;
        $active_edit_btn = $(this);
        url_warehouse._render_edit_form($active_edit_btn);
    });

    url_warehouse.$table.on('click', '.js-update-btn', function() {
        var $active_update_btn, $parent_tr, $display_name, $url, alpha_index;

        $active_update_btn = $(this);
        $parent_tr = $active_update_btn.parent().parent();
        $display_name = $parent_tr.find('input[name="edit_display_name"]');
        $url = $parent_tr.find('input[name="edit_url"]');

        alpha_index = $active_update_btn.data('index');

        this_data = {
            'display_name': $display_name.val(),
            'url': $url.val(),
            'alpha_index': alpha_index,
        };
        url_warehouse._set_source(this_data);
        url_warehouse._render_updated_record($active_update_btn, alpha_index);
    });

});