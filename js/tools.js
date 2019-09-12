$.fn.datepicker.language['ru'] =  {
    days: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
    daysShort: ['Вос','Пон','Вто','Сре','Чет','Пят','Суб'],
    daysMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    monthsShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
    today: 'Сегодня',
    clear: 'Очистить',
    dateFormat: 'dd.mm.yyyy',
    timeFormat: 'hh:ii',
    firstDay: 1
};

$(document).ready(function() {

    $('.side').jScrollPane({autoReinitialise: true, verticalGutter: 0});

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('window-add')) {
            windowOpen(curLink.attr('href'));
        } else {
            windowOpen(curLink.attr('href'), true);
        }
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            if ($('.project-add-group-content .project-add-group-row').length > 0 || ($('.project-add-load').length > 0 && !$('.project-add-load').hasClass('disabled')) || ($('.form-input-project-name input').length > 0 && $('.form-input-project-name input').val() != '')) {
                if (confirm('Все введеные данные будут удалены')) {
                    windowClose();
                }
            } else {
                windowClose();
            }
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            if ($('.project-add-group-content .project-add-group-row').length > 0 || ($('.project-add-load').length > 0 && !$('.project-add-load').hasClass('disabled')) || ($('.form-input-project-name input').length > 0 && $('.form-input-project-name input').val() != '')) {
                if (confirm('Все введеные данные будут удалены')) {
                    windowClose();
                }
            } else {
                windowClose();
            }
        }
    });

    $(window).resize(function() {
        windowPosition();
    });

    $('body').on('click', '.window-close', function(e) {
        if ($('.project-add-group-content .project-add-group-row').length > 0 || ($('.project-add-load').length > 0 && !$('.project-add-load').hasClass('disabled')) || ($('.form-input-project-name input').length > 0 && $('.form-input-project-name input').val() != '')) {
            if (confirm('Все введеные данные будут удалены')) {
                windowClose();
            }
        } else {
            windowClose();
        }
        e.preventDefault();
    });

   $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        curField.find('.form-file-name').html(curInput.val().replace(/.*(\/|\\)/, ''));
    });

    $('body').on('click', '.project-tabs-menu ul li a', function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            var curTabs = curLi.parents().filter('.project-tabs');
            curTabs.find('.project-tabs-menu ul li.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = curTabs.find('.project-tabs-menu ul li').index(curLi);
            curTabs.find('.project-tab.active').removeClass('active');
            curTabs.find('.project-tab').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $.validator.addMethod('maskPhone',
        function(value, element) {
            if (value == '') {
                return true;
            }
            return /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/.test(value);
        },
        'Не соответствует формату'
    );

    $('form').each(function() {
        initForm($(this));
    });

    $('.header-projects-filter-title a').click(function(e) {
        var curBlock = $(this).parents().filter('.header-projects-filter-block');
        curBlock.toggleClass('open');
        e.preventDefault();
    });

    $('.header-projects-filter-link').click(function(e) {
        $('.header-projects-filter-window').toggleClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.header-projects-filter').length == 0 && $(e.target).parents().filter('.datepicker--nav-title').length == 0 && $(e.target).parents().filter('.datepicker--nav-action').length == 0 && $(e.target).parents().filter('.datepickers-container').length == 0 && !$(e.target).hasClass('datepicker--nav-title') && !$(e.target).hasClass('datepicker--cell') && $(e.target).parents().filter('.ui-autocomplete').length == 0  && $(e.target).parents().filter('.header-projects-filter-variant').length == 0) {
            $('.header-projects-filter-window').removeClass('open');
        }
    });

    $('#filterDateStart').datepicker('option', 'onSelect', function() { updateFilter(); });
    $('#filterDateStart').change(function() {updateFilter(); });
    $('#filterDateEnd').datepicker('option', 'onSelect', function() { updateFilter(); });
    $('#filterDateEnd').change(function() {updateFilter(); });
    $('#filterProgramms input').change(function() {
        updateFilter();
    });

    $('#filter-theatre').each(function() {
        var curInput = $(this);
        $.ajax({
            url: 'ajax/filter-theatre.json',
            dataType: 'json',
            success: function(data) {
                curInput.autocomplete({
                    minLength: 0,
                    source: data,
                    response: function(event, ui) {
                        var selected = [];
                        var curVariants = $(this).parents().filter('.header-projects-filter-variants');
                        curVariants.find('.header-projects-filter-variant input').each(function() {
                            selected.push($(this).val());
                        });
                        var newData = data.filter(function(curValue) { if (selected.indexOf(curValue.value) < 0) { return true; } } );
                        $('#filter-theatre').autocomplete('option', 'source', newData);
                    },
                    select: function(event, ui) {
                        var curVariants = $(this).parents().filter('.header-projects-filter-variants');
                        if (curVariants.find('.header-projects-filter-variant input[value="' + ui.item.value + '"]').length == 0) {
                            curVariants.find('.form-input').before('<div class="header-projects-filter-variant"><input type="hidden" name="cities[]" value="' + ui.item.value + '" />' + ui.item.value + '<span class="header-projects-filter-variant-remove"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 11.2 11.2"><path d="M11.2,1.12,10.08,0,5.6,4.48,1.12,0,0,1.12,4.48,5.6,0,10.08,1.12,11.2,5.6,6.72l4.48,4.48,1.12-1.12L6.72,5.6Zm0,0"/></svg></span></div>');
                            updateFilter();
                            var selected = [];
                            curVariants.find('.header-projects-filter-variant input').each(function() {
                                selected.push($(this).val());
                            });
                            var newData = data.filter(function(curValue) { if (selected.indexOf(curValue.value) < 0) { return true; } } );
                            $('#filter-theatre').autocomplete('option', 'source', newData);
                            $(this).blur();
                        }
                        this.value = '';
                        return false;
                    },
                    open: function(event, ui) {
                        $(this).parent().removeClass('loading');
                    },
                    close: function(event, ui) {
                        $(this).parent().removeClass('loading');
                    }
                }).focus(function() {
                    var autoInput = $(this);
                    autoInput.parent().addClass('loading');
                    window.setTimeout(function() {autoInput.data('uiAutocomplete').search(autoInput.val());}, 50);
                }).autocomplete('instance')._renderItem = function(ul, item) {
                    var term = this.element.val();
                    var regex = new RegExp('(' + term + ')', 'i');
                    var t = item.value.replace(regex , "<b>$&</b>");
                    return ul.append('<li><div>' + t + '<span>' + item.desc + '</span></div></li>');
                };
            }
        });
    });

    $('#filter-place').each(function() {
        var curInput = $(this);
        $.ajax({
            url: 'ajax/filter-place.json',
            dataType: 'json',
            success: function(data) {
                curInput.autocomplete({
                    minLength: 0,
                    source: data,
                    response: function(event, ui) {
                        var selected = [];
                        var curVariants = $(this).parents().filter('.header-projects-filter-variants');
                        curVariants.find('.header-projects-filter-variant input').each(function() {
                            selected.push($(this).val());
                        });
                        var newData = data.filter(function(curValue) { if (selected.indexOf(curValue.value) < 0) { return true; } } );
                        $('#filter-place').autocomplete('option', 'source', newData);
                    },
                    select: function(event, ui) {
                        var curVariants = $(this).parents().filter('.header-projects-filter-variants');
                        if (curVariants.find('.header-projects-filter-variant input[value="' + ui.item.value + '"]').length == 0) {
                            curVariants.find('.form-input').before('<div class="header-projects-filter-variant"><input type="hidden" name="cities[]" value="' + ui.item.value + '" />' + ui.item.value + '<span class="header-projects-filter-variant-remove"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 11.2 11.2"><path d="M11.2,1.12,10.08,0,5.6,4.48,1.12,0,0,1.12,4.48,5.6,0,10.08,1.12,11.2,5.6,6.72l4.48,4.48,1.12-1.12L6.72,5.6Zm0,0"/></svg></span></div>');
                            updateFilter();
                            var selected = [];
                            curVariants.find('.header-projects-filter-variant input').each(function() {
                                selected.push($(this).val());
                            });
                            var newData = data.filter(function(curValue) { if (selected.indexOf(curValue.value) < 0) { return true; } } );
                            $('#filter-place').autocomplete('option', 'source', newData);
                            $(this).blur();
                        }
                        this.value = '';
                        return false;
                    },
                    open: function(event, ui) {
                        $(this).parent().removeClass('loading');
                    },
                    close: function(event, ui) {
                        $(this).parent().removeClass('loading');
                    }
                }).focus(function() {
                    var autoInput = $(this);
                    autoInput.parent().addClass('loading');
                    window.setTimeout(function() {autoInput.data('uiAutocomplete').search(autoInput.val());}, 50);
                }).autocomplete('instance')._renderItem = function(ul, item) {
                    var term = this.element.val();
                    var regex = new RegExp('(' + term + ')', 'i');
                    var t = item.value.replace(regex , "<b>$&</b>");
                    return ul.append('<li><div>' + t + '<span>' + item.desc + '</span></div></li>');
                };
            }
        });
    });

    $('#filter-city').each(function() {
        var curInput = $(this);
        $.ajax({
            url: 'ajax/filter-city.json',
            dataType: 'json',
            success: function(data) {
                curInput.autocomplete({
                    minLength: 0,
                    source: data,
                    response: function(event, ui) {
                        var selected = [];
                        var curVariants = $(this).parents().filter('.header-projects-filter-variants');
                        curVariants.find('.header-projects-filter-variant input').each(function() {
                            selected.push($(this).val());
                        });
                        var newData = data.filter(function(curValue) { if (selected.indexOf(curValue.value) < 0) { return true; } } );
                        $('#filter-city').autocomplete('option', 'source', newData);
                    },
                    select: function(event, ui) {
                        var curVariants = $(this).parents().filter('.header-projects-filter-variants');
                        if (curVariants.find('.header-projects-filter-variant input[value="' + ui.item.value + '"]').length == 0) {
                            curVariants.find('.form-input').before('<div class="header-projects-filter-variant"><input type="hidden" name="cities[]" value="' + ui.item.value + '" />' + ui.item.value + '<span class="header-projects-filter-variant-remove"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 11.2 11.2"><path d="M11.2,1.12,10.08,0,5.6,4.48,1.12,0,0,1.12,4.48,5.6,0,10.08,1.12,11.2,5.6,6.72l4.48,4.48,1.12-1.12L6.72,5.6Zm0,0"/></svg></span></div>');
                            updateFilter();
                            var selected = [];
                            curVariants.find('.header-projects-filter-variant input').each(function() {
                                selected.push($(this).val());
                            });
                            var newData = data.filter(function(curValue) { if (selected.indexOf(curValue.value) < 0) { return true; } } );
                            $('#filter-city').autocomplete('option', 'source', newData);
                            $(this).blur();
                        }
                        this.value = '';
                        return false;
                    },
                    open: function(event, ui) {
                        $(this).parent().removeClass('loading');
                    },
                    close: function(event, ui) {
                        $(this).parent().removeClass('loading');
                    }
                }).focus(function() {
                    var autoInput = $(this);
                    autoInput.parent().addClass('loading');
                    window.setTimeout(function() {autoInput.data('uiAutocomplete').search(autoInput.val());}, 50);
                }).autocomplete('instance')._renderItem = function(ul, item) {
                    var term = this.element.val();
                    var regex = new RegExp('(' + term + ')', 'i');
                    var t = item.value.replace(regex , "<b>$&</b>");
                    return ul.append('<li><div>' + t + '<span>' + item.desc + '</span></div></li>');
                };
            }
        });
    });

    $('body').on('click', '.header-projects-filter-variant-remove', function() {
        var curVariant = $(this).parents().filter('.header-projects-filter-variant');
        var curVariants = curVariant.parent();
        curVariant.remove();
        curVariants.find('.form-input input').autocomplete('search', '').trigger('blur');
        updateFilter();
    });

    $('body').on('click', '.project-add-group-add-link a', function(e) {
        var curBlock = $(this).parents().filter('.project-add-group');
        curBlock.find('.project-add-group-content').append(curBlock.find('.project-add-group-add-template').html());
        curBlock.find('.project-add-group-content input[type="text"]').attr('autocomplete', 'off');
        if (curBlock.find('.project-add-group-content .project-add-group-row').length > 0) {
            curBlock.find('.project-add-group-headers').css({'display': 'table'});
        }
        if (curBlock.find('.project-add-place-content .project-add-group-row').length == 0) {
            curBlock.find('.project-add-group-content .project-add-group-headers').css({'display': 'none'});
        }
        $('.project-add-block-1 .project-add-group-content .project-add-place-content:last').each(function() {
            Sortable.create(this, {
                handle: '.project-add-group-row-drag',
                animation: 150
            });
        });
        curBlock.find('.project-add-group-content .project-add-place-header-title input:not(.ui-autocomplete-input)').each(function() {
            var curInput = $(this);
            $.ajax({
                url: 'ajax/filter-place.json',
                dataType: 'json',
                success: function(data) {
                    curInput.autocomplete({
                        minLength: 0,
                        source: data,
                        classes: {
                            'ui-autocomplete': 'ui-autocomplete-2'
                        },
                        select: function(event, ui) {
                            $(this).parent().addClass('form-input-selected');
                            $(this).trigger('blur').prop('disabled', true);
                            this.value = ui.item.value;
                            $(this).parents().filter('.project-add-place').find('.project-add-place-content').html('');
                            reloadProjectAddPlaces($(this));
                            $('#project-add-block-places-count').val('yes').parent().find('label.error').remove();
                            $(this).blur();
                            return false;
                        },
                        open: function(event, ui) {
                            $(this).parent().removeClass('loading');
                        },
                        close: function(event, ui) {
                            $(this).parent().removeClass('loading');
                        }
                    }).focus(function() {
                        var autoInput = $(this);
                        autoInput.parent().addClass('loading');
                        window.setTimeout(function() {autoInput.data('uiAutocomplete').search(autoInput.val());}, 50);
                    }).autocomplete('instance')._renderItem = function(ul, item) {
                        var term = this.element.val();
                        var regex = new RegExp('(' + term + ')', 'i');
                        var t = item.value.replace(regex , "<b>$&</b>");
                        return ul.append('<li><div>' + t + '<span>' + item.desc + '</span></div></li>');
                    };
                }
            });
        });
        e.preventDefault();
    });

    $('.project-add-block-1').find('.project-add-group-content .project-add-place-header-title input:not(.ui-autocomplete-input)').each(function() {
        var curInput = $(this);
        $.ajax({
            url: 'ajax/filter-place.json',
            dataType: 'json',
            success: function(data) {
                curInput.autocomplete({
                    minLength: 0,
                    source: data,
                    classes: {
                        'ui-autocomplete': 'ui-autocomplete-2'
                    },
                    select: function(event, ui) {
                        $(this).parent().addClass('form-input-selected');
                        $(this).trigger('blur').prop('disabled', true);
                        this.value = ui.item.value;
                        $(this).parents().filter('.project-add-place').find('.project-add-place-content').html('');
                        reloadProjectAddPlaces($(this));
                        $('#project-add-block-places-count').val('yes').parent().find('label.error').remove();
                        $(this).blur();
                        return false;
                    },
                    open: function(event, ui) {
                        $(this).parent().removeClass('loading');
                    },
                    close: function(event, ui) {
                        $(this).parent().removeClass('loading');
                    }
                }).focus(function() {
                    var autoInput = $(this);
                    autoInput.parent().addClass('loading');
                    window.setTimeout(function() {autoInput.data('uiAutocomplete').search(autoInput.val());}, 50);
                }).autocomplete('instance')._renderItem = function(ul, item) {
                    var term = this.element.val();
                    var regex = new RegExp('(' + term + ')', 'i');
                    var t = item.value.replace(regex , "<b>$&</b>");
                    return ul.append('<li><div>' + t + '<span>' + item.desc + '</span></div></li>');
                };
            }
        });
        curInput.parent().addClass('form-input-selected');
        curInput.trigger('blur').prop('disabled', true);
        if (curInput.parent().find('input[type="hidden"]').length > 0) {
            reloadProjectAddPlaces(curInput);
        }
    });

    $('body').on('click', '.project-add-place-show-add-link a', function(e) {
        var curBlock = $(this).parents().filter('.project-add-place');
        curBlock.find('.project-add-place-content').append(curBlock.find('.project-add-place-show-add-template').html());
        curBlock.find('.project-add-group-headers').css({'display': 'table'});
        curBlock.find('.project-add-place-content').find('.form-input-date_').removeClass('form-input-date_').addClass('form-input-date');
        curBlock.find('.project-add-place-content').find('.form-input-date input').each(function() {
            $(this).attr('autocomplete', 'off');
            var minDateText = $(this).attr('min');
            var minDate = null;
            if (typeof (minDateText) != 'undefined') {
                var minDateArray = minDateText.split('.');
                minDate = new Date(minDateArray[2] + '-' + minDateArray[1] + '-' + minDateArray[0]);
            }
            var maxDateText = $(this).attr('max');
            var maxDate = null;
            if (typeof (maxDateText) != 'undefined') {
                var maxDateArray = maxDateText.split('.');
                maxDate = new Date(maxDateArray[2] + '-' + maxDateArray[1] + '-' + maxDateArray[0]);
            }
            $(this).datepicker({
                language: 'ru',
                minDate: minDate,
                maxDate: maxDate,
                autoClose: true
            });
            if (typeof ($(this).attr('value')) != 'undefined') {
                var curValue = $(this).val();
                if (curValue != '') {
                    var startDateArray = curValue.split('.');
                    startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
                    $(this).data('datepicker').selectDate(startDate);
                }
            }
            $(this).on('change', function() {
                var curValue = $(this).val();
                if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                    var myDatepicker = $(this).data('datepicker');
                    if (myDatepicker) {
                        var curValueArray = curValue.split('.');
                        myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                    }
                } else {
                    var myDatepicker = $(this).data('datepicker');
                    if (myDatepicker) {
                        myDatepicker.clear();
                    }
                }
            });
            $(this).on('keyup', function() {
                var curValue = $(this).val();
                if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                    var myDatepicker = $(this).data('datepicker');
                    if (myDatepicker) {
                        var curValueArray = curValue.split('.');
                        myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                        myDatepicker.show();
                        $(this).focus();
                    }
                }
            });
        });
        curBlock.find('.project-add-place-content').find('.form-input-time_').removeClass('form-input-time_').addClass('form-input-time');
        curBlock.find('.form-input-time input').mask('99:99');
        e.preventDefault();
    });

    $('body').on('click', '.project-add-group-row-remove', function(e) {
        if (confirm('Вы подтверждаете удаление?')) {
            var curBlock = $(this).parents().filter('.project-add-group-row');
            var curBlockP = $(this).parents().filter('.project-add-group');
            curBlock.remove();
            if (curBlockP.find('.project-add-group-content .project-add-group-row').length == 0) {
                curBlockP.find('.project-add-group-headers').css({'display': 'none'});
            }
            if (curBlockP.find('.project-add-place-content .project-add-group-row').length == 0) {
                curBlockP.find('.project-add-group-content .project-add-group-headers').css({'display': 'none'});
            }
            recalcProject();
        }
        e.preventDefault();
    });

    $('body').on('click', '.project-add-place-header-remove', function(e) {
        if (confirm('Вы подтверждаете удаление?')) {
            var curBlock = $(this).parents().filter('.project-add-place');
            curBlock.remove();
            var curBlockP = $(this).parents().filter('.project-add-group');
            if (curBlockP.find('.project-add-place-content .project-add-group-row').length == 0) {
                curBlockP.find('.project-add-group-headers').css({'display': 'none'});
            }
            if ($('.project-add-block-1 .project-add-group-content .project-add-group-row').length == 0) {
                $('#project-add-block-places-count').val('');
            }
        }
        e.preventDefault();
    });

    $('body').on('click', '.form-dropdown-value', function(e) {
        var curDropdown = $(this).parent();
        if (curDropdown.hasClass('open')) {
            curDropdown.removeClass('open');
        } else {
            $('.form-dropdown.open').removeClass('open');
            curDropdown.addClass('open');
        }
        e.preventDefault();
    });

    $('body').on('click', '.form-dropdown-list ul li span', function(e) {
        var curDropdown = $(this).parents().filter('.form-dropdown');
        curDropdown.find('input').val($(this).data('id'));
        curDropdown.find('.form-dropdown-value').html($(this).html());
        curDropdown.removeClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.form-dropdown').length == 0) {
            $('.form-dropdown.open').removeClass('open');
        }
    });

    $('body').on('click', '.form-show-time-antrakt-link a', function(e) {
        $('.form-show-time-antrakt').show();
        $('.form-show-time-antrakt-link').hide();
        e.preventDefault();
    });

    $('body').on('click', '.form-show-time-antrakt-remove', function(e) {
        $('.form-show-time-antrakt').hide();
        $('.form-show-time-antrakt-link').show();
        e.preventDefault();
    });

    $('body').on('click', '.show-authors-link a', function(e) {
        var curLink = $(this);
        var curName = curLink.data('name');
        $('.show-authors-content').append($('.show-authors-template').html());
        var curField = $('.show-authors-content .show-author:last');
        curField.find('.form-label').html(curLink.html());
        curField.find('.form-input input').attr('name', curName);
        curLink.parent().hide();
        e.preventDefault();
    });

    $('body').on('click', '.show-author-remove', function(e) {
        var curField = $(this).parents().filter('.show-author');
        var curName = curField.find('.form-input input').attr('name');
        curField.remove();
        $('.show-authors-link a[data-name="' + curName + '"]').parent().show();
        e.preventDefault();
    });

    $('body').on('click', '.form-show-video-add-link a', function(e) {
        $('.form-show-video-add-link').before('<div class="form-show-video-add">' + $('.form-show-video-add-template').html() + '</div>');
        e.preventDefault();
    });

    $('body').on('click', '.show-video-remove', function(e) {
        $(this).parents().filter('.form-show-video-add').remove();
        e.preventDefault();
    });

    $('body').on('change', '.show-photo input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.show-photo');
        var curForm = curField.parents().filter('form');
        curField.find('.show-photo-name-text').html(curInput.val().replace(/.*(\/|\\)/, ''));
        var file = curInput[0].files[0];
        if (file) {
            curField.find('.show-photo-name-text').html(file.name);
            var curSizeText = ' B';
            var curSize = file.size;
            if (curSize > 1023) {
                curSize = curSize / 1000;
                curSizeText = ' Kb';
            }
            if (curSize > 1023) {
                curSize = curSize / 1000;
                curSizeText = ' Mb';
            }
            if (curSize > 1023) {
                curSize = curSize / 1000;
                curSizeText = ' Gb';
            }
            curField.find('.show-photo-size').html(curSize.toFixed(2) + curSizeText);
            $('.show-photos-required').val('1');
        }
        curForm.find('.show-photos').append(curForm.data('showPhotosCode'));
    });

    $('body').on('click', '.show-photo-name-remove', function() {
        var curField = $(this).parents().filter('.show-photo');
        curField.remove();
        if ($('.show-photo').length == 1 && $('.show-photo').eq(0).find('.show-photo-name-text').html() == '') {
            $('.show-photos-required').val('');
        }
    });

    $('body').on('keypress', '.project-add-count', function(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 43 || charCode > 57)) {
            return false;
        }
        return true;
    });

    $('body').on('keypress', '.project-add-price', function(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 43 || charCode > 57)) {
            return false;
        }
        return true;
    });

    $('body').on('change', '.project-add-count', function() {
        var newValue = Number($(this).val());
        if (newValue >= 0) {
        } else {
            newValue = 0;
        }
        $(this).val(newValue.toFixed(0));
        recalcProject();
    });

    $('body').on('change', '.project-add-price', function() {
        var newValue = Number($(this).val());
        if (newValue >= 0) {
        } else {
            newValue = 0;
        }
        if (newValue == 0) {
            $(this).val('');
        } else {
            $(this).val(newValue.toFixed(2));
        }
        recalcProject();
    });

    $('.gallery').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false
    });

    $('body').on('click', '.form-temp-link', function(e) {
        var projectForm = $(this).parents().filter('form');
        var validator = projectForm.validate();
        validator.destroy();
        projectForm.trigger('submit');
        e.preventDefault();
    });

    $('body').on('keydown', '.project-add-group-cell-01 input', function(e) {
        switch(e.keyCode) {
            case 13:
                $(this).parents().filter('.project-add-group-row').find('.project-add-group-cell-02 input').focus();
                return false;
                break;
            default:
                break;
        }
    });

    $('body').on('keydown', '.project-add-group-cell-02 input', function(e) {
        switch(e.keyCode) {
            case 13:
                $(this).parents().filter('.project-add-group-row').find('.project-add-group-cell-03 input').focus();
                return false;
                break;
            default:
                break;
        }
    });

    $('body').on('keydown', '.project-add-group-cell-03 input', function(e) {
        switch(e.keyCode) {
            case 13:
                $(this).parents().filter('.project-add-group-row').find('.project-add-group-cell-04 input').focus();
                return false;
                break;
            default:
                break;
        }
    });

    $('body').on('keydown', '.project-add-group-cell-04 input', function(e) {
        switch(e.keyCode) {
            case 13:
                $(this).blur();
                return false;
                break;
            default:
                break;
        }
    });

    $('.project-add-block-2 .project-add-group-content').each(function() {
        Sortable.create(this, {
            handle: '.project-add-group-row-drag',
            animation: 150
        });
    });

    $('.project-add-block-1 .project-add-group-content').each(function() {
        Sortable.create(this, {
            handle: '.project-add-place-header-drag',
            animation: 150
        });
    });

    $('#project-theatre').each(function() {
        var curInput = $(this);
        $.ajax({
            url: 'ajax/filter-theatre.json',
            dataType: 'json',
            success: function(data) {
                curInput.autocomplete({
                    minLength: 0,
                    source: data,
                    classes: {
                        'ui-autocomplete': 'ui-autocomplete-2'
                    },
                    select: function(event, ui) {
                        this.value = ui.item.value;
                        $(this).parent().addClass('form-input-selected');
                        $(this).trigger('blur').prop('disabled', true);
                        $('#project-theatre-id').val(ui.item.id);
                        $('.project-add-place-content').html('');
                        $('.project-add-group-content').html('');
                        reloadProjectAdd();
                        $(this).blur();
                        return false;
                    },
                    open: function(event, ui) {
                        $(this).parent().removeClass('loading');
                    },
                    close: function(event, ui) {
                        $(this).parent().removeClass('loading');
                    }
                }).focus(function() {
                    var autoInput = $(this);
                    autoInput.parent().addClass('loading');
                    window.setTimeout(function() {autoInput.data('uiAutocomplete').search(autoInput.val());}, 50);
                }).autocomplete('instance')._renderItem = function(ul, item) {
                    var term = this.element.val();
                    var regex = new RegExp('(' + term + ')', 'i');
                    var t = item.value.replace(regex , "<b>$&</b>");
                    return ul.append('<li><div>' + t + '<span>' + item.desc + '</span></div></li>');
                };
            }
        });
        if (curInput.val() != '') {
            curInput.parent().addClass('form-input-selected');
            curInput.trigger('blur').prop('disabled', true);
            reloadProjectAdd();
            recalcProject();
            $('.project-add-block-1 .project-add-group-content .project-add-place-content').each(function() {
                Sortable.create(this, {
                    handle: '.project-add-group-row-drag',
                    animation: 150
                });
            });
        }
    });

    $('.project-theatre-remove').click(function(e) {
        if (confirm('Все введеные данные будут удалены')) {
            $('#project-theatre-id').val('');
            $('.project-add-place-content').html('');
            $('.project-add-group-content').html('');
            $('#project-theatre').parent().removeClass('form-input-selected');
            $('#project-theatre').prop('disabled', false).val('').trigger('focus');
        }
        e.preventDefault();
    });

    $('.project-theatre-manager').each(function() {
        reloadProjectAdd();
    });

    if ($('.form-show-add').length == 1) {
        var showForm = $('.form-show-add');
        var validator = showForm.validate();
        validator.destroy();

        showForm.validate({
            ignore: '',
            submitHandler: function(form) {
                $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    data: new FormData(form),
                    cash: false,
                }).done(function(data) {
                    if (data.status == 'ok') {
                        window.location.href = '4.2_tour_projects_add.html';
                    }
                });
            }
        });
    }

});

