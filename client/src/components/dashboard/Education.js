import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteEducation } from './../../actions/profileAction';

import Moment from 'react-moment';

class Education extends Component {
  onDeleteClick(id) {
    this.props.deleteEducation(id);
  }
  render() {
    const education = this.props.education.map(edu => (
      <tr key={edu._id}>
        <td>{edu.school}</td>
        <td>{edu.degree}</td>
        <td>{edu.fieldOfStudy}</td>
        <td>
          <Moment format="YYYY-MM-DD">{edu.from}</Moment> -{' '}
          {edu.to === null ? (
            ' Now'
          ) : (
            <Moment format="YYYY-MM-DD">{edu.to}</Moment>
          )}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={this.onDeleteClick.bind(this, edu._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        {education.length > 0 ? <h4 className="mb-4">Education</h4> : ''}
        {education.length > 0 ? (
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th>School</th>
                <th>Degree</th>
                <th>Field Of Study</th>
                <th>Years</th>
                <th />
              </tr>
            </thead>
            <tbody>{education}</tbody>
          </table>
        ) : null}
      </div>
    );
  }
}
Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired
};

export default connect(null, { deleteEducation })(Education);
