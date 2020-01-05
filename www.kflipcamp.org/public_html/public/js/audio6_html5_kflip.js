/*
 * Hero - Shoutcast and Icecast Radio Player With History - v2.2
 * Copyright 2017-2019, LambertGroup
 *
 */

(function($) {

	//vars
	var val = navigator.userAgent.toLowerCase();

    var icestats_player = null;

	//functions
	function supports_mp3_audio(current_obj) {
			  var a = document.getElementById(current_obj.audioID);
			  return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
	}

	function detectBrowserAndAudio(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container) {
				//activate current
				$(current_obj.thumbsHolder_Thumbs[current_obj.current_img_no]).css({
					"background":options.playlistRecordBgOnColor,
					"border-bottom-color":options.playlistRecordBottomBorderOnColor,
					"color":options.playlistRecordTextOnColor
				});

				//auto scroll carousel if needed
				if (!current_obj.is_very_first) {
					carouselScroll(-1,current_obj,options,audio6_html5_thumbsHolder);
				}

				var currentAudio;
				//alert (options.radio_stream);
				if (options.radio_stream!='') {
						currentAudio=options.radio_stream;
				} else {
					//nothing
				}

				//alert (currentAudio);
				return currentAudio;
	};


	function get_wiki_image(temp_artist_image,options,current_obj,audio6_html5_ximage) {
		var photo_path=options.noImageAvailable;
		var ext_1="";
		var temp_iiurlparam_1="";
		if (temp_artist_image!='' && temp_artist_image!=undefined) {
				ext_1 = temp_artist_image.match(/\.([^\./\?\#]+)($|\?|\#)/)[1];
				if (ext_1=="jpg" || ext_1=="jpeg" || ext_1=="JPG" || ext_1=="JPEG") {
						temp_iiurlparam_1="&iiurlparam=qlow-1000px";
				}
				//$.get( "https://commons.wikimedia.org/w/api.php?action=query&titles=Image:"+temp_artist_image+"&prop=imageinfo&format=xml&origin=*&iiprop=url", {}, function( xml ) {
				//$.get( "https://commons.wikimedia.org/w/api.php?action=query&titles=Image:"+temp_artist_image+"&prop=imageinfo&format=xml&origin=*&iiprop=url&iiurlparam=qlow-1000px", {}, function( xml ) {
				$.get( "https://commons.wikimedia.org/w/api.php?action=query&titles=Image:"+temp_artist_image+"&prop=imageinfo&format=xml&origin=*&iiprop=url"+temp_iiurlparam_1, {}, function( xml ) {
							///console.log("the image: ");console.log(xml);
							///console.log($("ii", xml).attr('url'));
							if ($("ii", xml).attr('thumburl')!='' && $("ii", xml).attr('thumburl')!=undefined) {
									//photo_path=$("ii", xml).attr('url');
									photo_path=$("ii", xml).attr('thumburl');
									current_obj.wiki_photo_path=photo_path;
									///console.log("unu");
							} else {
										if ($("ii", xml).attr('url')!='' && $("ii", xml).attr('url')!=undefined) {
												photo_path=$("ii", xml).attr('url');
												current_obj.wiki_photo_path=photo_path;
												///console.log("unu_bis");
										}
							}
							changeArtistImage(options,current_obj,audio6_html5_ximage,photo_path);
				});
		}
	}


	function get_wiki_image_history(temp_artist_image,current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle,the_p) {
					var photo_path=options.noImageAvailable;
					var generateHistory_Timeout;
					var ext_2="";
					var temp_iiurlparam_2="";
					if (temp_artist_image!='' && temp_artist_image!=undefined) {
							ext_2 = temp_artist_image.match(/\.([^\./\?\#]+)($|\?|\#)/)[1];
							if (ext_2=="jpg" || ext_2=="jpeg" || ext_2=="JPG" || ext_2=="JPEGs") {
									temp_iiurlparam_2="&iiurlparam=qlow-200px";
							}
							//$.get( "https://commons.wikimedia.org/w/api.php?action=query&titles=Image:"+temp_artist_image+"&prop=imageinfo&format=xml&origin=*&iiprop=url", {}, function( xml ) {
							$.get( "https://commons.wikimedia.org/w/api.php?action=query&titles=Image:"+temp_artist_image+"&prop=imageinfo&format=xml&origin=*&iiprop=url"+temp_iiurlparam_2, {}, function( xml ) {
										///console.log("!!!!HISTORY the image: ");console.log(xml);
										///console.log($("ii", xml).attr('url'));
										if ($("ii", xml).attr('thumburl')!='' && $("ii", xml).attr('thumburl')!=undefined) {
														photo_path=$("ii", xml).attr('thumburl');
										} else {
													if ($("ii", xml).attr('url')!='' && $("ii", xml).attr('url')!=undefined) {
														photo_path=$("ii", xml).attr('url');
													}
										}

										current_obj.playlist_images_arr[the_p]=photo_path;
							});
					}

					//if (the_p==(current_obj.playlist_arr.length-1)) {
					if ((the_p+1) % 3 === 0 || the_p==(current_obj.playlist_arr.length-1)) {
							generateHistory_Timeout=setTimeout(function(){
								generateHistory(current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle);
							}, 1000);
					}
	}


	function removeAccents(str) {
		var temp_str;
		let accents = "ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž’";
		let accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz'";
		str = str.split('');
		str.forEach((letter, index) => {
			let i = accents.indexOf(letter);
			if (i != -1) {
				str[index] = accentsOut[i];
			}
		})
		temp_str=str.join('');
		return temp_str.trim();
	}



    function doCORSRequest(options, printResult) {
		//var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
		//var cors_api_url = 'https://crossorigin.me/';
		//var cors_api_url = 'https://cors.io/?';
		var cors_api_url = 'https://zet.pluginsandthemes.ro/';
		var x = new XMLHttpRequest();
        x.open(options.method, cors_api_url + options.url);

		x.onload = x.onerror = function() {
					/*var responseText = x.responseText;
 					console.log('message: '+responseText);*/
		  printResult(
			options.method + ' ' + options.url + '\n' +
			x.status + ' ' + x.statusText + '\n\n' +
			(x.responseText || '')
		  );
		};

		//////x.setRequestHeader("Origin", "X-Requested-With");
		if (/^POST/i.test(options.method)) {
		  x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			x.setRequestHeader('Access-Control-Allow-Origin', '*');
			x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		}
		x.send(options.data);
	}


	function addToHistory(current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle) {
			if (current_obj.curTitle!='' && current_obj.isHistoryGenerated) {
				if (current_obj.prevTitle!=current_obj.curTitle) {
					if (current_obj.prevTitle!='') {
						if (current_obj.gen_total_images>=30) {
							current_obj.gen_total_images--;
							current_obj.playlist_arr.pop();
							current_obj.playlist_images_arr.pop();
						}
						current_obj.gen_total_images++;
						current_obj.playlist_arr.unshift(current_obj.prevTitle);
						current_obj.playlist_images_arr.unshift(current_obj.prev_song_image);
						generateHistory(current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle);
					}
					current_obj.prevTitle=current_obj.curTitle;
				}
			}
	}

    function handleIcestats(obj_json, current_obj, options, audio6_html5_thumbsHolder, audio6_html5_thumbsHolderWrapper, audio6_html5_thumbsHolderVisibleWrapper, audio6_html5_historyPadding, audio6_html5_historyTitle, audio6_html5_container, audio6_html5_the_wrapper, audio6_html5_play_btn, audio6_html5_Author, audio6_html5_Title, audio6_html5_TitleInside, audio6_html5_radioStation, audio6_html5_Audio, audio6_html5_ximage) {

        var mount_found = null;
        var the_k = 0;
        var on_automation = true;

        if (obj_json.icestats && obj_json.icestats.source && obj_json.icestats.source.length === undefined) {
            mount_found = obj_json.icestats.source;
        } else {
            //current_obj.mount_point
            //alert('Obj source length: '+Object.keys(obj_json.icestats.source).length);
            while (the_k < Object.keys(obj_json.icestats.source).length && !mount_found) {
                var listenurl = obj_json.icestats.source[the_k].listenurl;
                var listen_mount = listenurl.substr(listenurl.lastIndexOf('/') + 1);
                if (listen_mount === current_obj.mount_point) {
                    if (obj_json.icestats.source[the_k].audio_info) {
                        mount_found = obj_json.icestats.source[the_k];
                    } else {
                        on_automation = true;
                    }
                } else if (on_automation &&
                    listen_mount === options.icecast_fallback_mount &&
                    obj_json.icestats.source[the_k].audio_info) {
                    mount_found = obj_json.icestats.source[the_k];
                }

                the_k++;
            }
        }
        //alert (the_k);
        //alert (obj_json.icestats.source[1].title);
        let curSong = '';

        if (mount_found) {
            if (mount_found.title != '' && mount_found.title != undefined) {
                current_obj.now_playing_found = true;
                curSong = mount_found.title;
                current_obj.curTitle = curSong;
                changeCurrentSongTitle(current_obj, options, audio6_html5_thumbsHolder, audio6_html5_container, audio6_html5_play_btn, audio6_html5_Author, audio6_html5_Title, audio6_html5_TitleInside, audio6_html5_radioStation, audio6_html5_Audio, audio6_html5_ximage);
            }
        }

        if (curSong === '') {
            current_obj.now_playing_found = false;
            get_now_playing(current_obj,
                options,
                audio6_html5_thumbsHolder,
                audio6_html5_thumbsHolderWrapper,
                audio6_html5_thumbsHolderVisibleWrapper,
                audio6_html5_container,
                audio6_html5_play_btn,
                audio6_html5_Author,
                audio6_html5_Title,
                audio6_html5_TitleInside,
                audio6_html5_radioStation,
                audio6_html5_Audio,
                audio6_html5_ximage,
                audio6_html5_historyPadding,
                audio6_html5_the_wrapper,
                audio6_html5_historyTitle);
        } else {
            addToHistory(current_obj,
                options,
                audio6_html5_container,
                audio6_html5_thumbsHolder,
                audio6_html5_thumbsHolderWrapper,
                audio6_html5_thumbsHolderVisibleWrapper,
                audio6_html5_historyPadding,
                audio6_html5_play_btn,
                audio6_html5_Author,
                audio6_html5_Title,
                audio6_html5_TitleInside,
                audio6_html5_radioStation,
                audio6_html5_Audio,
                audio6_html5_ximage,
                audio6_html5_the_wrapper,
                audio6_html5_historyTitle);
        }

    }


    function handleNowPlayingEvent(obj_json, current_obj, options, audio6_html5_thumbsHolder, audio6_html5_thumbsHolderWrapper, audio6_html5_thumbsHolderVisibleWrapper, audio6_html5_historyPadding, audio6_html5_historyTitle, audio6_html5_container, audio6_html5_the_wrapper, audio6_html5_play_btn, audio6_html5_Author, audio6_html5_Title, audio6_html5_TitleInside, audio6_html5_radioStation, audio6_html5_Audio, audio6_html5_ximage) {

        //alert (the_k);
        let curSong = '';

        if (obj_json && obj_json.title) {
            current_obj.now_playing_found = true;
            curSong = obj_json.title;
            current_obj.curTitle = curSong;
            changeCurrentSongTitle(current_obj, options, audio6_html5_thumbsHolder, audio6_html5_container, audio6_html5_play_btn, audio6_html5_Author, audio6_html5_Title, audio6_html5_TitleInside, audio6_html5_radioStation, audio6_html5_Audio, audio6_html5_ximage);
        }

        if (curSong === '') {
            current_obj.now_playing_found = false;
            get_now_playing(current_obj,
                options,
                audio6_html5_thumbsHolder,
                audio6_html5_thumbsHolderWrapper,
                audio6_html5_thumbsHolderVisibleWrapper,
                audio6_html5_container,
                audio6_html5_play_btn,
                audio6_html5_Author,
                audio6_html5_Title,
                audio6_html5_TitleInside,
                audio6_html5_radioStation,
                audio6_html5_Audio,
                audio6_html5_ximage,
                audio6_html5_historyPadding,
                audio6_html5_the_wrapper,
                audio6_html5_historyTitle);
        } else {
            addToHistory(current_obj,
                options,
                audio6_html5_container,
                audio6_html5_thumbsHolder,
                audio6_html5_thumbsHolderWrapper,
                audio6_html5_thumbsHolderVisibleWrapper,
                audio6_html5_historyPadding,
                audio6_html5_play_btn,
                audio6_html5_Author,
                audio6_html5_Title,
                audio6_html5_TitleInside,
                audio6_html5_radioStation,
                audio6_html5_Audio,
                audio6_html5_ximage,
                audio6_html5_the_wrapper,
                audio6_html5_historyTitle);
        }

    }



	function get_now_playing(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_historyPadding,audio6_html5_the_wrapper,audio6_html5_historyTitle) {
		if (!options.showOnlyPlayButton && !current_obj.isRadiojar) {
					//alert(current_obj.now_playing_arr_lenght);
					//alert (current_obj.now_playing_arr[current_obj.now_playing_current_k]);

		            //if (current_obj.now_playing_found === false && current_obj.now_playing_current_k < (current_obj.now_playing_arr_lenght)) {
					//	current_obj.now_playing_current_k++;
                    //}

                    // we only support icecast2 servers - to hell with the rest of them! Popcorn
        		    now_playing_current_k = 2;
        		    current_obj.now_playing_current_k = 2;

					//var my_url=current_obj.http_or_https+'://'+current_obj.ip+':'+current_obj.port+'/'+current_obj.now_playing_arr[current_obj.now_playing_current_k]+((current_obj.now_playing_arr[current_obj.now_playing_current_k]!='7.html')?'?my_rand='+Math.random():'');
					//if (current_obj.now_playing_current_k===0) {
					//	my_url=current_obj.http_or_https+'://'+current_obj.ip+':'+current_obj.port+'/'+current_obj.now_playing_arr[current_obj.now_playing_current_k]+((current_obj.now_playing_arr[current_obj.now_playing_current_k]!='7.html')?'&my_rand='+Math.random():'')
                    //}

                    var my_url = current_obj.http_or_https + '://' + current_obj.ip + ':' + current_obj.port + '/' + current_obj.now_playing_arr[now_playing_current_k];
                    console.log(my_url);

                    if (current_obj.ip != '' && current_obj.now_playing_current_k < current_obj.now_playing_arr_lenght) {

							doCORSRequest({
								  method: 'GET',
								  url: my_url/*,
								  data: dataField.value*/
							}, function printResult(result) {
										//alert (result);
										//alert ("done");
										//document.getElementById("my_log").innerHTML="done";
										var curSong='';
										var startPoint;
										var aux_startPoint;
                                        var lengthPoint;
        							    var addToHistory = true;
										switch(current_obj.now_playing_current_k) {
											case 0:
												//alert ("0: "+result);
												if (result.indexOf("<SONGTITLE>")!=-1) {
														current_obj.now_playing_found=true;
														startPoint=result.indexOf("<SONGTITLE>")+11;
														lengthPoint=result.indexOf("</SONGTITLE>")-startPoint;
														curSong=result.substr(startPoint,lengthPoint);
														current_obj.curTitle=curSong;
														changeCurrentSongTitle(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage);
												} else {
														get_now_playing(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_historyPadding,audio6_html5_the_wrapper,audio6_html5_historyTitle);
												}
												break;

											case 1:
											//alert ("new 1: "+result);
													startPoint=result.indexOf("<body>")+6;
													lengthPoint=result.length;
													result=result.substr(startPoint,lengthPoint);
													result=result.replace('</body></html>', '');
													//alert ("new 1: "+result);
													var my_split = result.split(',');
													//alert ('my_split: '+my_split[6]);
													//if(my_split[6].match(/\S/g)) {
													if(my_split[6]!='' && my_split[6]!=undefined && my_split[6]!='oracle:0') {
															current_obj.now_playing_found=true;
															curSong=my_split[6];
															current_obj.curTitle=curSong;
															changeCurrentSongTitle(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage);
													} else {
															get_now_playing(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_historyPadding,audio6_html5_the_wrapper,audio6_html5_historyTitle);
													}
											break;

											case 2:
												//alert (result);
												startPoint=result.indexOf('{"icestats":');
											    if (startPoint !== -1) {
											        lengthPoint = result.length;
                                                    result = result.substr(startPoint, lengthPoint);
											        result = result.replace(': - ,', ': "-" ,');

											        //alert ("2: "+result);
                                                    var obj_json = JSON.parse(result);
                                                    handleIcestats(obj_json, current_obj, options, audio6_html5_thumbsHolder, audio6_html5_thumbsHolderWrapper, audio6_html5_thumbsHolderVisibleWrapper, audio6_html5_historyPadding, audio6_html5_historyTitle, audio6_html5_container,  audio6_html5_the_wrapper, audio6_html5_play_btn, audio6_html5_Author, audio6_html5_Title, audio6_html5_TitleInside, audio6_html5_radioStation, audio6_html5_Audio, audio6_html5_ximage);
											        addToHistory = false;
											    }
											    break;
											case 3:
												//mountpoint
												if (current_obj.mount_point!='')
													startPoint=result.indexOf(current_obj.mount_point);
												if (startPoint>0) {
													lengthPoint=result.length;
													result=result.substr(startPoint,lengthPoint);
												}
												//alert ('3: '+result);
												aux_startPoint=result.indexOf('Currently playing:');
												if (aux_startPoint==-1) {
													aux_startPoint=result.indexOf('Current Song:');
												}
												if (aux_startPoint>0) {
													current_obj.now_playing_found=true;
													startPoint=result.indexOf('<td class="streamstats">',aux_startPoint);
													if (startPoint>0) {
														startPoint=startPoint+24;
													} else {
														startPoint=result.indexOf('<td class="streamdata">',aux_startPoint)+23;
													}
													lengthPoint=result.indexOf('<\/td>',startPoint);

													lengthPoint=lengthPoint-startPoint;

													curSong=result.substr(startPoint,lengthPoint);
													current_obj.curTitle=curSong;
													changeCurrentSongTitle(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage);
												}
												if (curSong=='') {
													current_obj.now_playing_found=false;
													get_now_playing(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_historyPadding,audio6_html5_the_wrapper,audio6_html5_historyTitle);
												}
												break;
											default:
													current_obj.now_playing_found=true;
													curSong='Not available...';
													current_obj.curTitle=curSong;
													changeCurrentSongTitle(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage);
										}  //switch

							});

					//alert (current_obj.curTitle);
                        if (addToHistory) {
    						addToHistory(current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle);
                        }

					} else { //no IP
							curSong='Data not available...';
							current_obj.curTitle=curSong;
							changeCurrentSongTitle(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage);
					}


		} else {
				if (current_obj.isRadiojar) {
					//{"album": "Unknown", "sku": "", "thumb": "", "artist": "Central Line", "title": "Walking Into Sunshine", "show": {}, "buy_urls": "", "info_urls": "", "duration": "462", "guid": "ff984130-b9fd-11e7-b45f-fa163eab7d8a"}
					doCORSRequest({
							method: 'GET',
							url: 'http://www.radiojar.com/api/stations/'+current_obj.mount_point+'/now_playing/?my_rand='+Math.random()
					}, function printResult(result) {
							startPoint=result.indexOf('{');
							if (startPoint!==-1) {
									lengthPoint=result.length;
									result=result.substr(startPoint,lengthPoint);
									//alert ("2: "+result);

									var obj_json = JSON.parse(result);
									//alert (Object.keys(obj_json).length+'  --  '+obj_json['title']);
									current_obj.curTitle=obj_json['artist']+' - '+obj_json['title'];
									changeCurrentSongTitle(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage);

									addToHistory(current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle);
							}

					});
				}

		}

	}



	function history_lastfm_call(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_thumbsHolderWrapper,audio6_html5_historyPadding,audio6_html5_the_wrapper,audio6_html5_historyTitle,the_p) {
				if (options.grabLastFmPhoto) {
				    /*$.get( "https://ws.audioscrobbler.com/2.0/?artist="+author_arr[0]+"&method=artist.getInfo&api_key="+options.lastFMApiKey+"&format=json", {}, function( data ) {
				        //if (data.artist.image !== undefined) {
				        if (data.hasOwnProperty('artist') && data.artist.hasOwnProperty('image')) {
				              //alert ('data: '+data.artist.image[3]['#text'].trim());
											//alert (the_p+'  --  '+current_obj.playlist_arr.length);
											if (data.artist.image[2]['#text'].trim()!='') {
												current_obj.playlist_images_arr[the_p]=data.artist.image[2]['#text'];
											}

											//alert ("the_p: "+the_p+'  ----   '+current_obj.playlist_arr.length);
											if (the_p==(current_obj.playlist_arr.length-1)) {
												setTimeout(function(){
													generateHistory(current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle);
												}, 1000);
											}
				        } else {
											if (the_p==(current_obj.playlist_arr.length-1)) {
												setTimeout(function(){
													generateHistory(current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle);
												}, 1000);
											}
				        }
				    });*/



										/*changeArtistImage(options,current_obj,audio6_html5_ximage,photo_path);*/
										current_obj.musicbrainzHistory_setTimeout_arr[the_p]=setTimeout(function(){
															var author_arr=current_obj.playlist_arr[the_p].split('-');
															author_arr[0]=author_arr[0].trim();
															current_obj.the_artist_id_history_arr[the_p]='';
															current_obj.the_wikidata_id_history_arr[the_p]='';
															photo_path=options.noImageAvailable;
															current_obj.wiki_photo_path=photo_path;
															clearTimeout(current_obj.musicbrainzHistory_setTimeout_arr[the_p]);
															author_arr[0]=author_arr[0].trim();
															///console.log("!!!!!!!!!!!!!!!!---------history--------------!!!!!!!!!!!!!!!!!!!!!!!");


															$.get( "https://musicbrainz.org/ws/2/artist/?query=artist:"+author_arr[0], {}, function( xml ) {
																		///console.log(the_p+'  --  '+author_arr[0]);
																		var now_artist_name;
																		var temp_artist_name='';
																		var xmlLine_name;
																		var temp_artist_image='';
																		current_obj.the_artist_id_history_arr[the_p]='';
																		///console.log("first: ");console.log(xml);
																		now_artist_name=author_arr[0];
																		now_artist_name=now_artist_name.toLowerCase();
																		now_artist_name=removeAccents(now_artist_name);
																		$("artist", xml).each(function(){
																					xmlLine_name = $("name", this)[0];
																					if ($("name", this).length>0 && current_obj.the_artist_id_history_arr[the_p]=='') {
																							 temp_artist_name=$(xmlLine_name).text();
																							 temp_artist_name=temp_artist_name.toLowerCase();
																							 temp_artist_name=removeAccents(temp_artist_name);
																							 if (now_artist_name.toLowerCase()==temp_artist_name.toLowerCase()){
																										current_obj.the_artist_id_history_arr[the_p]=$(this).attr('id');
																							 }
																					}
																	 });

																	 ///console.log($("artist", xml)[0]);
																	 ///console.log($($("artist", xml)[0]).attr('id'));
																	 ///console.log("artist id1:"+current_obj.the_artist_id_history_arr[the_p]);
																	 if (current_obj.the_artist_id_history_arr[the_p]=='' && author_arr[0]!='ROCK RADIO') {
																			current_obj.the_artist_id_history_arr[the_p]=$($("artist", xml)[0]).attr('id');
																	 }
																	///console.log("artist id2:"+current_obj.the_artist_id_history_arr[the_p]);
																	 if (current_obj.the_artist_id_history_arr[the_p]!='' && current_obj.the_artist_id_history_arr[the_p]!=undefined) {
																				 current_obj.musicbrainzHistory_setTimeout_arr[the_p]=setTimeout(function() {
																								current_obj.the_wikidata_id_history_arr[the_p]='';
																								///console.log("artist id2bis:"+current_obj.the_artist_id_history_arr[the_p]);
																								$.get( "https://musicbrainz.org/ws/2/artist/"+current_obj.the_artist_id_history_arr[the_p]+"?inc=url-rels", {}, function( xml ) {
																											///console.log("url-rels: ");console.log(xml);
																											$("relation", xml).each(function(){
																														if ($(this).attr('type')=='image'){
																																		if ($("target", this).length>0) {
																																				temp_artist_image=$("target", this).text();
																																				///console.log(temp_artist_image);
																																				temp_artist_image=temp_artist_image.substr(temp_artist_image.indexOf('File:',10)+5, temp_artist_image.length);
																																				///console.log(temp_artist_image);
																																				get_wiki_image_history(temp_artist_image,current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle,the_p);
																																		}
																														} //('type')=='image'

																														if ($(this).attr('type')=='wikidata') {
																																	if ($("target", this).length>0 && temp_artist_image=='') {
																																			///console.log($("target", this).text());
																																			current_obj.the_wikidata_id_history_arr[the_p]=$("target", this).text();
																																			//https://www.wikidata.org/wiki/
																																			current_obj.the_wikidata_id_history_arr[the_p]=current_obj.the_wikidata_id_history_arr[the_p].substr(current_obj.the_wikidata_id_history_arr[the_p].indexOf('/Q',10)+1, current_obj.the_wikidata_id_history_arr[the_p].length);
																																			///console.log(current_obj.the_wikidata_id_history_arr[the_p]);
																																			$.get( "https://www.wikidata.org/w/api.php?action=wbgetclaims&entity="+current_obj.the_wikidata_id_history_arr[the_p]+"&property=P18&format=xml&origin=*", {}, function( xml ) {
																																						///console.log("!!!!!!!!!!!!wiki!!!!!!!!!!!!!! ");console.log(xml);
																																						temp_artist_image=$("datavalue", $("mainsnak", xml)).attr("value");
																																						///console.log(temp_artist_image);
																																						get_wiki_image_history(temp_artist_image,current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle,the_p);
																																			});
																																	}
																														} // ('type')=='wikidata'
																											});

																											if (temp_artist_image=='' || temp_artist_image==undefined) {
																													current_obj.playlist_images_arr[the_p]=photo_path;
																											}
																								});
																				}, (the_p+1)*3000);
																	 }
															});
										}, (the_p+1)*3000);



				}
	}



	function changeSrc(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_thumbsHolderWrapper,audio6_html5_historyPadding,audio6_html5_the_wrapper,audio6_html5_historyTitle,audio6_html5_minimize_btn) {
			  clearInterval(current_obj.radioReaderAjaxInterval);
				//alert (options.radio_stream.indexOf("/",9));
				var matches;

				if (options.radio_stream.indexOf("radiojar.com")!==-1) {
						current_obj.isRadiojar=true;
						//http://stream.radiojar.com/q8ra7v44cq5tv
						//recently played: http://www.radiojar.com/api/stations/q8ra7v44cq5tv/tracks/
						//now playing: http://www.radiojar.com/api/stations/q8ra7v44cq5tv/now_playing/
						matches = options.radio_stream.match(current_obj.myregexp_radiojar);
						if (matches!=null) {
							current_obj.http_or_https=matches[1];
							current_obj.ip=matches[2];
							current_obj.mount_point=matches[3];
							current_obj.port='';
						}
				} else {
								if (options.radio_stream.indexOf("/",9)==-1) {
									options.radio_stream=options.radio_stream+'/;';
								}
								if (options.radio_stream.charAt(options.radio_stream.length - 1)=='/') {
									options.radio_stream=options.radio_stream+';';
								}
								matches = options.radio_stream.match(current_obj.myregexp);
								if (matches!=null) {
									current_obj.http_or_https=matches[1];
									current_obj.ip=matches[2];
									//alert (current_obj.http_or_https);
									current_obj.port=matches[3];
									current_obj.mount_point=matches[4];
									if (current_obj.mount_point.trim()==';') {
										current_obj.mount_point='';
									}
								}
					}
				//alert (options.radio_stream+' -- '+current_obj.ip+' -- '+current_obj.port+' -- '+current_obj.mount_point);




				//first image initialization
				audio6_html5_ximage.css({
								"width":options.playerWidth+"px",
								"height":options.imageHeight+"px",
								"background":"url("+options.noImageAvailable+") #000000",
								"background-repeat":"no-repeat",
								"background-position":"top center",
								"background-size":"contain"
				});
				if (!options.showOnlyPlayButton) {
							//get_now_playing first call
							get_now_playing(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_historyPadding,audio6_html5_the_wrapper,audio6_html5_historyTitle);

							//get_now_playing call each options.nowPlayingInterval seconds
							current_obj.radioReaderAjaxInterval=setTimeout(function(){
									get_now_playing(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_historyPadding,audio6_html5_the_wrapper,audio6_html5_historyTitle);
							},options.nowPlayingInterval*1000);
							//now_playing first call end


							//audio6_html5_thumbsHolderWrapper.height(285);  //285 the estimate history list height (before generating it)

							//get history
							current_obj.playlist_arr=new Array();
							current_obj.playlist_images_arr=new Array();
							var p=-1;
							var startPoint;
							var history_temp_str;
							var lengthPoint;
							var history_aux_arr;
							var i = 0;
							if (current_obj.isRadiojar) { //only for radiojar
													doCORSRequest({
															method: 'GET',
															url: 'http://www.radiojar.com/api/stations/'+current_obj.mount_point+'/tracks/?my_rand='+Math.random()
													}, function printResult(result) {
															//alert (result);
															startPoint=result.indexOf('[{');
															if (startPoint!==-1) {
																	lengthPoint=result.length;
																	result=result.substr(startPoint,lengthPoint);
																	//alert ("2: "+result);

																	var obj_json = JSON.parse(result);
																	obj_json.reverse();
																	//alert (Object.keys(obj_json).length+'  --  '+obj_json[0]['track']);
															}

															for (i = 0; i < Object.keys(obj_json).length; i++) {
																	if (obj_json[i]['track']!='' && obj_json[i]['track']!='Empty Title') {
																		p++;
																		current_obj.playlist_arr[p]=obj_json[i]['artist']+' - '+obj_json[i]['track'];
																		current_obj.playlist_images_arr[p]=options.noImageAvailable;
																		history_lastfm_call(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_thumbsHolderWrapper,audio6_html5_historyPadding,audio6_html5_the_wrapper,audio6_html5_historyTitle,p);
																	}
															}



															if (current_obj.playlist_arr.length) {
																 generateHistory(current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle);
																 if (options.sticky && options.startMinified) {
																	 audio6_html5_minimize_btn.click();
																 }
														 } else {
														 current_obj.isHistoryGenerated=true;
																 if (options.sticky && options.startMinified) {
																	 audio6_html5_minimize_btn.click();
																 }
														 }


													});
                            } else { //general
                                /**
													doCORSRequest({
														  method: 'GET',
														  url: current_obj.http_or_https+'://'+current_obj.ip+':'+current_obj.port+'/'+current_obj.history_arr[current_obj.history_current_k]
														  //,data: dataField.value
													}, function printResult(result) {
																	//alert (result);
																	//'Current Song'
																		if (result.indexOf("Current Song")!=-1) {
																		  startPoint=result.indexOf("Current Song")+12;
																		  lengthPoint=result.length;
																		  result=result.substr(startPoint,lengthPoint);
																		  //alert ("result: "+result);
																		  history_aux_arr= result.split("</td><td>");
																		  history_aux_arr.shift();
																		  for (var i = 0; i < history_aux_arr.length; i++) {
																			  //history_aux_arr[i] = history_aux_arr[i].replace(/<\/?[^>]+(>|$)/g, "");
																			  //history_temp_str=history_aux_arr[i].split("</tr><tr><td>");
																			  //current_obj.playlist_arr[i]=history_temp_str[0];
																			  startPoint=history_aux_arr[i].indexOf("</");
																			  if (startPoint!=-1) {
																				 lengthPoint=startPoint;
																				 history_aux_arr[i]=history_aux_arr[i].substr(0,lengthPoint);
																				 history_aux_arr[i] = history_aux_arr[i].replace(/<\/?[^>]+(>|$)/g, "");
																				 //alert (history_aux_arr[i]);
																				  if (history_aux_arr[i]!='' && history_aux_arr[i]!='Empty Title') {
																					  p++;
																					  current_obj.playlist_arr[p]=history_aux_arr[i];
																					  current_obj.playlist_images_arr[p]=options.noImageAvailable;
																					  history_lastfm_call(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_thumbsHolderWrapper,audio6_html5_historyPadding,audio6_html5_the_wrapper,audio6_html5_historyTitle,p);
																				  }
																			  }

																		  }
																		  //current_obj.playlist_arr=history_aux_arr;
																		  //alert (history_aux_arr+'   ---   '+current_obj.playlist_arr[0]);
																	}
																   if (current_obj.playlist_arr.length) {
																		  generateHistory(current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle);
																		  if (options.sticky && options.startMinified) {
																				audio6_html5_minimize_btn.click();
																		  }
																  } else {
																	current_obj.isHistoryGenerated=true;
																		  if (options.sticky && options.startMinified) {
																				audio6_html5_minimize_btn.click();
																		  }
																  }
                                    });
                                *****/
							}
				}

				/********************changeCurrentSongTitle(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage);***********************/

				//audio6_html5_Audio.type='audio/ogg; codecs="vorbis"';
				//document.getElementById(current_obj.audioID).type='audio/ogg; codecs="vorbis"';
				if (!current_obj.isFlashNeeded) {
					document.getElementById(current_obj.audioID).src=detectBrowserAndAudio(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container);
					document.getElementById(current_obj.audioID).load();
					if (options.autoPlay) {
						audio6_html5_play_btn.click();
					}
				} else {
					if (current_obj.myFlashObject!='') {
						current_obj.myFlashObject.myAS3function(detectBrowserAndAudio(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container),options.initialVolume);
					}
				}


				//alert (audio6_html5_Audio.type );



			};

			function changeArtistImage(options,current_obj,the_ximage,photo_path) {
						the_ximage.css({
							"background":"url("+photo_path+") #000000",
							"background-repeat":"no-repeat",
							"background-position":"top center",
							"background-size":"contain"
						});
						//console.log('before: '+current_obj.prev_song_image+'    ----    '+current_obj.cur_song_image);
						current_obj.prev_song_image=current_obj.cur_song_image;
						current_obj.cur_song_image=photo_path;
						//console.log('after: '+current_obj.prev_song_image+'    ----    '+current_obj.cur_song_image);
			}


	function changeCurrentSongTitle(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage) {
				/*audio6_html5_Title.width(current_obj.titleWidth);
				audio6_html5_radioStation.width(current_obj.titleWidth);*/


//current_obj.curTitle="A-HA - Bed Of Roses";
				current_obj.curSongText='';
				if (options.showTitle && current_obj.curTitle!=null && current_obj.curTitle!='') {
	            	current_obj.curSongText+=current_obj.curTitle;
	            }

				if (options.showRadioStation && options.radio_name!=null && options.radio_name!='') {
					audio6_html5_radioStation.html(options.radio_name);
				}

				var author_arr=current_obj.curTitle.split('-');
				var photo_path=options.noImageAvailable;
				// load details of the artist
				//MARIA MULDAUR
				author_arr[0]=author_arr[0].trim();
				if (author_arr.length>=3) {
					author_arr[0]=author_arr[0].trim()+"-"+author_arr[1].trim();
				}
				//alert (author_arr[0]);
				//change image
				if (options.grabLastFmPhoto && author_arr[0].trim()!='') {
						/*current_obj.lastfm.artist.getInfo({artist: author_arr[0]}, {success: function(data){
						//alert (data.artist.image.toSource());
							//[
								//{'#text':"http://userserve-ak.last.fm/serve/34/98245565.png", size:"small"},
								//{'#text':"http://userserve-ak.last.fm/serve/64/98245565.png", size:"medium"},
								//{'#text':"http://userserve-ak.last.fm/serve/126/98245565.png", size:"large"},
								//{'#text':"http://userserve-ak.last.fm/serve/252/98245565.png", size:"extralarge"},
								//{'#text':"http://userserve-ak.last.fm/serve/500/98245565/Cher+PNG.png", size:"mega"}
							//]
							//alert(data.artist.image[2]['#text']);
							*/
						/*$.get( "https://ws.audioscrobbler.com/2.0/?artist="+author_arr[0]+"&method=artist.getInfo&api_key="+options.lastFMApiKey+"&format=json", {}, function( data ) {
								//if (data.artist.image !== undefined) {
								if (data.hasOwnProperty('artist') && data.artist.hasOwnProperty('image')) {
											//alert ('data: '+data.artist.image[3]['#text'].trim());
											if (data.artist.image[3]['#text'].trim()!='') {
															photo_path=data.artist.image[3]['#text'].trim();
															changeArtistImage(options,current_obj,audio6_html5_ximage,photo_path);
											} else {
												changeArtistImage(options,current_obj,audio6_html5_ximage,photo_path);
											}
								} else {
											changeArtistImage(options,current_obj,audio6_html5_ximage,photo_path);
								}
						});*/

						var now_artist_name;
						var temp_artist_name='';
						var xmlLine_name;
						var temp_artist_image='';
						current_obj.the_artist_id='';
						current_obj.the_wikidata_id='';
						photo_path=options.noImageAvailable;
						current_obj.wiki_photo_path=photo_path;
						clearTimeout(current_obj.musicbrainz_setTimeout);
						clearTimeout(current_obj.no_artist_image_setTimeout);
						author_arr[0]=author_arr[0].trim();
						///console.log(current_obj.prevTitle+'  !=  '+current_obj.curTitle);
						if (author_arr[0]!='' && author_arr[0]!=undefined && current_obj.prevTitle!=current_obj.curTitle) {
										/*changeArtistImage(options,current_obj,audio6_html5_ximage,photo_path);*/
										audio6_html5_ximage.css({
											"background":"url("+photo_path+") #000000",
											"background-repeat":"no-repeat",
											"background-position":"top center",
											"background-size":"contain"
										});
										current_obj.musicbrainz_setTimeout=setTimeout(function(){
															$.get( "https://musicbrainz.org/ws/2/artist/?query=artist:"+author_arr[0], {}, function( xml ) {
																		current_obj.the_artist_id='';
																		///console.log("first: ");console.log(xml);
																		now_artist_name=author_arr[0];
																		now_artist_name=now_artist_name.toLowerCase();
																		now_artist_name=removeAccents(now_artist_name);
																		$("artist", xml).each(function(){
																					xmlLine_name = $("name", this)[0];
																					if ($("name", this).length>0 && current_obj.the_artist_id=='') {
																							 temp_artist_name=$(xmlLine_name).text();
																							 temp_artist_name=temp_artist_name.toLowerCase();
																							 temp_artist_name=removeAccents(temp_artist_name);
																							 if (now_artist_name.toLowerCase()==temp_artist_name.toLowerCase()){
																										current_obj.the_artist_id=$(this).attr('id');
																							 }
																					}
																	 });

																	 ///console.log($("artist", xml)[0]);
																	 ///console.log($($("artist", xml)[0]).attr('id'));
																	 ///console.log("artist id:"+current_obj.the_artist_id);
																	 if (current_obj.the_artist_id=='' && author_arr[0]!='ROCK RADIO') {
																			current_obj.the_artist_id=$($("artist", xml)[0]).attr('id');
																	}

																	 if (current_obj.the_artist_id!='' && current_obj.the_artist_id!=undefined) {
																				 current_obj.musicbrainz_setTimeout=setTimeout(function() {
																								current_obj.the_wikidata_id='';
																								///console.log("artist id2:"+current_obj.the_artist_id);
																								$.get( "https://musicbrainz.org/ws/2/artist/"+current_obj.the_artist_id+"?inc=url-rels", {}, function( xml ) {
																											///console.log("url-rels: ");console.log(xml);
																											$("relation", xml).each(function(){
																														if ($(this).attr('type')=='image'){
																																		if ($("target", this).length>0) {
																																				temp_artist_image=$("target", this).text();
																																				///console.log(temp_artist_image);
																																				temp_artist_image=temp_artist_image.substr(temp_artist_image.indexOf('File:',10)+5, temp_artist_image.length);
																																				///console.log(temp_artist_image);
																																				get_wiki_image(temp_artist_image,options,current_obj,audio6_html5_ximage);
																																		}
																														} //('type')=='image'

																														if ($(this).attr('type')=='wikidata') {
																																	if ($("target", this).length>0 && temp_artist_image=='') {
																																			///console.log($("target", this).text());
																																			current_obj.the_wikidata_id=$("target", this).text();
																																			//https://www.wikidata.org/wiki/
																																			current_obj.the_wikidata_id=current_obj.the_wikidata_id.substr(current_obj.the_wikidata_id.indexOf('/Q',10)+1, current_obj.the_wikidata_id.length);
																																			///console.log(current_obj.the_wikidata_id);
																																			$.get( "https://www.wikidata.org/w/api.php?action=wbgetclaims&entity="+current_obj.the_wikidata_id+"&property=P18&format=xml&origin=*", {}, function( xml ) {
																																						///console.log("!!!!!!!!!!!!wiki!!!!!!!!!!!!!! ");console.log(xml);
																																						temp_artist_image=$("datavalue", $("mainsnak", xml)).attr("value");
																																						///console.log(temp_artist_image);
																																						get_wiki_image(temp_artist_image,options,current_obj,audio6_html5_ximage);
																																			});
																																	}
																														} // ('type')=='wikidata'
																											});


																											current_obj.no_artist_image_setTimeout=setTimeout(function() {
																														if (temp_artist_image=='' || temp_artist_image==undefined) {
																																///console.log("doi: "+current_obj.the_artist_id);
																																changeArtistImage(options,current_obj,audio6_html5_ximage,photo_path);
																														}
																											}, 1000);
																								});
																				}, 1500);
																	 }
															});
										}, 1500);
						}

				} else {
					//changeArtistImage(options,current_obj,audio6_html5_ximage,photo_path);
				}

				if (!current_obj.curSongText) {
					/*audio6_html5_Title.css({
						'display':'none',
						'width':0,
						'height':0,
						'padding':0,
						'margin':0
					});*/
				} else {
								var song_author_arr=current_obj.curSongText.split('-');
								current_obj.curSongAuthorText=song_author_arr[0].trim();
								if (song_author_arr.length>=2) {
									current_obj.curSongText=song_author_arr[1].trim();
								}
								if (song_author_arr.length>=3) {
									current_obj.curSongAuthorText=song_author_arr[0].trim()+"-"+song_author_arr[1].trim();
									current_obj.curSongText=song_author_arr[2].trim();
								}
								//alert (current_obj.curSongAuthorText+'   -----   '+current_obj.curSongText);
								audio6_html5_Author.html(capitalizeFirstLetter(current_obj.curSongAuthorText,options));


								audio6_html5_TitleInside.css({
									"width":"auto"
								});

								current_obj.isStationTitleInsideScrolling=false;
								current_obj.stationTitleInsideWait=0;
								audio6_html5_TitleInside.stop();
								audio6_html5_TitleInside.css({'margin-left':0});
								audio6_html5_TitleInside.html(current_obj.curSongText);
								//alert (current_obj.curSongText);

								clearInterval(current_obj.timeupdateInterval);
								//alert (audio6_html5_Title.width()+'  ----  '+audio6_html5_TitleInside.width());
								if (audio6_html5_TitleInside.width()>current_obj.titleWidth) {
									current_obj.timeupdateInterval=setInterval(function(){
										//$( "#console" ).append( "<span>Test - </span>" );
										if (!current_obj.isStationTitleInsideScrolling && current_obj.stationTitleInsideWait>=5 && audio6_html5_TitleInside.width()>current_obj.titleWidth) {
											current_obj.isStationTitleInsideScrolling=true;
											current_obj.stationTitleInsideWait=0;
											audio6_html5_TitleInside.html(current_obj.curSongText+" **** "+current_obj.curSongText+" **** "+current_obj.curSongText+" **** "+current_obj.curSongText+" **** "+current_obj.curSongText+" **** ");
											audio6_html5_TitleInside.css({'margin-left':0});
											audio6_html5_TitleInside.stop().animate({
													'margin-left':(options.playerWidth-audio6_html5_TitleInside.width())+'px'
											 }, parseInt((audio6_html5_TitleInside.width()-options.playerWidth)*10000/150,10), 'linear', function() {
													// Animation complete.
													  current_obj.isStationTitleInsideScrolling=false;
											});
										} else if (!current_obj.isStationTitleInsideScrolling && audio6_html5_TitleInside.width()>current_obj.titleWidth) {
											current_obj.stationTitleInsideWait++;
										}
									},300);
								} else { //center title
									audio6_html5_TitleInside.css({
										"width":"100%"
									});
								}

				}
		}





		//playlist scroll
		function carouselScroll(direction,current_obj,options,audio6_html5_thumbsHolder) {
				if (current_obj.gen_total_images>options.numberOfThumbsPerScreen) {
									var MAX_TOP=(current_obj.thumbsHolder_ThumbHeight+1)*(current_obj.gen_total_images-options.numberOfThumbsPerScreen);
									var new_top=0;
									//alert (current_obj.audio6_html5_sliderVertical.slider( "option", "animate" ));
									audio6_html5_thumbsHolder.stop(true,true);
									//page scroll enabled
									$('html, body')
					            // Needed to remove previously bound handlers
					            .off('touchstart touchmove')
					            .on('touchstart touchmove', function (e) {
					                e.preventDefault();
					            });
									//page scroll enabled

									if (direction!=-1 && !current_obj.isCarouselScrolling) {
										current_obj.isCarouselScrolling=true;
										new_top=((direction<=2)?(-1)*MAX_TOP:parseInt(MAX_TOP*(direction-100)/100,10));
										if (new_top>0) {
											new_top=0;
										}
										audio6_html5_thumbsHolder.animate({
										    //opacity: 1,
										    //top:parseInt(MAX_TOP*(direction-100)/100,10)+'px'
											top:new_top+'px'
										  }, 1100, 'easeOutQuad', function() {
										    // Animation complete.
											  current_obj.isCarouselScrolling=false;
												//page scroll enabled
												$('html, body')
													.off('touchstart touchmove')
													.on('touchstart touchmove', function (e) {});
												//page scroll enabled
										});
									} else if (!current_obj.isCarouselScrolling && current_obj.gen_total_images>options.numberOfThumbsPerScreen) {
										current_obj.isCarouselScrolling=true;
										//audio6_html5_thumbsHolder.css('opacity','0.5');
										new_top=(-1)*parseInt((current_obj.thumbsHolder_ThumbHeight+1)*current_obj.current_img_no,10);
										if( Math.abs(new_top) > MAX_TOP ){ new_top = (-1)*MAX_TOP; }
										if (current_obj.gen_total_images>options.numberOfThumbsPerScreen && options.showPlaylist) {
											current_obj.audio6_html5_sliderVertical.slider( "value" , 100 + parseInt( new_top * 100 / MAX_TOP ) );
										}
										audio6_html5_thumbsHolder.animate({
										    //opacity: 1,
										    top:new_top+'px'
										  }, 500, 'easeOutCubic', function() {
										    // Animation complete.
											  current_obj.isCarouselScrolling=false;
												//page scroll enabled
												$('html, body')
													.off('touchstart touchmove')
													.on('touchstart touchmove', function (e) {});
												//page scroll enabled
										});
									}
					}
		};




		function arrangePlayerElements(ximage_display,current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle,audio6_html5_frameBehindText,audio6_html5_songAuthorLineSeparator,audio6_html5_frameBehindButtons,audio6_html5_minimize_btn,audio6_html5_showHidePlaylist_btn,audio6_html5_volumeSlider,audio6_html5_volumeMute_btn,audio6_html5_twitter_btn,audio6_html5_facebook_btn) {
					audio6_html5_container.width(options.playerWidth);
					//the image
					//ximage_display='block';
					if (options.showOnlyPlayButton || current_obj.isMinified) {
						ximage_display='none';
					}

					if (ximage_display=='none') {
						audio6_html5_ximage.css({
							"width":0+"px",
							"height":0+"px"
						});
					} else {
						audio6_html5_ximage.css({
							"width":options.playerWidth+"px",
							"height":parseInt(options.imageHeight*(options.playerWidth/options.origWidth),10)+"px"
						});
					}
					if (options.sticky && options.startMinified) {
							audio6_html5_ximage.css({
									'display':'none',
									'top':0+'px',
									'left':0+'px'
							});
							/*audio6_html5_minimize_btn.addClass('AudioOpenBut');
							current_obj.temp_showHistoryBut=false;*/
							//current_obj.isMinified=true;
					} else {
						audio6_html5_ximage.css({
							'display':ximage_display,
							'top':0+'px',
							'left':0+'px'
						});
					}

					current_obj.imageTopPos=0;
					current_obj.imageLeftPos=0;



					/*audio6_html5_ximage.click(function() {
								audio6_html5_play_btn.click();
					});*/


					//frame behind text
					current_obj.frameBehindTextTopPos=audio6_html5_ximage.height();
					current_obj.frameBehindTextLeftPos=0;
					if (!options.showOnlyPlayButton) {
						audio6_html5_frameBehindText.css({
							'top':current_obj.frameBehindTextTopPos+'px',
							'left':current_obj.frameBehindTextLeftPos+'px',
							'background':options.frameBehindTextColor,
							'height':audio6_html5_play_btn.height()+2*current_obj.playVerticalPadding+'px'
						});
					} else {
						audio6_html5_frameBehindText.css({
							'top':current_obj.frameBehindTextTopPos+'px',
							'left':current_obj.frameBehindTextLeftPos+'px',
							'background':options.frameBehindTextColor,
							'width':0,
							'height':0
						});
					}



					//play button
					current_obj.playTopPos=current_obj.frameBehindTextTopPos+current_obj.playVerticalPadding;
					current_obj.playLeftPos=current_obj.frameBehindTextLeftPos+current_obj.playHorizontalPadding;
					audio6_html5_play_btn.css({
						'top':current_obj.playTopPos+'px',
						'left':current_obj.playLeftPos+'px'
					});


					//song title
					current_obj.titleWidth=options.playerWidth-4*current_obj.playHorizontalPadding-audio6_html5_play_btn.width();
					current_obj.titleTopPos=current_obj.playTopPos+3;
					current_obj.titleLeftPos=audio6_html5_play_btn.width()+2*current_obj.playHorizontalPadding;
					audio6_html5_Title.css({
						'color':options.songTitleColor,
						'top':current_obj.titleTopPos+'px',
						'left':current_obj.titleLeftPos+'px',
						'width':current_obj.titleWidth+'px'
					});


					//line separator
					current_obj.lineSeparatorTopPos=current_obj.titleTopPos+audio6_html5_Title.height()+2;
					current_obj.lineSeparatorLeftPos=current_obj.titleLeftPos;
					audio6_html5_songAuthorLineSeparator.css({
						'background':options.lineSeparatorColor,
						'top':current_obj.lineSeparatorTopPos+'px',
						'left':current_obj.lineSeparatorLeftPos+'px',
						'width':current_obj.titleWidth+'px'
					});

					//song author
					current_obj.authorTopPos=current_obj.lineSeparatorTopPos+8;
					current_obj.authorLeftPos=current_obj.titleLeftPos;
					audio6_html5_Author.css({
						'color':options.authorTitleColor,
						'top':current_obj.authorTopPos+'px',
						'left':current_obj.authorLeftPos+'px',
						'width':current_obj.titleWidth+'px'
					});

					//minimize
					current_obj.minimizeTopPos=current_obj.playTopPos;
					if (!options.sticky || options.showOnlyPlayButton) {
						current_obj.minimizeRightPos=0;
						audio6_html5_minimize_btn.css({
							'display':'none',
							'padding':0,
							'margin':0
						});
					} else if (options.sticky) {
						current_obj.minimizeRightPos=current_obj.smallButtonDistance;
						audio6_html5_minimize_btn.css({
							'top':current_obj.minimizeTopPos+'px',
							'right':current_obj.minimizeRightPos+'px'
						});
					}




					//frameBehindButtonsTopPos
					current_obj.frameBehindButtonsTopPos=current_obj.frameBehindTextTopPos+audio6_html5_frameBehindText.height();
					current_obj.frameBehindButtonsLeftPos=0;
					if (!options.showOnlyPlayButton) {
						audio6_html5_frameBehindButtons.css({
							'background':options.frameBehindButtonsColor,
							/*'height':+'px',*/
							'top':current_obj.frameBehindButtonsTopPos+'px',
							'left':current_obj.frameBehindButtonsLeftPos+'px'
						});
					} else {
						audio6_html5_frameBehindButtons.css({
							'background':options.frameBehindButtonsColor,
							'height':0,
							'top':current_obj.frameBehindButtonsTopPos+'px',
							'left':current_obj.frameBehindButtonsLeftPos+'px'
						});
					}


					//radio station name
					current_obj.radioStationTopPos=current_obj.frameBehindButtonsTopPos+Math.floor(audio6_html5_frameBehindButtons.height()-audio6_html5_radioStation.height())/2;
					current_obj.radioStationLeftPos=current_obj.playHorizontalPadding;
					audio6_html5_radioStation.css({
						'color':options.radioStationColor,
						'top':current_obj.radioStationTopPos+'px',
						'left':current_obj.radioStationLeftPos+'px',
						'width':current_obj.titleWidth+'px'
					});




					//show/hide playlist
					if (current_obj.historyButWidth==0) {
						current_obj.historyButWidth=audio6_html5_showHidePlaylist_btn.width();
					}
					current_obj.showhidehistoryTopPos=current_obj.frameBehindButtonsTopPos+Math.floor((audio6_html5_frameBehindButtons.height()-audio6_html5_showHidePlaylist_btn.height())/2);
					if (!current_obj.temp_showHistoryBut) {
						current_obj.showhideplaylistRightPos=0;
						audio6_html5_showHidePlaylist_btn.css({
							'display':'none',
							'width':0,
							'padding':0,
							'margin':0
						});
					} else {
						current_obj.showhideplaylistRightPos=2*current_obj.smallButtonDistance;
						audio6_html5_showHidePlaylist_btn.css({
							'display':'block',
							'width':current_obj.historyButWidth+'px',
							'top':current_obj.showhidehistoryTopPos+'px',
							'right':current_obj.showhideplaylistRightPos+'px'
						});
					}





					//volume
					audio6_html5_volumeSlider.css({
						'display':'none',
						'width':0,
						'padding':0,
						'margin':0
					});
					current_obj.volumeTopPos=current_obj.frameBehindButtonsTopPos+Math.floor((audio6_html5_frameBehindButtons.height()-audio6_html5_volumeMute_btn.height())/2);
					if (!options.showVolume) {
						current_obj.volumeRightPos=current_obj.showhideplaylistRightPos+audio6_html5_showHidePlaylist_btn.width();
						audio6_html5_volumeMute_btn.css({
							'display':'none',
							'width':0,
							'padding':0,
							'margin':0
						});

					} else {
						current_obj.volumeRightPos=current_obj.showhideplaylistRightPos+audio6_html5_showHidePlaylist_btn.width()+current_obj.smallButtonDistance;
						audio6_html5_volumeMute_btn.css({
							'top':current_obj.volumeTopPos+'px',
							'right':current_obj.volumeRightPos+'px'
						});
						/*current_obj.volumesliderTopPos=current_obj.volumeTopPos+Math.floor((audio6_html5_volumeMute_btn.height()-audio6_html5_volumeSlider.height())/2);
						current_obj.volumesliderLeftPos=current_obj.volumeRightPos+audio6_html5_volumeMute_btn.width()+current_obj.constantDistance;
						audio6_html5_volumeSlider.css({
							'top':current_obj.volumesliderTopPos+'px',
							'left':current_obj.volumesliderLeftPos+'px'
						});	*/
					}



					//twitter
					current_obj.twitterTopPos=current_obj.frameBehindButtonsTopPos+Math.floor((audio6_html5_frameBehindButtons.height()-audio6_html5_twitter_btn.height())/2);
					if (!options.showTwitterBut) {
						current_obj.twitterRightPos=current_obj.volumeRightPos+audio6_html5_volumeMute_btn.width();
						audio6_html5_twitter_btn.css({
							'display':'none',
							'width':0,
							'padding':0,
							'margin':0
						});
					} else {
						current_obj.twitterRightPos=current_obj.volumeRightPos+audio6_html5_volumeMute_btn.width()+current_obj.smallButtonDistance;
						audio6_html5_twitter_btn.css({
							'top':current_obj.twitterTopPos+'px',
							'right':current_obj.twitterRightPos+'px'
						});
					}




					//facebook
					//current_obj.smallButtonDistance=parseInt( options.playerWidth /(current_obj.numberOfButtonsRightSide+1) , 10);
					current_obj.facebookTopPos=current_obj.frameBehindButtonsTopPos+Math.floor((audio6_html5_frameBehindButtons.height()-audio6_html5_facebook_btn.height())/2);
					if (!options.showFacebookBut) {
						current_obj.facebookRightPos=current_obj.twitterRightPos;
						audio6_html5_facebook_btn.css({
							'display':'none',
							'width':0,
							'padding':0,
							'margin':0
						});
					} else {
						  current_obj.facebookRightPos=current_obj.twitterRightPos+audio6_html5_twitter_btn.width()+current_obj.smallButtonDistance;
						  audio6_html5_facebook_btn.css({
							  'top':current_obj.facebookTopPos+'px',
							  'right':current_obj.facebookRightPos+'px'
						  });
					}
		}




		function generateHistory(current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle) {
			if (!options.showOnlyPlayButton) {
						audio6_html5_thumbsHolder.stop(true,true);
						current_obj.isCarouselScrolling=false;
						$('.readingData',audio6_html5_thumbsHolderVisibleWrapper).css({"display":"none"});
						//alert ("hist");
						var stationLowerCases='';
						var elementFound=false;
						var new_historyRecordTitleLimit=parseInt(options.historyRecordTitleLimit*(options.playerWidth/options.origWidth),10);
						var new_historyRecordAuthorLimit=parseInt(options.historyRecordAuthorLimit*(options.playerWidth/options.origWidth),10);
						var song_author_arr=new Array();


							  current_obj.isHistoryGenerated=true;
							  audio6_html5_thumbsHolder.html("");

							  current_obj.gen_total_images=0;
							  //alert ("history: "+current_obj.playlist_arr.length);
							  for (var j=0;j<current_obj.playlist_arr.length;j++) {

									current_obj.gen_total_images++;
									song_author_arr=current_obj.playlist_arr[j].split('-');
									//if (song_author_arr.length<2) {
									if (song_author_arr.length<1) {
										//song_author_arr[1]='&nbsp;';
										current_obj.gen_total_images--;
									} else {
										  current_obj.thumbsHolder_Thumb = $('<div class="thumbsHolder_ThumbOFF" rel="'+ (current_obj.gen_total_images-1) +'" data-origID="'+ j +'"><div class="padding"><div class="img_div" style="background-image:url('+current_obj.playlist_images_arr[j]+');background-color:#000000;"></div><span class="titlex">'+textLimit(song_author_arr[1],new_historyRecordTitleLimit,options)+'</span><span class="authorx">'+textLimit(song_author_arr[0],new_historyRecordAuthorLimit,options)+'</span></div></div>');
										  audio6_html5_thumbsHolder.append(current_obj.thumbsHolder_Thumb);
										  if (current_obj.thumbsHolder_ThumbHeight==0) {
												current_obj.thumbsHolder_ThumbHeight=current_obj.thumbsHolder_Thumb.height();
										  }


										  current_obj.thumbsHolder_Thumb.css({
											  "top":(current_obj.thumbsHolder_ThumbHeight+1)*current_obj.gen_total_images+'px',
											  "background":options.historyRecordBgColor,
											  "border-bottom-color":options.historyRecordBottomBorderColor,
											  "color":options.historyRecordTextColor
										  });


										  $('.titlex',current_obj.thumbsHolder_Thumb).css({
											  "color":options.historyRecordSongColor,
											  "border-bottom-color":options.historyRecordSongBottomBorderColor
										  });

										  $('.authorx',current_obj.thumbsHolder_Thumb).css({
											  "color":options.historyRecordAuthorColor
										  });


										  current_obj.current_img_no=0;

										  //activate playing one
										  /*if (current_obj.origID==$("div[rel=\'"+(current_obj.gen_total_images-1)+"\']").attr('data-origID')){
											  current_obj.thumbsHolder_Thumb.css({
												  "background":options.playlistRecordBgOnColor,
												  "border-bottom-color":options.playlistRecordBottomBorderOnColor,
												  "color":options.playlistRecordTextOnColor
											  });
										  }*/
									}

							  }





							  audio6_html5_thumbsHolderWrapper.height(2*options.historyPadding+(current_obj.thumbsHolder_ThumbHeight+1)*options.numberOfThumbsPerScreen+audio6_html5_historyTitle.height()+options.historyPadding); //current_obj.thumbsHolder_ThumbHeight+1 - 1 is the border
							  audio6_html5_thumbsHolderVisibleWrapper.height((current_obj.thumbsHolder_ThumbHeight+1)*options.numberOfThumbsPerScreen);
							  audio6_html5_thumbsHolderVisibleWrapper.css({
								 'margin-top':audio6_html5_historyTitle.height()+options.historyPadding+'px'
							  });
							  audio6_html5_historyPadding.css({'padding':options.historyPadding+'px'});

							  current_obj.thumbsHolder_Thumbs=$('.thumbsHolder_ThumbOFF', audio6_html5_container);


							  current_obj.wrapperHeight=current_obj.audioPlayerHeight+audio6_html5_thumbsHolderWrapper.height()+options.historyTopPos;
							  if (!options.showHistory || !options.showHistoryOnInit || (audio6_html5_thumbsHolderWrapper.css('margin-top').substring(0, audio6_html5_thumbsHolderWrapper.css('margin-top').length-2) < 0)) {
								  current_obj.wrapperHeight=current_obj.audioPlayerHeight;
							  }
							  if (!current_obj.isMinified) {
								  audio6_html5_the_wrapper.css({
										//'width':audio6_html5_container.width()+'px',
										'height':current_obj.wrapperHeight+'px'
								  });
							  }


							  //the playlist scroller
							  if (current_obj.gen_total_images>options.numberOfThumbsPerScreen && options.showHistory) {

								  if (options.isPlaylistSliderInitialized) {
									  current_obj.audio6_html5_sliderVertical.slider( "destroy" );
								  }
								  current_obj.audio6_html5_sliderVertical.slider({
									  orientation: "vertical",
									  range: "min",
									  min: 1,
									  max: 100,
									  step:1,
									  value: 100,
									  slide: function( event, ui ) {
										  //alert( ui.value );
										  carouselScroll(ui.value,current_obj,options,audio6_html5_thumbsHolder);
									  }
								  });
								  options.isPlaylistSliderInitialized=true;




								  current_obj.audio6_html5_sliderVertical.css({
									  'display':'inline',
									  'position':'absolute',
									  'height':audio6_html5_thumbsHolderWrapper.height()-20-3*options.historyPadding-audio6_html5_historyTitle.height()+'px', // 24 is the height of  .slider-vertical.ui-slider .ui-slider-handle
									  'left':audio6_html5_container.width()-current_obj.audio6_html5_sliderVertical.width()-options.historyPadding+'px',
									  'top':current_obj.audioPlayerHeight+options.historyTopPos+2*options.historyPadding+2+audio6_html5_historyTitle.height()+'px'
								  });

								  if (!options.showHistoryOnInit) {
									  current_obj.audio6_html5_sliderVertical.css({
										  'opacity': 0,
										  'display':'none'
									  });
								  }
								  //options.showHistoryOnInit=true; // to prevent sliderVertical disappereance after yo show the playlist

								  $('.thumbsHolder_ThumbOFF', audio6_html5_container).css({
									  'width':audio6_html5_container.width()-current_obj.audio6_html5_sliderVertical.width()-2*options.historyPadding-3+'px'
								  });

							  } else {
								  if (options.isPlaylistSliderInitialized) {
										current_obj.audio6_html5_sliderVertical.slider( "destroy" );
										options.isPlaylistSliderInitialized=false;
								  }
								  $('.thumbsHolder_ThumbOFF', audio6_html5_container).css({
									  'width':audio6_html5_container.width()-2*options.historyPadding+'px'
								  });
							  }





							/*current_obj.thumbsHolder_Thumbs.mouseover(function() {
								var currentBut=$(this);
								currentBut.css({
									"background":options.playlistRecordBgOnColor,
									"border-bottom-color":options.playlistRecordBottomBorderOnColor,
									"color":options.playlistRecordTextOnColor
								});
							});


							current_obj.thumbsHolder_Thumbs.mouseout(function() {
								var currentBut=$(this);
								var i=currentBut.attr('rel');
								if (current_obj.origID!=$("div[rel=\'"+i+"\']").attr('data-origID')){
									currentBut.css({
										"background":options.historyRecordBgColor,
										"border-bottom-color":options.historyRecordBottomBorderColor,
										"color":options.historyRecordTextColor
									});
								}
							});	*/

							// mouse wheel
							audio6_html5_thumbsHolderVisibleWrapper.mousewheel(function(event, delta, deltaX, deltaY) {
								event.preventDefault();
								var currentScrollVal=current_obj.audio6_html5_sliderVertical.slider( "value");
								//alert (currentScrollVal+' -- '+delta);
								if ( (parseInt(currentScrollVal)>1 && parseInt(delta)==-1) || (parseInt(currentScrollVal)<100 && parseInt(delta)==1) ) {
									currentScrollVal = currentScrollVal + delta*3;
									current_obj.audio6_html5_sliderVertical.slider( "value", currentScrollVal);
									carouselScroll(currentScrollVal,current_obj,options,audio6_html5_thumbsHolder)
									//alert (currentScrollVal);
								}

							});

							audio6_html5_thumbsHolder.css({
								'top':0+'px'
							});


							//aux_height=current_obj.audioPlayerHeight+audio6_html5_thumbsHolderWrapper.height()+options.historyTopPos;
			}


		}


		function capitalizeFirstLetter(str,options) {
					if (!options.preserveOriginalUpperLowerCase) {
							//return str.replace(/(\b\w)/gi,function(m){return m.toUpperCase();});
							str=str.toLowerCase();
							str=str.replace(/\b[a-z]/g,function(f){return f.toUpperCase();});
							/*str=str.replace("'S","'s");
							str=str.replace("'T","'t");*/
							str=str.replace(/&Apos;/gi,"'");
							str=str.replace(/&Amp;/gi,"&");
							str=str.replace(/'[A-Z]/g,function(f){return f.toLowerCase();});
					}
					return str;
		}


		function textLimit(the_text,limit,options) {
			the_text=String(the_text);
			var points='';
			var textLength=the_text.length;
			//alert (textLength);
			var lastLetter;
			var words;
			if (textLength>limit) {
				the_text=the_text.substring(0, limit);
				//words = the_text.split(/\b[\s,\.-:;]*/);
				words = the_text.split(' ');
				lastLetter=the_text.substring(limit-2, limit-1);
				if (lastLetter!='') {
					words.pop();
					points='...';
				}
				the_text=words.join(" ");
			}

			the_text=capitalizeFirstLetter(the_text,options);
			return the_text+points;
		}


		function cancelAll() {
			//alert ($("audio").attr('id'));
			//$("audio")[0].pause();
			$("audio").each(function() {
				$('.AudioPlay').removeClass('AudioPause');
				$(this)[0].pause();
			});
		}

		function getFlashMovieObject(movieName) {
		  if (window.document[movieName])
		  {
			  return window.document[movieName];
		  }
		  if (navigator.appName.indexOf("Microsoft Internet")==-1)
		  {
			if (document.embeds && document.embeds[movieName])
			  return document.embeds[movieName];
		  }
		  else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
		  {
			return document.getElementById(movieName);
		  }
		}


		function getInternetExplorerVersion()
		// -1 - not IE
		// 7,8,9 etc
		{
		   var rv = -1; // Return value assumes failure.
		   if (navigator.appName == 'Microsoft Internet Explorer')
		   {
			  var ua = navigator.userAgent;
			  var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			  if (re.exec(ua) != null)
				 rv = parseFloat( RegExp.$1 );
		   }
		   else if (navigator.appName == 'Netscape')
		   {
			 var ua = navigator.userAgent;
			 var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
			 if (re.exec(ua) != null)
			   rv = parseFloat( RegExp.$1 );
		   }
		   return parseInt(rv,10);
		}


		function it_supports_mp3(current_obj) {
			  var to_retun=false;
			  if (!(!!(document.getElementById(current_obj.audioID).canPlayType) && ("no" != document.getElementById(current_obj.audioID).canPlayType("audio/mpeg")) && ("" != document.getElementById(current_obj.audioID).canPlayType("audio/mpeg")))) {
				  to_retun=true;
			  }
			  /*var v = document.getElementById(current_obj.audioID);
			  return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');*/
			  return to_retun;
		}





	//core
	$.fn.audio6_html5 = function(options) {

		var options = $.extend({},$.fn.audio6_html5.defaults, options);
		var ver_ie=getInternetExplorerVersion();
		//parse it
		return this.each(function() {
            var audio6_html5_Audio = $(this);
		    icestats_player = $(this);


			//the controllers
			var audio6_html5_controlsDef = $('<div class="frameBehindText"></div><div class="frameBehindButtons"></div> <div class="ximage"></div> <div class="AudioControls"> <a class="AudioCloseBut" title="Minimize"></a><a class="AudioFacebook" title="Facebook"></a><a class="AudioTwitter" title="Twitter"></a><a class="AudioPlay" title="Play/Pause"></a><a class="AudioShowHidePlaylist" title="Show/Hide Playlist"></a><a class="VolumeButton" title="Mute/Unmute"></a><div class="VolumeSlider"></div>   </div>   <div class="songTitle"><div class="songTitleInside"></div></div>  <div class="songAuthorLineSeparator"></div>  <div class="songAuthor"></div>  <div class="radioStation"></div>     <div class="thumbsHolderWrapper"><div class="historyPadding">  <div class="historyTitle"></div> <div class="thumbsHolderVisibleWrapper"><div class="thumbsHolder"></div></div></div></div>  <div class="slider-vertical"></div>');



			//the elements
			var audio6_html5_container = audio6_html5_Audio.parent('.audio6_html5');
			//var audio6_html5_border = $(this).parent();
			//alert (audio6_html5_border.attr('class')+'   ---   '+audio6_html5_container.attr('class'));  // the same

			audio6_html5_container.addClass(options.skin);
			audio6_html5_container.append(audio6_html5_controlsDef);

			var audio6_html5_frameBehindText = $('.frameBehindText', audio6_html5_container);
			var audio6_html5_frameBehindButtons = $('.frameBehindButtons', audio6_html5_container);
			var audio6_html5_controls = $('.AudioControls', audio6_html5_container);
			var audio6_html5_facebook_btn = $('.AudioFacebook', audio6_html5_container);
			var audio6_html5_twitter_btn = $('.AudioTwitter', audio6_html5_container);
			var audio6_html5_play_btn = $('.AudioPlay', audio6_html5_container);
			var audio6_html5_showHidePlaylist_btn = $('.AudioShowHidePlaylist', audio6_html5_container);
			var audio6_html5_volumeMute_btn = $('.VolumeButton', audio6_html5_container);
			var audio6_html5_volumeSlider = $('.VolumeSlider', audio6_html5_container);
			var audio6_html5_minimize_btn = $('.AudioCloseBut', audio6_html5_container);
			var audio6_html5_Title = $('.songTitle', audio6_html5_container);
			var audio6_html5_TitleInside = $('.songTitleInside', audio6_html5_container);

			var audio6_html5_Author = $('.songAuthor', audio6_html5_container);
			var audio6_html5_songAuthorLineSeparator = $('.songAuthorLineSeparator', audio6_html5_container);

			var audio6_html5_radioStation = $('.radioStation', audio6_html5_container);
			var audio6_html5_ximage = $('.ximage', audio6_html5_container);

			var audio6_html5_historyTitle = $('.historyTitle', audio6_html5_container);

			audio6_html5_container.wrap("<div class='the_wrapper'></div>");
			var audio6_html5_the_wrapper = audio6_html5_container.parent();

			var ver_ie=getInternetExplorerVersion();

			if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1 || navigator.userAgent.indexOf('Android') != -1) {
				options.autoPlay=false;
			}


			//initilize the player with the options
			audio6_html5_container.css({
				//'background':options.playerBg,
				'background':"transparent"
			});



			/****if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
				//audio6_html5_controls.css({margin-top:-20px;});
				audio6_html5_container.css({
					'padding-top':'0px'
				});
			}****/






			var current_obj = {
				current_img_no:0,
				origID:0,
				is_very_first:true,
				total_images:0,
				gen_total_images:0,
				is_changeSrc:false,
				timeupdateInterval:'',
				totalTime:'',
				playlist_arr:'',
				playlist_images_arr:'',
				isCarouselScrolling:false,
				isHistoryGenerated:false,
				isStationTitleInsideScrolling:false,
				curTitle:'',
				prevTitle:'',
				cur_song_image:'',
				prev_song_image:'',
				curSongText:'',
				curSongAuthorText:'',
				stationTitleInsideWait:0,
				audioPlayerWidth:0,
				audioPlayerHeight:0,
				wrapperHeight:0,
				temp_showHistoryBut:true,
				historyButWidth:0,
				isRadiojar:false,

				historyInitialHeight:90,
				thumbsHolder_Thumb:$('<div class="thumbsHolder_ThumbOFF" rel="0"><div class="padding">test</div></div>'),
				thumbsHolder_ThumbHeight:0,
				thumbsHolder_Thumbs:'',

				constantDistance:0,
				titleWidth:0,
				radioStationTopPos:0,
				radioStationLeftPos:0,
				titleTopPos:0,
				titleLeftPos:0,
				lineSeparatorTopPos:0,
				lineSeparatorLeftPos:0,
				authorTopPos:0,
				authorLeftPos:0,
				minimizeTopPos:0,
				minimizeRightPos:0,
				isMinified:false,
				imageTopPos:0,
				imageLeftPos:0,
				frameBehindButtonsTopPos:0,
				frameBehindButtonsLeftPos:0,
				frameBehindTextTopPos:0,
				frameBehindTextLeftPos:0,
				playTopPos:0,
				playLeftPos:0,
				volumeTopPos:0,
				volumeRightPos:0,
				volumesliderTopPos:0,
				volumesliderLeftPos:0,
				showhidehistoryTopPos:0,
				showhideplaylistRightPos:0,
				smallButtonDistance:4,
				playVerticalPadding:10,
				playHorizontalPadding:16,
				facebookTopPos:0,
				facebookRightPos:0,
				twitterTopPos:0,
				twitterRightPos:0,


				origParentFloat:'',
				origParentPaddingTop:'',
				origParentPaddingRight:'',
				origParentPaddingBottom:'',
				origParentPaddingLeft:'',

				windowWidth:0,

				audioID:'',
				audioObj:'',//remove it
				radioReaderAjaxInterval:'',
				totalRadioStationsNo:0,
				ajaxReturnedRadioStationsNo:0,
				lastfm:'',

				isFlashNeeded:true,
				myFlashObject:'',
				rndNum:0,
				prevVolumeVal:1,



				//myregexp:/^http:\/\/(.*):(.*)\/|;$/,
				myregexp:/^(http|https):\/\/(.*):(.*)\/(.*)$/,
				myregexp_radiojar:/^(http|https):\/\/(.*)\/(.*)$/,
				http_or_https:'http',
				ip:'',
				port:'',
				mount_point:'',
				now_playing_current_k:1,        // we start with 1 here because it increments to 2, which is the call to status-json.xsl below
				now_playing_found:false,
				now_playing_arr_lenght:0,
				now_playing_arr:['stats?sid=1'/*shoutcast >= v2*/,'7.html'/*shoutcast < v2*/,'status-json.xsl'/*icecast >= v2.4.0*/,'status.xsl'/*icecast < v2.4.0*/],
				history_current_k:0,
				history_arr:['played.html'],

				the_artist_id:'',
				the_wikidata_id:'',
				musicbrainz_setTimeout:'',
				no_artist_image_setTimeout:'',
				the_artist_id_history_arr:[''],
				the_wikidata_id_history_arr:[''],
				musicbrainzHistory_setTimeout_arr:[''],
				wiki_photo_path:options.noImageAvailable
            };


			if (!options.preserveOriginalUpperLowerCase) {
							audio6_html5_TitleInside.css({
								'text-transform':'uppercase'
							});

							audio6_html5_Author.css({
								'text-transform':'capitalize'
							});
			}

			if (!options.sticky) {
				options.startMinified=false;
			}

			//if (options.nowPlayingInterval<30) {
			//	options.nowPlayingInterval=44;
			//}





			if (options.showOnlyPlayButton) {
					options.startMinified=false;

					options.showFacebookBut=false;
					options.showVolume=false;
					options.showTwitterBut=false;
					options.showRadioStation=false;
					options.showTitle=false;
					options.showHistoryBut=false;
					options.showHistory=false;
					options.playerWidth=audio6_html5_play_btn.width()+2*current_obj.playHorizontalPadding;
					options.historyPadding=0;
			}

			options.origWidth=options.playerWidth;

			current_obj.temp_showHistoryBut=options.showHistoryBut;


			/*// create a Cache object
			if (options.grabLastFmPhoto) {
				var cache = new LastFMCache();
				current_obj.lastfm = new LastFM({
					apiKey    : options.lastFMApiKey,
					apiSecret : options.lastFMSecret,
					cache     : cache
				});
			}*/

			current_obj.now_playing_arr_lenght=Object.keys(current_obj.now_playing_arr).length;

			current_obj.audioID=audio6_html5_Audio.attr('id');

			//chrome and safari on mac auto-play restrictions 2018 start
			//alert (navigator.vendor+'  ---  '+navigator.platform+'  ---  '+navigator.userAgent);
			if ((navigator.userAgent.indexOf("Opera")==-1 &&  navigator.userAgent.indexOf('OPR')) == -1  ) {  // is NOT Opera
						if (navigator.userAgent.indexOf("Chrome")!=-1 && navigator.vendor.indexOf('Google')!=-1 ) { //is chrome
								options.autoPlay=false;
								//alert ('is chrome');
						}
						if (navigator.userAgent.indexOf("Safari")!=-1 && navigator.vendor.indexOf('Apple')!=-1 && navigator.platform.indexOf('Win')==-1) { //is safari on mac
							options.autoPlay=false;
							//alert ('is safari');
						}
			}
			//chrome and safari on mac auto-play restrictions 2018 end

			current_obj.isFlashNeeded=it_supports_mp3(current_obj);
			if (ver_ie!=-1) {
				//if (ver_ie!=9) {
					current_obj.isFlashNeeded=true;
				//}
			}
			//alert (current_obj.isFlashNeeded);




			//audio6_html5_border.width(options.playerWidth+10);



			if (options.showFacebookBut) {
				  window.fbAsyncInit = function() {
					FB.init({
					  appId:options.facebookAppID,
					  version:'v3.2',
					  status:true,
					  cookie:true,
					  xfbml:true
					});
				  };

				  (function(d, s, id){
					 var js, fjs = d.getElementsByTagName(s)[0];
					 if (d.getElementById(id)) {return;}
					 js = d.createElement(s); js.id = id;
					 js.src = "//connect.facebook.com/en_US/sdk.js";
					 fjs.parentNode.insertBefore(js, fjs);
				   }(document, 'script', 'facebook-jssdk'));

					audio6_html5_facebook_btn.on( "click", function() {
						//alert (imageLink);
						/*FB.ui(
						  {
						   method: 'feed',
						   name: options.facebookShareTitle,
						   caption: options.radio_name,
						   description: options.facebookShareDescription,
						  //picture: options.facebookShareImage,
						   link: document.URL,
						   picture: options.facebookShareImage
						  },
						  function(response) {
							//if (response && response.post_id) {
							  //alert('Post was published.');
							//} else {
							  //alert('Post was not published.');
							//}
						  }
						);*/
						FB.ui({
							method: 'share_open_graph',
							//method: 'share',
							action_type: 'og.likes',
							//action_type: 'og.shares',
							action_properties: JSON.stringify({
								object: {
									'og:url': document.URL,
									'og:title': options.facebookShareTitle,
									'og:description': options.facebookShareDescription,
									'og:image': options.facebookShareImage
								}
							})
						},
						function (response) {
							// Action after response
						});
					});
			}



			if (options.showTwitterBut) {
					audio6_html5_twitter_btn.on( "click", function() {
						var myURL = "http://www.google.com";
						window.open("https://twitter.com/intent/tweet?url=" + document.URL+ "&text="+options.radio_name,"Twitter","status = 1, left = 430, top = 270, height = 550, width = 420, resizable = 0");
					});
			}




			arrangePlayerElements('block',current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle,audio6_html5_frameBehindText,audio6_html5_songAuthorLineSeparator,audio6_html5_frameBehindButtons,audio6_html5_minimize_btn,audio6_html5_showHidePlaylist_btn,audio6_html5_volumeSlider,audio6_html5_volumeMute_btn,audio6_html5_twitter_btn,audio6_html5_facebook_btn);


			// set player height
			current_obj.audioPlayerHeight=audio6_html5_ximage.height()+audio6_html5_frameBehindText.height()+audio6_html5_frameBehindButtons.height();
			if (options.showOnlyPlayButton) {
				current_obj.audioPlayerHeight=audio6_html5_play_btn.height()+2*current_obj.playVerticalPadding;
			}
			audio6_html5_container.height(current_obj.audioPlayerHeight);

			if (options.startMinified || options.showOnlyPlayButton) {
				current_obj.historyInitialHeight=0;
			}

			current_obj.wrapperHeight=current_obj.audioPlayerHeight+current_obj.historyInitialHeight+options.historyTopPos;   //90 the history list height (before generating it)
			if (!options.showHistory || !options.showHistoryOnInit) {
				current_obj.wrapperHeight=current_obj.audioPlayerHeight;
			}
			audio6_html5_the_wrapper.css({
				  'border':options.playerBorderSize+'px solid '+options.playerBorderColor,
				  'width':audio6_html5_container.width()+'px',
				  'height':current_obj.wrapperHeight+'px'
			});

			//center plugin
			if (options.centerPlayer) {
				audio6_html5_the_wrapper.css({
					"margin":"0 auto"
				});
			}












			/*audio6_html5_frameBehindText.css({
				'top':current_obj.frameBehindButtonsTopPos+audio6_html5_frameBehindButtons.height()+'px',
				'left':0+'px',
				'height':parseInt(audio6_html5_container.height()/2,10)+audio6_html5_frameBehindButtons.height()+'px'
			});			*/



			//generate playlist
			var currentCarouselTop=0;
			var audio6_html5_thumbsHolderWrapper = $('.thumbsHolderWrapper', audio6_html5_container);
			var audio6_html5_historyPadding = $('.historyPadding', audio6_html5_container);
			var audio6_html5_thumbsHolderVisibleWrapper = $('.thumbsHolderVisibleWrapper', audio6_html5_container);
			var audio6_html5_thumbsHolder = $('.thumbsHolder', audio6_html5_container);
			current_obj.audio6_html5_sliderVertical = $('.slider-vertical', audio6_html5_container);




			audio6_html5_historyPadding.css({'padding':options.historyPadding+'px'});
			audio6_html5_thumbsHolderVisibleWrapper.append('<div class="readingData">'+options.translateReadingData+'</div>');


			audio6_html5_historyTitle.width(options.playerWidth-2*options.historyPadding);
			audio6_html5_historyTitle.html(options.historyTranslate);
			audio6_html5_historyTitle.css({
				'color':options.historyTitleColor
			});


			if (!options.showHistory) {
				//audio6_html5_thumbsHolderWrapper.css({'display':'none'});
				audio6_html5_thumbsHolderWrapper.css({'opacity':0});
			}

			if (!options.showHistoryOnInit) {
				audio6_html5_thumbsHolderWrapper.css({
					    'opacity': 0,
						'margin-top':'-20px'/*,
						'display':'none'*/
				});

			}







			audio6_html5_thumbsHolderWrapper.css({
				'width':audio6_html5_container.width()+'px',
				'top':current_obj.audioPlayerHeight+options.historyTopPos+'px',
				'left':'0px',
				'background':options.historyBgColor
			});

			audio6_html5_thumbsHolderVisibleWrapper.width(audio6_html5_container.width());




			if (options.sticky) {
				audio6_html5_the_wrapper.addClass('audio6_html5_sticky_div');

				audio6_html5_minimize_btn.on( "click", function() {
					//alert (current_obj.audioPlayerHeight);
						var animation_duration=500;
						var aux_display;
						var aux_height;
						if (!current_obj.isMinified) {
							current_obj.isMinified=true;
							audio6_html5_minimize_btn.addClass('AudioOpenBut');
							aux_display='none';
							current_obj.audioPlayerHeight=audio6_html5_frameBehindText.height()+audio6_html5_frameBehindButtons.height();
							aux_height=current_obj.audioPlayerHeight;
							current_obj.temp_showHistoryBut=false;
						} else {
							current_obj.isMinified=false;
							audio6_html5_minimize_btn.removeClass('AudioOpenBut');
							aux_display='block';
							current_obj.temp_showHistoryBut=options.showHistoryBut;
							current_obj.audioPlayerHeight=(parseInt(options.imageHeight*(options.playerWidth/options.origWidth),10))+audio6_html5_frameBehindText.height()+audio6_html5_frameBehindButtons.height();
							if (audio6_html5_thumbsHolderWrapper.css('margin-top').substring(0, audio6_html5_thumbsHolderWrapper.css('margin-top').length-2) < 0) {
								aux_height=current_obj.audioPlayerHeight;
							} else {
								//aux_height=current_obj.audioPlayerHeight+audio6_html5_ximage.height()+audio6_html5_thumbsHolderWrapper.height()+options.historyTopPos;
								aux_height=current_obj.audioPlayerHeight+audio6_html5_thumbsHolderWrapper.height()+options.historyTopPos;
							}
						}
						//alert (aux_height+'  --  '+audio6_html5_thumbsHolderWrapper.height()+'  --  '+current_obj.audioPlayerHeight);

						//audio6_html5_showHidePlaylist_btn.click();

						arrangePlayerElements(aux_display,current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle,audio6_html5_frameBehindText,audio6_html5_songAuthorLineSeparator,audio6_html5_frameBehindButtons,audio6_html5_minimize_btn,audio6_html5_showHidePlaylist_btn,audio6_html5_volumeSlider,audio6_html5_volumeMute_btn,audio6_html5_twitter_btn,audio6_html5_facebook_btn);



						audio6_html5_ximage.css({
								'display':aux_display
						});
/*

						audio6_html5_thumbsHolderWrapper.css({
								'display':aux_display
						});	*/

						/*if (current_obj.gen_total_images>options.numberOfThumbsPerScreen) {
							current_obj.audio6_html5_sliderVertical.css({
								'display':aux_display
							});
						}*/

						if (options.startMinified) {
							animation_duration=0;
							options.startMinified=false;
						} else {
							animation_duration=500;
						}

						audio6_html5_thumbsHolderWrapper.css({
							'display':aux_display,
							'top':current_obj.audioPlayerHeight+options.historyTopPos+'px'
						});
						if (current_obj.gen_total_images>options.numberOfThumbsPerScreen) {
							current_obj.audio6_html5_sliderVertical.css({
								'display':aux_display,
								'top':current_obj.audioPlayerHeight+options.historyTopPos+2*options.historyPadding+2+audio6_html5_historyTitle.height()+'px'
							});
						}

						/*audio6_html5_the_wrapper.css({
								'border':'1px solid #FF0000'
						});*/

						audio6_html5_the_wrapper.animate({
							'height': aux_height
						}, animation_duration, 'easeOutQuad', function() {
							// Animation complete.
						});
				});

			}






			//start initialize volume slider
			audio6_html5_volumeSlider.slider({
				value: options.initialVolume,
				step: 0.05,
				orientation: "horizontal",
				range: "min",
				max: 1,
				animate: true,
				slide:function(e,ui){
						//document.getElementById(current_obj.audioID).muted=false;
						options.initialVolume=ui.value;
						if (!current_obj.isFlashNeeded) {
							document.getElementById(current_obj.audioID).volume=ui.value;
						} else {
							current_obj.myFlashObject.myAS3function(detectBrowserAndAudio(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container),options.initialVolume);
						}
				},
				stop:function(e,ui){

				}
			});
			document.getElementById(current_obj.audioID).volume=options.initialVolume;
			audio6_html5_volumeSlider.css({'background':options.volumeOffColor});
			$(".ui-slider-range",audio6_html5_volumeSlider).css({'background':options.volumeOnColor});
			//end initialize volume slider



			//buttons start
			audio6_html5_play_btn.on( "click", function() {
					var is_paused;
					if (current_obj.isFlashNeeded) {
						is_paused=!audio6_html5_play_btn.hasClass('AudioPause');
					} else {
						is_paused=document.getElementById(current_obj.audioID).paused;
					}
					cancelAll();
					if (is_paused == false) {
						if (!current_obj.isFlashNeeded) {
							document.getElementById(current_obj.audioID).pause();
						} else {
							current_obj.myFlashObject.myAS3function("_pause_radio_stream_",options.initialVolume);
						}
						audio6_html5_play_btn.removeClass('AudioPause');
					} else {
						if (!current_obj.isFlashNeeded) {
							//v 1.5.0
							document.getElementById(current_obj.audioID).src=detectBrowserAndAudio(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container);
							document.getElementById(current_obj.audioID).load();
							//v 1.5.0
							document.getElementById(current_obj.audioID).play();
							//alert ("play");
						} else {
							current_obj.myFlashObject.myAS3function("_play_radio_stream_",options.initialVolume);
						}
						audio6_html5_play_btn.addClass('AudioPause');
					}
					//alert (document.getElementById(current_obj.audioID).paused);
			});





			audio6_html5_showHidePlaylist_btn.on( "click", function() {
				if (audio6_html5_thumbsHolderWrapper.css('margin-top').substring(0, audio6_html5_thumbsHolderWrapper.css('margin-top').length-2) < 0) {
					aux_opacity=1;
					aux_display='block';
					aux_margin_top="0px";
					aux_height=current_obj.audioPlayerHeight+audio6_html5_thumbsHolderWrapper.height()+options.historyTopPos;
					audio6_html5_thumbsHolderWrapper.css({
						'display':aux_display
					});
					if (current_obj.gen_total_images>options.numberOfThumbsPerScreen)
						current_obj.audio6_html5_sliderVertical.css({
							'opacity': 1,
							'display':'block'
						});


				} else {
					aux_opacity=0;
					aux_display='none';
					aux_margin_top="-20px";
					if (current_obj.gen_total_images>options.numberOfThumbsPerScreen)
						current_obj.audio6_html5_sliderVertical.css({
							'opacity': 0,
							'display':'none'
						});
					aux_height=current_obj.audioPlayerHeight;
				}

				audio6_html5_thumbsHolderWrapper.css({
						'z-index':-1
				});

				//alert (audio6_html5_thumbsHolderWrapper.css("z-index"));
				audio6_html5_thumbsHolderWrapper.animate({
					    'opacity': aux_opacity,
						'margin-top':aux_margin_top

					  }, 500, 'easeOutQuad', function() {
					    // Animation complete.
						audio6_html5_thumbsHolderWrapper.css({
							'display':aux_display,
							'z-index':'auto',
						});
					});


				audio6_html5_the_wrapper.animate({
					    'height': aux_height
					  }, 500, 'easeOutQuad', function() {
					    // Animation complete.
					});

				//audio6_html5_frameBehindText.fadeToggle( "fast", function() {
					//complete
			    //});


			});

			audio6_html5_volumeMute_btn.on( "click", function() {
				if (!document.getElementById(current_obj.audioID).muted) {
					document.getElementById(current_obj.audioID).muted=true;
					audio6_html5_volumeMute_btn.addClass('VolumeButtonMuted');
					if (current_obj.isFlashNeeded) {
						current_obj.prevVolumeVal=options.initialVolume;
						options.initialVolume=0;
						current_obj.myFlashObject.myAS3function(detectBrowserAndAudio(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container),options.initialVolume);
					}
				} else {
					document.getElementById(current_obj.audioID).muted=false;
					audio6_html5_volumeMute_btn.removeClass('VolumeButtonMuted');
					if (current_obj.isFlashNeeded) {
						options.initialVolume=current_obj.prevVolumeVal;
						current_obj.myFlashObject.myAS3function(detectBrowserAndAudio(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container),options.initialVolume);
					}
				}
			});



			//buttons end




			//audio6_html5_thumbsHolder.swipe( {
			audio6_html5_thumbsHolderWrapper.swipe( {
				swipeStatus:function(event, phase, direction, distance, duration, fingerCount)
				{
					/*event.stopImmediatePropagation();
					//alert (event);
					$(this).swipe('option', 'allowPageScroll', 'none');*/




					//$('#logulmeu').html("phase: "+phase+"<br>direction: "+direction+"<br>distance: "+distance);
					if (direction=='up' || direction=='down') {
						if (distance!=0) {

								/*$('html').css({
									'overflow':'hidden',
									'height':'100%'
								});
								$('body').css({
									'overflow':'hidden',
									'height':'100%'
								});*/

							  currentScrollVal=current_obj.audio6_html5_sliderVertical.slider( "value");
							  if (direction=="up") {
									currentScrollVal = currentScrollVal - 1.5;
							  } else {
									currentScrollVal = currentScrollVal + 1.5;
							  }
							  current_obj.audio6_html5_sliderVertical.slider( "value", currentScrollVal);
								//page scroll enabled
								$('html, body')
				            // Needed to remove previously bound handlers
				            .off('touchstart touchmove')
				            .on('touchstart touchmove', function (e) {
				                e.preventDefault();
				            });
								//page scroll enabled
							  carouselScroll(currentScrollVal,current_obj,options,audio6_html5_thumbsHolder);
						}
					}

				  //Here we can check the:
				  //phase : 'start', 'move', 'end', 'cancel'
				  //direction : 'left', 'right', 'up', 'down'
				  //distance : Distance finger is from initial touch point in px
				  //duration : Length of swipe in MS
				  //fingerCount : the number of fingers used

            //$('this').swipe('option', 'preventDefaultEvents', preventDefaultEvents);
				  },

				  threshold:100,
				  maxTimeThreshold:500,
				  fingers:'all',
          allowPageScroll:'none',
					preventDefaultEvents:false


			});








			//initialize first Audio
			if (current_obj.isFlashNeeded) {
					//flash fallback
					current_obj.rndNum=parseInt(Math.random() * (999999 - 1000) + 1000);
					audio6_html5_container.append("<div id='swfHolder"+current_obj.rndNum+"'></div>");
					var fn = function() {
						var att = { data:options.pathToAjaxFiles+"flash_player.swf", width:"0", height:"0" };
						var par = { flashvars:"streamUrl="+options.radio_stream+"&autoPlay="+options.autoPlay+"&initialVolume="+options.initialVolume };
						var id = "swfHolder"+current_obj.rndNum;
						current_obj.myFlashObject = swfobject.createSWF(att, par, id);
						//alert (current_obj.rndNum+'  --  '+current_obj.myFlashObject);
					};
					swfobject.addDomLoadEvent(fn);
					//flash fallback
					if (options.autoPlay) {
							audio6_html5_play_btn.addClass('AudioPause');
					}
			}

			changeSrc(current_obj,options,audio6_html5_thumbsHolder,audio6_html5_container,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_thumbsHolderWrapper,audio6_html5_historyPadding,audio6_html5_the_wrapper,audio6_html5_historyTitle,audio6_html5_minimize_btn);
			if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
					audio6_html5_play_btn.removeClass('AudioPause');
			}






			var doResize = function() {
				  if (current_obj.origParentFloat=='') {
					  current_obj.origParentFloat=audio6_html5_container.parent().css('float');
					  current_obj.origParentPaddingTop=audio6_html5_container.parent().css('padding-top');
					  current_obj.origParentPaddingRight=audio6_html5_container.parent().css('padding-right');
					  current_obj.origParentPaddingBottom=audio6_html5_container.parent().css('padding-bottom');
					  current_obj.origParentPaddingLeft=audio6_html5_container.parent().css('padding-left');
				  }

				  //alert (options.playerWidth+'  !=    '+options.origWidth +'   ||   '+options.playerWidth+'   >    '+$(window).width());

				  if (options.playerWidth!=options.origWidth || options.playerWidth>$(window).width()) {
						  audio6_html5_container.parent().css({
							  'float':'none',
							  'padding-top':0,
							  'padding-right':0,
							  'padding-bottom':0,
							  'padding-left':0
						  });
				  } else {
					  audio6_html5_container.parent().css({
						  'float':current_obj.origParentFloat,
						  'padding-top':current_obj.origParentPaddingTop,
						  'padding-right':current_obj.origParentPaddingRight,
						  'padding-bottom':current_obj.origParentPaddingBottom,
						  'padding-left':current_obj.origParentPaddingLeft
					  });
				  }
				/*audio6_html5_container.parent().css({
						  'float':'none'
					  });*/

				  var responsiveWidth=audio6_html5_container.parent().parent().width();

				  //var responsiveHeight=audio6_html5_container.parent().height();



				  /*if (options.responsiveRelativeToBrowser) {
					  responsiveWidth=$(window).width();
					  responsiveHeight=$(window).height();
				  }*/





					if (audio6_html5_container.width()!=responsiveWidth) {
						//alert (audio6_html5_container.width()+"!="+responsiveWidth);
						  if (options.origWidth>responsiveWidth) {
							  options.playerWidth=responsiveWidth;
						  } else {
							  options.playerWidth=options.origWidth;
						  }
						  //alert (options.playerWidth);

 						  //alert(audio6_html5_container.width()+' -- '+responsiveWidth+' -- '+options.playerWidth);
						  if (audio6_html5_container.width()!=options.playerWidth) {

							  	arrangePlayerElements('block',current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle,audio6_html5_frameBehindText,audio6_html5_songAuthorLineSeparator,audio6_html5_frameBehindButtons,audio6_html5_minimize_btn,audio6_html5_showHidePlaylist_btn,audio6_html5_volumeSlider,audio6_html5_volumeMute_btn,audio6_html5_twitter_btn,audio6_html5_facebook_btn);

								// set player height
								/*current_obj.audioPlayerHeight=audio6_html5_ximage.height()+audio6_html5_frameBehindText.height()+audio6_html5_frameBehindButtons.height();
								audio6_html5_container.height(current_obj.audioPlayerHeight);

								current_obj.wrapperHeight=current_obj.audioPlayerHeight+90+options.historyTopPos;   //90 the history list height (before generating it)
								if (!options.showHistory || !options.showHistoryOnInit) {
									current_obj.wrapperHeight=current_obj.audioPlayerHeight;
								}
								audio6_html5_the_wrapper.css({
									  'border':'1px solid #FF0000',
									  'width':audio6_html5_container.width()+'px',
									  'height':current_obj.wrapperHeight+'px'
								});*/


								// set player height
								current_obj.audioPlayerHeight=audio6_html5_ximage.height()+audio6_html5_frameBehindText.height()+audio6_html5_frameBehindButtons.height();
								//current_obj.audioPlayerHeight=(parseInt(options.imageHeight*(options.playerWidth/options.origWidth),10))+audio6_html5_frameBehindText.height()+audio6_html5_frameBehindButtons.height();
								if (current_obj.isMinified) {
										current_obj.audioPlayerHeight=audio6_html5_frameBehindText.height()+audio6_html5_frameBehindButtons.height();
								}
								audio6_html5_container.height(current_obj.audioPlayerHeight);


								current_obj.wrapperHeight=current_obj.audioPlayerHeight+audio6_html5_thumbsHolderWrapper.height()+options.historyTopPos;
//(audio6_html5_thumbsHolderWrapper.css('margin-top').substring(0, audio6_html5_thumbsHolderWrapper.css('margin-top').length-2) < 0)
								if (!options.showHistory || !options.showHistoryOnInit || current_obj.isMinified || (audio6_html5_thumbsHolderWrapper.css('margin-top').substring(0, audio6_html5_thumbsHolderWrapper.css('margin-top').length-2) < 0)) {
									current_obj.wrapperHeight=current_obj.audioPlayerHeight;
								}

								audio6_html5_the_wrapper.css({
									  /*'border':'1px solid #FF0000',*/
									  'width':audio6_html5_container.width()+'px',
									  'height':current_obj.wrapperHeight+'px'
								});


								//history position
								audio6_html5_historyTitle.width(options.playerWidth-2*options.historyPadding);

								audio6_html5_thumbsHolderWrapper.css({
									'width':audio6_html5_container.width()+'px',
									'top':current_obj.audioPlayerHeight+options.historyTopPos+'px'
								});
								audio6_html5_thumbsHolderVisibleWrapper.width(audio6_html5_container.width());

								generateHistory(current_obj,options,audio6_html5_container,audio6_html5_thumbsHolder,audio6_html5_thumbsHolderWrapper,audio6_html5_thumbsHolderVisibleWrapper,audio6_html5_historyPadding,audio6_html5_play_btn,audio6_html5_Author,audio6_html5_Title,audio6_html5_TitleInside,audio6_html5_radioStation,audio6_html5_Audio,audio6_html5_ximage,audio6_html5_the_wrapper,audio6_html5_historyTitle);


						  }

						  if (options.playerWidth<$(window).width()) {
							  audio6_html5_container.parent().css({
								  'float':current_obj.origParentFloat,
								  'padding-top':current_obj.origParentPaddingTop,
								  'padding-right':current_obj.origParentPaddingRight,
								  'padding-bottom':current_obj.origParentPaddingBottom,
								  'padding-left':current_obj.origParentPaddingLeft
							  });
						  }


				  }

			};

			var TO = false;
			$(window).on( "resize", function() {
				doResizeNow=true;

				if (ver_ie!=-1 && ver_ie==9 && current_obj.windowWidth==0)
					doResizeNow=false;


				if (current_obj.windowWidth==$(window).width()) {
					doResizeNow=false;
					if (options.windowCurOrientation!=window.orientation && navigator.userAgent.indexOf('Android') != -1) {
						options.windowCurOrientation=window.orientation;
						doResizeNow=true;
					}
				} else {
					/*if (current_obj.windowWidth===0 && (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1))
						doResizeNow=false;*/
					current_obj.windowWidth=$(window).width();
				}

				if (options.responsive && doResizeNow) {
					 if(TO !== false)
						clearTimeout(TO);


					 TO = setTimeout(function(){ doResize() }, 300); //300 is time in miliseconds
				}
			});



			if (options.responsive) {
				doResize();
			}

		    $.fn.jqHandleNowPlaying = function (broadcastingStream) {
                handleNowPlayingEvent(broadcastingStream, current_obj, options, audio6_html5_thumbsHolder, audio6_html5_thumbsHolderWrapper, audio6_html5_thumbsHolderVisibleWrapper, audio6_html5_historyPadding, audio6_html5_historyTitle, audio6_html5_container,  audio6_html5_the_wrapper, audio6_html5_play_btn, audio6_html5_Author, audio6_html5_Title, audio6_html5_TitleInside, audio6_html5_radioStation, audio6_html5_Audio, audio6_html5_ximage);
		    };


		});
	};


	//
	// plugin customization variables
	//
	$.fn.audio6_html5.defaults = {
			radio_stream:'http://194.232.200.150:80/;',
			radio_name:'Idobi Anthm',
		    playerWidth:335,
			imageHeight:335,
			skin: 'whiteControllers',
			initialVolume:1,//removed
			autoPlay:true,
			loop:true,//removed
			playerBg: '#000000',//removed
			volumeOffColor: '#454545',//removed
			volumeOnColor: '#ffffff',//removed
			timerColor: '#ffffff',//removed
			songTitleColor: '#ffffff',
			authorTitleColor: '#ffffff',
			lineSeparatorColor: '#636363',
			radioStationColor: '#ffffff',


			frameBehindTextColor: '#000000',
			frameBehindButtonsColor: '#454545',
			playerBorderSize: 0,
			playerBorderColor: '#000000',

			sticky:false,
			startMinified:false, 	// used only when sticky:true
			showOnlyPlayButton:false,
			centerPlayer:false,


			//imageBorderWidth:4,
			//imageBorderColor:'#000000',

			showFacebookBut:true,
			facebookAppID:'',
			facebookShareTitle:'HTML5 Radio Player With History - Shoutcast and Icecast',
			facebookShareDescription:'A top-notch responsive HTML5 Radio Player compatible with all major browsers and mobile devices.',
			facebookShareImage:'', //at least 200px x 200px
			showVolume:true,
			showTwitterBut:true,
			showRadioStation:true,
			showTitle:true,
			showHistoryBut:true,
			showHistory:true,
			showHistoryOnInit:true,





			//translateRadioStation:"Radio Station: ",   //remmoved
			translateReadingData:"reading history...",
			historyTranslate:"HISTORY - latest played songs",
			historyTitleColor:'#858585',

			historyTopPos:0,  //remmoved
			historyBgColor:'#ebebeb',
			historyRecordBgColor:'transparent',
			//playlistRecordBgOnColor:'#00000',
			historyRecordBottomBorderColor:'transparent',
			//playlistRecordBottomBorderOnColor:'#4d4d4d',
			historyRecordSongColor:'#000000',
			historyRecordSongBottomBorderColor:'#d0d0d0',
			historyRecordAuthorColor:'#6d6d6d',
			//playlistRecordTextOnColor:'#00b4f9',


			numberOfThumbsPerScreen:3,
			historyPadding:16,
			preserveOriginalUpperLowerCase:false,





			responsive:true,

			historyRecordTitleLimit:25 , // for 380 width
			historyRecordAuthorLimit:36, // for 380 width

			nowPlayingInterval:5,
			grabLastFmPhoto:true,

			pathToAjaxFiles:'',
			noImageAvailable:'noimageavailable.jpg',

			lastFMApiKey:'',
			lastFMSecret:'',



			origWidth:0,
			isSliderInitialized:false,
			isProgressInitialized:false,
			isPlaylistSliderInitialized:false

	};

})(jQuery);