function windowOpen(linkWindow, addWindow = false, dataWindow, callbackWindow) {
    if (!addWindow) {
        var curPadding = $('.wrapper').width();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        if ($('.window').length == 0) {
            $('body').append('<div class="window"><div class="window-loading"></div></div>')
        }
    } else {
        $('body').append('<div class="window"><div class="window-loading"></div></div>')
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        $('.window:last').html('<div class="window-container window-container-load"><div class="window-content">' + html + '<a href="#" class="window-close"></a></div></div>')

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').one('load', function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    $('.window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        if (typeof (callbackWindow) != 'undefined') {
            callbackWindow.call();
        }

        $('.window form').each(function() {
            initForm($(this));
        });

    });
}

function windowPosition() {
    if ($('.window').length > 0) {
        $('.window:last .window-container').css({'left': '50%', 'margin-left': -$('.window:last .window-container').width() / 2});

        $('.window:last .window-container').css({'top': '50%', 'margin-top': -$('.window:last .window-container').height() / 2, 'padding-bottom': 0});
        if ($('.window:last .window-container').height() > $('.window:last').height() - 60) {
            $('.window:last .window-container').css({'top': '30px', 'margin-top': 0, 'padding-bottom': 30});
        }
    }
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window:last').remove();
        if ($('.window').length == 0) {
            $('html').removeClass('window-open');
            $('body').css({'margin-right': 0});
        }
    }
}

