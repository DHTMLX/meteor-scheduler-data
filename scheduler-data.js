schedulerMeteor = function(scheduler, collection) {
    var CollectionPerformerObj = new CollectionPerformer(collection);

    scheduler.attachEvent("onEventChanged", function(eventId, event) {
        CollectionPerformerObj.save(event);
    });

    scheduler.attachEvent("onEventDeleted", function(eventId) {
        CollectionPerformerObj.remove(eventId);
    });

    scheduler.attachEvent("onEventAdded", function(eventId, event) {
        CollectionPerformerObj.save(event);
    });

    collection.find().observe({
        added: function(data) {
            var eventData = parseEventData(data);
            if(!scheduler.getEvent(eventData.id))
                scheduler.addEvent(eventData);
        },

        changed: function(data) {
            var eventData = parseEventData(data),
                event = scheduler.getEvent(eventData.id);

            if(!event)
                return false;

            for(var key in eventData)
                event[key] = eventData[key];

            scheduler.updateEvent(eventData.id);
            return true;
        },

        removed: function(data) {
            if(scheduler.getEvent(data.id))
                scheduler.deleteEvent(data.id);
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
