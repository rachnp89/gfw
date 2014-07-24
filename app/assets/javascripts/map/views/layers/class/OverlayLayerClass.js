/**
 * The HTML5 Canvas map layer module.
 *
 * @return OverlayLayer class (extends Class).
 */
define([
  'Class',
  'underscore',
  'views/layers/CustomInfowindow'
], function(Class, _, CustomInfowindow) {

  'use strict';

  var OverlayLayerClass = Class.extend({

    defaults: {
      infowindow: false,
      infowindowContent: null,
      infowindowAPI: null
    },

    init: function(layer, map) {
      this.map = map;
      this.layer = layer;
      this.name = layer.slug;
      this.tileSize = new google.maps.Size(256, 256);
      this.options = _.extend({}, this.defaults, this.options || {});
    },

    addLayer: function(options) {
      if (this._getOverlayIndex() < 0) {
        this._getLayer().then(_.bind(function(layer) {
          this.map.overlayMapTypes.insertAt(options.position, layer);
          if (this.options.infowindow) {
            this.setInfowindow();
          }
        }, this));
      }
    },

    removeLayer: function() {
      var overlayIndex = this._getOverlayIndex();
      this.removeInfowindow();
      if (overlayIndex > -1) {
        this.map.overlayMapTypes.removeAt(overlayIndex);
      }
    },

    /**
     * Create a infowindow object
     * and add to Map
     *
     * @return {object}
     */
    setInfowindow: function() {
      if (!this.infowindow) {
        this.infowindow = new CustomInfowindow(this.map, this.options);
      }
    },

    removeInfowindow: function() {
      if (this.infowindow) {
        this.infowindow.destroy();
      }
    },

    _getOverlayIndex: function() {
      var overlaysLength = this.map.overlayMapTypes.getLength();
      if (overlaysLength > 0) {
        for (var i = 0; i< overlaysLength; i++) {
          var layer = this.map.overlayMapTypes.getAt(i);
          if (layer && layer.name === this.getName()) {
            return i;
          }
        }
      }
      return -1;
    },

    getName: function() {
      return this.name;
    }

  });

  return OverlayLayerClass;

});