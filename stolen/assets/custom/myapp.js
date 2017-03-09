var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function initAlbumList(selectpage){
	
	// all
    $.getJSON("http://localhost:8000/api/v2/pages/10/?format=json", function (page_data) {
        var template = $('#template-title').html();
        var rendered = Mustache.render(template, page_data);
        $('#templatetitle').html(rendered);
        $('#backgroundimage').css("background-image", "url(http://localhost:8000"+page_data.photo_url+")");

        //ajout filters menu
		for (var car in page_data.categories){
			var filter = $('<a href="#" data-filter=".'+page_data.categories[car].nom_categorie.toLowerCase()+'">'+page_data.categories[car].nom_categorie+'</a>');
			filter.appendTo('#isotope-filter-collapse');
		}
	
		//gets albums list
    	$.getJSON("http://localhost:8000/api/v2/pages/?format=json&type=langevin_photo.AlbumPage", function (pages) {
    		var albums = [];
    		for (var key in pages.items){
                albums.push(pages.items[key].id);
        	}


        	//render pictures list
        	var requestnum = albums.length; //nombre album
        	var answers = 0;
        	for (var ids in albums){
        		$.when(
            		$.getJSON("http://localhost:8000/api/v2/pages/"+albums[ids]+"/?format=json", function(page){
                		var template = $('#template-albums-list').html();
                		var rendered = Mustache.render(template, page);
                		$('#albums-list').append(rendered);


                	//link images
                		for (var photo in page.photos){
                			$('#photoid'+page.id).attr("src","http://localhost:8000"+page.photos[photo].photo_url);
                			break;
                		}
                	//ajout categorie in album class
                		for (var check in page_data.categories){
                			if (page.categorie.id == page_data.categories[check].id){
                				$('#item-album'+page.id).addClass(page_data.categories[check].nom_categorie.toLowerCase());
                				break;
                			}
                		}
            		})
            	).done(function(){// attend que toute les reponse des ajax soit effectuer
            		answers = answers + 1;
        			if(answers == requestnum){
						INITISOTOPE();//voir dans theme.js normalement pas dans une fonction (ne peut etre caller plus d une fois)
					}
            	});
        	}
    	});
    });
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function getval(limit){ //changement de limit
	createCookie("limit",limit);
	var url = window.location.href; 
	if (getUrlParameter('page')){
		page = getUrlParameter('page');
		url = url.replace('page='+page,'page=1');
	}
	window.location.href = url;
}

function initAlbumDetail(id, page){
	var url = "http://localhost:8000/api/v2/pages/"+id+"/?format=json";
	if (readCookie("limit")){
		limit = readCookie("limit");
		$('#selectshow-items').val(limit);
	}else{
		limit = 12;
	}

    $.getJSON(url, function (page_data) {
		$('#albumtitle').text(page_data.title);
		$('#bodynothidden').text(page_data.body);
		$('#bodyhidden').text(page_data.body_cacher);
		$('#nextbutton').attr('href','album-detail.html?code='+id+'&way=next');
		$('#prevbutton').attr('href','album-detail.html?code='+id+'&way=prev');
		$('#downnextbutton').attr('href','album-detail.html?code='+id+'&way=next');
		$('#downprevbutton').attr('href','album-detail.html?code='+id+'&way=prev');
		$('#firstpage').attr('href','album-detail.html?code='+id+'&page=1');


		var albumlength = page_data.photos.length;
		var totalpages = Math.ceil(albumlength/limit);
		$('#pageinfo').text("Page "+page+" de "+totalpages);

		//render paginator 
		for (var paging=0; paging < totalpages; paging++){
			pageid = paging + 1;
			if(paging+1 == page){
				var li = $('<li class="active"><a href="album-detail.html?code='+id+'&page='+pageid+'">'+pageid+'</a></li>');
			}else{
				var li = $('<li><a href="album-detail.html?code='+id+'&page='+pageid+'">'+pageid+'</a></li>');
			}
			$('#paginator').append(li);
		}
        if(totalpages>1){
            $('#paginator').append('<li><a id="lastpage" href="album-detail.html?code='+id+'&page='+totalpages+'" aria-label="Next"><span aria-hidden="true">Dernière page</span></a></li>');
        }

			// render image
		var checklimit = 0;
		var startkey = page*limit - limit;// defini la key de depart
		for (var photo in page_data.photos){
			key=startkey +checklimit;

			var template = $('#template-albumdetail').html();
        	var rendered = Mustache.render(template, page_data.photos[key]);
        	$('#gallery').append(rendered);

        	checklimit = checklimit +1 ;
        	if (checklimit == limit || key == albumlength-1){// defini la fin de la loop selon la limit
        		break;
        	}
		}
    });
}

function initIndex(){
    $.getJSON("http://localhost:8000/api/v2/pages/3/?format=json", function (page_data) {
        
        var template = $('#template-presentation').html();
        var rendered = Mustache.render(template, page_data);
        $('#presentation').html(rendered);
        $('#intro-section').css("background-image", "url(http://localhost:8000"+page_data.photo_background_url+")");
    });
}


function initAbout(){
    var aboutpageids = [];
    var about = 0 ;
    $.getJSON("http://localhost:8000/api/v2/pages/?format=json", function (data) {
        
        for (var key in data.items){
            if (data.items[key].meta.type == "langevin_photo.AboutPage"){
                aboutpageids.push(data.items[key].id);
            }
        }
        aboutpageids.sort(function(a,b){
            return b-a;
        });
        for (var id in aboutpageids){
            about = aboutpageids[id];
            break;
        }

        $.getJSON("http://localhost:8000/api/v2/pages/"+about+"/?format=json", function (page_data) {

            var template = $('#template-about').html();
            var rendered = Mustache.render(template, page_data);
            $('#about').html(rendered);

            $('#abouttitle').text(page_data.title)
        });
    });
}

function initQuad(page){

	if (readCookie("limit")){
		limit = readCookie("limit");
		$('#selectshow-items').val(limit);
	}else{
		limit = 12;
	}

    var quadpageids = [];
    var quad = 0 ;
    $.getJSON("http://localhost:8000/api/v2/pages/?format=json", function (data) { //get last quadpage
        
        for (var key in data.items){
            if (data.items[key].meta.type == "langevin_photo.QuadPage"){
                quadpageids.push(data.items[key].id);
            }
        }
        quadpageids.sort(function(a,b){
            return b-a;
        });
        for (var id in quadpageids){
            quad = quadpageids[id];
            break;
        }

        $.getJSON("http://localhost:8000/api/v2/pages/"+quad+"/?format=json", function (page_data) {
        	page_data.pdf.meta.download_url = page_data.pdf.meta.download_url.replace('localhost','localhost:8000');
            var template = $('#template-quad').html();
            var rendered = Mustache.render(template, page_data);
            $('#quad').html(rendered);

            $('#quadtitle').text(page_data.title)
            $('#firstpage').attr('href','quadnet.html?page=1');

			var albumlength = page_data.quadphotos.length;
			var totalpages = Math.ceil(albumlength/limit);
			$('#pageinfo').text("Page "+page+" de "+totalpages);

			//render paginator 
			for (var paging=0; paging < totalpages; paging++){
				pageid = paging + 1;
				if(paging+1 == page){
					var li = $('<li class="active"><a href="quadnet.html?page='+pageid+'">'+pageid+'</a></li>');
				}else{
					var li = $('<li><a href="quadnet.html?page='+pageid+'">'+pageid+'</a></li>');
				}
				$('#paginator').append(li);
			}
        	if(totalpages>1){
            	$('#paginator').append('<li><a id="lastpage" href="quadnet.html?page='+totalpages+'" aria-label="Next"><span aria-hidden="true">Dernière page</span></a></li>');
        	}


			var checklimit = 0;
			var startkey = page*limit - limit;// defini la key de depart
			for (var photo in page_data.quadphotos){
				key=startkey +checklimit;

				var template = $('#template-albumdetail').html();
        		var rendered = Mustache.render(template, page_data.quadphotos[key]);
        		$('#gallery').append(rendered);

        		checklimit = checklimit +1 ;
        		if (checklimit == limit || key == albumlength-1){// defini la fin de la loop selon la limit
        			break;
        		}
			}
        });
    });
}



function closestHigh(arr, closestTo){
    var closest = Math.max.apply(null, arr); //Get the highest number in arr in case it match nothing.
    for(var i = 0; i < arr.length; i++){ //Loop the array
        if(arr[i] > closestTo && arr[i] < closest) closest = arr[i]; //Check if it's higher than your number, but lower than your closest value
    }
    return closest; // return the value
}

function closestDown(arr, closestTo){
    var closest = Math.min.apply(null, arr); //Get the smallest number in arr in case it match nothing.
    for(var i = 0; i < arr.length; i++){ //Loop the array
        if(arr[i] < closestTo && arr[i] > closest) closest = arr[i]; //Check if it's higher than your number, but lower than your closest value
    }
    return closest; // return the value
}


function nextAlbum(currentid, way){
	console.log("NEXT");
    $.getJSON("http://localhost:8000/api/v2/pages/?format=json", function (pages) {
    	var albums = [];
    	for (var key in pages.items){
            if (pages.items[key].meta.type == "langevin_photo.AlbumPage"){
                albums.push(pages.items[key].id);
            }
        }
        if (way == 'next'){
        	var next = closestHigh(albums, currentid);
        	initAlbumDetail(next,1);
        }
        if (way == 'prev'){
        	var prev = closestDown(albums, currentid);
        	initAlbumDetail(prev,1);
        }
    });
}



function initTarif(){
    var tarifpageids = [];
    var tarif = 0 ;
    $.getJSON("http://localhost:8000/api/v2/pages/?format=json", function (data) {
        
        for (var key in data.items){
            if (data.items[key].meta.type == "langevin_photo.TarifPage"){
                tarifpageids.push(data.items[key].id);
            }
        }
        tarifpageids.sort(function(a,b){
            return b-a;
        });
        for (var id in tarifpageids){
            tarif = tarifpageids[id];
            break;
        }

        $.getJSON("http://localhost:8000/api/v2/pages/"+tarif+"/?format=json", function (page_data) {

        	page_data.pdf.meta.download_url = page_data.pdf.meta.download_url.replace('localhost','localhost:8000');

            var template = $('#template-tarif').html();
            var rendered = Mustache.render(template, page_data);
            $('#tarif').html(rendered);

            $('#tariftitle').text(page_data.title)
        });
    });
}

function initAlbumSell(page){
	if (readCookie("limit")){
		limit = readCookie("limit");
		$('#selectshow-items').val(limit);
	}else{
		limit = 12;
	}


    var sellpageids = [];
    var sell = 0 ;
    $.getJSON("http://localhost:8000/api/v2/pages/?format=json", function (data) {
        
        for (var key in data.items){
            if (data.items[key].meta.type == "langevin_photo.SellPage"){
                sellpageids.push(data.items[key].id);
            }
        }
        sellpageids.sort(function(a,b){
            return b-a;
        });
        for (var id in sellpageids){
            sell = sellpageids[id];
            break;
        }

    	$.getJSON("http://localhost:8000/api/v2/pages/"+sell+"/?format=json", function (page_data) {

			$('#albumtitle').text(page_data.title);
			$('#bodynothidden').text(page_data.body);
			$('#bodyhidden').text(page_data.body_cacher);

            $('#firstpage').attr('href','sell-album.html?page=1');

			var albumlength = page_data.sellphotos.length;
			var totalpages = Math.ceil(albumlength/limit);
			$('#pageinfo').text("Page "+page+" de "+totalpages);

			//render paginator 
			for (var paging=0; paging < totalpages; paging++){
				pageid = paging + 1;
				if(paging+1 == page){
					var li = $('<li class="active"><a href="sell-album.html?page='+pageid+'">'+pageid+'</a></li>');
				}else{
					var li = $('<li><a href="sell-album.html?page='+pageid+'">'+pageid+'</a></li>');
				}
				$('#paginator').append(li);
			}
        	if(totalpages>1){
            	$('#paginator').append('<li><a id="lastpage" href="sell-album.html?page='+totalpages+'" aria-label="Next"><span aria-hidden="true">Dernière page</span></a></li>');
        	}


			var checklimit = 0;
			var startkey = page*limit - limit;// defini la key de depart
			for (var key in page_data.sellphotos){
				key=startkey +checklimit;

				var template = $('#template-albumdetail').html();
        		var rendered = Mustache.render(template, page_data.sellphotos[key]);
        		$('#gallery').append(rendered);

        		checklimit = checklimit +1 ;
        		if (checklimit == limit || key == albumlength-1){// defini la fin de la loop selon la limit
        			break;
        		}
			}
    	});
    });
}