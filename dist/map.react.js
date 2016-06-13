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
  zoomDisabled: _react2.default.PropTypes.bool
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAucmVhY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLElBQU0sWUFBWSxFQUFsQjtBQUNBLElBQU0sd0JBQXdCLEVBQTlCO0FBQ0EsSUFBTSxjQUFjLEdBQXBCOztBQUVBLElBQU0sYUFBYTs7OztBQUlqQixZQUFVLGlCQUFVLE1BQVYsQ0FBaUIsVUFKVjs7OztBQVFqQixhQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFSWDs7OztBQVlqQixRQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFaTjs7Ozs7QUFpQmpCLFlBQVUsaUJBQVUsU0FBVixDQUFvQixDQUM1QixpQkFBVSxNQURrQixFQUU1QixpQkFBVSxVQUFWLENBQXFCLG9CQUFVLEdBQS9CLENBRjRCLENBQXBCLENBakJPOzs7OztBQXlCakIsd0JBQXNCLGlCQUFVLE1BekJmOzs7Ozs7QUErQmpCLG9CQUFrQixpQkFBVSxJQS9CWDs7OztBQW1DakIsU0FBTyxpQkFBVSxNQUFWLENBQWlCLFVBbkNQOzs7O0FBdUNqQixVQUFRLGlCQUFVLE1BQVYsQ0FBaUIsVUF2Q1I7Ozs7OztBQTZDakIsY0FBWSxpQkFBVSxJQTdDTDs7Ozs7O0FBbURqQixtQkFBaUIsaUJBQVUsS0FuRFY7Ozs7Ozs7O0FBMkRqQixtQkFBaUIsaUJBQVUsSUEzRFY7Ozs7Ozs7QUFrRWpCLHVCQUFxQixpQkFBVSxJQWxFZDs7Ozs7QUF1RWpCLHNCQUFvQixpQkFBVSxJQXZFYjs7Ozs7Ozs7O0FBZ0ZqQixtQkFBaUIsaUJBQVUsSUFoRlY7Ozs7OztBQXNGakIseUJBQXVCLGlCQUFVLElBdEZoQjs7Ozs7O0FBNEZqQix1QkFB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O0FBQ0EsWUFBVSxRQUFWLEdBQXFCLFNBQVMsUUFBOUI7QUFDQSxZQUFVLEtBQVYsR0FBa0IsU0FBUyxLQUEzQjtBQUNBLFlBQVUsTUFBVixHQUFtQixTQUFTLE1BQTVCO0FBQ0EsWUFBVSxJQUFWLEdBQWlCLFNBQVMsSUFBMUI7QUFDQSxZQUFVLE1BQVYsR0FBbUIsU0FBUyxNQUE1QjtBQUNBLFlBQVUsS0FBVixHQUFrQixTQUFTLEtBQTNCO0FBQ0EsWUFBVSxRQUFWLEdBQXFCLFNBQVMsUUFBOUI7QUFDQSxZQUFVLEtBQVYsR0FBa0IsU0FBUyxLQUEzQjtBQUNBLFlBQVUsT0FBVixHQUFvQixTQUFTLE9BQTdCO0FBQ0EsWUFBVSxRQUFWLEdBQXFCLFNBQVMsUUFBOUI7QUFDQSxTQUFPLFNBQVA7QUFDRDs7QUFFRCxNQUFNLFNBQU4sR0FBa0IsVUFBbEI7QUFDQSxNQUFNLFlBQU4sR0FBcUIsYUFBckIiLCJmaWxlIjoibWFwLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJztcbmltcG9ydCBwdXJlUmVuZGVyIGZyb20gJ3B1cmUtcmVuZGVyLWRlY29yYXRvcic7XG5pbXBvcnQgZDMgZnJvbSAnZDMnO1xuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IG1hcGJveGdsLCB7UG9pbnR9IGZyb20gJ21hcGJveC1nbCc7XG5cbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IE1hcEludGVyYWN0aW9ucyBmcm9tICcuL21hcC1pbnRlcmFjdGlvbnMucmVhY3QnO1xuaW1wb3J0IGRpZmZTdHlsZXMgZnJvbSAnLi9kaWZmLXN0eWxlcyc7XG5cbi8vIE5PVEU6IFRyYW5zZm9ybSBpcyBub3QgYSBwdWJsaWMgQVBJIHNvIHdlIHNob3VsZCBiZSBjYXJlZnVsIHRvIGFsd2F5cyBsb2NrXG4vLyBkb3duIG1hcGJveC1nbCB0byBhIHNwZWNpZmljIG1ham9yLCBtaW5vciwgYW5kIHBhdGNoIHZlcnNpb24uXG5pbXBvcnQgVHJhbnNmb3JtIGZyb20gJ21hcGJveC1nbC9qcy9nZW8vdHJhbnNmb3JtJztcblxuLy8gTm90ZTogTWF4IHBpdGNoIGlzIGEgaGFyZCBjb2RlZCB2YWx1ZSAobm90IGEgbmFtZWQgY29uc3RhbnQpIGluIHRyYW5zZm9ybS5qc1xuY29uc3QgTUFYX1BJVENIID0gNjA7XG5jb25zdCBQSVRDSF9NT1VTRV9USFJFU0hPTEQgPSAyMDtcbmNvbnN0IFBJVENIX0FDQ0VMID0gMS4yO1xuXG5jb25zdCBQUk9QX1RZUEVTID0ge1xuICAvKipcbiAgICAqIFRoZSBsYXRpdHVkZSBvZiB0aGUgY2VudGVyIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgbGF0aXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgbG9uZ2l0dWRlIG9mIHRoZSBjZW50ZXIgb2YgdGhlIG1hcC5cbiAgICAqL1xuICBsb25naXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgdGlsZSB6b29tIGxldmVsIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgem9vbTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAvKipcbiAgICAqIFRoZSBNYXBib3ggc3R5bGUgdGhlIGNvbXBvbmVudCBzaG91bGQgdXNlLiBDYW4gZWl0aGVyIGJlIGEgc3RyaW5nIHVybFxuICAgICogb3IgYSBNYXBib3hHTCBzdHlsZSBJbW11dGFibGUuTWFwIG9iamVjdC5cbiAgICAqL1xuICBtYXBTdHlsZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKVxuICBdKSxcbiAgLyoqXG4gICAgKiBUaGUgTWFwYm94IEFQSSBhY2Nlc3MgdG9rZW4gdG8gcHJvdmlkZSB0byBtYXBib3gtZ2wtanMuIFRoaXMgaXMgcmVxdWlyZWRcbiAgICAqIHdoZW4gdXNpbmcgTWFwYm94IHByb3ZpZGVkIHZlY3RvciB0aWxlcyBhbmQgc3R5bGVzLlxuICAgICovXG4gIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvKipcbiAgICAqIGBvbkNoYW5nZVZpZXdwb3J0YCBjYWxsYmFjayBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIGludGVyYWN0ZWQgd2l0aCB0aGVcbiAgICAqIG1hcC4gVGhlIG9iamVjdCBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrIGNvbnRhaW5lcnMgYGxhdGl0dWRlYCxcbiAgICAqIGBsb25naXR1ZGVgIGFuZCBgem9vbWAgaW5mb3JtYXRpb24uXG4gICAgKi9cbiAgb25DaGFuZ2VWaWV3cG9ydDogUHJvcFR5cGVzLmZ1bmMsXG4gIC8qKlxuICAgICogVGhlIHdpZHRoIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgaGVpZ2h0IG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogSXMgdGhlIGNvbXBvbmVudCBjdXJyZW50bHkgYmVpbmcgZHJhZ2dlZC4gVGhpcyBpcyB1c2VkIHRvIHNob3cvaGlkZSB0aGVcbiAgICAqIGRyYWcgY3Vyc29yLiBBbHNvIHVzZWQgYXMgYW4gb3B0aW1pemF0aW9uIGluIHNvbWUgb3ZlcmxheXMgYnkgcHJldmVudGluZ1xuICAgICogcmVuZGVyaW5nIHdoaWxlIGRyYWdnaW5nLlxuICAgICovXG4gIGlzRHJhZ2dpbmc6IFByb3BUeXBlcy5ib29sLFxuICAvKipcbiAgICAqIFJlcXVpcmVkIHRvIGNhbGN1bGF0ZSB0aGUgbW91c2UgcHJvamVjdGlvbiBhZnRlciB0aGUgZmlyc3QgY2xpY2sgZXZlbnRcbiAgICAqIGR1cmluZyBkcmFnZ2luZy4gV2hlcmUgdGhlIG1hcCBpcyBkZXBlbmRzIG9uIHdoZXJlIHlvdSBmaXJzdCBjbGlja2VkIG9uXG4gICAgKiB0aGUgbWFwLlxuICAgICovXG4gIHN0YXJ0RHJhZ0xuZ0xhdDogUHJvcFR5cGVzLmFycmF5LFxuICAvKipcbiAgICAqIENhbGxlZCB3aGVuIGEgZmVhdHVyZSBpcyBob3ZlcmVkIG92ZXIuIEZlYXR1cmVzIG11c3Qgc2V0IHRoZVxuICAgICogYGludGVyYWN0aXZlYCBwcm9wZXJ0eSB0byBgdHJ1ZWAgZm9yIHRoaXMgdG8gd29yayBwcm9wZXJseS4gc2VlIHRoZVxuICAgICogTWFwYm94IGV4YW1wbGU6IGh0dHBzOi8vd3d3Lm1hcGJveC5jb20vbWFwYm94LWdsLWpzL2V4YW1wbGUvZmVhdHVyZXNhdC9cbiAgICAqIFRoZSBmaXJzdCBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2sgd2lsbCBiZSB0aGUgYXJyYXkgb2YgZmVhdHVyZSB0aGVcbiAgICAqIG1vdXNlIGlzIG92ZXIuIFRoaXMgaXMgdGhlIHNhbWUgcmVzcG9uc2UgcmV0dXJuZWQgZnJvbSBgZmVhdHVyZXNBdGAuXG4gICAgKi9cbiAgb25Ib3ZlckZlYXR1cmVzOiBQcm9wVHlwZXMuZnVuYyxcbiAgLyoqXG4gICAgKiBEZWZhdWx0cyB0byBUUlVFXG4gICAgKiBTZXQgdG8gZmFsc2UgdG8gZW5hYmxlIG9uSG92ZXJGZWF0dXJlcyB0byBiZSBjYWxsZWQgcmVnYXJkbGVzcyBpZlxuICAgICogdGhlcmUgaXMgYW4gYWN0dWFsIGZlYXR1cmUgYXQgeCwgeS4gVGhpcyBpcyB1c2VmdWwgdG8gZW11bGF0ZVxuICAgICogXCJtb3VzZS1vdXRcIiBiZWhhdmlvcnMgb24gZmVhdHVyZXMuXG4gICAgKi9cbiAgaWdub3JlRW1wdHlGZWF0dXJlczogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBTaG93IGF0dHJpYnV0aW9uIGNvbnRyb2wgb3Igbm90LlxuICAgICovXG4gIGF0dHJpYnV0aW9uQ29udHJvbDogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBDYWxsZWQgd2hlbiBhIGZlYXR1cmUgaXMgY2xpY2tlZCBvbi4gRmVhdHVyZXMgbXVzdCBzZXQgdGhlXG4gICAgKiBgaW50ZXJhY3RpdmVgIHByb3BlcnR5IHRvIGB0cnVlYCBmb3IgdGhpcyB0byB3b3JrIHByb3Blcmx5LiBzZWUgdGhlXG4gICAgKiBNYXBib3ggZXhhbXBsZTogaHR0cHM6Ly93d3cubWFwYm94LmNvbS9tYXBib3gtZ2wtanMvZXhhbXBsZS9mZWF0dXJlc2F0L1xuICAgICogVGhlIGZpcnN0IGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjayB3aWxsIGJlIHRoZSBhcnJheSBvZiBmZWF0dXJlIHRoZVxuICAgICogbW91c2UgaXMgb3Zlci4gVGhpcyBpcyB0aGUgc2FtZSByZXNwb25zZSByZXR1cm5lZCBmcm9tIGBmZWF0dXJlc0F0YC5cbiAgICAqL1xuICBvbkNsaWNrRmVhdHVyZXM6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgICogUGFzc2VkIHRvIE1hcGJveCBNYXAgY29uc3RydWN0b3Igd2hpY2ggcGFzc2VzIGl0IHRvIHRoZSBjYW52YXMgY29udGV4dC5cbiAgICAqIFRoaXMgaXMgdW5zZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGV4cG9ydCB0aGUgY2FudmFzIGFzIGEgUE5HLlxuICAgICovXG4gIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBUaGVyZSBhcmUgc3RpbGwga25vd24gaXNzdWVzIHdpdGggc3R5bGUgZGlmZmluZy4gQXMgYSB0ZW1wb3Jhcnkgc3RvcGdhcCxcbiAgICAqIGFkZCB0aGUgb3B0aW9uIHRvIHByZXZlbnQgc3R5bGUgZGlmZmluZy5cbiAgICAqL1xuICBwcmV2ZW50U3R5bGVEaWZmaW5nOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIEVuYWJsZXMgcGVyc3BlY3RpdmUgY29udHJvbCBldmVudCBoYW5kbGluZyAoQ29tbWFuZC1yb3RhdGUpXG4gICAgKi9cbiAgcGVyc3BlY3RpdmVFbmFibGVkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIFNwZWNpZnkgdGhlIGJlYXJpbmcgb2YgdGhlIHZpZXdwb3J0XG4gICAgKi9cbiAgYmVhcmluZzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICAqIFNwZWNpZnkgdGhlIHBpdGNoIG9mIHRoZSB2aWV3cG9ydFxuICAgICovXG4gIHBpdGNoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgICogU3BlY2lmeSB0aGUgYWx0aXR1ZGUgb2YgdGhlIHZpZXdwb3J0IGNhbWVyYVxuICAgICogVW5pdDogbWFwIGhlaWdodHMsIGRlZmF1bHQgMS41XG4gICAgKiBOb24tcHVibGljIEFQSSwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXBib3gvbWFwYm94LWdsLWpzL2lzc3Vlcy8xMTM3XG4gICAgKi9cbiAgYWx0aXR1ZGU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cbiAgLyoqXG4gICAgKiBEaXNhYmxlZCBkcmFnZ2luZyBvZiB0aGUgbWFwXG4gICAgKi9cbiAgZHJhZ0Rpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIERpc2FibGVkIHpvb21pbmcgb2YgdGhlIG1hcFxuICAgICovXG4gIHpvb21EaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG59O1xuXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICBtYXBTdHlsZTogJ21hcGJveDovL3N0eWxlcy9tYXBib3gvbGlnaHQtdjgnLFxuICBvbkNoYW5nZVZpZXdwb3J0OiBudWxsLFxuICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogY29uZmlnLkRFRkFVTFRTLk1BUEJPWF9BUElfQUNDRVNTX1RPS0VOLFxuICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IGZhbHNlLFxuICBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWUsXG4gIGlnbm9yZUVtcHR5RmVhdHVyZXM6IHRydWUsXG4gIGJlYXJpbmc6IDAsXG4gIHBpdGNoOiAwLFxuICBhbHRpdHVkZTogMS41XG59O1xuXG5AcHVyZVJlbmRlclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwR0wgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc0RyYWdnaW5nOiBmYWxzZSxcbiAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogbnVsbCxcbiAgICAgIHN0YXJ0QmVhcmluZzogbnVsbCxcbiAgICAgIHN0YXJ0UGl0Y2g6IG51bGxcbiAgICB9O1xuICAgIG1hcGJveGdsLmFjY2Vzc1Rva2VuID0gcHJvcHMubWFwYm94QXBpQWNjZXNzVG9rZW47XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCBtYXBTdHlsZSA9IHRoaXMucHJvcHMubWFwU3R5bGUgaW5zdGFuY2VvZiBJbW11dGFibGUuTWFwID9cbiAgICAgIHRoaXMucHJvcHMubWFwU3R5bGUudG9KUygpIDpcbiAgICAgIHRoaXMucHJvcHMubWFwU3R5bGU7XG4gICAgY29uc3QgbWFwID0gbmV3IG1hcGJveGdsLk1hcCh7XG4gICAgICBjb250YWluZXI6IHRoaXMucmVmcy5tYXBib3hNYXAsXG4gICAgICBjZW50ZXI6IFt0aGlzLnByb3BzLmxvbmdpdHVkZSwgdGhpcy5wcm9wcy5sYXRpdHVkZV0sXG4gICAgICB6b29tOiB0aGlzLnByb3BzLnpvb20sXG4gICAgICBwaXRjaDogdGhpcy5wcm9wcy5waXRjaCxcbiAgICAgIGJlYXJpbmc6IHRoaXMucHJvcHMuYmVhcmluZyxcbiAgICAgIHN0eWxlOiBtYXBTdHlsZSxcbiAgICAgIGludGVyYWN0aXZlOiBmYWxzZSxcbiAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdGhpcy5wcm9wcy5wcmVzZXJ2ZURyYXdpbmdCdWZmZXJcbiAgICAgIC8vIFRPRE8/XG4gICAgICAvLyBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRoaXMucHJvcHMuYXR0cmlidXRpb25Db250cm9sXG4gICAgfSk7XG5cbiAgICBkMy5zZWxlY3QobWFwLmdldENhbnZhcygpKS5zdHlsZSgnb3V0bGluZScsICdub25lJyk7XG5cbiAgICB0aGlzLl9tYXAgPSBtYXA7XG4gICAgdGhpcy5fdXBkYXRlTWFwVmlld3BvcnQoe30sIHRoaXMucHJvcHMpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0pO1xuICAgIC8vIHN1cHBvcnQgZm9yIGV4dGVybmFsIG1hbmlwdWxhdGlvbiBvZiB1bmRlcmx5aW5nIG1hcCAvLyBUT0RPIGEgYmV0dGVyIGFwcHJvYWNoXG4gICAgbWFwLm9uKCdtb3ZlZW5kJywgKCkgPT4gdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSkpO1xuICAgIG1hcC5vbignem9vbWVuZCcsICgpID0+IHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0pKTtcbiAgfVxuXG4gIC8vIE5ldyBwcm9wcyBhcmUgY29taW4nIHJvdW5kIHRoZSBjb3JuZXIhXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV3UHJvcHMpIHtcbiAgICB0aGlzLl91cGRhdGVTdGF0ZUZyb21Qcm9wcyh0aGlzLnByb3BzLCBuZXdQcm9wcyk7XG4gICAgdGhpcy5fdXBkYXRlTWFwVmlld3BvcnQodGhpcy5wcm9wcywgbmV3UHJvcHMpO1xuICAgIHRoaXMuX3VwZGF0ZU1hcFN0eWxlKHRoaXMucHJvcHMsIG5ld1Byb3BzKTtcbiAgICAvLyBTYXZlIHdpZHRoL2hlaWdodCBzbyB0aGF0IHdlIGNhbiBjaGVjayB0aGVtIGluIGNvbXBvbmVudERpZFVwZGF0ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgLy8gbWFwLnJlc2l6ZSgpIHJlYWRzIHNpemUgZnJvbSBET00sIHdlIG5lZWQgdG8gY2FsbCBhZnRlciByZW5kZXJcbiAgICB0aGlzLl91cGRhdGVNYXBTaXplKHRoaXMuc3RhdGUsIHRoaXMucHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuX21hcCkge1xuICAgICAgdGhpcy5fbWFwLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIF9jdXJzb3IoKSB7XG4gICAgY29uc3QgaXNJbnRlcmFjdGl2ZSA9XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQgfHxcbiAgICAgIHRoaXMucHJvcHMub25DbGlja0ZlYXR1cmUgfHxcbiAgICAgIHRoaXMucHJvcHMub25Ib3ZlckZlYXR1cmVzO1xuICAgIGlmIChpc0ludGVyYWN0aXZlKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5pc0RyYWdnaW5nID9cbiAgICAgICAgY29uZmlnLkNVUlNPUi5HUkFCQklORyA6IGNvbmZpZy5DVVJTT1IuR1JBQjtcbiAgICB9XG4gICAgcmV0dXJuICdpbmhlcml0JztcbiAgfVxuXG4gIF9nZXRNYXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcDtcbiAgfVxuXG4gIF91cGRhdGVTdGF0ZUZyb21Qcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBtYXBib3hnbC5hY2Nlc3NUb2tlbiA9IG5ld1Byb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VuO1xuICAgIGNvbnN0IHtzdGFydERyYWdMbmdMYXR9ID0gbmV3UHJvcHM7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGFydERyYWdMbmdMYXQ6IHN0YXJ0RHJhZ0xuZ0xhdCAmJiBzdGFydERyYWdMbmdMYXQuc2xpY2UoKVxuICAgIH0pO1xuICB9XG5cbiAgLy8gSW5kaXZpZHVhbGx5IHVwZGF0ZSB0aGUgbWFwcyBzb3VyY2UgYW5kIGxheWVycyB0aGF0IGhhdmUgY2hhbmdlZCBpZiBhbGxcbiAgLy8gb3RoZXIgc3R5bGUgcHJvcHMgaGF2ZW4ndCBjaGFuZ2VkLiBUaGlzIHByZXZlbnRzIGZsaWNraW5nIG9mIHRoZSBtYXAgd2hlblxuICAvLyBzdHlsZXMgb25seSBjaGFuZ2Ugc291cmNlcyBvciBsYXllcnMuXG4gIF9zZXREaWZmU3R5bGUocHJldlN0eWxlLCBuZXh0U3R5bGUpIHtcbiAgICBjb25zdCBwcmV2S2V5c01hcCA9IHByZXZTdHlsZSAmJiBzdHlsZUtleXNNYXAocHJldlN0eWxlKSB8fCB7fTtcbiAgICBjb25zdCBuZXh0S2V5c01hcCA9IHN0eWxlS2V5c01hcChuZXh0U3R5bGUpO1xuICAgIGZ1bmN0aW9uIHN0eWxlS2V5c01hcChzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlLm1hcCgoKSA9PiB0cnVlKS5kZWxldGUoJ2xheWVycycpLmRlbGV0ZSgnc291cmNlcycpLnRvSlMoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcHJvcHNPdGhlclRoYW5MYXllcnNPclNvdXJjZXNEaWZmZXIoKSB7XG4gICAgICBjb25zdCBwcmV2S2V5c0xpc3QgPSBPYmplY3Qua2V5cyhwcmV2S2V5c01hcCk7XG4gICAgICBjb25zdCBuZXh0S2V5c0xpc3QgPSBPYmplY3Qua2V5cyhuZXh0S2V5c01hcCk7XG4gICAgICBpZiAocHJldktleXNMaXN0Lmxlbmd0aCAhPT0gbmV4dEtleXNMaXN0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIGBuZXh0U3R5bGVgIGFuZCBgcHJldlN0eWxlYCBzaG91bGQgbm90IGhhdmUgdGhlIHNhbWUgc2V0IG9mIHByb3BzLlxuICAgICAgaWYgKG5leHRLZXlzTGlzdC5zb21lKFxuICAgICAgICBrZXkgPT4gcHJldlN0eWxlLmdldChrZXkpICE9PSBuZXh0U3R5bGUuZ2V0KGtleSlcbiAgICAgICAgLy8gQnV0IHRoZSB2YWx1ZSBvZiBvbmUgb2YgdGhvc2UgcHJvcHMgaXMgZGlmZmVyZW50LlxuICAgICAgKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcblxuICAgIGlmICghcHJldlN0eWxlIHx8IHByb3BzT3RoZXJUaGFuTGF5ZXJzT3JTb3VyY2VzRGlmZmVyKCkpIHtcbiAgICAgIG1hcC5zZXRTdHlsZShuZXh0U3R5bGUudG9KUygpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7c291cmNlc0RpZmYsIGxheWVyc0RpZmZ9ID0gZGlmZlN0eWxlcyhwcmV2U3R5bGUsIG5leHRTdHlsZSk7XG5cbiAgICAvLyBUT0RPOiBJdCdzIHJhdGhlciBkaWZmaWN1bHQgdG8gZGV0ZXJtaW5lIHN0eWxlIGRpZmZpbmcgaW4gdGhlIHByZXNlbmNlXG4gICAgLy8gb2YgcmVmcy4gRm9yIG5vdywgaWYgYW55IHN0eWxlIHVwZGF0ZSBoYXMgYSByZWYsIGZhbGxiYWNrIHRvIG5vIGRpZmZpbmcuXG4gICAgLy8gV2UgY2FuIGNvbWUgYmFjayB0byB0aGlzIGNhc2UgaWYgdGhlcmUncyBhIHNvbGlkIHVzZWNhc2UuXG4gICAgaWYgKGxheWVyc0RpZmYudXBkYXRlcy5zb21lKG5vZGUgPT4gbm9kZS5sYXllci5nZXQoJ3JlZicpKSkge1xuICAgICAgbWFwLnNldFN0eWxlKG5leHRTdHlsZS50b0pTKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZW50ZXIgb2Ygc291cmNlc0RpZmYuZW50ZXIpIHtcbiAgICAgIG1hcC5hZGRTb3VyY2UoZW50ZXIuaWQsIGVudGVyLnNvdXJjZS50b0pTKCkpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHVwZGF0ZSBvZiBzb3VyY2VzRGlmZi51cGRhdGUpIHtcbiAgICAgIG1hcC5yZW1vdmVTb3VyY2UodXBkYXRlLmlkKTtcbiAgICAgIG1hcC5hZGRTb3VyY2UodXBkYXRlLmlkLCB1cGRhdGUuc291cmNlLnRvSlMoKSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZXhpdCBvZiBzb3VyY2VzRGlmZi5leGl0KSB7XG4gICAgICBtYXAucmVtb3ZlU291cmNlKGV4aXQuaWQpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGV4aXQgb2YgbGF5ZXJzRGlmZi5leGl0aW5nKSB7XG4gICAgICBpZiAobWFwLnN0eWxlLmdldExheWVyKGV4aXQuaWQpKSB7XG4gICAgICAgIG1hcC5yZW1vdmVMYXllcihleGl0LmlkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCB1cGRhdGUgb2YgbGF5ZXJzRGlmZi51cGRhdGVzKSB7XG4gICAgICBpZiAoIXVwZGF0ZS5lbnRlcikge1xuICAgICAgICAvLyBUaGlzIGlzIGFuIG9sZCBsYXllciB0aGF0IG5lZWRzIHRvIGJlIHVwZGF0ZWQuIFJlbW92ZSB0aGUgb2xkIGxheWVyXG4gICAgICAgIC8vIHdpdGggdGhlIHNhbWUgaWQgYW5kIGFkZCBpdCBiYWNrIGFnYWluLlxuICAgICAgICBtYXAucmVtb3ZlTGF5ZXIodXBkYXRlLmlkKTtcbiAgICAgIH1cbiAgICAgIG1hcC5hZGRMYXllcih1cGRhdGUubGF5ZXIudG9KUygpLCB1cGRhdGUuYmVmb3JlKTtcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlTWFwU3R5bGUob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgY29uc3QgbWFwU3R5bGUgPSBuZXdQcm9wcy5tYXBTdHlsZTtcbiAgICBjb25zdCBvbGRNYXBTdHlsZSA9IG9sZFByb3BzLm1hcFN0eWxlO1xuICAgIGlmIChtYXBTdHlsZSAhPT0gb2xkTWFwU3R5bGUpIHtcbiAgICAgIGlmIChtYXBTdHlsZSBpbnN0YW5jZW9mIEltbXV0YWJsZS5NYXApIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMucHJldmVudFN0eWxlRGlmZmluZykge1xuICAgICAgICAgIHRoaXMuX2dldE1hcCgpLnNldFN0eWxlKG1hcFN0eWxlLnRvSlMoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fc2V0RGlmZlN0eWxlKG9sZE1hcFN0eWxlLCBtYXBTdHlsZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2dldE1hcCgpLnNldFN0eWxlKG1hcFN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfdXBkYXRlTWFwVmlld3BvcnQob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgY29uc3Qgdmlld3BvcnRDaGFuZ2VkID1cbiAgICAgIG5ld1Byb3BzLmxhdGl0dWRlICE9PSBvbGRQcm9wcy5sYXRpdHVkZSB8fFxuICAgICAgbmV3UHJvcHMubG9uZ2l0dWRlICE9PSBvbGRQcm9wcy5sb25naXR1ZGUgfHxcbiAgICAgIG5ld1Byb3BzLnpvb20gIT09IG9sZFByb3BzLnpvb20gfHxcbiAgICAgIG5ld1Byb3BzLnBpdGNoICE9PSBvbGRQcm9wcy5waXRjaCB8fFxuICAgICAgbmV3UHJvcHMuYmVhcmluZyAhPT0gb2xkUHJvcHMuYmVhcmluZyB8fFxuICAgICAgbmV3UHJvcHMuYWx0aXR1ZGUgIT09IG9sZFByb3BzLmFsdGl0dWRlO1xuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG5cbiAgICBpZiAodmlld3BvcnRDaGFuZ2VkKSB7XG4gICAgICBtYXAuanVtcFRvKHtcbiAgICAgICAgY2VudGVyOiBbbmV3UHJvcHMubG9uZ2l0dWRlLCBuZXdQcm9wcy5sYXRpdHVkZV0sXG4gICAgICAgIHpvb206IG5ld1Byb3BzLnpvb20sXG4gICAgICAgIGJlYXJpbmc6IG5ld1Byb3BzLmJlYXJpbmcsXG4gICAgICAgIHBpdGNoOiBuZXdQcm9wcy5waXRjaFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRPRE8gLSBqdW1wVG8gZG9lc24ndCBoYW5kbGUgYWx0aXR1ZGVcbiAgICAgIGlmIChuZXdQcm9wcy5hbHRpdHVkZSAhPT0gb2xkUHJvcHMuYWx0aXR1ZGUpIHtcbiAgICAgICAgbWFwLnRyYW5zZm9ybS5hbHRpdHVkZSA9IG5ld1Byb3BzLmFsdGl0dWRlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE5vdGU6IG5lZWRzIHRvIGJlIGNhbGxlZCBhZnRlciByZW5kZXIgKGUuZy4gaW4gY29tcG9uZW50RGlkVXBkYXRlKVxuICBfdXBkYXRlTWFwU2l6ZShvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBjb25zdCBzaXplQ2hhbmdlZCA9XG4gICAgICBvbGRQcm9wcy53aWR0aCAhPT0gbmV3UHJvcHMud2lkdGggfHwgb2xkUHJvcHMuaGVpZ2h0ICE9PSBuZXdQcm9wcy5oZWlnaHQ7XG5cbiAgICBpZiAoc2l6ZUNoYW5nZWQpIHtcbiAgICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgICAgbWFwLnJlc2l6ZSgpO1xuICAgICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSk7XG4gICAgfVxuICB9XG5cbiAgX2NhbGN1bGF0ZU5ld1BpdGNoQW5kQmVhcmluZyh7cG9zLCBzdGFydFBvcywgc3RhcnRCZWFyaW5nLCBzdGFydFBpdGNofSkge1xuICAgIGNvbnN0IHhEZWx0YSA9IHBvcy54IC0gc3RhcnRQb3MueDtcbiAgICBjb25zdCBiZWFyaW5nID0gc3RhcnRCZWFyaW5nICsgMTgwICogeERlbHRhIC8gdGhpcy5wcm9wcy53aWR0aDtcblxuICAgIGxldCBwaXRjaCA9IHN0YXJ0UGl0Y2g7XG4gICAgY29uc3QgeURlbHRhID0gcG9zLnkgLSBzdGFydFBvcy55O1xuICAgIGlmICh5RGVsdGEgPiAwKSB7XG4gICAgICAvLyBEcmFnZ2luZyBkb3dud2FyZHMsIGdyYWR1YWxseSBkZWNyZWFzZSBwaXRjaFxuICAgICAgaWYgKE1hdGguYWJzKHRoaXMucHJvcHMuaGVpZ2h0IC0gc3RhcnRQb3MueSkgPiBQSVRDSF9NT1VTRV9USFJFU0hPTEQpIHtcbiAgICAgICAgY29uc3Qgc2NhbGUgPSB5RGVsdGEgLyAodGhpcy5wcm9wcy5oZWlnaHQgLSBzdGFydFBvcy55KTtcbiAgICAgICAgcGl0Y2ggPSAoMSAtIHNjYWxlKSAqIFBJVENIX0FDQ0VMICogc3RhcnRQaXRjaDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHlEZWx0YSA8IDApIHtcbiAgICAgIC8vIERyYWdnaW5nIHVwd2FyZHMsIGdyYWR1YWxseSBpbmNyZWFzZSBwaXRjaFxuICAgICAgaWYgKHN0YXJ0UG9zLnkgPiBQSVRDSF9NT1VTRV9USFJFU0hPTEQpIHtcbiAgICAgICAgLy8gTW92ZSBmcm9tIDAgdG8gMSBhcyB3ZSBkcmFnIHVwd2FyZHNcbiAgICAgICAgY29uc3QgeVNjYWxlID0gMSAtIHBvcy55IC8gc3RhcnRQb3MueTtcbiAgICAgICAgLy8gR3JhZHVhbGx5IGFkZCB1bnRpbCB3ZSBoaXQgbWF4IHBpdGNoXG4gICAgICAgIHBpdGNoID0gc3RhcnRQaXRjaCArIHlTY2FsZSAqIChNQVhfUElUQ0ggLSBzdGFydFBpdGNoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmRlYnVnKHN0YXJ0UGl0Y2gsIHBpdGNoKTtcbiAgICByZXR1cm4ge1xuICAgICAgcGl0Y2g6IE1hdGgubWF4KE1hdGgubWluKHBpdGNoLCBNQVhfUElUQ0gpLCAwKSxcbiAgICAgIGJlYXJpbmdcbiAgICB9O1xuICB9XG5cbiAgIC8vIEhlbHBlciB0byBjYWxsIHByb3BzLm9uQ2hhbmdlVmlld3BvcnRcbiAgX2NhbGxPbkNoYW5nZVZpZXdwb3J0KHRyYW5zZm9ybSwgb3B0cyA9IHt9KSB7XG4gICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0KHtcbiAgICAgICAgbGF0aXR1ZGU6IHRyYW5zZm9ybS5jZW50ZXIubGF0LFxuICAgICAgICBsb25naXR1ZGU6IG1vZCh0cmFuc2Zvcm0uY2VudGVyLmxuZyArIDE4MCwgMzYwKSAtIDE4MCxcbiAgICAgICAgem9vbTogdHJhbnNmb3JtLnpvb20sXG4gICAgICAgIHBpdGNoOiB0cmFuc2Zvcm0ucGl0Y2gsXG4gICAgICAgIGJlYXJpbmc6IG1vZCh0cmFuc2Zvcm0uYmVhcmluZyArIDE4MCwgMzYwKSAtIDE4MCxcblxuICAgICAgICBpc0RyYWdnaW5nOiB0aGlzLnByb3BzLmlzRHJhZ2dpbmcsXG4gICAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogdGhpcy5wcm9wcy5zdGFydERyYWdMbmdMYXQsXG4gICAgICAgIHN0YXJ0QmVhcmluZzogdGhpcy5wcm9wcy5zdGFydEJlYXJpbmcsXG4gICAgICAgIHN0YXJ0UGl0Y2g6IHRoaXMucHJvcHMuc3RhcnRQaXRjaCxcblxuICAgICAgICBwcm9qZWN0aW9uTWF0cml4OiB0cmFuc2Zvcm0ucHJvak1hdHJpeCxcblxuICAgICAgICAuLi5vcHRzXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VEb3duKHtwb3N9KSB7XG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgY29uc3QgbG5nTGF0ID0gdW5wcm9qZWN0RnJvbVRyYW5zZm9ybShtYXAudHJhbnNmb3JtLCBwb3MpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWUsXG4gICAgICBzdGFydERyYWdMbmdMYXQ6IFtsbmdMYXQubG5nLCBsbmdMYXQubGF0XSxcbiAgICAgIHN0YXJ0QmVhcmluZzogbWFwLnRyYW5zZm9ybS5iZWFyaW5nLFxuICAgICAgc3RhcnRQaXRjaDogbWFwLnRyYW5zZm9ybS5waXRjaFxuICAgIH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlRHJhZyh7cG9zfSkge1xuICAgIGlmICghdGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0IHx8IHRoaXMucHJvcHMuZHJhZ0Rpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdGFrZSB0aGUgc3RhcnQgbG5nbGF0IGFuZCBwdXQgaXQgd2hlcmUgdGhlIG1vdXNlIGlzIGRvd24uXG4gICAgYXNzZXJ0KHRoaXMucHJvcHMuc3RhcnREcmFnTG5nTGF0LCAnYHN0YXJ0RHJhZ0xuZ0xhdGAgcHJvcCBpcyByZXF1aXJlZCAnICtcbiAgICAgICdmb3IgbW91c2UgZHJhZyBiZWhhdmlvciB0byBjYWxjdWxhdGUgd2hlcmUgdG8gcG9zaXRpb24gdGhlIG1hcC4nKTtcblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGNsb25lVHJhbnNmb3JtKG1hcC50cmFuc2Zvcm0pO1xuICAgIHRyYW5zZm9ybS5zZXRMb2NhdGlvbkF0UG9pbnQodGhpcy5wcm9wcy5zdGFydERyYWdMbmdMYXQsIHBvcyk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQodHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VSb3RhdGUoe3Bvcywgc3RhcnRQb3N9KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQgfHwgIXRoaXMucHJvcHMucGVyc3BlY3RpdmVFbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge3N0YXJ0QmVhcmluZywgc3RhcnRQaXRjaH0gPSB0aGlzLnByb3BzO1xuICAgIGFzc2VydCh0eXBlb2Ygc3RhcnRCZWFyaW5nID09PSAnbnVtYmVyJyxcbiAgICAgICdgc3RhcnRCZWFyaW5nYCBwcm9wIGlzIHJlcXVpcmVkIGZvciBtb3VzZSByb3RhdGUgYmVoYXZpb3InKTtcbiAgICBhc3NlcnQodHlwZW9mIHN0YXJ0UGl0Y2ggPT09ICdudW1iZXInLFxuICAgICAgJ2BzdGFydFBpdGNoYCBwcm9wIGlzIHJlcXVpcmVkIGZvciBtb3VzZSByb3RhdGUgYmVoYXZpb3InKTtcblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuXG4gICAgY29uc3Qge3BpdGNoLCBiZWFyaW5nfSA9IHRoaXMuX2NhbGN1bGF0ZU5ld1BpdGNoQW5kQmVhcmluZyh7XG4gICAgICBwb3MsXG4gICAgICBzdGFydFBvcyxcbiAgICAgIHN0YXJ0QmVhcmluZyxcbiAgICAgIHN0YXJ0UGl0Y2hcbiAgICB9KTtcblxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGNsb25lVHJhbnNmb3JtKG1hcC50cmFuc2Zvcm0pO1xuICAgIHRyYW5zZm9ybS5iZWFyaW5nID0gYmVhcmluZztcbiAgICB0cmFuc2Zvcm0ucGl0Y2ggPSBwaXRjaDtcblxuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KHRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlTW92ZShvcHQpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMub25Ib3ZlckZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgY29uc3QgcG9zID0gb3B0LnBvcztcblxuICAgIGNvbnN0IGZlYXR1cmVzID0gbWFwLnF1ZXJ5UmVuZGVyZWRGZWF0dXJlcyhbcG9zLngsIHBvcy55XSk7XG4gICAgaWYgKCFmZWF0dXJlcy5sZW5ndGggJiYgdGhpcy5wcm9wcy5pZ25vcmVFbXB0eUZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMub25Ib3ZlckZlYXR1cmVzKGZlYXR1cmVzKTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZVVwKG9wdCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5vbkNsaWNrRmVhdHVyZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiBmYWxzZSxcbiAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogbnVsbCxcbiAgICAgIHN0YXJ0QmVhcmluZzogbnVsbCxcbiAgICAgIHN0YXJ0UGl0Y2g6IG51bGxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBvcyA9IG9wdC5wb3M7XG5cbiAgICAvLyBSYWRpdXMgZW5hYmxlcyBwb2ludCBmZWF0dXJlcywgbGlrZSBtYXJrZXIgc3ltYm9scywgdG8gYmUgY2xpY2tlZC5cbiAgICBjb25zdCBzaXplID0gMTU7XG4gICAgY29uc3QgYmJveCA9IFtbcG9zLnggLSBzaXplLCBwb3MueSAtIHNpemVdLCBbcG9zLnggKyBzaXplLCBwb3MueSArIHNpemVdXTtcbiAgICBjb25zdCBmZWF0dXJlcyA9IG1hcC5xdWVyeVJlbmRlcmVkRmVhdHVyZXMoYmJveCk7XG4gICAgaWYgKCFmZWF0dXJlcy5sZW5ndGggJiYgdGhpcy5wcm9wcy5pZ25vcmVFbXB0eUZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMub25DbGlja0ZlYXR1cmVzKGZlYXR1cmVzKTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25ab29tKHtwb3MsIHNjYWxlfSkge1xuICAgIGlmICh0aGlzLnByb3BzLnpvb21EaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGNsb25lVHJhbnNmb3JtKG1hcC50cmFuc2Zvcm0pO1xuICAgIGNvbnN0IGFyb3VuZCA9IHVucHJvamVjdEZyb21UcmFuc2Zvcm0odHJhbnNmb3JtLCBwb3MpO1xuICAgIHRyYW5zZm9ybS56b29tID0gdHJhbnNmb3JtLnNjYWxlWm9vbShtYXAudHJhbnNmb3JtLnNjYWxlICogc2NhbGUpO1xuICAgIHRyYW5zZm9ybS5zZXRMb2NhdGlvbkF0UG9pbnQoYXJvdW5kLCBwb3MpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KHRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vblpvb21FbmQoKSB7XG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7Y2xhc3NOYW1lLCB3aWR0aCwgaGVpZ2h0LCBzdHlsZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IG1hcFN0eWxlID0ge1xuICAgICAgLi4uc3R5bGUsXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGN1cnNvcjogdGhpcy5fY3Vyc29yKClcbiAgICB9O1xuXG4gICAgbGV0IGNvbnRlbnQgPSBbXG4gICAgICA8ZGl2IGtleT1cIm1hcFwiIHJlZj1cIm1hcGJveE1hcFwiXG4gICAgICAgIHN0eWxlPXsgbWFwU3R5bGUgfSBjbGFzc05hbWU9eyBjbGFzc05hbWUgfS8+LFxuICAgICAgPGRpdiBrZXk9XCJvdmVybGF5c1wiIGNsYXNzTmFtZT1cIm92ZXJsYXlzXCJcbiAgICAgICAgc3R5bGU9eyB7cG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IDAsIHRvcDogMH0gfT5cbiAgICAgICAgeyB0aGlzLnByb3BzLmNoaWxkcmVuIH1cbiAgICAgIDwvZGl2PlxuICAgIF07XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0KSB7XG4gICAgICBjb250ZW50ID0gKFxuICAgICAgICA8TWFwSW50ZXJhY3Rpb25zXG4gICAgICAgICAgb25Nb3VzZURvd24gPXsgdGhpcy5fb25Nb3VzZURvd24gfVxuICAgICAgICAgIG9uTW91c2VEcmFnID17IHRoaXMuX29uTW91c2VEcmFnIH1cbiAgICAgICAgICBvbk1vdXNlUm90YXRlID17IHRoaXMuX29uTW91c2VSb3RhdGUgfVxuICAgICAgICAgIG9uTW91c2VVcCA9eyB0aGlzLl9vbk1vdXNlVXAgfVxuICAgICAgICAgIG9uTW91c2VNb3ZlID17IHRoaXMuX29uTW91c2VNb3ZlIH1cbiAgICAgICAgICBvblpvb20gPXsgdGhpcy5fb25ab29tIH1cbiAgICAgICAgICBvblpvb21FbmQgPXsgdGhpcy5fb25ab29tRW5kIH1cbiAgICAgICAgICB3aWR0aCA9eyB0aGlzLnByb3BzLndpZHRoIH1cbiAgICAgICAgICBoZWlnaHQgPXsgdGhpcy5wcm9wcy5oZWlnaHQgfVxuICAgICAgICAgIHpvb21EaXNhYmxlZCA9eyB0aGlzLnByb3BzLnpvb21EaXNhYmxlZCB9XG4gICAgICAgICAgZHJhZ0Rpc2FibGVkID17IHRoaXMucHJvcHMuZHJhZ0Rpc2FibGVkIH0+XG5cbiAgICAgICAgICB7IGNvbnRlbnQgfVxuXG4gICAgICAgIDwvTWFwSW50ZXJhY3Rpb25zPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17IHtcbiAgICAgICAgICAuLi50aGlzLnByb3BzLnN0eWxlLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgfSB9PlxuXG4gICAgICAgIHsgY29udGVudCB9XG5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbW9kKHZhbHVlLCBkaXZpc29yKSB7XG4gIGNvbnN0IG1vZHVsdXMgPSB2YWx1ZSAlIGRpdmlzb3I7XG4gIHJldHVybiBtb2R1bHVzIDwgMCA/IGRpdmlzb3IgKyBtb2R1bHVzIDogbW9kdWx1cztcbn1cblxuZnVuY3Rpb24gdW5wcm9qZWN0RnJvbVRyYW5zZm9ybSh0cmFuc2Zvcm0sIHBvaW50KSB7XG4gIHJldHVybiB0cmFuc2Zvcm0ucG9pbnRMb2NhdGlvbihQb2ludC5jb252ZXJ0KHBvaW50KSk7XG59XG5cbmZ1bmN0aW9uIGNsb25lVHJhbnNmb3JtKG9yaWdpbmFsKSB7XG4gIGNvbnN0IHRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0ob3JpZ2luYWwuX21pblpvb20sIG9yaWdpbmFsLl9tYXhab29tKTtcbiAgdHJhbnNmb3JtLmxhdFJhbmdlID0gb3JpZ2luYWwubGF0UmFuZ2U7XG4gIHRyYW5zZm9ybS53aWR0aCA9IG9yaWdpbmFsLndpZHRoO1xuICB0cmFuc2Zvcm0uaGVpZ2h0ID0gb3JpZ2luYWwuaGVpZ2h0O1xuICB0cmFuc2Zvcm0uem9vbSA9IG9yaWdpbmFsLnpvb207XG4gIHRyYW5zZm9ybS5jZW50ZXIgPSBvcmlnaW5hbC5jZW50ZXI7XG4gIHRyYW5zZm9ybS5hbmdsZSA9IG9yaWdpbmFsLmFuZ2xlO1xuICB0cmFuc2Zvcm0uYWx0aXR1ZGUgPSBvcmlnaW5hbC5hbHRpdHVkZTtcbiAgdHJhbnNmb3JtLnBpdGNoID0gb3JpZ2luYWwucGl0Y2g7XG4gIHRyYW5zZm9ybS5iZWFyaW5nID0gb3JpZ2luYWwuYmVhcmluZztcbiAgdHJhbnNmb3JtLmFsdGl0dWRlID0gb3JpZ2luYWwuYWx0aXR1ZGU7XG4gIHJldHVybiB0cmFuc2Zvcm07XG59XG5cbk1hcEdMLnByb3BUeXBlcyA9IFBST1BfVFlQRVM7XG5NYXBHTC5kZWZhdWx0UHJvcHMgPSBERUZBVUxUX1BST1BTO1xuIl19