import React from 'react';
import PropTypes from 'prop-types';
import JsonToHtml from './JsonToHtml';

class JsonTable extends React.Component {
  render() {
    const htmlTable = JsonToHtml.getTable(this.props.json, this.props.transformer, this.props.arrayRenderStyle);
    return <div dangerouslySetInnerHTML={{ __html: htmlTable }} />;
  }
}

JsonTable.propTypes = {
  json: PropTypes.any,
  transformer: PropTypes.func,
  arrayRenderStyle: PropTypes.string
};

export default JsonTable;
