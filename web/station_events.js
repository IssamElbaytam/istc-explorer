function addHoverEventsForStations(stationSelector) {
  $(stationSelector).off('mouseenter',stationSelector)
    .off('mouseleeave',stationSelector)
    .on('mouseenter',function(e) {
      this.eventDone = false;
      var stationId = this.datum.bodc_station;
      console.log(this);
      $(this).attr('title',''); // has to have a title attribute
      if(!this.hasTooltip) {
        getAggregateData(this,stationId);
      }
    })
    .on('mouseleave',function(e) {
      this.eventDone = true;
    });
};

function getAggregateData(o,stationId){
  if(o.eventDone) return; // don't do anything
  getAggregateGenomicsDataForStation(stationId,function(aggregateGenomicsData) {
    if(o.eventDone) return; // don't do anything
    var gc = aggregateGenomicsData[0]['count'];
    //console.log('stationId',stationId);
    //console.log('total genome sequences:',gc);
    getAggregateSampleDataForStation(stationId,function(aggregateSampleData) {
      if(o.eventDone) return; // don't do anything
      var sc = aggregateSampleData[0]['count'];
      //console.log('total samples:',gc);
      $(o).tooltip({content:
        "station: "+stationId+", "
        +"total genome sequences: "+gc+", "
        +"total samples: "+sc+""});
      $(o).tooltip("open");
      o.hasTooltip = true;
    });
  });
};

function addClickEventsForStations(stationSelector,linev,linevSelector) {
  $(stationSelector).off('click',stationSelector).on('click',function() {
    console.log('data:',this.datum);
    stationId = this.datum.bodc_station;
    // TODO: trigger a line chart to be drawn
    // get the necessary data for this station
    var defaultFields = ['nitrat_umol_per_kg', 'silcat_umol_per_kg', 'phspht_umol_per_kg'];
    getSpecificSampleDataForStation(stationId,defaultFields,function(res){
      console.log("query results:",res);
      // draw the line chart
      linev.fields(defaultFields);
      linev.points(vega.changeset().remove(function(){return true;}).insert(res));
      //linev.points(vega.changeset().insert([{"depth_m":10,"nitrat_umol_per_kg":12.96},{"depth_m":10,"nitrat_umol_per_kg":13.33},{"depth_m":24,"nitrat_umol_per_kg":13.06},{"depth_m":25,"nitrat_umol_per_kg":13.04},{"depth_m":49,"nitrat_umol_per_kg":15.13},{"depth_m":51,"nitrat_umol_per_kg":13.86},{"depth_m":74,"nitrat_umol_per_kg":19.32},{"depth_m":75,"nitrat_umol_per_kg":20.54},{"depth_m":99,"nitrat_umol_per_kg":24.03},{"depth_m":100,"nitrat_umol_per_kg":22.51},{"depth_m":151,"nitrat_umol_per_kg":25.52},{"depth_m":151,"nitrat_umol_per_kg":25.76},{"depth_m":200,"nitrat_umol_per_kg":26.68},{"depth_m":200,"nitrat_umol_per_kg":26.65},{"depth_m":250,"nitrat_umol_per_kg":28.04},{"depth_m":250,"nitrat_umol_per_kg":27.62},{"depth_m":300,"nitrat_umol_per_kg":29.09},{"depth_m":399,"nitrat_umol_per_kg":30.4},{"depth_m":399,"nitrat_umol_per_kg":30.35},{"depth_m":400,"nitrat_umol_per_kg":30.77}]));
      // display the line chart, if currently hidden
      $(linevSelector).removeClass('hide');
    });
  });
};