'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

var _mapboxGl = require('mapbox-gl');

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _noop = require('./noop');

var _noop2 = _interopRequireDefault(_noop);

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

var ua = typeof _window2.default.navigator !== 'undefined' ? _window2.default.navigator.userAgent.toLowerCase() : '';
var firefox = ua.indexOf('firefox') !== -1;

function mousePos(el, event) {
  var rect = el.getBoundingClientRect();
  event = event.touches ? event.touches[0] : event;
  return new _mapboxGl.Point(event.clientX - rect.left - el.clientLeft, event.clientY - rect.top - el.clientTop);
}

/* eslint-disable max-len */
// Portions of the code below originally from:
// https://github.com/mapbox/mapbox-gl-js/blob/master/js/ui/handler/scroll_zoom.js
/* eslint-enable max-len */

var PROP_TYPES = {
  width: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  height: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  onMouseDown: _react.PropTypes.func,
  onMouseDrag: _react.PropTypes.func,
  onMouseRotate: _react.PropTypes.func,
  onMouseUp: _react.PropTypes.func,
  onMouseMove: _react.PropTypes.func,
  onZoom: _react.PropTypes.func,
  onZoomEnd: _react.PropTypes.func
};

var DEFAULT_PROPS = {
  onMouseDown: _noop2.default,
  onMouseDrag: _noop2.default,
  onMouseRotate: _noop2.default,
  onMouseUp: _noop2.default,
  onMouseMove: _noop2.default,
  onZoom: _noop2.default,
  onZoomEnd: _noop2.default
};

