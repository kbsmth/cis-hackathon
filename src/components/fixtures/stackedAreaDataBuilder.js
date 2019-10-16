import _ from 'underscore';
import jsonThreeSources from './areaDataThreeSources';
import jsonSixSources from './areaDataSixSources';
import jsonSalesChannel from './areaDataSalesChannel';
import jsonReportService from './areaDataReportService';
import jsonLargeService from './areaDataLarge';

export function StackedAreaDataBuilder(config){
    this.Klass = StackedAreaDataBuilder;

    this.config = _.defaults({}, config);

    this.with3Sources = function(){
        var attributes = _.extend({}, this.config, jsonThreeSources);

        return new this.Klass(attributes);
    };

    this.with6Sources = function(){
        var attributes = _.extend({}, this.config, jsonSixSources);

        return new this.Klass(attributes);
    };

    this.withReportData = function(){
        var attributes = _.extend({}, this.config, jsonReportService);

        return new this.Klass(attributes);
    };

    this.withSalesChannelData = function(){
        var attributes = _.extend({}, this.config, jsonSalesChannel);

        return new this.Klass(attributes);
    };

    this.withLargeData = function() {
        var attributes = _.extend({}, this.config, jsonLargeService);

        return new this.Klass(attributes);
    }

    this.build = function() {
        return this.config;
    };
}
