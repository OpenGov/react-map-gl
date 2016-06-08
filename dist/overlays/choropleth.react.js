'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _viewportMercatorProject = require('viewport-mercator-project');

var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

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
  renderWhileDragging: _react.PropTypes.bool.isRequired,
  globalOpacity: _react.PropTypes.number.isRequired,
  /**
    * An Immutable List of feature objects.
    */
  features: _react.PropTypes.instanceOf(_immutable2.default.List),
  colorDomain: _react.PropTypes.array,
  colorRange: _react.PropTypes.array.isRequired,
  valueAccessor: _react.PropTypes.func.isRequired
};

var DEFAULT_PROPS = {
  renderWhileDragging: true,
  globalOpacity: 1,
  colorDomain: null,
  colorRange: ['#FFFFFF', '#1FBAD6'],
  valueAccessor: function valueAccessor(feature) {
    return feature.get('properties').get('value');
  }
};

var ChoroplethOverlay = function (_Component) {
  _inherits(ChoroplethOverlay, _Component);

  function ChoroplethOverlay() {
    _classCallCheck(this, ChoroplethOverlay);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ChoroplethOverlay).apply(this, arguments));
  }

  _createClass(ChoroplethOverlay, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._redraw();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._redraw();
    }
  }, {
    key: '_redraw',
    value: function _redraw() {
      var pixelRatio = _window2.default.devicePixelRatio;
      var canvas = this.refs.overlay;
      var ctx = canvas.getContext('2d');
      var mercator = (0, _viewportMercatorProject2.default)(this.props);

      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);
      ctx.clearRect(0, 0, this.props.width, this.props.height);

      function projectPoint(lon, lat) {
        var point = mercator.project([lon, lat]);
        /* eslint-disable no-invalid-this */
        this.stream.point(point[0], point[1]);
        /* eslint-enable no-invalid-this */
      }

      if (this.props.renderWhileDragging || !this.props.isDragging) {
        var transform = _d2.default.geo.transform({ point: projectPoint });
        var path = _d2.default.geo.path().projection(transform).context(ctx);
        this._drawFeatures(ctx, path);
      }
      ctx.restore();
    }
  }, {
    key: '_drawFeatures',
    value: function _drawFeatures(ctx, path) {
      var features = this.props.features;

      if (!features) {
        return;
      }
      var colorDomain = this.props.colorDomain || _d2.default.extent(features.toArray(), this.props.valueAccessor);

      var colorScale = _d2.default.scale.linear().domain(colorDomain).range(this.props.colorRange).clamp(true);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = features[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var feature = _step.value;

          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = '1';
          ctx.fillStyle = colorScale(this.props.valueAccessor(feature));
          var geometry = feature.get('geometry');
          path({
            type: geometry.get('type'),
            coordinates: geometry.get('coordinates').toJS()
          });
          ctx.fill();
          ctx.stroke();
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
  }, {
    key: 'render',
    value: function render() {
      var pixelRatio = _window2.default.devicePixelRatio || 1;
      return _react2.default.createElement('canvas', {
        ref: 'overlay',
        width: this.props.width * pixelRatio,
        height: this.props.height * pixelRatio,
        style: {
          width: this.props.width + 'px',
          height: this.props.height + 'px',
          position: 'absolute',
          pointerEvents: 'none',
          opacity: this.props.globalOpacity,
          left: 0,
          top: 0
        } });
    }
  }]);

  return ChoroplethOverlay;
}(_react.Component);

exports.default = ChoroplethOverlay;


