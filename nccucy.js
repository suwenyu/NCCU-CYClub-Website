window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({
        appId: '1461518597495814',
        xfbml: true,
        version: 'v2.3'
    });
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            FB.api('/me/picture?type=large', function(response) {
                $('.navbar-right').prepend("<img src = " + response.data.url + " crossorigin = \"anonymous\" id=preview1 / >");
            });
        }
    });

};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "http://connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));



var queryCat = function(depend, owl, num) {
    var Exhibition = Parse.Object.extend("Exhibition");
    var query = new Parse.Query(Exhibition);
    if (num == 1) {
        query.descending(depend);
    } else {
        query.ascending(depend);
    }
    query.find({
        success: function(result) {
            console.log(result);
            for (var i = 0; i < 15; i++) {
                var object = result[i];
                var sdate = object.get('Start');
                var edate = object.get('End');
                var content = '<div class=\"owl-item item\" id=\"' + object.id + '\" data-toggle=\"modal\" data-target=\"#myModal\"><img src=\"' + object.get('img') + '\"><h4>' + object.get('Name') + '</h4><p><i class=\"fa fa-map-marker\"></i>' + object.get('Place') + '</br><i class=\"fa fa-calendar\"></i>' + sdate.getFullYear().toString() + '/' + (sdate.getMonth() + 1).toString() + '/' + sdate.getDate().toString() + '~' + edate.getFullYear().toString() + '/' + (edate.getMonth() + 1).toString() + '/' + edate.getDate().toString() + '</br><i class=\"fa fa-thumbs-o-up\">' + result[i].get('like') + '</i></br></p></div>';
                console.log(content);
                owl.trigger('add.owl.carousel', [$(content)]);
                owl.trigger('refresh.owl.carousel');

            }
        },
        error: function(error) {
            console.log(error.message);
        }
    });
}


// main function