var MapInteractions = (_class = function (_Component) {
  _inherits(MapInteractions, _Component);

  function MapInteractions(props) {
    _classCallCheck(this, MapInteractions);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MapInteractions).call(this, props));

    _this.state = {
      startPos: null,
      pos: null,
      mouseWheelPos: null
    };
    return _this;
  }

  _createClass(MapInteractions, [{
    key: '_getMousePos',
    value: function _getMousePos(event) {
      var el = this.refs.container;
      return mousePos(el, event);
    }
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(event) {
      var pos = this._getMousePos(event);
      this.setState({
        startPos: pos,
        pos: pos,
        metaKey: Boolean(event.metaKey)
      });
      this.props.onMouseDown({ pos: pos });
      _document2.default.addEventListener('mousemove', this._onMouseDrag, false);
      _document2.default.addEventListener('mouseup', this._onMouseUp, false);
    }
  }, {
    key: '_onMouseDrag',
    value: function _onMouseDrag(event) {
      var pos = this._getMousePos(event);
      this.setState({ pos: pos });
      if (this.state.metaKey) {
        var startPos = this.state.startPos;

        this.props.onMouseRotate({ pos: pos, startPos: startPos });
      } else {
        this.props.onMouseDrag({ pos: pos });
      }
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(event) {
      _document2.default.removeEventListener('mousemove', this._onMouseDrag, false);
      _document2.default.removeEventListener('mouseup', this._onMouseUp, false);
      var pos = this._getMousePos(event);
      this.setState({ pos: pos });
      this.props.onMouseUp({ pos: pos });
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(event) {
      var pos = this._getMousePos(event);
      this.props.onMouseMove({ pos: pos });
    }

    /* eslint-disable complexity, max-statements */

  }, {
    key: '_onWheel',
    value: function _onWheel(event) {
      // the following have been disabled because they eliminate
      // the ability to scroll selects/select-like elements in popups
      if (this.props.zoomDisabled) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();
      var value = event.deltaY;
      // Firefox doubles the values on retina screens...
      if (firefox && event.deltaMode === _window2.default.WheelEvent.DOM_DELTA_PIXEL) {
        value /= _window2.default.devicePixelRatio;
      }
      if (event.deltaMode === _window2.default.WheelEvent.DOM_DELTA_LINE) {
        value *= 40;
      }

      var type = this.state.mouseWheelType;
      var timeout = this.state.mouseWheelTimeout;
      var lastValue = this.state.mouseWheelLastValue;
      var time = this.state.mouseWheelTime;

      var now = (_window2.default.performance || Date).now();
      var timeDelta = now - (time || 0);

      var pos = this._getMousePos(event);
      time = now;

      if (value !== 0 && value % 4.000244140625 === 0) {
        // This one is definitely a mouse wheel event.
        type = 'wheel';
        // Normalize this value to match trackpad.
        value = Math.floor(value / 4);
      } else if (value !== 0 && Math.abs(value) < 4) {
        // This one is definitely a trackpad event because it is so small.
        type = 'trackpad';
      } else if (timeDelta > 400) {
        // This is likely a new scroll action.
        type = null;
        lastValue = value;

        // Start a timeout in case this was a singular event, and delay it by up
        // to 40ms.
        timeout = _window2.default.setTimeout(function setTimeout() {
          var _type = 'wheel';
          this._zoom(-this.state.mouseWheelLastValue, this.state.mouseWheelPos);
          this.setState({ mouseWheelType: _type });
        }.bind(this), 40);
      } else if (!this._type) {
        // This is a repeating event, but we don't know the type of event just
        // yet.
        // If the delta per time is small, we assume it's a fast trackpad;
        // otherwise we switch into wheel mode.
        type = Math.abs(timeDelta * value) < 200 ? 'trackpad' : 'wheel';

        // Make sure our delayed event isn't fired again, because we accumulate
        // the previous event (which was less than 40ms ago) into this event.
        if (timeout) {
          _window2.default.clearTimeout(timeout);
          timeout = null;
          value += lastValue;
        }
      }

      // Slow down zoom if shift key is held for more precise zooming
      if (event.shiftKey && value) {
        value = value / 4;
      }

      // Only fire the callback if we actually know what type of scrolling device
      // the user uses.
      if (type) {
        this._zoom(-value, pos);
      }

      this.setState({
        mouseWheelTime: time,
        mouseWheelPos: pos,
        mouseWheelType: type,
        mouseWheelTimeout: timeout,
        mouseWheelLastValue: lastValue
      });
    }
    /* eslint-enable complexity, max-statements */

  }, {
    key: '_zoom',
    value: function _zoom(delta, pos) {

      // Scale by sigmoid of scroll wheel delta.
      var scale = 2 / (1 + Math.exp(-Math.abs(delta / 100)));
      if (delta < 0 && scale !== 0) {
        scale = 1 / scale;
      }
      this.props.onZoom({ pos: pos, scale: scale });
      _window2.default.clearTimeout(this._zoomEndTimeout);
      this._zoomEndTimeout = _window2.default.setTimeout(function _setTimeout() {
        this.props.onZoomEnd();
      }.bind(this), 200);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          ref: 'container',
          onMouseMove: this._onMouseMove,
          onMouseDown: this._onMouseDown,
          onContextMenu: this._onMouseDown,
          onWheel: this._onWheel,
          style: {
            width: this.props.width,
            height: this.props.height,
            position: 'relative'
          } },
        this.props.children
      );
    }
  }]);

  return MapInteractions;
}(_react.Component), (_applyDecoratedDescriptor(_class.prototype, '_onMouseDown', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseDown'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseDrag'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseUp', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseUp'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onWheel', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onWheel'), _class.prototype)), _class);
exports.default = MapInteractions;


