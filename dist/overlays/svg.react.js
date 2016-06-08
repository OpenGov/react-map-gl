'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
  redraw: _react.PropTypes.func.isRequired,
  isDragging: _react.PropTypes.bool.isRequired
};

var SVGOverlay = function (_Component) {
  _inherits(SVGOverlay, _Component);

  function SVGOverlay() {
    _classCallCheck(this, SVGOverlay);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SVGOverlay).apply(this, arguments));
  }

  _createClass(SVGOverlay, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var width = _props.width;
      var height = _props.height;
      var isDragging = _props.isDragging;

      var style = _extends({
        pointerEvents: 'none',
        position: 'absolute',
        left: 0,
        top: 0
      }, this.props.style);
      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      var project = mercator.project;
      var unproject = mercator.unproject;


      return _react2.default.createElement(
        'svg',
        {
          ref: 'overlay',
          width: width,
          height: height,
          style: style },
        this.props.redraw({ width: width, height: height, project: project, unproject: unproject, isDragging: isDragging })
      );
    }
  }]);

  return SVGOverlay;
}(_react.Component);

exports.default = SVGOverlay;


SVGOverlay.propTypes = PROP_TYPES;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9zdmcucmVhY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxhQUFhO0FBQ2pCLFNBQU8saUJBQVUsTUFBVixDQUFpQixVQURQO0FBRWpCLFVBQVEsaUJBQVUsTUFBVixDQUFpQixVQUZSO0FBR2pCLFlBQVUsaUJBQVUsTUFBVixDQUFpQixVQUhWO0FBSWpCLGFBQVcsaUJBQVUsTUFBVixDQUFpQixVQUpYO0FBS2pCLFFBQU0saUJBQVUsTUFBVixDQUFpQixVQUxOO0FBTWpCLFVBQVEsaUJBQVUsSUFBVixDQUFlLFVBTk47QUFPakIsY0FBWSxpQkFBVSxJQUFWLENBQWU7QUFQVixDQUFuQjs7SUFVcUIsVTs7Ozs7Ozs7Ozs7NkJBQ1Y7QUFBQSxtQkFDNkIsS0FBSyxLQURsQztBQUFBLFVBQ0EsS0FEQSxVQUNBLEtBREE7QUFBQSxVQUNPLE1BRFAsVUFDTyxNQURQO0FBQUEsVUFDZSxVQURmLFVBQ2UsVUFEZjs7QUFFUCxVQUFNO0FBQ0osdUJBQWUsTUFEWDtBQUVKLGtCQUFVLFVBRk47QUFHSixjQUFNLENBSEY7QUFJSixhQUFLO0FBSkQsU0FLRCxLQUFLLEtBQUwsQ0FBVyxLQUxWLENBQU47QUFPQSxVQUFNLFdBQVcsdUNBQWlCLEtBQUssS0FBdEIsQ0FBakI7QUFUTyxVQVVBLE9BVkEsR0FVc0IsUUFWdEIsQ0FVQSxPQVZBO0FBQUEsVUFVUyxTQVZULEdBVXNCLFFBVnRCLENBVVMsU0FWVDs7O0FBWVAsYUFDRTtBQUFBO1FBQUE7QUFDRSxlQUFJLFNBRE47QUFFRSxpQkFBUSxLQUZWO0FBR0Usa0JBQVMsTUFIWDtBQUlFLGlCQUFRLEtBSlY7UUFNSSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEVBQUMsWUFBRCxFQUFRLGNBQVIsRUFBZ0IsZ0JBQWhCLEVBQXlCLG9CQUF6QixFQUFvQyxzQkFBcEMsRUFBbEI7QUFOSixPQURGO0FBV0Q7Ozs7OztrQkF4QmtCLFU7OztBQTJCckIsV0FBVyxTQUFYLEdBQXVCLFVBQXZCIiwiZmlsZSI6InN2Zy5yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgVmlld3BvcnRNZXJjYXRvciBmcm9tICd2aWV3cG9ydC1tZXJjYXRvci1wcm9qZWN0JztcblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGxhdGl0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGxvbmdpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB6b29tOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHJlZHJhdzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaXNEcmFnZ2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1ZHT3ZlcmxheSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodCwgaXNEcmFnZ2luZ30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgLi4udGhpcy5wcm9wcy5zdHlsZVxuICAgIH07XG4gICAgY29uc3QgbWVyY2F0b3IgPSBWaWV3cG9ydE1lcmNhdG9yKHRoaXMucHJvcHMpO1xuICAgIGNvbnN0IHtwcm9qZWN0LCB1bnByb2plY3R9ID0gbWVyY2F0b3I7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHN2Z1xuICAgICAgICByZWY9XCJvdmVybGF5XCJcbiAgICAgICAgd2lkdGg9eyB3aWR0aCB9XG4gICAgICAgIGhlaWdodD17IGhlaWdodCB9XG4gICAgICAgIHN0eWxlPXsgc3R5bGUgfT5cblxuICAgICAgICB7IHRoaXMucHJvcHMucmVkcmF3KHt3aWR0aCwgaGVpZ2h0LCBwcm9qZWN0LCB1bnByb2plY3QsIGlzRHJhZ2dpbmd9KSB9XG5cbiAgICAgIDwvc3ZnPlxuICAgICk7XG4gIH1cbn1cblxuU1ZHT3ZlcmxheS5wcm9wVHlwZXMgPSBQUk9QX1RZUEVTO1xuXG4iXX0=