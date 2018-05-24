import axios from 'axios';

import { ADD_POST, GET_ERRORS, GET_POSTS, POST_LOADING } from './types';

//add post
export const addPost = post => dispatch => {
  axios
    .post('/api/posts', post)
    .then(res => dispatch({ type: ADD_POST, payload: res.data }))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};
//Get post
export const getPosts = () => dispatch => {
  dispatch(setPostLoading);
  axios
    .get('/api/posts')
    .then(res => dispatch({ type: GET_POSTS, payload: res.data }))
    .catch(err => dispatch({ type: GET_POSTS, payload: null }));
};

//Post loading
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};
