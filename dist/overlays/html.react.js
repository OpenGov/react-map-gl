'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
  redraw: _react.PropTypes.func.isRequired,
  project: _react.PropTypes.func.isRequired,
  isDragging: _react.PropTypes.bool.isRequired
  // TODO: style
};

var HTMLOverlay = function (_Component) {
  _inherits(HTMLOverlay, _Component);

  function HTMLOverlay() {
    _classCallCheck(this, HTMLOverlay);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(HTMLOverlay).apply(this, arguments));
  }

  _createClass(HTMLOverlay, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var width = _props.width;
      var height = _props.height;
      var project = _props.project;
      var isDragging = _props.isDragging;

      var style = _extends({
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        width: width,
        height: height
      }, this.props.style);
      return _react2.default.createElement(
        'div',
        { ref: 'overlay', style: style },
        this.props.redraw({ width: width, height: height, project: project, isDragging: isDragging })
      );
    }
  }]);

  return HTMLOverlay;
}(_react.Component);

exports.default = HTMLOverlay;


HTMLOverlay.propTypes = PROP_TYPES;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9odG1sLnJlYWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLGFBQWE7QUFDakIsU0FBTyxpQkFBVSxNQUFWLENBQWlCLFVBRFA7QUFFakIsVUFBUSxpQkFBVSxNQUFWLENBQWlCLFVBRlI7QUFHakIsVUFBUSxpQkFBVSxJQUFWLENBQWUsVUFITjtBQUlqQixXQUFTLGlCQUFVLElBQVYsQ0FBZSxVQUpQO0FBS2pCLGNBQVksaUJBQVUsSUFBVixDQUFlOztBQUxWLENBQW5COztJQVNxQixXOzs7Ozs7Ozs7Ozs2QkFFVjtBQUFBLG1CQUNzQyxLQUFLLEtBRDNDO0FBQUEsVUFDQSxLQURBLFVBQ0EsS0FEQTtBQUFBLFVBQ08sTUFEUCxVQUNPLE1BRFA7QUFBQSxVQUNlLE9BRGYsVUFDZSxPQURmO0FBQUEsVUFDd0IsVUFEeEIsVUFDd0IsVUFEeEI7O0FBRVAsVUFBTTtBQUNKLGtCQUFVLFVBRE47QUFFSix1QkFBZSxNQUZYO0FBR0osY0FBTSxDQUhGO0FBSUosYUFBSyxDQUpEO0FBS0osb0JBTEk7QUFNSjtBQU5JLFNBT0QsS0FBSyxLQUFMLENBQVcsS0FQVixDQUFOO0FBU0EsYUFDRTtBQUFBO1FBQUEsRUFBSyxLQUFJLFNBQVQsRUFBbUIsT0FBUSxLQUEzQjtRQUNJLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsRUFBQyxZQUFELEVBQVEsY0FBUixFQUFnQixnQkFBaEIsRUFBeUIsc0JBQXpCLEVBQWxCO0FBREosT0FERjtBQUtEOzs7Ozs7a0JBbEJrQixXOzs7QUFxQnJCLFlBQVksU0FBWixHQUF3QixVQUF4QiIsImZpbGUiOiJodG1sLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzLCBDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHJlZHJhdzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcHJvamVjdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaXNEcmFnZ2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZFxuICAvLyBUT0RPOiBzdHlsZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFRNTE92ZXJsYXkgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodCwgcHJvamVjdCwgaXNEcmFnZ2luZ30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICAuLi50aGlzLnByb3BzLnN0eWxlXG4gICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiByZWY9XCJvdmVybGF5XCIgc3R5bGU9eyBzdHlsZSB9PlxuICAgICAgICB7IHRoaXMucHJvcHMucmVkcmF3KHt3aWR0aCwgaGVpZ2h0LCBwcm9qZWN0LCBpc0RyYWdnaW5nfSkgfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5IVE1MT3ZlcmxheS5wcm9wVHlwZXMgPSBQUk9QX1RZUEVTO1xuIl19