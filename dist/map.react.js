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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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
  latitude: _propTypes2.default.number.isRequired,
  /**
    * The longitude of the center of the map.
    */
  longitude: _propTypes2.default.number.isRequired,
  /**
    * The tile zoom level of the map.
    */
  zoom: _propTypes2.default.number.isRequired,
  /**
    * The Mapbox style the component should use. Can either be a string url
    * or a MapboxGL style Immutable.Map object.
    */
  mapStyle: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.instanceOf(_immutable2.default.Map)]),
  /**
    * The Mapbox API access token to provide to mapbox-gl-js. This is required
    * when using Mapbox provided vector tiles and styles.
    */
  mapboxApiAccessToken: _propTypes2.default.string,
  /**
    * `onChangeViewport` callback is fired when the user interacted with the
    * map. The object passed to the callback containers `latitude`,
    * `longitude` and `zoom` information.
    */
  onChangeViewport: _propTypes2.default.func,
  /**
    * `onMapLoaded` callback is fired on the map's 'load' event
    */
  onMapLoaded: _propTypes2.default.func,
  /**
    * The width of the map. Number in pixels or CSS string prop e.g. '100%'
    */
  width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  /**
    * The height of the map. Number in pixels or CSS string prop e.g. '100%'
    */
  height: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  /**
    * Is the component currently being dragged. This is used to show/hide the
    * drag cursor. Also used as an optimization in some overlays by preventing
    * rendering while dragging.
    */
  isDragging: _propTypes2.default.bool,
  /**
    * Required to calculate the mouse projection after the first click event
    * during dragging. Where the map is depends on where you first clicked on
    * the map.
    */
  startDragLngLat: _propTypes2.default.array,
  /**
    * Called when a feature is hovered over. Features must set the
    * `interactive` property to `true` for this to work properly. see the
    * Mapbox example: https://www.mapbox.com/mapbox-gl-js/example/featuresat/
    * The first argument of the callback will be the array of feature the
    * mouse is over. This is the same response returned from `featuresAt`.
    */
  onHoverFeatures: _propTypes2.default.func,
  /**
    * Defaults to TRUE
    * Set to false to enable onHoverFeatures to be called regardless if
    * there is an actual feature at x, y. This is useful to emulate
    * "mouse-out" behaviors on features.
    */
  ignoreEmptyFeatures: _propTypes2.default.bool,

  /**
    * Show attribution control or not.
    */
  attributionControl: _propTypes2.default.bool,

  /**
    * Called when a feature is clicked on. Features must set the
    * `interactive` property to `true` for this to work properly. see the
    * Mapbox example: https://www.mapbox.com/mapbox-gl-js/example/featuresat/
    * The first argument of the callback will be the array of feature the
    * mouse is over. This is the same response returned from `featuresAt`.
    */
  onClickFeatures: _propTypes2.default.func,

  /**
    * Passed to Mapbox Map constructor which passes it to the canvas context.
    * This is unseful when you want to export the canvas as a PNG.
    */
  preserveDrawingBuffer: _propTypes2.default.bool,

  /**
    * There are still known issues with style diffing. As a temporary stopgap,
    * add the option to prevent style diffing.
    */
  preventStyleDiffing: _propTypes2.default.bool,

  /**
    * Enables perspective control event handling (Command-rotate)
    */
  perspectiveEnabled: _propTypes2.default.bool,

  /**
    * Specify the bearing of the viewport
    */
  bearing: _propTypes2.default.number,

  /**
    * Specify the pitch of the viewport
    */
  pitch: _propTypes2.default.number,

  /**
    * Specify the altitude of the viewport camera
    * Unit: map heights, default 1.5
    * Non-public API, see https://github.com/mapbox/mapbox-gl-js/issues/1137
    */
  altitude: _propTypes2.default.number,

  /**
    * Disabled dragging of the map
    */
  dragDisabled: _propTypes2.default.bool,

  /**
    * Disabled zooming of the map
    */
  zoomDisabled: _propTypes2.default.bool,

  /**
    * Bounds to fit on screen
    */
  bounds: _propTypes2.default.instanceOf(_immutable2.default.List)
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

    var _this = _possibleConstructorReturn(this, (MapGL.__proto__ || Object.getPrototypeOf(MapGL)).call(this, props));

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

      var _diffStyles = (0, _diffStyles3.default)(prevStyle, nextStyle),
          sourcesDiff = _diffStyles.sourcesDiff,
          layersDiff = _diffStyles.layersDiff;

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
        map.fitBounds(newProps.bounds.toJS());
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
      var pos = _ref.pos,
          startPos = _ref.startPos,
          startBearing = _ref.startBearing,
          startPitch = _ref.startPitch;

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
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.props.onChangeViewport) {
        var _getMap$getContainer = this._getMap().getContainer(),
            height = _getMap$getContainer.scrollHeight,
            width = _getMap$getContainer.scrollWidth;

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
      var pos = _ref4.pos,
          startPos = _ref4.startPos;

      if (!this.props.onChangeViewport || !this.props.perspectiveEnabled) {
        return;
      }

      var _props = this.props,
          startBearing = _props.startBearing,
          startPitch = _props.startPitch;

      (0, _assert2.default)(typeof startBearing === 'number', '`startBearing` prop is required for mouse rotate behavior');
      (0, _assert2.default)(typeof startPitch === 'number', '`startPitch` prop is required for mouse rotate behavior');

      var map = this._getMap();

      var _calculateNewPitchAnd = this._calculateNewPitchAndBearing({
        pos: pos,
        startPos: startPos,
        startBearing: startBearing,
        startPitch: startPitch
      }),
          pitch = _calculateNewPitchAnd.pitch,
          bearing = _calculateNewPitchAnd.bearing;

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
      var pos = _ref5.pos,
          scale = _ref5.scale;

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
      var _props2 = this.props,
          className = _props2.className,
          width = _props2.width,
          height = _props2.height,
          style = _props2.style;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAucmVhY3QuanMiXSwibmFtZXMiOlsiTUFYX1BJVENIIiwiUElUQ0hfTU9VU0VfVEhSRVNIT0xEIiwiUElUQ0hfQUNDRUwiLCJQUk9QX1RZUEVTIiwibGF0aXR1ZGUiLCJQcm9wVHlwZXMiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwibG9uZ2l0dWRlIiwiem9vbSIsIm1hcFN0eWxlIiwib25lT2ZUeXBlIiwic3RyaW5nIiwiaW5zdGFuY2VPZiIsIkltbXV0YWJsZSIsIk1hcCIsIm1hcGJveEFwaUFjY2Vzc1Rva2VuIiwib25DaGFuZ2VWaWV3cG9ydCIsImZ1bmMiLCJvbk1hcExvYWRlZCIsIndpZHRoIiwiaGVpZ2h0IiwiaXNEcmFnZ2luZyIsImJvb2wiLCJzdGFydERyYWdMbmdMYXQiLCJhcnJheSIsIm9uSG92ZXJGZWF0dXJlcyIsImlnbm9yZUVtcHR5RmVhdHVyZXMiLCJhdHRyaWJ1dGlvbkNvbnRyb2wiLCJvbkNsaWNrRmVhdHVyZXMiLCJwcmVzZXJ2ZURyYXdpbmdCdWZmZXIiLCJwcmV2ZW50U3R5bGVEaWZmaW5nIiwicGVyc3BlY3RpdmVFbmFibGVkIiwiYmVhcmluZyIsInBpdGNoIiwiYWx0aXR1ZGUiLCJkcmFnRGlzYWJsZWQiLCJ6b29tRGlzYWJsZWQiLCJib3VuZHMiLCJMaXN0IiwiREVGQVVMVF9QUk9QUyIsImNvbmZpZyIsIkRFRkFVTFRTIiwiTUFQQk9YX0FQSV9BQ0NFU1NfVE9LRU4iLCJDSElMRF9DT05URVhUX1RZUEVTIiwibWFwIiwiUmVhY3QiLCJvYmplY3QiLCJNYXBHTCIsInB1cmVSZW5kZXIiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRCZWFyaW5nIiwic3RhcnRQaXRjaCIsIm1hcGJveGdsIiwiYWNjZXNzVG9rZW4iLCJfbWFwUmVhZHkiLCJnZXRDaGlsZENvbnRleHQiLCJfbWFwIiwidG9KUyIsImNvbnRhaW5lciIsInJlZnMiLCJtYXBib3hNYXAiLCJjZW50ZXIiLCJzdHlsZSIsImludGVyYWN0aXZlIiwiZDMiLCJzZWxlY3QiLCJnZXRDYW52YXMiLCJfdXBkYXRlTWFwVmlld3BvcnQiLCJfY2FsbE9uQ2hhbmdlVmlld3BvcnQiLCJ0cmFuc2Zvcm0iLCJvbiIsIm5ld1Byb3BzIiwiX3VwZGF0ZVN0YXRlRnJvbVByb3BzIiwiX3VwZGF0ZU1hcFN0eWxlIiwic2V0U3RhdGUiLCJfdXBkYXRlTWFwU2l6ZSIsInJlbW92ZSIsImlzSW50ZXJhY3RpdmUiLCJvbkNsaWNrRmVhdHVyZSIsIkNVUlNPUiIsIkdSQUJCSU5HIiwiR1JBQiIsIm9sZFByb3BzIiwic2xpY2UiLCJwcmV2U3R5bGUiLCJuZXh0U3R5bGUiLCJwcmV2S2V5c01hcCIsInN0eWxlS2V5c01hcCIsIm5leHRLZXlzTWFwIiwiZGVsZXRlIiwicHJvcHNPdGhlclRoYW5MYXllcnNPclNvdXJjZXNEaWZmZXIiLCJwcmV2S2V5c0xpc3QiLCJPYmplY3QiLCJrZXlzIiwibmV4dEtleXNMaXN0IiwibGVuZ3RoIiwic29tZSIsImdldCIsImtleSIsIl9nZXRNYXAiLCJzZXRTdHlsZSIsInNvdXJjZXNEaWZmIiwibGF5ZXJzRGlmZiIsInVwZGF0ZXMiLCJub2RlIiwibGF5ZXIiLCJlbnRlciIsImFkZFNvdXJjZSIsImlkIiwic291cmNlIiwidXBkYXRlIiwicmVtb3ZlU291cmNlIiwiZXhpdCIsImV4aXRpbmciLCJnZXRMYXllciIsInJlbW92ZUxheWVyIiwiYWRkTGF5ZXIiLCJiZWZvcmUiLCJvbGRNYXBTdHlsZSIsIl9zZXREaWZmU3R5bGUiLCJ2aWV3cG9ydENoYW5nZWQiLCJqdW1wVG8iLCJmaXRCb3VuZHMiLCJzaXplQ2hhbmdlZCIsInJlc2l6ZSIsInBvcyIsInN0YXJ0UG9zIiwieERlbHRhIiwieCIsInlEZWx0YSIsInkiLCJNYXRoIiwiYWJzIiwic2NhbGUiLCJ5U2NhbGUiLCJtYXgiLCJtaW4iLCJvcHRzIiwiZ2V0Q29udGFpbmVyIiwic2Nyb2xsSGVpZ2h0Iiwic2Nyb2xsV2lkdGgiLCJsYXQiLCJtb2QiLCJsbmciLCJwcm9qZWN0aW9uTWF0cml4IiwicHJvak1hdHJpeCIsImxuZ0xhdCIsInVucHJvamVjdEZyb21UcmFuc2Zvcm0iLCJjbG9uZVRyYW5zZm9ybSIsInNldExvY2F0aW9uQXRQb2ludCIsIl9jYWxjdWxhdGVOZXdQaXRjaEFuZEJlYXJpbmciLCJvcHQiLCJmZWF0dXJlcyIsInF1ZXJ5UmVuZGVyZWRGZWF0dXJlcyIsInNpemUiLCJiYm94IiwiYXJvdW5kIiwic2NhbGVab29tIiwiY2xhc3NOYW1lIiwiY3Vyc29yIiwiX2N1cnNvciIsImNvbnRlbnQiLCJwb3NpdGlvbiIsImxlZnQiLCJ0b3AiLCJjaGlsZHJlbiIsIl9vbk1vdXNlRG93biIsIl9vbk1vdXNlRHJhZyIsIl9vbk1vdXNlUm90YXRlIiwiX29uTW91c2VVcCIsIl9vbk1vdXNlTW92ZSIsIl9vblpvb20iLCJfb25ab29tRW5kIiwiQ29tcG9uZW50IiwiYXV0b2JpbmQiLCJ2YWx1ZSIsImRpdmlzb3IiLCJtb2R1bHVzIiwicG9pbnQiLCJwb2ludExvY2F0aW9uIiwiUG9pbnQiLCJjb252ZXJ0Iiwib3JpZ2luYWwiLCJUcmFuc2Zvcm0iLCJfbWluWm9vbSIsIl9tYXhab29tIiwibGF0UmFuZ2UiLCJhbmdsZSIsInByb3BUeXBlcyIsImNoaWxkQ29udGV4dFR5cGVzIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztvQ0FBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBY0E7QUFDQTs7O0FBZEE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0EsSUFBTUEsWUFBWSxFQUFsQjtBQUNBLElBQU1DLHdCQUF3QixFQUE5QjtBQUNBLElBQU1DLGNBQWMsR0FBcEI7O0FB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RCxVQUFVQyxPQUF4QixHQUFrQ0EsT0FBekM7QUFDRDs7QUFFRCxTQUFTOUIsc0JBQVQsQ0FBZ0M5RSxTQUFoQyxFQUEyQzZHLEtBQTNDLEVBQWtEO0FBQ2hELFNBQU83RyxVQUFVOEcsYUFBVixDQUF3QkMsZ0JBQU1DLE9BQU4sQ0FBY0gsS0FBZCxDQUF4QixDQUFQO0FBQ0Q7O0FBRUQsU0FBUzlCLGNBQVQsQ0FBd0JrQyxRQUF4QixFQUFrQztBQUNoQyxNQUFNakgsWUFBWSxJQUFJa0gsbUJBQUosQ0FBY0QsU0FBU0UsUUFBdkIsRUFBaUNGLFNBQVNHLFFBQTFDLENBQWxCO0FBQ0FwSCxZQUFVcUgsUUFBVixHQUFxQkosU0FBU0ksUUFBOUI7QUFDQXJILFlBQVVuRCxLQUFWLEdBQWtCb0ssU0FBU3BLLEtBQTNCO0FBQ0FtRCxZQUFVbEQsTUFBVixHQUFtQm1LLFNBQVNuSyxNQUE1QjtBQUNBa0QsWUFBVTlELElBQVYsR0FBaUIrSyxTQUFTL0ssSUFBMUI7QUFDQThELFlBQVVSLE1BQVYsR0FBbUJ5SCxTQUFTekgsTUFBNUI7QUFDQVEsWUFBVXNILEtBQVYsR0FBa0JMLFNBQVNLLEtBQTNCO0FBQ0F0SCxZQUFVcEMsUUFBVixHQUFxQnFKLFNBQVNySixRQUE5QjtBQUNBb0MsWUFBVXJDLEtBQVYsR0FBa0JzSixTQUFTdEosS0FBM0I7QUFDQXFDLFlBQVV0QyxPQUFWLEdBQW9CdUosU0FBU3ZKLE9BQTdCO0FBQ0FzQyxZQUFVcEMsUUFBVixHQUFxQnFKLFNBQVNySixRQUE5QjtBQUNBLFNBQU9vQyxTQUFQO0FBQ0Q7O0FBRUR2QixNQUFNOEksU0FBTixHQUFrQjNMLFVBQWxCO0FBQ0E2QyxNQUFNK0ksaUJBQU4sR0FBMEJuSixtQkFBMUI7QUFDQUksTUFBTWdKLFlBQU4sR0FBcUJ4SixhQUFyQiIsImZpbGUiOiJtYXAucmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnO1xuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcic7XG5pbXBvcnQgcHVyZVJlbmRlciBmcm9tICdwdXJlLXJlbmRlci1kZWNvcmF0b3InO1xuaW1wb3J0IGQzIGZyb20gJ2QzJztcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBtYXBib3hnbCwge1BvaW50fSBmcm9tICdtYXBib3gtZ2wnO1xuXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBNYXBJbnRlcmFjdGlvbnMgZnJvbSAnLi9tYXAtaW50ZXJhY3Rpb25zLnJlYWN0JztcbmltcG9ydCBkaWZmU3R5bGVzIGZyb20gJy4vZGlmZi1zdHlsZXMnO1xuXG4vLyBOT1RFOiBUcmFuc2Zvcm0gaXMgbm90IGEgcHVibGljIEFQSSBzbyB3ZSBzaG91bGQgYmUgY2FyZWZ1bCB0byBhbHdheXMgbG9ja1xuLy8gZG93biBtYXBib3gtZ2wgdG8gYSBzcGVjaWZpYyBtYWpvciwgbWlub3IsIGFuZCBwYXRjaCB2ZXJzaW9uLlxuaW1wb3J0IFRyYW5zZm9ybSBmcm9tICdtYXBib3gtZ2wvanMvZ2VvL3RyYW5zZm9ybSc7XG5cbi8vIE5vdGU6IE1heCBwaXRjaCBpcyBhIGhhcmQgY29kZWQgdmFsdWUgKG5vdCBhIG5hbWVkIGNvbnN0YW50KSBpbiB0cmFuc2Zvcm0uanNcbmNvbnN0IE1BWF9QSVRDSCA9IDYwO1xuY29uc3QgUElUQ0hfTU9VU0VfVEhSRVNIT0xEID0gMjA7XG5jb25zdCBQSVRDSF9BQ0NFTCA9IDEuMjtcblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgLyoqXG4gICAgKiBUaGUgbGF0aXR1ZGUgb2YgdGhlIGNlbnRlciBvZiB0aGUgbWFwLlxuICAgICovXG4gIGxhdGl0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogVGhlIGxvbmdpdHVkZSBvZiB0aGUgY2VudGVyIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgbG9uZ2l0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogVGhlIHRpbGUgem9vbSBsZXZlbCBvZiB0aGUgbWFwLlxuICAgICovXG4gIHpvb206IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgTWFwYm94IHN0eWxlIHRoZSBjb21wb25lbnQgc2hvdWxkIHVzZS4gQ2FuIGVpdGhlciBiZSBhIHN0cmluZyB1cmxcbiAgICAqIG9yIGEgTWFwYm94R0wgc3R5bGUgSW1tdXRhYmxlLk1hcCBvYmplY3QuXG4gICAgKi9cbiAgbWFwU3R5bGU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcClcbiAgXSksXG4gIC8qKlxuICAgICogVGhlIE1hcGJveCBBUEkgYWNjZXNzIHRva2VuIHRvIHByb3ZpZGUgdG8gbWFwYm94LWdsLWpzLiBUaGlzIGlzIHJlcXVpcmVkXG4gICAgKiB3aGVuIHVzaW5nIE1hcGJveCBwcm92aWRlZCB2ZWN0b3IgdGlsZXMgYW5kIHN0eWxlcy5cbiAgICAqL1xuICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgLyoqXG4gICAgKiBgb25DaGFuZ2VWaWV3cG9ydGAgY2FsbGJhY2sgaXMgZmlyZWQgd2hlbiB0aGUgdXNlciBpbnRlcmFjdGVkIHdpdGggdGhlXG4gICAgKiBtYXAuIFRoZSBvYmplY3QgcGFzc2VkIHRvIHRoZSBjYWxsYmFjayBjb250YWluZXJzIGBsYXRpdHVkZWAsXG4gICAgKiBgbG9uZ2l0dWRlYCBhbmQgYHpvb21gIGluZm9ybWF0aW9uLlxuICAgICovXG4gIG9uQ2hhbmdlVmlld3BvcnQ6IFByb3BUeXBlcy5mdW5jLFxuICAvKipcbiAgICAqIGBvbk1hcExvYWRlZGAgY2FsbGJhY2sgaXMgZmlyZWQgb24gdGhlIG1hcCdzICdsb2FkJyBldmVudFxuICAgICovXG4gIG9uTWFwTG9hZGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgLyoqXG4gICAgKiBUaGUgd2lkdGggb2YgdGhlIG1hcC4gTnVtYmVyIGluIHBpeGVscyBvciBDU1Mgc3RyaW5nIHByb3AgZS5nLiAnMTAwJSdcbiAgICAqL1xuICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLm51bWJlcixcbiAgICBQcm9wVHlwZXMuc3RyaW5nXG4gIF0pLFxuICAvKipcbiAgICAqIFRoZSBoZWlnaHQgb2YgdGhlIG1hcC4gTnVtYmVyIGluIHBpeGVscyBvciBDU1Mgc3RyaW5nIHByb3AgZS5nLiAnMTAwJSdcbiAgICAqL1xuICBoZWlnaHQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5udW1iZXIsXG4gICAgUHJvcFR5cGVzLnN0cmluZ1xuICBdKSxcbiAgLyoqXG4gICAgKiBJcyB0aGUgY29tcG9uZW50IGN1cnJlbnRseSBiZWluZyBkcmFnZ2VkLiBUaGlzIGlzIHVzZWQgdG8gc2hvdy9oaWRlIHRoZVxuICAgICogZHJhZyBjdXJzb3IuIEFsc28gdXNlZCBhcyBhbiBvcHRpbWl6YXRpb24gaW4gc29tZSBvdmVybGF5cyBieSBwcmV2ZW50aW5nXG4gICAgKiByZW5kZXJpbmcgd2hpbGUgZHJhZ2dpbmcuXG4gICAgKi9cbiAgaXNEcmFnZ2luZzogUHJvcFR5cGVzLmJvb2wsXG4gIC8qKlxuICAgICogUmVxdWlyZWQgdG8gY2FsY3VsYXRlIHRoZSBtb3VzZSBwcm9qZWN0aW9uIGFmdGVyIHRoZSBmaXJzdCBjbGljayBldmVudFxuICAgICogZHVyaW5nIGRyYWdnaW5nLiBXaGVyZSB0aGUgbWFwIGlzIGRlcGVuZHMgb24gd2hlcmUgeW91IGZpcnN0IGNsaWNrZWQgb25cbiAgICAqIHRoZSBtYXAuXG4gICAgKi9cbiAgc3RhcnREcmFnTG5nTGF0OiBQcm9wVHlwZXMuYXJyYXksXG4gIC8qKlxuICAgICogQ2FsbGVkIHdoZW4gYSBmZWF0dXJlIGlzIGhvdmVyZWQgb3Zlci4gRmVhdHVyZXMgbXVzdCBzZXQgdGhlXG4gICAgKiBgaW50ZXJhY3RpdmVgIHByb3BlcnR5IHRvIGB0cnVlYCBmb3IgdGhpcyB0byB3b3JrIHByb3Blcmx5LiBzZWUgdGhlXG4gICAgKiBNYXBib3ggZXhhbXBsZTogaHR0cHM6Ly93d3cubWFwYm94LmNvbS9tYXBib3gtZ2wtanMvZXhhbXBsZS9mZWF0dXJlc2F0L1xuICAgICogVGhlIGZpcnN0IGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjayB3aWxsIGJlIHRoZSBhcnJheSBvZiBmZWF0dXJlIHRoZVxuICAgICogbW91c2UgaXMgb3Zlci4gVGhpcyBpcyB0aGUgc2FtZSByZXNwb25zZSByZXR1cm5lZCBmcm9tIGBmZWF0dXJlc0F0YC5cbiAgICAqL1xuICBvbkhvdmVyRmVhdHVyZXM6IFByb3BUeXBlcy5mdW5jLFxuICAvKipcbiAgICAqIERlZmF1bHRzIHRvIFRSVUVcbiAgICAqIFNldCB0byBmYWxzZSB0byBlbmFibGUgb25Ib3ZlckZlYXR1cmVzIHRvIGJlIGNhbGxlZCByZWdhcmRsZXNzIGlmXG4gICAgKiB0aGVyZSBpcyBhbiBhY3R1YWwgZmVhdHVyZSBhdCB4LCB5LiBUaGlzIGlzIHVzZWZ1bCB0byBlbXVsYXRlXG4gICAgKiBcIm1vdXNlLW91dFwiIGJlaGF2aW9ycyBvbiBmZWF0dXJlcy5cbiAgICAqL1xuICBpZ25vcmVFbXB0eUZlYXR1cmVzOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIFNob3cgYXR0cmlidXRpb24gY29udHJvbCBvciBub3QuXG4gICAgKi9cbiAgYXR0cmlidXRpb25Db250cm9sOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIENhbGxlZCB3aGVuIGEgZmVhdHVyZSBpcyBjbGlja2VkIG9uLiBGZWF0dXJlcyBtdXN0IHNldCB0aGVcbiAgICAqIGBpbnRlcmFjdGl2ZWAgcHJvcGVydHkgdG8gYHRydWVgIGZvciB0aGlzIHRvIHdvcmsgcHJvcGVybHkuIHNlZSB0aGVcbiAgICAqIE1hcGJveCBleGFtcGxlOiBodHRwczovL3d3dy5tYXBib3guY29tL21hcGJveC1nbC1qcy9leGFtcGxlL2ZlYXR1cmVzYXQvXG4gICAgKiBUaGUgZmlyc3QgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrIHdpbGwgYmUgdGhlIGFycmF5IG9mIGZlYXR1cmUgdGhlXG4gICAgKiBtb3VzZSBpcyBvdmVyLiBUaGlzIGlzIHRoZSBzYW1lIHJlc3BvbnNlIHJldHVybmVkIGZyb20gYGZlYXR1cmVzQXRgLlxuICAgICovXG4gIG9uQ2xpY2tGZWF0dXJlczogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAgKiBQYXNzZWQgdG8gTWFwYm94IE1hcCBjb25zdHJ1Y3RvciB3aGljaCBwYXNzZXMgaXQgdG8gdGhlIGNhbnZhcyBjb250ZXh0LlxuICAgICogVGhpcyBpcyB1bnNlZnVsIHdoZW4geW91IHdhbnQgdG8gZXhwb3J0IHRoZSBjYW52YXMgYXMgYSBQTkcuXG4gICAgKi9cbiAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIFRoZXJlIGFyZSBzdGlsbCBrbm93biBpc3N1ZXMgd2l0aCBzdHlsZSBkaWZmaW5nLiBBcyBhIHRlbXBvcmFyeSBzdG9wZ2FwLFxuICAgICogYWRkIHRoZSBvcHRpb24gdG8gcHJldmVudCBzdHlsZSBkaWZmaW5nLlxuICAgICovXG4gIHByZXZlbnRTdHlsZURpZmZpbmc6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogRW5hYmxlcyBwZXJzcGVjdGl2ZSBjb250cm9sIGV2ZW50IGhhbmRsaW5nIChDb21tYW5kLXJvdGF0ZSlcbiAgICAqL1xuICBwZXJzcGVjdGl2ZUVuYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogU3BlY2lmeSB0aGUgYmVhcmluZyBvZiB0aGUgdmlld3BvcnRcbiAgICAqL1xuICBiZWFyaW5nOiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgICogU3BlY2lmeSB0aGUgcGl0Y2ggb2YgdGhlIHZpZXdwb3J0XG4gICAgKi9cbiAgcGl0Y2g6IFByb3BUeXBlcy5udW1iZXIsXG5cbiAgLyoqXG4gICAgKiBTcGVjaWZ5IHRoZSBhbHRpdHVkZSBvZiB0aGUgdmlld3BvcnQgY2FtZXJhXG4gICAgKiBVbml0OiBtYXAgaGVpZ2h0cywgZGVmYXVsdCAxLjVcbiAgICAqIE5vbi1wdWJsaWMgQVBJLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21hcGJveC9tYXBib3gtZ2wtanMvaXNzdWVzLzExMzdcbiAgICAqL1xuICBhbHRpdHVkZTogUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICAqIERpc2FibGVkIGRyYWdnaW5nIG9mIHRoZSBtYXBcbiAgICAqL1xuICBkcmFnRGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogRGlzYWJsZWQgem9vbWluZyBvZiB0aGUgbWFwXG4gICAgKi9cbiAgem9vbURpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIEJvdW5kcyB0byBmaXQgb24gc2NyZWVuXG4gICAgKi9cbiAgYm91bmRzOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdClcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIG1hcFN0eWxlOiAnbWFwYm94Oi8vc3R5bGVzL21hcGJveC9saWdodC12OCcsXG4gIG9uQ2hhbmdlVmlld3BvcnQ6IG51bGwsXG4gIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBjb25maWcuREVGQVVMVFMuTUFQQk9YX0FQSV9BQ0NFU1NfVE9LRU4sXG4gIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogZmFsc2UsXG4gIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSxcbiAgaWdub3JlRW1wdHlGZWF0dXJlczogdHJ1ZSxcbiAgYmVhcmluZzogMCxcbiAgcGl0Y2g6IDAsXG4gIGFsdGl0dWRlOiAxLjVcbn07XG5cbmNvbnN0IENISUxEX0NPTlRFWFRfVFlQRVMgPSB7XG4gIG1hcDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxufTtcblxuQHB1cmVSZW5kZXJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcEdMIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBzdGFydERyYWdMbmdMYXQ6IG51bGwsXG4gICAgICBzdGFydEJlYXJpbmc6IG51bGwsXG4gICAgICBzdGFydFBpdGNoOiBudWxsXG4gICAgfTtcbiAgICBtYXBib3hnbC5hY2Nlc3NUb2tlbiA9IHByb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VuO1xuXG4gICAgdGhpcy5fbWFwUmVhZHkgPSBmYWxzZTtcblxuICAgIHRoaXMuZ2V0Q2hpbGRDb250ZXh0ID0gKCkgPT4gKHtcbiAgICAgIG1hcDogdGhpcy5fbWFwXG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCBtYXBTdHlsZSA9IHRoaXMucHJvcHMubWFwU3R5bGUgaW5zdGFuY2VvZiBJbW11dGFibGUuTWFwID9cbiAgICAgIHRoaXMucHJvcHMubWFwU3R5bGUudG9KUygpIDpcbiAgICAgIHRoaXMucHJvcHMubWFwU3R5bGU7XG4gICAgY29uc3QgbWFwID0gbmV3IG1hcGJveGdsLk1hcCh7XG4gICAgICBjb250YWluZXI6IHRoaXMucmVmcy5tYXBib3hNYXAsXG4gICAgICBjZW50ZXI6IFt0aGlzLnByb3BzLmxvbmdpdHVkZSwgdGhpcy5wcm9wcy5sYXRpdHVkZV0sXG4gICAgICB6b29tOiB0aGlzLnByb3BzLnpvb20sXG4gICAgICBwaXRjaDogdGhpcy5wcm9wcy5waXRjaCxcbiAgICAgIGJlYXJpbmc6IHRoaXMucHJvcHMuYmVhcmluZyxcbiAgICAgIHN0eWxlOiBtYXBTdHlsZSxcbiAgICAgIGludGVyYWN0aXZlOiBmYWxzZSxcbiAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdGhpcy5wcm9wcy5wcmVzZXJ2ZURyYXdpbmdCdWZmZXJcbiAgICAgIC8vIFRPRE8/XG4gICAgICAvLyBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRoaXMucHJvcHMuYXR0cmlidXRpb25Db250cm9sXG4gICAgfSk7XG5cbiAgICBkMy5zZWxlY3QobWFwLmdldENhbnZhcygpKS5zdHlsZSgnb3V0bGluZScsICdub25lJyk7XG5cbiAgICB0aGlzLl9tYXAgPSBtYXA7XG4gICAgdGhpcy5fdXBkYXRlTWFwVmlld3BvcnQoe30sIHRoaXMucHJvcHMpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0pO1xuXG4gICAgaWYgKHRoaXMucHJvcHMub25NYXBMb2FkZWQpIHtcbiAgICAgIG1hcC5vbignbG9hZCcsICgpID0+IHRoaXMucHJvcHMub25NYXBMb2FkZWQobWFwKSk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydCBmb3IgZXh0ZXJuYWwgbWFuaXB1bGF0aW9uIG9mIHVuZGVybHlpbmcgbWFwXG4gICAgLy8gVE9ETyBhIGJldHRlciBhcHByb2FjaFxuICAgIG1hcC5vbignc3R5bGUubG9hZCcsICgpID0+IHRoaXMuX21hcFJlYWR5ID0gdHJ1ZSk7XG4gICAgbWFwLm9uKCdtb3ZlZW5kJywgKCkgPT4gdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSkpO1xuICAgIG1hcC5vbignem9vbWVuZCcsICgpID0+IHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0pKTtcbiAgfVxuXG4gIC8vIE5ldyBwcm9wcyBhcmUgY29taW4nIHJvdW5kIHRoZSBjb3JuZXIhXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV3UHJvcHMpIHtcbiAgICB0aGlzLl91cGRhdGVTdGF0ZUZyb21Qcm9wcyh0aGlzLnByb3BzLCBuZXdQcm9wcyk7XG4gICAgdGhpcy5fdXBkYXRlTWFwVmlld3BvcnQodGhpcy5wcm9wcywgbmV3UHJvcHMpO1xuICAgIHRoaXMuX3VwZGF0ZU1hcFN0eWxlKHRoaXMucHJvcHMsIG5ld1Byb3BzKTtcbiAgICAvLyBTYXZlIHdpZHRoL2hlaWdodCBzbyB0aGF0IHdlIGNhbiBjaGVjayB0aGVtIGluIGNvbXBvbmVudERpZFVwZGF0ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgLy8gbWFwLnJlc2l6ZSgpIHJlYWRzIHNpemUgZnJvbSBET00sIHdlIG5lZWQgdG8gY2FsbCBhZnRlciByZW5kZXJcbiAgICB0aGlzLl91cGRhdGVNYXBTaXplKHRoaXMuc3RhdGUsIHRoaXMucHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuX21hcCkge1xuICAgICAgdGhpcy5fbWFwLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIF9jdXJzb3IoKSB7XG4gICAgY29uc3QgaXNJbnRlcmFjdGl2ZSA9XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQgfHxcbiAgICAgIHRoaXMucHJvcHMub25DbGlja0ZlYXR1cmUgfHxcbiAgICAgIHRoaXMucHJvcHMub25Ib3ZlckZlYXR1cmVzO1xuICAgIGlmIChpc0ludGVyYWN0aXZlKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5pc0RyYWdnaW5nID9cbiAgICAgICAgY29uZmlnLkNVUlNPUi5HUkFCQklORyA6IGNvbmZpZy5DVVJTT1IuR1JBQjtcbiAgICB9XG4gICAgcmV0dXJuICdpbmhlcml0JztcbiAgfVxuXG4gIF9nZXRNYXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcDtcbiAgfVxuXG4gIF91cGRhdGVTdGF0ZUZyb21Qcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBtYXBib3hnbC5hY2Nlc3NUb2tlbiA9IG5ld1Byb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VuO1xuICAgIGNvbnN0IHtzdGFydERyYWdMbmdMYXR9ID0gbmV3UHJvcHM7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGFydERyYWdMbmdMYXQ6IHN0YXJ0RHJhZ0xuZ0xhdCAmJiBzdGFydERyYWdMbmdMYXQuc2xpY2UoKVxuICAgIH0pO1xuICB9XG5cbiAgLy8gSW5kaXZpZHVhbGx5IHVwZGF0ZSB0aGUgbWFwcyBzb3VyY2UgYW5kIGxheWVycyB0aGF0IGhhdmUgY2hhbmdlZCBpZiBhbGxcbiAgLy8gb3RoZXIgc3R5bGUgcHJvcHMgaGF2ZW4ndCBjaGFuZ2VkLiBUaGlzIHByZXZlbnRzIGZsaWNraW5nIG9mIHRoZSBtYXAgd2hlblxuICAvLyBzdHlsZXMgb25seSBjaGFuZ2Ugc291cmNlcyBvciBsYXllcnMuXG4gIF9zZXREaWZmU3R5bGUocHJldlN0eWxlLCBuZXh0U3R5bGUpIHtcbiAgICBjb25zdCBwcmV2S2V5c01hcCA9IHByZXZTdHlsZSAmJiBzdHlsZUtleXNNYXAocHJldlN0eWxlKSB8fCB7fTtcbiAgICBjb25zdCBuZXh0S2V5c01hcCA9IHN0eWxlS2V5c01hcChuZXh0U3R5bGUpO1xuICAgIGZ1bmN0aW9uIHN0eWxlS2V5c01hcChzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlLm1hcCgoKSA9PiB0cnVlKS5kZWxldGUoJ2xheWVycycpLmRlbGV0ZSgnc291cmNlcycpLnRvSlMoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcHJvcHNPdGhlclRoYW5MYXllcnNPclNvdXJjZXNEaWZmZXIoKSB7XG4gICAgICBjb25zdCBwcmV2S2V5c0xpc3QgPSBPYmplY3Qua2V5cyhwcmV2S2V5c01hcCk7XG4gICAgICBjb25zdCBuZXh0S2V5c0xpc3QgPSBPYmplY3Qua2V5cyhuZXh0S2V5c01hcCk7XG4gICAgICBpZiAocHJldktleXNMaXN0Lmxlbmd0aCAhPT0gbmV4dEtleXNMaXN0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIGBuZXh0U3R5bGVgIGFuZCBgcHJldlN0eWxlYCBzaG91bGQgbm90IGhhdmUgdGhlIHNhbWUgc2V0IG9mIHByb3BzLlxuICAgICAgaWYgKG5leHRLZXlzTGlzdC5zb21lKFxuICAgICAgICBrZXkgPT4gcHJldlN0eWxlLmdldChrZXkpICE9PSBuZXh0U3R5bGUuZ2V0KGtleSlcbiAgICAgICAgLy8gQnV0IHRoZSB2YWx1ZSBvZiBvbmUgb2YgdGhvc2UgcHJvcHMgaXMgZGlmZmVyZW50LlxuICAgICAgKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcblxuICAgIGlmICghcHJldlN0eWxlIHx8IHByb3BzT3RoZXJUaGFuTGF5ZXJzT3JTb3VyY2VzRGlmZmVyKCkpIHtcbiAgICAgIG1hcC5zZXRTdHlsZShuZXh0U3R5bGUudG9KUygpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7c291cmNlc0RpZmYsIGxheWVyc0RpZmZ9ID0gZGlmZlN0eWxlcyhwcmV2U3R5bGUsIG5leHRTdHlsZSk7XG5cbiAgICAvLyBUT0RPOiBJdCdzIHJhdGhlciBkaWZmaWN1bHQgdG8gZGV0ZXJtaW5lIHN0eWxlIGRpZmZpbmcgaW4gdGhlIHByZXNlbmNlXG4gICAgLy8gb2YgcmVmcy4gRm9yIG5vdywgaWYgYW55IHN0eWxlIHVwZGF0ZSBoYXMgYSByZWYsIGZhbGxiYWNrIHRvIG5vIGRpZmZpbmcuXG4gICAgLy8gV2UgY2FuIGNvbWUgYmFjayB0byB0aGlzIGNhc2UgaWYgdGhlcmUncyBhIHNvbGlkIHVzZWNhc2UuXG4gICAgaWYgKGxheWVyc0RpZmYudXBkYXRlcy5zb21lKG5vZGUgPT4gbm9kZS5sYXllci5nZXQoJ3JlZicpKSkge1xuICAgICAgbWFwLnNldFN0eWxlKG5leHRTdHlsZS50b0pTKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZW50ZXIgb2Ygc291cmNlc0RpZmYuZW50ZXIpIHtcbiAgICAgIG1hcC5hZGRTb3VyY2UoZW50ZXIuaWQsIGVudGVyLnNvdXJjZS50b0pTKCkpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHVwZGF0ZSBvZiBzb3VyY2VzRGlmZi51cGRhdGUpIHtcbiAgICAgIG1hcC5yZW1vdmVTb3VyY2UodXBkYXRlLmlkKTtcbiAgICAgIG1hcC5hZGRTb3VyY2UodXBkYXRlLmlkLCB1cGRhdGUuc291cmNlLnRvSlMoKSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZXhpdCBvZiBzb3VyY2VzRGlmZi5leGl0KSB7XG4gICAgICBtYXAucmVtb3ZlU291cmNlKGV4aXQuaWQpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGV4aXQgb2YgbGF5ZXJzRGlmZi5leGl0aW5nKSB7XG4gICAgICBpZiAobWFwLnN0eWxlLmdldExheWVyKGV4aXQuaWQpKSB7XG4gICAgICAgIG1hcC5yZW1vdmVMYXllcihleGl0LmlkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCB1cGRhdGUgb2YgbGF5ZXJzRGlmZi51cGRhdGVzKSB7XG4gICAgICBpZiAoIXVwZGF0ZS5lbnRlcikge1xuICAgICAgICAvLyBUaGlzIGlzIGFuIG9sZCBsYXllciB0aGF0IG5lZWRzIHRvIGJlIHVwZGF0ZWQuIFJlbW92ZSB0aGUgb2xkIGxheWVyXG4gICAgICAgIC8vIHdpdGggdGhlIHNhbWUgaWQgYW5kIGFkZCBpdCBiYWNrIGFnYWluLlxuICAgICAgICBtYXAucmVtb3ZlTGF5ZXIodXBkYXRlLmlkKTtcbiAgICAgIH1cbiAgICAgIG1hcC5hZGRMYXllcih1cGRhdGUubGF5ZXIudG9KUygpLCB1cGRhdGUuYmVmb3JlKTtcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlTWFwU3R5bGUob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgY29uc3QgbWFwU3R5bGUgPSBuZXdQcm9wcy5tYXBTdHlsZTtcbiAgICBjb25zdCBvbGRNYXBTdHlsZSA9IG9sZFByb3BzLm1hcFN0eWxlO1xuICAgIGlmIChtYXBTdHlsZSAhPT0gb2xkTWFwU3R5bGUpIHtcbiAgICAgIGlmIChtYXBTdHlsZSBpbnN0YW5jZW9mIEltbXV0YWJsZS5NYXApIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMucHJldmVudFN0eWxlRGlmZmluZykge1xuICAgICAgICAgIHRoaXMuX2dldE1hcCgpLnNldFN0eWxlKG1hcFN0eWxlLnRvSlMoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fc2V0RGlmZlN0eWxlKG9sZE1hcFN0eWxlLCBtYXBTdHlsZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2dldE1hcCgpLnNldFN0eWxlKG1hcFN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfdXBkYXRlTWFwVmlld3BvcnQob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgY29uc3Qgdmlld3BvcnRDaGFuZ2VkID1cbiAgICAgIG5ld1Byb3BzLmxhdGl0dWRlICE9PSBvbGRQcm9wcy5sYXRpdHVkZSB8fFxuICAgICAgbmV3UHJvcHMubG9uZ2l0dWRlICE9PSBvbGRQcm9wcy5sb25naXR1ZGUgfHxcbiAgICAgIG5ld1Byb3BzLnpvb20gIT09IG9sZFByb3BzLnpvb20gfHxcbiAgICAgIG5ld1Byb3BzLnBpdGNoICE9PSBvbGRQcm9wcy5waXRjaCB8fFxuICAgICAgbmV3UHJvcHMuYmVhcmluZyAhPT0gb2xkUHJvcHMuYmVhcmluZyB8fFxuICAgICAgbmV3UHJvcHMuYWx0aXR1ZGUgIT09IG9sZFByb3BzLmFsdGl0dWRlO1xuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG5cbiAgICBpZiAodmlld3BvcnRDaGFuZ2VkKSB7XG4gICAgICBtYXAuanVtcFRvKHtcbiAgICAgICAgY2VudGVyOiBbbmV3UHJvcHMubG9uZ2l0dWRlLCBuZXdQcm9wcy5sYXRpdHVkZV0sXG4gICAgICAgIHpvb206IG5ld1Byb3BzLnpvb20sXG4gICAgICAgIGJlYXJpbmc6IG5ld1Byb3BzLmJlYXJpbmcsXG4gICAgICAgIHBpdGNoOiBuZXdQcm9wcy5waXRjaFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRPRE8gLSBqdW1wVG8gZG9lc24ndCBoYW5kbGUgYWx0aXR1ZGVcbiAgICAgIGlmIChuZXdQcm9wcy5hbHRpdHVkZSAhPT0gb2xkUHJvcHMuYWx0aXR1ZGUpIHtcbiAgICAgICAgbWFwLnRyYW5zZm9ybS5hbHRpdHVkZSA9IG5ld1Byb3BzLmFsdGl0dWRlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvbGRQcm9wcy5ib3VuZHMgIT09IG5ld1Byb3BzLmJvdW5kcyAmJiBuZXdQcm9wcy5ib3VuZHMpIHtcbiAgICAgIG1hcC5maXRCb3VuZHMobmV3UHJvcHMuYm91bmRzLnRvSlMoKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gTm90ZTogbmVlZHMgdG8gYmUgY2FsbGVkIGFmdGVyIHJlbmRlciAoZS5nLiBpbiBjb21wb25lbnREaWRVcGRhdGUpXG4gIF91cGRhdGVNYXBTaXplKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIGNvbnN0IHNpemVDaGFuZ2VkID1cbiAgICAgIG9sZFByb3BzLndpZHRoICE9PSBuZXdQcm9wcy53aWR0aCB8fCBvbGRQcm9wcy5oZWlnaHQgIT09IG5ld1Byb3BzLmhlaWdodDtcblxuICAgIGlmIChzaXplQ2hhbmdlZCkge1xuICAgICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgICBtYXAucmVzaXplKCk7XG4gICAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtKTtcbiAgICB9XG4gIH1cblxuICBfY2FsY3VsYXRlTmV3UGl0Y2hBbmRCZWFyaW5nKHtwb3MsIHN0YXJ0UG9zLCBzdGFydEJlYXJpbmcsIHN0YXJ0UGl0Y2h9KSB7XG4gICAgY29uc3QgeERlbHRhID0gcG9zLnggLSBzdGFydFBvcy54O1xuICAgIGNvbnN0IGJlYXJpbmcgPSBzdGFydEJlYXJpbmcgKyAxODAgKiB4RGVsdGEgLyB0aGlzLnByb3BzLndpZHRoO1xuXG4gICAgbGV0IHBpdGNoID0gc3RhcnRQaXRjaDtcbiAgICBjb25zdCB5RGVsdGEgPSBwb3MueSAtIHN0YXJ0UG9zLnk7XG4gICAgaWYgKHlEZWx0YSA+IDApIHtcbiAgICAgIC8vIERyYWdnaW5nIGRvd253YXJkcywgZ3JhZHVhbGx5IGRlY3JlYXNlIHBpdGNoXG4gICAgICBpZiAoTWF0aC5hYnModGhpcy5wcm9wcy5oZWlnaHQgLSBzdGFydFBvcy55KSA+IFBJVENIX01PVVNFX1RIUkVTSE9MRCkge1xuICAgICAgICBjb25zdCBzY2FsZSA9IHlEZWx0YSAvICh0aGlzLnByb3BzLmhlaWdodCAtIHN0YXJ0UG9zLnkpO1xuICAgICAgICBwaXRjaCA9ICgxIC0gc2NhbGUpICogUElUQ0hfQUNDRUwgKiBzdGFydFBpdGNoO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoeURlbHRhIDwgMCkge1xuICAgICAgLy8gRHJhZ2dpbmcgdXB3YXJkcywgZ3JhZHVhbGx5IGluY3JlYXNlIHBpdGNoXG4gICAgICBpZiAoc3RhcnRQb3MueSA+IFBJVENIX01PVVNFX1RIUkVTSE9MRCkge1xuICAgICAgICAvLyBNb3ZlIGZyb20gMCB0byAxIGFzIHdlIGRyYWcgdXB3YXJkc1xuICAgICAgICBjb25zdCB5U2NhbGUgPSAxIC0gcG9zLnkgLyBzdGFydFBvcy55O1xuICAgICAgICAvLyBHcmFkdWFsbHkgYWRkIHVudGlsIHdlIGhpdCBtYXggcGl0Y2hcbiAgICAgICAgcGl0Y2ggPSBzdGFydFBpdGNoICsgeVNjYWxlICogKE1BWF9QSVRDSCAtIHN0YXJ0UGl0Y2gpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnNvbGUuZGVidWcoc3RhcnRQaXRjaCwgcGl0Y2gpO1xuICAgIHJldHVybiB7XG4gICAgICBwaXRjaDogTWF0aC5tYXgoTWF0aC5taW4ocGl0Y2gsIE1BWF9QSVRDSCksIDApLFxuICAgICAgYmVhcmluZ1xuICAgIH07XG4gIH1cblxuICAgLy8gSGVscGVyIHRvIGNhbGwgcHJvcHMub25DaGFuZ2VWaWV3cG9ydFxuICBfY2FsbE9uQ2hhbmdlVmlld3BvcnQodHJhbnNmb3JtLCBvcHRzID0ge30pIHtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0KSB7XG4gICAgICBjb25zdCB7c2Nyb2xsSGVpZ2h0OiBoZWlnaHQsIHNjcm9sbFdpZHRoOiB3aWR0aH0gPSB0aGlzLl9nZXRNYXAoKS5nZXRDb250YWluZXIoKTtcblxuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0KHtcbiAgICAgICAgbGF0aXR1ZGU6IHRyYW5zZm9ybS5jZW50ZXIubGF0LFxuICAgICAgICBsb25naXR1ZGU6IG1vZCh0cmFuc2Zvcm0uY2VudGVyLmxuZyArIDE4MCwgMzYwKSAtIDE4MCxcbiAgICAgICAgem9vbTogdHJhbnNmb3JtLnpvb20sXG4gICAgICAgIHBpdGNoOiB0cmFuc2Zvcm0ucGl0Y2gsXG4gICAgICAgIGJlYXJpbmc6IG1vZCh0cmFuc2Zvcm0uYmVhcmluZyArIDE4MCwgMzYwKSAtIDE4MCxcblxuICAgICAgICBpc0RyYWdnaW5nOiB0aGlzLnByb3BzLmlzRHJhZ2dpbmcsXG4gICAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogdGhpcy5wcm9wcy5zdGFydERyYWdMbmdMYXQsXG4gICAgICAgIHN0YXJ0QmVhcmluZzogdGhpcy5wcm9wcy5zdGFydEJlYXJpbmcsXG4gICAgICAgIHN0YXJ0UGl0Y2g6IHRoaXMucHJvcHMuc3RhcnRQaXRjaCxcblxuICAgICAgICBwcm9qZWN0aW9uTWF0cml4OiB0cmFuc2Zvcm0ucHJvak1hdHJpeCxcblxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIHdpZHRoLFxuXG4gICAgICAgIC4uLm9wdHNcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZURvd24oe3Bvc30pIHtcbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICBjb25zdCBsbmdMYXQgPSB1bnByb2plY3RGcm9tVHJhbnNmb3JtKG1hcC50cmFuc2Zvcm0sIHBvcyk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogdHJ1ZSxcbiAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogW2xuZ0xhdC5sbmcsIGxuZ0xhdC5sYXRdLFxuICAgICAgc3RhcnRCZWFyaW5nOiBtYXAudHJhbnNmb3JtLmJlYXJpbmcsXG4gICAgICBzdGFydFBpdGNoOiBtYXAudHJhbnNmb3JtLnBpdGNoXG4gICAgfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VEcmFnKHtwb3N9KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQgfHwgdGhpcy5wcm9wcy5kcmFnRGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB0YWtlIHRoZSBzdGFydCBsbmdsYXQgYW5kIHB1dCBpdCB3aGVyZSB0aGUgbW91c2UgaXMgZG93bi5cbiAgICBhc3NlcnQodGhpcy5wcm9wcy5zdGFydERyYWdMbmdMYXQsICdgc3RhcnREcmFnTG5nTGF0YCBwcm9wIGlzIHJlcXVpcmVkICcgK1xuICAgICAgJ2ZvciBtb3VzZSBkcmFnIGJlaGF2aW9yIHRvIGNhbGN1bGF0ZSB3aGVyZSB0byBwb3NpdGlvbiB0aGUgbWFwLicpO1xuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gY2xvbmVUcmFuc2Zvcm0obWFwLnRyYW5zZm9ybSk7XG4gICAgdHJhbnNmb3JtLnNldExvY2F0aW9uQXRQb2ludCh0aGlzLnByb3BzLnN0YXJ0RHJhZ0xuZ0xhdCwgcG9zKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydCh0cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZVJvdGF0ZSh7cG9zLCBzdGFydFBvc30pIHtcbiAgICBpZiAoIXRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCB8fCAhdGhpcy5wcm9wcy5wZXJzcGVjdGl2ZUVuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7c3RhcnRCZWFyaW5nLCBzdGFydFBpdGNofSA9IHRoaXMucHJvcHM7XG4gICAgYXNzZXJ0KHR5cGVvZiBzdGFydEJlYXJpbmcgPT09ICdudW1iZXInLFxuICAgICAgJ2BzdGFydEJlYXJpbmdgIHByb3AgaXMgcmVxdWlyZWQgZm9yIG1vdXNlIHJvdGF0ZSBiZWhhdmlvcicpO1xuICAgIGFzc2VydCh0eXBlb2Ygc3RhcnRQaXRjaCA9PT0gJ251bWJlcicsXG4gICAgICAnYHN0YXJ0UGl0Y2hgIHByb3AgaXMgcmVxdWlyZWQgZm9yIG1vdXNlIHJvdGF0ZSBiZWhhdmlvcicpO1xuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG5cbiAgICBjb25zdCB7cGl0Y2gsIGJlYXJpbmd9ID0gdGhpcy5fY2FsY3VsYXRlTmV3UGl0Y2hBbmRCZWFyaW5nKHtcbiAgICAgIHBvcyxcbiAgICAgIHN0YXJ0UG9zLFxuICAgICAgc3RhcnRCZWFyaW5nLFxuICAgICAgc3RhcnRQaXRjaFxuICAgIH0pO1xuXG4gICAgY29uc3QgdHJhbnNmb3JtID0gY2xvbmVUcmFuc2Zvcm0obWFwLnRyYW5zZm9ybSk7XG4gICAgdHJhbnNmb3JtLmJlYXJpbmcgPSBiZWFyaW5nO1xuICAgIHRyYW5zZm9ybS5waXRjaCA9IHBpdGNoO1xuXG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQodHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VNb3ZlKG9wdCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5vbkhvdmVyRmVhdHVyZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICBjb25zdCBwb3MgPSBvcHQucG9zO1xuXG4gICAgY29uc3QgZmVhdHVyZXMgPSBtYXAucXVlcnlSZW5kZXJlZEZlYXR1cmVzKFtwb3MueCwgcG9zLnldKTtcbiAgICBpZiAoIWZlYXR1cmVzLmxlbmd0aCAmJiB0aGlzLnByb3BzLmlnbm9yZUVtcHR5RmVhdHVyZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5vbkhvdmVyRmVhdHVyZXMoZmVhdHVyZXMpO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlVXAob3B0KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm9uQ2xpY2tGZWF0dXJlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgc3RhcnREcmFnTG5nTGF0OiBudWxsLFxuICAgICAgc3RhcnRCZWFyaW5nOiBudWxsLFxuICAgICAgc3RhcnRQaXRjaDogbnVsbFxuICAgIH0pO1xuXG4gICAgY29uc3QgcG9zID0gb3B0LnBvcztcblxuICAgIC8vIFJhZGl1cyBlbmFibGVzIHBvaW50IGZlYXR1cmVzLCBsaWtlIG1hcmtlciBzeW1ib2xzLCB0byBiZSBjbGlja2VkLlxuICAgIGNvbnN0IHNpemUgPSAxNTtcbiAgICBjb25zdCBiYm94ID0gW1twb3MueCAtIHNpemUsIHBvcy55IC0gc2l6ZV0sIFtwb3MueCArIHNpemUsIHBvcy55ICsgc2l6ZV1dO1xuICAgIGNvbnN0IGZlYXR1cmVzID0gbWFwLnF1ZXJ5UmVuZGVyZWRGZWF0dXJlcyhiYm94KTtcbiAgICBpZiAoIWZlYXR1cmVzLmxlbmd0aCAmJiB0aGlzLnByb3BzLmlnbm9yZUVtcHR5RmVhdHVyZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrRmVhdHVyZXMoZmVhdHVyZXMpO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vblpvb20oe3Bvcywgc2NhbGV9KSB7XG4gICAgaWYgKHRoaXMucHJvcHMuem9vbURpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gY2xvbmVUcmFuc2Zvcm0obWFwLnRyYW5zZm9ybSk7XG4gICAgY29uc3QgYXJvdW5kID0gdW5wcm9qZWN0RnJvbVRyYW5zZm9ybSh0cmFuc2Zvcm0sIHBvcyk7XG4gICAgdHJhbnNmb3JtLnpvb20gPSB0cmFuc2Zvcm0uc2NhbGVab29tKG1hcC50cmFuc2Zvcm0uc2NhbGUgKiBzY2FsZSk7XG4gICAgdHJhbnNmb3JtLnNldExvY2F0aW9uQXRQb2ludChhcm91bmQsIHBvcyk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQodHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uWm9vbUVuZCgpIHtcbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiBmYWxzZVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjbGFzc05hbWUsIHdpZHRoLCBoZWlnaHQsIHN0eWxlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgbWFwU3R5bGUgPSB7XG4gICAgICAuLi5zdHlsZSxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgY3Vyc29yOiB0aGlzLl9jdXJzb3IoKVxuICAgIH07XG5cbiAgICBsZXQgY29udGVudCA9IFtcbiAgICAgIDxkaXYga2V5PVwibWFwXCIgcmVmPVwibWFwYm94TWFwXCJcbiAgICAgICAgc3R5bGU9eyBtYXBTdHlsZSB9IGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9Lz4sXG4gICAgICA8ZGl2IGtleT1cIm92ZXJsYXlzXCIgY2xhc3NOYW1lPVwib3ZlcmxheXNcIlxuICAgICAgICBzdHlsZT17IHtwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogMCwgdG9wOiAwfSB9PlxuICAgICAgICB7IHRoaXMucHJvcHMuY2hpbGRyZW4gfVxuICAgICAgPC9kaXY+XG4gICAgXTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQpIHtcbiAgICAgIGNvbnRlbnQgPSAoXG4gICAgICAgIDxNYXBJbnRlcmFjdGlvbnNcbiAgICAgICAgICBvbk1vdXNlRG93biA9eyB0aGlzLl9vbk1vdXNlRG93biB9XG4gICAgICAgICAgb25Nb3VzZURyYWcgPXsgdGhpcy5fb25Nb3VzZURyYWcgfVxuICAgICAgICAgIG9uTW91c2VSb3RhdGUgPXsgdGhpcy5fb25Nb3VzZVJvdGF0ZSB9XG4gICAgICAgICAgb25Nb3VzZVVwID17IHRoaXMuX29uTW91c2VVcCB9XG4gICAgICAgICAgb25Nb3VzZU1vdmUgPXsgdGhpcy5fb25Nb3VzZU1vdmUgfVxuICAgICAgICAgIG9uWm9vbSA9eyB0aGlzLl9vblpvb20gfVxuICAgICAgICAgIG9uWm9vbUVuZCA9eyB0aGlzLl9vblpvb21FbmQgfVxuICAgICAgICAgIHdpZHRoID17IHRoaXMucHJvcHMud2lkdGggfVxuICAgICAgICAgIGhlaWdodCA9eyB0aGlzLnByb3BzLmhlaWdodCB9XG4gICAgICAgICAgem9vbURpc2FibGVkID17IHRoaXMucHJvcHMuem9vbURpc2FibGVkIH1cbiAgICAgICAgICBkcmFnRGlzYWJsZWQgPXsgdGhpcy5wcm9wcy5kcmFnRGlzYWJsZWQgfT5cblxuICAgICAgICAgIHsgY29udGVudCB9XG5cbiAgICAgICAgPC9NYXBJbnRlcmFjdGlvbnM+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIC4uLnRoaXMucHJvcHMuc3R5bGUsXG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9IH0+XG5cbiAgICAgICAgeyBjb250ZW50IH1cblxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb2QodmFsdWUsIGRpdmlzb3IpIHtcbiAgY29uc3QgbW9kdWx1cyA9IHZhbHVlICUgZGl2aXNvcjtcbiAgcmV0dXJuIG1vZHVsdXMgPCAwID8gZGl2aXNvciArIG1vZHVsdXMgOiBtb2R1bHVzO1xufVxuXG5mdW5jdGlvbiB1bnByb2plY3RGcm9tVHJhbnNmb3JtKHRyYW5zZm9ybSwgcG9pbnQpIHtcbiAgcmV0dXJuIHRyYW5zZm9ybS5wb2ludExvY2F0aW9uKFBvaW50LmNvbnZlcnQocG9pbnQpKTtcbn1cblxuZnVuY3Rpb24gY2xvbmVUcmFuc2Zvcm0ob3JpZ2luYWwpIHtcbiAgY29uc3QgdHJhbnNmb3JtID0gbmV3IFRyYW5zZm9ybShvcmlnaW5hbC5fbWluWm9vbSwgb3JpZ2luYWwuX21heFpvb20pO1xuICB0cmFuc2Zvcm0ubGF0UmFuZ2UgPSBvcmlnaW5hbC5sYXRSYW5nZTtcbiAgdHJhbnNmb3JtLndpZHRoID0gb3JpZ2luYWwud2lkdGg7XG4gIHRyYW5zZm9ybS5oZWlnaHQgPSBvcmlnaW5hbC5oZWlnaHQ7XG4gIHRyYW5zZm9ybS56b29tID0gb3JpZ2luYWwuem9vbTtcbiAgdHJhbnNmb3JtLmNlbnRlciA9IG9yaWdpbmFsLmNlbnRlcjtcbiAgdHJhbnNmb3JtLmFuZ2xlID0gb3JpZ2luYWwuYW5nbGU7XG4gIHRyYW5zZm9ybS5hbHRpdHVkZSA9IG9yaWdpbmFsLmFsdGl0dWRlO1xuICB0cmFuc2Zvcm0ucGl0Y2ggPSBvcmlnaW5hbC5waXRjaDtcbiAgdHJhbnNmb3JtLmJlYXJpbmcgPSBvcmlnaW5hbC5iZWFyaW5nO1xuICB0cmFuc2Zvcm0uYWx0aXR1ZGUgPSBvcmlnaW5hbC5hbHRpdHVkZTtcbiAgcmV0dXJuIHRyYW5zZm9ybTtcbn1cblxuTWFwR0wucHJvcFR5cGVzID0gUFJPUF9UWVBFUztcbk1hcEdMLmNoaWxkQ29udGV4dFR5cGVzID0gQ0hJTERfQ09OVEVYVF9UWVBFUztcbk1hcEdMLmRlZmF1bHRQcm9wcyA9IERFRkFVTFRfUFJPUFM7XG4iXX0=