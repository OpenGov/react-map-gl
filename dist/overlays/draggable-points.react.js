'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class; // Copyright (c) 2015 Uber Technologies, Inc.

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _svgTransform = require('svg-transform');

var _svgTransform2 = _interopRequireDefault(_svgTransform);

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _noop = require('../noop');

var _noop2 = _interopRequireDefault(_noop);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('../utils');

var _viewportMercatorProject = require('viewport-mercator-project');

var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var PROP_TYPES = {
  width: _propTypes2.default.number.isRequired,
  height: _propTypes2.default.number.isRequired,
  latitude: _propTypes2.default.number.isRequired,
  longitude: _propTypes2.default.number.isRequired,
  zoom: _propTypes2.default.number.isRequired,
  points: _propTypes2.default.instanceOf(_immutable2.default.List).isRequired,
  isDragging: _propTypes2.default.bool.isRequired,
  keyAccessor: _propTypes2.default.func.isRequired,
  lngLatAccessor: _propTypes2.default.func.isRequired,
  onAddPoint: _propTypes2.default.func.isRequired,
  onUpdatePoint: _propTypes2.default.func.isRequired,
  renderPoint: _propTypes2.default.func.isRequired
};

var DEFAULT_PROPS = {
  keyAccessor: function keyAccessor(point) {
    return point.get('id');
  },
  lngLatAccessor: function lngLatAccessor(point) {
    return point.get('location').toArray();
  },

  onAddPoint: _noop2.default,
  onUpdatePoint: _noop2.default,
  renderPoint: _noop2.default,
  isDragging: false
};

var DraggablePointsOverlay = (_class = function (_Component) {
  _inherits(DraggablePointsOverlay, _Component);

  function DraggablePointsOverlay(props) {
    _classCallCheck(this, DraggablePointsOverlay);

    var _this = _possibleConstructorReturn(this, (DraggablePointsOverlay.__proto__ || Object.getPrototypeOf(DraggablePointsOverlay)).call(this, props));

    _this.state = {
      draggedPointKey: null
    };
    return _this;
  }

  _createClass(DraggablePointsOverlay, [{
    key: '_onDragStart',
    value: function _onDragStart(point, event) {
      event.stopPropagation();
      _document2.default.addEventListener('mousemove', this._onDrag, false);
      _document2.default.addEventListener('mouseup', this._onDragEnd, false);
      this.setState({ draggedPointKey: this.props.keyAccessor(point) });
    }
  }, {
    key: '_onDrag',
    value: function _onDrag(event) {
      event.stopPropagation();
      var pixel = (0, _utils.relativeMousePosition)(this.refs.container, event);
      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      var lngLat = mercator.unproject(pixel);
      var key = this.state.draggedPointKey;
      this.props.onUpdatePoint({ key: key, location: lngLat });
    }
  }, {
    key: '_onDragEnd',
    value: function _onDragEnd(event) {
      event.stopPropagation();
      _document2.default.removeEventListener('mousemove', this._onDrag, false);
      _document2.default.removeEventListener('mouseup', this._onDragEnd, false);
      this.setState({ draggedPoint: null });
    }
  }, {
    key: '_addPoint',
    value: function _addPoint(event) {
      event.stopPropagation();
      event.preventDefault();
      var pixel = (0, _utils.relativeMousePosition)(this.refs.container, event);
      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      this.props.onAddPoint(mercator.unproject(pixel));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          points = _props.points,
          width = _props.width,
          height = _props.height,
          isDragging = _props.isDragging,
          style = _props.style;

      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      return _react2.default.createElement(
        'svg',
        {
          ref: 'container',
          width: width,
          height: height,
          style: _extends({
            pointerEvents: 'all',
            position: 'absolute',
            left: 0,
            top: 0,
            cursor: isDragging ? _config2.default.CURSOR.GRABBING : _config2.default.CURSOR.GRAB
          }, style),
          onContextMenu: this._addPoint },
        _react2.default.createElement(
          'g',
          { style: { cursor: 'pointer' } },
          points.map(function (point, index) {
            var pixel = mercator.project(_this2.props.lngLatAccessor(point));
            return _react2.default.createElement(
              'g',
              {
                key: index,
                style: { pointerEvents: 'all' },
                transform: (0, _svgTransform2.default)([{ translate: pixel }]),
                onMouseDown: _this2._onDragStart.bind(_this2, point) },
              _this2.props.renderPoint.call(_this2, point, pixel)
            );
          })
        )
      );
    }
  }]);

  return DraggablePointsOverlay;
}(_react.Component), (_applyDecoratedDescriptor(_class.prototype, '_onDragStart', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onDragStart'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onDrag'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onDragEnd', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onDragEnd'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_addPoint', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_addPoint'), _class.prototype)), _class);
exports.default = DraggablePointsOverlay;


