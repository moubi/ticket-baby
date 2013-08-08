N.plug("Controller", function() {
N.extend(Controller, N.plugins.Subscriber);

var _models = {}, _views = {};
function Controller(models, views) {
	this.Controller(models, views);
}
Controller.prototype.Controller = function(models, views) {
	this.Subscriber();
	_models = models;
	_views = views;
};
Controller.prototype.init = function() {
	var that = this;
	this.addDOMListener(window, "resize", this.resize);
	this.addDOMListener(window, "load", function() {
		that.load(function(map) {
			that.addDOMListener(_views.FormView.constructor.USER_DETAILS, "click", that.link); 	// Login/Register
			that.addDOMListener(_views.FormView.form, "focus", that.focus, true); 				// Field focus
			that.addDOMListener(_views.FormView.form, "blur", that.blur, true); 				// Field blur
			that.addDOMListener(_views.FormView.form, "click", that.submit); 					// Submit Login/Register form
			that.addDOMListener(_views.ControllsView.constructor.NAV, "click", that.nav); 		// Buttons
			that.addDOMListener(_views.ControllsView.constructor.TRAPS, "click", that.traps); 	// Select traps
			that.addDOMListener(document, "click", that.popupButton); 							// Place/Dismiss/Agree/Protest trap
			
			map.on("click", that.addMarker);													// Add trap (marker)
			map.on("zoomend resize dragend", that.loadMarkers);									// Show traps
			map.on("load", that.loadMarkers);													// Show traps
			map.on("popupopen", that.openPopup);
		});
	});
};

Controller.prototype.load = function(callback) {
	_views.MapView.set(_models.MapModel.select("*")[0], callback);
	this.loadMarkers();
};
Controller.prototype.loadMarkers = function() {
	Controller.prototype.unloadMarkers();
	var markers = _models.UserMarkersModel.select(function(row) { return _views.MapView.map.isVisible(row.latlng); }), i = markers.length, 
		currentMarkers = _views.MapView.markers.slice(0), j = currentMarkers.length, diff = false;
	
	// TODO Needs optimization
	if (j == 0) {
		while (i--) {
			_views.MapView.marker(N.objectMerge(_models.MarkerModel.marker(markers[i].mid), { latlng : markers[i].latlng, draggable : false }), function(marker) {
				this.popup({ marker : marker, template : this.constructor.POPUP.overview, templateVars : N.objectMerge(_models.UsersModel.user(markers[i].uid), { marker : markers[i] }) }, function(popup) { 
					this.closePopup(popup); 
				});
			});
		}
	} else {
		while (i--) {
			while (j--) {
				(currentMarkers[j]._latlng.lat == markers[i].latlng[0] && currentMarkers[j]._latlng.lng == markers[i].latlng[1]) && (diff = true);
			}
			if (!diff) {
				_views.MapView.marker(N.objectMerge(_models.MarkerModel.marker(markers[i].mid), { latlng : markers[i].latlng, draggable : false }), function(marker) {
					this.popup({ marker : marker, template : this.constructor.POPUP.overview, templateVars : N.objectMerge(_models.UsersModel.user(markers[i].uid), { marker : markers[i] }) }, function(popup) {
						this.closePopup(popup);
					});
				});
			}
			j = currentMarkers.length; diff = false;
		}
	}
};
Controller.prototype.unloadMarkers = function() {
	if (_views.MapView.markers.length > 0) {
		var markers = _views.MapView.markers, buffer = markers.slice(0), i = markers.length;
		while (i--) {
			if (!_views.MapView.map.isVisible([markers[i]._latlng.lat, markers[i]._latlng.lng])) {
				_views.MapView.removeMarker(markers[i]);
				buffer.splice(i, 1);
			}
		}
		_views.MapView.markers = buffer;
	}
};
Controller.prototype.resize = function() {
	_views.MapView.fullScreen();
};
Controller.prototype.link = function(e) {
	var target = N.Events.getTarget(e);
	switch (target.id) {
		case _views.FormView.constructor.REGISTER_BUTTON : { _views.FormView.show(_views.FormView.constructor.EVENTS.register); break; }
		case _views.FormView.constructor.LOGIN_BUTTON : { _views.FormView.show(_views.FormView.constructor.EVENTS.login); break; }
		case _views.FormView.constructor.LOGOUT_BUTTON : { _views.FormView.logout(); break; }
	}
};
Controller.prototype.nav = function(e) {
	var target = N.Events.getTarget(e);
	if (target.id === _views.ControllsView.constructor.TRAPS_BUTTON) {
		_views.ControllsView.show(_views.ControllsView.constructor.EVENTS.traps, _models.MarkerModel.select("*"));	
	}
};
Controller.prototype.traps = function(e) {
	var target = N.Events.getTarget(e);
	if (target.className === _views.ControllsView.constructor.TRAPS_MARKER_CLASS) {
		if (_views.FormView.Session.get()) {
			_views.ControllsView.selectMarker(target.parentNode, N.DOM.getAttributes(target, "data-type"));
		} else {
			_views.ControllsView.hide(function() { _views.FormView.show(_views.FormView.constructor.EVENTS.login); });
		}
	}
};
Controller.prototype.focus = function(e) {
	var target = N.Events.getTarget(e);
	(target.tagName === "INPUT" || target.tagName === "TEXTAREA") && _views.FormView.focus(target);
};
Controller.prototype.blur = function(e) {
	var target = N.Events.getTarget(e);
	(target.tagName === "INPUT" || target.tagName === "TEXTAREA") && _views.FormView.blur(target);
};
Controller.prototype.submit = function(e) {
	N.Events.preventDefault(e);
	var target = N.Events.getTarget(e);
	if (target.type === "submit") {
		if (N.DOM.getAttributes(target.parentNode, "data-type") === _views.FormView.constructor.EVENTS.login) {
			if (_models.UsersModel.login(_views.FormView.getFields())) {
				_views.FormView.login(_models.UsersModel.data[0]);
			} else {
				_views.FormView.errors(_models.UsersModel.errors);
			}
		} else if (N.DOM.getAttributes(target.parentNode, "data-type") === _views.FormView.constructor.EVENTS.register) {
			if (_models.UsersModel.register(_views.FormView.getFields())) {
				_views.FormView.login(_models.UsersModel.lastRecord());
			} else {
				_views.FormView.errors(_models.UsersModel.errors);
			}
		}
	}
};
Controller.prototype.addMarker = function(e) {
	if (_views.ControllsView.marker !== null && _views.FormView.Session.get()) {
		if (_models.UserMarkersModel.isNewMarkerAllowed(_views.FormView.Session.getValue("id"))) {
			_views.MapView.marker(N.objectMerge(_models.MarkerModel.select(function(row) { return row.id == _views.ControllsView.marker; })[0], { latlng : e.latlng }), function(marker) {
				this.popup({ marker : marker, template : this.constructor.POPUP.agreement });
			});
		}
	}
};
Controller.prototype.dragendMarker = function(e) {
	e.target._popup && _views.MapView.openPopup(e.target._popup);
};
Controller.prototype.popupButton = function(e) {
	var target = N.Events.getTarget(e);
	if (_views.MapView.currentPopup && N.DOM.contains(_views.MapView.currentPopup._container, target)) {
		var button = N.DOM.getAttributes(target, "data-value");
		switch (button) {
			case "yes" : { Controller.prototype.confirmTrap(); break; } 
			case "no" : { Controller.prototype.dismissTrap(); break; }
			case "agree" : { Controller.prototype.agree(target); break; }
			case "protest" : { Controller.prototype.protest(target); break; }
			case "history" : { Controller.prototype.trapHistory(target); break; }
			case "details" : { Controller.prototype.trapDetails(target); break; }
		}
	}
};
Controller.prototype.confirmTrap = function() {
	var markerData = _models.UserMarkersModel.insert({
		uid : _views.ControllsView.Session.getValue("id"), 
		mid : _views.ControllsView.marker, 
		date : new Date().toDateString(), 
		latlng : [_views.MapView.currentMarker._latlng.lat, _views.MapView.currentMarker._latlng.lng], 
		status : _models.UserMarkersModel.constructor.STATUS.pending
	});
	if (markerData) {
		_views.MapView.removePopup(_views.MapView.currentPopup);
		_views.MapView.popup({ marker : _views.MapView.currentMarker, template : _views.MapView.constructor.POPUP.overview, templateVars : N.objectMerge(_views.ControllsView.Session.get(), { marker : markerData }) }, function(popup) {
			this.map.pinMarker(_views.MapView.currentMarker);
			this.closePopup(popup);
		});
	}
};
Controller.prototype.dismissTrap = function() {
	_views.MapView.removeMarker(_views.MapView.currentMarker);
};
Controller.prototype.agree = function(button) {
	if (_views.FormView.Session.get()) {
		var markerId = _views.MapView.getCurrentMarkerId(), uid = _views.ControllsView.Session.getValue("id"); 
		
		// Check if this marker wasn't created by current user
		if (!_models.UserMarkersModel.markerOwnedByUser(markerId, uid) && !_models.MarkersVotesModel.userVotedForMarker(uid, markerId)) {
			var markerVotesData = _models.MarkersVotesModel.agree({ uid : uid, mid : markerId });
			markerVotesData && _views.MapView.agree(button);
		}
	} else {
		_views.ControllsView.hide(function() { _views.FormView.show(_views.FormView.constructor.EVENTS.login); });
	}
};
Controller.prototype.protest = function(button) {
	if (_views.FormView.Session.get()) {
		var markerId = _views.MapView.getCurrentMarkerId(), uid = _views.ControllsView.Session.getValue("id"); 
		
		// Marker wasn't created by current user and user didn't perform voting on it yet
		if (!_models.UserMarkersModel.markerOwnedByUser(markerId, uid) && !_models.MarkersVotesModel.userVotedForMarker(uid, markerId)) {
			var markerVotesData = _models.MarkersVotesModel.protest({ uid : uid, mid : markerId });
			markerVotesData && _views.MapView.protest(button);
		}
	} else {
		_views.ControllsView.hide(function() { _views.FormView.show(_views.FormView.constructor.EVENTS.login); });
	}
};
Controller.prototype.trapHistory = function(button) {
	// TODO order trabs by date
	var markerId = _views.MapView.getCurrentMarkerId();
	_views.MapView.trapHistory(_models.UserMarkersModel.markerOwner(markerId), _models.MarkersVotesModel.markerHistory(markerId), button);
};
Controller.prototype.trapDetails = function(button) {
	_views.MapView.trapDetails(_models.UserMarkersModel.markerOwner(_views.MapView.getCurrentMarkerId()), button);
};
Controller.prototype.openPopup = function(e) {
	_views.MapView.setCurrentPopup(e.popup);
};

return Controller;
});