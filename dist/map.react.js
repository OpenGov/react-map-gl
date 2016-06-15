'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _desc, _value, _class2; // Copyright (c) 2015 Uber Technologies, Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


// NOTE: Transform is not a public API so we should be careful to always lock
// down mapbox-gl to a specific major, minor, and patch version.


var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _pureRenderDecorator = require('pure-render-decorator');

var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _mapboxGl = require('mapbox-gl');

var _mapboxGl2 = _interopRequireDefault(_mapboxGl);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _mapInteractions = require('./map-interactions.react');

var _mapInteractions2 = _interopRequireDefault(_mapInteractions);

var _diffStyles2 = require('./diff-styles');

var _diffStyles3 = _interopRequireDefault(_diffStyles2);

var _transform = require('mapbox-gl/js/geo/transform');

var _transform2 = _interopRequireDefault(_transform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

// Note: Max pitch is a hard coded value (not a named constant) in transform.js
var MAX_PITCH = 60;
var PITCH_MOUSE_THRESHOLD = 20;
var PITCH_ACCEL = 1.2;

var PROP_TYPES = {
  /**
    * The latitude of the center of the map.
    */
  latitude: _react.PropTypes.number.isRequired,
  /**
    * The longitude of the center of the map.
    */
  longitude: _react.PropTypes.number.isRequired,
  /**
    * The tile zoom level of the map.
    */
  zoom: _react.PropTypes.number.isRequired,
  /**
    * The Mapbox style the component should use. Can either be a string url
    * or a MapboxGL style Immutable.Map object.
    */
  mapStyle: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.instanceOf(_immutable2.default.Map)]),
  /**
    * The Mapbox API access token to provide to mapbox-gl-js. This is required
    * when using Mapbox provided vector tiles and styles.
    */
  mapboxApiAccessToken: _react.PropTypes.string,
  /**
    * `onChangeViewport` callback is fired when the user interacted with the
    * map. The object passed to the callback containers `latitude`,
    * `longitude` and `zoom` information.
    */
  onChangeViewport: _react.PropTypes.func,
  /**
    * `onMapLoaded` callback is fired on the map's 'load' event
    */
  onMapLoaded: _react.PropTypes.func,
  /**
    * The width of the map. Number in pixels or CSS string prop e.g. '100%'
    */
  width: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  /**
    * The height of the map. Number in pixels or CSS string prop e.g. '100%'
    */
  height: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  /**
    * Is the component currently being dragged. This is used to show/hide the
    * drag cursor. Also used as an optimization in some overlays by preventing
    * rendering while dragging.
    */
  isDragging: _react.PropTypes.bool,
  /**
    * Required to calculate the mouse projection after the first click event
    * during dragging. Where the map is depends on where you first clicked on
    * the map.
    */
  startDragLngLat: _react.PropTypes.array,
  /**
    * Called when a feature is hovered over. Features must set the
    * `interactive` property to `true` for this to work properly. see the
    * Mapbox example: https://www.mapbox.com/mapbox-gl-js/example/featuresat/
    * The first argument of the callback will be the array of feature the
    * mouse is over. This is the same response returned from `featuresAt`.
    */
  onHoverFeatures: _react.PropTypes.func,
  /**
    * Defaults to TRUE
    * Set to false to enable onHoverFeatures to be called regardless if
    * there is an actual feature at x, y. This is useful to emulate
    * "mouse-out" behaviors on features.
    */
  ignoreEmptyFeatures: _react.PropTypes.bool,

  /**
    * Show attribution control or not.
    */
  attributionControl: _react.PropTypes.bool,

  /**
    * Called when a feature is clicked on. Features must set the
    * `interactive` property to `true` for this to work properly. see the
    * Mapbox example: https://www.mapbox.com/mapbox-gl-js/example/featuresat/
    * The first argument of the callback will be the array of feature the
    * mouse is over. This is the same response returned from `featuresAt`.
    */
  onClickFeatures: _react.PropTypes.func,

  /**
    * Passed to Mapbox Map constructor which passes it to the canvas context.
    * This is unseful when you want to export the canvas as a PNG.
    */
  preserveDrawingBuffer: _react.PropTypes.bool,

  /**
    * There are still known issues with style diffing. As a temporary stopgap,
    * add the option to prevent style diffing.
    */
  preventStyleDiffing: _react.PropTypes.bool,

  /**
    * Enables perspective control event handling (Command-rotate)
    */
  perspectiveEnabled: _react.PropTypes.bool,

  /**
    * Specify the bearing of the viewport
    */
  bearing: _react.PropTypes.number,

  /**
    * Specify the pitch of the viewport
    */
  pitch: _react.PropTypes.number,

  /**
    * Specify the altitude of the viewport camera
    * Unit: map heights, default 1.5
    * Non-public API, see https://github.com/mapbox/mapbox-gl-js/issues/1137
    */
  altitude: _react.PropTypes.number,

  /**
    * Disabled dragging of the map
    */
  dragDisabled: _react.PropTypes.bool,

  /**
    * Disabled zooming of the map
    */
  zoomDisabled: _react.PropTypes.bool,

  /**
    * Bounds to fit on screen
    */
  bounds: _react.PropTypes.instanceOf(_immutable2.default.List)
};

var DEFAULT_PROPS = {
  mapStyle: 'mapbox://styles/mapbox/light-v8',
  onChangeViewport: null,
  mapboxApiAccessToken: _config2.default.DEFAULTS.MAPBOX_API_ACCESS_TOKEN,
  preserveDrawingBuffer: false,
  attributionControl: true,
  ignoreEmptyFeatures: true,
  bearing: 0,
  pitch: 0,
  altitude: 1.5
};

var CHILD_CONTEXT_TYPES = {
  map: _react2.default.PropTypes.object
};

