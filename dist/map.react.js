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
  map: _propTypes2.default.object
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAucmVhY3QuanMiXSwibmFtZXMiOlsiTUFYX1BJVENIIiwiUElUQ0hfTU9VU0VfVEhSRVNIT0xEIiwiUElUQ0hfQUNDRUwiLCJQUk9QX1RZUEVTIiwibGF0aXR1ZGUiLCJQcm9wVHlwZXMiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwibG9uZ2l0dWRlIiwiem9vbSIsIm1hcFN0eWxlIiwib25lT2ZUeXBlIiwic3RyaW5nIiwiaW5zdGFuY2VPZiIsIkltbXV0YWJsZSIsIk1hcCIsIm1hcGJveEFwaUFjY2Vzc1Rva2VuIiwib25DaGFuZ2VWaWV3cG9ydCIsImZ1bmMiLCJvbk1hcExvYWRlZCIsIndpZHRoIiwiaGVpZ2h0IiwiaXNEcmFnZ2luZyIsImJvb2wiLCJzdGFydERyYWdMbmdMYXQiLCJhcnJheSIsIm9uSG92ZXJGZWF0dXJlcyIsImlnbm9yZUVtcHR5RmVhdHVyZXMiLCJhdHRyaWJ1dGlvbkNvbnRyb2wiLCJvbkNsaWNrRmVhdHVyZXMiLCJwcmVzZXJ2ZURyYXdpbmdCdWZmZXIiLCJwcmV2ZW50U3R5bGVEaWZmaW5nIiwicGVyc3BlY3RpdmVFbmFibGVkIiwiYmVhcmluZyIsInBpdGNoIiwiYWx0aXR1ZGUiLCJkcmFnRGlzYWJsZWQiLCJ6b29tRGlzYWJsZWQiLCJib3VuZHMiLCJMaXN0IiwiREVGQVVMVF9QUk9QUyIsImNvbmZpZyIsIkRFRkFVTFRTIiwiTUFQQk9YX0FQSV9BQ0NFU1NfVE9LRU4iLCJDSElMRF9DT05URVhUX1RZUEVTIiwibWFwIiwib2JqZWN0IiwiTWFwR0wiLCJwdXJlUmVuZGVyIiwicHJvcHMiLCJzdGF0ZSIsInN0YXJ0QmVhcmluZyIsInN0YXJ0UGl0Y2giLCJtYXBib3hnbCIsImFjY2Vzc1Rva2VuIiwiX21hcFJlYWR5IiwiZ2V0Q2hpbGRDb250ZXh0IiwiX21hcCIsInRvSlMiLCJjb250YWluZXIiLCJyZWZzIiwibWFwYm94TWFwIiwiY2VudGVyIiwic3R5bGUiLCJpbnRlcmFjdGl2ZSIsImQzIiwic2VsZWN0IiwiZ2V0Q2FudmFzIiwiX3VwZGF0ZU1hcFZpZXdwb3J0IiwiX2NhbGxPbkNoYW5nZVZpZXdwb3J0IiwidHJhbnNmb3JtIiwib24iLCJuZXdQcm9wcyIsIl91cGRhdGVTdGF0ZUZyb21Qcm9wcyIsIl91cGRhdGVNYXBTdHlsZSIsInNldFN0YXRlIiwiX3VwZGF0ZU1hcFNpemUiLCJyZW1vdmUiLCJpc0ludGVyYWN0aXZlIiwib25DbGlja0ZlYXR1cmUiLCJDVVJTT1IiLCJHUkFCQklORyIsIkdSQUIiLCJvbGRQcm9wcyIsInNsaWNlIiwicHJldlN0eWxlIiwibmV4dFN0eWxlIiwicHJldktleXNNYXAiLCJzdHlsZUtleXNNYXAiLCJuZXh0S2V5c01hcCIsImRlbGV0ZSIsInByb3BzT3RoZXJUaGFuTGF5ZXJzT3JTb3VyY2VzRGlmZmVyIiwicHJldktleXNMaXN0IiwiT2JqZWN0Iiwia2V5cyIsIm5leHRLZXlzTGlzdCIsImxlbmd0aCIsInNvbWUiLCJnZXQiLCJrZXkiLCJfZ2V0TWFwIiwic2V0U3R5bGUiLCJzb3VyY2VzRGlmZiIsImxheWVyc0RpZmYiLCJ1cGRhdGVzIiwibm9kZSIsImxheWVyIiwiZW50ZXIiLCJhZGRTb3VyY2UiLCJpZCIsInNvdXJjZSIsInVwZGF0ZSIsInJlbW92ZVNvdXJjZSIsImV4aXQiLCJleGl0aW5nIiwiZ2V0TGF5ZXIiLCJyZW1vdmVMYXllciIsImFkZExheWVyIiwiYmVmb3JlIiwib2xkTWFwU3R5bGUiLCJfc2V0RGlmZlN0eWxlIiwidmlld3BvcnRDaGFuZ2VkIiwianVtcFRvIiwiZml0Qm91bmRzIiwic2l6ZUNoYW5nZWQiLCJyZXNpemUiLCJwb3MiLCJzdGFydFBvcyIsInhEZWx0YSIsIngiLCJ5RGVsdGEiLCJ5IiwiTWF0aCIsImFicyIsInNjYWxlIiwieVNjYWxlIiwibWF4IiwibWluIiwib3B0cyIsImdldENvbnRhaW5lciIsInNjcm9sbEhlaWdodCIsInNjcm9sbFdpZHRoIiwibGF0IiwibW9kIiwibG5nIiwicHJvamVjdGlvbk1hdHJpeCIsInByb2pNYXRyaXgiLCJsbmdMYXQiLCJ1bnByb2plY3RGcm9tVHJhbnNmb3JtIiwiY2xvbmVUcmFuc2Zvcm0iLCJzZXRMb2NhdGlvbkF0UG9pbnQiLCJfY2FsY3VsYXRlTmV3UGl0Y2hBbmRCZWFyaW5nIiwib3B0IiwiZmVhdHVyZXMiLCJxdWVyeVJlbmRlcmVkRmVhdHVyZXMiLCJzaXplIiwiYmJveCIsImFyb3VuZCIsInNjYWxlWm9vbSIsImNsYXNzTmFtZSIsImN1cnNvciIsIl9jdXJzb3IiLCJjb250ZW50IiwicG9zaXRpb24iLCJsZWZ0IiwidG9wIiwiY2hpbGRyZW4iLCJfb25Nb3VzZURvd24iLCJfb25Nb3VzZURyYWciLCJfb25Nb3VzZVJvdGF0ZSIsIl9vbk1vdXNlVXAiLCJfb25Nb3VzZU1vdmUiLCJfb25ab29tIiwiX29uWm9vbUVuZCIsIkNvbXBvbmVudCIsImF1dG9iaW5kIiwidmFsdWUiLCJkaXZpc29yIiwibW9kdWx1cyIsInBvaW50IiwicG9pbnRMb2NhdGlvbiIsIlBvaW50IiwiY29udmVydCIsIm9yaWdpbmFsIiwiVHJhbnNmb3JtIiwiX21pblpvb20iLCJfbWF4Wm9vbSIsImxhdFJhbmdlIiwiYW5nbGUiLCJwcm9wVHlwZXMiLCJjaGlsZENvbnRleHRUeXBlcyIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7b0NBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQWNBO0FBQ0E7OztBQWRBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU1BLFlBQVksRUFBbEI7QUFDQSxJQUFNQyx3QkFBd0IsRUFBOUI7QUFDQSxJQUFNQyxjQUFjLEdBQXBCOztBQUVBLElBQU1D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QUF6QztBQUNEOztBQUVELFNBQVM5QixzQkFBVCxDQUFnQzlFLFNBQWhDLEVBQTJDNkcsS0FBM0MsRUFBa0Q7QUFDaEQsU0FBTzdHLFVBQVU4RyxhQUFWLENBQXdCQyxnQkFBTUMsT0FBTixDQUFjSCxLQUFkLENBQXhCLENBQVA7QUFDRDs7QUFFRCxTQUFTOUIsY0FBVCxDQUF3QmtDLFFBQXhCLEVBQWtDO0FBQ2hDLE1BQU1qSCxZQUFZLElBQUlrSCxtQkFBSixDQUFjRCxTQUFTRSxRQUF2QixFQUFpQ0YsU0FBU0csUUFBMUMsQ0FBbEI7QUFDQXBILFlBQVVxSCxRQUFWLEdBQXFCSixTQUFTSSxRQUE5QjtBQUNBckgsWUFBVWxELEtBQVYsR0FBa0JtSyxTQUFTbkssS0FBM0I7QUFDQWtELFlBQVVqRCxNQUFWLEdBQW1Ca0ssU0FBU2xLLE1BQTVCO0FBQ0FpRCxZQUFVN0QsSUFBVixHQUFpQjhLLFNBQVM5SyxJQUExQjtBQUNBNkQsWUFBVVIsTUFBVixHQUFtQnlILFNBQVN6SCxNQUE1QjtBQUNBUSxZQUFVc0gsS0FBVixHQUFrQkwsU0FBU0ssS0FBM0I7QUFDQXRILFlBQVVuQyxRQUFWLEdBQXFCb0osU0FBU3BKLFFBQTlCO0FBQ0FtQyxZQUFVcEMsS0FBVixHQUFrQnFKLFNBQVNySixLQUEzQjtBQUNBb0MsWUFBVXJDLE9BQVYsR0FBb0JzSixTQUFTdEosT0FBN0I7QUFDQXFDLFlBQVVuQyxRQUFWLEdBQXFCb0osU0FBU3BKLFFBQTlCO0FBQ0EsU0FBT21DLFNBQVA7QUFDRDs7QUFFRHZCLE1BQU04SSxTQUFOLEdBQWtCMUwsVUFBbEI7QUFDQTRDLE1BQU0rSSxpQkFBTixHQUEwQmxKLG1CQUExQjtBQUNBRyxNQUFNZ0osWUFBTixHQUFxQnZKLGFBQXJCIiwiZmlsZSI6Im1hcC5yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJztcbmltcG9ydCBwdXJlUmVuZGVyIGZyb20gJ3B1cmUtcmVuZGVyLWRlY29yYXRvcic7XG5pbXBvcnQgZDMgZnJvbSAnZDMnO1xuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IG1hcGJveGdsLCB7UG9pbnR9IGZyb20gJ21hcGJveC1nbCc7XG5cbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IE1hcEludGVyYWN0aW9ucyBmcm9tICcuL21hcC1pbnRlcmFjdGlvbnMucmVhY3QnO1xuaW1wb3J0IGRpZmZTdHlsZXMgZnJvbSAnLi9kaWZmLXN0eWxlcyc7XG5cbi8vIE5PVEU6IFRyYW5zZm9ybSBpcyBub3QgYSBwdWJsaWMgQVBJIHNvIHdlIHNob3VsZCBiZSBjYXJlZnVsIHRvIGFsd2F5cyBsb2NrXG4vLyBkb3duIG1hcGJveC1nbCB0byBhIHNwZWNpZmljIG1ham9yLCBtaW5vciwgYW5kIHBhdGNoIHZlcnNpb24uXG5pbXBvcnQgVHJhbnNmb3JtIGZyb20gJ21hcGJveC1nbC9qcy9nZW8vdHJhbnNmb3JtJztcblxuLy8gTm90ZTogTWF4IHBpdGNoIGlzIGEgaGFyZCBjb2RlZCB2YWx1ZSAobm90IGEgbmFtZWQgY29uc3RhbnQpIGluIHRyYW5zZm9ybS5qc1xuY29uc3QgTUFYX1BJVENIID0gNjA7XG5jb25zdCBQSVRDSF9NT1VTRV9USFJFU0hPTEQgPSAyMDtcbmNvbnN0IFBJVENIX0FDQ0VMID0gMS4yO1xuXG5jb25zdCBQUk9QX1RZUEVTID0ge1xuICAvKipcbiAgICAqIFRoZSBsYXRpdHVkZSBvZiB0aGUgY2VudGVyIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgbGF0aXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgbG9uZ2l0dWRlIG9mIHRoZSBjZW50ZXIgb2YgdGhlIG1hcC5cbiAgICAqL1xuICBsb25naXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgdGlsZSB6b29tIGxldmVsIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgem9vbTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAvKipcbiAgICAqIFRoZSBNYXBib3ggc3R5bGUgdGhlIGNvbXBvbmVudCBzaG91bGQgdXNlLiBDYW4gZWl0aGVyIGJlIGEgc3RyaW5nIHVybFxuICAgICogb3IgYSBNYXBib3hHTCBzdHlsZSBJbW11dGFibGUuTWFwIG9iamVjdC5cbiAgICAqL1xuICBtYXBTdHlsZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKVxuICBdKSxcbiAgLyoqXG4gICAgKiBUaGUgTWFwYm94IEFQSSBhY2Nlc3MgdG9rZW4gdG8gcHJvdmlkZSB0byBtYXBib3gtZ2wtanMuIFRoaXMgaXMgcmVxdWlyZWRcbiAgICAqIHdoZW4gdXNpbmcgTWFwYm94IHByb3ZpZGVkIHZlY3RvciB0aWxlcyBhbmQgc3R5bGVzLlxuICAgICovXG4gIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvKipcbiAgICAqIGBvbkNoYW5nZVZpZXdwb3J0YCBjYWxsYmFjayBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIGludGVyYWN0ZWQgd2l0aCB0aGVcbiAgICAqIG1hcC4gVGhlIG9iamVjdCBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrIGNvbnRhaW5lcnMgYGxhdGl0dWRlYCxcbiAgICAqIGBsb25naXR1ZGVgIGFuZCBgem9vbWAgaW5mb3JtYXRpb24uXG4gICAgKi9cbiAgb25DaGFuZ2VWaWV3cG9ydDogUHJvcFR5cGVzLmZ1bmMsXG4gIC8qKlxuICAgICogYG9uTWFwTG9hZGVkYCBjYWxsYmFjayBpcyBmaXJlZCBvbiB0aGUgbWFwJ3MgJ2xvYWQnIGV2ZW50XG4gICAgKi9cbiAgb25NYXBMb2FkZWQ6IFByb3BUeXBlcy5mdW5jLFxuICAvKipcbiAgICAqIFRoZSB3aWR0aCBvZiB0aGUgbWFwLiBOdW1iZXIgaW4gcGl4ZWxzIG9yIENTUyBzdHJpbmcgcHJvcCBlLmcuICcxMDAlJ1xuICAgICovXG4gIHdpZHRoOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMubnVtYmVyLFxuICAgIFByb3BUeXBlcy5zdHJpbmdcbiAgXSksXG4gIC8qKlxuICAgICogVGhlIGhlaWdodCBvZiB0aGUgbWFwLiBOdW1iZXIgaW4gcGl4ZWxzIG9yIENTUyBzdHJpbmcgcHJvcCBlLmcuICcxMDAlJ1xuICAgICovXG4gIGhlaWdodDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLm51bWJlcixcbiAgICBQcm9wVHlwZXMuc3RyaW5nXG4gIF0pLFxuICAvKipcbiAgICAqIElzIHRoZSBjb21wb25lbnQgY3VycmVudGx5IGJlaW5nIGRyYWdnZWQuIFRoaXMgaXMgdXNlZCB0byBzaG93L2hpZGUgdGhlXG4gICAgKiBkcmFnIGN1cnNvci4gQWxzbyB1c2VkIGFzIGFuIG9wdGltaXphdGlvbiBpbiBzb21lIG92ZXJsYXlzIGJ5IHByZXZlbnRpbmdcbiAgICAqIHJlbmRlcmluZyB3aGlsZSBkcmFnZ2luZy5cbiAgICAqL1xuICBpc0RyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgLyoqXG4gICAgKiBSZXF1aXJlZCB0byBjYWxjdWxhdGUgdGhlIG1vdXNlIHByb2plY3Rpb24gYWZ0ZXIgdGhlIGZpcnN0IGNsaWNrIGV2ZW50XG4gICAgKiBkdXJpbmcgZHJhZ2dpbmcuIFdoZXJlIHRoZSBtYXAgaXMgZGVwZW5kcyBvbiB3aGVyZSB5b3UgZmlyc3QgY2xpY2tlZCBvblxuICAgICogdGhlIG1hcC5cbiAgICAqL1xuICBzdGFydERyYWdMbmdMYXQ6IFByb3BUeXBlcy5hcnJheSxcbiAgLyoqXG4gICAgKiBDYWxsZWQgd2hlbiBhIGZlYXR1cmUgaXMgaG92ZXJlZCBvdmVyLiBGZWF0dXJlcyBtdXN0IHNldCB0aGVcbiAgICAqIGBpbnRlcmFjdGl2ZWAgcHJvcGVydHkgdG8gYHRydWVgIGZvciB0aGlzIHRvIHdvcmsgcHJvcGVybHkuIHNlZSB0aGVcbiAgICAqIE1hcGJveCBleGFtcGxlOiBodHRwczovL3d3dy5tYXBib3guY29tL21hcGJveC1nbC1qcy9leGFtcGxlL2ZlYXR1cmVzYXQvXG4gICAgKiBUaGUgZmlyc3QgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrIHdpbGwgYmUgdGhlIGFycmF5IG9mIGZlYXR1cmUgdGhlXG4gICAgKiBtb3VzZSBpcyBvdmVyLiBUaGlzIGlzIHRoZSBzYW1lIHJlc3BvbnNlIHJldHVybmVkIGZyb20gYGZlYXR1cmVzQXRgLlxuICAgICovXG4gIG9uSG92ZXJGZWF0dXJlczogUHJvcFR5cGVzLmZ1bmMsXG4gIC8qKlxuICAgICogRGVmYXVsdHMgdG8gVFJVRVxuICAgICogU2V0IHRvIGZhbHNlIHRvIGVuYWJsZSBvbkhvdmVyRmVhdHVyZXMgdG8gYmUgY2FsbGVkIHJlZ2FyZGxlc3MgaWZcbiAgICAqIHRoZXJlIGlzIGFuIGFjdHVhbCBmZWF0dXJlIGF0IHgsIHkuIFRoaXMgaXMgdXNlZnVsIHRvIGVtdWxhdGVcbiAgICAqIFwibW91c2Utb3V0XCIgYmVoYXZpb3JzIG9uIGZlYXR1cmVzLlxuICAgICovXG4gIGlnbm9yZUVtcHR5RmVhdHVyZXM6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogU2hvdyBhdHRyaWJ1dGlvbiBjb250cm9sIG9yIG5vdC5cbiAgICAqL1xuICBhdHRyaWJ1dGlvbkNvbnRyb2w6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogQ2FsbGVkIHdoZW4gYSBmZWF0dXJlIGlzIGNsaWNrZWQgb24uIEZlYXR1cmVzIG11c3Qgc2V0IHRoZVxuICAgICogYGludGVyYWN0aXZlYCBwcm9wZXJ0eSB0byBgdHJ1ZWAgZm9yIHRoaXMgdG8gd29yayBwcm9wZXJseS4gc2VlIHRoZVxuICAgICogTWFwYm94IGV4YW1wbGU6IGh0dHBzOi8vd3d3Lm1hcGJveC5jb20vbWFwYm94LWdsLWpzL2V4YW1wbGUvZmVhdHVyZXNhdC9cbiAgICAqIFRoZSBmaXJzdCBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2sgd2lsbCBiZSB0aGUgYXJyYXkgb2YgZmVhdHVyZSB0aGVcbiAgICAqIG1vdXNlIGlzIG92ZXIuIFRoaXMgaXMgdGhlIHNhbWUgcmVzcG9uc2UgcmV0dXJuZWQgZnJvbSBgZmVhdHVyZXNBdGAuXG4gICAgKi9cbiAgb25DbGlja0ZlYXR1cmVzOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICAqIFBhc3NlZCB0byBNYXBib3ggTWFwIGNvbnN0cnVjdG9yIHdoaWNoIHBhc3NlcyBpdCB0byB0aGUgY2FudmFzIGNvbnRleHQuXG4gICAgKiBUaGlzIGlzIHVuc2VmdWwgd2hlbiB5b3Ugd2FudCB0byBleHBvcnQgdGhlIGNhbnZhcyBhcyBhIFBORy5cbiAgICAqL1xuICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogVGhlcmUgYXJlIHN0aWxsIGtub3duIGlzc3VlcyB3aXRoIHN0eWxlIGRpZmZpbmcuIEFzIGEgdGVtcG9yYXJ5IHN0b3BnYXAsXG4gICAgKiBhZGQgdGhlIG9wdGlvbiB0byBwcmV2ZW50IHN0eWxlIGRpZmZpbmcuXG4gICAgKi9cbiAgcHJldmVudFN0eWxlRGlmZmluZzogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBFbmFibGVzIHBlcnNwZWN0aXZlIGNvbnRyb2wgZXZlbnQgaGFuZGxpbmcgKENvbW1hbmQtcm90YXRlKVxuICAgICovXG4gIHBlcnNwZWN0aXZlRW5hYmxlZDogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBTcGVjaWZ5IHRoZSBiZWFyaW5nIG9mIHRoZSB2aWV3cG9ydFxuICAgICovXG4gIGJlYXJpbmc6IFByb3BUeXBlcy5udW1iZXIsXG5cbiAgLyoqXG4gICAgKiBTcGVjaWZ5IHRoZSBwaXRjaCBvZiB0aGUgdmlld3BvcnRcbiAgICAqL1xuICBwaXRjaDogUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICAqIFNwZWNpZnkgdGhlIGFsdGl0dWRlIG9mIHRoZSB2aWV3cG9ydCBjYW1lcmFcbiAgICAqIFVuaXQ6IG1hcCBoZWlnaHRzLCBkZWZhdWx0IDEuNVxuICAgICogTm9uLXB1YmxpYyBBUEksIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC1nbC1qcy9pc3N1ZXMvMTEzN1xuICAgICovXG4gIGFsdGl0dWRlOiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgICogRGlzYWJsZWQgZHJhZ2dpbmcgb2YgdGhlIG1hcFxuICAgICovXG4gIGRyYWdEaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBEaXNhYmxlZCB6b29taW5nIG9mIHRoZSBtYXBcbiAgICAqL1xuICB6b29tRGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgICogQm91bmRzIHRvIGZpdCBvbiBzY3JlZW5cbiAgICAqL1xuICBib3VuZHM6IFByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KVxufTtcblxuY29uc3QgREVGQVVMVF9QUk9QUyA9IHtcbiAgbWFwU3R5bGU6ICdtYXBib3g6Ly9zdHlsZXMvbWFwYm94L2xpZ2h0LXY4JyxcbiAgb25DaGFuZ2VWaWV3cG9ydDogbnVsbCxcbiAgbWFwYm94QXBpQWNjZXNzVG9rZW46IGNvbmZpZy5ERUZBVUxUUy5NQVBCT1hfQVBJX0FDQ0VTU19UT0tFTixcbiAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiBmYWxzZSxcbiAgYXR0cmlidXRpb25Db250cm9sOiB0cnVlLFxuICBpZ25vcmVFbXB0eUZlYXR1cmVzOiB0cnVlLFxuICBiZWFyaW5nOiAwLFxuICBwaXRjaDogMCxcbiAgYWx0aXR1ZGU6IDEuNVxufTtcblxuY29uc3QgQ0hJTERfQ09OVEVYVF9UWVBFUyA9IHtcbiAgbWFwOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5AcHVyZVJlbmRlclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwR0wgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc0RyYWdnaW5nOiBmYWxzZSxcbiAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogbnVsbCxcbiAgICAgIHN0YXJ0QmVhcmluZzogbnVsbCxcbiAgICAgIHN0YXJ0UGl0Y2g6IG51bGxcbiAgICB9O1xuICAgIG1hcGJveGdsLmFjY2Vzc1Rva2VuID0gcHJvcHMubWFwYm94QXBpQWNjZXNzVG9rZW47XG5cbiAgICB0aGlzLl9tYXBSZWFkeSA9IGZhbHNlO1xuXG4gICAgdGhpcy5nZXRDaGlsZENvbnRleHQgPSAoKSA9PiAoe1xuICAgICAgbWFwOiB0aGlzLl9tYXBcbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IG1hcFN0eWxlID0gdGhpcy5wcm9wcy5tYXBTdHlsZSBpbnN0YW5jZW9mIEltbXV0YWJsZS5NYXAgP1xuICAgICAgdGhpcy5wcm9wcy5tYXBTdHlsZS50b0pTKCkgOlxuICAgICAgdGhpcy5wcm9wcy5tYXBTdHlsZTtcbiAgICBjb25zdCBtYXAgPSBuZXcgbWFwYm94Z2wuTWFwKHtcbiAgICAgIGNvbnRhaW5lcjogdGhpcy5yZWZzLm1hcGJveE1hcCxcbiAgICAgIGNlbnRlcjogW3RoaXMucHJvcHMubG9uZ2l0dWRlLCB0aGlzLnByb3BzLmxhdGl0dWRlXSxcbiAgICAgIHpvb206IHRoaXMucHJvcHMuem9vbSxcbiAgICAgIHBpdGNoOiB0aGlzLnByb3BzLnBpdGNoLFxuICAgICAgYmVhcmluZzogdGhpcy5wcm9wcy5iZWFyaW5nLFxuICAgICAgc3R5bGU6IG1hcFN0eWxlLFxuICAgICAgaW50ZXJhY3RpdmU6IGZhbHNlLFxuICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0aGlzLnByb3BzLnByZXNlcnZlRHJhd2luZ0J1ZmZlclxuICAgICAgLy8gVE9ETz9cbiAgICAgIC8vIGF0dHJpYnV0aW9uQ29udHJvbDogdGhpcy5wcm9wcy5hdHRyaWJ1dGlvbkNvbnRyb2xcbiAgICB9KTtcblxuICAgIGQzLnNlbGVjdChtYXAuZ2V0Q2FudmFzKCkpLnN0eWxlKCdvdXRsaW5lJywgJ25vbmUnKTtcblxuICAgIHRoaXMuX21hcCA9IG1hcDtcbiAgICB0aGlzLl91cGRhdGVNYXBWaWV3cG9ydCh7fSwgdGhpcy5wcm9wcyk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vbk1hcExvYWRlZCkge1xuICAgICAgbWFwLm9uKCdsb2FkJywgKCkgPT4gdGhpcy5wcm9wcy5vbk1hcExvYWRlZChtYXApKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0IGZvciBleHRlcm5hbCBtYW5pcHVsYXRpb24gb2YgdW5kZXJseWluZyBtYXBcbiAgICAvLyBUT0RPIGEgYmV0dGVyIGFwcHJvYWNoXG4gICAgbWFwLm9uKCdzdHlsZS5sb2FkJywgKCkgPT4gdGhpcy5fbWFwUmVhZHkgPSB0cnVlKTtcbiAgICBtYXAub24oJ21vdmVlbmQnLCAoKSA9PiB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtKSk7XG4gICAgbWFwLm9uKCd6b29tZW5kJywgKCkgPT4gdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSkpO1xuICB9XG5cbiAgLy8gTmV3IHByb3BzIGFyZSBjb21pbicgcm91bmQgdGhlIGNvcm5lciFcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXdQcm9wcykge1xuICAgIHRoaXMuX3VwZGF0ZVN0YXRlRnJvbVByb3BzKHRoaXMucHJvcHMsIG5ld1Byb3BzKTtcbiAgICB0aGlzLl91cGRhdGVNYXBWaWV3cG9ydCh0aGlzLnByb3BzLCBuZXdQcm9wcyk7XG4gICAgdGhpcy5fdXBkYXRlTWFwU3R5bGUodGhpcy5wcm9wcywgbmV3UHJvcHMpO1xuICAgIC8vIFNhdmUgd2lkdGgvaGVpZ2h0IHNvIHRoYXQgd2UgY2FuIGNoZWNrIHRoZW0gaW4gY29tcG9uZW50RGlkVXBkYXRlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHRcbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAvLyBtYXAucmVzaXplKCkgcmVhZHMgc2l6ZSBmcm9tIERPTSwgd2UgbmVlZCB0byBjYWxsIGFmdGVyIHJlbmRlclxuICAgIHRoaXMuX3VwZGF0ZU1hcFNpemUodGhpcy5zdGF0ZSwgdGhpcy5wcm9wcyk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5fbWFwKSB7XG4gICAgICB0aGlzLl9tYXAucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgX2N1cnNvcigpIHtcbiAgICBjb25zdCBpc0ludGVyYWN0aXZlID1cbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCB8fFxuICAgICAgdGhpcy5wcm9wcy5vbkNsaWNrRmVhdHVyZSB8fFxuICAgICAgdGhpcy5wcm9wcy5vbkhvdmVyRmVhdHVyZXM7XG4gICAgaWYgKGlzSW50ZXJhY3RpdmUpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmlzRHJhZ2dpbmcgP1xuICAgICAgICBjb25maWcuQ1VSU09SLkdSQUJCSU5HIDogY29uZmlnLkNVUlNPUi5HUkFCO1xuICAgIH1cbiAgICByZXR1cm4gJ2luaGVyaXQnO1xuICB9XG5cbiAgX2dldE1hcCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwO1xuICB9XG5cbiAgX3VwZGF0ZVN0YXRlRnJvbVByb3BzKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIG1hcGJveGdsLmFjY2Vzc1Rva2VuID0gbmV3UHJvcHMubWFwYm94QXBpQWNjZXNzVG9rZW47XG4gICAgY29uc3Qge3N0YXJ0RHJhZ0xuZ0xhdH0gPSBuZXdQcm9wcztcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogc3RhcnREcmFnTG5nTGF0ICYmIHN0YXJ0RHJhZ0xuZ0xhdC5zbGljZSgpXG4gICAgfSk7XG4gIH1cblxuICAvLyBJbmRpdmlkdWFsbHkgdXBkYXRlIHRoZSBtYXBzIHNvdXJjZSBhbmQgbGF5ZXJzIHRoYXQgaGF2ZSBjaGFuZ2VkIGlmIGFsbFxuICAvLyBvdGhlciBzdHlsZSBwcm9wcyBoYXZlbid0IGNoYW5nZWQuIFRoaXMgcHJldmVudHMgZmxpY2tpbmcgb2YgdGhlIG1hcCB3aGVuXG4gIC8vIHN0eWxlcyBvbmx5IGNoYW5nZSBzb3VyY2VzIG9yIGxheWVycy5cbiAgX3NldERpZmZTdHlsZShwcmV2U3R5bGUsIG5leHRTdHlsZSkge1xuICAgIGNvbnN0IHByZXZLZXlzTWFwID0gcHJldlN0eWxlICYmIHN0eWxlS2V5c01hcChwcmV2U3R5bGUpIHx8IHt9O1xuICAgIGNvbnN0IG5leHRLZXlzTWFwID0gc3R5bGVLZXlzTWFwKG5leHRTdHlsZSk7XG4gICAgZnVuY3Rpb24gc3R5bGVLZXlzTWFwKHN0eWxlKSB7XG4gICAgICByZXR1cm4gc3R5bGUubWFwKCgpID0+IHRydWUpLmRlbGV0ZSgnbGF5ZXJzJykuZGVsZXRlKCdzb3VyY2VzJykudG9KUygpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwcm9wc090aGVyVGhhbkxheWVyc09yU291cmNlc0RpZmZlcigpIHtcbiAgICAgIGNvbnN0IHByZXZLZXlzTGlzdCA9IE9iamVjdC5rZXlzKHByZXZLZXlzTWFwKTtcbiAgICAgIGNvbnN0IG5leHRLZXlzTGlzdCA9IE9iamVjdC5rZXlzKG5leHRLZXlzTWFwKTtcbiAgICAgIGlmIChwcmV2S2V5c0xpc3QubGVuZ3RoICE9PSBuZXh0S2V5c0xpc3QubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgLy8gYG5leHRTdHlsZWAgYW5kIGBwcmV2U3R5bGVgIHNob3VsZCBub3QgaGF2ZSB0aGUgc2FtZSBzZXQgb2YgcHJvcHMuXG4gICAgICBpZiAobmV4dEtleXNMaXN0LnNvbWUoXG4gICAgICAgIGtleSA9PiBwcmV2U3R5bGUuZ2V0KGtleSkgIT09IG5leHRTdHlsZS5nZXQoa2V5KVxuICAgICAgICAvLyBCdXQgdGhlIHZhbHVlIG9mIG9uZSBvZiB0aG9zZSBwcm9wcyBpcyBkaWZmZXJlbnQuXG4gICAgICApKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuXG4gICAgaWYgKCFwcmV2U3R5bGUgfHwgcHJvcHNPdGhlclRoYW5MYXllcnNPclNvdXJjZXNEaWZmZXIoKSkge1xuICAgICAgbWFwLnNldFN0eWxlKG5leHRTdHlsZS50b0pTKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtzb3VyY2VzRGlmZiwgbGF5ZXJzRGlmZn0gPSBkaWZmU3R5bGVzKHByZXZTdHlsZSwgbmV4dFN0eWxlKTtcblxuICAgIC8vIFRPRE86IEl0J3MgcmF0aGVyIGRpZmZpY3VsdCB0byBkZXRlcm1pbmUgc3R5bGUgZGlmZmluZyBpbiB0aGUgcHJlc2VuY2VcbiAgICAvLyBvZiByZWZzLiBGb3Igbm93LCBpZiBhbnkgc3R5bGUgdXBkYXRlIGhhcyBhIHJlZiwgZmFsbGJhY2sgdG8gbm8gZGlmZmluZy5cbiAgICAvLyBXZSBjYW4gY29tZSBiYWNrIHRvIHRoaXMgY2FzZSBpZiB0aGVyZSdzIGEgc29saWQgdXNlY2FzZS5cbiAgICBpZiAobGF5ZXJzRGlmZi51cGRhdGVzLnNvbWUobm9kZSA9PiBub2RlLmxheWVyLmdldCgncmVmJykpKSB7XG4gICAgICBtYXAuc2V0U3R5bGUobmV4dFN0eWxlLnRvSlMoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBlbnRlciBvZiBzb3VyY2VzRGlmZi5lbnRlcikge1xuICAgICAgbWFwLmFkZFNvdXJjZShlbnRlci5pZCwgZW50ZXIuc291cmNlLnRvSlMoKSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgdXBkYXRlIG9mIHNvdXJjZXNEaWZmLnVwZGF0ZSkge1xuICAgICAgbWFwLnJlbW92ZVNvdXJjZSh1cGRhdGUuaWQpO1xuICAgICAgbWFwLmFkZFNvdXJjZSh1cGRhdGUuaWQsIHVwZGF0ZS5zb3VyY2UudG9KUygpKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBleGl0IG9mIHNvdXJjZXNEaWZmLmV4aXQpIHtcbiAgICAgIG1hcC5yZW1vdmVTb3VyY2UoZXhpdC5pZCk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZXhpdCBvZiBsYXllcnNEaWZmLmV4aXRpbmcpIHtcbiAgICAgIGlmIChtYXAuc3R5bGUuZ2V0TGF5ZXIoZXhpdC5pZCkpIHtcbiAgICAgICAgbWFwLnJlbW92ZUxheWVyKGV4aXQuaWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IHVwZGF0ZSBvZiBsYXllcnNEaWZmLnVwZGF0ZXMpIHtcbiAgICAgIGlmICghdXBkYXRlLmVudGVyKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgYW4gb2xkIGxheWVyIHRoYXQgbmVlZHMgdG8gYmUgdXBkYXRlZC4gUmVtb3ZlIHRoZSBvbGQgbGF5ZXJcbiAgICAgICAgLy8gd2l0aCB0aGUgc2FtZSBpZCBhbmQgYWRkIGl0IGJhY2sgYWdhaW4uXG4gICAgICAgIG1hcC5yZW1vdmVMYXllcih1cGRhdGUuaWQpO1xuICAgICAgfVxuICAgICAgbWFwLmFkZExheWVyKHVwZGF0ZS5sYXllci50b0pTKCksIHVwZGF0ZS5iZWZvcmUpO1xuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVNYXBTdHlsZShvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBjb25zdCBtYXBTdHlsZSA9IG5ld1Byb3BzLm1hcFN0eWxlO1xuICAgIGNvbnN0IG9sZE1hcFN0eWxlID0gb2xkUHJvcHMubWFwU3R5bGU7XG4gICAgaWYgKG1hcFN0eWxlICE9PSBvbGRNYXBTdHlsZSkge1xuICAgICAgaWYgKG1hcFN0eWxlIGluc3RhbmNlb2YgSW1tdXRhYmxlLk1hcCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5wcmV2ZW50U3R5bGVEaWZmaW5nKSB7XG4gICAgICAgICAgdGhpcy5fZ2V0TWFwKCkuc2V0U3R5bGUobWFwU3R5bGUudG9KUygpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9zZXREaWZmU3R5bGUob2xkTWFwU3R5bGUsIG1hcFN0eWxlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZ2V0TWFwKCkuc2V0U3R5bGUobWFwU3R5bGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVNYXBWaWV3cG9ydChvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBjb25zdCB2aWV3cG9ydENoYW5nZWQgPVxuICAgICAgbmV3UHJvcHMubGF0aXR1ZGUgIT09IG9sZFByb3BzLmxhdGl0dWRlIHx8XG4gICAgICBuZXdQcm9wcy5sb25naXR1ZGUgIT09IG9sZFByb3BzLmxvbmdpdHVkZSB8fFxuICAgICAgbmV3UHJvcHMuem9vbSAhPT0gb2xkUHJvcHMuem9vbSB8fFxuICAgICAgbmV3UHJvcHMucGl0Y2ggIT09IG9sZFByb3BzLnBpdGNoIHx8XG4gICAgICBuZXdQcm9wcy5iZWFyaW5nICE9PSBvbGRQcm9wcy5iZWFyaW5nIHx8XG4gICAgICBuZXdQcm9wcy5hbHRpdHVkZSAhPT0gb2xkUHJvcHMuYWx0aXR1ZGU7XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcblxuICAgIGlmICh2aWV3cG9ydENoYW5nZWQpIHtcbiAgICAgIG1hcC5qdW1wVG8oe1xuICAgICAgICBjZW50ZXI6IFtuZXdQcm9wcy5sb25naXR1ZGUsIG5ld1Byb3BzLmxhdGl0dWRlXSxcbiAgICAgICAgem9vbTogbmV3UHJvcHMuem9vbSxcbiAgICAgICAgYmVhcmluZzogbmV3UHJvcHMuYmVhcmluZyxcbiAgICAgICAgcGl0Y2g6IG5ld1Byb3BzLnBpdGNoXG4gICAgICB9KTtcblxuICAgICAgLy8gVE9ETyAtIGp1bXBUbyBkb2Vzbid0IGhhbmRsZSBhbHRpdHVkZVxuICAgICAgaWYgKG5ld1Byb3BzLmFsdGl0dWRlICE9PSBvbGRQcm9wcy5hbHRpdHVkZSkge1xuICAgICAgICBtYXAudHJhbnNmb3JtLmFsdGl0dWRlID0gbmV3UHJvcHMuYWx0aXR1ZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9sZFByb3BzLmJvdW5kcyAhPT0gbmV3UHJvcHMuYm91bmRzICYmIG5ld1Byb3BzLmJvdW5kcykge1xuICAgICAgbWFwLmZpdEJvdW5kcyhuZXdQcm9wcy5ib3VuZHMudG9KUygpKTtcbiAgICB9XG4gIH1cblxuICAvLyBOb3RlOiBuZWVkcyB0byBiZSBjYWxsZWQgYWZ0ZXIgcmVuZGVyIChlLmcuIGluIGNvbXBvbmVudERpZFVwZGF0ZSlcbiAgX3VwZGF0ZU1hcFNpemUob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgY29uc3Qgc2l6ZUNoYW5nZWQgPVxuICAgICAgb2xkUHJvcHMud2lkdGggIT09IG5ld1Byb3BzLndpZHRoIHx8IG9sZFByb3BzLmhlaWdodCAhPT0gbmV3UHJvcHMuaGVpZ2h0O1xuXG4gICAgaWYgKHNpemVDaGFuZ2VkKSB7XG4gICAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICAgIG1hcC5yZXNpemUoKTtcbiAgICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0pO1xuICAgIH1cbiAgfVxuXG4gIF9jYWxjdWxhdGVOZXdQaXRjaEFuZEJlYXJpbmcoe3Bvcywgc3RhcnRQb3MsIHN0YXJ0QmVhcmluZywgc3RhcnRQaXRjaH0pIHtcbiAgICBjb25zdCB4RGVsdGEgPSBwb3MueCAtIHN0YXJ0UG9zLng7XG4gICAgY29uc3QgYmVhcmluZyA9IHN0YXJ0QmVhcmluZyArIDE4MCAqIHhEZWx0YSAvIHRoaXMucHJvcHMud2lkdGg7XG5cbiAgICBsZXQgcGl0Y2ggPSBzdGFydFBpdGNoO1xuICAgIGNvbnN0IHlEZWx0YSA9IHBvcy55IC0gc3RhcnRQb3MueTtcbiAgICBpZiAoeURlbHRhID4gMCkge1xuICAgICAgLy8gRHJhZ2dpbmcgZG93bndhcmRzLCBncmFkdWFsbHkgZGVjcmVhc2UgcGl0Y2hcbiAgICAgIGlmIChNYXRoLmFicyh0aGlzLnByb3BzLmhlaWdodCAtIHN0YXJ0UG9zLnkpID4gUElUQ0hfTU9VU0VfVEhSRVNIT0xEKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlID0geURlbHRhIC8gKHRoaXMucHJvcHMuaGVpZ2h0IC0gc3RhcnRQb3MueSk7XG4gICAgICAgIHBpdGNoID0gKDEgLSBzY2FsZSkgKiBQSVRDSF9BQ0NFTCAqIHN0YXJ0UGl0Y2g7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh5RGVsdGEgPCAwKSB7XG4gICAgICAvLyBEcmFnZ2luZyB1cHdhcmRzLCBncmFkdWFsbHkgaW5jcmVhc2UgcGl0Y2hcbiAgICAgIGlmIChzdGFydFBvcy55ID4gUElUQ0hfTU9VU0VfVEhSRVNIT0xEKSB7XG4gICAgICAgIC8vIE1vdmUgZnJvbSAwIHRvIDEgYXMgd2UgZHJhZyB1cHdhcmRzXG4gICAgICAgIGNvbnN0IHlTY2FsZSA9IDEgLSBwb3MueSAvIHN0YXJ0UG9zLnk7XG4gICAgICAgIC8vIEdyYWR1YWxseSBhZGQgdW50aWwgd2UgaGl0IG1heCBwaXRjaFxuICAgICAgICBwaXRjaCA9IHN0YXJ0UGl0Y2ggKyB5U2NhbGUgKiAoTUFYX1BJVENIIC0gc3RhcnRQaXRjaCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5kZWJ1ZyhzdGFydFBpdGNoLCBwaXRjaCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBpdGNoOiBNYXRoLm1heChNYXRoLm1pbihwaXRjaCwgTUFYX1BJVENIKSwgMCksXG4gICAgICBiZWFyaW5nXG4gICAgfTtcbiAgfVxuXG4gICAvLyBIZWxwZXIgdG8gY2FsbCBwcm9wcy5vbkNoYW5nZVZpZXdwb3J0XG4gIF9jYWxsT25DaGFuZ2VWaWV3cG9ydCh0cmFuc2Zvcm0sIG9wdHMgPSB7fSkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQpIHtcbiAgICAgIGNvbnN0IHtzY3JvbGxIZWlnaHQ6IGhlaWdodCwgc2Nyb2xsV2lkdGg6IHdpZHRofSA9IHRoaXMuX2dldE1hcCgpLmdldENvbnRhaW5lcigpO1xuXG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQoe1xuICAgICAgICBsYXRpdHVkZTogdHJhbnNmb3JtLmNlbnRlci5sYXQsXG4gICAgICAgIGxvbmdpdHVkZTogbW9kKHRyYW5zZm9ybS5jZW50ZXIubG5nICsgMTgwLCAzNjApIC0gMTgwLFxuICAgICAgICB6b29tOiB0cmFuc2Zvcm0uem9vbSxcbiAgICAgICAgcGl0Y2g6IHRyYW5zZm9ybS5waXRjaCxcbiAgICAgICAgYmVhcmluZzogbW9kKHRyYW5zZm9ybS5iZWFyaW5nICsgMTgwLCAzNjApIC0gMTgwLFxuXG4gICAgICAgIGlzRHJhZ2dpbmc6IHRoaXMucHJvcHMuaXNEcmFnZ2luZyxcbiAgICAgICAgc3RhcnREcmFnTG5nTGF0OiB0aGlzLnByb3BzLnN0YXJ0RHJhZ0xuZ0xhdCxcbiAgICAgICAgc3RhcnRCZWFyaW5nOiB0aGlzLnByb3BzLnN0YXJ0QmVhcmluZyxcbiAgICAgICAgc3RhcnRQaXRjaDogdGhpcy5wcm9wcy5zdGFydFBpdGNoLFxuXG4gICAgICAgIHByb2plY3Rpb25NYXRyaXg6IHRyYW5zZm9ybS5wcm9qTWF0cml4LFxuXG4gICAgICAgIGhlaWdodCxcbiAgICAgICAgd2lkdGgsXG5cbiAgICAgICAgLi4ub3B0c1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlRG93bih7cG9zfSkge1xuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIGNvbnN0IGxuZ0xhdCA9IHVucHJvamVjdEZyb21UcmFuc2Zvcm0obWFwLnRyYW5zZm9ybSwgcG9zKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiB0cnVlLFxuICAgICAgc3RhcnREcmFnTG5nTGF0OiBbbG5nTGF0LmxuZywgbG5nTGF0LmxhdF0sXG4gICAgICBzdGFydEJlYXJpbmc6IG1hcC50cmFuc2Zvcm0uYmVhcmluZyxcbiAgICAgIHN0YXJ0UGl0Y2g6IG1hcC50cmFuc2Zvcm0ucGl0Y2hcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZURyYWcoe3Bvc30pIHtcbiAgICBpZiAoIXRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCB8fCB0aGlzLnByb3BzLmRyYWdEaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHRha2UgdGhlIHN0YXJ0IGxuZ2xhdCBhbmQgcHV0IGl0IHdoZXJlIHRoZSBtb3VzZSBpcyBkb3duLlxuICAgIGFzc2VydCh0aGlzLnByb3BzLnN0YXJ0RHJhZ0xuZ0xhdCwgJ2BzdGFydERyYWdMbmdMYXRgIHByb3AgaXMgcmVxdWlyZWQgJyArXG4gICAgICAnZm9yIG1vdXNlIGRyYWcgYmVoYXZpb3IgdG8gY2FsY3VsYXRlIHdoZXJlIHRvIHBvc2l0aW9uIHRoZSBtYXAuJyk7XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBjbG9uZVRyYW5zZm9ybShtYXAudHJhbnNmb3JtKTtcbiAgICB0cmFuc2Zvcm0uc2V0TG9jYXRpb25BdFBvaW50KHRoaXMucHJvcHMuc3RhcnREcmFnTG5nTGF0LCBwb3MpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KHRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlUm90YXRlKHtwb3MsIHN0YXJ0UG9zfSkge1xuICAgIGlmICghdGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0IHx8ICF0aGlzLnByb3BzLnBlcnNwZWN0aXZlRW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtzdGFydEJlYXJpbmcsIHN0YXJ0UGl0Y2h9ID0gdGhpcy5wcm9wcztcbiAgICBhc3NlcnQodHlwZW9mIHN0YXJ0QmVhcmluZyA9PT0gJ251bWJlcicsXG4gICAgICAnYHN0YXJ0QmVhcmluZ2AgcHJvcCBpcyByZXF1aXJlZCBmb3IgbW91c2Ugcm90YXRlIGJlaGF2aW9yJyk7XG4gICAgYXNzZXJ0KHR5cGVvZiBzdGFydFBpdGNoID09PSAnbnVtYmVyJyxcbiAgICAgICdgc3RhcnRQaXRjaGAgcHJvcCBpcyByZXF1aXJlZCBmb3IgbW91c2Ugcm90YXRlIGJlaGF2aW9yJyk7XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcblxuICAgIGNvbnN0IHtwaXRjaCwgYmVhcmluZ30gPSB0aGlzLl9jYWxjdWxhdGVOZXdQaXRjaEFuZEJlYXJpbmcoe1xuICAgICAgcG9zLFxuICAgICAgc3RhcnRQb3MsXG4gICAgICBzdGFydEJlYXJpbmcsXG4gICAgICBzdGFydFBpdGNoXG4gICAgfSk7XG5cbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBjbG9uZVRyYW5zZm9ybShtYXAudHJhbnNmb3JtKTtcbiAgICB0cmFuc2Zvcm0uYmVhcmluZyA9IGJlYXJpbmc7XG4gICAgdHJhbnNmb3JtLnBpdGNoID0gcGl0Y2g7XG5cbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydCh0cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZU1vdmUob3B0KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm9uSG92ZXJGZWF0dXJlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIGNvbnN0IHBvcyA9IG9wdC5wb3M7XG5cbiAgICBjb25zdCBmZWF0dXJlcyA9IG1hcC5xdWVyeVJlbmRlcmVkRmVhdHVyZXMoW3Bvcy54LCBwb3MueV0pO1xuICAgIGlmICghZmVhdHVyZXMubGVuZ3RoICYmIHRoaXMucHJvcHMuaWdub3JlRW1wdHlGZWF0dXJlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLm9uSG92ZXJGZWF0dXJlcyhmZWF0dXJlcyk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VVcChvcHQpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMub25DbGlja0ZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBzdGFydERyYWdMbmdMYXQ6IG51bGwsXG4gICAgICBzdGFydEJlYXJpbmc6IG51bGwsXG4gICAgICBzdGFydFBpdGNoOiBudWxsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwb3MgPSBvcHQucG9zO1xuXG4gICAgLy8gUmFkaXVzIGVuYWJsZXMgcG9pbnQgZmVhdHVyZXMsIGxpa2UgbWFya2VyIHN5bWJvbHMsIHRvIGJlIGNsaWNrZWQuXG4gICAgY29uc3Qgc2l6ZSA9IDE1O1xuICAgIGNvbnN0IGJib3ggPSBbW3Bvcy54IC0gc2l6ZSwgcG9zLnkgLSBzaXplXSwgW3Bvcy54ICsgc2l6ZSwgcG9zLnkgKyBzaXplXV07XG4gICAgY29uc3QgZmVhdHVyZXMgPSBtYXAucXVlcnlSZW5kZXJlZEZlYXR1cmVzKGJib3gpO1xuICAgIGlmICghZmVhdHVyZXMubGVuZ3RoICYmIHRoaXMucHJvcHMuaWdub3JlRW1wdHlGZWF0dXJlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLm9uQ2xpY2tGZWF0dXJlcyhmZWF0dXJlcyk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uWm9vbSh7cG9zLCBzY2FsZX0pIHtcbiAgICBpZiAodGhpcy5wcm9wcy56b29tRGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBjbG9uZVRyYW5zZm9ybShtYXAudHJhbnNmb3JtKTtcbiAgICBjb25zdCBhcm91bmQgPSB1bnByb2plY3RGcm9tVHJhbnNmb3JtKHRyYW5zZm9ybSwgcG9zKTtcbiAgICB0cmFuc2Zvcm0uem9vbSA9IHRyYW5zZm9ybS5zY2FsZVpvb20obWFwLnRyYW5zZm9ybS5zY2FsZSAqIHNjYWxlKTtcbiAgICB0cmFuc2Zvcm0uc2V0TG9jYXRpb25BdFBvaW50KGFyb3VuZCwgcG9zKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydCh0cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25ab29tRW5kKCkge1xuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2NsYXNzTmFtZSwgd2lkdGgsIGhlaWdodCwgc3R5bGV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBtYXBTdHlsZSA9IHtcbiAgICAgIC4uLnN0eWxlLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBjdXJzb3I6IHRoaXMuX2N1cnNvcigpXG4gICAgfTtcblxuICAgIGxldCBjb250ZW50ID0gW1xuICAgICAgPGRpdiBrZXk9XCJtYXBcIiByZWY9XCJtYXBib3hNYXBcIlxuICAgICAgICBzdHlsZT17IG1hcFN0eWxlIH0gY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0vPixcbiAgICAgIDxkaXYga2V5PVwib3ZlcmxheXNcIiBjbGFzc05hbWU9XCJvdmVybGF5c1wiXG4gICAgICAgIHN0eWxlPXsge3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiAwLCB0b3A6IDB9IH0+XG4gICAgICAgIHsgdGhpcy5wcm9wcy5jaGlsZHJlbiB9XG4gICAgICA8L2Rpdj5cbiAgICBdO1xuXG4gICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCkge1xuICAgICAgY29udGVudCA9IChcbiAgICAgICAgPE1hcEludGVyYWN0aW9uc1xuICAgICAgICAgIG9uTW91c2VEb3duID17IHRoaXMuX29uTW91c2VEb3duIH1cbiAgICAgICAgICBvbk1vdXNlRHJhZyA9eyB0aGlzLl9vbk1vdXNlRHJhZyB9XG4gICAgICAgICAgb25Nb3VzZVJvdGF0ZSA9eyB0aGlzLl9vbk1vdXNlUm90YXRlIH1cbiAgICAgICAgICBvbk1vdXNlVXAgPXsgdGhpcy5fb25Nb3VzZVVwIH1cbiAgICAgICAgICBvbk1vdXNlTW92ZSA9eyB0aGlzLl9vbk1vdXNlTW92ZSB9XG4gICAgICAgICAgb25ab29tID17IHRoaXMuX29uWm9vbSB9XG4gICAgICAgICAgb25ab29tRW5kID17IHRoaXMuX29uWm9vbUVuZCB9XG4gICAgICAgICAgd2lkdGggPXsgdGhpcy5wcm9wcy53aWR0aCB9XG4gICAgICAgICAgaGVpZ2h0ID17IHRoaXMucHJvcHMuaGVpZ2h0IH1cbiAgICAgICAgICB6b29tRGlzYWJsZWQgPXsgdGhpcy5wcm9wcy56b29tRGlzYWJsZWQgfVxuICAgICAgICAgIGRyYWdEaXNhYmxlZCA9eyB0aGlzLnByb3BzLmRyYWdEaXNhYmxlZCB9PlxuXG4gICAgICAgICAgeyBjb250ZW50IH1cblxuICAgICAgICA8L01hcEludGVyYWN0aW9ucz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9eyB7XG4gICAgICAgICAgLi4udGhpcy5wcm9wcy5zdHlsZSxcbiAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgICAgIH0gfT5cblxuICAgICAgICB7IGNvbnRlbnQgfVxuXG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1vZCh2YWx1ZSwgZGl2aXNvcikge1xuICBjb25zdCBtb2R1bHVzID0gdmFsdWUgJSBkaXZpc29yO1xuICByZXR1cm4gbW9kdWx1cyA8IDAgPyBkaXZpc29yICsgbW9kdWx1cyA6IG1vZHVsdXM7XG59XG5cbmZ1bmN0aW9uIHVucHJvamVjdEZyb21UcmFuc2Zvcm0odHJhbnNmb3JtLCBwb2ludCkge1xuICByZXR1cm4gdHJhbnNmb3JtLnBvaW50TG9jYXRpb24oUG9pbnQuY29udmVydChwb2ludCkpO1xufVxuXG5mdW5jdGlvbiBjbG9uZVRyYW5zZm9ybShvcmlnaW5hbCkge1xuICBjb25zdCB0cmFuc2Zvcm0gPSBuZXcgVHJhbnNmb3JtKG9yaWdpbmFsLl9taW5ab29tLCBvcmlnaW5hbC5fbWF4Wm9vbSk7XG4gIHRyYW5zZm9ybS5sYXRSYW5nZSA9IG9yaWdpbmFsLmxhdFJhbmdlO1xuICB0cmFuc2Zvcm0ud2lkdGggPSBvcmlnaW5hbC53aWR0aDtcbiAgdHJhbnNmb3JtLmhlaWdodCA9IG9yaWdpbmFsLmhlaWdodDtcbiAgdHJhbnNmb3JtLnpvb20gPSBvcmlnaW5hbC56b29tO1xuICB0cmFuc2Zvcm0uY2VudGVyID0gb3JpZ2luYWwuY2VudGVyO1xuICB0cmFuc2Zvcm0uYW5nbGUgPSBvcmlnaW5hbC5hbmdsZTtcbiAgdHJhbnNmb3JtLmFsdGl0dWRlID0gb3JpZ2luYWwuYWx0aXR1ZGU7XG4gIHRyYW5zZm9ybS5waXRjaCA9IG9yaWdpbmFsLnBpdGNoO1xuICB0cmFuc2Zvcm0uYmVhcmluZyA9IG9yaWdpbmFsLmJlYXJpbmc7XG4gIHRyYW5zZm9ybS5hbHRpdHVkZSA9IG9yaWdpbmFsLmFsdGl0dWRlO1xuICByZXR1cm4gdHJhbnNmb3JtO1xufVxuXG5NYXBHTC5wcm9wVHlwZXMgPSBQUk9QX1RZUEVTO1xuTWFwR0wuY2hpbGRDb250ZXh0VHlwZXMgPSBDSElMRF9DT05URVhUX1RZUEVTO1xuTWFwR0wuZGVmYXVsdFByb3BzID0gREVGQVVMVF9QUk9QUztcbiJdfQ==