new class {
    $bubbleMe  = null;
    $bubbleUser = null;
    $bubbleBoot = null;
    $cardJoin = null;
    $divMessage = null;
    $inputNickname = null;

    $nickname = null;
    nickname = null;
    $chat = null;

    constructor() {
        this.initElments();
        this.initEvents();
    }

    initElments() {
        this.$divMessage = $(".div-message").hide();
        this.socket = io.connect("http://localhost:3000", {'forceNew': true});
        this.$cardJoin = $('.card-join');
        this.$inputNickname = this.$cardJoin.find('input.nickname');
        this.$bubbleBoot = $('.bubble-bot').remove();
        this.$bubbleUser = $('.bubble-users').remove();
        this.$bubbleMe = $('.bubble-me').remove();
        this.$chat = $('.chat');
        this.$nickname = $('span.nickname').hide();
        this.$inputMessage = this.$divMessage.find('textarea');        
    }

    initEvents() {        

        this.$cardJoin.on('submit', 'form', (e) => this.onSubmitJoin(e));

        const onSendMessage = (e) => this.onSendMessage(e);        
        this.$divMessage
            .on('click', '.send_btn', onSendMessage)
            .on('keypress', '.type_msg', onSendMessage);

        this.socket.on("newClient", data => { console.log(data); });
        this.socket.on('newUser', data => this.onReceiveNewJoin(data));
        this.socket.on('newMessage', data => this.onReceiveNewMessage(data))
        this.socket.on('notifications', data => this.onReceiveNotifications(data))
    }

    onSendMessage(e) {
        if(
            e.type === "click" || 
            (e.type === "keypress" && e.key === "Enter" && !e.shiftKey)
        ) {
            e.preventDefault();
            e.stopPropagation();
           
            this.socket.emit('sendMessage', {
                message : this.$inputMessage.val(),
                nickname : this.nickname
            })
            this.$inputMessage.val("");
        }
    }

    onSubmitJoin(event) {
        event.preventDefault();
        this.nickname = this.$inputNickname.val();
        this.$cardJoin.slideUp('slow');
        this.$divMessage.slideDown('slow');
        this.$nickname.html(this.nickname).fadeIn('slow');

        this.socket.emit('joinUser', {
            nickname: this.nickname
        });
    }

    onReceiveNewMessage(data) {        
        const $bubble = (data.nickname == this.nickname ? this.$bubbleMe : this.$bubbleUser).clone();
        $bubble.find('.message').text(data.message);        
        $bubble.find('.nickname').text(data.nickname);
        this.addMessage($bubble);
    }


    onReceiveNewJoin(data) {
        const $bubble = this.$bubbleBoot.clone();
        $bubble.find('.message').html(data.message);
        
        this.addMessage($bubble);
    }

    onReceiveNotifications(data) {
        console.log(data);
        const $bubble = this.$bubbleBoot.clone();        
        let message = data.message;
        if(data.url) {
            message = `${data.message}<br><img src="${data.url}" height="200">`;
        }
        $bubble.find('.message').html(message);        
        this.addMessage($bubble);
    }

    addMessage($bubble) {
        $bubble.hide();        
        $bubble.appendTo(this.$chat);
        $bubble.fadeIn('slow');        
        this.$chat.animate({ 
            scrollTop: this.$chat[0].scrollHeight
        }, 600);
    }
}();

