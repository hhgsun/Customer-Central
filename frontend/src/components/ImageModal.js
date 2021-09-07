import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setImageModalSrc } from '../store/utilsSlice';

export default function ImageModal({ src }) {
  const dispatch = useDispatch();

  const closeModal = (e) => {
    dispatch(setImageModalSrc(null));
  }

  return src ?
    <div>
      <div className="modal d-block" style={{ backgroundColor: 'rgb(0 0 0 / 0.3)' }} id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="false"
        onClick={(e) => closeModal(e)}>
        <div className="modal-dialog modal-fullscreen-sm-down modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            {/* <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel"></h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => closeModal(e)}></button>
            </div> */}
            <div className="modal-body text-center">
              <img src={src} alt="show image view" />
            </div>
          </div>
        </div>
      </div>
    </div>
    :
    <></>

}
