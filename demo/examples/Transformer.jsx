import React from 'react';
import { Link } from 'react-router';
import JsonTable from '../../src/JsonTable';
import { dateFormat, formatShortDate } from './dateUtil';

var transformer = function(key, val) {
  // convert string dates to real dates.
  if (typeof val === 'string' && dateFormat.test(val)) {
    val = new Date(val);
    if (val instanceof Date) {
      return formatShortDate(val);
    }
  }

  if (key == 'Description') {
    return `<span style='color:red'>${val}</span>`;
  }
  // fall through return original value
  return val;
};

class Transformer extends React.Component {
  render() {

    const json = {
      'Message id': '75c31247-91fb-440a-b6be-bd5294f62cfa',
      'Active Details': [
        {
          'Date': '2018-04-03T18:25:43.511Z',
          'Entity type': 'Organisation',
          'Name': '3432432434',
          'First name': 'Johnny',
          'Last name': 'Droptables',
          'Email': 'user@foobar.com',
          Description: 'Some details',
          'Physical address': {
            'Street line 1': '1 Apple way',
            'Street line 2': '',
            'Suburb': 'Bellevue',
            'State': 'NSW',
            'Postcode': '4414',
            'Address type': 'Physical'
          },
          'Postal address': {
            'Street line 1': '1 Apple way',
            'Street line 2': '',
            'Suburb': 'Bellevue',
            'State': 'NSW',
            'Postcode': '4414',
            'Address type': 'Postal'
          },
          'Message id': '1232313123213'
        },
       {
          'Date of event': '2018-04-03T18:25:43.511Z',
          'Entity type': 'Organisation',
          'Name': '3432432434',
          'First name': 'Johnny',
          'Last name': 'Droptables',
          'Email': 'user@foobar.com',
          'Details': 'Some details',
          'Physical address': {
            'Street line 1': '1 Apple way',
            'Street line 2': '',
            'Suburb': 'Bellevue',
            'State': 'NSW',
            'Postcode': '4414',
            'Address type': 'Physical'
          },
          'Postal address': {
            'Street line 1': '1 Apple way',
            'Street line 2': '',
            'Suburb': 'Bellevue',
            'State': 'NSW',
            'Postcode': '4414',
            'Address type': 'Postal'
          },
          'Message id': '1232313123213'
        }
      ]
    };

    return (
      <div>
        <blockquote>
          <h3>Using a transformer</h3>
          <p>
            Html Table that passes in a transformer to transform the render
            output, in this example the transformer will do the following:
            <ul>
              <li>parsed date will be formatted differently</li>
              <li>Key named Description values will be colored red </li>
            </ul>
            <Link to='/'>Back</Link>
          </p>
          <br />
          <JsonTable json={json} transformer={transformer} arrayRenderStyle="vertical" />
          <br />
          <pre>
            <code>
              import React from &#39;react&#39;;<br />
              import JsonTable from &#39;react-json-to-html&#39;;<br />
              <br />
              class Simple extends React.Component &#123;<br />
              &nbsp;&nbsp;const json = &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&quot;Server Name&quot;: &quot;foo&quot;,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&quot;Description&quot;: &quot;bar&quot;,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&quot;Date&quot;:
              &quot;2018-04-03T18:25:43.511Z&quot;<br />
              &nbsp;&nbsp;&#125;<br />
              &nbsp;&nbsp;render() &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;return (<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;JsonTable
              json=&#123;json&#125; transformer=&#123;transformer&#125; /&gt;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;)<br />
              &nbsp;&nbsp;&#125;<br />
              &#125;<br />
            </code>
          </pre>

          <Link to='/'>Back</Link>
        </blockquote>
      </div>
    );
  }
}

export default Transformer;
