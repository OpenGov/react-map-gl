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
  width: _propTypes2.default.number.isRequired,
  height: _propTypes2.default.number.isRequired,
  latitude: _propTypes2.default.number.isRequired,
  longitude: _propTypes2.default.number.isRequired,
  zoom: _propTypes2.default.number.isRequired,
  redraw: _propTypes2.default.func.isRequired,
  isDragging: _propTypes2.default.bool.isRequired
};

var CanvasOverlay = function (_Component) {
  _inherits(CanvasOverlay, _Component);

  function CanvasOverlay() {
    _classCallCheck(this, CanvasOverlay);

    return _possibleConstructorReturn(this, (CanvasOverlay.__proto__ || Object.getPrototypeOf(CanvasOverlay)).apply(this, arguments));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9jYW52YXMucmVhY3QuanMiXSwibmFtZXMiOlsiUFJPUF9UWVBFUyIsIndpZHRoIiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImhlaWdodCIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiem9vbSIsInJlZHJhdyIsImZ1bmMiLCJpc0RyYWdnaW5nIiwiYm9vbCIsIkNhbnZhc092ZXJsYXkiLCJfcmVkcmF3IiwicGl4ZWxSYXRpbyIsIndpbmRvdyIsImRldmljZVBpeGVsUmF0aW8iLCJjYW52YXMiLCJyZWZzIiwib3ZlcmxheSIsImN0eCIsImdldENvbnRleHQiLCJzYXZlIiwic2NhbGUiLCJtZXJjYXRvciIsInByb3BzIiwicHJvamVjdCIsInVucHJvamVjdCIsInJlc3RvcmUiLCJwb3NpdGlvbiIsInBvaW50ZXJFdmVudHMiLCJsZWZ0IiwidG9wIiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFvQkE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7K2VBdkJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQU9BLElBQU1BLGFBQWE7QUFDakJDLFNBQU9DLG9CQUFVQyxNQUFWLENBQWlCQyxVQURQO0FBRWpCQyxVQUFRSCxvQkFBVUMsTUFBVixDQUFpQkMsVUFGUjtBQUdqQkUsWUFBVUosb0JBQVVDLE1BQVYsQ0FBaUJDLFVBSFY7QUFJakJHLGFBQVdMLG9CQUFVQyxNQUFWLENBQWlCQyxVQUpYO0FBS2pCSSxRQUFNTixvQkFBVUMsTUFBVixDQUFpQkMsVUFMTjtBQU1qQkssVUFBUVAsb0JBQVVRLElBQVYsQ0FBZU4sVUFOTjtBQU9qQk8sY0FBWVQsb0JBQVVVLElBQVYsQ0FBZVI7QUFQVixDQUFuQjs7SUFVcUJTLGE7Ozs7Ozs7Ozs7O3dDQUVDO0FBQ2xCLFdBQUtDLE9BQUw7QUFDRDs7O3lDQUVvQjtBQUNuQixXQUFLQSxPQUFMO0FBQ0Q7Ozs4QkFFUztBQUNSLFVBQU1DLGFBQWFDLGlCQUFPQyxnQkFBUCxJQUEyQixDQUE5QztBQUNBLFVBQU1DLFNBQVMsS0FBS0MsSUFBTCxDQUFVQyxPQUF6QjtBQUNBLFVBQU1DLE1BQU1ILE9BQU9JLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBWjtBQUNBRCxVQUFJRSxJQUFKO0FBQ0FGLFVBQUlHLEtBQUosQ0FBVVQsVUFBVixFQUFzQkEsVUFBdEI7QUFDQSxVQUFNVSxXQUFXLHVDQUFpQixLQUFLQyxLQUF0QixDQUFqQjtBQUNBLFdBQUtBLEtBQUwsQ0FBV2pCLE1BQVgsQ0FBa0I7QUFDaEJSLGVBQU8sS0FBS3lCLEtBQUwsQ0FBV3pCLEtBREY7QUFFaEJJLGdCQUFRLEtBQUtxQixLQUFMLENBQVdyQixNQUZIO0FBR2hCZ0IsZ0JBSGdCO0FBSWhCTSxpQkFBU0YsU0FBU0UsT0FKRjtBQUtoQkMsbUJBQVdILFNBQVNHLFNBTEo7QUFNaEJqQixvQkFBWSxLQUFLZSxLQUFMLENBQVdmO0FBTlAsT0FBbEI7QUFRQVUsVUFBSVEsT0FBSjtBQUNEOzs7NkJBRVE7QUFDUCxVQUFNZCxhQUFhQyxpQkFBT0MsZ0JBQVAsSUFBMkIsQ0FBOUM7QUFDQSxhQUNFO0FBQ0UsYUFBSSxTQUROO0FBRUUsZUFBUSxLQUFLUyxLQUFMLENBQVd6QixLQUFYLEdBQW1CYyxVQUY3QjtBQUdFLGdCQUFTLEtBQUtXLEtBQUwsQ0FBV3JCLE1BQVgsR0FBb0JVLFVBSC9CO0FBSUUsZUFBUTtBQUNOZCxpQkFBVSxLQUFLeUIsS0FBTCxDQUFXekIsS0FBckIsT0FETTtBQUVOSSxrQkFBVyxLQUFLcUIsS0FBTCxDQUFXckIsTUFBdEIsT0FGTTtBQUdOeUIsb0JBQVUsVUFISjtBQUlOQyx5QkFBZSxNQUpUO0FBS05DLGdCQUFNLENBTEE7QUFNTkMsZUFBSztBQU5DLFNBSlYsR0FERjtBQWNEOzs7O0VBNUN3Q0MsZ0I7O2tCQUF0QnJCLGE7OztBQStDckJBLGNBQWNzQixTQUFkLEdBQTBCbkMsVUFBMUIiLCJmaWxlIjoiY2FudmFzLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFZpZXdwb3J0TWVyY2F0b3IgZnJvbSAndmlld3BvcnQtbWVyY2F0b3ItcHJvamVjdCc7XG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5jb25zdCBQUk9QX1RZUEVTID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgbGF0aXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgbG9uZ2l0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHpvb206IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgcmVkcmF3OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBpc0RyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNPdmVybGF5IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9yZWRyYXcoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLl9yZWRyYXcoKTtcbiAgfVxuXG4gIF9yZWRyYXcoKSB7XG4gICAgY29uc3QgcGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5yZWZzLm92ZXJsYXk7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguc2NhbGUocGl4ZWxSYXRpbywgcGl4ZWxSYXRpbyk7XG4gICAgY29uc3QgbWVyY2F0b3IgPSBWaWV3cG9ydE1lcmNhdG9yKHRoaXMucHJvcHMpO1xuICAgIHRoaXMucHJvcHMucmVkcmF3KHtcbiAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgIGN0eCxcbiAgICAgIHByb2plY3Q6IG1lcmNhdG9yLnByb2plY3QsXG4gICAgICB1bnByb2plY3Q6IG1lcmNhdG9yLnVucHJvamVjdCxcbiAgICAgIGlzRHJhZ2dpbmc6IHRoaXMucHJvcHMuaXNEcmFnZ2luZ1xuICAgIH0pO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgcmV0dXJuIChcbiAgICAgIDxjYW52YXNcbiAgICAgICAgcmVmPVwib3ZlcmxheVwiXG4gICAgICAgIHdpZHRoPXsgdGhpcy5wcm9wcy53aWR0aCAqIHBpeGVsUmF0aW8gfVxuICAgICAgICBoZWlnaHQ9eyB0aGlzLnByb3BzLmhlaWdodCAqIHBpeGVsUmF0aW8gfVxuICAgICAgICBzdHlsZT17IHtcbiAgICAgICAgICB3aWR0aDogYCR7dGhpcy5wcm9wcy53aWR0aH1weGAsXG4gICAgICAgICAgaGVpZ2h0OiBgJHt0aGlzLnByb3BzLmhlaWdodH1weGAsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgdG9wOiAwXG4gICAgICAgIH0gfS8+XG4gICAgKTtcbiAgfVxufVxuXG5DYW52YXNPdmVybGF5LnByb3BUeXBlcyA9IFBST1BfVFlQRVM7XG4iXX0=