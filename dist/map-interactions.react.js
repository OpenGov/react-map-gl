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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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
  width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  height: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  onMouseDown: _propTypes2.default.func,
  onMouseDrag: _propTypes2.default.func,
  onMouseRotate: _propTypes2.default.func,
  onMouseUp: _propTypes2.default.func,
  onMouseMove: _propTypes2.default.func,
  onZoom: _propTypes2.default.func,
  onZoomEnd: _propTypes2.default.func
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

    var _this = _possibleConstructorReturn(this, (MapInteractions.__proto__ || Object.getPrototypeOf(MapInteractions)).call(this, props));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAtaW50ZXJhY3Rpb25zLnJlYWN0LmpzIl0sIm5hbWVzIjpbInVhIiwid2luZG93IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidG9Mb3dlckNhc2UiLCJmaXJlZm94IiwiaW5kZXhPZiIsIm1vdXNlUG9zIiwiZWwiLCJldmVudCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3VjaGVzIiwiUG9pbnQiLCJjbGllbnRYIiwibGVmdCIsImNsaWVudExlZnQiLCJjbGllbnRZIiwidG9wIiwiY2xpZW50VG9wIiwiUFJPUF9UWVBFUyIsIndpZHRoIiwiUHJvcFR5cGVzIiwib25lT2ZUeXBlIiwibnVtYmVyIiwic3RyaW5nIiwiaGVpZ2h0Iiwib25Nb3VzZURvd24iLCJmdW5jIiwib25Nb3VzZURyYWciLCJvbk1vdXNlUm90YXRlIiwib25Nb3VzZVVwIiwib25Nb3VzZU1vdmUiLCJvblpvb20iLCJvblpvb21FbmQiLCJERUZBVUxUX1BST1BTIiwibm9vcCIsIk1hcEludGVyYWN0aW9ucyIsInByb3BzIiwic3RhdGUiLCJzdGFydFBvcyIsInBvcyIsIm1vdXNlV2hlZWxQb3MiLCJyZWZzIiwiY29udGFpbmVyIiwiX2dldE1vdXNlUG9zIiwic2V0U3RhdGUiLCJtZXRhS2V5IiwiQm9vbGVhbiIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vdXNlRHJhZyIsIl9vbk1vdXNlVXAiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiem9vbURpc2FibGVkIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJ2YWx1ZSIsImRlbHRhWSIsImRlbHRhTW9kZSIsIldoZWVsRXZlbnQiLCJET01fREVMVEFfUElYRUwiLCJkZXZpY2VQaXhlbFJhdGlvIiwiRE9NX0RFTFRBX0xJTkUiLCJ0eXBlIiwibW91c2VXaGVlbFR5cGUiLCJ0aW1lb3V0IiwibW91c2VXaGVlbFRpbWVvdXQiLCJsYXN0VmFsdWUiLCJtb3VzZVdoZWVsTGFzdFZhbHVlIiwidGltZSIsIm1vdXNlV2hlZWxUaW1lIiwibm93IiwicGVyZm9ybWFuY2UiLCJEYXRlIiwidGltZURlbHRhIiwiTWF0aCIsImZsb29yIiwiYWJzIiwic2V0VGltZW91dCIsIl90eXBlIiwiX3pvb20iLCJiaW5kIiwiY2xlYXJUaW1lb3V0Iiwic2hpZnRLZXkiLCJkZWx0YSIsInNjYWxlIiwiZXhwIiwiX3pvb21FbmRUaW1lb3V0IiwiX3NldFRpbWVvdXQiLCJfb25Nb3VzZU1vdmUiLCJfb25Nb3VzZURvd24iLCJfb25XaGVlbCIsInBvc2l0aW9uIiwiY2hpbGRyZW4iLCJDb21wb25lbnQiLCJhdXRvYmluZCIsInByb3BUeXBlcyIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzJCQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxLQUFLLE9BQU9DLGlCQUFPQyxTQUFkLEtBQTRCLFdBQTVCLEdBQ1RELGlCQUFPQyxTQUFQLENBQWlCQyxTQUFqQixDQUEyQkMsV0FBM0IsRUFEUyxHQUNrQyxFQUQ3QztBQUVBLElBQU1DLFVBQVVMLEdBQUdNLE9BQUgsQ0FBVyxTQUFYLE1BQTBCLENBQUMsQ0FBM0M7O0FBRUEsU0FBU0MsUUFBVCxDQUFrQkMsRUFBbEIsRUFBc0JDLEtBQXRCLEVBQTZCO0FBQzNCLE1BQU1DLE9BQU9GLEdBQUdHLHFCQUFILEVBQWI7QUFDQUYsVUFBUUEsTUFBTUcsT0FBTixHQUFnQkgsTUFBTUcsT0FBTixDQUFjLENBQWQsQ0FBaEIsR0FBbUNILEtBQTNDO0FBQ0EsU0FBTyxJQUFJSSxlQUFKLENBQ0xKLE1BQU1LLE9BQU4sR0FBZ0JKLEtBQUtLLElBQXJCLEdBQTRC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Z0IxQ0MsMkIsc0pBYUFBLDJCLG9KQVlBQSwyQixvSkFTQUEsMkIsa0pBT0FBLDJCO2tCQXpEa0IzRCxlOzs7QUFtTHJCQSxnQkFBZ0I0RCxTQUFoQixHQUE0QjdFLFVBQTVCO0FBQ0FpQixnQkFBZ0I2RCxZQUFoQixHQUErQi9ELGFBQS9CIiwiZmlsZSI6Im1hcC1pbnRlcmFjdGlvbnMucmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJztcbmltcG9ydCB7UG9pbnR9IGZyb20gJ21hcGJveC1nbCc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgbm9vcCBmcm9tICcuL25vb3AnO1xuXG5jb25zdCB1YSA9IHR5cGVvZiB3aW5kb3cubmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyA/XG4gIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkgOiAnJztcbmNvbnN0IGZpcmVmb3ggPSB1YS5pbmRleE9mKCdmaXJlZm94JykgIT09IC0xO1xuXG5mdW5jdGlvbiBtb3VzZVBvcyhlbCwgZXZlbnQpIHtcbiAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBldmVudCA9IGV2ZW50LnRvdWNoZXMgPyBldmVudC50b3VjaGVzWzBdIDogZXZlbnQ7XG4gIHJldHVybiBuZXcgUG9pbnQoXG4gICAgZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdCAtIGVsLmNsaWVudExlZnQsXG4gICAgZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIC0gZWwuY2xpZW50VG9wXG4gICk7XG59XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbi8vIFBvcnRpb25zIG9mIHRoZSBjb2RlIGJlbG93IG9yaWdpbmFsbHkgZnJvbTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXBib3gvbWFwYm94LWdsLWpzL2Jsb2IvbWFzdGVyL2pzL3VpL2hhbmRsZXIvc2Nyb2xsX3pvb20uanNcbi8qIGVzbGludC1lbmFibGUgbWF4LWxlbiAqL1xuXG5jb25zdCBQUk9QX1RZUEVTID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLm51bWJlcixcbiAgICBQcm9wVHlwZXMuc3RyaW5nXG4gIF0pLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5udW1iZXIsXG4gICAgUHJvcFR5cGVzLnN0cmluZ1xuICBdKSxcbiAgb25Nb3VzZURvd246IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlRHJhZzogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uTW91c2VSb3RhdGU6IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlVXA6IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlTW92ZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uWm9vbTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uWm9vbUVuZDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIG9uTW91c2VEb3duOiBub29wLFxuICBvbk1vdXNlRHJhZzogbm9vcCxcbiAgb25Nb3VzZVJvdGF0ZTogbm9vcCxcbiAgb25Nb3VzZVVwOiBub29wLFxuICBvbk1vdXNlTW92ZTogbm9vcCxcbiAgb25ab29tOiBub29wLFxuICBvblpvb21FbmQ6IG5vb3Bcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcEludGVyYWN0aW9ucyBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHN0YXJ0UG9zOiBudWxsLFxuICAgICAgcG9zOiBudWxsLFxuICAgICAgbW91c2VXaGVlbFBvczogbnVsbFxuICAgIH07XG4gIH1cblxuICBfZ2V0TW91c2VQb3MoZXZlbnQpIHtcbiAgICBjb25zdCBlbCA9IHRoaXMucmVmcy5jb250YWluZXI7XG4gICAgcmV0dXJuIG1vdXNlUG9zKGVsLCBldmVudCk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uTW91c2VEb3duKGV2ZW50KSB7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc3RhcnRQb3M6IHBvcyxcbiAgICAgIHBvcyxcbiAgICAgIG1ldGFLZXk6IEJvb2xlYW4oZXZlbnQubWV0YUtleSlcbiAgICB9KTtcbiAgICB0aGlzLnByb3BzLm9uTW91c2VEb3duKHtwb3N9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9vbk1vdXNlRHJhZywgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbk1vdXNlVXAsIGZhbHNlKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Nb3VzZURyYWcoZXZlbnQpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7cG9zfSk7XG4gICAgaWYgKHRoaXMuc3RhdGUubWV0YUtleSkge1xuICAgICAgY29uc3Qge3N0YXJ0UG9zfSA9IHRoaXMuc3RhdGU7XG4gICAgICB0aGlzLnByb3BzLm9uTW91c2VSb3RhdGUoe3Bvcywgc3RhcnRQb3N9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5vbk1vdXNlRHJhZyh7cG9zfSk7XG4gICAgfVxuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vbk1vdXNlVXAoZXZlbnQpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9vbk1vdXNlRHJhZywgZmFsc2UpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbk1vdXNlVXAsIGZhbHNlKTtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7cG9zfSk7XG4gICAgdGhpcy5wcm9wcy5vbk1vdXNlVXAoe3Bvc30pO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vbk1vdXNlTW92ZShldmVudCkge1xuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldE1vdXNlUG9zKGV2ZW50KTtcbiAgICB0aGlzLnByb3BzLm9uTW91c2VNb3ZlKHtwb3N9KTtcbiAgfVxuXG4gIC8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHksIG1heC1zdGF0ZW1lbnRzICovXG4gIEBhdXRvYmluZFxuICBfb25XaGVlbChldmVudCkge1xuICAgIC8vIHRoZSBmb2xsb3dpbmcgaGF2ZSBiZWVuIGRpc2FibGVkIGJlY2F1c2UgdGhleSBlbGltaW5hdGVcbiAgICAvLyB0aGUgYWJpbGl0eSB0byBzY3JvbGwgc2VsZWN0cy9zZWxlY3QtbGlrZSBlbGVtZW50cyBpbiBwb3B1cHNcbiAgICBpZiAodGhpcy5wcm9wcy56b29tRGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCB2YWx1ZSA9IGV2ZW50LmRlbHRhWTtcbiAgICAvLyBGaXJlZm94IGRvdWJsZXMgdGhlIHZhbHVlcyBvbiByZXRpbmEgc2NyZWVucy4uLlxuICAgIGlmIChmaXJlZm94ICYmIGV2ZW50LmRlbHRhTW9kZSA9PT0gd2luZG93LldoZWVsRXZlbnQuRE9NX0RFTFRBX1BJWEVMKSB7XG4gICAgICB2YWx1ZSAvPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICB9XG4gICAgaWYgKGV2ZW50LmRlbHRhTW9kZSA9PT0gd2luZG93LldoZWVsRXZlbnQuRE9NX0RFTFRBX0xJTkUpIHtcbiAgICAgIHZhbHVlICo9IDQwO1xuICAgIH1cblxuICAgIGxldCB0eXBlID0gdGhpcy5zdGF0ZS5tb3VzZVdoZWVsVHlwZTtcbiAgICBsZXQgdGltZW91dCA9IHRoaXMuc3RhdGUubW91c2VXaGVlbFRpbWVvdXQ7XG4gICAgbGV0IGxhc3RWYWx1ZSA9IHRoaXMuc3RhdGUubW91c2VXaGVlbExhc3RWYWx1ZTtcbiAgICBsZXQgdGltZSA9IHRoaXMuc3RhdGUubW91c2VXaGVlbFRpbWU7XG5cbiAgICBjb25zdCBub3cgPSAod2luZG93LnBlcmZvcm1hbmNlIHx8IERhdGUpLm5vdygpO1xuICAgIGNvbnN0IHRpbWVEZWx0YSA9IG5vdyAtICh0aW1lIHx8IDApO1xuXG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRpbWUgPSBub3c7XG5cbiAgICBpZiAodmFsdWUgIT09IDAgJiYgdmFsdWUgJSA0LjAwMDI0NDE0MDYyNSA9PT0gMCkge1xuICAgICAgLy8gVGhpcyBvbmUgaXMgZGVmaW5pdGVseSBhIG1vdXNlIHdoZWVsIGV2ZW50LlxuICAgICAgdHlwZSA9ICd3aGVlbCc7XG4gICAgICAvLyBOb3JtYWxpemUgdGhpcyB2YWx1ZSB0byBtYXRjaCB0cmFja3BhZC5cbiAgICAgIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSAvIDQpO1xuICAgIH0gZWxzZSBpZiAodmFsdWUgIT09IDAgJiYgTWF0aC5hYnModmFsdWUpIDwgNCkge1xuICAgICAgLy8gVGhpcyBvbmUgaXMgZGVmaW5pdGVseSBhIHRyYWNrcGFkIGV2ZW50IGJlY2F1c2UgaXQgaXMgc28gc21hbGwuXG4gICAgICB0eXBlID0gJ3RyYWNrcGFkJztcbiAgICB9IGVsc2UgaWYgKHRpbWVEZWx0YSA+IDQwMCkge1xuICAgICAgLy8gVGhpcyBpcyBsaWtlbHkgYSBuZXcgc2Nyb2xsIGFjdGlvbi5cbiAgICAgIHR5cGUgPSBudWxsO1xuICAgICAgbGFzdFZhbHVlID0gdmFsdWU7XG5cbiAgICAgIC8vIFN0YXJ0IGEgdGltZW91dCBpbiBjYXNlIHRoaXMgd2FzIGEgc2luZ3VsYXIgZXZlbnQsIGFuZCBkZWxheSBpdCBieSB1cFxuICAgICAgLy8gdG8gNDBtcy5cbiAgICAgIHRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiBzZXRUaW1lb3V0KCkge1xuICAgICAgICBjb25zdCBfdHlwZSA9ICd3aGVlbCc7XG4gICAgICAgIHRoaXMuX3pvb20oLXRoaXMuc3RhdGUubW91c2VXaGVlbExhc3RWYWx1ZSwgdGhpcy5zdGF0ZS5tb3VzZVdoZWVsUG9zKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bW91c2VXaGVlbFR5cGU6IF90eXBlfSk7XG4gICAgICB9LmJpbmQodGhpcyksIDQwKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLl90eXBlKSB7XG4gICAgICAvLyBUaGlzIGlzIGEgcmVwZWF0aW5nIGV2ZW50LCBidXQgd2UgZG9uJ3Qga25vdyB0aGUgdHlwZSBvZiBldmVudCBqdXN0XG4gICAgICAvLyB5ZXQuXG4gICAgICAvLyBJZiB0aGUgZGVsdGEgcGVyIHRpbWUgaXMgc21hbGwsIHdlIGFzc3VtZSBpdCdzIGEgZmFzdCB0cmFja3BhZDtcbiAgICAgIC8vIG90aGVyd2lzZSB3ZSBzd2l0Y2ggaW50byB3aGVlbCBtb2RlLlxuICAgICAgdHlwZSA9IE1hdGguYWJzKHRpbWVEZWx0YSAqIHZhbHVlKSA8IDIwMCA/ICd0cmFja3BhZCcgOiAnd2hlZWwnO1xuXG4gICAgICAvLyBNYWtlIHN1cmUgb3VyIGRlbGF5ZWQgZXZlbnQgaXNuJ3QgZmlyZWQgYWdhaW4sIGJlY2F1c2Ugd2UgYWNjdW11bGF0ZVxuICAgICAgLy8gdGhlIHByZXZpb3VzIGV2ZW50ICh3aGljaCB3YXMgbGVzcyB0aGFuIDQwbXMgYWdvKSBpbnRvIHRoaXMgZXZlbnQuXG4gICAgICBpZiAodGltZW91dCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgdmFsdWUgKz0gbGFzdFZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNsb3cgZG93biB6b29tIGlmIHNoaWZ0IGtleSBpcyBoZWxkIGZvciBtb3JlIHByZWNpc2Ugem9vbWluZ1xuICAgIGlmIChldmVudC5zaGlmdEtleSAmJiB2YWx1ZSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZSAvIDQ7XG4gICAgfVxuXG4gICAgLy8gT25seSBmaXJlIHRoZSBjYWxsYmFjayBpZiB3ZSBhY3R1YWxseSBrbm93IHdoYXQgdHlwZSBvZiBzY3JvbGxpbmcgZGV2aWNlXG4gICAgLy8gdGhlIHVzZXIgdXNlcy5cbiAgICBpZiAodHlwZSkge1xuICAgICAgdGhpcy5fem9vbSgtdmFsdWUsIHBvcyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb3VzZVdoZWVsVGltZTogdGltZSxcbiAgICAgIG1vdXNlV2hlZWxQb3M6IHBvcyxcbiAgICAgIG1vdXNlV2hlZWxUeXBlOiB0eXBlLFxuICAgICAgbW91c2VXaGVlbFRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICBtb3VzZVdoZWVsTGFzdFZhbHVlOiBsYXN0VmFsdWVcbiAgICB9KTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHksIG1heC1zdGF0ZW1lbnRzICovXG5cbiAgX3pvb20oZGVsdGEsIHBvcykge1xuXG4gICAgLy8gU2NhbGUgYnkgc2lnbW9pZCBvZiBzY3JvbGwgd2hlZWwgZGVsdGEuXG4gICAgbGV0IHNjYWxlID0gMiAvICgxICsgTWF0aC5leHAoLU1hdGguYWJzKGRlbHRhIC8gMTAwKSkpO1xuICAgIGlmIChkZWx0YSA8IDAgJiYgc2NhbGUgIT09IDApIHtcbiAgICAgIHNjYWxlID0gMSAvIHNjYWxlO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLm9uWm9vbSh7cG9zLCBzY2FsZX0pO1xuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5fem9vbUVuZFRpbWVvdXQpO1xuICAgIHRoaXMuX3pvb21FbmRUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gX3NldFRpbWVvdXQoKSB7XG4gICAgICB0aGlzLnByb3BzLm9uWm9vbUVuZCgpO1xuICAgIH0uYmluZCh0aGlzKSwgMjAwKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9XCJjb250YWluZXJcIlxuICAgICAgICBvbk1vdXNlTW92ZT17IHRoaXMuX29uTW91c2VNb3ZlIH1cbiAgICAgICAgb25Nb3VzZURvd249eyB0aGlzLl9vbk1vdXNlRG93biB9XG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyB0aGlzLl9vbk1vdXNlRG93biB9XG4gICAgICAgIG9uV2hlZWw9eyB0aGlzLl9vbldoZWVsIH1cbiAgICAgICAgc3R5bGU9eyB7XG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9IH0+XG5cbiAgICAgICAgeyB0aGlzLnByb3BzLmNoaWxkcmVuIH1cblxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5NYXBJbnRlcmFjdGlvbnMucHJvcFR5cGVzID0gUFJPUF9UWVBFUztcbk1hcEludGVyYWN0aW9ucy5kZWZhdWx0UHJvcHMgPSBERUZBVUxUX1BST1BTO1xuIl19