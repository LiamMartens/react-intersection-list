'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('intersection-observer');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntersectionList = function (_React$Component) {
    _inherits(IntersectionList, _React$Component);

    function IntersectionList(props) {
        _classCallCheck(this, IntersectionList);

        var _this = _possibleConstructorReturn(this, (IntersectionList.__proto__ || Object.getPrototypeOf(IntersectionList)).call(this, props));

        _this.handleIntersectionObserve = _this.handleIntersectionObserve.bind(_this);
        _this.handleDoObserve = _this.handleDoObserve.bind(_this);
        _this.observer = new IntersectionObserver(_this.handleIntersectionObserve, {
            threshold: 0
        });

        _this.state = {
            observedUntil: -1
        };
        return _this;
    }

    _createClass(IntersectionList, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.observer.disconnect();
        }
    }, {
        key: 'handleIntersectionObserve',
        value: function handleIntersectionObserve(entries, observer) {
            var _this2 = this;

            var observedUntil = this.state.observedUntil;

            var nextObservedUntil = observedUntil;
            entries.forEach(function (e) {
                var index = e.target.index;
                if (observedUntil >= index) {
                    _this2.observer.unobserve(e.target);
                }
                if (e.isIntersecting && index > observedUntil) {
                    nextObservedUntil = index;
                }
            });

            if (nextObservedUntil !== observedUntil) {
                window.requestAnimationFrame(function () {
                    _this2.setState({
                        observedUntil: nextObservedUntil
                    });
                });
            }
        }
    }, {
        key: 'handleDoObserve',
        value: function handleDoObserve(fillChild, index) {
            if (fillChild) {
                fillChild.index = index;
                this.observer.observe(fillChild);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props = this.props,
                rowHeight = _props.rowHeight,
                maxRenderCount = _props.maxRenderCount,
                fillerTagName = _props.fillerTagName,
                fillerClassName = _props.fillerClassName,
                children = _props.children;
            var observedUntil = this.state.observedUntil;

            /* slice out the children to render */

            var renderChildren = children.slice(0, maxRenderCount).slice(0, observedUntil);

            /* create filler rows */
            var FillTag = fillerTagName;
            var fillChildren = [].concat(_toConsumableArray(Array(maxRenderCount - observedUntil - 1))).map(function (val, index) {
                return _react2.default.createElement(FillTag, {
                    ref: function ref(fillChild) {
                        return _this3.handleDoObserve(fillChild, index + renderChildren.length);
                    },
                    key: index + renderChildren.length,
                    className: fillerClassName,
                    style: {
                        height: rowHeight
                    }
                });
            });

            return renderChildren.concat(fillChildren);
        }
    }]);

    return IntersectionList;
}(_react2.default.Component);

exports.default = IntersectionList;


IntersectionList.propTypes = {
    /* @var The height of each row, necessary for height prefill */
    rowHeight: _propTypes2.default.number.isRequired,
    /* @var The maximum amount of children to render */
    maxRenderCount: _propTypes2.default.number,
    /* @var The tagName to use for the filer list item */
    fillerTagName: _propTypes2.default.string,
    /* @var The className to give to the filler list items (to prefill the scroll before rendering the actual component) */
    fillerClassName: _propTypes2.default.string
};

IntersectionList.defaultProps = {
    maxRenderCount: 5,
    fillerTagName: 'div'
};