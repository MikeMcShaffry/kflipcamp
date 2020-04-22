// $ và jQuery là như nhau

$(function(){
    $('.event-list').find('.event').click(function () {
        var clickOnMe = $(this).next().hasClass('open');
        if (!clickOnMe) {
            $('.event-list').find('.openEv').removeClass('open');
        }
        $(this).next().toggleClass('open');
  })
})
