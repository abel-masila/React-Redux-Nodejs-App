import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteExperience } from './../../actions/profileAction';

import Moment from 'react-moment';

class Experience extends Component {
  onDeleteClick(id) {
    this.props.deleteExperience(id);
  }
  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="YYYY-MM-DD">{exp.from}</Moment> -{' '}
          {exp.to === null ? (
            ' Now'
          ) : (
            <Moment format="YYYY-MM-DD">{exp.to}</Moment>
          )}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={this.onDeleteClick.bind(this, exp._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        {experience.length > 0 ? <h4 className="mb-4">Experience</h4> : ''}
        {experience.length > 0 ? (
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Company</th>
                <th>Title</th>
                <th>Years</th>
                <th />
              </tr>
            </thead>
            <tbody>{experience}</tbody>
          </table>
        ) : null}
      </div>
    );
  }
}
Experience.propTypes = {
  deleteExperience: PropTypes.func.isRequired
};

export default connect(null, { deleteExperience })(Experience);