$(window).on('resize', function() {
    $('.form-select select').chosen('destroy');
    $('.form-select select').chosen({disable_search: true, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
});

var dateFormat = 'dd.mm.yy';

function initForm(curForm) {
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});

    curForm.find('.form-input-date input').each(function() {
        $(this).attr('autocomplete', 'off');
        var minDateText = $(this).attr('min');
        var minDate = null;
        if (typeof (minDateText) != 'undefined') {
            var minDateArray = minDateText.split('.');
            minDate = new Date(minDateArray[2] + '-' + minDateArray[1] + '-' + minDateArray[0]);
        }
        var maxDateText = $(this).attr('max');
        var maxDate = null;
        if (typeof (maxDateText) != 'undefined') {
            var maxDateArray = maxDateText.split('.');
            maxDate = new Date(maxDateArray[2] + '-' + maxDateArray[1] + '-' + maxDateArray[0]);
        }
        $(this).datepicker({
            language: 'ru',
            minDate: minDate,
            maxDate: maxDate,
            autoClose: true
        });
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
                $(this).data('datepicker').selectDate(startDate);
            }
        }
        $(this).on('change', function() {
            var curValue = $(this).val();
            if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    var curValueArray = curValue.split('.');
                    myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                }
            } else {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    myDatepicker.clear();
                }
            }
        });
        $(this).on('keyup', function() {
            var curValue = $(this).val();
            if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    var curValueArray = curValue.split('.');
                    myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                    myDatepicker.show();
                    $(this).focus();
                }
            }
        });
    });

    curForm.find('.form-file input').change(function() {
        var curInput = $(this);
        var curField = curInput.parent().parent().parent().parent();
        curField.find('.form-file-name').html(curInput.val().replace(/.*(\/|\\)/, ''));
        curField.find('label.error').remove();
        curField.removeClass('error');
    });

    if (curForm.find('.show-photos').length > 0) {
        curForm.data('showPhotosCode', curForm.find('.show-photos').html());
    }

    curForm.validate({
        ignore: '',
        invalidHandler: function(form, validatorcalc) {
            validatorcalc.showErrors();
            checkErrors();
        }
    });
}

