Package.describe({
  name: "dhtmlx:scheduler-data",
  version: "0.0.3",
  // Brief, one-line summary of the package.
  summary: "Meteor data adapter for dhtmlxScheduler",
  // URL to the Git repository containing the source code for this package.
  git: "https://github.com/DHTMLX/meteor-scheduler-data.git",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md",
  packages: {
      "dhtmlx:scheduler": "*"
  }
});

Package.onUse(function(api) {
  api.versionsFrom("1.1.0.2");
  api.use(["dhtmlx:scheduler@0.0.1"], "client");
  api.addFiles("scheduler-data.js", "client");
  api.export("scheduler", "client");
});

Package.onTest(function(api) {
  api.use("tinytest");
  api.use("dhtmlx:scheduler-data");
  api.addFiles("scheduler-data-tests.js");
});