ChoroplethOverlay.propTypes = PROP_TYPES;
ChoroplethOverlay.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9jaG9yb3BsZXRoLnJlYWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQW1CQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxhQUFhO0FBQ2pCLFNBQU8saUJBQVUsTUFBVixDQUFpQixVQURQO0FBRWpCLFVBQVEsaUJBQVUsTUFBVixDQUFpQixVQUZSO0FBR2pCLFlBQVUsaUJBQVUsTUFBVixDQUFpQixVQUhWO0FBSWpCLGFBQVcsaUJBQVUsTUFBVixDQUFpQixVQUpYO0FBS2pCLFFBQU0saUJBQVUsTUFBVixDQUFpQixVQUxOO0FBTWpCLGNBQVksaUJBQVUsSUFBVixDQUFlLFVBTlY7QUFPakIsdUJBQXFCLGlCQUFVLElBQVYsQ0FBZSxVQVBuQjtBQVFqQixpQkFBZSxpQkFBVSxNQUFWLENBQWlCLFVBUmY7Ozs7QUFZakIsWUFBVSxpQkFBVSxVQUFWLENBQXFCLG9CQUFVLElBQS9CLENBWk87QUFhakIsZUFBYSxpQkFBVSxLQWJOO0FBY2pCLGNBQVksaUJBQVUsS0FBVixDQUFnQixVQWRYO0FBZWpCLGlCQUFlLGlCQUFVLElBQVYsQ0FBZTtBQWZiLENBQW5COztBQWtCQSxJQUFNLGdCQUFnQjtBQUNwQix1QkFBcUIsSUFERDtBQUVwQixpQkFBZSxDQUZLO0FBR3BCLGVBQWEsSUFITztBQUlwQixjQUFZLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FKUTtBQUtwQixlQUxvQix5QkFLTixPQUxNLEVBS0c7QUFDckIsV0FBTyxRQUFRLEdBQVIsQ0FBWSxZQUFaLEVBQTBCLEdBQTFCLENBQThCLE9BQTlCLENBQVA7QUFDRDtBQVBtQixDQUF0Qjs7SUFVcUIsaUI7Ozs7Ozs7Ozs7O3dDQUVDO0FBQ2xCLFdBQUssT0FBTDtBQUNEOzs7eUNBRW9CO0FBQ25CLFdBQUssT0FBTDtBQUNEOzs7OEJBRVM7QUFDUixVQUFNLGFBQWEs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eUJBQWUsTUFKVDtBQUtOLG1CQUFTLEtBQUssS0FBTCxDQUFXLGFBTGQ7QUFNTixnQkFBTSxDQU5BO0FBT04sZUFBSztBQVBDLFNBSlYsR0FERjtBQWVEOzs7Ozs7a0JBaEZrQixpQjs7O0FBbUZyQixrQkFBa0IsU0FBbEIsR0FBOEIsVUFBOUI7QUFDQSxrQkFBa0IsWUFBbEIsR0FBaUMsYUFBakMiLCJmaWxlIjoiY2hvcm9wbGV0aC5yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXMsIENvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFZpZXdwb3J0TWVyY2F0b3IgZnJvbSAndmlld3BvcnQtbWVyY2F0b3ItcHJvamVjdCc7XG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGQzIGZyb20gJ2QzJztcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGxhdGl0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGxvbmdpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB6b29tOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGlzRHJhZ2dpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIHJlbmRlcldoaWxlRHJhZ2dpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIGdsb2JhbE9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBBbiBJbW11dGFibGUgTGlzdCBvZiBmZWF0dXJlIG9iamVjdHMuXG4gICAgKi9cbiAgZmVhdHVyZXM6IFByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KSxcbiAgY29sb3JEb21haW46IFByb3BUeXBlcy5hcnJheSxcbiAgY29sb3JSYW5nZTogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIHZhbHVlQWNjZXNzb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIHJlbmRlcldoaWxlRHJhZ2dpbmc6IHRydWUsXG4gIGdsb2JhbE9wYWNpdHk6IDEsXG4gIGNvbG9yRG9tYWluOiBudWxsLFxuICBjb2xvclJhbmdlOiBbJyNGRkZGRkYnLCAnIzFGQkFENiddLFxuICB2YWx1ZUFjY2Vzc29yKGZlYXR1cmUpIHtcbiAgICByZXR1cm4gZmVhdHVyZS5nZXQoJ3Byb3BlcnRpZXMnKS5nZXQoJ3ZhbHVlJyk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENob3JvcGxldGhPdmVybGF5IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9yZWRyYXcoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLl9yZWRyYXcoKTtcbiAgfVxuXG4gIF9yZWRyYXcoKSB7XG4gICAgY29uc3QgcGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMucmVmcy5vdmVybGF5O1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IG1lcmNhdG9yID0gVmlld3BvcnRNZXJjYXRvcih0aGlzLnByb3BzKTtcblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnNjYWxlKHBpeGVsUmF0aW8sIHBpeGVsUmF0aW8pO1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wcm9wcy53aWR0aCwgdGhpcy5wcm9wcy5oZWlnaHQpO1xuXG4gICAgZnVuY3Rpb24gcHJvamVjdFBvaW50KGxvbiwgbGF0KSB7XG4gICAgICBjb25zdCBwb2ludCA9IG1lcmNhdG9yLnByb2plY3QoW2xvbiwgbGF0XSk7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cbiAgICAgIHRoaXMuc3RyZWFtLnBvaW50KHBvaW50WzBdLCBwb2ludFsxXSk7XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWludmFsaWQtdGhpcyAqL1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnJlbmRlcldoaWxlRHJhZ2dpbmcgfHwgIXRoaXMucHJvcHMuaXNEcmFnZ2luZykge1xuICAgICAgY29uc3QgdHJhbnNmb3JtID0gZDMuZ2VvLnRyYW5zZm9ybSh7cG9pbnQ6IHByb2plY3RQb2ludH0pO1xuICAgICAgY29uc3QgcGF0aCA9IGQzLmdlby5wYXRoKCkucHJvamVjdGlvbih0cmFuc2Zvcm0pLmNvbnRleHQoY3R4KTtcbiAgICAgIHRoaXMuX2RyYXdGZWF0dXJlcyhjdHgsIHBhdGgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgX2RyYXdGZWF0dXJlcyhjdHgsIHBhdGgpIHtcbiAgICBjb25zdCB7ZmVhdHVyZXN9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoIWZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNvbG9yRG9tYWluID0gdGhpcy5wcm9wcy5jb2xvckRvbWFpbiB8fFxuICAgICAgZDMuZXh0ZW50KGZlYXR1cmVzLnRvQXJyYXkoKSwgdGhpcy5wcm9wcy52YWx1ZUFjY2Vzc29yKTtcblxuICAgIGNvbnN0IGNvbG9yU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbihjb2xvckRvbWFpbilcbiAgICAgIC5yYW5nZSh0aGlzLnByb3BzLmNvbG9yUmFuZ2UpXG4gICAgICAuY2xhbXAodHJ1ZSk7XG5cbiAgICBmb3IgKGNvbnN0IGZlYXR1cmUgb2YgZmVhdHVyZXMpIHtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSknO1xuICAgICAgY3R4LmxpbmVXaWR0aCA9ICcxJztcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvclNjYWxlKHRoaXMucHJvcHMudmFsdWVBY2Nlc3NvcihmZWF0dXJlKSk7XG4gICAgICBjb25zdCBnZW9tZXRyeSA9IGZlYXR1cmUuZ2V0KCdnZW9tZXRyeScpO1xuICAgICAgcGF0aCh7XG4gICAgICAgIHR5cGU6IGdlb21ldHJ5LmdldCgndHlwZScpLFxuICAgICAgICBjb29yZGluYXRlczogZ2VvbWV0cnkuZ2V0KCdjb29yZGluYXRlcycpLnRvSlMoKVxuICAgICAgfSk7XG4gICAgICBjdHguZmlsbCgpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBwaXhlbFJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICByZXR1cm4gKFxuICAgICAgPGNhbnZhc1xuICAgICAgICByZWY9XCJvdmVybGF5XCJcbiAgICAgICAgd2lkdGg9eyB0aGlzLnByb3BzLndpZHRoICogcGl4ZWxSYXRpbyB9XG4gICAgICAgIGhlaWdodD17IHRoaXMucHJvcHMuaGVpZ2h0ICogcGl4ZWxSYXRpbyB9XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIHdpZHRoOiBgJHt0aGlzLnByb3BzLndpZHRofXB4YCxcbiAgICAgICAgICBoZWlnaHQ6IGAke3RoaXMucHJvcHMuaGVpZ2h0fXB4YCxcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgb3BhY2l0eTogdGhpcy5wcm9wcy5nbG9iYWxPcGFjaXR5LFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgdG9wOiAwXG4gICAgICAgIH0gfS8+XG4gICAgKTtcbiAgfVxufVxuXG5DaG9yb3BsZXRoT3ZlcmxheS5wcm9wVHlwZXMgPSBQUk9QX1RZUEVTO1xuQ2hvcm9wbGV0aE92ZXJsYXkuZGVmYXVsdFByb3BzID0gREVGQVVMVF9QUk9QUztcbiJdfQ==