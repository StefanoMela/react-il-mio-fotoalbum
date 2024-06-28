import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_API_URL;
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByb3ZhQHByb3ZhLmNvbSIsIm5hbWUiOiJCb2JieSIsImlkIjoyLCJpYXQiOjE3MTk1ODIzODQsImV4cCI6MTcxOTYxMTE4NH0.s0ZHERdhiojUbpw5iXeCTgYFoOrX3uT5wawP0-Aptp8';
import "/src/App.css";

export default function PostList() {

  const defaultFormData = {
    title: "",
    description: "",
    image: "",
    categories: [],
    published: false,
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [posts, setPosts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/categories`);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/posts`); // Modificata la richiesta API
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);


  const handleField = (name, value) => {
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIndex !== null) {
        await updatePost(editingIndex, formData);
      } else {
        console.log(formData);
        await axios.post(`${apiUrl}/posts/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        });
      }
      setFormData(defaultFormData);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const removePost = async (id) => {
    try {
      await axios.delete(`${apiUrl}/posts/${id}`);
      setPosts((postsArray) => {
        return postsArray.filter((post) => post.id !== id);
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const updatePost = async (updatedPost) => {
    try {
      const response = await axios.put(
        `${apiUrl}/posts/${updatedPost.id}`,
        updatedPost
      );
      const updatedPostFromServer = response.data; // Assumendo che il backend restituisca il post aggiornato
      setPosts(
        posts.map((post) =>
          post.id === updatedPostFromServer.id ? updatedPostFromServer : post
        )
      );
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
  };

  const handleUpdate = async (index) => {
    const updatedPost = posts[index];
    await updatePost(updatedPost);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        return nextPage;
      });
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => {
        const prevPageNumber = prevPage - 1;
        return prevPageNumber;
      });
    }
  };


  return (
    <>
      <section className="form-section">
        <form onSubmit={handleSubmit}>
          <div className="form-element">
            <label htmlFor="title" className="title">
              Titolo Post
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleField("title", e.target.value)}
              required
            />
          </div>
          <div className="form-element description">
            <label htmlFor="description">Descrizione</label>
            <textarea
              name="description"
              id="description"
              cols="30"
              rows="10"
              value={formData.description}
              onChange={(e) => handleField("description", e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-element image">
            <label htmlFor="image">Immagine</label>
            <input
              type="text"
              name="image"
              id="image"
              value={formData.image}
              onChange={(e) => handleField("image", e.target.value)}
            />
          </div>
          <div className="form-element categories">
            <label htmlFor="categories">Categories</label>
            {categories?.length &&
              categories?.map((category, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={`category-${index}`}
                    name="categories"
                    value={category.id}
                    checked={formData.categories.includes(category.id)}
                    onChange={(e) => {
                      const newCategories = formData.categories.includes(
                        category.id
                      )
                        ? formData.categories.filter((t) => t !== category.id)
                        : [...formData.categories, category.id];
                      handleField("categories", newCategories);
                    }}
                  />
                  <label htmlFor={`tag-${index}`}>{category.name}</label>
                </div>
              ))}
          </div>
          <button type="submit">
            {editingIndex !== null ? "Update" : "Submit"}
          </button>
        </form>
        <div className="title-container">
          <button onClick={fetchPosts}>Fetch Post</button>
          {posts.length > 0 && (
            <>
              <h2>I Post sono:</h2>
              <section className="list">
                {posts.map((post, index) => (
                  <article key={`post${index}`} className="title-item">
                    <span>Titolo:</span>
                    <h2>
                      <Link to={`/posts/${post.id}/`}>{post.title}</Link>
                    </h2>
                    <span>Contenuto:</span>
                    <p>{post.description}</p>
                    <span>Categorie:</span>
                    {post.categories &&
                      post.categories.map((category, index) => (
                        <p key={index}>{category.name}</p>
                      ))}
                    <span>Immagine:</span>
                    <img src={post.image} alt={post.title} />
                    <br />
                    <div className="author">Autore: {post.user.name}</div>
                    <button
                      onClick={() => startEditing(post.id)}
                      className="edit-button"
                    >
                      Edita
                    </button>
                    <button
                      onClick={() => removePost(post.id)}
                      className="delete-button"
                    >
                      Cancella
                    </button>
                  </article>
                ))}
              </section>
            </>
          )}
        </div>
      </section>
      <div className="pagination">
                <button
                  type="button"
                  onClick={previousPage}
                  disabled={currentPage <= 1}
                >
                  Precedente
                </button>
                <span>
                  Pagina {currentPage} di {totalPages}
                </span>
                <button
                  type="button"
                  onClick={nextPage}
                  disabled={currentPage >= totalPages}
                >
                  Prossima
                </button>
              </div>
    </>
  );
}
