'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  latitude: _react.PropTypes.number.isRequired,
  longitude: _react.PropTypes.number.isRequired,
  zoom: _react.PropTypes.number.isRequired,
  isDragging: _react.PropTypes.bool.isRequired,
  locations: _react.PropTypes.instanceOf(_immutable2.default.List).isRequired,
  lngLatAccessor: _react.PropTypes.func.isRequired,
  renderWhileDragging: _react.PropTypes.bool,
  globalOpacity: _react.PropTypes.number.isRequired,
  dotRadius: _react.PropTypes.number.isRequired,
  dotFill: _react.PropTypes.string.isRequired,
  compositeOperation: _react.PropTypes.oneOf(_canvasCompositeTypes2.default).isRequired
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

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterplotOverlay).apply(this, arguments));
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
      var _props = this.props;
      var width = _props.width;
      var height = _props.height;
      var dotRadius = _props.dotRadius;
      var dotFill = _props.dotFill;
      var compositeOperation = _props.compositeOperation;
      var renderWhileDragging = _props.renderWhileDragging;
      var isDragging = _props.isDragging;
      var locations = _props.locations;
      var lngLatAccessor = _props.lngLatAccessor;


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
      var _props2 = this.props;
      var width = _props2.width;
      var height = _props2.height;
      var globalOpacity = _props2.globalOpacity;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9zY2F0dGVycGxvdC5yZWFjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFvQkE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLGFBQWE7QUFDakIsU0FBTyxpQkFBVSxNQUFWLENBQWlCLFVBRFA7QUFFakIsVUFBUSxpQkFBVSxNQUFWLENBQWlCLFVBRlI7QUFHakIsWUFBVSxpQkFBVSxNQUFWLENBQWlCLFVBSFY7QUFJakIsYUFBVyxpQkFBVSxNQUFWLENBQWlCLFVBSlg7QUFLakIsUUFBTSxpQkFBVSxNQUFWLENBQWlCLFVBTE47QUFNakIsY0FBWSxpQkFBVSxJQUFWLENBQWUsVUFOVjtBQU9qQixhQUFXLGlCQUFVLFVBQVYsQ0FBcUIsb0JBQVUsSUFBL0IsRUFBcUMsVUFQL0I7QUFRakIsa0JBQWdCLGlCQUFVLElBQVYsQ0FBZSxVQVJkO0FBU2pCLHVCQUFxQixpQkFBVSxJQVRkO0FBVWpCLGlCQUFlLGlCQUFVLE1BQVYsQ0FBaUIsVUFWZjtBQVdqQixhQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFYWDtBQVlqQixXQUFTLGlCQUFVLE1BQVYsQ0FBaUIsVUFaVDtBQWFqQixzQkFBb0IsaUJBQVUsS0FBVixpQ0FBaUM7QUFicEMsQ0FBbkI7O0FBZ0JBLElBQU0sZ0JBQWdCO0FBQ3BCLGdCQURvQiwwQkFDTCxRQURLLEVBQ0s7QUFDdkIsV0FBTyxDQUFDLFNBQVMsR0FBVCxDQUFhLENBQWIsQ0FBRCxFQUFrQixTQUFTLEdBQVQsQ0FBYSxDQUFiLENBQWxCLENBQVA7QUFDRCxHQUhtQjs7QUFJcEIsdUJBQXFCLElBSkQ7QUFLcEIsYUFBVyxDQUxTO0FBTXBCLFdBQVMsU0FOVztBQU9wQixpQkFBZSxDQVBLOztBQVNwQixzQkFBb0I7QUFUQSxDQUF0Qjs7SUFZcUIsa0I7Ozs7Ozs7Ozs7O3dDQUVDO0FBQ2xC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QWtDLGFBQWxDIiwiZmlsZSI6InNjYXR0ZXJwbG90LnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzLCBDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZDMgZnJvbSAnZDMnO1xuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IENPTVBPU0lURV9UWVBFUyBmcm9tICdjYW52YXMtY29tcG9zaXRlLXR5cGVzJztcbmltcG9ydCBWaWV3cG9ydE1lcmNhdG9yIGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnO1xuXG5jb25zdCBQUk9QX1RZUEVTID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgbGF0aXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgbG9uZ2l0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHpvb206IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaXNEcmFnZ2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgbG9jYXRpb25zOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcbiAgbG5nTGF0QWNjZXNzb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlbmRlcldoaWxlRHJhZ2dpbmc6IFByb3BUeXBlcy5ib29sLFxuICBnbG9iYWxPcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGRvdFJhZGl1czogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBkb3RGaWxsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGNvbXBvc2l0ZU9wZXJhdGlvbjogUHJvcFR5cGVzLm9uZU9mKENPTVBPU0lURV9UWVBFUykuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgREVGQVVMVF9QUk9QUyA9IHtcbiAgbG5nTGF0QWNjZXNzb3IobG9jYXRpb24pIHtcbiAgICByZXR1cm4gW2xvY2F0aW9uLmdldCgwKSwgbG9jYXRpb24uZ2V0KDEpXTtcbiAgfSxcbiAgcmVuZGVyV2hpbGVEcmFnZ2luZzogdHJ1ZSxcbiAgZG90UmFkaXVzOiA0LFxuICBkb3RGaWxsOiAnIzFGQkFENicsXG4gIGdsb2JhbE9wYWNpdHk6IDEsXG4gIC8vIFNhbWUgYXMgYnJvd3NlciBkZWZhdWx0LlxuICBjb21wb3NpdGVPcGVyYXRpb246ICdzb3VyY2Utb3Zlcidcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjYXR0ZXJwbG90T3ZlcmxheSBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fcmVkcmF3KCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5fcmVkcmF3KCk7XG4gIH1cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuICBfcmVkcmF3KCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoLCBoZWlnaHQsIGRvdFJhZGl1cywgZG90RmlsbCwgY29tcG9zaXRlT3BlcmF0aW9uLFxuICAgICAgcmVuZGVyV2hpbGVEcmFnZ2luZywgaXNEcmFnZ2luZywgbG9jYXRpb25zLCBsbmdMYXRBY2Nlc3NvclxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgbWVyY2F0b3IgPSBWaWV3cG9ydE1lcmNhdG9yKHRoaXMucHJvcHMpO1xuICAgIGNvbnN0IHBpeGVsUmF0aW8gPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMucmVmcy5vdmVybGF5O1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguc2NhbGUocGl4ZWxSYXRpbywgcGl4ZWxSYXRpbyk7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gY29tcG9zaXRlT3BlcmF0aW9uO1xuXG4gICAgaWYgKChyZW5kZXJXaGlsZURyYWdnaW5nIHx8ICFpc0RyYWdnaW5nKSAmJiBsb2NhdGlvbnMpIHtcbiAgICAgIGZvciAoY29uc3QgbG9jYXRpb24gb2YgbG9jYXRpb25zKSB7XG4gICAgICAgIGNvbnN0IHBpeGVsID0gbWVyY2F0b3IucHJvamVjdChsbmdMYXRBY2Nlc3Nvcihsb2NhdGlvbikpO1xuICAgICAgICBjb25zdCBwaXhlbFJvdW5kZWQgPSBbZDMucm91bmQocGl4ZWxbMF0sIDEpLCBkMy5yb3VuZChwaXhlbFsxXSwgMSldO1xuICAgICAgICBpZiAocGl4ZWxSb3VuZGVkWzBdICsgZG90UmFkaXVzID49IDAgJiZcbiAgICAgICAgICAgIHBpeGVsUm91bmRlZFswXSAtIGRvdFJhZGl1cyA8IHdpZHRoICYmXG4gICAgICAgICAgICBwaXhlbFJvdW5kZWRbMV0gKyBkb3RSYWRpdXMgPj0gMCAmJlxuICAgICAgICAgICAgcGl4ZWxSb3VuZGVkWzFdIC0gZG90UmFkaXVzIDwgaGVpZ2h0XG4gICAgICAgICkge1xuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBkb3RGaWxsO1xuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICBjdHguYXJjKHBpeGVsUm91bmRlZFswXSwgcGl4ZWxSb3VuZGVkWzFdLCBkb3RSYWRpdXMsIDAsIE1hdGguUEkgKiAyKTtcbiAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0LCBnbG9iYWxPcGFjaXR5fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgcGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgcmV0dXJuIChcbiAgICAgIDxjYW52YXNcbiAgICAgICAgcmVmPVwib3ZlcmxheVwiXG4gICAgICAgIHdpZHRoPXsgd2lkdGggKiBwaXhlbFJhdGlvIH1cbiAgICAgICAgaGVpZ2h0PXsgaGVpZ2h0ICogcGl4ZWxSYXRpbyB9XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIHdpZHRoOiBgJHt3aWR0aH1weGAsXG4gICAgICAgICAgaGVpZ2h0OiBgJHtoZWlnaHR9cHhgLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgICAgICBvcGFjaXR5OiBnbG9iYWxPcGFjaXR5LFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgdG9wOiAwXG4gICAgICAgIH0gfS8+XG4gICAgKTtcbiAgfVxufVxuXG5TY2F0dGVycGxvdE92ZXJsYXkucHJvcFR5cGVzID0gUFJPUF9UWVBFUztcblNjYXR0ZXJwbG90T3ZlcmxheS5kZWZhdWx0UHJvcHMgPSBERUZBVUxUX1BST1BTO1xuIl19