"use strict"

function nbSecurityApp(){
	this.assetObj;
	this.db;
}

nbSecurityApp.prototype = {
	//restore constructor
	constructor: nbSecurityApp,
	
	init: function(){		
		//Creates DB Table
		this._db.trans('create', {tableName: 'Pref', cols: ['Guid', 'Asset']});
		
		//Flipswitch listener
		$(document).ready(function(){ // wait for DOM to load
			var flipswitchState = document.getElementById('flip-switch-state1');
					
			$('#flip-switch1').click(function(){
				if(flipswitchState.value == 0){
					$(this).children().addClass('ui-flipswitch-active');
					document.getElementById('deviceSecurity').checked = true;
					flipswitchState.value = 1;
				}else{
					$(this).children().removeClass('ui-flipswitch-active');
					document.getElementById('deviceSecurity').checked = false;
					flipswitchState.value = 0;
				}
			});
		});
		
		//Returns alarm state (On or Off)
		return this._ajax('GET', 'http://mattmcalear.net/customFiles/NB/nbSecurityApp.php', 'getData=alarmState');
	},
	
	arm: function(){
		var that = this;
		
		//Will invoke 5 times to make sure all assets have been triggered
		var count = 0;
		var intervalID = window.setInterval(function(){
			var r = that._ajax('GET', 'http://mattmcalear.net/customFiles/NB/nbSecurityApp.php', 'setState=arm');
			document.getElementById('arm').className = "ui-btn ui-corner-all ui-btn-active";
			document.getElementById('disarm').className = "ui-btn ui-corner-all";
			
			if(r != 1){ console.log(r); }
			
			count++;
			
			if(count == 5){ clearInterval(intervalID); }
		}, 500);
	},
	
	disarm: function(){
		var that = this;
			
		//Will invoke 5 times to make sure all assets have been triggered
		var count = 0;
		var intervalID = window.setInterval(function(){
			var r = that._ajax('GET', 'http://mattmcalear.net/customFiles/NB/nbSecurityApp.php', 'setState=disarm');
			document.getElementById('disarm').className = "ui-btn ui-corner-all ui-btn-active";
			document.getElementById('arm').className = "ui-btn ui-corner-all";
			
			if(r != 1){ console.log(r); }
			
			count++;
			
			if(count == 5){ clearInterval(intervalID); }
		}, 500);
	},
	
	getAssets: function(){
		return this._ajax('GET', 'http://mattmcalear.net/customFiles/NB/nbSecurityApp.php', 'getAssets=true');		
	},
			
	//Private Methods
	_ajax: function(method, location, queryString){		
		var that = this;
	    $.ajax({
	    	 //async: false,
	         url: location,
	         method: 'post',
	         dataType: 'jsonp',
	         contentType: "application/json; charset=utf-8",
	         data: queryString,
	         success:function(json){
	         	//console.log(json);
	         	that._hideLoader();
	         	
	         	if(json == 1){
	         		//Great success!!
	         	}else if(json == 'armed'){
	            	document.getElementById('arm').className += " ui-btn-active";
	            }else if(json == 'disarmed'){
		            document.getElementById('disarm').className += " ui-btn-active";
	            }else{
		            that.assetObj = json;
		            
		            that._setAssets();
	            }
	            
	            /*else if(json.substr(0, 25) == '<ul data-role="listview">'){
		            document.getElementById('nbAssetDisplay').innerHTML = json;
		            //Repaints CSS
		            //$( "div[data-role=page]" ).page( "destroy" ).page();
	            }else if(json.substr(0, 34) == '<ul data-role="listview" id="sub">'){
		            document.getElementById('nbSubAssetDisplay').innerHTML = json;
		            //Repaints CSS
		            //$( "div[data-role=page]" ).page( "destroy" ).page();
	            }*/
	            
	            return json;	            
	         },
	         error:function(XHR, textStatus, errorThrown){	         	
	         	//console.log(new Array(XHR, textStatus, errorThrown));
	         	return textStatus;
	         }
	    });	    
	},
		
	_hideLoader: function(){
		/*
			Need to call seperate id's 
			as they seem to be trying to 
			access the element on the other 
			page and will not remove the proper id
		*/
		if(document.getElementById('ajaxLoader'))
			document.getElementById('ajaxLoader').innerHTML = '';
		if(document.getElementById('ajaxLoader2'))
			document.getElementById('ajaxLoader2').innerHTML = '';
	},
	
	_getUrlVars: function(){
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			vars[key] = value;
		});
		return vars;
	},
	
	_isEmpty: function(obj){
	    // null and undefined are "empty"
	    if (obj == null) return true;
	
	    // Assume if it has a length property with a non-zero value
	    // that that property is correct.
	    if (obj.length > 0)    return false;
	    if (obj.length === 0)  return true;
	
	    // Otherwise, does it have any properties of its own?
	    // Note that this doesn't handle
	    // toString and valueOf enumeration bugs in IE < 9
	    for (var key in obj) {
	        if (hasOwnProperty.call(obj, key)) return false;
	    }
	
	    return true;
	},
	
	_setImage: function(asset, id){
		switch(asset.toLowerCase()){
			// DEVICES IMAGES
			case 'generic state device':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/state.jpg" width="320px" height="210px" />';
				break;
			case 'temperature':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/temperature.jpg" width="320px" height="210px" />';
				break;
			case 'humidity':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/temperature.jpg" width="320px" height="210px" />';
				break;
			case 'raspberry pi outgoing network activity':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/picrust.png" width="320px" height="210px" />';
				break;
			case 'raspberry pi incoming network activity':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/picrust.png" width="320px" height="210px" />';
				break;
			case 'raspberry pi ram usage':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/picrust.png" width="320px" height="210px" />';
				break;
			case 'raspberry pi cpu temperature':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/picrust.png" width="320px" height="210px" />';
				break;
			case 'raspberry pi cpu usage':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/picrust.png" width="320px" height="210px" />';
				break;
			case 'status light':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/ninjablock.jpg" width="320px" height="210px" />';
				break;
			case 'on board rgb led':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/ninjablock.jpg" width="320px" height="210px" />';
				break;
			case "nina's eyes":
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/ninjablock.jpg" width="320px" height="210px" />';
				break;
			case 'rf 433mhz':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/rf433k.jpg" width="320px" height="210px" />';
				break;
			case 'sms':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/sms.jpeg" width="320px" height="210px" />';
				break;
			case 'twitter':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/twitter.png" width="320px" height="210px" />';
				break;
			case 'webhook':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/webhooks.jpg" width="320px" height="210px" />';
				break;
			case 'facebook':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/facebook.png" width="320px" height="210px" />';
				break;
			case 'google':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/google.png" width="320px" height="210px" />';
				break;
			case 'email':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/email-icon.jpg" width="320px" height="210px" />';
				break;
			case 'dropbox':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/dropbox.jpeg" width="320px" height="210px" />';
				break;
			case 'alarm button':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/push_button.jpg" width="320px" height="210px" />';
				break;
			case 'front door sensor':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/contact_sensor.jpg" width="320px" height="210px" />';
				break;
			case 'main hallway motion':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/pir_motion_sensor.jpg" width="320px" height="210px" />';
				break;
			case 'side door camera on':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/camera.png" width="320px" height="210px" />';
				break;
			case 'side door camera off':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/camera.png" width="320px" height="210px" />';
				break;
			case 'fan upstairs on':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/fan.jpg" width="320px" height="210px" />';
				break;
			case 'fan upstairs off':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/fan.jpg" width="320px" height="210px" />';
				break;
			case 'living room camera on':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/camera.png" width="320px" height="210px" />';
				break;
			case 'living room camera off':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/camera.png" width="320px" height="210px" />';
				break;
			case 'alarm button click':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/push_button.jpg" width="320px" height="210px" />';
				break;
			case 'side door sensor':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/contact_sensor.jpg" width="320px" height="210px" />';
				break;
			// RULES IMAGES
			case 'rule':
				document.getElementById(id).innerHTML = '<img src="img/nbDevices/ninjablock.jpg" width="320px" height="210px" />';
				break;
		}
	},
	
	_setAssets: function(){
		var html = '<ul data-role="listview">';
		
		for (var key in this.assetObj) {
	  		if(key == 'devices'){
		  		html += '<li data-role="list-divider"><a>Devices</a></li>';
		  		for (var key2 in this.assetObj[key]) {
					var obj2 = this.assetObj[key][key2];
					for (var prop2 in obj2) {
					  	if(obj2.hasOwnProperty(prop2)){
					  		if(prop2 == 'default_name'){
						  		html += '<li><a href="#deviceView" onclick="nbSecurityApp._setAssetData(\''+key2+'\',\''+key+'\')" data-transition="slide">'+obj2[prop2]+'</a></li>';
					  		}
						}
					}
				}
	  		}else if(key == 'rules'){
		  		html += '<li data-role="list-divider"><a>Rules</a></li>';
		  		for (var key2 in this.assetObj[key]) {
					var obj2 = this.assetObj[key][key2];
					for (var prop2 in obj2) {
					  	if(obj2.hasOwnProperty(prop2)){
					  		if(prop2 == 'shortName'){
						  		html += '<li><a href="#ruleView" onclick="nbSecurityApp._setAssetData(\''+key2+'\',\''+key+'\')" data-transition="slide">'+obj2[prop2]+'</a></li>';
					  		}
						}
					}
				}
	  		}
		}
		
		html += '</ul>';
		
		document.getElementById('nbAssetDisplay').innerHTML = html;
	},
	
	_setAssetData: function(guid, asset){
		if(asset == 'devices'){
			var guid = guid;
			var type = this.assetObj[asset][guid].device_type;
			var name = this.assetObj[asset][guid].default_name;
			var data = this.assetObj[asset][guid].last_data.DA;
			var sensor = this.assetObj[asset][guid].is_sensor;
			var actuator = this.assetObj[asset][guid].is_actuator;
			var timestamp = this.assetObj[asset][guid].last_data.timestamp;
			var subDevice = (this._isEmpty(this.assetObj[asset][guid].subDevices) ? 0 : 1);
			
			document.getElementById('guid').innerHTML = guid.replace(/%20/g, ' ');
			document.getElementById('type').innerHTML = type.replace(/%20/g, ' ');
			document.getElementById('name').innerHTML = name.replace(/%20/g, ' ');
			document.getElementById('sensor').innerHTML = (sensor == 1 ? 'YES' : 'NO');
			document.getElementById('actuator').innerHTML = (actuator == 1 ? 'YES' : 'NO');
			document.getElementById('data').innerHTML = data;
			var date = new Date(timestamp*1000);
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			var formattedTime = hours + ':' + minutes + ':' + seconds;
			document.getElementById('timestamp').innerHTML = formattedTime;
			document.getElementById('subDevice').innerHTML = (subDevice == 1 ? '<a href="#subAssetList" onclick="nbSecurityApp._setSubAssets(\''+guid+'\',\''+asset+'\');">YES</a>' : 'NO');
			
			//Set image
			this._setImage(name.replace(/%20/g, ' '), 'image');
			
			//Set Preferences
			this._setPref('select_device', guid);
			
			//Set save values
			var btn = document.getElementById('deviceSave');
			btn.setAttribute('onclick', 'nbSecurityApp._savePref(\''+guid+'\', \'device\')');
		}else if(asset == 'rules'){
			var rid = this.assetObj[asset][guid].rid;
			var shortName = this.assetObj[asset][guid].shortName;
			var suspended = this.assetObj[asset][guid].suspended;
			var timeout = this.assetObj[asset][guid].timeout;
			
			document.getElementById('rid').innerHTML = rid;
			document.getElementById('shortName').innerHTML = shortName.replace(/%20/g, ' ');
			document.getElementById('suspended').innerHTML = suspended;
			document.getElementById('timeout').innerHTML = timeout;
			
			//Set image
			this._setImage('rule', 'image2');
			
			//Set Preferences
			this._setPref('select_rule', rid);
			
			//Set save values
			var btn = document.getElementById('deviceSave');
			btn.setAttribute('onclick', 'nbSecurityApp._savePref(\''+rid+'\', \'rule\')');
		}
	},
	
	_setSubAssets: function(guid, asset){
		//$('#mylist').listview('refresh');
		var html = '<ul data-role="listview"><li data-role="list-divider"><a>Devices</a></li>';
		
		for (var key in this.assetObj[asset][guid].subDevices) {
			var obj = this.assetObj[asset][guid].subDevices[key];
			for (var prop in obj) {
			  	if(obj.hasOwnProperty(prop)){
			  		if(prop == 'shortName'){
				  		html += '<li><a href="#subAssetView" onclick="nbSecurityApp._setSubAssetData(\''+guid+'\',\''+key+'\',\''+asset+'\')" data-transition="slide">'+obj[prop]+'</a></li>';
			  		}
				}
			}
		}
		
		html += '</ul>';
		
		document.getElementById('nbSubAssetDisplay').innerHTML = html;
	},
	
	_setSubAssetData: function(guid, subGuid, asset){
		var category = this.assetObj[asset][guid].subDevices[subGuid].category;
		var data = this.assetObj[asset][guid].subDevices[subGuid].data;
		var shortName = this.assetObj[asset][guid].subDevices[subGuid].shortName;
		var type = this.assetObj[asset][guid].subDevices[subGuid].type;
		
		document.getElementById('subGuid').innerHTML = subGuid.replace(/%20/g, ' ');
		document.getElementById('subCategory').innerHTML = category.replace(/%20/g, ' ');
		document.getElementById('subData').innerHTML = data.replace(/%20/g, ' ');
		document.getElementById('subShortName').innerHTML = shortName.replace(/%20/g, ' ');
		document.getElementById('subType').innerHTML = type.replace(/%20/g, ' ');		
		
		//Set image
		this._setImage(shortName.replace(/%20/g, ' '), 'subImage');
		
		//Set Preferences
		this._setPref('select_subDevice', subGuid);
		
		//Set save values
		var btn = document.getElementById('deviceSave');
		btn.setAttribute('onclick', 'nbSecurityApp._savePref(\''+subGuid+'\', \'subDevice\')');
	},
	
	_db: {			    
	    errorCB: function(err) {
	        console.log("Error processing SQL: "+err.code);
	    },

	    successCB: function() {
	    	console.log("Successful Transaction!");
	    },
	    
	    trans: function(type, data){
	    	//Open connection
	    	var db = window.openDatabase("Database", "1.0", "Home App", 200000);
	    	
	    	if(type == 'create'){
	    		db.transaction(function(tx){
		    		var c = '';
			    	//tx.executeSql('DROP TABLE IF EXISTS '+data.tableName);
			    	for(var i=0; i<data.cols.length; i++){
			    		c += data.cols[i];
				    	if(i==0){ c += ' unique'; }
						if(i!=data.cols.length-1){c += ','; }
			    	}
				    tx.executeSql('CREATE TABLE IF NOT EXISTS '+data.tableName+' ('+c+')');
			    }, this.errorCB, this.successCB);
			    
	    	}else if(type == 'insert'){
		    	db.transaction(function(tx){
		    		var c = '';
		    		var v = '';
		    		for(var i=0; i<data.cols.length; i++){
			    		c += data.cols[i];
						if(i!=data.cols.length-1){c += ','; }
			    	}
			    	for(var i=0; i<data.vals.length; i++){
			    		v += '"'+data.vals[i]+'"';
						if(i!=data.vals.length-1){v += ','; }
			    	}
			        tx.executeSql('INSERT INTO '+data.tableName+' ('+c+') VALUES ('+v+')');
				}, this.errorCB, this.successCB);
				
	    	}else if(type == 'select_device'){
	    		db.transaction(function(tx){
		    		tx.executeSql(data.sql, [], function(tx, results) {
				        var len = results.rows.length;
				        var r = [];
				        for (var i=0; i<len; i++){
				        	r[i] = {guid: results.rows.item(i).Guid, asset: results.rows.item(i).Asset};
				        }
				        
				        //Set flipswitch
				        var flipswitchState = document.getElementById('flip-switch-state1');
						if(r[0]){
							$('#flip-switch1').children().addClass('ui-flipswitch-active');
							document.getElementById('deviceSecurity').checked = true;
							flipswitchState.value = 1;
						}else{
							$('#flip-switch1').children().removeClass('ui-flipswitch-active');
							document.getElementById('deviceSecurity').checked = false;
							flipswitchState.value = 0;
						}
				    }, function(err) {
				        console.log("Error processing SQL: "+err.code);
				    });
		    	}, this.errorCB, this.successCB);		    	
	    	}else if(type == 'select_rule'){
	    		db.transaction(function(tx){
		    		tx.executeSql(data.sql, [], function(tx, results) {
				        var len = results.rows.length;
				        var r = [];
				        for (var i=0; i<len; i++){
				        	r[i] = {guid: results.rows.item(i).Guid, asset: results.rows.item(i).Asset};
				        }
				        
				        //Set flipswitch
				        var flipswitchState = document.getElementById('flip-switch-state2');
						if(r[0]){
							$('#flip-switch2').children().addClass('ui-flipswitch-active');
							document.getElementById('ruleSecurity').checked = true;
							flipswitchState.value = 1;
						}else{
							$('#flip-switch2').children().removeClass('ui-flipswitch-active');
							document.getElementById('ruleSecurity').checked = false;
							flipswitchState.value = 0;
						}
				    }, function(err) {
				        console.log("Error processing SQL: "+err.code);
				    });
		    	}, this.errorCB, this.successCB);		    	
	    	}else if(type == 'select_subDevice'){
	    		db.transaction(function(tx){
		    		tx.executeSql(data.sql, [], function(tx, results) {
				        var len = results.rows.length;
				        var r = [];
				        for (var i=0; i<len; i++){
				        	r[i] = {guid: results.rows.item(i).Guid, asset: results.rows.item(i).Asset};
				        }
				        
				        //Set flipswitch
				        var flipswitchState = document.getElementById('flip-switch-state3');
						if(r[0]){
							$('#flip-switch3').children().addClass('ui-flipswitch-active');
							document.getElementById('subDeviceSecurity').checked = true;
							flipswitchState.value = 1;
						}else{
							$('#flip-switch3').children().removeClass('ui-flipswitch-active');
							document.getElementById('subDeviceSecurity').checked = false;
							flipswitchState.value = 0;
						}
				    }, function(err) {
				        console.log("Error processing SQL: "+err.code);
				    });
		    	}, this.errorCB, this.successCB);		    	
	    	}else{
		    	//None
	    	}
	    }
	},
	
	_savePref: function(guid, asset){
		console.log(document.getElementById('deviceSecurity').checked);
		if((document.getElementById('deviceSecurity').checked == true && asset == 'device')
		|| (document.getElementById('subDeviceSecurity').checked == true && asset == 'subDevice')
		|| (document.getElementById('ruleSecurity').checked == true && asset == 'rule')){
			this._db.trans('insert', {tableName: 'Pref', cols: ['Guid', 'Asset'], vals: [guid, asset]});
		}else{
			//Nothing checked
		}
	},
	
	_setPref: function(asset, guid){
		var r = this._db.trans(asset, {sql: 'SELECT * FROM Pref WHERE Guid = "'+guid+'"'});
	}
}