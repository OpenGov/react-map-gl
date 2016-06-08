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
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAtaW50ZXJhY3Rpb25zLnJlYWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxLQUFLLE9BQU8saUJBQU8sU0FBZCxLQUE0QixXQUE1QixHQUNULGlCQUFPLFNBQVAsQ0FBaUIsU0FBakIsQ0FBMkIsV0FBM0IsRUFEUyxHQUNrQyxFQUQ3QztBQUVBLElBQU0sVUFBVSxHQUFHLE9BQUgsQ0FBVyxTQUFYLE1BQTBCLENBQUMsQ0FBM0M7O0FBRUEsU0FBUyxRQUFULENBQWtCLEVBQWxCLEVBQXNCLEtBQXRCLEVBQTZCO0FBQzNCLE1BQU0sT0FBTyxHQUFHLHFCQUFILEVBQWI7QUFDQSxVQUFRLE1BQU0sT0FBTixHQUFnQixNQUFNLE9BQU4sQ0FBYyxDQUFkLENBQWhCLEdBQW1DLEtBQTNDO0FBQ0EsU0FBTyxvQkFDTCxNQUFNLE9BQU4sR0FBZ0IsS0FBSyxJQUFyQixHQUE0QixHQUFHLFVBRDFCLEVBRUwsTUFBTSxPQUFOLEdBQWdCLEtBQUssR0FBckIsR0FBMkIsR0FBRyxTQUZ6QixDQUFQO0FBSUQ7Ozs7Ozs7QUFPRCxJQUFNLGFBQWE7QUFDakIsU0FBTyxpQkFBVSxNQUFWLENBQWlCLFVBRFA7QUFFakIsVUFBUSxpQkFBVSxNQUFWLENBQWlCLFVBRlI7QUFHakIsZUFBYSxpQkFBVSxJQUhOO0FBSWpCLGVBQWEsaUJBQVUsSUFKTjtBQUtqQixpQkFBZSxpQkFBVSxJQUxSO0FBTWpCLGFBQVcsaUJBQVUsSUFOSjtBQU9qQixlQUFhLGlCQUFVLElBUE47QUFRakIsVUFBUSxpQkFBVSxJQVJEO0FBU2pCLGFBQVcsaUJBQVU7QUFUSixDQUFuQjs7QUFZQSxJQUFNLGdCQUFnQjtBQUNwQiw2QkFEb0I7QUFFcEIsNkJBRm9CO0FBR3BCLCtCQUhvQjtBQUlwQiwyQkFKb0I7QUFLcEIsNkJBTG9CO0FBTXBCLHdCQU5vQjtBQU9wQjtBQVBvQixDQUF0Qjs7SUFVcUIsZTs7O0FBRW5CLDJCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxtR0FDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGdCQUFVLElBREM7QUFFWCxXQUFLLElBRk07QUFHWCxxQkFBZTtBQUhKLEtBQWI7QUFGaUI7QUFPbEI7Ozs7aUNBRVksSyxFQUFPO0FBQ2xCLFVBQU0sS0FBSyxLQUFLLElBQUwsQ0FBVSxTQUFyQjtBQUNBLGFBQU8sU0FBUyxFQUFULEVBQWEsS0FBYixDQUFQO0FBQ0Q7OztpQ0FHWSxLLEVBQU87QUFDbEIsVUFBTSxNQUFNLEtBQUssWUFBTCxDQUFrQixLQUFsQixDQUFaO0FBQ0EsV0FBSyxRQUFMLENBQWM7QUFDWixrQkFBVSxHQURFO0FBRVosZ0JBRlk7QUFHWixpQkFBUyxRQUFRLE1BQU0sT0FBZDtBQUhHLE9BQWQ7QUFLQSxXQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLEVBQUMsUUFBRCxFQUF2QjtBQUNBLHlCQUFTLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDLEtBQUssWUFBNUMsRUFBMEQsS0FBMUQ7QUFDQSx5QkFBUyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxLQUFLLFVBQTFDLEVBQXNELEtBQXREO0FBQ0Q7OztpQ0FHWSxLLEVBQU87QUFDbEIsVUFBTSxNQUFNLEtBQUssWUFBTCxDQUFrQixLQUFsQixDQUFaO0FBQ0EsV0FBSyxRQUFMLENBQWMsRUFBQyxRQUFELEVBQWQ7QUFDQSxVQUFJLEtBQUssS0FBTCxDQUFXLE9BQWYsRUFBd0I7QUFBQSxZQUNmLFFBRGUsR0FDSCxLQUFLLEtBREYsQ0FDZixRQURlOztBQUV0QixhQUFLLEtBQUwsQ0FBVyxhQUFYLENBQXlCLEVBQUMsUUFBRCxFQUFNLGtCQUFOLEVBQXpCO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixFQUFDLFFBQUQsRUFBdkI7QUFDRDtBQUNGOzs7K0JBR1UsSyxFQUFPO0FBQ2hCLHlCQUFTLG1CQUFULENBQTZCLFdBQTdCLEVBQTBDLEtBQUssWUFBL0MsRUFBNkQsS0FBN0Q7QUFDQSx5QkFBUyxtQkFBVCxDQUE2QixTQUE3QixFQUF3QyxLQUFLLFVBQTdDLEVBQXlELEtBQXpEO0FBQ0EsVUFBTSxNQUFNLEtBQUssWUFBTCxDQUFrQixLQUFsQixDQUFaO0FBQ0EsV0FBSyxRQUFMLENBQWMsRUFBQyxRQUFELEVBQWQ7QUFDQSxXQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLEVBQUMsUUFBRCxFQUFyQjtBQUNEOzs7aUNBR1ksSyxFQUFPO0FBQ2xCLFVBQU0sTUFBTSxLQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBWjtBQUNBLFdBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsRUFBQyxRQUFELEVBQXZCO0FBQ0Q7Ozs7Ozs2QkFJUSxLLEVBQU87QUFDZCxZQUFNLGVBQU47QUFDQSxZQUFNLGNBQU47QUFDQSxVQUFJLFFBQVEsTUFBTSxNQUFsQjs7QUFFQSxVQUFJLFdBQVcsTUFBTSxTQUFOLEtBQW9CLGlCQUFPLFVBQVAsQ0FBa0IsZUFBckQsRUFBc0U7QUFDcEUsaUJBQVMsaUJBQU8sZ0JBQWhCO0FBQ0Q7QUFDRCxVQUFJLE1BQU0sU0FBTixLQUFvQixpQkFBTyxVQUFQLENBQWtCLGNBQTFDLEVBQTBEO0FBQ3hELGlCQUFTLEVBQVQ7QUFDRDs7QUFFRCxVQUFJLE9BQU8sS0FBSyxLQUFMLENBQVcsY0FBdEI7QUFDQSxVQUFJLFVBQVUsS0FBSyxLQUFMLENBQVcsaUJBQXpCO0FBQ0EsVUFBSSxZQUFZLEtBQUssS0FBTCxDQUFXLG1CQUEzQjtBQUNBLFVBQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxjQUF0Qjs7QUFFQSxVQUFNLE1BQU0sQ0FBQyxpQkFBTyxXQUFQLElBQXNCLElBQXZCLEVBQTZCLEdBQTdCLEVBQVo7QUFDQSxVQUFNLFlBQVksT0FBTyxRQUFRLENBQWYsQ0FBbEI7O0FBRUEsVUFBTSxNQUFNLEtBQUssWUFBTCxDQUFrQixLQUFsQixDQUFaO0FBQ0EsYUFBTyxHQUFQOztBQUVBLFVBQUksVUFBVSxDQUFWLElBQWUsUUFBUSxjQUFSLEtBQTJCLENBQTlDLEVBQWlEOztBQUUvQyxlQUFPLE9BQVA7O0FBRUEsZ0JBQVEsS0FBSyxLQUFMLENBQVcsUUFBUSxDQUFuQixDQUFSO0FBQ0QsT0FMRCxNQUtPLElBQUksVUFBVSxDQUFWLElBQWUsS0FBSyxHQUFMLENBQVMsS0FBVCxJQUFrQixDQUFyQyxFQUF3Qzs7QUFFN0MsZUFBTyxVQUFQO0FBQ0QsT0FITSxNQUdBLElBQUksWUFBWSxHQUFoQixFQUFxQjs7QUFFMUIsZUFBTyxJQUFQO0FBQ0Esb0JBQVksS0FBWjs7OztBQUlBLGtCQUFVLGlCQUFPLFVBQVAsQ0FBa0IsU0FBUyxVQUFULEdBQXNCO0FBQ2hELGNBQU0sUUFBUSxPQUFkO0FBQ0EsZUFBSyxLQUFMLENBQVcsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxtQkFBdkIsRUFBNEMsS0FBSyxLQUFMLENBQVcsYUFBdkQ7QUFDQSxlQUFLLFFBQUwsQ0FBYyxFQUFDLGdCQUFnQixLQUFqQixFQUFkO0FBQ0QsU0FKMkIsQ0FJMUIsSUFKMEIsQ0FJckIsSUFKcUIsQ0FBbEIsRUFJSSxFQUpKLENBQVY7QUFLRCxPQVpNLE1BWUEsSUFBSSxDQUFDLEtBQUssS0FBVixFQUFpQjs7Ozs7QUFLdEIsZUFBTyxLQUFLLEdBQUwsQ0FBUyxZQUFZLEtBQXJCLElBQThCLEdBQTlCLEdBQW9DLFVBQXBDLEdBQWlELE9BQXhEOzs7O0FBSUEsWUFBSSxPQUFKLEVBQWE7QUFDWCwyQkFBTyxZQUFQLENBQW9CLE9BQXBCO0FBQ0Esb0JBQVUsSUFBVjtBQUNBLG1CQUFTLFNBQVQ7QUFDRDtBQUNGOzs7QUFHRCxVQUFJLE1BQU0sUUFBTixJQUFrQixLQUF0QixFQUE2QjtBQUMzQixnQkFBUSxRQUFRLENBQWhCO0FBQ0Q7Ozs7QUFJRCxVQUFJLElBQUosRUFBVTtBQUNSLGFBQUssS0FBTCxDQUFXLENBQUMsS0FBWixFQUFtQixHQUFuQjtBQUNEOztBQUVELFdBQUssUUFBTCxDQUFjO0FBQ1osd0JBQWdCLElBREo7QUFFWix1QkFBZSxHQUZIO0FBR1osd0JBQWdCLElBSEo7QUFJWiwyQkFBbUIsT0FKUDtBQUtaLDZCQUFxQjtBQUxULE9BQWQ7QUFPRDs7Ozs7MEJBR0ssSyxFQUFPLEcsRUFBSzs7O0FBR2hCLFVBQUksUUFBUSxLQUFLLElBQUksS0FBSyxHQUFMLENBQVMsQ0FBQyxLQUFLLEdBQUwsQ0FBUyxRQUFRLEdBQWpCLENBQVYsQ0FBVCxDQUFaO0FBQ0EsVUFBSSxRQUFRLENBQVIsSUFBYSxVQUFVLENBQTNCLEVBQThCO0FBQzVCLGdCQUFRLElBQUksS0FBWjtBQUNEO0FBQ0QsV0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixFQUFDLFFBQUQsRUFBTSxZQUFOLEVBQWxCO0FBQ0EsdUJBQU8sWUFBUCxDQUFvQixLQUFLLGVBQXpCO0FBQ0EsV0FBSyxlQUFMLEdBQXVCLGlCQUFPLFVBQVAsQ0FBa0IsU0FBUyxXQUFULEdBQXVCO0FBQzlELGFBQUssS0FBTCxDQUFXLFNBQVg7QUFDRCxPQUZ3QyxDQUV2QyxJQUZ1QyxDQUVsQyxJQUZrQyxDQUFsQixFQUVULEdBRlMsQ0FBdkI7QUFHRDs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO1FBQUE7QUFDRSxlQUFJLFdBRE47QUFFRSx1QkFBYyxLQUFLLFlBRnJCO0FBR0UsdUJBQWMsS0FBSyxZQUhyQjtBQUlFLHlCQUFnQixLQUFLLFlBSnZCO0FBS0UsbUJBQVUsS0FBSyxRQUxqQjtBQU1FLGlCQUFRO0FBQ04sbUJBQU8sS0FBSyxLQUFMLENBQVcsS0FEWjtBQUVOLG9CQUFRLEtBQUssS0FBTCxDQUFXLE1BRmI7QUFHTixzQkFBVTtBQUhKLFdBTlY7UUFZSSxLQUFLLEtBQUwsQ0FBVztBQVpmLE9BREY7QUFpQkQ7Ozs7O2tCQTFLa0IsZTs7O0FBNktyQixnQkFBZ0IsU0FBaEIsR0FBNEIsVUFBNUI7QUFDQSxnQkFBZ0IsWUFBaEIsR0FBK0IsYUFBL0IiLCJmaWxlIjoibWFwLWludGVyYWN0aW9ucy5yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJztcbmltcG9ydCB7UG9pbnR9IGZyb20gJ21hcGJveC1nbCc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgbm9vcCBmcm9tICcuL25vb3AnO1xuXG5jb25zdCB1YSA9IHR5cGVvZiB3aW5kb3cubmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyA/XG4gIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkgOiAnJztcbmNvbnN0IGZpcmVmb3ggPSB1YS5pbmRleE9mKCdmaXJlZm94JykgIT09IC0xO1xuXG5mdW5jdGlvbiBtb3VzZVBvcyhlbCwgZXZlbnQpIHtcbiAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBldmVudCA9IGV2ZW50LnRvdWNoZXMgPyBldmVudC50b3VjaGVzWzBdIDogZXZlbnQ7XG4gIHJldHVybiBuZXcgUG9pbnQoXG4gICAgZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdCAtIGVsLmNsaWVudExlZnQsXG4gICAgZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIC0gZWwuY2xpZW50VG9wXG4gICk7XG59XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbi8vIFBvcnRpb25zIG9mIHRoZSBjb2RlIGJlbG93IG9yaWdpbmFsbHkgZnJvbTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXBib3gvbWFwYm94LWdsLWpzL2Jsb2IvbWFzdGVyL2pzL3VpL2hhbmRsZXIvc2Nyb2xsX3pvb20uanNcbi8qIGVzbGludC1lbmFibGUgbWF4LWxlbiAqL1xuXG5jb25zdCBQUk9QX1RZUEVTID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgb25Nb3VzZURvd246IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlRHJhZzogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uTW91c2VSb3RhdGU6IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlVXA6IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlTW92ZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uWm9vbTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uWm9vbUVuZDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIG9uTW91c2VEb3duOiBub29wLFxuICBvbk1vdXNlRHJhZzogbm9vcCxcbiAgb25Nb3VzZVJvdGF0ZTogbm9vcCxcbiAgb25Nb3VzZVVwOiBub29wLFxuICBvbk1vdXNlTW92ZTogbm9vcCxcbiAgb25ab29tOiBub29wLFxuICBvblpvb21FbmQ6IG5vb3Bcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcEludGVyYWN0aW9ucyBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHN0YXJ0UG9zOiBudWxsLFxuICAgICAgcG9zOiBudWxsLFxuICAgICAgbW91c2VXaGVlbFBvczogbnVsbFxuICAgIH07XG4gIH1cblxuICBfZ2V0TW91c2VQb3MoZXZlbnQpIHtcbiAgICBjb25zdCBlbCA9IHRoaXMucmVmcy5jb250YWluZXI7XG4gICAgcmV0dXJuIG1vdXNlUG9zKGVsLCBldmVudCk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uTW91c2VEb3duKGV2ZW50KSB7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc3RhcnRQb3M6IHBvcyxcbiAgICAgIHBvcyxcbiAgICAgIG1ldGFLZXk6IEJvb2xlYW4oZXZlbnQubWV0YUtleSlcbiAgICB9KTtcbiAgICB0aGlzLnByb3BzLm9uTW91c2VEb3duKHtwb3N9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9vbk1vdXNlRHJhZywgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbk1vdXNlVXAsIGZhbHNlKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Nb3VzZURyYWcoZXZlbnQpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7cG9zfSk7XG4gICAgaWYgKHRoaXMuc3RhdGUubWV0YUtleSkge1xuICAgICAgY29uc3Qge3N0YXJ0UG9zfSA9IHRoaXMuc3RhdGU7XG4gICAgICB0aGlzLnByb3BzLm9uTW91c2VSb3RhdGUoe3Bvcywgc3RhcnRQb3N9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5vbk1vdXNlRHJhZyh7cG9zfSk7XG4gICAgfVxuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vbk1vdXNlVXAoZXZlbnQpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9vbk1vdXNlRHJhZywgZmFsc2UpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbk1vdXNlVXAsIGZhbHNlKTtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7cG9zfSk7XG4gICAgdGhpcy5wcm9wcy5vbk1vdXNlVXAoe3Bvc30pO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vbk1vdXNlTW92ZShldmVudCkge1xuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldE1vdXNlUG9zKGV2ZW50KTtcbiAgICB0aGlzLnByb3BzLm9uTW91c2VNb3ZlKHtwb3N9KTtcbiAgfVxuXG4gIC8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHksIG1heC1zdGF0ZW1lbnRzICovXG4gIEBhdXRvYmluZFxuICBfb25XaGVlbChldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0IHZhbHVlID0gZXZlbnQuZGVsdGFZO1xuICAgIC8vIEZpcmVmb3ggZG91YmxlcyB0aGUgdmFsdWVzIG9uIHJldGluYSBzY3JlZW5zLi4uXG4gICAgaWYgKGZpcmVmb3ggJiYgZXZlbnQuZGVsdGFNb2RlID09PSB3aW5kb3cuV2hlZWxFdmVudC5ET01fREVMVEFfUElYRUwpIHtcbiAgICAgIHZhbHVlIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIH1cbiAgICBpZiAoZXZlbnQuZGVsdGFNb2RlID09PSB3aW5kb3cuV2hlZWxFdmVudC5ET01fREVMVEFfTElORSkge1xuICAgICAgdmFsdWUgKj0gNDA7XG4gICAgfVxuXG4gICAgbGV0IHR5cGUgPSB0aGlzLnN0YXRlLm1vdXNlV2hlZWxUeXBlO1xuICAgIGxldCB0aW1lb3V0ID0gdGhpcy5zdGF0ZS5tb3VzZVdoZWVsVGltZW91dDtcbiAgICBsZXQgbGFzdFZhbHVlID0gdGhpcy5zdGF0ZS5tb3VzZVdoZWVsTGFzdFZhbHVlO1xuICAgIGxldCB0aW1lID0gdGhpcy5zdGF0ZS5tb3VzZVdoZWVsVGltZTtcblxuICAgIGNvbnN0IG5vdyA9ICh3aW5kb3cucGVyZm9ybWFuY2UgfHwgRGF0ZSkubm93KCk7XG4gICAgY29uc3QgdGltZURlbHRhID0gbm93IC0gKHRpbWUgfHwgMCk7XG5cbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGltZSA9IG5vdztcblxuICAgIGlmICh2YWx1ZSAhPT0gMCAmJiB2YWx1ZSAlIDQuMDAwMjQ0MTQwNjI1ID09PSAwKSB7XG4gICAgICAvLyBUaGlzIG9uZSBpcyBkZWZpbml0ZWx5IGEgbW91c2Ugd2hlZWwgZXZlbnQuXG4gICAgICB0eXBlID0gJ3doZWVsJztcbiAgICAgIC8vIE5vcm1hbGl6ZSB0aGlzIHZhbHVlIHRvIG1hdGNoIHRyYWNrcGFkLlxuICAgICAgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlIC8gNCk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSAhPT0gMCAmJiBNYXRoLmFicyh2YWx1ZSkgPCA0KSB7XG4gICAgICAvLyBUaGlzIG9uZSBpcyBkZWZpbml0ZWx5IGEgdHJhY2twYWQgZXZlbnQgYmVjYXVzZSBpdCBpcyBzbyBzbWFsbC5cbiAgICAgIHR5cGUgPSAndHJhY2twYWQnO1xuICAgIH0gZWxzZSBpZiAodGltZURlbHRhID4gNDAwKSB7XG4gICAgICAvLyBUaGlzIGlzIGxpa2VseSBhIG5ldyBzY3JvbGwgYWN0aW9uLlxuICAgICAgdHlwZSA9IG51bGw7XG4gICAgICBsYXN0VmFsdWUgPSB2YWx1ZTtcblxuICAgICAgLy8gU3RhcnQgYSB0aW1lb3V0IGluIGNhc2UgdGhpcyB3YXMgYSBzaW5ndWxhciBldmVudCwgYW5kIGRlbGF5IGl0IGJ5IHVwXG4gICAgICAvLyB0byA0MG1zLlxuICAgICAgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uIHNldFRpbWVvdXQoKSB7XG4gICAgICAgIGNvbnN0IF90eXBlID0gJ3doZWVsJztcbiAgICAgICAgdGhpcy5fem9vbSgtdGhpcy5zdGF0ZS5tb3VzZVdoZWVsTGFzdFZhbHVlLCB0aGlzLnN0YXRlLm1vdXNlV2hlZWxQb3MpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHttb3VzZVdoZWVsVHlwZTogX3R5cGV9KTtcbiAgICAgIH0uYmluZCh0aGlzKSwgNDApO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3R5cGUpIHtcbiAgICAgIC8vIFRoaXMgaXMgYSByZXBlYXRpbmcgZXZlbnQsIGJ1dCB3ZSBkb24ndCBrbm93IHRoZSB0eXBlIG9mIGV2ZW50IGp1c3RcbiAgICAgIC8vIHlldC5cbiAgICAgIC8vIElmIHRoZSBkZWx0YSBwZXIgdGltZSBpcyBzbWFsbCwgd2UgYXNzdW1lIGl0J3MgYSBmYXN0IHRyYWNrcGFkO1xuICAgICAgLy8gb3RoZXJ3aXNlIHdlIHN3aXRjaCBpbnRvIHdoZWVsIG1vZGUuXG4gICAgICB0eXBlID0gTWF0aC5hYnModGltZURlbHRhICogdmFsdWUpIDwgMjAwID8gJ3RyYWNrcGFkJyA6ICd3aGVlbCc7XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSBvdXIgZGVsYXllZCBldmVudCBpc24ndCBmaXJlZCBhZ2FpbiwgYmVjYXVzZSB3ZSBhY2N1bXVsYXRlXG4gICAgICAvLyB0aGUgcHJldmlvdXMgZXZlbnQgKHdoaWNoIHdhcyBsZXNzIHRoYW4gNDBtcyBhZ28pIGludG8gdGhpcyBldmVudC5cbiAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICB2YWx1ZSArPSBsYXN0VmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2xvdyBkb3duIHpvb20gaWYgc2hpZnQga2V5IGlzIGhlbGQgZm9yIG1vcmUgcHJlY2lzZSB6b29taW5nXG4gICAgaWYgKGV2ZW50LnNoaWZ0S2V5ICYmIHZhbHVlKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlIC8gNDtcbiAgICB9XG5cbiAgICAvLyBPbmx5IGZpcmUgdGhlIGNhbGxiYWNrIGlmIHdlIGFjdHVhbGx5IGtub3cgd2hhdCB0eXBlIG9mIHNjcm9sbGluZyBkZXZpY2VcbiAgICAvLyB0aGUgdXNlciB1c2VzLlxuICAgIGlmICh0eXBlKSB7XG4gICAgICB0aGlzLl96b29tKC12YWx1ZSwgcG9zKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vdXNlV2hlZWxUaW1lOiB0aW1lLFxuICAgICAgbW91c2VXaGVlbFBvczogcG9zLFxuICAgICAgbW91c2VXaGVlbFR5cGU6IHR5cGUsXG4gICAgICBtb3VzZVdoZWVsVGltZW91dDogdGltZW91dCxcbiAgICAgIG1vdXNlV2hlZWxMYXN0VmFsdWU6IGxhc3RWYWx1ZVxuICAgIH0pO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSwgbWF4LXN0YXRlbWVudHMgKi9cblxuICBfem9vbShkZWx0YSwgcG9zKSB7XG5cbiAgICAvLyBTY2FsZSBieSBzaWdtb2lkIG9mIHNjcm9sbCB3aGVlbCBkZWx0YS5cbiAgICBsZXQgc2NhbGUgPSAyIC8gKDEgKyBNYXRoLmV4cCgtTWF0aC5hYnMoZGVsdGEgLyAxMDApKSk7XG4gICAgaWYgKGRlbHRhIDwgMCAmJiBzY2FsZSAhPT0gMCkge1xuICAgICAgc2NhbGUgPSAxIC8gc2NhbGU7XG4gICAgfVxuICAgIHRoaXMucHJvcHMub25ab29tKHtwb3MsIHNjYWxlfSk7XG4gICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLl96b29tRW5kVGltZW91dCk7XG4gICAgdGhpcy5fem9vbUVuZFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiBfc2V0VGltZW91dCgpIHtcbiAgICAgIHRoaXMucHJvcHMub25ab29tRW5kKCk7XG4gICAgfS5iaW5kKHRoaXMpLCAyMDApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj1cImNvbnRhaW5lclwiXG4gICAgICAgIG9uTW91c2VNb3ZlPXsgdGhpcy5fb25Nb3VzZU1vdmUgfVxuICAgICAgICBvbk1vdXNlRG93bj17IHRoaXMuX29uTW91c2VEb3duIH1cbiAgICAgICAgb25Db250ZXh0TWVudT17IHRoaXMuX29uTW91c2VEb3duIH1cbiAgICAgICAgb25XaGVlbD17IHRoaXMuX29uV2hlZWwgfVxuICAgICAgICBzdHlsZT17IHtcbiAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgICAgIH0gfT5cblxuICAgICAgICB7IHRoaXMucHJvcHMuY2hpbGRyZW4gfVxuXG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbk1hcEludGVyYWN0aW9ucy5wcm9wVHlwZXMgPSBQUk9QX1RZUEVTO1xuTWFwSW50ZXJhY3Rpb25zLmRlZmF1bHRQcm9wcyA9IERFRkFVTFRfUFJPUFM7XG4iXX0=