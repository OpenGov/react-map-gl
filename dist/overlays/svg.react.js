'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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
  redraw: _propTypes2.default.func.isRequired,
  isDragging: _propTypes2.default.bool.isRequired
};

var SVGOverlay = function (_Component) {
  _inherits(SVGOverlay, _Component);

  function SVGOverlay() {
    _classCallCheck(this, SVGOverlay);

    return _possibleConstructorReturn(this, (SVGOverlay.__proto__ || Object.getPrototypeOf(SVGOverlay)).apply(this, arguments));
  }

  _createClass(SVGOverlay, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          isDragging = _props.isDragging;

      var style = _extends({
        pointerEvents: 'none',
        position: 'absolute',
        left: 0,
        top: 0
      }, this.props.style);
      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      var project = mercator.project,
          unproject = mercator.unproject;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9zdmcucmVhY3QuanMiXSwibmFtZXMiOlsiUFJPUF9UWVBFUyIsIndpZHRoIiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImhlaWdodCIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiem9vbSIsInJlZHJhdyIsImZ1bmMiLCJpc0RyYWdnaW5nIiwiYm9vbCIsIlNWR092ZXJsYXkiLCJwcm9wcyIsInN0eWxlIiwicG9pbnRlckV2ZW50cyIsInBvc2l0aW9uIiwibGVmdCIsInRvcCIsIm1lcmNhdG9yIiwicHJvamVjdCIsInVucHJvamVjdCIsIkNvbXBvbmVudCIsInByb3BUeXBlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OytlQXRCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFNQSxJQUFNQSxhQUFhO0FBQ2pCQyxTQUFPQyxvQkFBVUMsTUFBVixDQUFpQkMsVUFEUDtBQUVqQkMsVUFBUUgsb0JBQVVDLE1BQVYsQ0FBaUJDLFVBRlI7QUFHakJFLFlBQVVKLG9CQUFVQyxNQUFWLENBQWlCQyxVQUhWO0FBSWpCRyxhQUFXTCxvQkFBVUMsTUFBVixDQUFpQkMsVUFKWDtBQUtqQkksUUFBTU4sb0JBQVVDLE1BQVYsQ0FBaUJDLFVBTE47QUFNakJLLFVBQVFQLG9CQUFVUSxJQUFWLENBQWVOLFVBTk47QUFPakJPLGNBQVlULG9CQUFVVSxJQUFWLENBQWVSO0FBUFYsQ0FBbkI7O0lBVXFCUyxVOzs7Ozs7Ozs7Ozs2QkFDVjtBQUFBLG1CQUM2QixLQUFLQyxLQURsQztBQUFBLFVBQ0FiLEtBREEsVUFDQUEsS0FEQTtBQUFBLFVBQ09JLE1BRFAsVUFDT0EsTUFEUDtBQUFBLFVBQ2VNLFVBRGYsVUFDZUEsVUFEZjs7QUFFUCxVQUFNSTtBQUNKQyx1QkFBZSxNQURYO0FBRUpDLGtCQUFVLFVBRk47QUFHSkMsY0FBTSxDQUhGO0FBSUpDLGFBQUs7QUFKRCxTQUtELEtBQUtMLEtBQUwsQ0FBV0MsS0FMVixDQUFOO0FBT0EsVUFBTUssV0FBVyx1Q0FBaUIsS0FBS04sS0FBdEIsQ0FBakI7QUFUTyxVQVVBTyxPQVZBLEdBVXNCRCxRQVZ0QixDQVVBQyxPQVZBO0FBQUEsVUFVU0MsU0FWVCxHQVVzQkYsUUFWdEIsQ0FVU0UsU0FWVDs7O0FBWVAsYUFDRTtBQUFBO0FBQUE7QUFDRSxlQUFJLFNBRE47QUFFRSxpQkFBUXJCLEtBRlY7QUFHRSxrQkFBU0ksTUFIWDtBQUlFLGlCQUFRVSxLQUpWO0FBTUksYUFBS0QsS0FBTCxDQUFXTCxNQUFYLENBQWtCLEVBQUNSLFlBQUQsRUFBUUksY0FBUixFQUFnQmdCLGdCQUFoQixFQUF5QkMsb0JBQXpCLEVBQW9DWCxzQkFBcEMsRUFBbEI7QUFOSixPQURGO0FBV0Q7Ozs7RUF4QnFDWSxnQjs7a0JBQW5CVixVOzs7QUEyQnJCQSxXQUFXVyxTQUFYLEdBQXVCeEIsVUFBdkIiLCJmaWxlIjoic3ZnLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFZpZXdwb3J0TWVyY2F0b3IgZnJvbSAndmlld3BvcnQtbWVyY2F0b3ItcHJvamVjdCc7XG5cbmNvbnN0IFBST1BfVFlQRVMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsYXRpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsb25naXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgem9vbTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICByZWRyYXc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGlzRHJhZ2dpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNWR092ZXJsYXkgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3dpZHRoLCBoZWlnaHQsIGlzRHJhZ2dpbmd9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgbGVmdDogMCxcbiAgICAgIHRvcDogMCxcbiAgICAgIC4uLnRoaXMucHJvcHMuc3R5bGVcbiAgICB9O1xuICAgIGNvbnN0IG1lcmNhdG9yID0gVmlld3BvcnRNZXJjYXRvcih0aGlzLnByb3BzKTtcbiAgICBjb25zdCB7cHJvamVjdCwgdW5wcm9qZWN0fSA9IG1lcmNhdG9yO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmdcbiAgICAgICAgcmVmPVwib3ZlcmxheVwiXG4gICAgICAgIHdpZHRoPXsgd2lkdGggfVxuICAgICAgICBoZWlnaHQ9eyBoZWlnaHQgfVxuICAgICAgICBzdHlsZT17IHN0eWxlIH0+XG5cbiAgICAgICAgeyB0aGlzLnByb3BzLnJlZHJhdyh7d2lkdGgsIGhlaWdodCwgcHJvamVjdCwgdW5wcm9qZWN0LCBpc0RyYWdnaW5nfSkgfVxuXG4gICAgICA8L3N2Zz5cbiAgICApO1xuICB9XG59XG5cblNWR092ZXJsYXkucHJvcFR5cGVzID0gUFJPUF9UWVBFUztcblxuIl19