function FirstAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

FirstAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	
	/* update the app info using values from our app */
	this.controller.get("app-title").update(Mojo.appInfo.title);
	this.controller.get("app-id").update(Mojo.appInfo.id);
	this.controller.get("app-id").update('ad1');
	this.controller.get("app-version").update(Mojo.appInfo.version);
	var c = this.controller, e = Mojo.Event;
	c.setupWidget('button', {}, { label: 'other' });
	e.listen(c.get('button'),e.tap, function() {
		c.stageController.swapScene('other');
	});

	
	/* add event handlers to listen to events from widgets */
};

FirstAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

FirstAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

FirstAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
