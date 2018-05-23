import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from './../common/TextFieldGroup';
import TextAreaFieldGroup from './../common/TextAreaFieldGroup';

import { addExperience } from './../../actions/profileAction';

class AddExperience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: '',
      title: '',
      location: '',
      from: '',
      to: '',
      current: false,
      description: '',
      disabled: false,
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    const experience = {
      company: this.state.company,
      title: this.state.title,
      from: this.state.from,
      to: this.state.to,
      location: this.state.location,
      current: this.state.current,
      description: this.state.description
    };
    this.props.addExperience(experience, this.props.history);
  }
  onCheck(e) {
    this.setState({
      disabled: !this.state.disabled,
      current: !this.state.current
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  render() {
    const { errors } = this.state;
    return (
      <div className="add-experience" style={{ marginBottom: '70px' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back{' '}
              </Link>
              <h1 className="display-4 text-center">Add Experience</h1>
              <p className="lead text-center">
                Add any job or position that you have had in the past or current
              </p>
              <small className="d-block pb-3">*=Required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                />
                <TextFieldGroup
                  placeholder="* Job Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                />
                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                />
                <h6>From Date</h6>
                <TextFieldGroup
                  type="date"
                  name="from"
                  value={this.state.from}
                  onChange={this.onChange}
                  error={errors.from}
                />
                <h6>To Date</h6>
                <TextFieldGroup
                  type="date"
                  name="to"
                  value={this.state.to}
                  disabled={this.state.disabled ? 'disabled' : ''}
                  onChange={this.onChange}
                  error={errors.to}
                />
                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    value={this.state.current}
                    className="form-check-input"
                    name="current"
                    id="current"
                    checked={this.state.current}
                    onChange={this.onCheck}
                  />
                  <label htmlFor="current" className="form-check-label">
                    Current Job
                  </label>
                </div>
                <TextAreaFieldGroup
                  placeholder="Job description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  info="Tell us a little about the position"
                />
                <input
                  type="submit"
                  className="btn btn-info btn-lg btn-block mt-4"
                  value="Submit"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
AddExperience.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addExperience: PropTypes.func.isRequired
};
const mapPropsToState = state => ({
  errors: state.errors,
  profile: state.profile
});
export default connect(mapPropsToState, { addExperience })(
  withRouter(AddExperience)
);