function checkErrors() {
    $('.form-checkbox, .form-file').each(function() {
        var curField = $(this);
        if (curField.find('input.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('input.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });
}

function updateFilter() {
    $('#projects-container').find('.loading').remove();
    $('#projects-container').append('<div class="loading"></div>');
    $.ajax({
        type: 'POST',
        url: 'ajax/filter-update.html',
        dataType: 'html',
        data: $('.header-projects-filter-window form').serialize(),
        cash: false,
        success: function(data) {
            $('#projects-container').html(data);
        }
    });
}

function reloadProjectAdd() {
    var curTheatre = $('#project-theatre-id').val();
    $('.project-add-load').addClass('loading');
    $.ajax({
        type: 'POST',
        url: 'ajax/project-add-shows.json',
        dataType: 'json',
        data: {theatrid: curTheatre},
        cache: false
    }).done(function(data) {
        var newHTML = '';
        for (var i = 0; i < data.length; i++) {
            newHTML += '<li><span data-id="' + data[i].id + '">' + data[i].name + '</span></li>';
        }
        $('.project-add-place-show-add-template').each(function() {
            var curTemplate = $(this);
            curTemplate.find('.project-add-group-cell-07 .form-dropdown-list ul li span').each(function() {
                $(this).parent().remove();
            });
            curTemplate.find('.project-add-group-cell-07 .form-dropdown-list ul').prepend(newHTML);
        });
        $('.project-add-group-row').each(function() {
            var curRow = $(this);
            curRow.find('.project-add-group-cell-07 .form-dropdown-list ul li span').each(function() {
                $(this).parent().remove();
            });
            curRow.find('.project-add-group-cell-07 .form-dropdown-list ul').prepend(newHTML);
            curRow.parent().parent().find('.project-add-group-headers').css({'display': 'table'});

            curRow.find('.form-input-date_').removeClass('form-input-date_').addClass('form-input-date');
            curRow.find('.form-input-date input').each(function() {
                $(this).attr('autocomplete', 'off');
                var minDateText = $(this).attr('min');
                var minDate = null;
                if (typeof (minDateText) != 'undefined') {
                    var minDateArray = minDateText.split('.');
                    minDate = new Date(minDateArray[2] + '-' + minDateArray[1] + '-' + minDateArray[0]);
                }
                var maxDateText = $(this).attr('max');
                var maxDate = null;
                if (typeof (maxDateText) != 'undefined') {
                    var maxDateArray = maxDateText.split('.');
                    maxDate = new Date(maxDateArray[2] + '-' + maxDateArray[1] + '-' + maxDateArray[0]);
                }
                $(this).datepicker({
                    language: 'ru',
                    minDate: minDate,
                    maxDate: maxDate,
                    autoClose: true
                });
                if (typeof ($(this).attr('value')) != 'undefined') {
                    var curValue = $(this).val();
                    if (curValue != '') {
                        var startDateArray = curValue.split('.');
                        startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
                        $(this).data('datepicker').selectDate(startDate);
                    }
                }
                $(this).on('change', function() {
                    var curValue = $(this).val();
                    if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                        var myDatepicker = $(this).data('datepicker');
                        if (myDatepicker) {
                            var curValueArray = curValue.split('.');
                            myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                        }
                    } else {
                        var myDatepicker = $(this).data('datepicker');
                        if (myDatepicker) {
                            myDatepicker.clear();
                        }
                    }
                });
                $(this).on('keyup', function() {
                    var curValue = $(this).val();
                    if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                        var myDatepicker = $(this).data('datepicker');
                        if (myDatepicker) {
                            var curValueArray = curValue.split('.');
                            myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                            myDatepicker.show();
                            $(this).focus();
                        }
                    }
                });
            });
            curRow.find('.form-input-time_').removeClass('form-input-time_').addClass('form-input-time');
            curRow.find('.form-input-time input').mask('99:99');
        });

        $('.project-add-place .project-add-place-header-title input[type!="hidden"]').each(function() {
            reloadProjectAddPlaces($(this));
        });

        $('.project-add-load').removeClass('loading disabled');
        windowPosition();
    });
}

