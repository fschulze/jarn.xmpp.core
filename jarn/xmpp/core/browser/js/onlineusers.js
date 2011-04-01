$(document).bind('jarnxmpp.presence', function (event, jid, status) {
    var userid = Strophe.getNodeFromJid(jid);
    var barejid = Strophe.getBareJidFromJid(jid);
    var existing = $('#online-users').find('#online-users-'+userid);
    if (existing.length > 0) {
        existing.attr('class', status);
    } else {
        member_info = $.getJSON(portal_url+"/xmpp-userinfo?user_id="+userid, function(data) {
            var dd = $('<dd></dd>')
                .attr('class', status)
                .attr('id', 'online-users-'+userid)
                .attr('title', 'Click to chat');
            var sendMessage = $('<a/>')
                .attr('class', 'online-users-message')
                .attr('href','sendXMPPMessage?message-recipient=' + barejid);
            sendMessage.append($('<img/>').attr('title', data.fullname).attr('src', data.portrait_url));
            sendMessage.prepOverlay({
                subtype: 'ajax',
            });
            dd.append(sendMessage);
            $('#online-users').append(dd);
        });
    }
});

$(document).ready(function () {
    $('#online-users .online').live('mouseover', function () {
        $("#"+this.id+"[title]").tooltip();
    });
    $('#sendXMPPMessage').live('submit', function () {
        var text = $(this).find('input[name="message"]').attr('value');
        var recipient = $(this).find('input[name="message-recipient"]').attr('value');
        var message = $msg({to: recipient, type: 'chat'})
            .c('body').t(text);
        jarnxmpp.connection.send(message);
        $(this).parents('.overlay').data('overlay').close();
        return false;
    });
});
