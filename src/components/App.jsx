import { useState, useEffect } from 'react';
import css from './App.module.css';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import Notification from 'components/Notification/Notification';
import imageApi from '../services/images-api';

const App = () => {
  const [imageName, setImageName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [largeImage, setLargeImage] = useState('');
  const [isLoadMoreShow, setIsLoadMoreShow] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!imageName) {
      return;
    }
    toggleLoading();

    imageApi
      .fetchImageByQuery(imageName, page)
      .then(data => {
        if (data.total === 0) {
          return Promise.reject(
            new Error(`Sorry, we have no images with name ${imageName}.`)
          );
        }
        setImages(state => [...state, ...data.hits]);
        setIsLoadMoreShow(page < Math.ceil(data.total / imageApi.PER_PAGE));
      })
      .catch(error => handleError(error.message))
      .finally(() => {
        toggleLoading();
      });
  }, [imageName, page]);

  const handleFormSubmit = imageName => {
    setImageName(imageName);
    setPage(1);
    setError('');
    setImages([]);
    setIsLoadMoreShow(false);
  };

  const toggleLoading = () => {
    setLoading(state => !state);
  };

  const handleShowModal = event => {
    const largeImage = {
      largeImageURL: event.target.dataset.src,
      tags: event.target.alt,
    };
    setLargeImage(largeImage);
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
  };

  const handleIncrementPage = () => {
    setPage(state => state + 1);
  };

  const handleError = error => {
    setError(error);
    setIsLoadMoreShow(false);
  };

  const { largeImageURL, tags } = largeImage;
  return (
    <div className={css.App}>
      <Searchbar onSubmit={handleFormSubmit} />
      {loading && <Loader />}
      <ImageGallery images={images} showModal={handleShowModal} />
      {isShowModal && (
        <Modal
          largeImageURL={largeImageURL}
          tags={tags}
          onClose={handleCloseModal}
        />
      )}
      {isLoadMoreShow && (
        <Button text="Load More" onClick={handleIncrementPage} />
      )}
      {error && <Notification message={error} type="failure" />}
    </div>
  );
};

export default App;
