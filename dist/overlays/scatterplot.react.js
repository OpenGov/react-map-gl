'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _canvasCompositeTypes = require('canvas-composite-types');

var _canvasCompositeTypes2 = _interopRequireDefault(_canvasCompositeTypes);

var _viewportMercatorProject = require('viewport-mercator-project');

var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Copyright (c) 2015 Uber Technologies, Inc.

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

var PROP_TYPES = {
  width: _propTypes2.default.number.isRequired,
  height: _propTypes2.default.number.isRequired,
  latitude: _propTypes2.default.number.isRequired,
  longitude: _propTypes2.default.number.isRequired,
  zoom: _propTypes2.default.number.isRequired,
  isDragging: _propTypes2.default.bool.isRequired,
  locations: _propTypes2.default.instanceOf(_immutable2.default.List).isRequired,
  lngLatAccessor: _propTypes2.default.func.isRequired,
  renderWhileDragging: _propTypes2.default.bool,
  globalOpacity: _propTypes2.default.number.isRequired,
  dotRadius: _propTypes2.default.number.isRequired,
  dotFill: _propTypes2.default.string.isRequired,
  compositeOperation: _propTypes2.default.oneOf(_canvasCompositeTypes2.default).isRequired
};

var DEFAULT_PROPS = {
  lngLatAccessor: function lngLatAccessor(location) {
    return [location.get(0), location.get(1)];
  },

  renderWhileDragging: true,
  dotRadius: 4,
  dotFill: '#1FBAD6',
  globalOpacity: 1,
  // Same as browser default.
  compositeOperation: 'source-over'
};

var ScatterplotOverlay = function (_Component) {
  _inherits(ScatterplotOverlay, _Component);

  function ScatterplotOverlay() {
    _classCallCheck(this, ScatterplotOverlay);

    return _possibleConstructorReturn(this, (ScatterplotOverlay.__proto__ || Object.getPrototypeOf(ScatterplotOverlay)).apply(this, arguments));
  }

  _createClass(ScatterplotOverlay, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._redraw();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._redraw();
    }

    /* eslint-disable max-statements */

  }, {
    key: '_redraw',
    value: function _redraw() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          dotRadius = _props.dotRadius,
          dotFill = _props.dotFill,
          compositeOperation = _props.compositeOperation,
          renderWhileDragging = _props.renderWhileDragging,
          isDragging = _props.isDragging,
          locations = _props.locations,
          lngLatAccessor = _props.lngLatAccessor;


      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      var pixelRatio = _window2.default.devicePixelRatio || 1;
      var canvas = this.refs.overlay;
      var ctx = canvas.getContext('2d');

      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = compositeOperation;

      if ((renderWhileDragging || !isDragging) && locations) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = locations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var location = _step.value;

            var pixel = mercator.project(lngLatAccessor(location));
            var pixelRounded = [_d2.default.round(pixel[0], 1), _d2.default.round(pixel[1], 1)];
            if (pixelRounded[0] + dotRadius >= 0 && pixelRounded[0] - dotRadius < width && pixelRounded[1] + dotRadius >= 0 && pixelRounded[1] - dotRadius < height) {
              ctx.fillStyle = dotFill;
              ctx.beginPath();
              ctx.arc(pixelRounded[0], pixelRounded[1], dotRadius, 0, Math.PI * 2);
              ctx.fill();
            }
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
      }

      ctx.restore();
    }
    /* eslint-enable max-statements */

  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height,
          globalOpacity = _props2.globalOpacity;

      var pixelRatio = _window2.default.devicePixelRatio || 1;
      return _react2.default.createElement('canvas', {
        ref: 'overlay',
        width: width * pixelRatio,
        height: height * pixelRatio,
        style: {
          width: width + 'px',
          height: height + 'px',
          position: 'absolute',
          pointerEvents: 'none',
          opacity: globalOpacity,
          left: 0,
          top: 0
        } });
    }
  }]);

  return ScatterplotOverlay;
}(_react.Component);

exports.default = ScatterplotOverlay;