$(document).ready(function() {

    var currentUser = Parse.User.current();
    var owl = $("#owl-comment");
    var owl2 = $("#owl-high");

    owl.owlCarousel();
    owl2.owlCarousel();


    queryCat("Start", owl, 2);
    queryCat("like", owl2, 1);
    owl2.trigger('destroy.owl.carousel');
    owl.trigger('destroy.owl.carousel');
    owl2.owlCarousel({
        items: 5,
        margin: 10,


    });
    owl.owlCarousel({
        items: 5,
    });
    $(".owl-stage div:first-child").remove();

    if (currentUser) {

        $('.profile').show();
        $('.login').hide();
        $('.logout').show();
        $('.profile').attr("id", currentUser.get('username'));
    } else {
        $('.profile').hide();
        $('.login').show();
        $('.logout').hide();
    }

    $('.profile').on('click', function() {
        $('.self-pic>img').attr("src", "images/big.jpg");
        var currentUser = Parse.User.current();
        FB.getLoginStatus(function(response) {
            console.log(response);
            if (response.status === 'connected') {
                FB.api('/me/picture?type=large', function(response) {
                    $('.self-pic>img').attr("src", response.data.url);
                });
            }
        });

    })

    $('#liking').on('click', function(event) {
        if (Parse.User.current()) {
            var key = $('#myModal>.modal-dialog').attr('id');
            var Exhibition = Parse.Object.extend("Exhibition");
            var query = new Parse.Query(Exhibition);
            query.equalTo('objectId', key);
            query.find({
                success: function(result) {
                    console.log(result[0].get('like'));
                    var likenum = result[0].get('like');
                    likenum++;
                    $('#like>i').text(likenum);
                    $('#' + key + ' .fa-thumbs-o-up').text('');
                    $('#' + key + ' .fa-thumbs-o-up').text(likenum);
                    result[0].set('like', likenum);
                    result[0].save(null, {
                        success: function(item) {
                            console.log('save success');
                            $('#liking').attr('disabled', true);
                        },
                        error: function(item, error) {
                            console.log(error.message);
                        }
                    })
                },
                error: function(error) {
                    console.log(error.message);
                }
            });

        } else {
            alert('請先登入');
            window.location = "logIn.html";
        }

    })

    $('#ccsubmit').on('click', function(event) {
        event.preventDefault();
        if ($('textarea').val().length === 0) {
            alert('請輸入留言內容');
            return;
        }
        if (Parse.User.current()) {
            var Comment = Parse.Object.extend("Comment");
            var Exhibition = Parse.Object.extend("Exhibition");
            var key = $('#myModal>.modal-dialog').attr('id');
            var ex = new Exhibition();
            ex.id = key;
            var obj = new Comment();
            obj.set("User", Parse.User.current());
            obj.set("Exhibition", ex);
            obj.set("Comment", $('textarea').val());
            obj.save(null, {
                success: function(obj) {
                    alert('留言成功!');
                    $('textarea').val('');
                    var Comment = Parse.Object.extend('Comment');
                    var queryc = new Parse.Query(Comment);
                    var ex = new Exhibition();
                    ex.id = $('#myModal>.modal-dialog').attr('id');
                    queryc.include('Exhibition');
                    queryc.equalTo('Exhibition', ex);
                    queryc.descending("updatedAt");
                    queryc.find({
                        success: function(result) {
                          console.log(result);
                            $('.cc3 *').remove();
                            var dic = result.length < 3 ? result.length : 3;
                            for (var i = 0; i < dic; i++) {
                                $('.cc3').append('<div class="cc3s">' + '“' + result[i].get('Comment') + '”' + '</div>');
                            }
                        },
                        error: function(error) {
                            console.log(error.message);
                        }
                    });
                },
                error: function(obj, error) {
                    console.log(error);
                    alert('留言失敗!');
                }
            });
        } else {
            alert('請先登入');
            window.location = "logIn.html"
        }
    })

    $('#proModal').on('show.bs.modal', function(event) {
        console.log('display!!!');
        $('.collected *').remove();
        var Collection = Parse.Object.extend("Collection");
        var query = new Parse.Query(Collection);
        query.include("Exhibition");
        query.include("User");
        query.equalTo('User', Parse.User.current());
        query.find({
            success: function(result) {
                for (var i = 0; i < result.length; i++) {
                    $('.collected').append('<li class="ccc">' + result[i].get('Exhibition').get('Name') + '</li>');
                }
            },
            error: function(error) {
                console.log(error.message);
            }
        });

    })


    $('.logout').on('click', function(e) {
        e.preventDefault();
        Parse.User.logOut();
        FB.logout(function(response) {});
        alert("登出成功");
        $('.logout').hide();
        window.location = "index.html";
    })



    $(".comment.next").mouseover(function() {
        for (var i = 0; i < 5; i++) {
            owl.trigger('next.owl.carousel', [2000]);
        }
    })


    $(".comment.prev").hover(function() {
        for (var i = 0; i < 3; i++) {
            owl.trigger('prev.owl.carousel', [2000]);
        }
    })


    $(".high.next").mouseover(function() {
        for (var i = 0; i < 3; i++) {
            owl2.trigger('next.owl.carousel', [2000]);
        }
    })

    $(".high.prev").mouseover(function() {
        for (var i = 0; i < 3; i++) {
            owl2.trigger('prev.owl.carousel', [2000]);
        }
    })

    $('#myModal').on('show.bs.modal', function(event) {
      $('#liking').removeAttr('disabled');
      $('#intro').parent().addClass("active");
      $('#ccsubmit').parent().removeClass("active");
      $('.button1').addClass("active");
      $('.button2').removeClass("active");
        var button = $(event.relatedTarget); // Button that triggered the modal
        var recipient = button.attr('id');
        $('#myModal>.modal-dialog').attr('id', recipient);
        var modal = $(this);
        var Exhibition = Parse.Object.extend("Exhibition");
        var query = new Parse.Query(Exhibition);
        query.equalTo("objectId", recipient);
        query.find({
            success: function(result) {
                var object = result[0];
                var sdate = object.get('Start');
                var edate = object.get('End');
                $('#myModalLabel').text(object.get('Name'));
                console.log(object.get('Name'));
                console.log($('#myModalLabel').text());
                $('#place>i').text(object.get('Place'));
                $('.real-pic>img').attr('src', object.get('Real_pic'));
                $('#intro>span').html(object.get('Intro'));
                $('#price>i').text(object.get('Price'));
                $('#like>i').text(object.get('like'));
                $('#time>i').text(sdate.getFullYear().toString() + '/' + sdate.getMonth().toString() + '/' + sdate.getDate().toString() + '~' + edate.getFullYear().toString() + '/' + edate.getMonth().toString() + '/' + edate.getDate().toString());
            },
            error: function(error) {
                console.log(error.message);
            }
        });
        var Comment = Parse.Object.extend('Comment');
        var queryc = new Parse.Query(Comment);
        var ex = new Exhibition();
        ex.id = recipient;
        queryc.include('Exhibition');
        queryc.equalTo('Exhibition', ex);
        queryc.descending("updatedAt");
        queryc.find({
            success: function(result) {
                $('.cc3 *').remove();
                var dic = result.length < 3 ? result.length : 3;
                for (var i = 0; i < dic; i++) {
                    $('.cc3').append('<div class="cc3s">' + '“' + result[i].get('Comment') + '”' + '</div>');
                }
            },
            error: function(error) {
                console.log(error.message);
            }
        });

    })
    $('#collect').on('click', function() {
        if (Parse.User.current()) {
            var key = $('#myModal>.modal-dialog').attr('id');
            var Exhibition = Parse.Object.extend("Exhibition");
            var Collection = Parse.Object.extend("Collection");
            var row = new Collection();
            var ex = new Exhibition();
            ex.id = key;
            row.set("User", Parse.User.current());
            row.set("Exhibition", ex);
            row.save(null, {
                success: function(row) {
                    alert('收藏成功!');
                },
                error: function(row, error) {
                    console.log(error);
                    alert('收藏失敗');
                }
            });
        } else {
            alert('請先登入');
            window.location = "logIn.html";
        }
    })

    $('.nav .dropdown-menu a').on('click', function(event) {
        var button = $(event.currentTarget);
        $('.containt *').remove();
        $('.containt').append('<p class=\"topic\"><i class=\"fa fa-university\"></i>' + button.text() + '</p><hr>');
        var cat = button.attr('id');
        console.log(cat);
        var Exhibition = Parse.Object.extend("Exhibition");
        var query = new Parse.Query(Exhibition);
        query.equalTo("Catgory", cat);
        query.ascending("Start");
        query.find({
            success: function(result) {
                console.log(result);
                for (var i = 0; i < result.length; i++) {
                    var object = result[i];
                    var sdate = object.get('Start');
                    var edate = object.get('End');
                    var content = '<div class=\"item\" id=\"' + object.id + '\" data-toggle=\"modal\" data-target=\"#myModal\"><img src=\"' + object.get('img') + '\"><h4>' + object.get('Name') + '</h4><p><i class=\"fa fa-map-marker\"></i>' + object.get('Place') + '</br><i class=\"fa fa-calendar\"></i>' + sdate.getFullYear().toString() + '/' + (sdate.getMonth() + 1).toString() + '/' + sdate.getDate().toString() + '~' + edate.getFullYear().toString() + '/' + (edate.getMonth() + 1).toString() + '/' + edate.getDate().toString() + '</br><i class=\"fa fa-thumbs-o-up\"></i>' + result[i].get('like') + '</br></p></div>';
                    $('.containt').append(content);
                    console.log(content);
                }
            },
            error: function(error) {
                console.log(error.message);
            }
        });
    });

    $('.easybutton').on('click', function(e) {
        e.preventDefault();
        var key = $('.easysearch').val();
        var link = 'search.html?' + key;
        console.log(link);
        window.location = link;
    })



});