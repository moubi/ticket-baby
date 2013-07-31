N.plug("Subscriber", function() {
/**
 * @class Subscriber 
 * @description Intention of this class is to serve as Subscriber and DOM events manipulator
 *  
 */
function Subscriber() {
	this.Subscriber();
}
Subscriber.prototype.Subscriber = function() { };
/**
 * @method addDOMListener
 * @access public
 * 
 * @description Cross browser listener for DOM Level 2 events.
 * 
 * @param element Array|String|HTMLElement (required) - Element Id, Array of elements or HTMLElement to listen on
 * @param eventName String (required) - Event name
 * @param fn Function (required) - function to execute on event appearance
 * @param prop Boolean (optional) - propagate or not
 * 
 * @returns void
 */
Subscriber.prototype.addDOMListener = N.Events.addEventListener;
/**
 * @method removeDOMListener
 * @access public
 * 
 * @description Remove Cross browser listener for DOM Level 2 events.
 * 
 * @param element Array|String|HTMLElement (required) - Element Id, Array of elements or HTMLElement to listen on
 * @param eventName String (required) - Event name
 * @param fn Function (required) - pointer to the function passed via addDOMListener 
 * @param prop Boolean (optional) - propagate or not
 * 
 * @returns void
 */
Subscriber.prototype.removeDOMListener = N.Events.removeEventListener;
/**
 * @method addEventListener
 * @access public
 * 
 * @description Listens for a custom event (method) on the object passed.
 * 
 * @param object Object (required) - Object (instance of a class) to listen to
 * @param event String (required) - Event name (method name)
 * @param callback Function (required) - function to execute on event appearance 
 * 
 * @returns void
 */
Subscriber.prototype.addEventListener = function(object, event, callback) {
	(!object.subscribers) && (object.subscribers = {});
	(!object.subscribers[event]) && (object.subscribers[event] = []);
	(object.subscribers[event].indexOf(callback) === -1) && object.subscribers[event].push(callback);
};
/**
 * @method removeEventListener
 * @access public
 * 
 * @description Remove listeners on the object passed for particular event.
 * 
 * @param object Object (required) - Object (instance of a class) to listen to
 * @param event String (required) - Event name (method name)
 * @param callback Function (required) - pointer to function passed via addEventListener
 * 
 * @returns void
 */
Subscriber.prototype.removeEventListener = function(object, event, callback) {
	if (object.subscribers) {
		if (object.subscribers[event]) {
			var index = object.subscribers[event].indexOf(callback);
			(index !== -1) && object.subscribers[event].splice(index, 1);
		}
	}
};
/**
 * @method dispatchEvent
 * @access public
 * 
 * @description Force execution of all listeners to particular event on object.
 * 
 * @param object Object (required) - Object (instance of a class) to listen to
 * @param event String (required) - Event name (method name)
 * 
 * @returns void
 */
Subscriber.prototype.dispatchEvent = function(object, event) {
	(typeof object.push === "function") && object.push(event);
};

return Subscriber;
});