ScatterplotOverlay.propTypes = PROP_TYPES;
ScatterplotOverlay.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9zY2F0dGVycGxvdC5yZWFjdC5qcyJdLCJuYW1lcyI6WyJQUk9QX1RZUEVTIiwid2lkdGgiLCJQcm9wVHlwZXMiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwiaGVpZ2h0IiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJ6b29tIiwiaXNEcmFnZ2luZyIsImJvb2wiLCJsb2NhdGlvbnMiLCJpbnN0YW5jZU9mIiwiSW1tdXRhYmxlIiwiTGlzdCIsImxuZ0xhdEFjY2Vzc29yIiwiZnVuYyIsInJlbmRlcldoaWxlRHJhZ2dpbmciLCJnbG9iYWxPcGFjaXR5IiwiZG90UmFkaXVzIiwiZG90RmlsbCIsInN0cmluZyIsImNvbXBvc2l0ZU9wZXJhdGlvbiIsIm9uZU9mIiwiQ09NUE9TSVRFX1RZUEVTIiwiREVGQVVMVF9QUk9QUyIsImxvY2F0aW9uIiwiZ2V0IiwiU2NhdHRlcnBsb3RPdmVybGF5IiwiX3JlZHJhdyIsInByb3BzIiwibWVyY2F0b3IiLCJwaXhlbFJhdGlvIiwid2luZG93IiwiZGV2aWNlUGl4ZWxSYXRpbyIsImNhbnZhcyIsInJlZnMiLCJvdmVybGF5IiwiY3R4IiwiZ2V0Q29udGV4dCIsInNhdmUiLCJzY2FsZSIsImNsZWFyUmVjdCIsImdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiIsInBpeGVsIiwicHJvamVjdCIsInBpeGVsUm91bmRlZCIsImQzIiwicm91bmQiLCJmaWxsU3R5bGUiLCJiZWdpblBhdGgiLCJhcmMiLCJNYXRoIiwiUEkiLCJmaWxsIiwicmVzdG9yZSIsInBvc2l0aW9uIiwicG9pbnRlckV2ZW50cyIsIm9wYWNpdHkiLCJsZWZ0IiwidG9wIiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFvQkE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7K2VBMUJBOztBQUVBO0FBQ0E7QUFDQTtB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QUtOQyxtQkFBU3hDLGFBTEg7QUFNTnlDLGdCQUFNLENBTkE7QUFPTkMsZUFBSztBQVBDLFNBSlYsR0FERjtBQWVEOzs7O0VBbEU2Q0MsZ0I7O2tCQUEzQmpDLGtCOzs7QUFxRXJCQSxtQkFBbUJrQyxTQUFuQixHQUErQjlELFVBQS9CO0FBQ0E0QixtQkFBbUJtQyxZQUFuQixHQUFrQ3RDLGFBQWxDIiwiZmlsZSI6InNjYXR0ZXJwbG90LnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkMyBmcm9tICdkMyc7XG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgQ09NUE9TSVRFX1RZUEVTIGZyb20gJ2NhbnZhcy1jb21wb3NpdGUtdHlwZXMnO1xuaW1wb3J0IFZpZXdwb3J0TWVyY2F0b3IgZnJvbSAndmlld3BvcnQtbWVyY2F0b3ItcHJvamVjdCc7XG5cbmNvbnN0IFBST1BfVFlQRVMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsYXRpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsb25naXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgem9vbTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBpc0RyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBsb2NhdGlvbnM6IFByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxuICBsbmdMYXRBY2Nlc3NvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVuZGVyV2hpbGVEcmFnZ2luZzogUHJvcFR5cGVzLmJvb2wsXG4gIGdsb2JhbE9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgZG90UmFkaXVzOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGRvdEZpbGw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgY29tcG9zaXRlT3BlcmF0aW9uOiBQcm9wVHlwZXMub25lT2YoQ09NUE9TSVRFX1RZUEVTKS5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICBsbmdMYXRBY2Nlc3Nvcihsb2NhdGlvbikge1xuICAgIHJldHVybiBbbG9jYXRpb24uZ2V0KDApLCBsb2NhdGlvbi5nZXQoMSldO1xuICB9LFxuICByZW5kZXJXaGlsZURyYWdnaW5nOiB0cnVlLFxuICBkb3RSYWRpdXM6IDQsXG4gIGRvdEZpbGw6ICcjMUZCQUQ2JyxcbiAgZ2xvYmFsT3BhY2l0eTogMSxcbiAgLy8gU2FtZSBhcyBicm93c2VyIGRlZmF1bHQuXG4gIGNvbXBvc2l0ZU9wZXJhdGlvbjogJ3NvdXJjZS1vdmVyJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NhdHRlcnBsb3RPdmVybGF5IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9yZWRyYXcoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLl9yZWRyYXcoKTtcbiAgfVxuXG4gIC8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzICovXG4gIF9yZWRyYXcoKSB7XG4gICAgY29uc3Qge1xuICAgICAgd2lkdGgsIGhlaWdodCwgZG90UmFkaXVzLCBkb3RGaWxsLCBjb21wb3NpdGVPcGVyYXRpb24sXG4gICAgICByZW5kZXJXaGlsZURyYWdnaW5nLCBpc0RyYWdnaW5nLCBsb2NhdGlvbnMsIGxuZ0xhdEFjY2Vzc29yXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBtZXJjYXRvciA9IFZpZXdwb3J0TWVyY2F0b3IodGhpcy5wcm9wcyk7XG4gICAgY29uc3QgcGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5yZWZzLm92ZXJsYXk7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5zY2FsZShwaXhlbFJhdGlvLCBwaXhlbFJhdGlvKTtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBjb21wb3NpdGVPcGVyYXRpb247XG5cbiAgICBpZiAoKHJlbmRlcldoaWxlRHJhZ2dpbmcgfHwgIWlzRHJhZ2dpbmcpICYmIGxvY2F0aW9ucykge1xuICAgICAgZm9yIChjb25zdCBsb2NhdGlvbiBvZiBsb2NhdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcGl4ZWwgPSBtZXJjYXRvci5wcm9qZWN0KGxuZ0xhdEFjY2Vzc29yKGxvY2F0aW9uKSk7XG4gICAgICAgIGNvbnN0IHBpeGVsUm91bmRlZCA9IFtkMy5yb3VuZChwaXhlbFswXSwgMSksIGQzLnJvdW5kKHBpeGVsWzFdLCAxKV07XG4gICAgICAgIGlmIChwaXhlbFJvdW5kZWRbMF0gKyBkb3RSYWRpdXMgPj0gMCAmJlxuICAgICAgICAgICAgcGl4ZWxSb3VuZGVkWzBdIC0gZG90UmFkaXVzIDwgd2lkdGggJiZcbiAgICAgICAgICAgIHBpeGVsUm91bmRlZFsxXSArIGRvdFJhZGl1cyA+PSAwICYmXG4gICAgICAgICAgICBwaXhlbFJvdW5kZWRbMV0gLSBkb3RSYWRpdXMgPCBoZWlnaHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGRvdEZpbGw7XG4gICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgIGN0eC5hcmMocGl4ZWxSb3VuZGVkWzBdLCBwaXhlbFJvdW5kZWRbMV0sIGRvdFJhZGl1cywgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgbWF4LXN0YXRlbWVudHMgKi9cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3dpZHRoLCBoZWlnaHQsIGdsb2JhbE9wYWNpdHl9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBwaXhlbFJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICByZXR1cm4gKFxuICAgICAgPGNhbnZhc1xuICAgICAgICByZWY9XCJvdmVybGF5XCJcbiAgICAgICAgd2lkdGg9eyB3aWR0aCAqIHBpeGVsUmF0aW8gfVxuICAgICAgICBoZWlnaHQ9eyBoZWlnaHQgKiBwaXhlbFJhdGlvIH1cbiAgICAgICAgc3R5bGU9eyB7XG4gICAgICAgICAgd2lkdGg6IGAke3dpZHRofXB4YCxcbiAgICAgICAgICBoZWlnaHQ6IGAke2hlaWdodH1weGAsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgIG9wYWNpdHk6IGdsb2JhbE9wYWNpdHksXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICB0b3A6IDBcbiAgICAgICAgfSB9Lz5cbiAgICApO1xuICB9XG59XG5cblNjYXR0ZXJwbG90T3ZlcmxheS5wcm9wVHlwZXMgPSBQUk9QX1RZUEVTO1xuU2NhdHRlcnBsb3RPdmVybGF5LmRlZmF1bHRQcm9wcyA9IERFRkFVTFRfUFJPUFM7XG4iXX0=