DraggablePointsOverlay.propTypes = PROP_TYPES;
DraggablePointsOverlay.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9kcmFnZ2FibGUtcG9pbnRzLnJlYWN0LmpzIl0sIm5hbWVzIjpbIlBST1BfVFlQRVMiLCJ3aWR0aCIsIlByb3BUeXBlcyIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJoZWlnaHQiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInpvb20iLCJwb2ludHMiLCJpbnN0YW5jZU9mIiwiSW1tdXRhYmxlIiwiTGlzdCIsImlzRHJhZ2dpbmciLCJib29sIiwia2V5QWNjZXNzb3IiLCJmdW5jIiwibG5nTGF0QWNjZXNzb3IiLCJvbkFkZFBvaW50Iiwib25VcGRhdGVQb2ludCIsInJlbmRlclBvaW50IiwiREVGQVVMVF9QUk9QUyIsInBvaW50IiwiZ2V0IiwidG9BcnJheSIsIm5vb3AiLCJEcmFnZ2FibGVQb2ludHNPdmVybGF5IiwicHJvcHMiLCJzdGF0ZSIsImRyYWdnZWRQb2ludEtleSIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uRHJhZyIsIl9vbkRyYWdFbmQiLCJzZXRTdGF0ZSIsInBpeGVsIiwicmVmcyIsImNvbnRhaW5lciIsIm1lcmNhdG9yIiwibG5nTGF0IiwidW5wcm9qZWN0Iiwia2V5IiwibG9jYXRpb24iLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZHJhZ2dlZFBvaW50IiwicHJldmVudERlZmF1bHQiLCJzdHlsZSIsInBvaW50ZXJFdmVudHMiLCJwb3NpdGlvbiIsImxlZnQiLCJ0b3AiLCJjdXJzb3IiLCJjb25maWciLCJDVVJTT1IiLCJHUkFCQklORyIsIkdSQUIiLCJfYWRkUG9pbnQiLCJtYXAiLCJpbmRleCIsInByb2plY3QiLCJ0cmFuc2xhdGUiLCJfb25EcmFnU3RhcnQiLCJiaW5kIiwiY2FsbCIsIkNvbXBvbmVudCIsImF1dG9iaW5kIiwicHJvcFR5cGVzIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzsyQkFBQTs7QUFFQTtB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Q0FBakIsQ0FBZDtBQUNBLG1CQUNFO0FBQUE7QUFBQTtBQUNFLHFCQUFNc0MsS0FEUjtBQUVFLHVCQUFRLEVBQUNYLGVBQWUsS0FBaEIsRUFGVjtBQUdFLDJCQUFZLDRCQUFVLENBQUMsRUFBQ2EsV0FBV3pCLEtBQVosRUFBRCxDQUFWLENBSGQ7QUFJRSw2QkFBYyxPQUFLMEIsWUFBTCxDQUFrQkMsSUFBbEIsQ0FBdUIsTUFBdkIsRUFBNkIxQyxLQUE3QixDQUpoQjtBQU1JLHFCQUFLSyxLQUFMLENBQVdQLFdBQVgsQ0FBdUI2QyxJQUF2QixDQUE0QixNQUE1QixFQUFrQzNDLEtBQWxDLEVBQXlDZSxLQUF6QztBQU5KLGFBREY7QUFXRCxXQWJEO0FBRkY7QUFkRixPQURGO0FBbUNEOzs7O0VBbEZpRDZCLGdCLGlFQVNqREMsMkIsaUpBUUFBLDJCLCtJQVVBQSwyQixpSkFRQUEsMkI7a0JBbkNrQnpDLHNCOzs7QUFxRnJCQSx1QkFBdUIwQyxTQUF2QixHQUFtQ3BFLFVBQW5DO0FBQ0EwQix1QkFBdUIyQyxZQUF2QixHQUFzQ2hELGFBQXRDIiwiZmlsZSI6ImRyYWdnYWJsZS1wb2ludHMucmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJztcblxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xuXG5pbXBvcnQgdHJhbnNmb3JtIGZyb20gJ3N2Zy10cmFuc2Zvcm0nO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbm9vcCBmcm9tICcuLi9ub29wJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7cmVsYXRpdmVNb3VzZVBvc2l0aW9uIGFzIG1vdXNlfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgVmlld3BvcnRNZXJjYXRvciBmcm9tICd2aWV3cG9ydC1tZXJjYXRvci1wcm9qZWN0JztcblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGxhdGl0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGxvbmdpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB6b29tOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHBvaW50czogUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXG4gIGlzRHJhZ2dpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIGtleUFjY2Vzc29yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBsbmdMYXRBY2Nlc3NvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25BZGRQb2ludDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25VcGRhdGVQb2ludDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVuZGVyUG9pbnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIGtleUFjY2Vzc29yKHBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LmdldCgnaWQnKTtcbiAgfSxcbiAgbG5nTGF0QWNjZXNzb3IocG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuZ2V0KCdsb2NhdGlvbicpLnRvQXJyYXkoKTtcbiAgfSxcbiAgb25BZGRQb2ludDogbm9vcCxcbiAgb25VcGRhdGVQb2ludDogbm9vcCxcbiAgcmVuZGVyUG9pbnQ6IG5vb3AsXG4gIGlzRHJhZ2dpbmc6IGZhbHNlXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcmFnZ2FibGVQb2ludHNPdmVybGF5IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZHJhZ2dlZFBvaW50S2V5OiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25EcmFnU3RhcnQocG9pbnQsIGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25EcmFnLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uRHJhZ0VuZCwgZmFsc2UpO1xuICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdnZWRQb2ludEtleTogdGhpcy5wcm9wcy5rZXlBY2Nlc3Nvcihwb2ludCl9KTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25EcmFnKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgcGl4ZWwgPSBtb3VzZSh0aGlzLnJlZnMuY29udGFpbmVyLCBldmVudCk7XG4gICAgY29uc3QgbWVyY2F0b3IgPSBWaWV3cG9ydE1lcmNhdG9yKHRoaXMucHJvcHMpO1xuICAgIGNvbnN0IGxuZ0xhdCA9IG1lcmNhdG9yLnVucHJvamVjdChwaXhlbCk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5zdGF0ZS5kcmFnZ2VkUG9pbnRLZXk7XG4gICAgdGhpcy5wcm9wcy5vblVwZGF0ZVBvaW50KHtrZXksIGxvY2F0aW9uOiBsbmdMYXR9KTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25EcmFnRW5kKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25EcmFnLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uRHJhZ0VuZCwgZmFsc2UpO1xuICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdnZWRQb2ludDogbnVsbH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9hZGRQb2ludChldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgcGl4ZWwgPSBtb3VzZSh0aGlzLnJlZnMuY29udGFpbmVyLCBldmVudCk7XG4gICAgY29uc3QgbWVyY2F0b3IgPSBWaWV3cG9ydE1lcmNhdG9yKHRoaXMucHJvcHMpO1xuICAgIHRoaXMucHJvcHMub25BZGRQb2ludChtZXJjYXRvci51bnByb2plY3QocGl4ZWwpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7cG9pbnRzLCB3aWR0aCwgaGVpZ2h0LCBpc0RyYWdnaW5nLCBzdHlsZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IG1lcmNhdG9yID0gVmlld3BvcnRNZXJjYXRvcih0aGlzLnByb3BzKTtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2Z1xuICAgICAgICByZWY9XCJjb250YWluZXJcIlxuICAgICAgICB3aWR0aD17IHdpZHRoIH1cbiAgICAgICAgaGVpZ2h0PXsgaGVpZ2h0IH1cbiAgICAgICAgc3R5bGU9eyB7XG4gICAgICAgICAgcG9pbnRlckV2ZW50czogJ2FsbCcsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgY3Vyc29yOiBpc0RyYWdnaW5nID8gY29uZmlnLkNVUlNPUi5HUkFCQklORyA6IGNvbmZpZy5DVVJTT1IuR1JBQixcbiAgICAgICAgICAuLi5zdHlsZVxuICAgICAgICB9IH1cbiAgICAgICAgb25Db250ZXh0TWVudT17IHRoaXMuX2FkZFBvaW50IH0+XG5cbiAgICAgICAgPGcgc3R5bGU9eyB7Y3Vyc29yOiAncG9pbnRlcid9IH0+XG4gICAgICAgIHtcbiAgICAgICAgICBwb2ludHMubWFwKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBpeGVsID0gbWVyY2F0b3IucHJvamVjdCh0aGlzLnByb3BzLmxuZ0xhdEFjY2Vzc29yKHBvaW50KSk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8Z1xuICAgICAgICAgICAgICAgIGtleT17IGluZGV4IH1cbiAgICAgICAgICAgICAgICBzdHlsZT17IHtwb2ludGVyRXZlbnRzOiAnYWxsJ30gfVxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17IHRyYW5zZm9ybShbe3RyYW5zbGF0ZTogcGl4ZWx9XSkgfVxuICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXsgdGhpcy5fb25EcmFnU3RhcnQuYmluZCh0aGlzLCBwb2ludCkgfT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnJlbmRlclBvaW50LmNhbGwodGhpcywgcG9pbnQsIHBpeGVsKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIDwvZz5cbiAgICAgIDwvc3ZnPlxuICAgICk7XG4gIH1cbn1cblxuRHJhZ2dhYmxlUG9pbnRzT3ZlcmxheS5wcm9wVHlwZXMgPSBQUk9QX1RZUEVTO1xuRHJhZ2dhYmxlUG9pbnRzT3ZlcmxheS5kZWZhdWx0UHJvcHMgPSBERUZBVUxUX1BST1BTO1xuIl19