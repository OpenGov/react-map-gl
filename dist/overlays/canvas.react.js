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
  redraw: _react.PropTypes.func.isRequired,
  isDragging: _react.PropTypes.bool.isRequired
};

var CanvasOverlay = function (_Component) {
  _inherits(CanvasOverlay, _Component);

  function CanvasOverlay() {
    _classCallCheck(this, CanvasOverlay);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CanvasOverlay).apply(this, arguments));
  }

  _createClass(CanvasOverlay, [{
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
      var pixelRatio = _window2.default.devicePixelRatio || 1;
      var canvas = this.refs.overlay;
      var ctx = canvas.getContext('2d');
      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);
      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      this.props.redraw({
        width: this.props.width,
        height: this.props.height,
        ctx: ctx,
        project: mercator.project,
        unproject: mercator.unproject,
        isDragging: this.props.isDragging
      });
      ctx.restore();
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
          left: 0,
          top: 0
        } });
    }
  }]);

  return CanvasOverlay;
}(_react.Component);

exports.default = CanvasOverlay;


CanvasOverlay.propTypes = PROP_TYPES;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9jYW52YXMucmVhY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBb0JBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxhQUFhO0FBQ2pCLFNBQU8saUJBQVUsTUFBVixDQUFpQixVQURQO0FBRWpCLFVBQVEsaUJBQVUsTUFBVixDQUFpQixVQUZSO0FBR2pCLFlBQVUsaUJBQVUsTUFBVixDQUFpQixVQUhWO0FBSWpCLGFBQVcsaUJBQVUsTUFBVixDQUFpQixVQUpYO0FBS2pCLFFBQU0saUJBQVUsTUFBVixDQUFpQixVQUxOO0FBTWpCLFVBQVEsaUJBQVUsSUFBVixDQUFlLFVBTk47QUFPakIsY0FBWSxpQkFBVSxJQUFWLENBQWU7QUFQVixDQUFuQjs7SUFVcUIsYTs7Ozs7Ozs7Ozs7d0NBRUM7QUFDbEIsV0FBSyxPQUFMO0FBQ0Q7Ozt5Q0FFb0I7QUFDbkIsV0FBSyxPQUFMO0FBQ0Q7Ozs4QkFFUztBQUNSLFVBQU0sYUFBYSxpQkFBTyxnQkFBUCxJQUEyQixDQUE5QztBQUNBLFVBQU0sU0FBUyxLQUFLLElBQUwsQ0FBVSxPQUF6QjtBQUNBLFVBQU0sTUFBTSxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBWjtBQUNBLFVBQUksSUFBSjtBQUNBLFVBQUksS0FBSixDQUFVLFVBQVYsRUFBc0IsVUFBdEI7QUFDQSxVQUFNLFdBQVcsdUNBQWlCLEtBQUssS0FBdEIsQ0FBakI7QUFDQSxXQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCO0FBQ2hCLGVBQU8sS0FBSyxLQUFMLENBQVcsS0FERjtBQUVoQixnQkFBUSxLQUFLLEtBQUwsQ0FBVyxNQUZIO0FBR2hCLGdCQUhnQjtBQUloQixpQkFBUyxTQUFTLE9BSkY7QUFLaEIsbUJBQVcsU0FBUyxTQUxKO0FBTWhCLG9CQUFZLEtBQUssS0FBTCxDQUFXO0FBTlAsT0FBbEI7QUFRQSxVQUFJLE9BQUo7QUFDRDs7OzZCQUVRO0FBQ1AsVUFBTSxhQUFhLGlCQUFPLGdCQUFQLElBQTJCLENBQTlDO0FBQ0EsYUFDRTtBQUNFLGFBQUksU0FETjtBQUVFLGVBQVEsS0FBSyxLQUFMLENBQVcsS0FBWCxHQUFtQixVQUY3QjtBQUdFLGdCQUFTLEtBQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsVUFIL0I7QUFJRSxlQUFRO0FBQ04saUJBQVUsS0FBSyxLQUFMLENBQVcsS0FBckIsT0FETTtBQUVOLGtCQUFXLEtBQUssS0FBTCxDQUFXLE1BQXRCLE9BRk07QUFHTixvQkFBVSxVQUhKO0FBSU4seUJBQWUsTUFKVDtBQUtOLGdCQUFNLENBTEE7QUFNTixlQUFLO0FBTkMsU0FKVixHQURGO0FBY0Q7Ozs7OztrQkE1Q2tCLGE7OztBQStDckIsY0FBYyxTQUFkLEdBQTBCLFVBQTFCIiwiZmlsZSI6ImNhbnZhcy5yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgVmlld3BvcnRNZXJjYXRvciBmcm9tICd2aWV3cG9ydC1tZXJjYXRvci1wcm9qZWN0JztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmNvbnN0IFBST1BfVFlQRVMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsYXRpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsb25naXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgem9vbTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICByZWRyYXc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGlzRHJhZ2dpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc092ZXJsYXkgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuX3JlZHJhdygpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMuX3JlZHJhdygpO1xuICB9XG5cbiAgX3JlZHJhdygpIHtcbiAgICBjb25zdCBwaXhlbFJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnJlZnMub3ZlcmxheTtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5zY2FsZShwaXhlbFJhdGlvLCBwaXhlbFJhdGlvKTtcbiAgICBjb25zdCBtZXJjYXRvciA9IFZpZXdwb3J0TWVyY2F0b3IodGhpcy5wcm9wcyk7XG4gICAgdGhpcy5wcm9wcy5yZWRyYXcoe1xuICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgY3R4LFxuICAgICAgcHJvamVjdDogbWVyY2F0b3IucHJvamVjdCxcbiAgICAgIHVucHJvamVjdDogbWVyY2F0b3IudW5wcm9qZWN0LFxuICAgICAgaXNEcmFnZ2luZzogdGhpcy5wcm9wcy5pc0RyYWdnaW5nXG4gICAgfSk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBwaXhlbFJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICByZXR1cm4gKFxuICAgICAgPGNhbnZhc1xuICAgICAgICByZWY9XCJvdmVybGF5XCJcbiAgICAgICAgd2lkdGg9eyB0aGlzLnByb3BzLndpZHRoICogcGl4ZWxSYXRpbyB9XG4gICAgICAgIGhlaWdodD17IHRoaXMucHJvcHMuaGVpZ2h0ICogcGl4ZWxSYXRpbyB9XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIHdpZHRoOiBgJHt0aGlzLnByb3BzLndpZHRofXB4YCxcbiAgICAgICAgICBoZWlnaHQ6IGAke3RoaXMucHJvcHMuaGVpZ2h0fXB4YCxcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICB0b3A6IDBcbiAgICAgICAgfSB9Lz5cbiAgICApO1xuICB9XG59XG5cbkNhbnZhc092ZXJsYXkucHJvcFR5cGVzID0gUFJPUF9UWVBFUztcbiJdfQ==