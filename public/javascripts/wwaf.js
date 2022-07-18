function connect(addr){
    var data = { publickey: addr};
    $.ajax({
        type: 'post',
        url: '/connect',
        data: data
    })
    .done(function(e){
      //redirect to homepage
    })
  
  
  }

/* function stream(cost, musiclink, musicianPublicKey){
    var data = {cost: `${cost}`, musicLink: musiclink, mPublickey: musicianPublicKey, privateKey: $("#sendP").val()};
    $.ajax({
        dataType: "json",
        type: 'post',
        url: '/stream',
        data: data,
    })
    .done(function(e){
        window.location.replace(musiclink);
    });
} */