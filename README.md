Meteor data adapter for dhtmlxScheduler
================================

Allows using [dhtmlxScheduler](http://dhtmlx.com/docs/products/dhtmlxScheduler) component with [Meteor](https://meteor.com/).

How to use
-----------

- Add the [dhtmlxScheduler data adapter](https://atmospherejs.com/dhtmlx/scheduler-data):

    ```sh
    meteor add dhtmlx:scheduler-data
    ```

- Define data collections as usual:

    ```js
    TasksCollection = new Mongo.Collection("tasks");
    ```

- Initialize dhtmlxScheduler and data adapter:

    ```html
	<body>
	  <div id="scheduler_here" class="dhx_cal_container" style='width:100%;height:500px;'>
	      <div class="dhx_cal_navline">
		  <div class="dhx_cal_prev_button">&nbsp;</div>
		  <div class="dhx_cal_next_button">&nbsp;</div>
		  <div class="dhx_cal_today_button"></div>
		  <div class="dhx_cal_date"></div>
		  <div class="dhx_cal_tab" name="day_tab" style="right:332px;"></div>
		  <div class="dhx_cal_tab" name="week_tab" style="right:268px;"></div>
		  <div class="dhx_cal_tab" name="month_tab" style="right:204px;"></div>
		  <div class="dhx_cal_tab" name="year_tab" style="right:140px;"></div>
	      </div>
	      <div class="dhx_cal_header">
	      </div>
	      <div class="dhx_cal_data">
	      </div>
	  </div>
	</body>
    ```

    ```js
	Meteor.startup(function() {
	  //Init dhtmlxScheduler.
	  scheduler.init("scheduler_here", new Date());

	  //Init dhtmlxScheduler data adapter.
	  scheduler.meteor(TasksCollection);
	  //or
	  scheduler.meteor(TasksCollection.find(/*[anything]*/), TasksCollection);
	});
    ```

That is it.

License
----------

DHTMLX is published under the GPLv3 license.

License:

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
	to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
	and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
	IN THE SOFTWARE.


Copyright (c) 2015 DHTMLX
