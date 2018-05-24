import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextAreaFieldGroup from './../common/TextAreaFieldGroup';
import { addComment } from './../../actions/postAction';

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    const { user } = this.props.auth;
    const { postId } = this.props;
    const comment = {
      text: this.state.text,
      name: user.name,
      avatar: user.avatar
    };
    this.props.addComment(postId, comment);
    this.setState({ text: '' });
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">
            Make a comment...
          </div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <TextAreaFieldGroup
                placeholder="Reply to post"
                name="text"
                error={errors.text}
                value={this.state.text}
                onChange={this.onChange}
              />
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
CommentForm.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addComment: PropTypes.func.isRequired,
  postId: PropTypes.string
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps, { addComment })(CommentForm);
