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
  redraw: _propTypes2.default.func.isRequired,
  project: _propTypes2.default.func.isRequired,
  isDragging: _propTypes2.default.bool.isRequired
  // TODO: style
};

var HTMLOverlay = function (_Component) {
  _inherits(HTMLOverlay, _Component);

  function HTMLOverlay() {
    _classCallCheck(this, HTMLOverlay);

    return _possibleConstructorReturn(this, (HTMLOverlay.__proto__ || Object.getPrototypeOf(HTMLOverlay)).apply(this, arguments));
  }

  _createClass(HTMLOverlay, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          project = _props.project,
          isDragging = _props.isDragging;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9odG1sLnJlYWN0LmpzIl0sIm5hbWVzIjpbIlBST1BfVFlQRVMiLCJ3aWR0aCIsIlByb3BUeXBlcyIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJoZWlnaHQiLCJyZWRyYXciLCJmdW5jIiwicHJvamVjdCIsImlzRHJhZ2dpbmciLCJib29sIiwiSFRNTE92ZXJsYXkiLCJwcm9wcyIsInN0eWxlIiwicG9zaXRpb24iLCJwb2ludGVyRXZlbnRzIiwibGVmdCIsInRvcCIsIkNvbXBvbmVudCIsInByb3BUeXBlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFyQkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBS0EsSUFBTUEsYUFBYTtBQUNqQkMsU0FBT0Msb0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFA7QUFFakJDLFVBQVFILG9CQUFVQyxNQUFWLENBQWlCQyxVQUZSO0FBR2pCRSxVQUFRSixvQkFBVUssSUFBVixDQUFlSCxVQUhOO0FBSWpCSSxXQUFTTixvQkFBVUssSUFBVixDQUFlSCxVQUpQO0FBS2pCSyxjQUFZUCxvQkFBVVEsSUFBVixDQUFlTjtBQUMzQjtBQU5pQixDQUFuQjs7SUFTcUJPLFc7Ozs7Ozs7Ozs7OzZCQUVWO0FBQUEsbUJBQ3NDLEtBQUtDLEtBRDNDO0FBQUEsVUFDQVgsS0FEQSxVQUNBQSxLQURBO0FBQUEsVUFDT0ksTUFEUCxVQUNPQSxNQURQO0FBQUEsVUFDZUcsT0FEZixVQUNlQSxPQURmO0FBQUEsVUFDd0JDLFVBRHhCLFVBQ3dCQSxVQUR4Qjs7QUFFUCxVQUFNSTtBQUNKQyxrQkFBVSxVQUROO0FBRUpDLHVCQUFlLE1BRlg7QUFHSkMsY0FBTSxDQUhGO0FBSUpDLGFBQUssQ0FKRDtBQUtKaEIsb0JBTEk7QUFNSkk7QUFOSSxTQU9ELEtBQUtPLEtBQUwsQ0FBV0MsS0FQVixDQUFOO0FBU0EsYUFDRTtBQUFBO0FBQUEsVUFBSyxLQUFJLFNBQVQsRUFBbUIsT0FBUUEsS0FBM0I7QUFDSSxhQUFLRCxLQUFMLENBQVdOLE1BQVgsQ0FBa0IsRUFBQ0wsWUFBRCxFQUFRSSxjQUFSLEVBQWdCRyxnQkFBaEIsRUFBeUJDLHNCQUF6QixFQUFsQjtBQURKLE9BREY7QUFLRDs7OztFQWxCc0NTLGdCOztrQkFBcEJQLFc7OztBQXFCckJBLFlBQVlRLFNBQVosR0FBd0JuQixVQUF4QiIsImZpbGUiOiJodG1sLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5jb25zdCBQUk9QX1RZUEVTID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgcmVkcmF3OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBwcm9qZWN0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBpc0RyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG4gIC8vIFRPRE86IHN0eWxlXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIVE1MT3ZlcmxheSBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0LCBwcm9qZWN0LCBpc0RyYWdnaW5nfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICB0b3A6IDAsXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIC4uLnRoaXMucHJvcHMuc3R5bGVcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHJlZj1cIm92ZXJsYXlcIiBzdHlsZT17IHN0eWxlIH0+XG4gICAgICAgIHsgdGhpcy5wcm9wcy5yZWRyYXcoe3dpZHRoLCBoZWlnaHQsIHByb2plY3QsIGlzRHJhZ2dpbmd9KSB9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkhUTUxPdmVybGF5LnByb3BUeXBlcyA9IFBST1BfVFlQRVM7XG4iXX0=