var gCollectionObserver = null,
    gEventsCollection = null;

function meteorStart(collection) {
    gEventsCollection = new DataCollection();
    var collectionCursor = null ;

    if(arguments.length == 2) {
        collectionCursor = arguments[0];
        collection = arguments[1];
    }
    else
        collectionCursor = collection.find();

    var CollectionPerformerObj = new CollectionPerformer(collection);

    gEventsCollection.add(this.attachEvent("onEventLoading", function(event) {
        CollectionPerformerObj.save(event);
        return true;
    }));

    gEventsCollection.add(this.attachEvent("onEventChanged", function(eventId, event) {
        CollectionPerformerObj.save(event);
    }));

    gEventsCollection.add(this.attachEvent("onEventDeleted", function(eventId) {
        CollectionPerformerObj.remove(eventId);
    }));

    gEventsCollection.add(this.attachEvent("onEventAdded", function(eventId, event) {
        CollectionPerformerObj.save(event);
    }));

    var self = this;
    gCollectionObserver = collectionCursor.observe({

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

}

function meteorStop() {
    if(gCollectionObserver)
        gCollectionObserver.stop();

    var self = this;
    if(gEventsCollection) {
        gEventsCollection.each(function(eventId) {
            self.detachEvent(eventId);
        });
        gEventsCollection.clean();
    }
}

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

function DataCollection() {
    var collectionData = {},
        currentUid = new Date().valueOf();

    function _uid() {
        return currentUid++;
    }

    this.add = function(data) {
        var dataId = _uid();
        collectionData[dataId] = data;
        return dataId;
    };

    this.each = function(handler) {
        for(var key in collectionData)
            handler.call(this, collectionData[key]);
    };

    this.clean = function() {
        collectionData = {};
    };
}



function initSchedulerMeteor(scheduler) {
    scheduler.meteor = meteorStart;
    scheduler.meteorStop = meteorStop;
}

if(window.Scheduler) {
    Scheduler.plugin(function(scheduler) {
        initSchedulerMeteor(scheduler);
    });
}
else
    initSchedulerMeteor(scheduler);
