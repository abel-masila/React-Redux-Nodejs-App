import React, { Component } from 'react';
import { getPost } from './../../actions/postAction';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PostItem from './../posts/PostItem';
import Spinner from './../common/Spinner';
import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';
class Post extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getPost(this.props.match.params.id);
    }
  }
  render() {
    const { post, loading } = this.props.post;
    let postContent;
    let feedItems;
    if (post === null || loading || Object.keys(post).length === 0) {
      postContent = <Spinner />;
    } else {
      postContent = (
        <div>
          <PostItem post={post} showActions={false} />
        </div>
      );
      feedItems = <CommentFeed postId={post._id} comments={post.comments} />;
    }
    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/feed" className="btn btn-light mb-3">
                Back to feed
              </Link>
              {postContent}
              <CommentForm postId={post._id} />
              {feedItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  post: state.post
});
export default connect(mapStateToProps, { getPost })(Post);
