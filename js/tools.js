$(document).ready(function() {

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
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $(window).resize(function() {
        windowPosition();
    });

    $('body').on('click', '.window-close', function(e) {
        windowClose();
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
        if ($(e.target).parents().filter('.header-projects-filter').length == 0 && $(e.target).parents().filter('.ui-datepicker').length == 0 && !$(e.target).hasClass('ui-datepicker') && !$(e.target).hasClass('ui-datepicker-next') && !$(e.target).hasClass('ui-datepicker-prev') && $(e.target).parents().filter('.ui-autocomplete').length == 0 && $(e.target).parents().filter('.header-projects-filter-variant').length == 0) {
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
                    select: function(event, ui) {
                        var curVariants = $(this).parents().filter('.header-projects-filter-variants');
                        curVariants.find('.form-input').before('<div class="header-projects-filter-variant"><input type="hidden" name="cities[]" value="' + ui.item.value + '" />' + ui.item.value + '<span class="header-projects-filter-variant-remove"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 11.2 11.2"><path d="M11.2,1.12,10.08,0,5.6,4.48,1.12,0,0,1.12,4.48,5.6,0,10.08,1.12,11.2,5.6,6.72l4.48,4.48,1.12-1.12L6.72,5.6Zm0,0"/></svg></span></div>');
                        this.value = '';
                        updateFilter();
                        return false;
                    }
                }).autocomplete('instance')._renderItem = function(ul, item) {
                    return $('<li>').append('<div>' + item.value + '<span>' + item.desc + '</span></div>').appendTo(ul);
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
                    select: function(event, ui) {
                        var curVariants = $(this).parents().filter('.header-projects-filter-variants');
                        curVariants.find('.form-input').before('<div class="header-projects-filter-variant"><input type="hidden" name="cities[]" value="' + ui.item.value + '" />' + ui.item.value + '<span class="header-projects-filter-variant-remove"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 11.2 11.2"><path d="M11.2,1.12,10.08,0,5.6,4.48,1.12,0,0,1.12,4.48,5.6,0,10.08,1.12,11.2,5.6,6.72l4.48,4.48,1.12-1.12L6.72,5.6Zm0,0"/></svg></span></div>');
                        this.value = '';
                        updateFilter();
                        return false;
                    }
                }).autocomplete('instance')._renderItem = function(ul, item) {
                    return $('<li>').append('<div>' + item.value + '<span>' + item.desc + '</span></div>').appendTo(ul);
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
                    select: function(event, ui) {
                        var curVariants = $(this).parents().filter('.header-projects-filter-variants');
                        curVariants.find('.form-input').before('<div class="header-projects-filter-variant"><input type="hidden" name="cities[]" value="' + ui.item.value + '" />' + ui.item.value + '<span class="header-projects-filter-variant-remove"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 11.2 11.2"><path d="M11.2,1.12,10.08,0,5.6,4.48,1.12,0,0,1.12,4.48,5.6,0,10.08,1.12,11.2,5.6,6.72l4.48,4.48,1.12-1.12L6.72,5.6Zm0,0"/></svg></span></div>');
                        this.value = '';
                        updateFilter();
                        return false;
                    }
                }).autocomplete('instance')._renderItem = function(ul, item) {
                    return $('<li>').append('<div>' + item.value + '<span>' + item.desc + '</span></div>').appendTo(ul);
                };
            }
        });
    });

    $('body').on('click', '.header-projects-filter-variant-remove', function() {
        var curVariant = $(this).parents().filter('.header-projects-filter-variant');
        curVariant.remove();
        updateFilter();
    });

    $('body').on('click', '.project-add-group-add-link a', function(e) {
        var curBlock = $(this).parents().filter('.project-add-group');
        curBlock.find('.project-add-group-content').append(curBlock.find('.project-add-group-add-template').html());
        curBlock.find('.project-add-group-headers').css({'display': 'table'});
        $('.project-add-place-content').sortable('refresh');
        $('.project-add-group-content').sortable('refresh');
        e.preventDefault();
    });

    $('body').on('click', '.project-add-place-show-add-link a', function(e) {
        var curBlock = $(this).parents().filter('.project-add-place');
        curBlock.find('.project-add-place-content').append(curBlock.find('.project-add-place-show-add-template').html());
        curBlock.find('.project-add-group-headers').css({'display': 'table'});
        $('.project-add-place-content').sortable('refresh');
        $('.project-add-group-content').sortable('refresh');
        curBlock.find('.project-add-place-content').find('.form-input-date input').each(function() {
            $(this).datepicker({
                dateFormat: dateFormat,
                showOtherMonths: true,
                selectOtherMonths: true
            });
        });
        e.preventDefault();
    });

    $('body').on('click', '.project-add-group-row-remove', function(e) {
        if (confirm('Вы подтверждаете удаление?')) {
            var curBlock = $(this).parents().filter('.project-add-group-row');
            var curBlockP = $(this).parents().filter('.project-add-group');
            curBlock.remove();
            if (curBlockP.find('.project-add-group-content *').length == 0) {
                curBlockP.find('.project-add-group-headers').css({'display': 'none'});
            }
            if (curBlockP.find('.project-add-place-content *').length == 0) {
                curBlockP.find('.project-add-group-headers').css({'display': 'none'});
            }
            $('.project-add-place-content').sortable('refresh');
            $('.project-add-group-content').sortable('refresh');
        }
        e.preventDefault();
    });

    $('body').on('click', '.project-add-place-header-remove', function(e) {
        if (confirm('Вы подтверждаете удаление?')) {
            var curBlock = $(this).parents().filter('.project-add-place');
            curBlock.remove();
            $('.project-add-place-content').sortable('refresh');
            $('.project-add-group-content').sortable('refresh');
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
        var curIndex = $('.show-authors-link').index($(this).parent());
        $('.show-author').eq(curIndex).show();
        $('.show-authors-link').eq(curIndex).hide();
        e.preventDefault();
    });

    $('body').on('click', '.show-author-remove', function(e) {
        var curIndex = $('.show-author').index($(this).parents().filter('.show-author'));
        $('.show-author').eq(curIndex).hide();
        $('.show-authors-link').eq(curIndex).show();
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
        }
        curForm.find('.show-photos').append(curForm.data('showPhotosCode'));
    });

    $('body').on('click', '.show-photo-name-remove', function() {
        var curField = $(this).parents().filter('.show-photo');
        curField.remove();
    });

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

        $('.project-add-place-content').sortable({
            axis: 'y'
        });
        $('.project-add-group-content').sortable({
            axis: 'y'
        });

        $('#project-theatre').each(function() {
            var curInput = $(this);
            $.ajax({
                url: 'ajax/filter-theatre.json',
                dataType: 'json',
                success: function(data) {
                    curInput.autocomplete({
                        minLength: 0,
                        source: data
                    }).autocomplete('instance')._renderItem = function(ul, item) {
                        return $('<li>').append('<div>' + item.value + '<span>' + item.desc + '</span></div>').appendTo(ul);
                    };
                }
            });
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

var dateFormat = 'dd.mm.yy';

function initForm(curForm) {
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.form-input-date input').each(function() {
        $(this).datepicker({
            dateFormat: dateFormat,
            showOtherMonths: true,
            selectOtherMonths: true
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