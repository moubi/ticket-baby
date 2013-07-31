N.plug("Publisher", function() {
N.extend(Publisher, N.Object);
/**
 * @class Publisher 
 * @description Intention of this class is to be extended
 * It turns every child class into publisher which can act on any number of subscribers
 *  
 */
function Publisher() {
	this.Publisher();
}
/**
 * @constructor Publisher
 * @access public
 * 
 * @description Inits subscribers
 * 
 * @returns void
 */
Publisher.prototype.Publisher = function() {
	this.subscribers = {};
};
/**
 * @method push
 * @access public
 * 
 * @param event String (required)
 * @description Executes all subscriber callbacks for particular instance and event
 * 
 * @returns void
 */
Publisher.prototype.push = function(event) {
	if (this.subscribers) {
		if (this.subscribers[event]) {
			var length = this.subscribers[event].length, i;
			for (i = 0; i < length; i++) { this.subscribers[event][i](); }
		}
	}
};

return Publisher;
});