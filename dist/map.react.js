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
  altitude: _react2.default.PropTypes.number
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
      var viewportChanged = newProps.latitude !== oldProps.latitude || newProps.longitude !== oldProps.longitude || newProps.zoom !== oldProps.zoom || newProps.pitch !== oldProps.pitch || newProps.zoom !== oldProps.bearing || newProps.altitude !== oldProps.altitude;

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

      if (!this.props.onChangeViewport) {
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
      var map = this._getMap();
      var pos = opt.pos;
      if (!this.props.onHoverFeatures) {
        return;
      }
      var features = map.queryRenderedFeatures([pos.x, pos.y]);
      if (!features.length && this.props.ignoreEmptyFeatures) {
        return;
      }
      this.props.onHoverFeatures(features);
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(opt) {
      var map = this._getMap();
      this._callOnChangeViewport(map.transform, {
        isDragging: false,
        startDragLngLat: null,
        startBearing: null,
        startPitch: null
      });

      if (!this.props.onClickFeatures) {
        return;
      }

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
            height: this.props.height },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAucmVhY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLElBQU0sWUFBWSxFQUFsQjtBQUNBLElBQU0sd0JBQXdCLEVBQTlCO0FBQ0EsSUFBTSxjQUFjLEdBQXBCOztBQUVBLElBQU0sYUFBYTs7OztBQUlqQixZQUFVLGlCQUFVLE1BQVYsQ0FBaUIsVUFKVjs7OztBQVFqQixhQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFSWDs7OztBQVlqQixRQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFaTjs7Ozs7QUFpQmpCLFlBQVUsaUJBQVUsU0FBVixDQUFvQixDQUM1QixpQkFBVSxNQURrQixFQUU1QixpQkFBVSxVQUFWLENBQXFCLG9CQUFVLEdBQS9CLENBRjRCLENBQXBCLENBakJPOzs7OztBQXlCakIsd0JBQXNCLGlCQUFVLE1BekJmOzs7Ozs7QUErQmpCLG9CQUFrQixpQkFBVSxJQS9CWDs7OztBQW1DakIsU0FBTyxpQkFBVSxNQUFWLENBQWlCLFVBbkNQOzs7O0FBdUNqQixVQUFRLGlCQUFVLE1BQVYsQ0FBaUIsVUF2Q1I7Ozs7OztBQTZDakIsY0FBWSxpQkFBVSxJQTdDTDs7Ozs7O0FBbURqQixtQkFBaUIsaUJBQVUsS0FuRFY7Ozs7Ozs7O0FBMkRqQixtQkFBaUIsaUJBQVUsSUEzRFY7Ozs7Ozs7QUFrRWpCLHVCQUFxQixpQkFBVSxJQWxFZDs7Ozs7QUF1RWpCLHNCQUFvQixpQkFBVSxJQXZFYjs7Ozs7Ozs7O0FBZ0ZqQixtQkFBaUIsaUJBQVUsSUFoRlY7Ozs7OztBQXNGakIseUJBQXVCLGlCQUFVLElBdEZoQjs7Ozs7O0FBNEZqQix1QkFB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aWxlIjoibWFwLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJztcbmltcG9ydCBwdXJlUmVuZGVyIGZyb20gJ3B1cmUtcmVuZGVyLWRlY29yYXRvcic7XG5pbXBvcnQgZDMgZnJvbSAnZDMnO1xuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IG1hcGJveGdsLCB7UG9pbnR9IGZyb20gJ21hcGJveC1nbCc7XG5cbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IE1hcEludGVyYWN0aW9ucyBmcm9tICcuL21hcC1pbnRlcmFjdGlvbnMucmVhY3QnO1xuaW1wb3J0IGRpZmZTdHlsZXMgZnJvbSAnLi9kaWZmLXN0eWxlcyc7XG5cbi8vIE5PVEU6IFRyYW5zZm9ybSBpcyBub3QgYSBwdWJsaWMgQVBJIHNvIHdlIHNob3VsZCBiZSBjYXJlZnVsIHRvIGFsd2F5cyBsb2NrXG4vLyBkb3duIG1hcGJveC1nbCB0byBhIHNwZWNpZmljIG1ham9yLCBtaW5vciwgYW5kIHBhdGNoIHZlcnNpb24uXG5pbXBvcnQgVHJhbnNmb3JtIGZyb20gJ21hcGJveC1nbC9qcy9nZW8vdHJhbnNmb3JtJztcblxuLy8gTm90ZTogTWF4IHBpdGNoIGlzIGEgaGFyZCBjb2RlZCB2YWx1ZSAobm90IGEgbmFtZWQgY29uc3RhbnQpIGluIHRyYW5zZm9ybS5qc1xuY29uc3QgTUFYX1BJVENIID0gNjA7XG5jb25zdCBQSVRDSF9NT1VTRV9USFJFU0hPTEQgPSAyMDtcbmNvbnN0IFBJVENIX0FDQ0VMID0gMS4yO1xuXG5jb25zdCBQUk9QX1RZUEVTID0ge1xuICAvKipcbiAgICAqIFRoZSBsYXRpdHVkZSBvZiB0aGUgY2VudGVyIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgbGF0aXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgbG9uZ2l0dWRlIG9mIHRoZSBjZW50ZXIgb2YgdGhlIG1hcC5cbiAgICAqL1xuICBsb25naXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgdGlsZSB6b29tIGxldmVsIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgem9vbTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAvKipcbiAgICAqIFRoZSBNYXBib3ggc3R5bGUgdGhlIGNvbXBvbmVudCBzaG91bGQgdXNlLiBDYW4gZWl0aGVyIGJlIGEgc3RyaW5nIHVybFxuICAgICogb3IgYSBNYXBib3hHTCBzdHlsZSBJbW11dGFibGUuTWFwIG9iamVjdC5cbiAgICAqL1xuICBtYXBTdHlsZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKVxuICBdKSxcbiAgLyoqXG4gICAgKiBUaGUgTWFwYm94IEFQSSBhY2Nlc3MgdG9rZW4gdG8gcHJvdmlkZSB0byBtYXBib3gtZ2wtanMuIFRoaXMgaXMgcmVxdWlyZWRcbiAgICAqIHdoZW4gdXNpbmcgTWFwYm94IHByb3ZpZGVkIHZlY3RvciB0aWxlcyBhbmQgc3R5bGVzLlxuICAgICovXG4gIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvKipcbiAgICAqIGBvbkNoYW5nZVZpZXdwb3J0YCBjYWxsYmFjayBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIGludGVyYWN0ZWQgd2l0aCB0aGVcbiAgICAqIG1hcC4gVGhlIG9iamVjdCBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrIGNvbnRhaW5lcnMgYGxhdGl0dWRlYCxcbiAgICAqIGBsb25naXR1ZGVgIGFuZCBgem9vbWAgaW5mb3JtYXRpb24uXG4gICAgKi9cbiAgb25DaGFuZ2VWaWV3cG9ydDogUHJvcFR5cGVzLmZ1bmMsXG4gIC8qKlxuICAgICogVGhlIHdpZHRoIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgaGVpZ2h0IG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogSXMgdGhlIGNvbXBvbmVudCBjdXJyZW50bHkgYmVpbmcgZHJhZ2dlZC4gVGhpcyBpcyB1c2VkIHRvIHNob3cvaGlkZSB0aGVcbiAgICAqIGRyYWcgY3Vyc29yLiBBbHNvIHVzZWQgYXMgYW4gb3B0aW1pemF0aW9uIGluIHNvbWUgb3ZlcmxheXMgYnkgcHJldmVudGluZ1xuICAgICogcmVuZGVyaW5nIHdoaWxlIGRyYWdnaW5nLlxuICAgICovXG4gIGlzRHJhZ2dpbmc6IFByb3BUeXBlcy5ib29sLFxuICAvKipcbiAgICAqIFJlcXVpcmVkIHRvIGNhbGN1bGF0ZSB0aGUgbW91c2UgcHJvamVjdGlvbiBhZnRlciB0aGUgZmlyc3QgY2xpY2sgZXZlbnRcbiAgICAqIGR1cmluZyBkcmFnZ2luZy4gV2hlcmUgdGhlIG1hcCBpcyBkZXBlbmRzIG9uIHdoZXJlIHlvdSBmaXJzdCBjbGlja2VkIG9uXG4gICAgKiB0aGUgbWFwLlxuICAgICovXG4gIHN0YXJ0RHJhZ0xuZ0xhdDogUHJvcFR5cGVzLmFycmF5LFxuICAvKipcbiAgICAqIENhbGxlZCB3aGVuIGEgZmVhdHVyZSBpcyBob3ZlcmVkIG92ZXIuIEZlYXR1cmVzIG11c3Qgc2V0IHRoZVxuICAgICogYGludGVyYWN0aXZlYCBwcm9wZXJ0eSB0byBgdHJ1ZWAgZm9yIHRoaXMgdG8gd29yayBwcm9wZXJseS4gc2VlIHRoZVxuICAgICogTWFwYm94IGV4YW1wbGU6IGh0dHBzOi8vd3d3Lm1hcGJveC5jb20vbWFwYm94LWdsLWpzL2V4YW1wbGUvZmVhdHVyZXNhdC9cbiAgICAqIFRoZSBmaXJzdCBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2sgd2lsbCBiZSB0aGUgYXJyYXkgb2YgZmVhdHVyZSB0aGVcbiAgICAqIG1vdXNlIGlzIG92ZXIuIFRoaXMgaXMgdGhlIHNhbWUgcmVzcG9uc2UgcmV0dXJuZWQgZnJvbSBgZmVhdHVyZXNBdGAuXG4gICAgKi9cbiAgb25Ib3ZlckZlYXR1cmVzOiBQcm9wVHlwZXMuZnVuYyxcbiAgLyoqXG4gICAgKiBEZWZhdWx0cyB0byBUUlVFXG4gICAgKiBTZXQgdG8gZmFsc2UgdG8gZW5hYmxlIG9uSG92ZXJGZWF0dXJlcyB0byBiZSBjYWxsZWQgcmVnYXJkbGVzcyBpZlxuICAgICogdGhlcmUgaXMgYW4gYWN0dWFsIGZlYXR1cmUgYXQgeCwgeS4gVGhpcyBpcyB1c2VmdWwgdG8gZW11bGF0ZVxuICAgICogXCJtb3VzZS1vdXRcIiBiZWhhdmlvcnMgb24gZmVhdHVyZXMuXG4gICAgKi9cbiAgaWdub3JlRW1wdHlGZWF0dXJlczogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBTaG93IGF0dHJpYnV0aW9uIGNvbnRyb2wgb3Igbm90LlxuICAgICovXG4gIGF0dHJpYnV0aW9uQ29udHJvbDogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBDYWxsZWQgd2hlbiBhIGZlYXR1cmUgaXMgY2xpY2tlZCBvbi4gRmVhdHVyZXMgbXVzdCBzZXQgdGhlXG4gICAgKiBgaW50ZXJhY3RpdmVgIHByb3BlcnR5IHRvIGB0cnVlYCBmb3IgdGhpcyB0byB3b3JrIHByb3Blcmx5LiBzZWUgdGhlXG4gICAgKiBNYXBib3ggZXhhbXBsZTogaHR0cHM6Ly93d3cubWFwYm94LmNvbS9tYXBib3gtZ2wtanMvZXhhbXBsZS9mZWF0dXJlc2F0L1xuICAgICogVGhlIGZpcnN0IGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjayB3aWxsIGJlIHRoZSBhcnJheSBvZiBmZWF0dXJlIHRoZVxuICAgICogbW91c2UgaXMgb3Zlci4gVGhpcyBpcyB0aGUgc2FtZSByZXNwb25zZSByZXR1cm5lZCBmcm9tIGBmZWF0dXJlc0F0YC5cbiAgICAqL1xuICBvbkNsaWNrRmVhdHVyZXM6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgICogUGFzc2VkIHRvIE1hcGJveCBNYXAgY29uc3RydWN0b3Igd2hpY2ggcGFzc2VzIGl0IHRvIHRoZSBjYW52YXMgY29udGV4dC5cbiAgICAqIFRoaXMgaXMgdW5zZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGV4cG9ydCB0aGUgY2FudmFzIGFzIGEgUE5HLlxuICAgICovXG4gIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBUaGVyZSBhcmUgc3RpbGwga25vd24gaXNzdWVzIHdpdGggc3R5bGUgZGlmZmluZy4gQXMgYSB0ZW1wb3Jhcnkgc3RvcGdhcCxcbiAgICAqIGFkZCB0aGUgb3B0aW9uIHRvIHByZXZlbnQgc3R5bGUgZGlmZmluZy5cbiAgICAqL1xuICBwcmV2ZW50U3R5bGVEaWZmaW5nOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIEVuYWJsZXMgcGVyc3BlY3RpdmUgY29udHJvbCBldmVudCBoYW5kbGluZyAoQ29tbWFuZC1yb3RhdGUpXG4gICAgKi9cbiAgcGVyc3BlY3RpdmVFbmFibGVkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIFNwZWNpZnkgdGhlIGJlYXJpbmcgb2YgdGhlIHZpZXdwb3J0XG4gICAgKi9cbiAgYmVhcmluZzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICAqIFNwZWNpZnkgdGhlIHBpdGNoIG9mIHRoZSB2aWV3cG9ydFxuICAgICovXG4gIHBpdGNoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgICogU3BlY2lmeSB0aGUgYWx0aXR1ZGUgb2YgdGhlIHZpZXdwb3J0IGNhbWVyYVxuICAgICogVW5pdDogbWFwIGhlaWdodHMsIGRlZmF1bHQgMS41XG4gICAgKiBOb24tcHVibGljIEFQSSwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXBib3gvbWFwYm94LWdsLWpzL2lzc3Vlcy8xMTM3XG4gICAgKi9cbiAgYWx0aXR1ZGU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIG1hcFN0eWxlOiAnbWFwYm94Oi8vc3R5bGVzL21hcGJveC9saWdodC12OCcsXG4gIG9uQ2hhbmdlVmlld3BvcnQ6IG51bGwsXG4gIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBjb25maWcuREVGQVVMVFMuTUFQQk9YX0FQSV9BQ0NFU1NfVE9LRU4sXG4gIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogZmFsc2UsXG4gIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSxcbiAgaWdub3JlRW1wdHlGZWF0dXJlczogdHJ1ZSxcbiAgYmVhcmluZzogMCxcbiAgcGl0Y2g6IDAsXG4gIGFsdGl0dWRlOiAxLjVcbn07XG5cbkBwdXJlUmVuZGVyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBHTCBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgc3RhcnREcmFnTG5nTGF0OiBudWxsLFxuICAgICAgc3RhcnRCZWFyaW5nOiBudWxsLFxuICAgICAgc3RhcnRQaXRjaDogbnVsbFxuICAgIH07XG4gICAgbWFwYm94Z2wuYWNjZXNzVG9rZW4gPSBwcm9wcy5tYXBib3hBcGlBY2Nlc3NUb2tlbjtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IG1hcFN0eWxlID0gdGhpcy5wcm9wcy5tYXBTdHlsZSBpbnN0YW5jZW9mIEltbXV0YWJsZS5NYXAgP1xuICAgICAgdGhpcy5wcm9wcy5tYXBTdHlsZS50b0pTKCkgOlxuICAgICAgdGhpcy5wcm9wcy5tYXBTdHlsZTtcbiAgICBjb25zdCBtYXAgPSBuZXcgbWFwYm94Z2wuTWFwKHtcbiAgICAgIGNvbnRhaW5lcjogdGhpcy5yZWZzLm1hcGJveE1hcCxcbiAgICAgIGNlbnRlcjogW3RoaXMucHJvcHMubG9uZ2l0dWRlLCB0aGlzLnByb3BzLmxhdGl0dWRlXSxcbiAgICAgIHpvb206IHRoaXMucHJvcHMuem9vbSxcbiAgICAgIHBpdGNoOiB0aGlzLnByb3BzLnBpdGNoLFxuICAgICAgYmVhcmluZzogdGhpcy5wcm9wcy5iZWFyaW5nLFxuICAgICAgc3R5bGU6IG1hcFN0eWxlLFxuICAgICAgaW50ZXJhY3RpdmU6IGZhbHNlLFxuICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0aGlzLnByb3BzLnByZXNlcnZlRHJhd2luZ0J1ZmZlclxuICAgICAgLy8gVE9ETz9cbiAgICAgIC8vIGF0dHJpYnV0aW9uQ29udHJvbDogdGhpcy5wcm9wcy5hdHRyaWJ1dGlvbkNvbnRyb2xcbiAgICB9KTtcblxuICAgIGQzLnNlbGVjdChtYXAuZ2V0Q2FudmFzKCkpLnN0eWxlKCdvdXRsaW5lJywgJ25vbmUnKTtcblxuICAgIHRoaXMuX21hcCA9IG1hcDtcbiAgICB0aGlzLl91cGRhdGVNYXBWaWV3cG9ydCh7fSwgdGhpcy5wcm9wcyk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSk7XG4gIH1cblxuICAvLyBOZXcgcHJvcHMgYXJlIGNvbWluJyByb3VuZCB0aGUgY29ybmVyIVxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzKSB7XG4gICAgdGhpcy5fdXBkYXRlU3RhdGVGcm9tUHJvcHModGhpcy5wcm9wcywgbmV3UHJvcHMpO1xuICAgIHRoaXMuX3VwZGF0ZU1hcFZpZXdwb3J0KHRoaXMucHJvcHMsIG5ld1Byb3BzKTtcbiAgICB0aGlzLl91cGRhdGVNYXBTdHlsZSh0aGlzLnByb3BzLCBuZXdQcm9wcyk7XG4gICAgLy8gU2F2ZSB3aWR0aC9oZWlnaHQgc28gdGhhdCB3ZSBjYW4gY2hlY2sgdGhlbSBpbiBjb21wb25lbnREaWRVcGRhdGVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodFxuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIC8vIG1hcC5yZXNpemUoKSByZWFkcyBzaXplIGZyb20gRE9NLCB3ZSBuZWVkIHRvIGNhbGwgYWZ0ZXIgcmVuZGVyXG4gICAgdGhpcy5fdXBkYXRlTWFwU2l6ZSh0aGlzLnN0YXRlLCB0aGlzLnByb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLl9tYXApIHtcbiAgICAgIHRoaXMuX21hcC5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICBfY3Vyc29yKCkge1xuICAgIGNvbnN0IGlzSW50ZXJhY3RpdmUgPVxuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0IHx8XG4gICAgICB0aGlzLnByb3BzLm9uQ2xpY2tGZWF0dXJlIHx8XG4gICAgICB0aGlzLnByb3BzLm9uSG92ZXJGZWF0dXJlcztcbiAgICBpZiAoaXNJbnRlcmFjdGl2ZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuaXNEcmFnZ2luZyA/XG4gICAgICAgIGNvbmZpZy5DVVJTT1IuR1JBQkJJTkcgOiBjb25maWcuQ1VSU09SLkdSQUI7XG4gICAgfVxuICAgIHJldHVybiAnaW5oZXJpdCc7XG4gIH1cblxuICBfZ2V0TWFwKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXA7XG4gIH1cblxuICBfdXBkYXRlU3RhdGVGcm9tUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgbWFwYm94Z2wuYWNjZXNzVG9rZW4gPSBuZXdQcm9wcy5tYXBib3hBcGlBY2Nlc3NUb2tlbjtcbiAgICBjb25zdCB7c3RhcnREcmFnTG5nTGF0fSA9IG5ld1Byb3BzO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc3RhcnREcmFnTG5nTGF0OiBzdGFydERyYWdMbmdMYXQgJiYgc3RhcnREcmFnTG5nTGF0LnNsaWNlKClcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEluZGl2aWR1YWxseSB1cGRhdGUgdGhlIG1hcHMgc291cmNlIGFuZCBsYXllcnMgdGhhdCBoYXZlIGNoYW5nZWQgaWYgYWxsXG4gIC8vIG90aGVyIHN0eWxlIHByb3BzIGhhdmVuJ3QgY2hhbmdlZC4gVGhpcyBwcmV2ZW50cyBmbGlja2luZyBvZiB0aGUgbWFwIHdoZW5cbiAgLy8gc3R5bGVzIG9ubHkgY2hhbmdlIHNvdXJjZXMgb3IgbGF5ZXJzLlxuICBfc2V0RGlmZlN0eWxlKHByZXZTdHlsZSwgbmV4dFN0eWxlKSB7XG4gICAgY29uc3QgcHJldktleXNNYXAgPSBwcmV2U3R5bGUgJiYgc3R5bGVLZXlzTWFwKHByZXZTdHlsZSkgfHwge307XG4gICAgY29uc3QgbmV4dEtleXNNYXAgPSBzdHlsZUtleXNNYXAobmV4dFN0eWxlKTtcbiAgICBmdW5jdGlvbiBzdHlsZUtleXNNYXAoc3R5bGUpIHtcbiAgICAgIHJldHVybiBzdHlsZS5tYXAoKCkgPT4gdHJ1ZSkuZGVsZXRlKCdsYXllcnMnKS5kZWxldGUoJ3NvdXJjZXMnKS50b0pTKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHByb3BzT3RoZXJUaGFuTGF5ZXJzT3JTb3VyY2VzRGlmZmVyKCkge1xuICAgICAgY29uc3QgcHJldktleXNMaXN0ID0gT2JqZWN0LmtleXMocHJldktleXNNYXApO1xuICAgICAgY29uc3QgbmV4dEtleXNMaXN0ID0gT2JqZWN0LmtleXMobmV4dEtleXNNYXApO1xuICAgICAgaWYgKHByZXZLZXlzTGlzdC5sZW5ndGggIT09IG5leHRLZXlzTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICAvLyBgbmV4dFN0eWxlYCBhbmQgYHByZXZTdHlsZWAgc2hvdWxkIG5vdCBoYXZlIHRoZSBzYW1lIHNldCBvZiBwcm9wcy5cbiAgICAgIGlmIChuZXh0S2V5c0xpc3Quc29tZShcbiAgICAgICAga2V5ID0+IHByZXZTdHlsZS5nZXQoa2V5KSAhPT0gbmV4dFN0eWxlLmdldChrZXkpXG4gICAgICAgIC8vIEJ1dCB0aGUgdmFsdWUgb2Ygb25lIG9mIHRob3NlIHByb3BzIGlzIGRpZmZlcmVudC5cbiAgICAgICkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG5cbiAgICBpZiAoIXByZXZTdHlsZSB8fCBwcm9wc090aGVyVGhhbkxheWVyc09yU291cmNlc0RpZmZlcigpKSB7XG4gICAgICBtYXAuc2V0U3R5bGUobmV4dFN0eWxlLnRvSlMoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge3NvdXJjZXNEaWZmLCBsYXllcnNEaWZmfSA9IGRpZmZTdHlsZXMocHJldlN0eWxlLCBuZXh0U3R5bGUpO1xuXG4gICAgLy8gVE9ETzogSXQncyByYXRoZXIgZGlmZmljdWx0IHRvIGRldGVybWluZSBzdHlsZSBkaWZmaW5nIGluIHRoZSBwcmVzZW5jZVxuICAgIC8vIG9mIHJlZnMuIEZvciBub3csIGlmIGFueSBzdHlsZSB1cGRhdGUgaGFzIGEgcmVmLCBmYWxsYmFjayB0byBubyBkaWZmaW5nLlxuICAgIC8vIFdlIGNhbiBjb21lIGJhY2sgdG8gdGhpcyBjYXNlIGlmIHRoZXJlJ3MgYSBzb2xpZCB1c2VjYXNlLlxuICAgIGlmIChsYXllcnNEaWZmLnVwZGF0ZXMuc29tZShub2RlID0+IG5vZGUubGF5ZXIuZ2V0KCdyZWYnKSkpIHtcbiAgICAgIG1hcC5zZXRTdHlsZShuZXh0U3R5bGUudG9KUygpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGVudGVyIG9mIHNvdXJjZXNEaWZmLmVudGVyKSB7XG4gICAgICBtYXAuYWRkU291cmNlKGVudGVyLmlkLCBlbnRlci5zb3VyY2UudG9KUygpKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCB1cGRhdGUgb2Ygc291cmNlc0RpZmYudXBkYXRlKSB7XG4gICAgICBtYXAucmVtb3ZlU291cmNlKHVwZGF0ZS5pZCk7XG4gICAgICBtYXAuYWRkU291cmNlKHVwZGF0ZS5pZCwgdXBkYXRlLnNvdXJjZS50b0pTKCkpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGV4aXQgb2Ygc291cmNlc0RpZmYuZXhpdCkge1xuICAgICAgbWFwLnJlbW92ZVNvdXJjZShleGl0LmlkKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBleGl0IG9mIGxheWVyc0RpZmYuZXhpdGluZykge1xuICAgICAgaWYgKG1hcC5zdHlsZS5nZXRMYXllcihleGl0LmlkKSkge1xuICAgICAgICBtYXAucmVtb3ZlTGF5ZXIoZXhpdC5pZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgdXBkYXRlIG9mIGxheWVyc0RpZmYudXBkYXRlcykge1xuICAgICAgaWYgKCF1cGRhdGUuZW50ZXIpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhbiBvbGQgbGF5ZXIgdGhhdCBuZWVkcyB0byBiZSB1cGRhdGVkLiBSZW1vdmUgdGhlIG9sZCBsYXllclxuICAgICAgICAvLyB3aXRoIHRoZSBzYW1lIGlkIGFuZCBhZGQgaXQgYmFjayBhZ2Fpbi5cbiAgICAgICAgbWFwLnJlbW92ZUxheWVyKHVwZGF0ZS5pZCk7XG4gICAgICB9XG4gICAgICBtYXAuYWRkTGF5ZXIodXBkYXRlLmxheWVyLnRvSlMoKSwgdXBkYXRlLmJlZm9yZSk7XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZU1hcFN0eWxlKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIGNvbnN0IG1hcFN0eWxlID0gbmV3UHJvcHMubWFwU3R5bGU7XG4gICAgY29uc3Qgb2xkTWFwU3R5bGUgPSBvbGRQcm9wcy5tYXBTdHlsZTtcbiAgICBpZiAobWFwU3R5bGUgIT09IG9sZE1hcFN0eWxlKSB7XG4gICAgICBpZiAobWFwU3R5bGUgaW5zdGFuY2VvZiBJbW11dGFibGUuTWFwKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnByZXZlbnRTdHlsZURpZmZpbmcpIHtcbiAgICAgICAgICB0aGlzLl9nZXRNYXAoKS5zZXRTdHlsZShtYXBTdHlsZS50b0pTKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3NldERpZmZTdHlsZShvbGRNYXBTdHlsZSwgbWFwU3R5bGUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9nZXRNYXAoKS5zZXRTdHlsZShtYXBTdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZU1hcFZpZXdwb3J0KG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIGNvbnN0IHZpZXdwb3J0Q2hhbmdlZCA9XG4gICAgICBuZXdQcm9wcy5sYXRpdHVkZSAhPT0gb2xkUHJvcHMubGF0aXR1ZGUgfHxcbiAgICAgIG5ld1Byb3BzLmxvbmdpdHVkZSAhPT0gb2xkUHJvcHMubG9uZ2l0dWRlIHx8XG4gICAgICBuZXdQcm9wcy56b29tICE9PSBvbGRQcm9wcy56b29tIHx8XG4gICAgICBuZXdQcm9wcy5waXRjaCAhPT0gb2xkUHJvcHMucGl0Y2ggfHxcbiAgICAgIG5ld1Byb3BzLnpvb20gIT09IG9sZFByb3BzLmJlYXJpbmcgfHxcbiAgICAgIG5ld1Byb3BzLmFsdGl0dWRlICE9PSBvbGRQcm9wcy5hbHRpdHVkZTtcblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuXG4gICAgaWYgKHZpZXdwb3J0Q2hhbmdlZCkge1xuICAgICAgbWFwLmp1bXBUbyh7XG4gICAgICAgIGNlbnRlcjogW25ld1Byb3BzLmxvbmdpdHVkZSwgbmV3UHJvcHMubGF0aXR1ZGVdLFxuICAgICAgICB6b29tOiBuZXdQcm9wcy56b29tLFxuICAgICAgICBiZWFyaW5nOiBuZXdQcm9wcy5iZWFyaW5nLFxuICAgICAgICBwaXRjaDogbmV3UHJvcHMucGl0Y2hcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUT0RPIC0ganVtcFRvIGRvZXNuJ3QgaGFuZGxlIGFsdGl0dWRlXG4gICAgICBpZiAobmV3UHJvcHMuYWx0aXR1ZGUgIT09IG9sZFByb3BzLmFsdGl0dWRlKSB7XG4gICAgICAgIG1hcC50cmFuc2Zvcm0uYWx0aXR1ZGUgPSBuZXdQcm9wcy5hbHRpdHVkZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBOb3RlOiBuZWVkcyB0byBiZSBjYWxsZWQgYWZ0ZXIgcmVuZGVyIChlLmcuIGluIGNvbXBvbmVudERpZFVwZGF0ZSlcbiAgX3VwZGF0ZU1hcFNpemUob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgY29uc3Qgc2l6ZUNoYW5nZWQgPVxuICAgICAgb2xkUHJvcHMud2lkdGggIT09IG5ld1Byb3BzLndpZHRoIHx8IG9sZFByb3BzLmhlaWdodCAhPT0gbmV3UHJvcHMuaGVpZ2h0O1xuXG4gICAgaWYgKHNpemVDaGFuZ2VkKSB7XG4gICAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICAgIG1hcC5yZXNpemUoKTtcbiAgICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0pO1xuICAgIH1cbiAgfVxuXG4gIF9jYWxjdWxhdGVOZXdQaXRjaEFuZEJlYXJpbmcoe3Bvcywgc3RhcnRQb3MsIHN0YXJ0QmVhcmluZywgc3RhcnRQaXRjaH0pIHtcbiAgICBjb25zdCB4RGVsdGEgPSBwb3MueCAtIHN0YXJ0UG9zLng7XG4gICAgY29uc3QgYmVhcmluZyA9IHN0YXJ0QmVhcmluZyArIDE4MCAqIHhEZWx0YSAvIHRoaXMucHJvcHMud2lkdGg7XG5cbiAgICBsZXQgcGl0Y2ggPSBzdGFydFBpdGNoO1xuICAgIGNvbnN0IHlEZWx0YSA9IHBvcy55IC0gc3RhcnRQb3MueTtcbiAgICBpZiAoeURlbHRhID4gMCkge1xuICAgICAgLy8gRHJhZ2dpbmcgZG93bndhcmRzLCBncmFkdWFsbHkgZGVjcmVhc2UgcGl0Y2hcbiAgICAgIGlmIChNYXRoLmFicyh0aGlzLnByb3BzLmhlaWdodCAtIHN0YXJ0UG9zLnkpID4gUElUQ0hfTU9VU0VfVEhSRVNIT0xEKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlID0geURlbHRhIC8gKHRoaXMucHJvcHMuaGVpZ2h0IC0gc3RhcnRQb3MueSk7XG4gICAgICAgIHBpdGNoID0gKDEgLSBzY2FsZSkgKiBQSVRDSF9BQ0NFTCAqIHN0YXJ0UGl0Y2g7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh5RGVsdGEgPCAwKSB7XG4gICAgICAvLyBEcmFnZ2luZyB1cHdhcmRzLCBncmFkdWFsbHkgaW5jcmVhc2UgcGl0Y2hcbiAgICAgIGlmIChzdGFydFBvcy55ID4gUElUQ0hfTU9VU0VfVEhSRVNIT0xEKSB7XG4gICAgICAgIC8vIE1vdmUgZnJvbSAwIHRvIDEgYXMgd2UgZHJhZyB1cHdhcmRzXG4gICAgICAgIGNvbnN0IHlTY2FsZSA9IDEgLSBwb3MueSAvIHN0YXJ0UG9zLnk7XG4gICAgICAgIC8vIEdyYWR1YWxseSBhZGQgdW50aWwgd2UgaGl0IG1heCBwaXRjaFxuICAgICAgICBwaXRjaCA9IHN0YXJ0UGl0Y2ggKyB5U2NhbGUgKiAoTUFYX1BJVENIIC0gc3RhcnRQaXRjaCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5kZWJ1ZyhzdGFydFBpdGNoLCBwaXRjaCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBpdGNoOiBNYXRoLm1heChNYXRoLm1pbihwaXRjaCwgTUFYX1BJVENIKSwgMCksXG4gICAgICBiZWFyaW5nXG4gICAgfTtcbiAgfVxuXG4gICAvLyBIZWxwZXIgdG8gY2FsbCBwcm9wcy5vbkNoYW5nZVZpZXdwb3J0XG4gIF9jYWxsT25DaGFuZ2VWaWV3cG9ydCh0cmFuc2Zvcm0sIG9wdHMgPSB7fSkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQpIHtcbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCh7XG4gICAgICAgIGxhdGl0dWRlOiB0cmFuc2Zvcm0uY2VudGVyLmxhdCxcbiAgICAgICAgbG9uZ2l0dWRlOiBtb2QodHJhbnNmb3JtLmNlbnRlci5sbmcgKyAxODAsIDM2MCkgLSAxODAsXG4gICAgICAgIHpvb206IHRyYW5zZm9ybS56b29tLFxuICAgICAgICBwaXRjaDogdHJhbnNmb3JtLnBpdGNoLFxuICAgICAgICBiZWFyaW5nOiBtb2QodHJhbnNmb3JtLmJlYXJpbmcgKyAxODAsIDM2MCkgLSAxODAsXG5cbiAgICAgICAgaXNEcmFnZ2luZzogdGhpcy5wcm9wcy5pc0RyYWdnaW5nLFxuICAgICAgICBzdGFydERyYWdMbmdMYXQ6IHRoaXMucHJvcHMuc3RhcnREcmFnTG5nTGF0LFxuICAgICAgICBzdGFydEJlYXJpbmc6IHRoaXMucHJvcHMuc3RhcnRCZWFyaW5nLFxuICAgICAgICBzdGFydFBpdGNoOiB0aGlzLnByb3BzLnN0YXJ0UGl0Y2gsXG5cbiAgICAgICAgcHJvamVjdGlvbk1hdHJpeDogdHJhbnNmb3JtLnByb2pNYXRyaXgsXG5cbiAgICAgICAgLi4ub3B0c1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlRG93bih7cG9zfSkge1xuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIGNvbnN0IGxuZ0xhdCA9IHVucHJvamVjdEZyb21UcmFuc2Zvcm0obWFwLnRyYW5zZm9ybSwgcG9zKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiB0cnVlLFxuICAgICAgc3RhcnREcmFnTG5nTGF0OiBbbG5nTGF0LmxuZywgbG5nTGF0LmxhdF0sXG4gICAgICBzdGFydEJlYXJpbmc6IG1hcC50cmFuc2Zvcm0uYmVhcmluZyxcbiAgICAgIHN0YXJ0UGl0Y2g6IG1hcC50cmFuc2Zvcm0ucGl0Y2hcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZURyYWcoe3Bvc30pIHtcbiAgICBpZiAoIXRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHRha2UgdGhlIHN0YXJ0IGxuZ2xhdCBhbmQgcHV0IGl0IHdoZXJlIHRoZSBtb3VzZSBpcyBkb3duLlxuICAgIGFzc2VydCh0aGlzLnByb3BzLnN0YXJ0RHJhZ0xuZ0xhdCwgJ2BzdGFydERyYWdMbmdMYXRgIHByb3AgaXMgcmVxdWlyZWQgJyArXG4gICAgICAnZm9yIG1vdXNlIGRyYWcgYmVoYXZpb3IgdG8gY2FsY3VsYXRlIHdoZXJlIHRvIHBvc2l0aW9uIHRoZSBtYXAuJyk7XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBjbG9uZVRyYW5zZm9ybShtYXAudHJhbnNmb3JtKTtcbiAgICB0cmFuc2Zvcm0uc2V0TG9jYXRpb25BdFBvaW50KHRoaXMucHJvcHMuc3RhcnREcmFnTG5nTGF0LCBwb3MpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KHRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlUm90YXRlKHtwb3MsIHN0YXJ0UG9zfSkge1xuICAgIGlmICghdGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0IHx8ICF0aGlzLnByb3BzLnBlcnNwZWN0aXZlRW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtzdGFydEJlYXJpbmcsIHN0YXJ0UGl0Y2h9ID0gdGhpcy5wcm9wcztcbiAgICBhc3NlcnQodHlwZW9mIHN0YXJ0QmVhcmluZyA9PT0gJ251bWJlcicsXG4gICAgICAnYHN0YXJ0QmVhcmluZ2AgcHJvcCBpcyByZXF1aXJlZCBmb3IgbW91c2Ugcm90YXRlIGJlaGF2aW9yJyk7XG4gICAgYXNzZXJ0KHR5cGVvZiBzdGFydFBpdGNoID09PSAnbnVtYmVyJyxcbiAgICAgICdgc3RhcnRQaXRjaGAgcHJvcCBpcyByZXF1aXJlZCBmb3IgbW91c2Ugcm90YXRlIGJlaGF2aW9yJyk7XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcblxuICAgIGNvbnN0IHtwaXRjaCwgYmVhcmluZ30gPSB0aGlzLl9jYWxjdWxhdGVOZXdQaXRjaEFuZEJlYXJpbmcoe1xuICAgICAgcG9zLFxuICAgICAgc3RhcnRQb3MsXG4gICAgICBzdGFydEJlYXJpbmcsXG4gICAgICBzdGFydFBpdGNoXG4gICAgfSk7XG5cbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBjbG9uZVRyYW5zZm9ybShtYXAudHJhbnNmb3JtKTtcbiAgICB0cmFuc2Zvcm0uYmVhcmluZyA9IGJlYXJpbmc7XG4gICAgdHJhbnNmb3JtLnBpdGNoID0gcGl0Y2g7XG5cbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydCh0cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZU1vdmUob3B0KSB7XG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgY29uc3QgcG9zID0gb3B0LnBvcztcbiAgICBpZiAoIXRoaXMucHJvcHMub25Ib3ZlckZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGZlYXR1cmVzID0gbWFwLnF1ZXJ5UmVuZGVyZWRGZWF0dXJlcyhbcG9zLngsIHBvcy55XSk7XG4gICAgaWYgKCFmZWF0dXJlcy5sZW5ndGggJiYgdGhpcy5wcm9wcy5pZ25vcmVFbXB0eUZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMub25Ib3ZlckZlYXR1cmVzKGZlYXR1cmVzKTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZVVwKG9wdCkge1xuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgc3RhcnREcmFnTG5nTGF0OiBudWxsLFxuICAgICAgc3RhcnRCZWFyaW5nOiBudWxsLFxuICAgICAgc3RhcnRQaXRjaDogbnVsbFxuICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLnByb3BzLm9uQ2xpY2tGZWF0dXJlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBvcyA9IG9wdC5wb3M7XG5cbiAgICAvLyBSYWRpdXMgZW5hYmxlcyBwb2ludCBmZWF0dXJlcywgbGlrZSBtYXJrZXIgc3ltYm9scywgdG8gYmUgY2xpY2tlZC5cbiAgICBjb25zdCBzaXplID0gMTU7XG4gICAgY29uc3QgYmJveCA9IFtbcG9zLnggLSBzaXplLCBwb3MueSAtIHNpemVdLCBbcG9zLnggKyBzaXplLCBwb3MueSArIHNpemVdXTtcbiAgICBjb25zdCBmZWF0dXJlcyA9IG1hcC5xdWVyeVJlbmRlcmVkRmVhdHVyZXMoYmJveCk7XG4gICAgaWYgKCFmZWF0dXJlcy5sZW5ndGggJiYgdGhpcy5wcm9wcy5pZ25vcmVFbXB0eUZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMub25DbGlja0ZlYXR1cmVzKGZlYXR1cmVzKTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25ab29tKHtwb3MsIHNjYWxlfSkge1xuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGNsb25lVHJhbnNmb3JtKG1hcC50cmFuc2Zvcm0pO1xuICAgIGNvbnN0IGFyb3VuZCA9IHVucHJvamVjdEZyb21UcmFuc2Zvcm0odHJhbnNmb3JtLCBwb3MpO1xuICAgIHRyYW5zZm9ybS56b29tID0gdHJhbnNmb3JtLnNjYWxlWm9vbShtYXAudHJhbnNmb3JtLnNjYWxlICogc2NhbGUpO1xuICAgIHRyYW5zZm9ybS5zZXRMb2NhdGlvbkF0UG9pbnQoYXJvdW5kLCBwb3MpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KHRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vblpvb21FbmQoKSB7XG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7Y2xhc3NOYW1lLCB3aWR0aCwgaGVpZ2h0LCBzdHlsZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IG1hcFN0eWxlID0ge1xuICAgICAgLi4uc3R5bGUsXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGN1cnNvcjogdGhpcy5fY3Vyc29yKClcbiAgICB9O1xuXG4gICAgbGV0IGNvbnRlbnQgPSBbXG4gICAgICA8ZGl2IGtleT1cIm1hcFwiIHJlZj1cIm1hcGJveE1hcFwiXG4gICAgICAgIHN0eWxlPXsgbWFwU3R5bGUgfSBjbGFzc05hbWU9eyBjbGFzc05hbWUgfS8+LFxuICAgICAgPGRpdiBrZXk9XCJvdmVybGF5c1wiIGNsYXNzTmFtZT1cIm92ZXJsYXlzXCJcbiAgICAgICAgc3R5bGU9eyB7cG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IDAsIHRvcDogMH0gfT5cbiAgICAgICAgeyB0aGlzLnByb3BzLmNoaWxkcmVuIH1cbiAgICAgIDwvZGl2PlxuICAgIF07XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0KSB7XG4gICAgICBjb250ZW50ID0gKFxuICAgICAgICA8TWFwSW50ZXJhY3Rpb25zXG4gICAgICAgICAgb25Nb3VzZURvd24gPXsgdGhpcy5fb25Nb3VzZURvd24gfVxuICAgICAgICAgIG9uTW91c2VEcmFnID17IHRoaXMuX29uTW91c2VEcmFnIH1cbiAgICAgICAgICBvbk1vdXNlUm90YXRlID17IHRoaXMuX29uTW91c2VSb3RhdGUgfVxuICAgICAgICAgIG9uTW91c2VVcCA9eyB0aGlzLl9vbk1vdXNlVXAgfVxuICAgICAgICAgIG9uTW91c2VNb3ZlID17IHRoaXMuX29uTW91c2VNb3ZlIH1cbiAgICAgICAgICBvblpvb20gPXsgdGhpcy5fb25ab29tIH1cbiAgICAgICAgICBvblpvb21FbmQgPXsgdGhpcy5fb25ab29tRW5kIH1cbiAgICAgICAgICB3aWR0aCA9eyB0aGlzLnByb3BzLndpZHRoIH1cbiAgICAgICAgICBoZWlnaHQgPXsgdGhpcy5wcm9wcy5oZWlnaHQgfT5cblxuICAgICAgICAgIHsgY29udGVudCB9XG5cbiAgICAgICAgPC9NYXBJbnRlcmFjdGlvbnM+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIC4uLnRoaXMucHJvcHMuc3R5bGUsXG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9IH0+XG5cbiAgICAgICAgeyBjb250ZW50IH1cblxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb2QodmFsdWUsIGRpdmlzb3IpIHtcbiAgY29uc3QgbW9kdWx1cyA9IHZhbHVlICUgZGl2aXNvcjtcbiAgcmV0dXJuIG1vZHVsdXMgPCAwID8gZGl2aXNvciArIG1vZHVsdXMgOiBtb2R1bHVzO1xufVxuXG5mdW5jdGlvbiB1bnByb2plY3RGcm9tVHJhbnNmb3JtKHRyYW5zZm9ybSwgcG9pbnQpIHtcbiAgcmV0dXJuIHRyYW5zZm9ybS5wb2ludExvY2F0aW9uKFBvaW50LmNvbnZlcnQocG9pbnQpKTtcbn1cblxuZnVuY3Rpb24gY2xvbmVUcmFuc2Zvcm0ob3JpZ2luYWwpIHtcbiAgY29uc3QgdHJhbnNmb3JtID0gbmV3IFRyYW5zZm9ybShvcmlnaW5hbC5fbWluWm9vbSwgb3JpZ2luYWwuX21heFpvb20pO1xuICB0cmFuc2Zvcm0ubGF0UmFuZ2UgPSBvcmlnaW5hbC5sYXRSYW5nZTtcbiAgdHJhbnNmb3JtLndpZHRoID0gb3JpZ2luYWwud2lkdGg7XG4gIHRyYW5zZm9ybS5oZWlnaHQgPSBvcmlnaW5hbC5oZWlnaHQ7XG4gIHRyYW5zZm9ybS56b29tID0gb3JpZ2luYWwuem9vbTtcbiAgdHJhbnNmb3JtLmNlbnRlciA9IG9yaWdpbmFsLmNlbnRlcjtcbiAgdHJhbnNmb3JtLmFuZ2xlID0gb3JpZ2luYWwuYW5nbGU7XG4gIHRyYW5zZm9ybS5hbHRpdHVkZSA9IG9yaWdpbmFsLmFsdGl0dWRlO1xuICB0cmFuc2Zvcm0ucGl0Y2ggPSBvcmlnaW5hbC5waXRjaDtcbiAgdHJhbnNmb3JtLmJlYXJpbmcgPSBvcmlnaW5hbC5iZWFyaW5nO1xuICB0cmFuc2Zvcm0uYWx0aXR1ZGUgPSBvcmlnaW5hbC5hbHRpdHVkZTtcbiAgcmV0dXJuIHRyYW5zZm9ybTtcbn1cblxuTWFwR0wucHJvcFR5cGVzID0gUFJPUF9UWVBFUztcbk1hcEdMLmRlZmF1bHRQcm9wcyA9IERFRkFVTFRfUFJPUFM7XG4iXX0=