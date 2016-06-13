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
    * The width of the map.
    */
  width: _react.PropTypes.number.isRequired,
  /**
    * The height of the map.
    */
  height: _react.PropTypes.number.isRequired,
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
  bearing: _react2.default.PropTypes.number,

  /**
    * Specify the pitch of the viewport
    */
  pitch: _react2.default.PropTypes.number,

  /**
    * Specify the altitude of the viewport camera
    * Unit: map heights, default 1.5
    * Non-public API, see https://github.com/mapbox/mapbox-gl-js/issues/1137
    */
  altitude: _react2.default.PropTypes.number,

  /**
    * Disabled dragging of the map
    */
  dragDisabled: _react2.default.PropTypes.bool,

  /**
    * Disabled zooming of the map
    */
  zoomDisabled: _react2.default.PropTypes.bool,

  /**
    * Bounds to fit on screen
    */
  bounds: _react2.default.PropTypes.array
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
      // support for external manipulation of underlying map // TODO a better approach
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

          projectionMatrix: transform.projMatrix

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
MapGL.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAucmVhY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLElBQU0sWUFBWSxFQUFsQjtBQUNBLElBQU0sd0JBQXdCLEVBQTlCO0FBQ0EsSUFBTSxjQUFjLEdBQXBCOztBQUVBLElBQU0sYUFBYTs7OztBQUlqQixZQUFVLGlCQUFVLE1BQVYsQ0FBaUIsVUFKVjs7OztBQVFqQixhQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFSWDs7OztBQVlqQixRQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFaTjs7Ozs7QUFpQmpCLFlBQVUsaUJBQVUsU0FBVixDQUFvQixDQUM1QixpQkFBVSxNQURrQixFQUU1QixpQkFBVSxVQUFWLENBQXFCLG9CQUFVLEdBQS9CLENBRjRCLENBQXBCLENBakJPOzs7OztBQXlCakIsd0JBQXNCLGlCQUFVLE1BekJmOzs7Ozs7QUErQmpCLG9CQUFrQixpQkFBVSxJQS9CWDs7OztBQW1DakIsU0FBTyxpQkFBVSxNQUFWLENBQWlCLFVBbkNQOzs7O0FBdUNqQixVQUFRLGlCQUFVLE1BQVYsQ0FBaUIsVUF2Q1I7Ozs7OztBQTZDakIsY0FBWSxpQkFBVSxJQTdDTDs7Ozs7O0FBbURqQixtQkFBaUIsaUJBQVUsS0FuRFY7Ozs7Ozs7O0FBMkRqQixtQkFBaUIsaUJBQVUsSUEzRFY7Ozs7Ozs7QUFrRWpCLHVCQUFxQixpQkFBVSxJQWxFZDs7Ozs7QUF1RWpCLHNCQUFvQixpQkFBVSxJQXZFYjs7Ozs7Ozs7O0FBZ0ZqQixtQkFBaUIsaUJBQVUsSUFoRlY7Ozs7OztBQXNGakIseUJBQXVCLGlCQUFVLElBdEZoQjs7Ozs7O0FBNEZqQix1QkFB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RCxTQUFTLHNCQUFULENBQWdDLFNBQWhDLEVBQTJDLEtBQTNDLEVBQWtEO0FBQ2hELFNBQU8sVUFBVSxhQUFWLENBQXdCLGdCQUFNLE9BQU4sQ0FBYyxLQUFkLENBQXhCLENBQVA7QUFDRDs7QUFFRCxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0M7QUFDaEMsTUFBTSxZQUFZLHdCQUFjLFNBQVMsUUFBdkIsRUFBaUMsU0FBUyxRQUExQyxDQUFsQjtBQUNBLFlBQVUsUUFBVixHQUFxQixTQUFTLFFBQTlCO0FBQ0EsWUFBVSxLQUFWLEdBQWtCLFNBQVMsS0FBM0I7QUFDQSxZQUFVLE1BQVYsR0FBbUIsU0FBUyxNQUE1QjtBQUNBLFlBQVUsSUFBVixHQUFpQixTQUFTLElBQTFCO0FBQ0EsWUFBVSxNQUFWLEdBQW1CLFNBQVMsTUFBNUI7QUFDQSxZQUFVLEtBQVYsR0FBa0IsU0FBUyxLQUEzQjtBQUNBLFlBQVUsUUFBVixHQUFxQixTQUFTLFFBQTlCO0FBQ0EsWUFBVSxLQUFWLEdBQWtCLFNBQVMsS0FBM0I7QUFDQSxZQUFVLE9BQVYsR0FBb0IsU0FBUyxPQUE3QjtBQUNBLFlBQVUsUUFBVixHQUFxQixTQUFTLFFBQTlCO0FBQ0EsU0FBTyxTQUFQO0FBQ0Q7O0FBRUQsTUFBTSxTQUFOLEdBQWtCLFVBQWxCO0FBQ0EsTUFBTSxZQUFOLEdBQXFCLGFBQXJCIiwiZmlsZSI6Im1hcC5yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXMsIENvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcic7XG5pbXBvcnQgcHVyZVJlbmRlciBmcm9tICdwdXJlLXJlbmRlci1kZWNvcmF0b3InO1xuaW1wb3J0IGQzIGZyb20gJ2QzJztcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBtYXBib3hnbCwge1BvaW50fSBmcm9tICdtYXBib3gtZ2wnO1xuXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBNYXBJbnRlcmFjdGlvbnMgZnJvbSAnLi9tYXAtaW50ZXJhY3Rpb25zLnJlYWN0JztcbmltcG9ydCBkaWZmU3R5bGVzIGZyb20gJy4vZGlmZi1zdHlsZXMnO1xuXG4vLyBOT1RFOiBUcmFuc2Zvcm0gaXMgbm90IGEgcHVibGljIEFQSSBzbyB3ZSBzaG91bGQgYmUgY2FyZWZ1bCB0byBhbHdheXMgbG9ja1xuLy8gZG93biBtYXBib3gtZ2wgdG8gYSBzcGVjaWZpYyBtYWpvciwgbWlub3IsIGFuZCBwYXRjaCB2ZXJzaW9uLlxuaW1wb3J0IFRyYW5zZm9ybSBmcm9tICdtYXBib3gtZ2wvanMvZ2VvL3RyYW5zZm9ybSc7XG5cbi8vIE5vdGU6IE1heCBwaXRjaCBpcyBhIGhhcmQgY29kZWQgdmFsdWUgKG5vdCBhIG5hbWVkIGNvbnN0YW50KSBpbiB0cmFuc2Zvcm0uanNcbmNvbnN0IE1BWF9QSVRDSCA9IDYwO1xuY29uc3QgUElUQ0hfTU9VU0VfVEhSRVNIT0xEID0gMjA7XG5jb25zdCBQSVRDSF9BQ0NFTCA9IDEuMjtcblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgLyoqXG4gICAgKiBUaGUgbGF0aXR1ZGUgb2YgdGhlIGNlbnRlciBvZiB0aGUgbWFwLlxuICAgICovXG4gIGxhdGl0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogVGhlIGxvbmdpdHVkZSBvZiB0aGUgY2VudGVyIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgbG9uZ2l0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogVGhlIHRpbGUgem9vbSBsZXZlbCBvZiB0aGUgbWFwLlxuICAgICovXG4gIHpvb206IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgTWFwYm94IHN0eWxlIHRoZSBjb21wb25lbnQgc2hvdWxkIHVzZS4gQ2FuIGVpdGhlciBiZSBhIHN0cmluZyB1cmxcbiAgICAqIG9yIGEgTWFwYm94R0wgc3R5bGUgSW1tdXRhYmxlLk1hcCBvYmplY3QuXG4gICAgKi9cbiAgbWFwU3R5bGU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcClcbiAgXSksXG4gIC8qKlxuICAgICogVGhlIE1hcGJveCBBUEkgYWNjZXNzIHRva2VuIHRvIHByb3ZpZGUgdG8gbWFwYm94LWdsLWpzLiBUaGlzIGlzIHJlcXVpcmVkXG4gICAgKiB3aGVuIHVzaW5nIE1hcGJveCBwcm92aWRlZCB2ZWN0b3IgdGlsZXMgYW5kIHN0eWxlcy5cbiAgICAqL1xuICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgLyoqXG4gICAgKiBgb25DaGFuZ2VWaWV3cG9ydGAgY2FsbGJhY2sgaXMgZmlyZWQgd2hlbiB0aGUgdXNlciBpbnRlcmFjdGVkIHdpdGggdGhlXG4gICAgKiBtYXAuIFRoZSBvYmplY3QgcGFzc2VkIHRvIHRoZSBjYWxsYmFjayBjb250YWluZXJzIGBsYXRpdHVkZWAsXG4gICAgKiBgbG9uZ2l0dWRlYCBhbmQgYHpvb21gIGluZm9ybWF0aW9uLlxuICAgICovXG4gIG9uQ2hhbmdlVmlld3BvcnQ6IFByb3BUeXBlcy5mdW5jLFxuICAvKipcbiAgICAqIFRoZSB3aWR0aCBvZiB0aGUgbWFwLlxuICAgICovXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogVGhlIGhlaWdodCBvZiB0aGUgbWFwLlxuICAgICovXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAvKipcbiAgICAqIElzIHRoZSBjb21wb25lbnQgY3VycmVudGx5IGJlaW5nIGRyYWdnZWQuIFRoaXMgaXMgdXNlZCB0byBzaG93L2hpZGUgdGhlXG4gICAgKiBkcmFnIGN1cnNvci4gQWxzbyB1c2VkIGFzIGFuIG9wdGltaXphdGlvbiBpbiBzb21lIG92ZXJsYXlzIGJ5IHByZXZlbnRpbmdcbiAgICAqIHJlbmRlcmluZyB3aGlsZSBkcmFnZ2luZy5cbiAgICAqL1xuICBpc0RyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgLyoqXG4gICAgKiBSZXF1aXJlZCB0byBjYWxjdWxhdGUgdGhlIG1vdXNlIHByb2plY3Rpb24gYWZ0ZXIgdGhlIGZpcnN0IGNsaWNrIGV2ZW50XG4gICAgKiBkdXJpbmcgZHJhZ2dpbmcuIFdoZXJlIHRoZSBtYXAgaXMgZGVwZW5kcyBvbiB3aGVyZSB5b3UgZmlyc3QgY2xpY2tlZCBvblxuICAgICogdGhlIG1hcC5cbiAgICAqL1xuICBzdGFydERyYWdMbmdMYXQ6IFByb3BUeXBlcy5hcnJheSxcbiAgLyoqXG4gICAgKiBDYWxsZWQgd2hlbiBhIGZlYXR1cmUgaXMgaG92ZXJlZCBvdmVyLiBGZWF0dXJlcyBtdXN0IHNldCB0aGVcbiAgICAqIGBpbnRlcmFjdGl2ZWAgcHJvcGVydHkgdG8gYHRydWVgIGZvciB0aGlzIHRvIHdvcmsgcHJvcGVybHkuIHNlZSB0aGVcbiAgICAqIE1hcGJveCBleGFtcGxlOiBodHRwczovL3d3dy5tYXBib3guY29tL21hcGJveC1nbC1qcy9leGFtcGxlL2ZlYXR1cmVzYXQvXG4gICAgKiBUaGUgZmlyc3QgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrIHdpbGwgYmUgdGhlIGFycmF5IG9mIGZlYXR1cmUgdGhlXG4gICAgKiBtb3VzZSBpcyBvdmVyLiBUaGlzIGlzIHRoZSBzYW1lIHJlc3BvbnNlIHJldHVybmVkIGZyb20gYGZlYXR1cmVzQXRgLlxuICAgICovXG4gIG9uSG92ZXJGZWF0dXJlczogUHJvcFR5cGVzLmZ1bmMsXG4gIC8qKlxuICAgICogRGVmYXVsdHMgdG8gVFJVRVxuICAgICogU2V0IHRvIGZhbHNlIHRvIGVuYWJsZSBvbkhvdmVyRmVhdHVyZXMgdG8gYmUgY2FsbGVkIHJlZ2FyZGxlc3MgaWZcbiAgICAqIHRoZXJlIGlzIGFuIGFjdHVhbCBmZWF0dXJlIGF0IHgsIHkuIFRoaXMgaXMgdXNlZnVsIHRvIGVtdWxhdGVcbiAgICAqIFwibW91c2Utb3V0XCIgYmVoYXZpb3JzIG9uIGZlYXR1cmVzLlxuICAgICovXG4gIGlnbm9yZUVtcHR5RmVhdHVyZXM6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogU2hvdyBhdHRyaWJ1dGlvbiBjb250cm9sIG9yIG5vdC5cbiAgICAqL1xuICBhdHRyaWJ1dGlvbkNvbnRyb2w6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogQ2FsbGVkIHdoZW4gYSBmZWF0dXJlIGlzIGNsaWNrZWQgb24uIEZlYXR1cmVzIG11c3Qgc2V0IHRoZVxuICAgICogYGludGVyYWN0aXZlYCBwcm9wZXJ0eSB0byBgdHJ1ZWAgZm9yIHRoaXMgdG8gd29yayBwcm9wZXJseS4gc2VlIHRoZVxuICAgICogTWFwYm94IGV4YW1wbGU6IGh0dHBzOi8vd3d3Lm1hcGJveC5jb20vbWFwYm94LWdsLWpzL2V4YW1wbGUvZmVhdHVyZXNhdC9cbiAgICAqIFRoZSBmaXJzdCBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2sgd2lsbCBiZSB0aGUgYXJyYXkgb2YgZmVhdHVyZSB0aGVcbiAgICAqIG1vdXNlIGlzIG92ZXIuIFRoaXMgaXMgdGhlIHNhbWUgcmVzcG9uc2UgcmV0dXJuZWQgZnJvbSBgZmVhdHVyZXNBdGAuXG4gICAgKi9cbiAgb25DbGlja0ZlYXR1cmVzOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICAqIFBhc3NlZCB0byBNYXBib3ggTWFwIGNvbnN0cnVjdG9yIHdoaWNoIHBhc3NlcyBpdCB0byB0aGUgY2FudmFzIGNvbnRleHQuXG4gICAgKiBUaGlzIGlzIHVuc2VmdWwgd2hlbiB5b3Ugd2FudCB0byBleHBvcnQgdGhlIGNhbnZhcyBhcyBhIFBORy5cbiAgICAqL1xuICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogVGhlcmUgYXJlIHN0aWxsIGtub3duIGlzc3VlcyB3aXRoIHN0eWxlIGRpZmZpbmcuIEFzIGEgdGVtcG9yYXJ5IHN0b3BnYXAsXG4gICAgKiBhZGQgdGhlIG9wdGlvbiB0byBwcmV2ZW50IHN0eWxlIGRpZmZpbmcuXG4gICAgKi9cbiAgcHJldmVudFN0eWxlRGlmZmluZzogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBFbmFibGVzIHBlcnNwZWN0aXZlIGNvbnRyb2wgZXZlbnQgaGFuZGxpbmcgKENvbW1hbmQtcm90YXRlKVxuICAgICovXG4gIHBlcnNwZWN0aXZlRW5hYmxlZDogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBTcGVjaWZ5IHRoZSBiZWFyaW5nIG9mIHRoZSB2aWV3cG9ydFxuICAgICovXG4gIGJlYXJpbmc6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cbiAgLyoqXG4gICAgKiBTcGVjaWZ5IHRoZSBwaXRjaCBvZiB0aGUgdmlld3BvcnRcbiAgICAqL1xuICBwaXRjaDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICAqIFNwZWNpZnkgdGhlIGFsdGl0dWRlIG9mIHRoZSB2aWV3cG9ydCBjYW1lcmFcbiAgICAqIFVuaXQ6IG1hcCBoZWlnaHRzLCBkZWZhdWx0IDEuNVxuICAgICogTm9uLXB1YmxpYyBBUEksIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC1nbC1qcy9pc3N1ZXMvMTEzN1xuICAgICovXG4gIGFsdGl0dWRlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgICogRGlzYWJsZWQgZHJhZ2dpbmcgb2YgdGhlIG1hcFxuICAgICovXG4gIGRyYWdEaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBEaXNhYmxlZCB6b29taW5nIG9mIHRoZSBtYXBcbiAgICAqL1xuICB6b29tRGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogQm91bmRzIHRvIGZpdCBvbiBzY3JlZW5cbiAgICAqL1xuICBib3VuZHM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIG1hcFN0eWxlOiAnbWFwYm94Oi8vc3R5bGVzL21hcGJveC9saWdodC12OCcsXG4gIG9uQ2hhbmdlVmlld3BvcnQ6IG51bGwsXG4gIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBjb25maWcuREVGQVVMVFMuTUFQQk9YX0FQSV9BQ0NFU1NfVE9LRU4sXG4gIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogZmFsc2UsXG4gIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSxcbiAgaWdub3JlRW1wdHlGZWF0dXJlczogdHJ1ZSxcbiAgYmVhcmluZzogMCxcbiAgcGl0Y2g6IDAsXG4gIGFsdGl0dWRlOiAxLjVcbn07XG5cbkBwdXJlUmVuZGVyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBHTCBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgc3RhcnREcmFnTG5nTGF0OiBudWxsLFxuICAgICAgc3RhcnRCZWFyaW5nOiBudWxsLFxuICAgICAgc3RhcnRQaXRjaDogbnVsbFxuICAgIH07XG4gICAgbWFwYm94Z2wuYWNjZXNzVG9rZW4gPSBwcm9wcy5tYXBib3hBcGlBY2Nlc3NUb2tlbjtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IG1hcFN0eWxlID0gdGhpcy5wcm9wcy5tYXBTdHlsZSBpbnN0YW5jZW9mIEltbXV0YWJsZS5NYXAgP1xuICAgICAgdGhpcy5wcm9wcy5tYXBTdHlsZS50b0pTKCkgOlxuICAgICAgdGhpcy5wcm9wcy5tYXBTdHlsZTtcbiAgICBjb25zdCBtYXAgPSBuZXcgbWFwYm94Z2wuTWFwKHtcbiAgICAgIGNvbnRhaW5lcjogdGhpcy5yZWZzLm1hcGJveE1hcCxcbiAgICAgIGNlbnRlcjogW3RoaXMucHJvcHMubG9uZ2l0dWRlLCB0aGlzLnByb3BzLmxhdGl0dWRlXSxcbiAgICAgIHpvb206IHRoaXMucHJvcHMuem9vbSxcbiAgICAgIHBpdGNoOiB0aGlzLnByb3BzLnBpdGNoLFxuICAgICAgYmVhcmluZzogdGhpcy5wcm9wcy5iZWFyaW5nLFxuICAgICAgc3R5bGU6IG1hcFN0eWxlLFxuICAgICAgaW50ZXJhY3RpdmU6IGZhbHNlLFxuICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0aGlzLnByb3BzLnByZXNlcnZlRHJhd2luZ0J1ZmZlclxuICAgICAgLy8gVE9ETz9cbiAgICAgIC8vIGF0dHJpYnV0aW9uQ29udHJvbDogdGhpcy5wcm9wcy5hdHRyaWJ1dGlvbkNvbnRyb2xcbiAgICB9KTtcblxuICAgIGQzLnNlbGVjdChtYXAuZ2V0Q2FudmFzKCkpLnN0eWxlKCdvdXRsaW5lJywgJ25vbmUnKTtcblxuICAgIHRoaXMuX21hcCA9IG1hcDtcbiAgICB0aGlzLl91cGRhdGVNYXBWaWV3cG9ydCh7fSwgdGhpcy5wcm9wcyk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSk7XG4gICAgLy8gc3VwcG9ydCBmb3IgZXh0ZXJuYWwgbWFuaXB1bGF0aW9uIG9mIHVuZGVybHlpbmcgbWFwIC8vIFRPRE8gYSBiZXR0ZXIgYXBwcm9hY2hcbiAgICBtYXAub24oJ21vdmVlbmQnLCAoKSA9PiB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtKSk7XG4gICAgbWFwLm9uKCd6b29tZW5kJywgKCkgPT4gdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSkpO1xuICB9XG5cbiAgLy8gTmV3IHByb3BzIGFyZSBjb21pbicgcm91bmQgdGhlIGNvcm5lciFcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXdQcm9wcykge1xuICAgIHRoaXMuX3VwZGF0ZVN0YXRlRnJvbVByb3BzKHRoaXMucHJvcHMsIG5ld1Byb3BzKTtcbiAgICB0aGlzLl91cGRhdGVNYXBWaWV3cG9ydCh0aGlzLnByb3BzLCBuZXdQcm9wcyk7XG4gICAgdGhpcy5fdXBkYXRlTWFwU3R5bGUodGhpcy5wcm9wcywgbmV3UHJvcHMpO1xuICAgIC8vIFNhdmUgd2lkdGgvaGVpZ2h0IHNvIHRoYXQgd2UgY2FuIGNoZWNrIHRoZW0gaW4gY29tcG9uZW50RGlkVXBkYXRlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHRcbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAvLyBtYXAucmVzaXplKCkgcmVhZHMgc2l6ZSBmcm9tIERPTSwgd2UgbmVlZCB0byBjYWxsIGFmdGVyIHJlbmRlclxuICAgIHRoaXMuX3VwZGF0ZU1hcFNpemUodGhpcy5zdGF0ZSwgdGhpcy5wcm9wcyk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5fbWFwKSB7XG4gICAgICB0aGlzLl9tYXAucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgX2N1cnNvcigpIHtcbiAgICBjb25zdCBpc0ludGVyYWN0aXZlID1cbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCB8fFxuICAgICAgdGhpcy5wcm9wcy5vbkNsaWNrRmVhdHVyZSB8fFxuICAgICAgdGhpcy5wcm9wcy5vbkhvdmVyRmVhdHVyZXM7XG4gICAgaWYgKGlzSW50ZXJhY3RpdmUpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmlzRHJhZ2dpbmcgP1xuICAgICAgICBjb25maWcuQ1VSU09SLkdSQUJCSU5HIDogY29uZmlnLkNVUlNPUi5HUkFCO1xuICAgIH1cbiAgICByZXR1cm4gJ2luaGVyaXQnO1xuICB9XG5cbiAgX2dldE1hcCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwO1xuICB9XG5cbiAgX3VwZGF0ZVN0YXRlRnJvbVByb3BzKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIG1hcGJveGdsLmFjY2Vzc1Rva2VuID0gbmV3UHJvcHMubWFwYm94QXBpQWNjZXNzVG9rZW47XG4gICAgY29uc3Qge3N0YXJ0RHJhZ0xuZ0xhdH0gPSBuZXdQcm9wcztcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogc3RhcnREcmFnTG5nTGF0ICYmIHN0YXJ0RHJhZ0xuZ0xhdC5zbGljZSgpXG4gICAgfSk7XG4gIH1cblxuICAvLyBJbmRpdmlkdWFsbHkgdXBkYXRlIHRoZSBtYXBzIHNvdXJjZSBhbmQgbGF5ZXJzIHRoYXQgaGF2ZSBjaGFuZ2VkIGlmIGFsbFxuICAvLyBvdGhlciBzdHlsZSBwcm9wcyBoYXZlbid0IGNoYW5nZWQuIFRoaXMgcHJldmVudHMgZmxpY2tpbmcgb2YgdGhlIG1hcCB3aGVuXG4gIC8vIHN0eWxlcyBvbmx5IGNoYW5nZSBzb3VyY2VzIG9yIGxheWVycy5cbiAgX3NldERpZmZTdHlsZShwcmV2U3R5bGUsIG5leHRTdHlsZSkge1xuICAgIGNvbnN0IHByZXZLZXlzTWFwID0gcHJldlN0eWxlICYmIHN0eWxlS2V5c01hcChwcmV2U3R5bGUpIHx8IHt9O1xuICAgIGNvbnN0IG5leHRLZXlzTWFwID0gc3R5bGVLZXlzTWFwKG5leHRTdHlsZSk7XG4gICAgZnVuY3Rpb24gc3R5bGVLZXlzTWFwKHN0eWxlKSB7XG4gICAgICByZXR1cm4gc3R5bGUubWFwKCgpID0+IHRydWUpLmRlbGV0ZSgnbGF5ZXJzJykuZGVsZXRlKCdzb3VyY2VzJykudG9KUygpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwcm9wc090aGVyVGhhbkxheWVyc09yU291cmNlc0RpZmZlcigpIHtcbiAgICAgIGNvbnN0IHByZXZLZXlzTGlzdCA9IE9iamVjdC5rZXlzKHByZXZLZXlzTWFwKTtcbiAgICAgIGNvbnN0IG5leHRLZXlzTGlzdCA9IE9iamVjdC5rZXlzKG5leHRLZXlzTWFwKTtcbiAgICAgIGlmIChwcmV2S2V5c0xpc3QubGVuZ3RoICE9PSBuZXh0S2V5c0xpc3QubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgLy8gYG5leHRTdHlsZWAgYW5kIGBwcmV2U3R5bGVgIHNob3VsZCBub3QgaGF2ZSB0aGUgc2FtZSBzZXQgb2YgcHJvcHMuXG4gICAgICBpZiAobmV4dEtleXNMaXN0LnNvbWUoXG4gICAgICAgIGtleSA9PiBwcmV2U3R5bGUuZ2V0KGtleSkgIT09IG5leHRTdHlsZS5nZXQoa2V5KVxuICAgICAgICAvLyBCdXQgdGhlIHZhbHVlIG9mIG9uZSBvZiB0aG9zZSBwcm9wcyBpcyBkaWZmZXJlbnQuXG4gICAgICApKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuXG4gICAgaWYgKCFwcmV2U3R5bGUgfHwgcHJvcHNPdGhlclRoYW5MYXllcnNPclNvdXJjZXNEaWZmZXIoKSkge1xuICAgICAgbWFwLnNldFN0eWxlKG5leHRTdHlsZS50b0pTKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtzb3VyY2VzRGlmZiwgbGF5ZXJzRGlmZn0gPSBkaWZmU3R5bGVzKHByZXZTdHlsZSwgbmV4dFN0eWxlKTtcblxuICAgIC8vIFRPRE86IEl0J3MgcmF0aGVyIGRpZmZpY3VsdCB0byBkZXRlcm1pbmUgc3R5bGUgZGlmZmluZyBpbiB0aGUgcHJlc2VuY2VcbiAgICAvLyBvZiByZWZzLiBGb3Igbm93LCBpZiBhbnkgc3R5bGUgdXBkYXRlIGhhcyBhIHJlZiwgZmFsbGJhY2sgdG8gbm8gZGlmZmluZy5cbiAgICAvLyBXZSBjYW4gY29tZSBiYWNrIHRvIHRoaXMgY2FzZSBpZiB0aGVyZSdzIGEgc29saWQgdXNlY2FzZS5cbiAgICBpZiAobGF5ZXJzRGlmZi51cGRhdGVzLnNvbWUobm9kZSA9PiBub2RlLmxheWVyLmdldCgncmVmJykpKSB7XG4gICAgICBtYXAuc2V0U3R5bGUobmV4dFN0eWxlLnRvSlMoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBlbnRlciBvZiBzb3VyY2VzRGlmZi5lbnRlcikge1xuICAgICAgbWFwLmFkZFNvdXJjZShlbnRlci5pZCwgZW50ZXIuc291cmNlLnRvSlMoKSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgdXBkYXRlIG9mIHNvdXJjZXNEaWZmLnVwZGF0ZSkge1xuICAgICAgbWFwLnJlbW92ZVNvdXJjZSh1cGRhdGUuaWQpO1xuICAgICAgbWFwLmFkZFNvdXJjZSh1cGRhdGUuaWQsIHVwZGF0ZS5zb3VyY2UudG9KUygpKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBleGl0IG9mIHNvdXJjZXNEaWZmLmV4aXQpIHtcbiAgICAgIG1hcC5yZW1vdmVTb3VyY2UoZXhpdC5pZCk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZXhpdCBvZiBsYXllcnNEaWZmLmV4aXRpbmcpIHtcbiAgICAgIGlmIChtYXAuc3R5bGUuZ2V0TGF5ZXIoZXhpdC5pZCkpIHtcbiAgICAgICAgbWFwLnJlbW92ZUxheWVyKGV4aXQuaWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IHVwZGF0ZSBvZiBsYXllcnNEaWZmLnVwZGF0ZXMpIHtcbiAgICAgIGlmICghdXBkYXRlLmVudGVyKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgYW4gb2xkIGxheWVyIHRoYXQgbmVlZHMgdG8gYmUgdXBkYXRlZC4gUmVtb3ZlIHRoZSBvbGQgbGF5ZXJcbiAgICAgICAgLy8gd2l0aCB0aGUgc2FtZSBpZCBhbmQgYWRkIGl0IGJhY2sgYWdhaW4uXG4gICAgICAgIG1hcC5yZW1vdmVMYXllcih1cGRhdGUuaWQpO1xuICAgICAgfVxuICAgICAgbWFwLmFkZExheWVyKHVwZGF0ZS5sYXllci50b0pTKCksIHVwZGF0ZS5iZWZvcmUpO1xuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVNYXBTdHlsZShvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBjb25zdCBtYXBTdHlsZSA9IG5ld1Byb3BzLm1hcFN0eWxlO1xuICAgIGNvbnN0IG9sZE1hcFN0eWxlID0gb2xkUHJvcHMubWFwU3R5bGU7XG4gICAgaWYgKG1hcFN0eWxlICE9PSBvbGRNYXBTdHlsZSkge1xuICAgICAgaWYgKG1hcFN0eWxlIGluc3RhbmNlb2YgSW1tdXRhYmxlLk1hcCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5wcmV2ZW50U3R5bGVEaWZmaW5nKSB7XG4gICAgICAgICAgdGhpcy5fZ2V0TWFwKCkuc2V0U3R5bGUobWFwU3R5bGUudG9KUygpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9zZXREaWZmU3R5bGUob2xkTWFwU3R5bGUsIG1hcFN0eWxlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZ2V0TWFwKCkuc2V0U3R5bGUobWFwU3R5bGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVNYXBWaWV3cG9ydChvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBjb25zdCB2aWV3cG9ydENoYW5nZWQgPVxuICAgICAgbmV3UHJvcHMubGF0aXR1ZGUgIT09IG9sZFByb3BzLmxhdGl0dWRlIHx8XG4gICAgICBuZXdQcm9wcy5sb25naXR1ZGUgIT09IG9sZFByb3BzLmxvbmdpdHVkZSB8fFxuICAgICAgbmV3UHJvcHMuem9vbSAhPT0gb2xkUHJvcHMuem9vbSB8fFxuICAgICAgbmV3UHJvcHMucGl0Y2ggIT09IG9sZFByb3BzLnBpdGNoIHx8XG4gICAgICBuZXdQcm9wcy5iZWFyaW5nICE9PSBvbGRQcm9wcy5iZWFyaW5nIHx8XG4gICAgICBuZXdQcm9wcy5hbHRpdHVkZSAhPT0gb2xkUHJvcHMuYWx0aXR1ZGU7XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcblxuICAgIGlmICh2aWV3cG9ydENoYW5nZWQpIHtcbiAgICAgIG1hcC5qdW1wVG8oe1xuICAgICAgICBjZW50ZXI6IFtuZXdQcm9wcy5sb25naXR1ZGUsIG5ld1Byb3BzLmxhdGl0dWRlXSxcbiAgICAgICAgem9vbTogbmV3UHJvcHMuem9vbSxcbiAgICAgICAgYmVhcmluZzogbmV3UHJvcHMuYmVhcmluZyxcbiAgICAgICAgcGl0Y2g6IG5ld1Byb3BzLnBpdGNoXG4gICAgICB9KTtcblxuICAgICAgLy8gVE9ETyAtIGp1bXBUbyBkb2Vzbid0IGhhbmRsZSBhbHRpdHVkZVxuICAgICAgaWYgKG5ld1Byb3BzLmFsdGl0dWRlICE9PSBvbGRQcm9wcy5hbHRpdHVkZSkge1xuICAgICAgICBtYXAudHJhbnNmb3JtLmFsdGl0dWRlID0gbmV3UHJvcHMuYWx0aXR1ZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9sZFByb3BzLmJvdW5kcyAhPT0gbmV3UHJvcHMuYm91bmRzICYmIG5ld1Byb3BzLmJvdW5kcykge1xuICAgICAgbWFwLmZpdEJvdW5kcyhuZXdQcm9wcy5ib3VuZHMudG9KUygpLCB7cGFkZGluZzogNDUsIG1heFpvb206IDE5fSk7XG4gICAgfVxuICB9XG5cbiAgLy8gTm90ZTogbmVlZHMgdG8gYmUgY2FsbGVkIGFmdGVyIHJlbmRlciAoZS5nLiBpbiBjb21wb25lbnREaWRVcGRhdGUpXG4gIF91cGRhdGVNYXBTaXplKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIGNvbnN0IHNpemVDaGFuZ2VkID1cbiAgICAgIG9sZFByb3BzLndpZHRoICE9PSBuZXdQcm9wcy53aWR0aCB8fCBvbGRQcm9wcy5oZWlnaHQgIT09IG5ld1Byb3BzLmhlaWdodDtcblxuICAgIGlmIChzaXplQ2hhbmdlZCkge1xuICAgICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgICBtYXAucmVzaXplKCk7XG4gICAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtKTtcbiAgICB9XG4gIH1cblxuICBfY2FsY3VsYXRlTmV3UGl0Y2hBbmRCZWFyaW5nKHtwb3MsIHN0YXJ0UG9zLCBzdGFydEJlYXJpbmcsIHN0YXJ0UGl0Y2h9KSB7XG4gICAgY29uc3QgeERlbHRhID0gcG9zLnggLSBzdGFydFBvcy54O1xuICAgIGNvbnN0IGJlYXJpbmcgPSBzdGFydEJlYXJpbmcgKyAxODAgKiB4RGVsdGEgLyB0aGlzLnByb3BzLndpZHRoO1xuXG4gICAgbGV0IHBpdGNoID0gc3RhcnRQaXRjaDtcbiAgICBjb25zdCB5RGVsdGEgPSBwb3MueSAtIHN0YXJ0UG9zLnk7XG4gICAgaWYgKHlEZWx0YSA+IDApIHtcbiAgICAgIC8vIERyYWdnaW5nIGRvd253YXJkcywgZ3JhZHVhbGx5IGRlY3JlYXNlIHBpdGNoXG4gICAgICBpZiAoTWF0aC5hYnModGhpcy5wcm9wcy5oZWlnaHQgLSBzdGFydFBvcy55KSA+IFBJVENIX01PVVNFX1RIUkVTSE9MRCkge1xuICAgICAgICBjb25zdCBzY2FsZSA9IHlEZWx0YSAvICh0aGlzLnByb3BzLmhlaWdodCAtIHN0YXJ0UG9zLnkpO1xuICAgICAgICBwaXRjaCA9ICgxIC0gc2NhbGUpICogUElUQ0hfQUNDRUwgKiBzdGFydFBpdGNoO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoeURlbHRhIDwgMCkge1xuICAgICAgLy8gRHJhZ2dpbmcgdXB3YXJkcywgZ3JhZHVhbGx5IGluY3JlYXNlIHBpdGNoXG4gICAgICBpZiAoc3RhcnRQb3MueSA+IFBJVENIX01PVVNFX1RIUkVTSE9MRCkge1xuICAgICAgICAvLyBNb3ZlIGZyb20gMCB0byAxIGFzIHdlIGRyYWcgdXB3YXJkc1xuICAgICAgICBjb25zdCB5U2NhbGUgPSAxIC0gcG9zLnkgLyBzdGFydFBvcy55O1xuICAgICAgICAvLyBHcmFkdWFsbHkgYWRkIHVudGlsIHdlIGhpdCBtYXggcGl0Y2hcbiAgICAgICAgcGl0Y2ggPSBzdGFydFBpdGNoICsgeVNjYWxlICogKE1BWF9QSVRDSCAtIHN0YXJ0UGl0Y2gpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnNvbGUuZGVidWcoc3RhcnRQaXRjaCwgcGl0Y2gpO1xuICAgIHJldHVybiB7XG4gICAgICBwaXRjaDogTWF0aC5tYXgoTWF0aC5taW4ocGl0Y2gsIE1BWF9QSVRDSCksIDApLFxuICAgICAgYmVhcmluZ1xuICAgIH07XG4gIH1cblxuICAgLy8gSGVscGVyIHRvIGNhbGwgcHJvcHMub25DaGFuZ2VWaWV3cG9ydFxuICBfY2FsbE9uQ2hhbmdlVmlld3BvcnQodHJhbnNmb3JtLCBvcHRzID0ge30pIHtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0KSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQoe1xuICAgICAgICBsYXRpdHVkZTogdHJhbnNmb3JtLmNlbnRlci5sYXQsXG4gICAgICAgIGxvbmdpdHVkZTogbW9kKHRyYW5zZm9ybS5jZW50ZXIubG5nICsgMTgwLCAzNjApIC0gMTgwLFxuICAgICAgICB6b29tOiB0cmFuc2Zvcm0uem9vbSxcbiAgICAgICAgcGl0Y2g6IHRyYW5zZm9ybS5waXRjaCxcbiAgICAgICAgYmVhcmluZzogbW9kKHRyYW5zZm9ybS5iZWFyaW5nICsgMTgwLCAzNjApIC0gMTgwLFxuXG4gICAgICAgIGlzRHJhZ2dpbmc6IHRoaXMucHJvcHMuaXNEcmFnZ2luZyxcbiAgICAgICAgc3RhcnREcmFnTG5nTGF0OiB0aGlzLnByb3BzLnN0YXJ0RHJhZ0xuZ0xhdCxcbiAgICAgICAgc3RhcnRCZWFyaW5nOiB0aGlzLnByb3BzLnN0YXJ0QmVhcmluZyxcbiAgICAgICAgc3RhcnRQaXRjaDogdGhpcy5wcm9wcy5zdGFydFBpdGNoLFxuXG4gICAgICAgIHByb2plY3Rpb25NYXRyaXg6IHRyYW5zZm9ybS5wcm9qTWF0cml4LFxuXG4gICAgICAgIC4uLm9wdHNcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZURvd24oe3Bvc30pIHtcbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICBjb25zdCBsbmdMYXQgPSB1bnByb2plY3RGcm9tVHJhbnNmb3JtKG1hcC50cmFuc2Zvcm0sIHBvcyk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogdHJ1ZSxcbiAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogW2xuZ0xhdC5sbmcsIGxuZ0xhdC5sYXRdLFxuICAgICAgc3RhcnRCZWFyaW5nOiBtYXAudHJhbnNmb3JtLmJlYXJpbmcsXG4gICAgICBzdGFydFBpdGNoOiBtYXAudHJhbnNmb3JtLnBpdGNoXG4gICAgfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VEcmFnKHtwb3N9KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQgfHwgdGhpcy5wcm9wcy5kcmFnRGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB0YWtlIHRoZSBzdGFydCBsbmdsYXQgYW5kIHB1dCBpdCB3aGVyZSB0aGUgbW91c2UgaXMgZG93bi5cbiAgICBhc3NlcnQodGhpcy5wcm9wcy5zdGFydERyYWdMbmdMYXQsICdgc3RhcnREcmFnTG5nTGF0YCBwcm9wIGlzIHJlcXVpcmVkICcgK1xuICAgICAgJ2ZvciBtb3VzZSBkcmFnIGJlaGF2aW9yIHRvIGNhbGN1bGF0ZSB3aGVyZSB0byBwb3NpdGlvbiB0aGUgbWFwLicpO1xuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gY2xvbmVUcmFuc2Zvcm0obWFwLnRyYW5zZm9ybSk7XG4gICAgdHJhbnNmb3JtLnNldExvY2F0aW9uQXRQb2ludCh0aGlzLnByb3BzLnN0YXJ0RHJhZ0xuZ0xhdCwgcG9zKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydCh0cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZVJvdGF0ZSh7cG9zLCBzdGFydFBvc30pIHtcbiAgICBpZiAoIXRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCB8fCAhdGhpcy5wcm9wcy5wZXJzcGVjdGl2ZUVuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7c3RhcnRCZWFyaW5nLCBzdGFydFBpdGNofSA9IHRoaXMucHJvcHM7XG4gICAgYXNzZXJ0KHR5cGVvZiBzdGFydEJlYXJpbmcgPT09ICdudW1iZXInLFxuICAgICAgJ2BzdGFydEJlYXJpbmdgIHByb3AgaXMgcmVxdWlyZWQgZm9yIG1vdXNlIHJvdGF0ZSBiZWhhdmlvcicpO1xuICAgIGFzc2VydCh0eXBlb2Ygc3RhcnRQaXRjaCA9PT0gJ251bWJlcicsXG4gICAgICAnYHN0YXJ0UGl0Y2hgIHByb3AgaXMgcmVxdWlyZWQgZm9yIG1vdXNlIHJvdGF0ZSBiZWhhdmlvcicpO1xuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG5cbiAgICBjb25zdCB7cGl0Y2gsIGJlYXJpbmd9ID0gdGhpcy5fY2FsY3VsYXRlTmV3UGl0Y2hBbmRCZWFyaW5nKHtcbiAgICAgIHBvcyxcbiAgICAgIHN0YXJ0UG9zLFxuICAgICAgc3RhcnRCZWFyaW5nLFxuICAgICAgc3RhcnRQaXRjaFxuICAgIH0pO1xuXG4gICAgY29uc3QgdHJhbnNmb3JtID0gY2xvbmVUcmFuc2Zvcm0obWFwLnRyYW5zZm9ybSk7XG4gICAgdHJhbnNmb3JtLmJlYXJpbmcgPSBiZWFyaW5nO1xuICAgIHRyYW5zZm9ybS5waXRjaCA9IHBpdGNoO1xuXG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQodHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VNb3ZlKG9wdCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5vbkhvdmVyRmVhdHVyZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICBjb25zdCBwb3MgPSBvcHQucG9zO1xuXG4gICAgY29uc3QgZmVhdHVyZXMgPSBtYXAucXVlcnlSZW5kZXJlZEZlYXR1cmVzKFtwb3MueCwgcG9zLnldKTtcbiAgICBpZiAoIWZlYXR1cmVzLmxlbmd0aCAmJiB0aGlzLnByb3BzLmlnbm9yZUVtcHR5RmVhdHVyZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5vbkhvdmVyRmVhdHVyZXMoZmVhdHVyZXMpO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlVXAob3B0KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm9uQ2xpY2tGZWF0dXJlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgc3RhcnREcmFnTG5nTGF0OiBudWxsLFxuICAgICAgc3RhcnRCZWFyaW5nOiBudWxsLFxuICAgICAgc3RhcnRQaXRjaDogbnVsbFxuICAgIH0pO1xuXG4gICAgY29uc3QgcG9zID0gb3B0LnBvcztcblxuICAgIC8vIFJhZGl1cyBlbmFibGVzIHBvaW50IGZlYXR1cmVzLCBsaWtlIG1hcmtlciBzeW1ib2xzLCB0byBiZSBjbGlja2VkLlxuICAgIGNvbnN0IHNpemUgPSAxNTtcbiAgICBjb25zdCBiYm94ID0gW1twb3MueCAtIHNpemUsIHBvcy55IC0gc2l6ZV0sIFtwb3MueCArIHNpemUsIHBvcy55ICsgc2l6ZV1dO1xuICAgIGNvbnN0IGZlYXR1cmVzID0gbWFwLnF1ZXJ5UmVuZGVyZWRGZWF0dXJlcyhiYm94KTtcbiAgICBpZiAoIWZlYXR1cmVzLmxlbmd0aCAmJiB0aGlzLnByb3BzLmlnbm9yZUVtcHR5RmVhdHVyZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrRmVhdHVyZXMoZmVhdHVyZXMpO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vblpvb20oe3Bvcywgc2NhbGV9KSB7XG4gICAgaWYgKHRoaXMucHJvcHMuem9vbURpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gY2xvbmVUcmFuc2Zvcm0obWFwLnRyYW5zZm9ybSk7XG4gICAgY29uc3QgYXJvdW5kID0gdW5wcm9qZWN0RnJvbVRyYW5zZm9ybSh0cmFuc2Zvcm0sIHBvcyk7XG4gICAgdHJhbnNmb3JtLnpvb20gPSB0cmFuc2Zvcm0uc2NhbGVab29tKG1hcC50cmFuc2Zvcm0uc2NhbGUgKiBzY2FsZSk7XG4gICAgdHJhbnNmb3JtLnNldExvY2F0aW9uQXRQb2ludChhcm91bmQsIHBvcyk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQodHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uWm9vbUVuZCgpIHtcbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiBmYWxzZVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjbGFzc05hbWUsIHdpZHRoLCBoZWlnaHQsIHN0eWxlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgbWFwU3R5bGUgPSB7XG4gICAgICAuLi5zdHlsZSxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgY3Vyc29yOiB0aGlzLl9jdXJzb3IoKVxuICAgIH07XG5cbiAgICBsZXQgY29udGVudCA9IFtcbiAgICAgIDxkaXYga2V5PVwibWFwXCIgcmVmPVwibWFwYm94TWFwXCJcbiAgICAgICAgc3R5bGU9eyBtYXBTdHlsZSB9IGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9Lz4sXG4gICAgICA8ZGl2IGtleT1cIm92ZXJsYXlzXCIgY2xhc3NOYW1lPVwib3ZlcmxheXNcIlxuICAgICAgICBzdHlsZT17IHtwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogMCwgdG9wOiAwfSB9PlxuICAgICAgICB7IHRoaXMucHJvcHMuY2hpbGRyZW4gfVxuICAgICAgPC9kaXY+XG4gICAgXTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQpIHtcbiAgICAgIGNvbnRlbnQgPSAoXG4gICAgICAgIDxNYXBJbnRlcmFjdGlvbnNcbiAgICAgICAgICBvbk1vdXNlRG93biA9eyB0aGlzLl9vbk1vdXNlRG93biB9XG4gICAgICAgICAgb25Nb3VzZURyYWcgPXsgdGhpcy5fb25Nb3VzZURyYWcgfVxuICAgICAgICAgIG9uTW91c2VSb3RhdGUgPXsgdGhpcy5fb25Nb3VzZVJvdGF0ZSB9XG4gICAgICAgICAgb25Nb3VzZVVwID17IHRoaXMuX29uTW91c2VVcCB9XG4gICAgICAgICAgb25Nb3VzZU1vdmUgPXsgdGhpcy5fb25Nb3VzZU1vdmUgfVxuICAgICAgICAgIG9uWm9vbSA9eyB0aGlzLl9vblpvb20gfVxuICAgICAgICAgIG9uWm9vbUVuZCA9eyB0aGlzLl9vblpvb21FbmQgfVxuICAgICAgICAgIHdpZHRoID17IHRoaXMucHJvcHMud2lkdGggfVxuICAgICAgICAgIGhlaWdodCA9eyB0aGlzLnByb3BzLmhlaWdodCB9XG4gICAgICAgICAgem9vbURpc2FibGVkID17IHRoaXMucHJvcHMuem9vbURpc2FibGVkIH1cbiAgICAgICAgICBkcmFnRGlzYWJsZWQgPXsgdGhpcy5wcm9wcy5kcmFnRGlzYWJsZWQgfT5cblxuICAgICAgICAgIHsgY29udGVudCB9XG5cbiAgICAgICAgPC9NYXBJbnRlcmFjdGlvbnM+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIC4uLnRoaXMucHJvcHMuc3R5bGUsXG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9IH0+XG5cbiAgICAgICAgeyBjb250ZW50IH1cblxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb2QodmFsdWUsIGRpdmlzb3IpIHtcbiAgY29uc3QgbW9kdWx1cyA9IHZhbHVlICUgZGl2aXNvcjtcbiAgcmV0dXJuIG1vZHVsdXMgPCAwID8gZGl2aXNvciArIG1vZHVsdXMgOiBtb2R1bHVzO1xufVxuXG5mdW5jdGlvbiB1bnByb2plY3RGcm9tVHJhbnNmb3JtKHRyYW5zZm9ybSwgcG9pbnQpIHtcbiAgcmV0dXJuIHRyYW5zZm9ybS5wb2ludExvY2F0aW9uKFBvaW50LmNvbnZlcnQocG9pbnQpKTtcbn1cblxuZnVuY3Rpb24gY2xvbmVUcmFuc2Zvcm0ob3JpZ2luYWwpIHtcbiAgY29uc3QgdHJhbnNmb3JtID0gbmV3IFRyYW5zZm9ybShvcmlnaW5hbC5fbWluWm9vbSwgb3JpZ2luYWwuX21heFpvb20pO1xuICB0cmFuc2Zvcm0ubGF0UmFuZ2UgPSBvcmlnaW5hbC5sYXRSYW5nZTtcbiAgdHJhbnNmb3JtLndpZHRoID0gb3JpZ2luYWwud2lkdGg7XG4gIHRyYW5zZm9ybS5oZWlnaHQgPSBvcmlnaW5hbC5oZWlnaHQ7XG4gIHRyYW5zZm9ybS56b29tID0gb3JpZ2luYWwuem9vbTtcbiAgdHJhbnNmb3JtLmNlbnRlciA9IG9yaWdpbmFsLmNlbnRlcjtcbiAgdHJhbnNmb3JtLmFuZ2xlID0gb3JpZ2luYWwuYW5nbGU7XG4gIHRyYW5zZm9ybS5hbHRpdHVkZSA9IG9yaWdpbmFsLmFsdGl0dWRlO1xuICB0cmFuc2Zvcm0ucGl0Y2ggPSBvcmlnaW5hbC5waXRjaDtcbiAgdHJhbnNmb3JtLmJlYXJpbmcgPSBvcmlnaW5hbC5iZWFyaW5nO1xuICB0cmFuc2Zvcm0uYWx0aXR1ZGUgPSBvcmlnaW5hbC5hbHRpdHVkZTtcbiAgcmV0dXJuIHRyYW5zZm9ybTtcbn1cblxuTWFwR0wucHJvcFR5cGVzID0gUFJPUF9UWVBFUztcbk1hcEdMLmRlZmF1bHRQcm9wcyA9IERFRkFVTFRfUFJPUFM7XG4iXX0=