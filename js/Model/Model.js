N.plug("Model", function() {
/**
 * Extending Publisher class
 * This allows all Model classes to implement custom events
 */
N.extend(Model, N.plugins.Publisher);
/**
 * Custom events to fire
 */
Model.events = { SELECT : "get", INSERT : "save", UPDATE : "edit", DELETE : "delete" };
/**
 * @class Model 
 * @description this class is intended to be extended.
 * TODO Implementing REST principle for operating with server resources.
 * TODO Implementing forEach method
 * TODO Implementing this.results buffer 
 * 
 */
function Model() {
	this.Model();
}
/**
 * @constructor Model
 * @access public
 * 
 * @returns void
 */
Model.prototype.Model = function() {
	this.Publisher();
};
Model.prototype.data = [];
Model.prototype.errors = [];
/**
 * @method store
 * @access public
 * 
 * @description Saves to localStorage/Redis database.
 * @param where String (required) - table name
 * 
 * @returns Boolean
 */
Model.prototype.store = function(where) {
	localStorage.setItem(where, JSON.stringify(this.data));
};
/**
 * @method get
 * @access public
 * 
 * @description Getting data from database table.
 * @param where String (required) - table name
 * 
 * @returns Object
 */
Model.prototype.get = function(where) {
	var db = localStorage.getItem(where);
	this.data = (db) ? JSON.parse(db) : [];
};
/**
 * @method newId
 * @access public
 * 
 * @description Getting unique id for a table row.
 * 
 * @returns String
 */
Model.prototype.newId = function() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
};
/**
 * @method select
 * @access public
 * 
 * TODO Get rid of eval() 
 * 
 * @description Selects records from database based on query parameter.
 * @param query String (required) - conditions
 * 
 * @returns Object
 */
Model.prototype.select = function(query) {
	if (query === "*" || typeof query === "undefined") {
		this.get(this.constructor.TABLE);
		this.push(Model.events.SELECT);
		return this.data;
		
	} else if (typeof query === "function") {
		this.get(this.constructor.TABLE);
		var i = this.data.length, result = [];
		while (i--) {
			query(this.data[i]) && result.push(this.data[i]);
		}
		this.push(Model.events.SELECT);
		return this.data = result;
	}
	return false;
};
/**
 * @method insert
 * @access public
 * 
 * @description Inserts record in a table.
 * @param query Object (required) - record data
 * 
 * @returns Object
 */
Model.prototype.insert = function(query) {
	if (typeof query === "object") {
		if (this.getErrors(N.objectMerge(query, { id : this.newId() })).length === 0) {
			this.get(this.constructor.TABLE);
			this.data.push(query);
			this.store(this.constructor.TABLE);
			this.push(Model.events.INSERT);
			return query;
		}
	}
	return false;
};
Model.prototype.getErrors = function(data) {
	if (typeof data === "object" && typeof this.constructor.FIELDS === "object") {
		var i, that = this;
		
		this.errors = [];
		for (i in this.constructor.FIELDS) {
			if (typeof data[i] !== "undefined") {
				if (data[i] === "") {
					this.errors.push(new function() {
						this[i] = that.constructor.FIELDS[i];
					});
				}
			}
		}
	}
	return this.errors;
};
Model.prototype.lastRecord = function() {
	this.get(this.constructor.TABLE);
	return (this.data.length > 0) ? this.data[this.data.length - 1] : null;
};

return Model;
});