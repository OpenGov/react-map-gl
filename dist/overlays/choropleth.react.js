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
  width: _propTypes2.default.number.isRequired,
  height: _propTypes2.default.number.isRequired,
  latitude: _propTypes2.default.number.isRequired,
  longitude: _propTypes2.default.number.isRequired,
  zoom: _propTypes2.default.number.isRequired,
  isDragging: _propTypes2.default.bool.isRequired,
  renderWhileDragging: _propTypes2.default.bool.isRequired,
  globalOpacity: _propTypes2.default.number.isRequired,
  /**
    * An Immutable List of feature objects.
    */
  features: _propTypes2.default.instanceOf(_immutable2.default.List),
  colorDomain: _propTypes2.default.array,
  colorRange: _propTypes2.default.array.isRequired,
  valueAccessor: _propTypes2.default.func.isRequired
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

    return _possibleConstructorReturn(this, (ChoroplethOverlay.__proto__ || Object.getPrototypeOf(ChoroplethOverlay)).apply(this, arguments));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9jaG9yb3BsZXRoLnJlYWN0LmpzIl0sIm5hbWVzIjpbIlBST1BfVFlQRVMiLCJ3aWR0aCIsIlByb3BUeXBlcyIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJoZWlnaHQiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInpvb20iLCJpc0RyYWdnaW5nIiwiYm9vbCIsInJlbmRlcldoaWxlRHJhZ2dpbmciLCJnbG9iYWxPcGFjaXR5IiwiZmVhdHVyZXMiLCJpbnN0YW5jZU9mIiwiSW1tdXRhYmxlIiwiTGlzdCIsImNvbG9yRG9tYWluIiwiYXJyYXkiLCJjb2xvclJhbmdlIiwidmFsdWVBY2Nlc3NvciIsImZ1bmMiLCJERUZBVUxUX1BST1BTIiwiZmVhdHVyZSIsImdldCIsIkNob3JvcGxldGhPdmVybGF5IiwiX3JlZHJhdyIsInBpeGVsUmF0aW8iLCJ3aW5kb3ciLCJkZXZpY2VQaXhlbFJhdGlvIiwiY2FudmFzIiwicmVmcyIsIm92ZXJsYXkiLCJjdHgiLCJnZXRDb250ZXh0IiwibWVyY2F0b3IiLCJwcm9wcyIsInNhdmUiLCJzY2FsZSIsImNsZWFyUmVjdCIsInByb2plY3RQb2ludCIsImxvbiIsImxhdCIsInBvaW50IiwicHJvamVjdCIsInN0cmVhbSIsInRyYW5zZm9ybSIsImQzIiwiZ2VvIiwicGF0aCIsInByb2plY3Rpb24iLCJjb250ZXh0IiwiX2RyYXdGZWF0dXJlcyIsInJlc3RvcmUiLCJleHRlbnQiLCJ0b0FycmF5IiwiY29sb3JTY2FsZSIsImxpbmVhciIsImRvbWFpbiIsInJhbmdlIiwiY2xhbXAiLCJiZWdpblBhdGgiLCJzdHJva2VTdHlsZSIsImxpbmVXaWR0aCIsImZpbGxTdHlsZSIsImdlb21ldHJ5IiwidHlwZSIsImNvb3JkaW5hdGVzIiwidG9KUyIsImZpbGwiLCJzdHJva2UiLCJwb3NpdGlvbiIsInBvaW50ZXJFdmVudHMiLCJvcGFjaXR5IiwibGVmdCIsInRvcCIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIs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Ozs2QkFFUTtBQUNQLFVBQU0zQyxhQUFhQyxpQkFBT0MsZ0JBQVAsSUFBMkIsQ0FBOUM7QUFDQSxhQUNFO0FBQ0UsYUFBSSxTQUROO0FBRUUsZUFBUSxLQUFLTyxLQUFMLENBQVduQyxLQUFYLEdBQW1CMEIsVUFGN0I7QUFHRSxnQkFBUyxLQUFLUyxLQUFMLENBQVcvQixNQUFYLEdBQW9Cc0IsVUFIL0I7QUFJRSxlQUFRO0FBQ04xQixpQkFBVSxLQUFLbUMsS0FBTCxDQUFXbkMsS0FBckIsT0FETTtBQUVOSSxrQkFBVyxLQUFLK0IsS0FBTCxDQUFXL0IsTUFBdEIsT0FGTTtBQUdOa0Usb0JBQVUsVUFISjtBQUlOQyx5QkFBZSxNQUpUO0FBS05DLG1CQUFTLEtBQUtyQyxLQUFMLENBQVd4QixhQUxkO0FBTU44RCxnQkFBTSxDQU5BO0FBT05DLGVBQUs7QUFQQyxTQUpWLEdBREY7QUFlRDs7OztFQWhGNENDLGdCOztrQkFBMUJuRCxpQjs7O0FBbUZyQkEsa0JBQWtCb0QsU0FBbEIsR0FBOEI3RSxVQUE5QjtBQUNBeUIsa0JBQWtCcUQsWUFBbEIsR0FBaUN4RCxhQUFqQyIsImZpbGUiOiJjaG9yb3BsZXRoLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBWaWV3cG9ydE1lcmNhdG9yIGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkMyBmcm9tICdkMyc7XG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XG5cbmNvbnN0IFBST1BfVFlQRVMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsYXRpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsb25naXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgem9vbTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBpc0RyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICByZW5kZXJXaGlsZURyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBnbG9iYWxPcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogQW4gSW1tdXRhYmxlIExpc3Qgb2YgZmVhdHVyZSBvYmplY3RzLlxuICAgICovXG4gIGZlYXR1cmVzOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCksXG4gIGNvbG9yRG9tYWluOiBQcm9wVHlwZXMuYXJyYXksXG4gIGNvbG9yUmFuZ2U6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICB2YWx1ZUFjY2Vzc29yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICByZW5kZXJXaGlsZURyYWdnaW5nOiB0cnVlLFxuICBnbG9iYWxPcGFjaXR5OiAxLFxuICBjb2xvckRvbWFpbjogbnVsbCxcbiAgY29sb3JSYW5nZTogWycjRkZGRkZGJywgJyMxRkJBRDYnXSxcbiAgdmFsdWVBY2Nlc3NvcihmZWF0dXJlKSB7XG4gICAgcmV0dXJuIGZlYXR1cmUuZ2V0KCdwcm9wZXJ0aWVzJykuZ2V0KCd2YWx1ZScpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaG9yb3BsZXRoT3ZlcmxheSBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fcmVkcmF3KCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5fcmVkcmF3KCk7XG4gIH1cblxuICBfcmVkcmF3KCkge1xuICAgIGNvbnN0IHBpeGVsUmF0aW8gPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnJlZnMub3ZlcmxheTtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBtZXJjYXRvciA9IFZpZXdwb3J0TWVyY2F0b3IodGhpcy5wcm9wcyk7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5zY2FsZShwaXhlbFJhdGlvLCBwaXhlbFJhdGlvKTtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucHJvcHMud2lkdGgsIHRoaXMucHJvcHMuaGVpZ2h0KTtcblxuICAgIGZ1bmN0aW9uIHByb2plY3RQb2ludChsb24sIGxhdCkge1xuICAgICAgY29uc3QgcG9pbnQgPSBtZXJjYXRvci5wcm9qZWN0KFtsb24sIGxhdF0pO1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8taW52YWxpZC10aGlzICovXG4gICAgICB0aGlzLnN0cmVhbS5wb2ludChwb2ludFswXSwgcG9pbnRbMV0pO1xuICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJXaGlsZURyYWdnaW5nIHx8ICF0aGlzLnByb3BzLmlzRHJhZ2dpbmcpIHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGQzLmdlby50cmFuc2Zvcm0oe3BvaW50OiBwcm9qZWN0UG9pbnR9KTtcbiAgICAgIGNvbnN0IHBhdGggPSBkMy5nZW8ucGF0aCgpLnByb2plY3Rpb24odHJhbnNmb3JtKS5jb250ZXh0KGN0eCk7XG4gICAgICB0aGlzLl9kcmF3RmVhdHVyZXMoY3R4LCBwYXRoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIF9kcmF3RmVhdHVyZXMoY3R4LCBwYXRoKSB7XG4gICAgY29uc3Qge2ZlYXR1cmVzfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKCFmZWF0dXJlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb2xvckRvbWFpbiA9IHRoaXMucHJvcHMuY29sb3JEb21haW4gfHxcbiAgICAgIGQzLmV4dGVudChmZWF0dXJlcy50b0FycmF5KCksIHRoaXMucHJvcHMudmFsdWVBY2Nlc3Nvcik7XG5cbiAgICBjb25zdCBjb2xvclNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4oY29sb3JEb21haW4pXG4gICAgICAucmFuZ2UodGhpcy5wcm9wcy5jb2xvclJhbmdlKVxuICAgICAgLmNsYW1wKHRydWUpO1xuXG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIGZlYXR1cmVzKSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpJztcbiAgICAgIGN0eC5saW5lV2lkdGggPSAnMSc7XG4gICAgICBjdHguZmlsbFN0eWxlID0gY29sb3JTY2FsZSh0aGlzLnByb3BzLnZhbHVlQWNjZXNzb3IoZmVhdHVyZSkpO1xuICAgICAgY29uc3QgZ2VvbWV0cnkgPSBmZWF0dXJlLmdldCgnZ2VvbWV0cnknKTtcbiAgICAgIHBhdGgoe1xuICAgICAgICB0eXBlOiBnZW9tZXRyeS5nZXQoJ3R5cGUnKSxcbiAgICAgICAgY29vcmRpbmF0ZXM6IGdlb21ldHJ5LmdldCgnY29vcmRpbmF0ZXMnKS50b0pTKClcbiAgICAgIH0pO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgcmV0dXJuIChcbiAgICAgIDxjYW52YXNcbiAgICAgICAgcmVmPVwib3ZlcmxheVwiXG4gICAgICAgIHdpZHRoPXsgdGhpcy5wcm9wcy53aWR0aCAqIHBpeGVsUmF0aW8gfVxuICAgICAgICBoZWlnaHQ9eyB0aGlzLnByb3BzLmhlaWdodCAqIHBpeGVsUmF0aW8gfVxuICAgICAgICBzdHlsZT17IHtcbiAgICAgICAgICB3aWR0aDogYCR7dGhpcy5wcm9wcy53aWR0aH1weGAsXG4gICAgICAgICAgaGVpZ2h0OiBgJHt0aGlzLnByb3BzLmhlaWdodH1weGAsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgIG9wYWNpdHk6IHRoaXMucHJvcHMuZ2xvYmFsT3BhY2l0eSxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIHRvcDogMFxuICAgICAgICB9IH0vPlxuICAgICk7XG4gIH1cbn1cblxuQ2hvcm9wbGV0aE92ZXJsYXkucHJvcFR5cGVzID0gUFJPUF9UWVBFUztcbkNob3JvcGxldGhPdmVybGF5LmRlZmF1bHRQcm9wcyA9IERFRkFVTFRfUFJPUFM7XG4iXX0=