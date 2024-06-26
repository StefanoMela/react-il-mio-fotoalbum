// src/Post.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BASE_API_URL;

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/posts/${postId}`);
        setPost(data.post);
        setLoading(false);
      } catch (error) {
        setError('Error fetching post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {post.image && <img src={post.image} alt={post.title} />}
      <div>
        {post.categories && post.categories.map(category => (
          <span key={category.id}>{category.name} </span>
        ))}
      </div>
    </div>
  );
}

export default Post;
