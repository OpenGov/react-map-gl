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
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  latitude: _react.PropTypes.number.isRequired,
  longitude: _react.PropTypes.number.isRequired,
  zoom: _react.PropTypes.number.isRequired,
  points: _react.PropTypes.instanceOf(_immutable2.default.List).isRequired,
  isDragging: _react.PropTypes.bool.isRequired,
  keyAccessor: _react.PropTypes.func.isRequired,
  lngLatAccessor: _react.PropTypes.func.isRequired,
  onAddPoint: _react.PropTypes.func.isRequired,
  onUpdatePoint: _react.PropTypes.func.isRequired,
  renderPoint: _react.PropTypes.func.isRequired
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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DraggablePointsOverlay).call(this, props));

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

      var _props = this.props;
      var points = _props.points;
      var width = _props.width;
      var height = _props.height;
      var isDragging = _props.isDragging;
      var style = _props.style;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9kcmFnZ2FibGUtcG9pbnRzLnJlYWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLGFBQWE7QUFDakIsU0FBTyxpQkFBVSxNQUFWLENBQWlCLFVBRFA7QUFFakIsVUFBUSxpQkFBVSxNQUFWLENBQWlCLFVBRlI7QUFHakIsWUFBVSxpQkFBVSxNQUFWLENBQWlCLFVBSFY7QUFJakIsYUFBVyxpQkFBVSxNQUFWLENBQWlCLFVBSlg7QUFLakIsUUFBTSxpQkFBVSxNQUFWLENBQWlCLFVBTE47QUFNakIsVUFBUSxpQkFBVSxVQUFWLENBQXFCLG9CQUFVLElBQS9CLEVBQXFDLFVBTjVCO0FBT2pCLGNBQVksaUJBQVUsSUFBVixDQUFlLFVBUFY7QUFRakIsZUFBYSxpQkFBVSxJQUFWLENBQWUsVUFSWDtBQVNqQixrQkFBZ0IsaUJBQVUsSUFBVixDQUFlLFVBVGQ7QUFVakIsY0FBWSxpQkFBVSxJQUFWLENBQWUsVUFWVjtBQVdqQixpQkFBZSxpQkFBVSxJQUFWLENBQWUsVUFYYjtBQVlqQixlQUFhLGlCQUFVLElBQVYsQ0FBZTtBQVpYLENBQW5COztBQWVBLElBQU0sZ0JBQWdCO0FBQ3BCLGFBRG9CLHVCQUNSLEtBRFEsRUFDRDtBQUNqQixXQUFPLE1BQU0sR0FBTixDQUFVLElBQVYsQ0FBUDtBQUNELEdBSG1CO0FBSXBCLGdCQUpvQiwwQkFJTCxLQUpLLEVBSUU7QUFDcEIsV0FBTyxNQUFNLEdBQU4sQ0FBVSxVQUFWLEVBQXNCLE9BQXRCLEVBQVA7QUFDRCxHQU5tQjs7QUFPcEIsNEJBUG9CO0FBUXBCLCtCQVJvQjtBQVNwQiw2QkFUb0I7QUFVcEIsY0FBWTtB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bEIsU0FBNkIsS0FBN0IsQ0FKaEI7Y0FNSSxPQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLElBQXZCLFNBQWtDLEtBQWxDLEVBQXlDLEtBQXpDO0FBTkosYUFERjtBQVdELFdBYkQ7QUFGRjtBQWRGLE9BREY7QUFtQ0Q7Ozs7O2tCQWxGa0Isc0I7OztBQXFGckIsdUJBQXVCLFNBQXZCLEdBQW1DLFVBQW5DO0FBQ0EsdUJBQXVCLFlBQXZCLEdBQXNDLGFBQXRDIiwiZmlsZSI6ImRyYWdnYWJsZS1wb2ludHMucmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXMsIENvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcic7XG5cbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcblxuaW1wb3J0IHRyYW5zZm9ybSBmcm9tICdzdmctdHJhbnNmb3JtJztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG5vb3AgZnJvbSAnLi4vbm9vcCc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQge3JlbGF0aXZlTW91c2VQb3NpdGlvbiBhcyBtb3VzZX0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IFZpZXdwb3J0TWVyY2F0b3IgZnJvbSAndmlld3BvcnQtbWVyY2F0b3ItcHJvamVjdCc7XG5cbmNvbnN0IFBST1BfVFlQRVMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsYXRpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsb25naXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgem9vbTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBwb2ludHM6IFByb3BUeXBlcy5pbnN0YW5jZU9mKEltbXV0YWJsZS5MaXN0KS5pc1JlcXVpcmVkLFxuICBpc0RyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBrZXlBY2Nlc3NvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgbG5nTGF0QWNjZXNzb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uQWRkUG9pbnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uVXBkYXRlUG9pbnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlbmRlclBvaW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICBrZXlBY2Nlc3Nvcihwb2ludCkge1xuICAgIHJldHVybiBwb2ludC5nZXQoJ2lkJyk7XG4gIH0sXG4gIGxuZ0xhdEFjY2Vzc29yKHBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LmdldCgnbG9jYXRpb24nKS50b0FycmF5KCk7XG4gIH0sXG4gIG9uQWRkUG9pbnQ6IG5vb3AsXG4gIG9uVXBkYXRlUG9pbnQ6IG5vb3AsXG4gIHJlbmRlclBvaW50OiBub29wLFxuICBpc0RyYWdnaW5nOiBmYWxzZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJhZ2dhYmxlUG9pbnRzT3ZlcmxheSBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRyYWdnZWRQb2ludEtleTogbnVsbFxuICAgIH07XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uRHJhZ1N0YXJ0KHBvaW50LCBldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX29uRHJhZywgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbkRyYWdFbmQsIGZhbHNlKTtcbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnZ2VkUG9pbnRLZXk6IHRoaXMucHJvcHMua2V5QWNjZXNzb3IocG9pbnQpfSk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uRHJhZyhldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IHBpeGVsID0gbW91c2UodGhpcy5yZWZzLmNvbnRhaW5lciwgZXZlbnQpO1xuICAgIGNvbnN0IG1lcmNhdG9yID0gVmlld3BvcnRNZXJjYXRvcih0aGlzLnByb3BzKTtcbiAgICBjb25zdCBsbmdMYXQgPSBtZXJjYXRvci51bnByb2plY3QocGl4ZWwpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuc3RhdGUuZHJhZ2dlZFBvaW50S2V5O1xuICAgIHRoaXMucHJvcHMub25VcGRhdGVQb2ludCh7a2V5LCBsb2NhdGlvbjogbG5nTGF0fSk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uRHJhZ0VuZChldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX29uRHJhZywgZmFsc2UpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbkRyYWdFbmQsIGZhbHNlKTtcbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnZ2VkUG9pbnQ6IG51bGx9KTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfYWRkUG9pbnQoZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHBpeGVsID0gbW91c2UodGhpcy5yZWZzLmNvbnRhaW5lciwgZXZlbnQpO1xuICAgIGNvbnN0IG1lcmNhdG9yID0gVmlld3BvcnRNZXJjYXRvcih0aGlzLnByb3BzKTtcbiAgICB0aGlzLnByb3BzLm9uQWRkUG9pbnQobWVyY2F0b3IudW5wcm9qZWN0KHBpeGVsKSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3BvaW50cywgd2lkdGgsIGhlaWdodCwgaXNEcmFnZ2luZywgc3R5bGV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBtZXJjYXRvciA9IFZpZXdwb3J0TWVyY2F0b3IodGhpcy5wcm9wcyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmdcbiAgICAgICAgcmVmPVwiY29udGFpbmVyXCJcbiAgICAgICAgd2lkdGg9eyB3aWR0aCB9XG4gICAgICAgIGhlaWdodD17IGhlaWdodCB9XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdhbGwnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGN1cnNvcjogaXNEcmFnZ2luZyA/IGNvbmZpZy5DVVJTT1IuR1JBQkJJTkcgOiBjb25maWcuQ1VSU09SLkdSQUIsXG4gICAgICAgICAgLi4uc3R5bGVcbiAgICAgICAgfSB9XG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyB0aGlzLl9hZGRQb2ludCB9PlxuXG4gICAgICAgIDxnIHN0eWxlPXsge2N1cnNvcjogJ3BvaW50ZXInfSB9PlxuICAgICAgICB7XG4gICAgICAgICAgcG9pbnRzLm1hcCgocG9pbnQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwaXhlbCA9IG1lcmNhdG9yLnByb2plY3QodGhpcy5wcm9wcy5sbmdMYXRBY2Nlc3Nvcihwb2ludCkpO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGdcbiAgICAgICAgICAgICAgICBrZXk9eyBpbmRleCB9XG4gICAgICAgICAgICAgICAgc3R5bGU9eyB7cG9pbnRlckV2ZW50czogJ2FsbCd9IH1cbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm09eyB0cmFuc2Zvcm0oW3t0cmFuc2xhdGU6IHBpeGVsfV0pIH1cbiAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17IHRoaXMuX29uRHJhZ1N0YXJ0LmJpbmQodGhpcywgcG9pbnQpIH0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5yZW5kZXJQb2ludC5jYWxsKHRoaXMsIHBvaW50LCBwaXhlbClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICA8L2c+XG4gICAgICA8L3N2Zz5cbiAgICApO1xuICB9XG59XG5cbkRyYWdnYWJsZVBvaW50c092ZXJsYXkucHJvcFR5cGVzID0gUFJPUF9UWVBFUztcbkRyYWdnYWJsZVBvaW50c092ZXJsYXkuZGVmYXVsdFByb3BzID0gREVGQVVMVF9QUk9QUztcbiJdfQ==