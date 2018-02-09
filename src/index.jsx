import IntersectionObserver from 'intersection-observer-polyfill';
import React from 'react';
import PropTypes from 'prop-types';

export default class IntersectionList extends React.Component {
    constructor(props) {
        super(props);

        this.handleIntersectionObserve = this.handleIntersectionObserve.bind(this);
        this.handleDoObserve = this.handleDoObserve.bind(this);
        this.observer = new IntersectionObserver(this.handleIntersectionObserve, {
            threshold: 0.01
        });

        this.state = {
            observedUntil: -1
        };
    }

    componentWillUnmount() {
        this.observer.disconnect();
    }

    componentWillReceiveProps(nextProps) {
        const { observedUntil } = this.state;
        const { maxRenderCount } = nextProps;
        if(maxRenderCount < observedUntil) {
            this.setState({
                observedUntil: maxRenderCount
            });
        }
    }

    handleIntersectionObserve(entries, observer) {
        const { overRender } = this.props;
        let { observedUntil } = this.state;
        let nextObservedUntil = observedUntil;
        entries.forEach(e => {
            const index = e.target.index;
            if(observedUntil >= index + overRender) {
                this.observer.unobserve(e.target);
            }
            if((e.isIntersecting || e.intersectionRatio > 0.01) && index > observedUntil) {
                nextObservedUntil = index;
            }
        });

        if(nextObservedUntil !== observedUntil) {
            window.requestAnimationFrame(() => {
                this.setState({
                    observedUntil: nextObservedUntil
                });
            });
        }
    }

    handleDoObserve(fillChild, index) {
        if(fillChild) {
            fillChild.index = index;
            this.observer.observe(fillChild);
        }
    }

    render() {
        const {
            overRender,
            rowHeight,
            maxRenderCount,
            fillerTagName,
            fillerClassName,
            children
        } = this.props;
        const { observedUntil } = this.state;

        /* slice out the children to render */
        const renderChildren = children.slice(0, observedUntil + overRender).slice(0, maxRenderCount);

        /* create filler rows */
        const FillTag = fillerTagName;
        const fillChildren = [...Array(Math.max(0, maxRenderCount - observedUntil - overRender))].map((val, index) => (
            <FillTag
                ref={fillChild => this.handleDoObserve(fillChild, index + renderChildren.length)}
                key={index + renderChildren.length}
                className={fillerClassName}
                style={{
                    height: rowHeight
                }}
            />
        ));

        return renderChildren.concat(fillChildren);
    }
}

IntersectionList.propTypes = {
    /* @var The height of each row, necessary for height prefill */
    rowHeight: PropTypes.number.isRequired,
    /* @var Number of rows to overrender */
    overRender: PropTypes.number,
    /* @var The maximum amount of children to render */
    maxRenderCount: PropTypes.number,
    /* @var The tagName to use for the filer list item */
    fillerTagName: PropTypes.string,
    /* @var The className to give to the filler list items (to prefill the scroll before rendering the actual component) */
    fillerClassName: PropTypes.string
};

IntersectionList.defaultProps = {
    overRender: 0,
    maxRenderCount: 5,
    fillerTagName: 'div'
};