var MapGL = (0, _pureRenderDecorator2.default)(_class = (_class2 = function (_Component) {
  _inherits(MapGL, _Component);

  function MapGL(props) {
    _classCallCheck(this, MapGL);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MapGL).call(this, props));

    _this.state = {
      isDragging: false,
      startDragLngLat: null,
      startBearing: null,
      startPitch: null
    };
    _mapboxGl2.default.accessToken = props.mapboxApiAccessToken;

    _this._mapReady = false;

    _this.getChildContext = function () {
      return {
        map: _this._map
      };
    };
    return _this;
  }

  _createClass(MapGL, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var mapStyle = this.props.mapStyle instanceof _immutable2.default.Map ? this.props.mapStyle.toJS() : this.props.mapStyle;
      var map = new _mapboxGl2.default.Map({
        container: this.refs.mapboxMap,
        center: [this.props.longitude, this.props.latitude],
        zoom: this.props.zoom,
        pitch: this.props.pitch,
        bearing: this.props.bearing,
        style: mapStyle,
        interactive: false,
        preserveDrawingBuffer: this.props.preserveDrawingBuffer
        // TODO?
        // attributionControl: this.props.attributionControl
      });

      _d2.default.select(map.getCanvas()).style('outline', 'none');

      this._map = map;
      this._updateMapViewport({}, this.props);
      this._callOnChangeViewport(map.transform);

      if (this.props.onMapLoaded) {
        map.on('load', function () {
          return _this2.props.onMapLoaded(map);
        });
      }

      // support for external manipulation of underlying map
      // TODO a better approach
      map.on('style.load', function () {
        return _this2._mapReady = true;
      });
      map.on('moveend', function () {
        return _this2._callOnChangeViewport(map.transform);
      });
      map.on('zoomend', function () {
        return _this2._callOnChangeViewport(map.transform);
      });
    }

    // New props are comin' round the corner!

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      this._updateStateFromProps(this.props, newProps);
      this._updateMapViewport(this.props, newProps);
      this._updateMapStyle(this.props, newProps);
      // Save width/height so that we can check them in componentDidUpdate
      this.setState({
        width: this.props.width,
        height: this.props.height
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      // map.resize() reads size from DOM, we need to call after render
      this._updateMapSize(this.state, this.props);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._map) {
        this._map.remove();
      }
    }
  }, {
    key: '_cursor',
    value: function _cursor() {
      var isInteractive = this.props.onChangeViewport || this.props.onClickFeature || this.props.onHoverFeatures;
      if (isInteractive) {
        return this.props.isDragging ? _config2.default.CURSOR.GRABBING : _config2.default.CURSOR.GRAB;
      }
      return 'inherit';
    }
  }, {
    key: '_getMap',
    value: function _getMap() {
      return this._map;
    }
  }, {
    key: '_updateStateFromProps',
    value: function _updateStateFromProps(oldProps, newProps) {
      _mapboxGl2.default.accessToken = newProps.mapboxApiAccessToken;
      var startDragLngLat = newProps.startDragLngLat;

      this.setState({
        startDragLngLat: startDragLngLat && startDragLngLat.slice()
      });
    }

    // Individually update the maps source and layers that have changed if all
    // other style props haven't changed. This prevents flicking of the map when
    // styles only change sources or layers.

  }, {
    key: '_setDiffStyle',
    value: function _setDiffStyle(prevStyle, nextStyle) {
      var prevKeysMap = prevStyle && styleKeysMap(prevStyle) || {};
      var nextKeysMap = styleKeysMap(nextStyle);
      function styleKeysMap(style) {
        return style.map(function () {
          return true;
        }).delete('layers').delete('sources').toJS();
      }
      function propsOtherThanLayersOrSourcesDiffer() {
        var prevKeysList = Object.keys(prevKeysMap);
        var nextKeysList = Object.keys(nextKeysMap);
        if (prevKeysList.length !== nextKeysList.length) {
          return true;
        }
        // `nextStyle` and `prevStyle` should not have the same set of props.
        if (nextKeysList.some(function (key) {
          return prevStyle.get(key) !== nextStyle.get(key);
        }
        // But the value of one of those props is different.
        )) {
            return true;
          }
        return false;
      }

      var map = this._getMap();

      if (!prevStyle || propsOtherThanLayersOrSourcesDiffer()) {
        map.setStyle(nextStyle.toJS());
        return;
      }

      var _diffStyles = (0, _diffStyles3.default)(prevStyle, nextStyle);

      var sourcesDiff = _diffStyles.sourcesDiff;
      var layersDiff = _diffStyles.layersDiff;

      // TODO: It's rather difficult to determine style diffing in the presence
      // of refs. For now, if any style update has a ref, fallback to no diffing.
      // We can come back to this case if there's a solid usecase.

      if (layersDiff.updates.some(function (node) {
        return node.layer.get('ref');
      })) {
        map.setStyle(nextStyle.toJS());
        return;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = sourcesDiff.enter[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var enter = _step.value;

          map.addSource(enter.id, enter.source.toJS());
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = sourcesDiff.update[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var update = _step2.value;

          map.removeSource(update.id);
          map.addSource(update.id, update.source.toJS());
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = sourcesDiff.exit[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var exit = _step3.value;

          map.removeSource(exit.id);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = layersDiff.exiting[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _exit = _step4.value;

          if (map.style.getLayer(_exit.id)) {
            map.removeLayer(_exit.id);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = layersDiff.updates[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _update = _step5.value;

          if (!_update.enter) {
            // This is an old layer that needs to be updated. Remove the old layer
            // with the same id and add it back again.
            map.removeLayer(_update.id);
          }
          map.addLayer(_update.layer.toJS(), _update.before);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: '_updateMapStyle',
    value: function _updateMapStyle(oldProps, newProps) {
      var mapStyle = newProps.mapStyle;
      var oldMapStyle = oldProps.mapStyle;
      if (mapStyle !== oldMapStyle) {
        if (mapStyle instanceof _immutable2.default.Map) {
          if (this.props.preventStyleDiffing) {
            this._getMap().setStyle(mapStyle.toJS());
          } else {
            this._setDiffStyle(oldMapStyle, mapStyle);
          }
        } else {
          this._getMap().setStyle(mapStyle);
        }
      }
    }
  }, {
    key: '_updateMapViewport',
    value: function _updateMapViewport(oldProps, newProps) {
      var viewportChanged = newProps.latitude !== oldProps.latitude || newProps.longitude !== oldProps.longitude || newProps.zoom !== oldProps.zoom || newProps.pitch !== oldProps.pitch || newProps.bearing !== oldProps.bearing || newProps.altitude !== oldProps.altitude;

      var map = this._getMap();

      if (viewportChanged) {
        map.jumpTo({
          center: [newProps.longitude, newProps.latitude],
          zoom: newProps.zoom,
          bearing: newProps.bearing,
          pitch: newProps.pitch
        });

        // TODO - jumpTo doesn't handle altitude
        if (newProps.altitude !== oldProps.altitude) {
          map.transform.altitude = newProps.altitude;
        }
      }

      if (oldProps.bounds !== newProps.bounds && newProps.bounds) {
        map.fitBounds(newProps.bounds.toJS(), { padding: 45, maxZoom: 19 });
      }
    }

    // Note: needs to be called after render (e.g. in componentDidUpdate)

  }, {
    key: '_updateMapSize',
    value: function _updateMapSize(oldProps, newProps) {
      var sizeChanged = oldProps.width !== newProps.width || oldProps.height !== newProps.height;

      if (sizeChanged) {
        var map = this._getMap();
        map.resize();
        this._callOnChangeViewport(map.transform);
      }
    }
  }, {
    key: '_calculateNewPitchAndBearing',
    value: function _calculateNewPitchAndBearing(_ref) {
      var pos = _ref.pos;
      var startPos = _ref.startPos;
      var startBearing = _ref.startBearing;
      var startPitch = _ref.startPitch;

      var xDelta = pos.x - startPos.x;
      var bearing = startBearing + 180 * xDelta / this.props.width;

      var pitch = startPitch;
      var yDelta = pos.y - startPos.y;
      if (yDelta > 0) {
        // Dragging downwards, gradually decrease pitch
        if (Math.abs(this.props.height - startPos.y) > PITCH_MOUSE_THRESHOLD) {
          var scale = yDelta / (this.props.height - startPos.y);
          pitch = (1 - scale) * PITCH_ACCEL * startPitch;
        }
      } else if (yDelta < 0) {
        // Dragging upwards, gradually increase pitch
        if (startPos.y > PITCH_MOUSE_THRESHOLD) {
          // Move from 0 to 1 as we drag upwards
          var yScale = 1 - pos.y / startPos.y;
          // Gradually add until we hit max pitch
          pitch = startPitch + yScale * (MAX_PITCH - startPitch);
        }
      }

      // console.debug(startPitch, pitch);
      return {
        pitch: Math.max(Math.min(pitch, MAX_PITCH), 0),
        bearing: bearing
      };
    }

    // Helper to call props.onChangeViewport

  }, {
    key: '_callOnChangeViewport',
    value: function _callOnChangeViewport(transform) {
      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (this.props.onChangeViewport) {
        var _getMap$getContainer = this._getMap().getContainer();

        var height = _getMap$getContainer.scrollHeight;
        var width = _getMap$getContainer.scrollWidth;


        this.props.onChangeViewport(_extends({
          latitude: transform.center.lat,
          longitude: mod(transform.center.lng + 180, 360) - 180,
          zoom: transform.zoom,
          pitch: transform.pitch,
          bearing: mod(transform.bearing + 180, 360) - 180,

          isDragging: this.props.isDragging,
          startDragLngLat: this.props.startDragLngLat,
          startBearing: this.props.startBearing,
          startPitch: this.props.startPitch,

          projectionMatrix: transform.projMatrix,

          height: height,
          width: width

        }, opts));
      }
    }
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(_ref2) {
      var pos = _ref2.pos;

      var map = this._getMap();
      var lngLat = unprojectFromTransform(map.transform, pos);
      this._callOnChangeViewport(map.transform, {
        isDragging: true,
        startDragLngLat: [lngLat.lng, lngLat.lat],
        startBearing: map.transform.bearing,
        startPitch: map.transform.pitch
      });
    }
  }, {
    key: '_onMouseDrag',
    value: function _onMouseDrag(_ref3) {
      var pos = _ref3.pos;

      if (!this.props.onChangeViewport || this.props.dragDisabled) {
        return;
      }

      // take the start lnglat and put it where the mouse is down.
      (0, _assert2.default)(this.props.startDragLngLat, '`startDragLngLat` prop is required ' + 'for mouse drag behavior to calculate where to position the map.');

      var map = this._getMap();
      var transform = cloneTransform(map.transform);
      transform.setLocationAtPoint(this.props.startDragLngLat, pos);
      this._callOnChangeViewport(transform, {
        isDragging: true
      });
    }
  }, {
    key: '_onMouseRotate',
    value: function _onMouseRotate(_ref4) {
      var pos = _ref4.pos;
      var startPos = _ref4.startPos;

      if (!this.props.onChangeViewport || !this.props.perspectiveEnabled) {
        return;
      }

      var _props = this.props;
      var startBearing = _props.startBearing;
      var startPitch = _props.startPitch;

      (0, _assert2.default)(typeof startBearing === 'number', '`startBearing` prop is required for mouse rotate behavior');
      (0, _assert2.default)(typeof startPitch === 'number', '`startPitch` prop is required for mouse rotate behavior');

      var map = this._getMap();

      var _calculateNewPitchAnd = this._calculateNewPitchAndBearing({
        pos: pos,
        startPos: startPos,
        startBearing: startBearing,
        startPitch: startPitch
      });

      var pitch = _calculateNewPitchAnd.pitch;
      var bearing = _calculateNewPitchAnd.bearing;


      var transform = cloneTransform(map.transform);
      transform.bearing = bearing;
      transform.pitch = pitch;

      this._callOnChangeViewport(transform, {
        isDragging: true
      });
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(opt) {
      if (!this.props.onHoverFeatures) {
        return;
      }

      var map = this._getMap();
      var pos = opt.pos;

      var features = map.queryRenderedFeatures([pos.x, pos.y]);
      if (!features.length && this.props.ignoreEmptyFeatures) {
        return;
      }
      this.props.onHoverFeatures(features);
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(opt) {
      if (!this.props.onClickFeatures) {
        return;
      }

      var map = this._getMap();
      this._callOnChangeViewport(map.transform, {
        isDragging: false,
        startDragLngLat: null,
        startBearing: null,
        startPitch: null
      });

      var pos = opt.pos;

      // Radius enables point features, like marker symbols, to be clicked.
      var size = 15;
      var bbox = [[pos.x - size, pos.y - size], [pos.x + size, pos.y + size]];
      var features = map.queryRenderedFeatures(bbox);
      if (!features.length && this.props.ignoreEmptyFeatures) {
        return;
      }
      this.props.onClickFeatures(features);
    }
  }, {
    key: '_onZoom',
    value: function _onZoom(_ref5) {
      var pos = _ref5.pos;
      var scale = _ref5.scale;

      if (this.props.zoomDisabled) {
        return;
      }

      var map = this._getMap();
      var transform = cloneTransform(map.transform);
      var around = unprojectFromTransform(transform, pos);
      transform.zoom = transform.scaleZoom(map.transform.scale * scale);
      transform.setLocationAtPoint(around, pos);
      this._callOnChangeViewport(transform, {
        isDragging: true
      });
    }
  }, {
    key: '_onZoomEnd',
    value: function _onZoomEnd() {
      var map = this._getMap();
      this._callOnChangeViewport(map.transform, {
        isDragging: false
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var className = _props2.className;
      var width = _props2.width;
      var height = _props2.height;
      var style = _props2.style;

      var mapStyle = _extends({}, style, {
        width: width,
        height: height,
        cursor: this._cursor()
      });

      var content = [_react2.default.createElement('div', { key: 'map', ref: 'mapboxMap',
        style: mapStyle, className: className }), _react2.default.createElement(
        'div',
        { key: 'overlays', className: 'overlays',
          style: { position: 'absolute', left: 0, top: 0 } },
        this.props.children
      )];

      if (this.props.onChangeViewport) {
        content = _react2.default.createElement(
          _mapInteractions2.default,
          {
            onMouseDown: this._onMouseDown,
            onMouseDrag: this._onMouseDrag,
            onMouseRotate: this._onMouseRotate,
            onMouseUp: this._onMouseUp,
            onMouseMove: this._onMouseMove,
            onZoom: this._onZoom,
            onZoomEnd: this._onZoomEnd,
            width: this.props.width,
            height: this.props.height,
            zoomDisabled: this.props.zoomDisabled,
            dragDisabled: this.props.dragDisabled },
          content
        );
      }

      return _react2.default.createElement(
        'div',
        {
          style: _extends({}, this.props.style, {
            width: this.props.width,
            height: this.props.height,
            position: 'relative'
          }) },
        content
      );
    }
  }]);

  return MapGL;
}(_react.Component), (_applyDecoratedDescriptor(_class2.prototype, '_onMouseDown', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseDown'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseDrag'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseRotate', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseRotate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseMove'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseUp', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseUp'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onZoom', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onZoom'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onZoomEnd', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onZoomEnd'), _class2.prototype)), _class2)) || _class;

exports.default = MapGL;


function mod(value, divisor) {
  var modulus = value % divisor;
  return modulus < 0 ? divisor + modulus : modulus;
}

function unprojectFromTransform(transform, point) {
  return transform.pointLocation(_mapboxGl.Point.convert(point));
}

function cloneTransform(original) {
  var transform = new _transform2.default(original._minZoom, original._maxZoom);
  transform.latRange = original.latRange;
  transform.width = original.width;
  transform.height = original.height;
  transform.zoom = original.zoom;
  transform.center = original.center;
  transform.angle = original.angle;
  transform.altitude = original.altitude;
  transform.pitch = original.pitch;
  transform.bearing = original.bearing;
  transform.altitude = original.altitude;
  return transform;
}

MapGL.propTypes = PROP_TYPES;
MapGL.childContextTypes = CHILD_CONTEXT_TYPES;
MapGL.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAucmVhY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLElBQU0sWUFBWSxFQUFsQjtBQUNBLElBQU0sd0JBQXdCLEVBQTlCO0FBQ0EsSUFBTSxjQUFjLEdBQXBCOztBQUVBLElBQU0sYUFBYTs7OztBQUlqQixZQUFVLGlCQUFVLE1BQVYsQ0FBaUIsVUFKVjs7OztBQVFqQixhQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFSWDs7OztBQVlqQixRQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFaTjs7Ozs7QUFpQmpCLFlBQVUsaUJBQVUsU0FBVixDQUFvQixDQUM1QixpQkFBVSxNQURrQixFQUU1QixpQkFBVSxVQUFWLENBQXFCLG9CQUFVLEdBQS9CLENBRjRCLENBQXBCLENBakJPOzs7OztBQXlCakIsd0JBQXNCLGlCQUFVLE1BekJmOzs7Ozs7QUErQmpCLG9CQUFrQixpQkFBVSxJQS9CWDs7OztBQW1DakIsZUFBYSxpQkFBVSxJQW5DTjs7OztBQXVDakIsU0FBTyxpQkFBVSxTQUFWLENBQW9CLENBQ3pCLGlCQUFVLE1BRGUsRUFFekIsaUJBQVUsTUFGZSxDQUFwQixDQXZDVTs7OztBQThDakIsVUFBUSxpQkFBVSxTQUFWLENBQW9CLENBQzFCLGlCQUFVLE1BRGdCLEVBRTFCLGlCQUFVLE1BRmdCLENBQXBCLENBOUNTOzs7Ozs7QUF1RGpCLGNBQVksaUJBQVUsSUF2REw7Ozs7OztBQTZEakIsbUJBQWlCLGlCQUFVLEtBN0RWOzs7Ozs7OztBQXFFakIsbUJBQWlCLGlCQUFVLElBckVWOzs7Ozs7O0FBNEVqQix1QkFBcUIsaUJBQVUsSUE1RWQ7Ozs7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QTVCO0FBQ0EsWUFBVSxLQUFWLEdBQWtCLFNBQVMsS0FBM0I7QUFDQSxZQUFVLFFBQVYsR0FBcUIsU0FBUyxRQUE5QjtBQUNBLFlBQVUsS0FBVixHQUFrQixTQUFTLEtBQTNCO0FBQ0EsWUFBVSxPQUFWLEdBQW9CLFNBQVMsT0FBN0I7QUFDQSxZQUFVLFFBQVYsR0FBcUIsU0FBUyxRQUE5QjtBQUNBLFNBQU8sU0FBUDtBQUNEOztBQUVELE1BQU0sU0FBTixHQUFrQixVQUFsQjtBQUNBLE1BQU0saUJBQU4sR0FBMEIsbUJBQTFCO0FBQ0EsTUFBTSxZQUFOLEdBQXFCLGFBQXJCIiwiZmlsZSI6Im1hcC5yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXMsIENvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcic7XG5pbXBvcnQgcHVyZVJlbmRlciBmcm9tICdwdXJlLXJlbmRlci1kZWNvcmF0b3InO1xuaW1wb3J0IGQzIGZyb20gJ2QzJztcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBtYXBib3hnbCwge1BvaW50fSBmcm9tICdtYXBib3gtZ2wnO1xuXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBNYXBJbnRlcmFjdGlvbnMgZnJvbSAnLi9tYXAtaW50ZXJhY3Rpb25zLnJlYWN0JztcbmltcG9ydCBkaWZmU3R5bGVzIGZyb20gJy4vZGlmZi1zdHlsZXMnO1xuXG4vLyBOT1RFOiBUcmFuc2Zvcm0gaXMgbm90IGEgcHVibGljIEFQSSBzbyB3ZSBzaG91bGQgYmUgY2FyZWZ1bCB0byBhbHdheXMgbG9ja1xuLy8gZG93biBtYXBib3gtZ2wgdG8gYSBzcGVjaWZpYyBtYWpvciwgbWlub3IsIGFuZCBwYXRjaCB2ZXJzaW9uLlxuaW1wb3J0IFRyYW5zZm9ybSBmcm9tICdtYXBib3gtZ2wvanMvZ2VvL3RyYW5zZm9ybSc7XG5cbi8vIE5vdGU6IE1heCBwaXRjaCBpcyBhIGhhcmQgY29kZWQgdmFsdWUgKG5vdCBhIG5hbWVkIGNvbnN0YW50KSBpbiB0cmFuc2Zvcm0uanNcbmNvbnN0IE1BWF9QSVRDSCA9IDYwO1xuY29uc3QgUElUQ0hfTU9VU0VfVEhSRVNIT0xEID0gMjA7XG5jb25zdCBQSVRDSF9BQ0NFTCA9IDEuMjtcblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgLyoqXG4gICAgKiBUaGUgbGF0aXR1ZGUgb2YgdGhlIGNlbnRlciBvZiB0aGUgbWFwLlxuICAgICovXG4gIGxhdGl0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogVGhlIGxvbmdpdHVkZSBvZiB0aGUgY2VudGVyIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgbG9uZ2l0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogVGhlIHRpbGUgem9vbSBsZXZlbCBvZiB0aGUgbWFwLlxuICAgICovXG4gIHpvb206IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgTWFwYm94IHN0eWxlIHRoZSBjb21wb25lbnQgc2hvdWxkIHVzZS4gQ2FuIGVpdGhlciBiZSBhIHN0cmluZyB1cmxcbiAgICAqIG9yIGEgTWFwYm94R0wgc3R5bGUgSW1tdXRhYmxlLk1hcCBvYmplY3QuXG4gICAgKi9cbiAgbWFwU3R5bGU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcClcbiAgXSksXG4gIC8qKlxuICAgICogVGhlIE1hcGJveCBBUEkgYWNjZXNzIHRva2VuIHRvIHByb3ZpZGUgdG8gbWFwYm94LWdsLWpzLiBUaGlzIGlzIHJlcXVpcmVkXG4gICAgKiB3aGVuIHVzaW5nIE1hcGJveCBwcm92aWRlZCB2ZWN0b3IgdGlsZXMgYW5kIHN0eWxlcy5cbiAgICAqL1xuICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgLyoqXG4gICAgKiBgb25DaGFuZ2VWaWV3cG9ydGAgY2FsbGJhY2sgaXMgZmlyZWQgd2hlbiB0aGUgdXNlciBpbnRlcmFjdGVkIHdpdGggdGhlXG4gICAgKiBtYXAuIFRoZSBvYmplY3QgcGFzc2VkIHRvIHRoZSBjYWxsYmFjayBjb250YWluZXJzIGBsYXRpdHVkZWAsXG4gICAgKiBgbG9uZ2l0dWRlYCBhbmQgYHpvb21gIGluZm9ybWF0aW9uLlxuICAgICovXG4gIG9uQ2hhbmdlVmlld3BvcnQ6IFByb3BUeXBlcy5mdW5jLFxuICAvKipcbiAgICAqIGBvbk1hcExvYWRlZGAgY2FsbGJhY2sgaXMgZmlyZWQgb24gdGhlIG1hcCdzICdsb2FkJyBldmVudFxuICAgICovXG4gIG9uTWFwTG9hZGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgLyoqXG4gICAgKiBUaGUgd2lkdGggb2YgdGhlIG1hcC4gTnVtYmVyIGluIHBpeGVscyBvciBDU1Mgc3RyaW5nIHByb3AgZS5nLiAnMTAwJSdcbiAgICAqL1xuICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLm51bWJlcixcbiAgICBQcm9wVHlwZXMuc3RyaW5nXG4gIF0pLFxuICAvKipcbiAgICAqIFRoZSBoZWlnaHQgb2YgdGhlIG1hcC4gTnVtYmVyIGluIHBpeGVscyBvciBDU1Mgc3RyaW5nIHByb3AgZS5nLiAnMTAwJSdcbiAgICAqL1xuICBoZWlnaHQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5udW1iZXIsXG4gICAgUHJvcFR5cGVzLnN0cmluZ1xuICBdKSxcbiAgLyoqXG4gICAgKiBJcyB0aGUgY29tcG9uZW50IGN1cnJlbnRseSBiZWluZyBkcmFnZ2VkLiBUaGlzIGlzIHVzZWQgdG8gc2hvdy9oaWRlIHRoZVxuICAgICogZHJhZyBjdXJzb3IuIEFsc28gdXNlZCBhcyBhbiBvcHRpbWl6YXRpb24gaW4gc29tZSBvdmVybGF5cyBieSBwcmV2ZW50aW5nXG4gICAgKiByZW5kZXJpbmcgd2hpbGUgZHJhZ2dpbmcuXG4gICAgKi9cbiAgaXNEcmFnZ2luZzogUHJvcFR5cGVzLmJvb2wsXG4gIC8qKlxuICAgICogUmVxdWlyZWQgdG8gY2FsY3VsYXRlIHRoZSBtb3VzZSBwcm9qZWN0aW9uIGFmdGVyIHRoZSBmaXJzdCBjbGljayBldmVudFxuICAgICogZHVyaW5nIGRyYWdnaW5nLiBXaGVyZSB0aGUgbWFwIGlzIGRlcGVuZHMgb24gd2hlcmUgeW91IGZpcnN0IGNsaWNrZWQgb25cbiAgICAqIHRoZSBtYXAuXG4gICAgKi9cbiAgc3RhcnREcmFnTG5nTGF0OiBQcm9wVHlwZXMuYXJyYXksXG4gIC8qKlxuICAgICogQ2FsbGVkIHdoZW4gYSBmZWF0dXJlIGlzIGhvdmVyZWQgb3Zlci4gRmVhdHVyZXMgbXVzdCBzZXQgdGhlXG4gICAgKiBgaW50ZXJhY3RpdmVgIHByb3BlcnR5IHRvIGB0cnVlYCBmb3IgdGhpcyB0byB3b3JrIHByb3Blcmx5LiBzZWUgdGhlXG4gICAgKiBNYXBib3ggZXhhbXBsZTogaHR0cHM6Ly93d3cubWFwYm94LmNvbS9tYXBib3gtZ2wtanMvZXhhbXBsZS9mZWF0dXJlc2F0L1xuICAgICogVGhlIGZpcnN0IGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjayB3aWxsIGJlIHRoZSBhcnJheSBvZiBmZWF0dXJlIHRoZVxuICAgICogbW91c2UgaXMgb3Zlci4gVGhpcyBpcyB0aGUgc2FtZSByZXNwb25zZSByZXR1cm5lZCBmcm9tIGBmZWF0dXJlc0F0YC5cbiAgICAqL1xuICBvbkhvdmVyRmVhdHVyZXM6IFByb3BUeXBlcy5mdW5jLFxuICAvKipcbiAgICAqIERlZmF1bHRzIHRvIFRSVUVcbiAgICAqIFNldCB0byBmYWxzZSB0byBlbmFibGUgb25Ib3ZlckZlYXR1cmVzIHRvIGJlIGNhbGxlZCByZWdhcmRsZXNzIGlmXG4gICAgKiB0aGVyZSBpcyBhbiBhY3R1YWwgZmVhdHVyZSBhdCB4LCB5LiBUaGlzIGlzIHVzZWZ1bCB0byBlbXVsYXRlXG4gICAgKiBcIm1vdXNlLW91dFwiIGJlaGF2aW9ycyBvbiBmZWF0dXJlcy5cbiAgICAqL1xuICBpZ25vcmVFbXB0eUZlYXR1cmVzOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIFNob3cgYXR0cmlidXRpb24gY29udHJvbCBvciBub3QuXG4gICAgKi9cbiAgYXR0cmlidXRpb25Db250cm9sOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIENhbGxlZCB3aGVuIGEgZmVhdHVyZSBpcyBjbGlja2VkIG9uLiBGZWF0dXJlcyBtdXN0IHNldCB0aGVcbiAgICAqIGBpbnRlcmFjdGl2ZWAgcHJvcGVydHkgdG8gYHRydWVgIGZvciB0aGlzIHRvIHdvcmsgcHJvcGVybHkuIHNlZSB0aGVcbiAgICAqIE1hcGJveCBleGFtcGxlOiBodHRwczovL3d3dy5tYXBib3guY29tL21hcGJveC1nbC1qcy9leGFtcGxlL2ZlYXR1cmVzYXQvXG4gICAgKiBUaGUgZmlyc3QgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrIHdpbGwgYmUgdGhlIGFycmF5IG9mIGZlYXR1cmUgdGhlXG4gICAgKiBtb3VzZSBpcyBvdmVyLiBUaGlzIGlzIHRoZSBzYW1lIHJlc3BvbnNlIHJldHVybmVkIGZyb20gYGZlYXR1cmVzQXRgLlxuICAgICovXG4gIG9uQ2xpY2tGZWF0dXJlczogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAgKiBQYXNzZWQgdG8gTWFwYm94IE1hcCBjb25zdHJ1Y3RvciB3aGljaCBwYXNzZXMgaXQgdG8gdGhlIGNhbnZhcyBjb250ZXh0LlxuICAgICogVGhpcyBpcyB1bnNlZnVsIHdoZW4geW91IHdhbnQgdG8gZXhwb3J0IHRoZSBjYW52YXMgYXMgYSBQTkcuXG4gICAgKi9cbiAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIFRoZXJlIGFyZSBzdGlsbCBrbm93biBpc3N1ZXMgd2l0aCBzdHlsZSBkaWZmaW5nLiBBcyBhIHRlbXBvcmFyeSBzdG9wZ2FwLFxuICAgICogYWRkIHRoZSBvcHRpb24gdG8gcHJldmVudCBzdHlsZSBkaWZmaW5nLlxuICAgICovXG4gIHByZXZlbnRTdHlsZURpZmZpbmc6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogRW5hYmxlcyBwZXJzcGVjdGl2ZSBjb250cm9sIGV2ZW50IGhhbmRsaW5nIChDb21tYW5kLXJvdGF0ZSlcbiAgICAqL1xuICBwZXJzcGVjdGl2ZUVuYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogU3BlY2lmeSB0aGUgYmVhcmluZyBvZiB0aGUgdmlld3BvcnRcbiAgICAqL1xuICBiZWFyaW5nOiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgICogU3BlY2lmeSB0aGUgcGl0Y2ggb2YgdGhlIHZpZXdwb3J0XG4gICAgKi9cbiAgcGl0Y2g6IFByb3BUeXBlcy5udW1iZXIsXG5cbiAgLyoqXG4gICAgKiBTcGVjaWZ5IHRoZSBhbHRpdHVkZSBvZiB0aGUgdmlld3BvcnQgY2FtZXJhXG4gICAgKiBVbml0OiBtYXAgaGVpZ2h0cywgZGVmYXVsdCAxLjVcbiAgICAqIE5vbi1wdWJsaWMgQVBJLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21hcGJveC9tYXBib3gtZ2wtanMvaXNzdWVzLzExMzdcbiAgICAqL1xuICBhbHRpdHVkZTogUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICAqIERpc2FibGVkIGRyYWdnaW5nIG9mIHRoZSBtYXBcbiAgICAqL1xuICBkcmFnRGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogRGlzYWJsZWQgem9vbWluZyBvZiB0aGUgbWFwXG4gICAgKi9cbiAgem9vbURpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIEJvdW5kcyB0byBmaXQgb24gc2NyZWVuXG4gICAgKi9cbiAgYm91bmRzOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdClcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIG1hcFN0eWxlOiAnbWFwYm94Oi8vc3R5bGVzL21hcGJveC9saWdodC12OCcsXG4gIG9uQ2hhbmdlVmlld3BvcnQ6IG51bGwsXG4gIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBjb25maWcuREVGQVVMVFMuTUFQQk9YX0FQSV9BQ0NFU1NfVE9LRU4sXG4gIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogZmFsc2UsXG4gIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSxcbiAgaWdub3JlRW1wdHlGZWF0dXJlczogdHJ1ZSxcbiAgYmVhcmluZzogMCxcbiAgcGl0Y2g6IDAsXG4gIGFsdGl0dWRlOiAxLjVcbn07XG5cbmNvbnN0IENISUxEX0NPTlRFWFRfVFlQRVMgPSB7XG4gIG1hcDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxufTtcblxuQHB1cmVSZW5kZXJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcEdMIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBzdGFydERyYWdMbmdMYXQ6IG51bGwsXG4gICAgICBzdGFydEJlYXJpbmc6IG51bGwsXG4gICAgICBzdGFydFBpdGNoOiBudWxsXG4gICAgfTtcbiAgICBtYXBib3hnbC5hY2Nlc3NUb2tlbiA9IHByb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VuO1xuXG4gICAgdGhpcy5fbWFwUmVhZHkgPSBmYWxzZTtcblxuICAgIHRoaXMuZ2V0Q2hpbGRDb250ZXh0ID0gKCkgPT4gKHtcbiAgICAgIG1hcDogdGhpcy5fbWFwXG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCBtYXBTdHlsZSA9IHRoaXMucHJvcHMubWFwU3R5bGUgaW5zdGFuY2VvZiBJbW11dGFibGUuTWFwID9cbiAgICAgIHRoaXMucHJvcHMubWFwU3R5bGUudG9KUygpIDpcbiAgICAgIHRoaXMucHJvcHMubWFwU3R5bGU7XG4gICAgY29uc3QgbWFwID0gbmV3IG1hcGJveGdsLk1hcCh7XG4gICAgICBjb250YWluZXI6IHRoaXMucmVmcy5tYXBib3hNYXAsXG4gICAgICBjZW50ZXI6IFt0aGlzLnByb3BzLmxvbmdpdHVkZSwgdGhpcy5wcm9wcy5sYXRpdHVkZV0sXG4gICAgICB6b29tOiB0aGlzLnByb3BzLnpvb20sXG4gICAgICBwaXRjaDogdGhpcy5wcm9wcy5waXRjaCxcbiAgICAgIGJlYXJpbmc6IHRoaXMucHJvcHMuYmVhcmluZyxcbiAgICAgIHN0eWxlOiBtYXBTdHlsZSxcbiAgICAgIGludGVyYWN0aXZlOiBmYWxzZSxcbiAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdGhpcy5wcm9wcy5wcmVzZXJ2ZURyYXdpbmdCdWZmZXJcbiAgICAgIC8vIFRPRE8/XG4gICAgICAvLyBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRoaXMucHJvcHMuYXR0cmlidXRpb25Db250cm9sXG4gICAgfSk7XG5cbiAgICBkMy5zZWxlY3QobWFwLmdldENhbnZhcygpKS5zdHlsZSgnb3V0bGluZScsICdub25lJyk7XG5cbiAgICB0aGlzLl9tYXAgPSBtYXA7XG4gICAgdGhpcy5fdXBkYXRlTWFwVmlld3BvcnQoe30sIHRoaXMucHJvcHMpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0pO1xuXG4gICAgaWYgKHRoaXMucHJvcHMub25NYXBMb2FkZWQpIHtcbiAgICAgIG1hcC5vbignbG9hZCcsICgpID0+IHRoaXMucHJvcHMub25NYXBMb2FkZWQobWFwKSk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydCBmb3IgZXh0ZXJuYWwgbWFuaXB1bGF0aW9uIG9mIHVuZGVybHlpbmcgbWFwXG4gICAgLy8gVE9ETyBhIGJldHRlciBhcHByb2FjaFxuICAgIG1hcC5vbignc3R5bGUubG9hZCcsICgpID0+IHRoaXMuX21hcFJlYWR5ID0gdHJ1ZSk7XG4gICAgbWFwLm9uKCdtb3ZlZW5kJywgKCkgPT4gdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSkpO1xuICAgIG1hcC5vbignem9vbWVuZCcsICgpID0+IHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0pKTtcbiAgfVxuXG4gIC8vIE5ldyBwcm9wcyBhcmUgY29taW4nIHJvdW5kIHRoZSBjb3JuZXIhXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV3UHJvcHMpIHtcbiAgICB0aGlzLl91cGRhdGVTdGF0ZUZyb21Qcm9wcyh0aGlzLnByb3BzLCBuZXdQcm9wcyk7XG4gICAgdGhpcy5fdXBkYXRlTWFwVmlld3BvcnQodGhpcy5wcm9wcywgbmV3UHJvcHMpO1xuICAgIHRoaXMuX3VwZGF0ZU1hcFN0eWxlKHRoaXMucHJvcHMsIG5ld1Byb3BzKTtcbiAgICAvLyBTYXZlIHdpZHRoL2hlaWdodCBzbyB0aGF0IHdlIGNhbiBjaGVjayB0aGVtIGluIGNvbXBvbmVudERpZFVwZGF0ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgLy8gbWFwLnJlc2l6ZSgpIHJlYWRzIHNpemUgZnJvbSBET00sIHdlIG5lZWQgdG8gY2FsbCBhZnRlciByZW5kZXJcbiAgICB0aGlzLl91cGRhdGVNYXBTaXplKHRoaXMuc3RhdGUsIHRoaXMucHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuX21hcCkge1xuICAgICAgdGhpcy5fbWFwLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIF9jdXJzb3IoKSB7XG4gICAgY29uc3QgaXNJbnRlcmFjdGl2ZSA9XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQgfHxcbiAgICAgIHRoaXMucHJvcHMub25DbGlja0ZlYXR1cmUgfHxcbiAgICAgIHRoaXMucHJvcHMub25Ib3ZlckZlYXR1cmVzO1xuICAgIGlmIChpc0ludGVyYWN0aXZlKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5pc0RyYWdnaW5nID9cbiAgICAgICAgY29uZmlnLkNVUlNPUi5HUkFCQklORyA6IGNvbmZpZy5DVVJTT1IuR1JBQjtcbiAgICB9XG4gICAgcmV0dXJuICdpbmhlcml0JztcbiAgfVxuXG4gIF9nZXRNYXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcDtcbiAgfVxuXG4gIF91cGRhdGVTdGF0ZUZyb21Qcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBtYXBib3hnbC5hY2Nlc3NUb2tlbiA9IG5ld1Byb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VuO1xuICAgIGNvbnN0IHtzdGFydERyYWdMbmdMYXR9ID0gbmV3UHJvcHM7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGFydERyYWdMbmdMYXQ6IHN0YXJ0RHJhZ0xuZ0xhdCAmJiBzdGFydERyYWdMbmdMYXQuc2xpY2UoKVxuICAgIH0pO1xuICB9XG5cbiAgLy8gSW5kaXZpZHVhbGx5IHVwZGF0ZSB0aGUgbWFwcyBzb3VyY2UgYW5kIGxheWVycyB0aGF0IGhhdmUgY2hhbmdlZCBpZiBhbGxcbiAgLy8gb3RoZXIgc3R5bGUgcHJvcHMgaGF2ZW4ndCBjaGFuZ2VkLiBUaGlzIHByZXZlbnRzIGZsaWNraW5nIG9mIHRoZSBtYXAgd2hlblxuICAvLyBzdHlsZXMgb25seSBjaGFuZ2Ugc291cmNlcyBvciBsYXllcnMuXG4gIF9zZXREaWZmU3R5bGUocHJldlN0eWxlLCBuZXh0U3R5bGUpIHtcbiAgICBjb25zdCBwcmV2S2V5c01hcCA9IHByZXZTdHlsZSAmJiBzdHlsZUtleXNNYXAocHJldlN0eWxlKSB8fCB7fTtcbiAgICBjb25zdCBuZXh0S2V5c01hcCA9IHN0eWxlS2V5c01hcChuZXh0U3R5bGUpO1xuICAgIGZ1bmN0aW9uIHN0eWxlS2V5c01hcChzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlLm1hcCgoKSA9PiB0cnVlKS5kZWxldGUoJ2xheWVycycpLmRlbGV0ZSgnc291cmNlcycpLnRvSlMoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcHJvcHNPdGhlclRoYW5MYXllcnNPclNvdXJjZXNEaWZmZXIoKSB7XG4gICAgICBjb25zdCBwcmV2S2V5c0xpc3QgPSBPYmplY3Qua2V5cyhwcmV2S2V5c01hcCk7XG4gICAgICBjb25zdCBuZXh0S2V5c0xpc3QgPSBPYmplY3Qua2V5cyhuZXh0S2V5c01hcCk7XG4gICAgICBpZiAocHJldktleXNMaXN0Lmxlbmd0aCAhPT0gbmV4dEtleXNMaXN0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIGBuZXh0U3R5bGVgIGFuZCBgcHJldlN0eWxlYCBzaG91bGQgbm90IGhhdmUgdGhlIHNhbWUgc2V0IG9mIHByb3BzLlxuICAgICAgaWYgKG5leHRLZXlzTGlzdC5zb21lKFxuICAgICAgICBrZXkgPT4gcHJldlN0eWxlLmdldChrZXkpICE9PSBuZXh0U3R5bGUuZ2V0KGtleSlcbiAgICAgICAgLy8gQnV0IHRoZSB2YWx1ZSBvZiBvbmUgb2YgdGhvc2UgcHJvcHMgaXMgZGlmZmVyZW50LlxuICAgICAgKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcblxuICAgIGlmICghcHJldlN0eWxlIHx8IHByb3BzT3RoZXJUaGFuTGF5ZXJzT3JTb3VyY2VzRGlmZmVyKCkpIHtcbiAgICAgIG1hcC5zZXRTdHlsZShuZXh0U3R5bGUudG9KUygpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7c291cmNlc0RpZmYsIGxheWVyc0RpZmZ9ID0gZGlmZlN0eWxlcyhwcmV2U3R5bGUsIG5leHRTdHlsZSk7XG5cbiAgICAvLyBUT0RPOiBJdCdzIHJhdGhlciBkaWZmaWN1bHQgdG8gZGV0ZXJtaW5lIHN0eWxlIGRpZmZpbmcgaW4gdGhlIHByZXNlbmNlXG4gICAgLy8gb2YgcmVmcy4gRm9yIG5vdywgaWYgYW55IHN0eWxlIHVwZGF0ZSBoYXMgYSByZWYsIGZhbGxiYWNrIHRvIG5vIGRpZmZpbmcuXG4gICAgLy8gV2UgY2FuIGNvbWUgYmFjayB0byB0aGlzIGNhc2UgaWYgdGhlcmUncyBhIHNvbGlkIHVzZWNhc2UuXG4gICAgaWYgKGxheWVyc0RpZmYudXBkYXRlcy5zb21lKG5vZGUgPT4gbm9kZS5sYXllci5nZXQoJ3JlZicpKSkge1xuICAgICAgbWFwLnNldFN0eWxlKG5leHRTdHlsZS50b0pTKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZW50ZXIgb2Ygc291cmNlc0RpZmYuZW50ZXIpIHtcbiAgICAgIG1hcC5hZGRTb3VyY2UoZW50ZXIuaWQsIGVudGVyLnNvdXJjZS50b0pTKCkpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHVwZGF0ZSBvZiBzb3VyY2VzRGlmZi51cGRhdGUpIHtcbiAgICAgIG1hcC5yZW1vdmVTb3VyY2UodXBkYXRlLmlkKTtcbiAgICAgIG1hcC5hZGRTb3VyY2UodXBkYXRlLmlkLCB1cGRhdGUuc291cmNlLnRvSlMoKSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZXhpdCBvZiBzb3VyY2VzRGlmZi5leGl0KSB7XG4gICAgICBtYXAucmVtb3ZlU291cmNlKGV4aXQuaWQpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGV4aXQgb2YgbGF5ZXJzRGlmZi5leGl0aW5nKSB7XG4gICAgICBpZiAobWFwLnN0eWxlLmdldExheWVyKGV4aXQuaWQpKSB7XG4gICAgICAgIG1hcC5yZW1vdmVMYXllcihleGl0LmlkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCB1cGRhdGUgb2YgbGF5ZXJzRGlmZi51cGRhdGVzKSB7XG4gICAgICBpZiAoIXVwZGF0ZS5lbnRlcikge1xuICAgICAgICAvLyBUaGlzIGlzIGFuIG9sZCBsYXllciB0aGF0IG5lZWRzIHRvIGJlIHVwZGF0ZWQuIFJlbW92ZSB0aGUgb2xkIGxheWVyXG4gICAgICAgIC8vIHdpdGggdGhlIHNhbWUgaWQgYW5kIGFkZCBpdCBiYWNrIGFnYWluLlxuICAgICAgICBtYXAucmVtb3ZlTGF5ZXIodXBkYXRlLmlkKTtcbiAgICAgIH1cbiAgICAgIG1hcC5hZGRMYXllcih1cGRhdGUubGF5ZXIudG9KUygpLCB1cGRhdGUuYmVmb3JlKTtcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlTWFwU3R5bGUob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgY29uc3QgbWFwU3R5bGUgPSBuZXdQcm9wcy5tYXBTdHlsZTtcbiAgICBjb25zdCBvbGRNYXBTdHlsZSA9IG9sZFByb3BzLm1hcFN0eWxlO1xuICAgIGlmIChtYXBTdHlsZSAhPT0gb2xkTWFwU3R5bGUpIHtcbiAgICAgIGlmIChtYXBTdHlsZSBpbnN0YW5jZW9mIEltbXV0YWJsZS5NYXApIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMucHJldmVudFN0eWxlRGlmZmluZykge1xuICAgICAgICAgIHRoaXMuX2dldE1hcCgpLnNldFN0eWxlKG1hcFN0eWxlLnRvSlMoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fc2V0RGlmZlN0eWxlKG9sZE1hcFN0eWxlLCBtYXBTdHlsZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2dldE1hcCgpLnNldFN0eWxlKG1hcFN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfdXBkYXRlTWFwVmlld3BvcnQob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgY29uc3Qgdmlld3BvcnRDaGFuZ2VkID1cbiAgICAgIG5ld1Byb3BzLmxhdGl0dWRlICE9PSBvbGRQcm9wcy5sYXRpdHVkZSB8fFxuICAgICAgbmV3UHJvcHMubG9uZ2l0dWRlICE9PSBvbGRQcm9wcy5sb25naXR1ZGUgfHxcbiAgICAgIG5ld1Byb3BzLnpvb20gIT09IG9sZFByb3BzLnpvb20gfHxcbiAgICAgIG5ld1Byb3BzLnBpdGNoICE9PSBvbGRQcm9wcy5waXRjaCB8fFxuICAgICAgbmV3UHJvcHMuYmVhcmluZyAhPT0gb2xkUHJvcHMuYmVhcmluZyB8fFxuICAgICAgbmV3UHJvcHMuYWx0aXR1ZGUgIT09IG9sZFByb3BzLmFsdGl0dWRlO1xuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG5cbiAgICBpZiAodmlld3BvcnRDaGFuZ2VkKSB7XG4gICAgICBtYXAuanVtcFRvKHtcbiAgICAgICAgY2VudGVyOiBbbmV3UHJvcHMubG9uZ2l0dWRlLCBuZXdQcm9wcy5sYXRpdHVkZV0sXG4gICAgICAgIHpvb206IG5ld1Byb3BzLnpvb20sXG4gICAgICAgIGJlYXJpbmc6IG5ld1Byb3BzLmJlYXJpbmcsXG4gICAgICAgIHBpdGNoOiBuZXdQcm9wcy5waXRjaFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRPRE8gLSBqdW1wVG8gZG9lc24ndCBoYW5kbGUgYWx0aXR1ZGVcbiAgICAgIGlmIChuZXdQcm9wcy5hbHRpdHVkZSAhPT0gb2xkUHJvcHMuYWx0aXR1ZGUpIHtcbiAgICAgICAgbWFwLnRyYW5zZm9ybS5hbHRpdHVkZSA9IG5ld1Byb3BzLmFsdGl0dWRlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvbGRQcm9wcy5ib3VuZHMgIT09IG5ld1Byb3BzLmJvdW5kcyAmJiBuZXdQcm9wcy5ib3VuZHMpIHtcbiAgICAgIG1hcC5maXRCb3VuZHMobmV3UHJvcHMuYm91bmRzLnRvSlMoKSwge3BhZGRpbmc6IDQ1LCBtYXhab29tOiAxOX0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5vdGU6IG5lZWRzIHRvIGJlIGNhbGxlZCBhZnRlciByZW5kZXIgKGUuZy4gaW4gY29tcG9uZW50RGlkVXBkYXRlKVxuICBfdXBkYXRlTWFwU2l6ZShvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBjb25zdCBzaXplQ2hhbmdlZCA9XG4gICAgICBvbGRQcm9wcy53aWR0aCAhPT0gbmV3UHJvcHMud2lkdGggfHwgb2xkUHJvcHMuaGVpZ2h0ICE9PSBuZXdQcm9wcy5oZWlnaHQ7XG5cbiAgICBpZiAoc2l6ZUNoYW5nZWQpIHtcbiAgICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgICAgbWFwLnJlc2l6ZSgpO1xuICAgICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSk7XG4gICAgfVxuICB9XG5cbiAgX2NhbGN1bGF0ZU5ld1BpdGNoQW5kQmVhcmluZyh7cG9zLCBzdGFydFBvcywgc3RhcnRCZWFyaW5nLCBzdGFydFBpdGNofSkge1xuICAgIGNvbnN0IHhEZWx0YSA9IHBvcy54IC0gc3RhcnRQb3MueDtcbiAgICBjb25zdCBiZWFyaW5nID0gc3RhcnRCZWFyaW5nICsgMTgwICogeERlbHRhIC8gdGhpcy5wcm9wcy53aWR0aDtcblxuICAgIGxldCBwaXRjaCA9IHN0YXJ0UGl0Y2g7XG4gICAgY29uc3QgeURlbHRhID0gcG9zLnkgLSBzdGFydFBvcy55O1xuICAgIGlmICh5RGVsdGEgPiAwKSB7XG4gICAgICAvLyBEcmFnZ2luZyBkb3dud2FyZHMsIGdyYWR1YWxseSBkZWNyZWFzZSBwaXRjaFxuICAgICAgaWYgKE1hdGguYWJzKHRoaXMucHJvcHMuaGVpZ2h0IC0gc3RhcnRQb3MueSkgPiBQSVRDSF9NT1VTRV9USFJFU0hPTEQpIHtcbiAgICAgICAgY29uc3Qgc2NhbGUgPSB5RGVsdGEgLyAodGhpcy5wcm9wcy5oZWlnaHQgLSBzdGFydFBvcy55KTtcbiAgICAgICAgcGl0Y2ggPSAoMSAtIHNjYWxlKSAqIFBJVENIX0FDQ0VMICogc3RhcnRQaXRjaDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHlEZWx0YSA8IDApIHtcbiAgICAgIC8vIERyYWdnaW5nIHVwd2FyZHMsIGdyYWR1YWxseSBpbmNyZWFzZSBwaXRjaFxuICAgICAgaWYgKHN0YXJ0UG9zLnkgPiBQSVRDSF9NT1VTRV9USFJFU0hPTEQpIHtcbiAgICAgICAgLy8gTW92ZSBmcm9tIDAgdG8gMSBhcyB3ZSBkcmFnIHVwd2FyZHNcbiAgICAgICAgY29uc3QgeVNjYWxlID0gMSAtIHBvcy55IC8gc3RhcnRQb3MueTtcbiAgICAgICAgLy8gR3JhZHVhbGx5IGFkZCB1bnRpbCB3ZSBoaXQgbWF4IHBpdGNoXG4gICAgICAgIHBpdGNoID0gc3RhcnRQaXRjaCArIHlTY2FsZSAqIChNQVhfUElUQ0ggLSBzdGFydFBpdGNoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmRlYnVnKHN0YXJ0UGl0Y2gsIHBpdGNoKTtcbiAgICByZXR1cm4ge1xuICAgICAgcGl0Y2g6IE1hdGgubWF4KE1hdGgubWluKHBpdGNoLCBNQVhfUElUQ0gpLCAwKSxcbiAgICAgIGJlYXJpbmdcbiAgICB9O1xuICB9XG5cbiAgIC8vIEhlbHBlciB0byBjYWxsIHByb3BzLm9uQ2hhbmdlVmlld3BvcnRcbiAgX2NhbGxPbkNoYW5nZVZpZXdwb3J0KHRyYW5zZm9ybSwgb3B0cyA9IHt9KSB7XG4gICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCkge1xuICAgICAgY29uc3Qge3Njcm9sbEhlaWdodDogaGVpZ2h0LCBzY3JvbGxXaWR0aDogd2lkdGh9ID0gdGhpcy5fZ2V0TWFwKCkuZ2V0Q29udGFpbmVyKCk7XG5cbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCh7XG4gICAgICAgIGxhdGl0dWRlOiB0cmFuc2Zvcm0uY2VudGVyLmxhdCxcbiAgICAgICAgbG9uZ2l0dWRlOiBtb2QodHJhbnNmb3JtLmNlbnRlci5sbmcgKyAxODAsIDM2MCkgLSAxODAsXG4gICAgICAgIHpvb206IHRyYW5zZm9ybS56b29tLFxuICAgICAgICBwaXRjaDogdHJhbnNmb3JtLnBpdGNoLFxuICAgICAgICBiZWFyaW5nOiBtb2QodHJhbnNmb3JtLmJlYXJpbmcgKyAxODAsIDM2MCkgLSAxODAsXG5cbiAgICAgICAgaXNEcmFnZ2luZzogdGhpcy5wcm9wcy5pc0RyYWdnaW5nLFxuICAgICAgICBzdGFydERyYWdMbmdMYXQ6IHRoaXMucHJvcHMuc3RhcnREcmFnTG5nTGF0LFxuICAgICAgICBzdGFydEJlYXJpbmc6IHRoaXMucHJvcHMuc3RhcnRCZWFyaW5nLFxuICAgICAgICBzdGFydFBpdGNoOiB0aGlzLnByb3BzLnN0YXJ0UGl0Y2gsXG5cbiAgICAgICAgcHJvamVjdGlvbk1hdHJpeDogdHJhbnNmb3JtLnByb2pNYXRyaXgsXG5cbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICB3aWR0aCxcblxuICAgICAgICAuLi5vcHRzXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VEb3duKHtwb3N9KSB7XG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgY29uc3QgbG5nTGF0ID0gdW5wcm9qZWN0RnJvbVRyYW5zZm9ybShtYXAudHJhbnNmb3JtLCBwb3MpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWUsXG4gICAgICBzdGFydERyYWdMbmdMYXQ6IFtsbmdMYXQubG5nLCBsbmdMYXQubGF0XSxcbiAgICAgIHN0YXJ0QmVhcmluZzogbWFwLnRyYW5zZm9ybS5iZWFyaW5nLFxuICAgICAgc3RhcnRQaXRjaDogbWFwLnRyYW5zZm9ybS5waXRjaFxuICAgIH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlRHJhZyh7cG9zfSkge1xuICAgIGlmICghdGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0IHx8IHRoaXMucHJvcHMuZHJhZ0Rpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdGFrZSB0aGUgc3RhcnQgbG5nbGF0IGFuZCBwdXQgaXQgd2hlcmUgdGhlIG1vdXNlIGlzIGRvd24uXG4gICAgYXNzZXJ0KHRoaXMucHJvcHMuc3RhcnREcmFnTG5nTGF0LCAnYHN0YXJ0RHJhZ0xuZ0xhdGAgcHJvcCBpcyByZXF1aXJlZCAnICtcbiAgICAgICdmb3IgbW91c2UgZHJhZyBiZWhhdmlvciB0byBjYWxjdWxhdGUgd2hlcmUgdG8gcG9zaXRpb24gdGhlIG1hcC4nKTtcblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGNsb25lVHJhbnNmb3JtKG1hcC50cmFuc2Zvcm0pO1xuICAgIHRyYW5zZm9ybS5zZXRMb2NhdGlvbkF0UG9pbnQodGhpcy5wcm9wcy5zdGFydERyYWdMbmdMYXQsIHBvcyk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQodHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VSb3RhdGUoe3Bvcywgc3RhcnRQb3N9KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQgfHwgIXRoaXMucHJvcHMucGVyc3BlY3RpdmVFbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge3N0YXJ0QmVhcmluZywgc3RhcnRQaXRjaH0gPSB0aGlzLnByb3BzO1xuICAgIGFzc2VydCh0eXBlb2Ygc3RhcnRCZWFyaW5nID09PSAnbnVtYmVyJyxcbiAgICAgICdgc3RhcnRCZWFyaW5nYCBwcm9wIGlzIHJlcXVpcmVkIGZvciBtb3VzZSByb3RhdGUgYmVoYXZpb3InKTtcbiAgICBhc3NlcnQodHlwZW9mIHN0YXJ0UGl0Y2ggPT09ICdudW1iZXInLFxuICAgICAgJ2BzdGFydFBpdGNoYCBwcm9wIGlzIHJlcXVpcmVkIGZvciBtb3VzZSByb3RhdGUgYmVoYXZpb3InKTtcblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuXG4gICAgY29uc3Qge3BpdGNoLCBiZWFyaW5nfSA9IHRoaXMuX2NhbGN1bGF0ZU5ld1BpdGNoQW5kQmVhcmluZyh7XG4gICAgICBwb3MsXG4gICAgICBzdGFydFBvcyxcbiAgICAgIHN0YXJ0QmVhcmluZyxcbiAgICAgIHN0YXJ0UGl0Y2hcbiAgICB9KTtcblxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGNsb25lVHJhbnNmb3JtKG1hcC50cmFuc2Zvcm0pO1xuICAgIHRyYW5zZm9ybS5iZWFyaW5nID0gYmVhcmluZztcbiAgICB0cmFuc2Zvcm0ucGl0Y2ggPSBwaXRjaDtcblxuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KHRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlTW92ZShvcHQpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMub25Ib3ZlckZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgY29uc3QgcG9zID0gb3B0LnBvcztcblxuICAgIGNvbnN0IGZlYXR1cmVzID0gbWFwLnF1ZXJ5UmVuZGVyZWRGZWF0dXJlcyhbcG9zLngsIHBvcy55XSk7XG4gICAgaWYgKCFmZWF0dXJlcy5sZW5ndGggJiYgdGhpcy5wcm9wcy5pZ25vcmVFbXB0eUZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMub25Ib3ZlckZlYXR1cmVzKGZlYXR1cmVzKTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZVVwKG9wdCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5vbkNsaWNrRmVhdHVyZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiBmYWxzZSxcbiAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogbnVsbCxcbiAgICAgIHN0YXJ0QmVhcmluZzogbnVsbCxcbiAgICAgIHN0YXJ0UGl0Y2g6IG51bGxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBvcyA9IG9wdC5wb3M7XG5cbiAgICAvLyBSYWRpdXMgZW5hYmxlcyBwb2ludCBmZWF0dXJlcywgbGlrZSBtYXJrZXIgc3ltYm9scywgdG8gYmUgY2xpY2tlZC5cbiAgICBjb25zdCBzaXplID0gMTU7XG4gICAgY29uc3QgYmJveCA9IFtbcG9zLnggLSBzaXplLCBwb3MueSAtIHNpemVdLCBbcG9zLnggKyBzaXplLCBwb3MueSArIHNpemVdXTtcbiAgICBjb25zdCBmZWF0dXJlcyA9IG1hcC5xdWVyeVJlbmRlcmVkRmVhdHVyZXMoYmJveCk7XG4gICAgaWYgKCFmZWF0dXJlcy5sZW5ndGggJiYgdGhpcy5wcm9wcy5pZ25vcmVFbXB0eUZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMub25DbGlja0ZlYXR1cmVzKGZlYXR1cmVzKTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25ab29tKHtwb3MsIHNjYWxlfSkge1xuICAgIGlmICh0aGlzLnByb3BzLnpvb21EaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGNsb25lVHJhbnNmb3JtKG1hcC50cmFuc2Zvcm0pO1xuICAgIGNvbnN0IGFyb3VuZCA9IHVucHJvamVjdEZyb21UcmFuc2Zvcm0odHJhbnNmb3JtLCBwb3MpO1xuICAgIHRyYW5zZm9ybS56b29tID0gdHJhbnNmb3JtLnNjYWxlWm9vbShtYXAudHJhbnNmb3JtLnNjYWxlICogc2NhbGUpO1xuICAgIHRyYW5zZm9ybS5zZXRMb2NhdGlvbkF0UG9pbnQoYXJvdW5kLCBwb3MpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KHRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vblpvb21FbmQoKSB7XG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7Y2xhc3NOYW1lLCB3aWR0aCwgaGVpZ2h0LCBzdHlsZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IG1hcFN0eWxlID0ge1xuICAgICAgLi4uc3R5bGUsXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGN1cnNvcjogdGhpcy5fY3Vyc29yKClcbiAgICB9O1xuXG4gICAgbGV0IGNvbnRlbnQgPSBbXG4gICAgICA8ZGl2IGtleT1cIm1hcFwiIHJlZj1cIm1hcGJveE1hcFwiXG4gICAgICAgIHN0eWxlPXsgbWFwU3R5bGUgfSBjbGFzc05hbWU9eyBjbGFzc05hbWUgfS8+LFxuICAgICAgPGRpdiBrZXk9XCJvdmVybGF5c1wiIGNsYXNzTmFtZT1cIm92ZXJsYXlzXCJcbiAgICAgICAgc3R5bGU9eyB7cG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IDAsIHRvcDogMH0gfT5cbiAgICAgICAgeyB0aGlzLnByb3BzLmNoaWxkcmVuIH1cbiAgICAgIDwvZGl2PlxuICAgIF07XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0KSB7XG4gICAgICBjb250ZW50ID0gKFxuICAgICAgICA8TWFwSW50ZXJhY3Rpb25zXG4gICAgICAgICAgb25Nb3VzZURvd24gPXsgdGhpcy5fb25Nb3VzZURvd24gfVxuICAgICAgICAgIG9uTW91c2VEcmFnID17IHRoaXMuX29uTW91c2VEcmFnIH1cbiAgICAgICAgICBvbk1vdXNlUm90YXRlID17IHRoaXMuX29uTW91c2VSb3RhdGUgfVxuICAgICAgICAgIG9uTW91c2VVcCA9eyB0aGlzLl9vbk1vdXNlVXAgfVxuICAgICAgICAgIG9uTW91c2VNb3ZlID17IHRoaXMuX29uTW91c2VNb3ZlIH1cbiAgICAgICAgICBvblpvb20gPXsgdGhpcy5fb25ab29tIH1cbiAgICAgICAgICBvblpvb21FbmQgPXsgdGhpcy5fb25ab29tRW5kIH1cbiAgICAgICAgICB3aWR0aCA9eyB0aGlzLnByb3BzLndpZHRoIH1cbiAgICAgICAgICBoZWlnaHQgPXsgdGhpcy5wcm9wcy5oZWlnaHQgfVxuICAgICAgICAgIHpvb21EaXNhYmxlZCA9eyB0aGlzLnByb3BzLnpvb21EaXNhYmxlZCB9XG4gICAgICAgICAgZHJhZ0Rpc2FibGVkID17IHRoaXMucHJvcHMuZHJhZ0Rpc2FibGVkIH0+XG5cbiAgICAgICAgICB7IGNvbnRlbnQgfVxuXG4gICAgICAgIDwvTWFwSW50ZXJhY3Rpb25zPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17IHtcbiAgICAgICAgICAuLi50aGlzLnByb3BzLnN0eWxlLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgfSB9PlxuXG4gICAgICAgIHsgY29udGVudCB9XG5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbW9kKHZhbHVlLCBkaXZpc29yKSB7XG4gIGNvbnN0IG1vZHVsdXMgPSB2YWx1ZSAlIGRpdmlzb3I7XG4gIHJldHVybiBtb2R1bHVzIDwgMCA/IGRpdmlzb3IgKyBtb2R1bHVzIDogbW9kdWx1cztcbn1cblxuZnVuY3Rpb24gdW5wcm9qZWN0RnJvbVRyYW5zZm9ybSh0cmFuc2Zvcm0sIHBvaW50KSB7XG4gIHJldHVybiB0cmFuc2Zvcm0ucG9pbnRMb2NhdGlvbihQb2ludC5jb252ZXJ0KHBvaW50KSk7XG59XG5cbmZ1bmN0aW9uIGNsb25lVHJhbnNmb3JtKG9yaWdpbmFsKSB7XG4gIGNvbnN0IHRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0ob3JpZ2luYWwuX21pblpvb20sIG9yaWdpbmFsLl9tYXhab29tKTtcbiAgdHJhbnNmb3JtLmxhdFJhbmdlID0gb3JpZ2luYWwubGF0UmFuZ2U7XG4gIHRyYW5zZm9ybS53aWR0aCA9IG9yaWdpbmFsLndpZHRoO1xuICB0cmFuc2Zvcm0uaGVpZ2h0ID0gb3JpZ2luYWwuaGVpZ2h0O1xuICB0cmFuc2Zvcm0uem9vbSA9IG9yaWdpbmFsLnpvb207XG4gIHRyYW5zZm9ybS5jZW50ZXIgPSBvcmlnaW5hbC5jZW50ZXI7XG4gIHRyYW5zZm9ybS5hbmdsZSA9IG9yaWdpbmFsLmFuZ2xlO1xuICB0cmFuc2Zvcm0uYWx0aXR1ZGUgPSBvcmlnaW5hbC5hbHRpdHVkZTtcbiAgdHJhbnNmb3JtLnBpdGNoID0gb3JpZ2luYWwucGl0Y2g7XG4gIHRyYW5zZm9ybS5iZWFyaW5nID0gb3JpZ2luYWwuYmVhcmluZztcbiAgdHJhbnNmb3JtLmFsdGl0dWRlID0gb3JpZ2luYWwuYWx0aXR1ZGU7XG4gIHJldHVybiB0cmFuc2Zvcm07XG59XG5cbk1hcEdMLnByb3BUeXBlcyA9IFBST1BfVFlQRVM7XG5NYXBHTC5jaGlsZENvbnRleHRUeXBlcyA9IENISUxEX0NPTlRFWFRfVFlQRVM7XG5NYXBHTC5kZWZhdWx0UHJvcHMgPSBERUZBVUxUX1BST1BTO1xuIl19