function reloadProjectAddPlaces(curInput) {
    var curPlace = curInput.val();
    var curBlock = curInput.parents().filter('.project-add-place');
    $.ajax({
        type: 'POST',
        url: 'ajax/project-add-places.json',
        dataType: 'json',
        data: {place: curPlace, theatrid: $('#project-theatre-id').val()},
        cache: false
    }).done(function(data) {
        var newHTML = '';
        for (var i = 0; i < data.length; i++) {
            newHTML += '<li><span data-id="' + data[i].id + '">' + data[i].name + '</span></li>';
        }
        curBlock.find('.project-add-group-row .project-add-group-cell-08 .form-dropdown-list ul').html(newHTML);
        curBlock.find('.project-add-place-show-add-template .project-add-group-cell-08 .form-dropdown-list ul').html(newHTML);
        curBlock.find('.project-add-place-content, .project-add-place-show-add-link').show();

    });
}

function recalcProject() {
    var curSumm = 0;

    $('.project-add-block-2 .project-add-group').each(function() {
        var curGroup = $(this);
        var curSummGroup = 0;
        curGroup.find('.project-add-group-content .project-add-group-row').each(function() {
            var curRow = $(this);
            var curSummRow = (Number(curRow.find('.project-add-count').val()) * Number(curRow.find('.project-add-price').val())).toFixed(2);
            curRow.find('.project-add-summ').val(curSummRow);
            curSummGroup += Number(curSummRow);
        });
        curGroup.find('.project-add-group-header-summ').html(String(Number(curSummGroup).toFixed(2)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
        curSumm += curSummGroup;
    });
    $('.project-add-summ-value').html(String(Number(curSumm).toFixed(2)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
}