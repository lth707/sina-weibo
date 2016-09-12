/**
 * Created by duoyi on 2016/8/30.
 */
$('[id = forwardBtn]').click(function (e) {

    ajax({
        'type': 'GET',
        'data': {id: $(e.target).attr('data-messageid')},
        'url': '/forward',
        'dataType': 'json'
    }).success(function (result) {
        if (result.code == 304) {
            location = '/login'
        } else {
            var message = JSON.parse(result.message);
            var messageContent=message.content;
            $('h4.ui.dividing.header').html('@' + message.user.nickName + ':' + messageContent);
            $('#messageForwardCount').html('当前已转发' + message.forwardComments.length + '次');
            var messageForwardInfo = ''
            var forwardContent='';
            message.forwardComments.forEach(function (frowardComment) {
                messageForwardInfo += '<div class="comment"> <div class="content"><a class="ui mini circular image" href="/user/' + frowardComment.user.email + '"><img src="' + frowardComment.user.head + '"> </a> <a class="author" href="/user/' + frowardComment.user.email + '">' + frowardComment.user.nickName + '</a><div class="ui mini text">' + frowardComment.content + '</div></div></div>'
                forwardContent+='//'+'@'+frowardComment.user.nickName+':'+frowardComment.content;
            });
            $('#messageForwardInfo').html(messageForwardInfo);


            $('#forwardContent').val(forwardContent);
            setCursorPosition(document.getElementById('forwardContent'), 0);
            $('#msg_id').val(message._id);
            $('#comment_count').val(message.commentCount);
            $('#forward_count').val(message.forwardCount);
            $('.small.modal')
                .modal('show');
        }
    });
});

$('div.ui.orange.button').click(function (e) {
    ajax({
        'type': 'POST',
        'data': {
            msgId: $('#msg_id').val(),
            forwardCount: $('#forward_count').val(),
            commentCount: $('#comment_count').val(),
            forwardCommentContent: $('#forwardContent').val()
        },
        'url': '/forward',
        'dataType': 'json'
    }).success(function (result) {
        var msgId = $('#msg_id').val();
        $("[id = forwardBtn][data-messageid=" + msgId + "]>i").html(result.forwardCount);
        $("[id = commentBtn][data-messageid=" + msgId + "]>i").html(result.commentCount);
        $('.small.modal')
            .modal('hide');
        location.reload();
    });
});
$('[id = commentBtn]').click(function (e) {
    var id = $(e.target).attr('data-messageid');
    location = '/comment/' + id;
});
$('[id = postGoodBtn]').click(function (e) {
    var supportCount=$(e.target).children('i').text()?(parseInt($(e.target).children('i').text())):(parseInt($(e.target).text()))
    ajax({
        'type': 'POST',
        'data': {
            id: $(e.target).attr('data-messageid'),
            supportCount: supportCount
        },
        'url': '/good',
        'dataType': 'json'
    }).success(function (result) {
        if(result.code&&result.code==304){
            location='/login';
        }
        else{
            $(e.target).children('i').text()?$(e.target).children('i').html(result.supportCount):$(e.target).html(result.supportCount);
        }

    });
});

function ajax(option) {
    return $.ajax(option);
}

function setCursorPosition(ctrl, pos) {
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
    } else if (ctrl.createTextRange) {// IE Support
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}