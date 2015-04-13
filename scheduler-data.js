scheduler.meteor = function(collection) {
    var collectionCursor = null ;

    if(arguments.length == 2) {
        collectionCursor = arguments[0];
        collection = arguments[1];
    }
    else
        collectionCursor = collection.find();

    var CollectionPerformerObj = new CollectionPerformer(collection);

    this.attachEvent("onEventChanged", function(eventId, event) {
        CollectionPerformerObj.save(event);
    });

    this.attachEvent("onEventDeleted", function(eventId) {
        CollectionPerformerObj.remove(eventId);
    });

    this.attachEvent("onEventAdded", function(eventId, event) {
        CollectionPerformerObj.save(event);
    });

    var self = this;
    collectionCursor.observe({

        added: function(data) {
            var eventData = parseEventData(data);
            if(!self.getEvent(eventData.id))
                self.addEvent(eventData);
        },

        changed: function(data) {
            var eventData = parseEventData(data),
                event = self.getEvent(eventData.id);

            if(!event)
                return false;

            for(var key in eventData)
                event[key] = eventData[key];

            self.updateEvent(eventData.id);
            return true;
        },

        removed: function(data) {
            if(self.getEvent(data.id))
                self.deleteEvent(data.id);
        }

    });

};

function CollectionPerformer(collection) {

    this.save = function(event) {
        event = parseEventData(event);

        var savedEventData = this.findEvent(event.id);
        if(savedEventData)
            collection.update({_id: savedEventData._id}, event);
        else
            collection.insert(event);
    };

    this.remove = function(eventId) {
        var savedEventData = this.findEvent(eventId);
        if(savedEventData)
            collection.remove(savedEventData._id);
    };

    this.findEvent = function(eventId) {
        return collection.findOne({id: eventId});
    };
}

function parseEventData(event) {
    var eventData = {};
    for(var eventProperty in event) {
        if(eventProperty == "_id")
            continue;

        eventData[eventProperty] = event[eventProperty];

        if(eventProperty == "id")
            eventData[eventProperty] = eventData[eventProperty].toString();
    }

    return eventData;
}