MapInteractions.propTypes = PROP_TYPES;
MapInteractions.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAtaW50ZXJhY3Rpb25zLnJlYWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxLQUFLLE9BQU8saUJBQU8sU0FBZCxLQUE0QixXQUE1QixHQUNULGlCQUFPLFNBQVAsQ0FBaUIsU0FBakIsQ0FBMkIsV0FBM0IsRUFEUyxHQUNrQyxFQUQ3QztBQUVBLElBQU0sVUFBVSxHQUFHLE9BQUgsQ0FBVyxTQUFYLE1BQTBCLENBQUMsQ0FBM0M7O0FBRUEsU0FBUyxRQUFULENBQWtCLEVBQWxCLEVBQXNCLEtBQXRCLEVBQTZCO0FBQzNCLE1BQU0sT0FBTyxHQUFHLHFCQUFILEVBQWI7QUFDQSxVQUFRLE1BQU0sT0FBTixHQUFnQixNQUFNLE9BQU4sQ0FBYyxDQUFkLENBQWhCLEdBQW1DLEtBQTNDO0FBQ0EsU0FBTyxvQkFDTCxNQUFNLE9BQU4sR0FBZ0IsS0FBSyxJQUFyQixHQUE0QixHQUFHLFVBRDFCLEVBRUwsTUFBTSxPQUFOLEdBQWdCLEtBQUssR0FBckIsR0FBMkIsR0FBRyxTQUZ6QixDQUFQO0FBSUQ7Ozs7Ozs7QUFPRCxJQUFNLGFBQWE7QUFDakIsU0FBTyxpQkFBVSxTQUFWLENBQW9CLENBQ3pCLGlCQUFVLE1BRGUsRUFFekIsaUJBQVUsTUFGZSxDQUFwQixDQURVO0FBS2pCLFVBQVEsaUJBQVUsU0FBVixDQUFvQixDQUMxQixpQkFBVSxNQURnQixFQUUxQixpQkFBVSxNQUZnQixDQUFwQixDQUxTO0FBU2pCLGVBQWEsaUJBQVUsSUFUTjtBQVVqQixlQUFhLGlCQUFVLElBVk47QUFXakIsaUJBQWUsaUJBQVUsSUFYUjtBQVlqQixhQUFXLGlCQUFVLElBWko7QUFhakIsZUFBYSxpQkFBVSxJQWJOO0FBY2pCLFVBQVEs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QVc7QUFaZixPQURGO0FBaUJEOzs7OztrQkFoTGtCLGU7OztBQW1MckIsZ0JBQWdCLFNBQWhCLEdBQTRCLFVBQTVCO0FBQ0EsZ0JBQWdCLFlBQWhCLEdBQStCLGFBQS9CIiwiZmlsZSI6Im1hcC1pbnRlcmFjdGlvbnMucmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXMsIENvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcic7XG5pbXBvcnQge1BvaW50fSBmcm9tICdtYXBib3gtZ2wnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IG5vb3AgZnJvbSAnLi9ub29wJztcblxuY29uc3QgdWEgPSB0eXBlb2Ygd2luZG93Lm5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgP1xuICB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpIDogJyc7XG5jb25zdCBmaXJlZm94ID0gdWEuaW5kZXhPZignZmlyZWZveCcpICE9PSAtMTtcblxuZnVuY3Rpb24gbW91c2VQb3MoZWwsIGV2ZW50KSB7XG4gIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgZXZlbnQgPSBldmVudC50b3VjaGVzID8gZXZlbnQudG91Y2hlc1swXSA6IGV2ZW50O1xuICByZXR1cm4gbmV3IFBvaW50KFxuICAgIGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQgLSBlbC5jbGllbnRMZWZ0LFxuICAgIGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcCAtIGVsLmNsaWVudFRvcFxuICApO1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG4vLyBQb3J0aW9ucyBvZiB0aGUgY29kZSBiZWxvdyBvcmlnaW5hbGx5IGZyb206XG4vLyBodHRwczovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC1nbC1qcy9ibG9iL21hc3Rlci9qcy91aS9oYW5kbGVyL3Njcm9sbF96b29tLmpzXG4vKiBlc2xpbnQtZW5hYmxlIG1heC1sZW4gKi9cblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5udW1iZXIsXG4gICAgUHJvcFR5cGVzLnN0cmluZ1xuICBdKSxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMubnVtYmVyLFxuICAgIFByb3BUeXBlcy5zdHJpbmdcbiAgXSksXG4gIG9uTW91c2VEb3duOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Nb3VzZURyYWc6IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlUm90YXRlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Nb3VzZVVwOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Nb3VzZU1vdmU6IFByb3BUeXBlcy5mdW5jLFxuICBvblpvb206IFByb3BUeXBlcy5mdW5jLFxuICBvblpvb21FbmQ6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICBvbk1vdXNlRG93bjogbm9vcCxcbiAgb25Nb3VzZURyYWc6IG5vb3AsXG4gIG9uTW91c2VSb3RhdGU6IG5vb3AsXG4gIG9uTW91c2VVcDogbm9vcCxcbiAgb25Nb3VzZU1vdmU6IG5vb3AsXG4gIG9uWm9vbTogbm9vcCxcbiAgb25ab29tRW5kOiBub29wXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBJbnRlcmFjdGlvbnMgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzdGFydFBvczogbnVsbCxcbiAgICAgIHBvczogbnVsbCxcbiAgICAgIG1vdXNlV2hlZWxQb3M6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgX2dldE1vdXNlUG9zKGV2ZW50KSB7XG4gICAgY29uc3QgZWwgPSB0aGlzLnJlZnMuY29udGFpbmVyO1xuICAgIHJldHVybiBtb3VzZVBvcyhlbCwgZXZlbnQpO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vbk1vdXNlRG93bihldmVudCkge1xuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldE1vdXNlUG9zKGV2ZW50KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHN0YXJ0UG9zOiBwb3MsXG4gICAgICBwb3MsXG4gICAgICBtZXRhS2V5OiBCb29sZWFuKGV2ZW50Lm1ldGFLZXkpXG4gICAgfSk7XG4gICAgdGhpcy5wcm9wcy5vbk1vdXNlRG93bih7cG9zfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZURyYWcsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25Nb3VzZVVwLCBmYWxzZSk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uTW91c2VEcmFnKGV2ZW50KSB7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Bvc30pO1xuICAgIGlmICh0aGlzLnN0YXRlLm1ldGFLZXkpIHtcbiAgICAgIGNvbnN0IHtzdGFydFBvc30gPSB0aGlzLnN0YXRlO1xuICAgICAgdGhpcy5wcm9wcy5vbk1vdXNlUm90YXRlKHtwb3MsIHN0YXJ0UG9zfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMub25Nb3VzZURyYWcoe3Bvc30pO1xuICAgIH1cbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Nb3VzZVVwKGV2ZW50KSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZURyYWcsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25Nb3VzZVVwLCBmYWxzZSk7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Bvc30pO1xuICAgIHRoaXMucHJvcHMub25Nb3VzZVVwKHtwb3N9KTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGhpcy5wcm9wcy5vbk1vdXNlTW92ZSh7cG9zfSk7XG4gIH1cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5LCBtYXgtc3RhdGVtZW50cyAqL1xuICBAYXV0b2JpbmRcbiAgX29uV2hlZWwoZXZlbnQpIHtcbiAgICAvLyB0aGUgZm9sbG93aW5nIGhhdmUgYmVlbiBkaXNhYmxlZCBiZWNhdXNlIHRoZXkgZWxpbWluYXRlXG4gICAgLy8gdGhlIGFiaWxpdHkgdG8gc2Nyb2xsIHNlbGVjdHMvc2VsZWN0LWxpa2UgZWxlbWVudHMgaW4gcG9wdXBzXG4gICAgaWYgKHRoaXMucHJvcHMuem9vbURpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgdmFsdWUgPSBldmVudC5kZWx0YVk7XG4gICAgLy8gRmlyZWZveCBkb3VibGVzIHRoZSB2YWx1ZXMgb24gcmV0aW5hIHNjcmVlbnMuLi5cbiAgICBpZiAoZmlyZWZveCAmJiBldmVudC5kZWx0YU1vZGUgPT09IHdpbmRvdy5XaGVlbEV2ZW50LkRPTV9ERUxUQV9QSVhFTCkge1xuICAgICAgdmFsdWUgLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgfVxuICAgIGlmIChldmVudC5kZWx0YU1vZGUgPT09IHdpbmRvdy5XaGVlbEV2ZW50LkRPTV9ERUxUQV9MSU5FKSB7XG4gICAgICB2YWx1ZSAqPSA0MDtcbiAgICB9XG5cbiAgICBsZXQgdHlwZSA9IHRoaXMuc3RhdGUubW91c2VXaGVlbFR5cGU7XG4gICAgbGV0IHRpbWVvdXQgPSB0aGlzLnN0YXRlLm1vdXNlV2hlZWxUaW1lb3V0O1xuICAgIGxldCBsYXN0VmFsdWUgPSB0aGlzLnN0YXRlLm1vdXNlV2hlZWxMYXN0VmFsdWU7XG4gICAgbGV0IHRpbWUgPSB0aGlzLnN0YXRlLm1vdXNlV2hlZWxUaW1lO1xuXG4gICAgY29uc3Qgbm93ID0gKHdpbmRvdy5wZXJmb3JtYW5jZSB8fCBEYXRlKS5ub3coKTtcbiAgICBjb25zdCB0aW1lRGVsdGEgPSBub3cgLSAodGltZSB8fCAwKTtcblxuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldE1vdXNlUG9zKGV2ZW50KTtcbiAgICB0aW1lID0gbm93O1xuXG4gICAgaWYgKHZhbHVlICE9PSAwICYmIHZhbHVlICUgNC4wMDAyNDQxNDA2MjUgPT09IDApIHtcbiAgICAgIC8vIFRoaXMgb25lIGlzIGRlZmluaXRlbHkgYSBtb3VzZSB3aGVlbCBldmVudC5cbiAgICAgIHR5cGUgPSAnd2hlZWwnO1xuICAgICAgLy8gTm9ybWFsaXplIHRoaXMgdmFsdWUgdG8gbWF0Y2ggdHJhY2twYWQuXG4gICAgICB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUgLyA0KTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlICE9PSAwICYmIE1hdGguYWJzKHZhbHVlKSA8IDQpIHtcbiAgICAgIC8vIFRoaXMgb25lIGlzIGRlZmluaXRlbHkgYSB0cmFja3BhZCBldmVudCBiZWNhdXNlIGl0IGlzIHNvIHNtYWxsLlxuICAgICAgdHlwZSA9ICd0cmFja3BhZCc7XG4gICAgfSBlbHNlIGlmICh0aW1lRGVsdGEgPiA0MDApIHtcbiAgICAgIC8vIFRoaXMgaXMgbGlrZWx5IGEgbmV3IHNjcm9sbCBhY3Rpb24uXG4gICAgICB0eXBlID0gbnVsbDtcbiAgICAgIGxhc3RWYWx1ZSA9IHZhbHVlO1xuXG4gICAgICAvLyBTdGFydCBhIHRpbWVvdXQgaW4gY2FzZSB0aGlzIHdhcyBhIHNpbmd1bGFyIGV2ZW50LCBhbmQgZGVsYXkgaXQgYnkgdXBcbiAgICAgIC8vIHRvIDQwbXMuXG4gICAgICB0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gc2V0VGltZW91dCgpIHtcbiAgICAgICAgY29uc3QgX3R5cGUgPSAnd2hlZWwnO1xuICAgICAgICB0aGlzLl96b29tKC10aGlzLnN0YXRlLm1vdXNlV2hlZWxMYXN0VmFsdWUsIHRoaXMuc3RhdGUubW91c2VXaGVlbFBvcyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe21vdXNlV2hlZWxUeXBlOiBfdHlwZX0pO1xuICAgICAgfS5iaW5kKHRoaXMpLCA0MCk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5fdHlwZSkge1xuICAgICAgLy8gVGhpcyBpcyBhIHJlcGVhdGluZyBldmVudCwgYnV0IHdlIGRvbid0IGtub3cgdGhlIHR5cGUgb2YgZXZlbnQganVzdFxuICAgICAgLy8geWV0LlxuICAgICAgLy8gSWYgdGhlIGRlbHRhIHBlciB0aW1lIGlzIHNtYWxsLCB3ZSBhc3N1bWUgaXQncyBhIGZhc3QgdHJhY2twYWQ7XG4gICAgICAvLyBvdGhlcndpc2Ugd2Ugc3dpdGNoIGludG8gd2hlZWwgbW9kZS5cbiAgICAgIHR5cGUgPSBNYXRoLmFicyh0aW1lRGVsdGEgKiB2YWx1ZSkgPCAyMDAgPyAndHJhY2twYWQnIDogJ3doZWVsJztcblxuICAgICAgLy8gTWFrZSBzdXJlIG91ciBkZWxheWVkIGV2ZW50IGlzbid0IGZpcmVkIGFnYWluLCBiZWNhdXNlIHdlIGFjY3VtdWxhdGVcbiAgICAgIC8vIHRoZSBwcmV2aW91cyBldmVudCAod2hpY2ggd2FzIGxlc3MgdGhhbiA0MG1zIGFnbykgaW50byB0aGlzIGV2ZW50LlxuICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIHZhbHVlICs9IGxhc3RWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTbG93IGRvd24gem9vbSBpZiBzaGlmdCBrZXkgaXMgaGVsZCBmb3IgbW9yZSBwcmVjaXNlIHpvb21pbmdcbiAgICBpZiAoZXZlbnQuc2hpZnRLZXkgJiYgdmFsdWUpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUgLyA0O1xuICAgIH1cblxuICAgIC8vIE9ubHkgZmlyZSB0aGUgY2FsbGJhY2sgaWYgd2UgYWN0dWFsbHkga25vdyB3aGF0IHR5cGUgb2Ygc2Nyb2xsaW5nIGRldmljZVxuICAgIC8vIHRoZSB1c2VyIHVzZXMuXG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIHRoaXMuX3pvb20oLXZhbHVlLCBwb3MpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW91c2VXaGVlbFRpbWU6IHRpbWUsXG4gICAgICBtb3VzZVdoZWVsUG9zOiBwb3MsXG4gICAgICBtb3VzZVdoZWVsVHlwZTogdHlwZSxcbiAgICAgIG1vdXNlV2hlZWxUaW1lb3V0OiB0aW1lb3V0LFxuICAgICAgbW91c2VXaGVlbExhc3RWYWx1ZTogbGFzdFZhbHVlXG4gICAgfSk7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5LCBtYXgtc3RhdGVtZW50cyAqL1xuXG4gIF96b29tKGRlbHRhLCBwb3MpIHtcblxuICAgIC8vIFNjYWxlIGJ5IHNpZ21vaWQgb2Ygc2Nyb2xsIHdoZWVsIGRlbHRhLlxuICAgIGxldCBzY2FsZSA9IDIgLyAoMSArIE1hdGguZXhwKC1NYXRoLmFicyhkZWx0YSAvIDEwMCkpKTtcbiAgICBpZiAoZGVsdGEgPCAwICYmIHNjYWxlICE9PSAwKSB7XG4gICAgICBzY2FsZSA9IDEgLyBzY2FsZTtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5vblpvb20oe3Bvcywgc2NhbGV9KTtcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuX3pvb21FbmRUaW1lb3V0KTtcbiAgICB0aGlzLl96b29tRW5kVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uIF9zZXRUaW1lb3V0KCkge1xuICAgICAgdGhpcy5wcm9wcy5vblpvb21FbmQoKTtcbiAgICB9LmJpbmQodGhpcyksIDIwMCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPVwiY29udGFpbmVyXCJcbiAgICAgICAgb25Nb3VzZU1vdmU9eyB0aGlzLl9vbk1vdXNlTW92ZSB9XG4gICAgICAgIG9uTW91c2VEb3duPXsgdGhpcy5fb25Nb3VzZURvd24gfVxuICAgICAgICBvbkNvbnRleHRNZW51PXsgdGhpcy5fb25Nb3VzZURvd24gfVxuICAgICAgICBvbldoZWVsPXsgdGhpcy5fb25XaGVlbCB9XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgfSB9PlxuXG4gICAgICAgIHsgdGhpcy5wcm9wcy5jaGlsZHJlbiB9XG5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTWFwSW50ZXJhY3Rpb25zLnByb3BUeXBlcyA9IFBST1BfVFlQRVM7XG5NYXBJbnRlcmFjdGlvbnMuZGVmYXVsdFByb3BzID0gREVGQVVMVF9QUk9QUztcbiJdfQ==